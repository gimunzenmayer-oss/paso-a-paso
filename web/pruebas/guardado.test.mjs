// node --test pruebas/guardado.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const fuente = readFileSync(new URL('../../app/js/datos.js', import.meta.url), 'utf8');
const turno = () => new Promise(setImmediate);
function entorno(indexedDB, conDiario = false) {
  const window = { PP: {} };
  window.crypto = webcrypto;
  const contexto = vm.createContext({ window, indexedDB, crypto: webcrypto, TextEncoder, TextDecoder, Uint8Array, btoa, atob });
  vm.runInContext(fuente, contexto);
  if (conDiario) {
    window.PP.pantallas = {};
    window.PP.estado = { perfil: { sinEjemplos: true } };
    for (const f of ['cifrado.js', 'diario.js']) vm.runInContext(readFileSync(new URL('../../app/js/' + f, import.meta.url), 'utf8'), contexto);
  }
  return window.PP;
}

// Eventos controlados: permite que put tenga éxito y la transacción aborte DESPUÉS.
// La persistencia real y reload se cubren en guardado-browser.mjs.
function almacen() {
  const guardados = new Map(), escrituras = [], lecturas = [];
  let lecturaRota = false, aperturaError = null, aperturas = 0, automatico = null;
  const bd = {
    close() {},
    transaction(nombre, modo, opciones) {
      assert.equal(nombre, 'cajon');
      if (modo !== 'readwrite') {
        if (lecturaRota === true) throw new Error('lectura bloqueada');
        const tx = { error: null };
        tx.objectStore = () => ({ get(clave) {
          const pet = {};
          const confirmar = () => {
            pet.result = structuredClone(guardados.get(clave)); pet.onsuccess();
            if (lecturaRota === 'abort') tx.onabort(); else tx.oncomplete();
          };
          lecturas.push({ confirmar });
          if (lecturaRota === 'get') queueMicrotask(() => {
            pet.error = new DOMException('lectura transitoria', 'UnknownError');
            pet.onerror(); tx.error = pet.error; tx.onerror();
          });
          else if (lecturaRota !== 'pausa') queueMicrotask(confirmar);
          return pet;
        } });
        return tx;
      }
      const pendientes = [];
      const tx = { error: null, abort() { tx.onabort(); } };
      tx.objectStore = () => ({ put(valor, clave) {
        const pet = {};
        const escritura = { tx, pet, valor, clave, opciones,
          petExito() { pet.onsuccess?.(); },
          completar() { for (const w of pendientes) guardados.set(w.clave, w.valor); tx.oncomplete(); },
          abortar(nombre = 'AbortError') { tx.error = new DOMException('fallo inyectado', nombre); tx.onabort(); },
          cuota() { pet.error = new DOMException('sin espacio', 'QuotaExceededError'); pet.onerror(); tx.error = pet.error; tx.onerror(); tx.onabort(); },
        };
        pendientes.push(escritura);
        escrituras.push(escritura);
        if (automatico && pendientes.length === 1) queueMicrotask(() => {
          if (automatico === 'quota') escritura.cuota();
          else if (automatico === 'abort') escritura.abortar();
          else escritura.completar();
        });
        return pet;
      } });
      return tx;
    },
  };
  const indexedDB = { open() {
    aperturas++;
    const pet = {};
    queueMicrotask(() => {
      if (aperturaError) { pet.error = aperturaError; pet.onerror(); }
      else { pet.result = bd; pet.onsuccess(); }
    });
    return pet;
  } };
  return { indexedDB, escrituras, guardados, bd, lecturas,
    romperLecturas: (tipo = true) => { lecturaRota = tipo; },
    fallarApertura: (e) => { aperturaError = e; },
    get aperturas() { return aperturas; },
    set automatico(v) { automatico = v; },
  };
}

test('guardar no confirma put: espera oncomplete y solicita durabilidad estricta', async () => {
  const a = almacen(), pp = entorno(a.indexedDB);
  let confirmado = false;
  const promesa = pp.guardar('estado', { nombre: 'Ana' }).then(() => { confirmado = true; });
  await turno();
  const w = a.escrituras[0];
  assert.equal(w.opciones.durability, 'strict');
  w.petExito();
  await turno();
  assert.equal(confirmado, false, 'el éxito de la petición no basta');
  w.completar();
  await promesa;
  assert.equal(confirmado, true);
  assert.equal((await pp.leer('estado')).nombre, 'Ana');
});

