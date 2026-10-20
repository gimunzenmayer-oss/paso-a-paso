/* =========================================================
   guia.js — SECCIÓN: Guía para Familias
   ---------------------------------------------------------
   Pantallas (solo para el adulto):
   1) Portada de la guía: acceso rápido "¿Está pasando ahora?",
      buscador y lista de fichas.
   2) Ficha: qué es, señales de alerta, qué hacer en el momento,
      qué NO hacer y qué hacer después.
   El texto está en guia-datos.js; aquí solo se dibuja.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  function ficha(id) { return PP.guia.fichas.find(function (f) { return f.id === id; }); }

  // Quita tildes y mayúsculas para que buscar "rabieta" o "sueno" funcione
  function normal(t) { return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function filaFicha(f) {
    return '<button class="fila-lista" data-ficha="' + f.id + '">' +
      '<span class="picto-m" aria-hidden="true">' + f.picto + '</span>' +
      '<span class="crece"><strong>' + PP.esc(f.titulo) + '</strong><span class="suave">' + PP.esc(f.resumen) + '</span></span></button>';
  }

  // =====================================================
  // 1) PORTADA DE LA GUÍA
  // =====================================================
  PP.pantallas.guia = {
    titulo: 'Guía para familias', seccion: 'guia',
    pintar: function (main) {
      var urgentes = PP.guia.fichas.filter(function (f) { return f.urgentes; });
      main.innerHTML =
        '<p class="intro">Consejos prácticos para el día a día y para los momentos difíciles. Lo estás haciendo lo mejor que puedes.</p>' +
        '<section class="tarjeta ahora-mismo" aria-labelledby="ahora-g">' +
        '<h2 id="ahora-g">¿Está pasando ahora?</h2>' +
        '<div class="rejilla-urgente">' + urgentes.map(function (f) {
          return '<button class="urgente-btn" data-ficha="' + f.id + '" data-ir-a="momento"><span class="picto-s" aria-hidden="true">' + f.picto + '</span><span>' + PP.esc(f.titulo) + '</span></button>';
        }).join('') + '</div>' +
        '<p class="suave">Te lleva directo a "Qué hacer en el momento".</p>' +
        '</section>' +
        '<label class="campo" for="guia-buscar">Buscar en la guía<input id="guia-buscar" type="search" placeholder="Por ejemplo: dormir, ruido, pega" autocomplete="off"></label>' +
        '<section class="bloque" aria-labelledby="dif-t"><h2 id="dif-t" class="seccion-t">Momentos difíciles</h2>' +
        '<div class="lista" id="guia-lista">' + PP.guia.fichas.map(filaFicha).join('') + '</div></section>' +
        '<p class="aviso-legal">Estas fichas son orientaciones generales. Cada niño y cada niña es distinto: compártelas con su terapeuta para adaptarlas. Ante un riesgo para la salud, llama al 112 o al número de emergencias de tu país.</p>';

      // Buscar: filtra la lista mientras se escribe
      $('#guia-buscar', main).oninput = function (e) {
        var q = normal(e.target.value.trim());
        var hay = PP.guia.fichas.filter(function (f) {
          return !q || normal([f.titulo, f.resumen, f.quees].concat(f.senales, f.momento).join(' ')).indexOf(q) >= 0;
        });
        $('#guia-lista', main).innerHTML = hay.length ? hay.map(filaFicha).join('')
          : '<p class="suave">No encontré nada con «' + PP.esc(e.target.value) + '». Prueba con otra palabra.</p>';
      };

      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.ficha) PP.ir('guiaFicha', { id: b.dataset.ficha, irA: b.dataset.irA || null });
      };
    }
  };

  // =====================================================
  // 2) UNA FICHA
  // =====================================================
  var PARTES = [
    ['senales', 'Señales de alerta', 'Señales', 'niebla'],
    ['momento', 'Qué hacer en el momento', 'En el momento', 'salvia'],
    ['evitar', 'Qué NO hacer', 'No hacer', 'melocoton'],
    ['despues', 'Qué hacer después', 'Después', 'arena']
  ];
  var ATAJOS = {
    tablero: ['tablero', 'Abrir el tablero para hablar'],
    agenda: ['agenda', 'Abrir la agenda visual'],
    calma: ['pronto', 'Kit de calma (próximamente)']
  };

  PP.pantallas.guiaFicha = {
    titulo: 'Guía para familias', seccion: 'guia',
    pintar: function (main, params) {
      var f = ficha(params.id);
      main.innerHTML =
        '<header class="ficha-cabeza"><span class="picto-m" aria-hidden="true">' + f.picto + '</span>' +
        '<div class="crece"><h2 class="titular">' + PP.esc(f.titulo) + '</h2><p class="suave">' + PP.esc(f.resumen) + '</p></div></header>' +
        // Saltos rápidos a cada parte (útil con prisa)
        '<nav class="saltos" aria-label="Ir a una parte de la ficha">' + PARTES.map(function (p) {
          return '<button class="chip-salto cat-' + p[3] + '" data-salto="' + p[0] + '">' + p[2] + '</button>';
        }).join('') + '</nav>' +
        (f.urgente ? '<p class="urgente-aviso" role="note"><strong>Pide ayuda urgente.</strong> ' + PP.esc(f.urgente) + '</p>' : '') +
        '<section class="ficha-parte" aria-labelledby="p-quees"><h3 id="p-quees">Qué es</h3><p>' + PP.esc(f.quees) + '</p></section>' +
        PARTES.map(function (p) {
          var lista = f[p[0]], numerada = p[0] === 'momento';
          return '<section class="ficha-parte cat-' + p[3] + ' parte-' + p[0] + '" id="parte-' + p[0] + '" tabindex="-1" aria-labelledby="p-' + p[0] + '">' +
            '<h3 id="p-' + p[0] + '">' + p[1] + '</h3>' +
            (numerada ? '<ol>' : '<ul>') + lista.map(function (t) { return '<li>' + PP.esc(t) + '</li>'; }).join('') + (numerada ? '</ol>' : '</ul>') +
            '</section>';
        }).join('') +
        (f.herramientas && f.herramientas.length ? '<section class="bloque"><h3 class="seccion-t">Herramientas de la app que ayudan</h3>' +
          f.herramientas.map(function (h) { return '<button class="btn ancho" data-atajo="' + h + '">' + ATAJOS[h][1] + '</button>'; }).join('') + '</section>' : '') +
        '<button class="btn ancho" data-volver>Ver todas las fichas</button>';

      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.salto) irA(main, b.dataset.salto);
        if (b.dataset.atajo) { var a = ATAJOS[b.dataset.atajo]; PP.ir(a[0], a[0] === 'pronto' ? { id: 'calma' } : null); }
        if (b.hasAttribute('data-volver')) PP.atras();
      };

      // Si venimos de "¿Está pasando ahora?", saltamos directo a la parte útil
      if (params.irA) setTimeout(function () { irA(main, params.irA); }, 50);
    }
  };

  function irA(main, parte) {
    var s = $('#parte-' + parte, main); if (!s) return;
    var calma = PP.estado.perfil.modoCalma || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    s.scrollIntoView({ behavior: calma ? 'auto' : 'smooth', block: 'start' });
    s.focus({ preventScroll: true });
  }
})(window.PP);
