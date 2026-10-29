# Panel independiente — Dirección de arte

Fecha: 2026-10-27. Proyecto: Paso a Paso. Diagnóstico, sin implementación.

## Veredicto

**¿Compraría con mi tarjeta? No todavía.** La presentación promete una rutina inmediata y acompañamiento específico, pero la primera pantalla de una familia nueva antepone configurar foto/PIN y entrar al espacio infantil a la rutina que acaba de probar. El acabado pierde consistencia entre venta y uso cotidiano: flechas deformadas, imágenes de estilos y significados dispares, tira de pasos partida y visualizaciones pequeñas. El precio mostrado no resuelve esa pérdida de confianza. Es mi decisión como comprador hipotético; no demuestra rechazo del mercado.

No recomiendo cambiar la paleta ni sustituir la app por otra estética. Recomiendo ejecutar con disciplina el sistema que la dueña ya eligió.

## Evidencia y límites

- Leídos completos: ESTADO.md, FICHA-ARTE.md, FICHA-AVATAR.md, FICHA-MERCADO.md, FICHA-MODELO.md, 16-DIRECCION-DE-ARTE.md y RUBRICAS-DE-PANTALLA.md. Las secciones actuales de ESTADO prevalecen sobre las históricas. No consulté informes de otros expertos ni veredictos históricos; sus puntajes no se reutilizan aquí.
- Abrí imágenes reales mediante `view_image` antes de puntuar. Para landing, la evidencia válida es **landing-completa-lenta-375.png** y sus seis recortes **landing-lenta-detalle-01..06-375.png**. Son una sola pantalla. El sexto recorte es una franja residual sin contenido evaluable.
- La primera captura rápida de landing y sus recortes quedan retirados. La recaptura lenta y landing-scroll-verificacion.json resuelven sus vacíos: las secciones están visibles; las cinco respuestas FAQ ocultas están colapsadas. **No son un defecto de producto ni reciben penalización.**
- También abrí onboarding-01..09, paywall-configurado-01..03, entrada-375, core-01..04 y los siete core-demo-* entregados. Abrí los tres paywall sin configuración como comparación de estados, sin contarlos como pantallas comerciales adicionales.
- Control final de evidencia: abrí con `view_image` **onboarding-03-estable-375.png**, **onboarding-04-estable-375.png** y **paywall-configurado-01-estable-375.png**. Estas sustituyen las tres capturas anteriores para la evaluación de esas vistas; no son pantallas adicionales. `capturas-estables-verificacion.json` registra opacidad 1 en sus controles, fotos con ancho positivo donde corresponden y ancho/scrollWidth 375. Las cuatro opciones de cada pregunta y las tres fotos del resumen están visibles. Se resuelve la incertidumbre anterior sin cambios de producto.
- Core-01..04: familia nueva. Informe y diario allí están cerrados con PIN: no son informes vacíos. Core-demo: historial de ejemplo, no datos de compradores. El PIN de demostración permitió inspeccionar la interfaz; no demuestra seguridad del acceso.
- LEEME describe navegador aislado de 375×812, movimiento reducido, solicitudes externas bloqueadas y acceso simulado solo para ver herramientas. `evidencia.json` registra ancho/scrollWidth 375 y errores vacíos. No se certifican otros dispositivos o estados.
- La posición de una barra fija en una imagen fullPage no se interpreta como fallo de anclaje. No afirmo que quede lejos del fondo ni que impida alcanzar contenido al desplazarse.
- La variante configurada usa un enlace público solo en el proceso local. No hubo clic de compra ni compra→correo→acceso comprobados. La variante sin checkout es configuración de entorno: **no se contabiliza como defecto visual ni pago roto**. Ocho respuestas HTTP 200 de fixtures tampoco certifican una venta.
- Revisé código visual de landing/embudo, entrada/cuenta, estilos y módulos de la PWA; adicionalmente, estructuras de admin, legales, errores, guía gratuita y correo. Sin capturas actuales de esas superficies secundarias no les asigno notas visuales inventadas. Tampoco quedan certificados tablero infantil, historias, temporizador, ajustes, errores/offline, impresión ni desktop.
- No uso precios de competidores, tasas de conversión ni benchmarks del SO como hechos de este nicho. No fue necesaria investigación externa para estos hallazgos. US$4,99/mes describe la oferta local observada, no validación de precio o rentabilidad. No asumo IA activa.

