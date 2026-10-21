'use client';

// /paywall — 3 páginas: resumen → la prueba día por día → precio (50 C0).
// Copy: docs/copy/embudo.md §2. Mismo sistema que /onboarding: una idea por
// pantalla, foco al título al cambiar de página, reducir movimiento = solo fundido.
//
// Personaliza con lo que dejó el onboarding en ESTE teléfono (pp_onboarding vía
// almacen.ts): nombre, momento y crisis ("tu peque" si saltó el nombre). Si no hay
// onboarding válido (sin momento no se armó ningún plan), lleva a /onboarding: el
// paywall nunca afirma un plan que no existe. No escribe en pp_onboarding.
//
// Historial: cada página es una entrada del navegador (?p=2, ?p=3 con
// history.pushState, que Next integra con su router). El atrás del sistema y el
// botón "Atrás" de la cabecera vuelven a la página anterior, no fuera del paywall;
// en la página 1, "‹ Atrás" vuelve a /onboarding (su resultado).
//
// Checkout: NEXT_PUBLIC_HOTMART_CHECKOUT_MENSUAL / _ANUAL (se fijan al compilar)
// pasan por checkoutDe (lib/embudo/checkout.ts). Si alguno falta o no es un link https de Hotmart, la
// página 3 muestra el estado honesto (botón deshabilitado), nunca un enlace roto.

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Variants } from 'motion/react';
import { checkoutDe, type Plan } from '@/lib/embudo/checkout';
import { contarRespuestas, fechaCobro } from '@/lib/embudo/prueba';
import { rutinaDe } from '@/lib/embudo/rutinas';
import { useProgreso } from './almacen';
import { CabeceraPaywall } from './CabeceraPaywall';
import { PaywallResumen } from './PaywallResumen';
import { PaywallPrueba } from './PaywallPrueba';
import { PaywallPrecio } from './PaywallPrecio';
import { PAYWALL_PRUEBA, TOTAL_PAGINAS_PAYWALL, variablesDe } from './textos';

/* Lecturas del teléfono que no cambian mientras la página está abierta. En el
   servidor (y al hidratar) valen null: la página se pinta cuando ya se conocen. */
const sinSuscripcion = () => () => {};

function fechaDeHoy(): string {
  return fechaCobro(new Date());
}

function origenGuardado(): string | null {
  try {
    return localStorage.getItem('pp_origen');
  } catch {
    return null;
  }
}

function planDeUrl(): Plan | null {
  const q = new URLSearchParams(window.location.search).get('plan');
  return q === 'anual' || q === 'mensual' ? q : null;
}

/* La página abierta vive en la URL (?p=2, ?p=3; sin ?p = la 1). Cambia con
   pushState (ir) y con el atrás/adelante del navegador (popstate). */
const PARAM_PAGINA = 'p';
const oyentesPagina = new Set<() => void>();

function suscribirPagina(avisar: () => void): () => void {
  oyentesPagina.add(avisar);
  window.addEventListener('popstate', avisar);
  return () => {
    oyentesPagina.delete(avisar);
    window.removeEventListener('popstate', avisar);
  };
}

/** 0..2 según ?p=; cualquier otro valor es la página 1. */
function paginaDeUrl(): number {
  const n = Number(new URLSearchParams(window.location.search).get(PARAM_PAGINA));
  return Number.isInteger(n) && n >= 2 && n <= TOTAL_PAGINAS_PAYWALL ? n - 1 : 0;
}

/** Marca de las entradas que agregó el paywall: desde ellas, "Atrás" es history.back(). */
function entradaPropia(): boolean {
  const estado: unknown = window.history.state;
  return typeof estado === 'object' && estado !== null && 'paywall' in estado;
}

/** Nueva entrada del historial con la página n (conserva ?plan= y lo demás). */
function empujarPagina(n: number): void {
  const url = new URL(window.location.href);
  if (n === 0) url.searchParams.delete(PARAM_PAGINA);
  else url.searchParams.set(PARAM_PAGINA, String(n + 1));
  window.history.pushState({ paywall: n }, '', url);
  for (const avisar of oyentesPagina) avisar();
}

