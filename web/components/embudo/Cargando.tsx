'use client';

// 1.7 "Armando el plan" (50 B): no es relleno, es el inicio del pitch. Cada línea
// usa una respuesta real y recibe su check, una tras otra (≈4,4 s + pausa de
// 0,7 s con todo listo). Sin botones y sin atrás. Con "reducir movimiento" las
// 4 líneas aparecen ya marcadas y el texto es el mismo. Cada línea nombra su etapa
// del Método (Antes · Durante · Después) y se marca con el mismo check que se
// llena del resultado: el embudo tiene un solo check.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckQueSeLlena, Titulo } from './ui';
import { CARGANDO, llenar, type Variables } from './textos';

const ENTRE_LINEAS_MS = 1100;
const PAUSA_FINAL_MS = 700;
const LECTURA_REDUCIDO_MS = 2500;

export function Cargando({ v, enfocar, onListo }: { v: Variables; enfocar: boolean; onListo: () => void }) {
  const reduce = useReducedMotion() === true;
  const [hechas, setHechas] = useState(0);
  const total = CARGANDO.lineas.length;
  const listas = reduce ? total : hechas;
  const terminado = listas >= total;

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(onListo, LECTURA_REDUCIDO_MS);
      return () => clearTimeout(t);
    }
    const tiempos = CARGANDO.lineas.map((_, i) => setTimeout(() => setHechas(i + 1), (i + 1) * ENTRE_LINEAS_MS));
    tiempos.push(setTimeout(onListo, total * ENTRE_LINEAS_MS + PAUSA_FINAL_MS));
    return () => tiempos.forEach(clearTimeout);
  }, [reduce, onListo, total]);

  return (
    <div className="flex flex-1 flex-col" aria-busy={!terminado}>
      <Titulo texto={llenar(CARGANDO.titulo, v)} enfocar={enfocar} />
      <ul className="mt-8 flex flex-col gap-4">
        {CARGANDO.lineas.map((linea, i) => {
          const hecha = i < listas;
          const activa = i === listas;
          return (
            <li
              key={linea.texto}
              className={`flex min-h-11 items-start gap-3 text-[18px] leading-[1.4] transition-opacity duration-200 ${
                hecha || activa ? 'opacity-100' : 'opacity-40'
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
                        activa ? 'border-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_50%,transparent)]'
                      }`}
                      animate={activa && !reduce ? { opacity: [1, 0.35, 1] } : { opacity: 1 }}
                      transition={activa && !reduce ? { duration: 1, repeat: Infinity } : { duration: 0 }}
                    />
                  )}
                </AnimatePresence>
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[13px] leading-tight font-bold tracking-[0.06em] text-[var(--accent)] uppercase">{linea.etapa}</span>
                <span>{llenar(linea.texto, v)}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className="mt-8 min-h-7 text-[18px] font-semibold text-[var(--accent)]">
        {terminado ? llenar(CARGANDO.listo, v) : ''}
      </p>
    </div>
  );
}
