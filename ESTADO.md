# ESTADO — Paso a Paso
Última actualización: 2026-10-29 | Rama traspaso = Paso A (703dfe4) + trabajo local de Codex 27-28 oct unido | Sin publicar · compra→correo→acceso real pendiente

⏸️ CHECKPOINT (2026-10-29) — Paso A y el trabajo local de Codex (carpeta de la dueña, sin commit allí) unidos en traspaso; 101 pruebas ✓, typecheck ✓, build ✓. Sigue el Paso B: base de datos, URLs del dominio pasoapaso.hadaapps.com, compra de prueba, publicar con el visto bueno de la dueña. Traspaso de Codex: docs/traspaso/PASO-A-PASO-TRASPASO-A-CLAUDE-2026-10-28.md.
⏸️ CHECKPOINT — Correos locales preparados; cola/programación instaladas APAGADAS; reparación Hotmart aplicada y8fixtures200, sin compra→correo→acceso real verificado. SMTP OTP6 probado por Giselle. Vault paso_a_paso_correos_cron guardado según captura27-10; sustituciones de secretos confirmadas por dueña, sin comparación de valores. Código nuevo no publicado. Panel de4expertos SOLO diagnóstico completado27-10: REPORTE-PANEL.md y4informes en docs/revisiones/panel-2026-10-27. Copy12/20; arte landing15/20. Notas de especialidad:copy6,diseño6,conversión5,retención4,negocio4 sobre10. Aprobación posterior: acceso poscompra, guardado duradero y promesas honestas; correcciones y pruebas locales cerradas en docs/revisiones/correcciones-2026-10-27/CIERRE.md; entrega real/publicación pendientes y campañas apagadas. Traspaso actualizado: docs/traspaso/PASO-A-PASO-TRASPASO-A-CLAUDE-2026-10-28.md. Auditoría pre-lanzamiento autorizada con correcciones locales: INCOMPLETA, tres auditores interrumpidos por límite de uso; npm audit falló por DNS, no prueba limpia. Sin certificado nuevo, publicación ni compra real. Evidencia válida: docs/revisiones/panel-2026-10-27/landing-completa-lenta-375.png y LEEME.md. Las secciones históricas no sustituyen estas actualizaciones.

## Panel independiente — 27-10 y correcciones aprobadas después
- Aprobado: «evalúa todo» y retomar panel. Ejecutado:4expertos independientes, captura375 de landing lenta/onboarding/precio/core,3recapturas estables y reporte docs/revisiones/panel-2026-10-27/REPORTE-PANEL.md. Sin cambiar código, precio, cuentas, envíos o despliegues.
- Expertos Copy/Arte/Conversión/Negocio:copy6/6/6/5,diseño6/6/7/7,conversión5/5/5/5,retención5/5/4/5,negocio4/5/4/4 (/10). Son juicios, no métricas de clientes. Copy12/20; arte por pantalla, no promedio de certificación.
- Aprobación posterior «apruevo»: acceso poscompra, guardado y promesas. Ejecutado local: confirmación transaccional/lectura incierta protegida, PIN+diario atómicos, reintento/foco/errores por contexto, copy preciso ySWv19;100tests+15Edge pasan, build/TypeScript/lint sin errores (1aviso heredado),14capturas375sin desborde/errores. Cierre:docs/revisiones/correcciones-2026-10-27/CIERRE.md. Revisor:ventas31–35/40y13–17/20,Inicio29/40y12/20;gate NO acreditado. Sin publicar/cobrar/activar;pendientes entrega real y autorización de otros arreglos (respaldo,rediseño/retención,economía,atajo calma).
## Correos: ejecución del plan aprobado 26-10 (en curso)
- Giselle aprobó el inventario y plan completo con «ok». Implementar y probar; campañas a clientas siguen apagadas. Prueba real autorizada únicamente a hadaapps@gmail.com.
- Resend inspeccionado en panel real: cuenta hadaapps, SOLO acceso.hadaapps.com, Verified, Forge São Paulo. DKIM TXT y CNAME rsend/send verificados; envío ON, recepción OFF. DNS público: SPF y DKIM publicados; DMARC raíz p=none sin rua. Giselle confirmó nueva prueba en Recibidos; alineación de cabeceras pendiente.
- Supabase real uvubnzymrkqirdvneeds: se guardó y reabrió Email provider; OTP expiration 3600→600 segundos, longitud 6 conservada. Evidencia docs/revisiones/correos-supabase-otp-600.png. No se alteraron plantillas SMTP que la dueña ya probó.
- Remitente local adaptado a acceso@acceso.hadaapps.com, validación exacta. URL por defecto del correo usa la app Vercel actual. Marketing requiere verificación separada EMAIL_MARKETING_DOMINIO_VERIFICADO; defaults OFF.
- Preparado local: carrito v2 apagado, cola prioriza accesos, /guia-gratis+captación opcional y PDF rellenable. Verificación26-10:71tests pasan, build/TypeScript y lint pasan; navegador360/375/1440 sin overflow ni errores,7estados de formulario simulados. Revisor guía ronda2:37/40,17/20,18/20. Cola y programación instaladas APAGADAS tras nuevo «autorizo»; nueva versión NO publicada. Evidencia correos-instalados-apagados.png:enabled=false,cron0,cola0,RLStrue,anonlecturafalse,ticknull.
- Resend en Vercel: captura de la dueña confirma RESEND_API_KEY_TX Secreto creada SOLO en Producción el 26-10, conservando Preview/traspaso. No redistribuida tras esta alta; correo postcompra aún no publicado. Captura posterior confirma alta de SUPABASE_SERVICE_ROLE_KEY secreta SOLO Producción (nombre truncado, valor no leído). Dueña confirmó EMAIL_ENVIO_ACTIVO=false en Producción.
- Programación instalada APAGADA tras autorización: migración20261026220000 pg_cron/pg_net y despachador apagado, sin agenda; verificación real exitosa. activar-programacion.sql separado requiere aprobación y Vault/CRON_SECRET coincidentes. Prueba PGlite con dobles net/Vault pasó (72tests por bloques); extensiones reales instaladas; petición HTTP aún sin probar. Claves cifrado/baja/cron generadas en web/.env.correos-servidor.local (ignorado por Git); las3claves iniciales quedaron expuestas en captura de la dueña; reemplazos generados sin mostrar en .env.correos-servidor.local y .env.valor-{cifrado,baja,cron}.local. Actualización27-10: dueña confirmó sustituciones EMAIL_PAYLOAD_KEY/EMAIL_UNSUBSCRIBE_SECRET/CRON_SECRET en Producción; Vault paso_a_paso_correos_cron guardado según captura. Valores no revelados ni comparados; falta probar tras publicar. No reutilizar los expuestos.
- Archivo privado web/.env.correos-prueba.local ignorado por Git; dueña confirmó guardado. Prueba aislada ejecutada el 26-10: Resend aceptó UN mensaje a hadaapps@gmail.com, sin utilizar la cola ni activar campañas. Recibo sin secretos: docs/correos/prueba-servicio-resultado.json. Giselle confirmó llegada a Recibidos. Cabeceras de autenticación pendientes; no repetir el envío.

