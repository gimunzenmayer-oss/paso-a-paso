import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
const sql=readFileSync(new URL('../../supabase/migrations/20261026220000_correos_programacion.sql',import.meta.url),'utf8');
test('programación apagada por defecto, credencial separada y sin invocaciones vacías',async()=>{
 const db=new PGlite();try{
  await db.exec(`create role anon;create role authenticated;create schema private;create schema net;create schema vault;
   create table private.email_outbox(status text,due_at timestamptz,locked_until timestamptz);
   create table vault.decrypted_secrets(name text,decrypted_secret text);
   create table net.calls(url text,body jsonb,headers jsonb);
   create function net.http_post(url text,body jsonb default '{}'::jsonb,params jsonb default '{}'::jsonb,headers jsonb default '{}'::jsonb,timeout_milliseconds integer default 5000) returns bigint
   language plpgsql as $$begin insert into net.calls values(url,body,headers);return 123;end$$;`);
  await db.exec(sql.split('-- BEGIN PORTABLE CORE')[1].split('-- END PORTABLE CORE')[0]);
  const tick=async()=>(await db.query('select private.email_dispatch_tick() as r')).rows[0].r;
  assert.equal(await tick(),null);
  await db.exec("update private.email_dispatch_settings set enabled=true");
  assert.equal(await tick(),null);
  await db.exec("insert into private.email_outbox values('pending',now(),null)");
  await assert.rejects(tick,/Falta credencial/);
  assert.equal((await db.query('select * from net.calls')).rows.length,0);
  await db.query('insert into vault.decrypted_secrets values($1,$2)',['paso_a_paso_correos_cron','fixture-para-trabajador-no-es-secreto-real']);
  assert.equal(await tick(),123);
  assert.equal(await tick(),null);
  const call=(await db.query('select * from net.calls')).rows[0];
  assert.equal(call.url,'https://paso-a-paso-sigma.vercel.app/api/correos/procesar');
  assert.equal(call.headers.Authorization,'Bearer fixture-para-trabajador-no-es-secreto-real');
  assert.deepEqual(call.body,{});
  assert.equal((await db.query("select has_function_privilege('anon','private.email_dispatch_tick()','execute') as ok")).rows[0].ok,false);
  await db.exec("update private.email_dispatch_settings set enabled=false,last_dispatch_at=null");
  assert.equal(await tick(),null);
 }finally{await db.close();}
});
