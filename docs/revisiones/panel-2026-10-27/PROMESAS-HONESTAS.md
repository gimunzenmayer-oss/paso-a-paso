# PROMESAS HONESTAS — implementación local, 27-10-2026

Alcance autorizado: corregir afirmaciones falsas con copy preciso. Sin rediseño, precio nuevo, funciones, respaldo nuevo, envíos, publicaciones ni commits. No se editó ESTADO.md ni PP.guardar. Se preservó el trabajo concurrente de guardado/acceso; SWv19 pertenece al principal y no se modificó en este encargo.

## Textos estables para capturas

Se avisó al principal que landing/onboarding/paywall están estables. Se conservan los CTAs identificables y el recorrido previo. Las capturas a 375px y la revisión independiente quedan a cargo del principal, según instrucción expresa. Este reporte no certifica aprobación visual ni comercial; no asigna puntajes propios. Si el baseline no alcanza el umbral, debe registrarse pendiente.

| Superficie | Precisión implementada |
|---|---|
| Landing, hero | «Rutinas con fotos y apoyo en la crisis». Sustituye certeza de días predecibles y de saber qué hacer. |
| Landing, mecanismo | «Anticipa su día. Acompaña cada paso». Mantiene Método Antes, Durante y Después; «Durante · Acompañas» no garantiza calma. |
| Landing, cierre | Invita a mostrar el primer paso y acompañar «¡Hecho!», a su ritmo. No promete café tranquilo ni comprensión asegurada. |
| Landing, privacidad | «Se quedan en este navegador. El diario puede protegerse con PIN y cifrado en navegadores compatibles; rutinas y fotos no se cifran». |
| Onboarding, reconocimiento | «No tienes que resolverlo todo a la vez. Puedes empezar mostrando a {nombre} un paso de su rutina». Sin causa universal de crisis ni diagnóstico de paciencia. |
| Onboarding, compromiso/carga/resultado | Una rutina para probar, «Rutina preparada»; sin atribuir una adaptación completa al momento elegido. La variante de mañana conserva su nombre y horario. |
| Onboarding, ensayo | «Toca “¡Hecho!” para ensayar cómo se marca un paso». Diferencia ensayo de un uso real futuro. |
| Onboarding y resumen de precio, Después | «Anota lo que pasó para su próxima consulta» / «anotas lo que pasó…». Registro explícito de la familia, sin automatismo. |
| Paywall, resumen | «Una rutina para empezar con {nombre}» y «Tus {N} respuestas, a la vista. Método Antes, Durante y Después». Los chips recapitulan elecciones; no prueban adaptación por edad/crisis. |
| Paywall, prueba | Sustituye Día 5 y correo garantizado por «Antes del día 7 · Revisa si quieres seguir». Indica cancelar en Hotmart antes del cobro y «No hay recordatorio por correo activo». |
| Paywall, fecha estimada | Línea de tiempo: «Si empiezas hoy · {fecha_cobro}» y «Cobro estimado». Junto a la fecha del precio: «Si empiezas hoy: {fecha_cobro} (estimada). Hotmart confirma la fecha definitiva». Se conserva el cálculo local hoy + 7; no es fecha contractual recibida de Hotmart. |
| Paywall, precio | «Anticipa con fotos. Acompaña a {nombre}»; «Prueba 7 días gratis y sigue mes a mes»; «Una rutina con fotos para probar juntos». Precio vigente conservado. |
| Inicio, instalación | Abrir desde un icono no crea copia; borrar datos del navegador o cambiar de teléfono puede hacer perder registros. |
| Diario, ranking | «Posibles desencadenantes que registraste». Única edición propia en diario.js: título, sin alterar ranking ni guardado. |
| Historias | «Pueden ayudar a {nombre} a anticipar lo que viene». Sustituye comprensión asegurada. |
| Privacidad | Cifrado del diario con PIN solo en navegadores compatibles; sin disponibilidad criptográfica se guarda sin cifrar. Rutinas/fotos no se cifran. Ambas menciones de seguridad de la página se acotan. |
| Privacidad, respuestas | Se guardan en este navegador para recapitular elecciones; no implican una rutina adaptada por edad o crisis. |
| Términos | Suscripción y renovación mensual. Elimina la oferta anual inexistente, sin añadir precio ni modificar la política de reembolso. |

## Archivos de este encargo

