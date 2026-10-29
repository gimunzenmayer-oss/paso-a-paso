# Paso a Paso — traspaso actualizado para Claude

Fecha de corte: 28 de octubre de 2026, Chile.
Preparado para continuar el mismo proyecto. No contiene contraseñas ni valores de claves.

## Lee primero: situación real

Hay una versión publicada y un checkout de Hotmart existente, pero las correcciones más recientes siguen LOCALES, sin publicar. Las pruebas automatizadas locales pasaron; **la app NO tiene certificación de producción ni de venta**. Falta comprobar una compra real que termine en correo recibido y acceso habilitado.

La última petición de Giselle fue una auditoría exhaustiva antes de cobrar: corregir problemas locales que puedan resolverse sin romper nada y entregar APTO / NO APTO con bloqueantes. Esa auditoría **se inició, pero quedó interrumpida por el límite de uso**. Los tres subagentes de seguridad/pagos, datos/operación y QA en navegador devolvieron error de límite. No entregaron revisiones válidas. No confundir su convocatoria con trabajo terminado.

**Autorización vigente:** revisar y corregir problemas seguros del proyecto local. Avisar con ⚠️ y obtener autorización concreta antes de gastar, enviar correos, tocar clientes reales o efectuar pruebas con cobro. No activar campañas, publicar el conjunto de cambios ni ejecutar migraciones remotas a ciegas.

## 1. Carpeta y forma de trabajar

- Carpeta exterior: `C:\Users\dulce\OneDrive\Desktop\claude\App1`.
- Repositorio real: `C:\Users\dulce\OneDrive\Desktop\claude\App1\paso-a-paso-traspaso`.
- Next.js: `web/`. App interna HTML/JS: `app/`.
- `web/copiar-app.mjs` copia la app interna a `web/public/app` antes de desarrollo y compilación. Editar fuentes en `app/`, no únicamente la copia generada.
- Rama comprobada: `traspaso`; HEAD local conocido: `defc619`. Muchos cambios anteriores sin commit: conservarlos, revisar `git status` y `git diff`. No resetear ni sobrescribir.
- Producción conocida: código anterior `5a9f1b8`, redistribuido por la dueña para incorporar variables. No se verificó nuevamente su SHA en esta auditoría.
- Stack local: Next.js 16.4.2, React 19.3, Supabase, Playwright-core 1.64.1, PGlite 0.5.11, Node 24.22.0, PowerShell.
- Leer `AGENTS.md` / `CLAUDE.md`, `ESTADO.md` y las cuatro FICHAS. El SO está en `docs/sistema/` de la carpeta exterior; resolver las rutas antes de ejecutar.
- ESTADO tiene 199 líneas y secciones históricas contradictorias. Su checkpoint reciente prevalece sobre textos antiguos como «sin backend» o «Hotmart en borrador». Mantenerlo bajo 200 líneas.
- Hablar español simple. Giselle no es técnica. No pedir claves por chat ni capturas con valores visibles.

## 2. Producto y decisiones que se conservan

Paso a Paso es una app web instalable para madres, padres y cuidadores de niños autistas de 2 a 12 años. Método «Antes, Durante y Después»: rutinas visuales, comunicación, temporizador, kit de calma, historias, diario e informe para profesionales.

- Oferta aprobada: **solo US$4,99 al mes**, prueba de 7 días y plazo de reembolso de 7 días configurado en Hotmart. Anual aplazado. No restaurar garantía de 30 días ni sumar prueba y reembolso automáticamente.
- Datos del niño locales en el navegador. Diario cifrado con PIN en navegadores compatibles. Rutinas/fotos no tienen ese cifrado. No hay respaldo externo implementado.
- No hay generación por IA activa en el producto. No inventar `ai_calls`, costos de IA medidos ni funciones clínicas/personalización que no existen.
- Voz cálida y serena, sin culpar. Marca: salvia `#4A765F`, fondo `#F2F4EF`, Lexend/Atkinson. La app existente es la referencia visual.
- No hay clientes de pago, renovaciones ni entrevistas acreditados por esta auditoría. No inventar prueba social.

