import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const destino = nombre => fileURLToPath(new URL(`../../docs/revisiones/${nombre}`, import.meta.url));
const base = 'http://127.0.0.1:3109';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const resultados = [];
const errores = [];
try {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
  page.setDefaultNavigationTimeout(120000);
  page.on('pageerror', e => errores.push(e.message));
  await page.addInitScript(() => {
    localStorage.setItem('pp_sin_estadisticas', '1');
    localStorage.setItem('pp_onboarding', JSON.stringify({ v: 1, respuestas: { nombre: 'Mateo', edad: '5-7', momento: 'manana', crisis: ['llora'] }, plan: 'anual', ts: Date.now() }));
  });
  const estilo = 'nextjs-portal { display: none !important; }';
  for (const width of [375, 360, 1440]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 812 });
    await page.goto(base, { waitUntil: 'networkidle' });
    const oferta = page.locator('#oferta');
    await oferta.scrollIntoViewIfNeeded();
    await oferta.getByRole('link', { name: 'Empezar mis 7 días gratis' }).waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll('#oferta [style]')].every(e => Number(getComputedStyle(e).opacity) > .99));
    assert.match(await oferta.innerText(), /US\$4,99/);
    assert.doesNotMatch(await page.locator('body').innerText(), /7\.99|59\.90|30 días de garantía|te devolvemos todo/);
    assert.equal(await oferta.locator('a[href*="plan=anual"]').count(), 0);
    assert.equal(await oferta.getByRole('link', { name: 'Empezar mis 7 días gratis' }).getAttribute('href'), '/onboarding?plan=mensual');
    await oferta.screenshot({ path: destino(`landing-precio-${width}.png`), style: estilo });
    resultados.push(await page.evaluate(() => ({ pantalla: 'landing', width: innerWidth, contenido: document.documentElement.scrollWidth })));

    await page.goto(`${base}/paywall?p=3&plan=anual`, { waitUntil: 'networkidle' });
    await page.getByText('US$4,99', { exact: true }).waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll('main > [style], fieldset > [style]')].every(e => Number(getComputedStyle(e).opacity) > .99));
    assert.equal(await page.getByRole('button', { name: 'Pagos disponibles muy pronto' }).isDisabled(), true);
    assert.doesNotMatch(await page.locator('main').innerText(), /Anual|7\.99|59\.90|30 días/);
    await page.screenshot({ path: destino(`paywall-precio-${width}.png`), fullPage: true, style: estilo });
    resultados.push(await page.evaluate(() => ({ pantalla: 'paywall', width: innerWidth, contenido: document.documentElement.scrollWidth })));
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${base}/paywall?p=2&plan=anual`, { waitUntil: 'networkidle' });
  assert.match((await page.locator('main').innerText()).replace(/\u00a0/g, ' '), /US\$4,99 al mes/);
  await page.screenshot({ path: destino('paywall-prueba-mensual-375.png'), fullPage: true, style: estilo });
  await page.goto(`${base}/onboarding?plan=anual`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Seguir', exact: true }).click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('pp_onboarding')).plan === 'mensual');
  await page.goto(base + '/paywall?p=3', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const estado = JSON.parse(localStorage.getItem('pp_onboarding'));
    estado.respuestas.nombre = 'María José Antonia';
    const newValue = JSON.stringify(estado);
    localStorage.setItem('pp_onboarding', newValue);
    dispatchEvent(new StorageEvent('storage', { key: 'pp_onboarding', newValue }));
  });
  await page.getByRole('heading', { name: /María José Antonia/ }).waitFor();
  await page.screenshot({ path: destino('paywall-precio-nombrelargo-375.png'), fullPage: true, style: estilo });
  resultados.push(await page.evaluate(() => ({ pantalla: 'paywall nombre largo', width: innerWidth, contenido: document.documentElement.scrollWidth })));
  assert.ok(resultados.every(r => r.contenido <= r.width), 'Desborde horizontal');
  assert.deepEqual(errores, []);
  await writeFile(destino('precio-mediciones.json'), JSON.stringify({ resultados, errores, pruebas: ['precio mensual único', 'enlace antiguo anual', 'respuestas conservadas', 'cobro día 7 mensual', 'CTA sin enlace deshabilitado', 'enlace de reembolsos'] }, null, 2));
  console.log(JSON.stringify(resultados));
} finally { await browser.close(); }
