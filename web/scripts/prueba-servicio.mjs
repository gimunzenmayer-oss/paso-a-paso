// Sin --enviar: solo genera una vista local. Nunca lee ni procesa la cola real.
// Con --enviar: un único mensaje a la dueña desde su dominio de servicio verificado.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import { createHash, randomUUID } from 'node:crypto';
import { sobrePruebaServicio } from '../lib/correos/prueba.ts';
import { enviarResend } from '../lib/correos/envio.ts';

const carpeta = new URL('../../docs/correos/vista-previa/', import.meta.url);
await mkdir(carpeta,{recursive:true});
const sitio = 'https://paso-a-paso-sigma.vercel.app';
const sobre = sobrePruebaServicio(sitio);
await writeFile(new URL('prueba-servicio.html',carpeta),sobre.html);
if (!process.argv.includes('--enviar')) {
  console.log('Vista local creada. Ningún envío. El destino permitido de la prueba real es únicamente hadaapps@gmail.com.');
} else {
  let archivo = {};
  try { archivo=parseEnv(await readFile(new URL('../.env.correos-prueba.local',import.meta.url),'utf8')); }
  catch(e) { if(e.code!=='ENOENT') throw e; }
  const key=archivo.RESEND_API_KEY_TX || process.env.RESEND_API_KEY_TX;
  if(!key) {
    console.error('Falta la clave privada de envío. No se envió nada. Se introduce en .env.correos-prueba.local, nunca en el chat.');
    process.exitCode=1;
  } else if(!/^re_[a-zA-Z0-9_-]{10,}$/.test(key)) {
    console.error('El valor no tiene el formato de una clave de Resend. No se envió nada ni se mostró la clave.');process.exitCode=1;
  } else {
    const recibo=new URL('../../docs/correos/prueba-servicio-resultado.json',import.meta.url);
    let estado;
    try { estado=JSON.parse(await readFile(recibo,'utf8')); }
    catch(e) { if(e.code!=='ENOENT') throw e; }
    const huella=createHash('sha256').update(JSON.stringify(sobre)).digest('hex');
    if(estado?.estado==='aceptado') {
      console.log('Esta prueba ya fue aceptada por Resend. No se envió otro mensaje. Falta comprobar Recibidos/Spam y autenticación.');
    } else if(estado && (estado.huella!==huella || Date.now()-Date.parse(estado.creado)>23*3600_000)) {
      console.error('Requiere revisión manual antes de repetir la prueba. No se envió nada.');process.exitCode=1;
    } else {
      estado ??= {id:randomUUID(),creado:new Date().toISOString(),huella,estado:'pendiente',destinatario:sobre.to[0]};
      await writeFile(recibo,JSON.stringify(estado,null,2));
      try {
        const id=await enviarResend(sobre,'servicio',estado.id,{habilitado:true,marketing:false,dominioVerificado:true,txKey:key,mktKey:'',sitio});
        await writeFile(recibo,JSON.stringify({...estado,estado:'aceptado',provider_id:id},null,2));
        console.log('Resend aceptó la prueba para hadaapps@gmail.com. Esto aún no confirma llegada a Recibidos.');
      } catch(e) {
        console.error('No se confirmó el envío: '+(e.razon??'fallo de conexión')+'. Se conserva el identificador para evitar duplicados.');process.exitCode=1;
      }
    }
  }
}
