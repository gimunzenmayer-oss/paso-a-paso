// Lo que responde la RPC public.mi_acceso() (migración 20261021110000_acceso_clientas.sql)
// y cómo se traduce a una fila de la tabla de /cuenta (docs/copy/embudo.md §4).
// Puro: se prueba con node --test.

export interface MiAcceso {
  acceso: boolean;
  /** profiles.status, o 'admin' / 'none' / 'sin_sesion' (los arma mi_acceso). */
  estado: string;
  /** ISO: fin de la prueba (trialing) o access_until (los demás). */
  hasta: string | null;
}

/** Valida la respuesta de la base; cualquier forma inesperada = no se pudo verificar. */
export function leerMiAcceso(data: unknown): MiAcceso | null {
  if (typeof data !== 'object' || data === null) return null;
  const acceso = 'acceso' in data ? data.acceso : undefined;
  const estado = 'estado' in data ? data.estado : undefined;
  const hasta = 'hasta' in data ? data.hasta : null;
  if (typeof acceso !== 'boolean' || typeof estado !== 'string') return null;
  if (hasta !== null && (typeof hasta !== 'string' || Number.isNaN(Date.parse(hasta)))) return null;
  return { acceso, estado, hasta };
}

export type ClaveCuenta =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelada'
  | 'terminada'
  | 'refunded'
  | 'sin_compra'
  | 'sin_verificar'
  | 'admin';

/**
 * La fila de §4 que le toca. null (red, error del servidor o respuesta rara) es
 * "Sin verificar": nunca se le dice "no compraste" sin una respuesta clara de la base.
 */
export function claveCuenta(a: MiAcceso | null, ahora: number): ClaveCuenta {
  if (!a) return 'sin_verificar';
  switch (a.estado) {
    case 'admin':
      return 'admin';
    case 'trialing':
    case 'active':
    case 'past_due':
      return a.estado;
    case 'cancelled':
      return a.hasta !== null && Date.parse(a.hasta) > ahora ? 'cancelada' : 'terminada';
    case 'expired':
      return 'terminada';
    case 'refunded':
    case 'chargeback':
      return 'refunded';
    case 'none':
      return 'sin_compra';
    default:
      // 'sin_sesion' (la base no vio la sesión) o un estado nuevo que esta página no conoce.
      return 'sin_verificar';
  }
}

/** Estados sin acceso que se reactivan comprando de nuevo (botón "Volver a activar" → /paywall). */
export function seReactiva(clave: ClaveCuenta): boolean {
  return clave === 'terminada' || clave === 'refunded' || clave === 'sin_compra';
}

/** Estados con una compra en Hotmart que se puede gestionar o cancelar. */
export function seGestionaEnHotmart(clave: ClaveCuenta): boolean {
  return clave === 'trialing' || clave === 'active' || clave === 'past_due' || clave === 'cancelada' || clave === 'sin_verificar';
}
