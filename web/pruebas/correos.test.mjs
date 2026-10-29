import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHmac,randomBytes} from 'node:crypto';
import {PLANTILLAS,renderCorreo} from '../lib/correos/plantillas.ts';
import {construirSobre,enviarResend,ErrorCorreo,REMITENTE_SERVICIO,REMITENTE_MARKETING} from '../lib/correos/envio.ts';
import {coincide,tokenBaja,leerBaja,cifrar,descifrar,verificarResend} from '../lib/correos/seguridad.ts';
import {motivoCancelar,procesarCorreos} from '../lib/correos/trabajador.ts';

const SITIO='https://pasoapaso.hadaapps.com';
const ID='bbbbbbbb-bbbb-4bbb-abbb-bbbbbbbbbbbb';
const SECRETO='x'.repeat(48), LLAVE='a'.repeat(64);
const AHORA=Date.parse('2026-10-25T12:00:00Z');
const datos={urlCheckout:'https://pay.hotmart.com/PRUEBA?off=mensual',urlSitio:SITIO,urlAcceso:`${SITIO}/auth/callback?token_hash=ficticio&type=email`,codigo:'123456',urlBaja:`${SITIO}/api/correos/baja?token=ficticio`,fecha:'27 de octubre',importe:'US$4,99',urlRegalo:`${SITIO}/recurso.pdf`,urlConfirmacion:`${SITIO}/api/correos/confirmar?token=ficticio`};
const config={habilitado:true,marketing:true,dominioVerificado:true,marketingVerificado:true,txKey:'re_ficticia-transaccional',mktKey:'re_ficticia-marketing',sitio:SITIO};
const trabajo=(extras={})=>({id:ID,lease:ID,template:'acceso',contact_id:ID,email:'prueba@example.com',consent_at:null,opted_out_at:null,suppressed_at:null,last_engaged_at:null,profile_status:'active',profile_id:ID,trial_end:null,access_until:null,context:{},envelope:null,envelope_expires_at:null,...extras});

test('todas las plantillas: 2 asuntos, preheader, trazabilidad, texto/HTML y baja solo en marketing',()=>{
  assert.ok(Object.keys(PLANTILLAS).length>=27);
  for(const [id,p] of Object.entries(PLANTILLAS)){
    const r=renderCorreo(id,datos);
    assert.equal(p.asuntos.length,2);assert.notEqual(...p.asuntos);assert.ok(p.traza.length>20);
    assert.ok(r.html.includes('lang="es"'));assert.ok(r.texto.length>80);assert.ok(r.preheader);
    assert.equal(r.html.includes('Dejar de recibir'),p.canal==='marketing');
    assert.equal((r.html.match(/<a /g)||[]).length,p.canal==='marketing'||['acceso','recuperacion','admin'].includes(id)?2:1);
    if(!['acceso','recuperacion','admin'].includes(id))assert.ok(!r.texto.includes('123456'));
    assert.ok(!r.texto.includes('{fecha}'));assert.ok(!r.texto.includes('{importe}'));
    const sobre=construirSobre(id,'prueba@example.com',datos);
    assert.equal(Boolean(sobre.headers?.['List-Unsubscribe-Post']),p.canal==='marketing');
    assert.equal(sobre.reply_to,'hadaapps@gmail.com');
  }
});
test('render rechaza acceso ajeno, enlaces peligrosos y precobro sin fecha/importe',()=>{
  assert.throws(()=>renderCorreo('acceso',{...datos,urlAcceso:'https://otro.example/'}));
  assert.throws(()=>renderCorreo('acceso',{...datos,urlAcceso:'javascript:alert(1)'}));
  assert.throws(()=>renderCorreo('precobro',{urlSitio:SITIO}));
  assert.throws(()=>renderCorreo('carrito_2h',{urlSitio:SITIO}));
  assert.throws(()=>renderCorreo('carrito_2h',{...datos,urlCheckout:'https://otro.example/'}));
  assert.ok(renderCorreo('carrito_2h',datos).texto.includes(datos.urlCheckout));
  assert.throws(()=>construirSobre('acceso','x@example.com\r\nBcc:y@example.com',datos));
  assert.ok(renderCorreo('precobro',{...datos,importe:'<script>mal</script>'}).html.includes('&lt;script&gt;'));
});
test('baja firmada, secreta, no reutilizable como confirmación',()=>{
  const token=tokenBaja(ID,SECRETO);assert.equal(leerBaja(token,SECRETO),ID);
  assert.equal(leerBaja(token+'x',SECRETO),null);assert.equal(leerBaja(token,SECRETO+'confirmar'),null);
  assert.equal(coincide(null,SECRETO),false);assert.equal(coincide(SECRETO,SECRETO),true);
});
test('cuerpo cifrado no contiene link/código en claro y detecta alteración',()=>{
  const sobre=construirSobre('acceso','prueba@example.com',datos),c=cifrar(sobre,LLAVE,randomBytes(12));
  assert.ok(!c.includes('123456'));assert.deepEqual(descifrar(c,LLAVE),sobre);
  assert.throws(()=>descifrar(c,'b'.repeat(64)));
});
test('firma Resend requiere cuerpo original y rechaza replay viejo',()=>{
  const secret=Buffer.from(SECRETO).toString('base64'),raw='{"type":"email.delivered"}',ts=String(AHORA/1000);
  const firma=createHmac('sha256',Buffer.from(secret,'base64')).update(`evt.${ts}.${raw}`).digest('base64');
  const h=new Headers({'svix-id':'evt','svix-timestamp':ts,'svix-signature':`v1,incorrecta v1,${firma}`});
  assert.equal(verificarResend(raw,h,'whsec_'+secret,AHORA),true);
  assert.equal(verificarResend(raw+' ',h,'whsec_'+secret,AHORA),false);
  assert.equal(verificarResend(raw,h,'whsec_'+secret,AHORA+301000),false);
});
test('envío exige activación y dominio verificado, sin tocar red cuando faltan',async()=>{
  let redes=0;const mock=async()=>{redes++;return Response.json({id:'proveedor'});};
  for(const cambio of [{habilitado:false},{dominioVerificado:false}])await assert.rejects(enviarResend(construirSobre('acceso','prueba@example.com',datos),'servicio',ID,{...config,...cambio},mock));
  assert.equal(redes,0);
});

