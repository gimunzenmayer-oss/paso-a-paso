import 'server-only';

// Freno simple por IP dentro de cada instancia del servidor. La base tiene su propio límite
// por teléfono y por hora; este solo corta ráfagas antes de llegar a ella.
const ventanas = new Map<string, { inicio: number; n: number }>();

export function permitido(clave: string, maximo: number, ventanaMs: number): boolean {
  const ahora = Date.now();
  const v = ventanas.get(clave);
  if (!v || ahora - v.inicio > ventanaMs) {
    ventanas.set(clave, { inicio: ahora, n: 1 });
    if (ventanas.size > 5000) ventanas.clear();
    return true;
  }
  v.n += 1;
  return v.n <= maximo;
}

export function ipDe(req: Request): string {
  return req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'sin-ip';
}

// Minutos que faltan para que `clave` vuelva a estar permitida (mínimo 1), para decírselo a la persona.
export function minutosDeEspera(clave: string, ventanaMs: number): number {
  const v = ventanas.get(clave);
  if (!v) return 1;
  return Math.max(1, Math.ceil((ventanaMs - (Date.now() - v.inicio)) / 60_000));
}
