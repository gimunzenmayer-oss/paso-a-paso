'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hayConfigSupabase } from '@/lib/supabase/config';
import { supabaseServidor } from '@/lib/supabase/servidor';
import { COOKIE_SIMULADA } from '@/lib/cuenta/simulacion';

// Cierra la sesión SOLO en este teléfono (scope local): las rutinas y el diario no se tocan.
async function salir() {
  if (hayConfigSupabase()) {
    const supabase = await supabaseServidor();
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) console.error('[cuenta] no se pudo cerrar la sesión en Supabase', error.status, error.code);
  }
  (await cookies()).delete(COOKIE_SIMULADA);
}

/** "Cerrar sesión" (con su confirmación): /entrar avisa "Cerraste sesión.". */
export async function cerrarSesion() {
  await salir();
  redirect('/entrar?salio=1');
}

/** "Entrar con otro correo" (sin compra, §3.3): la misma salida, directo al paso correo. */
export async function entrarConOtroCorreo() {
  await salir();
  redirect('/entrar');
}
