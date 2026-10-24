-- Retención prometida en /privacidad (auditoría legal 2026-10-24):
-- estadísticas seudónimas (event_log) y errores (error_log) se borran a los 24 meses.
-- ESCRITA, NO APLICADA: espera el permiso de la dueña (cambia la base de producción).
create extension if not exists pg_cron;

create or replace function private.purgar_registros_viejos()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.event_log where created_at < now() - interval '24 months';
  delete from public.error_log where created_at < now() - interval '24 months';
$$;

revoke all on function private.purgar_registros_viejos() from public, anon, authenticated;

-- Todos los días a las 04:15 UTC.
select cron.schedule('purgar-registros-viejos', '15 4 * * *', $$select private.purgar_registros_viejos()$$);
