import 'server-only';
import { gunzipSync, gzipSync } from 'node:zlib';

// La primera vez, Supabase entrega la clave de la app de códigos UNA sola vez (al crear la conexión).
// Se guarda unos minutos en una cookie solo del servidor: así, si el navegador recarga la página
// (por ejemplo, al volver de Google Authenticator), se muestra la MISMA clave y no una nueva que invalidaría la ya agregada.
// Una cookie admite ~4 KB: el dibujo del QR va comprimido y, si aun así no cabe, se guarda sin él
// (quedan el botón "Agregar a Google Authenticator" y la clave escrita).
export const COOKIE_ALTA = 'panel-alta';
const MAXIMO = 3800;

export type Alta = { id: string; qr: string | null; secreto: string; uri: string };

export function leerAlta(valor: string | undefined): Alta | null {
  if (!valor) return null;
  try {
    const a = JSON.parse(gunzipSync(Buffer.from(valor, 'base64url')).toString('utf8')) as Alta;
    const ok = typeof a.id === 'string' && typeof a.secreto === 'string' && typeof a.uri === 'string' && (a.qr === null || typeof a.qr === 'string');
    return ok ? a : null;
  } catch {
    return null;
  }
}

export function escribirAlta(a: Alta): string {
  const con = gzipSync(JSON.stringify(a)).toString('base64url');
  return con.length <= MAXIMO ? con : gzipSync(JSON.stringify({ ...a, qr: null })).toString('base64url');
}

// El dibujo del QR llega como "data:image/svg+xml;utf-8,<svg…>" sin codificar: un "#" (color) cortaría la imagen.
// Se guarda solo el SVG y se arma el enlace ya codificado al mostrarlo.
export function svgDeQr(dataUrl: string): string {
  return dataUrl.replace(/^data:image\/svg\+xml;[^,]*,/, '');
}

export function enlaceDeQr(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
