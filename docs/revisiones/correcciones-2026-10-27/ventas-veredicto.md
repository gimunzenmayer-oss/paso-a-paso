# VEREDICTO revisor-visual — ventas

Fecha: 2026-10-27 21:15 America/Santiago
Veredicto: NO LISTA

Revisión independiente de siete renders reales y del código actual. No se modificó producto, no se accedió a cuentas, no se enviaron mensajes ni se inició una compra. No se consultaron informes anteriores, paneles ni razonamiento del constructor. No se leyó ESTADO.md para mantener el aislamiento solicitado.

## Resultado por superficie

| Superficie | Usabilidad | Craft | Copy de venta | Veredicto |
|---|---:|---:|---:|---|
| Landing | 33/40 | 14/20 | 18/20 | NO LISTA |
| Onboarding · reconocimiento | 33/40 | 16/20 | 16/20 | NO LISTA |
| Onboarding · compromiso | 35/40 | 16/20 | 15/20 | NO LISTA |
| Onboarding · resultado | 31/40 | 15/20 | 16/20 | NO LISTA |
| Paywall · resumen | 34/40 | 17/20 | 16/20 | NO LISTA |
| Paywall · prueba | 33/40 | 16/20 | 16/20 | NO LISTA |
| Paywall · precio | 33/40 | 13/20 | 16/20 | NO LISTA |

Gate aplicado por superficie, sin promediar: usabilidad ≥36/40 y craft ≥16/20. En copy: ≥16/20 y ningún eje ≤2. «NO LISTA» expresa que no se acredita ese estándar; no equivale a declarar roto el flujo de compra.

## Evidencia abierta y método

Leídos completos: `.claude/agents/revisor-visual.md`, `FICHA-ARTE.md`, `FICHA-AVATAR.md`, `docs/sistema/RUBRICAS-DE-PANTALLA.md`. La rúbrica de copy procede del agente; se aplica también al onboarding por su función comercial y por la petición expresa.

Abiertos visualmente los siete PNG siguientes. La landing también se inspeccionó a ancho nativo mediante seis recortes contiguos de 1.250 px de alto, sin reescalado y sin alterar el original. Las coordenadas de hallazgos son píxeles del PNG original, origen arriba a la izquierda; las zonas se indican aproximadamente, no como medidas del DOM.

| PNG dentro de esta carpeta | Fecha del archivo | SHA-256 |
|---|---|---|
| landing-375.png | 2026-10-27 21:08:49 | 6EA1691BB38C7B5ED92C455D21C6819087F7CA086C3FAFF786D68029A4FB13CE |
| onboarding-reconocimiento-375.png | 2026-10-27 21:08:55 | D0250AF4FC99D78CE363104BB5AAD199D4751286B61B42575C7999CD1A85CF6F |
| onboarding-compromiso-375.png | 2026-10-27 21:08:59 | 2392F234A461A0394E1250D5FE9E6CF45E37C952532B505F8E9CD773F147739D |
| onboarding-resultado-375.png | 2026-10-27 21:09:04 | F61652E7A3E5D4EEBAE4973EA949F8DAFB2F7D70CDCAB0D4D02A0ACE38CBBEC7 |
| paywall-resumen-375.png | 2026-10-27 21:09:10 | BD587DB365C4A76C67D8C019417E4438C9D7A4EB0D3C6872859EEC96B2036DBA |
| paywall-prueba-375.png | 2026-10-27 21:09:15 | 6FE66F982084C926A8F3FD24676E5299C51E20D86B6FF38D46B8AF06FF74C5A4 |
| paywall-precio-375.png | 2026-10-27 21:12:08 | 49AD3CB4A4AB86EDB4DF2428C128DB47B14BEF0F314A3A0B56A29806071863D8 |

