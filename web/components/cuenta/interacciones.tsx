'use client';

// Piezas con interacción de /cuenta: la fecha en la hora del teléfono, "Reintentar" /
// "Revisar de nuevo" (vuelve a preguntar a la base) y la confirmación de cerrar sesión.

import { useState, useSyncExternalStore, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { BotonPrincipal } from '@/components/embudo/ui';
import { cerrarSesion } from '@/app/cuenta/acciones';
import { CUENTA } from './textos';

const FORMATO_DIA = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' });
const sinSuscripcion = () => () => {};

/** "28 de octubre" en la zona del teléfono (el servidor no sabe en qué día vive ella). */
export function FechaLocal({ iso }: { iso: string }) {
  const texto = useSyncExternalStore(
    sinSuscripcion,
    () => FORMATO_DIA.format(new Date(iso)).replace(/ /g, ' '),
    () => null
  );
  return <span className="font-semibold text-[var(--text-primary)]">{texto}</span>;
}

const CLASE_SECUNDARIO =
  'flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] border-2 border-[var(--accent)] bg-[var(--surface)] px-5 text-center text-[18px] leading-tight font-semibold text-[var(--accent)] transition-colors duration-200 [touch-action:manipulation] hover:bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface))] disabled:opacity-65';

/** Vuelve a pedir la página al servidor (otra llamada a mi_acceso) sin recargar todo. */
export function BotonRevisar({ texto }: { texto: string }) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  return (
    <button type="button" disabled={pendiente} aria-busy={pendiente} onClick={() => iniciar(() => router.refresh())} className={CLASE_SECUNDARIO}>
      {pendiente ? CUENTA.revisando : texto}
    </button>
  );
}

export function CerrarSesion() {
  const [abierto, setAbierto] = useState(false);
  const [pendiente, iniciar] = useTransition();
  return (
    <div className="mt-2">
      {!abierto && (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="mx-auto flex min-h-12 items-center justify-center px-4 text-[16px] font-semibold text-[var(--text-secondary)] underline decoration-[color-mix(in_oklab,var(--text-secondary)_45%,transparent)] underline-offset-4 [touch-action:manipulation]"
        >
          {CUENTA.cerrar}
        </button>
      )}
      <AnimatePresence>
        {abierto && (
          <motion.div
            role="alertdialog"
            aria-labelledby="cerrar-titulo"
            aria-describedby="cerrar-texto"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]"
          >
            <h2 id="cerrar-titulo" className="text-[18px] font-bold [font-family:var(--font-display)]">
              {CUENTA.confirmar.titulo}
            </h2>
            <p id="cerrar-texto" className="mt-1 text-[16px] leading-[1.45] text-[var(--text-secondary)]">
              {CUENTA.confirmar.texto}
            </p>
            <div className="mt-4 flex flex-col gap-1">
              <BotonPrincipal disabled={pendiente} onClick={() => iniciar(() => cerrarSesion())}>
                {CUENTA.confirmar.si}
              </BotonPrincipal>
              <button
                type="button"
                autoFocus
                onClick={() => setAbierto(false)}
                className="mx-auto flex min-h-12 items-center justify-center px-4 text-[16px] font-semibold text-[var(--text-secondary)] underline underline-offset-4 [touch-action:manipulation]"
              >
                {CUENTA.confirmar.no}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
