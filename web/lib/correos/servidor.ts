import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { llaveIngesta, supabaseIngesta } from '@/lib/servidor/ingesta';
import { configSupabase } from '@/lib/supabase/config';
import { ajustesCorreo } from '@/lib/correos/config';
import { procesarCorreos } from '@/lib/correos/trabajador';
import { checkoutDe } from '@/lib/embudo/checkout';

export async function operarCorreo(accion: string, datos: Record<string,unknown> = {}) {
  const key=llaveIngesta();
  if (!key) throw new Error('falta_ingesta');
  const {data,error}=await supabaseIngesta().rpc('email_operar',{p_key:key,p_action:accion,p_data:datos});
  if(error) throw new Error('cola_no_disponible');
  return data;
}
export async function ejecutarCorreos() {
  const config=ajustesCorreo();
  return procesarCorreos({config,operar:operarCorreo,llaveCifrado:process.env.EMAIL_PAYLOAD_KEY??'',
    secretoBaja:process.env.EMAIL_UNSUBSCRIBE_SECRET??'',precobroVerificado:process.env.EMAIL_PRECOBRO_VERIFICADO==='true',
    urlRegalo:process.env.EMAIL_RECURSO_URL,
    urlCheckout:checkoutDe()?.mensual,
    acceso:async(email)=>{
      const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
      if(!key) throw new Error('falta_llave_auth');
      const admin=createClient(configSupabase().url,key,{auth:{persistSession:false,autoRefreshToken:false}});
      const {data,error}=await admin.auth.admin.generateLink({type:'magiclink',email});
      if(error||!data.properties?.hashed_token||!data.properties?.email_otp) throw new Error('no_se_genero_acceso');
      const callback=new URL('/auth/callback',config.sitio);
      callback.searchParams.set('token_hash',data.properties.hashed_token); callback.searchParams.set('type','email');
      return {url:callback.href,codigo:data.properties.email_otp};
    }});
}
