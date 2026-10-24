/* =========================================================
   app.js — el "director" de la app
   ---------------------------------------------------------
   Se encarga de:
   1) Cargar los datos guardados (o los de ejemplo de Mateo).
   2) Mostrar la pantalla que toca dentro del marco común
      (barra de arriba + contenido + menú de abajo).
   3) El MODO NIÑO: pantalla completa sin menú, que solo se
      cierra manteniendo pulsado el candado y escribiendo el PIN.
   4) Pantallas de la familia: Inicio, Preparar, Más y Ajustes.
   Cada módulo (agenda, tablero...) añade sus pantallas a
   PP.pantallas desde su propio archivo.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  PP.pantallas = {};      // aquí cada módulo registra sus pantallas
  var historial = [];     // para el botón "Atrás"
  var $ = function (sel) { return document.querySelector(sel); };

  // Evita que un texto escrito por el usuario se interprete como código
  PP.esc = function (t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // Dibuja el pictograma de un paso: la foto si la hay, si no el símbolo
  // Orden: 1) foto propia de la familia, 2) foto realista de ejemplo
  // (si en Ajustes están elegidas las fotos), 3) el símbolo.
  // Lista plegable con el nombre de quien hizo cada foto de ejemplo
  // (fotos de Unsplash: se pueden usar gratis, pero es justo dar las gracias)
  function creditos() {
    var c = PP.creditosFotos || [];
    if (!c.length) return '';
    return '<details class="creditos"><summary>Créditos de las fotos</summary><p class="suave">Fotos de <a href="https://unsplash.com/?utm_source=paso_a_paso&amp;utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>. Gracias a:</p><ul>' +
      c.map(function (x) {
        return '<li>' + PP.esc(x.que) + ': <a href="https://unsplash.com/@' + encodeURIComponent(x.usuario) + '?utm_source=paso_a_paso&amp;utm_medium=referral" target="_blank" rel="noopener">' + PP.esc(x.autor) + '</a></li>';
      }).join('') + '</ul></details>';
  }

  PP.picto = function (paso, clase) {
    var foto = paso.foto || (PP.estado.perfil.imagenes !== 'simbolos' && PP.fotosEjemplo[paso.texto || paso.nombre]);
    if (foto) return '<img class="' + (clase || 'picto') + ' foto" src="' + foto + '" alt="">';
    return '<span class="' + (clase || 'picto') + '" aria-hidden="true">' + PP.esc(paso.picto || '⭐') + '</span>';
  };

  // ---------- Guardar el estado completo ----------
  PP.persistir = function () { return PP.guardar('estado', PP.estado); };

  // ---------- Avisos breves (también los lee el lector de pantalla) ----------
  var temporizadorAviso;
  PP.avisar = function (texto) {
    var a = $('#aviso');
    a.textContent = texto;
    a.classList.add('visible');
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function () { a.classList.remove('visible'); }, 2600);
  };

  // ---------- Aplicar modo calma ----------
  PP.aplicarPreferencias = function () {
    document.documentElement.classList.toggle('calma', !!PP.estado.perfil.modoCalma);
  };

  // ---------- Navegar entre pantallas ----------
  // nombre = la pantalla, params = datos extra (por ejemplo qué rutina editar)
  PP.ir = function (nombre, params, opciones) {
    opciones = opciones || {};
    if (!opciones.sinHistorial && PP.actual) historial.push(PP.actual);
    if (opciones.raiz) historial = [];
    PP.actual = { nombre: nombre, params: params || {} };
    pintar();
    var medir = { informe: 'informe_abierto', guiaFicha: 'guia_ficha_abierta' }[nombre];
    if (medir && PP.evento) PP.evento(medir);
  };

  PP.atras = function () {
    var anterior = historial.pop();
    PP.actual = anterior || { nombre: 'inicio', params: {} };
    pintar();
  };

  // pintar(): pantalla nueva (empieza arriba y entra escalonada).
  // PP.repintar(): la misma pantalla cambió; se queda donde estaba, sin animar.
  function pintar(opciones) {
    var mantener = opciones && opciones.mantener, y = window.scrollY;
    // Sin acceso solo quedan abiertas la guía y el kit de calma (bloqueo.js). Nada se borra.
    if (PP.acceso.cerrada(PP.actual.nombre)) { PP.actual = { nombre: 'bloqueo', params: {} }; historial = []; mantener = false; }
    var p = PP.pantallas[PP.actual.nombre] || PP.pantallas.inicio;
    var main = $('#contenido');
    $('#titulo').textContent = typeof p.titulo === 'function' ? p.titulo(PP.actual.params) : p.titulo;
    $('#btn-atras').hidden = historial.length === 0;
    // Marcar en el menú inferior la sección en la que estamos
    document.querySelectorAll('.menu button').forEach(function (b) {
      var sec = typeof p.seccion === 'function' ? p.seccion(PP.actual.params) : p.seccion;
      var activo = b.dataset.ir === (sec || PP.actual.nombre);
      b.classList.toggle('activo', activo);
      if (activo) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    main.innerHTML = '';
    main.onclick = main.onchange = main.oninput = null; // cada pantalla pone los suyos
    main.classList.remove('entrando');
    p.pintar(main, PP.actual.params);
    if (mantener) { window.scrollTo(0, y); return; }
    Array.prototype.slice.call(main.children, 0, 8).forEach(function (h, i) { h.style.setProperty('--i', i); });
    void main.offsetWidth; // reinicia la animación de entrada
    main.classList.add('entrando');
    main.scrollTop = 0;
    window.scrollTo(0, 0); // cada pantalla nueva empieza arriba
    main.focus({ preventScroll: true });
  }
  PP.repintar = function () { pintar({ mantener: true }); };

  // ---------- MODO NIÑO ----------
  // El "Espacio de Mateo": pantalla completa, sin menú de adultos.
  // pintarNino dibuja la herramienta. Si ya estamos en modo niño,
  // solo se cambia lo de dentro (por ejemplo, de su inicio al tablero).
  // opciones.esInicio = true en la pantalla de inicio del niño (sin botón "casa").
  var limpieza = null; // algo que hay que parar al cambiar de pantalla (un temporizador, música...)
  PP.alCambiarPantallaNino = function (fn) { limpieza = fn; };
  function limpiar() { if (limpieza) { try { limpieza(); } catch (e) { } limpieza = null; } }

  PP.entrarModoNino = function (pintarNino, opciones) {
    opciones = opciones || {};
    limpiar();
    try { speechSynthesis.cancel(); } catch (e) { }
    var cont = $('#nino-contenido');
    cont.innerHTML = ''; cont.onclick = null; cont.oninput = null; cont.onchange = null;
    if (!PP.enModoNino) {
      $('#app').hidden = true;
      $('#nino').hidden = false;
      PP.enModoNino = true;
      // Mantener la pantalla encendida mientras el niño la usa (si el móvil lo permite)
      try { navigator.wakeLock && navigator.wakeLock.request('screen').then(function (w) { PP.wake = w; }).catch(function () { }); } catch (e) { }
    }
    $('#casa-nino').hidden = !!opciones.esInicio;
    $('#nino').scrollTop = 0;
    pintarNino(cont);
  };

  PP.salirModoNino = function () {
    limpiar();
    $('#nino').hidden = true;
    $('#nino-contenido').innerHTML = '';
    $('#app').hidden = false;
    PP.enModoNino = false;
    try { PP.wake && PP.wake.release(); } catch (e) { }
    try { speechSynthesis.cancel(); } catch (e) { }
    pintar();
  };

  // El candado: hay que mantenerlo pulsado 2 segundos para que aparezca el PIN.
  // Así un toque accidental del niño no hace nada.
  function prepararCandado() {
    var c = $('#candado'), espera;
    var salir = function () { PP.pedirPin({ titulo: 'PIN del adulto', alAcertar: PP.salirModoNino }); };
    var empezar = function (e) {
      e.preventDefault();
      c.classList.add('cargando');
      espera = setTimeout(function () { c.classList.remove('cargando'); salir(); }, 2000);
    };
    var cancelar = function () { clearTimeout(espera); c.classList.remove('cargando'); };
    c.addEventListener('pointerdown', empezar);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { c.addEventListener(ev, cancelar); });
    c.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    // Con teclado (adultos o lector de pantalla), Intro abre el PIN directamente
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); salir(); } });
    // La casita lleva al inicio del espacio del niño
    $('#casa-nino').onclick = function () { PP.abrirEspacio(); };
  }

  // Teclado numérico grande para escribir el PIN del adulto.
  // opciones: titulo, alAcertar(pin), alCancelar()
  // Tras 5 PIN equivocados seguidos hay que esperar (30 s, luego 1 min, 2 min… hasta 15 min).
  // Se guarda en el teléfono para que recargar la página no lo salte.
  function leerFallos() {
    try { return JSON.parse(localStorage.getItem('pp_pin_fallos')) || { n: 0, hasta: 0 }; } catch (e) { return { n: 0, hasta: 0 }; }
  }
  function guardarFallos(f) { try { localStorage.setItem('pp_pin_fallos', JSON.stringify(f)); } catch (e) { } }
  function segundosDeEspera() { return Math.max(0, Math.ceil((leerFallos().hasta - Date.now()) / 1000)); }

  PP.pedirPin = function (opciones) {
    var caja = $('#pin'), escrito = '', comprobando = false, reloj = null;
    caja.hidden = false;
    $('#pin-t').textContent = opciones.titulo || 'PIN del adulto';
    var puntos = caja.querySelector('.pin-puntos');
    var msg = caja.querySelector('.pin-msg');
    var mensajeNormal = PP.estado.perfil.pinDePrueba ? 'PIN de prueba: 1234' : '';
    var mostrarEspera = function () {
      clearInterval(reloj);
      var tic = function () {
        var s = segundosDeEspera();
        if (caja.hidden) { clearInterval(reloj); return; }
        caja.classList.toggle('bloqueado', s > 0);
        if (s <= 0) { clearInterval(reloj); msg.textContent = mensajeNormal; return; }
        msg.textContent = 'Demasiados intentos. Espera ' + (s > 60 ? Math.ceil(s / 60) + ' min' : s + ' s') + ' para probar otra vez.';
      };
      tic(); reloj = setInterval(tic, 1000);
    };
    msg.textContent = mensajeNormal;
    caja.classList.remove('bloqueado');
    if (segundosDeEspera() > 0) mostrarEspera();
    var dibujar = function () {
      puntos.innerHTML = [0, 1, 2, 3].map(function (i) { return '<span class="' + (i < escrito.length ? 'lleno' : '') + '"></span>'; }).join('');
      puntos.setAttribute('aria-label', escrito.length + ' de 4 números escritos');
    };
    dibujar();
    caja.onclick = function (e) {
      var b = e.target.closest('button');
      if (!b || comprobando) return;
      if (b.dataset.n != null && segundosDeEspera() > 0) { mostrarEspera(); return; }
      if (b.dataset.n != null && escrito.length < 4) escrito += b.dataset.n;
      if (b.dataset.accion === 'borrar') escrito = escrito.slice(0, -1);
      if (b.dataset.accion === 'cancelar') { clearInterval(reloj); caja.hidden = true; if (opciones.alCancelar) opciones.alCancelar(); return; }
      dibujar();
      if (escrito.length === 4) {
        comprobando = true; msg.textContent = 'Comprobando…';
        var pin = escrito;
        PP.comprobarPin(pin).then(function (bien) {
          comprobando = false;
          if (bien) { guardarFallos({ n: 0, hasta: 0 }); clearInterval(reloj); caja.hidden = true; opciones.alAcertar(pin); return; }
          var f = leerFallos(); f.n += 1;
          if (f.n >= 5) f.hasta = Date.now() + Math.min(15 * 60, 30 * Math.pow(2, f.n - 5)) * 1000;
          guardarFallos(f);
          escrito = ''; setTimeout(dibujar, 300);
          if (f.hasta > Date.now()) mostrarEspera();
          else msg.textContent = 'Ese PIN no es correcto. Prueba otra vez.';
        });
      }
    };
    caja.querySelector('button[data-n="1"]').focus();
  };

  // Interruptor (sí / no) reutilizable en los formularios
  PP.interruptor = function (id, texto, ayuda, valor) {
    return '<label class="interruptor" for="' + id + '"><span class="crece"><strong>' + texto + '</strong><span class="suave">' + ayuda + '</span></span>' +
      '<input type="checkbox" role="switch" id="' + id + '"' + (valor ? ' checked' : '') + '><span class="pista" aria-hidden="true"></span></label>';
  };

  // ---------- Pantalla: INICIO (zona de la familia) ----------
  PP.rutinaDeAhora = function () {
    var ahora = new Date(), min = ahora.getHours() * 60 + ahora.getMinutes();
    var rs = PP.estado.rutinas.slice().sort(function (a, b) { return a.hora.localeCompare(b.hora); });
    var elegida = rs[0];
    rs.forEach(function (r) { var p = r.hora.split(':'); if (+p[0] * 60 + +p[1] <= min + 30) elegida = r; });
    // Hasta que termine su primera rutina, se muestra la que eligió en el onboarding
    var inicial = PP.estado.perfil.rutinaInicial;
    if (inicial && !(PP.estado.estrellas || []).length) elegida = rs.find(function (r) { return r.id === inicial; }) || elegida;
    return elegida;
  };

  // Estrellas de los últimos n días
  PP.estrellasDesde = function (dias) {
    var desde = PP.diasAtras(dias - 1);
    return (PP.estado.estrellas || []).filter(function (e) { return e.fecha >= desde; });
  };

  // ---------- Que el teléfono no borre los datos ----------
  // Una web no instalada puede perder sus datos (Safari los borra tras
  // unos días sin uso). Pedimos almacenamiento permanente e invitamos
  // a guardar la app en la pantalla de inicio.
  var avisoInstalar = null; // evento de Chrome/Android para instalar con un toque
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); avisoInstalar = e; if (PP.actual && PP.actual.nombre === 'inicio') PP.repintar(); });
  function estaInstalada() {
    return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  }
  function pedirAlmacenamientoFijo() {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persisted().then(function (fijo) { if (!fijo) return navigator.storage.persist(); }).catch(function () { });
    }
  }
  function tarjetaInstalar() {
    var oculto = false;
    try { oculto = localStorage.getItem('pp_aviso_instalar') === 'no'; } catch (e) { }
    if (oculto || estaInstalada()) return '';
    return '<section class="tarjeta aviso-instalar" aria-labelledby="inst-t">' +
      '<h3 id="inst-t">Guarda la app en tu pantalla de inicio</h3>' +
      '<p class="suave">Así se abre como cualquier app y el teléfono no borra tus rutinas ni tu diario.</p>' +
      '<p class="suave" id="inst-pasos" hidden></p>' +
      '<div class="fila"><button class="btn crece" data-instalar>' + (avisoInstalar ? 'Instalar' : 'Ver cómo') + '</button><button class="btn" data-instalar-no>Ahora no</button></div>' +
      '</section>';
  }
  function instalar(b) {
    if (avisoInstalar) {
      avisoInstalar.prompt();
      avisoInstalar.userChoice.then(function () { avisoInstalar = null; PP.repintar(); });
      return;
    }
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    var pasos = $('#inst-pasos');
    pasos.textContent = ios
      ? 'En Safari, toca el botón Compartir (el cuadrado con la flecha hacia arriba) y elige «Agregar a inicio».'
      : 'Abre el menú del navegador (los tres puntos) y elige «Instalar app» o «Agregar a la pantalla principal».';
    pasos.hidden = false;
    b.hidden = true;
  }

  // Primeros pasos de una familia nueva (viene del onboarding): se marcan
  // solos cuando los hace y la tarjeta desaparece al terminar los dos.
  function tarjetaPrimerosPasos() {
    var p = PP.estado.perfil;
    if (!p.sinEjemplos) return '';
    var r = PP.estado.rutinas.find(function (x) { return x.id === p.rutinaInicial; });
    var fotoHecha = !!(r && r.pasos[0] && r.pasos[0].foto), pinHecho = !p.pinDePrueba;
    if (fotoHecha && pinHecho) return '';
    var paso = function (hecho, texto, ayuda, attr) {
      var dentro = '<span class="marca-paso" aria-hidden="true">' + (hecho ? '✓' : '') + '</span>' +
        '<span class="crece"><strong>' + texto + '</strong><span class="suave">' + (hecho ? 'Listo' : ayuda) + '</span></span>';
      return '<li' + (hecho ? ' class="hecho"' : '') + '>' + (hecho ? '<div class="paso-fila">' + dentro + '</div>' : '<button class="paso-fila" ' + attr + '>' + dentro + '<span aria-hidden="true" class="flecha">›</span></button>') + '</li>';
    };
    return '<section class="tarjeta primeros-pasos" aria-labelledby="pp-t"><h3 id="pp-t">Tus primeros pasos</h3><ol class="lista-pasos">' +
      paso(fotoHecha, 'Pon una foto de tu casa', 'En el primer paso de «' + PP.esc(r ? r.nombre : '') + '»', 'data-primer-foto') +
      paso(pinHecho, 'Crea tu PIN', 'Protege el diario y la salida del espacio', 'data-primer-pin') +
      '</ol></section>';
  }

  PP.pantallas.inicio = {
    titulo: 'Paso a Paso',
    pintar: function (main) {
      var p = PP.estado.perfil, h = new Date().getHours(), nombre = PP.esc(p.nombre);
      var saludo = h < 13 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches';
      var r = PP.rutinaDeAhora();
      var prog = r ? PP.progresoDe(r) : null;
      var semana = PP.estrellasDesde(7).length;
      main.innerHTML =
        '<section class="bloque">' +
        '  <p class="saludo">' + saludo + '</p>' +
        '  <h2 class="titular">Zona de la familia</h2>' +
        '  <button class="fila-urgente" data-ir-a="guia"><span aria-hidden="true">🧭</span><span class="crece"><strong>¿Momento difícil?</strong> Qué hacer ahora mismo</span><span aria-hidden="true">›</span></button>' +
        '</section>' +
        PP.acceso.tarjetaInicio() +
        tarjetaPrimerosPasos() +
        // 1) La puerta al espacio del niño, bien visible
        '<section class="tarjeta puerta-nino" aria-labelledby="esp-t">' +
        '  <div class="fila"><span class="picto-m" aria-hidden="true">🧒</span><div class="crece"><h3 id="esp-t">Espacio de ' + nombre + '</h3>' +
        '  <p class="suave">Sus herramientas en grande. Para salir, mantén presionado el candado.</p></div></div>' +
        '  <button class="btn grande ancho" data-espacio>Abrir el espacio de ' + nombre + '</button>' +
        '</section>' +
        // 2) La rutina de ahora
        (r ? '<section class="tarjeta destacada" aria-labelledby="ahora-t">' +
          '  <p class="etiqueta">Ahora toca · ' + PP.esc(r.hora) + '</p>' +
          '  <div class="fila">' + PP.picto(r, 'picto-m') +
          '    <div class="crece"><h3 id="ahora-t">' + PP.esc(r.nombre) + '</h3>' +
          '    <p class="suave">' + prog.hechos.length + ' de ' + r.pasos.length + ' pasos hechos hoy</p></div></div>' +
          '  <div class="barra-prog" role="progressbar" aria-label="Progreso de hoy" aria-valuemin="0" aria-valuemax="' + r.pasos.length + '" aria-valuenow="' + prog.hechos.length + '"><span style="width:' + (100 * prog.hechos.length / Math.max(1, r.pasos.length)) + '%"></span></div>' +
          '  <button class="btn principal grande ancho" data-empezar="' + r.id + '">Empezar esta rutina con ' + nombre + '</button>' +
          '</section>' : '') +
        // 3) Ayudas para el adulto
        '<section class="bloque" aria-labelledby="ayu-t"><h2 id="ayu-t" class="seccion-t">Para ti</h2>' +
        '<div class="rejilla-mod">' +
        '<button class="mod ancha" data-ir-a="diarioNuevo"><span class="mod-n">📝 Anotar en el diario</span><span class="mod-d">Registro rápido, en 30 segundos</span></button>' +
        '<button class="mod" data-ir-a="preparar"><span class="mod-n">🧩 Preparar herramientas</span><span class="mod-d">Rutinas, tablero, historias…</span></button>' +
        '<button class="mod" data-ir-a="logros"><span class="mod-n">⭐ ' + semana + ' estrella' + (semana === 1 ? '' : 's') + ' esta semana</span><span class="mod-d">Logros y avances</span></button>' +
        '</div></section>' +
        tarjetaInstalar() +
        '<p class="aviso-legal">Paso a Paso es una herramienta de apoyo para la familia. No sustituye el diagnóstico, la terapia ni el consejo de profesionales. Los datos se guardan solo en este dispositivo.</p>';

      main.onclick = function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        if (b.hasAttribute('data-espacio')) PP.abrirEspacio();
        if (b.dataset.empezar) PP.empezarRutina(b.dataset.empezar);
        if (b.hasAttribute('data-instalar')) instalar(b);
        if (b.hasAttribute('data-revisar')) PP.acceso.revisarDesdeBoton(); // "Revisar ahora" del aviso sin conexión (bloqueo.js)
        if (b.hasAttribute('data-primer-foto')) PP.ir('editarRutina', { id: PP.estado.perfil.rutinaInicial });
        if (b.hasAttribute('data-primer-pin')) PP.ir('ajustes');
        if (b.hasAttribute('data-instalar-no')) { try { localStorage.setItem('pp_aviso_instalar', 'no'); } catch (err) { } PP.repintar(); }
        if (b.dataset.irA === 'diarioNuevo') PP.conDiario(function () { PP.ir('diarioNuevo'); });
        else if (b.dataset.irA) PP.ir(b.dataset.irA);
      };
    }
  };

  // ---------- Pantalla: PREPARAR (lo que verá el niño) ----------
  var HERRAMIENTAS_NINO = [
    { id: 'agenda', nombre: 'Agenda visual', desc: 'Rutinas paso a paso', picto: '📅' },
    { id: 'tablero', nombre: 'Tablero para hablar', desc: 'Botones que hablan', picto: '💬' },
    { id: 'temporizador', nombre: 'Temporizador visual', desc: 'Ver cuánto falta y qué viene después', picto: '⏳' },
    { id: 'calma', nombre: 'Kit de calma', desc: 'Respirar, contar, música y lo que le ayuda', picto: '🫧' },
    { id: 'historias', nombre: 'Historias sociales', desc: 'Preparar situaciones nuevas', picto: '📖' },
    { id: 'logros', nombre: 'Mis estrellas', desc: 'Estrellas de rutinas y logros', picto: '⭐' }
  ];
  PP.HERRAMIENTAS_NINO = HERRAMIENTAS_NINO;

  PP.pantallas.preparar = {
    titulo: 'Preparar',
    pintar: function (main) {
      var p = PP.estado.perfil, nombre = PP.esc(p.nombre);
      main.innerHTML =
        '<p class="intro">Aquí preparas las herramientas que ' + nombre + ' usa en su espacio. Toca una para cambiarla o para dársela ahora.</p>' +
        '<div class="lista">' + HERRAMIENTAS_NINO.map(function (m) {
          return '<button class="fila-lista" data-mod="' + m.id + '"><span class="picto-s" aria-hidden="true">' + m.picto + '</span>' +
            '<span class="crece"><strong>' + m.nombre + '</strong><span class="suave">' + m.desc + '</span></span></button>';
        }).join('') + '</div>' +
        '<h2 class="seccion-t">Qué aparece en el espacio de ' + nombre + '</h2>' +
        '<div class="tarjeta lista-interruptores">' + HERRAMIENTAS_NINO.map(function (m) {
          return PP.interruptor('esp-' + m.id, m.picto + ' ' + m.nombre, '', p.espacio[m.id] !== false);
        }).join('') + '</div>' +
        '<button class="btn principal grande ancho" data-espacio>Abrir el espacio de ' + nombre + '</button>';
      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.mod) PP.ir(b.dataset.mod);
        if (b.hasAttribute('data-espacio')) PP.abrirEspacio();
      };
      main.onchange = function (e) {
        var id = e.target.id; if (!id || id.indexOf('esp-') !== 0) return;
        p.espacio[id.slice(4)] = e.target.checked;
        PP.persistir(); PP.avisar('Guardado');
      };
    }
  };

  // ---------- Pantalla: MÁS ----------
  PP.pantallas.mas = {
    titulo: 'Más',
    pintar: function (main) {
      var filas = [
        ['logros', '⭐', 'Logros y avances', 'Apunta lo que consigue y mira sus estrellas'],
        ['informe', '📄', 'Informe para profesionales', 'Resumen para imprimir o guardar en PDF'],
        ['ajustes', '⚙️', 'Ajustes', 'Perfil, PIN, voz, imágenes y modo calma']
      ];
      main.innerHTML = '<div class="lista">' + filas.map(function (f) {
        return '<button class="fila-lista" data-ir-a="' + f[0] + '"><span class="picto-s" aria-hidden="true">' + f[1] + '</span><span class="crece"><strong>' + f[2] + '</strong><span class="suave">' + f[3] + '</span></span></button>';
      }).join('') + '</div>' +
        '<p class="aviso-legal">Paso a Paso es una herramienta de apoyo para la familia. No sustituye el diagnóstico, la terapia ni el consejo de profesionales. Sin anuncios. Tus rutinas, fotos y diario no salen de este teléfono.</p>';
      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.irA) PP.ir(b.dataset.irA);
      };
    }
  };

  // ---------- Pantalla: AJUSTES ----------
  PP.pantallas.ajustes = {
    titulo: 'Ajustes', seccion: 'mas',
    pintar: function (main) {
      var p = PP.estado.perfil;
      var interruptor = PP.interruptor;
      main.innerHTML =
        '<form class="formulario" id="form-ajustes">' +
        '<h2 class="seccion-t">Perfil</h2>' +
        '<div class="dos"><label class="campo" for="aj-nombre">Nombre<input id="aj-nombre" value="' + PP.esc(p.nombre) + '" autocomplete="off"></label>' +
        '<label class="campo" for="aj-edad">Edad<input id="aj-edad" type="number" min="2" max="12" inputmode="numeric" value="' + p.edad + '"></label></div>' +
        '<label class="campo" for="aj-pin">Cambiar el PIN del adulto (4 números)<input id="aj-pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" placeholder="Déjalo vacío para no cambiarlo"></label>' +
        '<p class="suave">El PIN sirve para salir del espacio de ' + PP.esc(p.nombre) + ' y para abrir el diario privado.' + (p.pinDePrueba ? ' Ahora es el PIN de prueba 1234: te recomendamos cambiarlo.' : '') + '</p>' +
        interruptor('aj-espacio', 'Abrir la app en el espacio de ' + PP.esc(p.nombre), 'Útil si el teléfono o la tablet es solo para él', p.abrirEnEspacio) +
        '<h2 class="seccion-t">Voz</h2>' +
        '<fieldset class="segmentado"><legend class="sr">Acento de la voz</legend>' +
        '<label><input type="radio" name="acento" value="espana"' + (p.acento === 'espana' ? ' checked' : '') + '><span>España</span></label>' +
        '<label><input type="radio" name="acento" value="latino"' + (p.acento === 'latino' ? ' checked' : '') + '><span>Latinoamérica</span></label></fieldset>' +
        interruptor('aj-voz', 'Leer en voz alta', 'Lee cada paso al tocarlo', p.leerEnVoz) +
        '<label class="campo" for="aj-voz-nombre">Voz<select id="aj-voz-nombre"></select></label>' +
        '<label class="campo" for="aj-vel">Velocidad de la voz<input id="aj-vel" type="range" min="0.6" max="1.2" step="0.05" value="' + (p.velocidad || 0.9) + '"></label>' +
        '<p class="suave">Consejo: para que suene aún más humana, graba tu propia voz en cada paso o botón con el micrófono 🎙 del editor.</p>' +
        '<button type="button" class="btn" id="aj-probar">Probar la voz</button>' +
        '<h2 class="seccion-t">Imágenes</h2>' +
        '<fieldset class="segmentado"><legend class="sr">Tipo de imágenes</legend>' +
        '<label><input type="radio" name="imagenes" value="fotos"' + (p.imagenes !== 'simbolos' ? ' checked' : '') + '><span>Fotos realistas</span></label>' +
        '<label><input type="radio" name="imagenes" value="simbolos"' + (p.imagenes === 'simbolos' ? ' checked' : '') + '><span>Símbolos</span></label></fieldset>' +
        '<p class="suave">Las fotos de tu familia se ven siempre, elijas lo que elijas.</p>' +
        creditos() +
        '<h2 class="seccion-t">Estímulos</h2>' +
        interruptor('aj-sonido', 'Sonido suave al terminar un paso', 'Desactivado por defecto', p.sonido) +
        interruptor('aj-calma', 'Modo calma', 'Sin animaciones ni sonidos, colores más apagados', p.modoCalma) +
        '<button class="btn principal grande" type="submit">Guardar ajustes</button>' +
        '<h2 class="seccion-t">Datos</h2>' +
        '<p class="suave">Todo se guarda solo en este dispositivo. El diario se guarda cifrado con tu PIN.</p>' +
        interruptor('aj-estadisticas', 'Compartir estadísticas de uso', 'Solo qué funciones se usan (por ejemplo, "se completó un paso"), con un número al azar del teléfono. Nunca nombres, fotos ni el diario.', PP.estadisticasActivas ? PP.estadisticasActivas() : true) +
        '<div id="zona-reset"><button type="button" class="btn peligro" id="aj-reset">Volver a los datos de ejemplo</button></div>' +
        '</form>';

      // Lista de voces del teléfono, de la más natural a la menos
      var llenarVoces = function () {
        var acento = main.querySelector('input[name=acento]:checked').value;
        var voces = PP.vocesDisponibles(acento);
        $('#aj-voz-nombre').innerHTML = '<option value="">Automática (la más natural)</option>' + voces.map(function (v) {
          return '<option value="' + PP.esc(v.name) + '"' + (v.name === p.vozNombre ? ' selected' : '') + '>' + PP.esc(v.name) + ' (' + PP.esc(v.lang) + ')</option>';
        }).join('');
      };
      llenarVoces();
      try { speechSynthesis.addEventListener('voiceschanged', llenarVoces); } catch (e) { }
      main.querySelectorAll('input[name=acento]').forEach(function (r) { r.onchange = function () { p.vozNombre = ''; llenarVoces(); }; });

      $('#aj-probar').onclick = function () {
        var antes = { v: p.leerEnVoz, c: p.modoCalma, n: p.vozNombre, vel: p.velocidad, a: p.acento };
        p.leerEnVoz = true; p.modoCalma = false;
        p.acento = main.querySelector('input[name=acento]:checked').value;
        p.vozNombre = $('#aj-voz-nombre').value;
        p.velocidad = +$('#aj-vel').value;
        PP.decir('Hola, ' + p.nombre + '. Vamos paso a paso.');
        p.leerEnVoz = antes.v; p.modoCalma = antes.c; p.vozNombre = antes.n; p.velocidad = antes.vel; p.acento = antes.a;
        if (!('speechSynthesis' in window)) PP.avisar('Este navegador no tiene voz disponible.');
      };
      $('#aj-reset').onclick = function () {
        $('#zona-reset').innerHTML = '<p><strong>¿Seguro?</strong> Se borrarán tus cambios, también el diario, y volverán los datos de ejemplo de Mateo.</p>' +
          '<div class="fila"><button type="button" class="btn peligro" id="aj-reset-si">Sí, borrar</button><button type="button" class="btn" id="aj-reset-no">No, cancelar</button></div>';
        $('#aj-reset-si').onclick = function () {
          PP.borrarDiario();
          PP.estado = PP.datosEjemplo();
          PP.prepararDatos().then(function () { PP.aplicarPreferencias(); PP.avisar('Datos de ejemplo restaurados'); PP.ir('inicio', null, { raiz: true }); });
        };
        $('#aj-reset-no').onclick = function () { pintar(); };
      };
      var est = $('#aj-estadisticas');
      if (est && PP.fijarEstadisticas) est.onchange = function () { PP.fijarEstadisticas(est.checked); PP.avisar(est.checked ? 'Estadísticas activadas' : 'Ya no se envían estadísticas'); };
      $('#form-ajustes').onsubmit = function (e) {
        e.preventDefault();
        var pin = $('#aj-pin').value.trim();
        if (pin && !/^\d{4}$/.test(pin)) { PP.avisar('El PIN tiene que tener 4 números.'); $('#aj-pin').focus(); return; }
        p.nombre = $('#aj-nombre').value.trim() || 'Mateo';
        p.edad = +$('#aj-edad').value || p.edad;
        p.abrirEnEspacio = $('#aj-espacio').checked;
        p.acento = main.querySelector('input[name=acento]:checked').value;
        p.leerEnVoz = $('#aj-voz').checked;
        p.sonido = $('#aj-sonido').checked;
        p.modoCalma = $('#aj-calma').checked;
        p.vozNombre = $('#aj-voz-nombre').value;
        p.velocidad = +$('#aj-vel').value;
        p.imagenes = main.querySelector('input[name=imagenes]:checked').value;
        PP.persistir(); PP.aplicarPreferencias();
        if (!pin) { PP.avisar('Ajustes guardados'); return; }
        // Para cambiar el PIN hay que escribir antes el actual
        PP.pedirPin({
          titulo: 'Escribe el PIN actual',
          alAcertar: function (viejo) {
            PP.cambiarPinDiario(viejo, pin)
              .then(function () { return PP.fijarPin(pin); })
              .then(function () { PP.persistir(); $('#aj-pin').value = ''; PP.avisar('PIN cambiado'); pintar(); })
              .catch(function () { PP.avisar('No se pudo cambiar el PIN. Prueba otra vez.'); });
          }
        });
      };
    }
  };

  // ---------- Arranque ----------
  // Pone al día los datos (de una versión anterior o recién creados)
  // y guarda el PIN como huella en lugar de como número.
  PP.prepararDatos = function () {
    var e = PP.completarDatos(PP.estado);
    // 'Seño' pasó a llamarse 'Profesora'
    // y los textos de España pasaron a español latino
    var NUEVOS = { 'Seño': 'Profesora', 'Estoy enfadado': 'Estoy enojado', 'He terminado': 'Terminé', 'Zumo': 'Jugo', 'Quiero mis cascos': 'Quiero mis audífonos' };
    e.tablero.categorias.forEach(function (c) { c.botones.forEach(function (b) { if (NUEVOS[b.texto]) b.texto = NUEVOS[b.texto]; }); });
    var listo = (e.perfil.pin && PP.cifrado.disponible) ? PP.fijarPin(e.perfil.pin) : Promise.resolve();
    if (e.perfil.pinDePrueba == null) e.perfil.pinDePrueba = e.perfil.pin === '1234';
    return listo.then(function () { return PP.persistir(); });
  };

  PP.iniciar = function () {
    PP.leer('estado').then(function (guardado) {
      // Primera vez: si viene del onboarding, arranca con su peque; si no, con el ejemplo de Mateo
      var onboarding = !guardado && PP.leerOnboarding();
      PP.estado = guardado || (onboarding ? PP.datosDesdeOnboarding(onboarding) : PP.datosEjemplo());
      return PP.prepararDatos();
    }).then(function () {
      // ¿Tiene acceso? (bloqueo.js): con un pase vigente sigue enseguida; si no, espera al servidor
      return PP.acceso.arrancar();
    }).then(function () {
      PP.aplicarPreferencias();
      prepararCandado();
      $('#btn-atras').onclick = PP.atras;
      $('#btn-ajustes').onclick = function () { PP.ir('ajustes'); };
      document.querySelector('.menu').onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        PP.ir(b.dataset.ir, null, { raiz: true });
      };
      PP.actual = null;
      PP.ir('inicio', null, { raiz: true }); // sin acceso, la puerta de pintar() la cambia por 'bloqueo'
      pedirAlmacenamientoFijo();
      if (PP.estado.perfil.abrirEnEspacio && !PP.acceso.cerrada('espacio')) PP.abrirEspacio();
    });

    // Funcionar sin internet: solo cuando la app está instalada en su propia web
    if ('serviceWorker' in navigator && window.top === window && /^https:|localhost/.test(location.href)) {
      navigator.serviceWorker.register('sw.js').catch(function () { });
    }
  };
})(window.PP);