- Hotmart 26-10: capturas de Giselle confirman contenido de acceso publicado y producto con Ventas activas. Checkout público https://pay.hotmart.com/W108168393K abierto en Chile: $5.212/mes y prueba de 7 días seleccionada; al desmarcar desaparece la explicación, al restaurar vuelve. No se completaron datos ni compra. Webhook real, entrega postcompra y todos los métodos de pago siguen pendientes.

- Hotmart 26-10: dueña guardó HOTMART_HOTTOK sensible en Vercel Production y redistribuyó 5a9f1b8 (4bhmLXaVU, Ready). Webhook producto8796204 v2 con8eventos guardado y prueba enviada:4HTTP200/4HTTP500. Supabase logs confirman profiles_email_key(23505) y deadlock entre ingest_hotmart simultáneos; prueba genérica lleva product.id=0.
- Reparación preparada: supabase/migrations/20261026210000_hotmart_concurrencia.sql (lock transaccional antes de eventos + upsert email, preserva función instalada);2tests PGlite pasaron. APLICADA tras autorización explícita «autorizo»: Supabase devolvió reparacion_instalada=true. Evidencia docs/revisiones/hotmart-reparacion-aplicada.png. Cuatro reintentos simulados ejecutados: historial final 8/8 HTTP200 Procesado, evidencia docs/revisiones/hotmart-prueba-8-procesados.png. No declarar venta/acceso/correos certificados con HTTP200 genérico.

## Qué es esta app (3 líneas máximo)
PWA para madres/padres de niños autistas de 2 a 12 años (ejemplo: Mateo, 6). Dos zonas: "Espacio de Mateo" (niño, bloqueado con PIN) y zona de la familia (agenda visual, tablero de comunicación, temporizador, kit de calma con música, historias sociales, diario de crisis cifrado, logros, informe para profesionales, guía).
Monetización: suscripción por Hotmart con 7 días gratis (ver Estrategia de monetización).

## Promesa central (borrador, del doc de propuesta de valor)
"Ayudo a madres de niños autistas de 2 a 12 años a tener días predecibles y a saber exactamente qué hacer cuando llega una crisis, sin plastificar pictogramas, sin saltar entre cinco apps y sin que sus datos salgan del teléfono."
Doc: https://claude.ai/code/artifact/634d2a58-d9bd-4cdf-8442-351f09361e90

## Reporte de validación
- Veredicto: Viable con ajustes (hueco claro en español; riesgo: costumbre de apps gratis)
- Apps de referencia: Choiceworks (4.7, 304 reseñas), Tiimo, Avaz, Otsimo, Goally, Proloquo2Go
- Lo que odian: precio alto/suscripción cara, fallos, configuración larga
- Brecha en español: sí, ninguna app de pago con rutinas + diario de crisis + informe
- Precio de referencia: $8-21/mes en inglés; $7-10 pago único en Hotmart español. Detalle en FICHA-MERCADO.md

## Estrategia de monetización (decisión de la dueña 2026-10-25)
- Modelo: Onboarding + paywall de prueba (Modelo 2 del 02C, tipo B bienestar). Vista previa sin cuenta → paywall → cuenta.
- Trial: 7 días gratis (el valor se siente en la primera rutina; patrón Headspace 7 días mensual)
- Precio aprobado: SOLO US$4,99/mes; anual aplazado. Hotmart borrador 8796204 con prueba 7 días y reembolso 7 días (inicio del plazo aún por comprobar). Frontend conserva precios anteriores: pendiente corregir, no publicar ventas todavía.
- Suelo 3 (publicidad) pendiente: este precio es de canal orgánico/afiliados; revisar antes de pagar anuncios.

## Avatar y venta
- FICHA-AVATAR.md: aprobada 2026-10-20 · FICHA-MODELO.md y FICHA-ARTE.md creadas
- Big Idea: anticipar antes + calmar durante + contar después, en un solo lugar (FICHA-MODELO.md)
- Mecanismo: "el Método Antes, Durante y Después" (elegido por la usuaria 2026-10-20)
- Landing: Next.js en web/ (kit canónico tematizado); la PWA existente en app/ se servirá en /app sin cambios

