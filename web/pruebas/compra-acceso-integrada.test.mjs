/**
 * Integración LOCAL: node --import ./pruebas/alias.mjs --test pruebas/compra-acceso-integrada.test.mjs
 * Reales: migraciones completas seleccionadas, pgcrypto, ingesta vigente con catálogo/orden,
 * reparación, triggers link_auth_user/email_subscription, email_operar, mi_acceso,
 * procesarCorreos, cifrado AES-GCM y enviarResend. No reemplazar sus resultados por mocks.
 * Dobles explícitos: esquema mínimo de Auth, auth.uid()/jwt() y generación/confirmación
 * de enlaces (NO se ejecutan GoTrue, servidor.ts, callback HTTP, JWT ni SMTP reales).
 * Resend es un transporte en memoria con respuesta perdida e idempotencia simulada:
 * prueba el contrato que enviamos, NO la garantía del proveedor ni entrega en un buzón.
 * PGlite es una sola conexión: aplica la reparación real, pero NO certifica deadlocks,
 * concurrencia multiinstancia ni SKIP LOCKED entre sesiones de Postgres independientes.
 * Se adelanta solo due_at de un reintento y de precobro; no se prueba cron.
 * Trial con monto 0 y sus fechas son fixtures del contrato SQL local: NO acreditan
 * el payload de trial, la fecha ni el importe del próximo cobro real de Hotmart.
 * Sin .env, secretos, cuentas, compra/cobro real, red ni migraciones remotas.
 */
