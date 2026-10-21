import type { CSSProperties } from 'react';
import { redirect } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { BotonEnviar, ErrorCampo, FormularioAdmin } from '@/components/admin/formularios';
import { MarcoEntrada, Mensaje } from '@/components/admin/MarcoEntrada';
import { Sello } from '@/components/admin/ui';
import { estadoAdmin } from '@/lib/admin/sesion';
import { pedirEnlace, salir } from '../acciones';

const ERRORES: Record<string, string> = {
  correo: 'A ese correo le falta algo (la @ o el punto). Escríbelo completo, por ejemplo: nombre@gmail.com.',
  espera: 'Pediste varios enlaces seguidos. Espera 15 minutos y vuelve a pedirlo; mientras, revisa si alguno ya te llegó.',
  servidor: 'No pudimos mandar el enlace ahora. Intenta de nuevo en un momento; si sigue fallando, pídele a Claude en tu proyecto que lo revise.',
  enlace: 'Ese enlace ya se usó o venció (duran una hora). Pide uno nuevo aquí abajo.',
  permiso: 'Esa cuenta no es la de la dueña del panel. Toca “Salir de esa cuenta” y pide el enlace con el correo con que creaste Paso a Paso.',
};

function CampoCorreo({ autoFocus }: { autoFocus: boolean }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[18px] font-bold">Correo electrónico</span>
      <input
        name="email"
        type="email"
        required
        autoFocus={autoFocus}
        autoComplete="email"
        inputMode="email"
        placeholder="nombre@gmail.com"
        data-error="Escribe tu correo completo, con @ y punto. Ej.: nombre@gmail.com"
        className="campo"
      />
      <ErrorCampo nombre="email" />
    </label>
  );
}

export default async function Entrar({ searchParams }: PageProps<'/admin/entrar'>) {
  const q = await searchParams;
  const { estado } = await estadoAdmin();
  if (estado === 'ok') redirect('/admin');
  if (estado === 'falta_codigo') redirect('/admin/verificar');

  const error = typeof q.error === 'string' ? ERRORES[q.error] : undefined;
  const enviado = q.enviado === '1';
  const a = typeof q.a === 'string' ? q.a.slice(0, 80) : null;

  if (enviado) {
    return (
      <MarcoEntrada etapa="enviado" titulo="Revisa tu correo" bajada="Te mandamos un enlace para entrar. Ábrelo en este mismo teléfono o computador.">
        {/* El sello se dibuja cuando la tarjeta ya terminó de aparecer (la tarjeta entra a los 240ms). */}
        <div role="status" className="flex items-start gap-3" style={{ '--retraso': '420ms' } as CSSProperties}>
          <Sello tam={44} vivo />
          <p className="leading-snug">
            Si {a ? <b>{a}</b> : 'ese correo'} es el de la dueña del panel, el enlace ya está en camino. Puede tardar un par de minutos.
          </p>
        </div>
        <details className="group mt-4 -mb-2 border-t border-[var(--line)] pt-1">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 text-[18px] font-bold [&::-webkit-details-marker]:hidden">
            ¿No te llegó o lo escribiste mal?
            <ChevronDown size={18} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <p className="text-[18px] leading-snug text-[var(--text-secondary)]">
            Mira en la carpeta de spam o promociones. Si no está, escribe tu correo de nuevo aquí abajo y pide otro enlace.
          </p>
          <FormularioAdmin action={pedirEnlace} className="mt-3 flex flex-col gap-3 pb-1">
            <CampoCorreo autoFocus={false} />
            <BotonEnviar enviando="Enviando…" tono="suave" ancho>
              Mandarme otro enlace
            </BotonEnviar>
          </FormularioAdmin>
        </details>
      </MarcoEntrada>
    );
  }

  return (
    <MarcoEntrada
      etapa="correo"
      titulo="Entra a tu panel"
      bajada="Escribe el correo con que creaste Paso a Paso y te mandamos un enlace para entrar. Sin contraseñas que recordar."
    >
      {error && <Mensaje tono="mal">{error}</Mensaje>}
      {estado === 'sin_permiso' && (
        <form action={salir} className="mb-4">
          <BotonEnviar enviando="Saliendo…" tono="suave" ancho>
            Salir de esa cuenta
          </BotonEnviar>
        </form>
      )}
      <FormularioAdmin action={pedirEnlace} className="flex flex-col gap-4">
        <CampoCorreo autoFocus />
        <BotonEnviar enviando="Enviando el enlace…" ancho>
          Mandarme el enlace
        </BotonEnviar>
      </FormularioAdmin>
    </MarcoEntrada>
  );
}
