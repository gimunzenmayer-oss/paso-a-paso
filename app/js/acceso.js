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

  PP.acceso = { decidir: decidir, GRACIA_MS: GRACIA_MS };
})(typeof window !== 'undefined' ? window : globalThis);
