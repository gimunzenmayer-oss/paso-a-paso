# ESTADO — Paso a Paso
Última actualización: 2026-10-21 | Sesión actual: 1 (Flujo C: mejorar app existente) | Panel de administración construido, en revisión visual

⏸️ CHECKPOINT — Última acción completada: auditoría senior, capa 4 (animaciones) aplicada y verificada / Siguiente acción exacta: capa 5 (retención: texto de la garantía, plan de recordatorios y correos; confirmar alcance del onboarding/paywall con la usuaria). Reporte completo: /mnt/project-files/auditoria-paso-a-paso/REPORTE-AUDITORIA.md

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

## Estrategia de monetización (propuesta 2026-10-20, esperando OK de la usuaria)
- Modelo: Onboarding + paywall de prueba (Modelo 2 del 02C, tipo B bienestar). Vista previa sin cuenta → paywall → cuenta.
- Trial: 7 días gratis (el valor se siente en la primera rutina; patrón Headspace 7 días mensual)
- Precio: $7.99/mes · anual $59.90 mostrado como $4.99/mes ("ahorras 5 meses"). Bajo la mediana inglesa (~$9.99), por encima del pago único de Hotmart porque es app viva y no PDF. Sin costo de IA → margen alto.
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

## Decisiones técnicas
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
- ⚠️ Hotmart: configurar garantía de 30 días (debe superar la prueba de 7). La página promete 30.
- /onboarding redirige por ahora a la app de ejemplo (/app). Se reemplaza en la etapa de Onboarding.
- Sin testimonios (regla día 1): se agregan con ≥3 reales.
- Pulido menor del revisor (N1–N8, no bloquea): carrusel a 1440, puntos del footer, captura del hero 6+1, ceros con barra en precios chicos, pasos del método a 1 línea, 1ª línea del stack, barra fija sobre el CTA del carrusel. Ver docs/revisiones/landing-veredicto.md.
- audit-conversion: falsos positivos documentados (lee comentarios y clases como copy, "animate" como voseo, no ve hairline/mesh en estilos en línea del kit). Real corregido: PS de 35 → 29 palabras.

## Pendientes heredados
- Más secciones de la Guía para Familias; modo "frase" del tablero (ofrecido, sin respuesta).

## Publicación (2026-10-20)
- Pre-vuelo: tsc limpio · build OK (6 páginas estáticas) · npm audit 0 vulnerabilidades · .env* en .gitignore · sin claves en el código ni variables NEXT_PUBLIC_. La app hoy no tiene servidor ni base de datos: no hay RLS ni IDOR que revisar todavía.
- Cuentas: GitHub gimunzenmayer-oss (sin repos) · Vercel plan Hobby (gratis, sin proyectos) · Supabase sin proyectos.
- Bloqueo: este espacio no puede crear repos en GitHub por su cuenta → la dueña crea el repo privado vacío "paso-a-paso"; después se sube el código y se conecta a Vercel.
- Supabase: no se crea aún. No hay login ni pagos construidos (onboarding → paywall → login van antes). Se crea en la etapa de Login.
- ⚠️ Vercel Hobby no permite uso comercial: pasar a Pro (US$20/mes) antes de la primera venta.
- La primera publicación es la página de ventas + app de ejemplo. Aún NO cobra: falta onboarding, paywall, login, webhook de Hotmart y correos (Resend). Gate de seguridad pendiente.

## Publicación — intento 2 (2026-10-21)
- Pre-vuelo OK: tsc limpio · next build OK (16 rutas) · npm audit 0 · sin secretos en código · solo NEXT_PUBLIC_ públicos (URL y publishable de Supabase).
- Supabase uvubnzymrkqirdvneeds: 13 migraciones aplicadas · RLS en todas las tablas public · advisors: sin ERROR; WARN de funciones SECURITY DEFINER es intencional (ingesta exige llave, admin exige private.assert_admin) · performance solo INFO (índices sin uso, aún no hay datos).
- Código guardado localmente con commit "feat: MVP inicial" (f0cdf75) en main. Aún sin remoto.
- Bloqueos (dueña): repo privado vacío gimunzenmayer-oss/paso-a-paso no existe · app de Claude en GitHub sin instalar · Vercel sin conexión con GitHub (git_namespaces vacío).
- Plan al desbloquear: push → proyecto Vercel con raíz web/ (Next.js) → variables (URL y publishable de Supabase, INGEST_KEY nueva rotada en private.app_secrets, HOTMART_HOTTOK cuando llegue) → desplegar → revisar consola → URL del sitio y /admin/auth/callback en Supabase Auth (paso de la dueña).

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
- Garantía: la landing promete 30 días. Se mantiene el texto; la dueña debe configurar 30 días de garantía en Hotmart antes de vender.
- Entrada de pago (onboarding → paywall → cuenta → acceso por Hotmart): se le preguntó a la usuaria si se construye ahora.
- Funciones nuevas para decidir: notificaciones push; tarjeta «¿Cómo fue esta semana?» tras 7 días sin anotar.
