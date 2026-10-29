-- PREPARADA, NO APLICADA. Requiere la cola de correos y Vault de Supabase.
-- Instala infraestructura APAGADA: ni agenda cron ni envía mensajes al aplicar.
-- Fuentes: supabase.com/docs/guides/cron/quickstart y functions/schedule-functions.
begin;
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
-- Las pruebas sustituyen solo pg_net/Vault por dobles locales.
-- BEGIN PORTABLE CORE
create table private.email_dispatch_settings (
  id boolean primary key default true check(id),
  enabled boolean not null default false,
  last_dispatch_at timestamptz
);
insert into private.email_dispatch_settings(id) values(true);
alter table private.email_dispatch_settings enable row level security;
revoke all on private.email_dispatch_settings from public, anon, authenticated;

create function private.email_dispatch_tick() returns bigint
language plpgsql security definer set search_path = '' as $$
declare credential text; request_id bigint;
begin
  if not pg_catalog.pg_try_advisory_xact_lock(8796204,20261027) then return null; end if;
  if not exists(select 1 from private.email_dispatch_settings
    where id and enabled and (last_dispatch_at is null or last_dispatch_at < now()-interval '1 minute'))
    then return null; end if;
  if not exists(select 1 from private.email_outbox where
    (status='pending' and due_at<=now()) or
    (status='processing' and locked_until<now())) then return null; end if;
  select decrypted_secret into credential from vault.decrypted_secrets
    where name='paso_a_paso_correos_cron' limit 1;
  if credential is null or length(credential)<32 then
    raise exception 'Falta credencial del trabajador en Vault';
  end if;
  -- Solo credencial de esta ruta; nunca una clave de Resend o de Supabase Admin.
  select net.http_post(
    url:='https://paso-a-paso-sigma.vercel.app/api/correos/procesar',
    headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||credential),
    body:='{}'::jsonb, timeout_milliseconds:=65000
  ) into request_id;
  update private.email_dispatch_settings set last_dispatch_at=now() where id;
  return request_id;
end $$;
revoke all on function private.email_dispatch_tick() from public, anon, authenticated;
-- END PORTABLE CORE
-- pg_net almacena temporalmente cabeceras: no dar acceso a roles de navegador.
revoke all on net.http_request_queue, net._http_response from public, anon, authenticated;
commit;
