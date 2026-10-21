'use client';

// 2.2 Página 2 del paywall: la prueba día por día (50 C4, patrón Blinkist). Tres
// planos: el fondo, la línea de tiempo en una tarjeta con hairline (la superficie)
// y la garantía en el plano hundido. El primer hito es una escena de su día (su
// rutina de {momento} y la guía para cuando {crisis}), no una lista de funciones.
// El nodo de "Hoy" es el check del embudo (CheckQueSeLlena: acceso sin pagar, ya
// suyo) y bajo su texto van 3 fotos de su rutina: la página lleva el dispositivo
// propio de la marca, como la 1 y la 3. El Día 5 es un aviso, no un
// acceso: su nodo y su tramo van en la 2.ª nota de FICHA-ARTE (niebla, "después").
// Nodo con borde = el día del cobro, con su fecha exacta y el monto del plan
// elegido ({monto}, que nunca se parte entre líneas). Si todavía no eligió plan (sin
// ?plan= ni plan guardado), el Día 7 dice «Empieza el cobro del plan que elijas» con
// los 2 montos: no le atribuye un precio que ella no eligió. Cada tramo del riel y el texto de su hito entran al mismo
// ritmo (0.15 + i·0.3 s); con "reducir movimiento" aparecen ya dibujados
// (MotionConfig del paywall). El espacio entre hitos (pb-7) va en el texto, no en
// el <li>: así el riel, que se estira a la altura del <li>, llega al nodo siguiente.

import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import { pasosConFoto, type PasoRutina } from '@/lib/embudo/rutinas';
import { BotonPrincipal, CheckQueSeLlena, EnlaceTexto, entrada, Miniatura, PieFijo, Titulo } from './ui';
import { llenar, PAYWALL_COMUN, PAYWALL_PRUEBA, type Variables, type VariablesPaywall } from './textos';

/** Ritmo del riel: cada hito entra 0.3 s después del anterior. */
const ritmo = (i: number) => 0.15 + i * 0.3;

/** Llena un texto del copy con {monto} entero en una sola línea ("US$7.99 al mes" no se parte). */
function conMontoEntero(texto: string, v: Variables & VariablesPaywall) {
  const [antes, despues] = texto.split('{monto}');
  if (despues === undefined || v.monto === undefined) return llenar(texto, v);
  return (
    <>
      {llenar(antes, v)}
      <span className="whitespace-nowrap">{v.monto}</span>
      {llenar(despues, v)}
    </>
  );
}

export function PaywallPrueba({
  v,
  pasos,
  hrefVolver,
  enfocar,
  onSeguir,
}: {
  v: Variables & VariablesPaywall;
  /** Los pasos de su rutina (rutinaDe(momento)): sus fotos van bajo el hito "Hoy". */
  pasos: readonly PasoRutina[];
  hrefVolver: string;
  enfocar: boolean;
  onSeguir: () => void;
}) {
  const ultimo = PAYWALL_PRUEBA.linea.length - 1;
  return (
    <div className="flex flex-1 flex-col">
      <Titulo texto={PAYWALL_PRUEBA.titulo} enfocar={enfocar} />

      <Hairline emphasis surface="surface" className="mt-6 shadow-[var(--shadow-2)]">
        <ol className="flex flex-col p-4">
          {PAYWALL_PRUEBA.linea.map((hito, i) => {
            const hoy = i === 0;
            const cobro = i === ultimo;
            // El Día 5 (aviso) y su tramo hasta el cobro van en la 2.ª nota.
            const aviso = i === ultimo - 1;
            // Día 7 sin plan elegido (v.monto vacío): el cobro "del plan que elijas", con los 2 montos.
            const { titulo, texto } = cobro && v.monto === undefined ? PAYWALL_PRUEBA.cobroSinPlan : hito;
            return (
              <li key={hito.cuando} className="relative flex gap-4">
                {/* Riel: nodo + tramo hasta el siguiente hito. */}
                <span aria-hidden="true" className="relative flex w-4 shrink-0 justify-center">
                  {hoy ? (
                    <span className="relative z-10 mt-1.5 inline-flex">
                      <CheckQueSeLlena tamano={16} />
                    </span>
                  ) : (
                    <span
                      className={`relative z-10 mt-1.5 size-4 rounded-full ${
                        cobro ? 'border-2 border-[var(--accent)] bg-[var(--surface)]' : aviso ? 'bg-[var(--accent-2)]' : 'bg-[var(--accent)]'
                      }`}
                    />
                  )}
                  {!cobro && (
                    <motion.span
                      className={`absolute top-[22px] -bottom-1.5 w-[2px] origin-top rounded-full ${aviso ? 'bg-[var(--accent-2)]' : 'bg-[var(--accent)]'}`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3, delay: ritmo(i), ease: 'easeOut' }}
                    />
                  )}
                </span>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: ritmo(i), ease: [0.16, 1, 0.3, 1] }}
                  className={`min-w-0 ${cobro ? '' : 'pb-7'}`}
                >
                  <p className={`text-[16px] font-bold ${aviso ? 'text-[var(--accent-2)]' : 'text-[var(--accent)]'}`}>{llenar(hito.cuando, v)}</p>
                  <p className="mt-0.5 text-[18px] leading-snug font-semibold text-pretty text-[var(--text-primary)]">
                    {conMontoEntero(titulo, v)}
                  </p>
                  <p className="mt-0.5 text-[16px] leading-snug text-pretty text-[var(--text-secondary)]">{llenar(texto, v)}</p>
                  {/* Hoy: las fotos de su rutina, una tras otra (decorativas: el título ya la nombra). */}
                  {hoy && (
                    <span aria-hidden="true" className="mt-3 flex gap-1.5">
                      {pasosConFoto(pasos, 3).map((paso, j) => (
                        <motion.span key={paso.texto} {...entrada(j, ritmo(i) + 0.15)} className="inline-flex">
                          <Miniatura paso={paso} tamano={40} />
                        </motion.span>
                      ))}
                    </span>
                  )}
                </motion.div>
              </li>
            );
          })}
        </ol>
      </Hairline>

      {/* pb-6: la garantía termina por encima del degradado del pie. */}
      <div className="pb-6">
        <p className="mt-4 flex items-start gap-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4 text-[18px] leading-[1.45] text-[var(--text-primary)]">
          <ShieldCheck size={22} strokeWidth={2} color="var(--accent)" aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>
            <MarkedCopy text={PAYWALL_PRUEBA.debajo} />
          </span>
        </p>
      </div>

      <PieFijo>
        <BotonPrincipal onClick={onSeguir}>{llenar(PAYWALL_PRUEBA.boton, v)}</BotonPrincipal>
        <EnlaceTexto href={hrefVolver}>{PAYWALL_COMUN.salida}</EnlaceTexto>
      </PieFijo>
    </div>
  );
}
