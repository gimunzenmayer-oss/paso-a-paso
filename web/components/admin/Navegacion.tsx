'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SECCIONES = [
  { href: '/admin', texto: 'Resumen' },
  { href: '/admin/clientes', texto: 'Clientes' },
  { href: '/admin/costos', texto: 'Costos' },
] as const;

export function Navegacion() {
  const ruta = usePathname();
  return (
    <nav aria-label="Secciones del panel" className="-mx-1 flex gap-1 overflow-x-auto">
      {SECCIONES.map((s) => {
        const activa = s.href === '/admin' ? ruta === s.href : ruta.startsWith(s.href);
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={activa ? 'page' : undefined}
            className={`inline-flex min-h-12 shrink-0 items-center rounded-[var(--radius-button)] px-4 text-[18px] font-bold transition-[background-color,transform] active:scale-[0.98] ${
              activa ? 'bg-[var(--text-primary)] text-[#FBFCF9]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
            }`}
          >
            {s.texto}
          </Link>
        );
      })}
    </nav>
  );
}
