// Reglas puras de /entrar (docs/copy/embudo.md §3): qué es un correo válido, cómo se
// limpia el código y qué error se muestra según lo que respondió Supabase Auth.
// Sin dependencias del servidor: se prueban con node --test (pruebas/cuenta.test.mjs).

/** El mismo patrón que pide el panel (/admin): algo@algo.dominio, sin espacios. */
const CORREO = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

/** El código dura 10 minutos (Supabase Auth: "Email OTP Expiration" = 600 s). */
export const VIGENCIA_CODIGO_MS = 10 * 60_000;
/** Supabase deja pedir otro código al mismo correo cada 60 s. */
export const ESPERA_REENVIO_S = 60;
export const DIGITOS_CODIGO = 6;

export function normalizarCorreo(valor: unknown): string | null {
  if (typeof valor !== 'string') return null;
  const correo = valor.trim().toLowerCase();
  return CORREO.test(correo) ? correo : null;
}

/** Solo los dígitos: "123 456" o "123-456" pegados del correo valen igual. */
export function limpiarCodigo(valor: unknown): string {
  return typeof valor === 'string' ? valor.replace(/\D/g, '').slice(0, DIGITOS_CODIGO) : '';
}

export function codigoCompleto(codigo: string): boolean {
  return new RegExp(`^\\d{${DIGITOS_CODIGO}}$`).test(codigo);
}

/** Lo que importa de un error de Supabase Auth (AuthError: status HTTP y code). */
export interface FalloAuth {
  status?: number;
  code?: string;
}

export type ErrorEnvio = 'red' | 'demasiados';
export type ErrorCodigo = 'incorrecto' | 'vencido' | 'muchos' | 'faltan' | 'red';

function esLimite(f: FalloAuth): boolean {
  return f.status === 429 || (typeof f.code === 'string' && f.code.startsWith('over_'));
}

/** Sin red o servidor caído (status 0, ausente o 5xx): no dice nada de la sesión ni del correo. */
export function esRed(f: FalloAuth): boolean {
  return f.status === undefined || f.status === 0 || f.status >= 500;
}

/** Error al pedir el código. Nunca depende de si el correo existe (anti-enumeración). */
export function errorDeEnvio(f: FalloAuth): ErrorEnvio {
  return esLimite(f) ? 'demasiados' : 'red';
}

/**
 * Error al revisar el código. Supabase responde lo mismo (otp_expired) a un código
 * equivocado y a uno vencido; los distingue la hora en que se pidió: pasados los
 * 10 minutos es "vencido", antes es "incorrecto".
 */
export function errorDeVerificacion(f: FalloAuth, enviadoEn: number | null, ahora: number): ErrorCodigo {
  if (esLimite(f)) return 'muchos';
  if (esRed(f)) return 'red';
  if (enviadoEn !== null && ahora - enviadoEn > VIGENCIA_CODIGO_MS) return 'vencido';
  return 'incorrecto';
}
