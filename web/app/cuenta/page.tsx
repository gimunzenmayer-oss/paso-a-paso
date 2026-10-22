import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/landing/Logo';
import { Ayuda, EnlacePrincipal, EnlaceTexto, Titulo } from '@/components/embudo/ui';
import { BotonRevisar, CerrarSesion, FechaLocal } from '@/components/cuenta/interacciones';
import { CUENTA, ENTRAR, ESTADOS } from '@/components/cuenta/textos';
import { seGestionaEnHotmart, seReactiva } from '@/lib/cuenta/acceso';
import { estadoDeCuenta, sesionClienta } from '@/lib/cuenta/sesion';
import { APP, HOTMART_MIS_COMPRAS, SOPORTE_EMAIL } from '@/lib/marca';

// Tu cuenta (plan docs/planes/entrada-de-pago.md, paso 7; copy docs/copy/embudo.md §4).
// El proxy ya manda a /entrar sin sesión; aquí se comprueba otra vez en el servidor.
// El estado sale de la RPC mi_acceso() con la sesión de ella (nunca de Hotmart en vivo);
// si la base no responde, "Sin verificar": nunca se le dice que no compró.
export const metadata: Metadata = {
  title: `Tu cuenta · ${APP}`,
  robots: { index: false, follow: false },
};

/** Parte un texto en {fecha_cobro} / {fecha_fin} para pintar la fecha en la hora del teléfono. */
function Detalle({ texto, hasta }: { texto: string; hasta: string | null }) {
  const partes = texto.split(/\{fecha_cobro\}|\{fecha_fin\}/);
  if (partes.length === 1) return <>{texto}</>;
  return (
    <>
      {partes[0]}
      {hasta && <FechaLocal iso={hasta} />}
      {partes[1]}
    </>
  );
}

function DetalleSoporte({ texto }: { texto: string }) {
  const [antes, despues] = texto.split(SOPORTE_EMAIL);
  if (despues === undefined) return <>{texto}</>;
  return (
    <>
      {antes}
      <a href={`mailto:${SOPORTE_EMAIL}`} aria-label={ENTRAR.rescate.ariaSoporte} className="font-bold break-all text-[var(--text-primary)] underline underline-offset-4">
        {SOPORTE_EMAIL}
      </a>
      {despues}
    </>
  );
}

export default async function PaginaCuenta({ searchParams }: PageProps<'/cuenta'>) {
  const sesion = await sesionClienta();
  if (!sesion) redirect('/entrar');
  const q = await searchParams;
  const { clave, hasta } = await estadoDeCuenta(sesion);

  const fila = ESTADOS[clave];
  const necesitaFecha = /\{fecha_(cobro|fin)\}/.test(fila.detalle);
  const detalle = necesitaFecha && !hasta ? (fila.detalleSinFecha ?? null) : fila.detalle;
  const enCamino = clave === 'sin_compra' && q.compra === '1';

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-5 pb-[max(16px,env(safe-area-inset-bottom))]">
        <header className="flex h-16 items-center pt-[env(safe-area-inset-top)]">
          <Link
            href="/"
            aria-label={ENTRAR.logo}
            className="-ml-2 inline-flex h-12 items-center gap-2 rounded-full px-2 text-[16px] font-semibold text-[var(--text-primary)]"
          >
            <Logo />
            <span aria-hidden="true">{APP}</span>
          </Link>
        </header>
        <main className="flex flex-1 flex-col pt-4">
          {q.hola === '1' && (
            <p role="status" className="mb-6 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-4 py-3 text-[16px] font-semibold">
              {CUENTA.listo}
            </p>
          )}
          <Titulo texto={CUENTA.titulo} enfocar={false} />
          <Ayuda>
            {CUENTA.linea.split('{correo}')[0]}
            <b className="font-bold break-all text-[var(--text-primary)]">{sesion.correo}</b>
          </Ayuda>

          <section aria-labelledby="tu-acceso" className="mt-8 rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
            <h2 id="tu-acceso" className="text-[13px] font-bold tracking-[0.06em] text-[var(--text-secondary)] uppercase">
              {CUENTA.bloque}
            </h2>
            {enCamino ? (
              <>
                <p className="mt-2 text-[22px] leading-tight font-bold [font-family:var(--font-display)]">{CUENTA.enCamino.titulo}</p>
                <p className="mt-2 text-[16px] leading-[1.45] text-pretty text-[var(--text-secondary)]">{CUENTA.enCamino.texto}</p>
              </>
            ) : (
              <>
                <p data-estado={clave} className="mt-2 text-[22px] leading-tight font-bold [font-family:var(--font-display)]">
                  {fila.etiqueta}
                </p>
                {detalle && (
                  <p className="mt-2 text-[16px] leading-[1.45] text-pretty text-[var(--text-secondary)]">
                    {clave === 'sin_compra' ? <DetalleSoporte texto={detalle} /> : <Detalle texto={detalle} hasta={hasta} />}
                  </p>
                )}
              </>
            )}
          </section>

          <div className="mt-6 flex flex-col gap-3">
            {enCamino && <BotonRevisar texto={CUENTA.enCamino.boton} />}
            {clave === 'sin_verificar' && <BotonRevisar texto={CUENTA.reintentar} />}
            {seReactiva(clave) && !enCamino && <EnlacePrincipal href="/paywall">{CUENTA.reactivar}</EnlacePrincipal>}
            {seGestionaEnHotmart(clave) && (
              <div>
                <EnlacePrincipal href={HOTMART_MIS_COMPRAS} secundario={clave === 'sin_verificar'} ariaDescribedBy="ayuda-hotmart">
                  {CUENTA.hotmart}
                </EnlacePrincipal>
                <p id="ayuda-hotmart" className="mt-2 text-center text-[16px] leading-[1.45] text-[var(--text-secondary)]">
                  {CUENTA.hotmartAyuda}
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-col pt-10">
            <EnlaceTexto href="/app">{CUENTA.volverApp}</EnlaceTexto>
            <CerrarSesion />
          </div>
        </main>
      </div>
    </div>
  );
}
