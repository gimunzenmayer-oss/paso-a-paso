'use client';

// Aviso de permiso para el píxel de Meta (47 §6): «Aceptar» y «Rechazar» del mismo tamaño y peso,
// nada se carga antes de la elección y la política de privacidad queda a un toque.
// Va SOLO en la página de ventas, el recorrido de inicio y la pantalla de planes.

import { useEffect, useSyncExternalStore } from 'react';
import { cargarPixel, guardarEleccion, idPixel, leerEleccion, suscribirEleccion } from '@/lib/pixel-meta';

const BOTON =
  'flex h-12 flex-1 items-center justify-center rounded-[var(--radius-button)] border-2 border-[var(--accent)] bg-[var(--surface)] px-4 text-[16px] font-semibold text-[var(--accent)] transition-colors duration-150 [touch-action:manipulation] hover:bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface))] active:scale-[0.97]';

// En el servidor no sabemos nada: no se muestra el aviso ni se carga nada hasta estar en el teléfono.
const enServidor = () => 'servidor' as const;

export function AvisoPixel() {
  const id = idPixel();
  const eleccion = useSyncExternalStore(suscribirEleccion, leerEleccion, enServidor);

  useEffect(() => {
    if (id && eleccion === 'aceptado') cargarPixel(id);
  }, [id, eleccion]);

  if (!id || eleccion !== null) return null;

  return (
    <section
      role="region"
      aria-label="Permiso para medir los anuncios"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--bg)] px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_color-mix(in_oklab,var(--text-primary)_10%,transparent)]"
    >
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-3">
        <p className="text-[16px] leading-snug text-[var(--text-primary)]">
          ¿Nos dejas usar el píxel de Meta en esta página? Solo nos dice si llegaste por un anuncio de Facebook o
          Instagram. <strong>Nunca</strong> lo usamos dentro de la app ni con los datos de tu peque.{' '}
          <a href="/privacidad#cookies" className="font-semibold text-[var(--accent)] underline underline-offset-4">
            Más detalles
          </a>
        </p>
        <div className="flex gap-3">
          <button type="button" className={BOTON} onClick={() => guardarEleccion(false)}>
            Rechazar
          </button>
          <button type="button" className={BOTON} onClick={() => guardarEleccion(true)}>
            Aceptar
          </button>
        </div>
      </div>
    </section>
  );
}