export function Paywall() {
  const progreso = useProgreso();
  const fecha = useSyncExternalStore(sinSuscripcion, fechaDeHoy, () => null);
  const origen = useSyncExternalStore(sinSuscripcion, origenGuardado, () => null);
  const planUrl = useSyncExternalStore(sinSuscripcion, planDeUrl, () => null);
  const pagina = useSyncExternalStore(suscribirPagina, paginaDeUrl, () => 0);
  const reduce = useReducedMotion() === true;
  const router = useRouter();
  // Al cambiar de página: hacia dónde se movió (anima la entrada desde ese lado) y,
  // desde la primera navegación, el foco va al título de cada página.
  const [anterior, setAnterior] = useState(pagina);
  const [direccion, setDireccion] = useState<1 | -1>(1);
  const [navegado, setNavegado] = useState(false);
  if (anterior !== pagina) {
    setAnterior(pagina);
    setDireccion(pagina > anterior ? 1 : -1);
    setNavegado(true);
  }
  const [planElegido, setPlanElegido] = useState<Plan | null>(null);

  const ir = useCallback((n: number) => empujarPagina(n), []);
  // "Atrás" de la cabecera = el atrás del navegador, si la entrada es nuestra. Si se
  // llegó directo a ?p=3 (enlace o pestaña nueva), atrás sería salir: se abre la anterior.
  const atras = useCallback(() => {
    if (entradaPropia()) window.history.back();
    else empujarPagina(Math.max(0, paginaDeUrl() - 1));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pagina]);

  // Sin momento no hay plan que resumir ni precio que justificar: a armarlo primero.
  const sinPlan = progreso === null || (progreso !== undefined && progreso.respuestas.momento === undefined);
  useEffect(() => {
    if (sinPlan) router.replace('/onboarding');
  }, [sinPlan, router]);

  const respuestas = progreso?.respuestas ?? {};
  const nRespuestas = contarRespuestas(respuestas);
  const plan: Plan = planElegido ?? planUrl ?? progreso?.plan ?? 'anual';
  const v = {
    ...variablesDe(respuestas),
    N: String(nRespuestas),
    fecha_cobro: fecha ?? '',
    monto: PAYWALL_PRUEBA.monto[plan],
  };
  const hrefVolver = '/onboarding';

  // La página entra desde el lado hacia el que se avanza (derecha) o se vuelve (izquierda).
  const variantes: Variants = {
    entra: (d: 1 | -1) => ({ opacity: 0, x: reduce ? 0 : 40 * d }),
    centro: { opacity: 1, x: 0, transition: { duration: reduce ? 0.2 : 0.3, ease: [0.16, 1, 0.3, 1] } },
    sale: (d: 1 | -1) => ({ opacity: 0, x: reduce ? 0 : -24 * d, transition: { duration: 0.2, ease: 'easeIn' } }),
  };

  const pasos = rutinaDe(respuestas.momento).pasos;
  let pantalla = null;
  if (progreso && !sinPlan && fecha !== null) {
    if (pagina === 0) {
      pantalla = (
        <PaywallResumen v={v} pasos={pasos} respuestas={nRespuestas} hrefVolver={hrefVolver} enfocar={navegado} onSeguir={() => ir(1)} />
      );
    } else if (pagina === 1) {
      pantalla = <PaywallPrueba v={v} pasos={pasos} hrefVolver={hrefVolver} enfocar={navegado} onSeguir={() => ir(2)} />;
    } else {
      pantalla = (
        <PaywallPrecio
          v={v}
          pasos={pasos}
          plan={plan}
          onElegir={setPlanElegido}
          checkout={checkoutDe(origen ?? undefined)}
          hrefVolver={hrefVolver}
          enfocar={navegado}
        />
      );
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
        {/* overflow-x-clip: la entrada de cada página (x: 40px) no abre scroll horizontal. clip, no
            hidden: no crea un contenedor de scroll, así la cabecera y el pie siguen pegados (sticky). */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-clip px-5">
          {/* Página 1: sin onAtras, "‹ Atrás" es un enlace a hrefVolver (/onboarding, su resultado). */}
          <CabeceraPaywall pagina={pagina + 1} hrefVolver={hrefVolver} onAtras={pagina > 0 ? atras : undefined} />
          <main className="flex flex-1 flex-col pt-6">
            <AnimatePresence mode="wait" initial={false} custom={direccion}>
              {pantalla && (
                <motion.div
                  key={pagina}
                  custom={direccion}
                  variants={variantes}
                  initial="entra"
                  animate="centro"
                  exit="sale"
                  className="flex flex-1 flex-col"
                >
                  {pantalla}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
