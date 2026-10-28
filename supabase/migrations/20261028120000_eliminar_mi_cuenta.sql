-- «Eliminar mi cuenta» en /cuenta (decisión 28 de la dueña, 2026-10-25).
-- La clienta, con su sesión, borra su cuenta: el login (auth.users) y su perfil (correo,
-- nombre, estado de la suscripción e historial de estados). Lo que NO se borra:
-- · los registros de pago (payment_transactions): la ley tributaria obliga a guardarlos;
--   quedan sin dueño (customer_id → null por la FK on delete set null).
-- · estadísticas y errores: ya son seudónimos; pierden el vínculo con la cuenta (set null)
--   y se borran solos a los 24 meses (20261024120000_retencion_estadisticas.sql).
-- No cancela la suscripción en Hotmart: si sigue activa, un aviso nuevo de Hotmart vuelve
-- a crear el perfil con su correo. Por eso /cuenta le pide cancelar antes.
-- El admin no puede borrarse desde aquí (dejaría el panel sin dueña).
-- ESCRITA, NO APLICADA: espera el permiso de la dueña (cambia la base de producción).

create or replace function public.eliminar_mi_cuenta()
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_correo text;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'motivo', 'sin_sesion');
  end if;
  select lower(email) into v_correo from auth.users where id = v_uid;
  if exists (
    select 1 from public.profiles
    where role = 'admin' and (user_id = v_uid or email = v_correo)
  ) or exists (select 1 from private.admin_emails where email = v_correo) then
    return jsonb_build_object('ok', false, 'motivo', 'admin');
  end if;
  -- El perfil puede estar ligado por user_id o, si nunca se ligó, solo por el correo.
  delete from public.profiles where user_id = v_uid or (v_correo is not null and email = v_correo);
  delete from auth.users where id = v_uid;
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.eliminar_mi_cuenta() from public, anon;
grant execute on function public.eliminar_mi_cuenta() to authenticated;
