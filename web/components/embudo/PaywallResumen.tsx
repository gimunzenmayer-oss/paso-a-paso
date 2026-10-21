'use client';

// 2.1 Página 1 del paywall: el resumen de lo que armó el onboarding, con SUS
// respuestas (50 C0: recap del valor + inversión visible, "Hecho con tus {N}
// respuestas", con el número solo si son 3 o más: con menos, «Hecho con lo que nos
// contaste»). Solo se pinta si hubo onboarding (Paywall.tsx lleva a /onboarding
// si no). Arriba, el dispositivo propio de FICHA-ARTE: la tira con las 3 primeras
// fotos de SU rutina, en 3 columnas que llenan el ancho, y el check verde en la
// primera (TiraDeFotos, la misma del reconocimiento), sobre el plano hundido. La
// lista usa el mismo check (CheckQueSeLlena): un solo check en todo el embudo.
// Bajo el subtítulo, sus respuestas en chips (--chip-bg): momento · edad · 1.ª
// crisis, solo las que respondió (sin respuestas, sin chips): «tus 4 respuestas» se
// ve, no hay que recordarlo. Título, subtítulo, chips, lista y línea de pérdida entran
// escalonados (entrada(i), 60 ms), como 1.5 y 1.6.

import { motion } from 'motion/react';
import { Hairline } from '@/components/landing/ui';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import type { PasoRutina } from '@/lib/embudo/rutinas';
import { Ayuda, BotonPrincipal, CheckQueSeLlena, EnlaceTexto, entrada, PieFijo, TiraDeFotos, Titulo } from './ui';
import { llenar, PAYWALL_COMUN, PAYWALL_RESUMEN, type Variables, type VariablesPaywall } from './textos';

/** Con menos respuestas el número le resta valor al plan. */
const MIN_RESPUESTAS_CON_NUMERO = 3;

export function PaywallResumen({
  v,
  pasos,
  respuestas,
  etiquetas,
  hrefVolver,
  enfocar,
  onSeguir,
}: {
  /** v.N lleva el mismo número, ya como texto del copy. */
  v: Variables & VariablesPaywall;
  /** Cuántas preguntas respondió (contarRespuestas). */
  respuestas: number;
  /** Los pasos de su rutina (rutinaDe(momento)). */
  pasos: readonly PasoRutina[];
  /** Sus respuestas como chips (etiquetasDeRespuestas): momento · edad · 1.ª crisis. */
  etiquetas: readonly string[];
  hrefVolver: string;
  enfocar: boolean;
  onSeguir: () => void;
}) {
  const conNumero = respuestas >= MIN_RESPUESTAS_CON_NUMERO;
  const subtitulo = conNumero ? PAYWALL_RESUMEN.subtitulo : PAYWALL_RESUMEN.subtituloSinNumero;
  return (
    <div className="flex flex-1 flex-col">
      <motion.div {...entrada(0)}>
        <Titulo texto={llenar(PAYWALL_RESUMEN.titulo, v)} enfocar={enfocar} />
      </motion.div>
      <motion.div {...entrada(1)}>
        <Ayuda>
          <MarkedCopy text={llenar(subtitulo, v)} />
        </Ayuda>
      </motion.div>
      {etiquetas.length > 0 && (
        <ul aria-label={PAYWALL_RESUMEN.respuestasAria} className="mt-3 flex flex-wrap gap-2">
          {etiquetas.map((e, i) => (
            <motion.li
              key={e}
              {...entrada(2 + i)}
              className="rounded-[var(--radius-button)] bg-[var(--chip-bg)] px-2.5 py-1 text-[16px] leading-snug text-[var(--text-primary)]"
            >
              {e}
            </motion.li>
          ))}
        </ul>
      )}

      {/* Decorativa: los pasos ya se nombran en el punto "Antes" de la lista. */}
      <TiraDeFotos pasos={pasos} tamano="fluida" className="mt-6" />

      <Hairline emphasis surface="surface" className="mt-4 shadow-[var(--shadow-2)]">
        <ul className="flex flex-col gap-4 p-4">
          {PAYWALL_RESUMEN.puntos.map((punto, i) => (
            <motion.li
              key={punto}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 text-[18px] leading-[1.45] text-[var(--text-primary)]"
            >
              <CheckQueSeLlena tamano={24} />
              <span className="text-pretty">
                <MarkedCopy text={llenar(punto, v)} />
              </span>
            </motion.li>
          ))}
        </ul>
      </Hairline>

      {/* pb-6: la línea termina por encima del degradado del pie (también sin nombre, a 375px). */}
      <motion.p {...entrada(6)} className="mt-5 pb-6 text-[18px] leading-[1.45] text-[var(--text-primary)]">
        <MarkedCopy text={PAYWALL_RESUMEN.perdida} />
      </motion.p>

      <PieFijo>
        <BotonPrincipal onClick={onSeguir}>{PAYWALL_RESUMEN.boton}</BotonPrincipal>
        <EnlaceTexto href={hrefVolver}>{PAYWALL_COMUN.salida}</EnlaceTexto>
      </PieFijo>
    </div>
  );
}
