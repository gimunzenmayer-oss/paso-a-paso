'use client';

// 2.3 Página 3 del paywall: precio (50 C1-C5).
// Orden: título, subtítulo y las 2 tarjetas de precio enseguida, para que la
// elegida (también la mensual, y también con el error en el pie) se vea entera en
// el primer pliegue a 375px. La tira con 3 fotos de SU rutina (el dispositivo de
// FICHA-ARTE) NO va entre el subtítulo y las tarjetas: sus ≈56px empujaban la
// mensual elegida 27px bajo el pie (59px sin nombre y con el error; medido a
// 375×812). Va debajo de las tarjetas con mt-8, y después los 4 chips de
// "Incluye" con el check del embudo; la etiqueta "Incluye:" va en
// --text-secondary (el acento queda para el CTA, la palabra que vende y el check).
// Tarjetas, tira, etiqueta y cada chip entran escalonados (entrada(i), 60 ms).
// Anual recomendado y marcado de inicio; el total anual siempre
// visible; el mensual es un precio real. La tarjeta elegida es la más elevada
// (superficie, borde de acento y sombra tintada); la otra queda plana.
// El pie fijo es corto a propósito (≈130px): SOLO el botón y una línea de garantía
// (con el único escudo de la página), para que la tarjeta elegida se vea entera
// encima. Si Hotmart no abre, el error REEMPLAZA a esa línea (no se suma). En el
// flujo, debajo: la condición de la garantía (sin ícono ni nombre: el pie ya los
// dice), la ayuda de Hotmart, la verdad del puente (2 líneas con check) y "Pago
// seguro" con un candado, no otro escudo.
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
import { CircleAlert, Info, LoaderCircle, Lock, ShieldCheck } from 'lucide-react';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import type { Plan } from '@/lib/embudo/checkout';
import { pasosConFoto, type PasoRutina } from '@/lib/embudo/rutinas';
import { enviarEvento } from '@/lib/eventos-cliente';
import { Ayuda, BotonPrincipal, CheckQueSeLlena, EnlacePrincipal, EnlaceTexto, entrada, Miniatura, PieFijo, Titulo } from './ui';
import { llenar, PAYWALL_PRECIO, PAYWALL_SIN_CHECKOUT, type Variables, type VariablesPaywall } from './textos';

/** Fracción de las tarjetas que debe verse para contar paywall_visto (36/60: ≥35 %). */
const UMBRAL_VISTO = 0.35;
/** Si después de esto la página sigue a la vista, Hotmart no abrió (6 s: más es esperar a ciegas). */
const ESPERA_HOTMART_MS = 6_000;

// Una exposición = un evento, aunque React monte el componente dos veces (modo desarrollo).
let vistoContado = false;

