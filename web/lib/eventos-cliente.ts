// Eventos ANÓNIMOS de uso hacia /api/events (contrato 36), desde el navegador.
// Usa el mismo número al azar del teléfono que la app (pp_dispositivo) para unir el embudo.
// Solo viaja el nombre del evento y, si hace falta, un número (por ejemplo, el paso)
// o el plan elegido en el paywall (hoy solo mensual).
// Nunca se mandan aquí respuestas del onboarding ni datos del peque.
// Respeta el interruptor de estadísticas de la app (Ajustes → pp_sin_estadisticas = '1'):
// apagado, no sale ningún evento, igual que en app/js/medicion.js.

import type { Plan } from '@/lib/embudo/checkout';

function azar() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}

/** La clave del interruptor de la app (app/js/medicion.js, PP.fijarEstadisticas): '1' = apagadas. */
export const CLAVE_SIN_ESTADISTICAS = 'pp_sin_estadisticas';

/** Almacenamiento bloqueado por el navegador (modo privado estricto, datos de sitio bloqueados):
 *  el acceso a localStorage lanza una DOMException (SecurityError; QuotaExceededError al escribir).
 *  Solo ese caso se atiende; cualquier otro error sigue su curso. */
function almacenBloqueado(e: unknown): boolean {
  return e instanceof DOMException;
}

function leer(clave: string, crear?: () => string): string | null {
  try {
    let v = localStorage.getItem(clave);
    if (!v && crear) {
      v = crear();
      localStorage.setItem(clave, v);
    }
    return v;
  } catch (e) {
    if (!almacenBloqueado(e)) throw e;
    return crear ? crear() : null;
  }
}

/** true si la familia apagó las estadísticas en la app. Con el almacenamiento bloqueado no hay
 *  interruptor guardado que leer (la app tampoco pudo guardarlo): cuenta como encendido, igual que
 *  PP.estadisticasActivas en la app. */
export function estadisticasApagadas(): boolean {
  return leer(CLAVE_SIN_ESTADISTICAS) === '1';
}

/** Propiedades permitidas: números (paso, total) y el plan del paywall (hoy solo
 *  mensual, contrato 36: `plan` y `plan_elegido`). Nada de texto libre. */
export type PropsEvento = Record<string, number | Plan>;

export function enviarEvento(tipo: string, props?: PropsEvento) {
  if (estadisticasApagadas()) return;
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
