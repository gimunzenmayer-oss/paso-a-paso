'use client';

// 1.5 Reconocimiento con etiqueta de identidad (50 A5, variante final).
// Arriba, las 3 primeras fotos reales de SU rutina con el check verde en la
// primera (TiraDeFotos fluida: el mismo bloque, al ancho completo, en 1.5, 1.6 y el
// resumen del paywall). Así 1.5 y 1.6 hablan el mismo lenguaje de fotos, sin
// ilustración que parezca un esqueleto de carga. Sin opciones, un solo botón, que
// dice a dónde lleva. Entrada escalonada a 60 ms (entrada(i)).
// El texto 2 (quita la culpa) va en el plano hundido: un plano más, y ya no se lee
// como la continuación del texto 1. Todo el bloque va centrado en el alto libre
// (my-auto): el hueco se reparte arriba y abajo, no queda todo junto al pie.

import { motion } from 'motion/react';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import type { PasoRutina } from '@/lib/embudo/rutinas';
import { BotonPrincipal, entrada, PieFijo, TiraDeFotos, Titulo } from './ui';
import { llenar, RECONOCIMIENTO, type Variables } from './textos';

export function Reconocimiento({
  v,
  pasos,
  enfocar,
  onSeguir,
}: {
  v: Variables;
  /** Los pasos de su rutina (rutinaDe(momento)). */
  pasos: readonly PasoRutina[];
  enfocar: boolean;
  onSeguir: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      {/* flex-1 toma el alto libre (el mt-auto del pie no compite) y my-auto centra el bloque en él. */}
      <div className="flex flex-1 flex-col">
        <div className="my-auto pb-6">
          <motion.div {...entrada(0)} className="mb-6">
            <TiraDeFotos pasos={pasos} tamano="fluida" />
          </motion.div>
          <motion.div {...entrada(1)}>
            <Titulo texto={llenar(RECONOCIMIENTO.titulo, v)} enfocar={enfocar} />
          </motion.div>
          <motion.p {...entrada(2)} className="mt-4 text-[18px] leading-[1.5] text-pretty text-[var(--text-primary)]">
            <MarkedCopy text={llenar(RECONOCIMIENTO.texto, v)} />
          </motion.p>
          <motion.p
            {...entrada(3)}
            className="mt-5 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4 text-[18px] leading-[1.5] text-pretty text-[var(--text-secondary)]"
          >
            <MarkedCopy text={llenar(RECONOCIMIENTO.texto2, v)} />
          </motion.p>
        </div>
      </div>
      <PieFijo>
        <BotonPrincipal onClick={onSeguir}>{RECONOCIMIENTO.boton}</BotonPrincipal>
      </PieFijo>
    </div>
  );
}
