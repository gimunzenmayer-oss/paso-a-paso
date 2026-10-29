import { REMITENTE_SERVICIO, type Sobre } from '@/lib/correos/envio';
import { urlSegura } from '@/lib/correos/plantillas';

export const DESTINATARIO_PRUEBA = 'hadaapps@gmail.com';

/** Prueba de transporte: sin código ficticio, compra simulada ni enlace de un solo uso. */
export function sobrePruebaServicio(sitio: string): Sobre {
  const origen = new URL(urlSegura(sitio)).origin;
  const entrada = `${origen}/entrar`;
  const texto = `Esta es una prueba autorizada del correo de Paso a Paso. No activa una compra ni una suscripción.\n\nEl botón abre la página para pedir un código real de seis dígitos.\n\nProbar mi entrada: ${entrada}\n\nSi llegó, revisa también si está en Recibidos o en Spam y sus comprobaciones SPF, DKIM y DMARC.\n\nRespuestas: hadaapps@gmail.com`;
  return {
    from: REMITENTE_SERVICIO, to: [DESTINATARIO_PRUEBA], reply_to: DESTINATARIO_PRUEBA,
    subject: '[PRUEBA] Correo de Paso a Paso', text: texto,
    html: `<html lang="es"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="background:#F2F4EF;color:#22302A;font-family:Arial,sans-serif;padding:24px 16px"><main style="background:#FBFCF9;border:1px solid #E6ECE5;border-radius:18px;max-width:520px;margin:auto;padding:24px;line-height:1.6"><p>Paso a Paso · prueba de envío</p><h1 style="font-size:24px">Tu correo de prueba</h1><p>Esta prueba no activa una compra ni una suscripción.</p><p>El botón abre la página para pedir un código real de seis dígitos.</p><p><a href="${entrada}" style="display:inline-block;background:#4A765F;color:white;padding:16px 24px;border-radius:14px;text-decoration:none">Probar mi entrada</a></p><p>Revisa si llegó a Recibidos o Spam. En los detalles del mensaje comprobaremos SPF, DKIM y DMARC.</p><p>Respuestas: hadaapps@gmail.com</p></main></body></html>`,
  };
}
