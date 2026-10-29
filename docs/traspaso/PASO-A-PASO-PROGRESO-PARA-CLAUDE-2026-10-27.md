# Paso a Paso — progreso y traspaso a Claude

Fecha de corte: 27 de octubre de 2026 · Chile (America/Santiago).
> ACTUALIZACIÓN MÁS RECIENTE: Giselle aprobó después tres bloques: acceso poscompra, guardado duradero y promesas honestas. Se implementaron correcciones locales y pruebas; leer `docs/revisiones/correcciones-2026-10-27/CIERRE.md` y ESTADO.md para la verificación final y pendientes. No repetir el panel ni esos arreglos. Producción no actualizada; campañas apagadas. La compra→correo→entrada real sigue sin certificarse. Esta actualización sustituye las menciones anteriores a «sin arreglos aprobados».
> ACTUALIZACIÓN POSTERIOR DEL27-10: el panel se retomó y COMPLETÓ con los4expertos independientes. Ver docs/revisiones/panel-2026-10-27/REPORTE-PANEL.md y experto-COPY/ARTE/CONVERSION/NEGOCIO.md. Copy12/20; notas especialistas:copy6,diseño6,conversión5,retención4,negocio4 sobre10; tabla completa en reporte. No se aprobó ni implementó ningún arreglo. La sección10 y el mensaje sugerido de este traspaso describen la interrupción anterior y quedan sustituidos en ese punto: no convocar el panel de nuevo; leer sus resultados y esperar qué mejoras elige Giselle. Los correos siguen apagados. Tres capturas adicionales estables completan opciones/fotos antes incompletas.
Preparado a petición de Giselle. Este archivo es un documento de traspaso, no una ficha nueva del sistema. La memoria canónica sigue siendo ESTADO.md y las cuatro FICHAS. No contiene valores de claves privadas.

## 1. Lee esto antes de trabajar

1. Habla español simple y guía de a un paso. Giselle no es técnica. No le pidas claves por chat ni capturas con valores visibles.
2. Lee AGENTS.md/CLAUDE.md, ESTADO.md y las cuatro FICHAS. Después consulta los documentos de docs/sistema que correspondan a la tarea.
3. ESTADO.md contiene secciones históricas contradictorias. La sección actual y las actualizaciones de este traspaso prevalecen sobre frases antiguas como «no hay Supabase», «Hotmart en borrador» o «no hay correo».
4. No confundas código local, pruebas con simulación y servicio real. Hay cambios sin publicar y una compra real completa aún NO está verificada.
5. No borrar, resetear, sobrescribir ni publicar en bloque el trabajo sin revisar los cambios existentes. No modificar .env ni copiar sus valores a informes, Git o terminal.
6. El panel ya se completó. Después, Giselle aprobó acceso poscompra, guardado y promesas honestas; se trabajó localmente en esos tres bloques. Las demás mejoras del panel no están aprobadas. Ver el cierre de correcciones y ESTADO.md.
7. La petición inmediata es entregar este archivo para continuar con Claude. No implica autorizar campañas ni nuevas acciones de cobro.

## 2. Ubicación exacta y versiones

- Carpeta compartida exterior: C:\Users\dulce\OneDrive\Desktop\claude\App1
- Repositorio real: C:\Users\dulce\OneDrive\Desktop\claude\App1\paso-a-paso-traspaso
- Aplicación Next.js: subcarpeta web
- Aplicación interna sin build: subcarpeta app; se copia a web/public/app mediante web/copiar-app.mjs.
- Rama local comprobada: traspaso.
- HEAD local comprobado: defc619 — Hotmart: sin garantía de 30 días, migración del aviso (sin aplicar) y traspaso.
- Hay muchos cambios locales anteriores sin commit. Ver git status/diff antes de tocar nada. No se hizo commit/push/publicación del código nuevo de correos durante esta continuación.
- Producción vista en Vercel sigue basada en 5a9f1b8, redistribuida por la dueña para incorporar variables. Redistribuir esa versión NO publica las nuevas funciones locales.
- Repositorio remoto conocido: gimunzenmayer-oss/paso-a-paso. Verifica configuración y rama de producción antes de publicar.
- Stack comprobado: Next.js16.4.2, React19.3, Supabase, Playwright-core1.64.1, PGlite0.5.11. Shell PowerShell.

