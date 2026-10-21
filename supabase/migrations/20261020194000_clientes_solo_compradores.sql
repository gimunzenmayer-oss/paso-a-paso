-- La lista de clientes muestra solo personas que pasaron por Hotmart (no cuentas sin compra),
-- y la búsqueda trata % y _ como letras normales.
create or replace function public.admin_clientes(p_buscar text default null, p_limite integer default 50)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  v_patron text := '%' || replace(replace(replace(coalesce(p_buscar, ''), '\', '\\'), '%', '\%'), '_', '\_') || '%';
begin
  perform private.assert_admin();
  return coalesce((
    select jsonb_agg(row_to_json(x)::jsonb order by x.alta desc)
    from (
      select p.id, p.email, p.name nombre, p.status estado, p.cycle ciclo, p.source origen,
             p.created_at alta, p.first_paid_at primer_pago, p.access_until acceso_hasta,
             (select max(e.created_at) from public.event_log e
              where e.customer_id = p.id or (p.user_id is not null and e.user_id = p.user_id)) ultima_actividad
      from public.profiles p
      where p.role = 'customer' and p.status <> 'none'
        and (p_buscar is null or p.email ilike v_patron)
      order by p.created_at desc
      limit least(greatest(coalesce(p_limite, 50), 1), 200)
    ) x), '[]'::jsonb);
end;
$$;
revoke all on function public.admin_clientes(text, integer) from public, anon;
grant execute on function public.admin_clientes(text, integer) to authenticated;
