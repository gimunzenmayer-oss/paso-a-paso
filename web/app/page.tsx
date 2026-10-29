'use client';

// Página de ventas de Paso a Paso.
// El copy sale de docs/copy/landing.md (trazado a FICHA-AVATAR.md).
// Las 10 secciones van en el orden canónico del kit; solo cambian textos e imágenes.

import { CalendarClock, HeartCrack, NotebookPen, Scissors, Users } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';
import { Medicion } from '@/components/landing/Medicion';
import { Logo } from '@/components/landing/Logo';
import Image from 'next/image';
import { MotionConfig } from 'motion/react';
import { SOPORTE_EMAIL } from '@/lib/marca';

// Modelo 2 (onboarding primero): la mamá prueba antes de pagar. Nunca al pago desde aquí.
const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Probar gratis con mi peque';

function VisualHero() {
  return (
    <div className="flex justify-center bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_16%,transparent),transparent)] px-4 py-8">
      <div className="relative aspect-[9/19.5] w-[220px] max-w-full overflow-hidden rounded-[30px] border-[5px] border-[var(--text-primary)] bg-[var(--surface)] shadow-[var(--shadow-2)]">
        {/* Captura real de la app (un paso de la rutina: la promesa de días predecibles) */}
        <Image
          priority
          src="/capturas/rutina.jpg"
          alt="Paso de la rutina de la mañana con foto y botón ¡Hecho!"
          width={375}
          height={812}
          sizes="220px"
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}

export default function PaginaDeVentas() {
  return (
    <MotionConfig reducedMotion="user">
      <Medicion destinoCta={CTA_HREF} />
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Hero
        appName="Paso a Paso"
        logo={<Logo />}
        // Espacios que no se cortan: "en la crisis" queda en un solo renglón (sin "y, en la" suelto).
        h1Marked={'Rutinas con fotos y [acento]apoyo en\u00a0la\u00a0crisis[/acento]'}
        subtitleMarked={'El [b]Método Antes, Durante y Después[/b]. Una rutina [b]preparada para empezar[/b].'}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>Prueba 7 días sin pagar · cancelas cuando quieras</span>}
        visual={<VisualHero />}
        visualSinMarco
      />

      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: CalendarClock, textoMarked: '¿Las mañanas se tuercen en cuanto [b]algo cambia de orden[/b]?' },
          { icon: HeartCrack, textoMarked: '¿Se desborda y piensas [b]"no sé qué hacer"[/b]?' },
          { icon: Scissors, textoMarked: '¿Pasas horas imprimiendo, recortando y [b]plastificando pictos[/b]?' },
          { icon: NotebookPen, textoMarked: '¿Llegas a la terapia y [b]no recuerdas qué pasó[/b] en la semana?' },
          { icon: Users, textoMarked: '¿Sientes miradas en el parque mientras haces [b]lo mejor que puedes[/b]?' },
        ]}
      />

      <Agitacion
        frases={[
          'Cada semana se van [b]horas[/b] en material que se pierde o se rompe.',
          'Y la culpa queda dando vueltas: [b]"así vivo desde hace años"[/b].',
          'Más páginas de internet no ayudan: [b]te confunden más[/b].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Mañanas que empiezan en crisis y noches de culpa.',
          labelFuturo: 'Si nada cambia',
          futuro: 'El mismo día de la marmota, con menos fuerzas.',
        }}
      />

      <Solucion
        tituloMarked="Anticipa su día. [acento]Acompaña cada paso.[/acento]"
        mecanismo="el Método Antes, Durante y Después"
        bigIdeaMarked="Ten a mano [b]rutinas, recursos de calma y un diario[/b] para acompañar a tu peque."
        pasos={[
          { titulo: 'Antes · Anticipas', foto: '/fotos/despertar.jpg', fotoAlt: 'Niño estirándose al despertar', detalle: 'Rutinas e historias con fotos reales, listas para usar.' },
          { titulo: 'Durante · Acompañas', foto: '/fotos/tranquilo.jpg', fotoAlt: 'Niño tranquilo', detalle: 'Respirar, contar y música suave en un toque.' },
          { titulo: 'Después · Cuentas', foto: '/fotos/mama.jpg', fotoAlt: 'Mamá', detalle: 'Anotas en segundos y llevas el informe a la terapeuta.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Pictos plastificados, cinco apps sueltas y la memoria a medias.',
          labelDespues: 'Con Paso a Paso',
          despues: 'Todo en tu celular: su día, su calma y su historial.',
        }}
      />

      <AppPorDentro
        tituloMarked="Así se ve [acento]su día[/acento] en tu celular"
        frames={[
          { src: '/capturas/espacio.jpg', alt: 'Espacio del niño con botones grandes: Mi día, Hablar, Esperar, Calma, Historias y Mis estrellas', label: 'Su espacio, con su nombre y sus fotos' },
          { src: '/capturas/tablero.jpg', alt: 'Tablero para hablar: botones con fotos como Sí, No, Ayuda, Quiero y Me siento', label: 'Pide lo que necesita con fotos' },
          { src: '/capturas/siento.jpg', alt: 'Termómetro de emociones: de Necesito ayuda a Estoy tranquilo', label: '"¿Cómo me siento?" cuando no salen las palabras' },
          { src: '/capturas/guia.jpg', alt: 'Guía para familias con la lista de momentos difíciles', label: 'Qué hacer ahora, en 12 momentos difíciles' },
          { src: '/capturas/informe.jpg', alt: 'Informe de seguimiento para imprimir o guardar como PDF', label: 'Lo que anotaste, para su próxima consulta' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      <Oferta
        tituloMarked="Prueba gratis. Después, [acento]US$4,99 al mes[/acento]"
        trialDias={7}
        mensual={{
          nombre: 'Plan mensual',
          precioMes: 'US$4,99',
          sufijo: '/mes',
          ctaLabel: 'Empezar mis 7 días gratis',
          ctaHref: CTA_HREF + '?plan=mensual',
          features: [
            'Rutinas con fotos reales que puedes cambiar',
            'Kit de calma con música suave',
            'Diario con clave y su informe imprimible',
            'Guía para los momentos difíciles',
          ],
        }}
      />

      <Garantia
        nombre="7 días para probarla sin pagar"
        condicionMarked="Úsala con tu peque [b]7 días gratis[/b]. Si no es para ustedes, cancelas en Hotmart antes del día 7 y [b]no pagas nada[/b]."
        pisoLegal="Pago y cancelación seguros con Hotmart"
      />

      <Faq
        items={[
          {
            pregunta: '¿Y si no tengo tiempo para armar nada?',
            respuestaMarked: 'Ya trae rutinas e historias listas con fotos. Cambias lo que quieras en [b]un par de minutos[/b].',
          },
          {
            pregunta: 'Ya probé apps y pictos, y hay apps gratis. ¿Por qué esta?',
            respuestaMarked: 'Porque junta [b]antes, durante y después[/b] en un solo lugar, en español, y también te acompaña a ti en la crisis.',
          },
          {
            pregunta: '¿Vale lo que cuesta?',
            respuestaMarked: 'Cuesta [b]US$4,99 al mes[/b], después de 7 días gratis. Si cancelas en Hotmart antes del día 7, no pagas nada.',
          },
          {
            pregunta: '¿Y los datos de mi hijo?',
            respuestaMarked: 'Se quedan [b]en este navegador[/b]. El diario puede protegerse con PIN y cifrado en navegadores compatibles; rutinas y fotos no se cifran.',
          },
          {
            pregunta: '¿Es seguro pagar? ¿Puedo cancelar?',
            respuestaMarked: 'Pagas con Hotmart, con tarjeta o medios locales. [b]Cancelas cuando quieras[/b], sin llamadas.',
          },
          {
            pregunta: '¿Reemplaza a su terapeuta?',
            respuestaMarked: 'No. Es una ayuda para el día a día que [b]complementa[/b] el trabajo de sus profesionales.',
          },
        ]}
      />

      <CtaFinal
        h2Marked="Imagina mañana [acento]a las 7:30[/acento]"
        futurePacingMarked="Puedes mostrarle el primer paso y acompañarle a tocar [b]«¡Hecho!»[/b], a su ritmo."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="7 días gratis · cancelas cuando quieras"
        psMarked="PS: Paso a Paso junta el [b]Método Antes, Durante y Después[/b] en tu celular. Empiezas con 7 días gratis y la guía «Ahora mismo», y si cancelas antes del día 7 no pagas nada."
      />

      <FooterLegal
        appName="Paso a Paso"
        logo={<Logo />}
        soporteEmail={SOPORTE_EMAIL}
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Cómo cancelar', href: '/cancelar' },
          { label: 'Aviso importante', href: '/aviso' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
    </MotionConfig>
  );
}
