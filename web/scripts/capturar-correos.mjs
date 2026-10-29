import {chromium} from 'playwright-core';
import {mkdir,writeFile} from 'node:fs/promises';
const carpeta=new URL('../../docs/revisiones/',import.meta.url);
await mkdir(carpeta,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
  const page=await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});
  const mediciones=[];
  for(const nombre of ['acceso','precobro','carrito_2h','baja','confirmar','resultado','error','reintentar']){
    await page.goto(new URL(`../../docs/correos/vista-previa/${nombre}.html`,import.meta.url).href);
    await page.screenshot({path:new URL(`correos-${nombre}-375.png`,carpeta).pathname.replace(/^\/([A-Za-z]:)/,'$1'),fullPage:true});
    const medida=await page.evaluate(()=>({ancho:innerWidth,contenido:document.documentElement.scrollWidth,botones:[...document.querySelectorAll('a,button')].filter(e=>e.style.background||e.tagName==='BUTTON').map(e=>({alto:e.getBoundingClientRect().height,ancho:e.getBoundingClientRect().width}))}));
    mediciones.push({nombre,...medida});
    if(medida.contenido>375)throw Error(`Desborde: ${nombre}`);
  }
  await writeFile(new URL('correos-mediciones.json',carpeta),JSON.stringify(mediciones,null,2));
  console.log(JSON.stringify(mediciones));
}finally{await browser.close();}
