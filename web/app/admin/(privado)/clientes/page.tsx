import Form from 'next/form';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronDown, Undo2, X } from 'lucide-react';
import { BotonEnviar, ErrorCampo, FormularioAdmin } from '@/components/admin/formularios';
import { BotonBuscar, Conteo, LimpiarAviso } from '@/components/admin/interacciones';
import { CheckTrazo, Pastilla, SinDatos, Tarjeta } from '@/components/admin/ui';
import { fecha, num } from '@/lib/admin/formato';
import { exigirAdmin } from '@/lib/admin/sesion';
import { ESTADO_CLIENTE, nombreCanal, plural } from '@/lib/admin/textos';
import { cambiarEstado, deshacerCambio } from '../acciones';

export const dynamic = 'force-dynamic';

type Cliente = {
  id: string;
  email: string;
  nombre: string | null;
  estado: string;
  ciclo: string | null;
  origen: string | null;
  alta: string;
  primer_pago: string | null;
  acceso_hasta: string | null;
  ultima_actividad: string | null;
  tiene_acceso: boolean;
  se_puede_deshacer: boolean | null;
};

type Lista = {
  total: number;
  conteo: Record<Filtro, number>;
  filas: Cliente[];
};

type Filtro = 'pagando' | 'prueba' | 'problema' | 'sin_acceso';
const FILTROS: { id: Filtro; texto: string }[] = [
  { id: 'pagando', texto: 'Pagando' },
  { id: 'prueba', texto: 'En prueba' },
  { id: 'problema', texto: 'Pago atrasado' },
  { id: 'sin_acceso', texto: 'Ya no pagan' },
];

const LIMITE = 100;

const MENSAJES: Record<string, { tono: 'bien' | 'mal'; texto: string }> = {
  'ok:quitado': {
    tono: 'bien',
    texto: 'Listo: desde ahora no puede entrar. Quedó anotado con tu motivo.',
  },
  'ok:dado': {
    tono: 'bien',
    texto: 'Listo: desde ahora puede entrar. Quedó anotado con tu motivo.',
  },
  'ok:deshecho': {
    tono: 'bien',
    texto: 'Deshecho: la clienta volvió a como estaba.',
  },
  'error:motivo': {
    tono: 'mal',
    texto: 'Falta el motivo. Escribe por qué (por ejemplo: “pagó, pero Hotmart no avisó”).',
  },
  'error:estado': {
    tono: 'mal',
    texto:
      'No pudimos cambiar el acceso. Tu motivo sigue escrito: intenta de nuevo en un momento. Si vuelve a fallar, pídele a Claude en tu proyecto que lo revise.',
  },
  'error:deshacer': {
    tono: 'mal',
    texto: 'Ya no se puede deshacer: hubo otro cambio después (por ejemplo, un aviso de Hotmart).',
  },
};

function enlace(buscar: string, estado: Filtro | null): string {
  const p = new URLSearchParams();
  if (buscar) p.set('q', buscar);
  if (estado) p.set('estado', estado);
  const s = p.toString();
  return s ? `/admin/clientes?${s}` : '/admin/clientes';
}

