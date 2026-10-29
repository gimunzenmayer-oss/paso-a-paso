# Correos — avance local y pruebas, 25-10-2026

**Estado: preparado y probado localmente; NO activo ni listo para vender.** No se publicó en Vercel/GitHub, no se aplicó ninguna migración real, no se modificó Hotmart/Porkbun ni se enviaron mensajes a clientas.

## Inventario y evidencia

| Correos | Implementación local | Llegó a bandeja real | Enlace real funcionó |
|---|---|---|---|
| Acceso post-compra/prueba | Plantilla + cola transaccional + generador de enlace/código + envío Resend con dedupe | No enviado | No probado con Supabase real |
| Recuperación/admin | Plantilla SMTP lista; flujo existente de pedir/reenvío de código; callback admin acepta hash y mantiene MFA | No enviado | No probado con SMTP real |
| Aviso del día 5 | Plantilla y programación antes del fin de prueba; bloqueo adicional hasta verificar fecha/importe de Hotmart | No enviado | No probado |
| Pago fallido 1/3/5/7 y recuperado | Cola por estado, cancelación al resolverse, plantillas y proveedor | No enviado | No probado |
| Cancelación/reembolso | Plantillas y disparador de estado | No enviado | No probado |
| Carrito 2h/24h/72h | Plantillas y cola con consentimiento; falta conectar evento real de Hotmart tras comprobar su disponibilidad | No enviado | No probado |
| Bienvenida/activación D1/D3/D7 | Plantillas y programación con consentimiento; el D5 se cubre por el aviso de servicio | No enviado | No probado |
| Win-back D30/D60/D90 | Plantillas y programación, freno por reactivación/baja/inactividad | No enviado | No probado |
| Confirmación + recurso + nurturing D1/2/3/5/7 | Doble confirmación firmada, plantillas y cola. Falta recurso aprobado y formulario de captación | No enviado | No probado |
| Eliminación de cuenta | Solo plantilla. Espera función real de eliminación y su confirmación | No enviado | No aplica todavía |

Todas las 28 plantillas incluyen asunto A/B, preheader, texto plano/HTML y traza al avatar. Un CTA principal, sin información del niño ni testimonios/cupones/urgencia inventados. Mensajes comerciales requieren consentimiento confirmado, baja visible y one-click. No se duplica el recibo fiscal de Hotmart.

## Comprobaciones

- Suite: **57/57 pruebas automáticas** (40 existentes y 17 nuevas). Incluye PostgreSQL local PGlite: trigger, dedupe, regreso tras cancelación, doble consentimiento, autorización, leases y supresión. No equivale a ejecutar la ingesta completa de Hotmart en Supabase real.
- Typecheck: correcto. Build de producción: correcto. Lint: 0 errores, 1 aviso preexistente en `web/app/global-error.tsx`.
- HTTP local: **9/9** comprobaciones; sin secreto rechaza el trabajador; con secreto ficticio y envío apagado responde 0 envíos; marketing desactivado y proveedor no configurado no disparan red. Evidencia: `docs/revisiones/correos-http.json`.
- Render móvil: 8 vistas a 375px, sin desborde, CTA 53–56,8px. Evidencia: `docs/revisiones/correos-mediciones.json` y `docs/revisiones/correos-*-375.png`.
- Revisor independiente, ronda 2: **36/40 usabilidad y 16/20 craft**, aprobado en alcance visual local. Veredicto: `docs/revisiones/correos-veredicto.md`. No acredita compatibilidad de todos los clientes ni llegada a inbox.
- Se corrigieron defectos detectados: códigos solo en accesos, precobro separado en bloques, ayuda/continuidad en resultados y marco visual coherente.
- Ejecutar pruebas de DB y build de forma secuencial en este PC: al ejecutarlos simultáneamente hubo falta de memoria. La suite aislada terminó correctamente. La compilación/capturas requirieron permiso fuera del sandbox de Windows por archivos temporales/navegador; no fueron despliegues.

## Entregabilidad (estado comprobado / sin verificar)

