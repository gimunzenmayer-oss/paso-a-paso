import { llaveIngesta, supabaseIngesta } from '@/lib/servidor/ingesta';
import { ipDe, permitido } from '@/lib/servidor/limite';

// Recibe los eventos de uso de la página y de la app (contrato de 36). La base decide
// qué nombres acepta, valida el formato y limita la frecuencia por teléfono.
type Evento = { type?: unknown; device_id?: unknown; session_id?: unknown; source?: unknown; qa?: unknown; props?: unknown };

const MAX_BYTES = 16_000;

function texto(v: unknown, max: number): string | null {
  return typeof v === 'string' && v.length > 0 && v.length <= max ? v : null;
}

export async function POST(req: Request) {
  const key = llaveIngesta();
  if (!key) return new Response(null, { status: 503 });
  if (!permitido(`ev:${ipDe(req)}`, 120, 60_000)) return new Response(null, { status: 429 });

  const crudo = await req.text();
  if (crudo.length > MAX_BYTES) return new Response(null, { status: 413 });
  let cuerpo: unknown;
  try {
    cuerpo = JSON.parse(crudo);
  } catch {
    return new Response(null, { status: 400 });
  }
  const lista = (Array.isArray(cuerpo) ? cuerpo : [cuerpo]).slice(0, 20) as Evento[];

  const sb = supabaseIngesta();
  for (const e of lista) {
    const tipo = texto(e?.type, 40);
    const dispositivo = texto(e?.device_id, 64);
    if (!tipo || !dispositivo) continue;
    const props = e.props && typeof e.props === 'object' && !Array.isArray(e.props) ? e.props : {};
    const { error } = await sb.rpc('ingest_event', {
      p_key: key,
      p_type: tipo,
      p_device_id: dispositivo,
      p_session_id: texto(e.session_id, 64),
      p_source: texto(e.source, 40),
      p_is_qa: e.qa === true,
      p_props: props,
    });
    if (error) {
      console.error('[events] la base rechazó el evento', error.code);
      return new Response(null, { status: 502 });
    }
  }
  return new Response(null, { status: 204 });
}
