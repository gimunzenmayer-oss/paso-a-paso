'use client';

// Cabecera del paywall: una sola fila como la del onboarding [‹ Atrás | indicador
// de 3 páginas + «n de 3» | ✕], todo a 48px (docs/copy/embudo.md §2, elementos comunes). La
// misma en las 3 páginas, sin logo (el logo llevaba a la landing: un toque sacaba
// del embudo). "‹ Atrás" en la página 1 es un enlace a /onboarding (vuelve a su
// resultado); en la 2 y la 3 vuelve a la anterior, igual que el atrás del navegador.
// El ✕ se ve desde el primer cuadro y cierra en el primer toque: vuelve al plan sin
// ventanas ni frases de culpa (50 C1, C5).

import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { BotonAtras } from './ui';
import { llenar, PAYWALL_COMUN, TOTAL_PAGINAS_PAYWALL } from './textos';

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
  /** Páginas 2 y 3: vuelve a la anterior. Sin él (página 1), "‹ Atrás" lleva a hrefVolver. */
  onAtras?: () => void;
}) {
  const etiqueta = llenar(PAYWALL_COMUN.indicador, { n: String(pagina) });
  return (
    <header className="sticky top-0 z-20 -mx-5 flex items-center gap-2 bg-[var(--bg)] px-3 pt-[max(8px,env(safe-area-inset-top))] pb-2">
      {onAtras ? (
        <BotonAtras texto={PAYWALL_COMUN.atras} onClick={onAtras} />
      ) : (
        <BotonAtras texto={PAYWALL_COMUN.atras} href={hrefVolver} />
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
      {/* «n de 3» a la vista (la barra de segmentos sola no dice cuántas quedan). El lector de
          pantalla ya lo oye en el aria-label de la barra: aquí no se repite. */}
      <span aria-hidden="true" className="shrink-0 text-[13px] leading-none font-semibold whitespace-nowrap text-[var(--text-secondary)] tabular-nums">
        {llenar(PAYWALL_COMUN.indicadorVisible, { n: String(pagina) })}
      </span>
      <a href={hrefVolver} aria-label={PAYWALL_COMUN.cerrar} className={`${TOQUE} w-12`}>
        <X size={22} strokeWidth={2} aria-hidden="true" />
      </a>
    </header>
  );
}