test('un aborto posterior a put rechaza y conserva la versión confirmada', async () => {
  const a = almacen(), pp = entorno(a.indexedDB);
  const anterior = pp.guardar('estado', { nombre: 'anterior' });
  await turno(); a.escrituras[0].completar(); await anterior;
  const fallo = assert.rejects(pp.guardar('estado', { nombre: 'perdido' }), { name: 'AbortError' });
  await turno(); a.escrituras[1].petExito(); a.escrituras[1].abortar(); await fallo;
  assert.equal((await pp.leer('estado')).nombre, 'anterior');
  a.romperLecturas();
  await assert.rejects(pp.leer('estado'), { name: 'LecturaInciertaError' });
  a.romperLecturas(false);
  assert.equal((await pp.leer('estado')).nombre, 'anterior');
});

test('quota rechaza con su causa y permite un reintento real', async () => {
  const a = almacen(), pp = entorno(a.indexedDB);
  const fallo = assert.rejects(pp.guardar('diario', { datos: 'caja' }), { name: 'QuotaExceededError' });
  await turno(); a.escrituras[0].cuota(); await fallo;
  assert.equal(await pp.leer('diario'), null);
  const reintento = pp.guardar('diario', { datos: 'reintento' });
  await turno(); a.escrituras[1].completar(); await reintento;
  assert.equal((await pp.leer('diario')).datos, 'reintento');
});

test('sin IndexedDB nunca promete guardado ni deja una falsa copia legible', async () => {
  const pp = entorno(undefined);
  await assert.rejects(pp.guardar('estado', { nombre: 'no durable' }));
  assert.equal(await pp.leer('estado'), null);
});

test('error al abrir no queda cacheado para siempre', async () => {
  const a = almacen(), pp = entorno(a.indexedDB);
  a.fallarApertura(new DOMException('permiso', 'SecurityError'));
  await assert.rejects(pp.guardar('estado', {}), { name: 'SecurityError' });
  a.fallarApertura(null);
  const p = pp.guardar('estado', { recuperado: true });
  await turno(); a.escrituras[0].completar(); await p;
  assert.equal(a.aperturas, 2);
});

test('captura el valor al invocar y la memoria no comparte referencias con el formulario', async () => {
  const a = almacen(), pp = entorno(a.indexedDB), valor = { pasos: ['uno'] };
  const p = pp.guardar('estado', valor);
  valor.pasos.push('sin guardar');
  await turno(); a.escrituras[0].completar(); await p;
  valor.pasos.push('otro cambio');
  assert.deepEqual(Array.from((await pp.leer('estado')).pasos), ['uno']);
  const leido = await pp.leer('estado');
  leido.pasos.push('tampoco confirmado');
  const fallo = assert.rejects(pp.guardar('estado', leido));
  await turno(); a.escrituras[1].abortar(); await fallo;
  assert.deepEqual(Array.from((await pp.leer('estado')).pasos), ['uno']);
});

test('valor no serializable rechaza como promesa sin abrir transacciones', async () => {
  const a = almacen(), pp = entorno(a.indexedDB), circular = {};
  circular.circular = circular;
  await assert.rejects(pp.guardar('estado', circular), { name: 'TypeError' });
  assert.equal(a.aperturas, 0);
});

test('cierre por cambio de versión permite volver a abrir', async () => {
  const a = almacen(), pp = entorno(a.indexedDB);
  const p = pp.guardar('estado', 1);
  await turno(); a.escrituras[0].completar(); await p;
  a.bd.onversionchange();
  const q = pp.guardar('estado', 2);
  await turno(); a.escrituras[1].completar(); await q;
  assert.equal(a.aperturas, 2);
});

test('interfaz no anuncia éxito antes de commit y consume quota sin rechazo suelto', async () => {
  const a = almacen(), pp = entorno(a.indexedDB), avisos = [];
  pp.estado = { nombre: 'Ana' }; pp.avisarError = (m) => avisos.push(m);
  const p = pp.persistirConAviso(() => avisos.push('Guardado'));
  await turno(); a.escrituras[0].petExito(); await turno();
  assert.deepEqual(avisos, []);
  a.escrituras[0].completar(); assert.equal(await p, true);
  assert.deepEqual(avisos, ['Guardado']); avisos.length = 0;
  const fallo = pp.persistirConAviso(() => avisos.push('Guardado'));
  await turno(); a.escrituras[1].cuota(); assert.equal(await fallo, false);
  assert.equal(avisos.length, 1); assert.match(avisos[0], /^No se pudo guardar/);
});

