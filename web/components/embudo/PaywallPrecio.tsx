'use client';

// 2.3 Página 3 del paywall: precio (50 C1-C5). Anual recomendado y marcado de
// inicio; el total anual siempre visible; el mensual es un precio real. El botón
// va pegado abajo (PieFijo) para que el CTA esté en el primer pliegue a 375px, y
// la verdad del puente (3 líneas con check) queda justo debajo.
//
// Checkout honesto: si faltan los links de Hotmart (o no son válidos) el botón
// queda deshabilitado con el texto del estado honesto de la copy. Nunca un enlace
// roto ni un cobro simulado.
//
// Eventos (contrato 36/60): paywall_visto cuando las tarjetas de precio entran
// ≥35 % a la pantalla (visibilidad real, no montaje); checkout_iniciado al tocar el
// botón, justo antes de salir a Hotmart, con el plan elegido.

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { CheckCustom } from '@/components/landing/ui';
import type { Plan } from '@/lib/embudo/checkout';
import { enviarEvento } from '@/lib/eventos-cliente';
import { Ayuda, BotonPrincipal, EnlacePrincipal, EnlaceTexto, PieFijo, Titulo } from './ui';
import { llenar, PAYWALL_PRECIO, PAYWALL_SIN_CHECKOUT, type Variables, type VariablesPaywall } from './textos';

/** Fracción de las tarjetas que debe verse para contar paywall_visto (36/60: ≥35 %). */
const UMBRAL_VISTO = 0.35;
/** Si después de esto la página sigue a la vista, Hotmart no abrió. */
const ESPERA_HOTMART_MS = 10_000;

// Una exposición = un evento, aunque React monte el componente dos veces (modo desarrollo).
let vistoContado = false;

const ID_AYUDA = 'ayuda-checkout';
const ID_NOTA = 'nota-sin-checkout';

