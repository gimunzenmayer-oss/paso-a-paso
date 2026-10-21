import 'server-only';
import { redirect } from 'next/navigation';
import { supabaseServidor } from '@/lib/supabase/servidor';

export type EstadoAdmin = 'sin_sesion' | 'falta_codigo' | 'sin_permiso' | 'ok';

// Paso 1 del control en el servidor (no basta con esconder la ruta): quién es y si ya puso
// el código de su app de autenticación. Paso 2 lo hace la base en CADA consulta (assert_admin).
export async function estadoAdmin(): Promise<{ estado: EstadoAdmin; email: string | null }> {
  const supabase = await supabaseServidor();
  const u = await supabase.auth
    .getUser()
    .then((r) => r.data)
    .catch(() => ({ user: null }));
  if (!u.user) return { estado: 'sin_sesion', email: null };

  // Una sesión dañada o vencida no rompe la página: se trata como "sin sesión".
  const nivel = await supabase.auth.mfa
    .getAuthenticatorAssuranceLevel()
    .then((r) => r.data)
    .catch(() => null);
  if (!nivel) return { estado: 'sin_sesion', email: null };
  const { data: esAdmin } = await supabase.rpc('soy_admin_pendiente');
  if (esAdmin !== true) return { estado: 'sin_permiso', email: u.user.email ?? null };
  if (nivel?.currentLevel !== 'aal2') return { estado: 'falta_codigo', email: u.user.email ?? null };
  return { estado: 'ok', email: u.user.email ?? null };
}

export async function exigirAdmin() {
  const { estado, email } = await estadoAdmin();
  if (estado === 'sin_sesion') redirect('/admin/entrar');
  if (estado === 'falta_codigo') redirect('/admin/verificar');
  if (estado === 'sin_permiso') redirect('/admin/entrar?error=permiso');
  const supabase = await supabaseServidor();
  return { supabase, email };
}
