# VEREDICTO revisor-visual — admin-verificar (Panel · paso "Tu código", cuenta ya configurada + primera vez con QR) — Ronda 5
Fecha: 2026-10-21 18:00
Screenshot: docs/revisiones/admin-verificar-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) primera vez: la tarjeta junta 6 piezas, entre ellas dos plegables, y uno es "¿Perdiste el teléfono o la app?", que no tiene sentido cuando todavía no configuró nada · (2) primera vez en el computador: el botón "Agregar a Google Authenticator" se ve, pero en el computador no hace nada · (3) primera vez: el error de código dice "escanea este", aunque en el teléfono no se puede escanear la propia pantalla · (4) los dos plegables de la misma tarjeta se ven distintos (uno con el título en gris y otro en negro) · (5) cada vez que la página se recarga se crea una conexión nueva y la que ya agregó deja de servir; además, no avisa cuántos intentos quedan antes del bloqueo de 15 minutos

## Detalle

```
VEREDICTO: NO LISTA
USABILIDAD: 34/40  (detalle: h1:3 h2:3 h3:4 h4:3 h5:3 h6:4 h7:4 h8:3 h9:3 h10:4)
CRAFT:      16/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3)
COPY:       N/A (no vende)
FIDELIDAD:  N/A (sin referencia)
```

Gate doble: 34/40 (<36, no pasa) y 16/20 (pasa) → NO LISTA. Usabilidad y craft quedan igual que en la ronda 4 (34 y 16), pero cambia de dónde vienen los puntos. h10 sube a 4 porque ya existe la salida en el mismo teléfono. h9 baja a 3: ahora que hay captura de la primera vez se ve que el error de esa variante no considera ese caso.
Capturas puntuadas: `admin-verificar-375.png` (cuenta ya configurada), `admin-verificar-primera-375.png` (primera vez, 375 × 1365px; el QR es un dibujo de muestra del entorno de prueba y no se puntúa como QR) y `admin-verificar-1280.png` (configurada en escritorio, sin problemas). No hay captura a 1280 de la primera vez, y ahí aparece el defecto 2, que se evaluó por código.

