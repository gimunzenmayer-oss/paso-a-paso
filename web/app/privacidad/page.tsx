import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaLegal } from '@/components/legal/PaginaLegal';
import { APP, EDAD_MINIMA, PAIS, RESPONSABLE, RESPONSABLE_LEGAL, SOPORTE_EMAIL } from '@/lib/marca';

export const metadata: Metadata = { title: `Privacidad · ${APP}` };

// Describe lo que hace el código de verdad (auditoría legal 2026-10-24):
// datos del peque solo en IndexedDB/localStorage del teléfono; en Supabase (São Paulo)
// solo cuenta, compra, eventos seudónimos y errores; sin IA, sin píxeles ni cookies de terceros.
export default function Privacidad() {
  const correo = <a href={`mailto:${SOPORTE_EMAIL}`}>{SOPORTE_EMAIL}</a>;
  return (
    <PaginaLegal titulo="Política de privacidad">
      <p>
        Aquí te contamos, sin letra chica, qué datos tratamos, para qué y con quién se comparten. La idea central es
        simple: <strong>lo que escribes sobre tu peque se queda en tu teléfono</strong>. Nosotros no lo vemos.
      </p>

      <h2>1. Quién es responsable</h2>
      <p>
        {APP} es un servicio de {RESPONSABLE_LEGAL}
        {RESPONSABLE_LEGAL !== RESPONSABLE ? ` («${RESPONSABLE}»)` : ''}, con base en {PAIS}. Para cualquier tema de datos
        personales escríbenos a {correo}.
      </p>

      <h2>2. Lo que se queda solo en tu teléfono</h2>
      <p>
        El nombre y la edad de tu peque, las rutinas, las fotos, las grabaciones de voz, las historias, el tablero, el
        diario de crisis, los logros y el informe se guardan en el almacenamiento de tu navegador, en tu propio
        dispositivo. <strong>No los enviamos a ningún servidor y no podemos verlos.</strong> El diario va cifrado con tu PIN.
      </p>
      <p>
        Las respuestas que das en el cuestionario inicial (nombre o apodo de tu peque, su edad y cómo son sus crisis) también
        se quedan en tu teléfono: se usan para armar su primera rutina y no salen de ahí.
      </p>
      <p>
        Como no tenemos copia, si borras la app o los datos del navegador, esa información se pierde. Para conservar algo,
        guarda o imprime el informe en PDF.
      </p>

      <h2>3. Los datos que sí recibimos</h2>
      <ul>
        <li>
          <strong>Tu cuenta y tu compra:</strong> el correo y el nombre con que compraste en Hotmart, el plan, el estado de
          la suscripción (prueba, activa, cancelada, reembolsada), las fechas y los importes. Sirven para darte acceso y
          llevar las cuentas del negocio. Nunca vemos ni guardamos tu tarjeta: eso lo maneja Hotmart.
        </li>
        <li>
          <strong>Estadísticas de uso seudónimas:</strong> un número al azar que identifica al teléfono (no a ti ni a tu
          peque) y qué funciones se usan, por ejemplo «se completó un paso de rutina», «se anotó algo en el diario» o «se
          vio la página de precios». Nunca el contenido: ni nombres, ni fotos, ni lo que escribes. Nos sirven para saber qué
          mejorar. Puedes apagarlas cuando quieras en la app, en Ajustes → «Compartir estadísticas de uso».
        </li>
        <li>
          <strong>Errores:</strong> si la app falla, el mensaje técnico del error, la pantalla donde ocurrió y el mismo número
          al azar del teléfono, para poder arreglarlo.
        </li>
        <li>
          <strong>Datos técnicos de conexión:</strong> como cualquier sitio web, nuestro proveedor de alojamiento registra la
          dirección IP y el tipo de navegador por poco tiempo, para seguridad y para frenar abusos. No los usamos para
          identificarte.
        </li>
      </ul>
      <p>No usamos inteligencia artificial: ningún dato tuyo se envía a servicios de IA.</p>

      <h2>4. Para qué los usamos y con qué base</h2>
      <ul>
        <li>Darte acceso a la app y gestionar tu suscripción: porque es necesario para darte el servicio que contrataste.</li>
        <li>Enviarte correos de acceso (códigos para entrar) y avisos sobre tu suscripción: misma razón.</li>
        <li>Llevar la contabilidad y cumplir obligaciones legales sobre los pagos: porque la ley lo exige.</li>
        <li>Mejorar la app con estadísticas seudónimas y registros de errores: por nuestro interés en que funcione bien, y siempre puedes apagarlas.</li>
      </ul>
      <p>No vendemos tus datos, no los usamos para publicidad y no los cruzamos con otras empresas.</p>

      <h2>5. Con quién se comparten (proveedores)</h2>
      <p>Solo con los servicios que necesitamos para funcionar. Cada uno trata los datos bajo sus propias condiciones de seguridad:</p>
      <ul>
        <li><strong>Hotmart</strong> (Brasil y Países Bajos): procesa el pago, la suscripción y los reembolsos. Para el pago, Hotmart es responsable de tus datos según su propia política.</li>
        <li><strong>Supabase</strong> (servidores en São Paulo, Brasil): guarda tu cuenta, el estado de la suscripción, las estadísticas seudónimas y los errores, y envía los códigos para entrar.</li>
        <li><strong>Vercel</strong> (Estados Unidos): aloja la página y la app.</li>
        <li><strong>Resend</strong> (Estados Unidos): envía los correos de la suscripción cuando el servicio de correo esté activo.</li>
      </ul>

      <h2>6. Transferencia a otros países</h2>
      <p>
        Como ves arriba, tus datos de cuenta pueden viajar y guardarse fuera de {PAIS}, en Brasil y en Estados Unidos. Al
        usar {APP} aceptas esa transferencia, que se hace con proveedores que ofrecen garantías de seguridad para los datos
        personales. Los datos de tu peque no viajan: se quedan en tu teléfono.
      </p>

      <h2>7. Cuánto tiempo los guardamos</h2>
      <ul>
        <li>Cuenta y suscripción: mientras tengas cuenta. Si la eliminas, borramos tu correo y tus datos de cuenta.</li>
        <li>Registros de pagos: el tiempo que la ley tributaria obliga a conservarlos, sin usarlos para nada más.</li>
        <li>Estadísticas seudónimas y errores: hasta 24 meses; después se borran.</li>
      </ul>

      <h2>8. Cookies y almacenamiento en tu teléfono</h2>
      <p>
        No usamos cookies de publicidad ni píxeles de redes sociales, y no compartimos lo que haces con terceros. Usamos:
      </p>
      <ul>
        <li><strong>Necesarias:</strong> la cookie de sesión que te mantiene dentro de tu cuenta y el almacenamiento donde la app guarda tus datos en el teléfono. Sin ellas la app no funciona.</li>
        <li><strong>Estadísticas propias:</strong> el número al azar del teléfono del punto 3. Se apagan en Ajustes → «Compartir estadísticas de uso».</li>
      </ul>
      <p>Si algún día sumamos cookies de terceros, te pediremos permiso antes, con «Aceptar» y «Rechazar» igual de fáciles.</p>

      <h2>9. Tus derechos</h2>
      <p>
        Puedes pedir en cualquier momento <strong>ver, corregir, llevarte o eliminar</strong> tus datos, u oponerte a que los
        usemos para estadísticas. Escríbenos a {correo} desde el correo de tu compra y te respondemos en un plazo máximo de
        15 días. Para eliminar tu cuenta basta con decírnoslo así: la borramos y te confirmamos por correo. Antes, cancela la
        suscripción en Hotmart para que no se te siga cobrando (<Link href="/cancelar">cómo cancelar</Link>).
      </p>
      <p>
        Los datos que están solo en tu teléfono se borran desde ahí: en la app, Ajustes → «Volver a los datos de ejemplo», o
        borrando los datos del sitio en tu navegador.
      </p>
      <p>
        Si crees que no respetamos tus derechos, también puedes reclamar ante la autoridad de protección de datos de tu país.
      </p>

      <h2>10. Menores de edad</h2>
      <p>
        La cuenta la crea y la usa una persona adulta (mayor de {EDAD_MINIMA} años) responsable del niño o la niña. Los datos
        de tu peque, incluido el diario, que puede hablar de su salud, se quedan en tu dispositivo y no los recibimos. El
        «Espacio del peque» de la app está protegido con tu PIN.
      </p>

      <h2>11. Seguridad</h2>
      <p>
        Usamos conexiones cifradas, acceso a la cuenta con código de un solo uso, permisos que impiden que una cuenta vea los
        datos de otra, y el diario cifrado con tu PIN en el teléfono. Ningún sistema es perfecto: si pasara algo que afecte tus
        datos, te avisaremos.
      </p>

      <h2>12. Cambios en esta política</h2>
      <p>
        Arriba ves la fecha y la versión. Si cambiamos algo importante, te avisaremos por correo antes de que se aplique.
      </p>
    </PaginaLegal>
  );
}