## 3. Servicios existentes: no pedir que cree las cuentas otra vez

- Sitio y acceso utilizados: https://paso-a-paso-sigma.vercel.app
- Vercel: equipo `giselle10`, proyecto `paso-a-paso`. Se observó plan Hobby; elegibilidad comercial pendiente de resolver. También aparece `hadaapps.com` asociado. No cambiar el origen: los datos locales no se trasladan solos a otro dominio.
- Repo conocido: `gimunzenmayer-oss/paso-a-paso`; verificar conexión Git, rama y raíz `web/` antes de publicar.
- Supabase: `uvubnzymrkqirdvneeds`, São Paulo.
- Resend: cuenta `hadaapps`, dominio de servicio `acceso.hadaapps.com` verificado. Remitente `acceso@acceso.hadaapps.com`, soporte `hadaapps@gmail.com`.
- Hotmart: producto `8796204`, aprobado, «Ventas activas» según capturas de la dueña.
- Checkout: https://pay.hotmart.com/W108168393K
- Venta externa: https://go.hotmart.com/W108168393K
- Página de producto: https://go.hotmart.com/W108168393K?dp=1

### Acceso y correo comprobados anteriormente

- La dueña recibió OTP de 6 dígitos y entró con cuenta existente y nueva. Expiración Supabase ajustada a 600 segundos.
- Plantillas reales Supabase en español usan `{{ .Token }}`. No sustituirlas por HTML antiguo de magic link.
- SMTP Resend configurado en Supabase. DKIM/SPF del dominio de servicio verificados; DMARC raíz `p=none`, sin informes `rua` observados. Alineación de cabeceras y entrega a otros proveedores pendientes.
- Se envió UNA prueba aislada autorizada a `hadaapps@gmail.com`; Giselle confirmó Recibidos. No repetir por costumbre. Recibo: `docs/correos/prueba-servicio-resultado.json`.
- Dominio de marketing `news` no verificado. Envío y campañas siguen apagados. No inferir entrega postcompra de una prueba SMTP.

### Hotmart / base / programación

- Webhook v2: `/api/webhooks/hotmart`, producto 8796204, ocho eventos: aprobada/completa/reembolsada/chargeback/vencida/atrasada/cancelación de suscripción/cambio de plan.
- Se repararon errores de concurrencia y perfil duplicado mediante `20261026210000_hotmart_concurrencia.sql`, aplicada con autorización anterior. Ocho fixtures genéricos llegaron a HTTP 200. Producto de prueba `id=0`: **no acredita pago ni acceso real**.
- Cola de correos `20261025130000_correos.sql` y programación `20261026220000_correos_programacion.sql` instaladas APAGADAS con autorización anterior: enabled=false, cron=0, cola=0 según evidencia.
- Vault contiene `paso_a_paso_correos_cron` según captura. No se comparó su valor con Vercel ni se probó el despacho real.
- `docs/correos/activar-programacion.sql` está preparado, NO ejecutado.
- Aplicación remota de catálogo/orden `20261025010000_hotmart_producto_y_orden.sql` no confirmada conjuntamente con las demás migraciones.
- Consulta preparada, no ejecutada en esta continuación: `docs/correos/verificar-acceso-sin-envios.sql` (solo lectura).
- Variables sensibles dadas de alta por la dueña en Production: HOTTOK, clave Resend, service-role y secretos internos. Presencia por capturas/confirmaciones, no certificación de sus valores o funcionamiento. Interruptores de envío apagados.
- Tres secretos internos iniciales se expusieron en una captura y se generaron reemplazos privados; dueña confirmó sustitución. Nunca reutilizar ni copiar los expuestos. No volver a generar los actuales sin coordinar Vault/cola.

## 4. Trabajo aprobado y terminado LOCALMENTE

Giselle aprobó tres bloques: acceso poscompra, guardado duradero y promesas honestas.

### Guardado

