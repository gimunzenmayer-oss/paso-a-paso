// Formatos del panel. Montos en unidades menores (centavos) + moneda ISO; nunca se suman monedas distintas.
const DECIMALES: Record<string, number> = { CLP: 0, COP: 0, JPY: 0, PYG: 0, KRW: 0 };

export function dinero(minor: number | null | undefined, moneda: string): string | null {
  if (minor === null || minor === undefined) return null;
  const d = DECIMALES[moneda] ?? 2;
  const texto = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(Math.abs(minor) / 10 ** d);
  // es-CL escribe "US$-150,00"; el signo va adelante para que se lea como pérdida.
  return minor < 0 ? `−${texto}` : texto;
}

export function usd(valor: number | null | undefined, decimales = 2): string | null {
  if (valor === null || valor === undefined) return null;
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor);
}

export function pct(v: number | null | undefined): string | null {
  if (v === null || v === undefined) return null;
  return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 }).format(v)}%`;
}

export function num(v: number | null | undefined): string | null {
  if (v === null || v === undefined) return null;
  return new Intl.NumberFormat('es-CL').format(v);
}

export function fecha(iso: string | null | undefined, conHora = false): string | null {
  if (!iso) return null;
  // Una fecha sin hora ("2026-10-01") es un día del calendario, no un instante: se muestra tal cual.
  // Convertirla a hora de Chile la corría al día anterior.
  const soloDia = /^\d{4}-\d{2}-\d{2}$/.test(iso);
  if (conHora && !soloDia) {
    // "20 de octubre, 21:30": mes en palabras y reloj de 24 horas (sin "p. m." ni ceros que confundan).
    const partes = Object.fromEntries(
      new Intl.DateTimeFormat('es-CL', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: 'America/Santiago',
      })
        .formatToParts(new Date(iso))
        .map((x) => [x.type, x.value]),
    );
    return `${partes.day} de ${partes.month}, ${partes.hour}:${partes.minute}`;
  }
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: soloDia ? 'UTC' : 'America/Santiago',
  }).format(new Date(soloDia ? `${iso}T00:00:00Z` : iso));
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function nombreMes(yyyymm: string, corto = false): string {
  const [a, m] = yyyymm.split('-').map(Number);
  const n = MESES[m - 1] ?? '';
  return corto ? n.slice(0, 3) : `${n} ${a}`;
}

// Un porcentaje con poca base engaña ("100%" de 1 persona). Con menos de 5, se dice "1 de 1".
export function tasa(v: number | null | undefined, base: number): string | null {
  if (v === null || v === undefined) return null;
  if (base < 5) return `${Math.round((v * base) / 100)} de ${base}`;
  return pct(v);
}
