'use client';

// Pantallas de pregunta del onboarding (50 A): una decisión por pantalla.
// - NombrePeque: campo libre con "Seguir" y salida "Prefiero no decirlo".
// - PreguntaUnica: chips que avanzan solos tras 300 ms con la elección visible.
// - PreguntaVarias: chips que se marcan y desmarcan + "Seguir" siempre activo
//   (sin elección muestra una pista amable en vez de bloquear, 50 A3).
// Las opciones entran escalonadas (60 ms, la firma de FICHA-ARTE; con reducir
// movimiento, solo el fundido). En 1.3 cada opción lleva la foto de su rutina.

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { limpiarNombre } from '@/lib/embudo/estado';
import type { PasoRutina } from '@/lib/embudo/rutinas';
import { Ayuda, BotonPrincipal, BotonTexto, entrada, Opcion, PieFijo, Titulo } from './ui';
import { conMayuscula, MAX_LETRAS_NOMBRE, NOMBRE } from './textos';

/* ── 1.1 Nombre del peque ──────────────────────────────────────────────────── */
export function NombrePeque({
  inicial,
  enfocar,
  onListo,
  onSaltar,
}: {
  inicial?: string;
  enfocar: boolean;
  onListo: (nombre: string) => void;
  onSaltar: () => void;
}) {
  const [valor, setValor] = useState(inicial ?? '');
  const [error, setError] = useState<string | null>(null);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    // Sin corchetes: el nombre se mete dentro del copy marcado ([acento]…).
    const limpio = limpiarNombre(valor.replace(/[[\]{}]/g, ''));
    if (!limpio) return setError(NOMBRE.errorVacio);
    if (Array.from(limpio).length > MAX_LETRAS_NOMBRE) return setError(NOMBRE.errorLargo);
    setError(null);
    onListo(conMayuscula(limpio));
  };

  return (
    <form onSubmit={enviar} noValidate className="flex flex-1 flex-col">
      <Titulo texto={NOMBRE.titulo} enfocar={enfocar} />
      <Ayuda id="ayuda-nombre">{NOMBRE.ayuda}</Ayuda>
      <label htmlFor="nombre-peque" className="sr-only">
        {NOMBRE.label}
      </label>
      <input
        id="nombre-peque"
        name="nombre"
        type="text"
        value={valor}
        onChange={(e) => {
          setValor(e.target.value);
          if (error) setError(null);
        }}
        placeholder={NOMBRE.placeholder}
        autoComplete="off"
        autoCapitalize="words"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="next"
        maxLength={MAX_LETRAS_NOMBRE}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'ayuda-nombre error-nombre' : 'ayuda-nombre'}
        className={`mt-8 h-14 w-full rounded-[var(--radius-button)] border bg-[var(--surface)] px-4 text-[18px] text-[var(--text-primary)] shadow-[var(--shadow-1)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-2 focus:border-[var(--accent-2)] ${
          error ? 'border-2 border-[var(--error)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)]'
        }`}
      />
      <p id="error-nombre" role="alert" className="mt-2 min-h-6 text-[16px] leading-snug font-semibold text-[var(--error)]">
        {error}
      </p>
      <PieFijo>
        <BotonPrincipal type="submit">{NOMBRE.boton}</BotonPrincipal>
        <BotonTexto onClick={onSaltar}>{NOMBRE.saltar}</BotonTexto>
      </PieFijo>
    </form>
  );
}

/* ── 1.2 / 1.3 Selección única que avanza sola ─────────────────────────────── */
const PAUSA_AUTOAVANCE_MS = 300;

export function PreguntaUnica<T extends string>({
  titulo,
  ayuda,
  opciones,
  elegida,
  enfocar,
  onElegir,
  onAvanzar,
}: {
  titulo: string;
  ayuda?: string;
  opciones: readonly { id: T; label: string; subtexto?: string; paso?: PasoRutina }[];
  elegida?: T;
  enfocar: boolean;
  /** Guarda la respuesta al instante (el chip queda marcado). */
  onElegir: (id: T) => void;
  /** Pasa a la siguiente pantalla después de la pausa. */
  onAvanzar: () => void;
}) {
  const bloqueado = useRef(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    },
    []
  );

  const elegir = (id: T) => {
    // Durante la pausa no se puede tocar otro chip (50 A3: sin doble toque).
    if (bloqueado.current) return;
    bloqueado.current = true;
    onElegir(id);
    temporizador.current = setTimeout(onAvanzar, PAUSA_AUTOAVANCE_MS);
  };

  return (
    <div className="flex flex-1 flex-col">
      <Titulo texto={titulo} enfocar={enfocar} />
      {ayuda && <Ayuda>{ayuda}</Ayuda>}
      <div role="group" aria-labelledby="titulo-paso" className="mt-8 flex flex-col gap-3 pb-8">
        {opciones.map((o, i) => (
          <motion.div key={o.id} {...entrada(i, 0.1)}>
            <Opcion label={o.label} subtexto={o.subtexto} paso={o.paso} seleccionado={elegida === o.id} onClick={() => elegir(o.id)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── 1.4 Selección múltiple con "Seguir" ───────────────────────────────────── */
export function PreguntaVarias({
  titulo,
  ayuda,
  opciones,
  elegidas,
  boton,
  saltar,
  pista,
  enfocar,
  onCambiar,
  onSeguir,
  onSaltar,
}: {
  titulo: string;
  ayuda: string;
  opciones: readonly { id: string; label: string }[];
  /** En el orden en que se tocaron: la primera define {crisis}. */
  elegidas: readonly string[];
  boton: string;
  saltar: string;
  /** Se muestra si toca el botón sin elegir ninguna. */
  pista: string;
  enfocar: boolean;
  onCambiar: (ids: string[]) => void;
  onSeguir: () => void;
  onSaltar: () => void;
}) {
  const [verPista, setVerPista] = useState(false);
  const alternar = (id: string) => {
    setVerPista(false);
    onCambiar(elegidas.includes(id) ? elegidas.filter((x) => x !== id) : [...elegidas, id]);
  };
  const seguir = () => {
    if (elegidas.length === 0) return setVerPista(true);
    onSeguir();
  };

  return (
    <div className="flex flex-1 flex-col">
      <Titulo texto={titulo} enfocar={enfocar} />
      <Ayuda>{ayuda}</Ayuda>
      {/* pb-8: la última opción queda por encima del degradado del pie. */}
      <div role="group" aria-labelledby="titulo-paso" className="mt-8 flex flex-col gap-3 pb-8">
        {opciones.map((o, i) => (
          <motion.div key={o.id} {...entrada(i, 0.1)}>
            <Opcion label={o.label} seleccionado={elegidas.includes(o.id)} onClick={() => alternar(o.id)} />
          </motion.div>
        ))}
      </div>
      <PieFijo>
        <p id="pista-varias" role="alert" className="text-center text-[16px] leading-snug font-semibold text-[var(--text-secondary)]">
          {verPista ? pista : ''}
        </p>
        <BotonPrincipal onClick={seguir} ariaDescribedBy={verPista ? 'pista-varias' : undefined}>
          {boton}
        </BotonPrincipal>
        <BotonTexto onClick={onSaltar}>{saltar}</BotonTexto>
      </PieFijo>
    </div>
  );
}
