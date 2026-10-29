# Correos de Paso a Paso — implementación local, no activada

Actualización vigente 27-10: la cola y el programador SQL sí se instalaron, apagados y sin agenda; las menciones anteriores «NO aplicada» describen la preparación inicial. El nuevo código sigue local y las campañas apagadas. Leer ESTADO.md y `docs/revisiones/correcciones-2026-10-27/CIERRE.md` antes de actuar. No reaplicar scripts CREATE TABLE ni activar programación siguiendo una lista histórica.

## Qué existe

- `web/lib/correos/plantillas.ts`: 28 plantillas, cada una con dos asuntos, preheader, texto/HTML, un CTA principal y traza a FICHA-AVATAR. `scripts/vista-correos.mjs` genera vistas locales con datos ficticios e inventario completo. El segundo asunto es alternativa editorial; no se envían dos mensajes.
- `web/lib/correos/trabajador.ts`: valida estado actual, consentimiento y supresión antes de enviar; cifra el cuerpo para reintentos idénticos. Resend recibe clave de idempotencia por trabajo. Los enlaces de acceso cifrados caducan para reintento a los 8 minutos; se rescata desde `/entrar`, no se regenera automáticamente un enlace duplicado.
- `supabase/migrations/20261025130000_correos.sql`: contactos, cola y eventos privados con RLS y sin permisos directos; funciones limitadas por INGEST_KEY. Trigger en `profiles` guarda acceso y secuencias dentro de la transacción del cambio de estado. NO aplicada.
- `/api/correos/procesar`: trabajador GET/POST con `Authorization: Bearer <CRON_SECRET>`. NO hay cron activo ni configurado en Vercel.
- `/api/webhooks/resend`: firma Svix sobre cuerpo crudo, ventana de 5 minutos y eventos idempotentes. Rebotes/quejas/supresiones cancelan futuros envíos. No guarda el contenido del correo.
- `/api/correos/baja`: GET muestra confirmación, POST registra baja (compatible con one-click). GET nunca modifica preferencias. Correos de servicio quedan separados.
- `/api/correos/solicitud`: entrada INTERNA con secreto para una solicitud de recurso realmente autorizada. `/api/correos/confirmar`: confirmación firmada, caducidad de 24 horas y POST explícito. No suscribe automáticamente a compradores.
- `docs/correos/supabase-acceso.html`: alternativa de plantilla con código y enlace. NO sustituye automáticamente las plantillas de solo código ya instaladas y probadas por Giselle. El callback admin conserva MFA y validación del rol. El correo postcompra de la cola tiene su propio enlace/código.

## Activación, por orden (no hecho)

1. Cuenta Resend hadaapps comprobada en el panel real el 26-10. No crear otra. Servicio: acceso.hadaapps.com verificado, SPF/DKIM verdes y envío habilitado. Marketing aún sin dominio verificado.
2. En Resend añadir/verificar **acceso.hadaapps.com** (ya verificado) y **news.hadaapps.com** por separado. Copiar literalmente sus registros SPF/DKIM en Porkbun. Conservar MX/SPF del reenvío existente. No inventar selectores. DMARC inicial `p=none` y buzón real de reportes; verificar alineación con encabezados de correos recibidos. Endurecer solo tras observar todos los emisores legítimos.
3. Remitentes aprobados: `Paso a Paso <acceso@acceso.hadaapps.com>` (servicio), `Paso a Paso <hola@news.hadaapps.com>` (promoción). Reply-To: `hadaapps@gmail.com`. Esto no crea buzones receptores en esos subdominios.
4. SMTP real ya guardado en Supabase: smtp.resend.com, 465, usuario resend, remitente acceso@acceso.hadaapps.com. Giselle probó recepción y entrada con 6 dígitos. El 26-10 se guardó OTP 600 segundos, reabriendo el panel para comprobarlo. Conservar las plantillas actuales de código que ya funcionan. Site URL y /auth/callback actuales en paso-a-paso-sigma.vercel.app; revisar /admin/auth/callback antes de probar administración. No cambiar de dominio ni sustituir plantillas sin verificar el nuevo flujo.
5. Revisar y probar las migraciones pendientes de Hotmart y de correos en una base de prueba; aplicar las nuevas únicamente de forma coordinada. Las pruebas PGlite usan Postgres local con esquema mínimo, NO certifican la base real ni la configuración RLS de producción.
6. Configurar secretos SOLO en paneles oficiales (nombres en `variables.ejemplo.txt`). No se incluyen valores en Git.
7. Hotmart: verificar inicio real de prueba, fecha final y monto aplicable. **EMAIL_PRECOBRO_VERIFICADO sigue falso**: el trigger actual de ingesta calcula 7 días y no prueba que coincida con la pasarela. No activar ventas mientras el aviso prometido del día 5 no esté probado con fechas/importes reales. La plantilla indica precio base USD y manda a Hotmart para moneda/total final; si se requiere importe exacto local, añadir ese dato real antes de activar.
8. Enviar pruebas autorizadas a `hadaapps@gmail.com` y verificar inbox/spam + encabezados SPF/DKIM/DMARC. Una respuesta API aceptada NO es inbox.
9. Activar primero servicio y programar trabajador cada 5 minutos. Lote de 5, timeout 60s. Activar marketing SOLO al verificar el segundo dominio, el consentimiento y la baja. No se activan campañas automáticamente con este cambio de código.

