'use client';

// Cabecera del onboarding: logo (al inicio) y cerrar arriba; atrás y la barra
// fina debajo (50 A2: línea de 3px, acento sobre neutro, pill). La barra arranca
// en 10 % (progreso regalado) y nunca retrocede: el ancho sale del paso más
// lejano alcanzado, no del abierto.

import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronLeft, X } from 'lucide-react';
import { COMUN, llenar, TOTAL_PASOS } from './textos';

export function LogoMarca() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <path d="M8 21h5v-5h5v-5h6" fill="none" stroke="var(--surface)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const BOTON_ICONO =
  'inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] [touch-action:manipulation]';

export function BarraProgreso({
  porcentaje,
  pasoVisible,
  onAtras,
  onCerrar,
}: {
  /** 10 · 25 · 40 · 55 · 70 · 85 · 100 */
  porcentaje: number;
  /** 1..6 para el aria-label "Paso {n} de 6". */
  pasoVisible: number;
  /** Sin función = sin botón (primer paso, cargando y resultado). */
  onAtras?: () => void;
  onCerrar: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 -mx-5 bg-[var(--bg)] px-3 pt-[max(8px,env(safe-area-inset-top))] pb-2">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label={COMUN.logo} className="inline-flex size-11 items-center justify-center rounded-full">
          <LogoMarca />
        </Link>
        <Link href="/" aria-label={COMUN.cerrar} onClick={onCerrar} className={BOTON_ICONO}>
          <X size={22} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
      <div className="flex items-center gap-1">
        {onAtras ? (
          <button type="button" aria-label={COMUN.atras} onClick={onAtras} className={BOTON_ICONO}>
            <ChevronLeft size={24} strokeWidth={2} aria-hidden="true" />
          </button>
        ) : (
          <span aria-hidden="true" className="size-11 shrink-0" />
        )}
        <div
          role="progressbar"
          aria-label={llenar(COMUN.barra, { n: String(Math.min(pasoVisible, TOTAL_PASOS)) })}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={porcentaje}
          className="mr-3 h-[3px] flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]"
        >
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={false}
            animate={{ width: `${porcentaje}%` }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </header>
  );
}
