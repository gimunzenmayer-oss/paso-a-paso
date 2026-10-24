import 'server-only';
import { cookies } from 'next/headers';
import { hayConfigSupabase } from '@/lib/supabase/config';
import { supabaseServidor } from '@/lib/supabase/servidor';
import { claveCuenta, leerMiAcceso, type ClaveCuenta, type MiAcceso } from './acceso';
import { esRed } from './formato';
import { accesoSimulado, COOKIE_SIMULADA, correoSimulado, entornoDeProceso } from './simulacion';

export interface SesionClienta {
  correo: string;
  /** true solo en desarrollo con CODIGO_SIMULADO (lib/cuenta/simulacion.ts). */
  simulada: boolean;
}

/** El cliente de Supabase con la sesión de quien navega (o la que se acaba de abrir). */
export type ClienteSupabase = Awaited<ReturnType<typeof supabaseServidor>>;

/**
 * Qué se sabe de la sesión:
 * · 'sesion': hay sesión (real o, solo en desarrollo, simulada).
 * · 'sin_sesion': Supabase Auth respondió que no hay sesión válida.
 * · 'sin_verificar': Supabase Auth no respondió (sin red o 5xx): no se sabe.
 */
export type LecturaSesion = { tipo: 'sesion'; sesion: SesionClienta } | { tipo: 'sin_sesion' } | { tipo: 'sin_verificar' };

export async function leerSesion(): Promise<LecturaSesion> {
  let caido = false;
  if (hayConfigSupabase()) {
    const supabase = await supabaseServidor();
    const { data, error } = await supabase.auth.getUser();
    if (data.user?.email) return { tipo: 'sesion', sesion: { correo: data.user.email, simulada: false } };
    if (error && esRed({ status: error.status, code: error.code })) {
      console.error('[cuenta] Supabase Auth no respondió', error.status, error.code);
      caido = true;
    }
  }
  const simulado = correoSimulado(entornoDeProceso(), (await cookies()).get(COOKIE_SIMULADA)?.value);
  if (simulado) return { tipo: 'sesion', sesion: { correo: simulado, simulada: true } };
  return caido ? { tipo: 'sin_verificar' } : { tipo: 'sin_sesion' };
}

// Quién navega: la sesión de Supabase Auth (cookies) o, solo en desarrollo, la simulada.
// El proxy ya redirige a /entrar sin sesión; esto lo vuelve a comprobar en el servidor.
export async function sesionClienta(): Promise<SesionClienta | null> {
  const lectura = await leerSesion();
  return lectura.tipo === 'sesion' ? lectura.sesion : null;
}

// La RPC mi_acceso() con la sesión de ella. Cualquier falla = null = "Sin verificar".
async function consultarMiAcceso(supabase: ClienteSupabase): Promise<MiAcceso | null> {
  const { data, error } = await supabase.rpc('mi_acceso');
  if (error) {
    console.error('[cuenta] mi_acceso falló', error.code);
    return null;
  }
  return leerMiAcceso(data);
}

// Pregunta a la base (RPC mi_acceso, con la sesión de ella). Cualquier falla = null = "Sin verificar".
async function miAcceso(sesion: SesionClienta, ahora: number): Promise<MiAcceso | null> {
  const simulado = accesoSimulado(entornoDeProceso(), ahora);
  if (simulado) return simulado.acceso;
  if (sesion.simulada || !hayConfigSupabase()) return null;
  return consultarMiAcceso(await supabaseServidor());
}

/** Lo que responde mi_acceso() para esta sesión (null = no se pudo verificar). Lo usa /api/acceso. */
export async function accesoDeSesion(sesion: SesionClienta): Promise<MiAcceso | null> {
  return miAcceso(sesion, Date.now());
}

/**
 * Justo después de verificar el código o el enlace: pregunta con el MISMO cliente que abrió
 * la sesión (sus cookies nuevas todavía no vienen en la petición). cliente null = sesión simulada.
 */
export async function accesoRecienEntrada(cliente: ClienteSupabase | null): Promise<MiAcceso | null> {
  const simulado = accesoSimulado(entornoDeProceso(), Date.now());
  if (simulado) return simulado.acceso;
  return cliente ? consultarMiAcceso(cliente) : null;
}

export async function estadoDeCuenta(sesion: SesionClienta): Promise<{ clave: ClaveCuenta; hasta: string | null }> {
  const ahora = Date.now();
  const acceso = await miAcceso(sesion, ahora);
  return { clave: claveCuenta(acceso, ahora), hasta: acceso?.hasta ?? null };
}