const ID_AYUDA = 'ayuda-checkout';
const ID_NOTA = 'nota-sin-checkout';
const ID_INCLUYE = 'incluye-plan';

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
        // La elegida "sube": superficie, borde de acento y sombra tintada. La otra queda
        // plana, a medio camino entre la superficie y el fondo, sin sombra. El borde de
        // 2px de la elegida se compensa con 1px menos de relleno: el contenido no salta.
        elegido
          ? `border-2 border-[var(--accent)] bg-[var(--surface)] px-[15px] pb-[15px] shadow-[0_14px_32px_-10px_color-mix(in_oklab,var(--accent)_45%,transparent)] ${anual ? 'pt-[27px]' : 'pt-[15px]'}`
          : `border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[color-mix(in_oklab,var(--surface)_50%,var(--bg))] px-4 pb-4 ${anual ? 'pt-7' : 'pt-4'}`
      } ${anual ? 'mt-3' : ''}`}
    >
      <input type="radio" name="plan" value={plan} checked={elegido} onChange={() => onElegir(plan)} className="sr-only" />
      {anual && (
        <span className="absolute -top-3 left-4 rounded-[8px] bg-[var(--accent)] px-2.5 py-1 text-[13px] leading-4 font-bold tracking-[0.04em] text-[var(--bg)]">
          {PAYWALL_PRECIO.anual.etiqueta}
        </span>
      )}
      <span className="flex items-start justify-between gap-3">
        <span className="flex min-w-0 flex-col">
          <span className="text-[18px] font-semibold text-[var(--text-primary)]">{t.nombre}</span>
          <span className="mt-1 flex items-baseline gap-0.5">
            <span className="text-[32px] leading-none font-bold text-[var(--text-primary)] tabular-nums [font-family:var(--font-display)]">
              {t.precio}
            </span>
            <span className="text-[16px] text-[var(--text-secondary)]">{t.sufijo}</span>
          </span>
          <span className="mt-2 text-[16px] leading-snug text-[var(--text-secondary)]">
            {cobro}
            {ahorro && (
              <>
                {' · '}
                <span className={`whitespace-nowrap ${anual ? 'font-bold text-[var(--accent)]' : ''}`}>{ahorro}</span>
              </>
            )}
          </span>
          {anual && <span className="mt-1 text-[16px] text-[var(--text-secondary)]">{PAYWALL_PRECIO.anual.nota}</span>}
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
  pasos,
  plan,
  onElegir,
  checkout,
  hrefVolver,
  enfocar,
}: {
  v: Variables & VariablesPaywall;
  /** Los pasos de su rutina (rutinaDe(momento)). */
  pasos: readonly PasoRutina[];
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
      <Ayuda>{llenar(PAYWALL_PRECIO.subtitulo, v)}</Ayuda>

      <fieldset ref={ofertaRef} aria-labelledby="titulo-paso" className="mt-4 flex flex-col gap-3">
        <motion.div {...entrada(0)}>
          <TarjetaPlan plan="anual" elegido={plan === 'anual'} onElegir={onElegir} />
        </motion.div>
        <motion.div {...entrada(1)}>
          <TarjetaPlan plan="mensual" elegido={plan === 'mensual'} onElegir={onElegir} />
        </motion.div>
      </fieldset>

      {/* Su rutina ya armada: 3 fotos de 40 (decorativas; el texto la nombra). Va DEBAJO de las tarjetas, con
          mt-8: entre el subtítulo y las tarjetas empujaba la mensual elegida bajo el pie (ver arriba). */}
      <motion.div {...entrada(2)} className="mt-8 flex items-center gap-3">
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          {pasosConFoto(pasos, 3).map((paso) => (
            <Miniatura key={paso.texto} paso={paso} tamano={40} />
          ))}
        </span>
        <p className="min-w-0 text-[16px] leading-snug font-semibold text-pretty text-[var(--text-primary)]">
          {llenar(PAYWALL_PRECIO.rutinaLista, v)}
        </p>
      </motion.div>

      {/* Qué incluye: chips con el check del embudo (ancla de conversión: chips en toda lista de beneficios). */}
      <div className="mt-4">
        <motion.p
          {...entrada(3)}
          id={ID_INCLUYE}
          className="text-[13px] leading-tight font-bold tracking-[0.06em] text-[var(--text-secondary)] uppercase"
        >
          {PAYWALL_PRECIO.incluyeTitulo}
        </motion.p>
        <ul aria-labelledby={ID_INCLUYE} className="mt-2 flex flex-wrap gap-2">
          {PAYWALL_PRECIO.incluye.map((item, i) => (
            <motion.li
              key={item}
              {...entrada(4 + i)}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] bg-[var(--chip-bg)] py-1 pr-2.5 pl-1.5 text-[16px] leading-snug text-[var(--text-primary)]"
            >
              <CheckQueSeLlena tamano={16} />
              <span className="whitespace-nowrap">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <PieFijo>
        {checkout ? (
          <>
            <EnlacePrincipal href={checkout[plan]} onClick={abrir} ariaDescribedBy={ID_AYUDA} ariaBusy={abriendo}>
              {abriendo ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle size={18} strokeWidth={2.5} aria-hidden="true" className="shrink-0 motion-safe:animate-spin" />
                  {PAYWALL_PRECIO.abriendo}
                </span>
              ) : (
                PAYWALL_PRECIO.boton
              )}
            </EnlacePrincipal>
            {/* Una sola línea bajo el botón: la garantía, o el error que la reemplaza. */}
            <p aria-live="polite" className="mt-2 flex items-start justify-center gap-2 text-center text-[16px] leading-snug">
              {fallo ? (
                <>
                  <CircleAlert size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--error)]" />
                  <span className="text-[var(--error)]">{PAYWALL_PRECIO.errorAbrir}</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} strokeWidth={2} color="var(--accent)" aria-hidden="true" className="mt-0.5 shrink-0" />
                  <span className="text-[var(--text-primary)]">
                    <MarkedCopy text={PAYWALL_PRECIO.garantiaCorta} />
                  </span>
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <BotonPrincipal disabled ariaDescribedBy={ID_NOTA}>
              {PAYWALL_SIN_CHECKOUT.boton}
            </BotonPrincipal>
            <p id={ID_NOTA} className="mt-2 text-center text-[16px] leading-snug text-[var(--text-secondary)]">
              {PAYWALL_SIN_CHECKOUT.nota}
            </p>
          </>
        )}
      </PieFijo>

      {checkout ? (
        <>
          {/* Lo que el pie ya no carga: la condición de la garantía (sin ícono ni nombre: el pie
              los lleva) y la ayuda de Hotmart. */}
          <p className="mt-3 text-[16px] leading-snug text-pretty text-[var(--text-primary)]">{PAYWALL_PRECIO.garantia}</p>
          <p id={ID_AYUDA} className="mt-3 flex items-start gap-2 text-[16px] leading-snug text-[var(--text-secondary)]">
            <Info size={20} strokeWidth={2} color="var(--accent-2)" aria-hidden="true" className="mt-px shrink-0" />
            <span>{PAYWALL_PRECIO.ayuda}</span>
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {PAYWALL_PRECIO.confianza.map((linea) => (
              <li key={linea} className="flex items-start gap-3 text-[16px] leading-snug text-[var(--text-primary)]">
                <CheckQueSeLlena tamano={24} />
                <span>{llenar(linea, v)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-start justify-center gap-2 text-center text-[16px] leading-snug text-[var(--text-secondary)]">
            <Lock size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
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
          <p className="mt-2 text-center text-[16px] leading-snug text-[var(--text-secondary)]">
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
