# VEREDICTO revisor-visual — guardado-error
Fecha: 2026-10-27
Screenshot: docs/revisiones/guardado-error-375.png
Usabilidad: 28/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: recuperación distante del aviso; cierre sin restitución del foco; aviso desactualizado tras guardar; ayuda poco concreta; identidad visual sin dispositivo firma.

## Error de guardado en Ajustes

VEREDICTO: NO LISTA
USABILIDAD: 28/40 (detalle: h1:3 h2:3 h3:2 h4:3 h5:3 h6:3 h7:2 h8:3 h9:3 h10:3)
CRAFT: 12/20 (detalle: jerarquía:3 profundidad:2 identidad:2 movimiento:2 encaje:3)
COPY: N/A (no vende)
FIDELIDAD: N/A (sin imagen externa de referencia)

TOP DEFECTOS:
1. [Aviso superior / Guardar ajustes al final de Estímulos; app.js:63-77, 533-572] «Entendido» solo cierra; reintentar exige recorrer de nuevo un formulario largo → ofrecer reintento contextual o devolver al botón de guardar con los valores conservados.
2. [Botón Entendido; app.js:71] El cierre elimina el elemento que tiene el foco sin restituirlo → guardar el control de origen y devolverle el foco si sigue conectado.
3. [Aviso superior tras un guardado posterior; app.js:63-77, 119-120, 550-554] El aviso se conserva al repintar y no se retira al guardar correctamente; puede coexistir «No se pudieron guardar» con «Ajustes guardados» → resolver el aviso correspondiente al confirmar esa operación, sin borrar errores ajenos.
4. [Texto rojo superior] «Revisa el espacio y los permisos del navegador» no indica dónde ni cómo hacerlo → añadir ayuda breve y concreta, sin sugerir borrar los datos de la app.
5. [Perfil / cabecera] La captura muestra «Paso a Paso» donde el código actual de Ajustes declara «Ajustes»; falta una identificación clara de la pantalla → verificar la captura contra el mismo código servido y mostrar el título de sección.

### Evidencia por heurística

| Heurística | Nota | Fuente y fundamento |
| --- | ---: | --- |
| h1 Estado | 3 | [render+código] Fallo visible, persistente y `role="alert"`; el guardado desactiva el botón, pero no muestra texto de espera. El fallo no se resuelve visualmente con el éxito posterior. |
| h2 Lenguaje | 3 | [render] Explica qué falló con vocabulario habitual; «permisos del navegador» aún requiere orientación. |
| h3 Control | 2 | [código] Cierre explícito y no modal; conserva campos tras el rechazo, pero elimina el foco y navegar/repintar reconstruye Ajustes desde el perfil restaurado. No hay protección de borrador de Ajustes. |
| h4 Consistencia | 3 | [render+código] Reutiliza tarjeta, botón, color semántico, tipografía y radios del sistema; discrepancia del título entre imagen y fuente. |
| h5 Prevención | 3 | [código] Evita doble envío; PIN validado; edad tiene límites HTML; copia anterior del perfil restaurada en el rechazo. No demuestra todas las interacciones concurrentes durante el guardado. |
| h6 Reconocer | 3 | [render] Mensaje y campos visibles; no exige recordar un código de error. |
| h7 Eficiencia | 2 | [código] Botón nativo operable con teclado y foco inicial explícito; cierre sin retorno y recuperación lejos del aviso. |
| h8 Jerarquía | 3 | [render] Error legible y una acción local de cierre; pantalla larga, aunque agrupada por secciones. |
| h9 Recuperación | 3 | [render+código] Qué pasó y qué hacer están escritos, no desaparecen por temporizador; instrucciones generales y sin reintento local. |
| h10 Ayuda | 3 | [render] Ayudas sobre PIN, voz y privacidad; falta asistencia específica para almacenamiento bloqueado. |

### Persistencia, datos y teclado

