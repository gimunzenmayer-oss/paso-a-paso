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

// Paso 8: lo que la app hace con la respuesta de /api/acceso (plan, decisión 6).
test('acceso: solo un 200 con acceso true/false es respuesta; 401 sin_sesion es sin sesión; el resto, sin conexión', () => {
  const { leerRespuesta } = cargarAcceso();
  assert.deepEqual({ ...leerRespuesta(200, { acceso: true, estado: 'active', hasta: null }) }, { tipo: 'ok', acceso: true, estado: 'active' });
  assert.deepEqual({ ...leerRespuesta(200, { acceso: false, estado: 'refunded', hasta: null }) }, { tipo: 'ok', acceso: false, estado: 'refunded' });
  assert.equal(leerRespuesta(401, { sin_sesion: true }).tipo, 'sin_sesion');
  for (const [status, cuerpo] of [
    [0, null], // sin internet
    [503, { sin_verificar: true }], // la base no respondió
    [500, null],
    [502, null], // una página de error en HTML
    [404, null], // ruta que no existe
    [200, null], // un wifi público que responde su propia página
    [200, { acceso: 'false', estado: 'none' }], // forma rara: nunca se lee como un "no"
    [200, { estado: 'none' }],
    [401, null], // 401 sin el cuerpo de la API
  ]) {
    assert.equal(leerRespuesta(status, cuerpo).tipo, 'red', `${status} ${JSON.stringify(cuerpo)}`);
  }
});

test('acceso: un 5xx o sin red nunca cierra una app con pase vigente, ni convierte un pase bueno en "sin acceso"', () => {
  const { decidir, leerRespuesta, GRACIA_MS } = cargarAcceso();
  const dia = 24 * 60 * 60 * 1000;
  const pase = { acceso: true, estado: 'active', verificado_en: 0 };
  const caida = leerRespuesta(503, { sin_verificar: true });
  const r = decidir(pase, 3 * dia, caida);
  assert.equal(r.abierta, true);
  assert.equal(r.motivo, 'sin_conexion');
  assert.equal(r.pase, pase, 'el pase no se toca');
  // Justo en el límite de la gracia sigue abierta; un instante después pide conectarse (no "sin acceso").
  assert.equal(decidir(pase, GRACIA_MS, caida).abierta, true);
  assert.equal(decidir(pase, GRACIA_MS + 1, caida).motivo, 'vencido_sin_conexion');
  // Un "no" guardado sigue siendo "no" sin internet (no se reabre por falta de red).
  assert.equal(decidir({ acceso: false, estado: 'refunded', verificado_en: 0 }, dia, caida).motivo, 'sin_acceso');
  // Y un sí del servidor reabre una app cerrada.
  const reabre = decidir({ acceso: false, estado: 'refunded', verificado_en: 0 }, dia, leerRespuesta(200, { acceso: true, estado: 'active', hasta: null }));
  assert.equal(reabre.abierta, true);
  assert.equal(reabre.pase.verificado_en, dia);
});

test('acceso: días sin conexión y fin de la gracia para los avisos de §5.3', () => {
  const { gracia, fechaHumana, GRACIA_MS } = cargarAcceso();
  const dia = 24 * 60 * 60 * 1000;
  const t0 = new Date(2026, 9, 21, 9, 0).getTime();
  const pase = { acceso: true, estado: 'active', verificado_en: t0 };
  assert.deepEqual({ ...gracia(pase, t0 + 2 * 3600e3) }, { dias: 0, fin: t0 + GRACIA_MS });
  assert.equal(gracia(pase, t0 + 5 * dia + 1).dias, 5);
  assert.equal(gracia(pase, t0 - 1000).dias, 0, 'un reloj atrasado no da días negativos');
  assert.equal(fechaHumana(gracia(pase, t0).fin), '28 de octubre');
  assert.equal(fechaHumana(new Date(2026, 11, 31).getTime()), '31 de diciembre');
});

