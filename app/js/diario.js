/* =========================================================
   diario.js — MÓDULO 6: Diario privado (solo para el adulto)
   ---------------------------------------------------------
   Apuntar en 30 segundos qué pasó: tipo de momento, cuánto
   duró, qué lo provocó y qué ayudó. Con el tiempo se ven
   patrones ("casi siempre es por la tarde, con ruido").
   El diario se guarda CIFRADO con el PIN (ver cifrado.js) y
   se abre escribiendo el PIN. Nunca sale del teléfono.
   1) Pantalla del diario: resumen con gráficos y lista.
   2) Formulario rápido para anotar (o corregir) un momento.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };

  PP.TIPOS = [
    { id: 'crisis', texto: 'Crisis', picto: '🌋' },
    { id: 'bloqueo', texto: 'Bloqueo', picto: '🐢' },
    { id: 'frustracion', texto: 'Enojo', picto: '😤' },
    { id: 'sensorial', texto: 'Sobrecarga sensorial', picto: '🔊' },
    { id: 'sueno', texto: 'Sueño', picto: '🌙' },
    { id: 'comida', texto: 'Comida', picto: '🥦' },
    { id: 'bueno', texto: 'Buen momento', picto: '🌟' },
    { id: 'otro', texto: 'Otro', picto: '📝' }
  ];
  var INTENSIDAD = ['Muy leve', 'Leve', 'Media', 'Fuerte', 'Muy fuerte'];
  var DURACION = [['5', 'Menos de 5 min'], ['15', '5 a 15 min'], ['30', '15 a 30 min'], ['60', 'Más de 30 min']];
  var CAUSAS = ['Ruido', 'Cambio de planes', 'Tener que esperar', 'Hambre', 'Cansancio', 'Pasar de una actividad a otra', 'Mucha gente', 'Luces', 'Ropa o texturas', 'Le dijeron que no', 'No lo sabemos'];
  var AYUDO = ['Sitio tranquilo', 'Audífonos', 'Abrazo o presión', 'Respirar', 'Tablero', 'Anticipar con la agenda', 'Temporizador', 'Música', 'Agua o comida', 'Esperar sin hablar', 'Nada funcionó'];
  PP.tipoDe = function (id) { return PP.TIPOS.find(function (t) { return t.id === id; }) || PP.TIPOS[7]; };
  PP.esDificil = function (e) { return e.tipo !== 'bueno'; };

  // ---------- Guardar y abrir el diario cifrado ----------
  var diario = null, llave = null, sal = null; // solo en memoria mientras está abierto

  PP.diarioAbierto = function () { return diario !== null; };
  PP.entradasDiario = function () { return diario || []; };

  function ejemplos() {
    // Algunas entradas de ejemplo para ver cómo quedan los gráficos
    var e = function (dias, hora, tipo, int, dur, causas, ayudo, nota) {
      return { id: PP.nuevoId(), fecha: PP.diasAtras(dias) + 'T' + hora, tipo: tipo, intensidad: int, duracion: dur, causas: causas, ayudo: ayudo, nota: nota || '', ejemplo: true };
    };
    return [
      e(13, '18:10', 'crisis', 4, '15', ['Ruido', 'Cansancio'], ['Sitio tranquilo', 'Audífonos'], 'Cumpleaños de un primo, mucha música.'),
      e(11, '08:05', 'frustracion', 2, '5', ['Cambio de planes'], ['Anticipar con la agenda'], ''),
      e(10, '17:30', 'sensorial', 3, '15', ['Ruido', 'Mucha gente'], ['Audífonos'], 'Supermercado a la salida de la escuela.'),
      e(8, '21:15', 'sueno', 2, '30', ['Cansancio'], ['Música'], 'Le costó dormir; con la canción de cuna se calmó.'),
      e(7, '16:45', 'bueno', 0, '', [], [], 'Pidió «Quiero un abrazo» con el tablero.'),
      e(6, '17:50', 'crisis', 3, '15', ['Pasar de una actividad a otra', 'Cansancio'], ['Temporizador', 'Sitio tranquilo'], 'Al salir del parque.'),
      e(4, '08:20', 'bloqueo', 2, '5', ['Tener que esperar'], ['Esperar sin hablar'], ''),
      e(3, '13:30', 'comida', 1, '5', ['Ropa o texturas'], ['Agua o comida'], 'No quiso la crema de verduras.'),
      e(2, '18:05', 'frustracion', 3, '5', ['Le dijeron que no', 'Cansancio'], ['Respirar', 'Abrazo o presión'], ''),
      e(1, '10:00', 'bueno', 0, '', [], [], 'Hizo la rutina de la mañana entera él solo.')
    ];
  }

  function guardar() {
    if (!PP.cifrado.disponible) return PP.guardar('diario', { plano: true, entradas: diario });
    return PP.cifrado.cifrar(llave, diario).then(function (caja) { caja.sal = sal; return PP.guardar('diario', caja); });
  }
  PP.guardarDiario = guardar;

  // Abrir con el PIN (ya comprobado). Si no existe, se crea con ejemplos.
  PP.abrirDiario = function (pin) {
    return PP.leer('diario').then(function (caja) {
      if (!caja) {
        diario = ejemplos();
        if (!PP.cifrado.disponible) return guardar();
        sal = PP.cifrado.nuevaSal();
        return PP.cifrado.llave(pin, sal).then(function (k) { llave = k; return guardar(); });
      }
      if (caja.plano) {
        diario = renombrarEtiquetas(caja.entradas || []);
        if (!PP.cifrado.disponible) return;
        // Se guardó sin cifrar (navegador antiguo): ahora lo ciframos
        sal = PP.cifrado.nuevaSal();
        return PP.cifrado.llave(pin, sal).then(function (k) { llave = k; return guardar(); });
      }
      sal = caja.sal;
      return PP.cifrado.llave(pin, sal).then(function (k) {
        return PP.cifrado.descifrar(k, caja).then(function (d) { llave = k; diario = renombrarEtiquetas(d); });
      });
    });
  };

  // Etiquetas que cambiaron de nombre (español de España → latino)
  function renombrarEtiquetas(lista) {
    lista.forEach(function (e) { e.ayudo = (e.ayudo || []).map(function (x) { return x === 'Cascos' ? 'Audífonos' : x; }); });
    return lista;
  }

  // Quitar las entradas de ejemplo (desde el Diario o desde el Informe)
  PP.borrarEjemplosDiario = function () {
    var antes = diario; diario = diario.filter(function (x) { return !x.ejemplo; });
    return guardar().then(function () { PP.avisar('Ejemplos borrados'); PP.repintar(); })
      .catch(function () { diario = antes; PP.avisar('No se pudieron borrar. Prueba otra vez.'); });
  };

  PP.cerrarDiario = function () { diario = null; llave = null; };
  PP.borrarDiario = function () { PP.cerrarDiario(); sal = null; return PP.guardar('diario', null); };

  // Al cambiar el PIN, el diario se vuelve a cifrar con el nuevo
  PP.cambiarPinDiario = function (viejo, nuevo) {
    return PP.leer('diario').then(function (caja) {
      if (!caja || caja.plano || !PP.cifrado.disponible) return;
      var abrir = diario ? Promise.resolve() : PP.abrirDiario(viejo);
      return abrir.then(function () {
        sal = PP.cifrado.nuevaSal();
        return PP.cifrado.llave(nuevo, sal);
      }).then(function (k) { llave = k; return guardar(); });
    });
  };

  // Hacer algo con el diario: si está cerrado, pide el PIN primero
  PP.conDiario = function (fn) {
    if (diario) { fn(); return; }
    PP.pedirPin({
      titulo: 'Abrir el diario',
      alAcertar: function (pin) {
        PP.abrirDiario(pin).then(fn).catch(function () { PP.avisar('No se pudo abrir el diario.'); });
      }
    });
  };

  // Tarjeta que se ve cuando el diario está cerrado
  PP.diarioCerrado = function (main, motivo) {
    main.innerHTML = '<section class="tarjeta bloque candado-diario">' +
      '<span class="picto-m" aria-hidden="true">🔒</span>' +
      '<h2>' + motivo + '</h2>' +
      '<p>El diario es privado: se guarda cifrado en este teléfono y solo se abre con tu PIN.</p>' +
      '<button class="btn principal grande ancho" data-abrir>Abrir con mi PIN</button></section>';
    main.onclick = function (e) { if (e.target.closest('[data-abrir]')) PP.conDiario(PP.repintar); };
  };

  // ---------- Gráficos sencillos (barras, un solo color) ----------
  PP.barrasDias = barrasDias;
  function barrasDias(entradas, dias) {
    var datos = [];
    for (var d = dias - 1; d >= 0; d--) {
      var f = PP.diasAtras(d);
      datos.push({ f: f, n: entradas.filter(function (e) { return PP.esDificil(e) && e.fecha.slice(0, 10) === f; }).length });
    }
    var max = Math.max(2, Math.max.apply(null, datos.map(function (x) { return x.n; })));
    var W = 320, H = 120, ancho = W / dias;
    var dibujo = datos.map(function (x, i) {
      var h = x.n ? Math.max(6, (H - 22) * x.n / max) : 0, xx = i * ancho + 3, yy = H - 18 - h;
      var dia = new Date(x.f + 'T12:00').toLocaleDateString('es', { weekday: 'short', day: 'numeric' });
      return '<g class="barra-g"><rect class="hueco" x="' + (i * ancho) + '" y="0" width="' + ancho + '" height="' + H + '"><title>' + dia + ': ' + x.n + '</title></rect>' +
        (h ? '<path class="barra-d" d="M' + xx + ' ' + (H - 18) + 'V' + (yy + 4) + 'q0 -4 4 -4h' + (ancho - 14) + 'q4 0 4 4V' + (H - 18) + 'Z"><title>' + dia + ': ' + x.n + '</title></path>' +
          '<text class="g-valor" x="' + (xx + (ancho - 6) / 2) + '" y="' + (yy - 4) + '">' + x.n + '</text>' : '') +
        ((i % 2 === (dias - 1) % 2) ? '<text class="g-eje" x="' + (xx + (ancho - 6) / 2) + '" y="' + (H - 4) + '">' + +x.f.slice(8) + '</text>' : '') + '</g>';
    }).join('');
    return '<svg class="grafico" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Momentos difíciles por día, últimos ' + dias + ' días">' +
      '<line class="g-base" x1="0" x2="' + W + '" y1="' + (H - 18) + '" y2="' + (H - 18) + '"/>' + dibujo + '</svg>';
  }

  // Lista ordenada de lo más frecuente, con barras horizontales
  PP.ranking = function (entradas, campo, tope) {
    var cuenta = {};
    entradas.forEach(function (e) { (e[campo] || []).forEach(function (c) { cuenta[c] = (cuenta[c] || 0) + 1; }); });
    return Object.keys(cuenta).map(function (k) { return [k, cuenta[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, tope || 5);
  };
  PP.barrasRanking = function (filas) {
    if (!filas.length) return '<p class="suave">Todavía no hay datos.</p>';
    var max = filas[0][1];
    return '<ul class="ranking">' + filas.map(function (f) {
      return '<li><span class="r-texto">' + PP.esc(f[0]) + '</span><span class="r-barra"><span style="width:' + (100 * f[1] / max) + '%"></span></span><span class="r-num num">' + f[1] + '</span></li>';
    }).join('') + '</ul>';
  };

  function fechaBonita(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  }

  // =====================================================
  // 1) PANTALLA DEL DIARIO
  // =====================================================
  PP.pantallas.diario = {
    titulo: 'Diario', seccion: 'diario',
    pintar: function (main) {
      if (!diario) { PP.diarioCerrado(main, 'Tu diario está cerrado'); return; }
      var ent = diario.slice().sort(function (a, b) { return b.fecha.localeCompare(a.fecha); });
      var desde = PP.diasAtras(13), recientes = ent.filter(function (e) { return e.fecha.slice(0, 10) >= desde; });
      var dificiles = recientes.filter(PP.esDificil), buenos = recientes.length - dificiles.length;
      var hayEjemplos = ent.some(function (e) { return e.ejemplo; });
      main.innerHTML =
        '<button class="btn principal grande ancho" data-nuevo>+ Anotar un momento</button>' +
        (hayEjemplos ? '<div class="aviso-legal fila"><span class="crece">Hay entradas de ejemplo para que veas cómo funciona.</span><button class="btn" data-sin-ejemplos>Borrarlas</button></div>' : '') +
        '<section class="tarjeta bloque"><h2 class="seccion-t">Últimos 14 días</h2>' +
        '<div class="cifras"><div><strong class="num">' + dificiles.length + '</strong><span>momentos difíciles</span></div><div><strong class="num">' + buenos + '</strong><span>buenos momentos</span></div></div>' +
        '<h3 class="mini-t">Momentos difíciles por día</h3>' + barrasDias(ent, 14) +
        '<h3 class="mini-t">Lo que más los provoca</h3>' + PP.barrasRanking(PP.ranking(dificiles, 'causas')) +
        '<h3 class="mini-t">Lo que más ayuda</h3>' + PP.barrasRanking(PP.ranking(dificiles, 'ayudo').filter(function (f) { return f[0] !== 'Nada funcionó'; })) +
        '</section>' +
        '<h2 class="seccion-t">Todas las notas (' + ent.length + ')</h2>' +
        '<div class="lista">' + ent.map(function (e) {
          var t = PP.tipoDe(e.tipo);
          return '<button class="fila-lista" data-editar="' + e.id + '"><span class="picto-s" aria-hidden="true">' + t.picto + '</span><span class="crece"><strong>' + t.texto +
            (e.tipo !== 'bueno' && e.intensidad ? ' · ' + INTENSIDAD[e.intensidad - 1].toLowerCase() : '') + (e.ejemplo ? ' <span class="chip">ejemplo</span>' : '') + '</strong>' +
            '<span class="suave">' + fechaBonita(e.fecha) + '</span>' +
            ((e.causas || []).length ? '<span class="suave">Por: ' + PP.esc(e.causas.join(', ')) + '</span>' : '') +
            (e.nota ? '<span class="suave">' + PP.esc(e.nota) + '</span>' : '') + '</span></button>';
        }).join('') + '</div>' +
        '<button class="btn ancho" data-cerrar>🔒 Cerrar el diario</button>' +
        '<p class="suave">Si hay un momento difícil ahora mismo, mira la <button class="enlace" data-guia>Guía para familias</button>.</p>';
      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.hasAttribute('data-nuevo')) PP.ir('diarioNuevo');
        if (b.dataset.editar) PP.ir('diarioNuevo', { id: b.dataset.editar });
        if (b.hasAttribute('data-cerrar')) { PP.cerrarDiario(); PP.repintar(); }
        if (b.hasAttribute('data-guia')) PP.ir('guia', null, { raiz: true });
        if (b.hasAttribute('data-sin-ejemplos')) { PP.borrarEjemplosDiario(); }
      };
    }
  };

  // =====================================================
  // 2) ANOTAR (o corregir) UN MOMENTO
  // =====================================================
  PP.pantallas.diarioNuevo = {
    titulo: function (params) { return params.id ? 'Corregir nota' : 'Anotar un momento'; }, seccion: 'diario',
    pintar: function (main, params) {
      if (!diario) { PP.diarioCerrado(main, 'Para anotar, abre tu diario'); return; }
      if (!params.borrador) {
        var ahora = new Date(), local = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        var existente = params.id && diario.find(function (x) { return x.id === params.id; });
        params.borrador = existente ? JSON.parse(JSON.stringify(existente))
          : { id: PP.nuevoId(), fecha: local, tipo: '', intensidad: 3, duracion: '5', causas: [], ayudo: [], nota: '' };
        params.original = JSON.stringify(params.borrador);
      }
      var e = params.borrador;
      // Primero las 6 opciones más comunes; el resto, con "Ver más" (las ya marcadas siempre se ven)
      var chips = function (lista, campo) {
        var abierto = params.verMas && params.verMas[campo];
        var visibles = lista.filter(function (x, i) { return abierto || i < 6 || e[campo].indexOf(x) >= 0; });
        var ocultas = lista.length - visibles.length;
        return '<div class="chips" role="group">' + visibles.map(function (x) {
          var si = e[campo].indexOf(x) >= 0;
          return '<button type="button" class="chip-op' + (si ? ' activo' : '') + '" aria-pressed="' + si + '" data-' + campo + '="' + PP.esc(x) + '">' + PP.esc(x) + '</button>';
        }).join('') + (ocultas ? '<button type="button" class="enlace ver-mas" data-ver-mas="' + campo + '">Ver ' + ocultas + ' más</button>' : '') + '</div>';
      };
      var bueno = e.tipo === 'bueno';
      // Lo esencial (qué pasó y con qué fuerza) a la vista; el resto, plegado en "Añadir detalles"
      var abrirDetalles = params.detalles != null ? params.detalles : !!(params.id || e.causas.length || e.ayudo.length || e.nota);
      var notaYFecha = '<label class="campo" for="d-nota">Nota <span class="suave">(opcional)</span><textarea id="d-nota" rows="3" placeholder="' + (bueno ? '¿Qué salió bien?' : 'Dónde estaban, qué pasó antes…') + '">' + PP.esc(e.nota) + '</textarea></label>' +
        '<label class="campo" for="d-fecha">Cuándo<input id="d-fecha" type="datetime-local" value="' + PP.esc(e.fecha.slice(0, 16)) + '"></label>';
      main.innerHTML =
        '<form class="formulario" id="form-d">' +
        '<h2 class="seccion-t" id="d-tipo-t">¿Qué pasó?</h2>' +
        '<p class="error-campo" id="d-tipo-error" role="alert"' + (params.faltaTipo && !e.tipo ? '' : ' hidden') + '>Elige qué pasó para poder guardar.</p>' +
        '<div class="rejilla-tipos">' + PP.TIPOS.map(function (t) {
          return '<button type="button" class="tipo-op' + (e.tipo === t.id ? ' activo' : '') + '" aria-pressed="' + (e.tipo === t.id) + '" data-tipo="' + t.id + '"><span aria-hidden="true">' + t.picto + '</span>' + t.texto + '</button>';
        }).join('') + '</div>' +
        (e.tipo && !bueno ?
          '<h2 class="seccion-t">¿Con qué fuerza?</h2>' +
          '<fieldset class="segmentado cinco"><legend class="sr">Intensidad</legend>' + INTENSIDAD.map(function (t, i) {
            return '<label><input type="radio" name="int" value="' + (i + 1) + '"' + (e.intensidad === i + 1 ? ' checked' : '') + '><span>' + (i + 1) + '<small>' + t + '</small></span></label>';
          }).join('') + '</fieldset>' +
          '' : '') +
        (e.tipo ? (bueno ? notaYFecha : '<details class="detalles" id="d-det"' + (abrirDetalles ? ' open' : '') + '><summary>Agregar detalles <span class="suave">(opcional)</span></summary>' +
          '<h2 class="seccion-t">¿Cuánto duró?</h2>' +
          '<fieldset class="segmentado"><legend class="sr">Duración</legend>' + DURACION.map(function (d) {
            return '<label><input type="radio" name="dur" value="' + d[0] + '"' + (e.duracion === d[0] ? ' checked' : '') + '><span>' + d[1] + '</span></label>';
          }).join('') + '</fieldset>' +
          '<h2 class="seccion-t">¿Qué crees que lo provocó? <span class="suave">(puedes marcar varias)</span></h2>' + chips(CAUSAS, 'causas') +
          '<h2 class="seccion-t">¿Qué ayudó?</h2>' + chips(AYUDO, 'ayudo') + notaYFecha + '</details>') : '') +
        (params.id ? '<div class="zona-extra" id="zona-borrar"><button type="button" class="btn peligro" data-borrar>Borrar esta nota</button></div>' : '') +
        '<div class="pie-form" id="pie-d"><button type="submit" class="btn principal">Guardar</button><button type="button" class="btn" data-cancelar>Cancelar</button></div>' +
        '</form>';

      var det = $('#d-det');
      if (det) det.ontoggle = function () { params.detalles = det.open; };

      function leer() {
        var n = $('#d-nota'), f = $('#d-fecha');
        if (n) e.nota = n.value; if (f && f.value) e.fecha = f.value;
        var i = main.querySelector('input[name=int]:checked'), d = main.querySelector('input[name=dur]:checked');
        if (i) e.intensidad = +i.value; if (d) e.duracion = d.value;
      }
      main.onclick = function (ev) {
        var b = ev.target.closest('button'); if (!b || b.type === 'submit') return;
        leer();
        if (b.dataset.tipo) { e.tipo = b.dataset.tipo; params.faltaTipo = false; PP.repintar(); }
        if (b.dataset.verMas) { params.verMas = params.verMas || {}; params.verMas[b.dataset.verMas] = true; PP.repintar(); }
        ['causas', 'ayudo'].forEach(function (c) {
          var v = b.dataset[c]; if (v == null) return;
          var k = e[c].indexOf(v); if (k >= 0) e[c].splice(k, 1); else e[c].push(v);
          b.classList.toggle('activo', k < 0); b.setAttribute('aria-pressed', k < 0);
        });
        // Cancelar: si hay cambios sin guardar, preguntar antes de perderlos
        if (b.hasAttribute('data-cancelar')) {
          if (JSON.stringify(e) === params.original) PP.atras();
          else {
            $('#pie-d').classList.add('confirmando');
            $('#pie-d').innerHTML = '<p><strong>¿Salir sin guardar?</strong> Se perderá lo que anotaste.</p><button type="button" class="btn principal" data-seguir>Seguir anotando</button><button type="button" class="btn peligro" data-salir>Salir sin guardar</button>';
          }
        }
        if (b.hasAttribute('data-seguir')) PP.repintar();
        if (b.hasAttribute('data-salir')) PP.atras();
        if (b.hasAttribute('data-borrar')) $('#zona-borrar').innerHTML = '<p><strong>¿Borrar esta nota?</strong></p><div class="fila"><button type="button" class="btn peligro" data-borrar-si>Sí, borrar</button><button type="button" class="btn" data-borrar-no>No</button></div>';
        if (b.hasAttribute('data-borrar-no')) PP.repintar();
        if (b.hasAttribute('data-borrar-si')) {
          var antes = diario;
          diario = diario.filter(function (x) { return x.id !== e.id; });
          guardar().then(function () { PP.avisar('Nota borrada'); PP.ir('diario', null, { raiz: true }); })
            .catch(function () { diario = antes; PP.avisar('No se pudo borrar. Prueba otra vez.'); PP.repintar(); });
        }
      };
      $('#form-d').onsubmit = function (ev) {
        ev.preventDefault(); leer();
        if (!e.tipo) {
          params.faltaTipo = true;
          $('#d-tipo-error').hidden = false;
          $('#d-tipo-t').scrollIntoView({ block: 'center' });
          main.querySelector('.tipo-op').focus({ preventScroll: true });
          return;
        }
        if (e.tipo === 'bueno') { e.intensidad = 0; e.duracion = ''; e.causas = []; e.ayudo = []; }
        delete e.ejemplo;
        var antes = diario.slice(), k = diario.findIndex(function (x) { return x.id === e.id; });
        var nueva = k < 0;
        if (k >= 0) diario[k] = e; else diario.push(e);
        // Solo salimos del formulario cuando de verdad quedó guardado
        guardar().then(function () {
          if (nueva && PP.evento) PP.evento('diario_nota_guardada');
          PP.avisar('Guardado en el diario');
          PP.ir('diario', null, { raiz: true });
        }).catch(function () {
          diario = antes;
          PP.avisar('No se pudo guardar. Revisa que haya espacio en el teléfono y prueba otra vez.');
        });
      };
    }
  };
})(window.PP);
