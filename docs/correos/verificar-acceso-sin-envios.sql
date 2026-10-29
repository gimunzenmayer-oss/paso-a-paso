-- SOLO LECTURA. Ejecutar en uvubnzymrkqirdvneeds antes de preparar la publicación.
-- No muestra correos, claves, enlaces de acceso ni cuerpos cifrados. No activa nada.
select
  to_regprocedure('public.ingest_hotmart(text,text,text,text,jsonb)') is not null as ingesta_instalada,
  to_regprocedure('public.mi_acceso()') is not null as consulta_acceso_instalada,
  to_regprocedure('public.email_operar(text,text,jsonb)') is not null as cola_instalada,
  exists(select 1 from pg_trigger where tgname='on_auth_user_confirmed' and not tgisinternal) as vinculo_correo_confirmado,
  exists(select 1 from pg_trigger where tgname='email_subscription' and not tgisinternal) as alta_encola_correo;

select
  '8796204'=any(hotmart_product_ids) and cardinality(hotmart_product_ids)=1 as catalogo_solo_paso_a_paso
from public.business_settings;

select
  position('hotmart_serial_ingest_v1' in pg_get_functiondef('public.ingest_hotmart(text,text,text,text,jsonb)'::regprocedure))>0 as reparacion_concurrencia,
  position('last_event_at' in pg_get_functiondef('public.ingest_hotmart(text,text,text,text,jsonb)'::regprocedure))>0 as control_orden_eventos;

select enabled as programacion_activa from private.email_dispatch_settings;
select count(*) as tareas_activas from cron.job where active;
select exists(select 1 from vault.secrets where name='paso_a_paso_correos_cron') as credencial_programador_presente;
select template,status,count(*) as cantidad from private.email_outbox group by template,status order by template,status;

-- Interpretación: catálogo/orden/concurrencia/vínculo/cola deben verificarse en conjunto.
-- Tener estas piezas NO prueba recepción del email ni una compra real.
-- cron.job puede incluir tareas ajenas: revisar sus nombres sin mostrar sus comandos.
-- Las variables de Vercel y la llegada a Recibidos se verifican por separado.
