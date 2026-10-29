# VEREDICTO revisor-visual — correos
Fecha: 2026-10-25 02:34
Screenshot: docs/revisiones/correos-acceso-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: sin defectos críticos observados en el alcance visual local de ronda 2; redundancia menor en las instrucciones de rescate del correo de acceso.

## Ronda 2 — alcance del veredicto

LISTA para el alcance visual local revisado: nuevo tipo de plantilla email y formularios secundarios, incluidos resultado, error y reintento. No es autorización de lanzamiento ni certificación de entrega real. Las cifras de cabecera son los mínimos de las puntuaciones individuales, no el promedio ni la puntuación exclusiva de acceso. Sustituyen la evaluación de ronda 1.

Leídos nuevamente: ESTADO.md, FICHA-ARTE.md, FICHA-AVATAR.md, docs/revisiones/correos-mediciones.json, web/lib/correos/plantillas.ts, web/lib/correos/confirmacion.ts y web/app/api/correos/{baja,confirmar}/route.ts. Se mantiene la rúbrica de .claude/agents/revisor-visual.md leída en ronda 1. Se consultó además web/next.config.ts para comprobar si la política de scripts contradice el feedback inline: la configuración declarada permite scripts inline y formularios del mismo sitio; esto no constituye una prueba del comportamiento en ejecución.

Las ocho capturas se abrieron con view_image:

- docs/revisiones/correos-acceso-375.png
- docs/revisiones/correos-precobro-375.png
- docs/revisiones/correos-carrito_2h-375.png
- docs/revisiones/correos-baja-375.png
- docs/revisiones/correos-confirmar-375.png
- docs/revisiones/correos-resultado-375.png
- docs/revisiones/correos-error-375.png
- docs/revisiones/correos-reintentar-375.png

## Adaptaciones explícitas de las rúbricas

Se conserva la metodología de ronda 1: N/A no recibe ni cero ni cuatro. Usabilidad = suma aplicable / máximo aplicable ×40; craft = suma aplicable / máximo aplicable ×20. Redondeo al entero más próximo. Se muestran las sumas originales para evitar confundir estas cifras adaptadas con la suma literal de diez o cinco criterios.

Movimiento: N/A en los ocho casos. Email estático intencionado y compatible; formularios de una sola decisión sin necesidad de coreografía. No se exige animación, fuentes externas, hero comercial, fotografías ni contenido de app en estas vistas. Arial/sans-serif se admite como sustitución compatible. No se penalizan los márgenes de un mensaje corto ni se exige llenar el viewport.

H1: N/A en emails; en formularios se valora el feedback definido en código y en resultados el estado explícito visible. H9: N/A cuando la vista no es de error ni necesita resolver un error propio; en acceso sí se valora el rescate del enlace. H5: N/A en resultados informativos sin acción de modificación. H3/H7 se apoyan en enlaces y formularios nativos del código; no se inventan atajos ni deshacer para una preferencia que ya requiere confirmación.

Copy /20 de landing/paywall/upgrade: N/A. Carrito es un recordatorio comercial y se comprueba su tono/traza, sin exigir una página de ventas completa. Fidelidad comparativa: N/A, sin referencia externa. Se comprueba coherencia con la ficha, no se declara una comparación visual FIEL inexistente.

## Puntuaciones independientes

### Email de acceso

VEREDICTO: LISTA
USABILIDAD: 37/40 (detalle: h1:N/A h2:4 h3:4 h4:4 h5:3 h6:4 h7:3 h8:3 h9:4 h10:4; suma 33/36)
CRAFT: 16/20 (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:N/A encaje:4; suma 13/16)
COPY: N/A (servicio)
FIDELIDAD: N/A (sin referencia externa)

Código de seis dígitos separado del cuerpo en superficie hundida, instrucción visible de dónde introducirlo, enlace principal y rescate directo. H3/H9/H10 suben por una salida concreta ante caducidad, no solo una referencia verbal a otra página. H5 permanece en 3: escape, HTTPS y origen de acceso se verifican en código, sin prueba real del destino. H7 permanece en 3 porque existen dos vías de entrada, pero aquí no se ejecuta la introducción del código. H8 permanece en 3 por repetir el rescate en el cuerpo y junto al enlace secundario.

### Email de precobro

VEREDICTO: LISTA
USABILIDAD: 36/40 (detalle: h1:N/A h2:4 h3:3 h4:4 h5:3 h6:4 h7:3 h8:4 h9:N/A h10:4; suma 29/32)
CRAFT: 16/20 (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:N/A encaje:4; suma 13/16)
COPY: N/A (servicio)
FIDELIDAD: N/A (sin referencia externa)

Fecha/zona horaria, importe base/moneda y continuidad/cancelación se separan en tres bloques de dos o tres líneas a 375 px. No aparece código de acceso. Una acción principal conduce al portal de compras de Hotmart; H3/H7 quedan en 3 porque no es un enlace verificado a la suscripción concreta. H5 en 3: exige fecha/importe en el generador, pero no se demuestra aquí su procedencia real. La vista comunica qué ocurrirá y cómo evitar el cobro sin presión ni detalles de tarjeta.

