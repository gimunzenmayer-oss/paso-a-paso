'use client';

// 2.1 Página 1 del paywall: el resumen de lo que armó el onboarding, con SUS
// respuestas (50 C0: recap del valor + inversión visible, "Hecho con tus {N}
// respuestas"). Solo se pinta si hubo onboarding (Paywall.tsx lleva a /onboarding
// si no). Arriba, el dispositivo propio de FICHA-ARTE: la tira con las primeras
// fotos de SU rutina y el check verde en la primera (los mismos Miniatura y
// CheckQueSeLlena del resultado), sobre el plano hundido.

import { motion } from 'motion/react';
import { CheckCustom, Hairline } from '@/components/landing/ui';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import type { PasoRutina } from '@/lib/embudo/rutinas';
import { Ayuda, BotonPrincipal, CheckQueSeLlena, EnlaceTexto, Miniatura, PieFijo, Titulo } from './ui';
import { llenar, PAYWALL_RESUMEN, type Variables, type VariablesPaywall } from './textos';

/** Fotos de la tira: las que caben a 375px con su tamaño de 72. */
const FOTOS_TIRA = 3;

export function PaywallResumen({
  v,
  pasos,
  hrefVolver,
  enfocar,
  onSeguir,
}: {
  v: Variables & VariablesPaywall;
  /** Los pasos de su rutina (rutinaDe(momento)). */
  pasos: readonly PasoRutina[];
  hrefVolver: string;
  enfocar: boolean;
  onSeguir: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Titulo texto={llenar(PAYWALL_RESUMEN.titulo, v)} enfocar={enfocar} />
      <Ayuda>
        <MarkedCopy text={llenar(PAYWALL_RESUMEN.subtitulo, v)} />
      </Ayuda>

      {/* Decorativa: los pasos ya se nombran en el punto "Antes" de la lista. */}
      <div aria-hidden="true" className="mt-6 flex gap-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-3">
        {pasos.slice(0, FOTOS_TIRA).map((paso, i) => (
          <span key={paso.texto} className="relative inline-flex">
            <Miniatura paso={paso} tamano={72} />
            {i === 0 && (
              <span className="absolute -right-2 -bottom-2 inline-flex rounded-full bg-[var(--surface-2)] p-0.5">
                <CheckQueSeLlena tamano={24} />
              </span>
            )}
          </span>
        ))}
      </div>

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
              <CheckCustom />
              <span>
                <MarkedCopy text={llenar(punto, v)} />
              </span>
            </motion.li>
          ))}
        </ul>
      </Hairline>

      <p className="mt-5 text-[18px] leading-[1.45] font-semibold text-[var(--text-primary)]">{PAYWALL_RESUMEN.perdida}</p>

      <PieFijo>
        <BotonPrincipal onClick={onSeguir}>{PAYWALL_RESUMEN.boton}</BotonPrincipal>
        <EnlaceTexto href={hrefVolver}>{PAYWALL_RESUMEN.salida}</EnlaceTexto>
      </PieFijo>
    </div>
  );
}