Los archivos de evidencia citados están en `docs/revisiones/panel-2026-10-27/`. Las referencias de código son relativas a la raíz del proyecto y corresponden a las líneas leídas durante esta auditoría.

## Notas /10 solicitadas

| Área | Nota | Interpretación y certeza |
|---|---:|---|
| Diseño | **6/10** | Ámbito principal. Jerarquía desigual entre venta y app, defectos ópticos y semántica de imágenes. Confianza media-alta en las vistas capturadas. |
| Copy | **6/10** | Perspectiva secundaria: varias frases presentan resultados o registros futuros como hechos. No es evaluación clínica ni investigación con madres. |
| Conversión | **5/10** | Perspectiva secundaria sobre claridad y continuidad percibidas. No es conversión medida ni prueba de checkout. |
| Retención | **5/10** | Perspectiva secundaria: el historial se acumula, pero no se hace suficientemente visible cómo cambia la próxima acción. Sin cohortes ni uso D1–D7 observado. |
| Negocio | **5/10** | Perspectiva secundaria sobre demostración del valor recurrente. No puntúa margen, demanda ni viabilidad financiera, desconocidos aquí. |

Son notas cualitativas del panel. La rúbrica de mi especialidad es craft /20; copy /10 es una perspectiva complementaria, no una certificación de copy /20.

## Craft /20, con desglose

Cinco ejes canónicos: J jerarquía, P profundidad, I identidad propia, M movimiento, O encaje óptico; cada uno /4. Corte documental: 16/20. Estas notas no sustituyen usabilidad /40 ni certificación de lanzamiento.

J/P/I/O proceden del render contrastado con código. M es una estimación sobre implementación: las capturas tienen movimiento reducido y no son un video. No atribuyo animación a una imagen fija ni asigno M=4 sin verificar las siete animaciones aplicables en ejecución. En la PWA hay entradas y feedback CSS; en sus datos faltan conteos y crecimiento de gráficos. No propongo añadir estímulos para ganar puntos mecánicamente.

| Vista / evidencia | J | P | I | M | O | Total |
|---|---:|---:|---:|---:|---:|---:|
| Landing completa lenta y recortes | 3 | 3 | 3 | 3 | 3 | **15/20** |
| Onboarding 01: nombre | 3 | 3 | 2 | 3 | 3 | **14/20** |
| Onboarding 02: edad | 2 | 2 | 1 | 3 | 3 | **11/20** |
| Onboarding 03: momento, captura estable | 3 | 3 | 2 | 3 | 3 | **14/20** |
| Onboarding 04: crisis, captura estable | 3 | 3 | 1 | 3 | 3 | **13/20** |
| Onboarding 05: reconocimiento | 3 | 3 | 3 | 3 | 3 | **15/20** |
| Onboarding 06: compromiso | 2 | 3 | 3 | 3 | 3 | **14/20** |
| Onboarding 07: armando | 2 | 3 | 3 | 3 | 3 | **14/20** |
| Onboarding 08: rutina | 3 | 3 | 3 | 3 | 2 | **14/20** |
| Onboarding 09: primera victoria | 2 | 3 | 3 | 3 | 2 | **13/20** |
| Paywall 01 configurado, captura estable | 3 | 3 | 3 | 3 | 3 | **15/20** |
| Paywall 02 configurado | 2 | 3 | 3 | 3 | 3 | **14/20** |
| Paywall 03 configurado | 2 | 3 | 2 | 3 | 3 | **13/20** |
| Entrada: correo | 3 | 3 | 3 | 3 | 3 | **15/20** |
| Inicio familia nueva | 2 | 3 | 1 | 2 | 1 | **9/20** |
| Inicio demo | 2 | 3 | 1 | 2 | 3 | **11/20** |
| Agenda nueva y demo: misma composición | 2 | 3 | 3 | 2 | 2 | **12/20** |
| Puertas PIN: informe y diario nuevos | 3 | 2 | 1 | 2 | 3 | **11/20** |
| Diario demo abierto | 2 | 3 | 1 | 2 | 3 | **11/20** |
| Anotar: selección inicial | 2 | 2 | 1 | 2 | 3 | **10/20** |
| Informe demo abierto | 2 | 3 | 1 | 2 | 3 | **11/20** |
| Kit de calma adulto | 2 | 3 | 2 | 2 | 3 | **12/20** |
| Rutina del niño | 3 | 3 | 3 | 2 | 2 | **13/20** |

