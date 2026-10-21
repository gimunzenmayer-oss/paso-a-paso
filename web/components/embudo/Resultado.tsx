'use client';

// 1.8 Resultado: su rutina real (pasos y fotos de app/js/datos.js, vía
// lib/embudo/rutinas.ts) con "¡Hecho!" SOLO en el paso 1. Al tocarlo se llena el
// check verde (la firma de movimiento de FICHA-ARTE) y el CTA se resalta.
// El CTA se ve desde el inicio (no se esconde el camino), pero en variante
// secundaria: la acción principal de esta pantalla es "¡Hecho!". Después del
// toque pasa a lleno con un pulso. Una sola acción llena a la vez.

import { useState } from 'react';
import { motion } from 'motion/react';
import { Hairline } from '@/components/landing/ui';
import type { PasoRutina } from '@/lib/embudo/rutinas';
import { Ayuda, CheckQueSeLlena, EnlacePrincipal, Miniatura, PieFijo, Titulo } from './ui';
import { llenar, RESULTADO, type Variables } from './textos';

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
            <Miniatura paso={primero} tamano={72} />
            <p className="min-w-0 flex-1 text-[18px] leading-snug font-semibold [font-family:var(--font-display)]">{primero.texto}</p>
            {hecho ? (
              <CheckQueSeLlena />
            ) : (
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setHecho(true)}
                aria-label={llenar(RESULTADO.hechoAria, v)}
                className="h-12 shrink-0 rounded-[var(--radius-button)] bg-[var(--accent)] px-4 text-[18px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
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
            className="text-[18px] leading-snug text-[var(--text-primary)]"
          >
            {RESULTADO.despues}{' '}
            <span className="font-semibold whitespace-nowrap text-[var(--accent)] tabular-nums">{llenar(RESULTADO.progreso, v)}</span>
          </motion.p>
        )}
      </div>

      {/* pb-4: el último paso termina por encima del degradado del pie al llegar al final. */}
      <ol className="flex flex-col gap-2 pb-4">
        {resto.map((p) => (
          <li key={p.texto} className="flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-2 pr-3 shadow-[var(--shadow-1)]">
            <Miniatura paso={p} tamano={56} />
            <span className="text-[18px] leading-snug text-[var(--text-primary)]">{p.texto}</span>
          </li>
        ))}
      </ol>

      <PieFijo>
        <EnlacePrincipal href={hrefPlan} secundario={!hecho} resaltado={hecho}>
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
