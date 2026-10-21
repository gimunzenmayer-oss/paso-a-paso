-- Gasto en anuncios: un solo monto por canal y período. Anotar de nuevo el mismo canal y mes lo reemplaza
-- (antes se sumaba dos veces sin aviso). En producción la tabla estaba vacía al crear el índice.
create unique index if not exists acquisition_spend_uno_por_periodo
  on public.acquisition_spend (channel, period_start, period_end, currency);

create or replace function public.admin_guardar_gasto(
  p_canal text, p_monto_minor bigint, p_moneda text, p_desde date, p_hasta date, p_nota text default null)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  perform private.assert_admin();
  insert into public.acquisition_spend (channel, amount_minor, currency, period_start, period_end, note)
  values (lower(trim(p_canal)), p_monto_minor, upper(p_moneda), p_desde, p_hasta, left(p_nota, 200))
  on conflict (channel, period_start, period_end, currency)
  do update set amount_minor = excluded.amount_minor, note = excluded.note;
end;
$$;
revoke all on function public.admin_guardar_gasto(text, bigint, text, date, date, text) from public, anon;
grant execute on function public.admin_guardar_gasto(text, bigint, text, date, date, text) to authenticated;