## Secuencia maestra de construcción (NO saltar)
- Estado real: se construyó primero la APP INTERNA (antes de instalar el SO). Falta: landing, onboarding, paywall, login/auth, servicios externos, backoffice.
- Landing: LISTA (revisor ronda 3: 38/40 · craft 17/20 · copy 19/20, 2026-10-20). Vista previa: https://claude.ai/artifact/CAzcMzcHhx2RqdVfoJefce · Onboarding: pendiente · Paywall: pendiente · Login/Auth: pendiente
- App interna: construida (prototipo, sin auditar contra el SO)
- Servicios externos: bloqueados

## Retomar tras la pausa del 25-10 (capturas de la dueña; no guardar secretos)
- Resend: cuenta hadaapps, clave de solo envío creada; alcance del dominio por confirmar. No pedir la clave por chat. Correo Auth recibido en Gmail Recibidos según captura; acceso con OTP de 6 dígitos confirmado por Giselle. No prueba Hotmart/cola ni garantía para todos los destinatarios.
- Vercel: cuenta/equipo giselle10, proyecto paso-a-paso. RESEND_API_KEY_TX guardada como secreto SOLO en vista previa de rama traspaso (captura de confirmación). Contenido y validez no comprobados.
- Vercel EMAIL_ENVIO_ACTIVO: nombre original comprobado en editar, false escrito y guardado confirmado por Giselle; SOLO traspaso. Guardado como secreto, aceptable. No se redistribuyó.
- Aviso posterior: «Despedir» cierra; NO «Redistribuir». No desplegar, activar envíos, publicar, cobrar ni aplicar migraciones sin completar preparación y pruebas.
- Siguiente trabajo agente: adaptar remitente local de tx.hadaapps.com a acceso.hadaapps.com, revisar configuración SMTP/Supabase y secretos faltantes, preparar prueba aislada; marketing sigue apagado. No marcar dominio/news ni entrega como verificados por inferencia.
- Giselle necesita instrucciones en español, UNA acción por paso y guiadas por capturas; no volver a pedirle crear cuentas existentes. Porkbun sesión hadaapps y dominio hadaapps.com confirmados; correo de inicio de sesión no confirmado.
- Supabase real uvubnzymrkqirdvneeds: SMTP activo guardado (smtp.resend.com,465,resend; remitente acceso@acceso.hadaapps.com, nombre Paso a Paso). Clave nunca recibida por chat. Estos ajustes Auth aplican al proyecto real, independientemente del interruptor de cola en Vercel.
- Auth URLs: Giselle confirmó Site URL https://paso-a-paso-sigma.vercel.app y Redirect URL https://paso-a-paso-sigma.vercel.app/auth/callback; antes localhost:3000 y sin redirects. Magic link inicial falló; no atribuir causa exacta sin logs.
- Plantilla Magic link or OTP: Giselle sustituyó asunto por «Tu código para entrar a Paso a Paso» y cuerpo HTML corto con {{ .Token }}, sin enlace, y guardó. Email OTP length cambió 8→6 (captura + confirmación); expiración observada 3600s, no modificada. Confirm signup también sustituida por HTML con {{ .Token }}; guardado y registro con correo nunca usado confirmados por Giselle. No alterar estas plantillas por defecto.
- Última prueba: nuevo código de seis dígitos llegó y permitió entrar; URL ambiental /app/index.html. No hubo compra. Antes de lanzar verificar que entrar no permita contenido de pago sin suscripción; no inferir control de pago a partir de login correcto.
- Portada Hotmart creada: docs/marca/hotmart/paso-a-paso-portada-hotmart.png, ilustración cálida madre/peque con rutinas, nombre y subtítulo «Rutinas, comunicación y calma», logo escalera. PNG cuadrado; subir por Información básica → Cambiar imagen; NO subida ni guardado en Hotmart aún. Captura confirma producto8796204 todavía borrador; recomendación600x600, máximo5MB.
- Portada Hotmart v2 solicitada con especificación propia: docs/marca/hotmart/paso-a-paso-portada-1200-v2.png, PNG1200x1200. Foto generada madre/hijo, smartphone con pictogramas ilustrativos (no captura real), título y subtítulo «Rutinas, calma y apoyo para tu familia». V1 conservada. Subida mostrada en captura de Información básica y guardado confirmado por Giselle («quedó guardada»).
## Decisiones técnicas
- Correos (25-10, plan aprobado): Plan inicial: `tx.hadaapps.com` (servicio) y `news.hadaapps.com` (marketing); descubrimiento posterior: aprovechar `acceso.hadaapps.com` ya verificado para servicio (adaptación local pendiente), Reply-To `hadaapps@gmail.com`. Preparar localmente; NO enviar campañas, cobrar, publicar ni aplicar migraciones en esta etapa. Cuenta Resend hadaapps confirmada por capturas; dominio acceso.hadaapps.com verificado, DKIM y CNAME de envío verdes. DMARC raíz v=DMARC1; p=none; observado en Porkbun; entrega Auth a Gmail comprobada; alineación de cabeceras y otros proveedores pendientes.
- Arquitectura email: cola durable privada en Postgres, disparadores transaccionales desde cambios de suscripción, trabajador autenticado por secreto, deduplicación e idempotencia Resend; consentimiento y supresión comprobados antes de marketing. Datos del niño no salen del teléfono ni entran en correos. Tokens de acceso generados justo al enviar; nunca en logs. Recuperación sigue con Supabase OTP/SMTP. Separar evidencia automatizada de entrega real (esta última bloqueada hasta configurar proveedor).
- Plantillas: web/lib/correos/plantillas.ts (28), docs/correos/supabase-acceso.html (SMTP). Cola preparada: migración 20261025130000_correos.sql, NO aplicada; trabajador /api/correos/procesar sin cron activo. Todos los interruptores de envío en false por defecto.
- Evidencia email local: 57 pruebas; typecheck/build OK; lint 0 errores, 1 aviso heredado. Capturas docs/revisiones/correos-*-375.png; revisor ronda 2 36/40 y 16/20 en correos-veredicto.md. 9 pruebas HTTP, sin envíos. Actualización posterior: inbox Auth en Gmail y acceso OTP probados por la dueña; acceso postcompra/cola aún NO probado.
- Operación mensual email: atrasos/errores de cola y entregas de acceso, rescate de login, conversión de carrito y recuperación de pagos según Hotmart; rebotes/quejas/bajas por subdominio. Aperturas son señal imperfecta, no prueba de lectura. No se instaló seguimiento en accesos.
- Decisiones actuales: app prevista pasoapaso.hadaapps.com, raíz reservada a HadaApps; contacto legal/atención hadaapps@gmail.com; mantener bloqueo, permitir solo pruebas autorizadas. No conectar ventas hasta corregir precios y probar el aviso D5 con datos reales.
- Framework de venta: Next.js 16 en web/ (landing, onboarding, paywall, login, rutas para webhook de Hotmart). La app interna sigue en app/ como PWA sin build y se copia a web/public/app al compilar. Decidido 2026-10-20.
- Stack actual: HTML + JS sin framework, sin paso de build, PWA con service worker (sw.js v7), datos en IndexedDB del teléfono (local-first).
- PIN: huella PBKDF2 150k; diario cifrado AES-GCM con sal propia.
- Fotos: Unsplash (créditos en Ajustes). ARASAAC NO se usa (licencia no comercial); fuente de pictos intercambiable.
- Música de calma generada en la app (Web Audio), sin archivos ni apps externas.
- Cuenta: solo para saber quién pagó; los datos de Mateo siguen en el teléfono (la promesa de privacidad se mantiene).
- Vista previa: herramientas/vista_previa.py → artifact https://claude.ai/artifact/GQnQhrHp7UH3HLRSDaztDE

