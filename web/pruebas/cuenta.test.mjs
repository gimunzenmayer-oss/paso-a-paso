// Pruebas de las funciones puras de /entrar y /cuenta (entrada de pago, paso 7).
// Correr con: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizarCorreo, limpiarCodigo, codigoCompleto, errorDeEnvio, errorDeVerificacion, VIGENCIA_CODIGO_MS } from '../lib/cuenta/formato.ts';
import { leerMiAcceso, claveCuenta, seReactiva, seGestionaEnHotmart } from '../lib/cuenta/acceso.ts';
import { accesoSimulado, codigoSimulado, correoSimulado, ESTADOS_SIMULADOS } from '../lib/cuenta/simulacion.ts';
import { ESTADOS, ERRORES_CODIGO, ERRORES_ENVIO, ENTRAR, CUENTA } from '../components/cuenta/textos.ts';

const AHORA = Date.parse('2026-10-22T12:00:00Z');
const DIA = 24 * 60 * 60 * 1000;

test('correo: normaliza y rechaza lo incompleto', () => {
  assert.equal(normalizarCorreo('  Ana@Gmail.com '), 'ana@gmail.com');
  for (const malo of ['', 'ana', 'ana@gmail', 'ana @gmail.com', '@gmail.com', null, 5]) assert.equal(normalizarCorreo(malo), null);
});

test('código: solo dígitos, máximo 6', () => {
  assert.equal(limpiarCodigo('123 456'), '123456');
  assert.equal(limpiarCodigo('12-34-56-78'), '123456');
  assert.equal(limpiarCodigo(undefined), '');
  assert.equal(codigoCompleto('123456'), true);
  assert.equal(codigoCompleto('12345'), false);
});

test('errores de envío: nunca dependen de si el correo existe', () => {
  assert.equal(errorDeEnvio({ status: 429, code: 'over_email_send_rate_limit' }), 'demasiados');
  assert.equal(errorDeEnvio({ status: 500 }), 'red');
  assert.equal(errorDeEnvio({ status: 0 }), 'red');
});

test('errores del código: incorrecto antes de 10 minutos, vencido después', () => {
  const f = { status: 403, code: 'otp_expired' };
  assert.equal(errorDeVerificacion(f, AHORA - 60_000, AHORA), 'incorrecto');
  assert.equal(errorDeVerificacion(f, AHORA - VIGENCIA_CODIGO_MS - 1, AHORA), 'vencido');
  assert.equal(errorDeVerificacion(f, null, AHORA), 'incorrecto');
  assert.equal(errorDeVerificacion({ status: 429, code: 'over_request_rate_limit' }, AHORA, AHORA), 'muchos');
  assert.equal(errorDeVerificacion({ status: 503 }, AHORA, AHORA), 'red');
});

test('mi_acceso: valida la forma de la respuesta', () => {
  assert.deepEqual(leerMiAcceso({ acceso: true, estado: 'active', hasta: '2026-11-01T00:00:00Z' }), {
    acceso: true,
    estado: 'active',
    hasta: '2026-11-01T00:00:00Z',
  });
  assert.equal(leerMiAcceso(null), null);
  assert.equal(leerMiAcceso('active'), null);
  assert.equal(leerMiAcceso({ acceso: 'true', estado: 'active' }), null);
  assert.equal(leerMiAcceso({ acceso: true, estado: 'active', hasta: 'mañana' }), null);
});

test('cuenta: cada estado de la base cae en su fila de §4', () => {
  const futuro = new Date(AHORA + DIA).toISOString();
  const pasado = new Date(AHORA - DIA).toISOString();
  const c = (estado, hasta = null) => claveCuenta({ acceso: false, estado, hasta }, AHORA);
  assert.equal(c('trialing', futuro), 'trialing');
  assert.equal(c('active', futuro), 'active');
  assert.equal(c('past_due'), 'past_due');
  assert.equal(c('cancelled', futuro), 'cancelada');
  assert.equal(c('cancelled', pasado), 'terminada');
  assert.equal(c('cancelled'), 'terminada');
  assert.equal(c('expired', pasado), 'terminada');
  assert.equal(c('refunded'), 'refunded');
  assert.equal(c('chargeback'), 'refunded');
  assert.equal(c('none'), 'sin_compra');
  assert.equal(c('admin'), 'admin');
  // Sin respuesta clara nunca se dice "no compraste".
  assert.equal(claveCuenta(null, AHORA), 'sin_verificar');
  assert.equal(c('sin_sesion'), 'sin_verificar');
  assert.equal(c('estado_nuevo'), 'sin_verificar');
});