## 3. Producto y decisiones vigentes

Paso a Paso es una aplicación web instalable para madres, padres y cuidadores de niños autistas de2 a12años. Incluye zona de familia y espacio del niño, agenda visual, tablero de comunicación, temporizador, kit de calma, historias sociales, diario, logros e informe imprimible para profesionales.

- Diferenciación: «Antes, Durante y Después»: anticipar la rutina, acompañar en el momento difícil y registrar lo ocurrido.
- Arquetipo: cuidador sereno; cálido, claro, sin culpar a la familia.
- Datos del niño: se guardan en el dispositivo. El diario se cifra con el PIN cuando el cifrado está disponible. No confundirlo con una copia de seguridad en la nube.
- No hay IA de generación activa en esta app; no inventar costos de IA ni prometer personalización clínica.
- Oferta definitiva actual: SOLO US$4,99/mes. Plan anual aplazado.
- Prueba:7días. Plazo de reembolso configurado:7días. NO sumar los plazos ni restaurar «30días de garantía».
- Mensaje actual de la oferta: si cancelas en Hotmart antes del día7, no pagas. Comprobar las condiciones reales del primer cobro/reembolso antes de formular garantías adicionales.
- No hay testimonios ni entrevistas de familias acreditados. No fabricarlos.
- FICHA-AVATAR.md aprobada el20-10; FICHA-MERCADO.md tiene referencias históricas de competidores, algunas sin verificar. No presentarlas como datos actuales confirmados.
- FICHA-ARTE: fondo #F2F4EF; salvia #4A765F; niebla #4F6D86; Lexend y Atkinson Hyperlegible. La app construida es la referencia visual, no una app externa ni la portada de Hotmart.

## 4. Direcciones y cuentas del negocio

- Sitio usado y redirecciones de acceso: https://paso-a-paso-sigma.vercel.app
- Vercel también muestra hadaapps.com asociado. No cambiar automáticamente el dominio de auth/correos sin verificar DNS y redirecciones.
- Proyecto Vercel: paso-a-paso, equipo giselle10. Panel visto con plan Hobby; verificar elegibilidad comercial/plan antes de vender. No contratar planes por cuenta de la dueña.
- Supabase: proyecto uvubnzymrkqirdvneeds, región SãoPaulo.
- Resend: cuenta hadaapps. Dominio de servicio verificado acceso.hadaapps.com.
- Soporte y pruebas autorizadas: hadaapps@gmail.com.
- Hotmart: producto8796204, «paso a paso».
- Venta externa: https://go.hotmart.com/W108168393K
- Pago: https://pay.hotmart.com/W108168393K
- Página de producto: https://go.hotmart.com/W108168393K?dp=1

## 5. Qué se comprobó realmente fuera del código

### Acceso de la app
- Giselle recibió el código de6dígitos y entró a /app/index.html.
- También probó una cuenta nueva y confirmó que funcionó.
- Supabase Auth usa plantillas en español con {{ .Token }}. No sobrescribirlas con una versión antigua de magic link.
- Se cambió y reabrió para comprobar Email OTP expiration a600segundos; longitud6.
- SMTP configurado por la dueña: Resend, puerto465, remitente acceso@acceso.hadaapps.com, nombre Paso a Paso.
- SiteURL es la URL Vercel actual; conservar callbacks de clientas y administración hasta auditar cambios.
- Esto NO demuestra que una compra conceda el plan correcto ni que no haya acceso sin pagar. Esa auditoría sigue pendiente.

