/* =========================================================
   acceso.js — ¿Esta familia puede usar la app?
   ---------------------------------------------------------
   La cuenta solo decide el acceso; los datos nunca salen del
   teléfono. Al abrir, la app usa el "pase" guardado y pregunta
   al servidor en segundo plano (/api/acceso). Sin internet, el
   pase vale 7 días desde la última comprobación buena. Un error
   de red o del servidor NO bloquea: solo un "no" explícito.
   ========================================================= */
(function (raiz) {
  var PP = raiz.PP = raiz.PP || {};
  var GRACIA_MS = 7 * 24 * 60 * 60 * 1000;

  // pase: { acceso, estado, verificado_en } o null
  // respuesta: null (aún no se sabe) | { tipo: 'ok', acceso, estado } | { tipo: 'red' } | { tipo: 'sin_sesion' }
  // Devuelve { abierta, motivo, pase }: motivo explica qué pantalla mostrar.
  function decidir(pase, ahora, respuesta) {
    if (respuesta && respuesta.tipo === 'ok') {
      var nuevo = { acceso: !!respuesta.acceso, estado: respuesta.estado || '', verificado_en: ahora };
      return { abierta: nuevo.acceso, motivo: nuevo.acceso ? 'ok' : 'sin_acceso', pase: nuevo };
    }
    var vigente = !!(pase && pase.acceso && typeof pase.verificado_en === 'number' && ahora - pase.verificado_en <= GRACIA_MS);
    if (respuesta && respuesta.tipo === 'sin_sesion') {
      return { abierta: vigente, motivo: vigente ? 'entrar_pronto' : 'entrar', pase: pase || null };
    }
    // Sin respuesta todavía, o sin internet / servidor caído
    if (vigente) return { abierta: true, motivo: 'sin_conexion', pase: pase };
    if (pase && pase.acceso) return { abierta: false, motivo: 'vencido_sin_conexion', pase: pase };
    if (pase && !pase.acceso) return { abierta: false, motivo: 'sin_acceso', pase: pase };
    return { abierta: false, motivo: 'entrar', pase: null };
  }

  // Lo que respondió GET /api/acceso → la "respuesta" que entiende decidir().
  // status: código HTTP (0 = no hubo respuesta: sin internet o se cortó); cuerpo: el JSON o null.
  // Solo un 200 con acceso true/false es una respuesta; un 401 con sin_sesion es "sin sesión".
  // Todo lo demás (sin red, 5xx, 404, la página de un wifi público...) cuenta como sin conexión.
  function leerRespuesta(status, cuerpo) {
    var c = cuerpo && typeof cuerpo === 'object' ? cuerpo : {};
    if (status === 200 && typeof c.acceso === 'boolean' && typeof c.estado === 'string') {
      return { tipo: 'ok', acceso: c.acceso, estado: c.estado };
    }
    if (status === 401 && c.sin_sesion === true) return { tipo: 'sin_sesion' };
    return { tipo: 'red' };
  }

  // Para los avisos sin internet (docs/copy/embudo.md §5.3): días desde la última
  // comprobación buena y el momento en que se acaba la gracia.
  var DIA_MS = 24 * 60 * 60 * 1000;
  function gracia(pase, ahora) {
    return { dias: Math.max(0, Math.floor((ahora - pase.verificado_en) / DIA_MS)), fin: pase.verificado_en + GRACIA_MS };
  }

  // "28 de octubre", en la hora del teléfono
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function fechaHumana(ms) {
    var d = new Date(ms);
    return d.getDate() + ' de ' + MESES[d.getMonth()];
  }

  PP.acceso = { decidir: decidir, GRACIA_MS: GRACIA_MS, leerRespuesta: leerRespuesta, gracia: gracia, fechaHumana: fechaHumana };
})(typeof window !== 'undefined' ? window : globalThis);