- Confirmación al completar la transacción IndexedDB, no al terminar `put`.
- Fallos de apertura, cuota, aborto o lectura no anuncian éxito ni sobrescriben información con ejemplos.
- PIN y diario se actualizan atómicamente; restauración de ejemplos también. Borradores y lista se recuperan al fallar.
- Aviso persistente con reintento válido del formulario, retorno de foco y contexto: guardar una pantalla no borra el error de otra.
- Service worker v19 para renovar scripts cuando se publique.
- Fuentes principales: `app/js/datos.js`, `diario.js`, `app.js` y callers; `app/sw.js`.
- No equivale a respaldo, recuperación ante avería ni certificación Safari.

### Compra → correo → acceso

- Seis pruebas integradas ejecutan SQL real, cola, cifrado, trabajador, contrato Resend y permisos.
- Compra repetida no duplica ingreso/acceso, otra cuenta no hereda permisos, reembolso frena acceso/email, trial de importe cero no se cuenta como venta cobrada.
- Auth y transporte de email son dobles explícitos. No se cobró ni se entregó correo real durante estos tests.
- Archivo: `web/pruebas/compra-acceso-integrada.test.mjs`.

### Promesas precisas

- Quitados resultados garantizados de calma/comprensión, registro automático y personalización no implementada.
- Eliminado aviso D5 por email inactivo; fecha de cobro se identifica como estimada y confirmada por Hotmart.
- Hero sin promesa de preparación en dos minutos; reconocimiento basado en la respuesta del usuario.
- Privacidad aclara cifrado y almacenamiento locales; instalación no promete impedir la pérdida de datos.
- Términos solo mensuales. Fuentes: landing, textos del embudo, historias, diario y páginas legales; copy en `docs/copy/`.

## 5. Pruebas y evidencia disponibles

Último cierre local completo: `docs/revisiones/correcciones-2026-10-27/CIERRE.md`.

- **100/100 pruebas generales pasan**, sin omitidas: `pruebas-final.txt` en esa carpeta.
- **15/15 pruebas en Edge real pasan**: `navegador-final.txt`. Script `npm run test:guardado-browser` desde `web/`.
- Compilación final y TypeScript pasan: `build-final.txt`. Lint sin errores, un aviso heredado de navegación en `web/app/global-error.tsx:15`.
- Los 18 scripts servidos coinciden con las fuentes; SW v19 confirmado.
- Dev local arrancó. Catorce capturas a 375 px sin desborde ni errores: subcarpeta `ronda-2/`, con `mediciones.json`.
- Acceso simulado explícito solo en navegador aislado; APIs externas bloqueadas. Estas capturas no certifican login/pago reales.
- Error de guardado: `docs/revisiones/guardado-error-375.png`.

### Revisión visual: requisito NO superado

- `docs/revisiones/correcciones-2026-10-27/ventas-veredicto.md`: landing 33/40 y 14/20; superficies de venta entre 31–35/40 y 13–17/20.
- `guardado-veredicto.md`: principal 29/40 y 12/20. Adenda confirma correcciones de recuperación; no repuntúa ni acredita aprobación.
- El umbral requerido es ≥36/40 y ≥16/20. No cambiar las notas ni autoevaluarse. Hace falta corregir y repetir revisión independiente con capturas del resultado.
- Panel de cuatro expertos ya completado: `docs/revisiones/panel-2026-10-27/REPORTE-PANEL.md`. No repetirlo desde cero.

## 6. Auditoría de producción recién iniciada: qué falta retomar

La última solicitud amplía el permiso para corregir problemas locales de seguridad, datos, escala, pagos, legal, operación, UX y rigor de entrega. Las restricciones anteriores de «solo tres bloques» eran de la etapa previa; esta nueva solicitud permite arreglos locales adicionales.

Se leyeron las guías de integridad 61, rigor 48 y partes relevantes de seguridad/testing/publicación. Se convocaron tres auditores, todos interrumpidos por límite: **no hay informes de certificación nuevos ni auto-QA nuevo completado**.

