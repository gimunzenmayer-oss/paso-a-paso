'use client';

// KIT DEL EMBUDO — piezas compartidas de /onboarding (y luego /paywall).
// Mismo sistema que el kit de landing (tokens.css): botón vivo ≥52px con sombra
// tintada, chips de opción de 60px (50 A2), pie fijo con safe-area, título que
// recibe el foco al cambiar de paso. Íconos lucide, nunca emoji.

import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, ChevronLeft, Shirt } from 'lucide-react';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import { pasosConFoto, type PasoRutina } from '@/lib/embudo/rutinas';

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

/* ── <Ayuda> — el subtítulo del paso. text-wrap: pretty: sin una palabra sola en la última línea. ── */
export function Ayuda({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="mt-3 text-[18px] leading-[1.45] text-pretty text-[var(--text-secondary)]">
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
      className={`flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-center text-[18px] leading-tight font-semibold text-[var(--bg)] transition-[opacity,box-shadow,background-color] duration-200 [touch-action:manipulation] disabled:opacity-65 ${
        resaltado
          ? 'shadow-[0_10px_34px_color-mix(in_oklab,var(--accent)_45%,transparent)]'
          : 'shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)]'
      } enabled:hover:bg-[color-mix(in_oklab,var(--accent)_88%,var(--text-primary))]`}
    >
      {children}
    </motion.button>
  );
}

/* ── <EnlacePrincipal> — el mismo CTA cuando lleva a otra página (paywall, Hotmart).
   secundario: mientras otra acción de la pantalla es la principal (el "¡Hecho!" del
   resultado), va en superficie con borde de acento; pasa a lleno cuando deja de serlo. ── */
export function EnlacePrincipal({
  href,
  children,
  resaltado = false,
  secundario = false,
  onClick,
  ariaDescribedBy,
  ariaBusy,
}: {
  href: string;
  children: ReactNode;
  resaltado?: boolean;
  secundario?: boolean;
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
      className={`flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] px-5 text-center text-[18px] leading-tight font-semibold transition-[box-shadow,background-color,color,border-color] duration-200 [touch-action:manipulation] ${
        secundario
          ? 'border-2 border-[var(--accent)] bg-[var(--surface)] text-[var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface))]'
          : `bg-[var(--accent)] text-[var(--bg)] hover:bg-[color-mix(in_oklab,var(--accent)_88%,var(--text-primary))] ${
              resaltado
                ? 'shadow-[0_10px_34px_color-mix(in_oklab,var(--accent)_45%,transparent)]'
                : 'shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)]'
            }`
      }`}
    >
      {children}
    </motion.a>
  );
}

/* ── <BotonTexto> — salida secundaria ("Prefiero no decirlo", "Prefiero saltar esta"): 48px de
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

/* ── <BotonAtras> — EL atrás del embudo: «‹ Atrás» (chevron + texto de 16px semibold,
   48px de alto) en la cabecera del onboarding y en la del paywall. Un solo dibujo en
   todo el recorrido. Con onClick es un botón; con href (página 1 del paywall), un
   enlace a otra página. ── */
const CLASE_ATRAS =
  'inline-flex h-12 shrink-0 items-center justify-center gap-0.5 rounded-full pr-3 pl-1 text-[16px] font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--text-tertiary)_12%,transparent)] [touch-action:manipulation]';

export function BotonAtras({ texto, ...destino }: { texto: string } & ({ onClick: () => void } | { href: string })) {
  const contenido = (
    <>
      <ChevronLeft size={24} strokeWidth={2} aria-hidden="true" />
      {texto}
    </>
  );
  return 'href' in destino ? (
    <a href={destino.href} className={CLASE_ATRAS}>
      {contenido}
    </a>
  ) : (
    <button type="button" onClick={destino.onClick} className={CLASE_ATRAS}>
      {contenido}
    </button>
  );
}

/* ── <PieFijo> — zona del CTA pegada abajo con safe-area (50 A3). Va dentro del
   flujo (sticky), así el teclado nunca tapa el campo.
   fondo 'degradado' (por defecto): lo de abajo se desvanece bajo el pie.
   fondo 'solido': --bg pleno con un hairline arriba, sin degradado. Lo que pasa por
   debajo se corta con un borde limpio (la señal normal de «hay más»), nunca un
   fantasma a medias; lo usa el precio del paywall, donde un bloque bajo las
   tarjetas asomaba borroso o, para evitarlo, dejaba un hueco. ── */
