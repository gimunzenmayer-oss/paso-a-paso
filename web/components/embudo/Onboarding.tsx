'use client';

// /onboarding — 6 pasos con barra (4 preguntas, reconocimiento y compromiso),
// "armando el plan" y el resultado con su rutina real. Copy: docs/copy/embudo.md §1.
// Reglas (02B, 50): una pregunta por pantalla · barra siempre visible que nunca
// retrocede (10·25·40·55·70·85, se queda en 85 mientras arma el plan y llega a 100
// con el resultado) · saltar en lo no crítico · avance solo en
// selección única · reducir movimiento = solo fundido.
// Las respuestas se guardan en ESTE teléfono después de cada paso (almacen.ts) y
// nunca salen de él: los eventos llevan solo su nombre y el número de paso.

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Variants } from 'motion/react';
import type { Momento, Respuestas } from '@/lib/embudo/estado';
import { checkoutDe, type Plan } from '@/lib/embudo/checkout';
import { pasoQueRepresenta, rutinaDe } from '@/lib/embudo/rutinas';
import { enviarEvento } from '@/lib/eventos-cliente';
import { actualizar, estadoNuevo, guardar, leerProgreso, ULTIMA_PANTALLA, useProgreso, type Progreso } from './almacen';
import { BarraProgreso } from './BarraProgreso';
import { NombrePeque, PreguntaUnica, PreguntaVarias } from './Pregunta';
import { Reconocimiento } from './Reconocimiento';
import { Compromiso } from './Compromiso';
import { Cargando } from './Cargando';
import { Resultado } from './Resultado';
import {
  CRISIS,
  EDAD,
  idsDeCrisis,
  llenar,
  MOMENTO,
  OPCIONES_CRISIS,
  OPCIONES_EDAD,
  OPCIONES_MOMENTO,
  TOTAL_PASOS,
  variablesDe,
} from './textos';

// Pantallas: 0 nombre · 1 edad · 2 momento · 3 crisis · 4 reconocimiento · 5 compromiso · 6 cargando · 7 resultado.
// En "cargando" la barra sigue en 85: llegar a 100 mientras dice "Armando…" contradice la pantalla.
const PORCENTAJE = [10, 25, 40, 55, 70, 85, 85, 100] as const;
const COMPROMISO = 5;
const CARGANDO = 6;
const RESULTADO = 7;

// 1.3 con la foto de cada rutina (la pregunta que define la rutina la muestra).
const OPCIONES_MOMENTO_CON_FOTO = OPCIONES_MOMENTO.map((o) => ({ ...o, paso: pasoQueRepresenta(o.id) }));

// Links de Hotmart fijados al compilar: el resultado promete la prueba solo si existen.
const CON_CHECKOUT = checkoutDe() !== null;

// Un inicio = un evento, aunque React monte el componente dos veces (modo desarrollo).
let inicioContado = false;

function planDeUrl(): Plan | undefined {
  try {
    const q = new URLSearchParams(window.location.search).get('plan');
    return q === 'anual' || q === 'mensual' ? 'mensual' : undefined;
  } catch {
    return undefined;
  }
}

function conRespuestas(cambio: (r: Respuestas) => Respuestas) {
  actualizar((p) => ({ ...p, respuestas: cambio({ ...p.respuestas }) }));
}

/** El paso n (1..6) de la barra quedó hecho (respondido o saltado). Se cuenta una
 *  sola vez: volver atrás y responder de nuevo no infla el embudo. */
function pasoCompletado(n: number) {
  if ((leerProgreso()?.alcanzado ?? 0) < n) enviarEvento('onboarding_paso_completado', { paso: n });
}

