/* =========================================================
   temporizador.js — MÓDULO 3: Temporizador visual
   ---------------------------------------------------------
   Para anticipar cambios ("cinco minutos más y nos vamos").
   El tiempo se ve como un círculo de color que se va
   haciendo pequeño: no hace falta saber leer la hora.
   Al terminar avisa con suavidad y enseña qué viene después.
   1) Pantalla del adulto: minutos, "qué viene después" y
      qué botones de minutos ve el niño.
   2) Vista del niño: elegir minutos y ver el círculo.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var OPCIONES = [1, 2, 3, 5, 10, 15, 20, 30];

  function conf() { return PP.estado.temporizador; }
  function textoMin(m) { return m === 1 ? '1 minuto' : m + ' minutos'; }

  // Dibujo del círculo: la parte de color es el tiempo que queda
  function cuna(f) {
    if (f >= 0.999) return '<circle cx="50" cy="50" r="46" class="t-queda"/>';
    if (f <= 0.001) return '';
    var a = f * 2 * Math.PI, x = 50 + 46 * Math.sin(a), y = 50 - 46 * Math.cos(a);
    return '<path class="t-queda" d="M50 50 L50 4 A46 46 0 ' + (f > 0.5 ? 1 : 0) + ' 1 ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' Z"/>';
  }

  // =====================================================
  // 1) PANTALLA DEL ADULTO
  // =====================================================
  PP.pantallas.temporizador = {
    titulo: 'Temporizador visual', seccion: 'preparar',
    pintar: function (main, params) {
      var c = conf(), nombre = PP.esc(PP.estado.perfil.nombre);
      if (!params.min) params.min = c.minutos[0] || 5;
      main.innerHTML =
        '<p class="intro">El círculo de color se va haciendo pequeño. Cuando desaparece, se acabó el tiempo. Ayuda a ' + nombre + ' a saber cuánto falta y a prepararse para el cambio.</p>' +
        '<section class="tarjeta bloque">' +
        '<h2 class="seccion-t">Darle ahora un temporizador de…</h2>' +
        '<div class="chips" role="group" aria-label="Minutos">' + OPCIONES.map(function (m) {
          return '<button type="button" class="chip-op' + (m === params.min ? ' activo' : '') + '" aria-pressed="' + (m === params.min) + '" data-min="' + m + '">' + m + ' min</button>';
        }).join('') + '</div>' +
        '<h2 class="seccion-t">Qué viene después <span class="suave">(opcional)</span></h2>' +
        (c.despues
          ? '<div class="fila">' + PP.picto(c.despues, 'picto-s') + '<strong class="crece">' + PP.esc(c.despues.texto) + '</strong>' +
            '<button class="btn" data-elegir>Cambiar</button><button class="btn" data-quitar>Quitar</button></div>'
          : '<button class="btn ancho" data-elegir>+ Elegir qué viene después</button>') +
        '<button class="btn principal grande ancho" data-dar>Dar a ' + nombre + ' (' + textoMin(params.min) + ')</button>' +
        '</section>' +
        '<h2 class="seccion-t">Botones que ' + nombre + ' puede elegir solo</h2>' +
        '<p class="suave">Aparecen en "Esperar", dentro de su espacio. Mejor pocos y siempre los mismos.</p>' +
        '<div class="chips" role="group" aria-label="Minutos que puede elegir">' + OPCIONES.map(function (m) {
          var si = c.minutos.indexOf(m) >= 0;
          return '<button type="button" class="chip-op' + (si ? ' activo' : '') + '" aria-pressed="' + si + '" data-preset="' + m + '">' + m + ' min</button>';
        }).join('') + '</div>' +
        '<div id="hoja" class="hoja" hidden></div>';

      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.min) { params.min = +b.dataset.min; PP.repintar(); }
        if (b.dataset.preset) {
          var m = +b.dataset.preset, i = c.minutos.indexOf(m);
          if (i >= 0 && c.minutos.length > 1) c.minutos.splice(i, 1); else if (i < 0) c.minutos.push(m);
          c.minutos.sort(function (a, b) { return a - b; });
          PP.persistirConAviso(); PP.repintar();
        }
        if (b.hasAttribute('data-quitar')) { c.despues = null; PP.persistirConAviso(); PP.repintar(); }
        if (b.hasAttribute('data-elegir')) {
          PP.elegirPicto($('#hoja'), function (picto, texto, foto) {
            c.despues = { picto: picto || '⭐', texto: texto || (c.despues && c.despues.texto) || 'Lo siguiente', foto: foto || null };
            PP.persistirConAviso(); PP.repintar();
          });
        }
        if (b.hasAttribute('data-dar')) PP.abrirTemporizador(params.min);
      };
    }
  };

  // =====================================================
  // 2) VISTA DEL NIÑO
  // =====================================================
  // Sin minutos: enseña los botones para elegir. Con minutos: empieza.
  PP.abrirTemporizador = function (minutos) {
    if (!minutos) {
      PP.entrarModoNino(function (cont) {
        cont.innerHTML = '<div class="nino-marco"><h1 class="titulo-nino">Esperar</h1>' +
          '<div class="rejilla-espacio">' + conf().minutos.map(function (m) {
            var f = Math.min(1, m / 15);
            return '<button class="boton-espacio cat-arena" data-min="' + m + '"><svg class="mini-reloj" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" class="t-fondo"/>' + cuna(f) + '</svg><span>' + textoMin(m) + '</span></button>';
          }).join('') + '</div></div>';
        cont.onclick = function (e) { var t = e.target.closest('[data-min]'); if (t) PP.abrirTemporizador(+t.dataset.min); };
      });
      return;
    }

    var total = minutos * 60000, fin = Date.now() + total, intervalo = null, avisoPoco = false;
    var despues = conf().despues;

    PP.entrarModoNino(function (cont) {
      cont.innerHTML =
        '<div class="nino-marco temporizador">' +
        '<p class="etiqueta-nino" id="t-estado">Esperamos ' + textoMin(minutos) + '</p>' +
        '<svg class="reloj" viewBox="0 0 100 100" role="img" aria-labelledby="t-estado"><circle cx="50" cy="50" r="46" class="t-fondo"/><g id="t-cuna">' + cuna(1) + '</g><circle cx="50" cy="50" r="3" class="t-centro"/></svg>' +
        '<p class="t-numero num" id="t-num" aria-live="off"></p>' +
        (despues ? '<div class="despues"><span class="etiqueta-nino">Después</span>' + PP.picto(despues, 'picto-s') + '<span>' + PP.esc(despues.texto) + '</span></div>' : '') +
        '</div>';
      PP.decir('Esperamos ' + textoMin(minutos));

      function tic() {
        var queda = Math.max(0, fin - Date.now()), f = queda / total;
        var g = $('#t-cuna', cont); if (!g) return;
        g.innerHTML = cuna(f);
        var s = Math.ceil(queda / 1000);
        $('#t-num', cont).textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
        if (!avisoPoco && f <= 0.2 && total >= 120000) { avisoPoco = true; $('#t-estado', cont).textContent = 'Queda poco'; PP.decir('Queda poco'); }
        if (queda <= 0) terminar();
      }
      function terminar() {
        clearInterval(intervalo); intervalo = null;
        cont.innerHTML =
          '<div class="nino-marco temporizador"><section class="final" aria-live="polite">' +
          '<svg class="reloj hecho" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" class="t-fondo"/><path d="M30 52l13 13 27-29" class="t-check"/></svg>' +
          '<h1>¡Se acabó el tiempo!</h1>' +
          (despues ? '<p class="etiqueta-nino">Ahora toca</p><div class="carta-paso">' + PP.picto(despues, 'picto-xl') + '<span class="carta-texto">' + PP.esc(despues.texto) + '</span></div>' : '') +
          '</section></div>';
        PP.sonidoSuave();
        PP.decirItem(despues || { texto: '' }, null, despues ? 'Se acabó el tiempo. Ahora toca: ' : 'Se acabó el tiempo.');
      }
      tic();
      intervalo = setInterval(tic, 250);
      PP.alCambiarPantallaNino(function () { clearInterval(intervalo); });
    });
  };
})(window.PP);