test('cuenta: botones según el estado', () => {
  assert.deepEqual(['terminada', 'refunded', 'sin_compra'].map(seReactiva), [true, true, true]);
  assert.deepEqual(['trialing', 'active', 'cancelada', 'admin'].map(seReactiva), [false, false, false, false]);
  assert.equal(seGestionaEnHotmart('active'), true);
  assert.equal(seGestionaEnHotmart('admin'), false);
  assert.equal(seGestionaEnHotmart('sin_compra'), false);
});

test('simulación: solo con NODE_ENV=development', () => {
  const dev = { nodeEnv: 'development', acceso: 'active', codigo: '123456' };
  assert.equal(codigoSimulado(dev), '123456');
  assert.equal(accesoSimulado(dev, AHORA).acceso.estado, 'active');
  assert.equal(correoSimulado(dev, 'ana@gmail.com'), 'ana@gmail.com');
  for (const nodeEnv of ['production', 'test', undefined, 'Development', 'development ']) {
    const e = { ...dev, nodeEnv };
    assert.equal(codigoSimulado(e), null, `codigo con ${nodeEnv}`);
    assert.equal(accesoSimulado(e, AHORA), undefined, `acceso con ${nodeEnv}`);
    assert.equal(correoSimulado(e, 'ana@gmail.com'), null, `sesion con ${nodeEnv}`);
  }
  assert.equal(codigoSimulado({ ...dev, codigo: '12345' }), null);
  assert.equal(accesoSimulado({ ...dev, acceso: 'gratis' }, AHORA), undefined);
  assert.equal(correoSimulado(dev, 'no es correo'), null);
});

test('simulación: cada valor da el estado de §4 que promete', () => {
  const esperado = {
    trialing: 'trialing',
    active: 'active',
    past_due: 'past_due',
    cancelled: 'cancelada',
    terminada: 'terminada',
    expired: 'terminada',
    refunded: 'refunded',
    none: 'sin_compra',
    admin: 'admin',
    error: 'sin_verificar',
  };
  assert.deepEqual(Object.keys(esperado).sort(), [...ESTADOS_SIMULADOS].sort());
  for (const v of ESTADOS_SIMULADOS) {
    const s = accesoSimulado({ nodeEnv: 'development', acceso: v, codigo: undefined }, AHORA);
    assert.equal(claveCuenta(s.acceso, AHORA), esperado[v], v);
  }
});

test('copy: cada texto de /entrar y /cuenta está en docs/copy/embudo.md', () => {
  const md = readFileSync(new URL('../../docs/copy/embudo.md', import.meta.url), 'utf8');
  const textos = [
    ENTRAR.correo.titulo,
    ENTRAR.correo.ayuda,
    ENTRAR.correo.errorFormato,
    ENTRAR.compra.titulo,
    ENTRAR.compra.ayuda,
    ENTRAR.codigo.texto,
    ENTRAR.codigo.reenviado,
    ENTRAR.rescate.titulo,
    ENTRAR.errorEnlace,
    ...Object.values(ERRORES_ENVIO),
    ...Object.values(ERRORES_CODIGO),
    CUENTA.hotmartAyuda,
    CUENTA.confirmar.titulo,
    CUENTA.enCamino.texto,
    ...Object.values(ESTADOS).flatMap((e) => [e.etiqueta, e.detalle, ...(e.detalleSinFecha ? [e.detalleSinFecha] : [])]),
  ];
  for (const t of textos) assert.ok(md.includes(t), `falta en embudo.md: ${t}`);
});
