// Eventos del navegador (lib/eventos-cliente.ts): respetan el interruptor de estadísticas de la app.
// Correr con: npm test
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { enviarEvento, estadisticasApagadas, CLAVE_SIN_ESTADISTICAS } from '../lib/eventos-cliente.ts';

// Un localStorage de prueba (o uno que lanza, para el almacenamiento bloqueado) y un fetch que anota.
let enviados;
function almacen(datos = {}) {
  const m = new Map(Object.entries(datos));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
function ponerAlmacen(valor) {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get: () => valor });
}
function bloquearAlmacen(error) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get: () => {
      throw error;
    },
  });
}
beforeEach(() => {
  enviados = [];
  globalThis.fetch = async (url, init) => {
    enviados.push({ url, cuerpo: JSON.parse(init.body) });
    return new Response(null, { status: 204 });
  };
});

test('eventos: la clave es la misma que guarda el interruptor de la app', () => {
  const js = readFileSync(new URL('../../app/js/medicion.js', import.meta.url), 'utf8');
  assert.ok(js.includes(`localStorage.setItem('${CLAVE_SIN_ESTADISTICAS}', '1')`), 'app/js/medicion.js guarda esa clave con "1"');
  assert.ok(js.includes(`guardado('${CLAVE_SIN_ESTADISTICAS}') !== '1'`), 'app/js/medicion.js la lee igual');
});

test('eventos: con las estadísticas encendidas se envía el evento', () => {
  ponerAlmacen(almacen());
  assert.equal(estadisticasApagadas(), false);
  enviarEvento('onboarding_iniciado', { paso: 1 });
  assert.equal(enviados.length, 1);
  assert.equal(enviados[0].url, '/api/events');
  assert.equal(enviados[0].cuerpo.type, 'onboarding_iniciado');
  assert.deepEqual(enviados[0].cuerpo.props, { paso: 1 });
});

test('eventos: con el interruptor apagado (pp_sin_estadisticas = "1") no sale ninguno', () => {
  const ls = almacen({ [CLAVE_SIN_ESTADISTICAS]: '1' });
  ponerAlmacen(ls);
  assert.equal(estadisticasApagadas(), true);
  for (const tipo of ['onboarding_iniciado', 'paywall_visto', 'checkout_iniciado']) enviarEvento(tipo, { plan: 'anual' });
  assert.equal(enviados.length, 0);
  // Ni siquiera crea el número del teléfono: no se escribe nada.
  assert.equal(ls.getItem('pp_dispositivo'), null);
});

test('eventos: otro valor guardado no apaga nada (solo "1", como la app)', () => {
  ponerAlmacen(almacen({ [CLAVE_SIN_ESTADISTICAS]: '0' }));
  enviarEvento('onboarding_completado');
  assert.equal(enviados.length, 1);
});

test('eventos: almacenamiento bloqueado (DOMException) = sin interruptor guardado, igual que la app', () => {
  bloquearAlmacen(new DOMException('El acceso al almacenamiento está bloqueado', 'SecurityError'));
  assert.equal(estadisticasApagadas(), false);
  enviarEvento('onboarding_iniciado');
  assert.equal(enviados.length, 1);
  assert.match(enviados[0].cuerpo.device_id, /^[0-9a-f]{32}$/);
});

test('eventos: un error que no es del almacenamiento no se silencia', () => {
  bloquearAlmacen(new TypeError('otro error'));
  assert.throws(() => estadisticasApagadas(), TypeError);
  assert.throws(() => enviarEvento('onboarding_iniciado'), TypeError);
  assert.equal(enviados.length, 0);
});
