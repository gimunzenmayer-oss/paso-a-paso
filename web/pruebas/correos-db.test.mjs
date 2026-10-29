import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
const SQL=readFileSync(new URL('../../supabase/migrations/20261025130000_correos.sql',import.meta.url),'utf8');
const KEY='ficticia-para-pruebas-no-es-una-clave-real';
async function base(){
  const db=new PGlite();
  await db.exec(`create role anon;create role authenticated;create schema private;
    create function private.ingest_key_ok(k text) returns boolean language sql as $$select k='${KEY}'$$;
    create table public.profiles(id uuid primary key default gen_random_uuid(),email text unique not null,
      role text default 'customer',status text default 'none',trial_ends_at timestamptz,access_until timestamptz);
  `);
  await db.exec(SQL);return db;
}
async function op(db,a,d={},key=KEY){return (await db.query('select public.email_operar($1,$2,$3) as r',[key,a,d])).rows[0].r;}

test('SQL real: un acceso nuevo precede a consejos antiguos en la cola',async()=>{
  const db=await base();try{
    await db.query("insert into private.email_contacts(email,consent_at) values('prueba@example.com',now())");
    await db.query("insert into private.email_outbox(contact_id,template,dedupe,due_at,expires_at) select id,'nutricion_d1','consejo-antiguo',now()-interval '1 hour',now()+interval '1 day' from private.email_contacts");
    await db.query("insert into public.profiles(email,status) values('prueba@example.com','active')");
    const trabajos=await op(db,'claim',{marketing:true});
    assert.equal(trabajos[0].template,'acceso');
    assert.equal(trabajos[1].template,'nutricion_d1');
  }finally{await db.close();}
});

