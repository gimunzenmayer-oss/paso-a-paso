-- Acceso de las clientas a la app (entrada de pago, paso 6).
-- La app pregunta "¿puedo entrar?" con su sesión; la respuesta sale de NUESTRA
-- base (lo que dejó el webhook de Hotmart), nunca de Hotmart en vivo.
-- Misma regla que la columna tiene_acceso del panel (admin_lista_clientes):
-- si cambia aquí, cambia allá.

-- Regla única: prueba, pagando o pago atrasado (gracia); o canceló y su período pagado no terminó.
create or replace function private.tiene_acceso(p public.profiles)
returns boolean
language sql stable set search_path = ''
as $$
  select p.status in ('trialing', 'active', 'past_due')
      or (p.status = 'cancelled' and p.access_until > now());
$$;
revoke all on function private.tiene_acceso(public.profiles) from public, anon, authenticated;

-- Lo que ve la app de la clienta con sesión: solo su acceso, su estado y hasta cuándo.
create or replace function public.mi_acceso()
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  v_perfil public.profiles;
begin
  if (select auth.uid()) is null then
    return jsonb_build_object('acceso', false, 'estado', 'sin_sesion', 'hasta', null);
  end if;
  select * into v_perfil from public.profiles where user_id = (select auth.uid());
  if not found then
    return jsonb_build_object('acceso', false, 'estado', 'none', 'hasta', null);
  end if;
  -- El admin siempre puede abrir la app (para probarla y dar soporte)
  if v_perfil.role = 'admin' then
    return jsonb_build_object('acceso', true, 'estado', 'admin', 'hasta', null);
  end if;
  return jsonb_build_object(
    'acceso', private.tiene_acceso(v_perfil),
    'estado', v_perfil.status,
    'hasta', case when v_perfil.status = 'trialing' then v_perfil.trial_ends_at else v_perfil.access_until end
  );
end;
$$;
revoke all on function public.mi_acceso() from public, anon;
grant execute on function public.mi_acceso() to authenticated;
