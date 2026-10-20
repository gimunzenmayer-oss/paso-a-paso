# Cómo funciona el código (explicado sin tecnicismos)

## La app es como una obra de teatro

- **`index.html` es el escenario.** Tiene tres zonas fijas: la barra de arriba (título, Atrás, Ajustes), el centro (donde aparece cada pantalla) y el menú de abajo (Inicio, Agenda, Hablar, Calma, Más). También guarda, escondidos, el "escenario del niño" y el teclado del PIN.
- **`styles.css` es el vestuario.** Define colores, tamaños y letras. Todos los colores tienen nombre (`--salvia`, `--arena`...), así que cambiar un color en un sitio lo cambia en toda la app. Ahí también están el modo oscuro y el modo calma.
- **`js/app.js` es el director.** Decide qué pantalla sale a escena (`PP.ir('agenda')`), recuerda de dónde vienes para el botón Atrás y controla el modo niño.
- **`js/agenda.js` es el primer actor:** las pantallas de la agenda.
- **`js/datos.js` es el archivo de la familia.** Contiene las rutinas de ejemplo de Mateo y el "cajón" donde se guardan los cambios en el teléfono.
- **`js/voz.js` es la voz.** Lee los pasos en voz alta con la voz española o latina del teléfono.

## Dos zonas bien separadas

- **Zona de la familia** (lo que ves al abrir la app): menú de abajo con Inicio, Preparar, Diario, Guía y Más. Aquí preparas las herramientas, anotas en el diario, lees la guía y sacas el informe.
- **Espacio de Mateo** (`js/nino.js`): pantalla completa con botones enormes con foto: Mi día, Hablar, Esperar, Calma, Historias y Mis estrellas. No tiene menús de adultos. La casita (abajo a la izquierda) vuelve a su inicio; el candado (abajo a la derecha) sale a la zona de la familia manteniéndolo pulsado y escribiendo el PIN.
- En **Preparar** eliges qué botones ve Mateo en su espacio. En **Ajustes** puedes hacer que la app se abra directamente en su espacio.

## Qué pasa cuando Mateo pulsa "¡Hecho!"

1. Se apunta en el cajón que ese paso está hecho **hoy** (con la fecha; mañana empieza de cero solo).
2. La tarjeta se vuelve verde suave y aparece un ✓.
3. Sale una frase amable ("¡Lo hiciste!") y, si está activado, la voz la dice y suena un "ding" muy bajito.
4. Después de un momento pasa al siguiente paso y dice "Ahora: Ir al baño".

En modo calma no hay voz, ni sonido, ni movimientos, y el cambio de paso es más rápido.

## El modo niño y el PIN

Al pulsar "Empezar con Mateo" se esconde todo el menú y solo queda la rutina. Para salir hay un candado en la esquina: hay que **mantenerlo pulsado 2 segundos** (un toque rápido no hace nada) y escribir el PIN. El PIN de prueba es **1234** y se cambia en Ajustes.

## Módulo 2: el tablero para hablar (`js/tablero.js`)

- **Arriba**, una franja muestra lo último que dijo Mateo, con un botón para repetirlo. Así, si alguien no lo oyó, puede leerlo.
- **Debajo**, las **palabras fijas** (Sí, No, Ayuda, Para) están siempre a la vista, en cualquier categoría.
- **Después vienen las pestañas de categorías** (Quiero, Me siento, Necesito, Comida, Personas), cada una con su color suave para reconocerla rápido.
- **Al tocar un botón**, el teléfono dice la frase en voz alta y el botón se marca un momento con un borde verde.
- **La voz del tablero suena siempre**, aunque esté el modo calma, porque aquí la voz es la forma que tiene Mateo de comunicarse. En la agenda, en cambio, la voz es un extra y se puede apagar.
- **El adulto puede editar cada categoría:** añadir botones con un símbolo o una foto, cambiar la frase, el orden y el color. También puede elegir el tamaño de los botones: grandes (2 por fila), medianos (3) o pequeños (4).
- **Los datos de ejemplo** están en `js/datos.js`, en `PP.tableroEjemplo`. Cada botón es una línea como `b('💧', 'Quiero agua')`: el símbolo y la frase que dice.
- **El panel para elegir pictogramas** (`PP.elegirPicto`, en `agenda.js`) lo comparten la agenda y el tablero, así que si mejora uno, mejoran los dos.

## Guía para Familias (`js/guia-datos.js` y `js/guia.js`)

- **El texto y el diseño están separados.** Todas las fichas están en `guia-datos.js`, escritas como listas de frases. Para corregir un consejo o añadir una ficha, solo hay que tocar ese archivo; la pantalla se dibuja sola.
- **Cada ficha** tiene cinco partes: qué es, señales de alerta, qué hacer en el momento, qué NO hacer y qué hacer después. Algunas añaden un aviso de **ayuda urgente** (112) y atajos a otras herramientas de la app, como el tablero o la agenda.
- **"¿Está pasando ahora?"** reúne las situaciones más urgentes. Al tocar una, la app salta directa a "Qué hacer en el momento", para no tener que leer todo con prisa.
- **El buscador** encuentra palabras sin importar las tildes ("sueño" o "sueno").
- **Para marcar una ficha como urgente**, se añade `urgentes: true` en sus datos.