test('remitente verificado: acceso.hadaapps.com para servicio y rechazo del remitente anterior',async()=>{
  const sobre=construirSobre('acceso','prueba@example.com',datos);
  assert.equal(sobre.from, 'Paso a Paso <acceso@acceso.hadaapps.com>');
  assert.equal(sobre.from, REMITENTE_SERVICIO);
  assert.equal(construirSobre('carrito_2h','prueba@example.com',datos).from, REMITENTE_MARKETING);
  let redes=0;
  const mock=async()=>{redes++;return Response.json({id:'proveedor'});};
  for(const from of ['Paso a Paso <acceso@tx.hadaapps.com>', 'Otro <acceso@acceso.hadaapps.com>', REMITENTE_MARKETING]) {
    await assert.rejects(enviarResend({...sobre,from},'servicio',ID,config,mock),e=>e.razon==='remitente_invalido');
  }
  await assert.rejects(enviarResend(sobre,'marketing',ID,config,mock),e=>e.razon==='remitente_invalido');
  assert.equal(redes,0);
});
test('Resend: mismo ID, cabecera estable, separación de llaves y sin registrar cuerpos',async()=>{
  const solicitudes=[];const mock=async(url,op)=>{solicitudes.push(op);return Response.json({id:'proveedor'});};
  for(let i=0;i<2;i++)await enviarResend(construirSobre('acceso','prueba@example.com',datos),'servicio',ID,config,mock);
  assert.equal(solicitudes[0].headers['Idempotency-Key'],solicitudes[1].headers['Idempotency-Key']);
  assert.equal(solicitudes[0].headers.Authorization,'Bearer re_ficticia-transaccional');
  await enviarResend(construirSobre('carrito_2h','prueba@example.com',datos),'marketing',ID,config,mock);
  assert.equal(solicitudes[2].headers.Authorization,'Bearer re_ficticia-marketing');
  await assert.rejects(enviarResend(construirSobre('acceso','prueba@example.com',datos),'servicio',ID,config,async()=>new Response('',{status:429})),e=>e instanceof ErrorCorreo&&e.reintentar);
});

