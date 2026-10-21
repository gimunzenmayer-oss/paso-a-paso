/* =========================================================
   medicion.js — cifras de uso SEUDÓNIMAS para el panel de la dueña
   ---------------------------------------------------------
   Solo se envía QUÉ se usó (por ejemplo "se completó un paso"),
   nunca el contenido: ni nombres, ni fotos, ni el diario.
   Cada teléfono tiene un número al azar (no dice quién es).
   Si no hay internet o la app se abre fuera de su web, no pasa nada.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var URL_EVENTOS = '/api/events';
  var URL_ERRORES = '/api/log-error';
  var activo = /^https?:$/.test(location.protocol) && window.top === window;

  function guardado(clave, crear) {
    try {
      var v = localStorage.getItem(clave);
      if (!v && crear) { v = crear(); localStorage.setItem(clave, v); }
      return v;
    } catch (e) { return crear ? crear() : null; }
  }
  function azar() {
    var b = new Uint8Array(16);
    (window.crypto || {}).getRandomValues ? crypto.getRandomValues(b) : b.forEach(function (_, i) { b[i] = Math.random() * 256; });
    return Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }

  // Modo prueba (?qa=1): lo que hagas no cuenta en el panel.
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('qa') === '1') localStorage.setItem('pp_qa', '1');
    if (q.get('qa') === '0') localStorage.removeItem('pp_qa');
  } catch (e) { }

  var dispositivo = guardado('pp_dispositivo', azar);
  var sesion = (function () {
    try {
      var s = sessionStorage.getItem('pp_sesion');
      if (!s) { s = azar(); sessionStorage.setItem('pp_sesion', s); }
      return s;
    } catch (e) { return azar(); }
  })();

  // La familia puede apagar las estadísticas en Ajustes; entonces no se envía nada.
  PP.estadisticasActivas = function () { return guardado('pp_sin_estadisticas') !== '1'; };
  PP.fijarEstadisticas = function (si) {
    try { if (si) localStorage.removeItem('pp_sin_estadisticas'); else localStorage.setItem('pp_sin_estadisticas', '1'); } catch (e) { }
  };

  function enviar(url, datos) {
    if (!activo || !PP.estadisticasActivas()) return;
    var cuerpo = JSON.stringify(datos);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(url, new Blob([cuerpo], { type: 'application/json' }))) return;
    } catch (e) { }
    try { fetch(url, { method: 'POST', body: cuerpo, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(function () { }); } catch (e) { }
  }

  PP.evento = function (tipo, props) {
    enviar(URL_EVENTOS, {
      type: tipo,
      device_id: dispositivo,
      session_id: sesion,
      source: guardado('pp_origen'),
      qa: guardado('pp_qa') === '1',
      props: props || {}
    });
  };

  // Errores: mensaje y pantalla, para arreglarlos. Máximo 5 por visita.
  var errores = 0;
  function reportar(mensaje) {
    if (!mensaje || errores >= 5) return;
    errores++;
    enviar(URL_ERRORES, {
      message: String(mensaje).slice(0, 300),
      screen: PP.actual ? PP.actual.nombre : 'arranque',
      device_id: dispositivo
    });
  }
  window.addEventListener('error', function (e) { reportar(e.message || 'Error sin mensaje'); });
  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason;
    reportar(r && r.message ? r.message : String(r || 'Promesa rechazada'));
  });

  // Primera vez en este teléfono (el servidor la cuenta una sola vez) y un "día de uso".
  PP.evento('app_abierta');
  PP.evento('sesion_iniciada');
})(window.PP);
