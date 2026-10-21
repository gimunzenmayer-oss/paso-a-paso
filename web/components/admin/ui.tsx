import type { CSSProperties, ReactNode } from 'react';
import { ArrowUp, ChevronDown } from 'lucide-react';

// Piezas del panel de la dueña. Colores y medidas: FICHA-ARTE.md (tokens en app/admin/panel.css).
// Escala de letra del panel (FICHA-ARTE): 13 (etiqueta) · 18 (texto y notas) · 24 (cifra y título de tarjeta) · 28 (título de sección) · 36 (título de página).

export function Seccion({
  id,
  titulo,
  bajada,
  indice = false,
  children,
}: {
  id: string;
  titulo: string;
  bajada?: string;
  indice?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="entra scroll-mt-36">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={`${id}-t`} className="[font-family:var(--font-display)] text-[28px] font-semibold leading-tight">
          {titulo}
        </h2>
        {indice && (
          <a
            href="#indice"
            className="inline-flex min-h-11 shrink-0 items-center gap-1 text-[13px] font-bold text-[var(--text-secondary)] underline underline-offset-4 active:opacity-70"
          >
            <ArrowUp size={14} aria-hidden="true" /> Índice
          </a>
        )}
      </div>
      {bajada && <p className="mt-1 text-[18px] leading-snug text-[var(--text-secondary)]">{bajada}</p>}
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}

export function Tarjeta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)] ring-1 ring-[var(--line)] sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

export function Subtitulo({ children }: { children: ReactNode }) {
  return <h3 className="text-[18px] font-bold leading-snug text-[var(--text-secondary)]">{children}</h3>;
}

export function SinDatos({ motivo }: { motivo: string }) {
  return (
    <span className="block">
      <span className="text-[18px] font-bold text-[var(--text-secondary)]">Sin datos</span>
      {motivo && <span className="mt-0.5 block text-[18px] leading-snug text-[var(--text-secondary)]">{motivo}</span>}
    </span>
  );
}

// Un número con su etiqueta. Si valor es null, muestra "Sin datos" y POR QUÉ.
export function Cifra({
  etiqueta,
  valor,
  nota,
  motivo = 'Todavía no hay información para calcularlo.',
}: {
  etiqueta: string;
  valor: string | null;
  nota?: ReactNode;
  motivo?: string;
}) {
  return (
    // En el teléfono: etiqueta a la izquierda y cifra a la derecha (más corto de leer); en pantallas anchas, una sobre otra.
    <Tarjeta className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1 min-[480px]:flex min-[480px]:flex-col">
      <span className="text-[18px] font-bold leading-snug text-[var(--text-secondary)]">{etiqueta}</span>
      {valor === null ? (
        <span className="col-span-2">
          <SinDatos motivo={motivo} />
        </span>
      ) : (
        <>
          <span className="text-right [font-family:var(--font-display)] text-[24px] font-semibold leading-tight tabular-nums min-[480px]:text-left">
            {valor}
          </span>
          {nota && <span className="col-span-2 text-[18px] leading-snug text-[var(--text-secondary)]">{nota}</span>}
        </>
      )}
    </Tarjeta>
  );
}