- `PP.avisarError` usa una única sección, actualiza su texto, la antepone a `#contenido`, desplaza hasta ella y enfoca «Entendido». No tiene temporizador; el aviso breve `PP.avisar` sí tiene 2600 ms y es un mecanismo distinto.
- `pintar()` vuelve a insertar el aviso existente después de reconstruir la pantalla. Persiste entre pantallas durante la sesión, incluso cuando el texto ya no corresponde a la nueva pantalla; no persiste al recargar. Persistir el aviso no equivale a persistir los cambios.
- Ajustes restaura `perfilAntes` en memoria si falla y no repinta el formulario en ese rechazo: lo escrito queda en los controles actuales. Al navegar o repintar, esa conservación ya no está garantizada. El aviso de Ajustes no afirma que haya guardado.
- En Diario, el rechazo restaura la lista anterior, rehabilita controles y conserva el borrador/formulario; la navegación de éxito solo ocurre después de `guardar()`. Esto se verifica por lectura, no por una prueba real de fallo del dispositivo.
- En `datos.js`, el éxito depende de `tx.oncomplete`; `put` exitoso no basta. La memoria se actualiza después de confirmar. `onabort`/`onerror` rechazan y la apertura fallida permite reintentar. El guardado conjunto del PIN y diario evita confirmaciones parciales dentro de esa transacción. No certifica supervivencia a borrado del navegador ni a averías físicas.
- «Entendido» es `button type="button"`: Enter/Espacio son comportamiento nativo, sin una trampa de foco programada. Hay `:focus-visible` global y estilos para radios/interruptores. El cierre no devuelve foco, el aviso no relaciona su texto con el botón mediante descripción y el anuncio efectivo del lector de pantalla no se ha probado. Escape no está implementado; al ser aviso no modal, su ausencia no es por sí sola un defecto.
- No se verificó teclado virtual, secuencia real de Tab, lector de pantalla ni foco durante superposición con el PIN. No se inventa su resultado a partir del PNG.

### Contraste y mismo estilo

Ratios calculados con luminancia relativa sRGB sobre los colores declarados en `styles.css`, modo claro; no son mediciones de un dispositivo ni de todos los píxeles suavizados de la captura.

| Elemento | Colores | Ratio |
| --- | --- | ---: |
| Texto de error / tarjeta | #9A4A3E / #FFFFFF | 6,13:1 |
| Entendido / superficie | #22302A / #FFFFFF | 13,78:1 |
| Texto secundario / fondo | #52605A / #F2F4EF | 5,96:1 |
| Texto CTA / verde | #FFFFFF / #4A765F | 5,19:1 |
| CTA de Inicio / tarjeta salvia | #4A765F / #DAE7DD | 4,07:1 |
| Foco / blanco | #4F6D86 / #FFFFFF | 5,43:1 |
| Borde de control / blanco | #CBD5CC / #FFFFFF | 1,51:1 |

El texto del error supera 4,5:1. La ficha se respeta en paleta, Lexend/Atkinson, tarjetas de 18px y botones de 14px; el aviso comparte el estilo de la app. «Entendido» tiene mínimo 56px por CSS. El borde tenue merece revisión en controles cuya forma depende de él; no se declara contraste no textual completo aprobado. No se aplica al cierre secundario la exigencia de fondo contrastante del CTA héroe. Oscuro y calma no están renderizados aquí.

Craft: jerarquía 3 por error reconocible; profundidad 2 por base plana con tarjeta elevada e inputs blancos, sin tres planos contundentes; identidad 2 por kit coherente sin tira propia de fotos/checks en esta variante; movimiento 2 por las limitaciones indicadas abajo; encaje 3 por márgenes y botones uniformes. No se añaden puntos por intención.

## Pantalla principal — revisión obligatoria independiente

# VEREDICTO revisor-visual — inicio
Fecha: 2026-10-27
Screenshot: docs/revisiones/correcciones-2026-10-27/inicio-375.png
Usabilidad: 29/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: jerarquía de entrada dividida; dispositivo firma ausente; bloque de instalación extenso; movimiento parcial; escala tipográfica distinta de la ficha.

VEREDICTO: NO LISTA
USABILIDAD: 29/40 (detalle: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:2 h9:3 h10:3)
CRAFT: 12/20 (detalle: jerarquía:2 profundidad:3 identidad:2 movimiento:2 encaje:3)
COPY: N/A (no vende)
FIDELIDAD: N/A (sin imagen externa de referencia)

