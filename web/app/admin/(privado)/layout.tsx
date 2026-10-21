import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { Navegacion } from '@/components/admin/Navegacion';
import { Sello } from '@/components/admin/ui';
import { exigirAdmin } from '@/lib/admin/sesion';
import { salir } from '../acciones';

// Todo lo que está bajo este grupo exige sesión + código, verificado aquí en el servidor.
// Además, cada consulta a la base vuelve a verificarlo (assert_admin): esconder la ruta no basta.
export default async function LayoutPrivado({ children }: { children: ReactNode }) {
  const { email } = await exigirAdmin();
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-2 px-4 pt-3 pb-2">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 [font-family:var(--font-display)] text-[18px] font-semibold">
              <Sello />
              Paso a Paso <span className="font-medium text-[var(--text-secondary)]">· tu panel</span>
            </p>
            <form action={salir}>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center gap-1.5 rounded-[var(--radius-button)] px-3 text-[18px] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] active:scale-[0.98]"
                title={email ?? undefined}
              >
                <LogOut size={16} aria-hidden="true" /> Salir
              </button>
            </form>
          </div>
          <Navegacion />
        </div>
      </header>
      <main className="mx-auto max-w-[1080px] px-4 pt-5 pb-16">{children}</main>
    </>
  );
}