test('copy: cada texto de la pantalla de bloqueo de la app está en docs/copy/embudo.md', () => {
  const js = readFileSync(new URL('../../app/js/bloqueo.js', import.meta.url), 'utf8');
  const md = readFileSync(new URL('../../docs/copy/embudo.md', import.meta.url), 'utf8');
  const bloque = js.slice(js.indexOf('var TXT = {'), js.indexOf('};', js.indexOf('var TXT = {')));
  const textos = [...bloque.matchAll(/^\s+\w+: '(.+)',?$/gm)].map((m) => m[1]);
  assert.ok(textos.length >= 25, `se leyeron ${textos.length} textos`);
  for (const t of textos) assert.ok(md.includes(t), `falta en embudo.md: ${t}`);
});

// Paso 5: fecha del primer cobro y respuestas contadas en el paywall.
import { fechaCobro, contarRespuestas, DIAS_PRUEBA } from '../lib/embudo/prueba.ts';

test('paywall: el cobro es el día 7, en formato humano', () => {
  assert.equal(DIAS_PRUEBA, 7);
  assert.equal(fechaCobro(new Date(2026, 9, 21)), '28 de octubre');
  assert.equal(fechaCobro(new Date(2026, 9, 28, 23, 59)), '4 de noviembre');
  assert.equal(fechaCobro(new Date(2026, 11, 28)), '4 de enero');
});

test('paywall: cuenta solo las preguntas respondidas que tienen chip (el nombre no)', () => {
  assert.equal(contarRespuestas({}), 0);
  assert.equal(contarRespuestas({ edad: '5-7', momento: 'manana' }), 2);
  // 4 preguntas respondidas, 3 chips (momento · edad · crisis): «tus 3 respuestas».
  assert.equal(contarRespuestas({ nombre: 'Mateo', edad: '5-7', momento: 'dormir', crisis: ['llora', 'piso'] }), 3);
  assert.equal(contarRespuestas({ nombre: 'Mateo', edad: '2-4', momento: 'comidas', crisis: [] }), 2);
  assert.equal(contarRespuestas({ nombre: 'Mateo' }), 0);
});

test('paywall: {N} cuenta solo respuestas vigentes (crisis con ids viejos no cuenta)', async () => {
  const { contarRespuestas } = await import('../lib/embudo/prueba.ts');
  assert.equal(contarRespuestas({}), 0);
  assert.equal(contarRespuestas({ nombre: 'Mateo', edad: '5-7', momento: 'dormir', crisis: ['piso', 'llora'] }), 3);
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
  // Bañarse es un recorte sobre blanco (fondoClaro): la tira prefiere fotos a sangre.
  assert.deepEqual(noche, ['Cenar', 'Lavarse los dientes', 'Leer un cuento']);
  const tarde = pasosConFoto(rutinaDe('escuela').pasos, 3).map((p) => p.texto);
  assert.deepEqual(tarde, ['Quitarse los zapatos', 'Rato tranquilo', 'Jugar en el parque']);
  // Si no alcanzan las fotos a sangre, entran los recortes antes que el ícono.
  const dos = pasosConFoto(rutinaDe('escuela').pasos, 5).map((p) => p.texto);
  assert.deepEqual(dos, ['Quitarse los zapatos', 'Lavarse las manos', 'Merendar', 'Rato tranquilo', 'Jugar en el parque']);
  const fotos = ['manana', 'comidas', 'escuela', 'dormir'].map((m) => pasoQueRepresenta(m).foto);
  assert.ok(fotos.every(Boolean));
  assert.equal(new Set(fotos).size, 4);
});

test('checkout: sin variables NEXT_PUBLIC_HOTMART_* no hay checkout (el resultado no promete la prueba)', async () => {
  const { checkoutDe } = await import('../lib/embudo/checkout.ts');
  assert.equal(checkoutDe('instagram'), null);
});

