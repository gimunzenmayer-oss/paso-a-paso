'use server';

import { cookies, headers } from 'next/headers';
import { hayConfigSupabase } from '@/lib/supabase/config';
import { supabaseServidor } from '@/lib/supabase/servidor';
import { minutosDeEspera, permitido } from '@/lib/servidor/limite';
import {
  codigoCompleto,
  errorDeEnvio,
  errorDeVerificacion,
  limpiarCodigo,
  normalizarCorreo,
  type ErrorCodigo,
  type ErrorEnvio,
} from '@/lib/cuenta/formato';
import { codigoSimulado, COOKIE_SIMULADA, entornoDeProceso } from '@/lib/cuenta/simulacion';

// /entrar (plan docs/planes/entrada-de-pago.md, paso 7): correo → código de 6 dígitos.
// Sin contraseñas y sin llave service-role: todo con la llave pública y la sesión de ella.
// Anti-enumeración: la respuesta es la misma exista o no el correo. Supabase crea la
// cuenta de acceso si no existía (shouldCreateUser); quién tiene acceso lo decide la
// base con mi_acceso() en /cuenta, y el trigger une profiles.user_id por correo.
//
// Freno: lib/servidor/limite.ts (en memoria por instancia, el mismo del panel). Supabase
// Auth tiene además sus propios límites por correo y por IP.
// PENDIENTE PARA PRODUCCIÓN: en Vercel cada instancia lleva su propia cuenta; un freno
// compartido (Upstash / tabla en la base) lo haría exacto entre instancias.

export type EstadoEntrar =
  | { paso: 'correo'; correo: string; error?: ErrorEnvio | 'formato' }
  | {
      paso: 'codigo';
      correo: string;
      /** Hora del servidor en que se pidió el último código (para "vencido"). */
      enviadoEn: number;
      reenviado: boolean;
      error?: ErrorCodigo;
      minutos?: number;
      /** Falló el reenvío: se muestra el error del envío, no el del código. */
      errorEnvio?: ErrorEnvio;
    }
  | { paso: 'listo'; destino: string };

const VENTANA_MS = 15 * 60_000;
const MAX_ENVIOS_IP = 10;
const MAX_ENVIOS_CORREO = 5;
const MAX_INTENTOS = 5;

async function ipActual() {
  const h = await headers();
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'sin-ip';
}

async function origen() {
  const fijo = process.env.NEXT_PUBLIC_SITE_URL;
  if (fijo) return fijo.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return `${proto}://${host}`;
}

async function enviarCodigo(correo: string): Promise<ErrorEnvio | null> {
  const ip = await ipActual();
  // Las dos cuentas suben siempre (sin cortocircuito): el freno no cambia según el correo.
  const porIp = permitido(`entrar:ip:${ip}`, MAX_ENVIOS_IP, VENTANA_MS);
  const porCorreo = permitido(`entrar:correo:${correo}`, MAX_ENVIOS_CORREO, VENTANA_MS);
  if (!porIp || !porCorreo) return 'demasiados';

  if (codigoSimulado(entornoDeProceso()) !== null) return null; // desarrollo: no se manda correo.
  if (!hayConfigSupabase()) {
    console.error('[entrar] falta la configuración de Supabase');
    return 'red';
  }
  const supabase = await supabaseServidor();
  const { error } = await supabase.auth.signInWithOtp({
    email: correo,
    options: { shouldCreateUser: true, emailRedirectTo: `${await origen()}/auth/callback` },
  });
  if (error) {
    console.error('[entrar] no se pudo enviar el código', error.status, error.code);
    return errorDeEnvio({ status: error.status, code: error.code });
  }
  return null;
}

async function revisarCodigo(correo: string, codigo: string, enviadoEn: number | null, compra: boolean): Promise<EstadoEntrar> {
  const base = { paso: 'codigo' as const, correo, enviadoEn: enviadoEn ?? Date.now(), reenviado: false };
  if (!codigoCompleto(codigo)) return { ...base, error: 'faltan' };

  const clave = `verificar:${await ipActual()}:${correo}`;
  if (!permitido(clave, MAX_INTENTOS, VENTANA_MS)) {
    return { ...base, error: 'muchos', minutos: minutosDeEspera(clave, VENTANA_MS) };
  }
  const destino = compra ? '/cuenta?hola=1&compra=1' : '/cuenta?hola=1';

  const simulado = codigoSimulado(entornoDeProceso());
  if (simulado !== null) {
    if (codigo !== simulado) return { ...base, error: errorDeVerificacion({ status: 403, code: 'otp_expired' }, enviadoEn, Date.now()) };
    (await cookies()).set(COOKIE_SIMULADA, correo, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 });
    return { paso: 'listo', destino };
  }
  if (!hayConfigSupabase()) return { ...base, error: 'red' };

  const supabase = await supabaseServidor();
  const { error } = await supabase.auth.verifyOtp({ email: correo, token: codigo, type: 'email' });
  if (error) {
    console.error('[entrar] código no aceptado', error.status, error.code);
    return { ...base, error: errorDeVerificacion({ status: error.status, code: error.code }, enviadoEn, Date.now()) };
  }
  return { paso: 'listo', destino };
}

// Una sola acción para los tres formularios de /entrar (campo "accion").
export async function entrar(previo: EstadoEntrar, form: FormData): Promise<EstadoEntrar> {
  const accion = form.get('accion');
  const compra = form.get('compra') === '1';
  const correo = normalizarCorreo(form.get('email'));

  if (accion === 'otro') {
    return { paso: 'correo', correo: previo.paso === 'listo' ? '' : previo.correo };
  }
  if (!correo) return { paso: 'correo', correo: String(form.get('email') ?? '').slice(0, 254), error: 'formato' };

  if (accion === 'verificar') {
    const enviado = Number(form.get('enviado'));
    return revisarCodigo(correo, limpiarCodigo(form.get('codigo')), Number.isFinite(enviado) && enviado > 0 ? enviado : null, compra);
  }

  // 'pedir' o 'reenviar'
  const error = await enviarCodigo(correo);
  if (error) {
    return accion === 'reenviar' && previo.paso === 'codigo'
      ? { paso: 'codigo', correo: previo.correo, enviadoEn: previo.enviadoEn, reenviado: false, errorEnvio: error }
      : { paso: 'correo', correo, error };
  }
  return { paso: 'codigo', correo, enviadoEn: Date.now(), reenviado: accion === 'reenviar' };
}
