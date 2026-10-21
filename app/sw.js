/* sw.js — "service worker": guarda una copia de la app en el
   teléfono para que funcione sin internet. La primera vez que
   se abre con conexión, copia estos archivos; después los sirve
   desde el propio teléfono. */
var VERSION = 'paso-a-paso-v12';
var ARCHIVOS = ['./index.html', './styles.css', './manifest.webmanifest', './icono.svg',
  './fonts/atkinson-400-latin.woff2', './fonts/atkinson-400-latin-ext.woff2', './fonts/atkinson-700-latin.woff2', './fonts/atkinson-700-latin-ext.woff2', './fonts/lexend-latin.woff2', './fonts/lexend-latin-ext.woff2',
  './js/medicion.js', './js/datos.js', './js/voz.js', './js/app.js', './js/agenda.js', './js/tablero.js', './js/guia-datos.js', './js/guia.js', './js/cifrado.js', './js/nino.js', './js/temporizador.js', './js/calma.js', './js/historias.js', './js/diario.js', './js/logros.js', './js/informe.js',
  './img/agua.jpg', './img/despertar.jpg', './img/bano.jpg', './img/desayunar.jpg',
  './img/vestirse.jpg', './img/dientes.jpg', './img/zapatos.jpg', './img/mochila.jpg', './img/abrazo.jpg', './img/abuela.jpg', './img/amigo.jpg', './img/ayuda.jpg', './img/banarse.jpg', './img/calor.jpg', './img/cansado.jpg', './img/cascos.jpg', './img/cenar.jpg', './img/contento.jpg', './img/cuento.jpg', './img/descanso.jpg', './img/dormir.jpg', './img/duele.jpg', './img/enfadado.jpg', './img/espacio.jpg', './img/espera.jpg', './img/frio.jpg', './img/galleta.jpg', './img/jugar.jpg', './img/leche.jpg', './img/mama.jpg', './img/manana.jpg', './img/manos.jpg', './img/manzana.jpg', './img/miedo.jpg', './img/musica.jpg', './img/no.jpg', './img/noche.jpg', './img/pan.jpg', './img/papa.jpg', './img/para.jpg', './img/parque.jpg', './img/platano.jpg', './img/ruido.jpg', './img/salir.jpg', './img/seno.jpg', './img/si.jpg', './img/silencio.jpg', './img/tarde.jpg', './img/tranquilo.jpg', './img/triste.jpg', './img/yo.jpg', './img/zumo.jpg'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(ARCHIVOS); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }));
});
// Primero intenta la copia del teléfono; si no está, va a internet y guarda una copia.
// Solo se copian respuestas buenas de esta misma web (nunca errores, ni la API, ni otras webs).
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.indexOf('/api/') === 0) return;
  // Abrir la app (también desde /app o /app/) sin internet: se sirve la copia de index.html.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(function () { return caches.match('./index.html'); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function (r) {
    return r || fetch(e.request).then(function (resp) {
      if (resp.ok && resp.type === 'basic') {
        var copia = resp.clone();
        caches.open(VERSION).then(function (c) { c.put(e.request, copia); });
      }
      return resp;
    });
  }));
});
