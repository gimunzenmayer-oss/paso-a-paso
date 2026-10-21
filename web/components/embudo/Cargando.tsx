'use client';

// 1.7 "Armando el plan" (50 B): no es relleno, es el inicio del pitch. Cada línea
// usa una respuesta real y recibe su check, una tras otra (≈4,4 s + pausa de
// 0,7 s con todo listo). Con "reducir movimiento" las 4 líneas aparecen ya marcadas
// y el texto es el mismo. Cada línea nombra su etapa del Método (Antes · Durante ·
// Después) y se marca con el mismo check que se llena del resultado: el embudo
// tiene un solo check.
// Las líneas van en una tarjeta con hairline (el plano de la superficie) y entran
// escalonadas (60 ms). Al marcarse la línea 1 ("… pasos con fotos") aparecen esas
// fotos en la MISMA TiraDeFotos fluida de 1.5, 1.6 y el resumen del paywall (plano
// hundido, check en la 1.ª). El texto de cada línea va con text-wrap: pretty.
// Salidas de la espera: la cabecera lleva «‹ Atrás» (vuelve al compromiso; los
// temporizadores se limpian al desmontar) y tocar la tarjeta marca todo y pasa al
// resultado ("Ver el plan ya"). Quien ya vio ESTE plan (`inmediato`) pasa al
// resultado apenas monta; quien ya vio otro y cambió el momento (`rapido`) ve la
// misma secuencia a 350 ms por línea.
// Línea pendiente: el texto NO se atenúa con opacidad (al 40 % o al 60 % no llega a
// AA sobre la superficie): va entero en --text-secondary, etapa incluida, y solo el
// círculo vacío queda al 60 %. Lo hecho y lo activo llevan la etapa en acento.
// Al terminar, "El plan de {nombre} está listo." entra como pie de la misma tarjeta
// (hairline arriba) y la pantalla avanza sola: es una transición, sin órdenes.
// Título y tarjeta van centrados en el alto libre (my-auto): sin un vacío bajo la tarjeta.
// La tarjeta tiene su alto final desde el inicio (la tira reserva su lugar), así nada se mueve.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Hairline } from '@/components/landing/ui';
import type { PasoRutina } from '@/lib/embudo/rutinas';
import { CheckQueSeLlena, entrada, TiraDeFotos, Titulo } from './ui';
import { CARGANDO, llenar, type Variables } from './textos';

const ENTRE_LINEAS_MS = 1100;
const PAUSA_FINAL_MS = 700;
/** Ya la vio: la misma secuencia, sin hacerla esperar otra vez. */
const ENTRE_LINEAS_RAPIDO_MS = 350;
const PAUSA_FINAL_RAPIDO_MS = 400;
const LECTURA_REDUCIDO_MS = 2500;
const LECTURA_REDUCIDO_RAPIDO_MS = 900;
/** Tocó la tarjeta: se ven las 4 líneas marcadas un instante y pasa al resultado. */
const PAUSA_AL_SALTAR_MS = 400;