export function Rejilla({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const c = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[cols];
  // Bajo 480px va en una columna: así etiquetas y cifras no se parten en dos líneas.
  return <div className={`grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 ${c}`}>{children}</div>;
}

export type Tono = 'neutro' | 'bien' | 'aviso' | 'mal';

export function Pastilla({ children, tono = 'neutro', check = true }: { children: ReactNode; tono?: Tono; check?: boolean }) {
  const t = {
    neutro: 'bg-[var(--surface-2)] text-[var(--text-secondary)]',
    bien: 'bg-[var(--ok-bg)] text-[var(--ok)]',
    aviso: 'bg-[var(--warn-bg)] text-[var(--warn)]',
    mal: 'bg-[var(--err-bg)] text-[var(--err)]',
  }[tono];
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-bold ${t}`}>
      {tono === 'bien' && check && <CheckTrazo tam={13} />}
      {children}
    </span>
  );
}

// Sello de la marca: el check salvia de la tira de pasos (FICHA-ARTE: el acento vive en el check).
export function Sello({ tam = 22, vivo = false }: { tam?: number; vivo?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent)]"
      style={{ width: tam, height: tam }}
    >
      <CheckTrazo tam={Math.round(tam * 0.6)} vivo={vivo} />
    </span>
  );
}

// El check de la marca como trazo: con `vivo` se dibuja al aparecer (respeta "reducir movimiento").
export function CheckTrazo({ tam = 16, vivo = true }: { tam?: number; vivo?: boolean }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={vivo ? 'check-vivo shrink-0' : 'shrink-0'}>
      <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Todo lo plegable del panel se abre igual: texto en negrita, flecha que gira y respuesta al toque.
// Con `caja`, el plegable va dentro de su propia caja gris a todo el ancho; sin ella, es una línea dentro de una tarjeta.
export function Plegable({
  titulo,
  children,
  caja = false,
  abierto,
  className = '',
}: {
  titulo: ReactNode;
  children: ReactNode;
  caja?: boolean;
  abierto?: boolean;
  className?: string;
}) {
  return (
    <details open={abierto} className={`group ${caja ? 'rounded-[var(--radius-card)] bg-[var(--surface-2)] px-4 ring-1 ring-[var(--line)]' : ''} ${className}`}>
      <summary
        className={`flex min-h-12 cursor-pointer list-none items-center gap-2 font-bold text-[var(--text-secondary)] select-none active:opacity-70 [&::-webkit-details-marker]:hidden ${caja ? 'justify-between' : ''}`}
      >
        <span className="text-balance">{titulo}</span>
        <ChevronDown size={18} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      {children}
    </details>
  );
}

// Lo que todavía no se puede medir, junto y plegado: se sabe que existe, pero no ocupa la pantalla.
export function PorMedir({ items }: { items: { que: string; porque: string }[] }) {
  if (items.length === 0) return null;
  return (
    <Plegable
      caja
      titulo={
        <span>
          {items.length === 1 ? '1 cifra todavía sin datos' : `${items.length} cifras todavía sin datos`}
          <span className="whitespace-nowrap font-normal"> · por qué</span>
        </span>
      }
    >
      <ul className="flex flex-col gap-2 pb-4 leading-snug">
        {items.map((i) => (
          <li key={i.que}>
            <b>{i.que}:</b> <span className="text-[var(--text-secondary)]">{i.porque}</span>
          </li>
        ))}
      </ul>
    </Plegable>
  );
}

// Tira de pasos de la marca (FICHA-ARTE: "rutina visual con check verde"). Cada paso hecho se llena de salvia
// y se dibuja su check, 60ms después del anterior; el paso en curso va con borde; los pendientes, en gris.
export type PasoTira = {
  texto: string;
  estado: 'hecho' | 'actual' | 'pendiente';
  detalle?: string;
  // Un paso pendiente con href lleva a donde se completa.
  href?: string;
};

export function TiraPasos({ pasos, etiqueta }: { pasos: PasoTira[]; etiqueta: string }) {
  return (
    <ol aria-label={etiqueta} className="flex items-start">
      {pasos.map((p, i) => {
        const retraso = { '--retraso': `${120 + i * 60}ms` } as CSSProperties;
        return (
          <li key={p.texto} className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center" aria-current={p.estado === 'actual' ? 'step' : undefined}>
            <div className="flex w-full items-center">
              <span
                aria-hidden="true"
                className={`h-0.5 flex-1 ${i === 0 ? 'invisible' : p.estado === 'pendiente' ? 'bg-[var(--line)]' : 'bg-[var(--accent)]'}`}
              />
              <span
                className={`relative grid size-9 shrink-0 place-items-center rounded-full border-2 ${
                  p.estado === 'pendiente'
                    ? 'border-[var(--field-border)] bg-[var(--surface)] text-[var(--text-secondary)]'
                    : 'border-[var(--accent)] bg-[var(--surface)] text-[var(--accent)]'
                }`}
              >
                {p.estado === 'hecho' ? (
                  <>
                    <span aria-hidden="true" className="llena absolute inset-0 rounded-full bg-[var(--accent)]" style={retraso} />
                    <span className="relative text-[var(--surface)]" style={{ '--retraso': `${260 + i * 60}ms` } as CSSProperties}>
                      <CheckTrazo tam={18} />
                    </span>
                    <span className="sr-only">hecho:</span>
                  </>
                ) : (
                  <span className="text-[18px] font-bold tabular-nums">{i + 1}</span>
                )}
              </span>
              <span
                aria-hidden="true"
                className={`h-0.5 flex-1 ${i === pasos.length - 1 ? 'invisible' : pasos[i + 1].estado === 'pendiente' ? 'bg-[var(--line)]' : 'bg-[var(--accent)]'}`}
              />
            </div>
            {p.href && p.estado === 'pendiente' ? (
              <a href={p.href} className="px-1 text-[13px] font-bold leading-tight text-[var(--text-primary)] underline underline-offset-4 active:opacity-70">
                {p.texto}
              </a>
            ) : (
              <span
                className={`px-1 text-[13px] font-bold leading-tight ${p.estado === 'pendiente' ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}
              >
                {p.texto}
              </span>
            )}
            {p.detalle && <span className="px-1 text-[13px] leading-tight text-[var(--text-secondary)]">{p.detalle}</span>}
          </li>
        );
      })}
    </ol>
  );
}