## Los módulos nuevos

- **Temporizador visual** (`js/temporizador.js`): un círculo verde que se va haciendo pequeño. Al terminar avisa con suavidad y enseña "Ahora toca…" si el adulto eligió qué viene después. El adulto decide qué botones de minutos ve Mateo.
- **Kit de calma** (`js/calma.js`): Respirar (un círculo que crece y encoge), Contar hasta 10, Lo que me ayuda (botones que hablan), ¿Cómo me siento? (termómetro de 5 colores con palabras) y Música.
- **Música para calmarse** (dentro de `calma.js`): lluvia, olas del mar, ruido suave, una nana de Brahms y campanitas. No son grabaciones: el propio teléfono crea el sonido, así que no hace falta internet, ni instalar nada, ni hay problemas de derechos de autor. Tiene volumen y apagado automático, y se para sola al salir de la pantalla.
- **Historias sociales** (`js/historias.js`): tres de ejemplo (médico, peluquería, cumpleaños). Se pueden editar y crear nuevas con imágenes o fotos propias. Mateo las ve página a página, con voz.
- **Diario privado** (`js/diario.js`): anotar un momento en 30 segundos (qué pasó, fuerza, duración, qué lo provocó, qué ayudó). Muestra un gráfico de los últimos 14 días y lo que más provoca y más ayuda. Trae entradas de ejemplo que se borran con un botón.
- **Logros y estrellas** (`js/logros.js`): Mateo gana una estrella al terminar una rutina entera; la familia apunta logros. Mateo los ve en "Mis estrellas".
- **Informe** (`js/informe.js`): resumen de 7 días, 30 días o 3 meses para llevar al profesional. Se imprime o se guarda como PDF desde la opción Imprimir.

## El PIN y el cifrado (`js/cifrado.js`)

- El PIN ya no se guarda tal cual, sino como una "huella" de la que no se puede sacar el número.
- El diario se guarda **cifrado** con una llave que sale del PIN: sin el PIN es texto sin sentido. Para cambiar el PIN hay que escribir antes el actual, y el diario se vuelve a cifrar solo.
- Aviso honesto: un PIN de 4 números protege de miradas curiosas, no de un experto con mucho tiempo.

## Fotos realistas y voz más humana

- **Fotos:** en `app/img/` están las fotos realistas: 8 generadas con Canva y 44 de Unsplash (uso gratuito, también comercial). Los nombres de quienes hicieron las de Unsplash están en `PP.creditosFotos` y se ven en Ajustes → Imágenes → Créditos de las fotos. `PP.fotosEjemplo` (en `js/datos.js`) dice qué foto va con cada texto, por ejemplo `'Despertar': 'img/despertar.jpg'`. Para añadir una foto nueva, guárdala en `img/` y añade una línea igual.
- **Qué imagen se ve:** primero, la foto propia de la familia si la hay. Después, la foto realista si en Ajustes está elegido "Fotos realistas". Si no hay ninguna de las dos, se ve el símbolo.
- **Voz:** la app puntúa las voces del teléfono y elige la que suele sonar más humana (las "naturales", "neuronales" o "mejoradas"). En Ajustes se puede elegir otra voz y la velocidad.
- **Tu propia voz:** en el editor de la agenda y del tablero, el botón 🎙 graba hasta 6 segundos. Si un paso o un botón tiene grabación, suena la grabación en lugar de la voz del teléfono.

## Cómo cambiar cosas tú misma

- **Los datos de ejemplo** están en `js/datos.js`, en `PP.datosEjemplo`. Cada paso es una línea como:
  `{ id: 'm3', texto: 'Vestirse', picto: '👕' }`. Puedes cambiar el texto o el símbolo.
- **Los colores** están al principio de `styles.css`.
- **Las frases de ánimo** están en `js/agenda.js`, en `FRASES`.
- **Los colores de las categorías** del tablero están al principio de `styles.css` (`--cat-salvia`, `--cat-niebla`...).

## Probarla en el ordenador

Abre una terminal en la carpeta `app` y escribe `python3 -m http.server 8000`; luego visita `http://localhost:8000` en el navegador. Para publicarla de verdad (y que se pueda instalar en el móvil y funcione sin internet) se sube la carpeta `app` a un servicio como Vercel o Netlify.

## Qué falta todavía (a propósito)

- **Pictogramas definitivos:** ahora son símbolos de muestra. Hay que elegir una colección con licencia que permita uso comercial; ARASAAC no lo permite.
