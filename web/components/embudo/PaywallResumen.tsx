'use client';

// 2.1 Página 1 del paywall: el resumen de lo que armó el onboarding, con SUS
// respuestas (50 C0: recap del valor + inversión visible, "Hecho con tus {N}
// respuestas"). Sin onboarding previo se usan los textos genéricos ("tu peque") y
// se omiten las dos líneas que solo son ciertas si hubo respuestas.

import { CheckCustom, Hairline } from '@/components/landing/ui';
import { MarkedCopy } from '@/components/landing/MarkedCopy';
import { Ayuda, BotonPrincipal, EnlaceTexto, PieFijo, Titulo } from './ui';
import { llenar, PAYWALL_RESUMEN, type Variables, type VariablesPaywall } from './textos';

export function PaywallResumen({
  v,
  conPlan,
  hrefVolver,
  enfocar,
  onSeguir,
}: {
  v: Variables & VariablesPaywall;
  /** true si el onboarding dejó respuestas en este teléfono. */
  conPlan: boolean;
  hrefVolver: string;
  enfocar: boolean;
  onSeguir: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Titulo texto={llenar(PAYWALL_RESUMEN.titulo, v)} enfocar={enfocar} />
      {conPlan && (
        <Ayuda>
          <MarkedCopy text={llenar(PAYWALL_RESUMEN.subtitulo, v)} />
        </Ayuda>
      )}

      <Hairline emphasis surface="surface" className="mt-6 shadow-[var(--shadow-2)]">
        <ul className="flex flex-col gap-4 p-4">
          {PAYWALL_RESUMEN.puntos.map((punto) => (
            <li key={punto} className="flex items-start gap-3 text-[17px] leading-[1.45] text-[var(--text-primary)]">
              <CheckCustom />
              <span>
                <MarkedCopy text={llenar(punto, v)} />
              </span>
            </li>
          ))}
        </ul>
      </Hairline>

      {conPlan && <p className="mt-5 text-[17px] leading-[1.45] font-semibold text-[var(--text-primary)]">{PAYWALL_RESUMEN.perdida}</p>}

      <PieFijo>
        <BotonPrincipal onClick={onSeguir}>{PAYWALL_RESUMEN.boton}</BotonPrincipal>
        <EnlaceTexto href={hrefVolver}>{PAYWALL_RESUMEN.salida}</EnlaceTexto>
      </PieFijo>
    </div>
  );
}
