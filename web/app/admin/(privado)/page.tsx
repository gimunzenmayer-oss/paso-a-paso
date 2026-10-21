import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Avisos } from '@/components/admin/Avisos';
import { BarrasMeses, Embudo } from '@/components/admin/graficos';
import { SelectorMes } from '@/components/admin/SelectorMes';
import { LimpiarAviso } from '@/components/admin/interacciones';
import { MontoVivo } from '@/components/admin/MontoVivo';
import { Cifra, Pastilla, Plegable, PorMedir, Rejilla, Sello, Seccion, SinDatos, Subtitulo, Tarjeta, type Tono } from '@/components/admin/ui';
import { dinero, fecha, nombreMes, num, pct, tasa, usd } from '@/lib/admin/formato';
import { exigirAdmin } from '@/lib/admin/sesion';
import { FALTA, listaHumana, NOMBRE_EVENTO, nombreCanal, nombrePantalla, plural } from '@/lib/admin/textos';
import type { Panel } from '@/lib/admin/tipos';

export const dynamic = 'force-dynamic';

function ultimosMeses(desde: Date, n: number): string[] {
  const zona = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
  }).format(desde);
  const [a, m] = zona.split('-').map(Number);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.UTC(a, m - 1 - i, 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  });
}

// Una cifra del panel. Las que todavía no tienen datos no ocupan una tarjeta:
// se juntan en "N cifras todavía sin datos · por qué" al final de su sección.
type DefCifra = {
  etiqueta: string;
  valor: string | null;
  nota?: ReactNode;
  motivo: string;
};

function Cifras({ items, cols = 4 }: { items: DefCifra[]; cols?: 2 | 3 | 4 }) {
  const con = items.filter((c) => c.valor !== null);
  if (con.length === 0) return null;
  if (con.length === 1) {
    const c = con[0];
    return <Cifra etiqueta={c.etiqueta} valor={c.valor} nota={c.nota} motivo={c.motivo} />;
  }
  return (
    <Rejilla cols={con.length >= 4 ? cols : con.length === 3 ? 3 : 2}>
      {con.map((c) => (
        <Cifra key={c.etiqueta} etiqueta={c.etiqueta} valor={c.valor} nota={c.nota} motivo={c.motivo} />
      ))}
    </Rejilla>
  );
}

const sinDatos = (items: DefCifra[]) => items.filter((c) => c.valor === null).map((c) => ({ que: c.etiqueta, porque: c.motivo }));

// Atajos a cada sección (la página es larga en el teléfono).
// Cada atajo lleva el mismo nombre que el título de su sección.
const SECCIONES = [
  ['ganancia', 'Cuánto te quedó'],
  ['ventas', 'Ventas'],
  ['negocio', 'Anuncios'],
  ['uso', 'Uso de la app'],
  ['salud', 'Salud de la app'],
] as const;

