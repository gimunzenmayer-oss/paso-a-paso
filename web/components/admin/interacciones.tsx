'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useLinkStatus } from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Copy, LoaderCircle, Search, Trash2 } from 'lucide-react';
import { borrarRegistro } from '@/app/admin/(privado)/acciones';
import { BotonEnviar, ErrorCampo } from '@/components/admin/formularios';

// El aviso de "guardado" viene en la dirección (?ok=…). Una vez mostrado se quita de la dirección,
// para que no vuelva a aparecer al recargar la página.
export function LimpiarAviso() {
  // Se vuelve a correr cada vez que cambia la dirección (por ejemplo, borrar y luego deshacer en la misma página).
  const params = useSearchParams();
  useEffect(() => {
    const url = new URL(window.location.href);
    let cambio = false;
    for (const k of ['ok', 'error', 'm', 'hola', 'd', 'listo']) {
      if (url.searchParams.has(k)) {
        url.searchParams.delete(k);
        cambio = true;
      }
    }
    if (cambio) window.history.replaceState(window.history.state, '', url);
  }, [params]);
  return null;
}

// Canal del anuncio: el campo para escribir el nombre solo aparece (y se exige) si eliges "Otro".
export function CanalAnuncio({ canales }: { canales: { v: string; t: string }[] }) {
  const [canal, setCanal] = useState(canales[0]?.v ?? '');
  const otro = canal === 'otro';
  return (
    <>
      <label className="flex flex-col gap-1.5">
        <span className="text-[18px] font-bold">Dónde pusiste el anuncio</span>
        <select name="canal" className="campo" value={canal} onChange={(e) => setCanal(e.target.value)}>
          {canales.map((c) => (
            <option key={c.v} value={c.v}>
              {c.t}
            </option>
          ))}
        </select>
      </label>
      {otro && (
        <label className="entra flex flex-col gap-1.5">
          <span className="text-[18px] font-bold">Nombre del canal</span>
          <input
            name="canal_otro"
            required
            autoFocus
            pattern="[A-Za-z0-9_.\-]{2,30}"
            placeholder="Ej.: pinterest"
            data-error="Escribe el nombre en una sola palabra, sin espacios ni tildes. Ej.: pinterest"
            className="campo"
          />
          <ErrorCampo nombre="canal_otro" />
        </label>
      )}
    </>
  );
}

// Borrar pide confirmación con dos salidas claras: "Sí, borrar" o "No, dejarlo".
export function Borrar({ tabla, id, que }: { tabla: 'gasto' | 'costo'; id: number; que: string }) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  // Tocar fuera del globo lo cierra, igual que "No, dejarlo".
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener('pointerdown', fuera);
    return () => document.removeEventListener('pointerdown', fuera);
  }, [abierto]);
  return (
    <div ref={caja} className="relative">
      <button
        type="button"
        aria-label={`Borrar ${que}`}
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
        className={`grid size-12 place-items-center rounded-[var(--radius-button)] active:scale-[0.96] ${
          abierto ? 'bg-[var(--err-bg)] text-[var(--err)]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--err)]'
        }`}
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
      {abierto && (
        <form
          action={borrarRegistro}
          onKeyDown={(e) => e.key === 'Escape' && setAbierto(false)}
          className="entra absolute top-full right-0 z-10 mt-1 flex w-[232px] flex-col gap-2 rounded-[var(--radius-button)] bg-[var(--surface)] p-3 shadow-[var(--shadow-2)] ring-1 ring-[var(--line)]"
        >
          <input type="hidden" name="tabla" value={tabla} />
          <input type="hidden" name="id" value={id} />
          <p className="text-[18px] leading-snug">¿Borrar {que}? Podrás deshacerlo justo después.</p>
          <BotonEnviar enviando="Borrando…" tono="peligro" ancho>
            Sí, borrar
          </BotonEnviar>
          <button
            type="button"
            autoFocus
            onClick={() => setAbierto(false)}
            className="min-h-12 rounded-[var(--radius-button)] text-[18px] font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-2)] active:scale-[0.98]"
          >
            No, dejarlo
          </button>
        </form>
      )}
    </div>
  );
}