TOP DEFECTOS:
1. [Primer tramo: urgencia, Espacio de Mateo, Ahora toca] Tres destinos fuertes anteceden a las herramientas; el principal aparece después de la puerta al niño → priorizar visualmente la rutina del momento y compactar el acceso al espacio, conservando la ayuda urgente.
2. [Tarjeta Noche] Foto aislada y barra vacía; falta la tira de pasos con foto/check de FICHA-ARTE → enseñar próximos pasos reales con su progreso reconocible.
3. [Tarjeta de instalación] El párrafo ocupa unas cinco líneas y la tarjeta domina el tramo inferior → condensar la ayuda inicial y desplegar el detalle, manteniendo explícito el riesgo de perder datos.
4. [Títulos / rótulos] `.titular` usa 2rem (32px con raíz habitual), frente a 36–44px de display en ficha; hay múltiples escalas relativas adicionales → normalizar la jerarquía con la ficha y recapturar, sin aumentar la competencia entre tarjetas.
5. [Entrada / barra de progreso] Hay respuesta al toque y entrada escalonada, pero no se demuestra dibujo inicial del progreso ni conteo de estrellas → completar solo los movimientos útiles, suaves y con reducción de movimiento.

| Heurística | Nota | Fuente y fundamento |
| --- | ---: | --- |
| h1 Estado | 3 | [render+código] Rutina, horario, progreso y estrellas explícitos; `progressbar` tiene valor y nombre accesible. No se certifica latencia de destinos externos al código leído. |
| h2 Lenguaje | 3 | [render] «Ahora toca», nombre del peque y acciones comprensibles; la promesa «en 30 segundos» no se cronometra ni certifica aquí. |
| h3 Control | 3 | [código] Historial/atrás y «Ahora no» para instalación; el menú permite moverse. No se prueba el sistema de instalación del teléfono. |
| h4 Consistencia | 3 | [render+código] Paleta y botones compartidos; emojis y foto no forman una serie visual homogénea. |
| h5 Prevención | 3 | [render+código] Explica que instalar no respalda; diario pasa por `conDiario`. Sin prueba de datos reales ni seguridad integral. |
| h6 Reconocer | 3 | [render] Herramientas nombradas y progreso visible sin memorizar otra pantalla. |
| h7 Eficiencia | 3 | [código] Accesos directos a rutina/diario y cálculo por hora; controles nativos. No se verifican todas sus pantallas destino. |
| h8 Minimalismo | 2 | [render] Urgencia, puerta al niño y rutina compiten en el primer tramo; instalación añade otro bloque protagonista. |
| h9 Errores | 3 | [código] Mecanismo global de error persistente disponible; no hay error renderizado en esta captura, ni se extrapola aprobación a todos los destinos. |
| h10 Ayuda | 3 | [render+código] Explica salida del espacio y ofrece pasos de instalación según plataforma; advertencia honesta sobre datos locales. |

Craft: jerarquía 2 por competencia entre bloques; profundidad 3 por superficies blancas elevadas y tarjetas de salvia/arena; identidad 2 por ausencia de la tira firma y mezcla de iconografía; movimiento 2; encaje 3 por retícula y radios regulares. La puntuación de Inicio es propia: el resultado del aviso no sustituye la revisión de la pantalla principal.

## Movimiento — siete comprobaciones en el código disponible

| Baseline | Comprobación y límite |
| --- | --- |
| Entrada escalonada | `pintar()` asigna `--i` y `.entrando > *` usa 320ms y 60ms de demora. Al repintar con `mantener` no se reanima. La aparición específica del aviso no tiene una firma dedicada. |
| Conteo de números héroe | Estrellas y cantidades en Inicio se interpolan directamente; no hay contador animado en el código leído. En el aviso no aplica. |
| Dibujo de anillos/barras | `.barra-prog span` tiene transición de anchura; se inserta con valor final. Eso no prueba dibujo inicial; el PNG muestra 0. En el aviso no aplica. |
| Tap menor de 150ms | `:active` escala a .97 con transición de .12s en botones y menú. Definido, no observado en vídeo. |
| Transición de tabs | Cambio mediante `pintar()` y entrada del contenido; no se demuestra transición continua entre estados del menú. |
| Modales suaves | El aviso no es modal. Existen estilos de PIN/otras superficies, sin secuencia dinámica evaluada aquí; no se concede aprobación por su sola presencia. |
| Celebración de hitos | `.estrella` tiene `aparecer`; no se verifica su disparador en los módulos de hitos, fuera del alcance. No aplica al error de guardado. |

`prefers-reduced-motion` elimina animaciones y reduce transiciones; `html.calma` anula ambas. No se penaliza que el aviso carezca de celebración o contador; sí se evita afirmar siete baseline comprobadas en funcionamiento.

