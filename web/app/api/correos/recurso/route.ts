import { createHmac } from 'node:crypto';
import { ajustesCorreo } from '@/lib/correos/config';
import { captacionDisponible, leerSolicitudRecurso } from '@/lib/correos/captacion';
import { operarCorreo } from '@/lib/correos/servidor';
import { ipDe, permitido } from '@/lib/servidor/limite';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const config = ajustesCorreo(), secret = process.env.EMAIL_UNSUBSCRIBE_SECRET ?? '';
  if (!captacionDisponible(config, process.env.EMAIL_CAPTACION_ACTIVA === 'true', process.env.EMAIL_RECURSO_URL) || secret.length < 32) return new Response(null, { status: 503 });
  if (req.headers.get('origin') !== new URL(config.sitio).origin) return new Response(null, { status: 403 });
  if (!(req.headers.get('content-type') ?? '').startsWith('application/json')) return new Response(null, { status: 415 });
  const raw = await req.text();
  if (raw.length > 2000) return new Response(null, { status: 413 });
  let d;
  try { d = leerSolicitudRecurso(JSON.parse(raw)); } catch { return new Response(null, { status: 400 }); }
  if (!d) return new Response(null, { status: 400 });
  if (d.trampa) return Response.json({ ok: true });
  const ip = ipDe(req);
  if (!permitido(`recurso:${ip}`, 10, 3600_000)) return new Response(null, { status: 429 });
  // Huella rotatoria, no almacena la IP. La base limita también entre instancias.
  const huella = createHmac('sha256', secret).update(`recurso:${new Date().toISOString().slice(0,10)}:${ip}`).digest('hex');
  try {
    const r = await operarCorreo('request_consent', { email: d.email, source: 'guia-gratis-v1', request_key: huella }) as { limited?: boolean };
    if (r.limited) return new Response(null, { status: 429 });
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    console.error('[correos] solicitud de recurso no disponible');
    return new Response(null, { status: 503 });
  }
}
