-- Entrada de datos al panel: uso de la app, errores y avisos de pago de Hotmart.
-- Todas exigen la llave de ingesta (solo la conoce el servidor en Vercel; aquí se guarda su hash).
-- El navegador nunca llama a estas funciones directo: pasa por /api/* del servidor.

-- ─── Uso de la app (event_log) ────────────────────────────────────────────────────
create or replace function public.ingest_event(
  p_key text,
  p_type text,
  p_device_id text,
  p_session_id text default null,
  p_source text default null,
  p_is_qa boolean default false,
  p_props jsonb default '{}'::jsonb
)
returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  v_tz text := (select timezone from public.business_settings limit 1);
  v_recent integer;
  v_source text := lower(left(coalesce(p_source, ''), 40));
begin
  if not private.ingest_key_ok(p_key) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  -- Contrato de eventos (36): solo nombres conocidos. Lo demás se descarta.
  if p_type not in (
    'landing_vista', 'landing_cta_clic',
    'app_abierta', 'sesion_iniciada',
    'rutina_paso_completado', 'rutina_completada',
    'calma_usada', 'tablero_usado', 'historia_leida', 'diario_nota_guardada',
    'informe_abierto', 'guia_ficha_abierta',
    'onboarding_iniciado', 'onboarding_paso_completado', 'onboarding_completado', 'onboarding_abandonado',
    'paywall_visto', 'paywall_plan_elegido', 'checkout_iniciado'
  ) then
    return false;
  end if;

  if p_device_id is null or length(p_device_id) > 64 or p_device_id !~ '^[A-Za-z0-9_-]+$' then
    return false;
  end if;
  if p_session_id is not null and (length(p_session_id) > 64 or p_session_id !~ '^[A-Za-z0-9_-]+$') then
    p_session_id := null;
  end if;
  if v_source !~ '^[a-z0-9_:.-]*$' or v_source = '' then
    v_source := null;
  end if;
  if p_props is null or jsonb_typeof(p_props) <> 'object' or pg_column_size(p_props) > 2048 then
    p_props := '{}'::jsonb;
  end if;

  -- Freno anti-abuso: máx. 60 eventos por minuto por teléfono.
  select count(*) into v_recent from public.event_log
  where device_id = p_device_id and created_at > now() - interval '1 minute';
  if v_recent >= 60 then
    return false;
  end if;

  -- app_abierta = una vez en la vida del teléfono; sesion_iniciada = una vez por día (36).
  if p_type = 'app_abierta' and exists (
    select 1 from public.event_log where device_id = p_device_id and type = 'app_abierta'
  ) then
    return false;
  end if;
  if p_type = 'sesion_iniciada' and exists (
    select 1 from public.event_log
    where device_id = p_device_id and type = 'sesion_iniciada'
      and (created_at at time zone v_tz)::date = (now() at time zone v_tz)::date
  ) then
    return false;
  end if;

  insert into public.event_log (type, device_id, session_id, source, is_qa, props)
  values (p_type, p_device_id, p_session_id, v_source, coalesce(p_is_qa, false), p_props);
  return true;
end;
$$;
revoke all on function public.ingest_event(text, text, text, text, text, boolean, jsonb) from public, authenticated;
grant execute on function public.ingest_event(text, text, text, text, text, boolean, jsonb) to anon;

-- ─── Errores de la app ────────────────────────────────────────────────────────────
create or replace function public.ingest_error(
  p_key text,
  p_message text,
  p_context text default null,
  p_screen text default null,
  p_device_id text default null
)
returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  v_recent integer;
begin
  if not private.ingest_key_ok(p_key) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  if p_message is null or length(trim(p_message)) = 0 then
    return false;
  end if;
  if p_device_id is not null and (length(p_device_id) > 64 or p_device_id !~ '^[A-Za-z0-9_-]+$') then
    p_device_id := null;
  end if;

  select count(*) into v_recent from public.error_log
  where created_at > now() - interval '1 minute'
    and (device_id = p_device_id or (p_device_id is null and device_id is null));
  if v_recent >= 20 then
    return false;
  end if;

  insert into public.error_log (message, context, screen, device_id)
  values (left(p_message, 300), left(p_context, 200), left(p_screen, 60), p_device_id);
  return true;
end;
$$;
revoke all on function public.ingest_error(text, text, text, text, text) from public, authenticated;
grant execute on function public.ingest_error(text, text, text, text, text) to anon;

-- ─── Webhook de Hotmart ───────────────────────────────────────────────────────────
-- El servidor ya verificó el hottok (tiempo constante). Aquí: idempotencia + catálogo +
-- máquina de estados (18 §4) + ledger económico (18 §3B), todo en UNA transacción.
create or replace function public.log_webhook_attempt(p_key text, p_result text, p_type text, p_detail text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not private.ingest_key_ok(p_key) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  if p_result not in ('unauthorized', 'error', 'ignored') then
    return;
  end if;
  -- Un atacante podría inundar el log: tope de 200 registros de fallo por hora.
  if (select count(*) from public.webhook_log
      where result = p_result and received_at > now() - interval '1 hour') >= 200 then
    return;
  end if;
  insert into public.webhook_log (type, result, detail)
  values (left(p_type, 60), p_result, left(p_detail, 200));
end;
$$;
revoke all on function public.log_webhook_attempt(text, text, text, text) from public, authenticated;
grant execute on function public.log_webhook_attempt(text, text, text, text) to anon;

create or replace function public.ingest_hotmart(
  p_key text,
  p_event_id text,
  p_event_type text,
  p_payload_hash text,
  p_payload jsonb
)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  d jsonb := coalesce(p_payload -> 'data', '{}'::jsonb);
  v_settings public.business_settings;
  v_email text := lower(nullif(trim(coalesce(
    d -> 'buyer' ->> 'email', d -> 'subscriber' ->> 'email', p_payload ->> 'email')), ''));
  v_name text := coalesce(d -> 'buyer' ->> 'name', d -> 'subscriber' ->> 'name');
  v_sub_code text := coalesce(d -> 'subscription' -> 'subscriber' ->> 'code', d -> 'subscriber' ->> 'code');
  v_product text := coalesce(d -> 'product' ->> 'id', d -> 'product' ->> 'ucode');
  v_tx text := d -> 'purchase' ->> 'transaction';
  v_price numeric;
  v_currency text := upper(coalesce(d -> 'purchase' -> 'price' ->> 'currency_value', 'USD'));
  v_offer text := d -> 'purchase' -> 'offer' ->> 'code';
  v_plan_name text := coalesce(d -> 'subscription' -> 'plan' ->> 'name', d -> 'plan' ->> 'name', '');
  v_is_sub boolean := (d ? 'subscription') or v_sub_code is not null;
  v_when timestamptz;
  v_cycle text;
  v_source text;
  v_aff text := d -> 'affiliates' -> 0 ->> 'affiliate_code';
  v_prod_val numeric; v_prod_cur text;
  v_mkt_val numeric; v_mkt_cur text;
  v_aff_val numeric; v_aff_cur text;
  v_all_val numeric;
  v_cust public.profiles;
  v_prev text;
  v_new text;
  v_kind text;
  v_next_charge timestamptz;
  v_result text := 'applied';
  v_rows integer := 0;
  v_first_before timestamptz;
begin
  if not private.ingest_key_ok(p_key) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  select * into v_settings from public.business_settings limit 1;

  -- (a) Idempotencia: Hotmart reenvía eventos.
  begin
    insert into public.processed_events (event_id, event_type, payload_hash)
    values (p_event_id, p_event_type, p_payload_hash);
  exception when unique_violation then
    insert into public.webhook_log (event_id, type, result) values (p_event_id, p_event_type, 'duplicate');
    return jsonb_build_object('status', 'duplicate');
  end;

  -- (b) Catálogo: si ya registraste tus productos, un producto ajeno se rechaza.
  if cardinality(v_settings.hotmart_product_ids) > 0 and (v_product is null or not v_product = any (v_settings.hotmart_product_ids)) then
    insert into public.webhook_log (event_id, type, result, detail)
    values (p_event_id, p_event_type, 'illegal', 'producto desconocido: ' || coalesce(v_product, '(sin id)'));
    return jsonb_build_object('status', 'illegal_product');
  end if;

  -- (c) Qué estado corresponde a este evento.
  v_price := nullif(d -> 'purchase' -> 'price' ->> 'value', '')::numeric;
  v_new := case p_event_type
    when 'PURCHASE_APPROVED' then case when v_is_sub and coalesce(v_price, 0) = 0 then 'trialing' else 'active' end
    when 'PURCHASE_COMPLETE' then 'active'
    when 'PURCHASE_DELAYED' then 'past_due'
    when 'SUBSCRIPTION_CANCELLATION' then 'cancelled'
    when 'PURCHASE_EXPIRED' then 'expired'
    when 'PURCHASE_REFUNDED' then 'refunded'
    when 'PURCHASE_CHARGEBACK' then 'chargeback'
    else null end;

  if v_new is null and p_event_type <> 'SWITCH_PLAN' then
    insert into public.webhook_log (event_id, type, result, detail) values (p_event_id, p_event_type, 'ignored', 'evento sin efecto');
    return jsonb_build_object('status', 'ignored');
  end if;

  v_when := coalesce(
    to_timestamp(nullif(d -> 'purchase' ->> 'approved_date', '')::double precision / 1000),
    to_timestamp(nullif(p_payload ->> 'creation_date', '')::double precision / 1000),
    now());
  v_next_charge := to_timestamp(nullif(coalesce(d ->> 'date_next_charge', d -> 'purchase' ->> 'date_next_charge'), '')::double precision / 1000);

  v_cycle := case
    when v_plan_name ~* '(anual|annual|year|año|ano)' then 'anual'
    when v_is_sub then 'mensual'
    else null end;

  -- Origen del cliente (36): sck/src del checkout, o el afiliado.
  v_source := lower(left(coalesce(
    nullif(d -> 'purchase' -> 'origin' ->> 'sck', ''),
    nullif(d -> 'purchase' -> 'origin' ->> 'src', ''),
    case when v_aff is not null then 'afiliado:' || v_aff end), 40));
  if v_source is not null and v_source !~ '^[a-z0-9_:.-]+$' then
    v_source := 'otro';
  end if;

  -- Comisiones: PRODUCER = lo que te queda; MARKETPLACE = tarifa Hotmart; AFFILIATE = afiliados.
  select
    sum(case when c ->> 'source' = 'PRODUCER' then (c ->> 'value')::numeric end),
    max(case when c ->> 'source' = 'PRODUCER' then upper(c ->> 'currency_value') end),
    sum(case when c ->> 'source' = 'MARKETPLACE' then (c ->> 'value')::numeric end),
    max(case when c ->> 'source' = 'MARKETPLACE' then upper(c ->> 'currency_value') end),
    sum(case when c ->> 'source' = 'AFFILIATE' then (c ->> 'value')::numeric end),
    max(case when c ->> 'source' = 'AFFILIATE' then upper(c ->> 'currency_value') end),
    sum((c ->> 'value')::numeric)
  into v_prod_val, v_prod_cur, v_mkt_val, v_mkt_cur, v_aff_val, v_aff_cur, v_all_val
  from jsonb_array_elements(case when jsonb_typeof(d -> 'commissions') = 'array' then d -> 'commissions' else '[]'::jsonb end) c;

  -- (d) Cliente: por código de suscriptor y, si no, por correo.
  select * into v_cust from public.profiles
  where (v_sub_code is not null and hotmart_subscriber_code = v_sub_code)
  limit 1;
  if v_cust.id is null and v_email is not null then
    select * into v_cust from public.profiles where email = v_email limit 1;
  end if;
  if v_cust.id is null then
    if v_email is null then
      insert into public.webhook_log (event_id, type, result, detail) values (p_event_id, p_event_type, 'illegal', 'sin correo ni suscriptor');
      return jsonb_build_object('status', 'illegal_no_email');
    end if;
    insert into public.profiles (email, name, source, hotmart_subscriber_code)
    values (v_email, v_name, v_source, v_sub_code)
    returning * into v_cust;
  end if;
  v_prev := v_cust.status;
  v_first_before := v_cust.first_paid_at;

  -- SWITCH_PLAN: cambia el ciclo, no el estado.
  if p_event_type = 'SWITCH_PLAN' then
    update public.profiles set cycle = coalesce(v_cycle, cycle) where id = v_cust.id;
    insert into public.event_log (type, customer_id, source, props)
    values ('plan_cambiado', v_cust.id, v_cust.source, jsonb_build_object('ciclo', v_cycle));
    insert into public.webhook_log (event_id, type, result) values (p_event_id, p_event_type, 'applied');
    return jsonb_build_object('status', 'applied');
  end if;

  -- (e) Transición legal: un reembolso/contracargo no se "resucita" con un reenvío de la
  --     MISMA compra. Una compra NUEVA (otra transacción) sí es un regreso válido.
  if v_new in ('active', 'trialing') and v_tx is not null and exists (
    select 1 from public.payment_transactions
    where transaction_id = v_tx and economic_kind in ('refund', 'chargeback')
  ) then
    insert into public.webhook_log (event_id, type, result, detail) values (p_event_id, p_event_type, 'illegal', 'compra ya reembolsada');
    return jsonb_build_object('status', 'illegal_transition', 'from', v_prev);
  end if;
  if v_new = 'past_due' and v_prev in ('refunded', 'chargeback', 'cancelled', 'expired') then
    insert into public.webhook_log (event_id, type, result, detail) values (p_event_id, p_event_type, 'illegal', 'atraso sobre cliente ya terminado');
    return jsonb_build_object('status', 'illegal_transition', 'from', v_prev);
  end if;

  -- (f) Ledger económico (dedupe por transacción + tipo: APPROVED y COMPLETE no cuentan doble).
  v_kind := case
    when v_new = 'active' and coalesce(v_price, 0) > 0 then 'sale'
    when v_new = 'refunded' then 'refund'
    when v_new = 'chargeback' then 'chargeback'
    else null end;
  if v_kind is not null and v_tx is not null then
    insert into public.payment_transactions (
      transaction_id, economic_kind, customer_id, product_id, offer_id, cycle, source,
      amount_minor, currency, gross_settlement_minor, settlement_amount_minor, settlement_currency,
      provider_fee_minor, affiliate_fee_minor, occurred_at, raw_event_id)
    select
      v_tx, v_kind, v_cust.id, v_product, v_offer, coalesce(v_cycle, v_cust.cycle), coalesce(v_cust.source, v_source),
      coalesce(private.to_minor(v_price, v_currency), s.amount_minor, 0),
      coalesce(case when v_price is not null then v_currency end, s.currency, v_currency),
      coalesce(case when v_prod_cur is not null then private.to_minor(v_all_val, v_prod_cur) end, s.gross_settlement_minor),
      coalesce(private.to_minor(v_prod_val, v_prod_cur), s.settlement_amount_minor),
      coalesce(v_prod_cur, s.settlement_currency),
      coalesce(case when v_mkt_cur = v_prod_cur then private.to_minor(v_mkt_val, v_mkt_cur) end, s.provider_fee_minor),
      coalesce(case when v_aff_cur = v_prod_cur then private.to_minor(v_aff_val, v_aff_cur) end, s.affiliate_fee_minor),
      v_when, p_event_id
    from (select 1) one
    left join public.payment_transactions s
      on s.transaction_id = v_tx and s.economic_kind = 'sale' and v_kind <> 'sale'
    on conflict (provider, transaction_id, economic_kind) do nothing;
    get diagnostics v_rows = row_count;
  end if;
  -- Si la transacción ya estaba (p. ej. COMPLETE después de APPROVED), no es un cobro nuevo.
  if v_kind = 'sale' and v_rows = 0 then
    v_kind := 'sale_repetida';
  end if;

  -- (g) Estado del cliente + historial + eventos del servidor (36: venta server-side).
  update public.profiles set
    status = v_new,
    plan = case when v_new in ('trialing', 'active', 'past_due', 'cancelled') then 'pro' else 'free' end,
    name = coalesce(name, v_name),
    cycle = coalesce(v_cycle, cycle),
    source = coalesce(source, v_source),
    hotmart_subscriber_code = coalesce(hotmart_subscriber_code, v_sub_code),
    trial_started_at = case when v_new = 'trialing' then coalesce(trial_started_at, v_when) else trial_started_at end,
    trial_ends_at = case when v_new = 'trialing' then coalesce(trial_ends_at, v_when + interval '7 days') else trial_ends_at end,
    first_paid_at = case when v_kind in ('sale', 'sale_repetida') then coalesce(first_paid_at, v_when) else first_paid_at end,
    access_until = case when v_new = 'cancelled' then coalesce(v_next_charge, access_until) else access_until end,
    churned_at = case when v_new in ('cancelled', 'expired') then v_when
                      when v_new in ('active', 'trialing') then null else churned_at end,
    churn_kind = case when v_new = 'cancelled' then 'voluntario'
                      when v_new = 'expired' then 'involuntario'
                      when v_new in ('active', 'trialing') then null else churn_kind end
  where id = v_cust.id
  returning * into v_cust;

  if v_prev is distinct from v_new then
    insert into public.subscription_history (customer_id, status, reason, changed_at)
    values (v_cust.id, v_new, p_event_type, v_when);
  end if;

  if v_new = 'trialing' and v_prev is distinct from 'trialing' then
    insert into public.event_log (type, customer_id, source, props, created_at)
    values ('trial_iniciado', v_cust.id, v_cust.source, jsonb_build_object('plan', 'pro', 'ciclo', v_cust.cycle), v_when);
  end if;
  if v_kind = 'sale' then
    insert into public.event_log (type, customer_id, source, props, created_at)
    values (case when v_first_before is null then 'primer_cobro_confirmado' else 'cobro_renovado' end,
            v_cust.id, v_cust.source, jsonb_build_object('plan', 'pro', 'ciclo', v_cust.cycle), v_when);
    if v_prev in ('cancelled', 'expired', 'refunded', 'chargeback') then
      insert into public.event_log (type, customer_id, source, created_at)
      values ('cliente_regreso', v_cust.id, v_cust.source, v_when);
    end if;
  end if;
  if v_new = 'cancelled' and v_prev is distinct from 'cancelled' then
    insert into public.event_log (type, customer_id, source, props, created_at)
    values (case when v_prev = 'trialing' then 'trial_cancelado' else 'suscripcion_cancelada' end,
            v_cust.id, v_cust.source, jsonb_build_object('churn', 'voluntario'), v_when);
  end if;
  if v_new = 'expired' and v_prev is distinct from 'expired' then
    insert into public.event_log (type, customer_id, source, props, created_at)
    values ('suscripcion_expirada', v_cust.id, v_cust.source, jsonb_build_object('churn', 'involuntario'), v_when);
  end if;
  if v_new in ('refunded', 'chargeback') and v_prev is distinct from v_new then
    insert into public.event_log (type, customer_id, source, created_at)
    values (case when v_new = 'refunded' then 'reembolso' else 'contracargo' end, v_cust.id, v_cust.source, v_when);
  end if;

  insert into public.webhook_log (event_id, type, result) values (p_event_id, p_event_type, v_result);
  return jsonb_build_object('status', 'applied', 'new_status', v_new);
end;
$$;
revoke all on function public.ingest_hotmart(text, text, text, text, jsonb) from public, authenticated;
grant execute on function public.ingest_hotmart(text, text, text, text, jsonb) to anon;