### Email de carrito 2 h

VEREDICTO: LISTA
USABILIDAD: 36/40 (detalle: h1:N/A h2:4 h3:3 h4:4 h5:3 h6:4 h7:3 h8:4 h9:N/A h10:4; suma 29/32)
CRAFT: 16/20 (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:N/A encaje:4; suma 13/16)
COPY: N/A (recordatorio; no se aplica literalmente la rúbrica de landing)
FIDELIDAD: N/A (sin referencia externa)

Sin código ajeno a la tarea. Título, cuerpo breve, CTA de retomar y baja subrayada mantienen una jerarquía clara. La baja es secundaria legítima, no una segunda acción comercial competidora. H3/H7 en 3 por disponer de retorno y baja sin comprobarlos con una cuenta. H5 en 3: exige URL de baja para marketing; no se infiere de ello una prueba de consentimiento efectivo. Traza de lenguaje a objeciones 1 y 5 del avatar: poco tiempo, dudas y apoyo sin presión.

### Formulario de baja

VEREDICTO: LISTA
USABILIDAD: 37/40 (detalle: h1:3 h2:4 h3:4 h4:4 h5:3 h6:4 h7:3 h8:4 h9:4 h10:4; suma 37/40)
CRAFT: 16/20 (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:N/A encaje:4; suma 13/16)
COPY: N/A (preferencias)
FIDELIDAD: N/A (sin referencia externa)

Explica qué cesa y qué avisos continúan. GET no modifica preferencias; POST recibe la confirmación. El marco incorpora ayuda accionable y volver sin confirmar. H1 en 3 por mensaje de guardado, región role=status/aria-live y desactivación al enviar definidos en código; no se afirma una prueba de latencia ni lectura real por lector de pantalla. H5 en 3 por validación del enlace y prevención local de repetición del botón, sin certificar idempotencia del servidor. H9 considera las ramas de error y reintento revisadas.

### Formulario de confirmar solicitud

VEREDICTO: LISTA
USABILIDAD: 37/40 (detalle: h1:3 h2:4 h3:4 h4:4 h5:3 h6:4 h7:3 h8:4 h9:4 h10:4; suma 37/40)
CRAFT: 16/20 (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:N/A encaje:4; suma 13/16)
COPY: N/A (consentimiento)
FIDELIDAD: N/A (sin referencia externa)

La persona ve qué acepta y cómo dejar de recibirlo. Una confirmación, sin campos ni decisiones redundantes, ayuda y salida. H1/H5/H7 con los mismos límites de evidencia que baja: código de feedback y formulario nativo leídos, sin ejecutar persistencia. Las ramas de enlace vencido/usado permiten solicitar ayuda; el reintento temporal conserva la tarea.

### Resultado de baja

VEREDICTO: LISTA
USABILIDAD: 38/40 (detalle: h1:4 h2:4 h3:3 h4:4 h5:N/A h6:4 h7:3 h8:4 h9:N/A h10:4; suma 30/32)
CRAFT: 16/20 (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:N/A encaje:4; suma 13/16)
COPY: N/A (resultado)
FIDELIDAD: N/A (sin referencia externa)

La captura comunica que la baja quedó registrada y qué mensajes cesarán, con marco, ayuda y salida. H1=4 por la comunicación explícita del resultado mostrado; NO significa que se haya demostrado un cambio en la base de datos. No se exige un botón primario de nueva operación cuando el trámite ya terminó. H3/H7 en 3 porque solo ofrece volver y ayuda; no simula más acciones.

### Error de enlace

VEREDICTO: LISTA
USABILIDAD: 38/40 (detalle: h1:4 h2:4 h3:3 h4:4 h5:N/A h6:4 h7:3 h8:4 h9:4 h10:4; suma 34/36)
CRAFT: 16/20 (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:N/A encaje:4; suma 13/16)
COPY: N/A (error)
FIDELIDAD: N/A (sin referencia externa)

Explica que el enlace venció o no es válido y propone usar el último correo o contactar ayuda mediante enlace visible. No atribuye un guardado exitoso ni obliga a interpretar un código técnico. Las ramas POST actuales aportan también una instrucción útil; ya no terminan en «Enlace no válido.» sin solución. No se obliga a reintentar un enlace vencido.

### Reintento de fallo temporal

VEREDICTO: LISTA
USABILIDAD: 37/40 (detalle: h1:3 h2:4 h3:4 h4:4 h5:3 h6:4 h7:3 h8:4 h9:4 h10:4; suma 37/40)
CRAFT: 16/20 (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:N/A encaje:4; suma 13/16)
COPY: N/A (error recuperable)
FIDELIDAD: N/A (sin referencia externa)

Explica que no se pudo guardar, ofrece intentar de nuevo como acción principal y mantiene ayuda/salida. El código devuelve HTTP 503 con el mismo marco y formulario POST sin action, que vuelve a la URL actual. No se ejecutó una caída ni un reintento real contra servidor. H1/H5 en 3: prevención y feedback locales definidos, no validados en interacción.