Las capturas estables resuelven las tres vistas antes no concluyentes. **Onboarding 03: 14/20**: cuatro opciones completas con selección diferenciada; identidad 2 porque las miniaturas de escena, comida y objeto no forman una gramática propia consistente, en línea con el hallazgo 4. **Onboarding 04: 13/20**: la jerarquía distingue pregunta, opciones y CTA, pero identidad 1 por depender de un formulario de tarjetas intercambiable sin el dispositivo propio de rutina. **Paywall 01: 15/20**: la tira de tres fotos y check ya está visible; el límite sigue en la jerarquía entre titular, respuestas y resumen, sin una ejecución excepcional que justifique 4. Movimiento conserva la estimación de código ya declarada; las nuevas imágenes estáticas no certifican animación. No hay evidencia de opciones perdidas ni fotos rotas en estas tres vistas.

La actualización añade las tres notas de craft sin modificar las cinco notas /10, los doce hallazgos, sus prioridades ni el veredicto de compra: las capturas previas habían quedado sin puntuar y no se habían usado como fallos concluyentes. No se conserva ninguna penalización por aparición incompleta o fotos pendientes de carga.

Movimiento contrastado en `web/components/embudo/ui.tsx:361`, `web/components/embudo/ui.tsx:376`, `web/components/embudo/Onboarding.tsx`, `web/components/cuenta/Entrar.tsx:50`, `web/components/landing/ui.tsx:125` y `app/styles.css:631`. En datos: `app/js/diario.js:139`, `app/js/informe.js:64` y `app/styles.css:587` muestran gráficos/tablas sin las animaciones de datos de la rúbrica. Modo calma/reducción de movimiento: `app/styles.css:89` y `app/styles.css:91`.

## Fidelidad al contrato e intercambiabilidad

La referencia es **la app existente**, según FICHA-ARTE; la cubierta Hotmart no interviene en este juicio. Comparé las capturas de app con las de venta y entrada, además de `app/styles.css` y los tokens web.

| Prueba del 16 | Resultado |
|---|---|
| Modo claro | Coincide. No hay fundamento para exigir otro modo. |
| Familia del acento | Continúan salvia y niebla. Web usa fondo #eef2eb frente a #F2F4EF de ficha: desviación menor, no ruptura de dirección. |
| Clase tipográfica | Coinciden Lexend/Atkinson. La escala se ejecuta irregularmente: hallazgo 8. |
| Radios ±4px por función | Cards/botones principales conservan 18/14. La flecha de primeros pasos es una excepción defectuosa por colisión de estilos. |
| Densidad | Continúan tarjetas y listas; el inicio nuevo acumula puertas antes de la tarea. No exijo igual densidad a una landing y una pantalla infantil. |
| Sombras | Se conserva sombra suave tintada. No recomiendo brillo o textura ajenos al contrato. |

**Fidelidad: continuidad del sistema base, ejecución incompleta.** No identifico dos rupturas globales de modo/acento/clase tipográfica que justifiquen reemplazar la identidad. Hay que corregir jerarquía, componentes e imágenes dentro del sistema.

**Test de intercambiabilidad:** tapando nombre/logo, la pregunta de edad, las puertas PIN y las tarjetas del inicio podrían pertenecer a otra app familiar de bienestar sin una diferencia importante. Foto→paso→check caracteriza mejor las rutinas, pero está ausente del protagonista del inicio familiar: allí hay paisaje y barra. Identidad parcial, dependiente del contenido; no exclusividad demostrada frente a todo el mercado. No investigué todos los competidores u otros proyectos para afirmar singularidad absoluta.

