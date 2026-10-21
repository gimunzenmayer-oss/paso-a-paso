import Link from 'next/link';
import { ArrowRight, CircleAlert, TriangleAlert } from 'lucide-react';
import { Sello } from '@/components/admin/ui';
import { dinero, num } from '@/lib/admin/formato';
import { nombreCanal, plural } from '@/lib/admin/textos';
import type { Aviso } from '@/lib/admin/tipos';

// A dónde ir para resolver cada aviso.
const IR: Record<string, { href: string; texto: string }> = {
  canal_pierde: {
    href: '/admin/costos#anuncios',
    texto: 'Ver gasto en anuncios',
  },
  margen_negativo: { href: '/admin/costos', texto: 'Revisar costos' },
  catalogo: { href: '/admin/costos#ajustes', texto: 'Escribir el código' },
  churn_involuntario: {
    href: '/admin/clientes?estado=problema',
    texto: 'Ver quiénes',
  },
  webhook: { href: '#salud', texto: 'Ver la conexión' },
  errores: { href: '#salud', texto: 'Ver el error' },
  ia_cara: { href: '#ia', texto: 'Ver gasto de IA' },
};

// El nombre del canal llega como lo escribió el enlace ("meta"); aquí se muestra como en la tabla ("Meta").
function legible(a: Aviso): string {
  if (a.tipo === 'canal_pierde') {
    const canal = (a.que.match(/"([^"]+)"/)?.[1] ?? '').trim();
    return `Los anuncios en ${nombreCanal(canal)} te cuestan más de lo que te dejan.`;
  }
  return a.que;
}

// Banner de avisos: qué pasó → por qué importa → qué hacer. Los urgentes primero. Si no hay nada, también se dice.
export function Avisos({ avisos, moneda }: { avisos: Aviso[]; moneda: string }) {
  if (avisos.length === 0) {
    return (
      <div role="status" className="entra flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--ok-bg)] px-4 py-3.5 text-[var(--ok)]">
        <Sello tam={28} vivo />
        <p className="text-[18px] font-bold">Todo en orden este mes</p>
      </div>
    );
  }
  const orden = [...avisos].sort((a, b) => (a.nivel === b.nivel ? 0 : a.nivel === 'alto' ? -1 : 1));
  return (
    <section aria-label="Avisos" className="entra flex flex-col gap-2">
      <h2 className="sr-only">Avisos</h2>
      {orden.map((a, i) => {
        const alto = a.nivel === 'alto';
        const Icono = alto ? CircleAlert : TriangleAlert;
        const ir = IR[a.tipo];
        return (
          <article
            key={`${a.tipo}-${i}`}
            className={`rounded-[var(--radius-card)] px-4 py-3.5 ${alto ? 'bg-[var(--err-bg)] text-[var(--err)]' : 'bg-[var(--warn-bg)] text-[var(--warn)]'}`}
          >
            <div className="flex items-start gap-3">
              <Icono size={22} aria-hidden="true" className="mt-0.5 shrink-0" />
              <div className="flex min-w-0 flex-col gap-1 text-[18px] leading-snug">
                <p className="text-[18px] font-bold">{legible(a)}</p>
                {a.tipo === 'canal_pierde' && a.gasto != null && (
                  <p>
                    <span className="font-bold">En juego: </span>
                    gastaste {dinero(a.gasto, moneda)}, te trajo {num(a.clientes_nuevos ?? 0)} {plural(a.clientes_nuevos ?? 0, 'clienta', 'clientas')} y te
                    pagaron {dinero(a.ingresos ?? 0, moneda)}
                    {a.ganancia != null && a.ganancia < 0 ? `: pierdes ${dinero(-a.ganancia, moneda)} este mes.` : '.'}
                  </p>
                )}
                <p>
                  <span className="font-bold">Por qué importa: </span>
                  {a.porque}
                </p>
                <p>
                  <span className="font-bold">Qué hacer: </span>
                  {a.hacer}
                </p>
                {ir && (
                  <Link
                    href={ir.href}
                    className="mt-1 inline-flex min-h-11 items-center gap-1.5 self-start font-bold underline underline-offset-4 active:opacity-70"
                  >
                    {ir.texto} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
