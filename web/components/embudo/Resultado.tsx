'use client';

// 1.8 Resultado: su rutina real (pasos y fotos de app/js/datos.js, vía
// lib/embudo/rutinas.ts) con "¡Hecho!" SOLO en el paso 1. Al tocarlo se llena el
// check verde (la firma de movimiento de FICHA-ARTE) y el CTA se resalta.
// El CTA se ve desde el inicio (no se esconde el camino).

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Shirt } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';
import type { PasoRutina } from '@/lib/embudo/rutinas';
import { Ayuda, EnlacePrincipal, PieFijo, Titulo } from './ui';
import { llenar, RESULTADO, type Variables } from './textos';

function Foto({ paso, tamano }: { paso: PasoRutina; tamano: 56 | 72 }) {
  const lado = tamano === 72 ? 'size-[72px]' : 'size-14';
  if (!paso.foto) {
    // Sin foto en datos.js (la app usa un símbolo): ícono lucide, nunca emoji.
    return (
      <span aria-hidden="true" className={`${lado} inline-flex shrink-0 items-center justify-center rounded-[12px] bg-[var(--surface-2)]`}>
        <Shirt size={tamano === 72 ? 30 : 24} strokeWidth={1.8} color="var(--text-secondary)" aria-hidden="true" />
      </span>
    );
  }
  return (
    <Image
      src={paso.foto}
      alt=""
      width={tamano}
      height={tamano}
      sizes={`${tamano}px`}
      className={`${lado} shrink-0 rounded-[12px] bg-[var(--surface-2)] object-cover`}
    />
  );
}

function CheckQueSeLlena() {
  const reduce = useReducedMotion() === true;
  return (
    <motion.svg
      viewBox="0 0 48 48"
      width="48"
      height="48"
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
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : 0.12, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

export function Resultado({
  v,
  pasos,
  hrefPlan,
  enfocar,
}: {
  v: Variables;
  pasos: readonly PasoRutina[];
  hrefPlan: string;
  enfocar: boolean;
}) {
  const [hecho, setHecho] = useState(false);
  const [primero, ...resto] = pasos;

  return (
    <div className="flex flex-1 flex-col">
      <Titulo texto={llenar(RESULTADO.titulo, v)} enfocar={enfocar} />
      <Ayuda>{RESULTADO.ayuda}</Ayuda>

      {primero && (
        <Hairline emphasis surface="surface" className="mt-6 shadow-[var(--shadow-2)]">
          <div className="flex items-center gap-3 p-3">
            <Foto paso={primero} tamano={72} />
            <p className="min-w-0 flex-1 text-[19px] leading-snug font-semibold [font-family:var(--font-display)]">{primero.texto}</p>
            {hecho ? (
              <CheckQueSeLlena />
            ) : (
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setHecho(true)}
                aria-label={llenar(RESULTADO.hechoAria, v)}
                className="h-12 shrink-0 rounded-[var(--radius-button)] bg-[var(--accent)] px-4 text-[17px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
              >
                {RESULTADO.hecho}
              </motion.button>
            )}
          </div>
        </Hairline>
      )}

      <div aria-live="polite" className="py-3">
        {hecho && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-[17px] leading-snug text-[var(--text-primary)]"
          >
            {RESULTADO.despues}{' '}
            <span className="font-semibold whitespace-nowrap text-[var(--accent)] tabular-nums">{llenar(RESULTADO.progreso, v)}</span>
          </motion.p>
        )}
      </div>

      <ol className="flex flex-col gap-2">
        {resto.map((p) => (
          <li key={p.texto} className="flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-2 pr-3 shadow-[var(--shadow-1)]">
            <Foto paso={p} tamano={56} />
            <span className="text-[17px] leading-snug text-[var(--text-primary)]">{p.texto}</span>
          </li>
        ))}
      </ol>

      <PieFijo>
        <EnlacePrincipal href={hrefPlan} resaltado={hecho}>
          {llenar(RESULTADO.cta, v)}
        </EnlacePrincipal>
        <a
          href="/app/index.html"
          className="mx-auto flex min-h-12 items-center justify-center px-4 text-[16px] font-semibold text-[var(--text-secondary)] underline decoration-[color-mix(in_oklab,var(--text-secondary)_45%,transparent)] underline-offset-4"
        >
          {RESULTADO.app}
        </a>
      </PieFijo>
    </div>
  );
}
