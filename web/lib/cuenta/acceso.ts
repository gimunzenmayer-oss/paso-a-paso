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

/** Lo que responde GET /api/acceso a la app (app/js/acceso.js lo lee con PP.acceso.leerRespuesta). */
export type CuerpoApiAcceso =
  | { acceso: boolean; estado: string; hasta: string | null }
  | { sin_sesion: true }
  | { sin_verificar: true };

export interface RespuestaApiAcceso {
  status: 200 | 401 | 503;
  cuerpo: CuerpoApiAcceso;
}

/**
 * Plan, decisión 6: solo un `acceso:false` explícito de la base cierra la app. Por eso:
 * · sin sesión → 401 `sin_sesion` (la app pide entrar, respetando el pase vigente);
 * · la base no respondió, respondió algo raro, o no vio la sesión que Auth sí vio
 *   (estado 'sin_sesion' dentro de mi_acceso) → 503: la app lo trata como sin conexión;
 * · si no, 200 con lo que dijo la base.
 */
export function respuestaApiAcceso(lectura: { tipo: 'sin_sesion' } | { tipo: 'sin_verificar' } | { tipo: 'acceso'; acceso: MiAcceso | null }): RespuestaApiAcceso {
  if (lectura.tipo === 'sin_sesion') return { status: 401, cuerpo: { sin_sesion: true } };
  if (lectura.tipo === 'sin_verificar' || !lectura.acceso || lectura.acceso.estado === 'sin_sesion') {
    return { status: 503, cuerpo: { sin_verificar: true } };
  }
  const { acceso, estado, hasta } = lectura.acceso;
  return { status: 200, cuerpo: { acceso, estado, hasta } };
}

/** La app, con el aviso "Listo, ya entraste." (docs/copy/embudo.md §3.3). */
export const APP_TRAS_ENTRAR = '/app/index.html?hola=1';

/**
 * Adónde va después de demostrar que el correo es suyo (§3.3): con un `acceso:true` claro
 * de la base, a la app; si no (sin acceso, sin compra o sin verificar), a /cuenta, que
 * explica su caso. /cuenta sigue abierta desde la app ("Volver a la app" / enlaces).
 */
export function destinoTrasEntrar(a: MiAcceso | null, compra: boolean): string {
  if (a?.acceso === true) return APP_TRAS_ENTRAR;
  return compra ? '/cuenta?hola=1&compra=1' : '/cuenta?hola=1';
}