**Única cosa a conservar:** la composición infantil «Ahora → foto grande → ¡Hecho! → Después» de core-demo-rutina-nino-375.png. Debe ordenar el resto, corrigiendo la tira superior sin sustituir su lógica.

## Hallazgos priorizados

Tamaños estimados: S menor a una hora; M varias horas; L intervención transversal de más de una sesión. No son compromisos de duración. Daño describe una consecuencia de diseño plausible, no pérdida de ventas medida.

### 1. La primera sesión no da protagonismo a lo que acaba de vender

**Alta · M. Hecho observado:** core-01-inicio-375 muestra «Tus primeros pasos», «Pon una foto de tu casa», «Crea tu PIN» y «Espacio de Mateo» antes de «Ahora toca». La rutina empieza por debajo del primer viewport. En core-demo-inicio aparece antes porque no hay tarjeta de configuración. Código: `app/js/app.js:333`, `app/js/app.js:334`, `app/js/app.js:342`.

**Daño/inferencia:** después de probar la rutina, la familia recibe otra tarea de preparación; el valor parece aplazado. **Arreglo profesional:** hacer de la rutina elegida el primer bloque protagonista tras el acceso de urgencia; mantener PIN/foto como preparación contextual y conservar las protecciones necesarias. La puerta del espacio infantil debe apoyar ese recorrido. No eliminar seguridad para compactar.

### 2. Las flechas de primeros pasos están deformadas

**Alta · S. Hecho observado:** core-01-inicio presenta dos «›» en cápsulas verticales altas y estrechas. `app/js/app.js:310` les asigna `.flecha`; `app/styles.css:207` cambia letra/color, pero `app/styles.css:575` aplica el mínimo de 80px, borde y radio de los botones de historias.

**Daño/inferencia:** parecen controles rotos y encarecen la fila en altura. **Arreglo profesional:** separar el chevron decorativo de la clase del botón de historias; centrarlo sin caja propia y comprobar las dos superficies. No añadir otro radio arbitrario.

### 3. La tira de siete pasos se rompe en seis más uno

**Media · M. Hecho observado:** la mochila queda sola en segunda fila en core-02-agenda, core-demo-agenda y core-demo-rutina-nino; la misma fractura aparece dentro del teléfono del hero. Código: `app/styles.css:236`, `app/styles.css:319`, `app/styles.css:320`; `app/js/agenda.js:46`, `app/js/agenda.js:265`.

**Daño/inferencia:** la secuencia parece una rejilla accidental y desplaza el paso actual. **Arreglo profesional:** decidir la tira a 375px: una fila desplazable con continuidad visible o una distribución equilibrada. En modo niño, conservar objetivos táctiles de al menos 44px; no reducirlos indiscriminadamente para forzar el encaje.

### 4. Las imágenes no comparten una gramática de reconocimiento

**Alta · L. Hecho observado:** las rutinas mezclan niño en cama, inodoro, ropa recortada, comida, paisaje y símbolos. La nocturna presenta pato para bañarse y pantalón corto para pijama. Abrí también `app/img/banarse.jpg`: es un pato de juguete. Código: `app/js/datos.js:86`, `app/js/datos.js:87`, `app/js/datos.js:183`, `app/js/datos.js:219`; selección en `app/js/app.js:42`.

**Daño/inferencia:** unas imágenes nombran objetos asociados, otras acciones o ambientes; esa traducción adicional contradice reconocimiento inmediato. No afirmo que todos los niños las entiendan mal: no hubo prueba de comprensión. **Arreglo profesional:** inventariar conceptos, fijar sujeto/encuadre/fondo y representación literal; preservar fotos propias de las familias y probar reconocimiento antes de reemplazar el catálogo. No vestir la app con ilustraciones de la portada comercial.

### 5. El catálogo comercial enseña una versión visual distinta

**Media · M. Hecho observado:** landing-lenta-detalle-03 muestra «Hablar» como bocadillo y «Mis estrellas» como estrella. El código actual del espacio infantil pasa por `PP.picto`; el catálogo asigna mano a «Hablar» y cara sonriente a «Mis estrellas». Abrí esos assets. Referencias: `web/app/page.tsx:111`, `app/js/nino.js:36`, `app/js/app.js:43`, `app/js/datos.js:201`, `app/js/datos.js:202`.

