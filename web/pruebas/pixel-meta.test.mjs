// Píxel de Meta (lib/pixel-meta.ts): nada viaja a Meta sin «Aceptar» de esta versión del aviso.
// Correr con: npm test
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CLAVE_CONSENTIMIENTO,
  VERSION_AVISO,
  EQUIVALENCIA_META,
  idPixel,
  leerEleccion,
  guardarEleccion,
  cargarPixel,
  eventoMeta,
} from '../lib/pixel-meta.ts';

function almacen(datos = {}) {
  const m = new Map(Object.entries(datos));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
function ponerAlmacen(valor) {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get: () => valor });
}

let llamadas;
beforeEach(() => {
  ponerAlmacen(almacen());
  llamadas = [];
});

test('pixel: solo acepta un ID numérico; sin ID no hay píxel', () => {
  assert.equal(idPixel(undefined), null);
  assert.equal(idPixel(''), null);
  assert.equal(idPixel('abc123'), null);
  assert.equal(idPixel('123'), null);
  assert.equal(idPixel(' 1234567890123456 '), '1234567890123456');
});

test('pixel: sin elección guardada no hay permiso', () => {
  assert.equal(leerEleccion(), null);
});

test('pixel: guarda y lee la elección con la versión del aviso', () => {
  guardarEleccion(false);
  assert.equal(leerEleccion(), 'rechazado');
  guardarEleccion(true);
  assert.equal(leerEleccion(), 'aceptado');
  assert.equal(JSON.parse(localStorage.getItem(CLAVE_CONSENTIMIENTO)).v, VERSION_AVISO);
});

test('pixel: un «Aceptar» de otra versión del aviso no vale (se vuelve a preguntar)', () => {
  ponerAlmacen(almacen({ [CLAVE_CONSENTIMIENTO]: JSON.stringify({ v: VERSION_AVISO + 1, ok: true }) }));
  assert.equal(leerEleccion(), null);
  ponerAlmacen(almacen({ [CLAVE_CONSENTIMIENTO]: 'roto{' }));
  assert.equal(leerEleccion(), null);
});

test('pixel: con el almacenamiento bloqueado no hay permiso', () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get: () => {
      throw new Error('bloqueado');
    },
  });
  assert.equal(leerEleccion(), null);
  assert.doesNotThrow(() => guardarEleccion(true));
});

test('pixel: solo dos eventos internos viajan a Meta, y ninguno lleva respuestas', () => {
  assert.deepEqual(Object.keys(EQUIVALENCIA_META).sort(), ['checkout_iniciado', 'onboarding_completado']);
});

test('pixel: antes de cargar, eventoMeta no hace nada; después, manda el evento sin parámetros', () => {
  // Simula el navegador lo justo: window con fbq ya presente (no se inyecta el script).
  globalThis.window = { fbq: (...a) => llamadas.push(a) };
  guardarEleccion(true);
  eventoMeta('InitiateCheckout');
  assert.equal(llamadas.length, 0, 'sin cargarPixel no se manda nada');

  cargarPixel('1234567890123456');
  assert.deepEqual(llamadas, [
    ['set', 'autoConfig', false, '1234567890123456'],
    ['init', '1234567890123456'],
    ['track', 'PageView'],
  ]);

  eventoMeta('InitiateCheckout');
  assert.deepEqual(llamadas.at(-1), ['track', 'InitiateCheckout'], 'un solo argumento: sin datos');

  guardarEleccion(false);
  eventoMeta('CompleteRegistration');
  assert.equal(llamadas.at(-1)[1], 'InitiateCheckout', 'tras rechazar ya no se manda');
  delete globalThis.window;
});

test('pixel: el aviso no está dentro de la app (/app) y la política lo explica', () => {
  const politica = readFileSync(new URL('../app/privacidad/page.tsx', import.meta.url), 'utf8');
  assert.ok(politica.includes('id="cookies"'), 'el enlace «Más detalles» llega a la sección');
  assert.ok(politica.includes('Píxel de Meta'));
  assert.ok(!politica.includes('No usamos cookies de publicidad ni píxeles'), 'la promesa vieja ya no aplica');
});
