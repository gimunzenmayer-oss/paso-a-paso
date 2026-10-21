-- El servidor pregunta si un correo es de administradora ANTES de mandar el enlace de entrada.
-- Solo responde con la llave del servidor; la pantalla siempre muestra el mismo mensaje,
-- así nadie puede averiguar qué correos son de administradora.
create or replace function public.admin_correo_permitido(p_key text, p_email text)
returns boolean
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not private.ingest_key_ok(p_key) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  return exists (select 1 from private.admin_emails a where a.email = lower(trim(p_email)));
end;
$$;
revoke all on function public.admin_correo_permitido(text, text) from public, authenticated;
grant execute on function public.admin_correo_permitido(text, text) to anon;