- `web/app/page.tsx`: hero, mecanismo, etiqueta de informe, FAQ de privacidad y cierre.
- `web/components/embudo/textos.ts`: reconocimiento, compromiso, carga, resultado y tres etapas del paywall.
- `web/components/embudo/PaywallResumen.tsx`, `PaywallPrueba.tsx`, `Resultado.tsx`: solo comentarios alineados con el copy, sin tocar render, CTAs ni comportamiento.
- `app/js/app.js`: texto y comentario del aviso de instalación.
- `app/js/diario.js`: solo título del ranking. Los demás cambios del archivo corresponden al agente de guardado; se verificó su coexistencia en el diff.
- `app/js/historias.js`: solo introducción; se preservaron los cambios de persistencia de otro agente.
- `web/app/privacidad/page.tsx` y `web/app/terminos/page.tsx`: precisiones descritas arriba.
- `docs/copy/embudo.md`, `docs/copy/landing.md`: literales alineados y retiro de oferta anual obsoleta como copy vigente. Se conserva el historial de alternativas del titular, marcado histórico.
- Este reporte. La copia generada en `web/public/app` se actualiza por el proceso habitual de compilación; no se edita a mano.

## Trazabilidad y límites

FICHA-AVATAR: dolor 1 y deseos 1–3 → rutinas y acompañamiento sin certeza clínica; deseo 4 → la familia anota y lleva lo observado a consulta; objeción 6 → alcance real de datos locales y PIN. Voz cuidador sereno de FICHA-ARTE; mecanismo Antes/Durante/Después conservado.

El texto del recordatorio y el de instalación necesitan más palabras que un subtítulo promocional: se conserva la información necesaria para entender el cobro y el riesgo de pérdida. La nueva distribución de líneas y la encontrabilidad de los CTAs requieren medición a 375px por el principal. No se corrige aquí la asociación comidas→noche ni la conversión de rango de edad a edad exacta: no se inventa adaptación para encubrirlas.

## Comprobaciones

- `npm test`: 82/82 pasan, incluidos acceso, checkout mensual, copy, diario y guardado concurrente. Son pruebas locales, sin envío ni compra real. Aviso de Node sobre tipo de módulo heredado; no se modifica package.json.
- `node --check` de app.js, diario.js e historias.js: sin errores al comprobarlos.
- `npm run typecheck`: pasa (generación de tipos de rutas y TypeScript).
- `npm run lint`: 0 errores, 1 aviso heredado en `web/app/global-error.tsx:15` por navegación con window.location.assign. Se deja al principal; no se toca navegación en este encargo de copy.
- `npm run build`: NO pasa. Next se detuvo con EPERM al eliminar `.next/server/route-cache/APP_PAGE/…/index.segments`. Es un bloqueo de acceso a una carpeta generada, sin diagnóstico de error de código. No se borró la caché ni se interrumpieron procesos del principal. La configuración actual no tiene una opción ambiental para otra salida; no se cambia next.config.ts para este encargo. Pendiente repetir compilación integrada cuando se libere la carpeta.
- Capturas/revisor independiente: pendientes del principal. Pantallas: landing; onboarding reconocimiento/compromiso/carga/resultado; paywall resumen/prueba/precio; Inicio con instalación; Diario; Historias; Privacidad; Términos. En las secundarias aplica medición y checklist según la política del proyecto.

No se ejecutan envíos, cambios de servicios externos, despliegues ni commits.

## Precisiones finales solicitadas por el principal

- FAQ y las dos menciones de seguridad de Privacidad condicionan el cifrado a navegadores compatibles. Privacidad indica explícitamente que, sin disponibilidad criptográfica, el diario se guarda sin cifrar. No se modificó el fallback ni el código de guardado.
- Verificación local con los módulos reales cifrado.js/diario.js y Web Crypto de Node: sin disponibilidad se guarda `{plano:true}`; al abrir esos datos con compatibilidad se convierten a AES-GCM; PIN correcto vuelve a abrir; PIN incorrecto rechaza y cierra. Las cuatro comprobaciones pasan; no son una captura de navegador.
- Se comprobó `fechaCobro(hoy)` en web/lib/embudo/prueba.ts: calcula fecha local + 7 días. En el paywall se rotula «si empiezas hoy», «estimada» y «Hotmart confirma la fecha definitiva», tanto en la línea de tiempo como junto a la fecha de precio. No cambia el cálculo ni las fechas de /cuenta.
- Las respuestas del cuestionario se describen en Privacidad como recapitulación local de elecciones, sin promesa de adaptación por edad o crisis.
- docs/copy/landing.md y docs/copy/embudo.md alineados. En pruebas/embudo.test.mjs solo se actualiza el literal esperado del respaldo de precio a «Cobro estimado»; se conserva la prueba de espacios duros y el precio anterior aprobado.
- La evidencia anterior de 82 pruebas/TypeScript/lint corresponde al lote inicial. Para estas precisiones se repite únicamente la suite de embudo y se verifica el diff; no se toca la compilación/captura en curso del principal.
- Resultado final de la suite de embudo: 23/23 pasan. Textos estables para capturar FAQ, Privacidad y paywall prueba/precio; pendiente revisión visual del principal.
