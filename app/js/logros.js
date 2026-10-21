/* =========================================================
   logros.js — MÓDULO 7: Logros y estrellas
   ---------------------------------------------------------
   - Estrellas: Mateo gana una al terminar una rutina entera.
   - Logros: cosas que la familia quiere recordar y celebrar
     ("probó una comida nueva", "pidió ayuda con el tablero").
   Celebración tranquila: sin ruidos fuertes ni confeti.
   1) Pantalla del adulto: estrellas por semana y logros.
   2) Vista del niño: "Mis estrellas".
   También guarda cuántas veces se usa cada botón del tablero
   (solo números, para el informe).
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var RAPIDOS = ['🌟', '🍽️', '💬', '🧩', '🤝', '🚽', '😴', '🏫', '🎨', '🧘'];

  // Llamado por la agenda al terminar una rutina
  PP.anotarEstrella = function (rutina) {
    var hoy = PP.hoy(), e = PP.estado.estrellas;
    if (e.some(function (x) { return x.fecha === hoy && x.rutina === rutina.id; })) return; // una por rutina y día
    e.push({ fecha: hoy, rutina: rutina.id, nombre: rutina.nombre });
    PP.persistir();
  };

  // Llamado por el tablero al tocar un botón
  PP.anotarUso = function (texto) {
    var u = PP.estado.uso.tablero, hoy = PP.hoy();
    u[hoy] = u[hoy] || {};
    u[hoy][texto] = (u[hoy][texto] || 0) + 1;
    PP.persistir();
  };

  function estrellaSvg(clase) {
    return '<svg class="' + (clase || 'estrella-mini') + '" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8l12.4 25.2 27.8 4-20.1 19.6 4.7 27.7L50 71.4 25.2 84.5l4.7-27.7L9.8 37.2l27.8-4z"/></svg>';
  }

  function fechaCorta(f) { return new Date(f + 'T12:00').toLocaleDateString('es', { day: 'numeric', month: 'long' }); }

  // =====================================================
  // 1) PANTALLA DEL ADULTO
  // =====================================================
  PP.pantallas.logros = {
    titulo: 'Logros y avances', seccion: 'mas',
    pintar: function (main, params) {
      var nombre = PP.esc(PP.estado.perfil.nombre);
      var esta = PP.estrellasDesde(7), pasada = PP.estrellasDesde(14).length - esta.length;
      var porRutina = {};
      esta.forEach(function (x) { porRutina[x.nombre] = (porRutina[x.nombre] || 0) + 1; });
      var logros = PP.estado.logros.slice().sort(function (a, b) { return b.fecha.localeCompare(a.fecha); });
      if (!params.picto) params.picto = '🌟';
      main.innerHTML =
        '<section class="tarjeta bloque"><h2 class="seccion-t">Estrellas de rutinas</h2>' +
        '<div class="cifras"><div><strong class="num">' + esta.length + '</strong><span>esta semana</span></div><div><strong class="num">' + pasada + '</strong><span>la semana anterior</span></div></div>' +
        PP.barrasRanking(Object.keys(porRutina).map(function (k) { return [k, porRutina[k]]; }).sort(function (a, b) { return b[1] - a[1]; })) +
        '<p class="suave">' + nombre + ' gana una estrella cada vez que termina una rutina entera.</p></section>' +
        '<section class="tarjeta bloque"><h2 class="seccion-t">Anotar un logro</h2>' +
        '<form id="form-l" class="formulario">' +
        '<div class="chips" role="group" aria-label="Dibujo">' + RAPIDOS.map(function (p) {
          return '<button type="button" class="chip-op emoji' + (p === params.picto ? ' activo' : '') + '" aria-pressed="' + (p === params.picto) + '" data-picto="' + p + '">' + p + '</button>';
        }).join('') + '</div>' +
        '<label class="campo" for="l-texto">¿Qué logró?<input id="l-texto" placeholder="Por ejemplo: se lavó las manos él solo" required></label>' +
        '<button type="submit" class="btn principal">Guardar logro</button></form></section>' +
        '<h2 class="seccion-t">Logros (' + logros.length + ')</h2>' +
        '<div class="lista">' + logros.map(function (l) {
          return '<div class="fila-lista"><span class="picto-s" aria-hidden="true">' + PP.esc(l.picto) + '</span><span class="crece"><strong>' + PP.esc(l.texto) + '</strong><span class="suave">' + fechaCorta(l.fecha) + '</span></span>' +
            '<button class="icono" data-quitar="' + l.id + '" aria-label="Borrar el logro ' + PP.esc(l.texto) + '">✕</button></div>';
        }).join('') + '</div>' +
        '<button class="btn grande ancho" data-ver>Ver «Mis estrellas» como ' + nombre + '</button>';
      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b || b.type === 'submit') return;
        if (b.dataset.picto) { params.picto = b.dataset.picto; var t = $('#l-texto').value; PP.repintar(); $('#l-texto').value = t; }
        if (b.dataset.quitar) { PP.estado.logros = PP.estado.logros.filter(function (l) { return l.id !== b.dataset.quitar; }); PP.persistir(); PP.repintar(); }
        if (b.hasAttribute('data-ver')) PP.abrirEstrellas();
      };
      $('#form-l').onsubmit = function (e) {
        e.preventDefault();
        var t = $('#l-texto').value.trim(); if (!t) return;
        PP.estado.logros.push({ id: PP.nuevoId(), fecha: PP.hoy(), picto: params.picto, texto: t });
        PP.persistir(); PP.avisar('¡Logro guardado!'); PP.repintar();
      };
    }
  };

  // =====================================================
  // 2) VISTA DEL NIÑO: Mis estrellas
  // =====================================================
  PP.abrirEstrellas = function () {
    var esta = PP.estrellasDesde(7);
    var logros = PP.estado.logros.slice().sort(function (a, b) { return b.fecha.localeCompare(a.fecha); }).slice(0, 6);
    PP.entrarModoNino(function (cont) {
      cont.innerHTML = '<div class="nino-marco"><h1 class="titulo-nino">Mis estrellas</h1>' +
        '<section class="tarjeta-estrellas" aria-label="' + esta.length + ' estrellas esta semana">' +
        '<div class="fila-estrellas">' + (esta.length ? esta.slice(0, 14).map(function () { return estrellaSvg(); }).join('') : estrellaSvg('estrella-mini vacia')) + '</div>' +
        '<p class="cuantas"><strong class="num">' + esta.length + '</strong> ' + (esta.length === 1 ? 'estrella' : 'estrellas') + ' esta semana</p></section>' +
        (logros.length ? '<p class="etiqueta-nino">Lo que logré</p><div class="lista-nino">' + logros.map(function (l) {
          return '<button class="tarjeta-nino" data-logro="' + l.id + '"><span class="picto-m" aria-hidden="true">' + PP.esc(l.picto) + '</span><span class="crece"><strong>' + PP.esc(l.texto) + '</strong></span></button>';
        }).join('') + '</div>' : '') + '</div>';
      PP.decir(esta.length ? 'Tienes ' + esta.length + (esta.length === 1 ? ' estrella' : ' estrellas') + ' esta semana. ¡Muy bien!' : 'Mis estrellas');
      cont.onclick = function (e) {
        var t = e.target.closest('[data-logro]'); if (!t) return;
        var l = PP.estado.logros.find(function (x) { return x.id === t.dataset.logro; });
        PP.decir(l.texto, { siempre: true });
      };
    });
  };
})(window.PP);
