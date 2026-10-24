import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaLegal } from '@/components/legal/PaginaLegal';
import { APP, HOTMART_MIS_COMPRAS, PRUEBA_DIAS, SOPORTE_EMAIL } from '@/lib/marca';

export const metadata: Metadata = { title: `Cómo cancelar · ${APP}` };

// Página "cómo cancelar" obligatoria de la capa de suscripción (47 §2): pasos concretos y
// enlace directo a Hotmart, que es donde vive la suscripción.
export default function Cancelar() {
  return (
    <PaginaLegal titulo="Cómo cancelar tu suscripción">
      <p>
        Cancelar es tan fácil como empezar: lo haces tú, en Hotmart, en un par de minutos y sin llamadas. Si cancelas
        durante los {PRUEBA_DIAS} días de prueba, no se te cobra nada.
      </p>

      <h2>Pasos</h2>
      <ol className="flex list-decimal flex-col gap-2 pl-[1.3em]">
        <li>
          Abre <a href={HOTMART_MIS_COMPRAS} rel="noopener">Mis compras en Hotmart</a> y entra con el correo que usaste al
          comprar.
        </li>
        <li>Elige la compra de {APP}.</li>
        <li>Toca la opción para cancelar la suscripción y confirma.</li>
        <li>Hotmart te manda un correo confirmando la cancelación. Guárdalo.</li>
      </ol>
      <p>
        También puedes llegar desde la app: entra a <Link href="/cuenta">tu cuenta</Link> y toca «Gestionar o cancelar en
        Hotmart».
      </p>

      <h2>Qué pasa al cancelar</h2>
      <ul>
        <li>No se te vuelve a cobrar.</li>
        <li>Sigues teniendo acceso hasta el final del periodo que ya pagaste.</li>
        <li>Después, la app queda en pausa. No borramos nada: tus datos siguen en tu teléfono, y la guía «¿Momento difícil?» y el kit de calma siguen abiertos siempre.</li>
        <li>Si cambias de idea, puedes volver a activarla desde tu cuenta.</li>
      </ul>

      <h2>¿Algo no funciona?</h2>
      <p>
        Escríbenos a <a href={`mailto:${SOPORTE_EMAIL}`}>{SOPORTE_EMAIL}</a> desde el correo de tu compra con la palabra
        «Cancelar» y lo hacemos por ti. Si además quieres tu dinero de vuelta, mira la{' '}
        <Link href="/reembolsos">política de reembolsos</Link>.
      </p>
    </PaginaLegal>
  );
}
