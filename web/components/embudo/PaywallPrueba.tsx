'use client';

// 2.2 Página 2 del paywall: la prueba día por día (50 C4, patrón Blinkist). Nodos
// llenos para lo que pasa sin pagar (Hoy, Día 5) y nodo con borde para el día del
// cobro, con su fecha exacta y el monto del plan elegido ({monto}). La línea se
// dibuja una vez al entrar; con "reducir movimiento" aparece ya dibujada
// (MotionConfig del paywall). El espacio entre hitos (pb-7) va en el texto, no en
// el <li>: así el riel, que se estira a la altura del <li>, llega al nodo siguiente.

import { motion } from 'motion/react';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import { BotonPrincipal, EnlaceTexto, PieFijo, Titulo } from './ui';
import { llenar, PAYWALL_PRUEBA, type VariablesPaywall } from './textos';

export function PaywallPrueba({
  v,
  hrefVolver,
  enfocar,
  onSeguir,
}: {
  v: VariablesPaywall;
  hrefVolver: string;
  enfocar: boolean;
  onSeguir: () => void;
}) {
  const ultimo = PAYWALL_PRUEBA.linea.length - 1;
  return (
    <div className="flex flex-1 flex-col">
      <Titulo texto={PAYWALL_PRUEBA.titulo} enfocar={enfocar} />

      <ol className="mt-8 flex flex-col">
        {PAYWALL_PRUEBA.linea.map((hito, i) => {
          const cobro = i === ultimo;
          return (
            <li key={hito.cuando} className="relative flex gap-4">
              {/* Riel: nodo + tramo hasta el siguiente hito (acento hasta el Día 5, neutro después). */}
              <span aria-hidden="true" className="relative flex w-4 shrink-0 justify-center">
                <span
                  className={`relative z-10 mt-1.5 size-4 rounded-full ${
                    cobro ? 'border-2 border-[var(--accent)] bg-[var(--bg)]' : 'bg-[var(--accent)]'
                  }`}
                />
                {!cobro && (
                  <motion.span
                    className={`absolute top-[22px] -bottom-1.5 w-[2px] origin-top rounded-full ${
                      i < ultimo - 1 ? 'bg-[var(--accent)]' : 'bg-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)]'
                    }`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 + i * 0.3, ease: 'easeOut' }}
                  />
                )}
              </span>
              <div className={`min-w-0 ${cobro ? '' : 'pb-7'}`}>
                <p className="text-[16px] font-bold text-[var(--accent)]">{llenar(hito.cuando, v)}</p>
                <p className="mt-0.5 text-[18px] leading-snug font-semibold text-[var(--text-primary)]">{llenar(hito.titulo, v)}</p>
                <p className="mt-0.5 text-[16px] leading-snug text-[var(--text-secondary)]">{hito.texto}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-[18px] leading-[1.45] text-[var(--text-primary)]">
        <MarkedCopy text={PAYWALL_PRUEBA.debajo} />
      </p>

      <PieFijo>
        <BotonPrincipal onClick={onSeguir}>{PAYWALL_PRUEBA.boton}</BotonPrincipal>
        <EnlaceTexto href={hrefVolver}>{PAYWALL_PRUEBA.salida}</EnlaceTexto>
      </PieFijo>
    </div>
  );
}
