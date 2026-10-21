// Enlace al checkout de Hotmart para empezar la prueba de 7 días.
// La base (con su código de oferta "off") viene de las variables
// NEXT_PUBLIC_HOTMART_CHECKOUT_MENSUAL / _ANUAL. Si falta o no es de
// Hotmart, devolvemos null y el paywall muestra el botón deshabilitado
// (nunca un checkout falso).

export type Plan = 'mensual' | 'anual';

const HOSTS_HOTMART = ['pay.hotmart.com', 'go.hotmart.com'];

export function urlCheckout(base: string | undefined, sck?: string): string | null {
  if (!base) return null;
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || !HOSTS_HOTMART.includes(url.hostname)) return null;
  url.searchParams.set('showOnlyTrial', '1');
  // sck = canal de origen (instagram, tiktok…); solo letras, números, - y _
  const canal = (sck ?? '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
  if (canal) url.searchParams.set('sck', canal);
  return url.toString();
}