### Resend y DNS
- acceso.hadaapps.com aparece Verified; envío activado, recepción desactivada; Forge SãoPaulo.
- DKIM y registros de envío/SPF figuran verificados. DNS raíz DMARC: p=none, sin dirección de reportes rua.
- No hay verificación de news.hadaapps.com para marketing.
- Se envió UNA prueba aislada a hadaapps@gmail.com con la clave existente. Resend la aceptó y Giselle confirmó llegada a Recibidos.
- Recibo: docs/correos/prueba-servicio-resultado.json. No repetir ni borrar el recibo para forzar otro envío.
- No se inspeccionaron las cabeceras completas del mensaje para certificar alineación SPF/DKIM/DMARC. Aceptado no equivale automáticamente a entregado.

### Hotmart
- Producto aprobado y Ventas activas, según capturas posteriores de la dueña. Los registros anteriores «Borrador» ya no describen el estado más reciente.
- Checkout abierto desde Chile mostró CLP$5.212/mes y7días de prueba seleccionados. Es una observación del26-10, no una cotización permanente.
- Se vio la opción «Quiero un periodo gratis»; al quitarla desapareció la explicación y al restaurarla volvió.
- No se completó compra ni se introdujeron datos de tarjeta. No hay ventas reales verificadas.
- Contenido publicado: módulo «Empieza aquí», clase «Cómo entrar a Paso a Paso», enlace /entrar, correo de compra y código6dígitos, soporte.
- La portada del producto y la miniatura de clase fueron cargadas por Giselle.
- Envíos propios/nativos de Hotmart aún no auditados: evitar duplicar mensajes de carrito o pago fallido.

### Webhook de Hotmart (aviso automático de pagos)
- Registrado para SOLO producto8796204, versión2.0.0.
- URL: https://paso-a-paso-sigma.vercel.app/api/webhooks/hotmart
-8eventos: compra aprobada, completa, reembolsada, contracargo, vencida, atrasada; cancelación de suscripción y cambio de plan.
- Abandono de carrito NO estaba seleccionado en la configuración real registrada.
- Primera prueba:4HTTP200 y4HTTP500. Supabase confirmó duplicado profiles_email_key(23505) y deadlock por eventos simultáneos.
- Reparación autorizada y APLICADA: supabase/migrations/20261026210000_hotmart_concurrencia.sql. Conserva la función existente, toma un bloqueo transaccional antes de los eventos y usa upsert por correo.
- Comprobación real: reparacion_instalada=true. Se reintentaron las cuatro pruebas fallidas; historial final8/8HTTP200Procesado.
- Evidencias: docs/revisiones/hotmart-reparacion-aplicada.png y hotmart-prueba-8-procesados.png.
- IMPORTANTE: los datos de prueba genéricos tenían product.id=0. No certifican el producto8796204, una suscripción real, sus fechas ni el correo de acceso postcompra.

## 6. Correos: inventario implementado localmente

Giselle aprobó inventario/plan con «ok». Código y plantillas están preparados; NO significa que estén publicados o activos.

Plantillas en web/lib/correos/plantillas.ts:
- Transaccionales: acceso, recuperación, administración, aviso previo al cobro, pago fallido días1/3/5/7, pago recuperado, cancelación, reembolso y cuenta eliminada.
- Carrito:2h/24h/72h.
- Bienvenida/activación: días1/3/7.
- Regreso:30/60/90días.
- Recurso: confirmar, entregar regalo y nutrición días1/2/3/5/7.
-28plantillas; dos asuntos alternativos por plantilla no significan dos envíos. Incluyen texto plano, HTML, preheader, CTA y trazabilidad al avatar.

Infraestructura local:
- web/lib/correos/envio.ts: separa servicio y marketing, valida remitente y formato de clave.
- config.ts: indicadores apagados por defecto y dominio de servicio verificado independiente de marketing.
- trabajador.ts: prioridades, consentimiento, supresiones, revalidación de estado, contenido cifrado estable e idempotencia; límite de reintento23h frente a ventana de proveedor24h; casos que requieren revisión manual.
- servidor.ts: genera acceso mediante Supabase en servidor, sin exponer service_role al navegador.
- /api/correos/procesar: protegido con CRON_SECRET; GET/POST, duración máxima60s.
- /api/webhooks/resend: validación de firma, tiempo, duplicados, rebotes y quejas. Firma real pendiente de configurar.
- Baja con confirmación en GET y baja de un clic por POST, doble confirmación para captación.
- Carrito2.0 validado por producto/oferta/edad del evento, sin conceder acceso ni inventar consentimiento.
- Cuenta eliminada: solo plantilla; NO existe eliminación integral conectada. No enviar ese mensaje como si se hubiera borrado la cuenta.
- Aviso previo al cobro: apagado hasta verificar fechas e importe reales. El paywall todavía promete correo de Día5; es un punto crítico de coherencia pendiente.

