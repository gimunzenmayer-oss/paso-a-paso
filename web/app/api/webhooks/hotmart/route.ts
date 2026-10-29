import { createHash, timingSafeEqual } from 'node:crypto';
import { llaveIngesta, supabaseIngesta } from '@/lib/servidor/ingesta';
import { EVENTO_CARRITO, leerCarrito } from '@/lib/correos/carrito';
import { operarCorreo } from '@/lib/correos/servidor';
import { checkoutDe } from '@/lib/embudo/checkout';

// Webhook de Hotmart (18): cuerpo crudo → hottok en tiempo constante → la base aplica el
// evento en UNA transacción (idempotencia, catálogo, estados, ledger). Si falta el hottok
// en el servidor, NO se procesa nada (falla cerrado) y queda registrado para el panel.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest();

function hottokValido(recibido: string | null, esperado: string): boolean {
  if (!recibido) return false;
  // Se comparan los hash (mismo largo siempre): no se filtra ni el largo del secreto.
  return timingSafeEqual(sha256(recibido), sha256(esperado));
}

async function registrarFallo(resultado: 'unauthorized' | 'error', tipo: string, detalle: string) {
  const key = llaveIngesta();
  if (!key) return;
  await supabaseIngesta()
    .rpc('log_webhook_attempt', { p_key: key, p_result: resultado, p_type: tipo, p_detail: detalle })
    .then(({ error }) => error && console.error('[hotmart] no se pudo registrar el fallo', error.code));
}

export async function POST(req: Request) {
  const key = llaveIngesta();
  const hottok = process.env.HOTMART_HOTTOK;
  if (!key || !hottok) {
    console.error('[hotmart] falta HOTMART_HOTTOK o INGEST_KEY: evento NO procesado');
    await registrarFallo('error', 'sin_configurar', 'falta el hottok en el servidor');
    return new Response('not configured', { status: 503 });
  }

  const crudo = await req.text();
  if (crudo.length > 200_000) return new Response(null, { status: 413 });

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = JSON.parse(crudo);
  } catch {
    await registrarFallo('error', 'json_invalido', 'cuerpo que no es JSON');
    return new Response(null, { status: 400 });
  }

  const recibido = req.headers.get('x-hotmart-hottok') ?? (typeof cuerpo.hottok === 'string' ? cuerpo.hottok : null);
  const tipo = typeof cuerpo.event === 'string' ? cuerpo.event.slice(0, 60) : 'desconocido';
  if (!hottokValido(recibido, hottok)) {
    await registrarFallo('unauthorized', tipo, 'hottok ausente o distinto');
    return new Response(null, { status: 401 });
  }

  delete cuerpo.hottok;
  if (tipo === EVENTO_CARRITO) {
    if (process.env.EMAIL_CARRITO_ACTIVO !== 'true') return Response.json({ ok: true, ignored: true });
    const checkout = checkoutDe()?.mensual;
    const oferta = checkout ? new URL(checkout).searchParams.get('off') : null;
    const carrito = leerCarrito(cuerpo, oferta);
    if (!carrito) return Response.json({ ok: true, ignored: true });
    try {
      // Cola idempotente, sin crear cuenta ni cambiar acceso/pagos del comprador.
      await operarCorreo('carrito', carrito);
      return Response.json({ ok: true });
    } catch {
      console.error('[hotmart] carrito no registrado');
      return new Response(null, { status: 503 });
    }
  }
  const hash = createHash('sha256').update(crudo, 'utf8').digest('hex');
  const idEvento = typeof cuerpo.id === 'string' && cuerpo.id.length > 0 ? cuerpo.id.slice(0, 120) : `sha256:${hash}`;

  const { data, error } = await supabaseIngesta().rpc('ingest_hotmart', {
    p_key: key,
    p_event_id: idEvento,
    p_event_type: tipo,
    p_payload_hash: hash,
    p_payload: cuerpo,
  });
  if (error) {
    // 500 → Hotmart reintenta; la idempotencia evita que un reintento cobre doble.
    console.error('[hotmart] la base no pudo aplicar el evento', error.code);
    await registrarFallo('error', tipo, `base: ${error.code ?? 'sin código'}`);
    return new Response(null, { status: 500 });
  }
  return Response.json({ ok: true, estado: (data as { status?: string } | null)?.status ?? null });
}