## 🔒 Gate de seguridad (antes de declarar lista para vender)
- [ ] Ninguna clave secreta viaja al navegador
- [ ] Un usuario no puede ver datos de otro (prueba cruzada con 2 cuentas)
- [ ] Login con límite de intentos fallidos
- [ ] Aviso de pago verificado como venido de la pasarela
- [ ] Política de privacidad: qué datos se recogen y a quién se envían

## Pendientes de la página de ventas
- ✓ Datos de la responsable: HadaApps · Chile · hadaapps@gmail.com (web/lib/marca.ts, 2026-10-20).
- Oferta vigente: Hotmart configurado por la dueña con US$4,99/mes, prueba 7 días y reembolso 7 días. No configurar 30. La producción antigua aún debe actualizarse.
- /onboarding redirige por ahora a la app de ejemplo (/app). Se reemplaza en la etapa de Onboarding.
- Sin testimonios (regla día 1): se agregan con ≥3 reales.
- Pulido menor del revisor (N1–N8, no bloquea): carrusel a 1440, puntos del footer, captura del hero 6+1, ceros con barra en precios chicos, pasos del método a 1 línea, 1ª línea del stack, barra fija sobre el CTA del carrusel. Ver docs/revisiones/landing-veredicto.md.
- audit-conversion: falsos positivos documentados (lee comentarios y clases como copy, "animate" como voseo, no ve hairline/mesh en estilos en línea del kit). Real corregido: PS de 35 → 29 palabras.

## Pendientes heredados
- Más secciones de la Guía para Familias; modo "frase" del tablero (ofrecido, sin respuesta).

## 🚀 EN VIVO (2026-10-24)
- Producción: https://paso-a-paso-sigma.vercel.app (Vercel Hobby, proyecto prj_KQIVMVm2JIyQTgdYGDx01ZbsMWWp, raíz web/, Next.js). Repo privado: github.com/gimunzenmayer-oss/paso-a-paso (main 22d1a24). Cada push a main publica solo.
- Comprobado: /, /admin/entrar y /paywall→/onboarding responden 200 con contenido correcto. Consola del navegador NO revisada (este entorno no llega a *.vercel.app y el plan Hobby no da registros de errores por API).
- Variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SITE_URL=https://paso-a-paso-sigma.vercel.app, INGEST_KEY (sensible, rotada el 22-10; hash en private.app_secrets). Faltan: HOTMART_HOTTOK, NEXT_PUBLIC_HOTMART_CHECKOUT_MENSUAL/_ANUAL. NO poner CODIGO_SIMULADO ni ACCESO_SIMULADO.
- Supabase: 14 migraciones (se aplicó acceso_clientas el 22-10).
- Pendientes de la dueña: ⚠ Supabase → Authentication → URL Configuration: Site URL = la de producción y Redirect URLs = /auth/callback y /admin/auth/callback · hottok y links de checkout de Hotmart · webhook en Hotmart → https://paso-a-paso-sigma.vercel.app/api/webhooks/hotmart · ⚠ Vercel Pro US$20/mes antes de vender · Resend para correos.
- Cambios sin guardar de otro hilo (entrada de pago) siguen en el árbol de trabajo: se publicarán cuando ese hilo haga commit y alguien haga push a main.

