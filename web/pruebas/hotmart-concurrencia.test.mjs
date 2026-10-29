import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
const root=new URL('../../supabase/migrations/',import.meta.url);
const read=n=>readFileSync(new URL(n,root),'utf8');
const repair=read('20261026210000_hotmart_concurrencia.sql');
async function setup(){
  const db=new PGlite();
  await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);`);
  await db.exec(read('20261020190000_base_backoffice.sql').split('-- ─── Helpers')[0]);
  await db.exec(`create function private.ingest_key_ok(k text) returns boolean language sql as $$select k='test-key'$$;
  create function private.to_minor(v numeric,c text) returns bigint language sql as $$select round(v*100)::bigint$$;`);
  await db.exec(read('20261020191000_ingesta.sql'));
  return db;
}
const event=(id,type='PURCHASE_APPROVED',product=8796204)=>({id,creation_date:1793056840000,event:type,data:{product:{id:product},buyer:{email:'fixture@example.com'},purchase:{transaction:'test-transaction',price:{value:4.99,currency_value:'USD'}},subscription:{subscriber:{code:'fixture-sub'},plan:{name:'Mensual'}}}});
async function ingest(db,p,key='test-key'){
  return(await db.query('select public.ingest_hotmart($1,$2,$3,$4,$5) as r',[key,p.id,p.event,'fixture-hash',p])).rows[0].r;
}
test('reparación Hotmart conserva versión instalada, permisos y deduplicación',async()=>{
 const db=await setup();try{
  await db.exec(repair);await db.exec(repair);
  const def=(await db.query("select pg_get_functiondef('public.ingest_hotmart(text,text,text,text,jsonb)'::regprocedure) as d")).rows[0].d;
  assert.equal(def.split('hotmart_serial_ingest_v1').length-1,1);
  assert.ok(def.indexOf('pg_advisory_xact_lock')<def.indexOf('insert into public.processed_events'));
  assert.match(def,/on conflict \(email\) do update set email = excluded.email/);
  assert.equal((await db.query("select has_function_privilege('anon','public.ingest_hotmart(text,text,text,text,jsonb)','execute') as ok")).rows[0].ok,true);
  assert.equal((await ingest(db,event('one'))).status,'applied');
  assert.equal((await ingest(db,event('one'))).status,'duplicate');
  assert.equal((await ingest(db,event('two','PURCHASE_COMPLETE'))).status,'applied');
  assert.equal((await db.query('select count(*)::int as n from public.profiles')).rows[0].n,1);
  assert.equal((await db.query('select count(*)::int as n from public.payment_transactions')).rows[0].n,1);
  await assert.rejects(()=>ingest(db,event('forbidden'),'bad-key'));
 }finally{await db.close();}
});
test('reparación preserva catálogo y rechaza producto simulado sin dar acceso',async()=>{
 const db=await setup();try{
  await db.exec(read('20261025010000_hotmart_producto_y_orden.sql'));
  await db.exec(repair);
  assert.equal((await ingest(db,event('unknown','PURCHASE_APPROVED',0))).status,'illegal_product');
  assert.equal((await db.query('select count(*)::int as n from public.profiles')).rows[0].n,0);
 }finally{await db.close();}
});
