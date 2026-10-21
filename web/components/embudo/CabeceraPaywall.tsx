'use client';

// Cabecera del paywall: la misma del onboarding (logo y cerrar arriba, 48px) con el
// indicador de 3 páginas debajo (docs/copy/embudo.md §2, elementos comunes). El ✕ se
// ve desde el primer cuadro y cierra en el primer toque: vuelve al plan sin
// ventanas ni frases de culpa (50 C1, C5).

import Link from 'next/link';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { LogoMarca } from './BarraProgreso';
import { COMUN, llenar, PAYWALL_COMUN, TOTAL_PAGINAS_PAYWALL } from './textos';

export function CabeceraPaywall({ pagina, hrefVolver }: { /** 1..3 */ pagina: number; hrefVolver: string }) {
  const etiqueta = llenar(PAYWALL_COMUN.indicador, { n: String(pagina) });
  return (
    <header className="sticky top-0 z-20 -mx-5 bg-[var(--bg)] px-3 pt-[max(8px,env(safe-area-inset-top))] pb-2">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label={COMUN.logo} className="inline-flex size-12 items-center justify-center rounded-full">
          <LogoMarca />
        </Link>
        <a
          href={hrefVolver}
          aria-label={PAYWALL_COMUN.cerrar}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] [touch-action:manipulation]"
        >
          <X size={22} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>
      <div
        role="progressbar"
        aria-label={etiqueta}
        aria-valuetext={etiqueta}
        aria-valuemin={1}
        aria-valuemax={TOTAL_PAGINAS_PAYWALL}
        aria-valuenow={pagina}
        className="flex gap-1.5 px-2 pt-2"
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
    </header>
  );
}
