import { verificarResend } from '@/lib/correos/seguridad';
import { operarCorreo } from '@/lib/correos/servidor';
export const runtime='nodejs';
export async function POST(req:Request) {
  const secret=process.env.RESEND_WEBHOOK_SECRET;
  if(!secret) return new Response(null,{status:503});
  if(Number(req.headers.get('content-length')??0)>100_000) return new Response(null,{status:413});
  const raw=await req.text();
  if(raw.length>100_000) return new Response(null,{status:413});
  if(!verificarResend(raw,req.headers,secret)) return new Response(null,{status:401});
  let e:{type?:string;data?:{email_id?:string;to?:string[]}};
  try {e=JSON.parse(raw);} catch {return new Response(null,{status:400});}
  const tipos=['email.sent','email.delivered','email.bounced','email.complained','email.suppressed','email.failed'];
  if(!e||!tipos.includes(e.type??'')||!e.data?.email_id) return Response.json({ignored:true});
  try {
    await operarCorreo('event',{id:req.headers.get('svix-id'),kind:e.type,provider_id:e.data.email_id,email:e.data.to?.[0]??null});
    return Response.json({ok:true});
  } catch {console.error('[correo] evento no registrado');return new Response(null,{status:503});}
}
