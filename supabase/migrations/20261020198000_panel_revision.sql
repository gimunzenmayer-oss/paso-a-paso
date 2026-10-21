-- Correcciones de la revisión visual del panel (2026-10-20):
-- 1) Quitar acceso a mano corta el acceso YA (antes una clienta cancelada conservaba su "acceso hasta").
-- 2) Cada cambio manual guarda cómo estaba antes, para poder deshacerlo.
-- 3) La lista de clientes se puede filtrar por situación y dice cuántas hay en total.
-- 4) Servidores y correos son UN monto por mes: anotarlo de nuevo lo reemplaza (antes se sumaban duplicados).

-- ── 2) Foto del estado anterior en el historial ──
alter table public.subscription_history add column if not exists anterior jsonb;

-- ── 1 y 2) Cambio manual de acceso ──
create or replace function public.admin_cambiar_estado(p_cliente uuid, p_estado text, p_motivo text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare v public.profiles;
begin
  perform private.assert_admin();
  if p_estado not in ('active', 'cancelled') then
    raise exception 'estado no permitido';
  end if;
  if coalesce(length(trim(p_motivo)), 0) < 3 then
    raise exception 'escribe el motivo';
  end if;
  select * into v from public.profiles where id = p_cliente and role = 'customer' for update;
  if not found then
    raise exception 'cliente no encontrado';
  end if;
  update public.profiles
     set status = p_estado,
         plan = case when p_estado = 'active' then 'pro' else 'free' end,
         access_until = case when p_estado = 'cancelled' then now() else null end,
         churned_at = case when p_estado = 'cancelled' then now() else null end,
         churn_kind = null
   where id = p_cliente;
  insert into public.subscription_history (customer_id, status, reason, anterior)
  values (p_cliente, p_estado, 'manual: ' || left(trim(p_motivo), 120),
          jsonb_build_object('status', v.status, 'plan', v.plan, 'access_until', v.access_until,
                             'churned_at', v.churned_at, 'churn_kind', v.churn_kind));
end;
$$;
revoke all on function public.admin_cambiar_estado(uuid, text, text) from public, anon;
grant execute on function public.admin_cambiar_estado(uuid, text, text) to authenticated;

-- Deshacer el último cambio manual de una clienta (solo si nada cambió después).
create or replace function public.admin_deshacer_cambio(p_cliente uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare h public.subscription_history; v_ultimo bigint;
begin
  perform private.assert_admin();
  perform 1 from public.profiles where id = p_cliente and role = 'customer' for update;
  if not found then
    raise exception 'cliente no encontrado';
  end if;
  select max(id) into v_ultimo from public.subscription_history where customer_id = p_cliente;
  select * into h from public.subscription_history where id = v_ultimo;
  if h.anterior is null or h.reason not like 'manual: %' then
    raise exception 'no hay un cambio manual que deshacer';
  end if;
  update public.profiles
     set status = h.anterior ->> 'status',
         plan = h.anterior ->> 'plan',
         access_until = (h.anterior ->> 'access_until')::timestamptz,
         churned_at = (h.anterior ->> 'churned_at')::timestamptz,
         churn_kind = h.anterior ->> 'churn_kind'
   where id = p_cliente;
  insert into public.subscription_history (customer_id, status, reason)
  values (p_cliente, h.anterior ->> 'status', 'deshecho: ' || h.reason);
end;
$$;
revoke all on function public.admin_deshacer_cambio(uuid) from public, anon;
grant execute on function public.admin_deshacer_cambio(uuid) to authenticated;

-- ── 3) Clientes con filtro por situación y total ──
-- p_estado: 'pagando' | 'prueba' | 'problema' (pago atrasado o vencido) | 'sin_acceso' (canceló, reembolso, contracargo)
-- Nombre nuevo para no borrar la versión anterior (admin_clientes queda sin uso).
create or replace function public.admin_lista_clientes(p_buscar text default null, p_limite integer default 50, p_estado text default null)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  v_patron text := '%' || replace(replace(replace(coalesce(p_buscar, ''), '\', '\\'), '%', '\%'), '_', '\_') || '%';
  v_estados text[] := case p_estado
    when 'pagando' then array['active']
    when 'prueba' then array['trialing']
    when 'problema' then array['past_due', 'expired']
    when 'sin_acceso' then array['cancelled', 'refunded', 'chargeback']
    else null end;
  v_total int;
  v_filas jsonb;
  v_conteo jsonb;
begin
  perform private.assert_admin();

  select count(*) filter (where status <> 'none'),
         jsonb_build_object(
           'pagando', count(*) filter (where status = 'active'),
           'prueba', count(*) filter (where status = 'trialing'),
           'problema', count(*) filter (where status in ('past_due', 'expired')),
           'sin_acceso', count(*) filter (where status in ('cancelled', 'refunded', 'chargeback')))
  into v_total, v_conteo
  from public.profiles where role = 'customer';

  select coalesce(jsonb_agg(row_to_json(x)::jsonb order by x.alta desc), '[]'::jsonb)
  into v_filas
  from (
    select p.id, p.email, p.name nombre, p.status estado, p.cycle ciclo, p.source origen,
           p.created_at alta, p.first_paid_at primer_pago, p.access_until acceso_hasta,
           (select max(e.created_at) from public.event_log e
            where e.customer_id = p.id or (p.user_id is not null and e.user_id = p.user_id)) ultima_actividad,
           (select h.reason like 'manual: %' and h.anterior is not null
            from public.subscription_history h where h.customer_id = p.id
            order by h.id desc limit 1) se_puede_deshacer
    from public.profiles p
    where p.role = 'customer' and p.status <> 'none'
      and (p_buscar is null or p.email ilike v_patron)
      and (v_estados is null or p.status = any(v_estados))
    order by p.created_at desc
    limit least(greatest(coalesce(p_limite, 50), 1), 200)
  ) x;

  return jsonb_build_object('total', v_total, 'conteo', v_conteo, 'filas', v_filas);
end;
$$;
revoke all on function public.admin_lista_clientes(text, integer, text) from public, anon;
grant execute on function public.admin_lista_clientes(text, integer, text) to authenticated;

-- ── 4) Un monto de servidores y uno de correos por mes ──
-- (En producción la tabla estaba vacía al aplicar esto, así que no había repetidos que limpiar.)
create unique index if not exists operating_costs_uno_por_mes
  on public.operating_costs (kind, month, currency) where kind in ('infra', 'email');

create or replace function public.admin_guardar_costo(
  p_tipo text, p_monto_minor bigint, p_moneda text, p_mes date, p_nota text default null)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  perform private.assert_admin();
  if p_tipo in ('infra', 'email') then
    insert into public.operating_costs (kind, amount_minor, currency, month, note)
    values (p_tipo, p_monto_minor, upper(p_moneda), date_trunc('month', p_mes)::date, left(p_nota, 200))
    on conflict (kind, month, currency) where kind in ('infra', 'email')
    do update set amount_minor = excluded.amount_minor, note = excluded.note, created_at = now();
  else
    insert into public.operating_costs (kind, amount_minor, currency, month, note)
    values (p_tipo, p_monto_minor, upper(p_moneda), date_trunc('month', p_mes)::date, left(p_nota, 200));
  end if;
end;
$$;
revoke all on function public.admin_guardar_costo(text, bigint, text, date, text) from public, anon;
grant execute on function public.admin_guardar_costo(text, bigint, text, date, text) to authenticated;
