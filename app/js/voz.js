/* =========================================================
   voz.js — leer en voz alta y sonido suave
   ---------------------------------------------------------
   Usa la voz que ya trae el teléfono (Web Speech API).
   - 'espana' busca una voz es-ES
   - 'latino' busca es-MX, es-US, es-419, es-AR o es-CO
   Para que suene más humana:
   - Elige automáticamente la voz más natural del teléfono
     (las "neuronales", "naturales" o "mejoradas").
   - El adulto puede elegir otra voz y la velocidad en Ajustes.
   - Y lo más humano de todo: GRABAR SU PROPIA VOZ en cada
     botón o paso. Si hay grabación, suena la grabación.
   Nunca suena nada si el adulto no lo ha activado.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var LATINO = ['es-MX', 'es-US', 'es-419', 'es-AR', 'es-CO', 'es-CL', 'es-PE'];

  // Puntúa cada voz: cuanto más "humana" suele sonar, más puntos.
  function puntos(v, acento) {
    var n = v.name.toLowerCase(), l = v.lang.replace('_', '-').toLowerCase(), p = 0;
    if (/natural|neural|online|premium|enhanced|mejorada|siri/.test(n)) p += 10; // voces de alta calidad
    if (/google/.test(n)) p += 6;
    if (v.localService === false) p += 2;           // las voces en la nube suelen ser más naturales
    if (/compact|eloquence|espeak/.test(n)) p -= 8; // voces robóticas
    var buscadas = acento === 'latino' ? LATINO : ['es-ES'];
    var i = buscadas.map(function (b) { return b.toLowerCase(); }).indexOf(l);
    if (i >= 0) p += 20 - i;                         // el acento elegido manda
    return p;
  }

  // Todas las voces en español, de la más natural a la menos
  PP.vocesDisponibles = function (acento) {
    if (!('speechSynthesis' in window)) return [];
    return speechSynthesis.getVoices()
      .filter(function (v) { return /^es/i.test(v.lang); })
      .sort(function (a, b) { return puntos(b, acento) - puntos(a, acento); });
  };

  function elegirVoz(p) {
    var voces = PP.vocesDisponibles(p.acento);
    if (!voces.length) return null;
    // Si el adulto eligió una voz concreta en Ajustes, usamos esa
    var elegida = p.vozNombre && voces.find(function (v) { return v.name === p.vozNombre; });
    return elegida || voces[0];
  }

  // Decir una frase. Corta la anterior para no amontonar voces.
  // opciones.siempre = true → habla aunque esté el modo calma o la lectura
  // desactivada (lo usa el tablero: ahí la voz ES la forma de comunicarse).
  PP.decir = function (texto, opciones) {
    var p = PP.estado && PP.estado.perfil;
    var siempre = opciones && opciones.siempre;
    if (!p || (!siempre && (!p.leerEnVoz || p.modoCalma))) return;
    if (!('speechSynthesis' in window)) return;
    try {
      pararAudio();
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(texto);
      var voz = elegirVoz(p);
      if (voz) { u.voice = voz; u.lang = voz.lang; } else { u.lang = p.acento === 'latino' ? 'es-MX' : 'es-ES'; }
      u.rate = p.velocidad || 0.9;   // un poco más despacio de lo normal
      u.pitch = 1.05;                 // un pelín más cálida
      if (opciones && opciones.alTerminar) u.onend = u.onerror = opciones.alTerminar;
      speechSynthesis.speak(u);
      return true;
    } catch (e) { /* si falla la voz, la app sigue igual */ }
  };

  // Decir un botón o un paso: si tiene grabación propia, suena la grabación;
  // si no, la voz del teléfono lee su texto.
  var audioActual = null;
  function pararAudio() { try { if (audioActual) { audioActual.pause(); audioActual = null; } } catch (e) { } }
  PP.decirItem = function (item, opciones, textoExtra) {
    var p = PP.estado && PP.estado.perfil;
    var siempre = opciones && opciones.siempre;
    if (!p || (!siempre && (!p.leerEnVoz || p.modoCalma))) return;
    if (item && item.audio) {
      try {
        speechSynthesis && speechSynthesis.cancel();
        pararAudio();
        audioActual = new Audio(item.audio);
        audioActual.play().catch(function () { PP.decir(item.texto, opciones); });
        return;
      } catch (e) { }
    }
    PP.decir((textoExtra || '') + (item ? item.texto : ''), opciones);
  };

  // ---------- Grabar la voz de la familia ----------
  // Graba hasta 6 segundos con el micrófono y devuelve el audio
  // como texto (para guardarlo en el teléfono junto al botón).
  var grabadora = null;
  PP.grabando = function () { return !!grabadora; };
  PP.grabarVoz = function (alTerminar) {
    if (grabadora) { grabadora.stop(); return; }   // segundo toque = parar
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      PP.avisar('Este navegador no permite grabar. Funcionará en la app instalada.');
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (flujo) {
      var trozos = [];
      grabadora = new MediaRecorder(flujo);
      grabadora.ondataavailable = function (e) { if (e.data.size) trozos.push(e.data); };
      grabadora.onstop = function () {
        flujo.getTracks().forEach(function (t) { t.stop(); });
        grabadora = null;
        var lector = new FileReader();
        lector.onload = function () { alTerminar(lector.result); };
        lector.readAsDataURL(new Blob(trozos, { type: trozos[0] ? trozos[0].type : 'audio/webm' }));
      };
      grabadora.start();
      PP.avisar('Grabando… toca otra vez para parar');
      setTimeout(function () { if (grabadora) grabadora.stop(); }, 6000);
    }).catch(function () {
      PP.avisar('No se pudo usar el micrófono. Revisa el permiso o prueba en la app instalada.');
    });
  };

  // Un "ding" muy suave (dos notas bajitas), solo si el sonido está activado.
  var ctx = null;
  PP.sonidoSuave = function () {
    var p = PP.estado && PP.estado.perfil;
    if (!p || !p.sonido || p.modoCalma) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      [523.25, 659.25].forEach(function (frec, i) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = frec;
        var t = ctx.currentTime + i * 0.18;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.08, t + 0.05); // volumen bajo
        g.gain.linearRampToValueAtTime(0, t + 0.5);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.55);
      });
    } catch (e) { }
  };

  // Algunos navegadores cargan las voces tarde; así las tenemos listas.
  if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () { }; } catch (e) { } }
})(window.PP);
