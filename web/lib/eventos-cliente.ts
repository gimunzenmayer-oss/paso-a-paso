// Eventos ANÓNIMOS de uso hacia /api/events (contrato 36), desde el navegador.
// Usa el mismo número al azar del teléfono que la app (pp_dispositivo) para unir el embudo.
// Solo viaja el nombre del evento y, si hace falta, un número (por ejemplo, el paso)
// o el plan elegido en el paywall (mensual o anual).
// Nunca se mandan aquí respuestas del onboarding ni datos del peque.

import type { Plan } from '@/lib/embudo/checkout';

function azar() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}

function leer(clave: string, crear?: () => string): string | null {
  try {
    let v = localStorage.getItem(clave);
    if (!v && crear) {
      v = crear();
      localStorage.setItem(clave, v);
    }
    return v;
  } catch {
    return crear ? crear() : null;
  }
}

/** Propiedades permitidas: números (paso, total) y el plan del paywall (mensual o
 *  anual, contrato 36: `plan` y `plan_elegido`). Nada de texto libre. */
export type PropsEvento = Record<string, number | Plan>;

export function enviarEvento(tipo: string, props?: PropsEvento) {
  const cuerpo = JSON.stringify({
    type: tipo,
    device_id: leer('pp_dispositivo', azar),
    source: leer('pp_origen'),
    qa: leer('pp_qa') === '1',
    ...(props ? { props } : {}),
  });
  if (!navigator.sendBeacon?.('/api/events', new Blob([cuerpo], { type: 'application/json' }))) {
    fetch('/api/events', { method: 'POST', body: cuerpo, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {});
  }
}