export default async function Resumen({ searchParams }: PageProps<'/admin'>) {
  const q = await searchParams;
  const meses = ultimosMeses(new Date(), 12);
  const mesPedido = typeof q.mes === 'string' && meses.includes(q.mes) ? q.mes : meses[0];

  const { supabase } = await exigirAdmin();
  const { data, error } = await supabase.rpc('admin_panel', {
    p_mes: `${mesPedido}-01`,
  });
  if (error?.code === '42501') redirect('/admin/verificar');
  if (error || !data) {
    console.error('[admin] el panel no cargó', error?.code);
    return (
      <Tarjeta>
        <p className="font-bold">No pudimos cargar tus cifras ahora.</p>
        <p className="mt-1 text-[18px] text-[var(--text-secondary)]">
          Intenta de nuevo en un momento. Si sigue así, pídele a Claude en tu proyecto que lo revise.
        </p>
        <Link
          href={`/admin?mes=${mesPedido}`}
          className="mt-3 inline-flex min-h-12 items-center rounded-[var(--radius-button)] bg-[var(--surface-2)] px-4 font-bold active:scale-[0.98]"
        >
          Intentar de nuevo
        </Link>
      </Tarjeta>
    );
  }
  const p = data as Panel;
  const m = p.moneda;
  const sinHotmart = p.salud.webhook.nunca_recibido;
  const motivoHotmart = 'Hotmart todavía no está conectado: aparece con la primera venta.';
  const sinUso = p.usuarios.personas === 0;
  const motivoUso = 'La app todavía no ha enviado datos de uso.';
  const n = p.negocio;

  const ventas: DefCifra[] = [
    {
      etiqueta: 'Pagando hoy',
      valor: sinHotmart ? null : num(p.ventas.pagando_hoy),
      nota:
        p.clientes.en_prueba > 0
          ? `y ${num(p.clientes.en_prueba)} en prueba gratis`
          : plural(p.ventas.pagando_hoy, 'clienta con su pago al día', 'clientas con su pago al día'),
      motivo: motivoHotmart,
    },
    {
      etiqueta: 'Ingreso mensual',
      valor: sinHotmart ? null : p.ventas.pagando_hoy === 0 ? dinero(0, m) : dinero(p.ventas.mrr, m),
      nota: 'lo que entra cada mes si nadie cancela',
      motivo: motivoHotmart,
    },
    {
      etiqueta: 'Compras nuevas',
      valor: sinHotmart ? null : num(p.ventas.compras),
      nota: `${num(p.ventas.renovaciones)} ${plural(p.ventas.renovaciones, 'renovación', 'renovaciones')} · ${num(p.clientes.regresos_mes)} ${plural(p.clientes.regresos_mes, 'volvió', 'volvieron')}`,
      motivo: motivoHotmart,
    },
    {
      etiqueta: 'Pagan tras la prueba',
      valor: tasa(p.ventas.prueba_a_pago.pct, p.ventas.prueba_a_pago.base),
      nota:
        p.ventas.prueba_a_pago.base < 5
          ? `${plural(p.ventas.prueba_a_pago.base, 'prueba terminada', 'pruebas terminadas')}: aún son muy pocas para sacar un %`
          : `de ${num(p.ventas.prueba_a_pago.base)} pruebas terminadas · ${num(p.ventas.pruebas_iniciadas)} ${plural(p.ventas.pruebas_iniciadas, 'empezó', 'empezaron')} este mes`,
      motivo: 'Aún no termina ninguna prueba gratis de 7 días.',
    },
  ];

  const negocio: DefCifra[] = [
    {
      etiqueta: 'Lo que vale una clienta',
      valor: dinero(n.ltv, m),
      nota: 'lo que te deja mientras se queda',
      motivo: 'Se calcula cuando haya clientas pagando y al menos un mes con bajas.',
    },
    {
      etiqueta: 'Costo por clienta',
      valor: dinero(n.cac, m),
      nota:
        n.gasto_adquisicion !== null
          ? `gastaste ${dinero(n.gasto_adquisicion, m)} en anuncios y ${plural(n.nuevos_con_anuncios, 'llegó', 'llegaron')} ${num(n.nuevos_con_anuncios)} por ahí`
          : undefined,
      motivo:
        n.gasto_adquisicion === null
          ? 'Anota tu gasto en anuncios en Costos y ajustes.'
          : 'Ninguna clienta nueva llegó por los canales donde pagaste anuncios.',
    },
    {
      etiqueta: 'Valor ÷ costo',
      valor: n.ltv_cac === null ? null : `${num(n.ltv_cac)} a 1`,
      nota:
        n.ltv_cac === null ? undefined : n.ltv_cac >= 3 ? (
          <Pastilla tono="bien">Sano: 3 a 1 o más</Pastilla>
        ) : (
          <Pastilla tono={n.ltv_cac < 1 ? 'mal' : 'aviso'}>Lo sano es 3 a 1 o más</Pastilla>
        ),
      motivo: 'Necesita saber lo que vale una clienta y lo que cuesta conseguirla.',
    },
    {
      etiqueta: 'Lo recuperas en',
      valor: n.payback_meses === null ? null : `${num(n.payback_meses)} ${plural(n.payback_meses, 'mes', 'meses')}`,
      // Solo se califica cuando también se sabe cuánto vale una clienta; si no, sería un "bien" a ciegas.
      nota:
        n.payback_meses === null ? undefined : (
          <>
            <span className="block">
              {dinero(n.cac, m)} que costó cada clienta ÷ {dinero(n.arpu, m)} que paga al mes una clienta promedio
            </span>
            {n.payback_meses >= 12 ? (
              <Pastilla tono="mal">Muy lento: lo sano es menos de 6</Pastilla>
            ) : n.payback_meses >= 6 ? (
              <Pastilla tono="aviso">Lento: lo sano es menos de 6</Pastilla>
            ) : n.ltv === null ? (
              'lo sano es menos de 6 meses'
            ) : (
              <Pastilla tono="bien">Bien: menos de 6 meses</Pastilla>
            )}
          </>
        ),
      motivo: 'Necesita el costo por clienta y el ingreso mensual.',
    },
  ];

  const usuarios: DefCifra[] = [
    {
      etiqueta: 'Pasos de rutina completados · 30 días',
      valor: sinUso ? null : num(p.uso.accion_principal.mes),
      nota:
        p.uso.accion_principal.mes === p.uso.accion_principal.hoy
          ? 'todos fueron hoy'
          : `${num(p.uso.accion_principal.semana)} en los últimos 7 días · ${num(p.uso.accion_principal.hoy)} hoy`,
      motivo: motivoUso,
    },
    {
      etiqueta: 'Usaron la app (30 días)',
      valor: sinUso ? null : num(p.usuarios.mes),
      nota: p.usuarios.mes === p.usuarios.hoy ? 'todas la usaron hoy' : `${num(p.usuarios.semana)} esta semana · ${num(p.usuarios.hoy)} hoy`,
      motivo: motivoUso,
    },
    {
      etiqueta: 'Se activaron',
      valor: tasa(p.usuarios.activacion.pct, p.usuarios.activacion.base),
      nota:
        p.usuarios.activacion.base < 5 ? 'terminaron una rutina su primer día' : `terminaron una rutina su primer día (de ${num(p.usuarios.activacion.base)})`,
      motivo: sinUso ? motivoUso : 'Se mide al día siguiente de abrir la app por primera vez.',
    },
    {
      etiqueta: 'Vuelven cada semana',
      valor: tasa(p.usuarios.curr.pct, p.usuarios.curr.base),
      nota: p.usuarios.curr.base < 5 ? 'de quienes la usaron la semana anterior' : `de ${num(p.usuarios.curr.base)} que la usaron la semana anterior`,
      motivo: sinUso ? motivoUso : 'Se necesitan 2 semanas completas de uso.',
    },
    {
      etiqueta: 'Pagan y no la usan',
      valor: p.usuarios.pagadores_fantasma === null ? null : num(p.usuarios.pagadores_fantasma),
      motivo: 'Se activa cuando las clientas entren a la app con su cuenta (etapa de inicio de sesión).',
    },
  ];
  const ret = p.usuarios.retencion;
  const sinRetencion = ret.d1.pct === null && ret.d7.pct === null && ret.d30.pct === null;

  const porMedirUso = [
    ...(p.uso.onboarding
      ? []
      : [
          {
            que: 'Bienvenida y precios',
            porque: 'La bienvenida y la pantalla de precios todavía no existen en la app.',
          },
        ]),
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="entra flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="[font-family:var(--font-display)] text-[36px] font-semibold leading-tight capitalize">{nombreMes(p.mes)}</h1>
          <p className="text-[18px] text-[var(--text-secondary)]">
            Actualizado {fecha(p.generado, true)} · <span className="whitespace-nowrap">hora de Chile</span>
          </p>
        </div>
        <SelectorMes actual={p.mes} meses={meses} />
      </div>
      <LimpiarAviso />
      {q.hola === '1' && (
        <p role="status" className="entra -mt-6 flex items-center gap-2.5 rounded-[var(--radius-card)] bg-[var(--ok-bg)] px-4 py-3 font-bold text-[var(--ok)]">
          <Sello tam={28} vivo /> Entraste. Tu panel queda protegido con tu código.
        </p>
      )}
      <nav id="indice" aria-label="Ir a una sección" className="entra -mt-6 flex scroll-mt-36 flex-wrap gap-2">
        {SECCIONES.map(([id, texto]) => (
          <a
            key={id}
            href={`#${id}`}
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--surface)] px-3.5 text-[18px] font-bold text-[var(--text-secondary)] ring-1 ring-[var(--line)] active:scale-[0.98]"
          >
            {texto}
          </a>
        ))}
      </nav>

      <Avisos avisos={p.avisos} moneda={m} />

      {/* ═══ GANANCIA REAL ═══ */}
      <Seccion indice id="ganancia" titulo="Cuánto te quedó" bajada="Lo que facturaste menos todo lo que costó vender y operar la app.">
        <Ganancia p={p} sinHotmart={sinHotmart} />
      </Seccion>

      {/* ═══ VENTAS ═══ */}
      <Seccion indice id="ventas" titulo="Ventas" bajada="Compras, bajas y reembolsos del mes.">
        <Cifras items={ventas} />
        <div className="grid gap-3 md:grid-cols-[1fr_1.4fr]">
          <Bajas p={p} sinHotmart={sinHotmart} />
          <Tarjeta>
            <Subtitulo>Lo que te pagó Hotmart, mes a mes</Subtitulo>
            <p className="text-[18px] leading-snug text-[var(--text-secondary)]">Ya sin comisiones ni reembolsos: es lo que llega a tu cuenta.</p>
            <div className="mt-2">{p.ventas.hay_ventas ? <BarrasMeses serie={p.ventas.serie} moneda={m} /> : <SinDatos motivo={motivoHotmart} />}</div>
          </Tarjeta>
        </div>
        {p.ventas.otras_monedas.length > 0 && (
          <Tarjeta>
            <p className="text-[18px]">
              <b>Ventas en otras monedas</b> (no se suman a las de arriba):{' '}
              {p.ventas.otras_monedas.map((o) => `${dinero(o.te_paga, o.moneda)} en ${num(o.ventas)} ${plural(o.ventas, 'venta', 'ventas')}`).join(' · ')}
            </p>
          </Tarjeta>
        )}
      </Seccion>

      {/* ═══ NEGOCIO ═══ */}
      <Seccion indice id="negocio" titulo="Anuncios" bajada="¿Conviene invertir? Cuánto vale una clienta, cuánto cuesta conseguirla y qué canal te deja plata.">
        <Canales p={p} />
        <Cifras items={negocio} />
      </Seccion>

      {/* ═══ USUARIOS Y USO ═══ */}
      <Seccion
        indice
        id="uso"
        titulo="Uso de la app"
        bajada="Cada teléfono cuenta una vez, sin nombres: la app no sabe quién es quién. Lo principal es completar los pasos de una rutina."
      >
        <Cifras items={usuarios} />
        {!sinRetencion && (
          <Tarjeta>
            <Subtitulo>¿Vuelven después de su primer día?</Subtitulo>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {(['d1', 'd7', 'd30'] as const).map((d) => {
                const r = ret[d];
                const dias = d.slice(1);
                return (
                  <div key={d}>
                    <p className="text-[18px] text-[var(--text-secondary)]">{dias === '1' ? 'Al día siguiente' : `A los ${dias} días`}</p>
                    {r.pct === null ? (
                      <SinDatos motivo={r.base === 0 ? `Nadie lleva ${dias} ${plural(Number(dias), 'día', 'días')} aún.` : ''} />
                    ) : (
                      <p className="[font-family:var(--font-display)] text-[24px] font-semibold tabular-nums">
                        {r.base < 5 ? tasa(r.pct, r.base) : pct(r.pct)}{' '}
                        {r.base >= 5 && <span className="text-[18px] font-normal text-[var(--text-secondary)]">de {num(r.base)}</span>}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Tarjeta>
        )}
        {sinUso ? (
          <Tarjeta>
            <SinDatos motivo={motivoUso} />
          </Tarjeta>
        ) : (
          <>
            <div className={`grid gap-3 ${p.uso.onboarding ? 'md:grid-cols-2' : ''}`}>
              <Tarjeta>
                <Subtitulo>De la página de ventas a la primera rutina · 30 días</Subtitulo>
                <p className="mt-0.5 text-[18px] text-[var(--text-secondary)]">Siguiendo a las mismas personas, paso a paso.</p>
                <div className="mt-3">
                  {p.uso.embudo.every((x) => x.personas === 0) ? (
                    <SinDatos motivo="Nadie ha llegado todavía desde la página de ventas." />
                  ) : (
                    <Embudo pasos={p.uso.embudo} />
                  )}
                </div>
              </Tarjeta>
              {p.uso.onboarding && (
                <Tarjeta>
                  <Subtitulo>Bienvenida y precios · 30 días</Subtitulo>
                  <div className="mt-3">
                    <Embudo pasos={p.uso.onboarding} />
                  </div>
                </Tarjeta>
              )}
            </div>
            {p.uso.eventos.length > 0 && (
              <Plegable caja titulo="Ver todo lo que hicieron · 30 días">
                <p className="text-[18px] text-[var(--text-secondary)]">Cuenta a todas, hayan llegado o no por la página de ventas.</p>
                <table className="mt-1 mb-3 w-full text-[18px]">
                  <thead className="sr-only">
                    <tr>
                      <th>Qué</th>
                      <th>Veces</th>
                      <th>Personas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.uso.eventos.map((e) => (
                      <tr key={e.tipo} className="border-t border-[var(--line)] first:border-0">
                        <td className="py-2 pr-2">{NOMBRE_EVENTO[e.tipo] ?? e.tipo}</td>
                        <td className="py-2 text-right font-bold tabular-nums">{num(e.veces)}</td>
                        <td className="whitespace-nowrap py-2 pl-3 text-right text-[var(--text-secondary)] tabular-nums">
                          {num(e.personas)} {plural(e.personas, 'persona', 'personas')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Plegable>
            )}
          </>
        )}
      </Seccion>

      {/* ═══ IA (solo si la app la usa; si no, su costo es 0 y figura en "Ver cada costo") ═══ */}
      {p.ia.usa_ia && (
        <Seccion id="ia" titulo="Inteligencia artificial">
          <>
            <Rejilla cols={3}>
              <Cifra etiqueta="Gasto de hoy" valor={usd(p.ia.costo_hoy_usd ?? 0, 4)} />
              <Cifra etiqueta="Gasto del mes" valor={usd(p.ia.costo_mes_usd ?? 0)} />
              <Cifra etiqueta="Por persona" valor={usd(p.ia.por_usuario_usd, 4)} motivo="Nadie usó la IA este mes." />
            </Rejilla>
            <Tarjeta>
              <ul className="flex flex-col gap-1.5 text-[18px]">
                {p.ia.por_feature.map((f) => (
                  <li key={f.feature} className="flex justify-between gap-3">
                    <span>{f.feature}</span>
                    <span className="tabular-nums">
                      <b>{usd(f.costo_usd, 4)}</b>{' '}
                      <span className="text-[var(--text-secondary)]">
                        · {num(f.llamadas)} {plural(f.llamadas, 'uso', 'usos')}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Tarjeta>
          </>
        </Seccion>
      )}

      {/* ═══ SALUD / ERRORES ═══ */}
      <Seccion indice id="salud" titulo="Salud de la app" bajada="Fallas en la app y avisos de pago de Hotmart.">
        <Salud p={p} />
      </Seccion>

      {/* Todo lo que aún no se puede medir, junto en un solo lugar y plegado. */}
      <PorMedir
        items={[
          ...sinDatos(ventas).map((x) => ({ ...x, que: `Ventas · ${x.que}` })),
          ...sinDatos(negocio).map((x) => ({
            ...x,
            que: `Anuncios · ${x.que}`,
          })),
          ...sinDatos(usuarios).map((x) => ({
            ...x,
            que: `Uso · ${x.que}`,
          })),
          ...(sinRetencion
            ? [
                {
                  que: 'Uso · ¿Vuelven después de su primer día?',
                  porque: sinUso ? motivoUso : 'Se mide cuando alguien lleve al menos 1 día con la app.',
                },
              ]
            : []),
          ...porMedirUso.map((x) => ({ ...x, que: `Uso · ${x.que}` })),
          {
            que: 'Salud · Diferencias con tu cuenta de Hotmart',
            porque: 'Una revisión semanal que compara las ventas del panel con las de tu cuenta. Se activa cuando conectemos tu cuenta de Hotmart al panel.',
          },
        ]}
      />
    </div>
  );
}

function Fila({
  texto,
  monto,
  moneda,
  signo = '−',
  fuerte = false,
  nota,
}: {
  texto: string;
  monto: number | null;
  moneda: string;
  signo?: string;
  fuerte?: boolean;
  nota?: string;
}) {
  // Restar un monto negativo (p. ej. comisiones devueltas por un reembolso) se muestra como suma.
  const valor = monto === null ? null : signo === '−' && monto < 0 ? `+ ${dinero(-monto, moneda)}` : `${signo} ${dinero(monto, moneda)}`.trim();
  return (
    <div
      className={`flex items-baseline justify-between gap-3 py-2 ${fuerte ? 'border-t-2 border-[var(--text-primary)] pt-3' : 'border-t border-[var(--line)] first:border-0'}`}
    >
      <span className={fuerte ? 'font-bold' : ''}>
        {texto}
        {nota && <span className="block text-[18px] text-[var(--text-secondary)]">{nota}</span>}
      </span>
      <span className={`shrink-0 tabular-nums ${fuerte ? 'text-[24px] font-bold' : ''} ${valor === null ? 'text-[18px] text-[var(--text-secondary)]' : ''}`}>
        {valor ?? 'Sin datos'}
      </span>
    </div>
  );
}

// Suma que respeta "sin datos": si falta una parte, el grupo lo dice en vez de inventar un cero.
function suma(...v: (number | null)[]): number {
  return v.reduce<number>((a, b) => a + (b ?? 0), 0);
}

function Ganancia({ p, sinHotmart }: { p: Panel; sinHotmart: boolean }) {
  const g = p.ganancia;
  const m = p.moneda;
  if (!p.ventas.hay_ventas) {
    return (
      <Tarjeta className="p-5 sm:p-6">
        <p className="[font-family:var(--font-display)] text-[24px] font-semibold leading-snug">Aún no hay ventas.</p>
        <p className="mt-1 text-[var(--text-secondary)]">
          {sinHotmart ? 'Hotmart todavía no está conectado.' : 'Hotmart está conectado y esperando la primera compra.'} Cuando llegue, aquí verás cuánto
          facturaste y cuánto te quedó limpio.
        </p>
      </Tarjeta>
    );
  }
  const faltan = g.faltan.map((f) => FALTA[f] ?? f);
  const operar = suma(g.ia, g.infra, g.email, g.otros);
  const faltaOperar = [g.infra === null && 'servidores', g.email === null && 'correos'].filter(Boolean) as string[];
  const margenTono: Tono = g.margen_pct === null ? 'neutro' : g.margen_pct <= 0 ? 'mal' : g.margen_pct < 30 ? 'aviso' : 'bien';
  return (
    <Tarjeta className="p-5 sm:p-6">
      {/* La frase principal: solo lo que quedó (lo facturado ya está en la primera fila de abajo). */}
      <p className="[font-family:var(--font-display)] text-[36px] font-semibold leading-tight">
        {g.queda < 0 ? (
          <>
            Perdiste{' '}
            <span className="tabular-nums text-[var(--err)]">
              <MontoVivo monto={-g.queda} moneda={m} />
            </span>
            .
          </>
        ) : (
          <>
            Te quedaron{' '}
            <span className="tabular-nums text-[var(--accent)]">
              <MontoVivo monto={g.queda} moneda={m} />
            </span>{' '}
            limpios.
          </>
        )}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {g.margen_pct !== null && <Pastilla tono={margenTono}>Margen {pct(g.margen_pct)}</Pastilla>}
        {g.estimacion && <Pastilla tono="aviso">Estimación</Pastilla>}
      </div>
      {g.estimacion && (
        <p className="mt-2 text-[18px] leading-snug text-[var(--text-secondary)]">
          Es una estimación porque falta {listaHumana(faltan)}.{' '}
          <Link href="/admin/costos" className="font-bold text-[var(--text-primary)] underline underline-offset-4">
            Complétalo en Costos y ajustes
          </Link>
          .
        </p>
      )}
      <div className="mt-4">
        <Fila texto="Facturaste" nota="sin reembolsos" monto={g.facturado} moneda={m} signo="" />
        <Fila texto="Hotmart y afiliadas" monto={suma(g.hotmart, g.afiliados)} moneda={m} />
        <Fila
          texto="Impuestos"
          monto={g.impuestos}
          moneda={m}
          nota={g.tasa_impuestos_pct === null ? 'falta tu tasa' : `${pct(g.tasa_impuestos_pct)} de lo facturado`}
        />
        <Fila
          texto="Costos de la app"
          monto={operar}
          moneda={m}
          nota={faltaOperar.length > 0 ? `falta anotar ${listaHumana(faltaOperar)}` : 'servidores, correos e IA'}
        />
        <Fila texto="Te quedó" monto={g.queda} moneda={m} signo="=" fuerte />
      </div>
      <Plegable titulo="Ver cada costo" className="mt-2">
        <div className="mt-1 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 py-1 text-[18px]">
          <Fila texto="Comisión de Hotmart" monto={g.hotmart} moneda={m} />
          <Fila texto="Afiliadas" monto={g.afiliados} moneda={m} />
          <Fila texto="Inteligencia artificial" monto={g.ia} moneda={m} nota={g.usa_ia ? undefined : 'la app no usa IA'} />
          <Fila texto="Servidores y base de datos" monto={g.infra} moneda={m} />
          <Fila texto="Envío de correos" monto={g.email} moneda={m} />
          {g.otros !== null && <Fila texto="Otros gastos" monto={g.otros} moneda={m} />}
        </div>
      </Plegable>
    </Tarjeta>
  );
}

function Bajas({ p, sinHotmart }: { p: Panel; sinHotmart: boolean }) {
  const v = p.ventas;
  const total = v.cancelaciones_voluntarias + v.cancelaciones_involuntarias;
  const reemb = v.reembolsos + v.contracargos;
  return (
    <Tarjeta className="flex flex-col gap-2">
      {sinHotmart ? (
        <>
          <Subtitulo>Bajas del mes</Subtitulo>
          <SinDatos motivo={'Hotmart todavía no está conectado: aparece con la primera venta.'} />
        </>
      ) : (
        <>
          {/* Igual que las demás cifras: etiqueta a la izquierda, número a la derecha. */}
          <div className="flex items-baseline justify-between gap-3">
            <Subtitulo>Bajas del mes</Subtitulo>
            <p className="shrink-0 [font-family:var(--font-display)] text-[24px] font-semibold leading-tight tabular-nums">
              {num(total)} {plural(total, 'clienta', 'clientas')}
            </p>
          </div>
          <p className="text-[18px] leading-snug text-[var(--text-secondary)]">
            {v.churn_pct !== null
              ? `${pct(v.churn_pct)} de las ${num(v.activos_inicio_mes)} que pagaban al empezar el mes.`
              : total > 0
                ? 'El % de bajas aún no se puede sacar: quienes se fueron empezaron a pagar este mismo mes.'
                : 'Nadie se dio de baja este mes.'}
          </p>
          {total > 0 && (
            <div className="mt-1 flex flex-col gap-2 text-[18px]">
              <div className="flex h-3 gap-[2px] overflow-hidden rounded-full" aria-hidden="true">
                {v.cancelaciones_voluntarias > 0 && (
                  <div
                    className="crece-x h-full bg-[var(--accent-2)]"
                    style={{
                      width: `${(100 * v.cancelaciones_voluntarias) / total}%`,
                      animationDelay: '120ms',
                    }}
                  />
                )}
                {v.cancelaciones_involuntarias > 0 && (
                  <div
                    className="crece-x h-full bg-[var(--err)]"
                    style={{
                      width: `${(100 * v.cancelaciones_involuntarias) / total}%`,
                      animationDelay: '180ms',
                    }}
                  />
                )}
              </div>
              <p>
                <span className="mr-1.5 inline-block size-2.5 rounded-full bg-[var(--accent-2)]" aria-hidden="true" />
                <b>{num(v.cancelaciones_voluntarias)}</b> {plural(v.cancelaciones_voluntarias, 'decidió', 'decidieron')} cancelar.{' '}
                <span className="text-[var(--text-secondary)]">Qué hacer: preguntar por qué y mejorar la app.</span>
              </p>
              <p>
                <span className="mr-1.5 inline-block size-2.5 rounded-full bg-[var(--err)]" aria-hidden="true" />
                <b>{num(v.cancelaciones_involuntarias)}</b> {plural(v.cancelaciones_involuntarias, 'se fue', 'se fueron')} porque su pago falló.{' '}
                <span className="text-[var(--text-secondary)]">Qué hacer: recordarles y reintentar el cobro.</span>
              </p>
            </div>
          )}
          <p className="mt-1 border-t border-[var(--line)] pt-2 text-[18px]">
            {reemb === 0 ? (
              'Nadie pidió su dinero de vuelta.'
            ) : (
              <>
                <b>
                  {num(reemb)} {plural(reemb, 'reembolso', 'reembolsos')}
                </b>
                : devolviste {dinero(v.reembolsado, p.moneda)}.
              </>
            )}
          </p>
        </>
      )}
    </Tarjeta>
  );
}

// Por canal: una fila por canal con la ganancia grande y, debajo, de dónde sale (se lee igual en el teléfono).
function Canales({ p }: { p: Panel }) {
  const m = p.moneda;
  const canales = p.negocio.canales;
  return (
    <Tarjeta>
      <Subtitulo>Ganancia por canal · este mes</Subtitulo>
      {canales.length === 0 ? (
        <div className="mt-2">
          <SinDatos motivo="Aparece cuando haya ventas o anotes gasto en anuncios. El canal sale del enlace con que llegó cada clienta." />
        </div>
      ) : (
        <ul className="mt-1 flex flex-col">
          {canales.map((c) => {
            const pierde = (c.ganancia ?? 0) < 0;
            return (
              <li key={c.canal} className="flex items-start justify-between gap-3 border-t border-[var(--line)] py-2.5 first:border-0">
                <div className="min-w-0">
                  <p className="font-bold">{nombreCanal(c.canal)}</p>
                  <p className="text-[18px] leading-snug text-[var(--text-secondary)]">
                    <span className="whitespace-nowrap">{c.gasto !== null ? `Gastaste ${dinero(c.gasto, m)}` : 'Sin gasto en anuncios'}</span> ·{' '}
                    <span className="whitespace-nowrap">te pagaron {dinero(c.ingresos ?? 0, m)}</span> ·{' '}
                    <span className="whitespace-nowrap">
                      {num(c.clientes_nuevos)} {plural(c.clientes_nuevos, 'nueva', 'nuevas')}
                    </span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`font-bold tabular-nums ${pierde ? 'text-[var(--err)]' : ''}`}>{dinero(c.ganancia, m) ?? 'Sin datos'}</p>
                  {pierde && <Pastilla tono="mal">Pierde plata</Pastilla>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Tarjeta>
  );
}

function Salud({ p }: { p: Panel }) {
  const w = p.salud.webhook;
  const fallos = w.no_autorizados_24h + w.errores_24h;
  return (
    <>
      <Tarjeta className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Subtitulo>Avisos de pago de Hotmart</Subtitulo>
          {!w.nunca_recibido &&
            (fallos === 0 ? (
              <Pastilla tono="bien">Funcionando</Pastilla>
            ) : (
              // Rojo solo cuando falla seguido (lo mismo que dispara el aviso de arriba); un fallo suelto es amarillo.
              <Pastilla tono={fallos >= 3 ? 'mal' : 'aviso'}>
                {num(fallos)} {plural(fallos, 'falló', 'fallaron')} en 24 h
              </Pastilla>
            ))}
        </div>
        {w.nunca_recibido ? (
          <SinDatos motivo="Todavía no llega ningún aviso de Hotmart. Se conecta al publicar la app." />
        ) : (
          <>
            <p className="text-[18px] leading-snug text-[var(--text-secondary)]">
              Último pago: {fecha(w.ultimo_aplicado, true) ?? 'ninguno'} · {num(w.aplicados_7d)} {plural(w.aplicados_7d, 'aviso', 'avisos')} bien esta semana.
            </p>
            {(fallos > 0 || w.rechazados_7d > 0) && (
              <Plegable titulo="Qué revisar">
                <div className="flex flex-col gap-1.5 pb-1 text-[18px] leading-snug text-[var(--text-secondary)]">
                  {fallos > 0 && (
                    <p>
                      {fallos >= 3
                        ? 'Falla seguido: puede haber pagos que no le dieron acceso a la clienta.'
                        : 'Un fallo suelto suele arreglarse solo: Hotmart vuelve a intentar.'}{' '}
                      Si se repite, en Hotmart entra a Herramientas → Webhook y revisa que la conexión esté activa.
                    </p>
                  )}
                  {w.rechazados_7d > 0 && (
                    <p>
                      {num(w.rechazados_7d)} {plural(w.rechazados_7d, 'aviso no era válido y se ignoró', 'avisos no eran válidos y se ignoraron')}. No afecta a
                      tus clientas.
                    </p>
                  )}
                </div>
              </Plegable>
            )}
          </>
        )}
      </Tarjeta>
      <Tarjeta>
        <Subtitulo>Fallas que vio la gente · últimos 7 días</Subtitulo>
        {p.salud.errores.length === 0 ? (
          <p className="mt-2 flex items-center gap-2">
            <Pastilla tono="bien">Sin fallas</Pastilla> <span className="text-[18px] text-[var(--text-secondary)]">nadie chocó con un error esta semana.</span>
          </p>
        ) : (
          <>
            <p className="mt-0.5 text-[18px] leading-snug text-[var(--text-secondary)]">
              Qué hacer: si una falla le pasa a varias personas o se repite, pídele a Claude en tu proyecto que la arregle. El detalle técnico es para eso.
            </p>
            <ul className="mt-2 flex flex-col">
              {p.salud.errores.map((e, i) => (
                <li key={i} className="border-t border-[var(--line)] py-2.5 first:border-0">
                  <p className="font-bold">Falla en {nombrePantalla(e.pantalla)}</p>
                  <p className="text-[18px] text-[var(--text-secondary)]">
                    Le pasó a {num(e.personas)} {plural(e.personas, 'persona', 'personas')}, {num(e.veces)} {plural(e.veces, 'vez', 'veces')} · la última, el{' '}
                    {fecha(e.ultima, true)}
                  </p>
                  <Plegable titulo="Detalle técnico">
                    <code className="block break-words rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 py-2 text-[13px]">{e.mensaje}</code>
                  </Plegable>
                </li>
              ))}
            </ul>
          </>
        )}
      </Tarjeta>
    </>
  );
}
