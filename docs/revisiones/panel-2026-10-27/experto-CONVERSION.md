# Panel independiente — Conversión y retención B2C

27-10-2026. Versión local actual. Solo diagnóstico.

## Dictamen y puntuaciones

**No compraría hoy con mi tarjeta.** La promesa de personalización supera lo que cambia en la experiencia, la primera visita antepone preparación a uso y la primera semana no devuelve suficiente valor acumulado. Falta además comprobar compra → correo → acceso → cancelación. Esa falta de prueba es una incógnita comercial, no evidencia de que el pago falle.

| Área | Nota /10 | Fundamento |
|---|---:|---|
| Copy | 6 | Reconoce el problema, pero asegura comprensión, registro y resultados futuros con demasiada certeza. |
| Diseño | 7 | Perspectiva secundaria de conversión: el problema principal es la jerarquía de activación y la continuidad entre presentación y producto. |
| Conversión | 5 | Se entiende la oferta; responder preguntas y ensayar un check todavía están lejos de comprobar valor propio. |
| Retención | 4 | Acumula datos, pero deja la próxima acción y la primera semana principalmente a cargo de la familia. |
| Negocio | 4 | Perspectiva secundaria: preparación comercial insuficiente para validar disposición a pagar, renovación y margen. No significa inviabilidad demostrada. |

Las notas son juicio experto, no tasas medidas ni probabilidades de éxito. No las promedio como certificación. No aplico las rúbricas oficiales de revisor visual /40 y craft /20: este es un diagnóstico de conversión, no el veredicto de ese rol. Para copy considero precisión de promesa, relevancia para el avatar, claridad de acción y transparencia; para diseño considero reconocimiento del siguiente paso, legibilidad y continuidad. No convierto esa perspectiva secundaria en certeza sobre arte.

**Único positivo:** «Antes, Durante y Después» permite explicar la unión de rutina, calma y registro en una sola idea. Conviene mantener el mecanismo y ajustar la entrega a él.

## Evidencia y límites

Leídos completos ESTADO.md, FICHA-ARTE, FICHA-AVATAR, FICHA-MERCADO, FICHA-MODELO, 02B-ONBOARDING-Y-PAYWALL y 24-GAMIFICACION. Prevalecen decisiones actuales sobre secciones históricas. Revisados código de venta, onboarding, paywall, entrada/cuenta, rutinas, diario, informe, logros, medición y correos. No se consultaron informes ni veredictos ajenos.

Antes de puntuar abrí las imágenes con view_image. Evidencia visual utilizada, toda en esta carpeta:

- Landing: exclusivamente `landing-completa-lenta-375.png` y `landing-lenta-detalle-01..06-375.png`. Los recortes son una sola página; el sexto es una franja de fondo. `landing-scroll-verificacion.json` muestra las secciones reveladas; las cinco respuestas FAQ ocultas son las colapsadas. La primera captura rápida queda retirada: sus vacíos NO son un hallazgo ni reducen la nota.
- Onboarding: `onboarding-01-nombre` hasta `onboarding-09-primera-victoria`, con sufijo `-375.png`. Son estados del recorrido. Para momento y crisis prevalecen las nuevas `onboarding-03-estable-375.png` y `onboarding-04-estable-375.png`, abiertas con view_image: ambas muestran sus cuatro opciones completas y la selección reconocible. Queda resuelta la incertidumbre de las capturas durante la animación.
- Paywall: prioridad a `paywall-configurado-01-estable-375.png` y `paywall-configurado-02..03-375.png`. La nueva captura estable del resumen, abierta con view_image, muestra las tres fotos cargadas. Contrasté también `paywall-01-375.png` y `paywall-03-375.png` para separar variantes.
- `entrada-375.png`; nueva familia `core-01-inicio`, `core-02-agenda`, `core-03-informe`, `core-04-diario`, con sufijo `-375.png`; demo `core-demo-{inicio,agenda,informe,diario,anotar,calma,rutina-nino}-375.png`.

Los candados de informe/diario en nueva familia no son pantallas rotas. Los datos demo no son resultados de clientas. El acceso simulado permite ver UI, no probar autorización real. No infiero mala posición de la barra fija por aparecer a media altura de una captura fullPage.

`evidencia.json` registra cero errores de página y ausencia de desbordamiento horizontal en el recorrido principal. No demuestra compra ni renovación. `variante-checkout.json` documenta enlace público temporal en el proceso local, sin pulsar compra. El botón deshabilitado cuando falta configuración no recibe penalización de producto. No hay venta real verificada; ocho fixtures Hotmart con respuesta 200 no sustituyen el recorrido comercial completo. No se asume IA activa.

