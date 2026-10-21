/* =========================================================
   informe.js — MÓDULO 8: Informe para profesionales
   ---------------------------------------------------------
   Junta en una página lo más útil para llevar al pediatra,
   al terapeuta o al colegio: rutinas, comunicación, diario
   y logros de un periodo. Se imprime o se guarda como PDF
   con la opción "Imprimir" del teléfono u ordenador.
   Lo crea el propio teléfono: no se envía a ningún sitio.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var PERIODOS = [[7, '7 días'], [30, '30 días'], [90, '3 meses']];
  var INT = ['', 'muy leve', 'leve', 'media', 'fuerte', 'muy fuerte'];

  function fecha(f) { return new Date(f.length > 10 ? f : f + 'T12:00').toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function fechaCorta(f) { return new Date(f.length > 10 ? f : f + 'T12:00').toLocaleDateString('es', { day: 'numeric', month: 'short' }); }

  PP.pantallas.informe = {
    titulo: 'Informe', seccion: 'mas',
    pintar: function (main, params) {
      if (!PP.diarioAbierto()) { PP.diarioCerrado(main, 'El informe usa tu diario privado'); return; }
      var p = PP.estado.perfil;
      params.dias = params.dias || 30;
      if (params.notas == null) params.notas = false;
      var desde = PP.diasAtras(params.dias - 1), hoy = PP.hoy();

      // --- Datos del periodo ---
      var estrellas = (PP.estado.estrellas || []).filter(function (e) { return e.fecha >= desde; });
      var porRutina = {}; estrellas.forEach(function (e) { porRutina[e.nombre] = (porRutina[e.nombre] || 0) + 1; });
      var diasConRutina = {}; estrellas.forEach(function (e) { diasConRutina[e.fecha] = 1; });
      var palabras = {};
      Object.keys(PP.estado.uso.tablero).forEach(function (d) {
        if (d < desde) return;
        var u = PP.estado.uso.tablero[d]; Object.keys(u).forEach(function (t) { palabras[t] = (palabras[t] || 0) + u[t]; });
      });
      var topPalabras = Object.keys(palabras).map(function (k) { return [k, palabras[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 10);
      var entradas = PP.entradasDiario().filter(function (e) { return e.fecha.slice(0, 10) >= desde; }).sort(function (a, b) { return a.fecha.localeCompare(b.fecha); });
      var dificiles = entradas.filter(PP.esDificil);
      var porTipo = {}; dificiles.forEach(function (e) { var t = PP.tipoDe(e.tipo).texto; porTipo[t] = (porTipo[t] || 0) + 1; });
      var media = dificiles.length ? (dificiles.reduce(function (s, e) { return s + (e.intensidad || 0); }, 0) / dificiles.length) : 0;
      var franjas = { 'Mañana (6-12 h)': 0, 'Mediodía (12-16 h)': 0, 'Tarde (16-20 h)': 0, 'Noche (20-6 h)': 0 };
      dificiles.forEach(function (e) {
        var h = +e.fecha.slice(11, 13);
        var k = h >= 6 && h < 12 ? 'Mañana (6-12 h)' : h >= 12 && h < 16 ? 'Mediodía (12-16 h)' : h >= 16 && h < 20 ? 'Tarde (16-20 h)' : 'Noche (20-6 h)';
        franjas[k]++;
      });
      var logros = PP.estado.logros.filter(function (l) { return l.fecha >= desde; }).sort(function (a, b) { return a.fecha.localeCompare(b.fecha); });
      var ejemplos = entradas.some(function (e) { return e.ejemplo; });

      var tabla = function (filas, cab, vacio) {
        if (!filas.length) return '<p class="suave">' + (vacio || 'Sin datos en este periodo.') + '</p>';
        // Si la última columna son números, va alineada a la derecha y con ancho fijo
        var cifra = filas.every(function (f) { return /^\d+$/.test(f[f.length - 1]); });
        return '<table class="tabla' + (cifra ? ' cifra' : '') + '"><thead><tr>' + cab.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
          filas.map(function (f) { return '<tr>' + f.map(function (c) { return '<td>' + PP.esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
      };

      main.innerHTML =
        '<section class="tarjeta bloque no-imprimir">' +
        '<p>Elige el periodo y toca "Imprimir". En la ventana que aparece puedes elegir <strong>Guardar como PDF</strong> para enviarlo o llevarlo en el celular.</p>' +
        '<fieldset class="segmentado tres"><legend class="campo-leyenda">Periodo</legend>' + PERIODOS.map(function (x) {
          return '<label><input type="radio" name="per" value="' + x[0] + '"' + (params.dias === x[0] ? ' checked' : '') + '><span>' + x[1] + '</span></label>';
        }).join('') + '</fieldset>' +
        PP.interruptor('inf-notas', 'Incluir las notas del diario', params.notas ? 'Activado: se incluyen las notas escritas' : 'Desactivado: solo se ven los números', params.notas) +
        (ejemplos ? '<div class="aviso-legal fila"><span class="crece">Ojo: el diario aún tiene entradas de ejemplo.</span><button class="btn" data-sin-ejemplos>Borrarlas</button></div>' : '') +
        '<button class="btn principal grande ancho" data-imprimir>Imprimir o guardar como PDF</button></section>' +

        '<article class="informe" aria-label="Vista previa del informe">' +
        '<header><h2>Informe de seguimiento · ' + PP.esc(p.nombre) + '</h2>' +
        '<p>' + p.edad + ' años · Del ' + fecha(desde) + ' al ' + fecha(hoy) + '</p>' +
        '<p class="suave">Registro hecho por la familia con la app Paso a Paso. Es información de apoyo, no un diagnóstico.</p></header>' +

        '<h3>Rutinas</h3>' +
        '<p>Rutinas terminadas enteras: <strong>' + estrellas.length + '</strong>, en <strong>' + Object.keys(diasConRutina).length + '</strong> de ' + params.dias + ' días.</p>' +
        tabla(Object.keys(porRutina).map(function (k) { return [k, String(porRutina[k])]; }), ['Rutina', 'Veces']) +

        '<h3>Comunicación (tablero)</h3>' +
        tabla(topPalabras.map(function (x) { return [x[0], String(x[1])]; }), ['Lo que más dijo', 'Veces'], 'Todavía no se usó el tablero en este periodo. Cuando ' + PP.esc(p.nombre) + ' toque sus botones, aquí verás lo que más dijo.') +

        '<h3>Diario de la familia</h3>' +
        '<p>Momentos difíciles: <strong>' + dificiles.length + '</strong>' + (dificiles.length ? ' · intensidad media ' + media.toFixed(1).replace('.', ',') + ' de 5' : '') +
        ' · Buenos momentos anotados: <strong>' + (entradas.length - dificiles.length) + '</strong></p>' +
        tabla(Object.keys(porTipo).map(function (k) { return [k, String(porTipo[k])]; }), ['Tipo', 'Veces']) +
        tabla(Object.keys(franjas).filter(function (k) { return franjas[k]; }).map(function (k) { return [k, String(franjas[k])]; }), ['Momento del día', 'Veces']) +
        (params.dias === 7 && PP.barrasDias ? '<h4>Momentos difíciles por día</h4>' + PP.barrasDias(entradas, 7) : '') +
        '<h4>Posibles desencadenantes</h4>' + PP.barrasRanking(PP.ranking(dificiles, 'causas', 5)) +
        '<h4>Lo que ayudó</h4>' + PP.barrasRanking(PP.ranking(dificiles, 'ayudo', 5)) +
        (params.notas ? '<h4>Notas</h4>' + tabla(entradas.map(function (e) {
          return [new Date(e.fecha).toLocaleString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), PP.tipoDe(e.tipo).texto + (e.intensidad ? ' (' + INT[e.intensidad] + ')' : ''), e.nota || '—'];
        }), ['Cuándo', 'Qué', 'Nota']) : '') +

        '<h3>Logros</h3>' +
        tabla(logros.map(function (l) { return [fechaCorta(l.fecha), l.texto]; }), ['Fecha', 'Logro']) +

        '<h3>Comentarios de la familia</h3>' +
        '<label class="sr" for="inf-com">Comentarios de la familia</label><textarea id="inf-com" class="comentarios" rows="4" placeholder="Escribe aquí lo que quieras contar o preguntar al profesional…">' + PP.esc(params.comentarios || '') + '</textarea>' +
        '<p class="pie-informe">Generado el ' + fecha(hoy) + ' con Paso a Paso. Los datos se guardan solo en el dispositivo de la familia.</p>' +
        '</article>';

      main.onchange = function (e) {
        if (e.target.name === 'per') { params.dias = +e.target.value; params.comentarios = $('#inf-com').value; PP.repintar(); }
        if (e.target.id === 'inf-notas') { params.notas = e.target.checked; params.comentarios = $('#inf-com').value; PP.repintar(); }
      };
      main.oninput = function (e) { if (e.target.id === 'inf-com') params.comentarios = e.target.value; };
      main.onclick = function (e) {
        if (e.target.closest('[data-sin-ejemplos]')) {
          e.target.closest('.aviso-legal').innerHTML = '<span class="crece"><strong>¿Borrar las entradas de ejemplo?</strong> Tus notas reales no se tocan.</span><button class="btn peligro" data-sin-ejemplos-si>Sí, borrar</button><button class="btn" data-sin-ejemplos-no>No</button>';
          return;
        }
        if (e.target.closest('[data-sin-ejemplos-si]')) { params.comentarios = $('#inf-com').value; PP.borrarEjemplosDiario(); return; }
        if (e.target.closest('[data-sin-ejemplos-no]')) { params.comentarios = $('#inf-com').value; PP.repintar(); return; }
        if (!e.target.closest('[data-imprimir]')) return;
        try { window.print(); } catch (x) { PP.avisar('Usa la opción Imprimir del navegador.'); }
      };
    }
  };
})(window.PP);