- `npm audit --omit=dev --audit-level=high` se intentó. Falló la conexión DNS a registry.npmjs.org. Archivo `tmp/audit-runtime-2026-10-27.json` contiene ese error, NO un resultado limpio. Reintentar con acceso de red apropiado.
- `docs/release/` no existía en el inventario de esta auditoría. Preparar los seis artefactos del 61 con evidencia, sin rellenarlos ficticiamente.
- Existe manual específico de correos `docs/correos/MANUAL-DUENA.md`; falta revisar/completar manual general del negocio.
- Headers/CSP están definidos en `web/next.config.ts`. No se verificaron de nuevo en HTTP de producción. Tener una configuración no prueba el header real.
- No se aplicaron nuevas migraciones, no se publicó, no se activaron correos y no se hicieron compras durante esta auditoría interrumpida.

Fuentes oficiales consultadas el 27-10 para revalidar infraestructura:
- https://vercel.com/docs/plans/hobby — Hobby restringido a uso personal no comercial.
- https://supabase.com/docs/guides/platform/free-project-pausing — Free puede pausarse por baja actividad durante siete días; no afirmar que se pausa inevitablemente cada siete días.
- https://supabase.com/docs/guides/platform/manage-your-usage/egress — cuota Free de egress 5 GB; no equivale a capacidad demostrada para 500 usuarios.
- https://supabase.com/docs/guides/platform/backups — Free requiere estrategia de exportación externa; backups automáticos del plan de pago no respaldan los datos locales del navegador.
- https://top10.owasp.org/2025/ — referencia OWASP 2025.

## 7. Siguiente trabajo concreto para Claude

1. Leer estado y cambios actuales; conservar trabajo anterior. Releer solicitud de pre-lanzamiento y SO 61/48/27/09/25/13/18/31/47/38/62 según área.
2. Inventariar rutas, RPC y grants; probar negativos de acceso, IDOR entre cuentas y autenticidad/idempotencia/orden de eventos. No conformarse con login correcto o HTTP 200.
3. Manejar la app en navegador aislado: arranque vacío, acción frecuente, error y recuperación, offline, exportación/borrado, todas las acciones core. Instrumentos anteriores útiles: `tmp/correcciones-capturas.mjs` y `web/pruebas/guardado-browser.mjs`.
4. Corregir fallos locales con pruebas; auditar dependencias y secretos sin mostrar valores. No correr builds y dev sobre el mismo `.next` simultáneamente.
5. Revisar respaldo/exportación de datos del niño, retención/borrado de cuenta, observabilidad, incidentes, rollback y escala real. No inventar Sentry, status page, pruebas de restauración ni capacidad.
6. Corregir superficies visuales conservando la marca; capturar a 375 px y pedir revisor independiente. Evaluar rendimiento móvil con método y presupuesto, distinguiendo laboratorio de usuarios reales.
7. Completar `docs/release/CLAIMS-LEDGER.md`, `PAYMENT-CERTIFICATION.md`, `ECONOMICS-CERTIFICATION.md`, `PRIVACY-DATA-MAP.md`, `RELEASE-MANIFEST.json`, `PUBLICATION-CERTIFICATE.md` y manual general sin secretos.
8. Mantener como bloqueantes la compra/entrega real pendiente, versión local distinta de producción, infraestructura no verificada y gate visual no aprobado. Prueba remota con clientes/dinero/email requiere paso autorizado y preparado.
9. Entregar APTO/NO APTO por evidencia, diez áreas con ✅/⚠️/❌, certificado /100 conforme al 48 (no medido=0), acciones concretas de la dueña y actualizar ESTADO bajo 200 líneas.

**No hay un veredicto nuevo terminado. El estado prudente sigue siendo NO CERTIFICADA PARA VENDER.** Las pruebas locales aprobadas se conservan como evidencia de su alcance; no sustituyen la certificación de producción.

## Mensaje que Giselle puede pegar a Claude

Continúa Paso a Paso desde este traspaso. Lee primero AGENTS.md/CLAUDE.md, ESTADO.md, las cuatro FICHAS y el cierre de correcciones. Retoma la auditoría de pre-lanzamiento interrumpida, corrige lo que puedas localmente y entrega APTO/NO APTO con bloqueantes y evidencia. No repitas la creación de cuentas ni el panel de expertos. No publiques, cobres, envíes correos, actives campañas ni cambies datos reales sin preparar y autorizar ese paso. No me pidas claves por chat. Explícame todo en español simple.
