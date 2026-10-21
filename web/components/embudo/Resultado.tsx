'use client';

// 1.8 Resultado: su rutina real (pasos y fotos de app/js/datos.js, vía
// lib/embudo/rutinas.ts) con "¡Hecho!" SOLO en el paso 1. Al tocarlo se llena el
// check verde (la firma de movimiento de FICHA-ARTE) y el CTA se resalta.
// El CTA se ve desde el inicio (no se esconde el camino), pero en variante
// secundaria: la acción principal de esta pantalla es "¡Hecho!". Después del
// toque pasa a lleno con un pulso. Una sola acción llena a la vez.
// Tras "¡Hecho!", el Método completo: Antes (el paso cumplido), Durante (el kit de
// calma) y, en una 2.ª línea gris, el Después (queda anotado para su terapeuta).
// Bajo el CTA, la microlínea "7 días gratis · cancelas cuando quieras" (16px, con
// "7 días gratis" en negrita) SOLO si hay checkout configurado (conCheckout): sin
// links de Hotmart no hay prueba que activar y la línea prometería algo que no se
// puede hacer. La cabecera lleva «‹ Atrás»: vuelve al compromiso (Onboarding.tsx).
// Los pasos 2..n entran escalonados (60 ms, la firma de FICHA-ARTE).
// Tras "¡Hecho!": "1 de {n_pasos}" es un chip propio bajo el nombre del paso 1, y el
// paso 2 toma el borde de acento con la etiqueta "Sigue" (aria-current="step"): la
// demo enseña cómo avanza la rutina. El pie fijo lleva SOLO el CTA y la microlínea;
// "Ver antes la app de ejemplo" va al final de la lista, en el flujo (el pie más
// corto deja ver más pasos).

import { useState } from 'react';
import { motion } from 'motion/react';
import { Hairline } from '@/components/landing/ui';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import type { PasoRutina } from '@/lib/embudo/rutinas';
import { Ayuda, CheckQueSeLlena, EnlacePrincipal, EnlaceTexto, entrada, Miniatura, PieFijo, Titulo } from './ui';
import { llenar, RESULTADO, type Variables } from './textos';

export function Resultado({
  v,
  pasos,
  hrefPlan,
  conCheckout,
  enfocar,
}: {
  v: Variables;
  pasos: readonly PasoRutina[];
  hrefPlan: string;
  /** Hay links de Hotmart válidos (checkoutDe): solo entonces se promete la prueba. */
  conCheckout: boolean;
  enfocar: boolean;
}) {
  const [hecho, setHecho] = useState(false);
  const [primero, ...resto] = pasos;

  return (
    <div className="flex flex-1 flex-col">
      <Titulo texto={llenar(RESULTADO.titulo, v)} enfocar={enfocar} />
      <Ayuda>{llenar(RESULTADO.ayuda, v)}</Ayuda>

      {primero && (
        <Hairline emphasis surface="surface" className="mt-6 shadow-[var(--shadow-2)]">
          <div className="flex items-center gap-3 p-3">
            <Miniatura paso={primero} tamano={72} />
            <div className="min-w-0 flex-1">
              <p className="text-[18px] leading-snug font-semibold [font-family:var(--font-display)]">{primero.texto}</p>
              {hecho && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1 inline-flex rounded-[var(--radius-button)] bg-[var(--chip-bg)] px-2.5 py-0.5 text-[16px] leading-snug font-semibold text-[var(--accent)] tabular-nums"
                >
                  {llenar(RESULTADO.progreso, v)}
                </motion.p>
              )}
            </div>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <p className="text-[18px] leading-snug text-pretty text-[var(--text-primary)]">{llenar(RESULTADO.despues, v)}</p>
            <p className="mt-1 text-[16px] leading-snug text-pretty text-[var(--text-secondary)]">{RESULTADO.diario}</p>
          </motion.div>
        )}
      </div>

      <ol className="flex flex-col gap-2">
        {resto.map((p, i) => {
          // Tras "¡Hecho!", el paso 2 es el que sigue: borde de acento (2px, con 1px menos de relleno) y "Sigue".
          const sigue = hecho && i === 0;
          return (
            <motion.li
              key={p.texto}
              {...entrada(i, 0.1)}
              aria-current={sigue ? 'step' : undefined}
              className={`flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] transition-[border-color,box-shadow] duration-200 ${
                sigue ? 'border-2 border-[var(--accent)] p-[6px] pr-[10px] shadow-[var(--shadow-2)]' : 'p-2 pr-3 shadow-[var(--shadow-1)]'
              }`}
            >
              <Miniatura paso={p} tamano={56} />
              <span className="flex min-w-0 flex-col">
                {sigue && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="text-[13px] leading-tight font-bold tracking-[0.06em] text-[var(--accent)] uppercase"
                  >
                    {RESULTADO.sigue}
                  </motion.span>
                )}
                <span className="text-[18px] leading-snug text-[var(--text-primary)]">{p.texto}</span>
              </span>
            </motion.li>
          );
        })}
      </ol>

      {/* En el flujo, al final de la lista (ya no en el pie fijo). pb-4: termina sobre el degradado del pie. */}
      <div className="mt-3 pb-4">
        <EnlaceTexto href="/app/index.html">{RESULTADO.app}</EnlaceTexto>
      </div>

      <PieFijo>
        <EnlacePrincipal href={hrefPlan} secundario={!hecho} resaltado={hecho}>
          {llenar(RESULTADO.cta, v)}
        </EnlacePrincipal>
        {conCheckout && (
          <p className="mt-1 text-center text-[16px] leading-snug text-[var(--text-secondary)]">
            <MarkedCopy text={RESULTADO.confianza} />
          </p>
        )}
      </PieFijo>
    </div>
  );
}