test('verificar servicio no habilita marketing: su dominio necesita comprobación independiente',async()=>{
  let redes=0;
  const mock=async()=>{redes++;return Response.json({id:'proveedor'});};
  for (const marketingVerificado of [false, undefined]) {
    await assert.rejects(enviarResend(construirSobre('carrito_2h','prueba@example.com',datos),'marketing',ID,{...config,marketingVerificado},mock),e=>e.razon==='envio_desactivado');
  }
  assert.equal(redes,0);
  let pedido;
  await procesarCorreos({config:{...config,marketingVerificado:false},operar:async(a,d)=>{if(a==='claim'){pedido=d;return [];}throw Error('inesperado');},acceso:async()=>{throw Error('no generar');},llaveCifrado:LLAVE,secretoBaja:SECRETO,precobroVerificado:false});
  assert.deepEqual(pedido,{marketing:false});
});
test('cancelación de mensajes según estado actual, consentimiento y supresión',()=>{
  assert.equal(motivoCancelar(trabajo({template:'pago_fallido_3'}),AHORA),'pago_resuelto');
  assert.equal(motivoCancelar(trabajo({template:'regreso_30',consent_at:new Date(AHORA).toISOString()}),AHORA),'ya_regreso');
  assert.equal(motivoCancelar(trabajo({template:'carrito_2h'}),AHORA),'sin_consentimiento');
  assert.equal(motivoCancelar(trabajo({suppressed_at:'hoy'}),AHORA),'direccion_suprimida');
  assert.equal(motivoCancelar(trabajo({profile_status:'refunded'}),AHORA),'acceso_no_habilitado');
});
test('trabajador desactivado no toca cola, Supabase Auth ni proveedor',async()=>{
  const prohibido=async()=>{throw Error('no debía llamarse');};
  const r=await procesarCorreos({config:{...config,habilitado:false},operar:prohibido,acceso:prohibido,llaveCifrado:'',secretoBaja:'',precobroVerificado:false});
  assert.equal(r.estado,'desactivado');
});
test('flujo simulado: cola → enlace/código → cifrado durable → proveedor → confirmación',async()=>{
  const j=trabajo(),acciones=[];let enviado;
  const operar=async(a,d)=>{acciones.push(a);if(a==='claim')return[j];if(a==='check')return{...j,ok:true};if(a==='prepare'){assert.ok(!d.envelope.includes('123456'));return{ok:true};}return{ok:true};};
  const r=await procesarCorreos({config,operar,acceso:async()=>({url:datos.urlAcceso,codigo:'123456'}),enviar:async(s)=>{enviado=s;return 'id-proveedor';},llaveCifrado:LLAVE,secretoBaja:SECRETO,precobroVerificado:false,ahora:()=>AHORA});
  assert.equal(r.enviados,1);assert.ok(enviado.text.includes('123456'));assert.deepEqual(acciones,['claim','check','prepare','check','finish']);
});
test('pago recuperado durante preparación cancela el recordatorio',async()=>{
  const j=trabajo({template:'pago_fallido_1',profile_status:'past_due'});let checks=0,envios=0,estado;
  const operar=async(a,d)=>{if(a==='claim')return[j];if(a==='check')return{...j,ok:true,profile_status:++checks===1?'past_due':'active'};if(a==='finish')estado=d.status;return{ok:true};};
  await procesarCorreos({config,operar,acceso:async()=>{throw Error();},enviar:async()=>{envios++;return'x';},llaveCifrado:LLAVE,secretoBaja:SECRETO,precobroVerificado:false,ahora:()=>AHORA});
  assert.equal(envios,0);assert.equal(estado,'cancelled');
});
test('reintento reutiliza cuerpo cifrado, no genera otro enlace',async()=>{
  const sobre=construirSobre('acceso','prueba@example.com',datos),j=trabajo({envelope:cifrar(sobre,LLAVE,randomBytes(12)),envelope_expires_at:new Date(AHORA+60000).toISOString()});
  let enviado;
  const operar=async(a)=>a==='claim'?[j]:a==='check'?{...j,ok:true}:{ok:true};
  await procesarCorreos({config,operar,acceso:async()=>{throw Error('no regenerar');},enviar:async(s)=>{enviado=s;return'id';},llaveCifrado:LLAVE,secretoBaja:SECRETO,precobroVerificado:false,ahora:()=>AHORA});
  assert.deepEqual(enviado,sobre);
});


test('una clave de otro servicio nunca se transmite a Resend',async()=>{
  let llamadas=0;const transporte=async()=>{llamadas++;return Response.json({id:'no-usar'});};
  await assert.rejects(enviarResend(construirSobre('acceso','prueba@example.com',datos),'servicio',ID,{...config,txKey:'clave-de-otro-servicio'},transporte),e=>e.razon==='clave_resend_invalida');
  assert.equal(llamadas,0);
});
