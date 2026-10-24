/* =========================================================
   bloqueo.js — ¿Se abre la app? (entrada de pago, paso 8)
   ---------------------------------------------------------
   Al abrir y al volver a la app, pregunta a /api/acceso si la
   familia tiene acceso y guarda la respuesta como "pase" en el
   teléfono (IndexedDB). La regla está en acceso.js:
   - Solo un "no" explícito del servidor cierra la app.
   - Sin internet o con el servidor caído, el pase vale 7 días.
   Cerrada, la app NO borra nada: deja abiertos la guía
   "¿Momento difícil?" y el kit de calma, y al volver el acceso
   todo sigue donde estaba.
   Textos: docs/copy/embudo.md §5 (y §3.3 para "ya entraste").
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var A = PP.acceso;
  var MIN = 60 * 1000;
  var ESPERA_RED_MS = 8000;           // más que esto sin respuesta = sin conexión
  var CADA_OK_MS = 10 * MIN;          // al volver a la app, como mucho una pregunta cada 10 min…
  var CADA_FALLO_MS = MIN;            // …o cada minuto si la última no tuvo respuesta
  // Lo único que queda abierto sin acceso: la guía y el kit de calma (plan, decisión 7)
  var ABIERTAS = { bloqueo: true, guia: true, guiaFicha: true, calma: true };
  var CORREO = 'hadaapps@gmail.com';

  var TXT = {
    // §5.1
    pausaT: 'Tu acceso está en pausa',
    // (pendiente de aprobar) por qué está en pausa, según el estado que guardó el pase
    motivoCancelada: 'La prueba o la suscripción se canceló, y el acceso terminó.',
    motivoPago: 'Hotmart no pudo cobrar el pago.',
    motivoReembolso: 'Te devolvimos el pago.',
    motivoSinCompra: 'No vemos una compra con este correo.',
    pausaX: 'No borramos nada. Las rutinas, las fotos y el diario de {nombre} siguen en este teléfono.',
    abiertoT: 'Esto sigue abierto, siempre',
    abiertoX: 'La guía "¿Momento difícil?" y el kit de calma son para cuando más se necesitan. No se cierran nunca.',
    guia: '¿Momento difícil?',
    guiaD: 'Qué hacer ahora mismo',
    calma: 'Kit de calma',
    calmaD: 'Respirar, contar, música y lo que le ayuda',
    reactivar: 'Volver a activar',
    yaPague: 'Ya pagué: revisar de nuevo',
    revisando: 'Revisando…',
    otroCorreo: 'Entrar con otro correo',
    dudas: '¿Dudas?',
    // (pendiente de aprobar) tras "Ya pagué" la base sigue diciendo que no
    sinPago: 'Todavía no vemos el pago. A veces Hotmart tarda unos minutos en avisarnos: revisa de nuevo en un momento.',
    // (pendiente de aprobar) debajo, enlace a /entrar
    otroCorreoPago: 'Si pagaste con otro correo, entra con ese.',
    // §5.2
    entrarT: 'Entra para abrir tu app',
    entrarX: 'Usa el correo de tu compra. La guía "¿Momento difícil?" y el kit de calma están abiertos mientras tanto.',
    entrar: 'Entrar',
    // §5.3
    sinRed: 'Sin internet: la app funciona igual.',
    diasSinRed: 'Llevas {dias} días sin conexión. Conéctate un momento antes del {fecha_fin} para seguir sin cortes.',
    vencidoT: 'Conéctate un momento',
    vencidoX: 'Hace más de 7 días que no revisamos tu acceso. Con internet, se revisa solo en segundos.',
    revisarAhora: 'Revisar ahora',
    fallo: 'No pudimos revisar tu acceso. Toca Reintentar cuando tengas internet.',
    reintentar: 'Reintentar',
    alDia: 'Listo, tu acceso está al día.',
    // §3.3
    yaEntraste: 'Listo, ya entraste.',
    // (pendiente de aprobar) se cerró la sesión pero el pase sigue vigente
    sesionCerrada: 'Tu sesión se cerró en este teléfono. Entra antes del {fecha_fin} para seguir sin cortes.'
  };

  var st = {
    decision: null,       // la última de A.decidir()
    visto: false,         // la familia vio un estado distinto de "todo bien" (para "al día")
    avisoSinRed: false,   // ya se dijo "Sin internet: la app funciona igual." en esta apertura
    ultimoIntento: 0,
    revisando: false,
    fallo: false,         // la última pregunta (sola o con el botón) no tuvo respuesta
    falloBoton: false,    // la última pregunta HECHA CON EL BOTÓN no tuvo respuesta
    sinPago: false,       // "Ya pagué" y la base sigue diciendo que no
    hola: false           // llega desde /entrar (?hola=1)
  };

  function cerradaAhora() { return !!(st.decision && !st.decision.abierta); }

  // ¿Esta pantalla queda tapada? (lo preguntan app.js al pintar y nino.js al abrir el espacio)
  A.cerrada = function (pantalla) { return cerradaAhora() && !ABIERTAS[pantalla]; };

  // ---------- Preguntar al servidor ----------
  function preguntar() {
    var control = new AbortController();
    var reloj = setTimeout(function () { control.abort(); }, ESPERA_RED_MS);
    return fetch('/api/acceso', { cache: 'no-store', credentials: 'same-origin', headers: { Accept: 'application/json' }, signal: control.signal })
      .then(function (r) {
        return r.json().then(
          function (cuerpo) { return A.leerRespuesta(r.status, cuerpo); },
          function () { return A.leerRespuesta(r.status, null); } // no era JSON (un wifi público, un 502 en HTML…)
        );
      }, function () { return A.leerRespuesta(0, null); }) // sin internet o se cortó
      .then(function (res) { clearTimeout(reloj); return res; });
  }

  // desdeBoton: la familia tocó "Ya pagué" / "Revisar ahora" / "Reintentar" (en el bloqueo
  // o en el aviso del inicio): la respuesta se dice en el mismo lugar y el foco vuelve al botón.
  // Si no (al abrir, al volver a la app, al volver internet), la pantalla se actualiza sola.
  function revisar(desdeBoton) {
    st.revisando = true;
    st.ultimoIntento = Date.now();
    marcarBotones();
    return preguntar().then(function (res) {
      st.revisando = false;
      st.fallo = res.tipo === 'red';
      var motivoAntes = st.decision ? st.decision.motivo : null;
      var d = A.decidir(st.decision ? st.decision.pase : null, Date.now(), res);
      // El pase solo cambia con una respuesta clara de la base; nunca se borra.
      if (res.tipo === 'ok') PP.guardar('pase', d.pase);
      if (desdeBoton) {
        st.falloBoton = st.fallo;
        st.sinPago = d.motivo === 'sin_acceso' && !st.fallo;
      }
      aplicar(d);
      if (d.motivo === motivoAntes) refrescar(desdeBoton);
      return d;
    });
  }

  // ---------- Aplicar la decisión ----------
  function ajustarMarco() {
    var cerrada = cerradaAhora();
    document.querySelector('.menu').hidden = cerrada;
    document.getElementById('btn-ajustes').hidden = cerrada;
  }

  function aplicar(d) {
    var antes = st.decision, estabaCerrada = cerradaAhora();
    var cambioMotivo = !antes || antes.motivo !== d.motivo;
    st.decision = d;
    ajustarMarco();
    if (d.motivo !== 'sin_acceso') st.sinPago = false;
    if (cambioMotivo) st.falloBoton = false;
    var iniciada = !!PP.actual; // la app ya pintó su primera pantalla

    if (d.motivo === 'ok') {
      if (st.hola) { st.hola = false; st.visto = false; PP.avisar(TXT.yaEntraste); }
      else if (st.visto) { st.visto = false; PP.avisar(TXT.alDia); }
    } else if (d.motivo !== 'sin_conexion' || st.fallo) {
      st.visto = true;
    }
    if (d.motivo === 'sin_conexion' && st.fallo && !st.avisoSinRed && A.gracia(d.pase, Date.now()).dias < 5) {
      st.avisoSinRed = true;
      PP.avisar(TXT.sinRed);
    }
    if (!iniciada) return; // app.js pinta la primera pantalla (y pasa por la puerta)

    if (!d.abierta) {
      // En el espacio del niño no se le quita la pantalla: la puerta actúa al salir o al tocar la casita.
      if (PP.enModoNino) return;
      if (PP.actual.nombre === 'bloqueo') { if (cambioMotivo) PP.ir('bloqueo', null, { raiz: true }); }
      else if (!ABIERTAS[PP.actual.nombre]) PP.ir('bloqueo', null, { raiz: true });
      return;
    }
    if (estabaCerrada) {
      if (!PP.enModoNino && PP.actual.nombre === 'bloqueo') PP.ir('inicio', null, { raiz: true });
      return;
    }
    if (!PP.enModoNino && PP.actual.nombre === 'inicio') PP.repintar(); // la tarjeta de aviso pudo cambiar
  }

  // Mientras pregunta, los botones de revisar dicen "Revisando…" y no se pueden tocar.
  function marcarBotones() {
    if (!st.decision) return;
    var bs = document.querySelectorAll('#contenido [data-revisar]');
    for (var i = 0; i < bs.length; i++) {
      bs[i].disabled = st.revisando;
      bs[i].textContent = etiquetaRevisar(st.decision.motivo);
    }
  }

  // Misma pantalla después de revisar: con el botón, la respuesta en el mismo lugar y el foco
  // de vuelta; sola, el bloqueo se vuelve a pintar (el inicio ya lo repintó aplicar()).
  function refrescar(desdeBoton) {
    if (!PP.actual || PP.enModoNino) return;
    if (PP.actual.nombre === 'bloqueo') {
      if (!desdeBoton) { PP.repintar(); return; }
      marcarBotones();
      var msg = document.getElementById('bloqueo-msg');
      if (msg) msg.innerHTML = mensajeRevision(st.decision.motivo);
    }
    if (desdeBoton) {
      var b = document.querySelector('#contenido [data-revisar]');
      if (b) b.focus();
    }
  }

  // ---------- Arranque (lo llama PP.iniciar) ----------
  // Con un pase vigente la app abre ya y la pregunta sigue de fondo; sin él, espera la respuesta.
  A.arrancar = function () {
    st.hola = /[?&]hola=1(&|$)/.test(location.search);
    if (st.hola && window.history && history.replaceState) history.replaceState(null, '', location.pathname + location.hash);
    return PP.leer('pase').then(function (pase) {
      st.decision = A.decidir(pase, Date.now(), null);
      ajustarMarco();
      if (!st.decision.abierta) {
        // Sin pase vigente espera la respuesta (hasta 8 s sin internet): mientras, "Revisando…".
        if (PP.aplicarPreferencias) PP.aplicarPreferencias(); // modo calma: sin giro
        document.getElementById('contenido').innerHTML =
          '<p class="bloqueo-espera" role="status"><span class="girando" aria-hidden="true"></span>' + TXT.revisando + '</p>';
      }
      var respuesta = revisar();
      return st.decision.abierta ? st.decision : respuesta;
    });
  };

  // Al volver a la app (desde otra app o con la pantalla apagada), con un límite.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible' || st.revisando || !st.decision) return;
    var espera = st.fallo ? CADA_FALLO_MS : CADA_OK_MS;
    if (Date.now() - st.ultimoIntento >= espera) revisar();
  });

  // Al volver internet con la app abierta, si la última pregunta no tuvo respuesta:
  // "Con internet, se revisa solo en segundos" (§5.3).
  window.addEventListener('online', function () {
    if (st.fallo && !st.revisando && st.decision) revisar();
  });

  // ---------- Tarjeta en el inicio (días 5 a 7 sin conexión, o sesión cerrada) ----------
  A.tarjetaInicio = function () {
    var d = st.decision;
    if (!d || !d.abierta || !d.pase) return '';
    var g = A.gracia(d.pase, Date.now()), fin = A.fechaHumana(g.fin), texto;
    if (d.motivo === 'sin_conexion' && st.fallo && g.dias >= 5) texto = TXT.diasSinRed.replace('{dias}', g.dias).replace('{fecha_fin}', fin);
    else if (d.motivo === 'entrar_pronto') texto = TXT.sesionCerrada.replace('{fecha_fin}', fin);
    else return '';
    var accion = d.motivo === 'entrar_pronto'
      ? '<a class="btn" href="/entrar">' + TXT.entrar + '</a>'
      : '<button class="btn" data-revisar' + (st.revisando ? ' disabled' : '') + '>' + etiquetaRevisar(d.motivo) + '</button>';
    var msg = d.motivo === 'sin_conexion' && st.falloBoton ? '<p class="aviso-acceso-msg">' + TXT.fallo + '</p>' : '';
    return '<section class="aviso-acceso" role="status"><p>' + PP.esc(texto) + '</p>' + accion + msg + '</section>';
  };
  // "Revisar ahora" del aviso del inicio (app.js lo llama desde su pantalla)
  A.revisarDesdeBoton = function () { if (!st.revisando) revisar(true); };

  // ---------- Pantalla de bloqueo ----------
  // Las dos puertas abiertas, iguales a la del inicio (ícono, nombre y descripción).
  function botonesAbiertos() {
    function fila(abrir, picto, nombre, desc) {
      return '<button class="fila-urgente bloqueo-abierta" data-abrir="' + abrir + '"><span aria-hidden="true">' + picto + '</span>' +
        '<span class="crece"><strong>' + PP.esc(nombre) + '</strong> ' + PP.esc(desc) + '</span><span aria-hidden="true">›</span></button>';
    }
    return '<div class="bloqueo-abiertas">' + fila('guia', '🧭', TXT.guia, TXT.guiaD) + fila('calma', '🫧', TXT.calma, TXT.calmaD) + '</div>';
  }
  // "Esto sigue abierto, siempre" con sus dos puertas (§5.1; también con la gracia vencida, §5.3)
  function tarjetaAbierta() {
    return '<section class="tarjeta destacada" aria-labelledby="abierto-t"><h3 id="abierto-t">' + TXT.abiertoT + '</h3><p>' + PP.esc(TXT.abiertoX) + '</p>' + botonesAbiertos() + '</section>';
  }
  function pie() {
    return '<p class="suave bloqueo-pie">' + TXT.dudas + ' <a href="mailto:' + CORREO + '">' + CORREO + '</a></p>';
  }
  // Por qué está en pausa, según el estado que guardó el pase (lo devuelve /api/acceso)
  var MOTIVOS = { cancelled: 'motivoCancelada', expired: 'motivoPago', refunded: 'motivoReembolso', chargeback: 'motivoReembolso', none: 'motivoSinCompra' };
  function motivoPausa(d) {
    var clave = d.pase && MOTIVOS[d.pase.estado];
    return clave ? '<p class="bloqueo-motivo">' + TXT[clave] + '</p>' : '';
  }
  // En "Entra para abrir tu app" el fallo de la pregunta automática también se dice (si no,
  // pediría entrar a quien quizá ya entró); en las otras pantallas, solo el del botón.
  // Devuelve HTML (textos fijos de TXT).
  function mensajeRevision(motivo) {
    if (motivo === 'entrar' ? st.fallo : st.falloBoton) return TXT.fallo;
    return st.sinPago ? TXT.sinPago + '<a class="enlace" href="/entrar">' + TXT.otroCorreoPago + '</a>' : '';
  }
  function etiquetaRevisar(motivo) {
    if (st.revisando) return TXT.revisando;
    if (motivo === 'entrar' || st.falloBoton) return TXT.reintentar;
    return motivo === 'sin_acceso' ? TXT.yaPague : TXT.revisarAhora;
  }
  // Siempre en la página (aunque vacío) para que el lector de pantalla lea el cambio.
  function estadoRevision(motivo) {
    return '<p class="bloqueo-msg" id="bloqueo-msg" role="status" aria-live="polite">' + mensajeRevision(motivo) + '</p>';
  }
  function botonRevisar(clase, motivo) {
    return '<button class="' + clase + '" data-revisar' + (st.revisando ? ' disabled' : '') + '>' + etiquetaRevisar(motivo) + '</button>';
  }

  // Cada bloque va directo en #contenido para que entre escalonado (pintar() de app.js).
  PP.pantallas.bloqueo = {
    titulo: 'Paso a Paso',
    pintar: function (main) {
      var d = st.decision || { motivo: 'entrar' };
      var nombre = PP.estado.perfil.nombre;
      var html = '';
      if (d.motivo === 'sin_acceso') {
        html =
          '<section class="bloque bloqueo-cab"><h2 class="titular">' + TXT.pausaT + '</h2>' + motivoPausa(d) + '<p>' + PP.esc(TXT.pausaX.replace('{nombre}', nombre)) + '</p></section>' +
          tarjetaAbierta() +
          '<a class="btn principal grande ancho" href="/paywall">' + TXT.reactivar + '</a>' +
          '<div class="bloqueo-enlaces">' +
          botonRevisar('enlace', d.motivo) +
          estadoRevision(d.motivo) +
          '<a class="enlace" href="/entrar">' + TXT.otroCorreo + '</a>' +
          '</div>' +
          pie();
      } else if (d.motivo === 'vencido_sin_conexion') {
        html =
          '<section class="bloque bloqueo-cab"><h2 class="titular">' + TXT.vencidoT + '</h2><p>' + PP.esc(TXT.vencidoX) + '</p>' +
          '<p>' + PP.esc(TXT.pausaX.replace('{nombre}', nombre)) + '</p></section>' +
          '<div class="bloqueo-accion">' + botonRevisar('btn principal grande ancho', d.motivo) + estadoRevision(d.motivo) + '</div>' +
          tarjetaAbierta() +
          pie();
      } else { // 'entrar': sin sesión en este teléfono (y sin pase vigente)
        html =
          '<section class="bloque bloqueo-cab"><h2 class="titular">' + TXT.entrarT + '</h2><p>' + PP.esc(TXT.entrarX) + '</p></section>' +
          '<div class="bloqueo-accion">' +
          '<a class="btn principal grande ancho" href="/entrar">' + TXT.entrar + '</a>' +
          (st.fallo ? botonRevisar('btn ancho', d.motivo) : '') + estadoRevision(d.motivo) +
          '</div>' +
          botonesAbiertos() +
          pie();
      }
      main.innerHTML = html;

      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.abrir) PP.ir(b.dataset.abrir);
        if (b.hasAttribute('data-revisar') && !st.revisando) revisar(true);
      };
    }
  };
})(window.PP);