Recurso gratis:
- /guia-gratis ofrece «Mi primera rutina», PDF de una página rellenable, descarga sin exigir correo.
- web/public/recursos/mi-primera-rutina.pdf; copia output/pdf/mi-primera-rutina.pdf.
- Captación opcional, doble confirmación, consentimiento, trampa para bots y límite compartido10solicitudes/h; sigue apagada.
- Antes de habilitarla hay que completar privacidad/retención y baja real.

## 7. Base de correos y programación instaladas, APAGADAS

Giselle autorizó explícitamente instalar esta infraestructura en Supabase, sin activar campañas.

APLICADAS mediante SQL Editor:
- supabase/migrations/20261025130000_correos.sql
- supabase/migrations/20261026220000_correos_programacion.sql

Instalan tablas privadas de contactos, cola, eventos y límites, protección de datos, funciones de operación y un despachador privado con pg_cron/pg_net. No hicieron cargas masivas ni envíos a clientes.

Última comprobación directa de la instalación:
- enabled=false
- tareas activas=0
- correos en cola=0
- protección de datos activa=true
- acceso público a la cola=false
- ejecutar el trabajador apagado devolvió NULL, sin peticiónHTTP.
Evidencia: docs/revisiones/correos-instalados-apagados.png.

Programación elegida: Supabase, cada5min cuando se autorice activarla. No copiar el ejemplo cada5min a VercelHobby, que limita cron a frecuencia diaria.

- Script preparado, NO ejecutado: docs/correos/activar-programacion.sql.
- Nombre previsto del trabajo: paso-a-paso-correos.
- Toma SOLO el secreto de Vault llamado paso_a_paso_correos_cron y lo usa contra la ruta fija /api/correos/procesar.
- El valor debe coincidir exactamente con CRON_SECRET de Vercel.
- NO usar service_role como contraseña del programador.
- La dueña YA GUARDÓ paso_a_paso_correos_cron en Vault: captura del27-10 muestra la fila y valor oculto. Esto confirma presencia, no una comparación de valores ni una llamada real exitosa.
- Guardarlo NO activó el cron. PeticiónHTTP real de programación todavía no probada.

ADVERTENCIA DE MIGRACIONES: se aplicaron scripts manualmente. Reconciliar historial antes de cualquier db push. No volver a ejecutar a ciegas CREATE TABLE de la cola. La reparación posterior de concurrencia también debe preservarse.

Migración de catálogo/orden supabase/migrations/20261025010000_hotmart_producto_y_orden.sql: preparada localmente; NO hay comprobación de aplicación en este seguimiento. Verificar catálogo8796204 y orden de eventos antes de lanzar. No asumir que las pruebas genéricas lo certifican.

## 8. Variables y custodia de secretos

Ver nombres y defaults seguros en docs/correos/variables.ejemplo.txt. Nunca copiar los valores a este documento.

Confirmado por capturas o respuesta de la dueña:
- HOTMART_HOTTOK: Secret, Producción; fue utilizado en la redistribución anterior.
- RESEND_API_KEY_TX: Secret nuevo de Producción; se conservó el existente de Preview/traspaso.
- SUPABASE_SERVICE_ROLE_KEY: Secret, Producción, guardado por Giselle.
- EMAIL_ENVIO_ACTIVO=false en Producción, según confirmación de Giselle.
- EMAIL_PAYLOAD_KEY, EMAIL_UNSUBSCRIBE_SECRET y CRON_SECRET: sustituciones nuevas guardadas según las confirmaciones de Giselle. Verificar funcionamiento después de publicar sin revelar sus valores.
- Vault: paso_a_paso_correos_cron ya aparece guardado.

