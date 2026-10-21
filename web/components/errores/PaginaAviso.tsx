import Link from 'next/link';
import type { ReactNode } from 'react';
import { APP, SOPORTE_EMAIL } from '@/lib/marca';

// Marco común de las páginas de error: qué pasó, qué hacer y una salida clara.
export function PaginaAviso({ titulo, texto, accion }: { titulo: string; texto: string; accion?: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[520px] flex-col justify-center gap-4 px-4 py-12 [font-family:var(--font-body)] text-[17px] leading-relaxed text-[var(--text-primary)]">
      <p className="[font-family:var(--font-display)] text-[14px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{APP}</p>
      <h1 className="[font-family:var(--font-display)] text-[32px] font-bold leading-tight">{titulo}</h1>
      <p className="text-[var(--text-secondary)]">{texto}</p>
      <div className="mt-2 flex flex-col gap-3">
        {accion}
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface)] shadow-[var(--shadow-1)] px-5 font-semibold transition-transform active:scale-[0.97]"
        >
          Ir al inicio
        </Link>
      </div>
      <p className="mt-4 text-[14px] text-[var(--text-tertiary)]">
        ¿Sigue pasando? Escríbenos a{' '}
        <a href={`mailto:${SOPORTE_EMAIL}`} className="text-[var(--accent)] underline underline-offset-4">
          {SOPORTE_EMAIL}
        </a>
      </p>
    </main>
  );
}
