// Rutinas de ejemplo para el resultado del onboarding (/onboarding, paso 1.8).
// COPIA MANUAL de app/js/datos.js: PP.datosEjemplo().rutinas (texto de cada paso)
// y PP.fotosEjemplo (texto → 'img/x.jpg', servido en el sitio como /app/img/x.jpg).
// Si cambian los pasos o las fotos en datos.js, hay que cambiarlos aquí también.

import type { Momento } from './estado';

export type RutinaId = 'manana' | 'tarde' | 'noche';

export interface PasoRutina {
  texto: string;
  /** Foto real de la app. Sin foto en datos.js (p. ej. "Ponerse el pijama") → undefined. */
  foto?: string;
  /** La foto tiene fondo blanco (recorte de producto): se funde con el marco
   *  (mix-blend-multiply) en vez de dejar un cuadro blanco dentro de --surface-2. */
  fondoClaro?: true;
}

export interface Rutina {
  id: RutinaId;
  nombre: string;
  pasos: readonly PasoRutina[];
}

export const RUTINAS: Record<RutinaId, Rutina> = {
  manana: {
    id: 'manana',
    nombre: 'Mañana',
    pasos: [
      { texto: 'Despertar', foto: '/app/img/despertar.jpg' },
      { texto: 'Ir al baño', foto: '/app/img/bano.jpg' },
      { texto: 'Vestirse', foto: '/app/img/vestirse.jpg' },
      { texto: 'Desayunar', foto: '/app/img/desayunar.jpg' },
      { texto: 'Lavarse los dientes', foto: '/app/img/dientes.jpg' },
      { texto: 'Ponerse los zapatos', foto: '/app/img/zapatos.jpg' },
      { texto: 'Tomar la mochila', foto: '/app/img/mochila.jpg' },
    ],
  },
  tarde: {
    id: 'tarde',
    nombre: 'Volver de la escuela',
    pasos: [
      { texto: 'Quitarse los zapatos', foto: '/app/img/zapatos.jpg' },
      { texto: 'Lavarse las manos', foto: '/app/img/manos.jpg', fondoClaro: true },
      { texto: 'Merendar', foto: '/app/img/manzana.jpg', fondoClaro: true },
      { texto: 'Rato tranquilo', foto: '/app/img/tranquilo.jpg' },
      { texto: 'Jugar en el parque', foto: '/app/img/parque.jpg' },
    ],
  },
  noche: {
    id: 'noche',
    nombre: 'Noche',
    pasos: [
      { texto: 'Cenar', foto: '/app/img/cenar.jpg' },
      { texto: 'Bañarse', foto: '/app/img/banarse.jpg', fondoClaro: true },
      { texto: 'Ponerse el pijama' },
      { texto: 'Lavarse los dientes', foto: '/app/img/dientes.jpg' },
      { texto: 'Leer un cuento', foto: '/app/img/cuento.jpg' },
      { texto: 'Dormir', foto: '/app/img/dormir.jpg' },
    ],
  },
};

// Tabla de docs/copy/embudo.md §1.3 (igual que RUTINA_DE en app/js/datos.js).
// Hoy no hay rutina de comidas: "Las comidas" abre "Noche", que empieza en "Cenar".
export const RUTINA_DE_MOMENTO: Record<Momento, RutinaId> = {
  manana: 'manana',
  comidas: 'noche',
  escuela: 'tarde',
  dormir: 'noche',
};

export function rutinaDe(momento: Momento | undefined): Rutina {
  return RUTINAS[RUTINA_DE_MOMENTO[momento ?? 'manana']];
}

/** Los primeros n pasos CON foto, para las tiras de fotos (una tira nunca muestra
 *  el ícono de reemplazo). Si la rutina tiene menos fotos, completa con los demás. */
export function pasosConFoto(pasos: readonly PasoRutina[], n: number): PasoRutina[] {
  const conFoto = pasos.filter((p) => p.foto);
  return (conFoto.length >= n ? conFoto : [...conFoto, ...pasos.filter((p) => !p.foto)]).slice(0, n);
}

/** La foto que representa cada opción de la pregunta 1.3. Es el primer paso de su
 *  rutina, salvo "Irse a dormir": su rutina ("Noche") empieza en "Cenar", la misma
 *  foto que "Las comidas", así que muestra su propio paso, "Dormir". */
export function pasoQueRepresenta(momento: Momento): PasoRutina {
  const pasos = rutinaDe(momento).pasos;
  if (momento === 'dormir') return pasos.find((p) => p.texto === 'Dormir') ?? pasos[0];
  return pasos[0];
}