## Hallazgos priorizados

Hecho = visible o leído directamente en código. Inferencia = daño plausible, no abandono medido. Desconocido = falta evidencia. S/M/L indican alcance pequeño/medio/transversal, no horas garantizadas.

### 1. La personalización de crisis termina en el texto — Alta, M

**Hecho:** «Kit de calma para cuando llora o grita» y «Hecho con tus 3 respuestas» aparecen en onboarding/paywall. `web/components/embudo/textos.ts:129`, `:187` y `:290` reutilizan la crisis en el copy. `app/js/datos.js:30` inicializa nombre, edad y rutina, sin aplicar respuestas de crisis; el kit parte de las mismas seis opciones (`:100`). Evidencia: onboarding-07 y paywall-configurado-01; core-demo-calma muestra la configuración estándar.

**Daño inferido:** se puede interpretar que las respuestas producen ayuda adaptada y descubrir una biblioteca estándar después de contratar. **Arreglo:** decir exactamente «elegimos una rutina inicial» y facilitar configurar lo que le ayuda. Solo afirmar adaptación cuando cambie una acción real y explicable, sin fingir evaluación clínica. **Desconocido:** valor que las familias atribuyen a cada pregunta.

### 2. «Las comidas» entrega una rutina nocturna — Alta, M

**Hecho de código:** promete «Sentarse a la mesa y probar» (`textos.ts:62`), pero `web/lib/embudo/rutinas.ts:68` asigna comidas a noche, incluyendo baño, pijama y dormir (`:50`). La asignación se repite en `app/js/datos.js:23`. La rama capturada fue mañana; no invento una captura de comidas.

**Daño inferido:** la respuesta deja de corresponder al problema por el que se empezó. **Arreglo:** rutina de comidas específica o retirar esa opción hasta tenerla; comprobar pregunta → resultado → primera rutina para cada rama.

### 3. Un rango se transforma en edad exacta no declarada — Alta, M

**Hecho:** «5 a 7 años» (`textos.ts:49`) se convierte en 6 mediante `app/js/datos.js:22` y se guarda como edad (`:34`). El informe imprime `p.edad` como años exactos (`app/js/informe.js:72`). Evidencia: pregunta onboarding-02; el problema de transformación se demuestra en código, no con la coincidencia de edad del niño demo.

**Daño inferido:** un documento para un profesional puede contener información falsa. **Arreglo:** conservar el rango o confirmar edad exacta antes de imprimir. Permitir corregirla en Ajustes no justifica asignarla en silencio.

### 4. La demo y la finalización del onboarding no prueban activación — Alta, M

**Hecho:** se pide tocar «¡Hecho!» como ensayo de mañana. El check solo cambia estado local (`web/components/embudo/Resultado.tsx:44`, `:75`). `onboarding_completado` se emite al armar el plan, antes del ensayo (`Onboarding.tsx:113`); no hay evento específico de ese toque. Evidencia: onboarding-08/09. El compromiso dirige a mañana (`textos.ts:108`).

**Daño inferido:** el negocio puede confundir presentación terminada con primera victoria, mientras la familia todavía no comprobó utilidad en su casa. **Arreglo:** separar visto, ensayado y rutina propia completada. Permitir adaptar y ensayar un paso ahora; estudiar una rutina real como activación. **Desconocido:** tiempo hasta valor con familias nuevas; no doy por cumplida la promesa de dos minutos.

### 5. La primera visita antepone tareas al resultado — Alta, M

**Hecho visual:** core-01-inicio pone ayuda urgente, foto y PIN antes de la rutina elegida. El orden está en `app/js/app.js:333`; el CTA de rutina llega en `:347`. No es una crítica a la posición de la barra fija.

**Daño inferido:** «lista en dos minutos» se convierte en otra preparación para una madre sin tiempo. **Arreglo:** protagonismo de la rutina elegida al llegar; foto opcional y PIN cuando se necesite la parte privada, explicando su función. Medir inicio y finalización de rutina, no solo configuración terminada.

### 6. El copy asegura causas, comprensión y registro — Alta, S

**Hecho:** «Es que Mateo no sabe qué viene» (`textos.ts:101`), «Mañana Mateo ya sabe qué viene» (`:225`), «Lo que pase queda anotado» (`:147`). El diario requiere registro manual (`app/js/diario.js:323`). Landing promete «sabrás qué hacer» (`web/app/page.tsx:57`) y proyecta el café caliente (`:176`). Evidencia: onboarding-05/09, paywall-configurado-03, landing-lenta-detalle-01/05.