Pendientes de verificación/configuración:
- RESEND_WEBHOOK_SECRET y callback firmado real.
- Indicadores de dominio/configuración de correos en Producción.
- Checkout mensual de Producción y configuración usada por el próximo build.
- Marketing: sin dominio separado verificado; mantener apagado.
- No hay constancia de redistribución del código nuevo tras las últimas altas de secretos.

Incidente ya gestionado parcialmente:
Giselle pegó inicialmente tres líneas completas de configuración dentro de un solo campo y compartió una captura con tres secretos internos visibles. Se generaron reemplazos PRIVADOS. No repetir los valores viejos ni reutilizarlos. No se vio expuesta en ese incidente la clave de Resend, service_role o hottok.

Archivos privados ignorados por Git (NO adjuntarlos a Claude por chat ni incluirlos en un ZIP compartido):
- web/.env.correos-prueba.local: clave existente para la prueba aislada.
- web/.env.correos-servidor.local: reemplazos internos.
- web/.env.valor-cifrado.local, web/.env.valor-baja.local, web/.env.valor-cron.local: cada uno contiene solo su valor individual.

La dueña pudo abrirlos con Windows+R y notepad usando la ruta absoluta; los enlaces del editor a veces abren una vista de solo lectura. No generar otros reemplazos sin necesidad: el valor del cron ya se copió a dos servicios y debe coincidir.

## 9. Diseño y pruebas completadas antes del panel

### Entrada /entrar
Rediseño local aprobado por «hazlo tú»: bienvenida con fotos, formulario compacto, CTA próximo al campo, código simplificado. Revisor independiente:37/40usabilidad y16/20craft. Capturas y veredicto docs/revisiones/entrada-*. No publicado en este seguimiento.

### Oferta y paywall
Precio local unificado aUS$4,99mensual; quitados anual y garantía30días. Se preservan cambios de otros hilos. La revisión final del precio tuvo correcciones posteriores y NO debe describirse como certificación total cerrada. Ver precio-veredicto.md y precio-cierre.md.

### Guía gratis
Revisor independiente Halley, segunda ronda:37/40usabilidad,17/20craft,18/20copy. docs/revisiones/guia-veredicto.md. PDF y capturas revisados. Activación de captación aún pendiente.

### Comprobaciones técnicas
- Última batería completa informada:71/71tests pasando.
- Una prueba posterior de programación PGlite pasó:72por bloques, no afirmar una ejecución nueva de las72juntas.
- Build/TypeScript y lint de los cambios revisados pasaron.
- Guía:360/375/1440px sin desborde ni errores; estados del formulario simulados, sin correos reales adicionales.
- Reparación Hotmart:2pruebas PGlite y8fixtures reales procesados; estas evidencias tienen los límites descritos arriba.
- No sustituir pruebas de compra/acceso reales por tests simulados ni por compilación.
- No es necesario volver a ejecutar todo para entregar este traspaso: no se cambió código de la app al generarlo.

### Portadas
- Cuadrada1200×1200 creada y subida por Giselle.
- Horizontal1920×1080PNG fue rechazada por peso, no por dimensiones.
- Se preparó JPG ligero de~308KB y se subió a la clase.
- Archivo: docs/marca/hotmart/paso-a-paso-portada-1920x1080-ligera.jpg.

## 10. Panel de cuatro expertos: estado exacto al interrumpirse

Petición de Giselle: cuatro expertos independientes, evidencia visual obligatoria, crítica dura de copy, arte, conversión/retención y negocio. Solo diagnóstico. Esperar aprobación antes de tocar una línea de producto.

Fase1 completada:
- Se levantó Next dev local, se recorrió con Playwright/Edge aislado a375×812.
- Capturas nuevas: landing completa,9estados de onboarding,3pantallas de paywall, entrada y herramientas core.
- Incluye nueva familia desde onboarding y demo de Mateo con historial.
- Simulación de /api/acceso únicamente en navegador para inspeccionar herramientas; sin compras, correos ni llamadas externas del navegador.
- Variante del precio configurada con enlace público mensual SOLO en la variable temporal del proceso local. No se guardó en Vercel ni en archivos de producto ni se abrió una compra.
- Los servidores locales de esa auditoría se detuvieron.
- Archivo evidencia.json: sin errores de página ni desborde en el recorrido principal.

