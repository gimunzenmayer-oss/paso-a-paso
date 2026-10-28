'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hayConfigSupabase } from '@/lib/supabase/config';
import { supabaseServidor } from '@/lib/supabase/servidor';
import { COOKIE_SIMULADA } from '@/lib/cuenta/simulacion';
import { sesionClienta } from '@/lib/cuenta/sesion';

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

/**
 * "Eliminar mi cuenta" (con su confirmación): borra el login y el perfil con la RPC
 * eliminar_mi_cuenta() (migración 20261028120000). No toca Hotmart ni el teléfono.
 * Si la base no responde o la RPC falla, vuelve a /cuenta con el aviso de error.
 */
export async function eliminarCuenta() {
  const sesion = await sesionClienta();
  if (!sesion) redirect('/entrar');
  if (!sesion.simulada) {
    if (!hayConfigSupabase()) redirect('/cuenta?eliminar=error');
    const supabase = await supabaseServidor();
    const { data, error } = await supabase.rpc('eliminar_mi_cuenta');
    const ok = !error && typeof data === 'object' && data !== null && (data as { ok?: unknown }).ok === true;
    if (!ok) {
      console.error('[cuenta] eliminar_mi_cuenta falló', error?.code ?? (data as { motivo?: unknown } | null)?.motivo);
      redirect('/cuenta?eliminar=error');
    }
  }
  await salir();
  redirect('/entrar?eliminada=1');
}
