'use client';

// 1.5 Reconocimiento con etiqueta de identidad (50 A5, variante final).
// Arriba, las 3 primeras fotos reales de SU rutina con el check verde en la
// primera (TiraDeFotos: el mismo bloque del resumen del paywall). Así 1.5 y 1.6
// hablan el mismo lenguaje de fotos, sin ilustración que parezca un esqueleto de
// carga. Sin opciones, un solo botón. Entrada escalonada a 60 ms (entrada(i)).

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
      <motion.div {...entrada(0)} className="mb-6">
        <TiraDeFotos pasos={pasos} tamano={72} className="w-fit" />
      </motion.div>
      <motion.div {...entrada(1)}>
        <Titulo texto={llenar(RECONOCIMIENTO.titulo, v)} enfocar={enfocar} />
      </motion.div>
      <motion.p {...entrada(2)} className="mt-4 text-[18px] leading-[1.5] text-[var(--text-primary)]">
        <MarkedCopy text={llenar(RECONOCIMIENTO.texto, v)} />
      </motion.p>
      <motion.p {...entrada(3)} className="mt-4 text-[18px] leading-[1.5] text-[var(--text-secondary)]">
        <MarkedCopy text={llenar(RECONOCIMIENTO.texto2, v)} />
      </motion.p>
      <PieFijo>
        <BotonPrincipal onClick={onSeguir}>{RECONOCIMIENTO.boton}</BotonPrincipal>
      </PieFijo>
    </div>
  );
}
