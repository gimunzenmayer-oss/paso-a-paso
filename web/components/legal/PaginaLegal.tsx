import Link from 'next/link';
import type { ReactNode } from 'react';
import { ACTUALIZADO, APP } from '@/lib/marca';

// Marco común de las páginas legales: legible, sin distracciones, con vuelta al inicio.
export function PaginaLegal({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh max-w-[680px] px-4 py-12 [font-family:var(--font-body)] text-[17px] leading-relaxed text-[var(--text-primary)]">
      <Link href="/" className="inline-flex min-h-11 items-center text-[var(--accent)] underline-offset-4 hover:underline">
        ← Volver a {APP}
      </Link>
      <h1 className="mt-6 [font-family:var(--font-display)] text-[32px] font-bold leading-tight">{titulo}</h1>
      <p className="mt-2 text-[14px] text-[var(--text-tertiary)]">Última actualización: {ACTUALIZADO} · versión 1</p>
      <div className="legal mt-8 flex flex-col gap-4">{children}</div>
    </main>
  );
}