Código leído: `web/app/page.tsx`; `web/components/embudo/{Onboarding,Paywall,PaywallPrueba,PaywallResumen,PaywallPrecio,Reconocimiento,Compromiso,Resultado,ui}.tsx`; `web/components/embudo/textos.ts` — **textos.tsx no existe**, se revisó el archivo real. También se leyeron las dependencias de presentación `landing/{ui,Hero,Oferta,Faq,AppPorDentro}.tsx`, `landing/tokens.css`, `app/globals.css`, las cabeceras del embudo y las definiciones relevantes de `app/styles.css`, `almacen.ts`, `rutinas.ts` y `web/app/layout.tsx`.

Fuentes de puntuación: h1 [render+código], h2 [render], h3 [código], h4 [render+código], h5 [código], h6 [render], h7 [código], h8 [render+código], h9 [código], h10 [render+código]. Movimiento se evalúa por implementación, no como si se hubiera observado un vídeo. Un 3 indica implementación suficiente o convencional; no demuestra excelencia. No se otorgan 4 por omitir formularios, errores o modales que la superficie no necesita.

## Landing

# VEREDICTO revisor-visual — landing
Fecha: 2026-10-27 21:15
Screenshot: docs/revisiones/correcciones-2026-10-27/landing-375.png
Usabilidad: 33/40
Craft: 14/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: escala tipográfica dispersa; movimiento incompleto del precio mostrado; exceso de extensión en el cierre.

USABILIDAD: 33/40 (h1:3 h2:4 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:4)
CRAFT: 14/20 (jerarquía:2 profundidad:3 identidad:4 movimiento:2 encaje:3)
COPY: 18/20 (idea:4 especificidad:3 emoción:4 oferta:3 acción:4)
FIDELIDAD: N/A, sin imagen externa; coherencia con sistema propio examinada abajo.

TOP DEFECTOS:

1. [MEDIO; x20–355, y4300–4995, oferta] Se acumulan 11, 14, 15, 18, 30 y 36 px en la sección: badge, sufijo, beneficios, renovación, título y cifra. No cumple el máximo de tres tamaños de la rúbrica; consolidar roles, especialmente cuerpo/condiciones. Código: `web/components/landing/Oferta.tsx:59`, `:73`, `:88`, `:114`, `:188`, `:195`.
2. [MEDIO; x45–225, y4490–4540, precio] El único precio vigente aparece estático: `Precio plan={mensual}` no activa el contador, mientras el contador se usa en la rama anual no renderizada. Conectar la baseline al precio realmente mostrado, si se mantiene esa exigencia del SO; no agregar un plan anual para justificarla. Código: `web/components/landing/Oferta.tsx:192`, frente a `:164` y `:211`.
3. [MEDIO; x20–350, y6620–6750, posdata] La posdata ocupa unas cinco líneas y repite mecanismo, prueba y cancelación ya comunicados. Reducirla a una sola idea o retirarla. Código: `web/app/page.tsx:180`. Es un exceso localizado, no tres secciones fuera de presupuesto.

Fundamento: el lenguaje nombra escenas de la ficha, las capturas muestran el producto y existe una oferta mensual explícita. FAQ con controles nativos, `aria-expanded` y respuestas contextualizadas; carrusel con botones de 44 px y navegación implementada. No se exige un atajo artificial para una página comercial. Los 2 minutos son una promesa sin medición independiente en esta revisión, por lo que especificidad queda en 3. La garantía próxima al CTA se presenta como prueba/cancelación, y el reembolso de 7 días queda como enlace a condiciones; no se ha validado el contrato externo.

## Onboarding · reconocimiento

# VEREDICTO revisor-visual — onboarding-reconocimiento
Fecha: 2026-10-27 21:15
Screenshot: docs/revisiones/correcciones-2026-10-27/onboarding-reconocimiento-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: falta hairline exigida en conversión; progreso sin etapa textual visible; reconocimiento poco concreto en el titular.

USABILIDAD: 33/40 (h1:3 h2:3 h3:4 h4:4 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3)
CRAFT: 16/20 (jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:4)
COPY: 16/20 (idea:3 especificidad:3 emoción:4 oferta:3 acción:3)

