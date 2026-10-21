// URL y llave PÚBLICA de Supabase (pueden ir al navegador: la seguridad la da RLS en la base).
export function configSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const llave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !llave) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  }
  return { url, llave };
}
