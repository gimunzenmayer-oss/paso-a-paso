'use client';

// KIT DE LANDING — §4 SOLUCIÓN (blueprint: 55 §4)
// Vuelve al fondo BASE (el alivio también es visual). Kicker + título + el
// MECANISMO BAUTIZADO en su chip con <Accent> y hairline (uno de los 1-3 usos
// permitidos por vista) + Big Idea + EXACTAMENTE 3 pasos con number chip 44px
// (tupla en el tipo: ni 2 ni 4) + antes/después opcional. Pasos entran
// escalonados (whileInView + stagger, reduced-motion respetado).

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Accent, Hairline, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy } from './MarkedCopy';

export interface PasoMecanismo {
  /** Título del paso — 16px/600. */
  titulo: string;
  /** Foto real opcional: el paso se dibuja como tarjeta de la tira de pasos (dispositivo de la marca). */
  foto?: string;
  fotoAlt?: string;
  /** UNA línea (warn a las 14 palabras). */
  detalle: string;
}

export interface SolucionProps {
  /** Kicker en acento — default "EL MECANISMO". */
  kicker?: string;
  /** Copy MARCADO del título de sección (máx 8 palabras). */
  tituloMarked: string;
  /** Nombre PROPIO del mecanismo bautizado (19) — se pinta en el chip con <Accent>. */
  mecanismo: string;
  /** Big Idea en 1-2 líneas, copy MARCADO. */
  bigIdeaMarked: string;
  /** Los 3 pasos del mecanismo — la tupla obliga a que sean exactamente 3. */
  pasos: [PasoMecanismo, PasoMecanismo, PasoMecanismo];
  /** Antes/después opcional: split 2 columnas, el "después" con acento sutil. */
  antesDespues?: {
    labelAntes: string;
    antes: string;
    labelDespues: string;
    despues: string;
  };
  id?: string;
}

export function Solucion({
  kicker = 'EL MECANISMO',
  tituloMarked,
  mecanismo,
  bigIdeaMarked,
  pasos,
  antesDespues,
  id,
}: SolucionProps) {
  warnCopy('Solución → título', tituloMarked, 8);
  warnCopy('Solución → Big Idea', bigIdeaMarked, 30);
  pasos.forEach((p, i) => warnCopy(`Solución → paso ${i + 1}`, p.detalle, 14));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Cómo funciona">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[780px]"
      >
        <motion.div variants={item}>
          <Kicker>{kicker}</Kicker>
          <h2 className="text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px]">
            <MarkedCopy text={tituloMarked} />
          </h2>
        </motion.div>

        {/* El chip del mecanismo bautizado — hairline + <Accent> (55 §4) */}
        <motion.div variants={item} className="mt-4">
          <Hairline surface="bg" className="w-fit">
            <span className="block px-4 py-2 text-[15px] font-semibold">
              <Accent>{mecanismo}</Accent>
            </span>
          </Hairline>
        </motion.div>

        <motion.p variants={item} className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-[var(--text-secondary)] md:text-[18px]">
          <MarkedCopy text={bigIdeaMarked} />
        </motion.p>

        {/* 3 pasos: filas apiladas en mobile, 3 columnas en desktop */}
        <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pasos.map((p, i) => (
            <motion.li key={i} variants={item} className="flex items-start gap-4 md:flex-col">
              {p.foto ? (
                <PasoConFoto foto={p.foto} alt={p.fotoAlt ?? p.titulo} indice={i} />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)] bg-[var(--chip-bg)] text-[17px] font-bold tabular-nums text-[var(--accent)]"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              <div className="pt-1 md:pt-0">
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{p.titulo}</h3>
                <p className="mt-1 text-[15px] leading-snug text-[var(--text-secondary)]">{p.detalle}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        {antesDespues && (
          <motion.div variants={item} className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-card)] bg-[var(--surface-2)] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                {antesDespues.labelAntes}
              </p>
              <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">{antesDespues.antes}</p>
            </div>
            {/* El "después" con acento sutil de fondo (4-6%) */}
            <div className="rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
                {antesDespues.labelDespues}
              </p>
              <p className="mt-2 text-[15px] font-medium leading-snug text-[var(--text-primary)]">
                {antesDespues.despues}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </SectionShell>
  );
}

/* Tarjeta de la tira de pasos: foto real + check salvia que se llena al entrar
   en pantalla (firma de la marca: 300ms ease-out, 60ms entre pasos). Con
   movimiento reducido el check aparece ya lleno. */
function PasoConFoto({ foto, alt, indice }: { foto: string; alt: string; indice: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative block size-[72px] shrink-0 md:size-[88px]">
      <Image
        src={foto}
        alt={alt}
        width={176}
        height={176}
        className="size-full rounded-[var(--radius-button)] border-2 border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[var(--surface-2)] object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute -right-2 -bottom-2 flex size-7 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--surface)]"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-[var(--accent)]"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: 'easeOut', delay: reduce ? 0 : 0.25 + indice * 0.06 }}
        />
        <svg viewBox="0 0 24 24" className="relative size-4" fill="none" stroke="var(--surface)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
    </span>
  );
}
