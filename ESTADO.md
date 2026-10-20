# ESTADO — Paso a Paso
Última actualización: 2026-10-20 | Sesión actual: 1 (Flujo C: mejorar app existente)

⏸️ CHECKPOINT — Última acción completada: página de ventas construida + legales + auditoría / Siguiente acción exacta: aplicar revisión del revisor-visual → publicar vista previa → pedir datos de la responsable

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
