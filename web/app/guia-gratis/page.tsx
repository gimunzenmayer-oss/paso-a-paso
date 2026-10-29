import { GuiaGratis } from '@/components/correos/GuiaGratis';
import { captacionDisponible } from '@/lib/correos/captacion';
import { ajustesCorreo } from '@/lib/correos/config';
export const metadata = { title: 'Mi primera rutina · Hoja gratuita · Paso a Paso', description: 'Una hoja rellenable para organizar un momento del día con hasta seis pasos. Descárgala gratis, sin registro.' };
export const dynamic = 'force-dynamic';
export default function Guia() {
  const disponible = captacionDisponible(ajustesCorreo(), process.env.EMAIL_CAPTACION_ACTIVA === 'true', process.env.EMAIL_RECURSO_URL);
  return <GuiaGratis correoDisponible={disponible} />;
}