## Panel de administración (2026-10-21)
- Qué es: panel real (sin demos) conectado a Supabase de producción (uvubnzymrkqirdvneeds). Rutas: /admin (Resumen), /admin/clientes, /admin/costos, /admin/entrar, /admin/verificar. Código en web/app/admin, web/components/admin, web/lib/admin; base en supabase/migrations (13 archivos, todos aplicados en producción).
- Seguridad: acceso solo para admin verificado EN EL SERVIDOR + segundo factor (código de Google Authenticator, aal2) + la base lo exige en cada consulta (private.assert_admin). Probado por HTTP: anónima → entrar; clienta normal → rechazada; admin sin código → verificar; admin con código → 200. La base niega admin_panel y admin_lista_clientes a una clienta normal.
- Pruebas hechas: tsc limpio · eslint limpio · next build OK (13 rutas) · pruebas automáticas de formularios (anotar, validar, borrar, deshacer, quitar/dar acceso, deshacer acceso) sin errores · recarga en la primera vez muestra la misma clave.
- Revisor visual (umbral ≥36/40 usabilidad y ≥16/20 craft). Ronda 5: Entrar LISTA 36/16 · Clientes 35/16 · Costos 35/16 · Verificar 34/16 · Resumen 32/15. Después se aplicaron los arreglos de la ronda 5 y se lanzó la ronda 6, que se CORTÓ por límite de uso (no hay veredicto de la ronda 6). Veredictos y capturas: docs/revisiones/admin-*. Pendiente: repetir la ronda 6 en Resumen, Clientes, Costos y Verificar; iterar hasta pasar.
- Decisiones: CAC solo sobre canales con gasto (los gratis no abaratan el costo); cambios manuales de acceso siempre reversibles y con motivo; borrar costo/gasto se puede deshacer; un solo monto por mes y canal (reemplaza); la letra del panel es 13/18/24/28/36 (registrada en FICHA-ARTE.md, sin 15px); funciones de ingesta protegidas por llave que solo vive en el servidor; el aviso de Hotmart falla cerrado si no está verificado; admin_clientes antiguo queda sin uso.
- Sin fecha de fin al "Dar acceso a mano": queda para la etapa de Login (hoy nada aplica vencimientos); el aviso "Ojo" previene.
- Mejoras futuras (no se hicieron, cero features nuevas): contador de intentos restantes del código; marcar la fila recién anotada; "pagadores fantasma" (pagan y no usan la app, necesita login de clientas); conciliación con Hotmart; Sentry; editar gasto en anuncios sin reemplazar.
- Pendientes de la dueña: (1) instalar la app de Claude en GitHub (gimunzenmayer-oss/paso-a-paso) para poder publicar; (2) después del primer despliegue, en Supabase poner la URL del sitio y la redirección /admin/auth/callback; (3) la clave hottok de Hotmart; (4) variables en Vercel: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, INGEST_KEY, HOTMART_HOTTOK y, opcional, NEXT_PUBLIC_SITE_URL; (5) ⚠ Vercel Pro cuesta US$20/mes y hace falta antes de vender; (6) ⚠ el envío de correos de Supabase está limitado a ~2 por hora hasta conectar un correo propio (Resend).
- 🔒 Gate: panel sin claves secretas en el navegador ✓ · prueba cruzada de permisos ✓ (anónima/normal/admin) · límite de intentos del código (5 en 15 min) ✓ · aviso de Hotmart verificado ✓ (falla cerrado) · política de privacidad ✓. Quedan por revisar antes de vender: prueba cruzada con 2 clientas reales (cuando exista login de clientas) y la ronda 6 del revisor.

