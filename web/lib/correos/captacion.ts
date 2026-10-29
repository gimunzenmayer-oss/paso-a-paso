import type { AjustesCorreo } from './envio';
import { normalizarCorreo } from '@/lib/cuenta/formato';

export function captacionDisponible(c: AjustesCorreo, habilitada: boolean, recurso: string | undefined): boolean {
  return Boolean(habilitada && recurso && c.habilitado && c.dominioVerificado && c.marketing && c.marketingVerificado);
}
export function leerSolicitudRecurso(raw: unknown): { email: string; trampa: boolean } | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const d = raw as Record<string, unknown>;
  const email = normalizarCorreo(d.email);
  if (!email || email.length > 254 || d.consentimiento !== true) return null;
  return { email, trampa: typeof d.sitioWeb === 'string' && d.sitioWeb.length > 0 };
}
