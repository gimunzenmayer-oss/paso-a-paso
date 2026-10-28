import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/landing/Logo';
import { Ayuda, CheckQueSeLlena, EnlacePrincipal, EnlaceTexto, Titulo } from '@/components/embudo/ui';
import { BotonRevisar, CerrarSesion, EliminarCuenta, EnlaceHotmart, Entra, Escena, FechaLocal, OtroCorreo } from '@/components/cuenta/interacciones';
import { CUENTA, ENTRAR, ESTADOS } from '@/components/cuenta/textos';
import { seGestionaEnHotmart, seReactiva, type ClaveCuenta } from '@/lib/cuenta/acceso';
import { estadoDeCuenta, sesionClienta } from '@/lib/cuenta/sesion';
import { APP, HOTMART_MIS_COMPRAS } from '@/lib/marca';

// Tu cuenta (plan docs/planes/entrada-de-pago.md, paso 7; copy docs/copy/embudo.md §4).
// El proxy ya manda a /entrar sin sesión; aquí se comprueba otra vez en el servidor.
// El estado sale de la RPC mi_acceso() con la sesión de ella (nunca de Hotmart en vivo);
// si la base no responde, "Sin verificar": nunca se le dice que no compró.
// Movimiento: aviso, título, línea, tarjeta, acciones y pie entran escalonados (entrada(i));
// todo bajo MotionConfig reducedMotion="user". Con acceso vigente (prueba o suscripción) la
// etiqueta lleva el check del embudo; el aviso "Listo, ya entraste." también.
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

/** La etiqueta del estado; "Sin compra" nombra el correo ({correo}), que puede ser largo y se parte. */
function Etiqueta({ texto, correo }: { texto: string; correo: string }) {
  const [antes, despues] = texto.split('{correo}');
  if (despues === undefined) return <>{texto}</>;
  return (
    <>
      {antes}
      <span className="break-all">{correo}</span>
      {despues}
    </>
  );
}

/** Con acceso vigente, la etiqueta lleva el check que se llena (la firma del embudo). */
function conCheck(clave: ClaveCuenta): boolean {
  return clave === 'trialing' || clave === 'active';
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
  const hola = q.hola === '1';
  // Turnos del escalonado: el aviso (si está) va primero y corre todo lo demás un lugar.
  const t = hola ? 1 : 0;

  return (
    <Escena>
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
            {hola && (
              <Entra i={0}>
                <p role="status" className="mb-6 flex items-center gap-3 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-4 py-3 text-[16px] font-semibold">
                  {/* Entrar sí salió bien (el estado del acceso va en la tarjeta): el check siempre. */}
                  <CheckQueSeLlena tamano={24} />
                  {CUENTA.listo}
                </p>
              </Entra>
            )}
            <Entra i={t}>
              <Titulo texto={CUENTA.titulo} enfocar={false} />
            </Entra>
            <Entra i={t + 1}>
              <Ayuda>
                {CUENTA.linea.split('{correo}')[0]}
                <b className="font-bold break-all text-[var(--text-primary)]">{sesion.correo}</b>
              </Ayuda>
            </Entra>

            <Entra i={t + 2}>
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
                    <p data-estado={clave} className="mt-2 flex items-center gap-3 text-[22px] leading-tight font-bold [font-family:var(--font-display)]">
                      {conCheck(clave) && <CheckQueSeLlena tamano={24} />}
                      <span className="min-w-0">
                        <Etiqueta texto={fila.etiqueta} correo={sesion.correo} />
                      </span>
                    </p>
                    {detalle && (
                      <p className="mt-2 text-[16px] leading-[1.45] text-pretty text-[var(--text-secondary)]">
                        <Detalle texto={detalle} hasta={hasta} />
                      </p>
                    )}
                  </>
                )}
              </section>
            </Entra>

            <Entra i={t + 3} className="mt-6 flex flex-col gap-3">
              {enCamino && <BotonRevisar texto={CUENTA.enCamino.boton} />}
              {clave === 'sin_verificar' && <BotonRevisar texto={CUENTA.reintentar} />}
              {seReactiva(clave) && !enCamino && (
                <EnlacePrincipal href="/paywall">{clave === 'sin_compra' ? CUENTA.verPlanes : CUENTA.reactivar}</EnlacePrincipal>
              )}
              {clave === 'sin_compra' && !enCamino && <OtroCorreo />}
              {seGestionaEnHotmart(clave) &&
                (clave === 'cancelada' ? (
                  // Ya canceló: no hay nada que cancelar; en Hotmart ve su compra y puede volver a activarla.
                  <EnlaceHotmart href={HOTMART_MIS_COMPRAS} texto={CUENTA.hotmartCancelada} secundario={false} />
                ) : (
                  <div>
                    <EnlaceHotmart
                      href={HOTMART_MIS_COMPRAS}
                      texto={CUENTA.hotmart}
                      secundario={clave === 'sin_verificar'}
                      ariaDescribedBy="ayuda-hotmart"
                    />
                    <p id="ayuda-hotmart" className="mt-2 text-center text-[16px] leading-[1.45] text-balance text-[var(--text-secondary)]">
                      {CUENTA.hotmartAyuda}
                    </p>
                  </div>
                ))}
            </Entra>

            <Entra i={t + 4} className="mt-auto flex flex-col pt-10">
              <EnlaceTexto href="/app">{CUENTA.volverApp}</EnlaceTexto>
              <CerrarSesion />
              {/* La administradora no se elimina desde aquí (la RPC también lo impide). */}
              {clave !== 'admin' && (
                <EliminarCuenta
                  conSuscripcion={seGestionaEnHotmart(clave) && clave !== 'cancelada'}
                  error={q.eliminar === 'error'}
                />
              )}
            </Entra>
          </main>
        </div>
      </div>
    </Escena>
  );
}
