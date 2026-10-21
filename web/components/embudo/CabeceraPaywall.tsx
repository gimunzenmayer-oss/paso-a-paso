'use client';

// Cabecera del paywall: una sola fila como la del onboarding [izquierda | indicador
// de 3 páginas | ✕], todo a 48px (docs/copy/embudo.md §2, elementos comunes). A la
// izquierda: el logo en la página 1 y "‹ Atrás" en las páginas 2 y 3 (vuelve a la
// anterior, igual que el atrás del navegador). El ✕ se ve desde el primer cuadro y
// cierra en el primer toque: vuelve al plan sin ventanas ni frases de culpa (50 C1, C5).

import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronLeft, X } from 'lucide-react';
import { LogoMarca } from './BarraProgreso';
import { COMUN, llenar, PAYWALL_COMUN, TOTAL_PAGINAS_PAYWALL } from './textos';

const TOQUE =
  'inline-flex h-12 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] [touch-action:manipulation]';

export function CabeceraPaywall({
  pagina,
  hrefVolver,
  onAtras,
}: {
  /** 1..3 */
  pagina: number;
  hrefVolver: string;
  /** Páginas 2 y 3: vuelve a la anterior. Sin él (página 1) va el logo. */
  onAtras?: () => void;
}) {
  const etiqueta = llenar(PAYWALL_COMUN.indicador, { n: String(pagina) });
  return (
    <header className="sticky top-0 z-20 -mx-5 flex items-center gap-2 bg-[var(--bg)] px-3 pt-[max(8px,env(safe-area-inset-top))] pb-2">
      {onAtras ? (
        <button type="button" onClick={onAtras} className={`${TOQUE} gap-0.5 pr-3 pl-1 text-[16px] font-semibold`}>
          <ChevronLeft size={24} strokeWidth={2} aria-hidden="true" />
          {PAYWALL_COMUN.atras}
        </button>
      ) : (
        <Link href="/" aria-label={COMUN.logo} className="inline-flex size-12 shrink-0 items-center justify-center rounded-full">
          <LogoMarca />
        </Link>
      )}
      <div
        role="progressbar"
        aria-label={etiqueta}
        aria-valuetext={etiqueta}
        aria-valuemin={1}
        aria-valuemax={TOTAL_PAGINAS_PAYWALL}
        aria-valuenow={pagina}
        className="flex flex-1 gap-1.5"
      >
        {Array.from({ length: TOTAL_PAGINAS_PAYWALL }, (_, i) => (
          <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]">
            <motion.span
              className="block h-full origin-left rounded-full bg-[var(--accent)]"
              initial={false}
              animate={{ scaleX: i < pagina ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </span>
        ))}
      </div>
      <a href={hrefVolver} aria-label={PAYWALL_COMUN.cerrar} className={`${TOQUE} w-12`}>
        <X size={22} strokeWidth={2} aria-hidden="true" />
      </a>
    </header>
  );
}
