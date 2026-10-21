-- Las comisiones de Hotmart y afiliados de una venta reembolsada se descuentan, igual que la venta:
-- así "cobraste − comisiones − afiliados" cuadra exacto con lo que Hotmart te liquida.

create or replace function public.admin_panel(p_mes date default null)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  s public.business_settings;
  v_tz text;
  v_cur text;
  v_hoy date;
  v_mes date;
  v_ini timestamptz;
  v_fin timestamptz;
  v_ahora timestamptz := now();

  -- ventas
  v_facturado bigint; v_hotmart bigint; v_afiliados bigint; v_te_paga bigint;
  v_reemb_monto bigint; v_compras int; v_renov int; v_reembolsos int; v_contracargos int;
  v_cancel_vol int; v_cancel_invol int; v_activos_inicio int; v_churn numeric;
  v_mrr bigint; v_pagando int; v_pruebas_mes int; v_trial_base int; v_trial_pagaron int;
  v_otras_monedas jsonb; v_serie jsonb; v_sin_comision int;
  -- ganancia
  v_impuestos bigint; v_ia_usd numeric; v_ia bigint; v_infra bigint; v_email bigint; v_otros bigint;
  v_queda bigint; v_faltan text[] := '{}'; v_usa_ia boolean;
  -- clientes y negocio
  v_clientes jsonb; v_nuevos int; v_regresos int; v_arpu numeric; v_churn_prom numeric;
  v_ltv numeric; v_gasto_total bigint; v_cac numeric; v_canales jsonb;
  -- uso
  v_personas int; v_dau int; v_wau int; v_mau int; v_act_base int; v_act_ok int;
  v_ret jsonb; v_curr_base int; v_curr_ok int; v_core_hoy int; v_core_sem int; v_core_mes int;
  v_eventos jsonb; v_embudo jsonb; v_onb jsonb;
  -- ia
  v_ia_hoy numeric; v_ia_feat jsonb; v_ia_usuarios int;
  -- salud
  v_errores jsonb; v_err_7d int; v_err_top_personas int; v_wh jsonb; v_wh_fallos_24h int; v_wh_ultimo timestamptz;
  v_wh_aplicados_total int;
  -- avisos
  v_avisos jsonb := '[]'::jsonb;
  v_ganancia jsonb;
  v_ventas jsonb;
  v_semana_ini date;