export function Onboarding() {
  const progreso = useProgreso();
  const reduce = useReducedMotion() === true;
  const [direccion, setDireccion] = useState<1 | -1>(1);
  // true después de la primera navegación: desde ahí el foco va al título de cada paso.
  const [navegado, setNavegado] = useState(false);
  // «Cambiar» (junto al chip) desde el compromiso: al elegir, vuelve directo al compromiso.
  const [volverACompromiso, setVolverACompromiso] = useState(false);
  // El momento del último plan que vio en el resultado. Si vuelve al compromiso y no lo
  // cambió, "Sí, la probamos" va directo al resultado: es el mismo plan, no hay nada que armar.
  // null = todavía no llegó al resultado (o aún no se leyó el teléfono).
  const [momentoArmado, setMomentoArmado] = useState<Momento | null>(null);
  if (momentoArmado === null && progreso && progreso.alcanzado >= RESULTADO && progreso.respuestas.momento) {
    setMomentoArmado(progreso.respuestas.momento);
  }

  // Al entrar: crea el estado si no había, guarda ?plan= de la URL y cuenta el inicio.
  const entrada = useRef(false);
  useEffect(() => {
    if (progreso === undefined || entrada.current) return;
    entrada.current = true;
    const base: Progreso = progreso ?? estadoNuevo();
    const plan = planDeUrl() ?? base.plan;
    if (!progreso || plan !== base.plan) guardar({ ...base, ...(plan ? { plan } : {}) });
    if (!progreso && !inicioContado) {
      inicioContado = true;
      enviarEvento('onboarding_iniciado', { paso: 1 });
    }
  }, [progreso]);

  const ir = useCallback((paso: number, dir: 1 | -1 = 1) => {
    setDireccion(dir);
    setNavegado(true);
    actualizar((p) => ({ ...p, paso, alcanzado: Math.max(p.alcanzado, paso) }));
  }, []);

  const planListo = useCallback(() => {
    const actual = leerProgreso();
    // Ya salió de "armando el plan" (atrás durante la carga o la salida animada): no la arrastra al resultado.
    if (actual && actual.paso !== CARGANDO) return;
    if ((actual?.alcanzado ?? 0) < RESULTADO) enviarEvento('onboarding_completado');
    setMomentoArmado(actual?.respuestas.momento ?? null);
    ir(RESULTADO);
  }, [ir]);

  const p = progreso ?? null;
  const paso = p?.paso ?? 0;

  // Atrás en todos los pasos menos el primero. Desde "armando el plan" (corta la espera:
  // sus temporizadores se limpian al desmontar) y desde el resultado vuelve al compromiso,
  // saltando la carga: ahí puede tocar «Cambiar» junto al chip si la rutina no es la que quería.
  const atras = p && paso > 0 ? () => ir(paso === RESULTADO || paso === CARGANDO ? COMPROMISO : paso - 1, -1) : undefined;
  // Ya vio el resultado de ESTE momento: no hay plan nuevo que armar.
  const yaVioEstePlan = !!p && p.alcanzado >= RESULTADO && momentoArmado !== null && momentoArmado === p.respuestas.momento;
  const cerrar = () => {
    if (p && paso < RESULTADO) enviarEvento('onboarding_abandonado', { paso: Math.min(paso + 1, TOTAL_PASOS) });
  };

  const variantes: Variants = {
    entra: (d: 1 | -1) => ({ opacity: 0, x: reduce ? 0 : 40 * d }),
    centro: { opacity: 1, x: 0, transition: { duration: reduce ? 0.2 : 0.3, ease: [0.16, 1, 0.3, 1] } },
    sale: (d: 1 | -1) => ({ opacity: 0, x: reduce ? 0 : -24 * d, transition: { duration: 0.2, ease: 'easeIn' } }),
  };

  let pantalla = null;
  if (p) {
    const r = p.respuestas;
    const v = variablesDe(r);
    const rutina = rutinaDe(r.momento);
    switch (paso) {
      case 0:
        pantalla = (
          <NombrePeque
            inicial={r.nombre}
            pasos={rutina.pasos}
            enfocar={navegado}
            onListo={(nombre) => {
              conRespuestas((x) => ({ ...x, nombre }));
              pasoCompletado(1);
              ir(1);
            }}
            onSaltar={() => {
              conRespuestas((x) => {
                delete x.nombre;
                return x;
              });
              pasoCompletado(1);
              ir(1);
            }}
          />
        );
        break;
      case 1:
        pantalla = (
          <PreguntaUnica
            titulo={llenar(EDAD.titulo, v)}
            opciones={OPCIONES_EDAD}
            elegida={r.edad}
            enfocar={navegado}
            onElegir={(edad) => conRespuestas((x) => ({ ...x, edad }))}
            onAvanzar={() => {
              pasoCompletado(2);
              ir(2);
            }}
          />
        );
        break;
      case 2:
        pantalla = (
          <PreguntaUnica
            titulo={MOMENTO.titulo}
            ayuda={MOMENTO.ayuda}
            opciones={OPCIONES_MOMENTO_CON_FOTO}
            elegida={r.momento}
            enfocar={navegado}
            onElegir={(momento) => conRespuestas((x) => ({ ...x, momento }))}
            onAvanzar={() => {
              pasoCompletado(3);
              if (volverACompromiso) {
                setVolverACompromiso(false);
                ir(COMPROMISO);
              } else ir(3);
            }}
          />
        );
        break;
      case 3:
        pantalla = (
          <PreguntaVarias
            titulo={llenar(CRISIS.titulo, v)}
            ayuda={CRISIS.ayuda}
            opciones={OPCIONES_CRISIS}
            elegidas={idsDeCrisis(r.crisis)}
            boton={CRISIS.boton}
            saltar={CRISIS.saltar}
            pista={CRISIS.pista}
            enfocar={navegado}
            onCambiar={(ids) =>
              conRespuestas((x) => {
                if (ids.length) x.crisis = ids;
                else delete x.crisis;
                return x;
              })
            }
            onSeguir={() => {
              pasoCompletado(4);
              ir(4);
            }}
            onSaltar={() => {
              conRespuestas((x) => {
                delete x.crisis;
                return x;
              });
              pasoCompletado(4);
              ir(4);
            }}
          />
        );
        break;
      case 4:
        pantalla = (
          <Reconocimiento
            v={v}
            pasos={rutina.pasos}
            enfocar={navegado}
            onSeguir={() => {
              pasoCompletado(5);
              ir(COMPROMISO);
            }}
          />
        );
        break;
      case COMPROMISO:
        pantalla = (
          <Compromiso
            v={v}
            pasos={rutina.pasos}
            momentoElegido={OPCIONES_MOMENTO.find((o) => o.id === (r.momento ?? 'manana'))?.label ?? ''}
            esManana={(r.momento ?? 'manana') === 'manana'}
            enfocar={navegado}
            onAceptar={() => {
              pasoCompletado(6);
              // Mismo momento que el plan que ya vio: directo al resultado, sin la carga.
              ir(yaVioEstePlan ? RESULTADO : CARGANDO);
            }}
            onCambiar={() => {
              setVolverACompromiso(true);
              ir(2, -1);
            }}
          />
        );
        break;
      case CARGANDO:
        // rapido: ya llegó a un resultado antes y cambió el momento (la misma secuencia, a 350 ms).
        // inmediato: ya vio ESTE plan (p. ej. recargó la página en la carga): pasa al resultado apenas monta.
        pantalla = (
          <Cargando
            v={v}
            pasos={rutina.pasos}
            rapido={p.alcanzado >= RESULTADO}
            inmediato={yaVioEstePlan}
            enfocar={navegado}
            onListo={planListo}
          />
        );
        break;
      default:
        pantalla = (
          <Resultado
            v={v}
            pasos={rutina.pasos}
            hrefPlan={`/paywall${p.plan ? `?plan=${p.plan}` : ''}`}
            conCheckout={CON_CHECKOUT}
            enfocar={navegado}
          />
        );
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
        {/* overflow-x-clip: la entrada de cada paso (x: 40px) no abre scroll horizontal (igual que
            /paywall). clip, no hidden: no crea un contenedor de scroll, así cabecera y pie siguen sticky. */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-clip px-5">
          <BarraProgreso
            porcentaje={PORCENTAJE[Math.min(p?.alcanzado ?? 0, ULTIMA_PANTALLA)]}
            pasoVisible={paso + 1}
            onAtras={atras}
            onCerrar={cerrar}
          />
          <main className="flex flex-1 flex-col pt-6">
            <AnimatePresence mode="wait" initial={false} custom={direccion}>
              {pantalla && (
                <motion.div
                  key={paso}
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
