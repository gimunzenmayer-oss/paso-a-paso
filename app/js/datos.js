/* =========================================================
   datos.js — los datos de la app y cómo se guardan
   ---------------------------------------------------------
   Aquí viven:
   1) Los DATOS DE EJEMPLO de Mateo (6 años), para que la app
      no empiece vacía.
   2) Un pequeño "cajón" para guardar y leer datos en el
      propio teléfono (IndexedDB). Nada se envía a internet.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  // ---------- 1. Datos de ejemplo ----------
  // Cada rutina es una lista de pasos. Cada paso tiene:
  //   texto  → lo que se lee y se ve
  //   picto  → el símbolo (en la versión final, un pictograma con licencia adecuada)
  //   foto   → opcional: una foto propia que sustituye al símbolo
  PP.datosEjemplo = function () {
    return {
      perfil: {
        nombre: 'Mateo',
        edad: 6,
        pin: '1234',          // PIN del adulto para salir del modo niño
        acento: 'espana',     // 'espana' o 'latino'
        leerEnVoz: true,      // leer cada paso en voz alta al tocarlo
        sonido: false,        // sin sonidos salvo que el adulto lo active
        modoCalma: false,     // sin animaciones ni sonidos, colores más apagados
        imagenes: 'fotos',    // 'fotos' (realistas) o 'simbolos'
        vozNombre: '',        // '' = la voz más natural del teléfono
        velocidad: 0.9,       // velocidad de la voz (1 = normal)
        // Qué herramientas ve Mateo en su espacio
        espacio: { agenda: true, tablero: true, temporizador: true, calma: true, historias: true, logros: true },
        abrirEnEspacio: false // abrir la app directamente en el espacio de Mateo
      },
      rutinas: [
        {
          id: 'manana', nombre: 'Mañana', hora: '07:30', picto: '🌅',
          pasos: [
            { id: 'm1', texto: 'Despertar', picto: '🛏️' },
            { id: 'm2', texto: 'Ir al baño', picto: '🚽' },
            { id: 'm3', texto: 'Vestirse', picto: '👕' },
            { id: 'm4', texto: 'Desayunar', picto: '🥣' },
            { id: 'm5', texto: 'Lavarse los dientes', picto: '🪥' },
            { id: 'm6', texto: 'Ponerse los zapatos', picto: '👟' },
            { id: 'm7', texto: 'Tomar la mochila', picto: '🎒' }
          ]
        },
        {
          id: 'tarde', nombre: 'Volver de la escuela', hora: '16:30', picto: '🏠',
          pasos: [
            { id: 't1', texto: 'Quitarse los zapatos', picto: '👟' },
            { id: 't2', texto: 'Lavarse las manos', picto: '🧼' },
            { id: 't3', texto: 'Merendar', picto: '🍎' },
            { id: 't4', texto: 'Rato tranquilo', picto: '🧸' },
            { id: 't5', texto: 'Jugar en el parque', picto: '🛝' }
          ]
        },
        {
          id: 'noche', nombre: 'Noche', hora: '20:00', picto: '🌙',
          pasos: [
            { id: 'n1', texto: 'Cenar', picto: '🍽️' },
            { id: 'n2', texto: 'Bañarse', picto: '🛁' },
            { id: 'n3', texto: 'Ponerse el pijama', picto: '🩳' },
            { id: 'n4', texto: 'Lavarse los dientes', picto: '🪥' },
            { id: 'n5', texto: 'Leer un cuento', picto: '📖' },
            { id: 'n6', texto: 'Dormir', picto: '😴' }
          ]
        }
      ],
      // Qué pasos se han hecho HOY en cada rutina: { manana: {fecha, hechos:[...]}}
      progreso: {},
      tablero: PP.tableroEjemplo(),
      // Temporizador: los minutos que Mateo puede elegir y qué viene después
      temporizador: { minutos: [1, 2, 5, 10], despues: null },
      // Kit de calma: segundos de cada respiración y "lo que me ayuda"
      calma: {
        respirar: 4,
        cosas: [
          { id: PP.nuevoId(), picto: '🤗', texto: 'Quiero un abrazo' },
          { id: PP.nuevoId(), picto: '🎧', texto: 'Quiero mis audífonos' },
          { id: PP.nuevoId(), picto: '🛋️', texto: 'Necesito un descanso' },
          { id: PP.nuevoId(), picto: '🤫', texto: 'Necesito silencio' },
          { id: PP.nuevoId(), picto: '💧', texto: 'Quiero agua' },
          { id: PP.nuevoId(), picto: '🧸', texto: 'Quiero mi peluche' }
        ]
      },
      historias: PP.historiasEjemplo(),
      // Logros que la familia apunta, y estrellas que gana al terminar rutinas
      logros: [
        { id: PP.nuevoId(), fecha: PP.diasAtras(5), picto: '🍝', texto: 'Probó la pasta con tomate' },
        { id: PP.nuevoId(), fecha: PP.diasAtras(3), picto: '💬', texto: 'Pidió ayuda con el tablero' },
        { id: PP.nuevoId(), fecha: PP.diasAtras(1), picto: '🛝', texto: 'Esperó su turno en el parque' }
      ],
      estrellas: [12, 11, 9, 8, 6, 5, 4, 2, 1, 1].map(function (d, i) {
        var r = ['manana', 'noche', 'tarde'][i % 3];
        return { fecha: PP.diasAtras(d), rutina: r, nombre: { manana: 'Mañana', tarde: 'Volver de la escuela', noche: 'Noche' }[r] };
      }),
      // Cuántas veces se toca cada botón del tablero (para el informe)
      uso: { tablero: {} }
    };
  };

  // Completa datos guardados con una versión antigua de la app:
  // añade lo que falte sin tocar lo que la familia ya ha cambiado.
  PP.completarDatos = function (e) {
    var nuevo = PP.datosEjemplo();
    ['tablero', 'temporizador', 'calma', 'historias', 'logros', 'estrellas', 'uso'].forEach(function (k) {
      if (!e[k]) e[k] = nuevo[k];
    });
    if (!e.perfil.espacio) e.perfil.espacio = nuevo.perfil.espacio;
    if (e.perfil.abrirEnEspacio == null) e.perfil.abrirEnEspacio = false;
    return e;
  };

  // Fecha de hace n días, como texto '2026-10-15'
  PP.diasAtras = function (n) {
    var d = new Date(); d.setDate(d.getDate() - n);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  // Historias sociales de ejemplo. Están escritas como recomiendan las
  // historias sociales: en primera persona, frases cortas, describiendo
  // lo que va a pasar y qué puede hacer Mateo si algo le molesta.
  PP.historiasEjemplo = function () {
    var h = function (titulo, picto, paginas) {
      return { id: PP.nuevoId(), titulo: titulo, picto: picto, paginas: paginas.map(function (p) { return { id: PP.nuevoId(), picto: p[0], texto: p[1] }; }) };
    };
    return [
      h('Voy al médico', '🩺', [
        ['🩺', 'A veces voy al médico. El médico cuida de mi salud.'],
        ['🚗', 'Voy con mamá o con papá.'],
        ['⏳', 'En la sala de espera hay otras personas. Puedo esperar con mis audífonos o mirando un cuento.'],
        ['👂', 'El médico me mira los oídos, la boca y escucha mi corazón. Puede estar un poco frío. No duele.'],
        ['✋', 'Si algo me molesta, puedo decir «Para» o apretar la mano de mamá.'],
        ['🏠', 'Cuando terminamos, volvemos a casa. ¡Lo hice muy bien!']
      ]),
      h('Me corto el pelo', '💇', [
        ['💇', 'Cuando el pelo crece mucho, me lo cortan.'],
        ['🪑', 'Me siento en una silla especial. Me ponen una capa para no llenarme de pelitos.'],
        ['✂️', 'Las tijeras hacen ruido: «chas, chas». Cortar el pelo no duele.'],
        ['🎧', 'Si hay mucho ruido, puedo ponerme los audífonos o contar hasta diez.'],
        ['🪞', 'Al terminar me miro en el espejo. ¡Tengo el pelo nuevo!']
      ]),
      h('Vamos a un cumpleaños', '🎂', [
        ['🎂', 'Hoy vamos al cumpleaños de un amigo.'],
        ['🎈', 'Habrá niños, música y juegos. A veces hay mucho ruido.'],
        ['🛋️', 'Si necesito descansar, puedo ir a un sitio tranquilo con mamá.'],
        ['🕯️', 'Cantamos «Cumpleaños feliz» y mi amigo sopla las velas.'],
        ['🍰', 'Puedo comer pastel si quiero. Si no quiero, también está bien.'],
        ['🏠', 'Después volvemos a casa. ¡Fue un día especial!']
      ])
    ];
  };

  // Fotos realistas de ejemplo (unas generadas con Canva y otras de
  // Unsplash, de uso libre), según el texto
  // del paso o botón. Para añadir más: guarda la foto en la carpeta
  // img/ y añade aquí una línea 'Texto exacto': 'img/archivo.jpg'.
  PP.fotosEjemplo = {
    'Despertar': 'img/despertar.jpg',
    'Ir al baño': 'img/bano.jpg',
    'Quiero ir al baño': 'img/bano.jpg',
    'Desayunar': 'img/desayunar.jpg',
    'Quiero agua': 'img/agua.jpg',
    'Beber agua': 'img/agua.jpg',
    'Vestirse': 'img/vestirse.jpg',
    'Lavarse los dientes': 'img/dientes.jpg',
    'Ponerse los zapatos': 'img/zapatos.jpg',
    'Quitarse los zapatos': 'img/zapatos.jpg',
    'Zapatos': 'img/zapatos.jpg',
    'Coger la mochila': 'img/mochila.jpg',
    'Tomar la mochila': 'img/mochila.jpg',
    'Mochila': 'img/mochila.jpg',
    'Esperar': 'img/espera.jpg',
    'Calma': 'img/descanso.jpg',
    'Historias': 'img/cuento.jpg',
    'Hablar': 'img/ayuda.jpg',
    'Mis estrellas': 'img/contento.jpg',
    'Quiero mi peluche': 'img/tranquilo.jpg',
    'Lo que me ayuda': 'img/abrazo.jpg',
    'Mañana': 'img/manana.jpg',
    'Volver del cole': 'img/tarde.jpg',
    'Volver de la escuela': 'img/tarde.jpg',
    'Noche': 'img/noche.jpg',
    'Lavarse las manos': 'img/manos.jpg',
    'Merendar': 'img/manzana.jpg',
    'Manzana': 'img/manzana.jpg',
    'Rato tranquilo': 'img/tranquilo.jpg',
    'Jugar en el parque': 'img/parque.jpg',
    'Parque': 'img/parque.jpg',
    'Cenar': 'img/cenar.jpg',
    'Quiero comer': 'img/cenar.jpg',
    'Comer': 'img/cenar.jpg',
    'Pasta': 'img/cenar.jpg',
    'Bañarse': 'img/banarse.jpg',
    'Leer un cuento': 'img/cuento.jpg',
    'Quiero un cuento': 'img/cuento.jpg',
    'Cuento': 'img/cuento.jpg',
    'Dormir': 'img/dormir.jpg',
    'Sí': 'img/si.jpg',
    'No': 'img/no.jpg',
    'Ayuda': 'img/ayuda.jpg',
    'Para': 'img/para.jpg',
    'Quiero jugar': 'img/jugar.jpg',
    'Quiero un abrazo': 'img/abrazo.jpg',
    'Abrazo': 'img/abrazo.jpg',
    'Quiero salir': 'img/salir.jpg',
    'Quiero música': 'img/musica.jpg',
    'Música': 'img/musica.jpg',
    'Estoy contento': 'img/contento.jpg',
    'Contento': 'img/contento.jpg',
    'Estoy triste': 'img/triste.jpg',
    'Triste': 'img/triste.jpg',
    'Estoy enfadado': 'img/enfadado.jpg',
    'Enfadado': 'img/enfadado.jpg',
    'Estoy enojado': 'img/enfadado.jpg',
    'Enojado': 'img/enfadado.jpg',
    'Estoy cansado': 'img/cansado.jpg',
    'Cansado': 'img/cansado.jpg',
    'Tengo miedo': 'img/miedo.jpg',
    'Miedo': 'img/miedo.jpg',
    'Me duele': 'img/duele.jpg',
    'Tengo calor': 'img/calor.jpg',
    'Tengo frío': 'img/frio.jpg',
    'Necesito un descanso': 'img/descanso.jpg',
    'Necesito silencio': 'img/silencio.jpg',
    'Hay mucho ruido': 'img/ruido.jpg',
    'Quiero mis cascos': 'img/cascos.jpg',
    'Quiero mis audífonos': 'img/cascos.jpg',
    'Necesito espacio': 'img/espacio.jpg',
    'Espera, por favor': 'img/espera.jpg',
    'Plátano': 'img/platano.jpg',
    'Pan': 'img/pan.jpg',
    'Leche': 'img/leche.jpg',
    'Beber leche': 'img/leche.jpg',
    'Galleta': 'img/galleta.jpg',
    'Zumo': 'img/zumo.jpg',
    'Jugo': 'img/zumo.jpg',
    'Mamá': 'img/mama.jpg',
    'Papá': 'img/papa.jpg',
    'Abuela': 'img/abuela.jpg',
    'Profesora': 'img/seno.jpg',
    'Amigo': 'img/amigo.jpg',
    'Yo': 'img/yo.jpg'
  };

  // Quién hizo cada foto de Unsplash (se muestra en Ajustes → Imágenes)
  PP.creditosFotos = [
    { que: "Abuela", autor: "Hosein Sediqi", usuario: "hoseinsediqii" },
    { que: "Amigo", autor: "Jay Chen", usuario: "forhiskingdom" },
    { que: "Ayuda", autor: "Andrey K", usuario: "anamnesis33" },
    { que: "Bañarse", autor: "Timothy Dykes", usuario: "timothycdykes" },
    { que: "Cenar", autor: "Eaters Collective", usuario: "eaterscollective" },
    { que: "Dormir", autor: "Richard Stachmann", usuario: "stachmann" },
    { que: "Espera, por favor", autor: "Nathan Dumlao", usuario: "nate_dumlao" },
    { que: "Estoy cansado", autor: "Xia Yang", usuario: "imrxia" },
    { que: "Estoy contento", autor: "Mieke Campbell", usuario: "miekelauren" },
    { que: "Estoy enojado", autor: "Vitaly Gariev", usuario: "silverkblack" },
    { que: "Estoy triste", autor: "Anna Khromova", usuario: "anna_khromova" },
    { que: "Galleta", autor: "Vyshnavi Bisani", usuario: "vyshnavibisani" },
    { que: "Hay mucho ruido", autor: "aboodi vesakaran", usuario: "aboodi_vm" },
    { que: "Jugar en el parque", autor: "Se. Tsuchiya", usuario: "s_tsuchiya" },
    { que: "Lavarse las manos", autor: "Sean Horsburgh", usuario: "seanhorsburgh" },
    { que: "Leche", autor: "Kim Leary", usuario: "kimleary" },
    { que: "Leer un cuento", autor: "Ben Mullins", usuario: "benmullins" },
    { que: "Mamá", autor: "Dion Martins", usuario: "dionmartins" },
    { que: "Mañana", autor: "Jordan Wozniak", usuario: "j_wozy" },
    { que: "Me duele", autor: "Diana Polekhina", usuario: "diana_pole" },
    { que: "Merendar", autor: "Amit Lahav", usuario: "amit_lahav" },
    { que: "Necesito espacio", autor: "Matthew Smith", usuario: "whale" },
    { que: "Necesito silencio", autor: "Balint Mendlik", usuario: "balintm" },
    { que: "Necesito un descanso", autor: "Clay Banks", usuario: "claybanks" },
    { que: "No", autor: "Markus Spiske", usuario: "markusspiske" },
    { que: "Noche", autor: "Aron Visuals", usuario: "aronvisuals" },
    { que: "Pan", autor: "Louise Lyshøj", usuario: "louiogbearnaisen" },
    { que: "Papá", autor: "Dominic Chasse", usuario: "keepitchassephotography" },
    { que: "Para", autor: "Saif71.com", usuario: "saif71" },
    { que: "Plátano", autor: "Mockup Graphics", usuario: "mockupgraphics" },
    { que: "Quiero jugar", autor: "Vanessa Bucceri", usuario: "vbcreative" },
    { que: "Quiero mis audífonos", autor: "C D-X", usuario: "cdx2" },
    { que: "Quiero música", autor: "Alireza Attari", usuario: "alireza_attari" },
    { que: "Quiero salir", autor: "Casper van Battum", usuario: "cvbattum" },
    { que: "Quiero un abrazo", autor: "Bethany Beck", usuario: "bethanybeck" },
    { que: "Rato tranquilo", autor: "Carter Baran", usuario: "carterbaran" },
    { que: "Profesora", autor: "Quilia", usuario: "heyquilia" },
    { que: "Sí", autor: "Sincerely Media", usuario: "sincerelymedia" },
    { que: "Tengo calor", autor: "Rajiv Bajaj", usuario: "rajiv63" },
    { que: "Tengo frío", autor: "Paige Cody", usuario: "paige_cody" },
    { que: "Tengo miedo", autor: "Caleb Woods", usuario: "caleb_woods" },
    { que: "Volver de la escuela", autor: "Dale Pike", usuario: "grogger" },
    { que: "Yo", autor: "🇸🇮 Janko Ferlič", usuario: "itfeelslikefilm" },
    { que: "Jugo", autor: "ABHISHEK HAJARE", usuario: "abhishek_hajare" }
  ];

  // Tablero de comunicación de ejemplo.
  // 'fijos' son las palabras que siempre se ven (vocabulario núcleo).
  // Cada categoría tiene un color suave para que Mateo las reconozca.
  PP.tableroEjemplo = function () {
    var b = function (picto, texto) { return { id: PP.nuevoId(), picto: picto, texto: texto }; };
    return {
      columnas: 3,
      fijos: [b('👍', 'Sí'), b('👎', 'No'), b('🙋', 'Ayuda'), b('✋', 'Para')],
      categorias: [
        { id: 'quiero', nombre: 'Quiero', color: 'salvia', botones: [
          b('💧', 'Quiero agua'), b('🍽️', 'Quiero comer'), b('🧸', 'Quiero jugar'), b('🚽', 'Quiero ir al baño'),
          b('🤗', 'Quiero un abrazo'), b('🌳', 'Quiero salir'), b('🎵', 'Quiero música'), b('📖', 'Quiero un cuento')] },
        { id: 'siento', nombre: 'Me siento', color: 'niebla', botones: [
          b('😊', 'Estoy contento'), b('😢', 'Estoy triste'), b('😠', 'Estoy enojado'), b('🥱', 'Estoy cansado'),
          b('😨', 'Tengo miedo'), b('🤕', 'Me duele'), b('🥵', 'Tengo calor'), b('🥶', 'Tengo frío')] },
        { id: 'necesito', nombre: 'Necesito', color: 'arena', botones: [
          b('🛋️', 'Necesito un descanso'), b('🤫', 'Necesito silencio'), b('🙉', 'Hay mucho ruido'), b('🎧', 'Quiero mis audífonos'),
          b('🧍', 'Necesito espacio'), b('⏳', 'Espera, por favor'), b('🔁', 'Otra vez'), b('✅', 'Terminé')] },
        { id: 'comida', nombre: 'Comida', color: 'melocoton', botones: [
          b('🍎', 'Manzana'), b('🍌', 'Plátano'), b('🍞', 'Pan'), b('🥛', 'Leche'),
          b('🍪', 'Galleta'), b('🍝', 'Pasta'), b('🥣', 'Yogur'), b('🧃', 'Jugo')] },
        { id: 'personas', nombre: 'Personas', color: 'lavanda', botones: [
          b('👩', 'Mamá'), b('👨', 'Papá'), b('👵', 'Abuela'), b('👩‍🏫', 'Profesora'), b('🧒', 'Amigo'), b('🙂', 'Yo')] }
      ]
    };
  };

  // Biblioteca de símbolos para elegir al crear pasos (por categorías)
  PP.biblioteca = [
    { cat: 'Higiene', items: [['🚽', 'Ir al baño'], ['🪥', 'Lavarse los dientes'], ['🧼', 'Lavarse las manos'], ['🛁', 'Bañarse'], ['🚿', 'Ducharse'], ['💇', 'Peinarse']] },
    { cat: 'Ropa', items: [['👕', 'Vestirse'], ['👖', 'Pantalón'], ['🧦', 'Calcetines'], ['👟', 'Zapatos'], ['🧥', 'Abrigo'], ['🩳', 'Pijama']] },
    { cat: 'Comida', items: [['🥣', 'Desayunar'], ['🍽️', 'Comer'], ['🍎', 'Merendar'], ['🥛', 'Beber leche'], ['💧', 'Beber agua'], ['🥪', 'Sándwich']] },
    { cat: 'Fuera', items: [['🎒', 'Mochila'], ['🏫', 'Ir a la escuela'], ['🚗', 'Ir en coche'], ['🚌', 'Autobús'], ['🛝', 'Parque'], ['🛒', 'Supermercado']] },
    { cat: 'Jugar y descansar', items: [['🧸', 'Rato tranquilo'], ['🧩', 'Rompecabezas'], ['🎨', 'Pintar'], ['📖', 'Cuento'], ['🎵', 'Música'], ['😴', 'Dormir']] },
    { cat: 'Emociones', items: [['😊', 'Contento'], ['😢', 'Triste'], ['😠', 'Enojado'], ['😨', 'Miedo'], ['🥱', 'Cansado'], ['🤕', 'Me duele']] },
    { cat: 'Personas', items: [['👩', 'Mamá'], ['👨', 'Papá'], ['👵', 'Abuela'], ['👴', 'Abuelo'], ['👩‍🏫', 'Profesora'], ['🧒', 'Amigo']] },
    { cat: 'Respuestas', items: [['👍', 'Sí'], ['👎', 'No'], ['🙋', 'Ayuda'], ['✋', 'Para'], ['➕', 'Más'], ['✅', 'Terminé']] },
    { cat: 'Salud', items: [['💊', 'Medicina'], ['🩺', 'Médico'], ['🦷', 'Dentista'], ['🧘', 'Respirar'], ['🤗', 'Abrazo'], ['🛏️', 'Despertar']] }
  ];

  // ---------- 2. El "cajón" donde se guarda todo ----------
  // IndexedDB es una pequeña base de datos dentro del navegador.
  // Si el navegador no la permite (modo privado, etc.), usamos
  // memoria temporal para que la app siga funcionando igual.
  var memoria = {};
  var bdPromesa = null;

  function abrirBD() {
    if (bdPromesa) return bdPromesa;
    bdPromesa = new Promise(function (ok) {
      try {
        var pet = indexedDB.open('paso-a-paso', 1);
        pet.onupgradeneeded = function () { pet.result.createObjectStore('cajon'); };
        pet.onsuccess = function () { ok(pet.result); };
        pet.onerror = function () { ok(null); };
      } catch (e) { ok(null); }
    });
    return bdPromesa;
  }

  // Guardar un valor con un nombre (por ejemplo 'estado')
  PP.guardar = function (clave, valor) {
    memoria[clave] = valor;
    return abrirBD().then(function (bd) {
      if (!bd) return;
      try {
        var tx = bd.transaction('cajon', 'readwrite');
        tx.objectStore('cajon').put(JSON.parse(JSON.stringify(valor)), clave);
      } catch (e) { /* seguimos con la copia en memoria */ }
    });
  };

  // Leer un valor guardado; si no existe devuelve null
  PP.leer = function (clave) {
    return abrirBD().then(function (bd) {
      if (!bd) return memoria[clave] || null;
      return new Promise(function (ok) {
        try {
          var pet = bd.transaction('cajon').objectStore('cajon').get(clave);
          pet.onsuccess = function () { ok(pet.result || null); };
          pet.onerror = function () { ok(memoria[clave] || null); };
        } catch (e) { ok(memoria[clave] || null); }
      });
    });
  };

  // Fecha de hoy como texto '2026-10-19' (para saber qué se hizo hoy)
  PP.hoy = function () {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  // Crea un identificador único para pasos y rutinas nuevas
  PP.nuevoId = function () { return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); };
})(window.PP);