**Desconocido:** no hay captura nueva del home infantil completo para comparar todos sus detalles. **Daño/inferencia:** la prueba comercial no representa fiablemente el catálogo actual. **Arreglo profesional:** estabilizar imágenes y renovar capturas comerciales con la versión vigente y una misma familia de datos. No mezclar generaciones de interfaz.

### 6. La primera victoria agrega lectura en vez de despejar el siguiente paso

**Media · M. Hecho observado:** entre onboarding-08 y 09, «¡Hecho!» añade explicación, otra línea sobre terapeuta y chip de progreso antes de continuar la lista. Código: `web/components/embudo/Resultado.tsx:86`; frase: `web/components/embudo/textos.ts:147`.

**Daño/inferencia:** el premio desplaza el resto de la rutina y aumenta lectura cuando debería confirmar una acción sencilla. **Arreglo profesional:** conservar check y siguiente paso como confirmación principal; condensar explicación en una línea o fuera del tramo operativo. Probar si se entiende qué sigue sin leer un párrafo. No trato la posición del pie en la captura larga como un fallo de anclaje.

### 7. El paywall repite tranquilidad y alarga una decisión de un solo plan

**Media · M. Hecho observado:** resumen, cronología y precio ocupan tres páginas. En la tercera, prueba/cancelación se repiten en subtítulo, tarjeta, pie, garantía y lista inferior. Evidencia: paywall-configurado-02/03. Código: `web/components/embudo/PaywallPrecio.tsx:130`, `web/components/embudo/PaywallPrecio.tsx:179`, `web/components/embudo/PaywallPrecio.tsx:234`, `web/components/embudo/PaywallPrecio.tsx:240`.

**Daño/inferencia:** el precio compite con varias capas de tranquilidad y se prolonga la lectura. **Arreglo profesional:** jerarquizar precio, siete días, renovación y cancelación en una unidad; quitar redundancia conservando condiciones y enlaces. Compactar pasos solo después de comprobar comprensión. No ocultar renovación ni llamar fallo al checkout local sin configurar.

### 8. Se conserva la familia tipográfica, pero no su escala

**Media · M. Hecho observado/código:** ficha: display 36–44, título 24, cuerpo 18, etiqueta 13. App: `.titular` 2rem, `.destacada h3` 1.35rem, `.seccion-t` 1.05rem y numerosas ayudas fraccionarias. Web añade título 28 en embudo y más escalones. Referencias: `app/styles.css:175`, `app/styles.css:191`, `app/styles.css:193`, `web/components/embudo/ui.tsx:27`.

**Daño/inferencia:** títulos orientadores se acercan al cuerpo; los mensajes compiten por peso en vez de función. **Arreglo profesional:** mapear roles reales a la escala aprobada y resolver excepciones explícitas por edad/densidad sin multiplicar familias. No agrandar todas las etiquetas ni copiar la escala de admin a la interfaz infantil.

### 9. El diario contiene un gráfico de lectura demasiado pequeña

**Media · M. Hecho observado:** core-demo-diario presenta fechas y valores diminutos bajo «Momentos difíciles por día». El código usa texto SVG 8/9 y catorce posiciones. `app/styles.css:592`, `app/styles.css:593`; `app/js/diario.js:139`, `app/js/diario.js:194`.

**Daño/inferencia:** se reconocen barras sin consultar cómodamente el día. **Arreglo profesional:** elegir una ventana legible, etiquetar menos posiciones o permitir lectura detallada accesible al seleccionar, con resumen textual. Verificar tamaño efectivo del SVG renderizado, no solo el número en CSS.

### 10. El informe es un documento largo antes que una lectura de hallazgos

**Media · L. Hecho observado:** core-demo-informe acumula controles de impresión, tablas de rutinas/tipos/franjas, rankings, logros y comentarios sin síntesis editorial inicial. Código: `app/js/informe.js:64`, `app/js/informe.js:82`, `app/styles.css:618`.