### Gate de carga cognitiva
```
[x] Grupos/listas ≤4-5 ítems (3 pasos de instalación; 2 formas de recuperar)
[x] Decisiones ≤4 opciones
[x] UNA acción primaria ("Entrar al panel", salvia; "Agregar a Google Authenticator" va en tono suave)
[x] No hay que recordar nada (nombra la app, la entrada "Panel Paso a Paso" y el rótulo exacto de la app, «Ingresar una clave de configuración»)
[x] ≤5-7 campos (1)
[~] Texto por bloque en 3-4 líneas: el paso 3 ocupa 4 líneas a 375px, justo en el límite. La lista completa ocupa unas 8 líneas antes de la tarjeta.
[x] El "qué sigue" es obvio (la tira muestra el paso 1 hecho y el 2 en curso)
[ ] Cero elementos que parezcan interactivos y no hagan nada: en el computador, "Agregar a Google Authenticator" (page.tsx:103-108) abre un enlace `otpauth://` que el navegador no sabe abrir. No pasa nada al tocarlo, o aparece un error del navegador.
→ 1 falla (en escritorio, primera vez) y 1 al límite. No hay sobrecarga crítica.
```

### CTA héroe vivo
```
[x] Contraste ≥3:1: #FBFCF9 sobre #4A765F ≈ 5,2:1
[x] Hover/tap definido: hover:brightness-110 + active:scale-[0.98]
[x] No disabled por defecto (solo mientras está pendiente)
[x] ≥48px (min-h-12), ancho completo, 18px
```
En primera vez, el CTA queda a unos 1000px de la parte superior de la página, fuera de la primera vista a 375px. Se acepta porque el orden es secuencial: primero se agrega la cuenta y después se escribe el código.

### Estado de los defectos de la ronda 4
| # | Defecto R4 | Estado | Evidencia |
|---|---|---|---|
| 1 | En el teléfono no se puede escanear la propia pantalla, y la salida es tipear una clave larga | RESUELTO (con un efecto nuevo en escritorio) | `enlaceApp = data.totp.uri` (page.tsx:64) y el botón `<a href={enlaceApp}>` "Agregar a Google Authenticator" (page.tsx:103-108, min-h-12, ancho completo, tono suave) se ven bajo el QR en la captura. El paso 3 dice "Si estás en este mismo teléfono, toca «Agregar a Google Authenticator»" (page.tsx:89). La clave está en el plegable "¿No funciona? Ingresa una clave de configuración", con el rótulo exacto de la app y el botón "Copiar clave", que responde con "Clave copiada" y `aria-live` (interacciones.tsx:205-225). El efecto nuevo: el botón también se muestra en el computador, donde no hace nada (TOP 2). |
| 2 | El plegable de la clave no parece tocable | RESUELTO (queda una diferencia) | Ahora usa `Plegable` (ui.tsx:123-150), con chevron, negrita y `active:opacity-70`. En la captura se ve tocable. Pero el `Plegable` pone el título en `--text-secondary` y el de "¿Perdiste…?" (page.tsx:130) lo pone en el color principal. En la misma tarjeta se ve un título gris y uno negro (TOP 4). |
| 3 | "Borra el factor" es jerga | RESUELTO | page.tsx:145: "busca la parte de MFA (la verificación en dos pasos) y borra «Panel Paso a Paso»". Queda la palabra "MFA", pero explicada, y es el rótulo que ella va a ver en la página en inglés. |
| 4 | La tarjeta deja más aire abajo que arriba | RESUELTO | `-mb-2` en el `<details>` (page.tsx:129). En la captura de la cuenta configurada hay unos 26px del borde a la etiqueta y unos 27px del texto "¿Perdiste…?" al borde. |
| 5 | No avisa cuántos intentos quedan antes del bloqueo | NO RESUELTO | `acciones.ts:63-64` sigue redirigiendo a `?error=codigo` sin el conteo, y `ERRORES.codigo` (page.tsx:15) no menciona el límite. La otra parte de este punto, la captura de la primera vez, sí está hecha (`admin-verificar-primera-375.png`). |

### Verificaciones en código
- h1: `BotonEnviar` en estado pendiente ("Revisando el código…"), también con el envío automático. "Copiar clave" confirma con "Clave copiada". Los errores llegan con `role="alert"`. El salto al panel es una recarga completa, aunque el panel lo compensa con el aviso "Entraste". "Agregar a Google Authenticator" no confirma nada al volver a la página, pero el paso 3 ya dice qué hacer después.
- h2: la pantalla principal no tiene jerga. En la recuperación quedan "Supabase" y "MFA", las dos explicadas y dentro de un plegable, con la ruta fácil ("escríbele a Claude") al lado.
- h3: "Usar otro correo" → `salir()`, más "Volver a la página de Paso a Paso". Si falla la preparación aparece "Volver a empezar" (page.tsx:43-56). La recuperación tiene dos rutas. No hay acciones destructivas.
- h4: tira, botón, radios y plegable principal iguales al resto del panel. En primera vez hay dos diferencias: los títulos de los dos plegables de la tarjeta tienen distinto color, y el botón "Agregar…" es un `<a>` hecho a mano con `ring-1` (page.tsx:105), mientras que `BotonEnviar tono="suave"` no lleva anillo (formularios.tsx:11).
- h5: `required`, `pattern`, `maxLength`, envío automático solo con 6 dígitos válidos, formato revisado en el servidor y bloqueo tras 5 fallos. Lo que falta: (a) no se muestran los intentos restantes. (b) En page.tsx:35-42, cada vez que la página se dibuja sin una conexión verificada, se borran las conexiones a medias y se crea una nueva con otra clave. En el teléfono, al ir a Google Authenticator y volver, el navegador puede recargar la pestaña. Si pasa, la cuenta que acaba de agregar ya no sirve, el código falla, y recién entonces lo explica el error.
- h6: nombra la app, la entrada exacta y el rótulo literal de la opción en la app.
- h7: `autoFocus`, `inputMode="numeric"`, `autoComplete="one-time-code"`, tolera espacios y se envía solo (interacciones.tsx). El enlace `otpauth://` y "Copiar clave" son atajos reales.
- h8: la cuenta configurada está limpia. En primera vez, la tarjeta tiene QR, "Agregar…", plegable de clave, campo, CTA y plegable "¿Perdiste el teléfono o la app?". Este último sobra en la primera vez, porque todavía no hay nada que perder.
- h9: `codigo`, `formato` y `bloqueado` dicen qué pasó y qué hacer. El error de primera vez (page.tsx:70) dice "En Google Authenticator borra «Panel Paso a Paso» y escanea este". En el teléfono no puede escanear, y el mensaje no le dice que toque «Agregar a Google Authenticator».
- h10: la primera vez ya cubre las dos situaciones (computador: escanear; teléfono: tocar el botón; si falla: clave con el rótulo exacto + copiar). La recuperación es concreta. → 4.
- Eje 4 (uno por uno): entrada escalonada 60ms ✓ · tira que se llena y dibuja el check del paso 1 ✓ · tap 0.98 (CTA, "Agregar…", "Copiar clave") ✓ · spinner ✓ · plegables de 220ms con chevron que gira ✓ · celebración en el hito (aviso "Entraste" con sello vivo en el panel) ✓ · reduced-motion completo (panel.css:148-170) ✓ · conteo, barras y modales no aplican. → 4.
- Eje 3: tira de pasos con check salvia, Lexend + Atkinson, sin coincidir con las paletas vetadas. Hay identidad, pero no es inconfundible. → 3.
- Eje 2: el fondo, la tarjeta elevada y el campo hundido se ven. El QR va sobre una placa blanca con radio 14 dentro de la tarjeta. → 3.
- Eje 5: radios 14/18 parejos y aire de la tarjeta igualado. QR y botón están centrados. Queda la diferencia de color entre los dos plegables y el `ring` del botón "Agregar…", que no existe en ningún otro botón suave. → 3.

