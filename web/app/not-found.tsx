import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaAviso } from '@/components/errores/PaginaAviso';

export const metadata: Metadata = { title: 'Página no encontrada · Paso a Paso' };

export default function NoEncontrada() {
  return (
    <PaginaAviso
      titulo="Esta página no existe"
      texto="Puede que el enlace esté incompleto o que la página haya cambiado de lugar. Tus datos siguen en tu teléfono, no se perdió nada."
      accion={
        <Link
          href="/app/index.html"
          className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 font-semibold text-white transition-transform active:scale-[0.97]"
        >
          Abrir la app
        </Link>
      }
    />
  );
}