## Disparadores y cadencias

| Grupo | Disparador | Cadencia y frenos |
|---|---|---|
| Acceso | Alta o regreso real a trialing/active | Un enlace/código por alta o regreso tras terminar; no otro al pasar de prueba a pago ni con cada renovación |
| Recuperación/admin | Solicitud explícita en `/entrar` o `/admin/entrar` | Supabase Auth + SMTP; rate limit existente. Admin conserva segundo factor |
| Aviso previo | Trial confirmado | Fin real menos 2 días; cancela al salir de trialing. Falta validar fecha/importe con Hotmart |
| Pago fallido | Cambio a past_due | Inmediato, +2, +4 y +6 días (días 1/3/5/7); detiene al recuperar/cancelar. No inventa fecha de bloqueo ni asume tarjeta |
| Cancelación/reembolso | Estado confirmado por ingesta | Confirmación informativa; no promete fecha de devolución |
| Carrito | Evento autenticado de Hotmart + consentimiento confirmado | +2h/+24h/+72h; RPC `email_operar('carrito',...)` preparada. Adaptador oficial PURCHASE_OUT_OF_SHOPPING_CART v2 preparado en el webhook, producto 8796204 y oferta mensual verificados en servidor; EMAIL_CARRITO_ACTIVO=false hasta probar el evento en el panel del producto |
| Activación | Inicio de prueba/alta | +1/+3/+7 días, con opt-in. No se personaliza con actividad privada del niño ni se repite al pasar de trial a pago |
| Win-back | Cancelled/expired | +30/+60/+90 días con opt-in, sin prometer descuentos; último solo si sigue con participación reciente. Sunset tras 90 días sin interacción verificada; no usar apertura como prueba de lectura |
| Recurso/nurturing | Solicitud + doble confirmación | Entrega, +1/+2/+3/+5/+7 días. Recurso real Mi primera rutina, PDF rellenable de una página, y /guia-gratis preparados. Captación pública con doble confirmación y límites compartidos, apagada por EMAIL_CAPTACION_ACTIVA hasta comprobar proveedor, privacidad y consentimiento. Se detiene al comprar |
| Cuenta eliminada | Eliminación real confirmada | Plantilla preparada; NO conectada: la función de eliminar cuenta sigue pendiente. No enviar antes de borrar ni afirmar que borró datos de otros dispositivos |

El recibo/correo propio de Hotmart se revisa en su panel: no sustituye nuestro acceso y no se fabrica un segundo recibo fiscal. Antes de habilitar carrito/dunning, revisar los envíos nativos para asignar un único dueño por mensaje y no saturar a la familia.

## Operación mensual y alertas

- Acceso: trabajos pendientes, antigüedad, errores, aceptados/entregados/rebotados, solicitudes de rescate y entrada efectiva. Aperturas no equivalen a lectura (proxy de privacidad); no se usan para seguridad ni prometen llegada.
- Carrito: personas consentidas contactadas, compras atribuidas y secuencias detenidas tras compra.
- Dunning: eventos de atraso, recuperaciones confirmadas por Hotmart y reintentos de email. No equiparar clic a pago.
- Reputación: quejas y rebotes por subdominio, reportes DMARC y lista de supresión. Pausar marketing ante deterioro; no comprar listas. No marcar mensajes como entregados porque Resend devolvió un ID.
- Trabajos `manual`: revisar configuración y reconciliar proveedor antes de reintentar. Nunca borrar dedupe para forzar envío. Idempotencia Resend dura 24h; nuestro límite de reintento es 23h.
- Datos: conservar solo correo, consentimiento y eventos mínimos de envío. Definir/aprobar retención y actualización de privacidad para las nuevas tablas antes de activarlas; no introducir información del niño. Solicitudes de eliminación deben incluir contactos y cola.