**Daño inferido:** promesas más ciertas que la capacidad mostrada; posible expectativa de anotación automática. **Arreglo:** herramientas para anticipar y acompañar, no una causa universal; «puedes anotar lo que pase». No presentar una escena aspiracional como desenlace esperable de mañana. **Desconocido:** eficacia real; esta auditoría no hace evaluación clínica.

### 7. El aviso del día 5 todavía no es una promesa operativa demostrada — Alta, M

**Hecho:** timeline y `textos.ts:205` prometen correo. Existe plantilla (`web/lib/correos/plantillas.ts:20`) y programación dos días antes del fin de prueba (`supabase/migrations/20261025130000_correos.sql:112`). El estado actual declara envíos/agenda apagados; `web/lib/correos/config.ts:9` exige activación explícita. Evidencia: paywall-configurado-02.

**Daño inferido:** alguien podría depender del aviso para cancelar. **Arreglo:** antes de vender con esa afirmación, verificar programación, entrega y fechas; mientras tanto, condicionar o retirar la promesa. Un OTP recibido no acredita el precobro. **Desconocido:** entrega real de esa secuencia. No activar nada por esta auditoría.

### 8. El historial no desemboca en una próxima acción contextual — Alta, L

**Hecho:** diario/informe devuelven frecuencias y lo que ayudó (`app/js/informe.js:38`, `:88`, `:89`). Inicio usa horario, progreso diario y estrellas (`app/js/app.js:241`, `:325`, `:354`). Logros compara semanas (`app/js/logros.js:48`), pero Inicio no traduce lo anotado en una siguiente acción. Evidencia: core-demo-diario/informe frente a core-demo-inicio.

**Daño inferido:** obliga a buscar e interpretar el archivo; la razón de renovar se ve menos que la colección inicial de herramientas. **Arreglo:** resumen local breve de lo anotado y lo probado, con una opción para revisar la próxima rutina. Evitar causalidad y conclusiones clínicas con pocos registros. No exigir subir datos privados para lograrlo.

### 9. La app no conduce a la cuenta de suscripción — Alta, S

**Hecho de código:** `/cuenta` permite gestionar/cancelar en Hotmart (`web/app/cuenta/page.tsx:139`). Más contiene logros, informe y ajustes (`app/js/app.js:417`); la búsqueda en `app/index.html` y `app/js` no encuentra enlace a `/cuenta`.

**Daño inferido:** la promesa «cancelas cuando quieras» requiere recordar una zona separada de la app diaria. **Arreglo:** «Mi cuenta y suscripción» desde Más/Ajustes y prueba de encontrabilidad. **Desconocido:** facilidad del trámite real en Hotmart; no se completó aquí.

### 10. Instalar no garantiza conservar la inversión — Alta, L

**Hecho:** «el teléfono no borra tus rutinas ni tu diario» (`app/js/app.js:279`), visible en core-01/core-demo-inicio. Datos locales; no encontré exportación/importación restaurable en los módulos revisados. PDF del informe no restaura rutinas, fotos ni diario cifrado.

**Daño inferido:** cambiar de teléfono o borrar datos puede destruir el valor acumulado que justificaba renovar. No es una pérdida observada. **Arreglo:** corregir la garantía absoluta ya (S); respaldo/restauración protegidos (L). Explicar que la cuenta paga acceso y no equivale a respaldo.

### 11. La calidad del registro puede debilitar el valor del informe — Media, M

**Hecho:** ocho categorías iniciales; «qué ayudó» queda en detalles opcionales (`app/js/diario.js:263`); Otro cuenta como difícil (`:32`), e intensidad empieza en 3 (`:231`). El informe calcula media (`app/js/informe.js:42`). Evidencia: core-demo-anotar/diario/informe. La captura inicial del formulario no demuestra la interacción posterior; la conclusión sobre valores por defecto procede del código.

**Daño inferido:** volumen de notas con poca información para «Después» o cifras que parecen más precisas que lo registrado. **Arreglo:** confirmar intensidad o permitir sin valorar; revisar clasificación de Otro y facilitar una nota útil sobre qué ayudó. No convertir registrar crisis en obligación diaria. Llevar el resumen semanal a Inicio cuando haya datos suficientes.

### 12. Presentación y núcleo usan lenguajes visuales distintos — Media, M

