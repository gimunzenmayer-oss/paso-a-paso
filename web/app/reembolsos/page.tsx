import type { Metadata } from 'next';
import { PaginaLegal } from '@/components/legal/PaginaLegal';
import { APP, GARANTIA_DIAS, PRUEBA_DIAS, SOPORTE_EMAIL } from '@/lib/marca';

export const metadata: Metadata = { title: `Reembolsos · ${APP}` };

export default function Reembolsos() {
  return (
    <PaginaLegal titulo="Política de reembolsos">
      <p>
        <strong>Prueba gratis de {PRUEBA_DIAS} días.</strong> Durante la prueba no se cobra nada. Si cancelas antes de que
        termine, no pagas.
      </p>
      <p>
        <strong>Garantía del Día Tranquilo: {GARANTIA_DIAS} días.</strong> Si {APP} no te ayuda a tener días más
        predecibles, pide el reembolso dentro de los {GARANTIA_DIAS} días de garantía y te devolvemos todo. Sin preguntas.
      </p>
      <h2>Cómo pedirlo</h2>
      <ul>
        <li>Desde tu cuenta de Hotmart, en la compra de {APP}, con la opción de reembolso.</li>
        <li>O escribiendo a <a href={`mailto:${SOPORTE_EMAIL}`}>{SOPORTE_EMAIL}</a> con el correo de tu compra.</li>
      </ul>
      <p>
        El reembolso lo procesa Hotmart por el mismo medio de pago. Al reembolsarse la compra, el acceso a la cuenta se cierra.
        Los datos guardados en tu teléfono siguen siendo tuyos.
      </p>
    </PaginaLegal>
  );
}