begin
  perform private.assert_admin();

  select * into s from public.business_settings limit 1;
  v_tz := s.timezone;
  v_cur := s.main_currency;
  v_hoy := (v_ahora at time zone v_tz)::date;
  v_mes := date_trunc('month', coalesce(p_mes, v_hoy))::date;
  v_ini := (v_mes::timestamp) at time zone v_tz;
  v_fin := ((v_mes + interval '1 month')::timestamp) at time zone v_tz;

  -- ═══ VENTAS (moneda principal = la de tu liquidación en Hotmart) ═══
  select
    coalesce(sum(case when economic_kind = 'sale' then coalesce(gross_settlement_minor, amount_minor) end), 0),
    coalesce(sum(case when economic_kind = 'sale' then provider_fee_minor else -provider_fee_minor end), 0),
    coalesce(sum(case when economic_kind = 'sale' then affiliate_fee_minor else -affiliate_fee_minor end), 0),
    coalesce(sum(case when economic_kind = 'sale' then coalesce(settlement_amount_minor, amount_minor)
                      else -coalesce(settlement_amount_minor, amount_minor, 0) end), 0),
    coalesce(sum(case when economic_kind <> 'sale' then coalesce(gross_settlement_minor, amount_minor) end), 0),
    count(*) filter (where economic_kind = 'refund'),
    count(*) filter (where economic_kind = 'chargeback'),
    count(*) filter (where settlement_amount_minor is null)
  into v_facturado, v_hotmart, v_afiliados, v_te_paga, v_reemb_monto, v_reembolsos, v_contracargos, v_sin_comision
  from public.payment_transactions
  where coalesce(settlement_currency, currency) = v_cur and occurred_at >= v_ini and occurred_at < v_fin;

  select count(*) filter (where type = 'primer_cobro_confirmado'),
         count(*) filter (where type = 'cobro_renovado'),
         count(*) filter (where type = 'suscripcion_cancelada'),
         count(*) filter (where type = 'suscripcion_expirada'),
         count(*) filter (where type = 'trial_iniciado'),
         count(*) filter (where type = 'cliente_regreso')
  into v_compras, v_renov, v_cancel_vol, v_cancel_invol, v_pruebas_mes, v_regresos
  from public.event_log
  where customer_id is not null and created_at >= v_ini and created_at < v_fin;

  -- Ventas en otras monedas: se muestran aparte, nunca sumadas.
  select coalesce(jsonb_agg(jsonb_build_object('moneda', m, 'te_paga', t, 'ventas', n)), '[]'::jsonb)
  into v_otras_monedas
  from (
    select coalesce(settlement_currency, currency) m,
           sum(case when economic_kind = 'sale' then coalesce(settlement_amount_minor, amount_minor)
                    else -coalesce(settlement_amount_minor, amount_minor) end) t,
           count(*) filter (where economic_kind = 'sale') n
    from public.payment_transactions
    where coalesce(settlement_currency, currency) <> v_cur
      and occurred_at >= v_ini and occurred_at < v_fin
    group by 1
  ) x;

  -- Activos (pagando) al inicio del mes → base del churn.
  select count(*) into v_activos_inicio
  from public.profiles p
  where p.role = 'customer' and private.status_at(p.id, v_ini) in ('active', 'past_due');
  v_churn := private.pct(v_cancel_vol + v_cancel_invol, v_activos_inicio);

  -- MRR: lo que te paga Hotmart por los clientes que hoy están pagando (anual ÷ 12).
  with ultima as (
    select distinct on (t.customer_id) t.customer_id, coalesce(t.settlement_amount_minor, t.amount_minor) settlement_amount_minor, t.cycle
    from public.payment_transactions t
    join public.profiles p on p.id = t.customer_id
    where t.economic_kind = 'sale' and coalesce(t.settlement_currency, t.currency) = v_cur
      and p.status in ('active', 'past_due')
    order by t.customer_id, t.occurred_at desc
  )
  select sum(case when cycle = 'anual' then settlement_amount_minor / 12.0 else settlement_amount_minor end)::bigint,
         count(*)
  into v_mrr, v_pagando
  from ultima;

  -- Prueba gratis → pago (solo pruebas ya terminadas).
  select count(*) filter (where trial_ends_at < v_ahora),
         count(*) filter (where trial_ends_at < v_ahora and first_paid_at is not null)
  into v_trial_base, v_trial_pagaron
  from public.profiles where trial_started_at is not null;

  -- Serie de 12 meses: lo que te pagó Hotmart, neto de reembolsos.
  select coalesce(jsonb_agg(jsonb_build_object('mes', to_char(m, 'YYYY-MM'), 'neto', neto) order by m), '[]'::jsonb)
  into v_serie
  from (
    select g::date m,
           (select sum(case when t.economic_kind = 'sale' then coalesce(t.settlement_amount_minor, t.amount_minor) else -coalesce(t.settlement_amount_minor, t.amount_minor, 0) end)
            from public.payment_transactions t
            where coalesce(t.settlement_currency, t.currency) = v_cur
              and t.occurred_at >= (g::timestamp at time zone v_tz)
              and t.occurred_at < ((g + interval '1 month')::timestamp at time zone v_tz)) neto
    from generate_series(v_mes - interval '11 months', v_mes, interval '1 month') g
  ) x;

  v_ventas := jsonb_build_object(
    'hay_ventas', exists (select 1 from public.payment_transactions),
    'facturado', v_facturado, 'te_paga_hotmart', v_te_paga, 'reembolsado', v_reemb_monto,
    'compras', v_compras, 'renovaciones', v_renov, 'reembolsos', v_reembolsos, 'contracargos', v_contracargos,
    'cancelaciones_voluntarias', v_cancel_vol, 'cancelaciones_involuntarias', v_cancel_invol,
    'activos_inicio_mes', v_activos_inicio, 'churn_pct', v_churn,
    'churn_voluntario_pct', private.pct(v_cancel_vol, v_cancel_vol + v_cancel_invol),
    'churn_involuntario_pct', private.pct(v_cancel_invol, v_cancel_vol + v_cancel_invol),
    'mrr', v_mrr, 'pagando_hoy', v_pagando,
    'pruebas_iniciadas', v_pruebas_mes,
    'prueba_a_pago', jsonb_build_object('pct', private.pct(v_trial_pagaron, v_trial_base), 'base', v_trial_base),
    'otras_monedas', v_otras_monedas,
    'serie', v_serie);

  -- ═══ GANANCIA: lo que te QUEDA ═══
  v_impuestos := case when s.tax_rate_pct is null then null
                      else round((v_facturado - v_reemb_monto) * s.tax_rate_pct / 100.0)::bigint end;
  if v_sin_comision > 0 then v_faltan := array_append(v_faltan, 'comision_hotmart'); end if;
  if s.tax_rate_pct is null then v_faltan := array_append(v_faltan, 'impuestos'); end if;

  v_usa_ia := exists (select 1 from public.ai_calls);
  select sum(cost_usd) into v_ia_usd from public.ai_calls where created_at >= v_ini and created_at < v_fin;
  -- Sin llamadas de IA registradas el costo de IA es 0 real (la app no usa IA).
  v_ia := case when v_cur = 'USD' then round(coalesce(v_ia_usd, 0) * 100)::bigint else null end;
  if v_ia is null then v_faltan := array_append(v_faltan, 'ia_en_otra_moneda'); end if;

  select sum(amount_minor) filter (where kind = 'infra'),
         sum(amount_minor) filter (where kind = 'email'),
         sum(amount_minor) filter (where kind = 'otro')
  into v_infra, v_email, v_otros
  from public.operating_costs where month = v_mes and currency = v_cur;
  if v_infra is null then v_faltan := array_append(v_faltan, 'infra'); end if;
  if v_email is null then v_faltan := array_append(v_faltan, 'email'); end if;

  v_queda := v_te_paga - coalesce(v_impuestos, 0) - coalesce(v_ia, 0)
             - coalesce(v_infra, 0) - coalesce(v_email, 0) - coalesce(v_otros, 0);

  v_ganancia := jsonb_build_object(
    'facturado', v_facturado - v_reemb_monto,
    'hotmart', v_hotmart, 'afiliados', v_afiliados,
    'impuestos', v_impuestos, 'tasa_impuestos_pct', s.tax_rate_pct,
    'ia', v_ia, 'usa_ia', v_usa_ia,
    'infra', v_infra, 'email', v_email, 'otros', v_otros,
    'queda', v_queda,
    'margen_pct', private.pct(v_queda, v_facturado - v_reemb_monto),
    'faltan', to_jsonb(v_faltan),
    'estimacion', cardinality(v_faltan) > 0);

  -- ═══ CLIENTES ═══
  select jsonb_build_object(
    'total', count(*) filter (where status <> 'none'),
    'en_prueba', count(*) filter (where status = 'trialing'),
    'activos', count(*) filter (where status = 'active'),
    'pago_atrasado', count(*) filter (where status = 'past_due'),
    'cancelados', count(*) filter (where status = 'cancelled'),
    'expirados', count(*) filter (where status = 'expired'),
    'reembolsados', count(*) filter (where status in ('refunded', 'chargeback')),
    'nuevos_mes', count(*) filter (where first_paid_at >= v_ini and first_paid_at < v_fin))
  into v_clientes
  from public.profiles where role = 'customer';
  v_nuevos := (v_clientes ->> 'nuevos_mes')::int;
  v_clientes := v_clientes || jsonb_build_object(
    'regresos_mes', v_regresos,
    'pct_regresos', private.pct(v_regresos, v_nuevos + v_regresos));

  -- ═══ NEGOCIO: LTV, CAC, payback, por canal ═══
  v_arpu := case when coalesce(v_pagando, 0) > 0 then v_mrr::numeric / v_pagando end;
  -- churn promedio de los últimos 3 meses con base > 0
  select avg(c) into v_churn_prom from (
    select private.pct(
      (select count(*) from public.event_log e
       where e.type in ('suscripcion_cancelada', 'suscripcion_expirada')
         and e.created_at >= (g::timestamp at time zone v_tz)
         and e.created_at < ((g + interval '1 month')::timestamp at time zone v_tz)),
      (select count(*) from public.profiles p
       where p.role = 'customer' and private.status_at(p.id, (g::timestamp at time zone v_tz)) in ('active', 'past_due'))) c
    from generate_series(v_mes - interval '2 months', v_mes, interval '1 month') g
  ) x where c is not null;
  v_ltv := case when v_arpu is not null and coalesce(v_churn_prom, 0) > 0 then v_arpu / (v_churn_prom / 100.0) end;

  with gasto as (
    select lower(split_part(channel, ':', 1)) canal,
           sum(amount_minor * (least(period_end, (v_mes + interval '1 month - 1 day')::date) - greatest(period_start, v_mes) + 1)::numeric
               / (period_end - period_start + 1)) monto
    from public.acquisition_spend
    where currency = v_cur and period_start <= (v_mes + interval '1 month - 1 day')::date and period_end >= v_mes
    group by 1
  ),
  nuevos as (
    select lower(split_part(coalesce(source, 'directo'), ':', 1)) canal, count(*) n
    from public.profiles
    where role = 'customer' and first_paid_at >= v_ini and first_paid_at < v_fin
    group by 1
  ),
  ingresos as (
    select lower(split_part(coalesce(t.source, 'directo'), ':', 1)) canal,
           sum(case when t.economic_kind = 'sale' then coalesce(t.settlement_amount_minor, t.amount_minor) else -coalesce(t.settlement_amount_minor, t.amount_minor, 0) end) monto
    from public.payment_transactions t
    where coalesce(t.settlement_currency, t.currency) = v_cur and t.occurred_at >= v_ini and t.occurred_at < v_fin
    group by 1
  ),
  canales as (
    select canal from gasto union select canal from nuevos union select canal from ingresos
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'canal', c.canal,
           'gasto', round(g.monto)::bigint,
           'clientes_nuevos', coalesce(n.n, 0),
           'ingresos', i.monto,
           'cac', case when coalesce(n.n, 0) > 0 and g.monto is not null then round(g.monto / n.n) end,
           'ltv', case when v_ltv is not null then round(v_ltv) end,
           'ratio', case when coalesce(n.n, 0) > 0 and coalesce(g.monto, 0) > 0 and v_ltv is not null
                         then round(v_ltv / (g.monto / n.n), 1) end,
           'ganancia', case when g.monto is not null or i.monto is not null
                            then coalesce(i.monto, 0) - round(coalesce(g.monto, 0))::bigint end
         ) order by coalesce(i.monto, 0) desc), '[]'::jsonb),
         round(sum(g.monto))::bigint
  into v_canales, v_gasto_total
  from canales c
  left join gasto g using (canal)
  left join nuevos n using (canal)
  left join ingresos i using (canal);

  v_cac := case when v_nuevos > 0 and v_gasto_total is not null then v_gasto_total::numeric / v_nuevos end;

  -- ═══ USO DE LA APP (personas = teléfonos anónimos, o cuenta cuando exista login) ═══
  with ev as (
    select coalesce(user_id::text, device_id) persona, type, created_at,
           (created_at at time zone v_tz)::date dia
    from public.event_log
    where device_id is not null and not is_qa
  )
  select count(distinct persona),
         count(distinct persona) filter (where dia = v_hoy),
         count(distinct persona) filter (where dia > v_hoy - 7),
         count(distinct persona) filter (where dia > v_hoy - 30),
         count(*) filter (where type = 'rutina_paso_completado' and dia = v_hoy),
         count(*) filter (where type = 'rutina_paso_completado' and dia > v_hoy - 7),
         count(*) filter (where type = 'rutina_paso_completado' and dia > v_hoy - 30)
  into v_personas, v_dau, v_wau, v_mau, v_core_hoy, v_core_sem, v_core_mes
  from ev;

  -- Activación: de quienes abrieron la app por 1ª vez (últimos 30 días, hace ≥1 día),
  -- cuántos terminaron una rutina en sus primeras 24 horas.
  with nuevos as (
    select device_id, created_at from public.event_log
    where type = 'app_abierta' and not is_qa
      and created_at >= v_ahora - interval '30 days' and created_at < v_ahora - interval '1 day'
  )
  select count(*),
         count(*) filter (where exists (
           select 1 from public.event_log e
           where e.device_id = n.device_id and e.type = 'rutina_completada'
             and e.created_at between n.created_at and n.created_at + interval '24 hours'))
  into v_act_base, v_act_ok
  from nuevos n;

  -- Retención D1 / D7 / D30: volvió exactamente ese día después de su primera vez.
  with primera as (
    select device_id, (created_at at time zone v_tz)::date d0 from public.event_log
    where type = 'app_abierta' and not is_qa and created_at >= v_ahora - interval '120 days'
  ),
  dias as (select unnest(array[1, 7, 30]) n)
  select jsonb_object_agg('d' || n, jsonb_build_object('pct', private.pct(ok, base), 'base', base))
  into v_ret
  from (
    select dd.n,
           count(*) filter (where p.d0 <= v_hoy - dd.n) base,
           count(*) filter (where p.d0 <= v_hoy - dd.n and exists (
             select 1 from public.event_log e
             where e.device_id = p.device_id and e.type = 'sesion_iniciada'
               and (e.created_at at time zone v_tz)::date = p.d0 + dd.n)) ok
    from dias dd cross join primera p
    group by dd.n
  ) r;
  if v_ret is null then
    v_ret := jsonb_build_object('d1', jsonb_build_object('pct', null, 'base', 0),
                                'd7', jsonb_build_object('pct', null, 'base', 0),
                                'd30', jsonb_build_object('pct', null, 'base', 0));
  end if;

  -- CURR semanal: de los activos la semana pasada (completa), cuántos volvieron esta última semana completa.
  v_semana_ini := date_trunc('week', v_hoy)::date - 7;   -- lunes de la última semana completa
  with act as (
    select distinct device_id, date_trunc('week', (created_at at time zone v_tz))::date sem
    from public.event_log
    where type = 'sesion_iniciada' and not is_qa and device_id is not null
      and created_at >= (((v_semana_ini - 7)::timestamp) at time zone v_tz)
  )
  select count(*) filter (where a.sem = v_semana_ini - 7),
         count(*) filter (where a.sem = v_semana_ini - 7 and exists (
           select 1 from act b where b.device_id = a.device_id and b.sem = v_semana_ini))
  into v_curr_base, v_curr_ok
  from act a;

  select coalesce(jsonb_agg(jsonb_build_object('tipo', type, 'veces', veces, 'personas', personas) order by veces desc), '[]'::jsonb)
  into v_eventos
  from (
    select type, count(*) veces, count(distinct coalesce(user_id::text, device_id)) personas
    from public.event_log
    where device_id is not null and not is_qa and created_at >= v_ahora - interval '30 days'
    group by type
  ) x;

  select jsonb_agg(jsonb_build_object('paso', paso, 'personas', personas) order by orden)
  into v_embudo
  from (
    select orden, paso,
           (select count(distinct device_id) from public.event_log
            where type = tipo and not is_qa and created_at >= v_ahora - interval '30 days') personas
    from (values (1, 'Vieron la página', 'landing_vista'),
                 (2, 'Tocaron "Probar gratis"', 'landing_cta_clic'),
                 (3, 'Abrieron la app', 'app_abierta'),
                 (4, 'Terminaron una rutina', 'rutina_completada')) v(orden, paso, tipo)
  ) x;

  select case when sum(personas) = 0 then null
              else jsonb_agg(jsonb_build_object('paso', paso, 'personas', personas) order by orden) end
  into v_onb
  from (
    select orden, paso,
           (select count(distinct device_id) from public.event_log
            where type = tipo and not is_qa and created_at >= v_ahora - interval '30 days') personas
    from (values (1, 'Empezaron la bienvenida', 'onboarding_iniciado'),
                 (2, 'Terminaron la bienvenida', 'onboarding_completado'),
                 (3, 'Vieron los precios', 'paywall_visto'),
                 (4, 'Fueron a pagar', 'checkout_iniciado')) v(orden, paso, tipo)
  ) x;

  -- ═══ IA (31: costo real desde ai_calls) ═══
  select sum(cost_usd) into v_ia_hoy from public.ai_calls
  where (created_at at time zone v_tz)::date = v_hoy;
  select count(distinct user_id) into v_ia_usuarios from public.ai_calls where created_at >= v_ini and created_at < v_fin;
  select coalesce(jsonb_agg(jsonb_build_object('feature', feature, 'costo_usd', c, 'llamadas', n) order by c desc), '[]'::jsonb)
  into v_ia_feat
  from (select feature, round(sum(cost_usd), 4) c, count(*) n from public.ai_calls
        where created_at >= v_ini and created_at < v_fin group by feature) x;

  -- ═══ SALUD: errores y avisos de Hotmart ═══
  select coalesce(jsonb_agg(jsonb_build_object('mensaje', message, 'pantalla', screen, 'veces', veces,
                                               'personas', personas, 'ultima', ultima) order by personas desc, veces desc), '[]'::jsonb),
         coalesce(sum(veces), 0),
         coalesce(max(personas_hoy), 0)
  into v_errores, v_err_7d, v_err_top_personas
  from (
    select message, screen, count(*) veces, count(distinct coalesce(user_id::text, device_id)) personas, max(created_at) ultima,
           count(distinct coalesce(user_id::text, device_id)) filter (where (created_at at time zone v_tz)::date = v_hoy) personas_hoy
    from public.error_log
    where created_at >= v_ahora - interval '7 days'
    group by message, screen
    order by 4 desc, 3 desc
    limit 10
  ) x;

  select max(received_at) filter (where result = 'applied'),
         count(*) filter (where result in ('error', 'unauthorized') and received_at >= v_ahora - interval '24 hours'),
         count(*) filter (where result = 'applied')
  into v_wh_ultimo, v_wh_fallos_24h, v_wh_aplicados_total
  from public.webhook_log;

  select jsonb_build_object(
    'ultimo_aplicado', v_wh_ultimo,
    'recibidos_7d', count(*) filter (where received_at >= v_ahora - interval '7 days'),
    'aplicados_7d', count(*) filter (where result = 'applied' and received_at >= v_ahora - interval '7 days'),
    'duplicados_7d', count(*) filter (where result = 'duplicate' and received_at >= v_ahora - interval '7 days'),
    'rechazados_7d', count(*) filter (where result = 'illegal' and received_at >= v_ahora - interval '7 days'),
    'no_autorizados_24h', count(*) filter (where result = 'unauthorized' and received_at >= v_ahora - interval '24 hours'),
    'errores_24h', count(*) filter (where result = 'error' and received_at >= v_ahora - interval '24 hours'),
    'nunca_recibido', count(*) = 0)
  into v_wh
  from public.webhook_log;

  -- ═══ AVISOS (qué pasa → por qué importa → qué hacer) ═══
  if v_ia is not null and (v_facturado - v_reemb_monto) > 0 and v_ia > 0.20 * (v_facturado - v_reemb_monto) then
    v_avisos := v_avisos || jsonb_build_object('nivel', 'alto', 'tipo', 'ia_cara',
      'que', format('La IA se está comiendo el %s%% de lo que cobras.', round(100.0 * v_ia / (v_facturado - v_reemb_monto))),
      'porque', 'Cada venta te deja menos plata de la que debería.',
      'hacer', 'Revisa los límites de uso o el precio.');
  end if;
  if v_wh_fallos_24h >= 3 then
    v_avisos := v_avisos || jsonb_build_object('nivel', 'alto', 'tipo', 'webhook',
      'que', format('Hotmart intentó avisarte %s veces en 24 horas y falló.', v_wh_fallos_24h),
      'porque', 'Puede haber clientes que pagaron y no reciben su acceso (o al revés).',
      'hacer', 'Revisa la conexión con Hotmart (Herramientas → Webhook) y escríbeme si sigue.');
  elsif v_wh_aplicados_total > 0 and v_wh_ultimo < v_ahora - interval '7 days' then
    v_avisos := v_avisos || jsonb_build_object('nivel', 'medio', 'tipo', 'webhook',
      'que', format('Hace %s días que no llega ningún aviso de pago de Hotmart.', extract(day from v_ahora - v_wh_ultimo)::int),
      'porque', 'Si hubo ventas en ese tiempo, la app no se enteró.',
      'hacer', 'Compara con tus ventas en Hotmart. Si hay ventas, la conexión está rota.');
  end if;
  if (v_cancel_vol + v_cancel_invol) >= 3 and v_cancel_invol > 0.5 * (v_cancel_vol + v_cancel_invol) then
    v_avisos := v_avisos || jsonb_build_object('nivel', 'alto', 'tipo', 'churn_involuntario',
      'que', format('%s de %s bajas del mes fueron por pagos que fallaron.', v_cancel_invol, v_cancel_vol + v_cancel_invol),
      'porque', 'Son clientes que SÍ querían pagar. Recuperarlos es lo más barato que existe.',
      'hacer', 'Activa los recordatorios de pago fallido y revisa los reintentos en Hotmart.');
  end if;
  -- Un canal pierde plata si su LTV:CAC < 1, o si gastaste y lo que trajo no cubre el gasto.
  v_avisos := v_avisos || coalesce((
    select jsonb_agg(jsonb_build_object('nivel', 'alto', 'tipo', 'canal_pierde',
        'que', format('El canal "%s" te trae clientes que cuestan más de lo que dejan.', c ->> 'canal'),
        'porque', 'Cada peso que pones ahí hoy vuelve con menos.',
        'hacer', 'Pausa o baja el gasto en ese canal hasta revisar el anuncio o la oferta.'))
    from jsonb_array_elements(v_canales) c
    where (c ->> 'ratio')::numeric < 1
       or (coalesce((c ->> 'gasto')::numeric, 0) > 0 and (c ->> 'ganancia')::numeric < 0)), '[]'::jsonb);
  if (v_facturado - v_reemb_monto) > 0 and v_queda <= 0 then
    v_avisos := v_avisos || jsonb_build_object('nivel', 'alto', 'tipo', 'margen_negativo',
      'que', 'Este mes estás perdiendo plata: los costos superan lo que te paga Hotmart.',
      'porque', 'Vender más, así como está, empeora la pérdida.',
      'hacer', 'Revisa costos o precio antes de invertir en anuncios.');
  end if;
  if v_err_top_personas >= 5 then
    v_avisos := v_avisos || jsonb_build_object('nivel', 'medio', 'tipo', 'errores',
      'que', format('%s personas chocaron con el mismo error hoy.', v_err_top_personas),
      'porque', 'Una falla repetida hace que la gente deje de usar la app.',
      'hacer', 'Mira el error más común en "Salud" y avísame.');
  end if;
  if v_wh_aplicados_total > 0 and cardinality(s.hotmart_product_ids) = 0 then
    v_avisos := v_avisos || jsonb_build_object('nivel', 'medio', 'tipo', 'catalogo',
      'que', 'Aún no registraste el código de tu producto de Hotmart.',
      'porque', 'Sin eso, una compra de otro producto podría dar acceso a esta app.',
      'hacer', 'Escríbelo en "Costos y ajustes".');
  end if;

  return jsonb_build_object(
    'mes', to_char(v_mes, 'YYYY-MM'),
    'moneda', v_cur,
    'zona', v_tz,
    'generado', v_ahora,
    'avisos', v_avisos,
    'ventas', v_ventas,
    'ganancia', v_ganancia,
    'clientes', v_clientes,
    'negocio', jsonb_build_object(
      'arpu', round(v_arpu), 'churn_promedio_pct', round(v_churn_prom, 1), 'ltv', round(v_ltv),
      'gasto_adquisicion', v_gasto_total, 'cac', round(v_cac),
      'ltv_cac', case when v_ltv is not null and coalesce(v_cac, 0) > 0 then round(v_ltv / v_cac, 1) end,
      'payback_meses', case when v_cac is not null and coalesce(v_arpu, 0) > 0 then round(v_cac / v_arpu, 1) end,
      'canales', v_canales),
    'usuarios', jsonb_build_object(
      'personas', v_personas, 'hoy', v_dau, 'semana', v_wau, 'mes', v_mau,
      'activacion', jsonb_build_object('pct', private.pct(v_act_ok, v_act_base), 'base', v_act_base),
      'retencion', v_ret,
      'curr', jsonb_build_object('pct', private.pct(v_curr_ok, v_curr_base), 'base', v_curr_base),
      'pagadores_fantasma', null),
    'uso', jsonb_build_object(
      'accion_principal', jsonb_build_object('hoy', v_core_hoy, 'semana', v_core_sem, 'mes', v_core_mes),
      'eventos', v_eventos, 'embudo', v_embudo, 'onboarding', v_onb),
    'ia', jsonb_build_object(
      'usa_ia', v_usa_ia, 'costo_mes_usd', v_ia_usd, 'costo_hoy_usd', v_ia_hoy,
      'por_feature', v_ia_feat,
      'por_usuario_usd', case when v_ia_usuarios > 0 then round(v_ia_usd / v_ia_usuarios, 4) end),
    'salud', jsonb_build_object(
      'errores', v_errores, 'errores_7d', v_err_7d, 'webhook', v_wh,
      'sentry', null, 'diferencias_hotmart', null)
  );
end;
$$;
revoke all on function public.admin_panel(date) from public, anon;
grant execute on function public.admin_panel(date) to authenticated;
