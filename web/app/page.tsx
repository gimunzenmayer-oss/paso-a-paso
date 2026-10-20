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
import Image from 'next/image';
import { MotionConfig } from 'motion/react';
import { SOPORTE_EMAIL } from '@/lib/marca';

// Modelo 2 (onboarding primero): la mamá prueba antes de pagar. Nunca al pago desde aquí.
const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Probar gratis con mi peque';

function Logo() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <path d="M8 21h5v-5h5v-5h6" fill="none" stroke="var(--surface)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VisualHero() {
  return (
    <div className="flex justify-center bg-[radial-gradient(ellipse_at_50%_30%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_70%)] px-4 py-8">
      <div className="relative aspect-[9/19.5] w-[220px] max-w-full overflow-hidden rounded-[30px] border-[5px] border-[var(--text-primary)] bg-[var(--surface)] shadow-[var(--shadow-2)]">
        {/* Captura real de la app (rutina de la mañana, paso "Despertar") */}
        <Image
          priority
          src="/capturas/rutina.jpg"
          alt="Paso de la rutina de la mañana: foto de un niño despertando, botón ¡Hecho! y lo que viene después"
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
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Hero
        appName="Paso a Paso"
        logo={<Logo />}
        h1Marked="Días predecibles y, en la crisis, [acento]sabrás qué hacer[/acento]"
        subtitleMarked="El [b]Método Antes, Durante y Después[/b], en tu celular y en español."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>Prueba 7 días sin pagar · 30 días de garantía</span>}
        visual={<VisualHero />}
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
          'Más páginas de internet no ayudan: [acento]te lían más[/acento].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Mañanas que empiezan en crisis y noches de culpa.',
          labelFuturo: 'Si nada cambia',
          futuro: 'El mismo día de la marmota, con menos fuerzas.',
        }}
      />

      <Solucion
        tituloMarked="Tu peque sabe qué viene. [acento]Tú, qué hacer.[/acento]"
        mecanismo="el Método Antes, Durante y Después"
        bigIdeaMarked="No te falta paciencia: te falta tener a mano [b]qué viene y qué hacer[/b]."
        pasos={[
          { titulo: 'Antes · Anticipas', detalle: 'Rutinas e historias con fotos reales, listas para usar.' },
          { titulo: 'Durante · Calmas', detalle: 'Respirar, contar y música suave en un toque.' },
          { titulo: 'Después · Cuentas', detalle: 'Anotas en segundos y llevas el informe a la terapeuta.' },
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
          { src: '/capturas/rutina.jpg', alt: 'Paso de la rutina con foto y botón ¡Hecho!', label: 'Cada paso con foto y "¡Hecho!"' },
          { src: '/capturas/siento.jpg', alt: 'Termómetro de emociones: de Necesito ayuda a Estoy tranquilo', label: '"¿Cómo me siento?" cuando no salen las palabras' },
          { src: '/capturas/guia.jpg', alt: 'Guía para familias con la lista de momentos difíciles', label: 'Qué hacer ahora, en 12 momentos difíciles' },
          { src: '/capturas/informe.jpg', alt: 'Informe de seguimiento para imprimir o guardar como PDF', label: 'Su semana, lista para la terapeuta' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      <Oferta
        tituloMarked="Empieza gratis. Luego, [acento]menos de $0.17 al día[/acento]"
        trialDias={7}
        stack={{
          lineas: [
            { resultado: 'Paso a Paso con el Método Antes, Durante y Después (12 meses)', valor: '$96' },
            { resultado: 'Guía «Ahora mismo»: qué hacer en 12 momentos difíciles', valor: '$10' },
            { resultado: 'Rutinas e historias listas: mañana, colegio, noche, médico y más', valor: '$10' },
          ],
          totalTachado: '$116',
          nota: 'Hoy: $4.99/mes (se cobra $59.90 al año)',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'MEJOR VALOR',
          precioMes: '$4.99',
          totalAnual: 'Se cobra $59.90 al año',
          ahorro: '4 meses gratis',
          descomposicionDia: 'menos de $0.17 al día',
          ctaLabel: 'Empezar mis 7 días gratis',
          ctaHref: CTA_HREF,
          features: [
            'Rutinas con fotos reales que puedes cambiar',
            'Kit de calma con música suave',
            'Diario con clave y su informe imprimible',
            'Guía para los momentos difíciles',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$7.99',
          ctaLabel: 'Elegir mensual',
          ctaHref: CTA_HREF,
          features: [
            'Rutinas con fotos reales que puedes cambiar',
            'Kit de calma con música suave',
            'Diario con clave y su informe imprimible',
            'Cancelas cuando quieras',
          ],
        }}
      />

      <Garantia
        nombre="La Garantía del Día Tranquilo"
        condicionMarked="Si en 30 días Paso a Paso no te ayuda a tener [b]un día más predecible[/b], escribes un correo y te devolvemos todo. Sin preguntas."
        pisoLegal="Respaldada por la garantía de Hotmart"
      />

      <Faq
        items={[
          {
            pregunta: '¿Y si no tengo tiempo para armar nada?',
            respuestaMarked: 'Ya trae rutinas e historias listas con fotos. Cambias lo que quieras en [b]un par de minutos[/b].',
          },
          {
            pregunta: 'Ya probé apps y pictos y los dejé. ¿Por qué esta?',
            respuestaMarked: 'Porque no es solo para tu peque: [b]también te acompaña a ti[/b] en la crisis y con la terapeuta.',
          },
          {
            pregunta: 'Hay apps gratis. ¿Qué tiene esta?',
            respuestaMarked: 'Las gratis cubren una parte. Aquí tienes [b]antes, durante y después[/b] en un solo lugar y en español.',
          },
          {
            pregunta: '¿Y los datos de mi hijo?',
            respuestaMarked: 'Se quedan [b]en tu teléfono[/b], con clave. No los vendemos ni los vemos.',
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
        futurePacingMarked="Tu peque mira su día en el celular, toca [b]«¡Hecho!»[/b] y tú tomas el café caliente."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="7 días gratis · Garantía del Día Tranquilo de 30 días"
        psMarked="PS: Paso a Paso junta el [b]Método Antes, Durante y Después[/b] en tu celular. Empiezas con 7 días gratis, la guía «Ahora mismo» y la Garantía del Día Tranquilo."
      />

      <FooterLegal
        appName="Paso a Paso"
        logo={<Logo />}
        soporteEmail={SOPORTE_EMAIL}
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso importante', href: '/aviso' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
    </MotionConfig>
  );
}
