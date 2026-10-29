import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
// Únicamente servidor LOCAL, con envío desactivado y una clave de prueba no válida en producción.
const origen='http://127.0.0.1:3107';
const casos=[
  ['/api/correos/procesar','GET',401,false],
  ['/api/correos/procesar','POST',401,false],
  ['/api/correos/procesar','POST',200,true],
  ['/api/correos/solicitud','POST',401,false],
  ['/api/correos/solicitud','POST',503,true],
  ['/api/webhooks/resend','POST',503,false],
  ['/api/correos/baja?token=ficticio','GET',400,false],
  ['/api/correos/baja?token=ficticio','POST',400,false],
  ['/api/correos/confirmar?token=ficticio','GET',400,false],
];
const resultados=[];
for(const [ruta,method,esperado,auth] of casos){
  const r=await fetch(origen+ruta,{method,headers:auth?{Authorization:'Bearer ficticio-solo-pruebas-locales-no-es-clave-real'}:{},signal:AbortSignal.timeout(15000)});
  assert.equal(r.status,esperado,ruta);
  if(ruta==='/api/correos/procesar'&&auth){const body=await r.json();assert.equal(body.estado,'desactivado');assert.equal(body.enviados,0);}
  resultados.push({ruta,method,status:r.status,resultado:'correcto'});
}
await writeFile(new URL('../../docs/revisiones/correos-http.json',import.meta.url),JSON.stringify(resultados,null,2));
console.log(`${resultados.length} comprobaciones HTTP locales correctas; envío desactivado.`);
