// Simulación SOLO para desarrollo (plan docs/planes/entrada-de-pago.md, decisión 9).
//   CODIGO_SIMULADO=123456   → /entrar no manda correo: ese código abre una sesión simulada.
//   ACCESO_SIMULADO=active   → /cuenta muestra ese estado en vez de llamar a mi_acceso().
// Las dos variables se ignoran salvo que NODE_ENV sea exactamente 'development'.
// En el build de producción Next reemplaza process.env.NODE_ENV por "production" al
// compilar (entornoDeProceso), así que ninguna variable puede encenderla en el servidor real.
// Puro salvo entornoDeProceso: se prueba con node --test.

import type { MiAcceso } from './acceso';

export interface Entorno {
  nodeEnv: string | undefined;
  acceso: string | undefined;
  codigo: string | undefined;
}

export function entornoDeProceso(): Entorno {
  return {
    nodeEnv: process.env.NODE_ENV,
    acceso: process.env.ACCESO_SIMULADO,
    codigo: process.env.CODIGO_SIMULADO,
  };
}

/** Cookie de la sesión simulada (solo se lee en desarrollo). */
export const COOKIE_SIMULADA = 'pp_sesion_simulada';

export const ESTADOS_SIMULADOS = [
  'trialing',
  'active',
  'past_due',
  'cancelled',
  'terminada',
  'expired',
  'refunded',
  'none',
  'admin',
  'error',
] as const;
export type EstadoSimulado = (typeof ESTADOS_SIMULADOS)[number];

function enDesarrollo(e: Entorno): boolean {
  return e.nodeEnv === 'development';
}

/** El código que abre la sesión simulada, o null si la simulación no corre. */
export function codigoSimulado(e: Entorno): string | null {
  if (!enDesarrollo(e) || !e.codigo) return null;
  return /^\d{6}$/.test(e.codigo) ? e.codigo : null;
}

/** El correo de la sesión simulada guardado en la cookie, o null. */
export function correoSimulado(e: Entorno, cookie: string | undefined): string | null {
  if (codigoSimulado(e) === null || !cookie) return null;
  return /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(cookie) ? cookie : null;
}

function esEstadoSimulado(v: string): v is EstadoSimulado {
  return (ESTADOS_SIMULADOS as readonly string[]).includes(v);
}

const DIA = 24 * 60 * 60 * 1000;

/**
 * Lo que respondería mi_acceso() con ACCESO_SIMULADO.
 * undefined = sin simulación (se llama a la base). { acceso: null } = la base falló ('error').
 */
export function accesoSimulado(e: Entorno, ahora: number): { acceso: MiAcceso | null } | undefined {
  if (!enDesarrollo(e) || !e.acceso || !esEstadoSimulado(e.acceso)) return undefined;
  const futuro = new Date(ahora + 5 * DIA).toISOString();
  const pasado = new Date(ahora - 3 * DIA).toISOString();
  switch (e.acceso) {
    case 'error':
      return { acceso: null };
    case 'trialing':
    case 'active':
    case 'past_due':
    case 'cancelled':
      return { acceso: { acceso: true, estado: e.acceso, hasta: futuro } };
    case 'terminada':
      return { acceso: { acceso: false, estado: 'cancelled', hasta: pasado } };
    case 'expired':
    case 'refunded':
      return { acceso: { acceso: false, estado: e.acceso, hasta: pasado } };
    case 'none':
      return { acceso: { acceso: false, estado: 'none', hasta: null } };
    case 'admin':
      return { acceso: { acceso: true, estado: 'admin', hasta: null } };
  }
}
