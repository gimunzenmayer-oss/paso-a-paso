'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hayConfigSupabase } from '@/lib/supabase/config';
import { supabaseServidor } from '@/lib/supabase/servidor';
import { COOKIE_SIMULADA } from '@/lib/cuenta/simulacion';

// Cierra la sesión SOLO en este teléfono (scope local): las rutinas y el diario no se tocan.
export async function cerrarSesion() {
  if (hayConfigSupabase()) {
    const supabase = await supabaseServidor();
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) console.error('[cuenta] no se pudo cerrar la sesión en Supabase', error.status, error.code);
  }
  (await cookies()).delete(COOKIE_SIMULADA);
  redirect('/entrar?salio=1');
}
