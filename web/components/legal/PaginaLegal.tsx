import Link from 'next/link';
import type { ReactNode } from 'react';
import { ACTUALIZADO, APP, SOPORTE_EMAIL, VERSION_LEGAL } from '@/lib/marca';

// Las páginas legales enlazadas entre sí (47 §2): desde cualquiera se llega a las demás.
const PAGINAS = [
  { href: '/privacidad', label: 'Privacidad' },
  { href: '/terminos', label: 'Términos' },
  { href: '/reembolsos', label: 'Reembolsos' },
  { href: '/cancelar', label: 'Cómo cancelar' },
  { href: '/aviso', label: 'Aviso importante' },
];

// Marco común de las páginas legales: legible, sin distracciones, con vuelta al inicio.
export function PaginaLegal({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh max-w-[680px] px-4 py-12 [font-family:var(--font-body)] text-[17px] leading-relaxed text-[var(--text-primary)]">
      <Link href="/" className="inline-flex min-h-11 items-center text-[var(--accent)] underline-offset-4 hover:underline">
        ← Volver a {APP}
      </Link>
      <h1 className="mt-6 [font-family:var(--font-display)] text-[32px] font-bold leading-tight">{titulo}</h1>
      <p className="mt-2 text-[14px] text-[var(--text-tertiary)]">
        Última actualización: {ACTUALIZADO} · versión {VERSION_LEGAL}
      </p>
      <div className="legal mt-8 flex flex-col gap-4">{children}</div>
      <nav aria-label="Páginas legales" className="mt-12 border-t-2 border-[var(--surface-2)] pt-6">
        <ul className="flex flex-wrap gap-x-4">
          {PAGINAS.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="inline-flex min-h-11 items-center text-[14px] text-[var(--text-secondary)] underline underline-offset-4">
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
          ¿Dudas? Escríbenos a{' '}
          <a href={`mailto:${SOPORTE_EMAIL}`} className="underline underline-offset-4">
            {SOPORTE_EMAIL}
          </a>
        </p>
      </nav>
    </main>
  );
}
