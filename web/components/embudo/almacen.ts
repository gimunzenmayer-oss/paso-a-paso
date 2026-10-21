'use client';

// Estado del onboarding guardado en ESTE teléfono (localStorage "pp_onboarding").
// Se guarda después de cada paso para retomar donde quedó. Nunca sale del teléfono.
// Forma: {v:1, respuestas, plan?, ts} (lib/embudo/estado.ts) + dos números para
// retomar: `paso` (la pantalla abierta) y `alcanzado` (la más lejana; la barra
// nunca retrocede). La app (app/js/datos.js) ignora esos dos campos.
// Si el almacenamiento falla (modo privado estricto), el flujo sigue en memoria.

import { useMemo, useSyncExternalStore } from 'react';
import { CLAVE_ONBOARDING, validarEstado, type EstadoOnboarding } from '@/lib/embudo/estado';

/** Pantallas en orden: 0 nombre · 1 edad · 2 momento · 3 crisis · 4 reconocimiento · 5 compromiso · 6 cargando · 7 resultado. */
export const ULTIMA_PANTALLA = 7;

export interface Progreso extends EstadoOnboarding {
  paso: number;
  alcanzado: number;
}

// undefined = todavía no se leyó del teléfono.
let memoria: string | null | undefined;
const oyentes = new Set<() => void>();

function leerCrudo(): string | null {
  if (memoria === undefined) {
    try {
      memoria = localStorage.getItem(CLAVE_ONBOARDING);
    } catch {
      memoria = null;
    }
  }
  return memoria;
}

function suscribir(avisar: () => void): () => void {
  oyentes.add(avisar);
  // Otra pestaña cambió el onboarding: se toma su versión.
  const alCambiar = (e: StorageEvent) => {
    if (e.key === CLAVE_ONBOARDING) {
      memoria = e.newValue;
      avisar();
    }
  };
  window.addEventListener('storage', alCambiar);
  return () => {
    oyentes.delete(avisar);
    window.removeEventListener('storage', alCambiar);
  };
}

function pantalla(x: unknown): number {
  return typeof x === 'number' && Number.isInteger(x) && x >= 0 && x <= ULTIMA_PANTALLA ? x : 0;
}

/** Lee lo guardado (aunque esté roto o venga de otra versión). null = no hay nada. */
export function interpretar(crudo: string | null): Progreso | null {
  if (!crudo) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(crudo);
  } catch {
    return null;
  }
  const estado = validarEstado(raw);
  if (!estado) return null;
  const o = raw as Record<string, unknown>;
  const paso = pantalla(o.paso);
  return { ...estado, paso, alcanzado: Math.max(paso, pantalla(o.alcanzado)) };
}

export function estadoNuevo(): Progreso {
  return { v: 1, respuestas: {}, ts: Date.now(), paso: 0, alcanzado: 0 };
}

/** Guarda en el teléfono y avisa a la pantalla. */
export function guardar(p: Progreso): void {
  const limpio: Progreso = {
    v: 1,
    respuestas: p.respuestas,
    ...(p.plan ? { plan: p.plan } : {}),
    ts: Date.now(),
    paso: p.paso,
    alcanzado: Math.max(p.paso, p.alcanzado),
  };
  memoria = JSON.stringify(limpio);
  try {
    localStorage.setItem(CLAVE_ONBOARDING, memoria);
  } catch {
    // Sin almacenamiento: sigue en memoria mientras la página esté abierta.
  }
  for (const avisar of oyentes) avisar();
}

/** Lo último guardado (fuera del render: en manejadores de eventos). */
export function leerProgreso(): Progreso | null {
  return interpretar(leerCrudo());
}

/** Cambia el estado partiendo de lo ÚLTIMO guardado (no de una copia vieja de un cierre). */
export function actualizar(cambio: (actual: Progreso) => Progreso): void {
  guardar(cambio(leerProgreso() ?? estadoNuevo()));
}

/**
 * El estado guardado, para pintar. En el servidor (y en la primera pasada de
 * hidratación) devuelve `undefined`: todavía no se sabe qué hay en el teléfono.
 */
export function useProgreso(): Progreso | null | undefined {
  const crudo = useSyncExternalStore<string | null | undefined>(suscribir, leerCrudo, () => undefined);
  return useMemo(() => (crudo === undefined ? undefined : interpretar(crudo)), [crudo]);
}