// Código de 6 números: al completar el sexto se envía solo (el código cambia cada 30 segundos).
export function CampoCodigo() {
  return (
    <input
      name="codigo"
      required
      autoFocus
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9 ]{6,7}"
      maxLength={7}
      aria-describedby="codigo-error"
      data-error="Son 6 números, tal como aparecen en Google Authenticator."
      onInput={(e) => {
        const campo = e.currentTarget;
        if (campo.value.replace(/\D/g, '').length === 6 && campo.checkValidity()) campo.form?.requestSubmit();
      }}
      // El espacio entre números también queda a la derecha del último: se compensa a la izquierda para que se vea centrado.
      className="campo !pl-[calc(14px+0.25em)] text-center text-[24px] tracking-[0.25em] tabular-nums"
    />
  );
}

// Tipo de costo: con "Otro gasto" aparece (y se exige) un nombre, para distinguirlo en la lista.
export function TipoCosto({ tipos }: { tipos: { v: string; t: string }[] }) {
  const [tipo, setTipo] = useState(tipos[0]?.v ?? '');
  return (
    <>
      <label className="flex flex-col gap-1.5">
        <span className="text-[18px] font-bold">Qué es</span>
        <select name="tipo" className="campo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          {tipos.map((x) => (
            <option key={x.v} value={x.v}>
              {x.t}
            </option>
          ))}
        </select>
      </label>
      {tipo === 'otro' && (
        <label className="entra flex flex-col gap-1.5">
          <span className="text-[18px] font-bold">Nombre del gasto</span>
          <input
            name="nota"
            required
            autoFocus
            minLength={2}
            maxLength={60}
            placeholder="Ej.: dominio web"
            data-error="Escribe qué es, para reconocerlo en la lista. Ej.: dominio web"
            className="campo"
          />
          <ErrorCampo nombre="nota" />
        </label>
      )}
    </>
  );
}

// Buscar: mientras llega la lista, el botón dice "Buscando…" y no se puede tocar dos veces.
export function BotonBuscar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-4 font-bold ring-1 ring-[var(--field-border)] transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-2)] active:scale-[0.98] disabled:opacity-70"
    >
      {pending ? <LoaderCircle size={18} aria-hidden="true" className="animate-spin motion-reduce:animate-none" /> : <Search size={18} aria-hidden="true" />}
      <span aria-live="polite">{pending ? 'Buscando…' : 'Buscar'}</span>
    </button>
  );
}

// El número de un filtro: mientras carga la página a la que lleva, en su lugar gira una ruedita (el botón no cambia de ancho).
export function Conteo({ n }: { n: string }) {
  const { pending } = useLinkStatus();
  return (
    <span className="inline-grid place-items-center font-normal tabular-nums">
      <span className={`[grid-area:1/1] ${pending ? 'invisible' : ''}`}>{n}</span>
      {pending && (
        <span className="[grid-area:1/1]" role="status">
          <LoaderCircle size={16} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
          <span className="sr-only">Cargando…</span>
        </span>
      )}
    </span>
  );
}

// Copiar la clave de configuración (para pegarla en Google Authenticator en el mismo teléfono).
export function CopiarClave({ clave }: { clave: string }) {
  const [copiada, setCopiada] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(clave);
          setCopiada(true);
          setTimeout(() => setCopiada(false), 2500);
        } catch {
          setCopiada(false);
        }
      }}
      className="mt-2 mb-3 inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-button)] px-3 font-bold text-[var(--text-primary)] ring-1 ring-[var(--field-border)] active:scale-[0.98]"
    >
      {copiada ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
      <span aria-live="polite">{copiada ? 'Clave copiada' : 'Copiar clave'}</span>
    </button>
  );
}
