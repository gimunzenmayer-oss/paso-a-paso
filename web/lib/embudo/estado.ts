// Respuestas del onboarding. Viven SOLO en el teléfono (localStorage
// "pp_onboarding"); nunca se envían al servidor. La app (app/js) las lee
// al arrancar por primera vez para armar la primera rutina.

import type { Plan } from './checkout';

export const CLAVE_ONBOARDING = 'pp_onboarding';

export const EDADES = ['2-4', '5-7', '8-12'] as const;
export const MOMENTOS = ['manana', 'comidas', 'escuela', 'dormir'] as const;

export type Edad = (typeof EDADES)[number];
export type Momento = (typeof MOMENTOS)[number];

export interface Respuestas {
  nombre?: string;
  edad?: Edad;
  momento?: Momento;
  crisis?: string[];
}

export interface EstadoOnboarding {
  v: 1;
  respuestas: Respuestas;
  plan?: Plan;
  ts: number;
}

function esDe<T extends string>(lista: readonly T[], x: unknown): x is T {
  return typeof x === 'string' && (lista as readonly string[]).includes(x);
}

// Limpia un nombre escrito a mano: sin etiquetas ni saltos, máximo 30 letras.
export function limpiarNombre(x: unknown): string | undefined {
  if (typeof x !== 'string') return undefined;
  const n = x.replace(/[<>\n\r\t]/g, '').replace(/\s+/g, ' ').trim().slice(0, 30);
  return n || undefined;
}

// Acepta lo guardado (aunque venga de una versión vieja o esté roto) y
// devuelve un estado válido, o null si no sirve.
export function validarEstado(raw: unknown): EstadoOnboarding | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (o.v !== 1) return null;
  const r = (o.respuestas && typeof o.respuestas === 'object' ? o.respuestas : {}) as Record<string, unknown>;
  const respuestas: Respuestas = {};
  const nombre = limpiarNombre(r.nombre);
  if (nombre) respuestas.nombre = nombre;
  if (esDe(EDADES, r.edad)) respuestas.edad = r.edad;
  if (esDe(MOMENTOS, r.momento)) respuestas.momento = r.momento;
  if (Array.isArray(r.crisis)) {
    const c = r.crisis.filter((x): x is string => typeof x === 'string').map((x) => x.slice(0, 40)).slice(0, 6);
    if (c.length) respuestas.crisis = c;
  }
  const estado: EstadoOnboarding = { v: 1, respuestas, ts: typeof o.ts === 'number' ? o.ts : Date.now() };
  // Un 'anual' guardado de antes (ya no se vende) se descarta.
  if (o.plan === 'mensual') estado.plan = o.plan;
  return estado;
}
