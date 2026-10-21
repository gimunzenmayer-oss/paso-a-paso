'use client';

// 1.6 Compromiso (02B: pre-compromiso "cuando pase X haré Y"). El momento elegido
// vuelve textual; "Cambiar el momento" regresa a 1.3 sin perder nada.
// Arriba, la tira con las 3 primeras fotos reales de su rutina: se ve QUÉ va a
// probar mañana (el dispositivo propio de la marca, FICHA-ARTE), no un ícono genérico.

import type { PasoRutina } from '@/lib/embudo/rutinas';
import { Ayuda, BotonPrincipal, BotonTexto, Miniatura, PieFijo, Titulo } from './ui';
import { COMPROMISO, llenar, type Variables } from './textos';

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
  return (
    <div className="flex flex-1 flex-col">
      <div aria-hidden="true" className="mb-6 flex gap-2">
        {pasos.slice(0, 3).map((p) => (
          <Miniatura key={p.texto} paso={p} tamano={72} />
        ))}
      </div>
      <Titulo texto={llenar(esManana ? COMPROMISO.tituloManana : COMPROMISO.titulo, v)} enfocar={enfocar} />
      <Ayuda>{COMPROMISO.ayuda}</Ayuda>
      <PieFijo>
        <BotonPrincipal onClick={onAceptar}>{COMPROMISO.boton}</BotonPrincipal>
        <BotonTexto onClick={onCambiar}>{COMPROMISO.cambiar}</BotonTexto>
      </PieFijo>
    </div>
  );
}
