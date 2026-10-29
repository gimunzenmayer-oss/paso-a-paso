import { renderCorreo, type DatosCorreo, type IdPlantilla } from '@/lib/correos/plantillas';

// Dominio transaccional comprobado en Resend por la dueña y en su panel real.
export const REMITENTE_SERVICIO = 'Paso a Paso <acceso@acceso.hadaapps.com>';
export const REMITENTE_MARKETING = 'Paso a Paso <hola@news.hadaapps.com>';

export interface AjustesCorreo {
  habilitado: boolean;
  marketing: boolean;
  dominioVerificado: boolean;
  marketingVerificado?: boolean;
  txKey: string;
  mktKey: string;
  sitio: string;
}
export interface Sobre {
  from: string; to: string[]; reply_to: string; subject: string; html: string; text: string;
  headers?: Record<string, string>;
}
export function construirSobre(id: IdPlantilla, destinatario: string, datos: DatosCorreo): Sobre {
  if (!/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(destinatario)) throw new Error('destinatario_invalido');
  const correo = renderCorreo(id, datos);
  return {
    from: correo.canal === 'servicio' ? REMITENTE_SERVICIO : REMITENTE_MARKETING,
    to: [destinatario], reply_to: 'hadaapps@gmail.com', subject: correo.asunto, html: correo.html, text: correo.texto,
    ...(correo.canal === 'marketing' ? { headers: { 'List-Unsubscribe': `<${datos.urlBaja}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } } : {}),
  };
}
export class ErrorCorreo extends Error {
  readonly razon: string;
  readonly reintentar: boolean;
  constructor(razon: string, reintentar: boolean) { super(razon); this.razon=razon; this.reintentar=reintentar; }
}
export async function enviarResend(sobre: Sobre, canal: 'servicio' | 'marketing', clave: string, config: AjustesCorreo, transporte: typeof fetch = fetch): Promise<string> {
  if (!config.habilitado || !config.dominioVerificado || (canal === 'marketing' && (!config.marketing || !config.marketingVerificado))) throw new ErrorCorreo('envio_desactivado', false);
  const key = canal === 'servicio' ? config.txKey : config.mktKey;
  if (!key) throw new ErrorCorreo('falta_configuracion', false);
  if (!/^re_[a-zA-Z0-9_-]{10,}$/.test(key)) throw new ErrorCorreo('clave_resend_invalida', false);
  const esperado = canal === 'servicio' ? REMITENTE_SERVICIO : REMITENTE_MARKETING;
  if (sobre.from !== esperado) throw new ErrorCorreo('remitente_invalido', false);
  let res: Response;
  try {
    res = await transporte('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `paso-a-paso/${clave}` },
      body: JSON.stringify(sobre), signal: AbortSignal.timeout(15_000),
    });
  } catch { throw new ErrorCorreo('red_o_timeout', true); }
  if (!res.ok) throw new ErrorCorreo(`proveedor_${res.status}`, res.status === 429 || res.status >= 500);
  const resultado: unknown = await res.json();
  if (!resultado || typeof resultado !== 'object' || !('id' in resultado) || typeof resultado.id !== 'string') throw new ErrorCorreo('respuesta_invalida', true);
  return resultado.id;
}
