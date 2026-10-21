import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { configSupabase } from './config';

// Cliente con la sesión de quien navega (cookies). Lo que puede leer lo decide RLS en la base.
export async function supabaseServidor() {
  const { url, llave } = configSupabase();
  const almacen = await cookies();
  return createServerClient(url, llave, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (lista) => {
        try {
          for (const { name, value, options } of lista) almacen.set(name, value, options);
        } catch {
          // En un Server Component no se pueden escribir cookies; el proxy ya refrescó la sesión.
        }
      },
    },
  });
}