**Hecho visual:** embudo con fotos y checks; Inicio/diario mezcla emojis y fotos. La rutina de noche muestra emojis de baño/pijama en agenda. Reglas distintas en `app/js/app.js:45`, `app/js/diario.js:18` y `web/components/embudo/ui.tsx:290`. «Volver del colegio» pasa a «Volver de la escuela». Evidencia: onboarding-06 frente a core-02-agenda/core-demo-anotar.

**Daño inferido:** el producto tras el precio parece menos coherente que su presentación y exige volver a reconocer herramientas. **Arreglo:** extender vocabulario y tratamiento visual al núcleo, con fotos pertinentes. No afirmo que los emojis por sí solos causen abandono.

## Las siete preguntas del paywall

Evaluación del conjunto de tres páginas configuradas. No penalizo el anual aplazado ni recomiendo inventar planes para cumplir una receta.

| Pregunta | Respuesta actual | Diagnóstico |
|---|---|---|
| ¿Qué desbloqueo? | Rutina, calma, guía, diario/informe. | Parcial: no distingue suficiente entre plantilla y plan propio. |
| ¿Por qué ahora? | Plan recién mostrado, uso desde hoy y prueba. | Hay contexto; no hace falta urgencia artificial. El compromiso a mañana retrasa comprobar valor. |
| ¿Qué pierdo si no sigo? | «Tu plan ya está en este teléfono». | Falta claridad sobre qué puedo usar sin pagar. Explicar límites reales, sin amenazas de pérdida. |
| ¿Qué gano hoy? | Rutina armada y herramientas. | Falta demostrar ajuste a mi situación más allá de un check de ensayo. |
| ¿Puedo cancelar? | Hotmart, plazo, renovación y reembolsos enlazados. | Información presente; trámite y aviso real no probados de extremo a extremo. |
| ¿Cuál plan me conviene? | Solo mensual US$4,99. | No hay comparación que resolver. No introducir un anual inexistente. |
| ¿Y si no quiero ahora? | «Ahora no, volver a su rutina». | Vuelve a la preview del onboarding; nombrar claramente el destino y el acceso real. |

La fecha de cobro se calcula como hoy local + siete días (`web/components/embudo/Paywall.tsx:39`; `web/lib/embudo/prueba.ts:13`), no procede de Hotmart. Antes del alta debe ser fecha estimada si empieza hoy; después debe usarse la contractual. S para aclarar texto, M para reconciliar el recorrido. «Tarjeta o medios locales» (`textos.ts:256`) no demuestra disponibilidad de la prueba por medio/país.

La recaptura `paywall-configurado-01-estable-375.png` muestra las tres fotos del resumen cargadas. `capturas-estables-verificacion.json` documenta opacidad 1 en las opciones y dimensiones de imagen, con ancho de contenido de 375 en las tres vistas. Retiro la incertidumbre anterior sobre opciones/fotos: no hay fallo visual demostrado en estos puntos. Estas recapturas no implican arreglos de código ni prueban compra o acceso. Conservo notas y hallazgos: la incertidumbre retirada no había recibido penalización, y los problemas de correspondencia del plan, activación y retención no cambian. La asignación de craft por vista corresponde al experto de arte; no añado una rúbrica de ese rol a este informe.

## Loop y primera semana

**Gatillo:** hora de rutina/necesidad de ayuda. **Acción:** presentar pasos, completar rutina o anotar. **Recompensa:** paso cumplido, estrella y consulta del registro. **Inversión:** fotos, rutinas editadas e historial local.

Si se borra el historial, cambian informe, diario y estrellas; la rutina sugerida depende principalmente de horario/configuración. Hay inversión acumulada, pero no un plan que aprenda de las notas. No sería correcto decir que mañana todo es idéntico ni que la app ya adapta su ayuda al historial.

No encontré especificación actual D1-D7 ni hipótesis cuantificada de activación en ESTADO. Hay consejos D1/D3/D7 preparados (`plantillas.ts:32`); D3 reconoce que no sabe qué pasó en el teléfono. No son seguimiento conductual ni envío probado.

| Día | Actual comprobable | Propuesta, todavía hipótesis |
|---|---|---|
| D1 | Demo, rutina elegida, foto/PIN. | Adaptar un paso y realizar una rutina pequeña. |
| D2 | Rutina por horario/progreso. | Retomar la misma y permitir simplificarla. |
| D3 | Consejo preparado, no activo. | Pregunta opcional sobre qué sirvió y ajuste local. |
| D4 | Sin experiencia específica identificada. | Revisar apoyos y ensayarlos en un momento tranquilo. |
| D5 | Precobro prometido/código preparado. | Fecha e importe reales y acceso directo a cancelar. |
| D6 | Sin experiencia específica identificada. | Vista previa semanal propia o explicar por qué faltan datos. |
| D7 | Herramientas y consejo preparado. | Resumen útil y decisión informada de continuar. |