## Auditoría senior — arreglos por capa (aprobados por la usuaria 2026-10-21)
### Capa 1: seguridad, modo sin internet y /app (2026-10-21) ✅
- Hecho: el modo sin internet ya funciona (sw.js v9: se quitó './' que rompía la instalación; las páginas se piden a la red y, sin conexión, se usa la copia guardada) · fuentes guardadas dentro de la app (app/fonts, licencia SIL OFL), ya no se piden a Google · /app, /app/ y /onboarding llevan a /app/index.html · PIN: tras 5 errores seguidos hay que esperar (30 s, luego el doble, máximo 15 min) · encabezados de seguridad (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy con micrófono solo para la app) · páginas de error y 404 en español · interruptor "Compartir estadísticas de uso" en Ajustes y política de privacidad corregida (estadísticas seudónimas) · script `npm run typecheck`.
- Verificado: typecheck ✓ · lint ✓ (1 aviso en global-error.tsx) · build ✓ · servidor ✓ · SW activo con 78 archivos guardados y recarga sin internet = 200 · 0 peticiones a dominios externos · PIN bloquea al 5.º error, rechaza el PIN correcto durante la espera y lo acepta después · con estadísticas apagadas se envían 0 eventos (encendidas: 2) · capturas 375px en auditoria-paso-a-paso/capturas/L1-*.png.
- No verificado aquí: /admin con la CSP nueva (sin claves de Supabase en esta prueba da 500, igual que antes). Revisar /admin/entrar en la primera vista previa de Vercel.
### Capa 2: errores y estados (2026-10-21) ✅
- Hecho: la app pide al teléfono que no borre sus datos (navigator.storage.persist) · tarjeta en Inicio "Guarda la app en tu pantalla de inicio" con instalar en 1 toque (Android) o pasos (iPhone) y "Ahora no" · diario: Guardar siempre activo y, si falta el tipo, avisa "Elige qué pasó" y lleva el foco a las opciones · Guardar va primero · causas y "qué ayudó" muestran 6 opciones y "Ver N más" · Cancelar con cambios pregunta "¿Salir sin guardar?" · si falla guardar o borrar, avisa y no pierde la nota (deshace en memoria y se queda en el formulario) · teclado del PIN apagado durante la espera · estilo .btn:disabled · sw.js v10 para que los teléfonos reciban la versión nueva.
- Verificado: typecheck ✓ · build ✓ · servidor ✓ · prueba automática en teléfono simulado sin errores de página (aviso sin tipo, foco, Ver más 6→11, confirmar al cancelar y volver con la nota intacta, fallo simulado de guardado que no pierde nada, guardado real 10→11 notas, cancelar sin cambios sale directo, persist() llamado 1 vez) · capturas en auditoria-paso-a-paso/capturas/L2-*.png.
- Función nueva para decidir (no se hizo): copia de seguridad exportable/importable del diario cifrado, para no perder datos al cambiar de teléfono.
- La intensidad sigue marcada en 3 por defecto: cambiarla afecta la media del informe; queda para decidir.
### Capa 3: diseño (2026-10-21) ✅
- Hecho: textos en español latino neutro en 12 archivos (celular, escuela, audífonos, enojo, jugo, toca/presiona, "¿Qué pasó?", ustedes en vez de vosotros, sin leísmo; emergencias 112 → 911 con "o el número de tu país"; "nana" → "canción de cuna") con migración de etiquetas guardadas (diario: Cascos→Audífonos; tablero: Estoy enojado, Terminé, Jugo, Quiero mis audífonos) · los números usan las cifras de Lexend (sin 0 tachado) · Inicio: "¿Momento difícil?" arriba, bajo el saludo; tarjeta del espacio más corta; tarjetas "Para ti" con el mismo radio, borde y sombra; barra de progreso con borde · Diario: pregunta principal más visible, opciones de tipo de la misma altura · Informe: el interruptor dice Activado/Desactivado según el estado, números alineados a la derecha, desencadenantes y "lo que ayudó" como barras, barras por día en el periodo de 7 días, botón "Borrarlas" para los ejemplos ahí mismo · Modo niño: foto en los 6 botones, color propio para "Mis estrellas" (sol), sombra y botones que llenan el alto · sw.js v11.
- Verificado: typecheck ✓ · build ✓ · servidor ✓ · node --check en todos los JS · sin errores de página · interruptor del informe cambia el texto · "Borrarlas" desde el informe deja 0 ejemplos · capturas auditoria-paso-a-paso/capturas/L3-*.png. Puntaje del revisor: en la capa 6.
- Para decidir: los eventos "diario_nota_guardada" y "calma_usada" siguen (la privacidad los declara y se pueden apagar); agruparlos requiere cambiar la base de producción.
- Textos guardados con nombres viejos en rutinas/historias de familias existentes no se renombran (solo hay datos de ejemplo; "Volver a los datos de ejemplo" los actualiza).
### Capa 4: animaciones (2026-10-21) ✅
- Hecho: todos los botones y tarjetas tocables se encogen un poco al tocarlos (0,12 s) · cada pantalla nueva entra escalonada (60 ms entre bloques) y los 6 botones del modo niño también · opciones del diario hacen un pequeño "pop" al marcarse · al cambiar algo dentro de la misma pantalla (elegir tipo, Ver más) ya no salta arriba ni se repite la animación · todo se apaga con "Modo calma" y con "reducir movimiento" del teléfono · sw.js v12.
- Verificado: typecheck ✓ · build ✓ · servidor ✓ · sin errores de página · con movimiento: animación "entrar" con 0/60/120 ms · con reducir movimiento: none · repintar conserva el scroll (400 → 400) y navegar vuelve arriba (0) · captura L4-entrada-80ms.png.
### Capa 5: retención (2026-10-21, en curso)
- Hecho: plan escrito en docs/copy/retencion.md (3 correos: bienvenida, activación al 3.er día, pago fallido; recordatorios posibles sin servidor; hoja de canales).
- Corrección posterior 25-10: prueba 7 días y reembolso 7 días; NO mantener la promesa antigua de 30 días.
- Entrada de pago (onboarding → paywall → cuenta → acceso por Hotmart): se le preguntó a la usuaria si se construye ahora.
- Funciones nuevas para decidir: notificaciones push; tarjeta «¿Cómo fue esta semana?» tras 7 días sin anotar.
### Capa 6: auditoría final con el revisor (2026-10-21, en curso)
- Ronda 2 (tras capas 1-4): Inicio 28/11 · Diario nuevo 27/11 · Informe 27/11 · Modo niño 27/13 → NO LISTA. Se aplicaron sus arreglos concretos.
- Ronda 3: Inicio 27/11 · Diario nuevo 28/11 · Informe 29/12 · Modo niño 27/13 → NO LISTA (umbral 36/16). Veredictos en auditoria-paso-a-paso/veredictos/ronda3/.
- Arreglos tras ronda 3: modo niño ignora el segundo toque y abre al terminar de decir el nombre (máx. 1,2 s); la duración del diario ya no se guarda sin elegirla; informe con coma decimal, fechas cortas, encabezados cortos, tope de 5 y barras que se imprimen; "5 Muy fuerte" alineado; sw.js v14.
- Lo que falta para pasar el umbral es de identidad visual, no de arreglos sueltos: íconos SVG de un solo set en lugar de emojis, fotos literales de una sola serie (o pictos Mulberry/OpenMoji), la "tira de pasos con check" de FICHA-ARTE en Inicio, Mi día e Informe, y la escala tipográfica 36/24/18/13. También: la flecha atrás y el menú no avisan si hay una nota sin guardar.

## Entrada de pago (aprobada por la dueña 2026-10-21, plan en docs/planes/entrada-de-pago.md)
- Hecho y verificado (tsc ✓ build ✓ con y sin links de Hotmart · 16 pruebas · Playwright 375px normal y reducido, 0 fallos): textos del embudo, funciones puras, /onboarding, la app arranca con sus datos, /paywall en 3 pasos con botón honesto sin links. Commits 7d48524 → a802d4e (sin push).
- Revisor visual, 6 rondas: las 7 pantallas LISTA (≥36/40, ≥16/20). Veredictos en auditoria-paso-a-paso/veredictos/ronda6/. Margen opcional: cortes de línea en 1.4, 1.6 y chips «Incluye».
- Migración 20261021110000_acceso_clientas.sql escrita, NO aplicada: espera permiso de la dueña.
- Espera decisión de la dueña: «Las comidas» abre la rutina de noche; uso de la pregunta de edad; ~40 textos «(pendiente de aprobar)» en docs/copy/embudo.md.
- Bloquea vender: correo del Día 5 (prometido en /paywall) sin crear; coherencia de precio y reembolso en producción; links de checkout en Vercel; fotos reales de baño y pijama.
- Falta: /entrar, /auth/callback, /cuenta (paso 7); /api/acceso y bloqueo en la PWA (paso 8); punta a punta en Vercel (paso 9).