test('copy 1.3: «de 5 a 7 pasos» es verdad para todas las rutinas', async () => {
  const { RUTINAS } = await import('../lib/embudo/rutinas.ts');
  const { MOMENTO } = await import('../components/embudo/textos.ts');
  const largos = Object.values(RUTINAS).map((r) => r.pasos.length);
  assert.equal(Math.min(...largos), 5);
  assert.equal(Math.max(...largos), 7);
  // Con espacios duros: el rango no se parte en «de 5 a / 7 pasos».
  assert.ok(MOMENTO.ayuda.includes('de\u00a05\u00a0a\u00a07\u00a0pasos'));
});

test('paywall: chips con sus respuestas (momento · edad · 1.ª crisis), solo las respondidas', async () => {
  const { etiquetasDeRespuestas } = await import('../components/embudo/textos.ts');
  assert.deepEqual(etiquetasDeRespuestas({ nombre: 'Mateo', edad: '5-7', momento: 'dormir', crisis: ['piso', 'llora'] }), [
    'Irse a dormir',
    '5 a 7 años',
    'Se tira al piso o golpea',
  ]);
  // Saltó la crisis (o quedó un id viejo): sin ese chip.
  assert.deepEqual(etiquetasDeRespuestas({ edad: '2-4', momento: 'manana', crisis: ['golpea'] }), ['La mañana', '2 a 4 años']);
  assert.deepEqual(etiquetasDeRespuestas({}), []);
});

test('paywall: un monto o una fecha no se parten (espacios duros)', async () => {
  const { sinCortes, PAYWALL_PRUEBA } = await import('../components/embudo/textos.ts');
  assert.equal(sinCortes('28 de octubre'), '28 de octubre');
  // Sin plan elegido, el Día 7 nombra los 2 montos, cada uno entero.
  assert.ok(PAYWALL_PRUEBA.cobroSinPlan.texto.startsWith('US$7.99 al mes o US$59.90 al año.'));
});

test('paywall: {N} de «tus {N} respuestas» es el número de chips visibles, en todos los casos', async () => {
  const { contarRespuestas } = await import('../lib/embudo/prueba.ts');
  const { etiquetasDeRespuestas } = await import('../components/embudo/textos.ts');
  const casos = [
    {},
    { nombre: 'Mateo' },
    { nombre: 'Mateo', edad: '5-7', momento: 'dormir', crisis: ['piso', 'llora'] },
    { edad: '2-4', momento: 'manana', crisis: ['golpea'] },
    { momento: 'escuela', crisis: ['cambia', 'cierra'] },
    { nombre: 'Ana', momento: 'comidas', crisis: [] },
    { edad: '8-12' },
  ];
  for (const r of casos) assert.equal(contarRespuestas(r), etiquetasDeRespuestas(r).length, JSON.stringify(r));
  // Con las 3 respondidas (y nombre), el subtítulo dice «tus 3 respuestas» y hay 3 chips.
  assert.equal(contarRespuestas(casos[2]), 3);
});

test('copy: espacios duros donde el revisor vio cortes (carga y garantía)', async () => {
  const { CARGANDO, PAYWALL_PRUEBA, OPCIONES_CRISIS } = await import('../components/embudo/textos.ts');
  const textos = CARGANDO.lineas.map((l) => l.texto);
  assert.ok(textos.some((t) => t.endsWith('a\u00a0un\u00a0toque')));
  assert.ok(textos.some((t) => t.endsWith('a\u00a0su\u00a0terapeuta')));
  // «llora o grita» llega a la línea 2 de la carga por {crisis}.
  assert.equal(OPCIONES_CRISIS.find((o) => o.id === 'llora').corto, 'llora o\u00a0grita');
  assert.ok(PAYWALL_PRUEBA.debajo.includes('si\u00a0no\u00a0te\u00a0ayuda'));
});
