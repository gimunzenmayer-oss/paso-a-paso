// Píxel de Meta SOLO en la página de ventas, el recorrido de inicio y la pantalla de planes,
// y SOLO si la persona tocó «Aceptar» en el aviso (política de privacidad §8, versión legal 5).
// Nunca dentro de la app (/app), nunca con respuestas del onboarding ni datos del peque.
//
// - Sin NEXT_PUBLIC_META_PIXEL_ID, no hay aviso ni píxel (todo queda como antes).
// - La elección se guarda en este teléfono con la versión del aviso: si el aviso cambia,
//   se vuelve a preguntar (47 §3B: el consentimiento vale solo para la versión aceptada).
// - autoConfig apagado: Meta no "lee" botones ni textos de la página por su cuenta
//   (son temas de salud; solo viajan los eventos que mandamos nosotros, sin parámetros).

export const VERSION_AVISO = 1;
export const CLAVE_CONSENTIMIENTO = 'pp_consentimiento_meta';

/** Eventos estándar de Meta que mandamos, siempre sin parámetros. */
export type EventoMeta = 'PageView' | 'CompleteRegistration' | 'InitiateCheckout';

/** Nuestros eventos internos que equivalen a uno de Meta (el resto no viaja a Meta). */
export const EQUIVALENCIA_META: Readonly<Record<string, EventoMeta>> = {
  onboarding_completado: 'CompleteRegistration',
  checkout_iniciado: 'InitiateCheckout',
};

/** Solo dígitos (los ID de píxel son numéricos); cualquier otra cosa = sin píxel. */
export function idPixel(valor: string | undefined = process.env.NEXT_PUBLIC_META_PIXEL_ID): string | null {
  const v = (valor ?? '').trim();
  return /^\d{10,20}$/.test(v) ? v : null;
}

export type Eleccion = 'aceptado' | 'rechazado' | null;

/** La elección vigente para ESTA versión del aviso; otra versión o nada guardado = null (preguntar). */
export function leerEleccion(): Eleccion {
  try {
    const crudo = localStorage.getItem(CLAVE_CONSENTIMIENTO);
    if (!crudo) return null;
    const dato = JSON.parse(crudo) as { v?: unknown; ok?: unknown };
    if (dato.v !== VERSION_AVISO || typeof dato.ok !== 'boolean') return null;
    return dato.ok ? 'aceptado' : 'rechazado';
  } catch {
    // Almacenamiento bloqueado o dato roto: no hay permiso guardado, así que no se carga nada.
    return null;
  }
}

// Quienes muestran la elección (aviso y política) se enteran al instante cuando cambia.
const oyentes = new Set<() => void>();
function avisar() {
  for (const f of oyentes) f();
}
export function suscribirEleccion(f: () => void) {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
}

export function guardarEleccion(acepta: boolean) {
  try {
    localStorage.setItem(CLAVE_CONSENTIMIENTO, JSON.stringify({ v: VERSION_AVISO, ok: acepta, ts: Date.now() }));
  } catch {
    // Sin almacenamiento: no queda guardada y se volverá a preguntar en la próxima visita.
  }
  avisar();
}

/** Retira la elección: el píxel deja de mandar eventos y el aviso vuelve a preguntar. */
export function borrarEleccion() {
  try {
    localStorage.removeItem(CLAVE_CONSENTIMIENTO);
  } catch {
    // Sin almacenamiento no hay elección guardada que borrar.
  }
  avisar();
}

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[][]; loaded: boolean; version: string; push: Fbq };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let cargado = false;

/** Carga el píxel (una sola vez) y cuenta la visita. Solo se llama tras «Aceptar». */
export function cargarPixel(id: string) {
  if (cargado || typeof window === 'undefined') return;
  cargado = true;
  if (!window.fbq) {
    const f = function (...args: unknown[]) {
      if (f.callMethod) f.callMethod(...args);
      else f.queue.push(args);
    } as Fbq;
    f.push = f;
    f.loaded = true;
    f.version = '2.0';
    f.queue = [];
    window.fbq = f;
    window._fbq = f;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
  }
  window.fbq('set', 'autoConfig', false, id);
  window.fbq('init', id);
  window.fbq('track', 'PageView');
}

/** Manda un evento estándar, sin parámetros, solo si el píxel ya está cargado (= hubo «Aceptar»). */
export function eventoMeta(nombre: EventoMeta) {
  if (!cargado || typeof window === 'undefined' || !window.fbq) return;
  if (leerEleccion() !== 'aceptado') return;
  window.fbq('track', nombre);
}
