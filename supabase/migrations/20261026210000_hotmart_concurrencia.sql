-- Reparación acotada del 23505 profiles_email_key y deadlocks observados el 26-10.
-- Conserva la función instalada, su catálogo, permisos y reglas económicas.
-- Serializa la ingesta Hotmart ANTES de tomar locks de eventos/perfiles/pagos.
-- El alta de Auth también puede crear el perfil: resolver ese conflicto por email.
do $repair$
declare
  definition text;
  anchor text := 'select * into v_settings from public.business_settings limit 1;';
  insertion text := 'values (v_email, v_name, v_source, v_sub_code)';
begin
  select pg_get_functiondef('public.ingest_hotmart(text,text,text,text,jsonb)'::regprocedure)
    into definition;
  if position('hotmart_serial_ingest_v1' in definition) > 0 then
    return;
  end if;
  if position(anchor in definition) = 0 or position(insertion in definition) = 0 then
    raise exception 'Función de ingesta distinta: revisar antes de aplicar reparación';
  end if;
  definition := replace(definition, anchor,
    'perform pg_catalog.pg_advisory_xact_lock(8796204, 20261026); -- hotmart_serial_ingest_v1'
    || chr(10) || '  ' || anchor);
  definition := replace(definition, insertion,
    insertion || chr(10) || '    on conflict (email) do update set email = excluded.email');
  execute definition;
end;
$repair$;