TOP DEFECTOS:

1. [MEDIO; x20–355, y157–624] No existe hairline degradé en esta pantalla, aunque es ancla binaria de conversión. La tira y el bloque de ayuda son superficies planas. Aplicar el borde del kit a un solo bloque. Código: `web/components/embudo/Reconocimiento.tsx:35`, `:47`; `web/components/embudo/ui.tsx:345`. Identidad baja de 4 a 3 por esta omisión; las fotos sí aportan identidad.
2. [MEDIO; x98–311, y30–34] La barra no dice visualmente en qué etapa está; solo su atributo accesible lo comunica, y además representa el máximo alcanzado al volver. Mostrar una etiqueta breve del paso actual para quien ve la pantalla. Código: `web/components/embudo/BarraProgreso.tsx:47`; `web/components/embudo/Onboarding.tsx`, uso de `p.alcanzado` en `BarraProgreso`.
3. [MEDIO; x20–350, y304–484] «Ya eres quien mejor conoce» es una afirmación absoluta; lo demostrado aquí es haber identificado un momento difícil. Vincular el reconocimiento a esa acción concreta preserva el tono de cuidado sin atribuir una conclusión a unas respuestas. Código: `web/components/embudo/textos.ts:96`.

Control verificado: atrás y cerrar están implementados; las respuestas se conservan. El CTA es una acción inmediata local, sin necesidad de spinner ni formulario adicional. El texto principal ocupa cuatro líneas en esta captura: **no se marca como desborde**. El copy deriva del dolor de culpa, el deseo de comprender al peque y la objeción de falta de tiempo.

## Onboarding · compromiso

# VEREDICTO revisor-visual — onboarding-compromiso
Fecha: 2026-10-27 21:15
Screenshot: docs/revisiones/correcciones-2026-10-27/onboarding-compromiso-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: falta hairline; compromiso verbal frente a acción siguiente; resto de rutina presentado como texto corrido.

USABILIDAD: 35/40 (h1:3 h2:4 h3:4 h4:4 h5:3 h6:4 h7:4 h8:3 h9:3 h10:3)
CRAFT: 16/20 (jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:4)
COPY: 15/20 (idea:3 especificidad:3 emoción:3 oferta:3 acción:3)

TOP DEFECTOS:

1. [MEDIO; x20–355, y155–625] No hay hairline degradé en ninguno de los bloques. Aplicar una sola al dispositivo fotográfico o al resumen. Código: `web/components/embudo/Compromiso.tsx:51`, `:74`; `web/components/embudo/ui.tsx:345`.
2. [MEDIO; x20–355, y740–796] «Sí, la probamos» expresa aceptación, pero el efecto inmediato es preparar y mostrar la rutina. Hacer que el CTA indique esa acción concreta; no es necesario agregar otra pantalla. Código: `web/components/embudo/textos.ts:113`; `web/components/embudo/Onboarding.tsx`, `onAceptar` del caso COMPROMISO.
3. [MEDIO; x36–337, y548–608] Los cuatro pasos restantes se presentan unidos con puntos en un párrafo. Se pueden leer, pero localizar uno exige recorrerlo entero. Usar una lista compacta o separar visualmente los nombres sin aumentar la altura de forma importante. Código: `web/components/embudo/Compromiso.tsx:74`, `:77`.

Control/eficiencia: «Cambiar» tiene objetivo táctil de 48 px y vuelve a la elección del momento; `volverACompromiso` devuelve directamente al compromiso después de corregir. Se reconoce el momento elegido y se mantiene el estado. No se penaliza aquí la ausencia de precio: esta pantalla compromete a ensayar una rutina, no ejecuta una compra. El copy es claro pero convencional; no reúne suficientes ejes de excelencia para 16/20.

## Onboarding · resultado

# VEREDICTO revisor-visual — onboarding-resultado
Fecha: 2026-10-27 21:15
Screenshot: docs/revisiones/correcciones-2026-10-27/onboarding-resultado-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: ensayo sin deshacer ni continuidad interactiva; transición compartida del enlace demasiado larga; solapamiento fullPage pendiente de contraste con viewport.