## Auditoría legal (2026-10-24)
- Hecho: /privacidad, /terminos, /reembolsos y /aviso reescritas contra el 47 y el código real; nueva /cancelar (pasos + enlace a Hotmart); las 5 páginas se enlazan entre sí y "Cómo cancelar" está en el footer de la landing. Versión legal 2 (web/lib/marca.ts: VERSION_LEGAL, RESPONSABLE_LEGAL, EDAD_MINIMA = 18). Reporte: /mnt/project-files/auditoria-paso-a-paso/AUDITORIA-LEGAL.md.
- Hechos verificados: sin IA · sin cookies ni píxeles de terceros · datos del peque solo en el teléfono · Supabase en São Paulo (sa-east-1) · el nombre del comprador llega de Hotmart.
- Verificado: typecheck ✓ · build ✓ (rutas /cancelar y legales estáticas) · capturas 375px sin desborde (auditoria-paso-a-paso/capturas/legal-*.png).
- Migración 20261024120000_retencion_estadisticas.sql (borra estadísticas y errores a los 24 meses, lo que promete /privacidad) escrita, NO aplicada: espera permiso de la dueña.
- Pendiente en el embudo (pedido al hilo del embudo): eventos web que respeten "Compartir estadísticas" apagado · paywall con "se renueva automáticamente" y enlaces a Términos/Privacidad · botón "Eliminar mi cuenta" en /cuenta · correo del Día 5.
- Pendiente de la dueña: nombre legal y tipo (persona natural o empresa) · confirmar desde cuándo cuenta el plazo de reembolso de 7 días en Hotmart.

### Entrada de pago: avance 2026-10-25
- Hecho y verificado (sin push): /entrar con código, /auth/callback, /cuenta (d64f83d, a7fc55c); /api/acceso y bloqueo en la app con guía y kit de calma siempre abiertos, sin borrar datos (9fd213a, bbc6934, 6cadf47; SW v18). Eventos respetan el interruptor de estadísticas; el precio dice renovación automática y enlaza Términos y Privacidad.
- Revisor visual: /entrar y /cuenta 9/9 LISTA (veredictos/cuenta-ronda2); bloqueo 7/7 LISTA (veredictos/bloqueo-ronda3).
- Migración de acceso: aplicada en producción por el hilo de publicación.
- NO publicado: el bloqueo cierra la app en vivo para quien no pagó; espera decisión de la dueña (recomendado: publicar cuando haya links de Hotmart).
- El hilo legal tomó precio (US$4,99/mes), garantía (7 días, no 30), webhook de Hotmart y correos; textos.ts y embudo.md son suyos hasta su commit.
- Pendiente de aprobar: «Las comidas»; «Eliminar mi cuenta» en /cuenta (función nueva propuesta por el hilo legal); textos «(pendiente de aprobar)» en docs/copy/embudo.md.
- Producción: límite de intentos del código es por instancia (hace falta uno compartido); Supabase Auth: plantilla en español con código, URLs, SMTP con Resend.

## Hotmart y correo (2026-10-25, detenido en punto seguro por decisión de la dueña)
Datos reales de Hotmart (confirmados por la dueña): producto 8796204 en BORRADOR · plan mensual US$4,99 · 7 días de prueba · 7 días de reembolso · registro sin terminar. Dominio hadaapps.com comprado en Porkbun.
- Hecho y verificado (40 pruebas ✓ · typecheck ✓ · eslint 0 errores): quitada la garantía de 30 días en landing, paywall (textos.ts), /reembolsos, /terminos, marca.ts (GARANTIA_DIAS → REEMBOLSO_DIAS=7, PRUEBA_DIAS=7) y docs/copy. Nueva promesa única: «cancelas antes del día 7 y no pagas nada». Motivo: Términos de Compra de Hotmart 3.1 (el reembolso cuenta desde la compra, se solapa con la prueba) y 3.1.1 (renovaciones sin reembolso).
- Hecho: portada de Hotmart 600×600 PNG en /mnt/project-files/hotmart/portada-hotmart-600.png.
- Escrita, NO aplicada: migración 20261025010000_hotmart_producto_y_orden.sql (catálogo = 8796204; columna last_event_at; ignora avisos más viejos que el último aplicado, salvo reembolso y contracargo). La prueba de 11 casos con rollback (scratchpad) no llegó a correr: Supabase pidió confirmación y no hubo respuesta. Base verificada sin cambios (0 perfiles, 0 avisos, catálogo vacío).
- Cambio fuera del código: hadaapps.com y www.hadaapps.com agregados al proyecto de Vercel (www redirige al dominio raíz). No apuntan aún: faltan en Porkbun A @ 76.76.21.21 y CNAME www → cname.vercel-dns.com, conservando MX fwd1/fwd2.porkbun.com y el TXT de SPF.
- Nada tocado en Hotmart, correo, variables de Vercel ni Supabase.
- Pendiente: decidir plan anual (en la web siguen US$7.99/mes y US$59.90/año; Hotmart solo tiene US$4,99/mes) · HOTMART_HOTTOK y links de checkout en Vercel · registrar webhook en Hotmart (v2, PURCHASE_*, SUBSCRIPTION_CANCELLATION, SWITCH_PLAN) · correo de envío: solo existe reenvío de Porkbun, no hay servicio SMTP ni Resend; el correo de Supabase Auth admite ~2 por hora · texto de bienvenida y acceso (método verificado: sitio → /entrar → correo de compra → código de 6 dígitos → /cuenta → /app) · correo del Día 5 prometido en /paywall sin crear · prueba punta a punta · nombre legal · retención 24 meses sin aplicar · Vercel Pro antes de vender.

