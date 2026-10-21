/* =========================================================
   tablero.js — MÓDULO 2: Tablero de comunicación (SAAC)
   ---------------------------------------------------------
   Tres pantallas:
   1) Tablero (adulto): dar el tablero a Mateo, elegir el
      tamaño de los botones y ver/editar las categorías.
   2) Editor de categoría (adulto): nombre, color y botones
      (símbolo o foto + la frase que dice).
   3) Tablero del niño (modo niño): palabras fijas siempre a
      la vista (Sí, No, Ayuda, Para), pestañas de categorías y
      botones que dicen su frase en voz alta al tocarlos.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };

  // Colores suaves de las categorías (el nombre se usa en el CSS: .cat-salvia...)
  var COLORES = [
    ['salvia', 'Verde'], ['niebla', 'Azul'], ['arena', 'Arena'], ['melocoton', 'Durazno'], ['lavanda', 'Lavanda']
  ];
  var TAMANOS = [[2, 'Grandes'], [3, 'Medianos'], [4, 'Pequeños']];
  var FIJOS = '__fijos'; // identificador especial para las palabras fijas

  function tablero() { return PP.estado.tablero; }
  function buscarCategoria(id) {
    if (id === FIJOS) return { id: FIJOS, nombre: 'Palabras fijas', color: 'salvia', botones: tablero().fijos };
    return tablero().categorias.find(function (c) { return c.id === id; });
  }

  // =====================================================
  // 1) PANTALLA DEL ADULTO
  // =====================================================
  PP.pantallas.tablero = {
    titulo: 'Tablero para hablar', seccion: 'preparar',
    pintar: function (main) {
      var t = tablero(), nombre = PP.esc(PP.estado.perfil.nombre);
      main.innerHTML =
        '<p class="intro">Cada botón dice su frase en voz alta, para que ' + nombre + ' pueda pedir, contar cómo se siente o decir que necesita un descanso.</p>' +
        '<button class="btn principal grande ancho" data-dar>Dar el tablero a ' + nombre + '</button>' +
        '<h2 class="seccion-t">Tamaño de los botones</h2>' +
        '<fieldset class="segmentado tres"><legend class="sr">Tamaño de los botones</legend>' +
        TAMANOS.map(function (x) {
          return '<label><input type="radio" name="tam" value="' + x[0] + '"' + (t.columnas === x[0] ? ' checked' : '') + '><span>' + x[1] + '</span></label>';
        }).join('') + '</fieldset>' +
        '<h2 class="seccion-t">Categorías</h2>' +
        '<div class="lista">' +
        '<button class="fila-lista" data-cat="' + FIJOS + '"><span class="muestra cat-salvia" aria-hidden="true">' + t.fijos.map(function (b) { return PP.esc(b.picto); }).slice(0, 1).join('') + '</span>' +
        '<span class="crece"><strong>Palabras fijas</strong><span class="suave">Siempre a la vista · ' + t.fijos.map(function (b) { return PP.esc(b.texto); }).join(', ') + '</span></span><span class="chip">Editar</span></button>' +
        t.categorias.map(function (c) {
          return '<button class="fila-lista" data-cat="' + c.id + '"><span class="muestra cat-' + c.color + '" aria-hidden="true">' + (c.botones[0] ? PP.esc(c.botones[0].picto) : '') + '</span>' +
            '<span class="crece"><strong>' + PP.esc(c.nombre) + '</strong><span class="suave">' + c.botones.length + ' botones</span></span><span class="chip">Editar</span></button>';
        }).join('') + '</div>' +
        '<button class="btn grande ancho" data-nueva>+ Crear una categoría</button>';

      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.hasAttribute('data-dar')) PP.abrirTablero();
        if (b.dataset.cat) PP.ir('editarCategoria', { id: b.dataset.cat });
        if (b.hasAttribute('data-nueva')) PP.ir('editarCategoria', { nueva: true });
      };
      main.onchange = function (e) {
        if (e.target.name === 'tam') { t.columnas = +e.target.value; PP.persistir(); PP.avisar('Tamaño guardado'); }
      };
    }
  };

  // =====================================================
  // 2) EDITOR DE CATEGORÍA (igual que el editor de rutinas)
  // =====================================================
  PP.pantallas.editarCategoria = {
    titulo: function (params) { return params.nueva ? 'Nueva categoría' : params.id === FIJOS ? 'Palabras fijas' : 'Editar categoría'; },
    seccion: 'preparar',
    pintar: function (main, params) {
      if (!params.borrador) {
        params.borrador = params.nueva
          ? { id: PP.nuevoId(), nombre: '', color: 'niebla', botones: [] }
          : JSON.parse(JSON.stringify(buscarCategoria(params.id)));
      }
      var c = params.borrador, esFijos = c.id === FIJOS;

      main.innerHTML =
        '<form class="formulario" id="form-cat" novalidate>' +
        (esFijos ? '<p class="intro">Estas palabras salen siempre arriba del tablero, en cualquier categoría. Mejor que sean pocas (de 3 a 5).</p>' :
          '<label class="campo" for="cat-nombre">Nombre de la categoría<input id="cat-nombre" value="' + PP.esc(c.nombre) + '" placeholder="Por ejemplo: En la escuela" autocomplete="off"></label>' +
          '<fieldset class="colores"><legend class="campo-leyenda">Color</legend>' + COLORES.map(function (x) {
            return '<label class="color-op"><input type="radio" name="color" value="' + x[0] + '"' + (c.color === x[0] ? ' checked' : '') + '><span class="cat-' + x[0] + '">' + x[1] + '</span></label>';
          }).join('') + '</fieldset>') +
        '<h2 class="seccion-t">Botones <span class="suave">(' + c.botones.length + ')</span></h2>' +
        '<p class="suave">Lo que escribas es lo que se dirá en voz alta.</p>' +
        '<ol class="pasos-editor">' + c.botones.map(function (b, i) {
          return '<li>' +
            '<button type="button" class="picto-boton" data-elegir="' + i + '" aria-label="Cambiar el símbolo del botón ' + (i + 1) + '">' + PP.picto(b, 'picto-s') + '</button>' +
            '<label class="sr" for="bot-' + i + '">Frase del botón ' + (i + 1) + '</label>' +
            '<input id="bot-' + i + '" class="crece" data-texto="' + i + '" value="' + PP.esc(b.texto) + '" autocomplete="off">' +
            '<span class="mini-acciones">' +
            '<button type="button" class="icono' + (b.audio ? ' grabado' : '') + '" data-grabar="' + i + '" aria-label="' + (b.audio ? 'Volver a grabar' : 'Grabar con tu voz') + ' el botón ' + (i + 1) + '">🎙</button>' +
            '<button type="button" class="icono" data-oir="' + i + '" aria-label="Escuchar botón ' + (i + 1) + '">🔊</button>' +
            '<button type="button" class="icono" data-subir="' + i + '" aria-label="Subir botón ' + (i + 1) + '"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button type="button" class="icono" data-bajar="' + i + '" aria-label="Bajar botón ' + (i + 1) + '"' + (i === c.botones.length - 1 ? ' disabled' : '') + '>↓</button>' +
            '<button type="button" class="icono" data-quitar="' + i + '" aria-label="Quitar botón ' + (i + 1) + '">✕</button>' +
            '</span></li>';
        }).join('') + '</ol>' +
        '<button type="button" class="btn grande ancho" data-elegir="nuevo">+ Añadir un botón</button>' +
        '<div class="pie-form"><button type="button" class="btn" data-cancelar>Cancelar</button>' +
        '<button type="submit" class="btn principal">Guardar</button></div>' +
        (params.nueva || esFijos ? '' : '<div class="zona-extra" id="zona-extra"><button type="button" class="btn peligro" data-eliminar>Eliminar categoría</button></div>') +
        '</form><div class="hoja" id="hoja" hidden></div>';

      main.oninput = function (e) {
        if (e.target.id === 'cat-nombre') c.nombre = e.target.value;
        if (e.target.dataset.texto != null) c.botones[+e.target.dataset.texto].texto = e.target.value;
      };
      main.onchange = function (e) { if (e.target.name === 'color') c.color = e.target.value; };

      main.onclick = function (e) {
        var t = e.target.closest('button'); if (!t) return;
        var d = t.dataset;
        if (d.oir != null) PP.decirItem(c.botones[+d.oir], { siempre: true });
        if (d.grabar != null) {
          var bot = c.botones[+d.grabar];
          if (!PP.grabando()) t.classList.add('grabando');
          PP.grabarVoz(function (audio) { bot.audio = audio; PP.repintar(); PP.avisar('Grabación guardada. Toca Guardar.'); });
        }
        if (d.subir != null) { mover(c.botones, +d.subir, -1); PP.repintar(); }
        if (d.bajar != null) { mover(c.botones, +d.bajar, 1); PP.repintar(); }
        if (d.quitar != null) { c.botones.splice(+d.quitar, 1); PP.repintar(); PP.avisar('Botón quitado'); }
        if (d.elegir != null) {
          PP.elegirPicto($('#hoja', main), function (picto, texto, foto) {
            if (d.elegir === 'nuevo') c.botones.push({ id: PP.nuevoId(), picto: picto || '⭐', texto: texto || '', foto: foto || null });
            else { var b = c.botones[+d.elegir]; if (picto) b.picto = picto; b.foto = foto || null; if (!b.texto && texto) b.texto = texto; }
            PP.repintar();
          });
        }
        if (t.hasAttribute('data-cancelar')) PP.atras();
        if (t.hasAttribute('data-eliminar')) {
          $('#zona-extra').innerHTML = '<p><strong>¿Eliminar «' + PP.esc(c.nombre) + '» y sus botones?</strong> No se puede deshacer.</p>' +
            '<div class="fila"><button type="button" class="btn peligro" data-eliminar-si>Sí, eliminar</button><button type="button" class="btn" data-eliminar-no>No</button></div>';
        }
        if (t.hasAttribute('data-eliminar-si')) {
          tablero().categorias = tablero().categorias.filter(function (x) { return x.id !== c.id; });
          PP.persistir(); PP.avisar('Categoría eliminada'); PP.ir('tablero', null, { raiz: true });
        }
        if (t.hasAttribute('data-eliminar-no')) PP.repintar();
      };

      $('#form-cat').onsubmit = function (e) {
        e.preventDefault();
        if (!esFijos) {
          c.nombre = (c.nombre || '').trim();
          if (!c.nombre) { PP.avisar('Ponle un nombre a la categoría.'); $('#cat-nombre').focus(); return; }
        }
        c.botones = c.botones.filter(function (b) { return (b.texto || '').trim(); });
        c.botones.forEach(function (b) { b.texto = b.texto.trim(); });
        if (!c.botones.length) { PP.avisar('Añade al menos un botón con su frase.'); return; }
        if (esFijos) tablero().fijos = c.botones;
        else {
          var i = tablero().categorias.findIndex(function (x) { return x.id === c.id; });
          if (i >= 0) tablero().categorias[i] = c; else tablero().categorias.push(c);
        }
        PP.persistir(); PP.avisar('Guardado'); PP.ir('tablero', null, { raiz: true });
      };
    }
  };

  function mover(lista, i, delta) {
    var j = i + delta; if (j < 0 || j >= lista.length) return;
    var x = lista[i]; lista[i] = lista[j]; lista[j] = x;
  }

  // =====================================================
  // 3) TABLERO DEL NIÑO (modo niño)
  // =====================================================
  PP.abrirTablero = function () {
    if (PP.evento) PP.evento('tablero_usado');
    var t = tablero();
    var activa = t.categorias[0] ? t.categorias[0].id : null;  // pestaña elegida
    var ultimo = null;                                          // último botón tocado

    function boton(b, clase) {
      return '<button class="boton-saac ' + clase + '" data-id="' + b.id + '" aria-label="' + PP.esc(b.texto) + '">' +
        PP.picto(b, 'picto-saac') + '<span class="saac-texto">' + PP.esc(b.texto) + '</span></button>';
    }

    function dibujar(cont) {
      var cat = t.categorias.find(function (c) { return c.id === activa; });
      cont.innerHTML =
        '<div class="tablero-marco">' +
        // Franja del mensaje: muestra (y repite) lo último que se dijo
        '<div class="mensaje' + (ultimo ? '' : ' vacio') + '">' +
        (ultimo ? PP.picto(ultimo, 'picto-s') + '<p class="crece" aria-live="assertive">' + PP.esc(ultimo.texto) + '</p>' +
          '<button class="repetir" data-repetir aria-label="Repetir en voz alta"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11"/></svg></button>'
          : '<p class="crece">Toca un dibujo para hablar</p>') +
        '</div>' +
        '<div class="fijos">' + t.fijos.map(function (b) { return boton(b, 'cat-salvia fijo'); }).join('') + '</div>' +
        '<div class="pestanas" role="tablist" aria-label="Categorías">' + t.categorias.map(function (c) {
          var sel = c.id === activa;
          return '<button role="tab" class="pestana cat-' + c.color + (sel ? ' activa' : '') + '" aria-selected="' + sel + '" data-cat="' + c.id + '">' +
            (c.botones[0] ? PP.picto(c.botones[0], 'picto-tab') : '') + '<span>' + PP.esc(c.nombre) + '</span></button>';
        }).join('') + '</div>' +
        (cat ? '<div class="rejilla-saac" role="tabpanel" aria-label="' + PP.esc(cat.nombre) + '" style="--cols:' + t.columnas + '">' +
          cat.botones.map(function (b) { return boton(b, 'cat-' + cat.color); }).join('') + '</div>' : '') +
        '</div>';
    }

    function todos() {
      return t.fijos.concat.apply(t.fijos, t.categorias.map(function (c) { return c.botones; }));
    }

    PP.entrarModoNino(function (cont) {
      dibujar(cont);
      cont.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.cat) { activa = b.dataset.cat; dibujar(cont); $('.pestana.activa', cont).focus(); return; }
        if (b.hasAttribute('data-repetir') && ultimo) { PP.decirItem(ultimo, { siempre: true }); return; }
        if (b.dataset.id) {
          var elegido = todos().find(function (x) { return x.id === b.dataset.id; });
          if (!elegido) return;
          ultimo = elegido;
          PP.anotarUso(elegido.texto);
          PP.decirItem(elegido, { siempre: true });  // la voz habla SIEMPRE: es su forma de comunicarse
          dibujar(cont);
          // Señal visual suave en el botón tocado (por si no hay sonido)
          var nuevo = cont.querySelector('[data-id="' + elegido.id + '"]');
          if (nuevo) { nuevo.classList.add('pulsado'); nuevo.focus(); setTimeout(function () { nuevo.classList.remove('pulsado'); }, 700); }
        }
      };
    });
  };
})(window.PP);
