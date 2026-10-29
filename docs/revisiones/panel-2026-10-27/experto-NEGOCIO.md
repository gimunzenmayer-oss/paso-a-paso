# Panel independiente — Negocio

27 de octubre de 2026. Perspectiva: inversionista y operador escéptico. Solo diagnóstico de la versión local actual.

## Veredicto

**No compraría hoy con mi tarjeta para incorporar esta herramienta al cuidado diario de mi familia. Tampoco financiaría anuncios todavía.** No por los US$4,99, sino porque la personalización prometida excede la adaptación entregada, la continuidad del historial depende del navegador y no se ha acreditado el recorrido compra → entrega → acceso → aviso previo → renovación/cancelación. Es una decisión personal de confianza y riesgo, no una predicción de que nadie compraría.

El negocio sigue sin validación comercial demostrada. Tener pantallas, producto activo en Hotmart o pruebas con respuesta 200 no prueba que una familia pague, vuelva, renueve y deje saldo después de atenderla.

## Alcance y evidencia

- Leí completos ESTADO.md, las cuatro FICHAS y los documentos 40-UNIT-ECONOMICS.md y 02C-PRICING-Y-MODELO-DE-NEGOCIO.md. Priorizo el checkpoint y los avances actuales del 26-10 sobre pendientes históricos. No utilicé los puntajes históricos mencionados en ESTADO para asignar los míos.
- Revisé código de venta, onboarding, precio, cuenta, acceso, rutinas, almacenamiento, diario, informe, logros, voz/sonido, correo, ingesta Hotmart y cálculos económicos del panel. No leí informes/veredictos de otros expertos ni revisiones históricas.
- Abrí las imágenes con `view_image` antes de puntuar. Para landing uso exclusivamente los seis recortes `landing-lenta-detalle-01..06-375.png`, derivados de `landing-completa-lenta-375.png`, y su verificación de scroll. Son una sola pantalla; el sexto recorte es una franja final, no una pantalla vacía. La captura rápida y sus recortes están retirados: sus vacíos no son un fallo del producto y no descuentan puntos.
- También abrí onboarding 01–09, paywall-configurado 01–03, entrada, core 01–04 y las siete core-demo: inicio, agenda, informe, diario, anotar, calma y rutina del niño. Todas se encuentran en esta misma carpeta del informe.
- Leí `LEEME.md`, `evidencia.json`, `variante-checkout.json` y `landing-scroll-verificacion.json`. El recorrido registra ancho/scrollWidth 375 y ningún error reportado. Eso no certifica todas las condiciones de uso.
- Core 01–04 es familia nueva: diario/informe cerrados con PIN no son defectos. Core-demo contiene ejemplos, no actividad ni resultados de clientas. El acceso simulado sirve para inspeccionar UI, no para acreditar autenticación o pago.
- Prioricé el paywall configurado. La ausencia de enlace en otro entorno no es un bug inevitable. No infiero mala colocación de barras fijas desde su posición en capturas largas.
- Control final: abrí con `view_image` `onboarding-03-estable-375.png`, `onboarding-04-estable-375.png` y `paywall-configurado-01-estable-375.png`, y leí `capturas-estables-verificacion.json`. Sustituyen las tomas anteriores de esas tres vistas: están visibles las cuatro opciones de momento, las cuatro opciones de crisis y las tres fotos del resumen de paywall. El archivo registra opacidad 1 en las opciones/botón comprobados, dimensiones de imágenes cargadas y ancho/scrollWidth 375. Queda resuelta la incertidumbre sobre opciones/fotos; no hubo corrección del producto. Para citas visuales del hallazgo 2, la referencia vigente del primer paywall es `paywall-configurado-01-estable-375.png`.
- No comprobé producción, facturas ni transacciones reales. Ninguna venta está verificada aquí; tampoco afirmo que no exista ninguna. Los ocho eventos genéricos Hotmart con respuesta 200 no prueban compra y acceso reales.
- No ejecuté builds, pruebas, publicaciones, activaciones ni escrituras de producto/configuración/ESTADO. La única escritura de esta intervención es este informe.

## Puntuación de las cinco áreas

Notas cualitativas del operador sobre la evidencia local, no porcentajes esperados de rendimiento. **Copy, diseño y conversión son perspectivas secundarias mías**, no certeza ni sustitución de sus especialistas. No emito certificación visual /40 o /20: no estoy actuando como revisor-visual del SO.

