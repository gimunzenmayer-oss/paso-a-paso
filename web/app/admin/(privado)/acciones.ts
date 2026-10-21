'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { exigirAdmin } from '@/lib/admin/sesion';

// Cada acción vuelve a verificar en el servidor (exigirAdmin) y la base lo verifica otra vez (assert_admin).
const DECIMALES: Record<string, number> = { CLP: 0, COP: 0, JPY: 0, PYG: 0, KRW: 0 };

function aMinor(texto: string, moneda: string): number | null {
  const limpio = texto
    .trim()
    .replace(/\s/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(limpio)) return null;
  const v = Math.round(Number(limpio) * 10 ** (DECIMALES[moneda] ?? 2));
  return Number.isSafeInteger(v) && v >= 0 ? v : null;
}

const MONEDA = /^[A-Z]{3}$/;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

export async function cambiarEstado(form: FormData) {
  const { supabase } = await exigirAdmin();
  const cliente = String(form.get('cliente') ?? '');
  const estado = String(form.get('estado') ?? '');
  const motivo = String(form.get('motivo') ?? '').trim();
  const volver = String(form.get('volver') ?? '/admin/clientes');
  const destino = volver.startsWith('/admin/clientes') ? volver : '/admin/clientes';
  const sep = destino.includes('?') ? '&' : '?';
  const quien = `c=${encodeURIComponent(cliente)}`;
  if (motivo.length < 3) redirect(`${destino}${sep}error=motivo&${quien}#cliente-${encodeURIComponent(cliente)}`);
  const { error } = await supabase.rpc('admin_cambiar_estado', { p_cliente: cliente, p_estado: estado, p_motivo: motivo });
  // Si falla, el motivo vuelve en la dirección para no tener que escribirlo de nuevo.
  if (error) redirect(`${destino}${sep}error=estado&${quien}&m=${encodeURIComponent(motivo.slice(0, 120))}#cliente-${encodeURIComponent(cliente)}`);
  revalidatePath('/admin', 'layout');
  redirect(`${destino}${sep}ok=${estado === 'cancelled' ? 'quitado' : 'dado'}&${quien}#cliente-${encodeURIComponent(cliente)}`);
}

export async function deshacerCambio(form: FormData) {
  const { supabase } = await exigirAdmin();
  const cliente = String(form.get('cliente') ?? '');
  const volver = String(form.get('volver') ?? '/admin/clientes');
  const destino = volver.startsWith('/admin/clientes') ? volver : '/admin/clientes';
  const sep = destino.includes('?') ? '&' : '?';
  const quien = `c=${encodeURIComponent(cliente)}`;
  const { error } = await supabase.rpc('admin_deshacer_cambio', { p_cliente: cliente });
  if (error) redirect(`${destino}${sep}error=deshacer&${quien}#cliente-${encodeURIComponent(cliente)}`);
  revalidatePath('/admin', 'layout');
  redirect(`${destino}${sep}ok=deshecho&${quien}#cliente-${encodeURIComponent(cliente)}`);
}

export async function guardarAjustes(form: FormData) {
  const { supabase } = await exigirAdmin();
  const moneda = String(form.get('moneda') ?? '')
    .trim()
    .toUpperCase();
  const tasaTxt = String(form.get('tasa') ?? '')
    .trim()
    .replace(',', '.');
  const tasa = tasaTxt === '' ? null : Number(tasaTxt);
  const productos = String(form.get('productos') ?? '')
    .split(/[\s,;]+/)
    .map((x) => x.trim())
    .filter((x) => /^[A-Za-z0-9_-]{1,40}$/.test(x))
    .slice(0, 20);
  if (!MONEDA.test(moneda) || (tasa !== null && (!Number.isFinite(tasa) || tasa < 0 || tasa > 100))) {
    redirect('/admin/costos?error=ajustes#ajustes');
  }
  const { error } = await supabase.rpc('admin_guardar_ajustes', { p_moneda: moneda, p_tasa_impuestos: tasa, p_productos: productos });
  if (error) redirect('/admin/costos?error=ajustes#ajustes');
  revalidatePath('/admin', 'layout');
  redirect('/admin/costos?ok=ajustes#ajustes');
}

export async function guardarGasto(form: FormData) {
  const { supabase } = await exigirAdmin();
  // Canal de la lista, u "otro" con el nombre escrito a mano.
  const elegido = String(form.get('canal') ?? '')
    .trim()
    .toLowerCase();
  const canal =
    elegido === 'otro'
      ? String(form.get('canal_otro') ?? '')
          .trim()
          .toLowerCase()
      : elegido;
  const moneda = String(form.get('moneda') ?? '')
    .trim()
    .toUpperCase();
  const monto = aMinor(String(form.get('monto') ?? ''), moneda);
  // Se anota por mes completo (el panel reparte el gasto por día si un mes se cruza con otro).
  const mes = String(form.get('mes') ?? '');
  const [a, me] = mes.split('-').map(Number);
  const desde = /^\d{4}-\d{2}$/.test(mes) ? `${mes}-01` : '';
  const hasta = desde ? `${mes}-${String(new Date(Date.UTC(a, me, 0)).getUTCDate()).padStart(2, '0')}` : '';
  // Cada problema con su propio aviso, para saber qué corregir.
  if (!/^[a-z0-9_.-]{2,30}$/.test(canal)) redirect('/admin/costos?error=gasto-canal#anuncios');
  if (monto === null) redirect('/admin/costos?error=gasto-monto#anuncios');
  if (!MONEDA.test(moneda) || !FECHA.test(desde) || !FECHA.test(hasta) || hasta < desde) redirect('/admin/costos?error=gasto-mes#anuncios');
  const { error } = await supabase.rpc('admin_guardar_gasto', {
    p_canal: canal,
    p_monto_minor: monto,
    p_moneda: moneda,
    p_desde: desde,
    p_hasta: hasta,
    p_nota: String(form.get('nota') ?? '').slice(0, 200) || null,
  });
  if (error) redirect('/admin/costos?error=gasto#anuncios');
  revalidatePath('/admin', 'layout');
  redirect('/admin/costos?ok=gasto#anuncios');
}

