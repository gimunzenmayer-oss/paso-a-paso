'use client';

import { useEffect } from 'react';
import { enviarEvento as enviar } from '@/lib/eventos-cliente';

// Cifras ANÓNIMAS de la página de ventas para el panel (contrato 36): visita y toque en "Probar gratis".
// El envío (con el número al azar del teléfono, pp_dispositivo) vive en lib/eventos-cliente.ts.

// Una visita = un evento, aunque React monte el componente dos veces (modo desarrollo).
let visitaContada = false;

export function Medicion({ destinoCta }: { destinoCta: string }) {
  useEffect(() => {
    try {
      const q = new URLSearchParams(location.search);
      if (q.get('qa') === '1') localStorage.setItem('pp_qa', '1');
      if (q.get('qa') === '0') localStorage.removeItem('pp_qa');
      // Canal de llegada (primer toque): ?src=meta, ?sck=… (Hotmart) o utm_source.
      const origen = (q.get('src') ?? q.get('sck') ?? q.get('utm_source') ?? '').toLowerCase().slice(0, 40);
      if (/^[a-z0-9_:.-]+$/.test(origen) && !localStorage.getItem('pp_origen')) localStorage.setItem('pp_origen', origen);
    } catch {
      // Sin almacenamiento (modo privado estricto): se mide igual, sin canal.
    }
    if (!visitaContada) {
      visitaContada = true;
      enviar('landing_vista');
    }
    const alTocar = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a');
      if (a && a.getAttribute('href') === destinoCta) enviar('landing_cta_clic');
    };
    document.addEventListener('click', alTocar);
    return () => document.removeEventListener('click', alTocar);
  }, [destinoCta]);
  return null;
}
