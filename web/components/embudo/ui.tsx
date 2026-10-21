'use client';

// KIT DEL EMBUDO — piezas compartidas de /onboarding (y luego /paywall).
// Mismo sistema que el kit de landing (tokens.css): botón vivo ≥52px con sombra
// tintada, chips de opción de 60px (50 A2), pie fijo con safe-area, título que
// recibe el foco al cambiar de paso. Íconos lucide, nunca emoji.

import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import { MarkedCopy } from '@/components/landing/MarkedCopy';

/* ── <Titulo> — el único h1 del paso. Recibe el foco cuando se llega navegando
   (lectores de pantalla y teclado empiezan aquí, no en el botón que ya no existe). ── */
export function Titulo({ texto, enfocar, id = 'titulo-paso' }: { texto: string; enfocar: boolean; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (enfocar) ref.current?.focus({ preventScroll: true });
  }, [enfocar]);
  return (
    <h1
      ref={ref}
      id={id}
      tabIndex={-1}
      className="text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-balance outline-none [font-family:var(--font-display)]"
    >
      <MarkedCopy text={texto} />
    </h1>
  );
}

export function Ayuda({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="mt-3 text-[17px] leading-[1.45] text-[var(--text-secondary)]">
      {children}
    </p>
  );
}

/* ── <BotonPrincipal> — el CTA del paso: ≥52px, whileTap 0.97, acento pleno.
   Deshabilitado = 65% de opacidad (visible, nunca fantasma — 50 A3). ── */
export function BotonPrincipal({
  children,
  onClick,
  type = 'button',
  disabled = false,
  resaltado = false,
  ariaDescribedBy,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** Pulso suave una vez (p. ej. tras el "¡Hecho!"); se apaga con reducir movimiento. */
  resaltado?: boolean;
  ariaDescribedBy?: string;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-describedby={ariaDescribedBy}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      animate={resaltado ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-center text-[17px] leading-tight font-semibold text-[var(--bg)] transition-[opacity,box-shadow,background-color] duration-200 [touch-action:manipulation] disabled:opacity-65 ${
        resaltado
          ? 'shadow-[0_10px_34px_color-mix(in_oklab,var(--accent)_45%,transparent)]'
          : 'shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)]'
      } enabled:hover:bg-[color-mix(in_oklab,var(--accent)_88%,var(--text-primary))]`}
    >
      {children}
    </motion.button>
  );
}

/* ── <EnlacePrincipal> — el mismo CTA cuando lleva a otra página (paywall, Hotmart). ── */
export function EnlacePrincipal({
  href,
  children,
  resaltado = false,
  onClick,
  ariaDescribedBy,
  ariaBusy,
}: {
  href: string;
  children: ReactNode;
  resaltado?: boolean;
  /** Corre antes de navegar (p. ej. el evento checkout_iniciado). */
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  ariaDescribedBy?: string;
  /** true mientras se abre el destino ("Abriendo Hotmart…"). */
  ariaBusy?: boolean;
}) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      aria-describedby={ariaDescribedBy}
      aria-busy={ariaBusy}
      whileTap={{ scale: 0.97 }}
      animate={resaltado ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-center text-[17px] leading-tight font-semibold text-[var(--bg)] transition-[box-shadow,background-color] duration-200 hover:bg-[color-mix(in_oklab,var(--accent)_88%,var(--text-primary))] [touch-action:manipulation] ${
        resaltado
          ? 'shadow-[0_10px_34px_color-mix(in_oklab,var(--accent)_45%,transparent)]'
          : 'shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)]'
      }`}
    >
      {children}
    </motion.a>
  );
}

/* ── <BotonTexto> — salida secundaria ("Saltar", "Cambiar el momento"): 48px de
   alto para el dedo, texto secundario subrayado. La salida visible ES la técnica (02B regla 7). ── */
export function BotonTexto({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex min-h-12 items-center justify-center px-4 text-[16px] font-semibold text-[var(--text-secondary)] underline decoration-[color-mix(in_oklab,var(--text-secondary)_45%,transparent)] underline-offset-4 [touch-action:manipulation]"
    >
      {children}
    </button>
  );
}

/* ── <EnlaceTexto> — la misma salida secundaria cuando lleva a otra página
   ("Ahora no", "¿Ya pagaste? Entra aquí"): 48px de alto, texto secundario subrayado. ── */
export function EnlaceTexto({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="mx-auto flex min-h-12 items-center justify-center px-4 text-center text-[16px] font-semibold text-[var(--text-secondary)] underline decoration-[color-mix(in_oklab,var(--text-secondary)_45%,transparent)] underline-offset-4 [touch-action:manipulation]"
    >
      {children}
    </a>
  );
}

/* ── <PieFijo> — zona del CTA pegada abajo con safe-area (50 A3). Va dentro del
   flujo (sticky), así el teclado nunca tapa el campo. ── */
export function PieFijo({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-5 mt-auto bg-[linear-gradient(to_bottom,transparent,var(--bg)_18px)] px-5 pt-6 pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

/* ── <Opcion> — chip de ancho completo, 60px+ (50 A2). Seleccionado: borde
   acento 2px + fondo acento 10% + check que entra con escala. ── */
export function Opcion({
  label,
  subtexto,
  seleccionado,
  onClick,
}: {
  label: string;
  subtexto?: string;
  seleccionado: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-pressed={seleccionado}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      className={`flex min-h-[60px] w-full items-center gap-3 rounded-[var(--radius-button)] px-4 py-3 text-left [touch-action:manipulation] transition-[border-color,background-color] duration-150 ${
        seleccionado
          ? 'border-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,var(--surface))]'
          : 'border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-1)]'
      }`}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[17px] leading-snug font-semibold text-[var(--text-primary)]">{label}</span>
        {subtexto && <span className="mt-0.5 text-[15px] leading-snug text-[var(--text-secondary)]">{subtexto}</span>}
      </span>
      <span
        aria-hidden="true"
        className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full border ${
          seleccionado
            ? 'border-[var(--accent)] bg-[var(--accent)]'
            : 'border-[color-mix(in_oklab,var(--text-tertiary)_45%,transparent)]'
        }`}
      >
        <AnimatePresence initial={false}>
          {seleccionado && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="inline-flex"
            >
              <Check size={15} strokeWidth={3} color="var(--bg)" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