## Carga cognitiva y límites de evidencia

- Error: una acción local, cuatro líneas de aviso y campos etiquetados. Ajustes agrupa por Perfil/Voz/Imágenes/Estímulos/Datos, pero mantiene más de siete controles en un formulario único; recuperación larga y ayuda general son fricciones reales. No se detectan cuatro fallos independientes para declarar sobrecarga crítica.
- Inicio: los destinos están agrupados, sin campos; falla la claridad de un único protagonista y el párrafo de instalación excede cuatro líneas. Cinco botones de navegación son un grupo de navegación, no cinco respuestas a una misma pregunta. No se declara sobrecarga crítica de cuatro fallos.
- Se leyeron las dos imágenes existentes: error 375×2340 y principal 375×1533. Son capturas de página completa aportadas en el repositorio, no recapturas hechas por este revisor. Una imagen no demuestra por sí sola el origen, el código servido ni el flujo que la produjo. La cabecera de Ajustes discrepante limita esa correspondencia.
- La barra inferior aparece en medio de ambos PNG. `.menu` es `position:fixed; bottom:0` y `#contenido` reserva 68px + 32px + área segura al final. Una captura fullpage puede componer la barra fija en la posición del viewport inicial y mostrar contenido por debajo. No se descuenta puntuación por asumir que el contenido cruzado quedó inaccesible ni se certifica que nunca se tape: falta captura de viewport y recorrido de scroll/foco, especialmente con teclado virtual. La aparente intersección con «Para ti»/el interruptor no basta para afirmar ocultamiento real persistente.
- Alcance: lectura de `.claude/agents/revisor-visual.md`, `FICHA-ARTE.md`, rúbricas, capturas y los cuatro archivos solicitados. Sin usar veredictos anteriores como evidencia de notas. Sin acceder a cuentas, servicios, compras, envíos o pruebas externas. No se ejecutaron pruebas funcionales y no se certifica persistencia real en un teléfono.
- No se modificó la app. Este archivo es el único entregable de la revisión. Ninguna de las dos pantallas alcanza el doble corte de 36/40 y 16/20.

## Adenda — comprobación dirigida de las correcciones

Fecha: 2026-10-27
Screenshot actual: docs/revisiones/guardado-error-375.png (375×2406)
Veredicto de la adenda: TRES HALLAZGOS CORREGIDOS EN EL CÓDIGO REVISADO; SIN CERTIFICACIÓN GLOBAL NUEVA.

Esta adenda sustituye las afirmaciones anteriores sobre los defectos 1, 2 y 3 del error de guardado. Las notas 28/40 y 12/20 corresponden a la revisión anterior; no se presentan como una nueva puntuación de esta variante. No se repite la rúbrica completa ni se fuerza una subida de nota por corregir tres comportamientos. La captura de la misma ruta fue reemplazada: la imagen actual ya no representa exactamente la variante puntuada en el cuerpo histórico.

| Hallazgo anterior | Comprobación actual | Resultado |
| --- | --- | --- |
| Cierre sin restitución del foco | `app/js/app.js:63-69` conserva el origen antes de limpiar el aviso y llama a `focus()` si el control sigue conectado y habilitado. «Entendido» ejecuta `cerrarError(true)` en la línea 92. Ajustes pasa explícitamente su botón; Diario conserva `ev.submitter` o el botón de envío y lo pasa en el fallo. | Corregido por lectura del código para origen válido. La imagen estática no demuestra el recorrido de teclado. Si el origen ya no existe o está deshabilitado, no hay destino alternativo; ese límite permanece. |
| Error que permanece después del éxito | `PP.resolverError(contexto)` solo cierra cuando el contexto coincide (`app.js:71-73`). El éxito de Ajustes resuelve `ajustes` (586), PIN resuelve `pin` (595), y Diario resuelve `diario:` más el identificador de nota (388). `datos.js:460-469` conserva el contexto de la operación y lo resuelve en el éxito. | Corregido por lectura del código: guardar Ajustes no retira un error de PIN o de otra nota. No se afirma haber observado la secuencia fallo→éxito en navegador durante esta adenda. |
| Recuperación lejos del aviso | La imagen actual muestra «Volver a intentar» en verde junto al mensaje, antes de «Entendido». `app.js:77-82` obtiene el formulario actual por identificador y usa `requestSubmit` con su botón de envío solo si sigue en la misma pantalla. Ajustes y Diario pasan `formulario`; el reintento conserva sus validaciones y protecciones de guardado. | Corregido en imagen y código para formularios. No es un guardado directo que omita la validación. |