IMPORTANTE SOBRE LA LANDING:
La primera captura rápida dejó algunas animaciones invisibles. NO usar landing-completa-375.png ni landing-detalle-* como evidencia de defecto visual. Se repitió con desplazamiento lento350px y esperas420ms, verificando visibilidad.
Evidencia válida: landing-completa-lenta-375.png y landing-lenta-detalle-01..06-375.png.

Rutas, todas bajo docs/revisiones/panel-2026-10-27/:
- LEEME.md: alcance, condiciones y corrección de capturas.
- evidencia.json, variante-checkout.json, landing-scroll-verificacion.json.
- landing-completa-lenta-375.png.
- onboarding-01-nombre-375.png;02-edad;03-momento;04-crisis;05-reconocimiento;06-compromiso;07-armando;08-rutina;09-primera-victoria (mismo prefijo onboarding- y sufijo -375.png).
- paywall-configurado-01-375.png,02,03: precio con enlace configurado; las otras paywall-01/02/03 son el estado sin enlace.
- entrada-375.png.
- core-01-inicio-375.png,core-02-agenda-375.png,core-03-informe-375.png,core-04-diario-375.png: familia nueva.
- core-demo-inicio-375.png,core-demo-agenda-375.png,core-demo-informe-375.png,core-demo-diario-375.png,core-demo-anotar-375.png,core-demo-calma-375.png,core-demo-rutina-nino-375.png.
- Cada captura principal tiene un .txt con texto para citas; el .txt NO sustituye verla.
- La barra fija aparece dentro de capturas largas a la altura de su viewport original. No inferir un fallo de posición solo por el lienzo extendido.

Los cuatro subagentes fueron creados con contexto limpio y leyeron criterios/código por separado. Recibieron las capturas y la corrección de evidencia. Los cuatro se interrumpieron por límite de uso ANTES de entregar informes finales; no hay puntajes ni reporte consolidado válidos guardados. NO afirmar que el panel aprobó o reprobó la app ni inventar sus opiniones.

Retomar panel con4expertos nuevos o encarnarlos POR SEPARADO si no hay subagentes. Leer docs/sistema/PROMPT-CRITICA-DE-EXPERTOS.txt. Entregar:
1. Veredicto separado por experto con /10, copy/20 y craft/20 donde corresponde; ubicación exacta y arreglos, máximo1elogio por experto.
2. Tabla de áreas×expertos.
3.10problemas priorizados por ventas: dónde, daño, arreglo y esfuerzoS/M/L.
4. Quick wins<1h como hipótesis, sin prometer incrementos medidos.
5. «¿Comprarías con tu tarjeta y por qué?» por experto.
6. Rutas de evidencia.
DETENERSE y esperar qué arreglos aprueba Giselle.

Criterios obligatorios:
- Copy:52-COPY-VISUALES-CONVERSION y FICHA-AVATAR.
- Arte:16-DIRECCION-DE-ARTE y RUBRICAS-DE-PANTALLA; referencia en FICHA-ARTE.
- Conversión/retención:02B-ONBOARDING-Y-PAYWALL y24-GAMIFICACION.
- Negocio:40-UNIT-ECONOMICS y02C-PRICING-Y-MODELO-DE-NEGOCIO.
No convertir benchmarks de otros nichos en tasas reales de esta app.

## 11. Qué sigue pendiente para poder decir «lista para vender»

