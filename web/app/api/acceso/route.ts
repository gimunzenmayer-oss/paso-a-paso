import { NextResponse } from 'next/server';
import { respuestaApiAcceso } from '@/lib/cuenta/acceso';
import { accesoDeSesion, leerSesion } from '@/lib/cuenta/sesion';

// ¿Esta familia puede abrir la app? (plan docs/planes/entrada-de-pago.md, decisión 6 y paso 8).
// Lo pregunta la PWA al abrir y al volver a primer plano (app/js/bloqueo.js) y guarda la
// respuesta como "pase" con 7 días de gracia sin internet (app/js/acceso.js).
// Lee la sesión (cookies de Supabase Auth o, solo en desarrollo, la simulada) y llama a la
// RPC mi_acceso() con ella; ACCESO_SIMULADO la reemplaza en desarrollo (lib/cuenta/simulacion.ts).
// Nunca se guarda en caché: cada respuesta es de este momento y de esta persona.
export const dynamic = 'force-dynamic';

export async function GET() {
  const lectura = await leerSesion();
  const { status, cuerpo } = respuestaApiAcceso(
    lectura.tipo === 'sesion' ? { tipo: 'acceso', acceso: await accesoDeSesion(lectura.sesion) } : lectura,
  );
  return NextResponse.json(cuerpo, {
    status,
    headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  });
}