export async function guardarCosto(form: FormData) {
  const { supabase } = await exigirAdmin();
  const tipo = String(form.get('tipo') ?? '');
  const moneda = String(form.get('moneda') ?? '')
    .trim()
    .toUpperCase();
  const monto = aMinor(String(form.get('monto') ?? ''), moneda);
  const mes = String(form.get('mes') ?? '');
  if (monto === null) redirect('/admin/costos?error=costo-monto#mensuales');
  if (!['infra', 'email', 'otro'].includes(tipo) || !MONEDA.test(moneda) || !/^\d{4}-\d{2}$/.test(mes)) redirect('/admin/costos?error=costo-datos#mensuales');
  const { error } = await supabase.rpc('admin_guardar_costo', {
    p_tipo: tipo,
    p_monto_minor: monto,
    p_moneda: moneda,
    p_mes: `${mes}-01`,
    p_nota: String(form.get('nota') ?? '').slice(0, 200) || null,
  });
  if (error) redirect('/admin/costos?error=costo#mensuales');
  revalidatePath('/admin', 'layout');
  redirect('/admin/costos?ok=costo#mensuales');
}

// Lo justo para volver a anotar un registro borrado (el botón "Deshacer" del aviso de borrado).
type Borrado =
  | { t: 'costo'; tipo: string; monto: number; moneda: string; mes: string; nota: string | null }
  | { t: 'gasto'; canal: string; monto: number; moneda: string; desde: string; hasta: string; nota: string | null };

export async function borrarRegistro(form: FormData) {
  const { supabase } = await exigirAdmin();
  const tabla = String(form.get('tabla') ?? '');
  const id = Number(form.get('id'));
  const ancla = tabla === 'gasto' ? '#anuncios' : '#mensuales';
  if (!['gasto', 'costo'].includes(tabla) || !Number.isSafeInteger(id)) redirect(`/admin/costos?error=borrar-costo#mensuales`);
  // Antes de borrar se guarda una copia, para poder deshacerlo justo después.
  const { data: reg } = await supabase.rpc('admin_registros');
  const copia: Borrado | null = (() => {
    if (tabla === 'costo') {
      const c = (reg?.costos as { id: number; kind: string; amount_minor: number; currency: string; month: string; note: string | null }[] | undefined)?.find(
        (x) => x.id === id,
      );
      return c ? { t: 'costo', tipo: c.kind, monto: c.amount_minor, moneda: c.currency, mes: c.month.slice(0, 7), nota: c.note } : null;
    }
    const g = (
      reg?.gastos as
        | { id: number; channel: string; amount_minor: number; currency: string; period_start: string; period_end: string; note: string | null }[]
        | undefined
    )?.find((x) => x.id === id);
    return g
      ? {
          t: 'gasto',
          canal: g.channel,
          monto: g.amount_minor,
          moneda: g.currency,
          desde: g.period_start.slice(0, 10),
          hasta: g.period_end.slice(0, 10),
          nota: g.note,
        }
      : null;
  })();
  const { error } = await supabase.rpc('admin_borrar_registro', { p_tabla: tabla, p_id: id });
  if (error) redirect(`/admin/costos?error=borrar-${tabla}${ancla}`);
  revalidatePath('/admin', 'layout');
  const d = copia ? `&d=${Buffer.from(JSON.stringify(copia)).toString('base64url')}` : '';
  redirect(`/admin/costos?ok=borrar-${tabla}${d}${ancla}`);
}

export async function restaurarRegistro(form: FormData) {
  const { supabase } = await exigirAdmin();
  let b: Borrado | null = null;
  try {
    b = JSON.parse(Buffer.from(String(form.get('d') ?? ''), 'base64url').toString('utf8')) as Borrado;
  } catch {
    b = null;
  }
  const ancla = b?.t === 'gasto' ? '#anuncios' : '#mensuales';
  const malo = `/admin/costos?error=restaurar-${b?.t === 'gasto' ? 'gasto' : 'costo'}${ancla}`;
  // Se valida igual que al anotar: la copia viene de la dirección y no se confía en ella.
  if (!b || !Number.isSafeInteger(b.monto) || b.monto < 0 || !MONEDA.test(b.moneda)) redirect(malo);
  const nota = typeof b.nota === 'string' ? b.nota.slice(0, 200) : null;
  const { error } =
    b.t === 'costo'
      ? ['infra', 'email', 'otro'].includes(b.tipo) && /^\d{4}-\d{2}$/.test(b.mes)
        ? await supabase.rpc('admin_guardar_costo', { p_tipo: b.tipo, p_monto_minor: b.monto, p_moneda: b.moneda, p_mes: `${b.mes}-01`, p_nota: nota })
        : { error: true }
      : /^[a-z0-9_.-]{2,30}$/.test(b.canal) && FECHA.test(b.desde) && FECHA.test(b.hasta) && b.hasta >= b.desde
        ? await supabase.rpc('admin_guardar_gasto', {
            p_canal: b.canal,
            p_monto_minor: b.monto,
            p_moneda: b.moneda,
            p_desde: b.desde,
            p_hasta: b.hasta,
            p_nota: nota,
          })
        : { error: true };
  if (error) redirect(malo);
  revalidatePath('/admin', 'layout');
  redirect(`/admin/costos?ok=restaurado-${b.t}${ancla}`);
}