## Paso A: código listo para vender (2026-10-28, rama traspaso, sin publicar)
- Precio único: plan mensual US$4,99 con 7 días de prueba, en landing (una sola tarjeta, stack $28 tachado), paywall (una tarjeta sin elección; Día 7 = US$4.99 al mes), /terminos y /reembolsos. Quitado el plan anual de la web: `Plan = 'mensual'`; basta NEXT_PUBLIC_HOTMART_CHECKOUT_MENSUAL para abrir los pagos (antes exigía también el _ANUAL). La base sigue aceptando `cycle = 'anual'` (compatibilidad).
- Garantía: quitada la última promesa de reembolso («te devolvemos todo» en la FAQ de la landing).
- Legal: responsable «Giselle Alejandra Munzenmayer Gomez, persona natural, bajo la marca «HadaApps»» en /terminos y /privacidad (marca.ts: RESPONSABLE_LEGAL, RESPONSABLE_TIPO). Contacto sigue hadaapps@gmail.com. VERSION_LEGAL 4, actualizado 28-10-2026.
- «Eliminar mi cuenta» en /cuenta (no para la admin): confirmación con qué se borra, qué queda en el teléfono, registros de pago anónimos, aviso de que no cancela Hotmart + botón a Mis compras y /cancelar. Server action eliminarCuenta → RPC eliminar_mi_cuenta(). Migración 20261028120000_eliminar_mi_cuenta.sql ESCRITA, NO APLICADA: hasta aplicarla el botón muestra el aviso de error (no borra nada). /privacidad explica el botón.
- «Las comidas»: sin cambio (decisión de la dueña). Dominio: sin tocar (Paso B).
- Migraciones de Paso A: aplicadas el 29-10 (ver «Unión 29-10»).
- Verificado: 41 pruebas ✓ · typecheck ✓ · eslint 0 errores · build ✓ · capturas 375px (landing oferta, paywall 2 y 3, /cuenta con la confirmación, /entrar?eliminada=1) en simulación local.
- Textos nuevos marcados (pendiente de aprobar) en docs/copy/embudo.md y landing.md.
- Unión 29-10 con Codex: en landing/paywall manda la versión de Codex (copy de «promesas honestas», sin stack de valor, US$4,99 con coma); de Paso A se conservan nombre legal, «Eliminar mi cuenta», /terminos con precio. En la base ya están instaladas (por Codex, fuera del historial de migraciones) la cola de correos y la reparación Hotmart; el 29-10 la dueña pegó en el editor SQL /mnt/project-files/base-de-datos/cambios-29-10.sql (producto_y_orden + reparación de concurrencia re-aplicada + retención 24 meses con cron + eliminar_mi_cuenta): verificado en la base real (producto 8796204, lock serial, on conflict email, last_event_at, cron purgar-registros-viejos, eliminar_mi_cuenta solo authenticated). Aplicadas fuera del historial de migraciones de Supabase.
- PUBLICADO 29-10 con OK de la dueña: main = 973c17e (merge -s ours de traspaso sobre el main antiguo 5a9f1b8, historias sin ancestro común), deploy dpl_85e66EesVtqrZCG6uFaFGR9sa3e4 READY en pasoapaso.hadaapps.com; volver atrás = promover dpl_4bhmLXaVU. NEXT_PUBLIC_SITE_URL, Site URL/Redirect de Supabase y página de gracias Hotmart (aprobadas → /entrar?compra=1) apuntan al dominio. Falta: compra de prueba real (trial) → correo OTP → acceso; Vercel Pro antes de anunciar.
- CORREO POSTCOMPRA ENCENDIDO 29-10 (OK de la dueña por tarjeta): Vercel prod EMAIL_ENVIO_ACTIVO=true, EMAIL_DOMINIOS_VERIFICADOS=true, EMAIL_UNSUBSCRIBE_SECRET y CRON_SECRET puestos por la dueña (CRON_SECRET = secreto Vault paso_a_paso_correos_cron, 96 dígitos). pg_cron 'paso-a-paso-correos' */5 + email_dispatch_settings.enabled=true. Marketing sigue apagado; precobro queda 'manual' (EMAIL_PRECOBRO_VERIFICADO=false). Prueba E2E OK: compra trial dulceblancap@gmail.com 03:46 UTC → correo «Tu acceso» 03:50 → la dueña entró con el botón 03:54. Compra anterior con correo mal escrito (dulceblanca@, sin p) cancelada en Hotmart y su cola cancelada. Hecho después: clase «Cómo entrar a Paso a Paso» del área de miembros Hotmart con enlace a /entrar; CRON_SECRET+Vault rotados de nuevo (deploy dpl_EkZZ4eVoGm7MFdy4c7cyekbYxrD9, llamada de prueba 04:10 UTC → 200; el valor final asomó en una captura, riesgo bajo aceptado). Pendiente: cancelar la prueba nueva antes del 05-11 si no se usa, Vercel Pro, bug 'afiliado:' vacío en ingest_hotmart.
- 29-10 18:29 captura de la dueña: Hotmart producto 8796204 con «Ventas activas» encendido y «¡Proceso concluido!» (ya NO está en borrador); precio base US$4,99. La web publicada solo muestra US$4,99 al mes (los US$7,99 de líneas viejas de este archivo ya no aplican).
- 29-10 19:51 Vercel Pro ACTIVADO por la dueña (captura «Bienvenidos a Pro», puede empezar con prueba). Queda: cancelar la compra de prueba dulceblancap antes del 05-11.