test('navegadores sin opción durability conservan espera por commit', async () => {
  const a = almacen(), original = a.bd.transaction;
  a.bd.transaction = function (n, m, o) { if (o) throw new TypeError('opción no soportada'); return original(n, m); };
  const pp = entorno(a.indexedDB), p = pp.guardar('estado', { nombre: 'Ana' });
  await turno(); a.escrituras[0].completar(); await p;
  assert.equal((await pp.leer('estado')).nombre, 'Ana');
});

test('diario con AES real: persiste, nueva sesión lo abre solo con el PIN correcto', async () => {
  const a = almacen(); a.automatico = 'ok';
  const pp = entorno(a.indexedDB, true);
  await pp.abrirDiario('1234');
  pp.entradasDiario().push({ id: '1', nota: 'Pidió ayuda', ayudo: [] });
  await pp.guardarDiario();
  assert.equal(JSON.stringify(await pp.leer('diario')).includes('Pidió ayuda'), false);
  const otraSesion = entorno(a.indexedDB, true);
  await assert.rejects(otraSesion.abrirDiario('9999'));
  assert.equal(otraSesion.diarioAbierto(), false);
  await otraSesion.abrirDiario('1234');
  assert.equal(otraSesion.entradasDiario()[0].nota, 'Pidió ayuda');
});

test('diario: abortar borrado y cambio PIN conserva llave/sal y todas las notas', async () => {
  const a = almacen(); a.automatico = 'ok';
  const pp = entorno(a.indexedDB, true);
  await pp.abrirDiario('1234');
  pp.entradasDiario().push({ id: '1', nota: 'Conservar', ayudo: [] });
  await pp.guardarDiario();
  const sal = (await pp.leer('diario')).sal;
  a.automatico = 'abort';
  await assert.rejects(pp.borrarDiario(), { name: 'AbortError' });
  assert.equal(pp.diarioAbierto(), true);
  await assert.rejects(pp.cambiarPinDiario('1234', '5678'), { name: 'AbortError' });
  a.automatico = 'ok';
  await pp.guardarDiario();
  assert.equal((await pp.leer('diario')).sal, sal);
  pp.cerrarDiario(); await pp.abrirDiario('1234');
  assert.equal(pp.entradasDiario()[0].nota, 'Conservar');
});

for (const tipo of ['quota', 'noDB']) test('diario nuevo: ' + tipo + ' no deja diario abierto ni copia falsa', async () => {
  const a = almacen(); a.automatico = 'quota';
  const pp = entorno(tipo === 'noDB' ? undefined : a.indexedDB, true);
  await assert.rejects(pp.abrirDiario('1234'));
  assert.equal(pp.diarioAbierto(), false);
  assert.equal(await pp.leer('diario'), null);
});

test('cambio PIN atómico: un aborto no cambia perfil, caja ni PIN; el éxito confirma ambos', async () => {
  const a = almacen(); a.automatico = 'ok';
  const pp = entorno(a.indexedDB, true);
  await pp.fijarPin('1234');
  await pp.guardar('estado', pp.estado);
  await pp.abrirDiario('1234');
  pp.entradasDiario().push({ id: '1', nota: 'No perder', ayudo: [] });
  await pp.guardarDiario();
  const perfilAntes = JSON.stringify(pp.estado.perfil), cajaAntes = JSON.stringify(await pp.leer('diario'));
  a.automatico = 'abort';
  await assert.rejects(pp.cambiarPinDuradero('1234', '5678'), { name: 'AbortError' });
  assert.equal(JSON.stringify(pp.estado.perfil), perfilAntes);
  assert.equal(JSON.stringify(await pp.leer('diario')), cajaAntes);
  assert.equal(await pp.comprobarPin('1234'), true);
  assert.equal(await pp.comprobarPin('5678'), false);
  a.automatico = 'ok';
  await pp.cambiarPinDuradero('1234', '5678');
  assert.equal(await pp.comprobarPin('5678'), true);
  const otra = entorno(a.indexedDB, true);
  otra.estado = await otra.leer('estado');
  assert.equal(await otra.comprobarPin('5678'), true);
  await otra.abrirDiario('5678');
  assert.equal(otra.entradasDiario()[0].nota, 'No perder');
  await assert.rejects(otra.abrirDiario('1234'));
});

