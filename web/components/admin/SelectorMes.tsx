'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { nombreMes } from '@/lib/admin/formato';

export function SelectorMes({ actual, meses }: { actual: string; meses: string[] }) {
  const router = useRouter();
  const [cargando, iniciar] = useTransition();
  return (
    <label className="inline-flex items-center gap-2 text-[18px] text-[var(--text-secondary)]">
      <span className="sr-only">Ver otro mes</span>
      {/* El mes que estás viendo ya es el título: aquí solo se ofrecen los otros. */}
      <select
        value=""
        disabled={cargando}
        onChange={(e) => {
          const v = e.target.value;
          iniciar(() => router.push(v === meses[0] ? '/admin' : `/admin?mes=${v}`));
        }}
        className="campo !min-h-12 !w-auto font-bold disabled:opacity-70"
      >
        <option value="" disabled>
          Ver otro mes…
        </option>
        {meses
          .filter((m) => m !== actual)
          .map((m) => (
            <option key={m} value={m}>
              {nombreMes(m).replace(/^./, (c) => c.toUpperCase())}
            </option>
          ))}
      </select>
      <span role="status" aria-live="polite" className="inline-flex w-5">
        {cargando && <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-label="Cargando el mes" />}
      </span>
    </label>
  );
}
