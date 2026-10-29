# Entrada de Paso a Paso — revisión local

Solicitud: hacer /entrar más cálida y menos vacía, manteniendo la identidad existente.

Cambios: tira ilustrativa con fotos existentes de rutinas, bienvenida serena, tarjeta elevada, formulario y CTA juntos (24 px), apoyo debajo de la acción. Código en una vista más compacta; error de reenvío específico; pulsación CTA 120 ms, botón cambiar correo bloqueado durante petición. Lógica de servidor, autorización y pagos sin cambios.

Evidencia: entrada-375.png, entrada-360.png, entrada-1440.png, entrada-codigo-375.png, entrada-error-375.png y entrada-compra-375.png en esta carpeta. Mediciones en entrada-mediciones.json: sin desborde horizontal en 360/375/1440; botón 56 px. Fotos ilustrativas; correo de prueba ficticio. Indicador Next de desarrollo excluido del producto.

Verificaciones: compilación de producción y TypeScript aprobados (NODE_OPTIONS con límite de memoria por recursos del PC); lint de archivos modificados aprobado, lint global previo con un aviso heredado en global-error.tsx. 40 pruebas existentes de cuenta, embudo y eventos aprobadas. Navegador local con simulación existente solo en development: validación vacía, paso código, código incompleto e incorrecto, cambio de correo, error de conexión, variante compra/enlace. Entrega real del código ya confirmada por Giselle antes del cambio visual; no se envió ningún correo real desde estas pruebas.

Incidencias de verificación: carga inicial de CSS modules incompatible con loader del proyecto, corregida usando CSS con prefijo entrada-. Caché Next de OneDrive bloqueada, apartada a node_modules/.cache/entrada-next-*; build final aprobado. La última pasada final completó todas las interacciones y capturas; las capturas de presentación ocultan solo el indicador Next y la variante compra espera el fin de las animaciones.

Revisor independiente: consultar entrada-veredicto.md, escrito por el revisor. No se publica ni sube a GitHub en esta tarea; cambios disponibles localmente. Ventas, precios/garantía y resto del sistema de correos continúan como pendientes separados.

