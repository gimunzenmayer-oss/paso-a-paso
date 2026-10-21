'use client';

// Cabecera del onboarding: una sola fila [atrás | barra | ✕], sin logo (el ✕ ya
// lleva al inicio; dos salidas iguales confunden). Barra fina (50 A2: línea de
// 3px, acento sobre neutro, pill) que arranca en 10 % (progreso regalado) y nunca
// retrocede: el ancho sale del paso más lejano alcanzado, no del abierto.

import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronLeft, X } from 'lucide-react';
import { COMUN, llenar, TOTAL_PASOS } from './textos';

const BOTON_ICONO =
  'inline-flex size-12 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] [touch-action:manipulation]';

export function BarraProgreso({
  porcentaje,
  pasoVisible,
  onAtras,
  onCerrar,
}: {
  /** 10 · 25 · 40 · 55 · 70 · 85 (también mientras arma el plan) · 100 */
  porcentaje: number;
  /** 1..6 para el aria-label "Paso {n} de 6". */
  pasoVisible: number;
  /** Sin función = sin botón (primer paso y cargando). */
  onAtras?: () => void;
  onCerrar: () => void;
}) {
  return (
    // Una sola fila [atrás | barra | ✕]. El header sale del margen del contenido
    // (-mx-5) con px-3 para que los botones de 48px queden a 12px del borde; sin
    // atrás, un espaciador de 4px + el gap de 4px la hacen arrancar en 20px, como el título.
    <header className="sticky top-0 z-20 -mx-5 flex items-center gap-1 bg-[var(--bg)] px-3 pt-[max(8px,env(safe-area-inset-top))] pb-2">
      {onAtras ? (
        <button type="button" aria-label={COMUN.atras} onClick={onAtras} className={BOTON_ICONO}>
          <ChevronLeft size={24} strokeWidth={2} aria-hidden="true" />
        </button>
      ) : (
        <span aria-hidden="true" className="w-1 shrink-0" />
      )}
      <div
        role="progressbar"
        aria-label={llenar(COMUN.barra, { n: String(Math.min(pasoVisible, TOTAL_PASOS)) })}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={porcentaje}
        className="h-[3px] flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]"
      >
        <motion.div
          className="h-full rounded-full bg-[var(--accent)]"
          initial={false}
          animate={{ width: `${porcentaje}%` }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <Link href="/" aria-label={COMUN.cerrar} onClick={onCerrar} className={BOTON_ICONO}>
        <X size={22} strokeWidth={2} aria-hidden="true" />
      </Link>
    </header>
  );
}