### Alcance de las correcciones

- El reintento se oculta al pintar otra pantalla (`app.js:151-155`) y la acción del formulario también comprueba la identidad de la pantalla. No se interpreta como autorización para operar sobre un formulario ajeno.
- Los fallos al borrar/restaurar no reciben `formulario` ni una acción automática de reintento: `restaurar`, `diario-ejemplos` y `diario-borrar:<id>` conservan su resolución por contexto. No se añade un botón que repita una acción destructiva desde el aviso. El manejador genérico de `datos.js` tampoco añade reintento automático.
- El aviso sigue sin temporizador. «Volver a intentar» es un botón nativo y ahora tiene `aria-describedby="error-guardado-texto"`. El foco inicial va al reintento cuando existe y, si no, al cierre. La lectura confirma la intención accesible; no sustituye una prueba con lector de pantalla o teclado virtual.
- La captura actual también muestra el título «Ajustes»: queda resuelta en esta imagen la discrepancia de cabecera del defecto 5 anterior. El kit y el texto conservan el estilo observado. No se recalcula contraste porque esta adenda no revisa cambios de estilos.
- Sigue pendiente la ayuda concreta sobre espacio/permisos y no se afirma conservación del borrador de Ajustes después de navegar. La barra inferior sigue cruzando la imagen fullpage: se mantiene el límite anterior sobre composición de captura frente a ocultamiento real. No se deduce un defecto nuevo de ese cruce.

### Pruebas informadas y gate principal

La solicitud informa 22 pruebas unitarias y 7 de navegador seleccionadas aprobadas por el agente de almacenamiento, con la suite total a cargo del agente principal tras los cambios. Se registra como información recibida, no como ejecución o verificación propia de este revisor; esta adenda no inspeccionó sus registros ni ejecutó pruebas externas.

La pantalla principal no fue rediseñada ni repuntuada. Su revisión anterior de 29/40 y 12/20 y su gate pendiente siguen separados de estas correcciones. Cerrar estos tres hallazgos del guardado no aprueba Inicio ni declara el producto LISTO. Solo se modifica este documento, sin cambios de producto.

### Cierre documental de la adenda — registros finales inspeccionados

Fecha: 2026-10-27
Estado: ADENDA CERRADA EN SU ALCANCE; BUILD FINAL Y GATE DE INICIO PENDIENTES.

Se inspeccionaron los resúmenes finales y las entradas relacionadas con guardado en los dos registros aportados:

- `docs/revisiones/correcciones-2026-10-27/pruebas-final.txt`: 100 pruebas, 100 aprobadas, 0 fallidas, 0 canceladas, 0 omitidas y 0 pendientes. Las entradas relacionadas confirman espera por `oncomplete`, rechazo por cuota con reintento, ausencia de falso guardado sin IndexedDB y conservación de datos ante aborto.
- `docs/revisiones/correcciones-2026-10-27/navegador-final.txt`: 15 pruebas, 15 aprobadas, 0 fallidas, 0 canceladas, 0 omitidas y 0 pendientes. Constan aprobadas las pruebas de Ajustes a 375px (error persistente, rollback, cierre explícito y reintento durable), Diario (borrador, reintento y recarga), PIN (conservación ante fallo y reintento), y aislamiento entre contextos sin activar borrados.

Estos registros refuerzan la comprobación de las tres correcciones ya descritas. Se verificó el contenido de los registros, sin volver a ejecutar las pruebas ni inspeccionar aquí cada aserción. La ejecución completa en Edge es información de la solicitud; el resumen leído identifica el comando de pruebas, pero no identifica por sí solo el navegador. No se extrapola a pruebas manuales con lector de pantalla, teclado virtual u otros dispositivos.

Esta constancia actualiza el apartado anterior, donde las pruebas solo estaban informadas: ahora sus resultados finales están contrastados con los archivos aportados. No modifica puntuaciones, no aprueba el gate visual de la principal y no certifica publicación ni servicios externos. El build final seguía en progreso al solicitar este cierre y no forma parte de la evidencia comprobada. Sin cambios de producto.