DNS público consultado durante el inventario: raíz `hadaapps.com` con SPF `include:_spf.porkbun.com` y DMARC `p=none`, sin `rua`. No se obtuvieron TXT de Resend en selectores/hosts consultados. Esto NO prueba la ausencia de cualquier otro selector ni que Resend esté verificado. No hay conexión al panel Resend.

Cuenta Resend: la dueña respondió «No lo sé». Dominio SPF/DKIM de envío: pendiente de verificar en el panel. Inbox/spam y encabezados SPF/DKIM/DMARC de mensajes reales: **NO PROBADOS**. No se marca ninguno como verde por el simple hecho de existir DNS.

Remitentes aprobados: `acceso@tx.hadaapps.com` para servicio y `hola@news.hadaapps.com` para marketing; respuestas a `hadaapps@gmail.com`. Conservar reenvío y registros existentes de Porkbun.

## Lo que bloquea la activación

1. Identificar cuenta de Resend, verificar dominios, SPF/DKIM/DMARC y configurar SMTP de Supabase y sus dos plantillas (alta/enlace).
2. Revisar/aplicar migración de correo en entorno de prueba y coordinarla con las dos migraciones anteriores pendientes; no se aplicó ninguna a producción.
3. Introducir secretos desde paneles oficiales; configurar cron y eventos del proveedor. El código sale apagado por defecto. No se añadieron claves reales al proyecto.
4. Validar precios/fechas reales de prueba y de primer cobro en Hotmart. No activar el indicador `EMAIL_PRECOBRO_VERIFICADO` hasta esa comprobación. La web aún muestra precios antiguos: sigue bloqueando ventas.
5. Revisar envíos nativos de Hotmart y conectar carrito sin duplicar mensajes ni inventar nombres de eventos.
6. Aprobar el recurso gratuito y disponer de captación con consentimiento; completar eliminación de cuenta y tratamiento de contactos en ese proceso.
7. Ajustar la política a los contactos/consentimientos y su retención antes de activar marketing. No recopilar ni exportar datos del niño.
8. Compra de prueba autorizada → aviso Hotmart → correo a bandeja real → enlace y código que abren la app; después renovación/cancelación/reembolso. Pruebas autorizadas de los demás mensajes a `hadaapps@gmail.com` en celular.

Manual y controles mensuales: `docs/correos/OPERACION.md`. No llamar «terminado» al sistema mientras falten estas pruebas externas.


## Actualización 26-10: preparación posterior a Hotmart
- 71/71 pruebas automáticas completas, lint dirigido sin errores, compilación de producción y TypeScript aprobados. Primer intento de build tuvo EPERM local; segundo finalizó correctamente.
- Guía corregida según revisión independiente: logo44px, titular36, check de ejemplo, ayuda guardar+abrirPDF. Capturas guia-360/375/1440.png regeneradas, cero overflow/pageerror. PDFHTTP200, endpoints protegidos conforme a pruebas. Siete casos de formulario (sin envíos reales) y cinco capturas guia-correo-* actualizadas. Revisor independiente:37/40usabilidad,17/20craft,18/20copy; docs/revisiones/guia-veredicto.md.
- PDF rellenable con7campos y manual docs/correos/MANUAL-DUENA.md disponibles. Servidor de prueba con claves ficticias detenido al cerrar.
- Dueña configuró RESEND_API_KEY_TX y SUPABASE_SERVICE_ROLE_KEY en Vercel Production como secretos (contenido no leído). Variables aún requieren despliegue posterior.
- Reparación SQL Hotmart autorizada y aplicada; ocho fixtures responden200, sin certificar compras ni acceso. Envío aislado Resend llegó a Recibidos según la dueña.
- Falta aplicar cola, completar secretos de cifrado/baja/trabajador, firma de eventos Resend, catálogo real, scheduler y publicar código. No activar envíos ni comprar todavía. La programación cada5min no cabe en VercelHobby (solo diaria): usar programación Supabase compatible, pendiente preparar/aprobar. Fuentes: https://vercel.com/docs/cron-jobs/usage-and-pricing y https://supabase.com/docs/guides/cron/quickstart .
- Marketing, carrito y captación siguen apagados; news no verificado, privacidad/retención y eliminación de cuenta pendientes. No se ha certificado todo el inventario ni activado campañas.
