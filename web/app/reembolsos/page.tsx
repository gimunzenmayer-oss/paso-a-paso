import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaLegal } from '@/components/legal/PaginaLegal';
import { APP, PRUEBA_DIAS, REEMBOLSO_DIAS, SOPORTE_EMAIL } from '@/lib/marca';

export const metadata: Metadata = { title: `Reembolsos · ${APP}` };

// Debe coincidir con Hotmart (producto 8796204: prueba de 7 días, reembolso de 7 días
// desde la compra, Términos de Compra de Hotmart 3.1 y 3.1.1) y con el webhook, que cierra
// el acceso con PURCHASE_REFUNDED/CHARGEBACK. Sin "garantía" de días: decisión 2026-10-25.
export default function Reembolsos() {
  return (
    <PaginaLegal titulo="Política de reembolsos">
      <h2>Prueba gratis de {PRUEBA_DIAS} días</h2>
      <p>
        Durante la prueba no se cobra nada. <strong>Si cancelas antes de que termine, no pagas nunca.</strong> El día{' '}
        {PRUEBA_DIAS} se cobra el primer mes. Es la mejor forma de decidir sin riesgo: si no es para ustedes,
        cancela antes de ese día (<Link href="/cancelar">cómo cancelar</Link>).
      </p>

      <h2>Reembolso del primer cobro</h2>
      <p>
        Hotmart permite pedir el reembolso de la compra dentro de los {REEMBOLSO_DIAS} días siguientes a la compra. Como
        la compra se hace el día en que empiezas la prueba, ese plazo puede terminar junto con la prueba. Por eso te
        recomendamos cancelar durante la prueba si no vas a seguir.
      </p>
      <p>
        Si te cobraron y crees que no correspondía, escríbenos a <a href={`mailto:${SOPORTE_EMAIL}`}>{SOPORTE_EMAIL}</a>{' '}
        desde el correo de tu compra. Revisamos cada caso con cariño y te respondemos en un plazo máximo de 5 días hábiles.
      </p>

      <h2>Renovaciones</h2>
      <p>
        Después del primer cobro, la suscripción se renueva sola cada mes. Las renovaciones no se reembolsan, pero puedes
        cancelar cuando quieras para que no haya un cobro nuevo. Mantienes el acceso hasta el final del periodo que ya
        pagaste.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Nada de esta política reduce los derechos que te da la ley de consumo de tu país (por ejemplo, el derecho de
        retracto). Si la ley te da más, se aplica la ley.
      </p>

      <h2>Cómo pedirlo</h2>
      <ul>
        <li>Desde Hotmart: entra a tu compra de {APP} en <a href="https://consumer.hotmart.com/purchase" rel="noopener">Mis compras</a> y elige la opción de reembolso.</li>
        <li>O escribiendo a <a href={`mailto:${SOPORTE_EMAIL}`}>{SOPORTE_EMAIL}</a> desde el correo de tu compra.</li>
      </ul>

      <h2>Qué pasa después</h2>
      <p>
        Hotmart devuelve el dinero por el mismo medio de pago. El tiempo en que lo ves depende de tu banco o tarjeta. Al
        reembolsarse la compra, la suscripción se cancela y la app queda en pausa. No borramos nada: tus datos siguen en tu
        teléfono, y la guía «¿Momento difícil?» y el kit de calma siguen abiertos.
      </p>
    </PaginaLegal>
  );
}
