// Navegador real y servidor SOLO local. No usa cuentas, .env ni servicios externos.
// node --test pruebas/guardado-browser.mjs (requiere Edge instalado)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep, extname } from 'node:path';
import { chromium } from 'playwright-core';

const raiz = fileURLToPath(new URL('../../app/', import.meta.url));
let servidor, browser, url;
before(async () => {
  servidor = createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, 'http://localhost').pathname;
      const ruta = resolve(raiz, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!ruta.startsWith(raiz.endsWith(sep) ? raiz : raiz + sep)) { res.writeHead(403).end(); return; }
      let cuerpo = await readFile(ruta);
      if (pathname === '/') cuerpo = Buffer.from(cuerpo.toString().replace('PP.iniciar();', `
        window.avisos = []; window.rechazos = []; window.navegaciones = [];
        addEventListener('unhandledrejection', e => { window.rechazos.push(String(e.reason)); });
        PP.avisar = mensaje => { avisos.push(mensaje); document.getElementById('aviso').textContent = mensaje; };
        const avisarErrorReal = PP.avisarError;
        PP.avisarError = (mensaje, opciones) => { avisos.push(mensaje); avisarErrorReal(mensaje, opciones); };
        PP.evento = () => {};
        PP.acceso.cerrada = () => false;
        PP.estado = PP.datosEjemplo(); PP.estado.perfil.sinEjemplos = true;
        PP.estado.perfil.imagenes = 'simbolos';
        PP.ir = nombre => { navegaciones.push(nombre); };
        window.paramsPrueba = {};
        window.pintarPrueba = (nombre, params = {}) => {
          window.paramsPrueba = params;
          PP.actual = {nombre, params};
          const titulo = PP.pantallas[nombre].titulo;
          document.getElementById('titulo').textContent = typeof titulo === 'function' ? titulo(params) : titulo;
          PP.pantallas[nombre].pintar(document.getElementById('contenido'), params);
        };
        window.fallo = null;
        const put = IDBObjectStore.prototype.put;
        IDBObjectStore.prototype.put = function (...args) {
          if (fallo === 'quota') throw new DOMException('cuota inyectada', 'QuotaExceededError');
          const pet = put.apply(this, args), tx = this.transaction;
          if (fallo === 'abort') pet.addEventListener('success', () => tx.abort());
          return pet;
        };
      `));
      const tipos = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
      res.writeHead(200, { 'content-type': tipos[extname(ruta)] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(cuerpo);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(r => servidor.listen(0, '127.0.0.1', r));
  url = `http://127.0.0.1:${servidor.address().port}/`;
  browser = await chromium.launch({ channel: 'msedge', headless: true, timeout: 20000,
    args: ['--js-flags=--max-old-space-size=256', '--disable-gpu'] });
});
after(async () => {
  await browser?.close();
  if (servidor) await new Promise(r => servidor.close(r));
});

async function pagina(t) {
  const contexto = await browser.newContext({ viewport: { width: 375, height: 812 }, serviceWorkers: 'block' });
  t.after(() => contexto.close());
  const p = await contexto.newPage();
  // Nunca contactar redes externas, ni siquiera estadísticas o fotos de ejemplo.
  await p.route('**/*', route => route.request().url().startsWith(url) ? route.continue() : route.abort());
  const errores = [];
  p.on('pageerror', e => errores.push(e.message));
  t.after(() => assert.deepEqual(errores, []));
  await p.goto(url);
  return p;
}

test('IndexedDB real: estado y diario AES sobreviven reload, sin notas en texto plano', async t => {
  const p = await pagina(t);
  await p.evaluate(async () => {
    PP.estado.perfil.nombre = 'Lucía';
    await PP.persistir();
    await PP.abrirDiario('1234');
    PP.entradasDiario().push({ id: 'real-1', fecha: '2026-10-27T12:00', tipo: 'bueno', nota: 'Pidió ayuda con palabras', causas: [], ayudo: [] });
    await PP.guardarDiario();
  });
  const caja = await p.evaluate(() => PP.leer('diario'));
  assert.ok(caja.iv && caja.sal && caja.datos);
  assert.equal(JSON.stringify(caja).includes('Pidió ayuda'), false);
  await p.reload();
  const datos = await p.evaluate(async () => {
    const estado = await PP.leer('estado');
    let pinIncorrecto = false;
    try { await PP.abrirDiario('9999'); } catch { pinIncorrecto = true; }
    await PP.abrirDiario('1234');
    return { nombre: estado.perfil.nombre, entradas: PP.entradasDiario(), pinIncorrecto, rechazos };
  });
  assert.equal(datos.nombre, 'Lucía');
  assert.equal(datos.entradas[0].nota, 'Pidió ayuda con palabras');
  assert.equal(datos.pinIncorrecto, true);
  assert.deepEqual(datos.rechazos, []);
});

test('aborto REAL después de put no altera el valor previo tras reload', async t => {
  const p = await pagina(t);
  assert.equal(await p.evaluate(async () => {
    await PP.guardar('estado', { nombre: 'antes' });
    fallo = 'abort';
    try { await PP.guardar('estado', { nombre: 'no confirmado' }); return 'éxito falso'; }
    catch (e) { return e.name; }
  }), 'AbortError');
  await p.reload();
  assert.equal((await p.evaluate(() => PP.leer('estado'))).nombre, 'antes');
});

test('noIndexedDB: rechaza escritura, avisa una vez y no produce rechazo no manejado', async t => {
  const p = await pagina(t);
  const resultado = await p.evaluate(async () => {
    Object.defineProperty(window, 'indexedDB', { value: undefined });
    let error;
    try { await PP.guardar('estado', PP.estado); } catch (e) { error = e.name; }
    const guardado = await PP.persistirConAviso(() => PP.avisar('Guardado'));
    await new Promise(r => setTimeout(r, 0));
    return { error, guardado, leido: await PP.leer('estado'), avisos, rechazos };
  });
  assert.equal(resultado.error, 'TypeError');
  assert.equal(resultado.guardado, false);
  assert.equal(resultado.leido, null);
  assert.equal(resultado.avisos.length, 1);
  assert.match(resultado.avisos[0], /^No se pudo guardar/);
  assert.deepEqual(resultado.rechazos, []);
});

test('diario: quota conserva borrador, revierte entradas, permite reintento y reload', async t => {
  const p = await pagina(t);
  await p.evaluate(async () => { await PP.abrirDiario('1234'); pintarPrueba('diarioNuevo'); });
  await p.locator('[data-tipo="bueno"]').click();
  // PP.repintar usa la pantalla real y el mismo params que la prueba.
  await p.locator('#d-nota').fill('Guardé la mochila');
  await p.evaluate(() => { fallo = 'quota'; });
  await p.locator('#form-d button[type=submit]').click();
  await p.waitForFunction(() => avisos.some(x => x.startsWith('No se pudo guardar')));
  assert.equal(await p.locator('#d-nota').inputValue(), 'Guardé la mochila');
  assert.deepEqual(await p.evaluate(() => PP.entradasDiario()), []);
  assert.deepEqual(await p.evaluate(() => navegaciones), []);
  assert.equal(await p.locator('#form-d button[type=submit]').isEnabled(), true);
  assert.equal(await p.evaluate(() => avisos.includes('Guardado en el diario')), false);
  await p.evaluate(() => { fallo = null; });
  await p.locator('#error-guardado [data-reintentar]').click();
  await p.waitForFunction(() => avisos.includes('Guardado en el diario'));
  assert.equal(await p.locator('#error-guardado').count(), 0);
  await p.reload();
  const notas = await p.evaluate(async () => { await PP.abrirDiario('1234'); return PP.entradasDiario(); });
  assert.equal(notas.length, 1);
  assert.equal(notas[0].nota, 'Guardé la mochila');
});

test('diario: doble submit durante cifrado solo escribe una vez y bloquea controles', async t => {
  const p = await pagina(t);
  await p.evaluate(async () => {
    await PP.abrirDiario('1234'); pintarPrueba('diarioNuevo');
  });
  await p.locator('[data-tipo="bueno"]').click();
  await p.locator('#d-nota').fill('Una sola nota');
  await p.evaluate(() => {
    const cifrar = PP.cifrado.cifrar;
    window.veces = 0;
    PP.cifrado.cifrar = function (...args) {
      veces++;
      return new Promise(resolve => { window.soltar = () => resolve(cifrar.apply(this, args)); });
    };
    document.querySelector('#form-d').requestSubmit();
    document.querySelector('#form-d').dispatchEvent(new Event('submit', { cancelable: true }));
  });
  assert.equal(await p.locator('#form-d button[type=submit]').isDisabled(), true);
  assert.equal(await p.evaluate(() => veces), 1);
  assert.deepEqual(await p.evaluate(() => avisos), []);
  await p.evaluate(() => soltar());
  await p.waitForFunction(() => avisos.includes('Guardado en el diario'));
  assert.equal(await p.evaluate(() => PP.entradasDiario().length), 1);
});

test('diario: fallo al borrar y al cambiar PIN conserva la caja y la llave anterior', async t => {
  const p = await pagina(t);
  const resultado = await p.evaluate(async () => {
    await PP.abrirDiario('1234');
    PP.entradasDiario().push({ id: '1', nota: 'Conservar', ayudo: [] });
    await PP.guardarDiario();
    const antes = await PP.leer('diario');
    fallo = 'abort';
    let borrar = false, pin = false;
    try { await PP.borrarDiario(); } catch { borrar = true; }
    const sigueAbierto = PP.diarioAbierto();
    try { await PP.cambiarPinDiario('1234', '5678'); } catch { pin = true; }
    fallo = null;
    await PP.guardarDiario(); // prueba que la llave en memoria NO quedó con el PIN fallido
    PP.cerrarDiario(); await PP.abrirDiario('1234');
    return { borrar, pin, sigueAbierto, notas: PP.entradasDiario(), salAntes: antes.sal, salDespues: (await PP.leer('diario')).sal, rechazos };
  });
  assert.equal(resultado.borrar, true);
  assert.equal(resultado.pin, true);
  assert.equal(resultado.sigueAbierto, true);
  assert.equal(resultado.salAntes, resultado.salDespues);
  assert.equal(resultado.notas[0].nota, 'Conservar');
  assert.deepEqual(resultado.rechazos, []);
});

test('abrir diario por primera vez sin espacio no lo deja marcado como abierto', async t => {
  const p = await pagina(t);
  const resultado = await p.evaluate(async () => {
    fallo = 'quota';
    let error = false;
    try { await PP.abrirDiario('1234'); } catch { error = true; }
    return { error, abierto: PP.diarioAbierto(), caja: await PP.leer('diario') };
  });
  assert.equal(resultado.error, true);
  assert.equal(resultado.abierto, false);
  assert.equal(resultado.caja, null);
});

test('caller real de calma maneja cuota sin éxito falso ni rechazo suelto', async t => {
  const p = await pagina(t);
  await p.evaluate(() => { pintarPrueba('calma'); fallo = 'quota'; });
  await p.locator('input[name=resp]').first().check();
  await p.waitForFunction(() => avisos.length > 0);
  assert.match((await p.evaluate(() => avisos))[0], /^No se pudo guardar/);
  assert.equal(await p.evaluate(() => avisos.includes('Guardado')), false);
  assert.deepEqual(await p.evaluate(() => rechazos), []);
});

test('Ajustes: error persistente a 375px, rollback, cierre explícito y reintento durable', async t => {
  const p = await pagina(t);
  await p.evaluate(async () => { await PP.persistir(); pintarPrueba('ajustes'); fallo = 'quota'; });
  await p.locator('#aj-nombre').fill('Lucía');
  await p.locator('#form-ajustes [type=submit]').click();
  await p.waitForFunction(() => document.querySelector('#error-guardado'));
  assert.equal(await p.locator('#aj-nombre').inputValue(), 'Lucía', 'el borrador permanece');
  assert.equal(await p.evaluate(() => PP.estado.perfil.nombre), 'Mateo', 'memoria revierte el perfil');
  assert.equal(await p.evaluate(() => avisos.includes('Ajustes guardados')), false);
  await p.waitForTimeout(3000); // supera el aviso breve de 2600ms
  assert.equal(await p.locator('#error-guardado').isVisible(), true);
  assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  const salida = new URL('../../docs/revisiones/', import.meta.url);
  await mkdir(salida, { recursive: true });
  await p.screenshot({ path: fileURLToPath(new URL('guardado-error-375.png', salida)), fullPage: true });
  await p.locator('#error-guardado [data-entendido]').click();
  assert.equal(await p.locator('#error-guardado').count(), 0);
  assert.equal(await p.evaluate(() => document.activeElement === document.querySelector('#form-ajustes [type=submit]')), true);
  // Volver a fallar y reintentar desde el propio aviso, sin recorrer el formulario.
  await p.locator('#form-ajustes [type=submit]').click();
  await p.waitForFunction(() => document.querySelector('#error-guardado'));
  await p.evaluate(() => { fallo = null; });
  await p.locator('#error-guardado [data-reintentar]').click();
  await p.waitForFunction(() => avisos.includes('Ajustes guardados'));
  assert.equal(await p.locator('#error-guardado').count(), 0, 'el éxito resuelve el aviso del mismo contexto');
  await p.reload();
  assert.equal((await p.evaluate(() => PP.leer('estado'))).perfil.nombre, 'Lucía');
  assert.deepEqual(await p.evaluate(() => rechazos), []);
});

test('Preparar: quota desde interruptor no anuncia Guardado ni deja rechazo sin manejar', async t => {
  const p = await pagina(t);
  await p.evaluate(() => { pintarPrueba('preparar'); fallo = 'quota'; });
  await p.locator('#esp-agenda').uncheck();
  await p.waitForFunction(() => document.querySelector('#error-guardado'));
  assert.equal(await p.evaluate(() => avisos.includes('Guardado')), false);
  assert.deepEqual(await p.evaluate(() => rechazos), []);
});

test('Restaurar ejemplos: aborto real conserva estado y diario; éxito borra ambos juntos', async t => {
  const p = await pagina(t);
  await p.evaluate(async () => {
    PP.estado.perfil.nombre = 'Conservar'; await PP.fijarPin('1234'); await PP.persistir();
    await PP.abrirDiario('1234'); PP.entradasDiario().push({ id: '1', nota: 'Conservar también', ayudo: [] });
    await PP.guardarDiario(); pintarPrueba('ajustes'); fallo = 'abort';
  });
  await p.locator('#aj-reset').click();
  await p.locator('#aj-reset-si').click();
  await p.waitForFunction(() => document.querySelector('#error-guardado'));
  const antes = await p.evaluate(async () => ({ nombre: (await PP.leer('estado')).perfil.nombre,
    abierto: PP.diarioAbierto(), notas: PP.entradasDiario(), avisos, rechazos }));
  assert.equal(antes.nombre, 'Conservar');
  assert.equal(antes.abierto, true);
  assert.equal(antes.notas[0].nota, 'Conservar también');
  assert.equal(antes.avisos.includes('Datos de ejemplo restaurados'), false);
  assert.deepEqual(antes.rechazos, []);
  assert.equal(await p.locator('#error-guardado [data-reintentar]').isVisible(), false, 'nunca ofrece repetir un borrado desde el aviso');
  await p.locator('#error-guardado [data-entendido]').click();
  assert.equal(await p.evaluate(() => document.activeElement === document.querySelector('#aj-reset-si')), true);
  await p.evaluate(() => { fallo = null; });
  await p.locator('#aj-reset-si').click();
  await p.waitForFunction(() => avisos.includes('Datos de ejemplo restaurados'));
  await p.reload();
  const despues = await p.evaluate(async () => ({ nombre: (await PP.leer('estado')).perfil.nombre, diario: await PP.leer('diario') }));
  assert.equal(despues.nombre, 'Mateo');
  assert.equal(despues.diario, null);
});

test('PIN desde Ajustes: fallo conserva PIN y diario; reintento y reload usan el nuevo', async t => {
  const p = await pagina(t);
  await p.evaluate(async () => {
    await PP.fijarPin('1234'); await PP.persistir(); await PP.abrirDiario('1234');
    PP.entradasDiario().push({ id: '1', nota: 'Nota privada', ayudo: [] }); await PP.guardarDiario();
    pintarPrueba('ajustes');
    PP.pedirPin = opciones => {
      fallo = 'abort'; // los ajustes ordinarios ya se guardaron; abortar SOLO el cambio de PIN
      opciones.alAcertar('1234');
    };
  });
  await p.locator('#aj-pin').fill('5678');
  await p.locator('#form-ajustes [type=submit]').click();
  await p.waitForFunction(() => document.querySelector('#error-guardado'));
  assert.equal(await p.evaluate(() => PP.comprobarPin('1234')), true);
  assert.equal(await p.evaluate(() => avisos.includes('PIN cambiado')), false);
  await p.evaluate(async () => {
    PP.cerrarDiario(); await PP.abrirDiario('1234');
    fallo = null; PP.pedirPin = opciones => opciones.alAcertar('1234');
  });
  await p.locator('#error-guardado [data-entendido]').click();
  await p.locator('#form-ajustes [type=submit]').click();
  await p.waitForFunction(() => avisos.includes('PIN cambiado'));
  await p.reload();
  const resultado = await p.evaluate(async () => {
    PP.estado = await PP.leer('estado'); await PP.abrirDiario('5678');
    return { valido: await PP.comprobarPin('5678'), nota: PP.entradasDiario()[0].nota, rechazos };
  });
  assert.equal(resultado.valido, true);
  assert.equal(resultado.nota, 'Nota privada');
  assert.deepEqual(resultado.rechazos, []);
});

test('arranque sin IndexedDB continúa en sesión con error persistente y sin rechazo suelto', async t => {
  const p = await pagina(t);
  await p.evaluate(() => {
    Object.defineProperty(window, 'indexedDB', { value: undefined });
    PP.acceso.arrancar = () => Promise.resolve();
    PP.iniciar();
  });
  await p.waitForFunction(() => navegaciones.includes('inicio'));
  assert.equal(await p.locator('#error-guardado').isVisible(), true);
  assert.match(await p.locator('#error-guardado').textContent(), /podrían perderse al cerrar/);
  assert.deepEqual(await p.evaluate(() => rechazos), []);
});

test('lectura fallida al arrancar: get.onerror real no permite reemplazar el estado anterior', async t => {
  const p = await pagina(t);
  await p.evaluate(async () => {
    PP.estado.perfil.nombre = 'Familia real'; await PP.persistir();
  });
  await p.reload(); // la sesión nueva no tiene copia del guardado en memoria
  await p.evaluate(() => {
    window.fallarGet = true; window.intentosGuardar = 0;
    const get = IDBObjectStore.prototype.get;
    IDBObjectStore.prototype.get = function (...args) {
      const pet = get.apply(this, args);
      if (fallarGet && args[0] === 'estado') this.transaction.abort();
      return pet;
    };
    const guardar = PP.guardar;
    PP.guardar = function (...args) { intentosGuardar++; return guardar.apply(this, args); };
    PP.estado = null;
    PP.acceso.arrancar = () => Promise.resolve();
    PP.iniciar();
  });
  await p.waitForFunction(() => document.querySelector('#error-guardado'));
  assert.match(await p.locator('#error-guardado').textContent(), /No se pudieron leer/);
  assert.equal(await p.evaluate(() => intentosGuardar), 0, 'el arranque no intenta autoguardar ejemplos');
  assert.equal(await p.evaluate(() => PP.estado), null);
  assert.deepEqual(await p.evaluate(() => navegaciones), []);
  const protegido = await p.evaluate(async () => {
    fallarGet = false;
    // Probar que IndexedDB SÍ escribe: el fallo fue únicamente de lectura.
    await new Promise((ok, fallo) => {
      const pet = indexedDB.open('paso-a-paso', 1);
      pet.onerror = () => fallo(pet.error);
      pet.onsuccess = () => {
        const bd = pet.result, tx = bd.transaction('cajon', 'readwrite');
        tx.oncomplete = () => { bd.close(); ok(); };
        tx.onerror = () => { bd.close(); fallo(tx.error); };
        tx.objectStore('cajon').put({ escrituraPosible: true }, 'sonda-lectura');
      };
    });
    let bloqueado = false;
    try { await PP.guardar('estado', PP.datosEjemplo()); } catch (e) { bloqueado = e.name === 'LecturaInciertaError'; }
    const original = await PP.leer('estado'); // recupera y desbloquea SOLO al confirmar
    await PP.guardar('estado', original);
    return { bloqueado, nombre: original.perfil.nombre, rechazos };
  });
  assert.equal(protegido.bloqueado, true);
  assert.equal(protegido.nombre, 'Familia real');
  assert.deepEqual(protegido.rechazos, []);
  await p.reload();
  assert.equal((await p.evaluate(() => PP.leer('estado'))).perfil.nombre, 'Familia real');
});

test('éxito de Ajustes no retira un error de otro contexto ni activa una acción de borrado', async t => {
  const p = await pagina(t);
  await p.evaluate(() => {
    pintarPrueba('ajustes');
    PP.avisarError('El diario no se pudo abrir.', { contexto: 'abrir-diario', origen: document.querySelector('#aj-nombre') });
  });
  await p.locator('#form-ajustes [type=submit]').click();
  await p.waitForFunction(() => avisos.includes('Ajustes guardados'));
  assert.equal(await p.locator('#error-guardado').isVisible(), true);
  assert.match(await p.locator('#error-guardado').textContent(), /El diario no se pudo abrir/);
  assert.equal(await p.locator('#error-guardado [data-reintentar]').isVisible(), false);
  await p.locator('#error-guardado [data-entendido]').click();
  assert.equal(await p.evaluate(() => document.activeElement.id), 'aj-nombre');
  assert.deepEqual(await p.evaluate(() => rechazos), []);
});
