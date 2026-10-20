# ESTADO — Paso a Paso
Última actualización: 2026-10-20 | Sesión actual: 1 (Flujo C: mejorar app existente)

⏸️ CHECKPOINT — Última acción completada: investigación de mercado + FICHA-MERCADO + propuesta de precio / Siguiente acción exacta: OK de precio → FICHA-AVATAR y FICHA-MODELO → página de ventas

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
- Cuenta: solo para saber quién pagó; los datos de Mateo siguen en el teléfono (la promesa de privacidad se mantiene).
- Vista previa: herramientas/vista_previa.py → artifact https://claude.ai/artifact/GQnQhrHp7UH3HLRSDaztDE

## 🔒 Gate de seguridad (antes de declarar lista para vender)
- [ ] Ninguna clave secreta viaja al navegador
- [ ] Un usuario no puede ver datos de otro (prueba cruzada con 2 cuentas)
- [ ] Login con límite de intentos fallidos
- [ ] Aviso de pago verificado como venido de la pasarela
- [ ] Política de privacidad: qué datos se recogen y a quién se envían

## Pendientes heredados
- Más secciones de la Guía para Familias; modo "frase" del tablero (ofrecido, sin respuesta).