export function PieFijo({ children, fondo = 'degradado' }: { children: ReactNode; fondo?: 'degradado' | 'solido' }) {
  const piel =
    fondo === 'solido'
      ? 'border-t border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--bg)] pt-3'
      : 'bg-[linear-gradient(to_bottom,transparent,var(--bg)_18px)] pt-6';
  return (
    <div className={`sticky bottom-0 z-10 -mx-5 mt-auto px-5 pb-[max(16px,env(safe-area-inset-bottom))] ${piel}`}>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

/* ── <Opcion> — chip de ancho completo, 60px+ (50 A2). Seleccionado: borde
   acento 2px + fondo acento 10% + check que entra con escala. El borde de 2px se
   compensa con 1px menos de relleno: el texto no se corre al elegir. Con `paso`
   (pregunta 1.3) lleva a la izquierda la foto real de esa rutina; entonces el chip
   toma el radio de tarjeta (18) y la foto el radio concéntrico (18 − 9 = 9: borde
   1 + relleno 8, o borde 2 + relleno 7 elegido), así las esquinas siguen el mismo
   arco. El subtexto usa text-wrap: pretty (sin una palabra sola en la última línea). ── */
export function Opcion({
  label,
  subtexto,
  paso,
  seleccionado,
  onClick,
}: {
  label: string;
  subtexto?: string;
  paso?: PasoRutina;
  seleccionado: boolean;
  onClick: () => void;
}) {
  const relleno = paso ? (seleccionado ? 'py-[7px] pl-[7px] pr-[15px]' : 'py-2 pl-2 pr-4') : seleccionado ? 'px-[15px] py-[11px]' : 'px-4 py-3';
  return (
    <motion.button
      type="button"
      aria-pressed={seleccionado}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      className={`flex min-h-[60px] w-full items-center gap-3 ${paso ? 'rounded-[var(--radius-card)]' : 'rounded-[var(--radius-button)]'} text-left [touch-action:manipulation] transition-[border-color,background-color] duration-150 ${relleno} ${
        seleccionado
          ? 'border-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,var(--surface))]'
          : 'border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-2)]'
      }`}
    >
      {paso && <Miniatura paso={paso} tamano={56} marco="chip" />}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[18px] leading-snug font-semibold text-[var(--text-primary)]">{label}</span>
        {subtexto && <span className="mt-0.5 text-[16px] leading-snug text-pretty text-[var(--text-secondary)]">{subtexto}</span>}
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

/* ── <Miniatura> — foto real de un paso (app/js/datos.js). Un solo tratamiento para
   todas: recorte cuadrado, fondo --surface-2, radio de botón (14) y un filo
   interior suave, así una foto sobre blanco no se pierde contra la tarjeta. Una
   foto de fondo blanco (fondoClaro) se funde con el marco (multiply): el blanco
   toma el --surface-2 y no queda un cuadro blanco dentro del marco. Sin foto
   (p. ej. "Ponerse el pijama"): ícono lucide en el mismo marco, nunca emoji.
   tamano 'fluida' = llena el ancho de su celda (tiras en grilla), siempre cuadrada.
   marco: el radio, concéntrico con lo que la contiene. 'boton' (por defecto) = radio de
   botón (14). 'chip' = dentro de un chip de Opcion (radio de tarjeta, 9px de borde +
   relleno): 18 − 9 = 9. 'vistaPrevia' = dentro de una tarjeta de la vista previa de 1.1
   (radio 18 − 8 = 10, relleno 6): 10 − 6 = 4. ── */
export function Miniatura({
  paso,
  tamano,
  marco = 'boton',
}: {
  paso: PasoRutina;
  tamano: 40 | 56 | 72 | 'fluida';
  marco?: 'boton' | 'chip' | 'vistaPrevia';
}) {
  const radio =
    marco === 'chip'
      ? 'rounded-[calc(var(--radius-card)-9px)]'
      : marco === 'vistaPrevia'
        ? 'rounded-[calc(var(--radius-card)-14px)]'
        : 'rounded-[var(--radius-button)]';
  const fluida = tamano === 'fluida';
  const lado = fluida ? 'aspect-square w-full' : tamano === 72 ? 'size-[72px]' : tamano === 56 ? 'size-14' : 'size-10';
  const icono = fluida || tamano === 72 ? 30 : tamano === 56 ? 24 : 20;
  const foto = `size-full object-cover ${paso.fondoClaro ? 'mix-blend-multiply' : ''}`;
  return (
    <span
      aria-hidden="true"
      className={`${lado} relative inline-flex shrink-0 items-center justify-center overflow-hidden ${radio} bg-[var(--surface-2)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--text-tertiary)_22%,transparent)]`}
    >
      {paso.foto ? (
        fluida ? (
          <Image src={paso.foto} alt="" fill sizes="(max-width: 480px) 30vw, 144px" className={foto} />
        ) : (
          <Image src={paso.foto} alt="" width={tamano} height={tamano} sizes={`${tamano}px`} className={foto} />
        )
      ) : (
        <Shirt size={icono} strokeWidth={1.8} color="var(--text-secondary)" aria-hidden="true" />
      )}
    </span>
  );
}

/* ── <TiraDeFotos> — el dispositivo propio de FICHA-ARTE: las primeras fotos CON
   foto de su rutina sobre el plano hundido, con el check verde en la primera (el
   paso cumplido). Decorativa: los pasos ya se nombran en el texto de al lado.
   'fluida' reparte el ancho en 3 columnas iguales (reconocimiento, compromiso y
   resumen del paywall: el mismo dispositivo luce igual en todo el recorrido); 72 las
   alinea a la izquierda. Las fotos entran una a una (60 ms). ── */
export function TiraDeFotos({
  pasos,
  tamano,
  className = '',
}: {
  pasos: readonly PasoRutina[];
  tamano: 72 | 'fluida';
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-[var(--radius-card)] bg-[var(--surface-2)] p-3 ${tamano === 'fluida' ? 'grid grid-cols-3 gap-3' : 'flex gap-3'} ${className}`}
    >
      {pasosConFoto(pasos, 3).map((paso, i) => (
        <motion.span key={paso.texto} {...entrada(i)} className="relative flex">
          <Miniatura paso={paso} tamano={tamano} />
          {i === 0 && (
            <span className="absolute -right-2 -bottom-2 inline-flex rounded-full bg-[var(--surface-2)] p-0.5">
              <CheckQueSeLlena tamano={24} />
            </span>
          )}
        </motion.span>
      ))}
    </div>
  );
}

/* ── entrada(i) — el escalonado de la firma de movimiento (FICHA-ARTE: stagger
   60 ms, ease-out 300 ms). Sube 8px y aparece; con reducir movimiento, el
   MotionConfig de la página deja solo el fundido. ── */
export function entrada(i: number, base = 0) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: base + 0.06 * i, ease: [0.16, 1, 0.3, 1] as const },
  };
}

/* ── <CheckQueSeLlena> — EL check del embudo (la firma de movimiento de
   FICHA-ARTE): círculo de acento que aparece con spring y trazo que se dibuja.
   Lo usan el resultado (48), "armando el plan", las tiras y las listas (24) y los
   chips de "Incluye" (16). Con reducir movimiento aparece ya lleno. ── */
export function CheckQueSeLlena({ tamano = 48 }: { tamano?: 16 | 24 | 48 }) {
  const reduce = useReducedMotion() === true;
  return (
    <motion.svg
      viewBox="0 0 48 48"
      width={tamano}
      height={tamano}
      aria-hidden="true"
      initial={{ scale: reduce ? 1 : 0.6 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      className="shrink-0"
    >
      <motion.circle
        cx="24"
        cy="24"
        r="22"
        fill="var(--accent)"
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.2 }}
      />
      <motion.path
        d="M14 24.5l7 7 13-14"
        fill="none"
        stroke="var(--bg)"
        strokeWidth={tamano === 48 ? 4 : tamano === 24 ? 5 : 6}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : 0.12, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}