USABILIDAD: 31/40 (h1:3 h2:4 h3:2 h4:4 h5:3 h6:4 h7:3 h8:2 h9:3 h10:3)
CRAFT: 15/20 (jerarquía:3 profundidad:3 identidad:4 movimiento:2 encaje:3)
COPY: 16/20 (idea:3 especificidad:4 emoción:3 oferta:3 acción:3)

TOP DEFECTOS:

1. [ALTO; x247–341, y267–315; estado posterior comprobado en código] «¡Hecho!» solo hace `setHecho(true)`. Después desaparece el botón, se señala «Sigue» en el segundo paso y ese paso continúa siendo un `<li>` sin acción. No hay deshacer/repetir dentro del ensayo. Permitir reiniciarlo y aclarar que termina ahí, o habilitar el siguiente paso. No atribuirle pérdida de datos: es estado local de una demostración. Código: `web/components/embudo/Resultado.tsx:44`, `:69`, `:75`, `:98`, `:100`, `:117`.
2. [MEDIO; x20–355, y710–766] `EnlacePrincipal` define una transición general de 0,5 s junto a `whileTap`, sin una transición de tap independiente de 80–150 ms. Separar el pulso de celebración de la respuesta al toque. Es una discrepancia de implementación, no una latencia medida en vídeo. Código: `web/components/embudo/ui.tsx:126`; uso en `web/components/embudo/Resultado.tsx:133`.
3. [OBSERVACIÓN, SIN DESCUENTO POR BLOQUEO; x20–355, y685–813] El pie aparece encima de parte de la lista en el PNG completo. `PieFijo` usa `sticky bottom-0` dentro del flujo: el PNG no demuestra que las filas sean inaccesibles al desplazar. Contrastar con captura de viewport inferior antes de afirmar un fallo de navegación. Código: `web/components/embudo/Resultado.tsx:132`; `web/components/embudo/ui.tsx:202`.

El 2 de h8 corresponde a la señal «Sigue» sin continuidad y a la relación entre ensayo y siguiente acción, **no** al artefacto del pie fijo. Existe `aria-live="polite"` para la explicación posterior (`Resultado.tsx:86`) y un CTA secundario antes de completar el primer paso: no hay dos botones primarios llenos simultáneos. El ensayo tangible respalda el 4 de especificidad; no se verificó el estado posterior mediante una segunda captura.

## Paywall · resumen

# VEREDICTO revisor-visual — paywall-resumen
Fecha: 2026-10-27 21:15
Screenshot: docs/revisiones/correcciones-2026-10-27/paywall-resumen-375.png
Usabilidad: 34/40
Craft: 17/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: utilidad de la respuesta de edad sin explicación; CTA centrado en prueba frente a plan; línea inferior no verificable en captura fullPage.

USABILIDAD: 34/40 (h1:3 h2:4 h3:4 h4:4 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3)
CRAFT: 17/20 (jerarquía:3 profundidad:3 identidad:4 movimiento:3 encaje:4)
COPY: 16/20 (idea:4 especificidad:3 emoción:3 oferta:3 acción:3)

TOP DEFECTOS:

1. [MEDIO; x124–226, y229–257] Se recapitula «5 a 7 años», pero la rutina se elige por momento del día: no se explica para qué sirve la edad. No hay aquí una afirmación literal de adaptación por edad, por lo que no se acusa personalización falsa. Aclarar su utilidad real o evitar pedirla si no cambia nada útil. Código: `web/components/embudo/textos.ts`, `etiquetasDeRespuestas`; `web/components/embudo/Paywall.tsx`, `rutinaDe(respuestas.momento)`; `web/lib/embudo/rutinas.ts:73`.
2. [MEDIO; x20–355, y688–744] «Ver mis 7 días gratis» presenta la condición comercial antes que el uso concreto de la rutina. Conservar la prueba como apoyo y hacer explícito que la siguiente vista explica cómo funciona. Código: `web/components/embudo/textos.ts:197`; `web/components/embudo/PaywallResumen.tsx:101`.
3. [OBSERVACIÓN, SIN DESCUENTO POR BLOQUEO; x20–355, y660–690] «Tu plan ya está en este teléfono» existe en código pero no se lee en esta captura. No se declara texto perdido: puede estar bajo el pie sticky en la composición fullPage. Comprobar viewport inferior. Código: `web/components/embudo/PaywallResumen.tsx:96`; `web/components/embudo/textos.ts:196`.

