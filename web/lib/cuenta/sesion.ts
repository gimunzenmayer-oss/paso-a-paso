import 'server-only';
import { cookies } from 'next/headers';
import { hayConfigSupabase } from '@/lib/supabase/config';
import { supabaseServidor } from '@/lib/supabase/servidor';
import { claveCuenta, leerMiAcceso, type ClaveCuenta, type MiAcceso } from './acceso';
import { accesoSimulado, COOKIE_SIMULADA, correoSimulado, entornoDeProceso } from './simulacion';

export interface SesionClienta {
  correo: string;
  /** true solo en desarrollo con CODIGO_SIMULADO (lib/cuenta/simulacion.ts). */
  simulada: boolean;
}

// Quién navega: la sesión de Supabase Auth (cookies) o, solo en desarrollo, la simulada.
// El proxy ya redirige a /entrar sin sesión; esto lo vuelve a comprobar en el servidor.
export async function sesionClienta(): Promise<SesionClienta | null> {
  if (hayConfigSupabase()) {
    const supabase = await supabaseServidor();
    const { data } = await supabase.auth.getUser();
    if (data.user?.email) return { correo: data.user.email, simulada: false };
  }
  const simulado = correoSimulado(entornoDeProceso(), (await cookies()).get(COOKIE_SIMULADA)?.value);
  return simulado ? { correo: simulado, simulada: true } : null;
}

// Pregunta a la base (RPC mi_acceso, con la sesión de ella). Cualquier falla = null = "Sin verificar".
async function miAcceso(sesion: SesionClienta, ahora: number): Promise<MiAcceso | null> {
  const simulado = accesoSimulado(entornoDeProceso(), ahora);
  if (simulado) return simulado.acceso;
  if (sesion.simulada || !hayConfigSupabase()) return null;
  const supabase = await supabaseServidor();
  const { data, error } = await supabase.rpc('mi_acceso');
  if (error) {
    console.error('[cuenta] mi_acceso falló', error.code);
    return null;
  }
  return leerMiAcceso(data);
}

export async function estadoDeCuenta(sesion: SesionClienta): Promise<{ clave: ClaveCuenta; hasta: string | null }> {
  const ahora = Date.now();
  const acceso = await miAcceso(sesion, ahora);
  return { clave: claveCuenta(acceso, ahora), hasta: acceso?.hasta ?? null };
}
