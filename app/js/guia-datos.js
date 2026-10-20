/* =========================================================
   guia-datos.js — el TEXTO de la Guía para Familias
   ---------------------------------------------------------
   Aquí solo hay contenido, nada de diseño. Para corregir
   o añadir una ficha basta con editar este archivo.
   Cada ficha tiene:
     titulo, picto, resumen  → lo que se ve en la lista
     quees                   → qué es (un párrafo)
     senales                 → señales de alerta temprana
     momento                 → qué hacer en el momento
     evitar                  → qué NO hacer
     despues                 → qué hacer después
     urgente (opcional)      → cuándo pedir ayuda inmediata
     herramientas (opcional) → atajos a otras partes de la app
   Revisado con criterio clínico general. Cada niño es distinto:
   estas fichas no sustituyen el plan de su terapeuta.
   ========================================================= */
window.PP = window.PP || {};

(function (PP) {
  PP.guia = {
    secciones: [
      { id: 'dificiles', nombre: 'Momentos difíciles', desc: 'Qué hacer antes, durante y después', listo: true },
      { id: 'pronto2', nombre: 'Próximas secciones', desc: 'Las añadiremos cuando me digas cuáles quieres' }
    ],

    fichas: [
      {
        id: 'crisis', titulo: 'Crisis por sobrecarga', picto: '🌋', urgentes: true,
        resumen: 'Cuando todo es demasiado y su cuerpo ya no puede más.',
        quees: 'Es una reacción involuntaria del sistema nervioso cuando se acumula demasiado: ruido, cansancio, cambios, hambre, emociones. Puede verse como llanto intenso, gritos, tirarse al suelo o golpear. No es una rabieta ni una forma de manipular: en ese momento tu hijo o hija no puede controlarlo, igual que nadie controla un ataque de pánico.',
        senales: [
          'Se tapa los oídos o los ojos, o busca esconderse.',
          'Aumentan los movimientos repetitivos (aletear, balancearse, girar).',
          'Habla menos, repite frases o deja de responder.',
          'Se irrita con cosas que normalmente tolera.',
          'Inquietud: no para quieto, camina de un lado a otro.'
        ],
        momento: [
          'Primero, la seguridad: aparta objetos peligrosos y, si hace falta, a otros niños.',
          'Baja los estímulos: apaga la tele, baja luces, aléjate del ruido si podéis.',
          'Habla muy poco, con voz baja y frases cortas: "Estoy aquí. Estás a salvo."',
          'Dale espacio. Mantente cerca sin tocar, salvo que sepas que el contacto le calma.',
          'Ofrece su objeto de calma (cascos, mantita, peluche) sin insistir.',
          'Espera. La crisis baja sola cuando el cuerpo se regula; tu calma le ayuda.'
        ],
        evitar: [
          'Hacer preguntas, dar explicaciones largas o razonar.',
          'Gritar, castigar o amenazar: aumenta la sobrecarga.',
          'Sujetarle salvo que haya peligro real e inmediato.',
          'Rodearle de gente o dejar que otros miren y opinen.',
          'Exigir que pida perdón o que hable en ese momento.'
        ],
        despues: [
          'Dale tiempo de descanso tranquilo; suele quedar agotado.',
          'Ofrece agua, algo de comer y un lugar cómodo.',
          'Cuando esté calmado, conecta sin reproches: un abrazo si lo quiere, o simplemente estar.',
          'Anota en el diario qué pasó antes (lugar, hora, sueño, comida, ruido) para encontrar patrones.',
          'Cuídate tú también: es normal sentirse agotado o con ganas de llorar.'
        ],
        urgente: 'Si hay riesgo de que se haga daño grave o lo haga a otros y no puedes evitarlo, llama al 112 (o al número de emergencias de tu país).',
        herramientas: ['calma']
      },
      {
        id: 'bloqueo', titulo: 'Bloqueo o desconexión', picto: '🐢', urgentes: true,
        resumen: 'Se queda quieto, en silencio, como "apagado".',
        quees: 'Es otra forma de responder a la sobrecarga, pero hacia dentro: el niño se retira, deja de hablar, no responde o se queda inmóvil. Desde fuera puede parecer que ignora o que está tranquilo, pero por dentro está desbordado.',
        senales: [
          'Mirada perdida o evita mirar.',
          'Respuestas cada vez más cortas o ninguna.',
          'Se aísla en un rincón o debajo de una mesa.',
          'Movimientos lentos o se queda quieto.',
          'Deja a medias lo que estaba haciendo.'
        ],
        momento: [
          'Acepta el silencio: no le obligues a hablar ni a mirarte.',
          'Ofrece un espacio tranquilo y protegido donde pueda quedarse.',
          'Usa el tablero o tarjetas para que pueda comunicar sin palabras ("necesito descanso").',
          'Quita exigencias: la tarea, la salida o la visita pueden esperar.',
          'Quédate cerca y disponible, sin presionar.'
        ],
        evitar: [
          'Interpretarlo como desobediencia o mala educación.',
          'Insistir con preguntas: "¿Qué te pasa? ¡Contéstame!"',
          'Tocarle o moverle de golpe.',
          'Llenar el silencio con ruido o con muchas personas.'
        ],
        despues: [
          'Deja que vuelva a su ritmo; puede necesitar horas.',
          'Reduce las demandas el resto del día.',
          'Anota qué lo provocó: muchas veces es acumulación (cole + ruido + poco sueño).',
          'Piensa con su terapeuta cómo darle descansos antes de llegar a ese punto.'
        ],
        herramientas: ['tablero']
      },
      {
        id: 'frustracion', titulo: 'Enfado o frustración', picto: '😤',
        resumen: 'Algo no sale como esperaba y no sabe expresarlo.',
        quees: 'A diferencia de la crisis por sobrecarga, aquí el niño tiene cierto control y suele buscar algo: que le den un objeto, terminar una actividad, que algo pare. Muchas veces es la única forma que encuentra de comunicar una necesidad o un "no".',
        senales: [
          'Pide algo con insistencia y no llega.',
          'Le cuesta una tarea y empieza a quejarse.',
          'Mira tu reacción mientras protesta.',
          'Aparece en momentos concretos (al apagar la tablet, al salir del parque).'
        ],
        momento: [
          'Pon nombre a lo que siente: "Estás enfadado porque se acabó la tablet."',
          'Mantén el límite con calma y pocas palabras si es necesario.',
          'Ofrece dos opciones aceptables: "¿Guardamos la tablet tú o yo?"',
          'Enséñale cómo pedirlo: con el tablero, un gesto o una palabra.',
          'Refuerza enseguida cualquier forma tranquila de comunicar.'
        ],
        evitar: [
          'Ceder justo cuando el enfado es más fuerte (aprende que así funciona).',
          'Discutir o dar sermones largos.',
          'Ridiculizar o comparar con otros niños.',
          'Retirar el cariño como castigo.'
        ],
        despues: [
          'Cuando esté tranquilo, practica en un momento de juego cómo pedir o decir "no".',
          'Anticipa las transiciones difíciles con el temporizador visual o la agenda.',
          'Revisa si hay una necesidad detrás (hambre, cansancio, aburrimiento).'
        ],
        herramientas: ['tablero', 'agenda']
      },
      {
        id: 'sensorial', titulo: 'Sobrecarga sensorial', picto: '🔊', urgentes: true,
        resumen: 'Ruido, luces, olores o multitudes que le desbordan.',
        quees: 'Muchas personas autistas perciben los sonidos, luces, texturas u olores con mucha más intensidad. Un supermercado, una fiesta o un secador de pelo pueden resultar dolorosos de verdad. Si no se atiende a tiempo, puede terminar en crisis o bloqueo.',
        senales: [
          'Se tapa los oídos, cierra los ojos o se pega a ti.',
          'Quiere irse, tira de tu mano.',
          'Aumentan los movimientos repetitivos.',
          'Se queja de la ropa, de olores o de luces.'
        ],
        momento: [
          'Sal del lugar o busca un rincón más tranquilo cuanto antes.',
          'Ofrece cascos de cancelación de ruido, gorra o gafas de sol.',
          'Habla poco y en voz baja.',
          'Ofrece presión profunda si le gusta (abrazo firme, mantita pesada).'
        ],
        evitar: [
          'Decir "no es para tanto" o "no pasa nada": para él sí pasa.',
          'Obligarle a quedarse "para que se acostumbre".',
          'Añadir más estímulos (cantar, hablar mucho, poner música).'
        ],
        despues: [
          'Dale un rato de calma en casa, con poca estimulación.',
          'Anota qué estímulo fue el más difícil.',
          'Para la próxima: ir en horas tranquilas, llevar el kit sensorial y avisar con una historia social.',
          'Habla con su terapeuta ocupacional sobre su perfil sensorial.'
        ],
        herramientas: ['calma']
      },
      {
        id: 'cambios', titulo: 'Cambios inesperados', picto: '🔀',
        resumen: 'Un plan que cambia, una ruta distinta, una visita sorpresa.',
        quees: 'La previsibilidad da seguridad. Cuando algo cambia sin aviso, el niño pierde ese mapa mental y puede sentir mucha ansiedad, aunque el cambio parezca pequeño (otra ruta al cole, otra maestra, la piscina cerrada).',
        senales: [
          'Pregunta una y otra vez por el plan original.',
          'Se aferra a una rutina o a un objeto.',
          'Protesta, llora o se niega a moverse.'
        ],
        momento: [
          'Explica el cambio con pocas palabras y con apoyo visual: "Piscina cerrada. Ahora: parque."',
          'Muestra qué viene después en la agenda visual.',
          'Valida: "Querías ir a la piscina. Es difícil cuando cambia el plan."',
          'Si es posible, deja que elija entre dos alternativas.'
        ],
        evitar: [
          'Esconder el cambio hasta el último segundo.',
          'Dar explicaciones largas o muchos detalles a la vez.',
          'Burlarse de su necesidad de rutina.'
        ],
        despues: [
          'Introduce en la agenda un símbolo de "cambio" o "sorpresa" y practícalo en situaciones agradables.',
          'Anticipa los cambios conocidos con días de antelación (calendario, historia social).',
          'Celebra cuando gestione bien un cambio.'
        ],
        herramientas: ['agenda']
      },
      {
        id: 'autolesion', titulo: 'Se hace daño a sí mismo', picto: '🩹', urgentes: true,
        resumen: 'Golpearse la cabeza, morderse, arañarse.',
        quees: 'A veces el niño se golpea o se muerde cuando siente dolor, frustración, sobrecarga o porque busca una sensación intensa. Es una forma de comunicar o regularse, no un capricho. Siempre conviene consultarlo con su pediatra y su terapeuta, porque puede haber dolor físico detrás (oídos, dientes, estómago).',
        senales: [
          'Se toca o golpea suavemente una zona antes de hacerlo fuerte.',
          'Aparece con más frecuencia cuando está cansado, enfermo o sobrecargado.',
          'Señales de dolor: se toca el oído, la boca o la tripa.'
        ],
        momento: [
          'Protege sin pelear: pon un cojín entre su cabeza y la pared, o tu mano.',
          'Baja estímulos y exigencias de inmediato.',
          'Ofrece una alternativa sensorial segura (morder un mordedor, apretar una pelota, presión firme).',
          'Mantén la calma y habla poco.'
        ],
        evitar: [
          'Reaccionar con alarma o gritos (puede aumentar la tensión).',
          'Castigar.',
          'Sujetar con fuerza salvo para evitar una lesión grave.'
        ],
        despues: [
          'Revisa si hay heridas y cúralas con calma.',
          'Anota cuándo pasó, qué ocurrió antes y si podía haber dolor.',
          'Consulta con su pediatra y terapeuta; un plan individual es lo más eficaz.'
        ],
        urgente: 'Si hay un golpe fuerte en la cabeza, sangrado que no para o te preocupa una lesión, acude a urgencias o llama al 112 (o al número de emergencias de tu país).'
      },
      {
        id: 'agresion', titulo: 'Agresión hacia otros', picto: '🤚',
        resumen: 'Pega, empuja, muerde o tira cosas a otras personas.',
        quees: 'Suele aparecer cuando el niño está desbordado o no tiene otra forma de decir "para", "déjame" o "no quiero". Detrás casi siempre hay miedo, sobrecarga o una necesidad que no consigue comunicar.',
        senales: [
          'Alguien invade su espacio o toca sus cosas.',
          'Ya está nervioso o en sobrecarga.',
          'Tensión en el cuerpo, puños apretados, mirada fija.'
        ],
        momento: [
          'Pon distancia y protege a la otra persona, sin dramatismo.',
          'Retira lo que pueda lanzar o romper.',
          'Usa pocas palabras y firmes: "Para. Manos abajo."',
          'Ofrece una salida: un espacio de calma o la tarjeta de "necesito espacio".'
        ],
        evitar: [
          'Devolver el golpe o usar castigo físico.',
          'Gritar o acorralarle.',
          'Obligarle a pedir perdón en ese momento.'
        ],
        despues: [
          'Atiende a la otra persona y, con calma, explica a los demás que fue un momento de sobrecarga.',
          'Cuando esté tranquilo, practica formas de decir "para" (tablero, gesto).',
          'Busca el patrón: con quién, dónde y qué pasó antes.',
          'Si se repite, pide ayuda a su terapeuta para un plan de apoyo conductual positivo.'
        ],
        herramientas: ['tablero']
      },
      {
        id: 'fuga', titulo: 'Se escapa o sale corriendo', picto: '🏃', urgentes: true,
        resumen: 'Sale corriendo en la calle, el parque o se va de casa.',
        quees: 'Algunos niños salen corriendo para huir de algo que les agobia o para ir hacia algo que les atrae (agua, trenes, un lugar favorito). Es una de las situaciones de mayor riesgo, sobre todo cerca de carreteras o agua.',
        senales: [
          'Mira hacia la salida o hacia algo que le llama la atención.',
          'Se suelta de la mano o se aleja poco a poco.',
          'Ya está sobrecargado en un lugar ruidoso.'
        ],
        momento: [
          'Corre detrás sin gritar su nombre de forma alarmante; usa una palabra clave practicada ("¡Quieto!").',
          'Si le pierdes de vista, busca primero cerca del agua y de las carreteras.',
          'Pide ayuda a quienes estén cerca con una descripción clara (ropa, edad, que no habla).',
          'Si no le encuentras en pocos minutos, llama al 112.'
        ],
        evitar: [
          'Perder tiempo buscando solo/a: pide ayuda pronto.',
          'Regañar con gritos al encontrarle (puede volver a huir).'
        ],
        despues: [
          'Revisa la seguridad de casa: cerraduras altas, alarmas en puertas.',
          'Lleva una pulsera o tarjeta identificativa con tu teléfono.',
          'Practica "stop" y "dame la mano" como juego.',
          'Enséñale a nadar o pide información sobre seguridad en el agua si le atrae.'
        ],
        urgente: 'Si no le encuentras, llama al 112 (o al número de emergencias de tu país) cuanto antes y di que es un niño autista que puede no responder a su nombre.'
      },
      {
        id: 'sueno', titulo: 'Problemas para dormir', picto: '🌙',
        resumen: 'Le cuesta dormirse o se despierta de noche.',
        quees: 'Las dificultades de sueño son muy frecuentes en el autismo: cuesta conciliar, hay despertares largos o se levanta muy temprano. Dormir mal aumenta la irritabilidad y las crisis al día siguiente, para el niño y para toda la familia.',
        senales: [
          'Está muy activo a la hora de dormir.',
          'Pide repetir rituales una y otra vez.',
          'Se despierta y no vuelve a dormirse.'
        ],
        momento: [
          'Mantén la habitación oscura, en silencio y con temperatura agradable.',
          'Si se despierta, actúa con muy poca luz, poca voz y sin pantallas.',
          'Repite siempre el mismo ritual corto (agenda de noche).'
        ],
        evitar: [
          'Pantallas en la hora antes de dormir.',
          'Cambiar el ritual cada noche.',
          'Darle medicación o suplementos (como melatonina) sin consultar al pediatra.'
        ],
        despues: [
          'Lleva un registro de sueño durante dos semanas para el pediatra.',
          'Revisa posibles causas: dolor, reflujo, ronquidos, miedo.',
          'Pide ayuda: existen pautas específicas de sueño para niños autistas.'
        ],
        herramientas: ['agenda']
      },
      {
        id: 'comida', titulo: 'Rechazo de comidas', picto: '🥦',
        resumen: 'Come muy pocos alimentos o rechaza muchos.',
        quees: 'La selectividad alimentaria es muy común y suele estar ligada a la sensibilidad a texturas, colores u olores, no a "ser caprichoso". Forzar suele empeorar la situación.',
        senales: [
          'Arcadas o asco con ciertas texturas.',
          'Solo acepta alimentos de una marca, color o forma.',
          'Se pone nervioso cuando ve comida nueva en su plato.'
        ],
        momento: [
          'Pon siempre en el plato algo que sí come.',
          'Presenta un alimento nuevo en muy poca cantidad y sin presión.',
          'Deja que lo explore: tocarlo, olerlo, chuparlo ya es un paso.',
          'Come tú ese alimento delante, con naturalidad.'
        ],
        evitar: [
          'Obligar, chantajear o castigar.',
          'Esconder alimentos dentro de otros (pierde la confianza).',
          'Convertir cada comida en una batalla.'
        ],
        despues: [
          'Celebra los pequeños pasos en la sección de logros.',
          'Consulta con el pediatra si pierde peso o la lista de alimentos es muy corta.',
          'Un terapeuta ocupacional o nutricionista con experiencia en TEA puede ayudar mucho.'
        ]
      },
      {
        id: 'medico', titulo: 'Médico o dentista', picto: '🩺',
        resumen: 'Visitas que generan miedo y mucha ansiedad.',
        quees: 'Las consultas mezclan muchas dificultades: lugar desconocido, esperas, ruido, contacto físico y sensaciones intensas. Prepararlas bien reduce mucho la ansiedad.',
        senales: [
          'Se pone nervioso al reconocer el camino o la sala de espera.',
          'Se niega a entrar o a sentarse en la camilla.'
        ],
        momento: [
          'Pide la primera cita del día para evitar esperas.',
          'Explica en la consulta que tu hijo es autista y qué le ayuda.',
          'Usa la agenda visual con los pasos de la visita.',
          'Lleva su objeto de calma y algo que le guste para después.'
        ],
        evitar: [
          'Mentir ("no te va a doler") si va a haber una vacuna o un pinchazo.',
          'Sujetarle por sorpresa.'
        ],
        despues: [
          'Refuerza con algo que le guste.',
          'Anota qué ayudó para la próxima vez.',
          'Prepara una historia social con fotos del centro de salud.'
        ],
        herramientas: ['agenda']
      },
      {
        id: 'publico', titulo: 'Miradas y comentarios en público', picto: '👀',
        resumen: 'Cuando otras personas juzgan sin entender.',
        quees: 'Durante una crisis en la calle o en una tienda, es habitual recibir miradas o comentarios ("le hace falta mano dura"). Esto añade mucho estrés a la familia, justo cuando más calma hace falta.',
        senales: [
          'Notas que tu tensión sube por lo que puedan pensar.',
          'Alguien se acerca a opinar.'
        ],
        momento: [
          'Tu prioridad es tu hijo, no los demás.',
          'Si quieres, una frase corta basta: "Es autista y está desbordado. Lo tengo controlado, gracias."',
          'Puedes llevar una tarjeta informativa para entregar sin tener que hablar.',
          'Si alguien ofrece ayuda útil (traer agua, apartar a gente), acéptala.'
        ],
        evitar: [
          'Discutir con desconocidos en ese momento.',
          'Reñir a tu hijo para "quedar bien".'
        ],
        despues: [
          'Date permiso para sentir lo que sientas: rabia, vergüenza o tristeza son normales.',
          'Habla con alguien de confianza o con otras familias.',
          'Recuerda: lo estás haciendo lo mejor que puedes.'
        ]
      }
    ]
  };
})(window.PP);