Verificado: tres respuestas y tres chips coinciden; lista de tres beneficios, hairline y fotos del mismo sistema. La redacción no dice que edad/crisis recalculen herramientas. Atrás, cerrar y salida inferior tienen destinos reales. `Paywall.tsx` conserva páginas en URL e historial y evita mostrar un plan sin elección válida del momento. No se exige mostrar el precio completo en este primer resumen si se explica antes de comprar.

## Paywall · prueba

# VEREDICTO revisor-visual — paywall-prueba
Fecha: 2026-10-27 21:15
Screenshot: docs/revisiones/correcciones-2026-10-27/paywall-prueba-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: cancelación sin ayuda directa en su contexto; redacción operativa del recordatorio; garantía inferior no visible en el PNG completo.

USABILIDAD: 33/40 (h1:3 h2:4 h3:4 h4:4 h5:3 h6:4 h7:3 h8:3 h9:3 h10:2)
CRAFT: 16/20 (jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3)
COPY: 16/20 (idea:3 especificidad:3 emoción:3 oferta:4 acción:3)

TOP DEFECTOS:

1. [ALTO; x70–327, y401–510] «Cancela en Hotmart» no explica el recorrido ni ofrece ayuda en ese punto, donde además se aclara que no llegará recordatorio. Añadir un acceso discreto a la guía de cancelación que ya figura en el footer de la landing. Código: `web/components/embudo/textos.ts:204`; `web/components/embudo/PaywallPrueba.tsx:105`; destino existente en `web/app/page.tsx:191`. Baja h10 por ayuda insuficiente, no por exigir implementar un correo.
2. [MEDIO; x70–330, y455–510] «No hay recordatorio por correo activo» describe el estado de una función. Mantener la información con lenguaje de usuaria: por ejemplo, «No te enviaremos un recordatorio; anota esta fecha». Código: `web/components/embudo/textos.ts:204`.
3. [OBSERVACIÓN, SIN DESCUENTO POR BLOQUEO; x20–355, y650–688] El bloque de garantía presente tras la línea temporal no se aprecia en el PNG. Verificarlo mediante viewport al final; no asumir que el pie sticky impide leerlo. Código: `web/components/embudo/PaywallPrueba.tsx:124`.

La fecha se dice estimada y se atribuye a Hotmart la confirmación definitiva: no se trata como fecha contractual inventada. La fecha y el monto están disponibles en esta misma pantalla. El movimiento de riel, hitos y fotos tiene implementación y se encuentra bajo `MotionConfig reducedMotion="user"`; no se exigen contadores de precio a una cifra contractual dentro de una explicación temporal. Especificidad queda en 3 porque no se cotejó una configuración de prueba externa.

## Paywall · precio

# VEREDICTO revisor-visual — paywall-precio
Fecha: 2026-10-27 21:15
Screenshot: docs/revisiones/correcciones-2026-10-27/paywall-precio-375.png
Usabilidad: 33/40
Craft: 13/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: anclas visuales incompletas; respuesta de tap sin duración independiente; mensaje de fallo con diagnóstico demasiado concluyente.

USABILIDAD: 33/40 (h1:3 h2:4 h3:4 h4:4 h5:3 h6:4 h7:3 h8:2 h9:3 h10:3)
CRAFT: 13/20 (jerarquía:2 profundidad:3 identidad:3 movimiento:2 encaje:3)
COPY: 16/20 (idea:3 especificidad:3 emoción:3 oferta:4 acción:3)

