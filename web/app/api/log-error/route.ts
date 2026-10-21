import { llaveIngesta, supabaseIngesta } from '@/lib/servidor/ingesta';
import { ipDe, permitido } from '@/lib/servidor/limite';

// Errores que ve la gente en la app → panel "Salud". Sin datos personales: mensaje, pantalla y teléfono anónimo.
function texto(v: unknown, max: number): string | null {
  return typeof v === 'string' && v.trim().length > 0 ? v.slice(0, max) : null;
}

export async function POST(req: Request) {
  const key = llaveIngesta();
  if (!key) return new Response(null, { status: 503 });
  if (!permitido(`err:${ipDe(req)}`, 30, 60_000)) return new Response(null, { status: 429 });

  const crudo = await req.text();
  if (crudo.length > 8_000) return new Response(null, { status: 413 });
  let e: Record<string, unknown>;
  try {
    e = JSON.parse(crudo);
  } catch {
    return new Response(null, { status: 400 });
  }
  const mensaje = texto(e?.message, 300);
  if (!mensaje) return new Response(null, { status: 400 });

  const { error } = await supabaseIngesta().rpc('ingest_error', {
    p_key: key,
    p_message: mensaje,
    p_context: texto(e.context, 500),
    p_screen: texto(e.screen, 60),
    p_device_id: typeof e.device_id === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(e.device_id) ? e.device_id : null,
  });
  if (error) {
    console.error('[log-error] la base rechazó el error', error.code);
    return new Response(null, { status: 502 });
  }
  return new Response(null, { status: 204 });
}