### TOP DEFECTOS (lo que bloquea, por gravedad)
1. [Primera vez: tarjeta con 6 piezas y dos plegables] (MEDIA, h8) "¿Perdiste el teléfono o la app?" no aplica la primera vez → en `verificar/page.tsx:129-148` mostrar el `<details>` solo cuando `!primeraVez`. La tarjeta queda con QR → Agregar → clave → código → Entrar.
2. [Primera vez en computador: "Agregar a Google Authenticator"] (MEDIA, gate 8/h5) Un botón que en el computador no hace nada → en `verificar/page.tsx:105` agregar `hidden [@media(pointer:coarse)]:inline-flex` (que solo se vea en pantallas táctiles). El paso 3 (page.tsx:89) ya habla del "mismo teléfono", así que en el computador no queda ninguna referencia suelta.
3. [Error de código en primera vez] (BAJA, h9) Pide escanear aunque ella puede estar en el teléfono → en `verificar/page.tsx:70`: "Ese código no coincidió, así que preparamos uno nuevo. En Google Authenticator borra «Panel Paso a Paso» y vuelve a agregarlo: escanea este cuadro o, si estás en el teléfono, toca «Agregar a Google Authenticator»."
4. [Primera vez: dos plegables con distinto color] (BAJA, h4) "¿No funciona?…" en gris y "¿Perdiste…?" en negro → usar `Plegable` también en `page.tsx:129-133` (o quitar `text-[var(--text-secondary)]` del `summary` en `ui.tsx:142` cuando no es `caja`). En `page.tsx:105`, quitar `ring-1 ring-[var(--field-border)]` para que el botón coincida con `tono="suave"`.
5. [Primera vez: conexión que se vuelve a crear al recargar + intentos sin aviso] (MEDIA, h5) Si el navegador recarga la pestaña al volver de la app, la cuenta recién agregada deja de servir → en `verificar/page.tsx:35-42`, si ya hay una conexión a medias de menos de 10 minutos, reutilizarla en vez de borrarla (guardar `uri`, `secret` y el QR en una cookie httpOnly de corta duración ligada a `factorId`), y crear una nueva solo después de un código fallido. Además, que `admin_mfa_registrar` devuelva los intentos restantes y que `acciones.ts:64` pase `&quedan=N`, para mostrar "Te quedan 2 intentos antes de una pausa de 15 minutos" cuando queden 2 o menos.
