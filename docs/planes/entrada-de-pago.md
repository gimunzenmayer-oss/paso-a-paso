# Plan: entrada de pago (onboarding → paywall → cuenta → acceso)

Aprobado por la dueña el 2026-10-21 ("Sí, constrúyela"). Sigue SECUENCIA-MAESTRA, 02B, 50, 18, 26 y 09.

## Decisiones
1. **Modelo 2A:** el onboarding vive en web/ y no pide cuenta antes de pagar (valor antes del registro).
2. **Las respuestas quedan en el teléfono:** `localStorage.pp_onboarding = {v:1, respuestas, plan, ts}`. No van al servidor ni en `sck`. Los eventos llevan solo el nombre y el número de paso.
3. **Preguntas:** nombre del peque (se puede saltar: "tu peque"), edad, momento más difícil del día (define la primera rutina) y qué pasa en una crisis. Después vienen la etiqueta de identidad, el compromiso ("Mañana probamos la rutina de {momento} con {nombre}"), la pantalla "armando el plan" y el resultado con su rutina real y "Hecho" en el paso 1.
4. **Foto y PIN** se piden dentro de la app, después de entrar.
5. **Unión con Hotmart por coincidencia de correo y código por correo:**
   - El webhook (sin cambios) crea o actualiza el perfil por correo.
   - Ella entra en `/entrar` con un código de 6 dígitos. El trigger existente une `profiles.user_id`.
   - Sin contraseñas y sin llave service-role.
6. **Acceso en la PWA:**
   - `GET /api/acceso` lee la sesión y llama a `mi_acceso()`.
   - La app guarda un "pase" local con 7 días de gracia sin internet.
   - Un error de red o un 5xx cuentan como sin conexión, no como acceso negado.
   - Solo un `acceso:false` explícito bloquea la app. Nunca se borran datos.
7. **Sin acceso, la guía "¿Momento difícil?" y el kit de calma siguen abiertos** (recomendado; la dueña confirma).
8. **Rutas:**
   - `/entrar` (y `/login` redirige ahí);
   - `/auth/callback`;
   - `/cuenta`, con enlace para gestionar o cancelar en Hotmart;
   - `/onboarding` y `/paywall`, en 3 pasos: resumen → línea de la prueba → precio.
9. **Simulación solo en desarrollo:** `ACCESO_SIMULADO` y `CODIGO_SIMULADO`, únicamente con `NODE_ENV=development`.
10. **Migración nueva:**
    - `private.tiene_acceso(profile)`: trialing, active, past_due, o cancelled con `access_until` futuro.
    - `public.mi_acceso()`: solo para `authenticated`.
    - `admin_cambiar_correo`: para "compré con otro correo".
    - Ampliar la lista de eventos permitidos.

## Pasos (cada uno se verifica antes del siguiente)
1. Textos en `docs/copy/embudo.md`. La dueña los aprueba.
2. Funciones puras con pruebas (`node --test`): URL del checkout, estado del onboarding y regla de acceso con días sin internet.
3. `/onboarding`: Playwright a 375px y revisor visual.
4. La app arranca con los datos del onboarding: nombre del peque, su rutina primero y PIN.
5. `/paywall`: botón deshabilitado y honesto mientras no haya links de Hotmart, más eventos. Revisor visual.
6. Migración en Supabase de producción (**se pide permiso antes de aplicarla**) y pruebas en transacción con rollback.
7. `/entrar`, `/auth/callback` y `/cuenta` con la simulación.
8. `/api/acceso` y bloqueo en la PWA: sin internet, vencido, y guía abierta.
9. De punta a punta en la vista previa de Vercel con una compra de prueba en Hotmart.
10. Cierre: inventario de rutas sin atajos, puertas de etapa en ESTADO.md y gate de seguridad.

## Solo la dueña puede hacer esto
- Repositorio en GitHub con la app de Claude, Vercel conectado y Vercel Pro antes de vender.
- En Hotmart:
  - producto de suscripción mensual US$7.99 y anual US$59.90, con 7 días de prueba y 30 días de garantía;
  - pasarnos los 2 links del checkout y el ID del producto;
  - página de gracias en `/entrar?compra=1`;
  - webhook en `/api/webhooks/hotmart` y el hottok en Vercel.
- En Supabase Auth: URL del sitio, redirecciones, plantilla de correo en español con enlace y código, y código válido 10 minutos.
- Conectar Resend (hoy salen unos 2 correos por hora, y eso bloquea el lanzamiento).
- Configurar las variables en Vercel.
- Aprobar cada etapa: Onboarding, Paywall y Login.
