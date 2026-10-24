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
    pausaX: 'No borramos nada. Las rutinas, las fotos y el diario de {nombre} siguen en este teléfono.',
    abiertoT: 'Esto sigue abierto, siempre',
    abiertoX: 'La guía "¿Momento difícil?" y el kit de calma son para cuando más se necesitan. No se cierran nunca.',
    guia: '¿Momento difícil?',
    calma: 'Kit de calma',
    reactivar: 'Volver a activar',
    yaPague: 'Ya pagué: revisar de nuevo',
    revisando: 'Revisando…',
    otroCorreo: 'Entrar con otro correo',
    dudas: '¿Dudas?',
    // (pendiente de aprobar) tras "Ya pagué" la base sigue diciendo que no
    sinPago: 'Todavía no vemos el pago. A veces Hotmart tarda unos minutos en avisarnos: revisa de nuevo en un momento.',
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

  function revisar() {
    st.revisando = true;
    st.ultimoIntento = Date.now();
    return preguntar().then(function (res) {
      st.revisando = false;
      st.fallo = res.tipo === 'red';
      var d = A.decidir(st.decision ? st.decision.pase : null, Date.now(), res);
      // El pase solo cambia con una respuesta clara de la base; nunca se borra.
      if (res.tipo === 'ok') PP.guardar('pase', d.pase);
      aplicar(d);
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

  // ---------- Arranque (lo llama PP.iniciar) ----------
  // Con un pase vigente la app abre ya y la pregunta sigue de fondo; sin él, espera la respuesta.
  A.arrancar = function () {
    st.hola = /[?&]hola=1(&|$)/.test(location.search);
    if (st.hola && window.history && history.replaceState) history.replaceState(null, '', location.pathname + location.hash);
    return PP.leer('pase').then(function (pase) {
      st.decision = A.decidir(pase, Date.now(), null);
      ajustarMarco();
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

  // ---------- Tarjeta en el inicio (días 5 a 7 sin conexión, o sesión cerrada) ----------
  A.tarjetaInicio = function () {
    var d = st.decision;
    if (!d || !d.abierta || !d.pase) return '';
    var g = A.gracia(d.pase, Date.now()), fin = A.fechaHumana(g.fin), texto;
    if (d.motivo === 'sin_conexion' && st.fallo && g.dias >= 5) texto = TXT.diasSinRed.replace('{dias}', g.dias).replace('{fecha_fin}', fin);
    else if (d.motivo === 'entrar_pronto') texto = TXT.sesionCerrada.replace('{fecha_fin}', fin);
    else return '';
    return '<section class="aviso-acceso" role="status"><p>' + PP.esc(texto) + '</p>' +
      (d.motivo === 'entrar_pronto' ? '<a class="btn ancho" href="/entrar">' + TXT.entrar + '</a>' : '') + '</section>';
  };

  // ---------- Pantalla de bloqueo ----------
  function botonesAbiertos() {
    return '<div class="bloqueo-abiertas">' +
      '<button class="bloqueo-abierta" data-abrir="guia"><strong class="crece">' + PP.esc(TXT.guia) + '</strong><span aria-hidden="true">›</span></button>' +
      '<button class="bloqueo-abierta" data-abrir="calma"><strong class="crece">' + TXT.calma + '</strong><span aria-hidden="true">›</span></button>' +
      '</div>';
  }
  // En "Entra para abrir tu app" el fallo de la pregunta automática también se dice (si no,
  // pediría entrar a quien quizá ya entró); en las otras pantallas, solo el del botón.
  function mensajeRevision(motivo) {
    if (motivo === 'entrar' ? st.fallo : st.falloBoton) return TXT.fallo;
    return st.sinPago ? TXT.sinPago : '';
  }
  function etiquetaRevisar(motivo) {
    if (st.revisando) return TXT.revisando;
    if (motivo === 'entrar' || st.falloBoton) return TXT.reintentar;
    return motivo === 'sin_acceso' ? TXT.yaPague : TXT.revisarAhora;
  }
  // Siempre en la página (aunque vacío) para que el lector de pantalla lea el cambio.
  function estadoRevision(motivo) {
    return '<p class="bloqueo-msg" id="bloqueo-msg" role="status" aria-live="polite">' + PP.esc(mensajeRevision(motivo)) + '</p>';
  }

  PP.pantallas.bloqueo = {
    titulo: 'Paso a Paso',
    pintar: function (main) {
      var d = st.decision || { motivo: 'entrar' };
      var nombre = PP.estado.perfil.nombre;
      var html = '';
      if (d.motivo === 'sin_acceso') {
        html =
          '<section class="bloque"><h2 class="titular">' + TXT.pausaT + '</h2><p>' + PP.esc(TXT.pausaX.replace('{nombre}', nombre)) + '</p></section>' +
          '<section class="tarjeta destacada" aria-labelledby="abierto-t"><h3 id="abierto-t">' + TXT.abiertoT + '</h3><p>' + PP.esc(TXT.abiertoX) + '</p>' + botonesAbiertos() + '</section>' +
          '<a class="btn principal grande ancho" href="/paywall">' + TXT.reactivar + '</a>' +
          '<div class="bloqueo-enlaces">' +
          '<button class="enlace" data-revisar>' + etiquetaRevisar(d.motivo) + '</button>' +
          estadoRevision(d.motivo) +
          '<a class="enlace" href="/entrar">' + TXT.otroCorreo + '</a>' +
          '</div>' +
          '<p class="suave bloqueo-pie">' + TXT.dudas + ' <a href="mailto:' + CORREO + '">' + CORREO + '</a></p>';
      } else if (d.motivo === 'vencido_sin_conexion') {
        html =
          '<section class="bloque"><h2 class="titular">' + TXT.vencidoT + '</h2><p>' + PP.esc(TXT.vencidoX) + '</p></section>' +
          '<button class="btn principal grande ancho" data-revisar>' + etiquetaRevisar(d.motivo) + '</button>' +
          estadoRevision(d.motivo) +
          botonesAbiertos();
      } else { // 'entrar': sin sesión en este teléfono (y sin pase vigente)
        html =
          '<section class="bloque"><h2 class="titular">' + TXT.entrarT + '</h2><p>' + PP.esc(TXT.entrarX) + '</p></section>' +
          '<a class="btn principal grande ancho" href="/entrar">' + TXT.entrar + '</a>' +
          (st.fallo ? '<button class="btn ancho" data-revisar>' + etiquetaRevisar(d.motivo) + '</button>' : '') + estadoRevision(d.motivo) +
          botonesAbiertos();
      }
      main.innerHTML = '<div class="bloqueo">' + html + '</div>';

      main.onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.abrir) PP.ir(b.dataset.abrir);
        if (b.hasAttribute('data-revisar') && !st.revisando) revisarDesdeBoton(b);
      };
    }
  };

  // "Ya pagué: revisar de nuevo" / "Revisar ahora" / "Reintentar": la respuesta se muestra
  // en el mismo lugar (si cambia de pantalla, aplicar() ya la pintó).
  function revisarDesdeBoton(b) {
    var motivoAntes = st.decision.motivo;
    b.textContent = TXT.revisando;
    b.disabled = true;
    revisar().then(function (d) {
      if (d.motivo !== motivoAntes || !PP.actual || PP.actual.nombre !== 'bloqueo') return;
      st.falloBoton = st.fallo;
      st.sinPago = d.motivo === 'sin_acceso' && !st.fallo;
      b.disabled = false;
      b.textContent = etiquetaRevisar(d.motivo);
      document.getElementById('bloqueo-msg').textContent = mensajeRevision(d.motivo);
      b.focus();
    });
  }
})(window.PP);
