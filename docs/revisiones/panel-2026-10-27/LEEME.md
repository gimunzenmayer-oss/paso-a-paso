# Evidencia del panel — 27 de octubre de 2026

Diagnóstico solicitado por Giselle. Ningún arreglo aprobado ni ejecutado. Cuatro expertos independientes sin historial compartido ni lectura de otros veredictos.

## Alcance y condiciones
- Versión local actual de la rama traspaso. Incluye cambios anteriores sin publicar. No representa certificación de producción.
- Next dev en127.0.0.1:3113, Playwright/Edge aislado375×812, movimiento reducido. Servidores detenidos al finalizar capturas.
- Navegador bloqueó solicitudes a otros dominios. API acceso simulada únicamente para ver herramientas; estadísticas bloqueadas, sin compras, autenticación real, correos ni cambios remotos.
- No se probó velocidad real del celular, uso por familias, conversión ni retención. Los puntajes son diagnósticos cualitativos.
- Capturas principales y textos: landing-completa; onboarding01..09; paywall01..03 sin enlace; entrada; core01..04 nueva familia.
- Variante paywall-configurado01..03: mismo código, enlace mensual público ya aportado por la dueña en variable temporal del proceso. No se guardó configuración ni se abrió el checkout. No atribuir el botón de espera a un bug inevitable del producto.
- core-demo*: contexto nuevo con datos de ejemplo existentes de Mateo y diario abierto mediante su PIN de ejemplo, sin datos de familias reales. Inicio, Agenda, Informe, Diario, Anotar, Kit de calma y Rutina del niño.
- landing-detalle01..06: recortes consecutivos de la captura completa para lectura; no renders nuevos.
- Navegación mediante clics en onboarding; herramientas mediante navegación existente PP.ir; no se cambiaron componentes ni estilos. Solo se oculta el indicador de desarrollo de Next en las capturas.
- evidencia.json contiene mediciones y errores del recorrido principal; variante-checkout.json registra el estado temporal del precio. Los archivos .txt facilitan citas exactas pero no sustituyen ver las imágenes.

## Lectura de las imágenes
La barra fija de la app o del precio aparece en su posición del viewport original dentro de una captura larga. No deducir su posición final o solapamientos solo por el lienzo extendido: contrastar con estilos/código y el viewport de812px.

## Resultado y límites
Ver REPORTE-PANEL.md y los cuatro experto-*.md. Sin prueba de pago→entrega→acceso real. Los8eventos genéricos de prueba Hotmart procesados no certifican ese recorrido ni la entrega por correo.

## Corrección del control de calidad de la portada
La primera landing-completa-375.png y sus landing-detalle-* quedan RETIRADAS como evidencia visual: el desplazamiento rápido no había esperado las animaciones de entrada. La versión válida es **landing-completa-lenta-375.png**, con recortes **landing-lenta-detalle-01..06-375.png**. Se recorrió cada350px esperando420ms y se comprobó la visibilidad de las secciones (landing-scroll-verificacion.json). Las respuestas cerradas del FAQ permanecen ocultas por diseño. No se atribuyó ese defecto de captura al producto.

## Recapturas estables y cierre del panel
En la continuación del27-10 se sustituyeron otras tres capturas con animaciones/imágenes aún sin terminar por onboarding-03-estable-375.png, onboarding-04-estable-375.png y paywall-configurado-01-estable-375.png. Se esperó opacidad>.99 y decodificación de fotos, sin cambiar código. capturas-estables-verificacion.json guarda comprobaciones. Son estados retomados con el progreso de ejemplo de la rama de mañana. Los expertos recibieron estas tres para completar sus informes. Ver REPORTE-PANEL.md; no hay mejoras de producto aprobadas ni ejecutadas.
