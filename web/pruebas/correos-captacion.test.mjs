import {test} from 'node:test';
import assert from 'node:assert/strict';
import {captacionDisponible,leerSolicitudRecurso} from '../lib/correos/captacion.ts';
test('captación solo habilitada si servicio, marketing, dominios y recurso están preparados',()=>{
  const c={habilitado:true,marketing:true,dominioVerificado:true,marketingVerificado:true};
  assert.equal(captacionDisponible(c,true,'https://example.com/recurso.pdf'),true);
  for(const k of Object.keys(c))assert.equal(captacionDisponible({...c,[k]:false},true,'https://example.com/recurso.pdf'),false);
  assert.equal(captacionDisponible(c,false,'https://example.com/recurso.pdf'),false);
  assert.equal(captacionDisponible(c,true,undefined),false);
});
test('solicitud exige correo y permiso explícito; no acepta listas ni añade datos del niño',()=>{
  assert.deepEqual(leerSolicitudRecurso({email:' Ana@Example.com ',consentimiento:true,nombreNino:'No importar'}),{email:'ana@example.com',trampa:false});
  for(const d of [null,[],{email:'ana@example.com'},{email:'ana@example.com',consentimiento:'true'},{email:'sin-correo',consentimiento:true}])assert.equal(leerSolicitudRecurso(d),null);
  assert.equal(leerSolicitudRecurso({email:'ana@example.com',consentimiento:true,sitioWeb:'bot'}).trampa,true);
});
