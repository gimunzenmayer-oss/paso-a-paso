// Solo escribe vistas locales con datos ficticios; no llama a ningún servicio de envío.
import {mkdir,writeFile} from 'node:fs/promises';
import {PLANTILLAS,renderCorreo} from '../lib/correos/plantillas.ts';
import {formularioCorreo,resultadoCorreo,falloTemporalCorreo} from '../lib/correos/confirmacion.ts';
const carpeta=new URL('../../docs/correos/vista-previa/',import.meta.url);
await mkdir(carpeta,{recursive:true});
const datos={urlCheckout:'https://pay.hotmart.com/EJEMPLO_NO_VALIDO?off=EJEMPLO',urlSitio:'https://paso-a-paso-sigma.vercel.app',urlAcceso:'https://paso-a-paso-sigma.vercel.app/auth/callback?token_hash=EJEMPLO_NO_VALIDO&type=email',codigo:'123456',fecha:'27 de octubre de 2026, 09:00 (hora de Chile)',importe:'US$4,99 de base. Total y moneda en Hotmart',urlBaja:'https://paso-a-paso-sigma.vercel.app/api/correos/baja?token=EJEMPLO_NO_VALIDO',urlRegalo:'https://paso-a-paso-sigma.vercel.app/recursos/mi-primera-rutina.pdf',urlConfirmacion:'https://paso-a-paso-sigma.vercel.app/api/correos/confirmar?token=EJEMPLO_NO_VALIDO'};
const lista=[];
for(const id of Object.keys(PLANTILLAS)){
  const c=renderCorreo(id,datos);await writeFile(new URL(id+'.html',carpeta),c.html);lista.push({id,asuntos:PLANTILLAS[id].asuntos,preheader:c.preheader,canal:c.canal,traza:PLANTILLAS[id].traza});
}
await writeFile(new URL('inventario.json',carpeta),JSON.stringify(lista,null,2));
await writeFile(new URL('baja.html',carpeta),await formularioCorreo('Dejar de recibir consejos','No recibirás más consejos ni promociones. Los avisos necesarios de acceso y pagos se mantienen.','Confirmar la baja').text());
await writeFile(new URL('confirmar.html',carpeta),await formularioCorreo('Confirma los correos que pediste','Recibirás el recurso gratuito y una serie breve de consejos. Puedes darte de baja cuando quieras.','Confirmar mi solicitud').text());
console.log(`Vistas locales: ${lista.length} correos y 2 formularios. Datos ficticios; ningún envío.`);
await writeFile(new URL('resultado.html',carpeta),await resultadoCorreo(true,'Tu baja quedó registrada. No recibirás más consejos ni promociones.').text());
await writeFile(new URL('error.html',carpeta),await resultadoCorreo(false,'El enlace venció o no es válido. Usa el enlace del último correo o escríbenos para pedir ayuda.').text());
await writeFile(new URL('reintentar.html',carpeta),await falloTemporalCorreo().text());
