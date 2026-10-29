import { leerBaja } from '@/lib/correos/seguridad';
import { operarCorreo } from '@/lib/correos/servidor';
import { formularioCorreo, resultadoCorreo, falloTemporalCorreo } from '@/lib/correos/confirmacion';
export const runtime='nodejs';
function leer(req:Request) {
  const u=new URL(req.url), fecha=u.searchParams.get('fecha')??'', secret=process.env.EMAIL_UNSUBSCRIBE_SECRET??'';
  if(secret.length<32||!Number.isFinite(Date.parse(fecha))||Date.parse(fecha)>Date.now()||Date.now()-Date.parse(fecha)>86400000)return null;
  const id=leerBaja(u.searchParams.get('token')??'',`${secret}:confirmar:${fecha}`);
  return id?{id,fecha}:null;
}
export async function GET(req:Request) {
  if(!leer(req))return resultadoCorreo(false,'Este enlace venció o no es válido. Puedes pedir ayuda a hadaapps@gmail.com.');
  return formularioCorreo('Confirma los correos que pediste','Recibirás el recurso gratuito y una serie breve de consejos. Puedes darte de baja cuando quieras.','Confirmar mi solicitud');
}
export async function POST(req:Request) {
  const t=leer(req);if(!t)return resultadoCorreo(false,'El enlace venció o no es válido. Abre el último correo que pediste o escríbenos para solicitar uno nuevo.');
  try {const r=await operarCorreo('confirm',{contact_id:t.id,requested_at:t.fecha}) as {ok:boolean};return resultadoCorreo(r.ok,r.ok?'Solicitud confirmada. Recibirás el recurso y puedes darte de baja desde cualquier correo de consejos.':'El enlace ya se usó o venció. Si no recibes el recurso, escríbenos para pedir ayuda.');}
  catch{return falloTemporalCorreo();}
}
