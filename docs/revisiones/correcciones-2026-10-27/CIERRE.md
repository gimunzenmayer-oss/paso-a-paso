# Correcciones autorizadas — Paso a Paso, 27-10-2026

Alcance aprobado por Giselle con «apruevo»: acceso posterior a la compra, guardado duradero y promesas honestas. Trabajo local sobre `traspaso`, conservando los cambios previos. No se publicó código, no se cobró, no se activaron correos ni se aplicaron nuevas migraciones remotas.

## Qué cambió y qué quedó probado

| Bloque | Resultado local | Límite de la evidencia |
|---|---|---|
| Compra → correo → acceso | Prueba integrada con SQL real, catálogo del producto 8796204, orden de eventos, reparación de concurrencia, cola, cifrado, trabajador, contrato Resend, vinculación de correo confirmado y `mi_acceso`. Compra repetida no duplica acceso/pago; otra cuenta no hereda permisos; un reembolso frena el acceso; una prueba de importe cero no se cuenta como venta cobrada. | Auth y transporte de correo son dobles explícitos. PGlite no prueba concurrencia entre servidores. No equivale a una compra real ni a recepción en un buzón. |
| Guardado | Se confirma al completar la transacción, no al terminar `put`. Fallos de apertura/cuota/aborto rechazan; la memoria no se presenta como almacenamiento duradero. PIN y diario, y restauración de ejemplos, se escriben juntos. Lecturas inciertas bloquean la escritura de esa clave hasta una lectura confirmada: no se reemplazan registros por ejemplos ante un fallo de lectura. | Datos locales en el navegador, sin copia externa. No certifica Safari, avería física ni protección frente a borrar datos del navegador. La falta de espacio se inyecta para probarla de forma reproducible. |
| Recuperación del guardado | Diario conserva borrador, revierte la lista fallida y permite reintentar. Callers de estado no anuncian éxito antes de confirmar. Ajustes restaura el perfil anterior; aviso persistente, cierre con retorno de foco y reintento del formulario actual. Un éxito resuelve solo el error de su contexto. | No se crea un sistema de respaldo ni se rediseña la pantalla principal. |
| Promesas | Se retiran resultados garantizados de calma/comprensión, registro automático y personalización no implementada. Se elimina el recordatorio D5 inactivo y se aclara la fecha estimada del cobro. Privacidad distingue diario cifrado en navegadores compatibles frente a rutinas/fotos sin cifrado. Instalar no promete conservar datos. Términos solo mensuales; hero sin preparación cronometrada no medida; reconocimiento basado en la respuesta realizada. | No se inventan funciones para sostener las promesas. Siguen pendientes la adaptación real comidas/edad y otros cambios del panel que no fueron aprobados. |

`app/sw.js` pasa a v19 para renovar los scripts de la copia offline cuando se publique. Se conserva el dominio actual; no se migra el almacenamiento a otro origen.

## Verificación

- Pruebas generales: **100/100 pasan**, sin fallos ni omitidas; registro en `pruebas-final.txt`. Incluye las seis integradas de compra/acceso y 22 de almacenamiento controlado.
- Navegador real: **15/15 pasan**, sin fallos ni omitidas; registro `navegador-final.txt`. `web/pruebas/guardado-browser.mjs`, script separado `npm run test:guardado-browser`; requiere Edge. Sin red externa ni datos reales.
- Compilación final: **pasa**, ver `build-final.txt`. TypeScript forma parte de la compilación de Next; enlace público mensual configurado solo en ese proceso y envíos desactivados. No se cambian archivos privados ni variables remotas.
- Lint: sin errores; advertencia previa en `web/app/global-error.tsx:15` por navegación interna. Aviso Node de tipo de módulo heredado, sin cambio de configuración para ocultarlo.
- Dev local arrancó; recorrido real a 375px con acceso simulado solo en navegador. `ronda-2/mediciones.json`: 14 capturas, sin desborde, imágenes visibles cargadas y cero errores de página. No certifica autenticación/pago real.
- Primera tanda se interrumpió por timeout de captura; los errores `localStorage` de esa tanda provenían del instrumento en documentos sin origen. Se corrigió el instrumento, no la app, y la tanda final está separada en `ronda-2/`.
- Captura del error real renderizado con fallo inyectado: `../guardado-error-375.png`. El harness actualiza el título de sección igual que la app; la primera imagen con cabecera «Paso a Paso» no demostraba un defecto del producto.

## Revisión independiente: no certificada para vender

`ventas-veredicto.md`: usabilidad 31–35/40, craft 13–17/20 por superficie; landing 33/40 y 14/20. La adenda comprueba las dos precisiones finales de copy sin regresión visual observada. Ninguna superficie acredita el gate completo ≥36/40 y ≥16/20.

`guardado-veredicto.md`: primera revisión de error 28/40 y 12/20, principal 29/40 y 12/20. Su adenda confirma las correcciones de recuperación/foco/error desactualizado y la cabecera de Ajustes; no repuntúa ni acredita el gate principal. No se eleva una puntuación por intención ni se confunde la prueba técnica con aprobación visual.

Los restantes cambios de diseño, activación/retención, respaldo y cuentas económicas requieren elegir y aprobar su alcance. No se ejecutan para forzar una nota. **La app no se declara lista para vender.**

## Antes de publicar y certificar entrega real

1. Revisar el conjunto de cambios locales y preparar un commit/release trazable; hay trabajo anterior a esta corrección que no se debe publicar a ciegas.
2. Ejecutar la consulta de solo lectura `docs/correos/verificar-acceso-sin-envios.sql` en el proyecto correcto. Comprobar catálogo/orden y reparación juntos; no reaplicar scripts de creación ya instalados ni borrar perfiles de prueba/cliente a ciegas.
3. Verificar presencia y entorno de variables, sin mostrar valores. Mantener marketing, captación, carrito y precobro desactivados hasta sus comprobaciones específicas. La presencia de `CRON_SECRET`/Vault no acredita coincidencia ni despacho HTTP.
4. Publicar solo una versión preparada y aprobada; comprobar SHA y copia offline. La producción conocida sigue en el código anterior, no en estos cambios locales.
5. Coordinar una prueba real de Hotmart con la dueña: verificar adhesión/trial o compra, evento del producto real, acceso, recepción del correo y recuperación. La dueña completa cualquier dato de tarjeta; no se cobra ni se envía a terceros automáticamente por estas pruebas.
6. La activación del envío transaccional y del programador debe ser un paso explícito y comprobado. Las campañas permanecen apagadas. No activar el SQL de programación para «ver si funciona» antes de la revisión de cola, credenciales y versión.

## Archivos principales

- `app/js/datos.js`, `diario.js`, `app.js` y callers de persistencia; `app/sw.js`.
- `web/pruebas/compra-acceso-integrada.test.mjs`, `guardado.test.mjs`, `guardado-browser.mjs`; script en `web/package.json`.
- `web/app/page.tsx`, `privacidad/page.tsx`, `terminos/page.tsx`; copy del embudo, Historias e instalación; `docs/copy/landing.md` y `embudo.md`.
- `docs/correos/verificar-acceso-sin-envios.sql`: preparación de diagnóstico remoto, no ejecutada aquí.

Las rutas relativas de este informe parten de la raíz del repositorio salvo los enlaces de evidencia indicados.
