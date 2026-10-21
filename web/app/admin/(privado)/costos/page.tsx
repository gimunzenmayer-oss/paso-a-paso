import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Undo2 } from 'lucide-react';
import { BotonEnviar, ErrorCampo, FormularioAdmin } from '@/components/admin/formularios';
import { Borrar, CanalAnuncio, LimpiarAviso, TipoCosto } from '@/components/admin/interacciones';
import { MontoVivo } from '@/components/admin/MontoVivo';
import { CheckTrazo, Plegable, Seccion, Tarjeta, TiraPasos } from '@/components/admin/ui';
import { dinero, fecha, nombreMes } from '@/lib/admin/formato';
import { exigirAdmin } from '@/lib/admin/sesion';
import { nombreCanal } from '@/lib/admin/textos';
import { guardarAjustes, guardarCosto, guardarGasto, restaurarRegistro } from '../acciones';

export const dynamic = 'force-dynamic';

type Registros = {
  ajustes: {
    main_currency: string;
    tax_rate_pct: number | null;
    hotmart_product_ids: string[];
    timezone: string;
    updated_at: string;
  };
  gastos: {
    id: number;
    channel: string;
    amount_minor: number;
    currency: string;
    period_start: string;
    period_end: string;
    note: string | null;
  }[];
  costos: {
    id: number;
    kind: 'infra' | 'email' | 'otro';
    amount_minor: number;
    currency: string;
    month: string;
    note: string | null;
  }[];
};

// Nombre corto para la lista; en el selector va la explicación completa.
const TIPO = {
  infra: 'Servidores',
  email: 'Correos',
  otro: 'Otro gasto',
} as const;
const TIPO_LARGO = {
  infra: 'Servidores y base de datos',
  email: 'Envío de correos',
  otro: 'Otro gasto',
} as const;

const CANALES = [
  { v: 'meta', t: 'Facebook o Instagram (Meta)' },
  { v: 'tiktok', t: 'TikTok' },
  { v: 'google', t: 'Google' },
  { v: 'youtube', t: 'YouTube' },
  { v: 'afiliado', t: 'Afiliadas' },
  { v: 'otro', t: 'Otro' },
];

const MONEDAS = [
  { v: 'USD', t: 'Dólares (USD)' },
  { v: 'CLP', t: 'Pesos chilenos (CLP)' },
  { v: 'MXN', t: 'Pesos mexicanos (MXN)' },
  { v: 'COP', t: 'Pesos colombianos (COP)' },
  { v: 'ARS', t: 'Pesos argentinos (ARS)' },
  { v: 'PEN', t: 'Soles (PEN)' },
  { v: 'BRL', t: 'Reales (BRL)' },
  { v: 'EUR', t: 'Euros (EUR)' },
];

// Cada mensaje aparece dentro de la sección que lo causó.
const MENSAJES: Record<
  string,
  {
    seccion: 'mensuales' | 'anuncios' | 'ajustes';
    tono: 'bien' | 'mal';
    texto: string;
  }
