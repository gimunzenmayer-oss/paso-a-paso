'use client';

// Retirar el permiso del píxel de Meta desde la política (47 §6: retirarlo debe ser tan fácil
// como darlo). Después, el aviso vuelve a preguntar en la página de ventas.

import { useState, useSyncExternalStore } from 'react';
import { borrarEleccion, leerEleccion, suscribirEleccion } from '@/lib/pixel-meta';

const enServidor = () => 'servidor' as const;

export function CambiarEleccionPixel() {
  const eleccion = useSyncExternalStore(suscribirEleccion, leerEleccion, enServidor);
  const [borrado, setBorrado] = useState(false);

  if (eleccion === 'servidor') return null;

  const texto = borrado
    ? 'Listo: borramos tu elección. El píxel queda apagado y te volveremos a preguntar en la página de ventas.'
    : eleccion === 'aceptado'
      ? 'En este teléfono aceptaste el píxel de Meta.'
      : eleccion === 'rechazado'
        ? 'En este teléfono rechazaste el píxel de Meta.'
        : 'En este teléfono no hay ninguna elección guardada: el píxel no se carga.';

  return (
    <div role="status">
      <p>{texto}</p>
      {eleccion !== null && (
        <button
          type="button"
          onClick={() => {
            borrarEleccion();
            setBorrado(true);
          }}
          className="min-h-11 rounded-[var(--radius-button)] border-2 border-[var(--accent)] px-4 font-semibold text-[var(--accent)]"
        >
          Borrar mi elección
        </button>
      )}
    </div>
  );
}
