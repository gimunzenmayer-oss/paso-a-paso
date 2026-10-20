/* =========================================================
   cifrado.js — el PIN y el candado del diario
   ---------------------------------------------------------
   1) El PIN no se guarda tal cual: se guarda una "huella"
      (un resumen del que no se puede sacar el PIN).
   2) El diario se guarda CIFRADO con una llave que sale del
      PIN. Sin el PIN, lo guardado es un texto sin sentido.
   Usa el cifrado que ya trae el navegador (AES-GCM).
   Aviso honesto: un PIN de 4 números protege de miradas
   curiosas, no de un experto con mucho tiempo.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  var sutil = window.crypto && crypto.subtle;
  var VUELTAS = 150000; // cuántas veces se "remueve" el PIN: hace más lento adivinarlo

  function aB64(buf) { var b = new Uint8Array(buf), s = ''; for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); return btoa(s); }
  function deB64(t) { var s = atob(t), b = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b; }
  function azar(n) { return crypto.getRandomValues(new Uint8Array(n)); }

  function base(pin) { return sutil.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits', 'deriveKey']); }

  PP.cifrado = {
    disponible: !!sutil,
    nuevaSal: function () { return aB64(azar(16)); },
    // Huella del PIN (para comprobarlo sin guardarlo)
    huella: function (pin, sal) {
      return base(pin).then(function (k) {
        return sutil.deriveBits({ name: 'PBKDF2', salt: deB64(sal), iterations: VUELTAS, hash: 'SHA-256' }, k, 256);
      }).then(aB64);
    },
    // Llave para cifrar el diario
    llave: function (pin, sal) {
      return base(pin).then(function (k) {
        return sutil.deriveKey({ name: 'PBKDF2', salt: deB64(sal), iterations: VUELTAS, hash: 'SHA-256' }, k,
          { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
      });
    },
    cifrar: function (llave, datos) {
      var iv = azar(12);
      return sutil.encrypt({ name: 'AES-GCM', iv: iv }, llave, new TextEncoder().encode(JSON.stringify(datos)))
        .then(function (c) { return { iv: aB64(iv), datos: aB64(c) }; });
    },
    descifrar: function (llave, caja) {
      return sutil.decrypt({ name: 'AES-GCM', iv: deB64(caja.iv) }, llave, deB64(caja.datos))
        .then(function (t) { return JSON.parse(new TextDecoder().decode(t)); });
    }
  };

  // ¿Es este el PIN correcto? Devuelve una promesa con true o false.
  PP.comprobarPin = function (pin) {
    var p = PP.estado.perfil;
    if (p.pinHuella && PP.cifrado.disponible) return PP.cifrado.huella(pin, p.pinSal).then(function (h) { return h === p.pinHuella; });
    return Promise.resolve(pin === p.pin);
  };

  // Guardar un PIN nuevo (como huella, si el navegador lo permite)
  PP.fijarPin = function (pin) {
    var p = PP.estado.perfil;
    p.pinDePrueba = pin === '1234';
    if (!PP.cifrado.disponible) { p.pin = pin; return Promise.resolve(); }
    p.pinSal = PP.cifrado.nuevaSal();
    return PP.cifrado.huella(pin, p.pinSal).then(function (h) { p.pinHuella = h; delete p.pin; });
  };
})(window.PP);