Hipótesis inicial de estudio: repetir una rutina adaptada en tres días distintos de la primera semana se asociará con mayor retorno posterior. No es un «número mágico» probado: requiere cohortes, ventanas comparables y control del origen. No usar crisis como meta, puntos por abrir, competencia entre niños ni rachas punitivas. Las mecánicas de Duolingo no se trasladan automáticamente a familias bajo estrés.

## Benchmarks y negocio

El 02B cita 10,7% frente a 2,1% para descarga → pago D35, hard paywall/freemium. Verificado en la fuente primaria [RevenueCat, State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps), consultada el 27-10-2026. Selecciona apps integradas con RevenueCat y umbrales de actividad; no representa madres hispanohablantes llegando por web a Hotmart. La comparación observacional no prueba causalidad. Ninguno de esos valores es una meta propia.

Instalaciones, inicios de prueba, vistas de precio y pagos tienen denominadores diferentes. Tampoco convierto la mejora relativa de paywall multipágina citada en el SO en pronóstico aquí. Tres páginas deben resolver dudas y probarse con datos propios. Los precios históricos de competidores de FICHA-MERCADO no se usan como precios actuales verificados.

La documentación primaria de [Amplitude sobre retención](https://amplitude.com/docs/analytics/charts/retention-analysis/retention-analysis-interpret), consultada el 27-10-2026, distingue retorno exactamente en D7 de retorno en D7 o después. No son comparables sin igual definición. No doy por verificado ni uso como umbral el «7% D7 top 25%» del SO.

El código ya define activación como rutina completa en primeras 24 horas, retorno exacto D1/D7/D30 y retorno semanal (`supabase/migrations/20261021100000_cac_canales_con_gasto.sql:277`). No afirmo ausencia de analítica. Faltan datos propios fiables: separar QA/demo y familias pagadoras, ensayo y uso, conciliar pruebas/pagos y observar renovación. Abrir la app no equivale a recibir valor.

**Desconocidos comerciales:** conversión por paso/canal, abandono de checkout, entrega postcompra, uso semanal, cancelaciones/motivos, renovación, cobro neto, soporte por clienta y costo de adquisición. US$4,99 es la oferta vigente, no prueba disposición a pagar o rentabilidad. No cambiaría precio por intuición antes de contrastar valor y cobros netos reales. `/guia-gratis` ofrece descarga y captación opcional en código; sin captura de este lote ni resultados, no la puntúo visualmente ni la cuento como adquisición validada.

## Quick wins estimados en menos de una hora cada uno

Hipótesis acotadas con comprobación básica, sujetas al entorno; no prometen mejoras porcentuales ni validación comercial completa.

| Cambio | Hipótesis | Comprobar |
|---|---|---|
| Enlace «Mi cuenta y suscripción» en Más/Ajustes. | Hace encontrable el control de pago. | Localizar cuenta sin instrucciones; trámite remoto aparte. |
| «Puedes anotarlo» en lugar de «queda anotado». | Evita esperar registro automático. | Correspondencia con la acción manual. |
| Salida nombrada como preview cuando ese sea su acceso real. | Reduce ambigüedad sobre uso sin compra. | Salir y regresar sin contratar. |
| Retirar certeza sobre mañana y causa universal de crisis. | Acerca la promesa a la entrega. | Cada frase junto a la función que la sostiene. |
| Corregir garantía de instalación y calificar fecha prealta como estimada. | Reduce malentendidos sobre datos y cobro. | Revisar texto con condiciones reales. |

No incluyo respaldo, certificar precobro o validar compra/acceso como quick wins: exigen más trabajo y evidencia.

## Veredicto de compra

**¿Compraría con mi tarjeta? No hoy.** Antes querría comprobar que la rutina se ajusta a mi situación, que la app entrega lo que afirma comprender, que puedo gestionar la suscripción desde el producto y que mi primera semana devuelve valor propio. Esto no demuestra que nadie vaya a comprar: muestra por qué esta evidencia todavía no justifica mi confianza comercial.

Prioridad: corregir promesas y correspondencia del plan; acercar rutina y cuenta; comprobar recorrido comercial/precobro; probar la primera semana con familias antes de sumar gamificación, planes o tráfico pagado.

Único archivo escrito por este experto: este informe. Sin cambios de código, configuración, ESTADO, publicación o activación.