| Área | /10 | Fundamento |
|---|---:|---|
| Copy | 5 | Promesas sobre crisis y personalización mayores que lo demostrado; explicación individual de causas sin sustento; culpa reiterada. |
| Diseño/craft | 7 | La primera sesión prioriza preparación y otra puerta antes de la rutina; repetición de mensajes comerciales para una misma decisión. Sin penalizar evidencia rápida retirada. |
| Conversión | 5 | Vista previa, tres páginas de paywall y salida externa; aviso prometido sin certificación operativa. No existe tasa real para concluir rendimiento. |
| Retención | 5 | Historial acumulable, pero retorno y conservación poco resueltos; no hay evidencia de segunda renovación ni primera semana adaptada a los registros. |
| Negocio | 4 | Demanda recurrente sin verificar, costo de soporte desconocido y panel que puede sobrestimar lo disponible después de adquirir clientas. |

Rúbrica secundaria de copy: correspondencia con producto, precisión de promesas, confianza, utilidad de cada paso y claridad del compromiso económico. Rúbrica secundaria de craft: jerarquía de tareas, continuidad entre embudo y app, legibilidad, densidad útil y consistencia. No asigno una nota clínica ni afirmo eficacia.

Tras el control de capturas estables, **se conservan las cinco notas, los hallazgos y el veredicto**. Las incertidumbres de las tomas anteriores no habían descontado puntos; resolverlas no cambia las razones de negocio ni la jerarquía de primera sesión. No añado notas de craft por vista: esa asignación corresponde al experto de ARTE; aquí mantengo únicamente mi perspectiva secundaria global.

**Una cosa positiva:** diario → informe es un activo acumulativo concreto para investigar una suscripción. El código agrega registros, rutinas y logros por periodo (`app/js/informe.js:29`, `app/js/informe.js:82`) y las capturas demo permiten inspeccionarlo. No demuestra disposición a pagar.

## Hallazgos exactos y arreglos

Hecho = imagen/código/documento observado. Inferencia = consecuencia probable por validar. Desconocido = falta evidencia. Tamaños: S, cambio acotado hasta media jornada; M, varios cambios coordinados; L, producto/operación y validación. No son presupuestos cerrados.

### 1. Se promete un aviso de cobro que no está acreditado — crítico antes de vender

**Hecho:** `paywall-configurado-02-375.png`: «Día 5 · Te avisamos por correo · 2 días antes de cualquier cobro» (`web/components/embudo/textos.ts:205`). La implementación existe: se agenda dos días antes del fin de prueba (`supabase/migrations/20261025130000_correos.sql:110`). Pero el estado actual describe programación/envíos apagados (`ESTADO.md:11`, `ESTADO.md:12`, `ESTADO.md:13`). El trabajador exige además verificar precobro (`web/lib/correos/trabajador.ts:64`; `web/lib/correos/servidor.ts:19`).

**Desconocido:** que una compra real fije correctamente fecha/importe, ejecute la agenda y entregue el aviso antes de cobrar. Un correo aislado recibido no acredita esa cadena. No afirmo que falte la plantilla ni que SMTP siga desconectado.

**Daño, inferencia:** la clienta contrata contando con el aviso; incumplirlo puede generar reclamos y atención manual por un cobro inesperado.

**Arreglo M:** conciliar promesa con operación comprobada mediante prueba autorizada de fecha, agenda, entrega y cancelación. Mientras no pueda sostenerse, retirar la promesa absoluta. Activar un interruptor no equivale a certificar la entrega.

### 2. «Hecho con tus 3 respuestas» exagera la personalización — alto

**Hecho:** primer paywall configurado: «Hecho con tus 3 respuestas» (`web/components/embudo/textos.ts:187`). La rutina depende del momento (`web/lib/embudo/rutinas.ts:73`); comidas y dormir apuntan a la misma rutina de noche (`web/lib/embudo/rutinas.ts:65`). La edad se convierte en un valor representativo —5–7 → 6—, no en adaptación de pasos (`app/js/datos.js:22`, `app/js/datos.js:34`). La crisis modifica frases, mientras el alta de datos no crea un protocolo individual para ella (`app/js/datos.js:30`).

**Daño, inferencia:** una madre que eligió comidas recibe baño, pijama y cuento dentro de una propuesta presentada como plan propio. La decepción puede llegar antes del primer cobro.

