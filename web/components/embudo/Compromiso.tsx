'use client';

// 1.6 Compromiso (02B: pre-compromiso "cuando pase X haré Y"). El momento elegido
// vuelve textual; "Cambiar el momento" regresa a 1.3 sin perder nada.

import { CalendarCheck } from 'lucide-react';
import { IconChip } from '@/components/landing/ui';
import { Ayuda, BotonPrincipal, BotonTexto, PieFijo, Titulo } from './ui';
import { COMPROMISO, llenar, type Variables } from './textos';

export function Compromiso({
  v,
  esManana,
  enfocar,
  onAceptar,
  onCambiar,
}: {
  v: Variables;
  esManana: boolean;
  enfocar: boolean;
  onAceptar: () => void;
  onCambiar: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6">
        <IconChip icon={CalendarCheck} />
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
