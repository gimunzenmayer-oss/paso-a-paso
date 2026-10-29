import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
const destino = (nombre) => fileURLToPath(new URL(`../../docs/revisiones/${nombre}`, import.meta.url));
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const resultados = [];
try {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
  const errores = [];
  page.setDefaultNavigationTimeout(120000);
  page.on('pageerror', e => errores.push(e.message));
  for (const width of [375, 360, 1440]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 812 });
    await page.goto('http://127.0.0.1:3108/entrar', { waitUntil: 'networkidle' });
    await page.locator('#correo').fill('ana.prueba@example.com');
    await page.screenshot({ path: destino(`entrada-${width}.png`), fullPage: true, style: 'nextjs-portal { display: none !important; }' });
    resultados.push(await page.evaluate(() => {
      const input = document.querySelector('#correo').getBoundingClientRect();
      const boton = document.querySelector('button[type=submit]').getBoundingClientRect();
      return { width: innerWidth, contenido: document.documentElement.scrollWidth, separacionCampoBoton: boton.top - input.bottom, botonAlto: boton.height };
    }));
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://127.0.0.1:3108/entrar');
  await page.getByRole('button', { name: 'Enviarme el código' }).click();
  await page.locator('#error-correo').filter({ hasText: 'Revisa tu correo' }).waitFor();
  await page.screenshot({ path: destino('entrada-error-375.png'), fullPage: true, style: 'nextjs-portal { display: none !important; }' });
  await page.locator('#correo').fill('ana.prueba@example.com');
  await page.getByRole('button', { name: 'Enviarme el código' }).click();
  await page.locator('#codigo').waitFor();
  await page.screenshot({ path: destino('entrada-codigo-375.png'), fullPage: true, style: 'nextjs-portal { display: none !important; }' });
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.locator('#error-codigo').filter({ hasText: 'Escribe los 6' }).waitFor();
  // Correo y código son ficticios; el servidor se inició con la simulación existente solo en desarrollo.
  await page.locator('#codigo').fill('000000');
  await page.locator('#error-codigo').filter({ hasText: 'no coincide' }).waitFor();
  await page.getByRole('button', { name: 'Usar otro correo' }).click();
  await page.locator('#correo').waitFor();
  await page.context().setOffline(true);
  await page.getByRole('button', { name: 'Enviarme el código' }).click();
  await page.locator('#error-correo').filter({ hasText: 'internet' }).waitFor();
  await page.context().setOffline(false);
  await page.goto('http://127.0.0.1:3108/entrar?compra=1&error=enlace');
  await page.waitForFunction(() => [...document.querySelectorAll('main h1, main section, main form, main [style]')].every(e => Number(getComputedStyle(e).opacity) > 0.99));
  await page.screenshot({ path: destino('entrada-compra-375.png'), fullPage: true, style: 'nextjs-portal { display: none !important; }' });
  if (resultados.some(r => r.contenido > r.width || r.botonAlto < 44 || r.separacionCampoBoton > 40)) throw Error('Layout fuera del objetivo');
  if (errores.length) throw Error(JSON.stringify(errores));
  await writeFile(destino('entrada-mediciones.json'), JSON.stringify({ resultados, pruebas: ['validacion vacia', 'codigo simulado', 'codigo incompleto', 'codigo incorrecto', 'cambiar correo', 'sin conexion', 'variante compra/enlace'], errores }, null, 2));
  console.log(JSON.stringify(resultados));
} finally { await browser.close(); }