**Arreglo M:** describir honestamente una rutina preparada para el momento elegido; cubrir comidas o retirar esa opción. Pedir edad/crisis con utilidad explícita y sin presentar consejos generales como adaptación clínica. No hace falta incorporar IA.

### 3. La primera sesión pone preparación antes de uso — alto

**Hecho visual:** `core-01-inicio-375.png` muestra «Tus primeros pasos», «Pon una foto de tu casa», «Crea tu PIN» y «Espacio de Mateo» antes de la tarjeta de rutina. Código: `app/js/app.js:332`, `app/js/app.js:335`, `app/js/app.js:341`. En el inicio demo se llega antes al CTA porque falta la tarjeta de configuración.

**Daño, inferencia:** después de prometer una rutina lista en dos minutos, el producto parece pedir más preparación. Marcar un paso durante el onboarding no prueba que la familia use la rutina con su peque.

**Arreglo M:** priorizar ejecutar la rutina elegida y ofrecer configuración progresiva después. Mantener protección del diario sin convertir subir fotos en requisito implícito para empezar. Medir toque demo y primera rutina real por separado.

### 4. Se vende continuidad sin recuperación del historial — alto

**Hecho:** privacidad admite que no hay copia y borrar datos pierde información; propone PDF (`web/app/privacidad/page.tsx:38`). Los datos viven en el navegador (`app/js/datos.js:370`). No encontré exportación/importación restaurable de rutinas, fotos, voces y diario en el código revisado. El PDF no reconstruye ese conjunto. Sin embargo, ambos inicios dicen al instalar que «el teléfono no borra tus rutinas ni tu diario» (`app/js/app.js:279`).

**Daño, inferencia:** cambiar teléfono, borrar navegador o cambiar de dominio puede destruir la inversión que sostiene la renovación. Una cuenta no sincroniza por sí sola esos datos. Instalar no equivale a disponer de copia recuperable.

**Arreglo L:** copia cifrada exportable/restaurable, probada en otro dispositivo; transferencia antes de mudar clientas de origen web. **S inmediato:** retirar la garantía de conservación por instalar y explicar límites antes de acumular datos. No exige enviar información del niño a la nube.

### 5. Guardar no confirma una escritura duradera — alto, observado en código

**Hecho:** `PP.guardar` devuelve sin error si no consigue base, conserva memoria ante excepciones y no espera completar la transacción (`app/js/datos.js:380`). El diario utiliza esa promesa (`app/js/diario.js:59`). No provoqué pérdida real ni conozco frecuencia.

**Daño, inferencia:** la familia cree guardar una nota y puede perderla al cerrar. Amenaza la confianza y la utilidad del informe.

**Arreglo M:** confirmar persistencia antes de anunciar guardado, avisar cuando solo hay memoria temporal, conservar borrador y verificar recarga/fallos de almacenamiento. Antes de añadir funciones.

### 6. «Te quedaron … limpios» no descuenta automáticamente anuncios — alto para la dueña

**Hecho:** `v_queda` resta impuestos, IA, infraestructura, correo y otros (`supabase/migrations/20261021100000_cac_canales_con_gasto.sql:168`). Adquisición se calcula aparte (`...sql:214`). La UI describe «todo lo que costó vender y operar» (`web/app/admin/(privado)/page.tsx:271`) y «Te quedaron … limpios» (`.../page.tsx:523`). Anuncios registrados en adquisición no se descuentan automáticamente de ese resultado.

**Daño, inferencia:** financiar un canal deficitario creyendo ver beneficio. Anotarlos también como «otros» requiere doble registro y arriesga doble descuento futuro.

**Arreglo M:** separar contribución antes de adquisición, resultado después de adquisición y caja liquidada. Restar anuncios una sola vez; incorporar soporte/trabajo y mantener faltantes visibles. Una etiqueta «estimación» no corrige una fórmula incompleta.

### 7. Valor de clienta y recuperación de adquisición usan ingresos — alto antes de anuncios

**Hecho:** el ingreso medio usa liquidación Hotmart cuando existe (`supabase/migrations/20261021100000_cac_canales_con_gasto.sql:101`); no corresponde llamarlo simplemente facturación bruta. Pero valor de vida = ingreso medio / bajas (`...sql:212`) y recuperación = costo de adquisición / ingreso medio (`...sql:484`), sin descontar servicio/soporte. UI: «lo que te deja», «Sano: 3 a 1 o más» (`web/app/admin/(privado)/page.tsx:139`, `.../page.tsx:159`). El valor global se reutiliza por canal (`...sql:244`) aunque tengan permanencias y comisiones diferentes.

