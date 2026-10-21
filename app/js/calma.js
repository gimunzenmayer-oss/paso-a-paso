/* =========================================================
   calma.js — MÓDULO 4: Kit de calma
   ---------------------------------------------------------
   Herramientas para regularse, pensadas para usarlas ANTES
   de que el malestar crezca (o después, para volver a la calma):
   - Respirar: un círculo que crece (coger aire) y encoge (soltarlo).
   - Contar hasta 10: un número grande que avanza con cada toque.
   - Lo que me ayuda: botones que dicen lo que necesita.
   - ¿Cómo me siento?: un termómetro de 5 colores con palabras.
   - Música para calmarse: sonidos y melodías que la propia app
     crea (sin internet, sin descargar nada, sin derechos de autor).
   1) Pantalla del adulto: velocidad de la respiración y
      editar "lo que me ayuda".
   2) Vista del niño.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  function conf() { return PP.estado.calma; }

  var OPCIONES = [
    { id: 'respirar', texto: 'Respirar', picto: '🌬️', color: 'niebla' },
    { id: 'contar', texto: 'Contar hasta 10', picto: '🔢', color: 'salvia' },
    { id: 'ayuda', texto: 'Lo que me ayuda', picto: '🤗', color: 'melocoton' },
    { id: 'siento', texto: '¿Cómo me siento?', picto: '🌡️', color: 'arena' },
    { id: 'musica', texto: 'Música', picto: '🎵', color: 'lavanda' }
  ];

  // Termómetro de emociones: de muy tranquilo (1) a necesito ayuda (5)
  var NIVELES = [
    { n: 1, cara: '😌', texto: 'Estoy tranquilo', color: 'salvia' },
    { n: 2, cara: '🙂', texto: 'Estoy bien', color: 'niebla' },
    { n: 3, cara: '😐', texto: 'Estoy un poco nervioso', color: 'arena' },
    { n: 4, cara: '😣', texto: 'Estoy muy nervioso', color: 'melocoton' },
    { n: 5, cara: '😫', texto: 'Necesito ayuda', color: 'lavanda' }
  ];

  // =====================================================
  // MÚSICA PARA CALMARSE (la crea el propio teléfono)
  // =====================================================
  // Sonidos suaves y constantes (lluvia, mar, ruido suave) y
  // melodías lentas: una nana de Brahms (dominio público) y
  // campanitas que suenan de vez en cuando.
  var SONIDOS = [
    { id: 'lluvia', texto: 'Lluvia', picto: '🌧️' },
    { id: 'mar', texto: 'Olas del mar', picto: '🌊' },
    { id: 'ruido', texto: 'Ruido suave', picto: '🌫️' },
    { id: 'nana', texto: 'Nana', picto: '🌙' },
    { id: 'campanitas', texto: 'Campanitas', picto: '🎐' }
  ];

  var musica = { ctx: null, general: null, partes: [], tic: null, sonando: null, volumen: 0.5 };

  function nota(nombre) {
    // 'C4' → frecuencia. Solo usamos notas naturales y Bb.
    var tabla = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, Bb: 1, B: 2 };
    var m = /^([A-G]b?)(\d)$/.exec(nombre);
    return 440 * Math.pow(2, (tabla[m[1]] + (+m[2] - 4) * 12) / 12);
  }

  function ruido(ctx, tipo) {
    // Un par de segundos de ruido que se repite sin cortes
    var largo = ctx.sampleRate * 3, buf = ctx.createBuffer(1, largo, ctx.sampleRate), d = buf.getChannelData(0), ult = 0;
    for (var i = 0; i < largo; i++) {
      var blanco = Math.random() * 2 - 1;
      if (tipo === 'marron') { ult = (ult + 0.02 * blanco) / 1.02; d[i] = ult * 3.5; }
      else d[i] = blanco * 0.5;
    }
    var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    return src;
  }

  function filtro(ctx, tipo, f) { var x = ctx.createBiquadFilter(); x.type = tipo; x.frequency.value = f; return x; }

  function tocarNota(f, cuando, dura, vol) {
    var ctx = musica.ctx, o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f;
    o2.type = 'triangle'; o2.frequency.value = f * 2; // un armónico muy flojito, suena más cálido
    var g2 = ctx.createGain(); g2.gain.value = 0.08;
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(musica.general);
    g.gain.setValueAtTime(0.0001, cuando);
    g.gain.exponentialRampToValueAtTime(vol, cuando + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, cuando + dura);
    o.start(cuando); o2.start(cuando); o.stop(cuando + dura + 0.05); o2.stop(cuando + dura + 0.05);
  }

  // Nana de Brahms (Wiegenlied, 1868, dominio público), muy despacio
  var NANA = [['E4', .5], ['E4', .5], ['G4', 2], ['E4', .5], ['E4', .5], ['G4', 2], ['E4', .5], ['G4', .5], ['C5', 1], ['B4', 1.5], ['A4', .5], ['A4', 1], ['G4', 2],
    ['D4', .5], ['E4', .5], ['F4', 1], ['D4', 1], ['D4', .5], ['E4', .5], ['F4', 2], ['D4', .5], ['F4', .5], ['B4', .5], ['A4', .5], ['G4', 1], ['B4', 1], ['C5', 2],
    ['C4', .5], ['C4', .5], ['C5', 2], ['A4', .5], ['F4', .5], ['G4', 2], ['E4', .5], ['C4', .5], ['F4', 1], ['G4', 1], ['A4', 1], ['G4', 2],
    ['C4', .5], ['C4', .5], ['C5', 2], ['A4', .5], ['F4', .5], ['G4', 2], ['E4', .5], ['C4', .5], ['F4', 1], ['E4', .5], ['D4', .5], ['C4', 3]];
  var PULSO = 0.72; // segundos por tiempo: lento

  function empezarSonido(id) {
    pararMusica(true);
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { PP.avisar('Este navegador no puede crear sonidos.'); return false; }
    if (!musica.ctx) musica.ctx = new AC();
    var ctx = musica.ctx; if (ctx.state === 'suspended') ctx.resume();
    musica.general = ctx.createGain();
    musica.general.gain.setValueAtTime(0.0001, ctx.currentTime);
    musica.general.gain.exponentialRampToValueAtTime(Math.max(0.0002, musica.volumen), ctx.currentTime + 1.5); // entra poco a poco
    musica.general.connect(ctx.destination);
    musica.sonando = id;

    if (id === 'lluvia' || id === 'mar' || id === 'ruido') {
      var src = ruido(ctx, id === 'lluvia' ? 'blanco' : 'marron'), g = ctx.createGain(), cadena;
      if (id === 'lluvia') { cadena = [filtro(ctx, 'highpass', 400), filtro(ctx, 'lowpass', 2500)]; g.gain.value = 0.35; }
      else if (id === 'mar') { cadena = [filtro(ctx, 'lowpass', 700)]; g.gain.value = 0.5;
        // Las olas: el volumen sube y baja muy despacio
        var ola = ctx.createOscillator(), prof = ctx.createGain(); ola.frequency.value = 0.11; prof.gain.value = 0.35;
        ola.connect(prof); prof.connect(g.gain); ola.start(); musica.partes.push(ola); }
      else { cadena = [filtro(ctx, 'lowpass', 500)]; g.gain.value = 0.55; }
      var ant = src; cadena.forEach(function (f) { ant.connect(f); ant = f; }); ant.connect(g); g.connect(musica.general);
      src.start(); musica.partes.push(src);
    }
    if (id === 'nana') {
      var programar = function () {
        var t = ctx.currentTime + 0.2;
        NANA.forEach(function (n) { tocarNota(nota(n[0]), t, n[1] * PULSO * 1.6, 0.22); t += n[1] * PULSO; });
        return (t - ctx.currentTime + 1.5) * 1000;
      };
      var vuelta = function () { if (musica.sonando !== 'nana') return; musica.tic = setTimeout(vuelta, programar()); };
      vuelta();
    }
    if (id === 'campanitas') {
      var escala = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'];
      var sonar = function () {
        if (musica.sonando !== 'campanitas') return;
        tocarNota(nota(escala[Math.floor(Math.random() * escala.length)]), ctx.currentTime + 0.05, 4, 0.12);
        musica.tic = setTimeout(sonar, 1200 + Math.random() * 2200);
      };
      sonar();
    }
    return true;
  }

  function pararMusica(rapido) {
    clearTimeout(musica.tic); clearTimeout(musica.apagar);
    musica.sonando = null;
    var partes = musica.partes, general = musica.general;
    musica.partes = []; musica.general = null;
    if (!general) return;
    var ctx = musica.ctx, t = ctx.currentTime, dura = rapido ? 0.2 : 1.5;
    try { general.gain.cancelScheduledValues(t); general.gain.setValueAtTime(general.gain.value, t); general.gain.exponentialRampToValueAtTime(0.0001, t + dura); } catch (e) { }
    setTimeout(function () { partes.forEach(function (p) { try { p.stop(); } catch (e) { } }); try { general.disconnect(); } catch (e) { } }, dura * 1000 + 100);
  }
  PP.pararMusica = pararMusica;

  // =====================================================
  // 1) PANTALLA DEL ADULTO
  // =====================================================
  PP.pantallas.calma = {
    titulo: 'Kit de calma', seccion: 'preparar',
    pintar: function (main) {
      var c = conf(), nombre = PP.esc(PP.estado.perfil.nombre);
      main.innerHTML =
        '<p class="intro">Herramientas para que ' + nombre + ' se regule. Funcionan mejor si las practicáis en momentos tranquilos, para que las conozca antes de necesitarlas.</p>' +
        '<button class="btn principal grande ancho" data-dar>Dar el kit de calma a ' + nombre + '</button>' +
        '<h2 class="seccion-t">Respiración</h2>' +
        '<fieldset class="segmentado tres"><legend class="sr">Segundos para coger y soltar el aire</legend>' +
        [3, 4, 5].map(function (s) { return '<label><input type="radio" name="resp" value="' + s + '"' + (c.respirar === s ? ' checked' : '') + '><span>' + s + ' segundos</span></label>'; }).join('') +
        '</fieldset>' +
        '<h2 class="seccion-t">Lo que le ayuda <span class="suave">(' + c.cosas.length + ')</span></h2>' +
        '<p class="suave">Botones que dicen en voz alta lo que necesita. Pon lo que de verdad le funciona.</p>' +
        '<ul class="pasos-editor">' + c.cosas.map(function (x, i) {
          return '<li><button type="button" class="picto-boton" data-elegir="' + i + '" aria-label="Cambiar la imagen">' + PP.picto(x, 'picto-s') + '</button>' +
            '<input value="' + PP.esc(x.texto) + '" data-texto="' + i + '" aria-label="Frase del botón ' + (i + 1) + '">' +
            '<span class="mini-acciones"><button type="button" class="icono" data-quitar="' + i + '" aria-label="Quitar">✕</button></span></li>';
        }).join('') + '</ul>' +
        '<button class="btn ancho" data-anadir>+ Añadir algo que le ayuda</button>' +
        '<h2 class="seccion-t">Música para calmarse</h2>' +
        '<p class="suave">Lluvia, olas del mar, ruido suave, una nana y campanitas. Los crea el propio teléfono: no hace falta internet ni instalar nada. Prueba cuál le gusta; a muchos niños les ayuda un sonido constante y bajito cuando hay demasiado ruido alrededor.</p>' +
        '<div id="hoja" class="hoja" hidden></div>';

      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.hasAttribute('data-dar')) PP.abrirCalma();
        if (b.dataset.quitar != null) { c.cosas.splice(+b.dataset.quitar, 1); PP.persistir(); PP.repintar(); }
        if (b.dataset.elegir != null || b.hasAttribute('data-anadir')) {
          var i = b.dataset.elegir != null ? +b.dataset.elegir : -1;
          PP.elegirPicto($('#hoja'), function (picto, texto, foto) {
            if (i < 0) c.cosas.push({ id: PP.nuevoId(), picto: picto || '⭐', texto: texto || 'Lo que me ayuda', foto: foto || null });
            else { var x = c.cosas[i]; if (picto) x.picto = picto; x.foto = foto || null; if (texto && !x.texto) x.texto = texto; }
            PP.persistir(); PP.repintar();
          });
        }
      };
      main.onchange = function (e) {
        if (e.target.name === 'resp') { c.respirar = +e.target.value; PP.persistir(); PP.avisar('Guardado'); }
        if (e.target.dataset.texto != null) { c.cosas[+e.target.dataset.texto].texto = e.target.value.trim() || 'Me ayuda'; PP.persistir(); PP.avisar('Guardado'); }
      };
    }
  };

  // =====================================================
  // 2) VISTA DEL NIÑO
  // =====================================================
  PP.abrirCalma = function (que) {
    if (PP.evento) PP.evento('calma_usada');
    if (que === 'respirar') return respirar();
    if (que === 'contar') return contar();
    if (que === 'ayuda') return ayuda();
    if (que === 'siento') return siento();
    if (que === 'musica') return musicaNino();
    PP.entrarModoNino(function (cont) {
      cont.innerHTML = '<div class="nino-marco"><h1 class="titulo-nino">Calma</h1>' +
        '<div class="rejilla-espacio">' + OPCIONES.map(function (o) {
          return '<button class="boton-espacio cat-' + o.color + '" data-que="' + o.id + '">' + PP.picto(o, 'picto-espacio') + '<span>' + o.texto + '</span></button>';
        }).join('') + '</div></div>';
      cont.onclick = function (e) { var t = e.target.closest('[data-que]'); if (t) PP.abrirCalma(t.dataset.que); };
    });
  };

  function volver() { return '<button class="btn grande ancho volver-nino" data-volver>← Volver a Calma</button>'; }
  function alVolver(cont, fn) {
    cont.onclick = function (e) {
      if (e.target.closest('[data-volver]')) { PP.abrirCalma(); return; }
      fn(e);
    };
  }

  // --- Respirar ---
  function respirar() {
    var seg = conf().respirar * 1000, vueltas = 0, MAX = 6, reloj = null;
    PP.entrarModoNino(function (cont) {
      cont.innerHTML = '<div class="nino-marco"><h1 class="titulo-nino">Respirar</h1>' +
        '<div class="burbuja-caja"><div class="burbuja" style="--dura:' + seg + 'ms"></div></div>' +
        '<p class="resp-texto" aria-live="polite">Toca para empezar</p>' +
        '<div class="puntos-resp" aria-hidden="true">' + Array(MAX).fill('<span></span>').join('') + '</div>' +
        '<button class="btn-hecho" data-empezar>Empezar</button>' + volver() + '</div>';
      var burbuja = $('.burbuja', cont), texto = $('.resp-texto', cont);
      function fase(dentro) {
        burbuja.classList.toggle('grande', dentro);
        texto.textContent = dentro ? 'Coge aire…' : 'Suelta el aire…';
        if (vueltas < 2) PP.decir(dentro ? 'Coge aire' : 'Suéltalo');
        reloj = setTimeout(function () {
          if (!dentro) {
            vueltas++;
            cont.querySelectorAll('.puntos-resp span').forEach(function (s, i) { s.classList.toggle('lleno', i < vueltas); });
            if (vueltas >= MAX) { texto.textContent = '¡Muy bien! Lo hiciste.'; PP.decir('Muy bien'); $('[data-empezar]', cont).hidden = false; $('[data-empezar]', cont).textContent = 'Otra vez'; return; }
          }
          fase(!dentro);
        }, seg);
      }
      alVolver(cont, function (e) {
        if (e.target.closest('[data-empezar]')) { vueltas = 0; e.target.closest('[data-empezar]').hidden = true; cont.querySelectorAll('.puntos-resp span').forEach(function (s) { s.classList.remove('lleno'); }); fase(true); }
      });
      PP.alCambiarPantallaNino(function () { clearTimeout(reloj); });
    });
  }

  // --- Contar hasta 10 ---
  function contar() {
    var n = 0;
    PP.entrarModoNino(function (cont) {
      cont.innerHTML = '<div class="nino-marco"><h1 class="titulo-nino">Contar hasta 10</h1>' +
        '<button class="numero-grande num" data-contar aria-label="Toca para contar">1</button>' +
        '<p class="resp-texto" aria-live="polite">Toca el número y cuenta despacio</p>' + volver() + '</div>';
      var btn = $('[data-contar]', cont), texto = $('.resp-texto', cont);
      btn.textContent = '·';
      alVolver(cont, function (e) {
        if (!e.target.closest('[data-contar]')) return;
        n = n >= 10 ? 1 : n + 1;
        btn.textContent = n;
        PP.decir(String(n), { siempre: true });
        texto.textContent = n === 10 ? '¡Muy bien! Toca para empezar otra vez.' : 'Toca para seguir';
      });
    });
  }

  // --- Lo que me ayuda ---
  function ayuda() {
    PP.entrarModoNino(function (cont) {
      cont.innerHTML = '<div class="nino-marco"><h1 class="titulo-nino">Lo que me ayuda</h1>' +
        '<div class="rejilla-saac" style="--cols:2">' + conf().cosas.map(function (x) {
          return '<button class="boton-saac cat-melocoton" data-id="' + x.id + '">' + PP.picto(x, 'picto-saac') + '<span class="saac-texto">' + PP.esc(x.texto) + '</span></button>';
        }).join('') + '</div>' + volver() + '</div>';
      alVolver(cont, function (e) {
        var t = e.target.closest('[data-id]'); if (!t) return;
        var x = conf().cosas.find(function (c) { return c.id === t.dataset.id; });
        PP.decirItem(x, { siempre: true }); // es su forma de pedirlo: la voz suena siempre
        t.classList.add('pulsado'); setTimeout(function () { t.classList.remove('pulsado'); }, 700);
      });
    });
  }

  // --- ¿Cómo me siento? ---
  function siento() {
    PP.entrarModoNino(function (cont) {
      cont.innerHTML = '<div class="nino-marco"><h1 class="titulo-nino">¿Cómo me siento?</h1>' +
        '<div class="termometro">' + NIVELES.slice().reverse().map(function (l) {
          return '<button class="nivel cat-' + l.color + '" data-nivel="' + l.n + '"><span class="cara" aria-hidden="true">' + l.cara + '</span><span>' + l.texto + '</span></button>';
        }).join('') + '</div>' +
        '<div class="sugerencia" aria-live="polite"></div>' + volver() + '</div>';
      alVolver(cont, function (e) {
        var q = e.target.closest('[data-que]'); if (q) { PP.abrirCalma(q.dataset.que); return; }
        var t = e.target.closest('[data-nivel]'); if (!t) return;
        var l = NIVELES[+t.dataset.nivel - 1];
        PP.decir(l.texto, { siempre: true });
        cont.querySelectorAll('.nivel').forEach(function (b) { b.classList.toggle('activa', b === t); });
        $('.sugerencia', cont).innerHTML = l.n >= 3
          ? '<p class="etiqueta-nino">¿Probamos?</p><div class="fila-botones"><button class="btn grande" data-que="respirar">🌬️ Respirar</button><button class="btn grande" data-que="ayuda">🤗 Lo que me ayuda</button></div>'
          : '';
      });
    });
  }

  // --- Música ---
  function musicaNino() {
    PP.entrarModoNino(function (cont) {
      function dibujar() {
        cont.innerHTML = '<div class="nino-marco"><h1 class="titulo-nino">Música</h1>' +
          '<div class="rejilla-espacio">' + SONIDOS.map(function (s) {
            var on = musica.sonando === s.id;
            return '<button class="boton-espacio cat-lavanda' + (on ? ' sonando' : '') + '" data-sonido="' + s.id + '" aria-pressed="' + on + '"><span class="picto-espacio" aria-hidden="true">' + s.picto + '</span><span>' + s.texto + (on ? ' · sonando' : '') + '</span></button>';
          }).join('') + '</div>' +
          '<label class="campo volumen" for="vol">Volumen<input id="vol" type="range" min="0.05" max="1" step="0.05" value="' + musica.volumen + '"></label>' +
          '<fieldset class="segmentado tres"><legend class="campo-leyenda">Apagar sola</legend>' +
          [[0, 'No'], [10, '10 min'], [20, '20 min']].map(function (o) {
            return '<label><input type="radio" name="apagar" value="' + o[0] + '"' + ((musica.minutos || 0) === o[0] ? ' checked' : '') + '><span>' + o[1] + '</span></label>';
          }).join('') + '</fieldset>' +
          (musica.sonando ? '<button class="btn-hecho otra" data-parar>Parar la música</button>' : '') +
          volver() + '</div>';
      }
      function programarApagado() {
        clearTimeout(musica.apagar);
        if (musica.minutos && musica.sonando) musica.apagar = setTimeout(function () { pararMusica(); if ($('[data-sonido]', cont)) dibujar(); }, musica.minutos * 60000);
      }
      dibujar();
      alVolver(cont, function (e) {
        var s = e.target.closest('[data-sonido]');
        if (s) { if (musica.sonando === s.dataset.sonido) pararMusica(); else { empezarSonido(s.dataset.sonido); programarApagado(); } dibujar(); }
        if (e.target.closest('[data-parar]')) { pararMusica(); dibujar(); }
      });
      cont.oninput = function (e) {
        if (e.target.id === 'vol') { musica.volumen = +e.target.value; if (musica.general) musica.general.gain.setTargetAtTime(musica.volumen, musica.ctx.currentTime, 0.1); }
      };
      cont.onchange = function (e) { if (e.target.name === 'apagar') { musica.minutos = +e.target.value; programarApagado(); } };
      // La música se para al salir de esta pantalla (para no dejarla sonando sin querer)
      PP.alCambiarPantallaNino(function () { pararMusica(); });
    });
  }
})(window.PP);
