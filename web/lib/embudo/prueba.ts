// La prueba gratis del paywall (docs/copy/embudo.md §2): 7 días y el cobro empieza
// el día 7. {fecha_cobro} se muestra en formato humano ("28 de octubre") en la
// línea de tiempo y bajo el botón. Funciones puras: se prueban con node --test.

import { etiquetasDeRespuestas } from '@/components/embudo/textos';
import type { Respuestas } from './estado';

export const DIAS_PRUEBA = 7;

const FORMATO_DIA = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' });

/** Día del primer cobro si la prueba empieza `hoy` (fecha local del teléfono). */
export function fechaCobro(hoy: Date): string {
  return FORMATO_DIA.format(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + DIAS_PRUEBA));
}

/**
 * {N} de "Hecho con tus {N} respuestas": las respuestas que se VEN como chips debajo
 * (etiquetasDeRespuestas: momento · edad · crisis respondidas). El nombre no tiene
 * chip, así que no cuenta: el número y los chips salen de la misma lista y no pueden
 * dejar de cuadrar. Las saltadas no cuentan, y la crisis cuenta solo si quedó alguna
 * opción vigente (un id viejo, 'golpea' o 'cambia', ya no es una respuesta).
 */
export function contarRespuestas(r: Respuestas): number {
  return etiquetasDeRespuestas(r).length;
}
