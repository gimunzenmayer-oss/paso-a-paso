-- NO ejecutar hasta: código publicado, CRON_SECRET coincidente en Vercel/Vault,
-- prueba controlada con la dueña y autorización explícita de activación.
-- El secreto se carga en Vault por su panel, nunca en esta consulta ni en Git.
begin;
do $$ begin
  if not exists(select 1 from vault.decrypted_secrets
    where name='paso_a_paso_correos_cron' and length(decrypted_secret)>=32) then
    raise exception 'Falta credencial del trabajador en Vault';
  end if;
end $$;
select cron.schedule('paso-a-paso-correos','*/5 * * * *','select private.email_dispatch_tick();');
update private.email_dispatch_settings set enabled=true where id;
commit;
-- Pausa reversible: update private.email_dispatch_settings set enabled=false where id;
-- Revisar cron.job_run_details y respuesta net._http_response sin mostrar cabeceras.
