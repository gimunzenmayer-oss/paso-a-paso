-- La lista de clientes dice si cada una puede entrar hoy, calculado en la base con su reloj
-- (así la pantalla no decide con la hora del servidor web).
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
           -- Puede entrar: paga, prueba o pago atrasado; o canceló y su período pagado no terminó.
           (p.status in ('trialing', 'active', 'past_due')
            or (p.status = 'cancelled' and p.access_until > now())) tiene_acceso,
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