TOP DEFECTOS:

1. [MEDIO; x20–355, y93–584] Se mezclan 13, 16, 18, 28 y 36 px en la vista; la tarjeta de precio usa un borde sólido de 2 px y no hay hairline degradé. Consolidar escala por función y aplicar el borde del kit a la tarjeta, conservando una sola oferta. Código: `web/components/embudo/PaywallPrecio.tsx:35`, `:139`, bloque «Incluye»; `web/components/embudo/ui.tsx:27`. Baja jerarquía e identidad; h8 refleja esta dispersión y la cantidad de bloques de condiciones, no una obstrucción inferida del PNG.
2. [MEDIO; x20–355, y685–741] El CTA comparte la transición de 0,5 s de `EnlacePrincipal`; la cifra protagonista es estática. Separar transición de tap de la de énfasis y resolver la baseline de la cifra si se exige por rúbrica. Código: `web/components/embudo/ui.tsx:126`; `web/components/embudo/PaywallPrecio.tsx:35`, `:182`.
3. [MEDIO; mensaje no capturado, verificado en código] Tras 6 s con la página visible se afirma «No se abrió Hotmart», aunque ese temporizador no confirma la causa. El enlace es una navegación normal, no un popup; la ayuda sobre una ventana bloqueada puede desorientar. Decir «Si Hotmart no se abrió…» y ofrecer reintentar/revisar conexión. Código: `web/components/embudo/PaywallPrecio.tsx:18`, efecto de `abriendo`; `web/components/embudo/textos.ts:257`.
4. [OBSERVACIÓN, SIN DESCUENTO POR BLOQUEO; x20–355, y643–686] El pie sólido corta la frase junto a las tres fotos en esta captura fullPage. No se demuestra inaccesibilidad: el bloque precede al sticky en el flujo. Contrastar con viewport inferior antes de corregir layout. Código: `web/components/embudo/PaywallPrecio.tsx:175`, `:179`; `web/components/embudo/ui.tsx:208`.

Código de estados: `aria-busy`, texto «Abriendo Hotmart…», bloqueo del segundo clic mediante `preventDefault`, recuperación con `pageshow` y error en región `aria-live`. Precio mensual, renovación automática, términos, privacidad, cancelación y reembolso están presentes. No se probó su destino externo ni se certificó el cobro. El estado sin checkout tiene explicación y salidas; no se penaliza como botón muerto del estado normal porque el render revisado muestra la rama con checkout.

## Comprobaciones transversales y límites

