'use client';

import { useEffect, useState } from 'react';
import { dinero } from '@/lib/admin/formato';

// La cifra principal sube desde 0 hasta su valor real (600ms).
// - Parte en 0 tanto en el servidor como en el navegador: no hay un "valor final → 0 → sube" que parpadee.
// - El ancho del monto final queda reservado, así la frase no se mueve mientras cuenta.
// - Con "reducir movimiento" o sin JavaScript se ve directamente el valor final (lo resuelve el CSS: panel.css y el <noscript> del layout).
// - Los lectores de pantalla leen solo el valor final.
export function MontoVivo({ monto, moneda }: { monto: number; moneda: string }) {
  const [mostrado, setMostrado] = useState(0);

  useEffect(() => {
    let cuadro = 0;
    const inicio = performance.now();
    const paso = (t: number) => {
      const avance = Math.min(1, (t - inicio - 200) / 600);
      const suave = avance <= 0 ? 0 : 1 - Math.pow(1 - avance, 3);
      setMostrado(Math.round(monto * suave));
      if (avance < 1) cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [monto]);

  const final = dinero(monto, moneda);
  return (
    <span className="inline-grid">
      <span aria-hidden="true" className="invisible [grid-area:1/1]">
        {final}
      </span>
      <span aria-hidden="true" className="monto-anim [grid-area:1/1]">
        {dinero(mostrado, moneda)}
      </span>
      <span aria-hidden="true" className="monto-fijo [grid-area:1/1]">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
