'use client';

// 1.6 Compromiso (02B: pre-compromiso "cuando pase X haré Y"). El momento elegido
// vuelve textual; "Cambiar el momento" regresa a 1.3 sin perder nada.
// Arriba, la tira con las 3 primeras fotos reales de su rutina: se ve QUÉ va a
// probar mañana (el dispositivo propio de la marca, FICHA-ARTE), no un ícono
// genérico. Es la misma TiraDeFotos fluida de 1.5 (plano hundido y check en la
// primera): el dispositivo luce igual en dos pantallas seguidas. Debajo de la
// ayuda, sobre el plano hundido, los pasos que no entran en la tira ("Y 4 pasos
// más: …", a 16px como toda ayuda): la rutina entera a la vista, sin un vacío entre
// la ayuda y el botón. Entrada escalonada a 60 ms (entrada(i)), las fotos una por una.

import { motion } from 'motion/react';
import { pasosConFoto, type PasoRutina } from '@/lib/embudo/rutinas';
import { Ayuda, BotonPrincipal, BotonTexto, entrada, PieFijo, TiraDeFotos, Titulo } from './ui';
import { COMPROMISO, llenar, type Variables } from './textos';

const FOTOS_TIRA = 3;

export function Compromiso({
  v,
  pasos,
  esManana,
  enfocar,
  onAceptar,
  onCambiar,
}: {
  v: Variables;
  pasos: readonly PasoRutina[];
  esManana: boolean;
  enfocar: boolean;
  onAceptar: () => void;
  onCambiar: () => void;
}) {
  const tira = pasosConFoto(pasos, FOTOS_TIRA);
  const resto = pasos.filter((p) => !tira.includes(p));
  return (
    <div className="flex flex-1 flex-col">
      {/* Las mismas fotos que pasosConFoto(pasos, FOTOS_TIRA): `resto` las excluye. */}
      <TiraDeFotos pasos={pasos} tamano="fluida" className="mb-6" />
      <motion.div {...entrada(FOTOS_TIRA)}>
        <Titulo texto={llenar(esManana ? COMPROMISO.tituloManana : COMPROMISO.titulo, v)} enfocar={enfocar} />
      </motion.div>
      <motion.div {...entrada(FOTOS_TIRA + 1)}>
        <Ayuda>{llenar(COMPROMISO.ayuda, v)}</Ayuda>
      </motion.div>
      {resto.length > 0 && (
        <motion.p
          {...entrada(FOTOS_TIRA + 2)}
          className="mt-5 mb-6 rounded-[var(--radius-card)] bg-[var(--surface-2)] px-4 py-3 text-[16px] leading-[1.45] text-pretty text-[var(--text-secondary)]"
        >
          <span className="font-bold text-[var(--text-primary)]">{llenar(COMPROMISO.masPasos, { n: String(resto.length) })}</span>{' '}
          {resto.map((p) => p.texto).join(' · ')}
        </motion.p>
      )}
      <PieFijo>
        <BotonPrincipal onClick={onAceptar}>{COMPROMISO.boton}</BotonPrincipal>
        <BotonTexto onClick={onCambiar}>{COMPROMISO.cambiar}</BotonTexto>
      </PieFijo>
    </div>
  );
}