## Evidencia y limitaciones

Las pruebas automáticas simulan proveedor y acceso. Se prueba la migración en Postgres local, y el HTML a 375px con datos ficticios. Hasta configurar las cuentas: **no hay evidencia de inbox, enlace Supabase real, compra real de prueba ni webhook real de Hotmart**. Esos cuatro checks son obligatorios antes de vender. No se ha enviado ningún mensaje a clientas.


## Actualización del 26-10: ejecución del nuevo OK
- Separación real de dominios: EMAIL_DOMINIOS_VERIFICADOS cubre servicio; EMAIL_MARKETING_DOMINIO_VERIFICADO es adicional e independiente. No activar marketing solo por verificar el dominio de acceso.
- La cola procesa acceso antes que precobro, avisos de dinero, confirmaciones y consejos atrasados.
- Carrito: [contrato oficial](https://developers.hotmart.com/docs/en/2.0.0/webhook/cart-abandonment-webhook/). No crea cuentas ni concede acceso; conserva solo correo/ID y exige permiso confirmado en la base. El CTA usa el checkout mensual validado, no una URL que llegue del evento.
- Captación: /api/correos/recurso es pública únicamente con todos los indicadores listos; verifica origen, permiso explícito y trampa anti-bots. Límite compartido de 10 solicitudes por hora mediante huella rotatoria (sin IP en claro), más un correo de confirmación por dirección/día. La descarga del PDF no exige registro.
- Antes de activar captación, completar las declaraciones y retención de contactos en privacidad y probar la baja real. La función de eliminar cuenta sigue pendiente: su plantilla no se envía desde el trabajador.
- La prueba aislada NO utiliza la cola: node --import ./pruebas/alias.mjs scripts/prueba-servicio.mjs genera la vista local; añadir --enviar SOLO para la prueba autorizada a hadaapps@gmail.com. Clave EXISTENTE en web/.env.correos-prueba.local, ignorado por Git; nunca en chat. Rechaza una clave que no tenga formato Resend antes de transmitirla.
- Un recibo de Resend con estado aceptado no acredita Recibidos. Revisar ubicación y cabeceras SPF/DKIM/DMARC en el correo recibido. No borrar el recibo de prueba para repetir: controla duplicados y la ventana de reintento.
- URL actual: https://paso-a-paso-sigma.vercel.app. No enviar a pasoapaso.hadaapps.com hasta comprobar su conexión y actualizar las redirecciones.

## Programación compatible con Vercel Hobby (preparada, apagada)
Vercel Hobby admite cron diario; no instalar el ejemplo de cada5min en web/vercel.json. Se preparó supabase/migrations/20261026220000_correos_programacion.sql: instala pg_cron/pg_net y función privada apagada, sin agendar ningún trabajo. Requiere Vault existente y cola instalada. No se aplicó. Fuente: https://vercel.com/docs/cron-jobs/usage-and-pricing ; https://supabase.com/docs/guides/cron/quickstart .
La función solo hace POST a la ruta fija /api/correos/procesar si se habilita y hay pendientes o leases vencidos. Bloqueo y pausa de1min evitan llamadas superpuestas inmediatas. Toma de Vault únicamente paso_a_paso_correos_cron, que debe coincidir con CRON_SECRET de Vercel, nunca service_role. Revoca acceso del navegador a la función, ajustes y cola HTTP temporal de pg_net. El token viaja temporalmente por pg_net: custodiar acceso SQL. No registrar cabeceras.
Activación separada en docs/correos/activar-programacion.sql, con autorización explícita después de publicar/probar. Revisar respuestasHTTP además de cron.job_run_details: agendar una petición no demuestra procesamiento. Pausa reversible por enabled=false. Prueba local valida lógica con dobles net/Vault, no compatibilidad de extensiones ni conexión real.

## Instalación real posterior autorizada26-10
Cola y programación ya instaladas por SQL Editor, apagadas. La configuración enabled=false, cron0 y cola0 fue comprobada en el proyecto real. No volver a ejecutar los CREATE TABLE de esas migraciones; reconciliar historial antes de db push. Todavía falta configurar secretos adicionales, publicar código, firma Resend, prueba controlada postcompra, fechas/importe y activar programación/envíos mediante aprobación separada. Las secciones superiores con «NO aplicada» son el registro previo y quedan sustituidas por esta nota.
