import { leerBaja } from '@/lib/correos/seguridad';
import { operarCorreo } from '@/lib/correos/servidor';
import { formularioCorreo, resultadoCorreo, falloTemporalCorreo } from '@/lib/correos/confirmacion';
export const runtime='nodejs';
function contacto(req:Request) {const s=process.env.EMAIL_UNSUBSCRIBE_SECRET??'';return leerBaja(new URL(req.url).searchParams.get('token')??'',s);}
export async function GET(req:Request) {
  if(!contacto(req)) return resultadoCorreo(false,'Este enlace no es válido. Escribe a hadaapps@gmail.com para pedir ayuda.');
  return formularioCorreo('Dejar de recibir consejos','No recibirás más consejos ni promociones. Los avisos necesarios de acceso y pagos se mantienen.','Confirmar la baja');
}
export async function POST(req:Request) {
  const id=contacto(req);if(!id)return resultadoCorreo(false,'El enlace no es válido. Usa el enlace del último correo o escríbenos para pedir la baja.');
  try {await operarCorreo('unsubscribe',{contact_id:id});return resultadoCorreo(true,'Tu baja quedó registrada. No recibirás más consejos ni promociones.');}
  catch {return falloTemporalCorreo();}
}
