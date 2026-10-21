'use client';

// /onboarding — 6 pasos con barra (4 preguntas, reconocimiento y compromiso),
// "armando el plan" y el resultado con su rutina real. Copy: docs/copy/embudo.md §1.
// Reglas (02B, 50): una pregunta por pantalla · barra siempre visible que nunca
// retrocede (10·25·40·55·70·85·100) · saltar en lo no crítico · avance solo en
// selección única · reducir movimiento = solo fundido.
// Las respuestas se guardan en ESTE teléfono después de cada paso (almacen.ts) y
// nunca salen de él: los eventos llevan solo su nombre y el número de paso.

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Variants } from 'motion/react';
import type { Respuestas } from '@/lib/embudo/estado';
import type { Plan } from '@/lib/embudo/checkout';
import { rutinaDe } from '@/lib/embudo/rutinas';
import { enviarEvento } from '@/lib/eventos-cliente';
import { actualizar, estadoNuevo, guardar, leerProgreso, ULTIMA_PANTALLA, useProgreso, type Progreso } from './almacen';
import { BarraProgreso } from './BarraProgreso';
import { NombrePeque, PreguntaUnica, PreguntaVarias } from './Pregunta';
import { Reconocimiento } from './Reconocimiento';
import { Compromiso } from './Compromiso';
import { Cargando } from './Cargando';
import { Resultado } from './Resultado';
import { CRISIS, EDAD, llenar, MOMENTO, OPCIONES_CRISIS, OPCIONES_EDAD, OPCIONES_MOMENTO, TOTAL_PASOS, variablesDe } from './textos';

// Pantallas: 0 nombre · 1 edad · 2 momento · 3 crisis · 4 reconocimiento · 5 compromiso · 6 cargando · 7 resultado.
const PORCENTAJE = [10, 25, 40, 55, 70, 85, 100, 100] as const;
const CARGANDO = 6;
const RESULTADO = 7;

// Un inicio = un evento, aunque React monte el componente dos veces (modo desarrollo).
let inicioContado = false;

function planDeUrl(): Plan | undefined {
  try {
    const q = new URLSearchParams(window.location.search).get('plan');
    return q === 'anual' || q === 'mensual' ? q : undefined;
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
  // "Cambiar el momento" desde el compromiso: al elegir, vuelve directo al compromiso.
  const [volverACompromiso, setVolverACompromiso] = useState(false);

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
    if ((leerProgreso()?.alcanzado ?? 0) < RESULTADO) enviarEvento('onboarding_completado');
    ir(RESULTADO);
  }, [ir]);

  const p = progreso ?? null;
  const paso = p?.paso ?? 0;

  const atras = p && paso > 0 && paso < CARGANDO ? () => ir(paso - 1, -1) : undefined;
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
            opciones={OPCIONES_MOMENTO}
            elegida={r.momento}
            enfocar={navegado}
            onElegir={(momento) => conRespuestas((x) => ({ ...x, momento }))}
            onAvanzar={() => {
              pasoCompletado(3);
              if (volverACompromiso) {
                setVolverACompromiso(false);
                ir(5);
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
            elegidas={r.crisis ?? []}
            boton={CRISIS.boton}
            saltar={CRISIS.saltar}
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
            enfocar={navegado}
            onSeguir={() => {
              pasoCompletado(5);
              ir(5);
            }}
          />
        );
        break;
      case 5:
        pantalla = (
          <Compromiso
            v={v}
            esManana={(r.momento ?? 'manana') === 'manana'}
            enfocar={navegado}
            onAceptar={() => {
              pasoCompletado(6);
              ir(CARGANDO);
            }}
            onCambiar={() => {
              setVolverACompromiso(true);
              ir(2, -1);
            }}
          />
        );
        break;
      case CARGANDO:
        pantalla = <Cargando v={v} enfocar={navegado} onListo={planListo} />;
        break;
      default:
        pantalla = (
          <Resultado v={v} pasos={rutina.pasos} hrefPlan={`/paywall${p.plan ? `?plan=${p.plan}` : ''}`} enfocar={navegado} />
        );
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
        <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-5">
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
