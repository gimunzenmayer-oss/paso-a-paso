'use client';

// 1.5 Reconocimiento con etiqueta de identidad (50 A5, variante final).
// Ilustración propia: la tira de pasos de la app (el dispositivo de la marca,
// FICHA-ARTE) con el primer paso cumplido. Sin opciones, un solo botón.

import { motion, useReducedMotion } from 'motion/react';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import { BotonPrincipal, PieFijo, Titulo } from './ui';
import { llenar, RECONOCIMIENTO, type Variables } from './textos';

function TiraDePasos() {
  return (
    <svg viewBox="0 0 220 96" width="220" height="96" aria-hidden="true" className="max-w-full">
      <ellipse cx="110" cy="52" rx="104" ry="40" fill="color-mix(in oklab, var(--accent) 9%, transparent)" />
      {/* Antes: paso cumplido, con su check */}
      <rect x="20" y="22" width="52" height="60" rx="12" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
      <rect x="28" y="30" width="36" height="26" rx="6" fill="color-mix(in oklab, var(--accent) 22%, var(--surface))" />
      <rect x="30" y="64" width="32" height="5" rx="2.5" fill="color-mix(in oklab, var(--accent) 45%, transparent)" />
      <circle cx="66" cy="24" r="11" fill="var(--accent)" />
      <path d="M61 24.5l3.4 3.4 6.4-6.8" fill="none" stroke="var(--surface)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Durante: el paso en curso, en la 2.ª nota */}
      <rect x="84" y="22" width="52" height="60" rx="12" fill="var(--surface)" stroke="var(--accent-2)" strokeWidth="2" />
      <rect x="92" y="30" width="36" height="26" rx="6" fill="color-mix(in oklab, var(--accent-2) 20%, var(--surface))" />
      <rect x="94" y="64" width="32" height="5" rx="2.5" fill="color-mix(in oklab, var(--accent-2) 40%, transparent)" />
      {/* Después: lo que viene */}
      <rect x="148" y="22" width="52" height="60" rx="12" fill="var(--surface)" stroke="color-mix(in oklab, var(--text-tertiary) 35%, transparent)" strokeWidth="1.5" />
      <rect x="156" y="30" width="36" height="26" rx="6" fill="var(--surface-2)" />
      <rect x="158" y="64" width="32" height="5" rx="2.5" fill="color-mix(in oklab, var(--text-tertiary) 25%, transparent)" />
    </svg>
  );
}

export function Reconocimiento({ v, enfocar, onSeguir }: { v: Variables; enfocar: boolean; onSeguir: () => void }) {
  const reduce = useReducedMotion();
  const entrada = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: reduce ? 0 : 0.07 * i, ease: [0.16, 1, 0.3, 1] as const },
  });
  return (
    <div className="flex flex-1 flex-col">
      <motion.div {...entrada(0)} className="mb-6 flex justify-center">
        <TiraDePasos />
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
