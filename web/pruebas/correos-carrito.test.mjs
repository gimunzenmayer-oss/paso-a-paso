import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerCarrito, EVENTO_CARRITO } from '../lib/correos/carrito.ts';
const ahora=Date.parse('2026-10-26T12:00:00Z');
const valido=()=>({id:'evento-prueba-1',event:EVENTO_CARRITO,version:'2.0.0',creation_date:ahora,data:{product:{id:8796204},offer:{code:'mensual-prueba'},buyer:{email:' Ana@Example.com ',name:'No importar',phone:'No importar'},buyer_ip:'No importar'}});
test('carrito oficial: solo el producto y oferta mensual esperados, sin importar datos adicionales',()=>{
  assert.deepEqual(leerCarrito(valido(),'mensual-prueba',ahora),{email:'ana@example.com',checkout_id:'evento-prueba-1'});
  assert.deepEqual(leerCarrito(valido(),'mensual-prueba',ahora),leerCarrito(valido(),'mensual-prueba',ahora),'reentrega conserva dedupe');
});
test('carrito rechaza oferta ajena, evento viejo, estructura rota y correo inválido',()=>{
  assert.equal(leerCarrito(valido(),null,ahora),null);
  assert.equal(leerCarrito(valido(),'otra',ahora),null);
  for(const mutar of [e=>e.event='PURCHASE_APPROVED',e=>e.version='1.0.0',e=>e.id='',e=>e.creation_date=ahora-73*3600_000,e=>e.creation_date=ahora+3600_000,e=>e.data.product.id=123,e=>e.data.buyer.email='x@example.com\r\nBcc:otra@example.com',e=>e.data.buyer=null,e=>e.data=[]]) {
    const e=valido();mutar(e);assert.equal(leerCarrito(e,'mensual-prueba',ahora),null);
  }
  assert.equal(leerCarrito(null,'mensual-prueba',ahora),null);
});
