/* =========================================================
   nino.js — EL ESPACIO DE MATEO (la parte del niño)
   ---------------------------------------------------------
   Una pantalla de inicio solo para él: botones muy grandes
   con foto, sin menús ni textos de adultos. Desde aquí abre
   sus herramientas, y con la casita vuelve aquí.
   Para salir al modo adulto: mantener pulsado el candado y
   escribir el PIN.
   Qué herramientas aparecen lo decide el adulto en "Preparar".
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  // Cada botón del espacio: qué dice, su imagen y qué abre
  var BOTONES = [
    { id: 'agenda', texto: 'Mi día', picto: '📅', color: 'salvia', abrir: function () { PP.abrirMiDia(); } },
    { id: 'tablero', texto: 'Hablar', picto: '💬', color: 'niebla', abrir: function () { PP.abrirTablero(); } },
    { id: 'temporizador', texto: 'Esperar', picto: '⏳', color: 'arena', abrir: function () { PP.abrirTemporizador(); } },
    { id: 'calma', texto: 'Calma', picto: '🫧', color: 'lavanda', abrir: function () { PP.abrirCalma(); } },
    { id: 'historias', texto: 'Historias', picto: '📖', color: 'melocoton', abrir: function () { PP.abrirHistorias(); } },
    { id: 'logros', texto: 'Mis estrellas', picto: '⭐', color: 'sol', abrir: function () { PP.abrirEstrellas(); } }
  ];

  PP.abrirEspacio = function () {
    // Sin acceso, el espacio del niño solo ofrece el kit de calma (bloqueo.js)
    if (PP.acceso.cerrada('espacio')) return PP.abrirCalma();
    var p = PP.estado.perfil;
    var visibles = BOTONES.filter(function (b) { return p.espacio[b.id] !== false; });
    var abriendo = false;
    PP.entrarModoNino(function (cont) {
      cont.innerHTML =
        '<div class="nino-marco espacio">' +
        '<h1 class="hola">¡Hola, ' + PP.esc(p.nombre) + '!</h1>' +
        '<div class="rejilla-espacio">' + visibles.map(function (b) {
          // "Mi día" enseña la foto de la rutina que toca ahora
          var img = b.id === 'agenda' && PP.rutinaDeAhora() ? PP.picto(PP.rutinaDeAhora(), 'picto-espacio') : PP.picto(b, 'picto-espacio');
          return '<button class="boton-espacio cat-' + b.color + '" data-abrir="' + b.id + '">' + img + '<span>' + b.texto + '</span></button>';
        }).join('') + '</div>' +
        (visibles.length ? '' : '<p class="intro">Todavía no hay herramientas. Pide a un adulto que las prepare.</p>') +
        '</div>';
      cont.onclick = function (e) {
        var t = e.target.closest('[data-abrir]'); if (!t) return;
        if (abriendo) return; // un segundo toque no abre otra herramienta
        abriendo = true;
        var b = BOTONES.find(function (x) { return x.id === t.dataset.abrir; });
        // Refuerzo: el botón se marca y dice su nombre; abre al terminar de hablar (máximo 1,2 s)
        t.classList.add('sonando');
        var abierto = false, abrir = function () { if (abierto) return; abierto = true; b.abrir(); };
        var hablo = PP.decir && PP.decir(b.texto, { alTerminar: abrir });
        setTimeout(abrir, hablo ? 1200 : 250);
      };
    }, { esInicio: true });
  };

  // "Mi día": las rutinas de hoy, con la que toca ahora marcada
  PP.abrirMiDia = function () {
    var ahora = PP.rutinaDeAhora();
    var rs = PP.estado.rutinas.slice().sort(function (a, b) { return a.hora.localeCompare(b.hora); });
    PP.entrarModoNino(function (cont) {
      cont.innerHTML =
        '<div class="nino-marco">' +
        '<h1 class="titulo-nino">Mi día</h1>' +
        '<div class="lista-nino">' + rs.map(function (r) {
          var pr = PP.progresoDe(r), hecha = r.pasos.length && pr.hechos.length === r.pasos.length;
          return '<button class="tarjeta-nino' + (ahora && r.id === ahora.id ? ' ahora' : '') + (hecha ? ' hecha' : '') + '" data-rutina="' + r.id + '">' +
            PP.picto(r, 'picto-m') + '<span class="crece"><strong>' + PP.esc(r.nombre) + '</strong>' +
            '<span class="suave">' + (hecha ? '¡Hecha! ⭐' : (ahora && r.id === ahora.id ? 'Ahora' : PP.esc(r.hora))) + '</span></span></button>';
        }).join('') + '</div></div>';
      cont.onclick = function (e) {
        var t = e.target.closest('[data-rutina]'); if (t) PP.empezarRutina(t.dataset.rutina);
      };
    });
  };
})(window.PP);
