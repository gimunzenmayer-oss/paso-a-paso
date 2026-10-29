import { coincide } from '@/lib/correos/seguridad';
import { ejecutarCorreos } from '@/lib/correos/servidor';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
// Invocación de servidor/cron, nunca del navegador. Cron NO registrado automáticamente.
export async function POST(req:Request) {
  if(!coincide(req.headers.get('authorization'),process.env.CRON_SECRET?`Bearer ${process.env.CRON_SECRET}`:undefined)) return new Response(null,{status:401});
  try { return Response.json(await ejecutarCorreos(),{headers:{'Cache-Control':'no-store'}}); }
  catch { console.error('[correos] trabajador no disponible'); return Response.json({error:'no_disponible'},{status:503}); }
}
export const GET=POST;