**Daño/inferencia:** para identificar qué comentar con el profesional hay que recorrer casi todo. **Arreglo profesional:** colocar una síntesis descriptiva de lo registrado y su periodo al principio; detalle después. Separar lectura móvil y composición imprimible cuando corresponda. No convertir correlaciones en diagnósticos ni inventar recomendaciones terapéuticas para rellenar tarjetas.

### 11. El texto afirma más personalización y certeza de la demostrada

**Alta · M. Perspectiva secundaria de copy. Hechos:** «Hecho con tus 3 respuestas» aparece en el resumen, pero la secuencia de rutina se selecciona por momento (`web/components/embudo/Onboarding.tsx:141`, `web/lib/embudo/rutinas.ts:73`); edad/crisis personalizan etiquetas y mensajes, no esa secuencia. «Lo que pase queda anotado para su terapeuta» (`web/components/embudo/textos.ts:147`) convive con un diario de registro manual (`app/js/diario.js:271`). «Es que Mateo no sabe qué viene» (`web/components/embudo/textos.ts:101`) presenta una explicación categórica tras un cuestionario breve. Landing promete «sabrás qué hacer» (`web/app/page.tsx:57`).

**Daño/inferencia:** la presentación puede confundirse con un plan adaptado o registro automático. **Arreglo profesional:** describir acciones reales: rutina elegida para ese momento, herramientas disponibles y «Puedes anotar lo que pase». Sustituir la explicación absoluta por una posibilidad. «Lo que más los provoca» (`app/js/diario.js:195`) debe describir desencadenantes anotados, no causalidad establecida. No constato daño clínico: señalo diferencias entre representación y comportamiento.

### 12. La retención se representa como archivo y contadores

**Media · L. Perspectiva secundaria de retención. Hecho observado:** el inicio muestra estrellas y progreso actual; el historial vive en diario/informe. La familia nueva no tiene historial; las demo sí. Referencias: `app/js/app.js:324`, `app/js/app.js:354`, `app/js/diario.js:190`, `app/js/informe.js:82`.

**Daño/inferencia:** el motivo de volver mañana queda implícito y el valor mensual se apoya en un catálogo. No afirmo falta de retención real: no se midió. **Arreglo profesional:** hacer visible continuidad con datos reales —qué se completó, qué quedó pendiente y próxima rutina— sin presión, rachas culpabilizantes ni conclusiones médicas. Comprobar D1–D7 con familias antes de convertirlo en promesa comercial.

## Quick wins menores a una hora: hipótesis, no aumentos prometidos

1. **Separar la clase del chevron (hallazgo 2).** Hipótesis: elimina la cápsula accidental y reduce altura. Verificar inicio nuevo e historias a 375px.
2. **Cambiar «Lo que pase queda anotado» por una acción manual explícita.** Hipótesis: reduce expectativa de automatización. Comprobar comprensión, no solo apariencia.
3. **Renombrar «Lo que más los provoca» como «Desencadenantes que anotaste».** Hipótesis: describe mejor la fuente y evita aparentar causalidad.
4. **Añadir «Entrar» al header de landing con la opción ya existente.** `web/components/landing/Hero.tsx:80` lo admite; `web/app/page.tsx:52` no pasa loginHref. Hipótesis: una clienta que vuelve encuentra su acceso sin atravesar la venta. Validar jerarquía y destino.

No prometo mejoras porcentuales. Mover la rutina, rehacer imágenes o condensar el paywall requieren más cuidado y no se disfrazan de quick wins.

## Orden profesional de corrección

Primero, reparar flecha y ordenar inicio nuevo alrededor de la rutina. Segundo, alinear palabras y representación con lo que realmente hace la app. Tercero, cerrar gramática de imágenes, tira de pasos y escala; después renovar capturas comerciales. Cuarto, ordenar lectura de datos y continuidad. Las verificaciones reales de pago/acceso y las pruebas con familias son trabajo separado de esta crítica visual.

No hubo cambios de producto, configuración, ESTADO, activación ni publicación. El único archivo escrito por este diagnóstico es este informe.