> = {
  'ok:ajustes': {
    seccion: 'ajustes',
    tono: 'bien',
    texto: 'Ajustes guardados. El resumen ya los usa.',
  },
  'ok:gasto': {
    seccion: 'anuncios',
    tono: 'bien',
    texto: 'Gasto en anuncios anotado. Si ese canal y mes ya tenían monto, quedó el nuevo.',
  },
  'ok:costo': {
    seccion: 'mensuales',
    tono: 'bien',
    texto: 'Costo del mes anotado.',
  },
  'ok:borrar-costo': {
    seccion: 'mensuales',
    tono: 'bien',
    texto: 'Costo borrado.',
  },
  'ok:borrar-gasto': {
    seccion: 'anuncios',
    tono: 'bien',
    texto: 'Gasto borrado.',
  },
  'ok:restaurado-costo': {
    seccion: 'mensuales',
    tono: 'bien',
    texto: 'Listo: el costo volvió a la lista.',
  },
  'ok:restaurado-gasto': {
    seccion: 'anuncios',
    tono: 'bien',
    texto: 'Listo: el gasto volvió a la lista.',
  },
  'error:restaurar-costo': {
    seccion: 'mensuales',
    tono: 'mal',
    texto: 'No pudimos deshacer el borrado. Vuelve a anotarlo con el formulario.',
  },
  'error:restaurar-gasto': {
    seccion: 'anuncios',
    tono: 'mal',
    texto: 'No pudimos deshacer el borrado. Vuelve a anotarlo con el formulario.',
  },
  'error:ajustes': {
    seccion: 'ajustes',
    tono: 'mal',
    texto: 'No se guardó: revisa que la tasa de impuestos sea un número entre 0 y 100.',
  },
  'error:gasto': {
    seccion: 'anuncios',
    tono: 'mal',
    texto: 'No se anotó por un problema al guardar. Intenta de nuevo en un momento.',
  },
  'error:gasto-canal': {
    seccion: 'anuncios',
    tono: 'mal',
    texto: 'No se anotó: el nombre del canal va en una sola palabra, sin espacios ni tildes (por ejemplo, pinterest).',
  },
  'error:gasto-monto': {
    seccion: 'anuncios',
    tono: 'mal',
    texto: 'No se anotó: el monto va solo con números, por ejemplo 50 o 49,90.',
  },
  'error:gasto-mes': {
    seccion: 'anuncios',
    tono: 'mal',
    texto: 'No se anotó: elige el mes del gasto en la lista.',
  },
  'error:costo': {
    seccion: 'mensuales',
    tono: 'mal',
    texto: 'No se anotó por un problema al guardar. Intenta de nuevo en un momento.',
  },
  'error:costo-monto': {
    seccion: 'mensuales',
    tono: 'mal',
    texto: 'No se anotó: el monto va solo con números, por ejemplo 20 o 19,90.',
  },
  'error:costo-datos': {
    seccion: 'mensuales',
    tono: 'mal',
    texto: 'No se anotó: elige qué es y el mes en las listas.',
  },
  'error:borrar-costo': {
    seccion: 'mensuales',
    tono: 'mal',
    texto: 'No pudimos borrar ese costo. Recarga e intenta de nuevo.',
  },
  'error:borrar-gasto': {
    seccion: 'anuncios',
    tono: 'mal',
    texto: 'No pudimos borrar ese gasto. Recarga e intenta de nuevo.',
  },
};

function Campo({ etiqueta, nombre, ayuda, children }: { etiqueta: string; nombre: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[18px] font-bold">{etiqueta}</span>
      {children}
      <ErrorCampo nombre={nombre} />
      {ayuda && <span className="text-[18px] leading-snug text-[var(--text-secondary)]">{ayuda}</span>}
    </label>
  );
}

function Mensaje({ tono, children, deshacer }: { tono: 'bien' | 'mal'; children: string; deshacer?: string }) {
  return (
    <div
      role={tono === 'mal' ? 'alert' : 'status'}
      className={`flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-button)] py-1 pr-1 pl-3 font-bold leading-snug ${tono === 'bien' ? 'bg-[var(--ok-bg)] text-[var(--ok)]' : 'bg-[var(--err-bg)] text-[var(--err)]'}`}
    >
      <p className="flex min-h-12 items-center gap-2 py-1.5">
        {tono === 'bien' && <CheckTrazo tam={18} />}
        {children}
      </p>
      {/* Borrar se puede deshacer: la copia de lo borrado viaja en el botón y se vuelve a anotar tal cual. */}
      {deshacer && (
        <form action={restaurarRegistro}>
          <input type="hidden" name="d" value={deshacer} />
          <BotonEnviar enviando="Deshaciendo…" tono="suave">
            <Undo2 size={16} aria-hidden="true" /> Deshacer
          </BotonEnviar>
        </form>
      )}
    </div>
  );
}

// Nombre de la moneda para leer ("dólares (USD)"); si no está en la lista, el código tal cual.
function nombreMoneda(m: string): string {
  const t = MONEDAS.find((x) => x.v === m)?.t;
  return t ? t.charAt(0).toLowerCase() + t.slice(1) : m;
}

