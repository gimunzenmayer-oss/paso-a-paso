/* =========================================================
   agenda.js — MÓDULO 1: Agenda visual de rutinas
   ---------------------------------------------------------
   Tres pantallas:
   1) Lista de rutinas (adulto): ver, empezar o editar.
   2) Editor de rutina (adulto): nombre, hora y pasos con
      símbolo o foto propia; ordenar y borrar pasos.
   3) Vista del niño (modo niño): un paso grande cada vez,
      "Ahora" y "Después", botón ¡Hecho! y refuerzo suave.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };

  // Qué pasos se han hecho HOY. Si el registro es de otro día, empieza de cero.
  PP.progresoDe = function (rutina) {
    var pr = PP.estado.progreso[rutina.id];
    if (!pr || pr.fecha !== PP.hoy()) {
      pr = PP.estado.progreso[rutina.id] = { fecha: PP.hoy(), hechos: [] };
    }
    // Si se borró un paso, lo quitamos también de "hechos"
    pr.hechos = pr.hechos.filter(function (id) { return rutina.pasos.some(function (p) { return p.id === id; }); });
    return pr;
  };

  function buscarRutina(id) { return PP.estado.rutinas.find(function (r) { return r.id === id; }); }

  // =====================================================
  // 1) LISTA DE RUTINAS
  // =====================================================
  PP.pantallas.agenda = {
    titulo: 'Agenda visual', seccion: 'preparar',
    pintar: function (main) {
      var nombre = PP.esc(PP.estado.perfil.nombre);
      var rutinas = PP.estado.rutinas.slice().sort(function (a, b) { return a.hora.localeCompare(b.hora); });
      main.innerHTML =
        '<p class="intro">Elige una rutina y dásela a ' + nombre + '. Verá un paso cada vez y lo marcará al terminar.</p>' +
        '<div class="lista-rutinas">' + rutinas.map(function (r) {
          var pr = PP.progresoDe(r), hechos = pr.hechos.length, total = r.pasos.length;
          return '<article class="tarjeta rutina" aria-labelledby="r-' + r.id + '">' +
            '<div class="fila">' + PP.picto(r, 'picto-m') +
            '<div class="crece"><h2 id="r-' + r.id + '">' + PP.esc(r.nombre) + '</h2>' +
            '<p class="suave"><span class="num">' + PP.esc(r.hora) + '</span> · ' + total + ' pasos</p></div>' +
            '<span class="chip' + (hechos === total && total ? ' ok' : '') + '">' + (hechos === total && total ? 'Hecha hoy' : hechos + ' / ' + total) + '</span></div>' +
            '<ol class="tira" aria-label="Pasos">' + r.pasos.map(function (p) {
              return '<li class="' + (pr.hechos.indexOf(p.id) >= 0 ? 'hecho' : '') + '" title="' + PP.esc(p.texto) + '">' + PP.picto(p, 'picto-xs') + '<span class="sr">' + PP.esc(p.texto) + '</span></li>';
            }).join('') + '</ol>' +
            '<div class="acciones"><button class="btn" data-editar="' + r.id + '">Editar</button>' +
            '<button class="btn principal" data-empezar="' + r.id + '">Empezar con ' + nombre + '</button></div>' +
            '</article>';
        }).join('') + '</div>' +
        '<button class="btn grande ancho" data-nueva>+ Crear una rutina nueva</button>';

      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.empezar) PP.empezarRutina(b.dataset.empezar);
        if (b.dataset.editar) PP.ir('editarRutina', { id: b.dataset.editar });
        if (b.hasAttribute('data-nueva')) PP.ir('editarRutina', { nueva: true });
      };
    }
  };

  // =====================================================
  // 2) EDITOR DE RUTINA
  // =====================================================
  // Trabajamos sobre una COPIA (borrador). Solo se guarda al pulsar "Guardar".
  PP.pantallas.editarRutina = {
    titulo: function (params) { return params.nueva ? 'Nueva rutina' : 'Editar rutina'; },
    seccion: 'preparar',
    pintar: function (main, params) {
      if (!params.borrador) {
        params.borrador = params.nueva
          ? { id: PP.nuevoId(), nombre: '', hora: '09:00', picto: '⭐', pasos: [] }
          : JSON.parse(JSON.stringify(buscarRutina(params.id)));
      }
      var b = params.borrador;

      main.innerHTML =
        '<form class="formulario" id="form-rutina" novalidate>' +
        '<div class="fila arriba">' +
        '  <button type="button" class="picto-boton" data-elegir="rutina" aria-label="Cambiar el símbolo de la rutina">' + PP.picto(b, 'picto-m') + '</button>' +
        '  <label class="campo crece" for="ru-nombre">Nombre de la rutina<input id="ru-nombre" value="' + PP.esc(b.nombre) + '" placeholder="Por ejemplo: Ir al médico" autocomplete="off"></label>' +
        '</div>' +
        '<label class="campo" for="ru-hora">Hora habitual<input id="ru-hora" type="time" value="' + PP.esc(b.hora) + '"></label>' +
        '<h2 class="seccion-t">Pasos <span class="suave">(' + b.pasos.length + ')</span></h2>' +
        (b.pasos.length ? '' : '<p class="suave">Todavía no hay pasos. Agrega el primero.</p>') +
        '<ol class="pasos-editor">' + b.pasos.map(function (p, i) {
          return '<li>' +
            '<span class="orden num" aria-hidden="true">' + (i + 1) + '</span>' +
            '<button type="button" class="picto-boton" data-elegir="' + i + '" aria-label="Cambiar el símbolo del paso ' + (i + 1) + '">' + PP.picto(p, 'picto-s') + '</button>' +
            '<label class="sr" for="paso-' + i + '">Texto del paso ' + (i + 1) + '</label>' +
            '<input id="paso-' + i + '" class="crece" data-texto="' + i + '" value="' + PP.esc(p.texto) + '" autocomplete="off">' +
            '<span class="mini-acciones">' +
            '<button type="button" class="icono' + (p.audio ? ' grabado' : '') + '" data-grabar="' + i + '" aria-label="' + (p.audio ? 'Volver a grabar' : 'Grabar con tu voz') + ' el paso ' + (i + 1) + '">🎙</button>' +
            '<button type="button" class="icono" data-oir="' + i + '" aria-label="Escuchar paso ' + (i + 1) + '">🔊</button>' +
            '<button type="button" class="icono" data-subir="' + i + '" aria-label="Subir paso ' + (i + 1) + '"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button type="button" class="icono" data-bajar="' + i + '" aria-label="Bajar paso ' + (i + 1) + '"' + (i === b.pasos.length - 1 ? ' disabled' : '') + '>↓</button>' +
            '<button type="button" class="icono" data-quitar="' + i + '" aria-label="Quitar paso ' + (i + 1) + '">✕</button>' +
            '</span></li>';
        }).join('') + '</ol>' +
        '<button type="button" class="btn grande ancho" data-elegir="nuevo">+ Agregar un paso</button>' +
        '<div class="pie-form">' +
        '  <button type="button" class="btn" data-cancelar>Cancelar</button>' +
        '  <button type="submit" class="btn principal">Guardar rutina</button>' +
        '</div>' +
        (params.nueva ? '' :
          '<div class="zona-extra" id="zona-extra">' +
          '<button type="button" class="btn" data-reiniciar>Desmarcar lo hecho hoy</button>' +
          '<button type="button" class="btn peligro" data-eliminar>Eliminar rutina</button></div>') +
        '</form>' +
        '<div class="hoja" id="hoja" hidden></div>';

      // Guardar lo que se escribe en el borrador (sin repintar, para no perder el foco)
      main.oninput = function (e) {
        if (e.target.id === 'ru-nombre') b.nombre = e.target.value;
        if (e.target.id === 'ru-hora') b.hora = e.target.value;
        if (e.target.dataset.texto != null) b.pasos[+e.target.dataset.texto].texto = e.target.value;
      };

      main.onclick = function (e) {
        var t = e.target.closest('button'); if (!t) return;
        var d = t.dataset;
        if (d.oir != null) PP.decirItem(b.pasos[+d.oir], { siempre: true });
        if (d.grabar != null) {
          var paso = b.pasos[+d.grabar];
          if (!PP.grabando()) t.classList.add('grabando');
          PP.grabarVoz(function (audio) { paso.audio = audio; PP.repintar(); PP.avisar('Grabación guardada. Toca Guardar rutina.'); });
        }
        if (d.subir != null) { mover(b.pasos, +d.subir, -1); PP.repintar(); }
        if (d.bajar != null) { mover(b.pasos, +d.bajar, 1); PP.repintar(); }
        if (d.quitar != null) { b.pasos.splice(+d.quitar, 1); PP.repintar(); PP.avisar('Paso quitado'); }
        if (d.elegir != null) abrirSelector(main, b, d.elegir);
        if (t.hasAttribute('data-cancelar')) PP.atras();
        if (t.hasAttribute('data-reiniciar')) {
          PP.estado.progreso[b.id] = { fecha: PP.hoy(), hechos: [] };
          PP.persistirConAviso(function () { PP.avisar('Pasos de hoy desmarcados'); });
        }
        if (t.hasAttribute('data-eliminar')) {
          $('#zona-extra').innerHTML = '<p><strong>¿Eliminar «' + PP.esc(b.nombre) + '»?</strong> No se puede deshacer.</p>' +
            '<div class="fila"><button type="button" class="btn peligro" data-eliminar-si>Sí, eliminar</button><button type="button" class="btn" data-eliminar-no>No</button></div>';
        }
        if (t.hasAttribute('data-eliminar-si')) {
          PP.estado.rutinas = PP.estado.rutinas.filter(function (r) { return r.id !== b.id; });
          delete PP.estado.progreso[b.id];
          PP.persistirConAviso(function () { PP.avisar('Rutina eliminada'); PP.ir('agenda', null, { raiz: true }); });
        }
        if (t.hasAttribute('data-eliminar-no')) PP.repintar();
      };

      $('#form-rutina').onsubmit = function (e) {
        e.preventDefault();
        b.nombre = b.nombre.trim();
        if (!b.nombre) { PP.avisar('Ponle un nombre a la rutina.'); $('#ru-nombre').focus(); return; }
        if (!b.pasos.length) { PP.avisar('Agrega al menos un paso.'); return; }
        b.pasos.forEach(function (p, i) { p.texto = (p.texto || '').trim() || 'Paso ' + (i + 1); });
        var i = PP.estado.rutinas.findIndex(function (r) { return r.id === b.id; });
        if (i >= 0) PP.estado.rutinas[i] = b; else PP.estado.rutinas.push(b);
        PP.persistirConAviso(function () {
          PP.avisar('Rutina guardada');
          PP.ir('agenda', null, { raiz: true });
        });
      };
    }
  };

  function mover(lista, i, delta) {
    var j = i + delta; if (j < 0 || j >= lista.length) return;
    var x = lista[i]; lista[i] = lista[j]; lista[j] = x;
  }

  // Abre el panel de pictogramas para la agenda.
  // destino = 'rutina' (símbolo de la rutina), 'nuevo' (añadir paso) o el número de paso.
  function abrirSelector(main, b, destino) {
    PP.elegirPicto($('#hoja', main), function (picto, texto, foto) {
      if (destino === 'rutina') { b.picto = picto || b.picto; b.foto = foto || null; }
      else if (destino === 'nuevo') b.pasos.push({ id: PP.nuevoId(), texto: texto || '', picto: picto || '⭐', foto: foto || null });
      else {
        var p = b.pasos[+destino];
        if (picto) p.picto = picto;
        p.foto = foto || null;
        if (!p.texto && texto) p.texto = texto;
      }
      PP.repintar();
    });
  }

  // Panel para elegir un símbolo de la biblioteca o una foto propia.
  // Lo comparten la agenda y el tablero. 'alElegir' recibe (símbolo, texto, foto).
  PP.elegirPicto = function (hoja, alElegir) {
    hoja.hidden = false;
    hoja.innerHTML =
      '<div class="hoja-caja" role="dialog" aria-modal="true" aria-labelledby="hoja-t">' +
      '<div class="fila"><h2 id="hoja-t" class="crece">Elegir pictograma</h2><button type="button" class="btn" data-cerrar>Cerrar</button></div>' +
      '<label class="btn ancho foto-btn" for="foto-propia">Usar una foto propia<input type="file" id="foto-propia" accept="image/*" class="sr"></label>' +
      PP.biblioteca.map(function (grupo) {
        return '<h3 class="seccion-t">' + grupo.cat + '</h3><div class="rejilla-picto">' + grupo.items.map(function (it) {
          return '<button type="button" class="picto-op" data-picto="' + it[0] + '" data-texto="' + PP.esc(it[1]) + '">' +
            '<span class="picto-s" aria-hidden="true">' + it[0] + '</span><span>' + PP.esc(it[1]) + '</span></button>';
        }).join('') + '</div>';
      }).join('') +
      '<p class="suave nota">Estos símbolos son de muestra. En la versión final aquí aparecerá una colección de pictogramas con licencia adecuada, guardada en el teléfono para usarla sin internet.</p>' +
      '</div>';

    var aplicar = function (picto, texto, foto) {
      hoja.hidden = true;
      alElegir(picto, texto, foto);
    };

    hoja.onclick = function (e) {
      if (e.target === hoja) { hoja.hidden = true; return; }
      var t = e.target.closest('button'); if (!t) return;
      if (t.hasAttribute('data-cerrar')) hoja.hidden = true;
      if (t.dataset.picto) aplicar(t.dataset.picto, t.dataset.texto, null);
    };
    $('#foto-propia', hoja).onchange = function (e) {
      var archivo = e.target.files[0]; if (!archivo) return;
      reducirFoto(archivo).then(function (url) { aplicar(null, '', url); })
        .catch(function () { PP.avisar('No se pudo abrir esa foto. Prueba con otra.'); });
    };
    $('button', hoja).focus();
  };

  // Las fotos de los móviles son enormes: las reducimos a 480 px
  // para que ocupen poco y se guarden rápido en el teléfono.
  function reducirFoto(archivo) {
    return new Promise(function (ok, mal) {
      var lector = new FileReader();
      lector.onerror = mal;
      lector.onload = function () {
        var img = new Image();
        img.onerror = mal;
        img.onload = function () {
          var lado = 480, esc = Math.min(1, lado / Math.max(img.width, img.height));
          var c = document.createElement('canvas');
          c.width = Math.round(img.width * esc); c.height = Math.round(img.height * esc);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          ok(c.toDataURL('image/jpeg', 0.82));
        };
        img.src = lector.result;
      };
      lector.readAsDataURL(archivo);
    });
  }

  // =====================================================
  // 3) VISTA DEL NIÑO (modo niño)
  // =====================================================
  var FRASES = ['¡Muy bien!', '¡Lo hiciste!', '¡Genial!', '¡Bien hecho!'];

  PP.empezarRutina = function (id) {
    var r = buscarRutina(id); if (!r || !r.pasos.length) { PP.avisar('Esta rutina no tiene pasos todavía.'); return; }
    var pr = PP.progresoDe(r);
    var elegido = null;      // paso que el niño ha tocado en la tira (si lo hay)
    var ocupado = false;     // evita dobles toques durante el refuerzo

    function indiceActual() {
      if (elegido != null) return elegido;
      var i = r.pasos.findIndex(function (p) { return pr.hechos.indexOf(p.id) < 0; });
      return i; // -1 si ya está todo hecho
    }

    function dibujar(cont) {
      var i = indiceActual();
      var nombreNino = PP.esc(PP.estado.perfil.nombre);
      var tira = '<ol class="tira grande" aria-label="Pasos de la rutina">' + r.pasos.map(function (p, k) {
        var hecho = pr.hechos.indexOf(p.id) >= 0;
        return '<li><button class="' + (hecho ? 'hecho' : '') + (k === i ? ' actual' : '') + '" data-ver="' + k + '" aria-label="' + PP.esc(p.texto) + (hecho ? ', hecho' : '') + '"' + (k === i ? ' aria-current="step"' : '') + '>' +
          PP.picto(p, 'picto-xs') + (hecho ? '<span class="marca" aria-hidden="true">✓</span>' : '') + '</button></li>';
      }).join('') + '</ol>';

      if (i < 0) {
        // Rutina terminada
        cont.innerHTML =
          '<div class="nino-marco">' + tira +
          '<section class="final" aria-live="polite">' +
          '<svg class="estrella" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8l12.4 25.2 27.8 4-20.1 19.6 4.7 27.7L50 71.4 25.2 84.5l4.7-27.7L9.8 37.2l27.8-4z"/></svg>' +
          '<h1>¡Rutina terminada!</h1><p>' + PP.esc(r.nombre) + ' · ' + r.pasos.length + ' de ' + r.pasos.length + ' pasos</p>' +
          '</section></div>';
        PP.decir('¡Rutina terminada! Muy bien, ' + PP.estado.perfil.nombre + '.');
        return;
      }

      var paso = r.pasos[i], siguiente = r.pasos.slice(i + 1).find(function (p) { return pr.hechos.indexOf(p.id) < 0; });
      var yaHecho = pr.hechos.indexOf(paso.id) >= 0;
      cont.innerHTML =
        '<div class="nino-marco">' + tira +
        '<p class="etiqueta-nino">Ahora</p>' +
        '<button class="carta-paso' + (yaHecho ? ' hecho' : '') + '" data-leer aria-label="' + PP.esc(paso.texto) + '. Toca para escuchar">' +
        PP.picto(paso, 'picto-xl') + '<span class="carta-texto">' + PP.esc(paso.texto) + '</span>' +
        '<span class="marca-grande" aria-hidden="true">✓</span></button>' +
        (yaHecho
          ? '<button class="btn-hecho otra" data-desmarcar>Hacer otra vez</button>'
          : '<button class="btn-hecho" data-hecho>¡Hecho!</button>') +
        (siguiente ? '<div class="despues"><span class="etiqueta-nino">Después</span>' + PP.picto(siguiente, 'picto-s') + '<span>' + PP.esc(siguiente.texto) + '</span></div>'
          : '<div class="despues"><span class="etiqueta-nino">Después</span><span>¡Terminamos, ' + nombreNino + '!</span></div>') +
        '<p class="refuerzo" aria-live="polite"></p>' +
        '</div>';
    }

    PP.entrarModoNino(function (cont) {
      dibujar(cont);
      var primero = r.pasos[indiceActual()];
      if (primero) PP.decirItem(primero, null, 'Ahora: ');

      cont.onclick = function (e) {
        var t = e.target.closest('button'); if (!t || ocupado) return;
        var i = indiceActual(), paso = r.pasos[i];
        if (t.hasAttribute('data-leer')) PP.decirItem(paso);
        if (t.dataset.ver != null) { elegido = +t.dataset.ver; dibujar(cont); PP.decirItem(r.pasos[elegido]); }
        if (t.hasAttribute('data-desmarcar')) {
          pr.hechos = pr.hechos.filter(function (id) { return id !== paso.id; });
          PP.persistirConAviso(); elegido = null; dibujar(cont);
        }
        if (t.hasAttribute('data-hecho')) {
          // 1) Guardar que está hecho  2) Refuerzo suave  3) Pasar al siguiente
          ocupado = true;
          var nuevo = pr.hechos.indexOf(paso.id) < 0;
          if (nuevo) pr.hechos.push(paso.id);
          PP.persistirConAviso();
          if (nuevo) PP.evento('rutina_paso_completado');
          if (pr.hechos.length === r.pasos.length) {
            PP.anotarEstrella(r); // rutina terminada: ¡una estrella!
            if (nuevo) PP.evento('rutina_completada', { pasos: r.pasos.length });
          }
          var frase = FRASES[pr.hechos.length % FRASES.length];
          $('.carta-paso', cont).classList.add('hecho');
          t.disabled = true;
          $('.refuerzo', cont).textContent = frase;
          PP.sonidoSuave();
          PP.decir(frase);
          var calma = PP.estado.perfil.modoCalma;
          setTimeout(function () {
            ocupado = false; elegido = null; dibujar(cont);
            var sig = r.pasos[indiceActual()];
            if (sig) setTimeout(function () { PP.decirItem(sig, null, 'Ahora: '); }, 300);
            var carta = $('.carta-paso', cont); if (carta) carta.focus();
          }, calma ? 700 : 1500);
        }
      };
    });
  };
})(window.PP);