test('SQL real: captación limita entre instancias y no almacena la IP en claro',async()=>{
  const db=await base();try{
    const request_key='f'.repeat(64);
    for(let i=0;i<10;i++)assert.equal((await op(db,'request_consent',{email:`ana${i}@example.com`,source:'guia-gratis-v1',request_key})).ok,true);
    const r=await op(db,'request_consent',{email:'limite@example.com',source:'guia-gratis-v1',request_key});
    assert.equal(r.limited,true);
    assert.equal((await db.query("select * from private.email_contacts where email='limite@example.com'")).rows.length,0);
    assert.equal((await db.query('select fingerprint from private.email_request_limits')).rows[0].fingerprint,request_key);
    await db.query("update private.email_request_limits set started_at=now()-interval '2 hours'");
    assert.equal((await op(db,'request_consent',{email:'otra@example.com',source:'guia-gratis-v1',request_key})).ok,true);
  }finally{await db.close();}
});
async function perfil(db,email='prueba@example.com'){
  return(await db.query("insert into public.profiles(email) values($1) returning id",[email])).rows[0].id;
}
test('SQL real: aviso de pago → cola durable, idempotencia y cancelación de recordatorios',async()=>{
  const db=await base();try{
    const id=await perfil(db);
    await db.query("update public.profiles set status='trialing',trial_ends_at=now()+interval '7 days' where id=$1",[id]);
    let trabajos=(await db.query('select template from private.email_outbox')).rows;
    assert.equal(trabajos.length,5);assert.equal(trabajos.filter(t=>t.template==='acceso').length,1);
    await db.query("update public.profiles set status='trialing' where id=$1",[id]);
    assert.equal((await db.query('select * from private.email_outbox')).rows.length,5);
    await db.query("update public.profiles set status='active' where id=$1",[id]);
    assert.equal((await db.query("select * from private.email_outbox where template='acceso'")).rows.length,1);
    assert.equal((await db.query("select status from private.email_outbox where template='precobro'")).rows[0].status,'cancelled');
    await db.query("update public.profiles set status='past_due' where id=$1",[id]);
    assert.equal((await db.query("select * from private.email_outbox where template like 'pago_fallido_%' and status='pending'")).rows.length,4);
    await db.query("update public.profiles set status='active' where id=$1",[id]);
    assert.equal((await db.query("select * from private.email_outbox where template like 'pago_fallido_%' and status='pending'")).rows.length,0);
    await db.query("update public.profiles set status='cancelled' where id=$1",[id]);
    await db.query("update public.profiles set status='expired' where id=$1",[id]);
    assert.equal((await db.query("select * from private.email_outbox where template like 'regreso_%'")).rows.length,3);
    await db.query("update public.profiles set status='active' where id=$1",[id]);
    assert.equal((await db.query("select * from private.email_outbox where template='acceso'")).rows.length,2);
  }finally{await db.close();}
});
test('SQL real: doble confirmación, carrito con consentimiento y baja inmediata',async()=>{
  const db=await base();try{
    await op(db,'request_consent',{email:'lead@example.com',source:'formulario_recurso_v1'});
    const c=(await db.query('select * from private.email_contacts')).rows[0];
    assert.equal((await op(db,'carrito',{email:c.email,checkout_id:'compra-1'})).ok,false);
    const fecha=(await op(db,'contact',{contact_id:c.id})).requested_at;
    assert.equal((await op(db,'confirm',{contact_id:c.id,requested_at:fecha})).ok,true);
    assert.equal((await op(db,'confirm',{contact_id:c.id,requested_at:fecha})).ok,false);
    assert.equal((await db.query("select * from private.email_outbox where template like 'nutricion_%'")).rows.length,5);
    assert.equal((await op(db,'carrito',{email:c.email,checkout_id:'compra-1'})).ok,true);
    await op(db,'carrito',{email:c.email,checkout_id:'compra-1'});
    assert.equal((await db.query("select * from private.email_outbox where template like 'carrito_%'")).rows.length,3);
    await op(db,'unsubscribe',{contact_id:c.id});
    assert.equal((await op(db,'carrito',{email:c.email,checkout_id:'compra-2'})).ok,false);
  }finally{await db.close();}
});
test('SQL real: no envía perfil admin y no acepta llave falsa ni acceso directo a cola',async()=>{
  const db=await base();try{
    await db.query("insert into public.profiles(email,role,status) values('admin@example.com','admin','active')");
    assert.equal((await op(db,'claim')).length,0);
    await assert.rejects(op(db,'claim',{},'incorrecta'));
    await db.exec('set role anon');
    await assert.rejects(db.query('select * from private.email_contacts'));
    await assert.rejects(op(db,'claim',{},'incorrecta'));
    await db.exec('reset role');
  }finally{await db.close();}
});
test('SQL real: lease evita doble envío y borra enlace cifrado al terminar',async()=>{
  const db=await base();try{
    const id=await perfil(db);await db.query("update public.profiles set status='active' where id=$1",[id]);
    const [j]=await op(db,'claim');assert.equal(j.template,'acceso');
    assert.equal((await op(db,'claim')).length,0);
    assert.equal((await op(db,'prepare',{id:j.id,lease:j.lease,envelope:'cifrado-ficticio',expires:new Date(Date.now()+600000).toISOString()})).ok,true);
    assert.equal((await op(db,'prepare',{id:j.id,lease:j.lease,envelope:'otro',expires:new Date().toISOString()})).ok,false);
    await op(db,'finish',{id:j.id,lease:j.lease,status:'sent',provider_id:'proveedor-ficticio'});
    assert.equal((await op(db,'check',{id:j.id,lease:j.lease})).ok,false);
    assert.equal((await db.query('select envelope from private.email_outbox where id=$1',[j.id])).rows[0].envelope,null);
  }finally{await db.close();}
});
test('SQL real: rebote firmado suprime, evento repetido no se procesa dos veces',async()=>{
  const db=await base();try{
    await perfil(db);await db.query("update public.profiles set status='active'");
    const e={id:'evt-1',provider_id:'email-1',kind:'email.bounced',email:'prueba@example.com'};
    await op(db,'event',e);await op(db,'event',e);
    assert.equal((await db.query('select * from private.email_events')).rows.length,1);
    assert.ok((await db.query('select suppressed_at from private.email_contacts')).rows[0].suppressed_at);
  }finally{await db.close();}
});