- **Carga cognitiva:** no se observan cuatro fallas que justifiquen «sobrecarga crítica». Reconocimiento y compromiso tienen un CTA dominante; resultado distingue ensayo primario de oferta secundaria. Los siete pasos de la rutina no son siete opciones de compra: son contenido desplazable. El límite de tres tamaños de la rúbrica sí se incumple en landing/precio; no se confunde ese límite con un fallo crítico de comprensión.
- **CTA y contraste calculado desde tokens:** `#4A765F` frente a `#EEF2EB`: 4,58:1; frente a `#FBFCF9`: 5,04:1. Texto secundario `#4A5852` sobre base: 6,60:1; `#52605A` sobre hundido `#E6ECE5`: 5,50:1. Acento claro `#8CC0A3` sobre `#22302A`: 6,68:1. Los colores nominales comprobados pasan; no es medición de todos los píxeles, estados hover ni transparencias compuestas. Alturas declaradas: CTA de embudo 56 px, «¡Hecho!» 48 px, CTA de landing 52 px. El enlace secundario de resultado se distingue por borde y texto, no por un relleno contrastante.
- **Sistema propio:** acento, familias tipográficas, radios 18/14 y fotografías coinciden en familia con la app. Hay una discrepancia exacta: `landing/tokens.css` define base `#EEF2EB` y secundario `#4A5852`; ficha y `app/styles.css:22`, `:26` establecen `#F2F4EF` y `#52605A`. También `Titulo` usa 28 px frente a los 24 px de title de la ficha. Es una desviación documentable de tokens, no una «infidelidad visual externa» demostrada. Restaurar contrato o formalizar el cambio; el revisor no altera ninguna ficha. No se usa este pequeño cambio de neutros para bajar arbitrariamente todas las notas.
- **Fidelidad:** N-A en campos canónicos porque no existe imagen externa suministrada para comparación al lado. Se verificó el sistema propio en código y capturas incrustadas, pero no se simuló un test de seis puntos contra una referencia inexistente.
- **Movimiento, siete baseline:** entrada escalonada: sí en bloques/fotos; conteo de cifra protagonista: no en los precios mensuales mostrados; barras/rieles: sí en cabeceras y prueba; tap: `BotonPrincipal` declara 0,12 s en estado normal, `EnlacePrincipal` no separa su transición general de 0,5 s; transiciones de pantalla: sí mediante `AnimatePresence`; modales: N/A en estas superficies, FAQ anima apertura; celebración: sí en ensayo/check, no exigida en un resumen pasivo. `MotionConfig reducedMotion="user"`, `useReducedMotion` del check y regla de scroll reducido existen. No se afirma haber medido cuadros, latencia perceptual ni el ajuste del sistema en ejecución.
- **Traza del copy:** mañanas/cambios → problema urgente y disparadores; fotos/rutina → deseo 1 y objeción de tiempo; calma → deseo 2; diario/consulta → deseo 4; apoyo sin culpa → dolores 3–5; Hotmart/cancelación → objeciones de precio y pago. Los importes y plazos se observan consistentes entre estas superficies, pero la ficha de avatar no certifica los números de mercado. No se investigaron precios ni condiciones externas porque no es el alcance de esta revisión.
- **Garantía y message-match:** oferta final incluye reembolso de 7 días enlazado y condiciones de prueba; no se presenta el trial como prueba de reembolso ejecutado. No hay un anuncio de origen aportado: message-match NO VERIFICABLE. No se inventa una campaña para completar la casilla.
- **Capturas fullPage:** los pies sticky aparecen a la altura del viewport inicial dentro de imágenes más altas. Las superposiciones señaladas son observaciones del PNG, no fallos demostrados de acceso al contenido. No sustentan por sí solas los descuentos numéricos. Faltan capturas de viewport tras scroll para cerrar ese punto.
- **Carrusel:** no se consideran rotas imágenes de slides fuera del viewport horizontal por un aviso de carga del capturador. Se inspeccionó el carrusel y su código; no se navegaron todos sus slides. No hay hallazgo de imágenes rotas.
- **Instrumentación:** no se consultó `mediciones.json` ni se atribuyeron al producto errores de un script inyectado en `about:blank`. Tampoco se certifica «cero overflow» a partir del manifiesto de otra persona: visualmente no se ve recorte horizontal de contenido en los PNG abiertos.
- **Límites funcionales:** no se ejecutaron compras, autenticación, envíos, pruebas de desconexión, teclado o lector de pantalla. Estados no renderizados se describen como comprobaciones de código. No se corrieron build, tests ni auditorías de seguridad: este veredicto no las sustituye. La navegación nativa del navegador en onboarding no se prueba aquí; el atrás explícito sí está implementado, y el historial del paywall sí está implementado.
- **Vigencia:** las notas corresponden a los hashes anteriores y al código leído durante esta revisión. Una recaptura o modificación posterior requiere revisar la diferencia antes de reutilizar el veredicto. No se leyó ni sobrescribió ningún veredicto previo de otras pantallas.

VEREDICTO GLOBAL: NO LISTA. No se acredita el gate completo por superficie con la evidencia revisada. No se declara bloqueo de compra ni inaccesibilidad de contenido por los artefactos de captura.

## Adenda — ronda 2, correcciones de copy

