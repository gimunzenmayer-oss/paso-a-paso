-- Preparada localmente. NO aplicar ni activar envíos sin verificar proveedor y DNS.
-- Requiere las migraciones base del proyecto; no modifica datos del niño ni pagos.
begin;
create table private.email_contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  consent_at timestamptz,
  consent_source text,
  requested_at timestamptz,
  opted_out_at timestamptz,
  suppressed_at timestamptz,
  suppression_reason text,
  last_engaged_at timestamptz,
  created_at timestamptz not null default now()
);
create table private.email_outbox (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references private.email_contacts(id) on delete cascade,
  template text not null,
  dedupe text not null unique,
  due_at timestamptz not null,
  expires_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','processing','sent','cancelled','failed','manual')),
  context jsonb not null default '{}'::jsonb,
  attempts integer not null default 0,
  lease uuid,
  locked_until timestamptz,
  first_attempt_at timestamptz,
  envelope text, -- cifrado AES-GCM, nunca texto/token de entrada en claro
  envelope_expires_at timestamptz,
  provider_id text,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index email_outbox_due_idx on private.email_outbox(due_at) where status in ('pending','processing');
create index email_outbox_contact_idx on private.email_outbox(contact_id);
create index email_outbox_provider_idx on private.email_outbox(provider_id) where provider_id is not null;
create table private.email_events (
  id text primary key,
  provider_id text,
  kind text not null,
  created_at timestamptz not null default now()
);
-- Límite compartido de captación: solo huellas rotatorias, nunca IP en claro.
create table private.email_request_limits (
  fingerprint text primary key,
  started_at timestamptz not null default now(),
  requests integer not null default 1
);
alter table private.email_request_limits enable row level security;
revoke all on private.email_request_limits from public, anon, authenticated;
alter table private.email_contacts enable row level security;
alter table private.email_outbox enable row level security;
alter table private.email_events enable row level security;
revoke all on private.email_contacts, private.email_outbox, private.email_events from public, anon, authenticated;

create function private.email_contact(p_email text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  insert into private.email_contacts(email) values(lower(trim(p_email)))
  on conflict(email) do update set email=excluded.email returning id into v_id;
  return v_id;
end $$;

create function private.email_enqueue(p_contact uuid, p_template text, p_key text, p_due timestamptz, p_expires timestamptz, p_context jsonb default '{}'::jsonb)
returns void language sql security definer set search_path = '' as $$
  insert into private.email_outbox(contact_id,template,dedupe,due_at,expires_at,context)
  values(p_contact,p_template,p_key,p_due,p_expires,p_context) on conflict(dedupe) do nothing;
$$;

-- Se ejecuta DENTRO de la transacción de Hotmart: no hay un pago confirmado sin
-- su trabajo de correo durable, y los reintentos del aviso no generan duplicados.
create function private.email_subscription() returns trigger
language plpgsql security definer set search_path = '' as $$
declare c uuid; t timestamptz := now(); base text; ctx jsonb; n integer; previo text := 'none';
begin
  if new.role <> 'customer' then return new; end if;
  if tg_op='UPDATE' then
    previo:=old.status;
    if new.status is not distinct from old.status then return new; end if;
  end if;
  c := private.email_contact(new.email);
  if tg_op='UPDATE' then
    update private.email_outbox set status='cancelled',envelope=null,lease=null
    where contact_id=c and status in ('pending','processing') and (
      (template like 'pago_fallido_%' and new.status<>'past_due') or
      (template='precobro' and new.status<>'trialing') or
      (template like 'regreso_%' and new.status not in ('cancelled','expired')) or
      (template in ('bienvenida_d1','activacion_d3','activacion_d7') and new.status not in ('trialing','active')) or
      (template like 'carrito_%' and new.status in ('trialing','active','past_due'))
    );
  end if;
  base := new.id::text || ':' || t::text;
  ctx := jsonb_build_object('profile_id',new.id,'status',new.status,'since',t);
  if new.status in ('trialing','active') then
    if previo not in ('trialing','active','past_due') then
      perform private.email_enqueue(c,'acceso','acceso:'||base,t,t+interval '1 day',ctx);
    end if;
    if tg_op='UPDATE' then
      if old.status='past_due' then
        perform private.email_enqueue(c,'pago_recuperado','recuperado:'||base,t,t+interval '2 days',ctx);
      end if;
    end if;
    -- Consejos promocionales: el trabajador exige consentimiento confirmado.
    perform private.email_enqueue(c,'bienvenida_d1','d1:'||new.id::text,t+interval '1 day',t+interval '2 days',ctx);
    perform private.email_enqueue(c,'activacion_d3','d3:'||new.id::text,t+interval '3 days',t+interval '4 days',ctx);
    perform private.email_enqueue(c,'activacion_d7','d7:'||new.id::text,t+interval '7 days',t+interval '8 days',ctx);
    if new.status='trialing' and new.trial_ends_at is not null then
      -- Solo el servidor añade importe/fecha tras verificar el contrato real de Hotmart.
      perform private.email_enqueue(c,'precobro','precobro:'||new.id::text||':'||new.trial_ends_at::text,
        greatest(t,new.trial_ends_at-interval '2 days'),new.trial_ends_at,
        ctx||jsonb_build_object('trial_end',new.trial_ends_at));
    end if;
  elsif new.status='past_due' then
    foreach n in array array[1,3,5,7] loop
      perform private.email_enqueue(c,'pago_fallido_'||n,'atraso:'||base||':'||n,
        t+(n-1)*interval '1 day',t+n*interval '1 day',ctx);
    end loop;
  elsif new.status='cancelled' then
    perform private.email_enqueue(c,'cancelacion','cancelacion:'||base,t,t+interval '2 days',ctx);
  elsif new.status='refunded' then
    perform private.email_enqueue(c,'reembolso','reembolso:'||base,t,t+interval '2 days',ctx);
  end if;
  if new.status in ('cancelled','expired') and previo not in ('cancelled','expired') then
    foreach n in array array[30,60,90] loop
      perform private.email_enqueue(c,'regreso_'||n,'regreso:'||base||':'||n,
        t+n*interval '1 day',t+(n+2)*interval '1 day',ctx);
    end loop;
  end if;
  return new;
end $$;
create trigger email_subscription after insert or update of status on public.profiles
for each row execute function private.email_subscription();

-- Un único puerto de servidor, como las funciones de ingesta existentes.
-- No es ejecutable por el navegador sin INGEST_KEY. Ninguna tabla privada expuesta.
create function public.email_operar(p_key text,p_action text,p_data jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare j private.email_outbox; c private.email_contacts; p public.profiles;
  v_id uuid; v_rows integer; v_result jsonb := '[]'; v_token uuid; n integer;
begin
  if not private.ingest_key_ok(p_key) then raise exception 'unauthorized' using errcode='42501'; end if;
  if pg_column_size(p_data)>150000 then raise exception 'too_large'; end if;
  if p_action='claim' then
    -- No reintentar después de la ventana de idempotencia de Resend (24h).
    update private.email_outbox set status='manual',envelope=null,last_error='ventana_reintento_vencida'
      where status in ('pending','processing') and first_attempt_at < now()-interval '23 hours';
    update private.email_outbox set status='cancelled',envelope=null
      where status in ('pending','processing') and expires_at<=now();
    update private.email_outbox set status='manual',envelope=null,last_error='reintentos_agotados'
      where attempts>=6 and (status='pending' or (status='processing' and locked_until<now()));
    for j in select * from private.email_outbox
      where due_at<=now() and expires_at>now() and attempts<6
        and (status='pending' or (status='processing' and locked_until<now()))
        and (coalesce((p_data->>'marketing')::boolean,false) or template in
          ('acceso','precobro','pago_fallido_1','pago_fallido_3','pago_fallido_5','pago_fallido_7',
           'pago_recuperado','cancelacion','reembolso','confirmar'))
      -- El acceso y los avisos de dinero preceden a consejos/carritos atrasados.
      order by case
        when template='acceso' then 0
        when template='precobro' then 1
        when template in ('pago_fallido_1','pago_fallido_3','pago_fallido_5','pago_fallido_7','pago_recuperado','cancelacion','reembolso') then 2
        when template='confirmar' then 3
        else 4 end, due_at, id for update skip locked limit 5
    loop
      v_token:=gen_random_uuid();
      update private.email_outbox set status='processing',lease=v_token,locked_until=now()+interval '5 minutes',
        attempts=attempts+1,first_attempt_at=coalesce(first_attempt_at,now()) where id=j.id;
      select * into c from private.email_contacts where id=j.contact_id;
      select * into p from public.profiles where email=c.email;
      v_result:=v_result||jsonb_build_array(jsonb_build_object('id',j.id,'lease',v_token,'template',j.template,
        'contact_id',c.id,'email',c.email,'consent_at',c.consent_at,'opted_out_at',c.opted_out_at,
        'suppressed_at',c.suppressed_at,'last_engaged_at',c.last_engaged_at,'context',j.context,
        'profile_status',p.status,'profile_id',p.id,'trial_end',p.trial_ends_at,'access_until',p.access_until,
        'envelope',j.envelope,'envelope_expires_at',j.envelope_expires_at));
    end loop;
    return v_result;
  elsif p_action='check' then
    select * into j from private.email_outbox where id=(p_data->>'id')::uuid and lease=(p_data->>'lease')::uuid and status='processing' and locked_until>now();
    if not found then return jsonb_build_object('ok',false); end if;
    select * into c from private.email_contacts where id=j.contact_id;
    select * into p from public.profiles where email=c.email;
    return jsonb_build_object('ok',true,'suppressed_at',c.suppressed_at,'consent_at',c.consent_at,
      'opted_out_at',c.opted_out_at,'last_engaged_at',c.last_engaged_at,'profile_status',p.status,
      'profile_id',p.id,'trial_end',p.trial_ends_at,'access_until',p.access_until);
  elsif p_action='prepare' then
    update private.email_outbox set envelope=p_data->>'envelope',envelope_expires_at=(p_data->>'expires')::timestamptz
      where id=(p_data->>'id')::uuid and lease=(p_data->>'lease')::uuid and status='processing' and locked_until>now() and envelope is null;
    get diagnostics v_rows=row_count; return jsonb_build_object('ok',v_rows=1);
  elsif p_action='finish' then
    if p_data->>'status' not in ('sent','pending','failed','cancelled','manual') then raise exception 'bad_status'; end if;
    update private.email_outbox set status=p_data->>'status',provider_id=coalesce(p_data->>'provider_id',provider_id),
      last_error=left(p_data->>'reason',80), sent_at=case when p_data->>'status'='sent' then now() else sent_at end,
      due_at=case when p_data->>'status'='pending' then now()+interval '10 minutes' else due_at end,
      envelope=case when p_data->>'status' in ('sent','failed','cancelled','manual') then null else envelope end,
      locked_until=null,lease=null
      where id=(p_data->>'id')::uuid and lease=(p_data->>'lease')::uuid and status='processing';
    return jsonb_build_object('ok',found);
  elsif p_action='unsubscribe' then
    update private.email_contacts set opted_out_at=now() where id=(p_data->>'contact_id')::uuid;
    return jsonb_build_object('ok',true);
  elsif p_action='request_consent' then
    if p_data->>'request_key' is not null then
      if p_data->>'request_key' !~ '^[a-f0-9]{64}$' then raise exception 'invalid_request_key'; end if;
      delete from private.email_request_limits where started_at < now()-interval '1 day';
      insert into private.email_request_limits(fingerprint) values(p_data->>'request_key')
      on conflict(fingerprint) do update set
        requests=case when private.email_request_limits.started_at<now()-interval '1 hour' then 1 else private.email_request_limits.requests+1 end,
        started_at=case when private.email_request_limits.started_at<now()-interval '1 hour' then now() else private.email_request_limits.started_at end
      returning requests into v_rows;
      if v_rows>10 then return jsonb_build_object('ok',false,'limited',true); end if;
    end if;
    -- Solo entrada de servidor autenticada + prueba de solicitud real. NO desde compra automática.
    if length(coalesce(p_data->>'source',''))<3 or length(coalesce(p_data->>'email',''))>254
      or coalesce(p_data->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'invalid_contact'; end if;
    v_id:=private.email_contact(p_data->>'email');
    select * into c from private.email_contacts where id=v_id for update;
    if c.suppressed_at is not null or c.requested_at>now()-interval '1 day' then return jsonb_build_object('ok',true); end if;
    update private.email_contacts set requested_at=now(),consent_source=left(p_data->>'source',200) where id=v_id;
    perform private.email_enqueue(v_id,'confirmar','confirmar:'||v_id::text||':'||now()::date,now(),now()+interval '1 day');
    return jsonb_build_object('ok',true);
  elsif p_action='confirm' then
    select * into c from private.email_contacts where id=(p_data->>'contact_id')::uuid for update;
    if not found or c.requested_at is null or c.requested_at<now()-interval '1 day' or c.suppressed_at is not null then return jsonb_build_object('ok',false); end if;
    if (p_data->>'requested_at')::timestamptz is distinct from c.requested_at then return jsonb_build_object('ok',false); end if;
    update private.email_contacts set consent_at=now(),opted_out_at=null,last_engaged_at=now(),requested_at=null where id=c.id;
    perform private.email_enqueue(c.id,'regalo','regalo:'||c.id::text||':'||now()::date,now(),now()+interval '2 days');
    foreach n in array array[1,2,3,5,7] loop
      perform private.email_enqueue(c.id,'nutricion_d'||n,'nutricion:'||c.id::text||':'||now()::date||':'||n,
        now()+n*interval '1 day',now()+(n+1)*interval '1 day');
    end loop;
    return jsonb_build_object('ok',true);
  elsif p_action='carrito' then
    -- Solo servidor tras verificar que el evento de Hotmart existe, su firma y el consentimiento.
    select * into c from private.email_contacts where email=lower(p_data->>'email');
    if not found or c.consent_at is null or c.opted_out_at is not null or c.suppressed_at is not null then return jsonb_build_object('ok',false); end if;
    if length(coalesce(p_data->>'checkout_id','')) not between 1 and 120 then raise exception 'invalid_checkout'; end if;
    if exists(select 1 from public.profiles where email=c.email and status<>'none') then return jsonb_build_object('ok',false); end if;
    foreach n in array array[2,24,72] loop
      perform private.email_enqueue(c.id,'carrito_'||n||'h','carrito:'||c.id::text||':'||(p_data->>'checkout_id')||':'||n,
        now()+n*interval '1 hour',now()+(n+12)*interval '1 hour');
    end loop;
    return jsonb_build_object('ok',true);
  elsif p_action='contact' then
    select * into c from private.email_contacts where id=(p_data->>'contact_id')::uuid;
    return jsonb_build_object('requested_at',c.requested_at);
  elsif p_action='event' then
    insert into private.email_events(id,provider_id,kind) values(left(p_data->>'id',200),p_data->>'provider_id',left(p_data->>'kind',60)) on conflict do nothing;
    get diagnostics v_rows=row_count;
    if v_rows=0 then return jsonb_build_object('ok',true); end if;
    if p_data->>'kind' in ('email.bounced','email.complained','email.suppressed') then
      -- Resend firma el destinatario; no almacenamos cuerpo ni detalles de la compra.
      update private.email_contacts set suppressed_at=now(),suppression_reason=p_data->>'kind'
        where email=lower(p_data->>'email');
    end if;
    return jsonb_build_object('ok',true);
  else raise exception 'unknown_action'; end if;
end $$;
revoke all on function private.email_contact(text) from public,anon,authenticated;
revoke all on function private.email_enqueue(uuid,text,text,timestamptz,timestamptz,jsonb) from public,anon,authenticated;
revoke all on function private.email_subscription() from public,anon,authenticated;
revoke all on function public.email_operar(text,text,jsonb) from public;
grant execute on function public.email_operar(text,text,jsonb) to anon,authenticated;
commit;
