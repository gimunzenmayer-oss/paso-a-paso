'use client';

// Piezas con interacción de /cuenta: la fecha en la hora del teléfono, "Reintentar" /
// "Revisar de nuevo" (vuelve a preguntar a la base), el enlace a Hotmart con su
// "Abriendo Hotmart…", "Entrar con otro correo", la confirmación de cerrar sesión, la de
// "Eliminar mi cuenta" y el
// movimiento de la página (MotionConfig + entrada escalonada), que la página del servidor
// no puede poner por sí misma.

import { useEffect, useState, useSyncExternalStore, useTransition, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { BotonPrincipal, BotonTexto, EnlacePrincipal, entrada, TextoOcupado } from '@/components/embudo/ui';
import { cerrarSesion, eliminarCuenta, entrarConOtroCorreo } from '@/app/cuenta/acciones';
import { HOTMART_MIS_COMPRAS } from '@/lib/marca';
import { CUENTA } from './textos';

/** Toda la página respeta "reducir movimiento" del teléfono (la entrada y la confirmación quedan en fundido). */
export function Escena({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Un bloque de la página que entra en su turno del escalonado (entrada(i): 60 ms, 300 ms). */
export function Entra({ i, className, children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <motion.div {...entrada(i)} className={className}>
      {children}
    </motion.div>
  );
}

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

/** Vuelve a pedir la página al servidor (otra llamada a mi_acceso) sin recargar todo. Es la
 *  acción principal donde aparece ("Reintentar", "Revisar de nuevo"): botón lleno. */
export function BotonRevisar({ texto }: { texto: string }) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  return (
    <BotonPrincipal disabled={pendiente} ariaBusy={pendiente} onClick={() => iniciar(() => router.refresh())}>
      {pendiente ? <TextoOcupado>{CUENTA.revisando}</TextoOcupado> : texto}
    </BotonPrincipal>
  );
}

/** Si después de esto la página sigue a la vista, Hotmart no abrió: el botón vuelve a su texto. */
const ESPERA_HOTMART_MS = 6_000;

/** El enlace a "Mis compras" de Hotmart con "Abriendo Hotmart…" mientras sale (como en el paywall). */
export function EnlaceHotmart({
  href,
  texto,
  secundario,
  ariaDescribedBy,
}: {
  href: string;
  texto: string;
  secundario: boolean;
  ariaDescribedBy?: string;
}) {
  const [abriendo, setAbriendo] = useState(false);

  useEffect(() => {
    if (!abriendo) return;
    const t = setTimeout(() => {
      if (document.visibilityState === 'visible') setAbriendo(false);
    }, ESPERA_HOTMART_MS);
    return () => clearTimeout(t);
  }, [abriendo]);

  // Volver con "atrás" desde Hotmart restaura la página guardada: el botón vuelve a su texto.
  useEffect(() => {
    const alVolver = (e: PageTransitionEvent) => {
      if (e.persisted) setAbriendo(false);
    };
    window.addEventListener('pageshow', alVolver);
    return () => window.removeEventListener('pageshow', alVolver);
  }, []);

  return (
    <EnlacePrincipal
      href={href}
      secundario={secundario}
      ariaDescribedBy={ariaDescribedBy}
      ariaBusy={abriendo}
      onClick={(e) => {
        if (abriendo) {
          e.preventDefault();
          return;
        }
        setAbriendo(true);
      }}
    >
      {abriendo ? <TextoOcupado>{CUENTA.abriendo}</TextoOcupado> : texto}
    </EnlacePrincipal>
  );
}

/** Sin compra (§3.3): cierra la sesión en este teléfono y vuelve al paso correo de /entrar. */
export function OtroCorreo() {
  const [pendiente, iniciar] = useTransition();
  return (
    <BotonTexto
      onClick={() => {
        if (!pendiente) iniciar(() => entrarConOtroCorreo());
      }}
    >
      {CUENTA.otroCorreo}
    </BotonTexto>
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

/**
 * "Eliminar mi cuenta": enlace discreto al pie; al tocarlo abre la confirmación que explica
 * qué se borra, qué se queda en el teléfono y que Hotmart sigue cobrando si no cancela.
 * conSuscripcion: hay una compra que todavía cobra (prueba, activa, pago atrasado o sin verificar).
 * error: la última vez no se pudo (?eliminar=error): se abre con el aviso.
 */
export function EliminarCuenta({ conSuscripcion, error }: { conSuscripcion: boolean; error: boolean }) {
  const [abierto, setAbierto] = useState(error);
  const [pendiente, iniciar] = useTransition();
  const t = CUENTA.eliminar;
  return (
    <div className="mt-2">
      {!abierto && (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="mx-auto flex min-h-12 items-center justify-center px-4 text-[16px] font-semibold text-[var(--text-secondary)] underline decoration-[color-mix(in_oklab,var(--text-secondary)_45%,transparent)] underline-offset-4 [touch-action:manipulation]"
        >
          {t.boton}
        </button>
      )}
      <AnimatePresence>
        {abierto && (
          <motion.div
            role="alertdialog"
            aria-labelledby="eliminar-titulo"
            aria-describedby="eliminar-texto"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]"
          >
            <h2 id="eliminar-titulo" className="text-[18px] font-bold [font-family:var(--font-display)]">
              {t.titulo}
            </h2>
            <div id="eliminar-texto" className="mt-1 flex flex-col gap-2 text-[16px] leading-[1.45] text-pretty text-[var(--text-secondary)]">
              <p>{t.seBorra}</p>
              <p>{t.seQueda}</p>
              <p>{t.pagos}</p>
              {conSuscripcion && <p className="font-semibold text-[var(--text-primary)]">{t.hotmart}</p>}
            </div>
            {error && (
              <p role="alert" className="mt-3 text-[16px] font-semibold text-[var(--error)]">
                {t.error}
              </p>
            )}
            <div className="mt-4 flex flex-col gap-1">
              {conSuscripcion && (
                <>
                  <EnlacePrincipal href={HOTMART_MIS_COMPRAS}>{t.cancelar}</EnlacePrincipal>
                  <a
                    href="/cancelar"
                    className="mx-auto flex min-h-12 items-center justify-center px-4 text-[16px] font-semibold text-[var(--text-secondary)] underline underline-offset-4 [touch-action:manipulation]"
                  >
                    {t.comoCancelar}
                  </a>
                </>
              )}
              <button
                type="button"
                disabled={pendiente}
                aria-busy={pendiente}
                onClick={() => {
                  if (!pendiente) iniciar(() => eliminarCuenta());
                }}
                className="flex min-h-12 w-full items-center justify-center rounded-[var(--radius-button)] border-2 border-[var(--error)] px-4 text-[16px] font-semibold text-[var(--error)] disabled:opacity-60 [touch-action:manipulation]"
              >
                {pendiente ? <TextoOcupado>{t.eliminando}</TextoOcupado> : t.si}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => setAbierto(false)}
                className="mx-auto flex min-h-12 items-center justify-center px-4 text-[16px] font-semibold text-[var(--text-secondary)] underline underline-offset-4 [touch-action:manipulation]"
              >
                {t.no}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
