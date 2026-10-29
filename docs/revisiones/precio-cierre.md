# Alineación de la oferta — 25 de octubre de 2026

Estado: implementación y comprobaciones locales terminadas; veredicto independiente pendiente de incorporar. No publicado.

## Resultado

- Landing, FAQ y paywall: solo US$4,99/mes tras 7 días gratis. Se retiran la oferta anual y el bloque de valores tachados ligado a 12 meses.
- Renovación mensual y cancelación antes del día 7 visibles. Reembolso de 7 días con enlace a su política; no se prometen días adicionales después de la prueba ni devolución incondicional.
- Los enlaces antiguos con `plan=anual` y respuestas guardadas muestran la oferta mensual vigente sin perder respuestas. No se cambia ninguna suscripción existente en Hotmart.
- El enlace mensual válido basta para habilitar el puente de pago. La ausencia del anual ya no lo bloquea; un mensual inválido no puede sustituirse por un anual.
- Sin enlace mensual configurado, el botón continúa deshabilitado y explica que los pagos aún no están abiertos.
- Portada Hotmart v2: guardado confirmado por Giselle; esto no implica publicación del producto.

## Comprobaciones

- Typecheck y build completos aprobados; servidor de producción local y servidor de desarrollo arrancan correctamente.
- ESLint de los archivos cambiados: sin errores ni avisos. `git diff --check` sin errores de formato; Git avisa sobre conversión CRLF de archivos de Windows.
- 42 pruebas de embudo, cuenta y eventos aprobadas, incluidas las nuevas regresiones del mensual sin anual y la conversión del estado antiguo.
- Navegador real: 375, 360 y 1440 px, cero desborde horizontal y cero errores de página. Nombre largo también sin desborde. Capturas generadas contra el build final, sin enlace de pago real.
- Flujo comprobado: enlace mensual desde landing, `plan=anual` antiguo en paywall y onboarding, primer cobro mensual en paso 2, guardado posterior de respuestas conservadas y estado honesto sin checkout.
- Estados de apertura/error/doble toque de Hotmart conservados en código; no se ejecutó compra, cobro, correo ni cambio en servicios reales. Ningún cambio de datos/auth/IA, claves, permisos o migraciones en este hito.
- Capturas: `landing-precio-375.png`, `paywall-precio-375.png`, variantes 360/1440, `paywall-precio-nombrelargo-375.png` y `paywall-prueba-mensual-375.png`, todas en esta carpeta. Mediciones: `precio-mediciones.json`.

## Límites de la entrega

Revisión acotada a la oferta; no certifica el lanzamiento completo (61/48), cobros reales ni el control de acceso de producción. Falta publicar una versión revisada, terminar el producto Hotmart, comprobar su enlace y el comienzo exacto del plazo de reembolso, y completar las pruebas de pago/acceso. Los cambios anteriores de correos y entrada se conservaron; no se subió ni desplegó el conjunto del trabajo local.
