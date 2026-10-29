/* =========================================================
   historias.js — MÓDULO 5: Historias sociales
   ---------------------------------------------------------
   Cuentos cortos que explican una situación nueva (ir al
   médico, cortarse el pelo...) para que Mateo sepa qué va a
   pasar y qué puede hacer si algo le molesta.
   1) Lista de historias (adulto): leer con Mateo, editar, crear.
   2) Editor de historia (adulto): título, portada y páginas.
   3) Vista del niño: una página cada vez, con imagen grande
      y voz que la lee.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  function lista() { return PP.estado.historias; }
  function buscar(id) { return lista().find(function (h) { return h.id === id; }); }

  // =====================================================
  // 1) LISTA (adulto)
  // =====================================================
  PP.pantallas.historias = {
    titulo: 'Historias sociales', seccion: 'preparar',
    pintar: function (main) {
      var nombre = PP.esc(PP.estado.perfil.nombre);
      main.innerHTML =
        '<p class="intro">Léelas juntos unos días antes de la situación, y otra vez justo antes. Pueden ayudar a ' + nombre + ' a anticipar lo que viene.</p>' +
        '<div class="lista-rutinas">' + lista().map(function (h) {
          return '<article class="tarjeta rutina"><div class="fila">' + PP.picto(h, 'picto-m') +
            '<div class="crece"><h2>' + PP.esc(h.titulo) + '</h2><p class="suave">' + h.paginas.length + ' páginas</p></div></div>' +
            '<div class="acciones"><button class="btn" data-editar="' + h.id + '">Editar</button>' +
            '<button class="btn principal" data-leer="' + h.id + '">Leer con ' + nombre + '</button></div></article>';
        }).join('') + '</div>' +
        '<button class="btn grande ancho" data-nueva>+ Crear una historia nueva</button>' +
        '<details class="creditos"><summary>Consejos para escribir una historia</summary><ul>' +
        '<li>Escríbela como si hablara ' + nombre + ': «Voy al médico».</li>' +
        '<li>Frases cortas. Una idea por página.</li>' +
        '<li>Cuenta qué va a pasar, qué puede sentir y qué puede hacer si algo le molesta.</li>' +
        '<li>Usa palabras como «a veces» o «puede que», para no prometer lo que quizá cambie.</li>' +
        '<li>Termina con algo positivo y tranquilo.</li>' +
        '<li>Si puedes, usa fotos reales del lugar y de las personas.</li></ul></details>';
      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.leer) PP.leerHistoria(b.dataset.leer);
        if (b.dataset.editar) PP.ir('editarHistoria', { id: b.dataset.editar });
        if (b.hasAttribute('data-nueva')) PP.ir('editarHistoria', { nueva: true });
      };
    }
  };

  // =====================================================
  // 2) EDITOR (adulto). Se trabaja sobre una copia.
  // =====================================================
  PP.pantallas.editarHistoria = {
    titulo: function (params) { return params.nueva ? 'Nueva historia' : 'Editar historia'; },
    seccion: 'preparar',
    pintar: function (main, params) {
      if (!params.borrador) {
        params.borrador = params.nueva
          ? { id: PP.nuevoId(), titulo: '', picto: '📖', paginas: [{ id: PP.nuevoId(), picto: '⭐', texto: '' }] }
          : JSON.parse(JSON.stringify(buscar(params.id)));
      }
      var h = params.borrador;
      main.innerHTML =
        '<form class="formulario" id="form-h">' +
        '<div class="fila"><button type="button" class="picto-boton" data-elegir="portada" aria-label="Cambiar la portada">' + PP.picto(h, 'picto-m') + '</button>' +
        '<label class="campo crece" for="h-titulo">Título<input id="h-titulo" value="' + PP.esc(h.titulo) + '" placeholder="Por ejemplo: Voy al dentista" required></label></div>' +
        '<h2 class="seccion-t">Páginas <span class="suave">(' + h.paginas.length + ')</span></h2>' +
        '<ol class="pasos-editor paginas">' + h.paginas.map(function (p, i) {
          return '<li><span class="orden num">' + (i + 1) + '</span>' +
            '<button type="button" class="picto-boton" data-elegir="' + i + '" aria-label="Cambiar la imagen de la página ' + (i + 1) + '">' + PP.picto(p, 'picto-s') + '</button>' +
            '<textarea rows="3" data-texto="' + i + '" aria-label="Texto de la página ' + (i + 1) + '" placeholder="Qué pasa en esta página">' + PP.esc(p.texto) + '</textarea>' +
            '<span class="mini-acciones">' +
            '<button type="button" class="icono" data-subir="' + i + '" aria-label="Subir"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button type="button" class="icono" data-bajar="' + i + '" aria-label="Bajar"' + (i === h.paginas.length - 1 ? ' disabled' : '') + '>↓</button>' +
            '<button type="button" class="icono" data-quitar="' + i + '" aria-label="Quitar página">✕</button></span></li>';
        }).join('') + '</ol>' +
        '<button type="button" class="btn ancho" data-anadir>+ Agregar una página</button>' +
        (params.nueva ? '' : '<div class="zona-extra" id="zona-borrar"><button type="button" class="btn peligro" data-borrar>Borrar esta historia</button></div>') +
        '<div class="pie-form"><button type="button" class="btn" data-cancelar>Cancelar</button><button type="submit" class="btn principal">Guardar</button></div>' +
        '</form><div id="hoja" class="hoja" hidden></div>';

      function leerCampos() {
        h.titulo = $('#h-titulo').value;
        main.querySelectorAll('[data-texto]').forEach(function (t) { h.paginas[+t.dataset.texto].texto = t.value; });
      }
      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.type === 'submit') return;
        leerCampos();
        var mover = function (i, d) { var j = i + d, x = h.paginas[i]; h.paginas[i] = h.paginas[j]; h.paginas[j] = x; PP.repintar(); };
        if (b.dataset.subir) mover(+b.dataset.subir, -1);
        if (b.dataset.bajar) mover(+b.dataset.bajar, 1);
        if (b.dataset.quitar) { h.paginas.splice(+b.dataset.quitar, 1); PP.repintar(); }
        if (b.hasAttribute('data-anadir')) { h.paginas.push({ id: PP.nuevoId(), picto: '⭐', texto: '' }); PP.repintar(); }
        if (b.hasAttribute('data-cancelar')) PP.atras();
        if (b.dataset.elegir) {
          var obj = b.dataset.elegir === 'portada' ? h : h.paginas[+b.dataset.elegir];
          PP.elegirPicto($('#hoja'), function (picto, texto, foto) { if (picto) obj.picto = picto; obj.foto = foto || null; PP.repintar(); });
        }
        if (b.hasAttribute('data-borrar')) {
          $('#zona-borrar').innerHTML = '<p><strong>¿Borrar «' + PP.esc(h.titulo) + '»?</strong></p><div class="fila"><button type="button" class="btn peligro" data-borrar-si>Sí, borrar</button><button type="button" class="btn" data-borrar-no>No</button></div>';
        }
        if (b.hasAttribute('data-borrar-no')) PP.repintar();
        if (b.hasAttribute('data-borrar-si')) {
          PP.estado.historias = lista().filter(function (x) { return x.id !== h.id; });
          PP.persistirConAviso(function () { PP.avisar('Historia borrada'); PP.ir('historias', null, { raiz: true }); });
        }
      };
      $('#form-h').onsubmit = function (e) {
        e.preventDefault(); leerCampos();
        h.titulo = h.titulo.trim();
        h.paginas = h.paginas.filter(function (p) { return p.texto.trim(); });
        if (!h.titulo) { PP.avisar('Ponle un título a la historia.'); $('#h-titulo').focus(); return; }
        if (!h.paginas.length) { PP.avisar('Escribe al menos una página.'); h.paginas.push({ id: PP.nuevoId(), picto: '⭐', texto: '' }); PP.repintar(); return; }
        var i = lista().findIndex(function (x) { return x.id === h.id; });
        if (i >= 0) lista()[i] = h; else lista().push(h);
        PP.persistirConAviso(function () { PP.avisar('Guardada'); PP.ir('historias', null, { raiz: true }); });
      };
    }
  };

  // =====================================================
  // 3) VISTA DEL NIÑO
  // =====================================================
  PP.abrirHistorias = function () {
    PP.entrarModoNino(function (cont) {
      cont.innerHTML = '<div class="nino-marco"><h1 class="titulo-nino">Historias</h1>' +
        '<div class="rejilla-espacio">' + lista().map(function (h) {
          return '<button class="boton-espacio cat-melocoton" data-leer="' + h.id + '">' + PP.picto(h, 'picto-espacio') + '<span>' + PP.esc(h.titulo) + '</span></button>';
        }).join('') + '</div></div>';
      cont.onclick = function (e) { var t = e.target.closest('[data-leer]'); if (t) PP.leerHistoria(t.dataset.leer); };
    });
  };

  PP.leerHistoria = function (id) {
    var h = buscar(id); if (!h) return;
    if (PP.evento) PP.evento('historia_leida');
    var i = 0;
    PP.entrarModoNino(function (cont) {
      function dibujar() {
        var fin = i >= h.paginas.length;
        var p = h.paginas[i];
        cont.innerHTML = '<div class="nino-marco historia">' +
          '<p class="etiqueta-nino">' + PP.esc(h.titulo) + '</p>' +
          '<div class="puntos-resp" aria-label="Página ' + Math.min(i + 1, h.paginas.length) + ' de ' + h.paginas.length + '">' + h.paginas.map(function (x, k) { return '<span class="' + (k <= i ? 'lleno' : '') + '"></span>'; }).join('') + '</div>' +
          (fin
            ? '<section class="final"><svg class="estrella" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8l12.4 25.2 27.8 4-20.1 19.6 4.7 27.7L50 71.4 25.2 84.5l4.7-27.7L9.8 37.2l27.8-4z"/></svg><h1>Fin</h1></section>' +
              '<button class="btn-hecho" data-otra>Leer otra vez</button>'
            : '<button class="carta-paso pagina" data-leer-pag aria-label="' + PP.esc(p.texto) + '. Toca para escuchar">' + PP.picto(p, 'picto-xl') +
              '<span class="texto-pagina">' + PP.esc(p.texto) + '</span></button>' +
              '<div class="flechas"><button class="flecha" data-ant aria-label="Página anterior"' + (i === 0 ? ' disabled' : '') + '>◀</button>' +
              '<button class="flecha principal" data-sig aria-label="Página siguiente">▶</button></div>') +
          '</div>';
        if (!fin) PP.decirItem(p); else PP.decir('Fin');
      }
      dibujar();
      cont.onclick = function (e) {
        var t = e.target.closest('button'); if (!t) return;
        if (t.hasAttribute('data-sig')) { i++; dibujar(); }
        if (t.hasAttribute('data-ant') && i > 0) { i--; dibujar(); }
        if (t.hasAttribute('data-otra')) { i = 0; dibujar(); }
        if (t.hasAttribute('data-leer-pag')) PP.decirItem(h.paginas[i], { siempre: true });
      };
    });
  };
})(window.PP);
