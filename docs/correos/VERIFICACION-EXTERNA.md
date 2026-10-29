# Comprobaciones externas — 26 de octubre de 2026

## Comprobado directamente
- Panel Resend, cuenta hadaapps: acceso.hadaapps.com Verified, infraestructura Forge São Paulo. Dominio: 099eb37d-894f-43fd-9a1f-591be4cc22af. Envío habilitado, recepción deshabilitada; respuestas previstas a hadaapps@gmail.com.
- DKIM: TXT resend._domainkey.acceso, Verified. SPF: CNAME rsend.acceso → rsend-sae1.forge.rmta.net y send.acceso → send.forge.rmta.net, ambos Verified.
- DNS público: DMARC raíz v=DMARC1; p=none; sin destino rua para reportes. SPF raíz pertenece al reenvío Porkbun: conservarlo. La existencia de registros no acredita la alineación de un mensaje recibido.
- Supabase uvubnzymrkqirdvneeds: Email OTP expiration guardado 3600→600 segundos; longitud6. Se reabrió el panel y confirmó 600/6 con Save deshabilitado. Evidencia: ../revisiones/correos-supabase-otp-600.png.
- Giselle había probado recepción de OTP real en Gmail y entrada con correo conocido y uno nuevo. Eso no fue una compra de Hotmart ni una prueba de la cola.

## Pendiente, no afirmar como terminado
- La nueva prueba aislada a Gmail: espera clave existente en el archivo privado de prueba. No hay recibo de envío real de este hito todavía.
- Inbox/Spam y cabeceras SPF/DKIM/DMARC del mensaje nuevo. No se accedió al buzón de Gmail.
- Marketing news.hadaapps.com: no existe en la lista de dominios de Resend inspeccionada; no se creó otro dominio ni una clave.
- Hotmart: configuración de eventos y correos nativos de este producto, comienzo/fin real del trial e importe del primer cobro. No se logró leer su ventana nativa minimizada; no se modificó Hotmart.
- Servicio de cola: migración y programación aún no aplicadas a servicios reales; sin cambios de Vercel, DNS, secretos externos o campañas. Única modificación externa de este hito: vencimiento OTP a 600 segundos.

## Fuentes del adaptador
- [Evento oficial de carrito v2](https://developers.hotmart.com/docs/en/2.0.0/webhook/cart-abandonment-webhook/): PURCHASE_OUT_OF_SHOPPING_CART; contrato id/event/version/creation_date/product/offer/buyer. No deducir consentimiento de este evento.
- [Idempotencia de Resend](https://resend.com/docs/dashboard/emails/idempotency-keys): la ventana del proveedor es 24h; el proyecto limita reintentos automáticos a23h y conserva el mismo cuerpo e identificador.

- 26-10: prueba aislada aceptada por Resend y llegada a Recibidos de hadaapps@gmail.com confirmada por Giselle. No acredita compra Hotmart ni cabeceras SPF/DKIM/DMARC; campañas siguen apagadas.

- Reparación 26-10 autorizada por Giselle y aplicada por SQL Editor: función ingest_hotmart serializa transacciones y resuelve perfil existente por email. Confirmación reparacion_instalada=true. Dos pruebas PGlite pasaron; cuatro reintentos de fixtures fallidos solicitados, aún pendientes de resultado. No compra real ni envío postcompra probado.

- Resultado tras reparación: se reenviaron solo los cuatro fixtures con error. Historial Hotmart confirmó ocho de ocho HTTP200 Procesado; captura docs/revisiones/hotmart-prueba-8-procesados.png. Esto acredita recepción técnica de pruebas simuladas; NO compra real, catálogo real, acceso ni correo postcompra.

- Nueva autorización explícita de Giselle: instaladas por SQL Editor las migraciones 20261025130000_correos y 20261026220000_correos_programacion en uvubnzymrkqirdvneeds. Ambas devolvieron Success. Verificación real: envio_programado_activo=false; tareas_activas=0; correos_en_cola=0; RLS=true en5tablas; lectura anon=false; tick apagado devuelveNULL. Evidencia docs/revisiones/correos-instalados-apagados.png. No se agendó cron, no se insertaron secretos en Vault, no se invocó HTTP ni se enviaron correos. Cambios manuales SQL: reconciliar registro de migraciones antes de futuro db push; no reaplicar ciegamente scripts create table.

- Incidente26-10: la dueña mostró captura con3claves internas generadas (cifrado/baja/cron), pegadas juntas en Valor como Configuración y con destino Preview+Production; Vercel avisó EMAIL_PAYLOAD_KEY duplicada enProduction. No reproducir valores. Generados reemplazos locales en archivos ignorados, un valor por archivo. Falta sustituir los valores existentes enVercel y verificarVault; no afirmar revocación remota. No evidencia de exposición de clavesAPI de proveedores en esta captura.