export function Cargando({
  v,
  pasos,
  rapido,
  inmediato,
  enfocar,
  onListo,
}: {
  v: Variables;
  /** Los pasos de su rutina: la línea 1 muestra sus fotos al marcarse. */
  pasos: readonly PasoRutina[];
  /** true si ya llegó a un resultado antes (alcanzado ≥ resultado) y vuelve con otro momento. */
  rapido: boolean;
  /** true si ya vio el resultado de este mismo plan: pasa al resultado apenas monta. */
  inmediato: boolean;
  enfocar: boolean;
  onListo: () => void;
}) {
  const reduce = useReducedMotion() === true;
  const [hechas, setHechas] = useState(0);
  const [saltada, setSaltada] = useState(false);
  const total = CARGANDO.lineas.length;
  const listas = reduce || saltada ? total : hechas;
  const terminado = listas >= total;

  useEffect(() => {
    if (inmediato) {
      onListo();
      return;
    }
    if (saltada) {
      const t = setTimeout(onListo, PAUSA_AL_SALTAR_MS);
      return () => clearTimeout(t);
    }
    if (reduce) {
      const t = setTimeout(onListo, rapido ? LECTURA_REDUCIDO_RAPIDO_MS : LECTURA_REDUCIDO_MS);
      return () => clearTimeout(t);
    }
    const paso = rapido ? ENTRE_LINEAS_RAPIDO_MS : ENTRE_LINEAS_MS;
    const tiempos = CARGANDO.lineas.map((_, i) => setTimeout(() => setHechas(i + 1), (i + 1) * paso));
    tiempos.push(setTimeout(onListo, total * paso + (rapido ? PAUSA_FINAL_RAPIDO_MS : PAUSA_FINAL_MS)));
    return () => tiempos.forEach(clearTimeout);
  }, [inmediato, saltada, reduce, rapido, onListo, total]);

  return (
    <div className="flex flex-1 flex-col" aria-busy={!terminado}>
      {/* pb-6: con el bloque centrado, el título queda un poco más arriba que la mitad. */}
      <div className="my-auto pb-6">
        <Titulo texto={llenar(CARGANDO.titulo, v)} enfocar={enfocar} />
        <Hairline surface="surface" className="relative mt-8 shadow-[var(--shadow-2)]">
          {/* Toda la tarjeta es el atajo: marca las 4 líneas y pasa al resultado. */}
          <button
            type="button"
            aria-label={CARGANDO.verYa}
            onClick={() => setSaltada(true)}
            className="absolute inset-0 z-10 rounded-[inherit] [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          />
          <ul className="flex flex-col gap-4 p-4">
            {CARGANDO.lineas.map((linea, i) => {
              const hecha = i < listas;
              const activa = i === listas;
              return (
                <motion.li key={linea.texto} {...entrada(i)} className="flex min-h-11 flex-col">
                  <span
                    className={`flex items-start gap-3 text-[18px] leading-[1.4] transition-colors duration-200 ${
                      hecha || activa ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    <span className="relative mt-0.5 inline-flex size-6 shrink-0 items-center justify-center">
                      <AnimatePresence initial={false} mode="wait">
                        {hecha ? (
                          <CheckQueSeLlena key="hecha" tamano={24} />
                        ) : (
                          <motion.span
                            key="pendiente"
                            aria-hidden="true"
                            className={`inline-block size-[22px] rounded-full border-2 ${
                              activa ? 'border-[var(--accent)]' : 'border-[var(--text-tertiary)]'
                            }`}
                            // La opacidad la maneja motion (un estilo en línea): el círculo en espera queda al 60 %.
                            animate={activa && !reduce ? { opacity: [1, 0.35, 1] } : { opacity: activa ? 1 : 0.6 }}
                            transition={activa && !reduce ? { duration: 1, repeat: Infinity } : { duration: 0 }}
                          />
                        )}
                      </AnimatePresence>
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span
                        className={`text-[13px] leading-tight font-bold tracking-[0.06em] uppercase ${
                          hecha || activa ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {linea.etapa}
                      </span>
                      <span className="text-pretty">{llenar(linea.texto, v)}</span>
                    </span>
                  </span>
                  {/* Línea 1 marcada: aparecen las fotos que promete (decorativas: el texto ya las nombra). */}
                  {/* La tira ocupa su lugar desde el inicio (invisible hasta que se marca la línea 1): con el
                      bloque centrado (my-auto), aparecer después movía el título y la tarjeta ~50px. Se vuelve
                      a montar al marcarse, así sus fotos entran una por una. */}
                  {i === 0 && (
                    <div className={hecha ? '' : 'invisible'}>
                      <TiraDeFotos key={hecha ? 'lista' : 'espera'} pasos={pasos} tamano="fluida" className="mt-3 ml-9" />
                    </div>
                  )}
                </motion.li>
              );
            })}
          </ul>
          {/* La región viva existe desde el inicio (los lectores anuncian el cambio); el pie aparece al terminar. */}
          <div aria-live="polite">
            {terminado && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-t border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] p-4 text-[18px] leading-snug font-semibold text-[var(--accent)]"
              >
                {llenar(CARGANDO.listo, v)}
              </motion.p>
            )}
          </div>
        </Hairline>
      </div>
    </div>
  );
}
