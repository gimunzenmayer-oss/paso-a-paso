import type { Metadata } from 'next';
import { Entrar } from '@/components/cuenta/Entrar';
import { APP } from '@/lib/marca';

// Entrada de las clientas (plan docs/planes/entrada-de-pago.md, paso 7). /login lleva aquí.
// ?compra=1 = llega desde la página de gracias de Hotmart. ?error=enlace = el enlace del
// correo no sirvió (/auth/callback). ?salio=1 = acaba de cerrar sesión en /cuenta.
export const metadata: Metadata = {
  title: `Entrar · ${APP}`,
  robots: { index: false, follow: false },
};

export default async function PaginaEntrar({ searchParams }: PageProps<'/entrar'>) {
  const q = await searchParams;
  const aviso = q.error === 'enlace' ? 'enlace' : q.salio === '1' ? 'salio' : null;
  return <Entrar compra={q.compra === '1'} aviso={aviso} />;
}
