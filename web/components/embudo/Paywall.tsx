'use client';

// /paywall — 3 páginas: resumen → la prueba día por día → precio (50 C0).
// Copy: docs/copy/embudo.md §2. Mismo sistema que /onboarding: una idea por
// pantalla, foco al título al cambiar de página, reducir movimiento = solo fundido.
//
// Personaliza con lo que dejó el onboarding en ESTE teléfono (pp_onboarding vía
// almacen.ts): nombre, momento y crisis. Si no hay nada, usa los textos genéricos
// ("tu peque"); nunca un error. No escribe en pp_onboarding.
//
// Checkout: NEXT_PUBLIC_HOTMART_CHECKOUT_MENSUAL / _ANUAL (se fijan al compilar)
// pasan por urlCheckout. Si alguno falta o no es un link https de Hotmart, la
// página 3 muestra el estado honesto (botón deshabilitado), nunca un enlace roto.

import { useCallback, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Variants } from 'motion/react';
import { urlCheckout, type Plan } from '@/lib/embudo/checkout';
import { contarRespuestas, fechaCobro } from '@/lib/embudo/prueba';
import { useProgreso } from './almacen';
import { CabeceraPaywall } from './CabeceraPaywall';
import { PaywallResumen } from './PaywallResumen';
import { PaywallPrueba } from './PaywallPrueba';
import { PaywallPrecio } from './PaywallPrecio';
import { variablesDe } from './textos';

const BASES: Record<Plan, string | undefined> = {
  mensual: process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_MENSUAL,
  anual: process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_ANUAL,
};

/** Los dos links listos (con el canal de origen como sck), o null si falta alguno. */
function checkoutCon(sck: string | undefined): Record<Plan, string> | null {
  const mensual = urlCheckout(BASES.mensual, sck);
  const anual = urlCheckout(BASES.anual, sck);
  return mensual && anual ? { mensual, anual } : null;
}

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

export function Paywall() {
  const progreso = useProgreso();
  const fecha = useSyncExternalStore(sinSuscripcion, fechaDeHoy, () => null);
  const origen = useSyncExternalStore(sinSuscripcion, origenGuardado, () => null);
  const planUrl = useSyncExternalStore(sinSuscripcion, planDeUrl, () => null);
  const reduce = useReducedMotion() === true;
  const [pagina, setPagina] = useState(0);
  // true después de la primera navegación: desde ahí el foco va al título de cada página.
  const [navegado, setNavegado] = useState(false);
  const [planElegido, setPlanElegido] = useState<Plan | null>(null);

  const ir = useCallback((n: number) => {
    setNavegado(true);
    setPagina(n);
    window.scrollTo({ top: 0 });
  }, []);

  const respuestas = progreso?.respuestas ?? {};
  const n = contarRespuestas(respuestas);
  // "Hecho con tus {N} respuestas" y "Tu plan ya está en este teléfono" solo son ciertas si hubo onboarding.
  const conPlan = respuestas.momento !== undefined && n >= 2;
  const v = { ...variablesDe(respuestas), N: String(n), fecha_cobro: fecha ?? '' };
  const hrefVolver = progreso ? '/onboarding' : '/';
  const plan: Plan = planElegido ?? planUrl ?? progreso?.plan ?? 'anual';

  // Solo se avanza (no hay "atrás" entre páginas en la copy): la entrada viene siempre de la derecha.
  const variantes: Variants = {
    entra: { opacity: 0, x: reduce ? 0 : 40 },
    centro: { opacity: 1, x: 0, transition: { duration: reduce ? 0.2 : 0.3, ease: [0.16, 1, 0.3, 1] } },
    sale: { opacity: 0, x: reduce ? 0 : -24, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  let pantalla = null;
  if (progreso !== undefined && fecha !== null) {
    if (pagina === 0) {
      pantalla = <PaywallResumen v={v} conPlan={conPlan} hrefVolver={hrefVolver} enfocar={navegado} onSeguir={() => ir(1)} />;
    } else if (pagina === 1) {
      pantalla = <PaywallPrueba v={v} hrefVolver={hrefVolver} enfocar={navegado} onSeguir={() => ir(2)} />;
    } else {
      pantalla = (
        <PaywallPrecio
          v={v}
          plan={plan}
          onElegir={setPlanElegido}
          checkout={checkoutCon(origen ?? undefined)}
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
          <CabeceraPaywall pagina={pagina + 1} hrefVolver={hrefVolver} />
          <main className="flex flex-1 flex-col pt-6">
            <AnimatePresence mode="wait" initial={false}>
              {pantalla && (
                <motion.div
                  key={pagina}
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
