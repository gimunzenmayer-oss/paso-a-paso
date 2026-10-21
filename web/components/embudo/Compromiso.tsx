'use client';

// 1.6 Compromiso (02B: pre-compromiso "cuando pase X haré Y"). El momento elegido
// vuelve textual; «Cambiar», junto al chip, regresa a 1.3 sin perder nada.
// Arriba, la tira con las 3 primeras fotos reales de su rutina: se ve QUÉ va a
// probar mañana (el dispositivo propio de la marca, FICHA-ARTE), no un ícono
// genérico. Es la misma TiraDeFotos fluida de 1.5 (plano hundido y check en la
// primera): el dispositivo luce igual en dos pantallas seguidas. Debajo de la
// ayuda, sobre el plano hundido, los pasos que no entran en la tira ("Y 4 pasos
// más: …", a 16px como toda ayuda): la rutina entera a la vista, sin un vacío entre
// la ayuda y el botón. Entrada escalonada a 60 ms (entrada(i)), las fotos una por una.
// Pegado a la ayuda, un chip con el momento que eligió en 1.3 («Elegiste: La mañana»)
// y «Cambiar» al lado: se compromete viendo qué eligió, y cambia desde ahí mismo.
// Es la única salida a 1.3: el pie lleva SOLO el CTA (antes repetía «Cambiar el
// momento» bajo el botón, dos enlaces para una acción). Todo centrado en el alto
// libre (my-auto), como 1.5.

import { motion } from 'motion/react';
import { pasosConFoto, type PasoRutina } from '@/lib/embudo/rutinas';
import { Ayuda, BotonPrincipal, entrada, PieFijo, TiraDeFotos, Titulo } from './ui';
import { COMPROMISO, llenar, type Variables } from './textos';

const FOTOS_TIRA = 3;

export function Compromiso({
  v,
  pasos,
  momentoElegido,
  esManana,
  enfocar,
  onAceptar,
  onCambiar,
}: {
  v: Variables;
  pasos: readonly PasoRutina[];
  /** El label de la opción que eligió en 1.3 ("La mañana", "Irse a dormir"…). */
  momentoElegido: string;
  esManana: boolean;
  enfocar: boolean;
  onAceptar: () => void;
  onCambiar: () => void;
}) {
  const tira = pasosConFoto(pasos, FOTOS_TIRA);
  const resto = pasos.filter((p) => !tira.includes(p));
  return (
    <div className="flex flex-1 flex-col">
      {/* flex-1 toma el alto libre (el mt-auto del pie no compite) y my-auto centra el bloque en él. */}
      <div className="flex flex-1 flex-col">
        <div className="my-auto pb-6">
          {/* Las mismas fotos que pasosConFoto(pasos, FOTOS_TIRA): `resto` las excluye. */}
          <TiraDeFotos pasos={pasos} tamano="fluida" className="mb-6" />
          <motion.div {...entrada(FOTOS_TIRA)}>
            <Titulo texto={llenar(esManana ? COMPROMISO.tituloManana : COMPROMISO.titulo, v)} enfocar={enfocar} />
          </motion.div>
          <motion.div {...entrada(FOTOS_TIRA + 1)}>
            <Ayuda>{llenar(COMPROMISO.ayuda, v)}</Ayuda>
          </motion.div>
          <motion.div {...entrada(FOTOS_TIRA + 2)} className="mt-3 flex flex-wrap items-center gap-x-1">
            <span id="momento-elegido" className="rounded-[var(--radius-button)] bg-[var(--chip-bg)] px-3 py-1.5 text-[16px] leading-snug text-[var(--text-primary)]">
              {COMPROMISO.elegiste} <span className="font-bold">{momentoElegido}</span>
            </span>
            <button
              type="button"
              onClick={onCambiar}
              aria-describedby="momento-elegido"
              className="flex min-h-12 items-center px-3 text-[16px] font-semibold text-[var(--accent)] underline decoration-[color-mix(in_oklab,var(--accent)_45%,transparent)] underline-offset-4 [touch-action:manipulation]"
            >
              {COMPROMISO.cambiarCorto}
            </button>
          </motion.div>
          {resto.length > 0 && (
            <motion.p
              {...entrada(FOTOS_TIRA + 3)}
              className="mt-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] px-4 py-3 text-[16px] leading-[1.45] text-pretty text-[var(--text-secondary)]"
            >
              <span className="font-bold text-[var(--text-primary)]">{llenar(COMPROMISO.masPasos, { n: String(resto.length) })}</span>{' '}
              {resto.map((p) => p.texto).join(' · ')}
            </motion.p>
          )}
        </div>
      </div>
      <PieFijo>
        <BotonPrincipal onClick={onAceptar}>{COMPROMISO.boton}</BotonPrincipal>
      </PieFijo>
    </div>
  );
}
