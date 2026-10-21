import type { ReactNode } from 'react';
import Link from 'next/link';
import { Sello, TiraPasos, type PasoTira } from '@/components/admin/ui';

// Marco de las pantallas de entrada al panel: una sola tarea por pantalla.
// La tira de pasos (dispositivo de la marca) muestra dónde va: 1 correo → 2 código.
export function MarcoEntrada({
  etapa,
  titulo,
  bajada,
  pie,
  children,
}: {
  etapa: 'correo' | 'enviado' | 'codigo';
  titulo: string;
  bajada: ReactNode;
  pie?: ReactNode;
  children: ReactNode;
}) {
  const pasos: PasoTira[] = [
    { texto: 'Tu correo', estado: etapa === 'correo' ? 'actual' : 'hecho' },
    { texto: 'Tu código', estado: etapa === 'codigo' ? 'actual' : 'pendiente' },
    { texto: 'Tu panel', estado: 'pendiente' },
  ];
  // Al pasar de "correo" a "enviado" la marca y el pie no cambian: no se vuelven a animar, solo lo nuevo.
  const anima = etapa === 'enviado' ? '' : 'entra';
  return (
    <main className="mx-auto flex min-h-dvh max-w-[440px] flex-col justify-center px-4 py-10">
      <div className={`${anima} flex items-center gap-2 [font-family:var(--font-display)] text-[18px] font-semibold`}>
        <Sello />
        Paso a Paso <span className="font-medium text-[var(--text-secondary)]">· tu panel</span>
      </div>
      <div className="entra mt-6 -mx-2">
        <TiraPasos pasos={pasos} etiqueta="Pasos para entrar" />
      </div>
      <h1 className="entra mt-5 [font-family:var(--font-display)] text-[36px] font-semibold leading-tight">{titulo}</h1>
      <div className="entra mt-2 leading-relaxed text-[var(--text-secondary)]">{bajada}</div>
      <div className="entra mt-6 rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)] ring-1 ring-[var(--line)]">{children}</div>
      <p className={`${anima} mt-6 text-[18px] leading-relaxed text-[var(--text-secondary)]`}>
        Esta zona es solo para la dueña de la app. Nadie más puede entrar, aunque conozca la dirección.
      </p>
      <div className={`${anima} mt-2 flex flex-wrap gap-x-6`}>
        {pie}
        <Link href="/" className="inline-flex min-h-12 items-center text-[18px] text-[var(--text-secondary)] underline underline-offset-4">
          Volver a la página de Paso a Paso
        </Link>
      </div>
    </main>
  );
}

export function Mensaje({ tono, children }: { tono: 'bien' | 'mal'; children: ReactNode }) {
  const t = tono === 'bien' ? 'bg-[var(--ok-bg)] text-[var(--ok)]' : 'bg-[var(--err-bg)] text-[var(--err)]';
  return (
    <div role={tono === 'mal' ? 'alert' : 'status'} className={`mb-4 rounded-[var(--radius-button)] px-3 py-2.5 text-[18px] leading-snug ${t}`}>
      {children}
    </div>
  );
}
