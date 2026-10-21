import type { Metadata } from 'next';
import { Onboarding } from '@/components/embudo/Onboarding';
import { APP } from '@/lib/marca';

// Bienvenida antes del pago (plan docs/planes/entrada-de-pago.md, paso 3).
// Es personal: no se indexa. Todo el flujo corre en el teléfono (componente cliente).
export const metadata: Metadata = {
  title: `Tu primera rutina · ${APP}`,
  robots: { index: false, follow: false },
};

export default function PaginaOnboarding() {
  return <Onboarding />;
}