## Fundamento visual común

Jerarquía 3: marca y firma discretas, título 24 px, cuerpo 18 px y auxiliares 13 px; CTA reconocible cuando hay una operación pendiente. No hay conflicto entre acciones, pero tampoco se adjudica excelencia excepcional a todos los ejes.

Profundidad 3: fondo #F2F4EF, superficie #FBFCF9, borde #E6ECE5 y sombra verde suave; acceso añade bloque hundido para el código. Las vistas de texto no necesitan una tercera tarjeta artificial. Se valora la separación efectiva, no la cantidad de adornos.

Identidad 3: firma estática de tres pasos salvia/niebla/hundido y repetición consistente del marco. Es una adaptación simplificada del sistema de pasos de la ficha, no una réplica de la tira con fotos y check ni una identidad exclusiva demostrada. No se afirma fidelidad literal a ese dispositivo. Cierra la ausencia de firma de ronda 1 sin exigir imágenes remotas.

Encaje 4: las ocho capturas mantienen márgenes simétricos, radios coherentes, texto y controles íntegros, sin solapes, cortes ni desbordamiento registrado. Los bloques y botones se ajustan al contenido; la tarjeta queda contenida incluso en acceso, la variante más extensa. Este 4 se limita al encaje de estas muestras a 375 px; no se extrapola a otros anchos o clientes.

## TOP DEFECTOS

1. [Acceso, segundo párrafo y enlace de rescate bajo el CTA] se repite la instrucción ante enlace vencido → opcionalmente acortar el segundo párrafo manteniendo el rescate enlazado. Menor, no bloqueante; ya reflejado en H8=3.

Sin defectos críticos observados en las ocho muestras. No se inventan defectos adicionales para llenar cinco posiciones. La ampliación de la firma estática no obliga a añadir movimiento ni fuentes externas.

## Cierre de los cuatro defectos de ronda 1

1. Resultados y errores: CORREGIDO. Todos pasan por marco HTML compartido; ayuda/volver presentes y fallo temporal con reintento. Evidencia: código de confirmacion.ts, rutas y tres capturas nuevas.
2. Código ajeno a la tarea: CORREGIDO. esAcceso limita su presencia a acceso/recuperacion/admin; precobro y carrito ya no lo muestran. El acceso explica dónde escribirlo y enlaza al rescate.
3. Párrafo largo de precobro: CORREGIDO. Fecha, precio y continuidad/cancelación se presentan en tres bloques breves.
4. Marco e identidad: CORREGIDO para el formato de correo y confirmación breve. Firma estática, borde, superficie y sombra consistentes; enlaces de ayuda de formularios usan salvia y conservan subrayado.

## Mediciones y alcance de las comprobaciones

El JSON actualizado registra ancho de viewport y contenido de 375 px en las ocho vistas. Coincide con la ausencia de desborde visible.

| Vista | CTA ancho × alto, px |
|---|---:|
| acceso | 211,11 × 56,80 |
| precobro | 220,05 × 56,80 |
| carrito_2h | 181,08 × 56,80 |
| baja | 177,06 × 53 |
| confirmar | 213,05 × 53 |
| reintentar | 180,11 × 53 |
| resultado / error | sin botón primario; enlaces de ayuda y volver |

Todos los CTA medidos superan 48 px de alto. El JSON no mide las áreas táctiles de enlaces auxiliares ni sus estados de foco; no se les atribuyen medidas inexistentes. El foco visible, botón activo y feedback al enviar se verificaron en código, no mediante interacción de esta revisión.

Los colores de CTA y superficie no cambiaron respecto de ronda 1: blanco/salvia 5,19:1; salvia/superficie 5,04:1; salvia/fondo 4,68:1; texto secundario/superficie 6,41:1. Son relaciones calculadas sobre colores CSS, no pruebas de todos los clientes.

Gate cognitivo: las ocho vistas tienen una misión; los párrafos caben en 3–4 líneas, no hay listas extensas ni campos innecesarios y el siguiente paso se identifica. En resultado/error los enlaces de ayuda o retorno son salidas suficientes; no hace falta agregar un CTA comercial.

No se ejecutaron envíos, cuentas, producción ni cambios de preferencias. No se probaron entrega, Reply-To efectivo, Gmail/Outlook/Apple Mail, modo oscuro, latencia, teclado real, lectura asistida, persistencia ni éxito de las URL de destino. Tampoco se ejecutaron build, lint o pruebas de integración: esto es el veredicto visual independiente, no el cierre técnico del proyecto. Envío desactivado según el alcance comunicado. Único archivo modificado: docs/revisiones/correos-veredicto.md.

Histórico: ronda 1 NO LISTA, mínimos 26/40 y 10/20; ronda 2 LISTA para revisión visual local, mínimos 36/40 y 16/20, con las adaptaciones N/A explícitas anteriores.
