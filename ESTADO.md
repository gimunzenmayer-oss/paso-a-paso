# ESTADO — Paso a Paso
Última actualización: 2026-10-20 | Sesión actual: 1 (Flujo C: mejorar app existente)

⏸️ CHECKPOINT — Última acción completada: SO v6.10.0 instalado, usuaria eligió opción 3 / Siguiente acción exacta: C1 (qué le molesta más) + C2 investigación de mercado

## Qué es esta app (3 líneas máximo)
PWA para madres/padres de niños autistas de 2 a 12 años (ejemplo: Mateo, 6). Dos zonas: "Espacio de Mateo" (niño, bloqueado con PIN) y zona de la familia (agenda visual, tablero de comunicación, temporizador, kit de calma con música, historias sociales, diario de crisis cifrado, logros, informe para profesionales, guía).
Monetización: pendiente (decidir en esta sesión con datos del SO).

## Promesa central (borrador, del doc de propuesta de valor)
"Ayudo a madres de niños autistas de 2 a 12 años a tener días predecibles y a saber exactamente qué hacer cuando llega una crisis, sin plastificar pictogramas, sin saltar entre cinco apps y sin que sus datos salgan del teléfono."
Doc: https://claude.ai/code/artifact/634d2a58-d9bd-4cdf-8442-351f09361e90

## Secuencia maestra de construcción (NO saltar)
- Estado real: se construyó primero la APP INTERNA (antes de instalar el SO). Falta: landing, onboarding, paywall, login/auth, servicios externos, backoffice.
- Landing: pendiente · Onboarding: pendiente · Paywall: pendiente · Login/Auth: pendiente
- App interna: construida (prototipo, sin auditar contra el SO)
- Servicios externos: bloqueados

## Decisiones técnicas
- Stack actual: HTML + JS sin framework, sin paso de build, PWA con service worker (sw.js v7), datos en IndexedDB del teléfono (local-first).
- PIN: huella PBKDF2 150k; diario cifrado AES-GCM con sal propia.
- Fotos: Unsplash (créditos en Ajustes). ARASAAC NO se usa (licencia no comercial); fuente de pictos intercambiable.
- Música de calma generada en la app (Web Audio), sin archivos ni apps externas.
- Vista previa: herramientas/vista_previa.py → artifact https://claude.ai/artifact/GQnQhrHp7UH3HLRSDaztDE

## 🔒 Gate de seguridad (antes de declarar lista para vender)
- [ ] Ninguna clave secreta viaja al navegador
- [ ] Un usuario no puede ver datos de otro (prueba cruzada con 2 cuentas)
- [ ] Login con límite de intentos fallidos
- [ ] Aviso de pago verificado como venido de la pasarela
- [ ] Política de privacidad: qué datos se recogen y a quién se envían

## Pendientes heredados
- Más secciones de la Guía para Familias; modo "frase" del tablero (ofrecido, sin respuesta).