**Daño, inferencia:** recuperación aparentemente más rápida y valor económico excesivo para decidir cuánto gastar. La lectura de bajas también debe separar pruebas de pagadoras antes de modelar permanencia.

**Arreglo M:** etiquetar los indicadores actuales como basados en ingresos; decidir con contribución por cohorte/canal, después de costo variable. No autorizar inversión mediante un semáforo y pocos meses de medias globales. Los ejemplos simplificados del SO no convierten ingresos en beneficio.

### 8. Certeza excesiva sobre crisis y causas individuales — alto para confianza

**Hecho:** landing lenta detalle 01: «en la crisis, sabrás qué hacer» (`web/app/page.tsx:57`). Onboarding 05: «Es que Mateo no sabe qué viene» (`web/components/embudo/textos.ts:101`). Landing lenta detalle 02 insiste en «noches de culpa» y «con menos fuerzas» (`web/app/page.tsx:85`, `web/app/page.tsx:87`). Los términos declaran que no prometen resultados concretos (`web/app/terminos/page.tsx:33`).

**Daño, inferencia:** una explicación general se lee como diagnóstico individual y el kit como garantía de saber resolver. El pie legal no neutraliza la promesa inicial. Repetir culpa puede erosionar confianza en la audiencia descrita por la ficha.

**Arreglo S para copy, M para comprobar comprensión:** prometer herramientas para anticipar, acompañar y registrar; explicar variabilidad y límites. Mostrar acciones concretas. No atribuir una causa individual por responder un cuestionario. Esto no constituye una evaluación clínica.

### 9. Renovar depende demasiado de una colección de herramientas — medio/alto

**Hecho:** hay progreso, estrellas e informe acumulado (`app/js/app.js:345`, `app/js/logros.js:20`, `app/js/informe.js:29`): sería falso decir que borrar historial deja toda la app idéntica. Pero la rutina principal se elige por hora, no por registros del diario (`app/js/app.js:242`). El correo D3 da un consejo general (`web/lib/correos/plantillas.ts:33`); D1/D3/D7 son marketing sujeto a consentimiento (`web/lib/correos/trabajador.ts:31`), no acompañamiento universal del trial.

**Daño, inferencia:** tras preparar rutinas, la familia puede sentir que paga por mantener un conjunto estático. No sé cuántas lo sentirán: no hay renovación medida.

**Arreglo M:** diseñar D1 ejecución, D2 repetición, D3 revisión local, D4 ajuste elegido por la familia, D5 estado/aviso real, D6 informe si hay datos y D7 decisión de continuidad. Sin inventar patrones con pocas notas ni exigir crisis para recibir valor. Medir retorno y renovación.

### 10. Investigación no equivale a demanda recurrente — alto para inversión

**Hecho documental:** sin entrevistas (`FICHA-AVATAR.md:54`) ni datos propios de conversión (`FICHA-MERCADO.md:24`). La ficha mezcla referencias internacionales, pagos únicos y fuentes pendientes; la afirmación de hueco se matiza después (`FICHA-MERCADO.md:30`, `FICHA-MERCADO.md:33`). No adopté precios históricos ni benchmarks del SO como objetivos del nicho.

**Desconocido:** ventas verificadas, renovaciones, costo de adquisición, bajas, devoluciones, minutos de soporte, mezcla de países y condiciones de afiliados.

**Daño, inferencia:** confundir dolor real con que este producto/precio/canal dejan ingresos recurrentes. Tampoco hay fundamento para declarar imposible US$4,99 o subirlo automáticamente.

**Arreglo L:** piloto pequeño con familias del segmento, observación de primera sesión y dos oportunidades de renovación. Registrar razones de abandono y tiempo de soporte. Tratar primeros casos como aprendizaje, no como tasa estable.

## Economía con escenarios explícitos

**Base observada:** único mensual US$4,99, prueba 7 días (`FICHA-MERCADO.md:37`; `web/components/embudo/textos.ts:231`; paywall configurado 03). No propongo anual ni descuentos automáticamente. Los términos todavía mencionan mensual/anual (`web/app/terminos/page.tsx:46`): desajuste textual, no prueba de un anual comprable.