Fecha: 2026-10-27 21:25 America/Santiago
Alcance: únicamente subtítulo del hero y titular de reconocimiento. No se repuntúan las siete superficies ni se reabren decisiones de diseño. Se conserva arriba la evaluación histórica de la primera ronda; los dos puntos siguientes actualizan su estado.

### Evidencia abierta

| Captura nueva | Fecha del archivo | Bytes | SHA-256 |
|---|---|---:|---|
| docs/revisiones/correcciones-2026-10-27/ronda-2/landing-375.png | 2026-10-27 21:23:53 | 645518 | 282DA3AFDE202744DDF846E597F9FC588F0B9833A4A75BDB058F1CF7AC765CC9 |
| docs/revisiones/correcciones-2026-10-27/ronda-2/onboarding-reconocimiento-375.png | 2026-10-27 21:24:01 | 83969 | B1259539054F0E879B0FC656385690E1633698EECD7B9BCB79CEC6C4BFF18DAB |

Se abrieron ambos PNG. El hero se inspeccionó además en un recorte nativo de 375 × 1.000 px; reconocimiento se abrió completo a 375 px. Se contrastaron las líneas actuales de `web/app/page.tsx:58`, `web/components/embudo/textos.ts:97` y sus textos en `docs/copy/landing.md`, sección 1, y `docs/copy/embudo.md:97`.

### Estado de los hallazgos afectados

1. **CORREGIDO — plazo de preparación no medido en el hero.** En la landing nueva, x20–355, y242–284, se lee «El Método Antes, Durante y Después. Una rutina preparada para empezar». Ya no aparece «lista en 2 minutos» en ese subtítulo. Render, componente y documento de copy coinciden. Se retira esa objeción concreta del fundamento de especificidad de la landing; no se concede una nota nueva por retirar una afirmación. Esto no certifica todos los plazos del sitio: permanecen «un par de minutos» en la respuesta de FAQ (`web/app/page.tsx:149`) y «En un minuto…» en el cuerpo de reconocimiento (`web/components/embudo/textos.ts:99`), fuera de los dos cambios solicitados.
2. **CORREGIDO — reconocimiento absoluto sobre quién conoce mejor al peque.** En reconocimiento nuevo, x20–355, y288–377, el titular dice «Ya identificaste un momento difícil para Mateo». Describe una acción observable del onboarding y no deduce quién conoce mejor al niño. Se cierra el TOP DEFECTO 3 de reconocimiento de la primera ronda. Componente, documento de copy y render coinciden.

### Lectura visual del cambio y límites

- El subtítulo del hero conserva dos líneas, el énfasis tipográfico y la separación respecto al CTA. No se observa truncamiento en esa zona.
- El nuevo titular de reconocimiento pasa a tres líneas. «Momento difícil» conserva el acento y se lee completo; el cuerpo y la ayuda siguen separados y el CTA sigue dentro de la captura. No se observa una regresión de encaje causada por el texto nuevo.
- Los restantes hallazgos de primera ronda quedan **sin reevaluar**; esta adenda no los declara corregidos. Tampoco transforma una observación de captura sticky en un defecto demostrado.
- La carga completa del carrusel horizontal y el manejo de localStorage del capturador son mejoras de instrumentación comunicadas por el solicitante. No se contabilizan como arreglos del producto ni como puntos ganados. No se recorrieron los slides ni se auditó el capturador en esta revisión limitada; la primera ronda ya había descartado imputarles un fallo de app sin comprobación.
- No se inició compra, no se accedió a cuentas y no se modificó producto. No se proponen ni ejecutan rediseños adicionales para alcanzar una nota.

**Resultado de la adenda:** dos correcciones de copy verificadas. **Gate completo: sigue sin acreditarse con la evaluación disponible**, porque esta ronda no reevalúa los demás criterios ni los hallazgos pendientes. Las cifras anteriores pertenecen a la primera ronda y no se presentan como una nueva puntuación de estos renders.
