import type { Metadata } from 'next';
import { Paywall } from '@/components/embudo/Paywall';
import { APP } from '@/lib/marca';

// Paywall en 3 páginas (plan docs/planes/entrada-de-pago.md, paso 5).
// Es personal: no se indexa. Todo corre en el teléfono (componente cliente).
export const metadata: Metadata = {
  title: `Tu plan · ${APP}`,
  robots: { index: false, follow: false },
};

export default function PaginaPaywall() {
  return <Paywall />;
}
