import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaLegal } from '@/components/legal/PaginaLegal';
import { APP, GARANTIA_DIAS, PRUEBA_DIAS, SOPORTE_EMAIL } from '@/lib/marca';

export const metadata: Metadata = { title: `Reembolsos · ${APP}` };

// Debe coincidir con: la landing y el paywall (30 días), la garantía configurada en Hotmart
// (30 días, la máxima) y el webhook, que cierra el acceso con PURCHASE_REFUNDED/CHARGEBACK.
export default function Reembolsos() {
  return (
    <PaginaLegal titulo="Política de reembolsos">
      <h2>Prueba gratis de {PRUEBA_DIAS} días</h2>
      <p>
        Durante la prueba no se cobra nada. Si cancelas antes de que termine, no pagas nunca. El día {PRUEBA_DIAS} se cobra
        el plan que elegiste (mensual o anual). Antes de ese cobro te avisamos por correo.
      </p>

      <h2>Garantía del Día Tranquilo: {GARANTIA_DIAS} días</h2>
      <p>
        Si {APP} no te ayuda a tener días más predecibles, pide el reembolso <strong>dentro de los {GARANTIA_DIAS} días
        siguientes a tu primer cobro</strong> y te devolvemos todo lo que pagaste. Sin preguntas y sin tener que dar
        explicaciones.
      </p>
      <ul>
        <li>Vale para la primera compra, tanto del plan mensual como del anual.</li>
        <li>Las renovaciones siguientes no tienen esta garantía, pero puedes cancelar cuando quieras para que no haya un nuevo cobro.</li>
        <li>Esta garantía no reemplaza los derechos que te da la ley de tu país (por ejemplo, el derecho de retracto): si la ley te da más, se aplica la ley.</li>
      </ul>

      <h2>Cómo pedirlo</h2>
      <ul>
        <li>Desde Hotmart: entra a tu compra de {APP} y elige la opción de reembolso. También puedes hacerlo en <a href="https://refund.hotmart.com" rel="noopener">refund.hotmart.com</a>.</li>
        <li>O escribiendo a <a href={`mailto:${SOPORTE_EMAIL}`}>{SOPORTE_EMAIL}</a> desde el correo de tu compra. Lo gestionamos por ti.</li>
      </ul>

      <h2>Qué pasa después</h2>
      <p>
        Hotmart devuelve el dinero por el mismo medio de pago. El tiempo en que lo ves depende de tu banco o tarjeta. Al
        reembolsarse la compra, la suscripción se cancela y la app queda en pausa. No borramos nada: tus datos siguen en tu
        teléfono, y la guía «¿Momento difícil?» y el kit de calma siguen abiertos.
      </p>
      <p>
        ¿Solo quieres que no se te cobre de nuevo? Eso es cancelar, no reembolsar: <Link href="/cancelar">mira cómo cancelar</Link>.
      </p>
    </PaginaLegal>
  );
}
