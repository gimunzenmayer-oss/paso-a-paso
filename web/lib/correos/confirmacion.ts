import { escapar } from '@/lib/correos/plantillas';
// GET no modifica preferencias: los escáneres de enlaces no pueden suscribir ni dar de baja.
function marco(titulo:string,detalle:string,accion:string,status=200) {
  const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapar(titulo)} · Paso a Paso</title><style>a{color:#4A765F;text-underline-offset:3px}a:focus-visible,button:focus-visible{outline:3px solid #4F6D86;outline-offset:4px}button:active{transform:scale(.97)}button:disabled{opacity:.65;cursor:wait}@media(prefers-reduced-motion:no-preference){button{transition:transform 120ms ease-out}}</style></head><body style="background:#F2F4EF;color:#22302A;font-family:Arial,sans-serif;margin:0;min-height:100dvh;display:grid;place-items:center"><main style="box-sizing:border-box;max-width:560px;width:100%;padding:32px 20px"><section style="background:#FBFCF9;border:1px solid #E6ECE5;border-radius:18px;padding:24px;box-shadow:0 4px 16px rgba(34,48,42,.06)"><p style="font-size:13px">Paso a Paso · HadaApps</p><div aria-hidden="true" style="display:flex;gap:4px;margin:16px 0 24px"><span style="width:24px;height:8px;background:#4A765F;border-radius:4px"></span><span style="width:24px;height:8px;background:#4F6D86;border-radius:4px"></span><span style="width:24px;height:8px;background:#E6ECE5;border-radius:4px"></span></div><h1 style="font-size:24px;line-height:1.3">${escapar(titulo)}</h1><p style="font-size:18px;line-height:1.6">${escapar(detalle)}</p>${accion}<p id="estado" role="status" aria-live="polite" style="font-size:13px"></p><p style="font-size:13px;line-height:1.6">¿Necesitas ayuda? <a href="mailto:hadaapps@gmail.com">Escríbenos por correo</a>.</p><p style="font-size:13px"><a href="/">Volver a Paso a Paso</a></p></section></main></body></html>`;
  return new Response(html,{status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex'}});
}
export function formularioCorreo(titulo:string,detalle:string,boton:string) {
  return marco(titulo,detalle,`<form method="post" onsubmit="this.querySelector('button').disabled=true;document.getElementById('estado').textContent='Guardando tu elección…'"><button style="background:#4A765F;color:white;border:0;border-radius:14px;padding:16px 20px;font-size:18px;cursor:pointer;min-height:48px">${escapar(boton)}</button></form>`);
}
export function resultadoCorreo(ok:boolean,texto:string) {
  return marco(ok?'Tu elección quedó guardada':'No pudimos completar este paso',texto,'',ok?200:400);
}
export function falloTemporalCorreo() {
  const response=formularioCorreo('No pudimos guardar tu elección','Intenta otra vez. Si el problema continúa, escríbenos: te ayudamos sin pedirte contraseñas.','Intentar de nuevo');
  return new Response(response.body,{status:503,headers:response.headers});
}