### Fuentes primarias consultadas el 27-10-2026

- Hotmart: para microtransacción USD hasta US$15, 9,9% + US$0,10 cuando compra/comisión son USD; para compra distinta de la moneda de comisión y valor hasta US$5, documenta 20%. Son alternativas, no se suman. La tarifa concreta de esta cuenta exige liquidación real. [Ayuda oficial](https://help.hotmart.com/es/article/208298448), [política de pagos](https://hotmart.com/es/legal/politica-de-pago).
- Vercel Pro: base US$20/mes; Hobby es para uso personal no comercial. No verifiqué contratación actual. [Precios oficiales](https://vercel.com/pricing).
- Supabase: gratuito o Pro desde US$25/mes para primer proyecto, según condiciones/uso; no es factura comprobada. [Precios oficiales](https://supabase.com/pricing).
- Resend: gratuito 3.000 correos/mes y 100/día; Pro US$20/mes por 50.000. El límite diario importa para avisos y códigos. [Precios oficiales](https://resend.com/pricing).

Son precios de proveedor, no costos efectivos de Paso a Paso. Faltan impuestos aplicables, cambio/tarjeta/retiro cuando correspondan, dominio, excedentes, contabilidad y trabajo. No presupongo tasa tributaria ni doy dictamen fiscal.

### Verificación de IA

No encontré proveedor de IA integrado en las rutas/módulos de ejecución revisados. Rutinas predefinidas (`web/lib/embudo/rutinas.ts:25`), informe local (`app/js/informe.js:29`), voz del navegador (`app/js/voz.js:56`) y música Web Audio (`app/js/calma.js:97`). Privacidad declara que no usa IA (`web/app/privacidad/page.tsx:65`).

**Costo de inferencia de IA del producto revisado: US$0.** No agrego generaciones ni créditos ficticios. La tabla `ai_calls` no prueba IA activa. Esto no afirma cómo se crearon históricamente los materiales ni que alojamiento/soporte sean gratis.

### Por cobro de US$4,99, antes de servir a la clienta

Afiliados 30% y 50% son escenarios hipotéticos, no programa activo verificado. Para estrés se descuentan del bruto; el contrato real podría usar otra base. Si son recurrentes, descuentan cada mes; si solo primera venta, pertenecen a adquisición inicial, sin duplicarlos.

| Concepto hipotético, USD | Directo | Afiliado 30% bruto | Afiliado 50% bruto |
|---|---:|---:|---:|
| Hotmart 9,9% + 0,10 | 0,5940 | 0,5940 | 0,5940 |
| Afiliado de ese cobro | 0 | 1,4970 | 2,4950 |
| Saldo tras plataforma/afiliado | 4,3960 | 2,8990 | 1,9010 |
| Alternativa: saldo si Hotmart aplica 20% | 3,9920 | 2,4950 | 1,4970 |

Esto **no es ganancia limpia ni margen certificado**: faltan servicio, soporte, impuestos, devoluciones y adquisición. No convierto el monto chileno documentado en un margen USD sin liquidación.

Sensibilidad al trabajo: valorar una hora de soporte en US$10 es un supuesto contable, no tarifa observada de mercado. Cinco minutos/mes cuestan US$0,8333 por clienta. En el escenario Hotmart 20% quedarían 3,1587 directo; 1,6617 con afiliado 30%; 0,6637 con afiliado 50%, antes del resto. Quince minutos cuestan US$2,50: quedarían 1,4920; −0,0050; −1,0030. El soporte puede consumir el saldo aun sin IA. Hay que medir minutos reales y separar ayuda de acceso de asesoría que no corresponde al producto.

### Piso de equilibrio y caja a 90 días

Supuesto ilustrativo de fijos: Vercel Pro + Supabase Pro = US$45/mes, sin excedentes y con Resend gratuito. No son facturas. Con otros variables/soporte artificialmente en cero, cubrir solo esos US$45 exige:

| Pagadoras, redondeo hacia arriba | Directo | Afiliado 30% | Afiliado 50% |
|---|---:|---:|---:|
| Hotmart 9,9% + 0,10 | 11 | 16 | 24 |
| Hotmart 20% | 12 | 19 | 31 |

Es un mínimo aritmético incompleto, no equilibrio real. Con Resend Pro los fijos del ejemplo serían US$65 antes de impuestos/otros. El trabajo de la dueña no desaparece si no cobra sueldo.

Una prueba iniciada hoy podría llegar a tres cobros en 90 días; no predigo que ocurra. En directo con tarifa 20%, uno/dos/tres cobros dejan 3,992 / 7,984 / 11,976 antes de costos omitidos. Con afiliado 50% recurrente: 1,497 / 2,994 / 4,491. No son valor de vida ni ventas proyectadas.

Modelo a completar: `caja90 = N × (m1 + q2×m2 + q3×m3) − adquisición − costo de pruebas sin pago − fijos90 − devoluciones no incluidas`. N = primeras pagadoras; q2/q3 = fracción de esa misma cohorte que efectivamente paga segunda/tercera vez; m = contribución tras plataforma, afiliado, impuestos y servicio variable, con ajustes correspondientes. No asigno números a esas variables. No contar fijos ni devoluciones dos veces.

**Hoy no hay CAC máximo ni valor de vida defendibles con datos propios.** Puede acordarse un límite conservador de adquisición sobre contribución observada a 90 días, pero no llamarlo «LTV/CAC ≥3 demostrado». No usar bajas de otras categorías para justificar inversión aquí.

## Riesgos y decisiones de los próximos 90 días

| Ventana | Riesgo | Evidencia necesaria | Decisión si falta |
|---|---|---|---|
| D0–14 | Paga y no entra; aviso prometido no llega; configuración retrasa uso | Compra autorizada, acceso, liquidación, fecha/aviso/cancelación conciliados y primera rutina observada | No aumentar tráfico comercial antes de asegurar entrega. |
| D15–30 | Soporte consume precio; pérdidas de datos; hábito débil | Minutos por caso/clienta, persistencia tras recarga, conservación/transferencia y retorno de pagadoras separado de demo | Corregir conservación/activación; no sumar herramientas por intuición. |
| D31–60 | Primera renovación débil; beneficio aparente sin adquisición | Primera cohorte frente a segundo cobro, bajas de prueba separadas, devoluciones y cuentas conciliadas | No escalar por número de trials ni semáforo del panel. |
| D61–90 | Agotamiento del canal orgánico; afiliación recurrente estrecha saldo; fatiga de la dueña | Tercer cobro donde corresponda, contribución por canal/país, horas y caja | Mantener aprendizaje o ajustar oferta/canal con evidencia; no imponer anual por benchmark. |

No fijo tasas de éxito inventadas. Antes del piloto debe acordarse pérdida máxima de caja y horas disponibles. No tener ventas verificadas no equivale a demostrar que existen cero ventas.

## Quick wins menores de una hora

Propuestas individuales acotadas; no ejecutadas. Son hipótesis, sin aumentos de conversión/ingreso prometidos y sin incluir certificación completa.

1. **20–40 min:** cambiar la causa individual «Es que no sabe qué viene» por observación del momento elegido. Hipótesis: reduce distancia entre promesa y ayuda real; comprobar comprensión.
2. **20–40 min:** sustituir «Hecho con tus 3 respuestas» por descripción verificable de rutina preparada. Hipótesis: evita expectativas de personalización no entregada.
3. **15–30 min:** corregir la garantía de conservación por instalar. Hipótesis: menos sorpresas; no restaura datos perdidos.
4. **30–45 min:** etiquetar resultado antes de adquisición y métricas basadas en ingresos mientras se corrigen fórmulas. Hipótesis: evita decisiones erróneas, no crea beneficio por sí mismo.
5. **15–30 min:** alinear términos con el único mensual vigente. Hipótesis: menos ambigüedad comercial, sin sustituir revisión jurídica.
6. **30–45 min:** preparar registro operativo mínimo de cobros conciliados, incidencias de acceso y minutos de soporte, sin datos del niño. Hipótesis: revela si el precio paga trabajo; reunir observaciones reales tarda más de una hora.

## Qué cambiaría mi decisión

Una compra autorizada con entrega/cancelación correctas; familia nueva ejecutando su rutina sin ayuda de la dueña; trabajo guardado recuperable; primeras renovaciones cuya contribución pague servicio y soporte. Para invertir exigiría además cuentas conciliadas por canal y un presupuesto de adquisición compatible con esa contribución. Añadir funciones o insistir más en «gratis» no sustituye esa evidencia.
