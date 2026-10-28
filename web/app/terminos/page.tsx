import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaLegal } from '@/components/legal/PaginaLegal';
import { APP, EDAD_MINIMA, PAIS, PRECIO_MENSUAL, PRUEBA_DIAS, RESPONSABLE, RESPONSABLE_LEGAL, RESPONSABLE_TIPO, SOPORTE_EMAIL } from '@/lib/marca';

export const metadata: Metadata = { title: `Términos · ${APP}` };

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos y condiciones">
      <p>
        Estas son las reglas para usar {APP}. Al empezar la prueba o usar la app las aceptas, así que te las contamos claro.
      </p>

      <h2>1. Quién ofrece {APP}</h2>
      <p>
        {APP} lo ofrece {RESPONSABLE_LEGAL}, {RESPONSABLE_TIPO}, bajo la marca
        «{RESPONSABLE}», con base en {PAIS}. Contacto:{' '}
        <a href={`mailto:${SOPORTE_EMAIL}`}>{SOPORTE_EMAIL}</a>.
      </p>

      <h2>2. Qué hace {APP}</h2>
      <p>
        Es una aplicación web de apoyo para familias de niños y niñas autistas: rutinas visuales con fotos, tablero de
        comunicación, temporizador visual, kit de calma, historias sociales, diario de crisis, logros, un informe para
        compartir con profesionales y una guía para momentos difíciles.
      </p>

      <h2>3. Qué no hace</h2>
      <ul>
        <li>No es un servicio médico, terapéutico ni de diagnóstico, y no reemplaza a profesionales de la salud o la educación. Lee el <Link href="/aviso">aviso importante</Link>.</li>
        <li>No es un servicio de emergencias. Si hay riesgo, llama a los servicios de emergencia de tu país.</li>
        <li>No promete resultados concretos: cada niño y cada niña es diferente.</li>
        <li>No usa inteligencia artificial: los textos de la guía y de la app están escritos por personas.</li>
        <li>No guarda copia de lo que creas: eso vive en tu teléfono (ver punto 7).</li>
      </ul>

      <h2>4. Quién puede usarla</h2>
      <p>
        La cuenta es para personas mayores de {EDAD_MINIMA} años que cuidan a un niño o una niña. El peque usa su espacio
        dentro de la app bajo la supervisión de esa persona adulta, que es quien acepta estos términos.
      </p>

      <h2>5. Suscripción, prueba y renovación</h2>
      <ul>
        <li>El acceso se vende como suscripción mensual de {PRECIO_MENSUAL} a través de Hotmart, que es quien cobra.</li>
        <li>Empiezas con {PRUEBA_DIAS} días de prueba sin cobro. El día {PRUEBA_DIAS} se cobra el primer mes.</li>
        <li><strong>La suscripción se renueva automáticamente</strong> cada mes, al mismo precio que aceptaste, hasta que la canceles. Si algún día cambiamos el precio, te avisaremos por correo antes del siguiente cobro.</li>
        <li>Puedes cancelar cuando quieras desde Hotmart, en pocos pasos y sin llamadas: <Link href="/cancelar">cómo cancelar</Link>. Mantienes el acceso hasta el final del periodo que ya pagaste.</li>
        <li>Reembolsos: ver la <Link href="/reembolsos">política de reembolsos</Link>.</li>
      </ul>

      <h2>6. Qué pasa si se termina tu suscripción</h2>
      <p>
        Si cancelas, se acaba el periodo pagado o se reembolsa la compra, la app queda en pausa. No borramos nada: tus datos
        siguen en tu teléfono, y la guía «¿Momento difícil?» y el kit de calma siguen abiertos siempre. Si vuelves a activar
        la suscripción, todo sigue donde estaba.
      </p>

      <h2>7. Tu contenido y tus datos</h2>
      <p>
        Todo lo que creas en la app (rutinas, fotos, voces, notas del diario, informes) es tuyo. Se guarda en tu dispositivo y
        no lo vemos (ver <Link href="/privacidad">privacidad</Link>). Como no tenemos copia, tú eres responsable de guardar lo
        que quieras conservar, por ejemplo el informe en PDF.
      </p>

      <h2>8. Licencia de uso</h2>
      <p>
        Mientras tu suscripción esté activa te damos permiso para usar {APP} con tu familia, en tus dispositivos. La app, su
        diseño, sus textos, la guía y el «Método Antes, Durante y Después» son de {RESPONSABLE_LEGAL} («{RESPONSABLE}»). Las fotos de ejemplo son de
        sus autores en Unsplash (créditos en Ajustes). No está permitido copiar, revender ni compartir el acceso fuera de tu
        familia.
      </p>

      <h2>9. Uso aceptable y suspensión</h2>
      <p>
        No está permitido usar la app para dañar a otras personas, intentar entrar a cuentas ajenas, atacar el servicio ni
        revender el acceso. Si alguien lo hace, podemos suspender o cerrar su cuenta. Salvo casos graves o de fraude, antes te
        escribiremos para explicarte el motivo y darte la oportunidad de responder.
      </p>

      <h2>10. Responsabilidad</h2>
      <p>
        Hacemos lo posible para que la app funcione bien y esté disponible, pero puede tener fallos o interrupciones. Las
        decisiones sobre la crianza, la salud y los apoyos de tu peque son tuyas y de sus profesionales. En la medida que lo
        permita la ley, nuestra responsabilidad se limita al importe que hayas pagado en los últimos 12 meses. Nada de esto
        limita los derechos que te da la ley de protección al consumidor de tu país.
      </p>

      <h2>11. Cambios en estos términos</h2>
      <p>
        Si cambiamos algo importante te avisaremos por correo antes de que se aplique. Si no estás de acuerdo, puedes cancelar
        antes de esa fecha.
      </p>

      <h2>12. Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de {PAIS}. Si tienes un problema, escríbenos primero a{' '}
        <a href={`mailto:${SOPORTE_EMAIL}`}>{SOPORTE_EMAIL}</a>: casi todo se resuelve así. Si vives en otro país, conservas
        los derechos que te da la ley de consumo de ese país y puedes acudir a sus autoridades.
      </p>
    </PaginaLegal>
  );
}