function TarjetaPlan({
  plan,
  elegido,
  onElegir,
}: {
  plan: Plan;
  elegido: boolean;
  onElegir: (p: Plan) => void;
}) {
  const anual = plan === 'anual';
  const t = anual ? PAYWALL_PRECIO.anual : PAYWALL_PRECIO.mensual;
  const [cobro, ahorro] = t.detalle.split(' · ');
  return (
    <label
      className={`relative block cursor-pointer rounded-[var(--radius-card)] [touch-action:manipulation] transition-[border-color,background-color,box-shadow] duration-200 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[var(--accent)] ${
        // El borde de 2px de la elegida se compensa con 1px menos de relleno: el contenido no salta al cambiar.
        elegido
          ? 'border-2 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_7%,var(--surface))] p-[15px] shadow-[0_10px_30px_color-mix(in_oklab,var(--accent)_14%,transparent)]'
          : 'border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]'
      } ${anual ? 'mt-3' : ''}`}
    >
      <input type="radio" name="plan" value={plan} checked={elegido} onChange={() => onElegir(plan)} className="sr-only" />
      {anual && (
        <span className="absolute -top-[11px] left-4 rounded-[8px] bg-[var(--accent)] px-2.5 py-1 text-[12px] font-bold tracking-[0.04em] text-[var(--bg)]">
          {PAYWALL_PRECIO.anual.etiqueta}
        </span>
      )}
      <span className="flex items-start justify-between gap-3">
        <span className="flex min-w-0 flex-col">
          <span className="text-[17px] font-semibold text-[var(--text-primary)]">{t.nombre}</span>
          <span className="mt-1 flex items-baseline gap-0.5">
            <span className="text-[32px] leading-none font-bold text-[var(--text-primary)] tabular-nums [font-family:var(--font-display)]">
              {t.precio}
            </span>
            <span className="text-[15px] text-[var(--text-secondary)]">{t.sufijo}</span>
          </span>
          <span className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">
            {cobro}
            {ahorro && (
              <>
                {' · '}
                <span className={anual ? 'font-bold text-[var(--accent)]' : ''}>{ahorro}</span>
              </>
            )}
          </span>
          {anual && <span className="mt-1 text-[14px] text-[var(--text-secondary)]">{PAYWALL_PRECIO.anual.nota}</span>}
        </span>
        <span
          aria-hidden="true"
          className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
            elegido ? 'border-[var(--accent)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_45%,transparent)]'
          }`}
        >
          {elegido && (
            <motion.span
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="size-3 rounded-full bg-[var(--accent)]"
            />
          )}
        </span>
      </span>
    </label>
  );
}

export function PaywallPrecio({
  v,
  plan,
  onElegir,
  checkout,
  hrefVolver,
  enfocar,
}: {
  v: Variables & VariablesPaywall;
  plan: Plan;
  onElegir: (p: Plan) => void;
  /** Links de Hotmart ya validados (urlCheckout) por plan; null = estado honesto. */
  checkout: Record<Plan, string> | null;
  hrefVolver: string;
  enfocar: boolean;
}) {
  const [abriendo, setAbriendo] = useState(false);
  const [fallo, setFallo] = useState(false);
  const ofertaRef = useRef<HTMLFieldSetElement>(null);
  const planRef = useRef(plan);

  useEffect(() => {
    planRef.current = plan;
  }, [plan]);

  // paywall_visto: visibilidad real de los precios, una vez por visita.
  useEffect(() => {
    const el = ofertaRef.current;
    if (!el || vistoContado) return;
    const io = new IntersectionObserver(
      (entradas) => {
        if (vistoContado || !entradas.some((e) => e.intersectionRatio >= UMBRAL_VISTO)) return;
        vistoContado = true;
        enviarEvento('paywall_visto', { plan: planRef.current });
        io.disconnect();
      },
      { threshold: UMBRAL_VISTO }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // "Abriendo Hotmart…": si la página sigue a la vista después de la espera, Hotmart no abrió.
  useEffect(() => {
    if (!abriendo) return;
    const t = setTimeout(() => {
      if (document.visibilityState === 'visible') {
        setAbriendo(false);
        setFallo(true);
      }
    }, ESPERA_HOTMART_MS);
    const alSalir = () => clearTimeout(t);
    window.addEventListener('pagehide', alSalir);
    return () => {
      clearTimeout(t);
      window.removeEventListener('pagehide', alSalir);
    };
  }, [abriendo]);

  // Volver con "atrás" desde Hotmart restaura la página guardada: el botón vuelve a su texto.
  useEffect(() => {
    const alVolver = (e: PageTransitionEvent) => {
      if (e.persisted) setAbriendo(false);
    };
    window.addEventListener('pageshow', alVolver);
    return () => window.removeEventListener('pageshow', alVolver);
  }, []);

  const abrir = (e: MouseEvent<HTMLAnchorElement>) => {
    if (abriendo) {
      e.preventDefault();
      return;
    }
    enviarEvento('checkout_iniciado', { plan_elegido: plan });
    setFallo(false);
    setAbriendo(true);
  };

  return (
    <div className="flex flex-1 flex-col">
      <Titulo texto={llenar(PAYWALL_PRECIO.titulo, v)} enfocar={enfocar} />
      <Ayuda>{PAYWALL_PRECIO.subtitulo}</Ayuda>

      <fieldset ref={ofertaRef} aria-labelledby="titulo-paso" className="mt-5 flex flex-col gap-3">
        <TarjetaPlan plan="anual" elegido={plan === 'anual'} onElegir={onElegir} />
        <TarjetaPlan plan="mensual" elegido={plan === 'mensual'} onElegir={onElegir} />
      </fieldset>

      <PieFijo>
        {checkout ? (
          <>
            <p id={ID_AYUDA} className="mb-2 text-center text-[15px] leading-snug text-[var(--text-secondary)]">
              {PAYWALL_PRECIO.ayuda}
            </p>
            <EnlacePrincipal href={checkout[plan]} onClick={abrir} ariaDescribedBy={ID_AYUDA} ariaBusy={abriendo}>
              {abriendo ? PAYWALL_PRECIO.abriendo : PAYWALL_PRECIO.boton}
            </EnlacePrincipal>
            <p aria-live="polite" className="text-center text-[15px] leading-snug font-semibold text-[var(--text-primary)]">
              {fallo ? PAYWALL_PRECIO.errorAbrir : ''}
            </p>
          </>
        ) : (
          <>
            <BotonPrincipal disabled ariaDescribedBy={ID_NOTA}>
              {PAYWALL_SIN_CHECKOUT.boton}
            </BotonPrincipal>
            <p id={ID_NOTA} className="mt-2 text-center text-[15px] leading-snug text-[var(--text-secondary)]">
              {PAYWALL_SIN_CHECKOUT.nota}
            </p>
          </>
        )}
      </PieFijo>

      {checkout ? (
        <>
          <ul className="mt-3 flex flex-col gap-2.5">
            {PAYWALL_PRECIO.confianza.map((linea) => (
              <li key={linea} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--text-primary)]">
                <CheckCustom />
                <span>{llenar(linea, v)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-center justify-center gap-2 text-[14px] text-[var(--text-secondary)]">
            <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
            {PAYWALL_PRECIO.pie}
          </p>
          <div className="mt-3 flex flex-col">
            <EnlaceTexto href={hrefVolver}>{PAYWALL_PRECIO.salida}</EnlaceTexto>
            <EnlaceTexto href="/entrar">{PAYWALL_PRECIO.yaPagaste}</EnlaceTexto>
          </div>
        </>
      ) : (
        <div className="mt-3 flex flex-col">
          <EnlaceTexto href="/app/index.html">{PAYWALL_SIN_CHECKOUT.app}</EnlaceTexto>
          <p className="mt-2 text-center text-[15px] leading-snug text-[var(--text-secondary)]">
            {PAYWALL_SIN_CHECKOUT.contacto}{' '}
            <a
              href={`mailto:${PAYWALL_SIN_CHECKOUT.correo}`}
              className="-my-3 inline-block py-3 font-semibold text-[var(--accent)] underline underline-offset-4"
            >
              {PAYWALL_SIN_CHECKOUT.correo}
            </a>
          </p>
          <EnlaceTexto href={hrefVolver}>{PAYWALL_PRECIO.salida}</EnlaceTexto>
        </div>
      )}
    </div>
  );
}
