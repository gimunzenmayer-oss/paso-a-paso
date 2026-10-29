import 'server-only';
import type { AjustesCorreo } from './envio';
import { urlSegura } from './plantillas';

export function ajustesCorreo(): AjustesCorreo {
  const sitio = urlSegura(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pasoapaso.hadaapps.com');
  return {
    habilitado: process.env.EMAIL_ENVIO_ACTIVO === 'true',
    marketing: process.env.EMAIL_MARKETING_ACTIVO === 'true',
    dominioVerificado: process.env.EMAIL_DOMINIOS_VERIFICADOS === 'true',
    marketingVerificado: process.env.EMAIL_MARKETING_DOMINIO_VERIFICADO === 'true',
    txKey: process.env.RESEND_API_KEY_TX ?? '', mktKey: process.env.RESEND_API_KEY_MARKETING ?? '', sitio,
  };
}
