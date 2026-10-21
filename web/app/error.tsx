'use client';

import { useEffect } from 'react';
import { PaginaAviso } from '@/components/errores/PaginaAviso';

// Si una página falla al cargar: mensaje en español, botón para reintentar y aviso al panel.
export default function ErrorDePagina({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    const cuerpo = JSON.stringify({ message: error.message || 'Error de página', context: error.digest ?? null, screen: 'web' });
    try {
      navigator.sendBeacon('/api/log-error', new Blob([cuerpo], { type: 'application/json' }));
    } catch {
      // Si no se puede avisar, no pasa nada: la persona igual ve el mensaje.
    }
  }, [error]);

  return (
    <PaginaAviso
      titulo="Algo no cargó bien"
      texto="Fue un problema nuestro, no tuyo. Prueba otra vez en unos segundos."
      accion={
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 font-semibold text-white transition-transform active:scale-[0.97]"
        >
          Probar otra vez
        </button>
      }
    />
  );
}