export default async function Costos({ searchParams }: PageProps<'/admin/costos'>) {
  const q = await searchParams;
  const { supabase } = await exigirAdmin();
  const { data, error } = await supabase.rpc('admin_registros');
  if (error?.code === '42501') redirect('/admin/verificar');
  if (error || !data) {
    return (
      <Tarjeta>
        <p className="font-bold">No pudimos cargar tus costos.</p>
        <p className="mt-1 text-[18px] text-[var(--text-secondary)]">
          Recarga la página en un momento. Si sigue así, pídele a Claude en tu proyecto que lo revise.
        </p>
      </Tarjeta>
    );
  }
  const r = data as Registros;
  const m = r.ajustes.main_currency;
  const aviso = MENSAJES[`ok:${q.ok}`] ?? MENSAJES[`error:${q.error}`];
  const deshacer = typeof q.d === 'string' && /^[A-Za-z0-9_-]{1,600}$/.test(q.d) && String(q.ok).startsWith('borrar-') ? q.d : undefined;
  const avisoEn = (s: 'mensuales' | 'anuncios' | 'ajustes') =>
    aviso?.seccion === s ? (
      <Mensaje tono={aviso.tono} deshacer={deshacer}>
        {aviso.texto}
      </Mensaje>
    ) : null;
  const enMoneda = nombreMoneda(m);
  const hoy = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
  }).format(new Date());
  const mesActual = hoy.slice(0, 7);
  // Los últimos 12 meses, escritos en palabras (los selectores de fecha del teléfono cambian de formato según el idioma del equipo).
  const [anio, mesNum] = mesActual.split('-').map(Number);
  const ultimos = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(Date.UTC(anio, mesNum - 1 - i, 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  });
  const opcionesMes = ultimos.map((x) => (
    <option key={x} value={x}>
      {nombreMes(x).replace(/^./, (c) => c.toUpperCase())}
    </option>
  ));

  // Costos agrupados por mes, con su total.
  const porMes = new Map<string, Registros['costos']>();
  for (const c of r.costos) {
    const k = c.month.slice(0, 7);
    porMes.set(k, [...(porMes.get(k) ?? []), c]);
  }
  const meses = [...porMes.entries()].sort(([a], [b]) => (a < b ? 1 : -1));
  const monedaOtra = !MONEDAS.some((x) => x.v === m);

  // Qué falta anotar este mes (tira de pasos de la marca: lo anotado lleva check salvia).
  const deEsteMes = porMes.get(mesActual) ?? [];
  const anunciosMes = r.gastos.filter((g) => g.period_start.slice(0, 7) <= mesActual && g.period_end.slice(0, 7) >= mesActual);
  const tira = [
    {
      texto: 'Servidores',
      estado: deEsteMes.some((c) => c.kind === 'infra') ? 'hecho' : 'pendiente',
      href: '#mensuales',
    },
    {
      texto: 'Correos',
      estado: deEsteMes.some((c) => c.kind === 'email') ? 'hecho' : 'pendiente',
      href: '#mensuales',
    },
    {
      texto: 'Anuncios',
      estado: anunciosMes.length > 0 ? 'hecho' : 'pendiente',
      detalle: anunciosMes.length > 0 ? undefined : 'si pusiste',
      href: '#anuncios',
    },
  ] as const;
  const faltan = tira.filter((t) => t.estado === 'pendiente' && t.texto !== 'Anuncios').length;

  // Anuncios agrupados por mes, con su total.
  const anunciosPorMes = new Map<string, Registros['gastos']>();
  for (const g of r.gastos) {
    const k = g.period_start.slice(0, 7);
    anunciosPorMes.set(k, [...(anunciosPorMes.get(k) ?? []), g]);
  }
  const mesesAnuncios = [...anunciosPorMes.entries()].sort(([a], [b]) => (a < b ? 1 : -1));

  return (
    <div className="flex flex-col gap-10">
      <LimpiarAviso />
      <div className="entra">
        <h1 className="[font-family:var(--font-display)] text-[36px] font-semibold leading-tight">Costos y ajustes</h1>
        <p className="mt-1 text-[18px] leading-snug text-[var(--text-secondary)]">
          Lo que anotes aquí completa el cálculo de cuánto te queda. Las ventas, comisiones de Hotmart e IA se cuentan solas.
        </p>
      </div>

      <Tarjeta className="entra">
        <p className="text-[18px] font-bold">
          {nombreMes(mesActual).replace(/^./, (c) => c.toUpperCase())}:{' '}
          {faltan === 0 ? 'tus costos fijos están anotados.' : `te ${faltan === 1 ? 'falta 1 costo' : `faltan ${faltan} costos`} por anotar.`}
        </p>
        <div className="mt-3 max-w-md">
          <TiraPasos pasos={[...tira]} etiqueta="Qué anotaste este mes" />
        </div>
      </Tarjeta>

      <Seccion id="mensuales" titulo="Costos de cada mes" bajada={`Lo que pagas por mantener la app funcionando. Montos en ${enMoneda}.`}>
        {avisoEn('mensuales')}
        <Tarjeta>
          <FormularioAdmin action={guardarCosto} className="flex flex-col gap-4 sm:grid sm:grid-cols-[1.3fr_1fr_1fr] sm:items-start">
            <input type="hidden" name="moneda" value={m} />
            <div className="flex flex-col gap-4">
              <TipoCosto
                tipos={[
                  { v: 'infra', t: TIPO_LARGO.infra },
                  { v: 'email', t: TIPO_LARGO.email },
                  { v: 'otro', t: TIPO_LARGO.otro },
                ]}
              />
            </div>
            <Campo etiqueta={`Monto en ${enMoneda}`} nombre="monto">
              <input
                name="monto"
                required
                inputMode="decimal"
                pattern="[0-9]+([.,][0-9]{1,2})?"
                placeholder="Ej.: 20"
                data-error="Escribe solo el número, por ejemplo 20 o 19,90."
                className="campo"
              />
            </Campo>
            <Campo etiqueta="Mes" nombre="mes">
              <select name="mes" required defaultValue={mesActual} className="campo">
                {opcionesMes}
              </select>
            </Campo>
            <p className="text-[18px] leading-snug text-[var(--text-secondary)] sm:col-span-3">
              Servidores y correos llevan un monto por mes: si lo anotas de nuevo, se reemplaza. Si es gratis, anótalo con 0.
            </p>
            <div className="sm:col-span-3">
              <BotonEnviar enviando="Anotando…" ancho className="sm:w-auto">
                Anotar costo
              </BotonEnviar>
            </div>
          </FormularioAdmin>
        </Tarjeta>
        {meses.length === 0 ? (
          <p className="text-[18px] text-[var(--text-secondary)]">Todavía no anotas ningún costo. Lo que anotes aparece aquí, mes a mes.</p>
        ) : (
          <Tarjeta>
            <ul className="flex flex-col gap-4">
              {meses.map(([mes, lista]) => {
                const total = lista.filter((c) => c.currency === m).reduce((a, c) => a + c.amount_minor, 0);
                const fuera = lista.filter((c) => c.currency !== m).length;
                return (
                  <li key={mes}>
                    <div className="flex items-end justify-between gap-3 border-b-2 border-[var(--text-primary)] pb-1.5">
                      <span className="font-bold capitalize">{nombreMes(mes)}</span>
                      <span className="text-right">
                        <span className="block text-[13px] font-bold text-[var(--text-secondary)]">Total del mes</span>
                        <span className="text-[24px] font-bold leading-tight tabular-nums">
                          <MontoVivo monto={total} moneda={m} />
                        </span>
                      </span>
                    </div>
                    <ul>
                      {lista.map((c) => (
                        <li key={c.id} className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-1 last:border-0">
                          <span className="min-w-0">{c.kind === 'otro' && c.note ? c.note : TIPO[c.kind]}</span>
                          <span className="flex items-center gap-1 tabular-nums">
                            {dinero(c.amount_minor, c.currency)}
                            <Borrar
                              tabla="costo"
                              id={c.id}
                              que={`${c.kind === 'otro' && c.note ? `“${c.note}”` : TIPO[c.kind].toLowerCase()} de ${nombreMes(mes)}`}
                            />
                          </span>
                        </li>
                      ))}
                    </ul>
                    {fuera > 0 && <NotaMoneda n={fuera} m={m} />}
                  </li>
                );
              })}
            </ul>
          </Tarjeta>
        )}
      </Seccion>

      <Seccion id="anuncios" titulo="Gasto en anuncios" bajada="Para saber cuánto te cuesta conseguir cada clienta y qué canal te conviene.">
        {avisoEn('anuncios')}
        <Tarjeta>
          <FormularioAdmin action={guardarGasto} className="flex flex-col gap-4 sm:grid sm:grid-cols-[1.3fr_1fr_1fr] sm:items-start">
            <input type="hidden" name="moneda" value={m} />
            <div className="flex flex-col gap-4">
              <CanalAnuncio canales={CANALES} />
            </div>
            <Campo etiqueta={`Monto en ${enMoneda}`} nombre="monto">
              <input
                name="monto"
                required
                inputMode="decimal"
                pattern="[0-9]+([.,][0-9]{1,2})?"
                placeholder="Ej.: 50"
                data-error="Escribe solo el número, por ejemplo 50 o 49,90."
                className="campo"
              />
            </Campo>
            <Campo etiqueta="Mes del gasto" nombre="mes">
              <select name="mes" required defaultValue={mesActual} className="campo">
                {opcionesMes}
              </select>
            </Campo>
            <p className="text-[18px] leading-snug text-[var(--text-secondary)] sm:col-span-3">
              Un monto por canal y mes: si lo anotas de nuevo, se reemplaza. ¿El anuncio duró dos meses? Anota cada mes por separado.
            </p>
            <div className="sm:col-span-3">
              <BotonEnviar enviando="Anotando…" ancho className="sm:w-auto">
                Anotar gasto
              </BotonEnviar>
            </div>
          </FormularioAdmin>
          <Plegable titulo="¿Cómo sabe el panel de qué anuncio llegó cada clienta?" className="mt-3 -mb-2">
            <p className="text-[18px] leading-snug text-[var(--text-secondary)]">
              Por el enlace del anuncio. Al final del enlace a tu página agrega <b>?src=</b> y el nombre del canal, por ejemplo <b>?src=meta</b> o{' '}
              <b>?src=tiktok</b>. Así cada compra queda unida al canal que la trajo.
            </p>
          </Plegable>
        </Tarjeta>
        {mesesAnuncios.length === 0 ? (
          <p className="text-[18px] text-[var(--text-secondary)]">Todavía no anotas gasto en anuncios. Si no pagas anuncios, no hace falta.</p>
        ) : (
          <Tarjeta>
            <ul className="flex flex-col gap-4">
              {mesesAnuncios.map(([mes, lista]) => {
                const total = lista.filter((g) => g.currency === m).reduce((a, g) => a + g.amount_minor, 0);
                const fuera = lista.filter((g) => g.currency !== m).length;
                return (
                  <li key={mes}>
                    <div className="flex items-end justify-between gap-3 border-b-2 border-[var(--text-primary)] pb-1.5">
                      <span className="font-bold capitalize">{nombreMes(mes)}</span>
                      <span className="text-right">
                        <span className="block text-[13px] font-bold text-[var(--text-secondary)]">Total en anuncios</span>
                        <span className="text-[24px] font-bold leading-tight tabular-nums">
                          <MontoVivo monto={total} moneda={m} />
                        </span>
                      </span>
                    </div>
                    <ul>
                      {lista.map((g) => {
                        const completo = periodo(g.period_start, g.period_end) === nombreMes(mes).replace(/^./, (c) => c.toUpperCase());
                        return (
                          <li key={g.id} className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-1 last:border-0">
                            <span className="min-w-0">
                              {nombreCanal(g.channel)}
                              {!completo && <span className="block text-[18px] text-[var(--text-secondary)]">{periodo(g.period_start, g.period_end)}</span>}
                            </span>
                            <span className="flex items-center gap-1 tabular-nums">
                              {dinero(g.amount_minor, g.currency)}
                              <Borrar tabla="gasto" id={g.id} que={`el gasto en ${nombreCanal(g.channel)} de ${nombreMes(mes)}`} />
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    {fuera > 0 && <NotaMoneda n={fuera} m={m} />}
                  </li>
                );
              })}
            </ul>
          </Tarjeta>
        )}
      </Seccion>

      <Seccion id="ajustes" titulo="Ajustes del negocio">
        {avisoEn('ajustes')}
        <Tarjeta>
          <FormularioAdmin action={guardarAjustes} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:items-start">
              <Campo etiqueta="Moneda en que te paga Hotmart" nombre="moneda" ayuda="Las ventas en otra moneda se muestran aparte, sin mezclarse.">
                <select name="moneda" className="campo" defaultValue={m}>
                  {monedaOtra && <option value={m}>{m}</option>}
                  {MONEDAS.map((x) => (
                    <option key={x.v} value={x.v}>
                      {x.t}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo
                etiqueta="Impuestos (% de lo que cobras)"
                nombre="tasa"
                ayuda="Pregúntale a tu contador. Si no pagas, escribe 0. Si lo dejas vacío, el resumen dirá que es una estimación."
              >
                <input
                  name="tasa"
                  inputMode="decimal"
                  pattern="(100([.,]0+)?|[0-9]{1,2}([.,][0-9]{1,2})?)"
                  defaultValue={r.ajustes.tax_rate_pct ?? ''}
                  placeholder="Ej.: 19"
                  data-error="Escribe un número entre 0 y 100, sin el signo %."
                  className="campo"
                />
              </Campo>
            </div>
            <Campo
              etiqueta="Código de tu producto en Hotmart"
              nombre="productos"
              ayuda="Está en Hotmart → Productos. Si son varios, sepáralos con coma. Así, comprar otro producto tuyo no da acceso a la app."
            >
              <input
                name="productos"
                inputMode="numeric"
                pattern="[A-Za-z0-9_, \-]{0,200}"
                defaultValue={r.ajustes.hotmart_product_ids.join(', ')}
                placeholder="Ej.: 1234567, 7654321"
                data-error="Solo números o letras; si son varios, sepáralos con coma."
                className="campo"
              />
            </Campo>
            <BotonEnviar enviando="Guardando…" tono="suave" ancho className="sm:w-auto sm:self-start">
              Guardar ajustes
            </BotonEnviar>
            <p className="text-[18px] text-[var(--text-secondary)]">Última modificación: {fecha(r.ajustes.updated_at, true)}</p>
          </FormularioAdmin>
        </Tarjeta>
      </Seccion>
    </div>
  );
}

// "Octubre 2026" si el gasto cubre el mes entero; si no, "1 al 15 oct 2026".
function periodo(desde: string, hasta: string): string {
  const [a, m, d] = desde.split('-').map(Number);
  const [a2, m2, d2] = hasta.split('-').map(Number);
  const ultimo = new Date(Date.UTC(a2, m2, 0)).getUTCDate();
  const mes = (x: number, y: number) => nombreMes(`${y}-${String(x).padStart(2, '0')}`, true);
  if (a === a2 && m === m2 && d === 1 && d2 === ultimo) return nombreMes(desde.slice(0, 7)).replace(/^./, (c) => c.toUpperCase());
  if (a === a2 && m === m2) return `${d} al ${d2} ${mes(m, a)} ${a}`;
  return `${d} ${mes(m, a)} al ${d2} ${mes(m2, a2)} ${a2}`;
}

// Si cambiaste la moneda en Ajustes, lo anotado en la moneda anterior no se suma: se avisa en vez de esconderlo.
function NotaMoneda({ n, m }: { n: number; m: string }) {
  return (
    <p className="mt-1.5 text-[18px] leading-snug text-[var(--warn)]">
      {n === 1 ? '1 monto está' : `${n} montos están`} en otra moneda y no {n === 1 ? 'entra' : 'entran'} en este total (tu moneda es {nombreMoneda(m)}).
    </p>
  );
}