Orden propuesto, sujeto al diagnóstico y a la aprobación de mejoras:
1. Revisar los cambios locales y preparar una publicación trazable del código nuevo; no solo redistribuir5a9f1b8. Revisar branch/main, variables y secretos ignorados antes de commit/push.
2. Verificar catálogo de producto y orden/idempotencia de eventos reales, preservando la reparación ya aplicada y conciliando migraciones manuales.
3. Configurar firma de Resend, eventos de entrega/rebotes y comprobar valores de entorno sin revelarlos.
4. Verificar correspondencia Vault/CRON_SECRET, publicar ruta nueva y probar peticiónHTTP controlada. Un cron que registra una llamada no demuestra que envió correo.
5. Prueba controlada de compra/trial→avisoHotmart→acceso→correo→bandeja→enlace/código→app. Cualquier tarjeta/compra necesita participación explícita de la dueña. No comprar por ella ni enviar correos a clientes como prueba.
6. Verificar fechas reales de prueba y primer cobro antes de activar Día5. Quitar/ajustar promesas que no se puedan cumplir solo después de aprobación de ese arreglo.
7. Comprobar cancelación, devolución, acceso revocado y recuperación sin borrar los datos del dispositivo.
8. Activar envío/programación por aprobación concreta, con mecanismos de pausa. Las autorizaciones para INSTALAR APAGADO no autorizan activar campañas.
9. Marketing: dominio separado, consentimiento, privacidad/retención, baja real, supresiones y auditoría de duplicados de Hotmart antes de carrito/nutrición/winback.
10. Cerrar integridad, seguridad y rigor según61/48. Revisar plan/condiciones comerciales de servicios y costos reales; no afirmar rentabilidad sin CAC/churn/ventas.

Pendientes funcionales previos a este panel:
- Eliminación real de cuenta y tratamiento de contactos/cola.
- Copia/exportación/importación del diario ante cambio/pérdida del teléfono.
- Coherencia de «Las comidas» con la rutina entregada (actualmente mapeada a noche).
- Revisión final pendiente en partes de administración y pantallas core; ver ESTADO histórico, sin asumir que los puntajes antiguos siguen describiendo cambios posteriores.
- Nombre legal/tipo de responsable y condiciones de reembolso vigentes por verificar.

## 12. Documentos para continuar sin perder trabajo

En el repositorio real:
- ESTADO.md, FICHA-AVATAR.md, FICHA-ARTE.md, FICHA-MERCADO.md, FICHA-MODELO.md.
- docs/correos/OPERACION.md, REPORTE-CIERRE.md, VERIFICACION-EXTERNA.md, MANUAL-DUENA.md, variables.ejemplo.txt, activar-programacion.sql.
- docs/revisiones/entrada-veredicto.md, guia-veredicto.md, precio-veredicto.md y sus capturas.
- docs/revisiones/panel-2026-10-27/LEEME.md y evidencia actual.
- docs/copy/landing.md, embudo.md, retencion.md.
- supabase/migrations: contrastar los scripts mencionados con el estado REAL y el historial antes de ejecutar.

Comandos habituales, únicamente cuando correspondan al trabajo aprobado:
- Desde web: npm test; npm run typecheck; npm run build; npm run lint.
- Para dev, npm run dev ejecuta predev y copia app a public/app. No editar la copia generada como fuente.
- scripts de revisión existentes en web/scripts; scripts de capturas del panel en tmp/panel-*.mjs.
- Si Windows bloquea .next o el navegador de prueba, solicitar el permiso específico de ejecución. No confundir ese bloqueo local con un bug del producto.

## 13. Mensaje sugerido para iniciar con Claude

«Lee este traspaso, AGENTS.md/CLAUDE.md y ESTADO.md del repositorio paso-a-paso-traspaso. No muestres ni adjuntes secretos. Primero retoma el panel de4expertos SOLO DIAGNÓSTICO: ya hay capturas375px válidas en docs/revisiones/panel-2026-10-27; usa la landing lenta, las pantallas de precio configurado y las herramientas nuevas/demo, indicando sus límites. Los expertos anteriores se interrumpieron sin veredictos: no inventes puntajes. Presenta el diagnóstico consolidado y espera mi aprobación antes de implementar. Mantén apagados los envíos/campañas. Después de que yo elija mejoras, continúa los pendientes de publicación y prueba real de pago→correo→acceso, conservando las instalaciones y reparaciones ya realizadas.»
