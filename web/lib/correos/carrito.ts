// Contrato oficial Hotmart v2, comprobado el 26-10-2026:
// https://developers.hotmart.com/docs/en/2.0.0/webhook/cart-abandonment-webhook/
// Solo se llama DESPUÉS de validar el hottok en la ruta del servidor.
export const EVENTO_CARRITO = 'PURCHASE_OUT_OF_SHOPPING_CART';
const PRODUCTO = '8796204';
const objeto = (v: unknown): Record<string, unknown> | null =>
  v !== null && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : null;

export function leerCarrito(raw: unknown, ofertaMensual: string | null, ahora = Date.now()): { email: string; checkout_id: string } | null {
  const e = objeto(raw);
  if (!e || e.event !== EVENTO_CARRITO || e.version !== '2.0.0' || !ofertaMensual) return null;
  if (typeof e.id !== 'string' || !/^[a-zA-Z0-9_-]{1,120}$/.test(e.id)) return null;
  if (typeof e.creation_date !== 'number' || !Number.isFinite(e.creation_date) || e.creation_date > ahora + 300_000 || e.creation_date < ahora - 72 * 3600_000) return null;
  const data = objeto(e.data), producto = objeto(data?.product), oferta = objeto(data?.offer), comprador = objeto(data?.buyer);
  if (String(producto?.id) !== PRODUCTO || oferta?.code !== ofertaMensual) return null;
  if (typeof comprador?.email !== 'string') return null;
  const email = comprador.email.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(email)) return null;
  // No importar nombres, teléfonos, IP, ni dar permiso de marketing por abandonar.
  // La base exige consentimiento ya confirmado antes de programar cualquier mensaje.
  return { email, checkout_id: e.id };
}
