import { coincide } from '@/lib/correos/seguridad';
import { operarCorreo } from '@/lib/correos/servidor';
export const runtime='nodejs';
// Integración interna. Nunca suscribir automáticamente a quien compra ni importar listas.
export async function POST(req:Request) {
  if(!coincide(req.headers.get('authorization'),process.env.CRON_SECRET?`Bearer ${process.env.CRON_SECRET}`:undefined))return new Response(null,{status:401});
  if(process.env.EMAIL_MARKETING_ACTIVO!=='true'||!process.env.EMAIL_RECURSO_URL)return new Response(null,{status:503});
  const raw=await req.text();if(raw.length>2000)return new Response(null,{status:413});
  let d:{email?:string;source?:string;solicitudExplicita?:boolean};
  try{d=JSON.parse(raw);}catch{return new Response(null,{status:400});}
  if(!d||d.solicitudExplicita!==true||!d.email||!d.source)return new Response(null,{status:400});
  try{await operarCorreo('request_consent',{email:d.email,source:d.source});return Response.json({ok:true});}
  catch{return new Response(null,{status:503});}
}
