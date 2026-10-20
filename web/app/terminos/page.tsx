import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaLegal } from '@/components/legal/PaginaLegal';
import { APP, GARANTIA_DIAS, PAIS, PRUEBA_DIAS, RESPONSABLE, SOPORTE_EMAIL } from '@/lib/marca';

export const metadata: Metadata = { title: `Términos · ${APP}` };

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos y condiciones">
      <h2>1. Qué es {APP}</h2>
      <p>
        Una aplicación web de apoyo para familias de niños y niñas autistas: rutinas visuales, tablero de comunicación,
        temporizador, kit de calma, historias, diario y guía. La ofrece {RESPONSABLE} ({PAIS}).
      </p>
      <h2>2. Qué no es</h2>
      <p>
        {APP} no es un servicio médico ni terapéutico y no reemplaza a profesionales de la salud o la educación.
        Lee el <Link href="/aviso">aviso importante</Link>.
      </p>
      <h2>3. Suscripción, prueba y cancelación</h2>
      <ul>
        <li>El acceso se vende como suscripción mensual o anual a través de Hotmart.</li>
        <li>Incluye {PRUEBA_DIAS} días de prueba sin cobro. Al terminar, se cobra el plan elegido y se renueva automáticamente cada mes o cada año.</li>
        <li>Puedes cancelar cuando quieras desde tu cuenta de Hotmart. Mantienes el acceso hasta el final del periodo pagado.</li>
        <li>Garantía de {GARANTIA_DIAS} días: ver la <Link href="/reembolsos">política de reembolsos</Link>.</li>
      </ul>
      <h2>4. Uso aceptable</h2>
      <p>La cuenta es personal para tu familia. No está permitido revender el acceso ni usar la app para dañar a otras personas. Podemos cerrar cuentas que incumplan estas condiciones.</p>
      <h2>5. Tus datos y tu contenido</h2>
      <p>
        Lo que creas en la app es tuyo y se guarda en tu dispositivo (ver <Link href="/privacidad">privacidad</Link>).
        Eres responsable de hacer copias de lo que quieras conservar.
      </p>
      <h2>6. Responsabilidad</h2>
      <p>
        Hacemos lo posible para que la app funcione bien, pero no podemos garantizar que esté libre de fallos. En la medida
        que permita la ley, nuestra responsabilidad se limita al importe que hayas pagado en los últimos 12 meses.
      </p>
      <h2>7. Ley aplicable y contacto</h2>
      <p>Estos términos se rigen por las leyes de {PAIS}. Para cualquier duda: <a href={`mailto:${SOPORTE_EMAIL}`}>{SOPORTE_EMAIL}</a>.</p>
    </PaginaLegal>
  );
}
