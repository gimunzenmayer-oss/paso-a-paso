-- Paso a Paso — base de datos del negocio y del panel del dueño (21-BACKOFFICE).
-- Principio: los datos del niño NUNCA viven aquí (se quedan en el teléfono). Aquí solo hay:
-- clientes y pagos (Hotmart), uso anónimo de la app (event_log), errores, costos y gasto en canales.
-- Escrituras: SOLO por funciones security definer con validación. Lecturas: SOLO admin con MFA (aal2).

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

-- ─── Configuración privada (no expuesta por la API) ───────────────────────────────
create table private.admin_emails (
  email text primary key check (email = lower(email))
);

-- Secretos de servidor guardados como HASH (nunca el valor). El valor vive solo en Vercel.
create table private.app_secrets (
  name text primary key,
  value_sha256 text not null
);

-- Intentos de verificación del segundo factor (límite de intentos fallidos del login admin).
create table private.mfa_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  ok boolean not null,
  created_at timestamptz not null default now()
);
create index mfa_attempts_user_idx on private.mfa_attempts (user_id, created_at desc);

-- ─── Clientes ─────────────────────────────────────────────────────────────────────
-- Un cliente nace con el webhook de Hotmart (antes de tener cuenta): user_id queda NULL
-- hasta que confirma su correo e inicia sesión (etapa de login). El admin también vive aquí.
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete set null,
  email text not null unique check (email = lower(email)),
  name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  status text not null default 'none'
    check (status in ('none','trialing','active','past_due','cancelled','expired','refunded','chargeback')),
  plan text not null default 'free' check (plan in ('free', 'pro')),
  cycle text check (cycle in ('mensual', 'anual')),
  source text,
  hotmart_subscriber_code text unique,
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  first_paid_at timestamptz,
  access_until timestamptz,
  churned_at timestamptz,
  churn_kind text check (churn_kind in ('voluntario', 'involuntario')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_status_idx on public.profiles (status);
create index profiles_source_idx on public.profiles (source);
create index profiles_user_idx on public.profiles (user_id);

-- Historial de estados: permite saber cuántos estaban activos al inicio de cada mes (churn real).
create table public.subscription_history (
  id bigint generated always as identity primary key,
  customer_id uuid not null references public.profiles (id) on delete cascade,
  status text not null,
  reason text not null,               -- evento Hotmart o 'manual:<motivo>'
  changed_at timestamptz not null default now()
);
create index subscription_history_customer_idx on public.subscription_history (customer_id, changed_at desc);

-- ─── Pagos (ledger económico, 18 §3B) ─────────────────────────────────────────────
create table public.processed_events (
  event_id text primary key,
  event_type text not null,
  payload_hash text,
  processed_at timestamptz not null default now()
);

create table public.webhook_log (
  id bigint generated always as identity primary key,
  event_id text,
  type text,
  result text not null check (result in ('applied','duplicate','illegal','unauthorized','error','ignored')),
  detail text,
  received_at timestamptz not null default now()
);
create index webhook_log_received_idx on public.webhook_log (received_at desc);
create index webhook_log_result_idx on public.webhook_log (result, received_at desc);

create table public.payment_transactions (
  provider text not null default 'hotmart',
  transaction_id text not null,
  economic_kind text not null check (economic_kind in ('sale','refund','chargeback')),
  customer_id uuid references public.profiles (id) on delete set null,
  product_id text,
  offer_id text,
  cycle text check (cycle in ('mensual', 'anual')),
  source text,
  amount_minor bigint not null,                 -- lo que pagó el comprador, en SU moneda
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  gross_settlement_minor bigint,                -- el mismo cobro en tu moneda de liquidación
  settlement_amount_minor bigint,               -- lo que Hotmart te deja a ti (comisión PRODUCER)
  settlement_currency text check (settlement_currency ~ '^[A-Z]{3}$'),
  provider_fee_minor bigint,                    -- tarifa de Hotmart (MARKETPLACE)
  affiliate_fee_minor bigint,                   -- comisión de afiliados
  tax_minor bigint,                             -- solo si Hotmart lo informa
  occurred_at timestamptz not null,
  raw_event_id text not null,
  primary key (provider, transaction_id, economic_kind)
);
create index payment_transactions_occurred_idx on public.payment_transactions (occurred_at desc);
create index payment_transactions_customer_idx on public.payment_transactions (customer_id);

-- ─── Uso de la app y errores ──────────────────────────────────────────────────────
-- device_id = identificador anónimo del teléfono (sin PII). user_id llega con el login.
create table public.event_log (
  id bigint generated always as identity primary key,
  type text not null,
  user_id uuid references auth.users (id) on delete set null,
  customer_id uuid references public.profiles (id) on delete set null,
  device_id text,
  session_id text,
  source text,
  is_qa boolean not null default false,
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index event_log_type_created_idx on public.event_log (type, created_at desc);
create index event_log_device_created_idx on public.event_log (device_id, created_at);
create index event_log_created_idx on public.event_log (created_at desc);
create index event_log_user_idx on public.event_log (user_id);
create index event_log_customer_idx on public.event_log (customer_id);

create table public.error_log (
  id bigint generated always as identity primary key,
  message text not null,
  context text,
  screen text,
  device_id text,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index error_log_created_idx on public.error_log (created_at desc);
create index error_log_user_idx on public.error_log (user_id);

-- Costo real de IA (31). Hoy la app no usa IA: la tabla existe para cuando la use.
create table public.ai_calls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  feature text not null,
  model text not null,
  tokens_in integer,
  tokens_out integer,
  cost_usd numeric(10, 5),
  latency_ms integer,
  status text not null,
  error text,
  prompt_hash text,
  created_at timestamptz not null default now()
);
create index ai_calls_user_created_idx on public.ai_calls (user_id, created_at desc);
create index ai_calls_feature_idx on public.ai_calls (feature, created_at desc);

-- ─── Lo que el dueño ingresa a mano ───────────────────────────────────────────────
create table public.acquisition_spend (
  id bigint generated always as identity primary key,
  channel text not null,
  amount_minor bigint not null check (amount_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  period_start date not null,
  period_end date not null check (period_end >= period_start),
  note text,
  created_at timestamptz not null default now()
);
create index acquisition_spend_period_idx on public.acquisition_spend (period_start, period_end);

create table public.operating_costs (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('infra', 'email', 'otro')),
  amount_minor bigint not null check (amount_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  month date not null check (month = date_trunc('month', month)::date),
  note text,
  created_at timestamptz not null default now()
);
create index operating_costs_month_idx on public.operating_costs (month);

create table public.business_settings (
  id boolean primary key default true check (id),
  main_currency text not null default 'USD' check (main_currency ~ '^[A-Z]{3}$'),
  tax_rate_pct numeric(5, 2) check (tax_rate_pct between 0 and 100),
  hotmart_product_ids text[] not null default '{}',
  timezone text not null default 'America/Santiago',
  updated_at timestamptz not null default now()
);
insert into public.business_settings (id) values (true);

-- ─── Helpers ──────────────────────────────────────────────────────────────────────
-- Admin = rol admin en su perfil + sesión con segundo factor (aal2). Se evalúa en la BASE,
-- así ni una ruta mal protegida ni una llamada directa a la API pueden leer el panel.
create or replace function private.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select auth.jwt() ->> 'aal') = 'aal2', false)
     and exists (
       select 1 from public.profiles p
       where p.user_id = (select auth.uid()) and p.role = 'admin'
     );
$$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create or replace function private.ingest_key_ok(p_key text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select p_key is not null and length(p_key) >= 32 and exists (
    select 1 from private.app_secrets s
    where s.name = 'ingest_key'
      and s.value_sha256 = encode(extensions.digest(p_key, 'sha256'), 'hex')
  );
$$;
revoke all on function private.ingest_key_ok(text) from public, anon, authenticated;

create or replace function private.minor_units(p_currency text)
returns integer
language sql immutable set search_path = ''
as $$
  select case when upper(p_currency) in ('CLP','PYG','JPY','KRW','VND','ISK','UGX','XOF','XAF') then 0 else 2 end;
$$;

create or replace function private.to_minor(p_value numeric, p_currency text)
returns bigint
language sql immutable set search_path = ''
as $$
  select case when p_value is null then null
              else round(p_value * power(10, private.minor_units(p_currency)))::bigint end;
$$;

-- updated_at automático
create or replace function private.touch_updated_at()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger profiles_touch before update on public.profiles
  for each row execute function private.touch_updated_at();

-- Vincular la cuenta de acceso con su perfil SOLO cuando el correo está confirmado
-- (si no, alguien podría registrarse con el correo de otra persona y quedarse con su acceso).
create or replace function private.link_auth_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_email text := lower(new.email);
  v_admin boolean;
begin
  if new.email_confirmed_at is null or v_email is null then
    return new;
  end if;
  select exists (select 1 from private.admin_emails a where a.email = v_email) into v_admin;

  insert into public.profiles (user_id, email, role)
  values (new.id, v_email, case when v_admin then 'admin' else 'customer' end)
  on conflict (email) do update
    set user_id = excluded.user_id,
        role = case when v_admin then 'admin' else public.profiles.role end
  where public.profiles.user_id is null or public.profiles.user_id = excluded.user_id;
  return new;
end;
$$;
revoke all on function private.link_auth_user() from public, anon, authenticated;

create trigger on_auth_user_confirmed
  after insert or update of email_confirmed_at on auth.users
  for each row execute function private.link_auth_user();

-- ─── RLS: todo cerrado; solo el admin con MFA lee. Nadie escribe directo. ──────────
alter table public.profiles enable row level security;
alter table public.subscription_history enable row level security;
alter table public.processed_events enable row level security;
alter table public.webhook_log enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.event_log enable row level security;
alter table public.error_log enable row level security;
alter table public.ai_calls enable row level security;
alter table public.acquisition_spend enable row level security;
alter table public.operating_costs enable row level security;
alter table public.business_settings enable row level security;

-- Cada persona ve SOLO su propio perfil; el admin ve todos.
create policy profiles_select_own_or_admin on public.profiles
  for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy subscription_history_admin on public.subscription_history
  for select to authenticated using ((select private.is_admin()));
create policy processed_events_admin on public.processed_events
  for select to authenticated using ((select private.is_admin()));
create policy webhook_log_admin on public.webhook_log
  for select to authenticated using ((select private.is_admin()));
create policy payment_transactions_admin on public.payment_transactions
  for select to authenticated using ((select private.is_admin()));
create policy event_log_admin on public.event_log
  for select to authenticated using ((select private.is_admin()));
create policy error_log_admin on public.error_log
  for select to authenticated using ((select private.is_admin()));
create policy ai_calls_admin on public.ai_calls
  for select to authenticated using ((select private.is_admin()));
create policy acquisition_spend_admin on public.acquisition_spend
  for select to authenticated using ((select private.is_admin()));
create policy operating_costs_admin on public.operating_costs
  for select to authenticated using ((select private.is_admin()));
create policy business_settings_admin on public.business_settings
  for select to authenticated using ((select private.is_admin()));

-- Nadie (ni anon ni authenticated) escribe directo en las tablas: solo vía funciones.
revoke insert, update, delete, truncate on all tables in schema public from anon, authenticated;
revoke all on all tables in schema public from anon;
