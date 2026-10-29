import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sobrePruebaServicio,DESTINATARIO_PRUEBA} from '../lib/correos/prueba.ts';
test('la prueba solo puede ir a la dueña y no contiene un acceso ficticio ni anuncia una compra',()=>{
  const sobre=sobrePruebaServicio('https://paso-a-paso-sigma.vercel.app');
  assert.deepEqual(sobre.to,[DESTINATARIO_PRUEBA]);
  assert.equal(DESTINATARIO_PRUEBA,'hadaapps@gmail.com');
  assert.match(sobre.subject,/^\[PRUEBA\]/);
  assert.match(sobre.text,/No activa una compra/);
  assert.doesNotMatch(sobre.html,/123456|token_hash|EJEMPLO/);
  assert.match(sobre.html,/https:\/\/paso-a-paso-sigma.vercel.app\/entrar/);
  assert.throws(()=>sobrePruebaServicio('http://otro.example'));
});