import { test, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { procesarCorreos } from '../lib/correos/trabajador.ts';
import { enviarResend, REMITENTE_SERVICIO } from '../lib/correos/envio.ts';
import { descifrar } from '../lib/correos/seguridad.ts';

const INGESTA = 'solo-fixture-local-sin-valor-real-0000000000';
const CIFRADO = 'ab'.repeat(32);
const BAJA = 'solo-fixture-local-baja-sin-valor-real-0000';
const EMAIL = 'compradora@example.test';
const SITIO = 'https://app.example.test';
const CONFIG = { habilitado: true, dominioVerificado: true, marketing: false,
  marketingVerificado: false, txKey: 're_fixture_local_sin_valor_real', mktKey: '', sitio: SITIO };
const sql = nombre => readFileSync(new URL(`../../supabase/migrations/${nombre}`, import.meta.url), 'utf8');
const hash = valor => createHash('sha256').update(valor).digest('hex');

// Fallar ante cualquier caída accidental al fetch por defecto; nunca abrir red.
let redAccidental;
before(() => { redAccidental = mock.method(globalThis, 'fetch', async () => { throw new Error('RED_PROHIBIDA'); }); });
after(() => { assert.equal(redAccidental.mock.callCount(), 0); redAccidental.mock.restore(); });

async function base(t) {
  const db = new PGlite({ extensions: { pgcrypto } });
  t.after(() => db.close());
  // Doble del entorno Supabase, no de las funciones de negocio.
  await db.exec(`create role anon; create role authenticated;
    create schema auth; create schema extensions;
    create extension pgcrypto with schema extensions;
    create table auth.users(id uuid primary key, email text not null, email_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql stable as
      $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create function auth.jwt() returns jsonb language sql stable as $$select '{"aal":"aal1"}'::jsonb$$;
    grant usage on schema auth to anon,authenticated;
  `);
  for (const nombre of [
    '20261020190000_base_backoffice.sql',
    '20261020191000_ingesta.sql',
    '20261021110000_acceso_clientas.sql',
    '20261025010000_hotmart_producto_y_orden.sql',
    '20261025130000_correos.sql',
    '20261026210000_hotmart_concurrencia.sql',
  ]) await db.exec(sql(nombre));
  await db.query('insert into private.app_secrets(name,value_sha256) values($1,$2)', ['ingest_key',hash(INGESTA)]);
  // Grant de lectura del entorno Supabase; las políticas RLS son las de la migración real.
  await db.exec('grant select on public.profiles to authenticated');
  return db;
}

function evento(id, tipo = 'PURCHASE_APPROVED', cambios = {}) {
  const { producto = 8796204, fecha = Date.now(), email = EMAIL, monto = 4.99 } = cambios;
  return { id, event: tipo, creation_date: fecha, data: { product: { id: producto },
    buyer: { email, name: 'Compradora de prueba' },
    purchase: { transaction: 'transaccion-local-1', price: { value: monto, currency_value: 'USD' } },
    subscription: { subscriber: { code: 'suscriptora-local-1' }, plan: { name: 'Mensual' } } } };
}
async function ingestar(db, e, clave = INGESTA) {
  return (await db.query('select public.ingest_hotmart($1,$2,$3,$4,$5) as r',
    [clave,e.id,e.event,hash(JSON.stringify(e)),e])).rows[0].r;
}
async function operar(db, accion, datos = {}) {
  return (await db.query('select public.email_operar($1,$2,$3) as r',[INGESTA,accion,datos])).rows[0].r;
}
async function fila(db, consulta, args = []) { return (await db.query(consulta,args)).rows[0]; }
async function cantidad(db, tabla, filtro = '') {
  return (await fila(db,`select count(*)::int as n from ${tabla} ${filtro}`)).n;
}
async function como(db, uid, tarea, rol = 'authenticated') {
  await db.query("select set_config('request.jwt.claim.sub',$1,false)",[uid ?? '']);
  await db.exec(rol === 'anon' ? 'set role anon' : 'set role authenticated');
  try { return await tarea(); }
  finally { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub','',false)"); }
}
async function acceso(db, uid) {
  return como(db,uid,async () => (await fila(db,'select public.mi_acceso() as r')).r);
}

// Doble Auth: acredita posesión SOLO dentro del fixture. El enlace es una respuesta
// controlada del proveedor; la vinculación con profiles sí la hace el trigger real.
function authDoble(db) {
  const emitidos = [];
  return { emitidos,
    generar: async email => {
      const token = { email, id: randomUUID(), codigo: '654321', hash: hash(`token-local:${email}`) };
      await db.query('insert into auth.users(id,email) values($1,$2)',[token.id,email]);
      emitidos.push(token);
      const callback = new URL('/auth/callback',SITIO);
      callback.searchParams.set('token_hash',token.hash); callback.searchParams.set('type','email');
      return { url: callback.href, codigo: token.codigo };
    },
    confirmar: async (email, codigo) => {
      const token = emitidos.find(v => v.email === email && v.codigo === codigo);
      assert.ok(token,'credencial del doble no coincide');
      await db.query('update auth.users set email_confirmed_at=now() where id=$1',[token.id]);
      return token.id;
    },
  };
}

function resendDoble({ perderPrimeraRespuesta = false } = {}) {
  const peticiones = [], aceptados = new Map();
  const transporte = async (url, op) => {
    assert.equal(url,'https://api.resend.com/emails');
    assert.equal(op.method,'POST');
    assert.equal(op.headers.Authorization,`Bearer ${CONFIG.txKey}`);
    assert.equal(op.headers['Content-Type'],'application/json');
    assert.ok(op.signal instanceof AbortSignal);
    const clave = op.headers['Idempotency-Key'];
    assert.match(clave,/^paso-a-paso\/[a-f0-9-]{36}$/);
    peticiones.push({ clave, cuerpo: op.body });
    if (aceptados.has(clave)) assert.equal(aceptados.get(clave).cuerpo,op.body);
    else aceptados.set(clave,{ id: `resend-local-${aceptados.size+1}`, cuerpo: op.body });
    if (perderPrimeraRespuesta && peticiones.length === 1) throw new Error('respuesta_perdida_doble');
    return Response.json({ id: aceptados.get(clave).id });
  };
  return { peticiones, aceptados, enviar: (s,c,k,config) => enviarResend(s,c,k,config,transporte) };
}
function trabajador(db, auth, resend, extras = {}) {
  return procesarCorreos({ config: CONFIG, operar: (a,d) => operar(db,a,d),
    acceso: auth.generar, enviar: resend.enviar, llaveCifrado: CIFRADO,
    secretoBaja: BAJA, precobroVerificado: false, ...extras });
}

test('compra → cola → worker/Resend reales → Auth confirmado → mi_acceso, con reintento sin duplicados',async t => {
  const db = await base(t), auth = authDoble(db), resend = resendDoble({ perderPrimeraRespuesta: true });
  const fecha = Date.now();
  const aprobada = evento('aprobada',undefined,{fecha});
  assert.equal((await ingestar(db,aprobada)).status,'applied');
  assert.equal((await ingestar(db,aprobada)).status,'duplicate');
  const completa = evento('completa','PURCHASE_COMPLETE',{fecha:fecha+1000});
  assert.equal((await ingestar(db,completa)).status,'applied');
  assert.equal((await ingestar(db,completa)).status,'duplicate');
  assert.equal(await cantidad(db,'public.profiles'),1);
  assert.equal(await cantidad(db,'public.payment_transactions'),1);
  assert.equal(await cantidad(db,'public.event_log',"where type='primer_cobro_confirmado'"),1);
  assert.equal(await cantidad(db,'public.subscription_history'),1);
  const pago = await fila(db,'select economic_kind,amount_minor,currency from public.payment_transactions');
  assert.deepEqual(pago,{economic_kind:'sale',amount_minor:499,currency:'USD'});
  assert.equal(await cantidad(db,'private.email_outbox',"where template='acceso'"),1);
  assert.equal((await fila(db,'select user_id from public.profiles')).user_id,null);

  assert.deepEqual(await trabajador(db,auth,resend),{estado:'procesado',enviados:0,cancelados:0,fallos:1});
  assert.equal(auth.emitidos.length,1);
  const token = auth.emitidos[0];
  assert.equal(token.email,EMAIL);
  assert.match(token.codigo,/^\d{6}$/);
  assert.equal((await acceso(db,token.id)).acceso,false,'sin confirmar no se vincula');
  const pendiente = await fila(db,"select * from private.email_outbox where template='acceso'");
  assert.equal(pendiente.status,'pending');
  assert.equal(pendiente.attempts,1);
  assert.equal(pendiente.last_error,'red_o_timeout');
  assert.ok(pendiente.envelope);
  for (const secreto of [EMAIL,token.codigo,token.hash,'/auth/callback']) assert.ok(!pendiente.envelope.includes(secreto));
  const sobre = descifrar(pendiente.envelope,CIFRADO);
  assert.deepEqual(sobre.to,[EMAIL]);
  assert.equal(sobre.from,REMITENTE_SERVICIO);
  assert.ok(sobre.text.includes(token.codigo)); assert.ok(sobre.html.includes(token.codigo));
  const enlace = new URL(sobre.text.match(/https:\/\/app\.example\.test\/auth\/callback\?\S+/)[0]);
  assert.equal(enlace.origin,SITIO); assert.equal(enlace.pathname,'/auth/callback');
  assert.equal(enlace.searchParams.get('token_hash'),token.hash);
  assert.equal(enlace.searchParams.get('type'),'email');
  assert.ok(sobre.html.includes(token.hash));
  assert.deepEqual(JSON.parse(resend.peticiones[0].cuerpo),sobre);
  assert.throws(() => descifrar(pendiente.envelope,'cd'.repeat(32)));
  assert.deepEqual(await trabajador(db,auth,resend),{estado:'procesado',enviados:0,cancelados:0,fallos:0},'respeta demora real de cola');
  await db.query('update private.email_outbox set due_at=now() where id=$1',[pendiente.id]);
  assert.deepEqual(await trabajador(db,auth,resend),{estado:'procesado',enviados:1,cancelados:0,fallos:0});
  assert.equal(auth.emitidos.length,1,'el reintento no genera nuevas credenciales');
  assert.equal(resend.peticiones.length,2);
  assert.deepEqual(resend.peticiones[0],resend.peticiones[1]);
  assert.equal(resend.aceptados.size,1,'aceptación única en el doble explícito');
  const terminado = await fila(db,'select * from private.email_outbox where id=$1',[pendiente.id]);
  assert.equal(terminado.status,'sent'); assert.equal(terminado.envelope,null);
  assert.equal(terminado.lease,null); assert.equal(terminado.provider_id,'resend-local-1');
  assert.equal(terminado.attempts,2); assert.ok(terminado.sent_at);
  const uid = await auth.confirmar(EMAIL,token.codigo);
  assert.equal((await fila(db,'select user_id from public.profiles')).user_id,uid);
  assert.deepEqual(await acceso(db,uid),{acceso:true,estado:'active',hasta:null});
  assert.deepEqual(await acceso(db,null),{acceso:false,estado:'sin_sesion',hasta:null});

  const otro = randomUUID();
  await db.query('insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())',[otro,'otra@example.test']);
  assert.equal((await acceso(db,otro)).acceso,false);
  const propios = await como(db,otro,() => db.query('select email from public.profiles'));
  assert.deepEqual(propios.rows,[{email:'otra@example.test'}],'RLS no expone la compradora');
  await como(db,otro,async () => {
    await assert.rejects(db.query('select * from private.email_outbox'),{code:'42501'});
    await assert.rejects(db.query("update public.profiles set status='active'"),{code:'42501'});
  });
  await como(db,null,() => assert.rejects(db.query('select public.mi_acceso()'),{code:'42501'}),'anon');
  await ingestar(db,completa);
  assert.equal((await trabajador(db,auth,resend)).enviados,0);
  assert.equal(resend.peticiones.length,2);
  assert.equal(await cantidad(db,'private.email_outbox',"where template='acceso'"),1);
});

test('trial monto 0: acceso tras confirmar, sin venta pagada y precobro bloqueado sin verificación',async t => {
  const db = await base(t), auth = authDoble(db), resend = resendDoble();
  // Entrada sintética: no procede de una compra ni de un calendario real de Hotmart.
  const fecha = Date.now();
  const trial = evento('trial-cero',undefined,{fecha,monto:0});
  assert.deepEqual(await ingestar(db,trial),{status:'applied',new_status:'trialing'});
  assert.equal((await ingestar(db,trial)).status,'duplicate');
  assert.equal((await ingestar(db,evento('trial-repetido',undefined,{fecha:fecha+1000,monto:0}))).status,'applied');
  const perfil = await fila(db,'select user_id,status,plan,first_paid_at,to_jsonb(trial_ends_at) as fin from public.profiles');
  assert.equal(perfil.user_id,null);
  assert.equal(perfil.status,'trialing'); assert.equal(perfil.plan,'pro');
  assert.equal(perfil.first_paid_at,null);
  assert.ok(Date.parse(perfil.fin)>Date.now(),'fin de prueba calculado por el SQL local');
  assert.equal(await cantidad(db,'public.profiles'),1);
  assert.equal(await cantidad(db,'public.payment_transactions'),0,'monto 0 no es una venta pagada');
  assert.equal(await cantidad(db,'public.event_log',"where type in ('primer_cobro_confirmado','cobro_renovado')"),0);
  assert.equal(await cantidad(db,'public.event_log',"where type='trial_iniciado'"),1);
  assert.equal(await cantidad(db,'private.email_outbox',"where template='acceso'"),1);
  assert.equal(await cantidad(db,'private.email_outbox',"where template='precobro'"),1);

  assert.deepEqual(await trabajador(db,auth,resend),{estado:'procesado',enviados:1,cancelados:0,fallos:0});
  assert.equal(auth.emitidos.length,1); assert.equal(resend.peticiones.length,1);
  const token = auth.emitidos[0], sobre = JSON.parse(resend.peticiones[0].cuerpo);
  assert.deepEqual(sobre.to,[EMAIL]);
  assert.ok(sobre.text.includes(token.codigo));
  assert.equal((await acceso(db,token.id)).acceso,false,'generar el correo no confirma identidad');
  const uid = await auth.confirmar(EMAIL,token.codigo);
  assert.deepEqual(await acceso(db,uid),{acceso:true,estado:'trialing',hasta:perfil.fin});
  const recordatorio = await fila(db,"select * from private.email_outbox where template='precobro'");
  assert.equal(recordatorio.status,'pending'); assert.equal(recordatorio.attempts,0);
  assert.equal(Date.parse(recordatorio.context.trial_end),Date.parse(perfil.fin));

  // Adelantar SOLO la disponibilidad del job, conservando el trial vigente. Así se
  // ejerce la barrera de verificación, no la cancelación por vencimiento de la prueba.
  await db.query('update private.email_outbox set due_at=now() where id=$1',[recordatorio.id]);
  assert.deepEqual(await trabajador(db,auth,resend,{precobroVerificado:false}),
    {estado:'procesado',enviados:0,cancelados:0,fallos:1});
  const bloqueado = await fila(db,'select status,last_error,attempts,envelope,provider_id,sent_at from private.email_outbox where id=$1',[recordatorio.id]);
  assert.deepEqual(bloqueado,{status:'manual',last_error:'verificar_fecha_importe_hotmart',
    attempts:1,envelope:null,provider_id:null,sent_at:null});
  assert.equal(resend.peticiones.length,1,'solo se transportó acceso, nunca precobro');
  assert.equal(auth.emitidos.length,1);
  assert.deepEqual(await trabajador(db,auth,resend),{estado:'procesado',enviados:0,cancelados:0,fallos:0});
  assert.equal(resend.peticiones.length,1,'el bloqueo persiste entre ejecuciones');
  assert.equal((await fila(db,'select first_paid_at from public.profiles')).first_paid_at,null);
  assert.equal(await cantidad(db,'public.payment_transactions'),0);
  assert.equal(await cantidad(db,'public.event_log',"where type in ('primer_cobro_confirmado','cobro_renovado')"),0);
});

for (const momento of ['antes del worker','durante la preparación']) {
  test(`reembolso ${momento}: cancela acceso sin transportarlo y mi_acceso lo niega`,async t => {
    const db = await base(t), auth = authDoble(db), resend = resendDoble();
    const fecha = Date.now();
    await ingestar(db,evento('compra',undefined,{fecha}));
    const reembolsar = () => ingestar(db,evento('reembolso','PURCHASE_REFUNDED',{fecha:fecha+1000}));
    if (momento === 'antes del worker') await reembolsar();
    let cifradoAntesDeReembolso;
    const r = await trabajador(db,auth,resend,{operar: async (a,d) => {
      const resultado = await operar(db,a,d);
      if (a === 'prepare' && momento === 'durante la preparación') {
        assert.equal(resultado.ok,true);
        cifradoAntesDeReembolso = (await fila(db,'select envelope from private.email_outbox where id=$1',[d.id])).envelope;
        assert.ok(cifradoAntesDeReembolso);
        await reembolsar();
      }
      return resultado;
    }});
    assert.equal(r.cancelados,1); assert.equal(r.fallos,0);
    assert.equal(auth.emitidos.length,momento === 'antes del worker' ? 0 : 1);
    const j = await fila(db,"select status,envelope,last_error from private.email_outbox where template='acceso'");
    assert.deepEqual(j,{status:'cancelled',envelope:null,last_error:'acceso_no_habilitado'});
    assert.equal(resend.peticiones.length,momento === 'antes del worker' ? 1 : 0);
    for (const pedido of resend.peticiones) {
      const sobre = JSON.parse(pedido.cuerpo);
      assert.deepEqual(sobre.to,[EMAIL]);
      assert.ok(!sobre.text.includes('/auth/callback'));
      assert.ok(!sobre.text.includes('654321'));
    }
    const uid = randomUUID();
    await db.query('insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())',[uid,EMAIL]);
    assert.deepEqual(await acceso(db,uid),{acceso:false,estado:'refunded',hasta:null});
    assert.equal(await cantidad(db,'public.payment_transactions',"where economic_kind='refund'"),1);
    await trabajador(db,auth,resend); // solo puede enviar la notificación de reembolso pendiente
    assert.equal(resend.peticiones.length,1);
    assert.ok(!JSON.parse(resend.peticiones[0].cuerpo).text.includes('/auth/callback'));
  });
}

test('producto 0 y llave falsa: no crean perfil, pago, correo ni acceso',async t => {
  const db = await base(t), auth = authDoble(db), resend = resendDoble();
  await assert.rejects(ingestar(db,evento('sin-autorizacion'),'clave-falsa'),{code:'42501'});
  assert.equal(await cantidad(db,'public.processed_events'),0);
  const e = evento('producto-cero',undefined,{producto:0});
  assert.equal((await ingestar(db,e)).status,'illegal_product');
  assert.equal((await ingestar(db,e)).status,'duplicate');
  for (const tabla of ['public.profiles','public.payment_transactions','private.email_outbox']) assert.equal(await cantidad(db,tabla),0);
  assert.equal((await fila(db,"select result from public.webhook_log where result='illegal'")).result,'illegal');
  assert.equal((await trabajador(db,auth,resend)).enviados,0);
  assert.equal(auth.emitidos.length,0); assert.equal(resend.peticiones.length,0);
  assert.equal((await acceso(db,randomUUID())).acceso,false);
});

test('fuera de orden: un aviso viejo no reactiva; reembolso antiguo sí revoca, repetición no resucita',async t => {
  const db = await base(t), auth = authDoble(db), resend = resendDoble();
  const fecha = Date.now();
  await ingestar(db,evento('compra',undefined,{fecha}));
  await ingestar(db,evento('completa','PURCHASE_COMPLETE',{fecha:fecha+2000}));
  const antes = await fila(db,'select status,last_event_at from public.profiles');
  assert.equal((await ingestar(db,evento('atraso-viejo','PURCHASE_DELAYED',{fecha:fecha+1000}))).status,'stale');
  assert.deepEqual(await fila(db,'select status,last_event_at from public.profiles'),antes);
  assert.equal(await cantidad(db,'public.payment_transactions'),1);
  assert.equal(await cantidad(db,'private.email_outbox',"where template='acceso'"),1);
  assert.equal((await ingestar(db,evento('reembolso-viejo','PURCHASE_REFUNDED',{fecha:fecha-1000}))).status,'applied');
  assert.equal((await ingestar(db,evento('aprobada-vieja',undefined,{fecha}))).status,'stale');
  assert.equal((await ingestar(db,evento('completa-nueva','PURCHASE_COMPLETE',{fecha:fecha+3000}))).status,'illegal_transition');
  const uid = randomUUID();
  await db.query('insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())',[uid,EMAIL]);
  assert.equal((await acceso(db,uid)).acceso,false);
  const r = await trabajador(db,auth,resend);
  assert.equal(r.cancelados,1); assert.equal(r.enviados,1); assert.equal(r.fallos,0);
  assert.equal(auth.emitidos.length,0);
  assert.equal(await cantidad(db,'public.payment_transactions',"where economic_kind='sale'"),1);
  assert.equal(await cantidad(db,'public.payment_transactions',"where economic_kind='refund'"),1);
  assert.equal(await cantidad(db,'private.email_outbox',"where template='acceso' and status='cancelled'"),1);
  assert.ok(!JSON.parse(resend.peticiones[0].cuerpo).text.includes('/auth/callback'));
});
