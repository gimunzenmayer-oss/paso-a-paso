import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { configSupabase } from '@/lib/supabase/config';

// Escritura de datos del panel (uso, errores, pagos). Solo corre en el servidor:
// la base exige INGEST_KEY, que vive en las variables del servidor y nunca llega al navegador.
export function llaveIngesta(): string | null {
  const k = process.env.INGEST_KEY;
  return k && k.length >= 32 ? k : null;
}

export function supabaseIngesta() {
  const { url, llave } = configSupabase();
  return createClient(url, llave, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