test('guardarConjunto abortado no publica valores parciales', async () => {
  const a = almacen(); a.automatico = 'ok';
  const pp = entorno(a.indexedDB);
  await pp.guardarConjunto({ estado: { version: 'antes' }, diario: { version: 'antes' } });
  a.automatico = 'abort';
  await assert.rejects(pp.guardarConjunto({ estado: { version: 'después' }, diario: { version: 'después' } }));
  a.romperLecturas();
  await assert.rejects(pp.leer('estado'), { name: 'LecturaInciertaError' });
  a.romperLecturas(false);
  assert.equal((await pp.leer('estado')).version, 'antes');
  assert.equal((await pp.leer('diario')).version, 'antes');
});

for (const fallo of ['get', true, 'abort']) test('lectura incierta (' + fallo + ') bloquea overwrite aunque las escrituras funcionen', async () => {
  const a = almacen(); a.automatico = 'ok';
  a.guardados.set('estado', { nombre: 'familia real', notas: ['no perder'] });
  const pp = entorno(a.indexedDB); // sin copia anterior en memoria
  a.romperLecturas(fallo);
  await assert.rejects(pp.leer('estado'), { name: 'LecturaInciertaError' });
  a.romperLecturas(false); // la base ya permite tanto leer como escribir
  await assert.rejects(pp.guardar('estado', { nombre: 'ejemplo' }), { name: 'LecturaInciertaError' });
  await assert.rejects(pp.guardarConjunto({ estado: { nombre: 'ejemplo' }, diario: null }), { name: 'LecturaInciertaError' });
  assert.equal(a.escrituras.length, 0, 'el bloqueo ocurre ANTES de crear la escritura');
  await pp.guardar('sonda', { escrituraPosible: true });
  assert.equal(a.guardados.get('sonda').escrituraPosible, true);
  assert.equal(a.guardados.get('estado').nombre, 'familia real');
  const recuperado = await pp.leer('estado'); // solo esta lectura confirmada desbloquea
  assert.equal(recuperado.nombre, 'familia real');
  recuperado.nombre = 'familia editada';
  await pp.guardar('estado', recuperado);
  assert.equal(a.guardados.get('estado').nombre, 'familia editada');
});

test('una lectura pendiente tampoco permite una escritura que se adelante a su resultado', async () => {
  const a = almacen(); a.automatico = 'ok';
  a.guardados.set('estado', { nombre: 'original' });
  const pp = entorno(a.indexedDB);
  a.romperLecturas('pausa');
  const pendiente = pp.leer('estado');
  await turno();
  await assert.rejects(pp.guardar('estado', { nombre: 'adelantado' }), { name: 'LecturaInciertaError' });
  assert.equal(a.escrituras.length, 0);
  a.romperLecturas(false); a.lecturas[0].confirmar();
  assert.equal((await pendiente).nombre, 'original');
  await pp.guardar('estado', { nombre: 'confirmado' });
  assert.equal(a.guardados.get('estado').nombre, 'confirmado');
});

test('fallo transitorio al abrir tampoco se convierte en dato inexistente ni habilita overwrite', async () => {
  const a = almacen(); a.automatico = 'ok';
  a.guardados.set('estado', { nombre: 'original' });
  const pp = entorno(a.indexedDB);
  a.fallarApertura(new DOMException('apertura transitoria', 'UnknownError'));
  await assert.rejects(pp.leer('estado'), { name: 'LecturaInciertaError' });
  a.fallarApertura(null);
  await assert.rejects(pp.guardar('estado', {}), { name: 'LecturaInciertaError' });
  assert.equal((await pp.leer('estado')).nombre, 'original');
  await pp.guardar('estado', { nombre: 'recuperado' });
  assert.equal(a.guardados.get('estado').nombre, 'recuperado');
});

test('IndexedDB denegado permite sesión temporal, pero no sobrescribe al recuperar permisos sin releer', async () => {
  const a = almacen(); a.automatico = 'ok';
  a.guardados.set('estado', { nombre: 'conservar' });
  const pp = entorno(a.indexedDB);
  a.fallarApertura(new DOMException('acceso denegado', 'SecurityError'));
  assert.equal(await pp.leer('estado'), null); // solo sesión temporal, sin lectura confirmada
  a.fallarApertura(null);
  await assert.rejects(pp.guardar('estado', { nombre: 'ejemplo temporal' }), { name: 'LecturaInciertaError' });
  assert.equal(a.escrituras.length, 0);
  assert.equal((await pp.leer('estado')).nombre, 'conservar');
  await pp.guardar('estado', { nombre: 'edición segura' });
  assert.equal(a.guardados.get('estado').nombre, 'edición segura');
});
