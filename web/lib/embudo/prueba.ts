// La prueba gratis del paywall (docs/copy/embudo.md §2): 7 días y el cobro empieza
// el día 7. {fecha_cobro} se muestra en formato humano ("28 de octubre") en la
// línea de tiempo y bajo el botón. Funciones puras: se prueban con node --test.

import type { Respuestas } from './estado';

export const DIAS_PRUEBA = 7;

const FORMATO_DIA = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' });

/** Día del primer cobro si la prueba empieza `hoy` (fecha local del teléfono). */
export function fechaCobro(hoy: Date): string {
  return FORMATO_DIA.format(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + DIAS_PRUEBA));
}

/** {N} de "Hecho con tus {N} respuestas": preguntas respondidas (las saltadas no cuentan). */
export function contarRespuestas(r: Respuestas): number {
  return [r.nombre, r.edad, r.momento, r.crisis?.length ? r.crisis : undefined].filter((x) => x !== undefined).length;
}
