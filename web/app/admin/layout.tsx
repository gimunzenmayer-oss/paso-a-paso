import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './panel.css';

export const metadata: Metadata = {
  title: 'Panel · Paso a Paso',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="panel min-h-dvh bg-[var(--bg)] text-[18px] text-[var(--text-primary)]">
      {/* Sin JavaScript las cifras que cuentan no pueden contar: se muestran directo en su valor final. */}
      <noscript>
        <style>{'.panel .monto-anim{display:none}.panel .monto-fijo{display:inline}'}</style>
      </noscript>
      {children}
    </div>
  );
}
