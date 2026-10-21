'use client';

// 1.6 Compromiso (02B: pre-compromiso "cuando pase X haré Y"). El momento elegido
// vuelve textual; "Cambiar el momento" regresa a 1.3 sin perder nada.
// Arriba, la tira con las 3 primeras fotos reales de su rutina: se ve QUÉ va a
// probar mañana (el dispositivo propio de la marca, FICHA-ARTE), no un ícono
// genérico. Debajo de la ayuda, sobre el plano hundido, los pasos que no entran en
// la tira ("Y 4 pasos más: …"): la rutina entera a la vista, sin un vacío entre la
// ayuda y el botón. Entrada escalonada a 60 ms (entrada(i)), las fotos una por una.

import { motion } from 'motion/react';
import { pasosConFoto, type PasoRutina } from '@/lib/embudo/rutinas';
import { Ayuda, BotonPrincipal, BotonTexto, entrada, Miniatura, PieFijo, Titulo } from './ui';
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
      <div aria-hidden="true" className="mb-6 flex gap-2">
        {tira.map((p, i) => (
          <motion.span key={p.texto} {...entrada(i)} className="inline-flex">
            <Miniatura paso={p} tamano={72} />
          </motion.span>
        ))}
      </div>
      <motion.div {...entrada(FOTOS_TIRA)}>
        <Titulo texto={llenar(esManana ? COMPROMISO.tituloManana : COMPROMISO.titulo, v)} enfocar={enfocar} />
      </motion.div>
      <motion.div {...entrada(FOTOS_TIRA + 1)}>
        <Ayuda>{llenar(COMPROMISO.ayuda, v)}</Ayuda>
      </motion.div>
      {resto.length > 0 && (
        <motion.p
          {...entrada(FOTOS_TIRA + 2)}
          className="mt-5 mb-6 rounded-[var(--radius-card)] bg-[var(--surface-2)] px-4 py-3 text-[13px] leading-[1.45] text-[var(--text-secondary)]"
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
