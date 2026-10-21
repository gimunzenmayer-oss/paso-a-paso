import type { Metadata } from 'next';
import { PaginaLegal } from '@/components/legal/PaginaLegal';
import { APP, PAIS, RESPONSABLE, SOPORTE_EMAIL } from '@/lib/marca';

export const metadata: Metadata = { title: `Privacidad · ${APP}` };

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad">
      <p>
        {APP} es un servicio de {RESPONSABLE} ({PAIS}). Aquí te contamos qué datos tratamos, para qué y con quién se
        comparten. La idea central es simple: <strong>lo que escribes sobre tu peque se queda en tu teléfono</strong>.
      </p>
      <h2>1. Datos que se quedan solo en tu teléfono</h2>
      <p>
        Las rutinas, fotos, grabaciones de voz, historias, el diario, los logros y el informe se guardan en el almacenamiento
        de tu navegador, en tu propio dispositivo. No los enviamos a ningún servidor y no podemos verlos. El diario se guarda
        cifrado con tu PIN. Si borras la app o los datos del navegador, se pierden: haz copias con la opción de imprimir o
        guardar el informe en PDF.
      </p>
      <h2>2. Datos que sí recogemos</h2>
      <ul>
        <li>Tu correo electrónico y los datos de tu compra, para darte acceso y gestionar la suscripción.</li>
        <li>Datos técnicos mínimos (fecha de acceso, tipo de navegador) para mantener el servicio seguro y funcionando.</li>
        <li>
          Estadísticas de uso <strong>seudónimas</strong>: un número al azar que identifica al teléfono (no tu nombre ni el de tu
          peque), la dirección IP con la que se conecta y qué funciones se usan, por ejemplo “se completó un paso de rutina” o “se
          anotó algo en el diario”. Nunca el contenido: ni nombres, ni fotos, ni lo que escribes en el diario. Nos sirven para saber
          qué mejorar, y puedes apagarlas cuando quieras en Ajustes → “Compartir estadísticas de uso”.
        </li>
        <li>Si la app falla, el mensaje técnico del error y la pantalla donde ocurrió, para poder arreglarlo.</li>
      </ul>
      <p>No recogemos el nombre, la edad ni el diagnóstico de tu peque fuera de tu teléfono.</p>
      <h2>3. Con quién se comparten (proveedores)</h2>
      <ul>
        <li><strong>Hotmart</strong>: procesa el pago y la suscripción.</li>
        <li><strong>Supabase</strong>: guarda tu cuenta (correo y estado de la suscripción).</li>
        <li><strong>Vercel</strong>: aloja la página y la app.</li>
        <li><strong>Resend</strong>: envía los correos de acceso y avisos de la suscripción.</li>
      </ul>
      <p>
        Algunos de estos proveedores están fuera de tu país, por lo que tus datos de cuenta pueden transferirse
        internacionalmente con las garantías que ellos ofrecen. No vendemos tus datos ni los usamos para publicidad.
      </p>
      <h2>4. Cuánto tiempo los guardamos</h2>
      <p>Mientras tengas cuenta. Si la eliminas, borramos tu correo y datos de cuenta, salvo lo que la ley obligue a conservar sobre los pagos.</p>
      <h2>5. Tus derechos</h2>
      <p>
        Puedes pedir acceder, corregir o eliminar tus datos escribiendo a <a href={`mailto:${SOPORTE_EMAIL}`}>{SOPORTE_EMAIL}</a>.
        Te respondemos en un plazo máximo de 15 días.
      </p>
      <h2>6. Menores</h2>
      <p>
        La cuenta la crea y la usa una persona adulta responsable del menor. Las fotos y datos del niño o la niña que
        añadas se quedan en tu dispositivo.
      </p>
      <h2>7. Cambios</h2>
      <p>Si cambiamos algo importante de esta política, te avisaremos por correo antes de que se aplique.</p>
    </PaginaLegal>
  );
}