export default async function Clientes({ searchParams }: PageProps<'/admin/clientes'>) {
  const q = await searchParams;
  const buscar = typeof q.q === 'string' ? q.q.trim().slice(0, 80) : '';
  const filtro = FILTROS.find((f) => f.id === q.estado)?.id ?? null;
  const elegida = typeof q.c === 'string' ? q.c : null;
  const motivoPrevio = typeof q.m === 'string' ? q.m.slice(0, 120) : '';
  const { supabase } = await exigirAdmin();
  const { data, error } = await supabase.rpc('admin_lista_clientes', {
    p_buscar: buscar || null,
    p_limite: LIMITE,
    p_estado: filtro,
  });
  if (error?.code === '42501') redirect('/admin/verificar');
  const lista = (data ?? {
    total: 0,
    conteo: { pagando: 0, prueba: 0, problema: 0, sin_acceso: 0 },
    filas: [],
  }) as Lista;
  const clientes = lista.filas;
  const aviso = MENSAJES[`ok:${q.ok}`] ?? MENSAJES[`error:${q.error}`];
  const volver = enlace(buscar, filtro);

  return (
    <div className="flex flex-col gap-5">
      <LimpiarAviso />
      <div className="entra">
        <h1 className="[font-family:var(--font-display)] text-[36px] font-semibold leading-tight">Clientes</h1>
        <p className="mt-1 text-[18px] text-[var(--text-secondary)]">
          {lista.total === 0
            ? 'Las personas que compran o prueban gratis por Hotmart aparecen aquí solas.'
            : `${num(lista.total)} ${plural(lista.total, 'persona llegó', 'personas llegaron')} por Hotmart: compraron o están probando gratis.`}
        </p>
      </div>

      <Form role="search" action="/admin/clientes" className="entra flex gap-2">
        {filtro && <input type="hidden" name="estado" value={filtro} />}
        <label htmlFor="q" className="sr-only">
          Buscar por correo
        </label>
        <div className="relative min-w-0 flex-1">
          <input id="q" name="q" type="search" defaultValue={buscar} placeholder="Buscar por correo" autoComplete="off" className="campo pr-11" />
          {buscar && (
            <Link
              href={enlace('', filtro)}
              aria-label="Borrar la búsqueda"
              className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-[var(--radius-button)] text-[var(--text-secondary)] hover:bg-[var(--surface)]"
            >
              <X size={18} aria-hidden="true" />
            </Link>
          )}
        </div>
        <BotonBuscar />
      </Form>

      {lista.total > 0 && (
        <nav aria-label="Filtrar por situación" className="entra flex flex-wrap gap-2">
          {[{ id: null, texto: 'Todas', n: lista.total }, ...FILTROS.map((f) => ({ ...f, n: lista.conteo[f.id] }))]
            // Un grupo vacío no se ofrece (menos opciones que mirar), salvo que sea el que estás viendo.
            .filter((f) => f.id === null || f.n > 0 || f.id === filtro)
            .map((f) => {
              const activo = filtro === f.id;
              return (
                <Link
                  key={f.texto}
                  href={enlace(buscar, f.id)}
                  aria-current={activo ? 'page' : undefined}
                  className={`inline-flex min-h-12 items-center gap-1.5 rounded-[var(--radius-button)] px-3 text-[18px] font-bold ring-1 transition-transform active:scale-[0.98] ${
                    activo
                      ? 'bg-[var(--text-primary)] text-[#FBFCF9] ring-[var(--text-primary)]'
                      : 'bg-[var(--surface)] text-[var(--text-secondary)] ring-[var(--line)]'
                  }`}
                >
                  {f.texto} <Conteo n={num(f.n) ?? '0'} />
                </Link>
              );
            })}
        </nav>
      )}

      {aviso && !elegida && <Mensaje tono={aviso.tono}>{aviso.texto}</Mensaje>}

      {error ? (
        <Tarjeta>
          <p className="font-bold">No pudimos cargar la lista.</p>
          <p className="mt-1 text-[18px] text-[var(--text-secondary)]">
            Recarga la página en un momento. Si sigue así, pídele a Claude en tu proyecto que lo revise.
          </p>
        </Tarjeta>
      ) : clientes.length === 0 ? (
        <Tarjeta>
          <SinDatos
            motivo={
              buscar
                ? `Nadie con “${buscar}” en el correo${filtro ? ' en este grupo' : ''}. Revisa cómo está escrito.`
                : filtro
                  ? 'Nadie en este grupo por ahora.'
                  : 'Aún no hay clientes. Aparecen solas cuando Hotmart avisa de una compra o prueba gratis.'
            }
          />
        </Tarjeta>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {clientes.map((c) => {
              const est = ESTADO_CLIENTE[c.estado] ?? {
                texto: c.estado,
                tono: 'neutro' as const,
              };
              const acceso = c.tiene_acceso;
              const propio = elegida === c.id ? aviso : null;
              const devolvio = c.estado === 'refunded' || c.estado === 'chargeback';
              const cerrada = c.estado === 'cancelled' || c.estado === 'expired';
              const prueba = c.estado === 'trialing';
              return (
                <li key={c.id} id={`cliente-${c.id}`} className="entra scroll-mt-32">
                  <Tarjeta>
                    {/* El correo completo siempre se ve (se parte donde haga falta); la situación va debajo en el teléfono. */}
                    <div className="flex flex-col items-start gap-1 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between min-[480px]:gap-3">
                      <div className="min-w-0">
                        <p className="[font-family:var(--font-display)] text-[24px] font-semibold leading-snug [overflow-wrap:anywhere]">
                          {c.nombre ?? c.email}
                        </p>
                        {c.nombre && <p className="text-[var(--text-secondary)] [overflow-wrap:anywhere]">{c.email}</p>}
                      </div>
                      {/* "Pagando" no se repite: ya lo dice "Puede entrar". La pastilla queda para lo que pide mirar. */}
                      {!(c.estado === 'active' && acceso) && (
                        <Pastilla tono={est.tono} check={false}>
                          {est.texto}
                        </Pastilla>
                      )}
                    </div>
                    {/* Lo primero que importa: si hoy puede entrar a la app o no. */}
                    <p className={`mt-2 flex items-start gap-2 text-[18px] font-bold ${acceso ? 'text-[var(--ok)]' : 'text-[var(--text-secondary)]'}`}>
                      {acceso ? (
                        <span className="mt-[3px]">
                          <CheckTrazo tam={18} vivo={false} />
                        </span>
                      ) : (
                        <span aria-hidden="true" className="mx-1 mt-2 size-2.5 shrink-0 rounded-full bg-[var(--field-border)]" />
                      )}
                      {acceso
                        ? c.estado === 'cancelled' && c.acceso_hasta
                          ? `Puede entrar hasta el ${fecha(c.acceso_hasta)}`
                          : 'Puede entrar'
                        : cerrada && c.acceso_hasta
                          ? `Sin acceso desde el ${fecha(c.acceso_hasta)}`
                          : 'Sin acceso'}
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
                      <Dato t="Plan" v={c.ciclo === 'anual' ? 'Anual' : c.ciclo === 'mensual' ? 'Mensual' : null} />
                      <Dato t="Desde" v={fecha(c.primer_pago ?? c.alta)} />
                      <Dato t="Llegó por" v={c.origen ? nombreCanal(c.origen.split(':')[0].toLowerCase()) : null} />
                      <Dato t="Último uso" v={fecha(c.ultima_actividad)} />
                    </dl>

                    {propio && (
                      <div className="mt-3">
                        <Mensaje tono={propio.tono}>{propio.texto}</Mensaje>
                      </div>
                    )}

                    {c.se_puede_deshacer && (
                      <form
                        action={deshacerCambio}
                        className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-button)] bg-[var(--surface-2)] py-1 pr-1 pl-3"
                      >
                        <input type="hidden" name="cliente" value={c.id} />
                        <input type="hidden" name="volver" value={volver} />
                        <span className="text-[18px] leading-snug text-[var(--text-secondary)]">
                          Cambiaste su acceso a mano. Deshacer lo deja como estaba antes
                          {acceso ? ' (sin acceso)' : ' (con acceso)'}.
                        </span>
                        <BotonEnviar enviando="Deshaciendo…" tono="suave">
                          <Undo2 size={16} aria-hidden="true" /> Deshacer
                        </BotonEnviar>
                      </form>
                    )}

                    <details
                      className="group mt-3 -mb-2 border-t border-[var(--line)] pt-1"
                      open={propio?.tono === 'mal' && (q.error === 'motivo' || q.error === 'estado')}
                    >
                      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 text-[18px] font-bold text-[var(--text-primary)] select-none active:opacity-70 [&::-webkit-details-marker]:hidden">
                        {acceso ? 'Quitar acceso a mano' : 'Dar acceso a mano'}
                        <ChevronDown size={18} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <FormularioAdmin action={cambiarEstado} className="flex flex-col gap-3 pb-1">
                        <p className="text-[18px] leading-snug text-[var(--text-secondary)]">
                          {acceso
                            ? 'Deja de poder entrar desde ahora. Úsalo solo si Hotmart no avisó una baja o un reembolso.'
                            : 'Podrá entrar como clienta que paga. Úsalo solo si pagó y Hotmart no avisó.'}{' '}
                          Queda anotado con tu motivo y lo puedes deshacer.
                        </p>
                        {(!acceso && (devolvio || cerrada)) || prueba ? (
                          <p className="rounded-[var(--radius-button)] bg-[var(--warn-bg)] px-3 py-2.5 text-[18px] leading-snug text-[var(--warn)]">
                            <b>Ojo:</b>{' '}
                            {devolvio
                              ? `esta clienta ${c.estado === 'refunded' ? 'recibió su dinero de vuelta' : 'desconoció el cobro con su banco'}. Si le das acceso, lo usará sin pagar.`
                              : prueba
                                ? 'está en su prueba gratis. Si cambias su acceso a mano, deja de ser prueba y Hotmart ya no la manejará sola.'
                                : 'su acceso ya terminó. Si se lo das, queda como clienta que paga y no vence sola: tendrás que quitárselo a mano si no paga.'}
                          </p>
                        ) : null}
                        <input type="hidden" name="cliente" value={c.id} />
                        <input type="hidden" name="estado" value={acceso ? 'cancelled' : 'active'} />
                        <input type="hidden" name="volver" value={volver} />
                        <label className="flex flex-col gap-1.5">
                          <span className="text-[18px] font-bold">Motivo</span>
                          <input
                            name="motivo"
                            required
                            defaultValue={elegida === c.id ? motivoPrevio : undefined}
                            minLength={3}
                            maxLength={120}
                            placeholder={acceso ? 'Ej.: pidió la baja por correo' : 'Ej.: pagó y Hotmart no avisó'}
                            data-error="Escribe el motivo (al menos 3 letras): queda anotado por si después necesitas recordarlo."
                            className="campo"
                          />
                          <ErrorCampo nombre="motivo" />
                        </label>
                        {acceso && (
                          <label className="flex min-h-12 items-center gap-3 text-[18px]">
                            <input
                              type="checkbox"
                              name="confirmo"
                              required
                              data-error="Marca la casilla para confirmar."
                              className="size-6 shrink-0 accent-[var(--err)]"
                            />
                            <span>Sí, quitarle el acceso ahora</span>
                          </label>
                        )}
                        {acceso && <ErrorCampo nombre="confirmo" />}
                        <BotonEnviar enviando="Guardando…" tono={acceso ? 'peligro' : 'oscuro'} className="self-start">
                          {acceso ? 'Quitar acceso' : 'Dar acceso'}
                        </BotonEnviar>
                      </FormularioAdmin>
                    </details>
                  </Tarjeta>
                </li>
              );
            })}
          </ul>
          {clientes.length >= LIMITE && (
            <p className="text-[18px] text-[var(--text-secondary)]">Se muestran las {LIMITE} más recientes. Para encontrar a otra, búscala por su correo.</p>
          )}
        </>
      )}
    </div>
  );
}

function Mensaje({ tono, children }: { tono: 'bien' | 'mal'; children: string }) {
  return (
    <p
      role={tono === 'mal' ? 'alert' : 'status'}
      className={`flex items-start gap-2 rounded-[var(--radius-button)] px-3 py-2.5 text-[18px] font-bold leading-snug ${tono === 'bien' ? 'bg-[var(--ok-bg)] text-[var(--ok)]' : 'bg-[var(--err-bg)] text-[var(--err)]'}`}
    >
      {tono === 'bien' && (
        <span className="mt-px">
          <CheckTrazo tam={18} />
        </span>
      )}
      {children}
    </p>
  );
}

function Dato({ t, v }: { t: string; v: string | null }) {
  return (
    <div>
      <dt className="text-[13px] font-bold text-[var(--text-secondary)]">{t}</dt>
      <dd className={v ? '' : 'text-[var(--text-secondary)]'}>{v ?? 'Sin datos'}</dd>
    </div>
  );
}
