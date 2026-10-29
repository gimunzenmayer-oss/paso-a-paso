import {chromium} from 'playwright-core';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const correo=process.argv.includes('--correo');
const base=process.env.GUIA_TEST_BASE??'http://127.0.0.1:3111';
const destino=n=>fileURLToPath(new URL('../../docs/revisiones/'+n,import.meta.url));
const browser=await chromium.launch({channel:'msedge',headless:true});
const resultados=[];
try{
  const page=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});
  const errores=[];page.on('pageerror',e=>errores.push(e.message));
  page.setDefaultNavigationTimeout(120000);
  if(!correo){
    for(const width of [375,360,1440]){
      await page.setViewportSize({width,height:width===1440?900:812});
      await page.goto(base+'/guia-gratis',{waitUntil:'networkidle'});
      await page.waitForFunction(()=>[...document.querySelectorAll('main > [style]')].every(e=>Number(getComputedStyle(e).opacity)>.99));
      assert.equal(await page.locator('form').count(),0);
      const cta=page.getByRole('link',{name:'Descargar la hoja gratis'});
      assert.equal(await cta.getAttribute('href'),'/recursos/mi-primera-rutina.pdf');
      const b=await cta.boundingBox();assert.ok(b.height>=44);
      await page.screenshot({path:destino(`guia-${width}.png`),fullPage:true});
      resultados.push(await page.evaluate(()=>({width:innerWidth,contenido:document.documentElement.scrollWidth})));
    }
    const pdf=await fetch(base+'/recursos/mi-primera-rutina.pdf');assert.equal(pdf.status,200);
    assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0,4).toString(),'%PDF');
    for(const [ruta,status] of [['/api/correos/recurso',503],['/api/correos/procesar',401],['/api/correos/solicitud',401],['/api/webhooks/resend',503]]){
      const r=await fetch(base+ruta,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(r.status,status);resultados.push({ruta,status});
    }
  }else{
    await page.goto(base+'/guia-gratis',{waitUntil:'networkidle'});
    await page.getByText('¿Prefieres recibirla por correo?',{exact:true}).click();
    let llamadas=0;let liberar;
    await page.route('**/api/correos/recurso',async route=>{llamadas++;await new Promise(r=>{liberar=r;});await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
    await page.locator('#correo-recurso').fill('ana');
    await page.getByRole('button',{name:'Recibir mi hoja y los consejos'}).click();
    assert.equal(llamadas,0);
    await page.locator('#correo-recurso').fill('ana.prueba@example.com');
    await page.getByRole('button',{name:'Recibir mi hoja y los consejos'}).click();
    await page.getByRole('alert').filter({hasText:'Marca la casilla'}).waitFor();
    await page.screenshot({path:destino('guia-correo-error-375.png'),fullPage:true});
    await page.getByRole('checkbox').check();
    await page.evaluate(()=>{const form=document.querySelector('form');form.requestSubmit();form.requestSubmit();});
    await page.getByRole('button',{name:'Pidiendo tu correo…'}).waitFor();
    await page.waitForFunction(()=>document.querySelector('button[type=submit]').disabled);
    await page.screenshot({path:destino('guia-correo-cargando-375.png'),fullPage:true});
    assert.equal(llamadas,1);
    liberar();await page.getByRole('heading',{name:'Revisa tu correo'}).waitFor();
    await page.screenshot({path:destino('guia-correo-listo-375.png'),fullPage:true});
    await page.getByRole('button',{name:'Usar otro correo'}).click();
    await page.unroute('**/api/correos/recurso');
    await page.locator('#correo-recurso').fill('ana.prueba@example.com');await page.getByRole('checkbox').check();
    await page.context().setOffline(true);
    await page.getByRole('button',{name:'Recibir mi hoja y los consejos'}).click();
    await page.getByRole('alert').filter({hasText:'No hay conexión'}).waitFor();
    await page.screenshot({path:destino('guia-correo-offline-375.png'),fullPage:true});
    await page.context().setOffline(false);
    await page.route('**/api/correos/recurso',route=>route.fulfill({status:429,body:''}));
    await page.getByRole('button',{name:'Recibir mi hoja y los consejos'}).click();
    await page.getByRole('alert').filter({hasText:'Espera una hora'}).waitFor();
    await page.screenshot({path:destino('guia-correo-limite-375.png'),fullPage:true});
    resultados.push({pruebas:['correo inválido','permiso requerido','doble envío bloqueado','cargando','confirmación','sin conexión','límite'],llamadasReales:0});
  }
  assert.ok(resultados.every(r=>!r.width||r.contenido<=r.width));assert.deepEqual(errores,[]);
  await writeFile(destino(correo?'guia-correo-pruebas.json':'guia-mediciones.json'),JSON.stringify({resultados,errores},null,2));
  console.log(JSON.stringify(resultados));
}finally{await browser.close();}
