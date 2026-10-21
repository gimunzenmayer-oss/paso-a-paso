// Pruebas de las funciones puras de la entrada de pago.
// Correr con: npm test   (usa el ejecutor de pruebas de Node)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { urlCheckout } from '../lib/embudo/checkout.ts';
import { validarEstado, limpiarNombre } from '../lib/embudo/estado.ts';

test('checkout: sin base o con dominio ajeno no hay enlace', () => {
  assert.equal(urlCheckout(undefined), null);
  assert.equal(urlCheckout('no es url'), null);
  assert.equal(urlCheckout('https://evil.com/pay?off=1'), null);
  assert.equal(urlCheckout('http://pay.hotmart.com/X123?off=abc'), null);
});

test('checkout: agrega prueba y canal limpio, conserva la oferta', () => {
  const u = new URL(urlCheckout('https://pay.hotmart.com/X123?off=abc', 'TikTok <script>'));
  assert.equal(u.searchParams.get('off'), 'abc');
  assert.equal(u.searchParams.get('showOnlyTrial'), '1');
  assert.equal(u.searchParams.get('sck'), 'tiktokscript');
  assert.equal(new URL(urlCheckout('https://pay.hotmart.com/X123?off=abc')).searchParams.has('sck'), false);
});

test('onboarding: valida y limpia lo guardado', () => {
  assert.equal(validarEstado(null), null);
  assert.equal(validarEstado({ v: 2 }), null);
  const e = validarEstado({ v: 1, respuestas: { nombre: ' <b>Mateo</b>\n', edad: '5-7', momento: 'volar', crisis: ['grita', 3] }, plan: 'gratis', ts: 5 });
  assert.deepEqual(e, { v: 1, respuestas: { nombre: 'bMateo/b', edad: '5-7', crisis: ['grita'] }, ts: 5 });
  assert.equal(limpiarNombre('   '), undefined);
  assert.equal(limpiarNombre('a'.repeat(50)).length, 30);
});

function cargarAcceso() {
  const ctx = { window: {} };
  vm.runInNewContext(readFileSync(new URL('../../app/js/acceso.js', import.meta.url), 'utf8'), ctx);
  return ctx.window.PP.acceso;
}

test('acceso: respuesta del servidor manda', () => {
  const { decidir } = cargarAcceso();
  const si = decidir(null, 1000, { tipo: 'ok', acceso: true, estado: 'trialing' });
  assert.equal(si.abierta, true);
  assert.deepEqual({ ...si.pase }, { acceso: true, estado: 'trialing', verificado_en: 1000 });
  const no = decidir({ acceso: true, verificado_en: 900 }, 1000, { tipo: 'ok', acceso: false, estado: 'refunded' });
  assert.equal(no.abierta, false);
  assert.equal(no.motivo, 'sin_acceso');
});

test('acceso: sin internet vale 7 días desde la última comprobación', () => {
  const { decidir, GRACIA_MS } = cargarAcceso();
  const dia = 24 * 60 * 60 * 1000;
  const pase = { acceso: true, estado: 'active', verificado_en: 0 };
  assert.equal(decidir(pase, 6 * dia, { tipo: 'red' }).abierta, true);
  assert.equal(decidir(pase, 6 * dia, null).motivo, 'sin_conexion');
  assert.equal(decidir(pase, GRACIA_MS + 1, { tipo: 'red' }).motivo, 'vencido_sin_conexion');
  assert.equal(decidir(pase, 8 * dia, { tipo: 'red' }).abierta, false);
  assert.equal(decidir(null, 0, { tipo: 'red' }).motivo, 'entrar');
});

test('acceso: sin sesión pide entrar, pero respeta un pase vigente', () => {
  const { decidir } = cargarAcceso();
  assert.equal(decidir(null, 0, { tipo: 'sin_sesion' }).motivo, 'entrar');
  const r = decidir({ acceso: true, verificado_en: 0 }, 1000, { tipo: 'sin_sesion' });
  assert.equal(r.abierta, true);
  assert.equal(r.motivo, 'entrar_pronto');
});

// Paso 5: fecha del primer cobro y respuestas contadas en el paywall.
import { fechaCobro, contarRespuestas, DIAS_PRUEBA } from '../lib/embudo/prueba.ts';

test('paywall: el cobro es el día 7, en formato humano', () => {
  assert.equal(DIAS_PRUEBA, 7);
  assert.equal(fechaCobro(new Date(2026, 9, 21)), '28 de octubre');
  assert.equal(fechaCobro(new Date(2026, 9, 28, 23, 59)), '4 de noviembre');
  assert.equal(fechaCobro(new Date(2026, 11, 28)), '4 de enero');
});

test('paywall: cuenta solo las preguntas respondidas', () => {
  assert.equal(contarRespuestas({}), 0);
  assert.equal(contarRespuestas({ edad: '5-7', momento: 'manana' }), 2);
  assert.equal(contarRespuestas({ nombre: 'Mateo', edad: '5-7', momento: 'dormir', crisis: ['llora', 'piso'] }), 4);
  assert.equal(contarRespuestas({ nombre: 'Mateo', edad: '2-4', momento: 'comidas', crisis: [] }), 3);
});

test('paywall: {N} cuenta solo respuestas vigentes (crisis con ids viejos no cuenta)', async () => {
  const { contarRespuestas } = await import('../lib/embudo/prueba.ts');
  assert.equal(contarRespuestas({}), 0);
  assert.equal(contarRespuestas({ nombre: 'Mateo', edad: '5-7', momento: 'dormir', crisis: ['piso', 'llora'] }), 4);
  // Saltada (sin crisis o lista vacía): no cuenta.
  assert.equal(contarRespuestas({ edad: '5-7', momento: 'dormir', crisis: [] }), 2);
  // Solo ids que ya no son opciones ('golpea', 'cambia'): no cuenta.
  assert.equal(contarRespuestas({ edad: '5-7', momento: 'dormir', crisis: ['golpea', 'cambia'] }), 2);
  // Mezcla: cuenta, porque queda una opción vigente.
  assert.equal(contarRespuestas({ edad: '5-7', momento: 'dormir', crisis: ['cambia', 'llora'] }), 3);
});

test('rutinas: las tiras usan pasos con foto y 1.3 no repite foto entre opciones', async () => {
  const { pasosConFoto, pasoQueRepresenta, rutinaDe } = await import('../lib/embudo/rutinas.ts');
  const noche = pasosConFoto(rutinaDe('dormir').pasos, 3).map((p) => p.texto);
  assert.deepEqual(noche, ['Cenar', 'Bañarse', 'Lavarse los dientes']);
  const fotos = ['manana', 'comidas', 'escuela', 'dormir'].map((m) => pasoQueRepresenta(m).foto);
  assert.ok(fotos.every(Boolean));
  assert.equal(new Set(fotos).size, 4);
});

test('checkout: sin variables NEXT_PUBLIC_HOTMART_* no hay checkout (el resultado no promete la prueba)', async () => {
  const { checkoutDe } = await import('../lib/embudo/checkout.ts');
  assert.equal(checkoutDe('instagram'), null);
});
