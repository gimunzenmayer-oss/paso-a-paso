# Copy del embudo de pago — Paso a Paso
Fecha: 2026-10-21 · Estado: en uso, pendiente de aprobación final de la dueña en la puerta de etapa (paso 1 de `docs/planes/entrada-de-pago.md`).
Fuentes: plan aprobado, FICHA-AVATAR, FICHA-MODELO, ESTADO (precios), `docs/copy/landing.md` (voz aprobada), reglas 02B, 50, 52 y 42.
Voz: español latino neutro, tuteo, cálido, sin culpa, sin "berrinche", sin "trastorno", sin "normal". Cero emojis en la interfaz.

## Convenciones
- `[acento]…[/acento]` = palabra en color de acento · `[b]…[/b]` = semibold.
- Variables:
  - `{nombre}`: nombre del peque. Si lo salta, "tu peque". Se muestra con la inicial en mayúscula y nunca se recorta con "…".
  - `{momento}`: sale de la pregunta 3 (tabla abajo).
  - `{fecha_cobro}`: día 7 de la prueba, en formato humano ("28 de octubre").
  - `{correo}`: el correo que escribió.
- Variables extra (necesarias, con el mismo estilo):
  - `{crisis}`: texto corto de la pregunta 4.
  - `{n_pasos}`: pasos de su rutina.
  - `{N}`: preguntas respondidas.
  - `{fecha_fin}`: hasta cuándo dura el acceso.
  - `{s}`: segundos.
  - `{min}`: minutos.
  - `{dias}`: días sin conexión.
- Concordancia con "tu peque": "el plan de tu peque", "con tu peque". Nunca "el plan de Tu peque".

---

## 1. Onboarding (`/onboarding`)

Hay 6 pasos con barra (4 preguntas, el reconocimiento y el compromiso). Después vienen la pantalla "armando el plan" y el resultado.
La barra empieza en 10 % y nunca retrocede: 10 · 25 · 40 · 55 · 70 · 85 · 100 (al cargar).

### Elementos comunes
| Elemento | Texto |
|---|---|
| Atrás (aria-label) | Volver a la pregunta anterior |
| Barra (aria-label) | Paso {n} de 6 |
| Cerrar (aria-label, esquina) | Salir y volver al inicio |
| Logo (aria-label) | Paso a Paso, ir al inicio |

### 1.1 Nombre del peque (se puede saltar)
- Título: ¿Cómo se llama [acento]tu peque[/acento]?
- Ayuda: Solo lo ves tú: se queda en este teléfono.
- Campo (label oculta): Nombre o apodo
- Placeholder: Ej. Mateo
- Botón: Seguir
- Saltar: Prefiero no decirlo
- Error, el campo está vacío y toca Seguir: Escribe su nombre o toca "Prefiero no decirlo".
- Error, más de 20 letras: Usa un nombre o apodo de hasta 20 letras.

### 1.2 Edad
- Título: ¿Cuántos años tiene [acento]{nombre}[/acento]?
- Ayuda: (ninguna; la edad todavía no cambia el plan, así que no prometemos ejemplos por edad)
- Opciones (selección única, avanza sola):
  - 2 a 4 años
  - 5 a 7 años
  - 8 a 12 años

### 1.3 Momento más difícil (define la primera rutina)
- Título: ¿Qué momento del día [acento]cuesta más[/acento]?
- Ayuda: Por ahí empieza su primera rutina.
- Opciones (selección única, avanza sola):

| Opción (label) | Subtexto | Rutina en `app/js/datos.js` | `{momento}` | `{n_pasos}` |
|---|---|---|---|---|
| La mañana | Despertar, vestirse y salir de casa | `manana` · "Mañana" | la mañana | 7 |
| Las comidas | Sentarse a la mesa y probar | `noche` · "Noche" (empieza con "Cenar") | la cena | 6 |
| Volver de la escuela | El cambio de la escuela a la casa | `tarde` · "Volver de la escuela" | volver de la escuela | 5 |
| Irse a dormir | Baño, pijama y apagar la luz | `noche` · "Noche" | la noche | 6 |

> Hoy no existe una rutina de comidas. "Las comidas" abre la rutina "Noche", que empieza en "Cenar". Ver la pregunta abierta 1.

### 1.4 Qué pasa en una crisis
- Título: Cuando {nombre} se desborda, ¿[acento]qué pasa[/acento]?
- Ayuda: Elige las que pasen. No hay respuestas malas.
- Opciones (varias; el botón se activa con 1):

| Opción (label) | `{crisis}` (texto corto) |
|---|---|
| Llora o grita fuerte | llora o grita |
| Se tira al piso | se tira al piso |
| Se tapa los oídos o se esconde | necesita esconderse |
| Se golpea o golpea cosas | se golpea o golpea cosas |
| Se queda callado y se cierra | se cierra |
| Cambia cada vez | se desborda |

- Botón: Seguir
- Saltar: Prefiero saltar esta (`{crisis}` = "se desborda")
- Si elige varias, `{crisis}` usa la primera.

### 1.5 Reconocimiento con etiqueta de identidad
Lleva una ilustración propia, sin opciones y con un solo botón.
- Título: Ya eres quien [acento]mejor conoce[/acento] a {nombre}
- Texto: En un minuto nombraste su momento difícil y qué pasa cuando {crisis}. Eso es [b]observar[/b], y es la base del [b]Método Antes, Durante y Después[/b].
- Texto 2 (quita la culpa): No es falta de paciencia. Es que {nombre} no sabe qué viene, y tú no tenías a mano qué hacer.
- Botón: Seguir

### 1.6 Compromiso
- Título: Mañana probamos la rutina de [acento]{momento}[/acento] con {nombre}
- Ayuda: Una sola rutina, un día. Con eso basta para empezar.
- Botón principal: Sí, mañana la probamos
- Enlace secundario: Cambiar el momento (vuelve a 1.3)
- Si `{momento}` es "la mañana", el título cambia a: Mañana temprano probamos su rutina de la mañana con {nombre}

### 1.7 Cargando: armando el plan
Dura de 4 a 6 segundos. Cada línea recibe su check, una tras otra.
- Título: Armando el plan de [acento]{nombre}[/acento]…
- Línea 1: Rutina de {momento}: {n_pasos} pasos con fotos
- Línea 2: Kit de calma para cuando {crisis}
- Línea 3: Guía "¿Momento difícil?" a un toque
- Línea 4: Diario para contarle a su terapeuta
- Al terminar (aria-live): El plan de {nombre} está listo.
- Con "reducir movimiento": las 4 líneas aparecen ya marcadas y el texto es el mismo.

### 1.8 Resultado: su rutina real con "¡Hecho!"
- Título: La rutina de [acento]{momento}[/acento] de {nombre}
- Ayuda: Toca "¡Hecho!" en el primer paso, como lo hará mañana.
- Lista: los pasos reales de la rutina elegida en `datos.js` (texto y foto). Solo el paso 1 tiene botón.
- Botón del paso 1: ¡Hecho!
- Botón del paso 1 (aria-label): Marcar "{paso_1}" como hecho
- Después de tocar:
  - texto: Así se ve cada paso cumplido. Sin imprimir nada.
  - progreso: 1 de {n_pasos}
- CTA (se ve de inmediato y se resalta después del toque): Seguir con el plan de {nombre}
- Enlace: Primero quiero ver la app de ejemplo (→ `/app`)

---

## 2. Paywall en 3 páginas (`/paywall`)

Elementos comunes a las 3 páginas:
- Cerrar (✕, aria-label): Cerrar y volver al plan
- Indicador (aria-label): Página {n} de 3

### 2.1 Página 1: resumen
- Título: El plan de {nombre} para [acento]{momento}[/acento] está listo
- Subtítulo: Hecho con tus {N} respuestas, con el [b]Método Antes, Durante y Después[/b].
- 3 puntos (con sus respuestas):
  1. **Antes**: su rutina de {momento}, paso a paso y con fotos
  2. **Durante**: kit de calma para cuando {crisis}
  3. **Después**: su semana anotada, lista para la terapeuta
- Línea de pérdida honesta: Tu plan ya está en este teléfono. Falta activarlo.
- Botón: Ver cómo funciona la prueba
- Salida: Ahora no

### 2.2 Página 2: la prueba, día por día
- Título: [acento]7 días[/acento] para probarlo sin pagar
- Línea de tiempo:
  - **Hoy**: Acceso completo · Su rutina, el kit de calma y la guía
  - **Día 5**: Te avisamos por correo · 2 días antes de cualquier cobro
  - **Día 7 · {fecha_cobro}**: Empieza el cobro · Solo si sigues. Cancela antes y no pagas nada
- Debajo: Y después, 30 días de la [b]Garantía del Día Tranquilo[/b].
- Botón: Ver precios
- Salida: Ahora no

### 2.3 Página 3: precio
- Título: Días más [acento]predecibles[/acento] para {nombre}, desde hoy
- Subtítulo: Empiezas gratis. Eliges cómo seguir después.
- Tarjeta Anual (recomendada y marcada de inicio):
  - etiqueta: Mejor precio
  - nombre: Anual
  - precio grande: US$4.99/mes
  - detalle: Se cobra US$59.90 al año · ahorras 4 meses
  - nota: Menos de US$0.17 al día
- Tarjeta Mensual:
  - nombre: Mensual
  - precio grande: US$7.99/mes
  - detalle: Se cobra cada mes · cancelas cuando quieras
- Ayuda sobre el botón: En Hotmart, completa tus datos y elige "Quiero un periodo gratis".
- Botón: Ir a Hotmart y activar mi prueba
- Botón, mientras abre: Abriendo Hotmart…
- 3 líneas de confianza bajo el botón, con check:
  1. Hoy no pagas nada · primer cobro el {fecha_cobro}
  2. Cancelas en Hotmart cuando quieras
  3. 30 días de Garantía del Día Tranquilo
- Fila final: Pago seguro con Hotmart · tarjeta o medios locales
- Enlaces:
  - Ahora no
  - ¿Ya pagaste? Entra aquí (→ `/entrar`)
- Error, Hotmart no abrió: No se abrió Hotmart. Toca el botón otra vez o revisa si tu navegador bloqueó la ventana.

#### Estado honesto: el checkout todavía no está configurado
Se usa mientras no existan los links de Hotmart.
- Botón deshabilitado: Pagos disponibles muy pronto
- Nota bajo el botón: Todavía no abrimos los pagos. Nada se cobra desde aquí.
- Enlace: Mientras, mira la app de ejemplo (→ `/app`)
- Contacto: ¿Quieres que te avisemos? Escríbenos a hadaapps@gmail.com
- Las 3 líneas de confianza se ocultan en este estado: hoy no hay prueba que activar.

#### "¿Seguro?" al salir: no existe
"Ahora no" vuelve al resultado sin ventanas ni frases de culpa.

---

## 3. Entrar (`/entrar`)

### 3.1 Paso correo
- Logo (aria-label): Paso a Paso, ir al inicio
- Título: Entra a [acento]Paso a Paso[/acento]
- Ayuda: Te mandamos un código de 6 dígitos. Sin contraseñas.
- Label: Tu correo
- Placeholder: ej. ana@gmail.com
- Botón: Enviarme el código
- Botón, mientras envía: Enviando…
- Error de formato: Revisa tu correo: parece que le falta algo (ej. ana@gmail.com).
- Error de red: No pudimos enviar el código. Revisa tu internet y toca "Enviarme el código" otra vez.
- Error, pidió demasiados códigos: Ya te mandamos varios códigos. Espera unos minutos y revisa tu correo.

#### Variante `?compra=1` (llega desde Hotmart)
- Título: Ya casi. [acento]Entra con el correo de tu compra[/acento]
- Ayuda: Usa el mismo correo que pusiste en Hotmart. Ahí llega tu código.
- El resto es igual.

### 3.2 Paso código
El mensaje es el mismo exista o no el correo, para no revelar quién tiene cuenta.
- Título: Revisa tu correo
- Texto: Si {correo} tiene acceso, te llega un código de 6 dígitos. Vence en 10 minutos.
- Ayuda: ¿No lo ves? Busca también en Spam y Promociones.
- Label: Código de 6 dígitos
- Campo (aria-label): Código de 6 dígitos que te llegó por correo
- Botón: Entrar
- Botón, mientras revisa: Revisando…
- Reenviar, con cuenta regresiva: Reenviar código en {s} s
- Reenviar, ya disponible: Reenviar código
- Aviso al reenviar (aria-live): Te mandamos otro código. Usa el más nuevo.
- Enlace: Usar otro correo

#### Errores del código
| Caso | Texto |
|---|---|
| Código incorrecto | Ese código no coincide. Revísalo o pide uno nuevo. |
| Código vencido | Este código ya venció: dura 10 minutos. Pide uno nuevo. |
| Muchos intentos | Hiciste muchos intentos seguidos. Espera {min} minutos y vuelve a intentar. |
| Faltan dígitos | Escribe los 6 dígitos del código. |
| Sin internet | No pudimos revisar el código. Revisa tu internet y toca Entrar otra vez. |

### 3.3 Después de entrar
Estos mensajes salen solo después de que la persona demostró que el correo es suyo.
- Con acceso, entra a la app. Aviso: Listo, ya entraste.
- Todavía sin acceso (por ejemplo, llegó desde `?compra=1` y Hotmart aún no avisa):
  - título: Tu compra está en camino
  - texto: A veces Hotmart tarda unos minutos en avisarnos. Toca "Revisar de nuevo" en un momento.
  - botón: Revisar de nuevo
  - botón, mientras revisa: Revisando…
- Sin compra con ese correo:
  - título: No vemos una compra con {correo}
  - texto: Quizás compraste con otro correo. Revisa el recibo de Hotmart.
  - botones: Entrar con otro correo · Ver planes (→ `/paywall`)
- No se pudo verificar (red o error del servidor). Nunca se dice "no compraste":
  - texto: No pudimos revisar tu acceso ahora. Toca Reintentar.
  - botón: Reintentar

### 3.4 Rescate (siempre visible abajo, plegable)
- Título: ¿Compraste y no te llega el acceso?
- 1. Busca el código en Spam y Promociones.
- 2. Usa el correo exacto de tu compra (está en el recibo de Hotmart).
- 3. Si compraste con otro correo o nada funciona, escríbenos a **hadaapps@gmail.com** con el correo de tu compra. Lo resolvemos contigo.
- Enlace (aria-label): Escribir a soporte, hadaapps@gmail.com

---

## 4. Tu cuenta (`/cuenta`)
- Título: Tu cuenta
- Línea: Entraste con {correo}
- Etiqueta del bloque: Tu acceso

| Estado | Etiqueta | Detalle |
|---|---|---|
| `trialing` | Prueba gratis activa | Primer cobro el {fecha_cobro}. Si cancelas antes, no pagas nada. |
| `active` | Suscripción activa | Próximo cobro el {fecha_cobro}. |
| `past_due` | Hay un problema con el pago | Tu acceso sigue abierto. Revisa tu tarjeta en Hotmart para no perderlo. |
| `cancelled` (con días restantes) | Cancelada | Tienes acceso hasta el {fecha_fin}. Si cambias de idea, vuelve a activarla. |
| `cancelled` (vencida) | Terminada | Tu acceso terminó el {fecha_fin}. Tus datos siguen en este teléfono. |
| `refunded` | Reembolsada | Te devolvimos el pago. Tus datos siguen en este teléfono. |
| No se pudo verificar | Sin verificar | No pudimos revisar tu acceso ahora. Toca Reintentar. |
| Sin compra | Sin compra con este correo | ¿Compraste con otro correo? Escríbenos a hadaapps@gmail.com. |

- Botón: Gestionar o cancelar en Hotmart
- Ayuda: Se abre Hotmart. Ahí cambias tu tarjeta o cancelas.
- Botón (estados terminada, reembolsada o sin compra): Volver a activar (→ `/paywall`)
- Enlace: Volver a la app
- Botón: Cerrar sesión
- Confirmación:
  - título: ¿Cerrar sesión en este teléfono?
  - texto: Tus rutinas y tu diario se quedan aquí.
  - botones: Sí, cerrar sesión · Quedarme
- Aviso después: Cerraste sesión.

---

## 5. App (PWA): bloqueo y modo sin internet

### 5.1 Pantalla de bloqueo
Sale solo con `acceso:false` explícito.
- Título: Tu acceso está en pausa
- Texto: No borramos nada. Las rutinas, las fotos y el diario de {nombre} siguen en este teléfono.
- Bloque destacado:
  - título: Esto sigue abierto, siempre
  - texto: La guía "¿Momento difícil?" y el kit de calma son para cuando más se necesitan. No se cierran nunca.
  - botones: ¿Momento difícil? · Kit de calma
- Botón principal: Volver a activar (→ `/paywall`)
- Enlace: Ya pagué: revisar de nuevo
- Enlace, mientras revisa: Revisando…
- Enlace: Entrar con otro correo (→ `/entrar`)
- Pie: ¿Dudas? hadaapps@gmail.com

### 5.2 Sin sesión iniciada en este teléfono
- Título: Entra para abrir tu app
- Texto: Usa el correo de tu compra. La guía "¿Momento difícil?" y el kit de calma están abiertos mientras tanto.
- Botón: Entrar (→ `/entrar`)

### 5.3 Modo sin internet (gracia de 7 días)
- Aviso discreto (días 1 a 4): Sin internet: la app funciona igual.
- Aviso (días 5 a 7): Llevas {dias} días sin conexión. Conéctate un momento antes del {fecha_fin} para seguir sin cortes.
- Gracia vencida (el acceso no está negado, falta revisarlo):
  - título: Conéctate un momento
  - texto: Hace más de 7 días que no revisamos tu acceso. Con internet, se revisa solo en segundos.
  - botón: Revisar ahora
  - la guía y el kit siguen abiertos
- Revisión fallida: No pudimos revisar tu acceso. Toca Reintentar cuando tengas internet.
- Al reconectar y confirmar (aviso que dura poco): Listo, tu acceso está al día.

---

## 6. Textos para pegar en Hotmart (los pega la dueña)

### A. Página de gracias
Va en Hotmart como "mensaje" o como texto antes de redirigir a `/entrar?compra=1`.
```
¡Listo! Tu prueba de 7 días de Paso a Paso está activa.

Ahora entra a la app con el MISMO correo que usaste aquí:
https://[tu-dominio]/entrar?compra=1

Te llega un código de 6 dígitos (revisa también Spam y Promociones).
¿No te llega? Escríbenos a hadaapps@gmail.com
```

### B. Clase de acceso (área de miembros: módulo "Empieza aquí", clase "Cómo entrar a Paso a Paso")
```
Gracias por confiar en Paso a Paso.

Cómo entrar:
1. Abre https://[tu-dominio]/entrar en tu celular.
2. Escribe el correo con el que compraste en Hotmart.
3. Escribe el código de 6 dígitos que te llega por correo. Sin contraseñas.
4. Guarda la app en tu pantalla de inicio para tenerla a un toque.

Tus rutinas, fotos y diario se guardan solo en tu teléfono.
Para cancelar o cambiar tu tarjeta: "Mis compras" en Hotmart.

¿No te llega el código o compraste con otro correo?
Escríbenos a hadaapps@gmail.com con el correo de tu compra.
```

### C. Descripción corta del producto / oferta (la que se ve en el checkout)
```
Paso a Paso: rutinas con fotos, kit de calma y diario para la terapeuta, con el Método Antes, Durante y Después. Para familias de peques autistas de 2 a 12 años.
7 días gratis: elige "Quiero un periodo gratis". Hoy no pagas nada y cancelas cuando quieras. Garantía del Día Tranquilo de 30 días.
```

---

## Checklist: cómo este copy cumple las reglas aplicadas (02B, 50, 52, 42)
- [x] Una pregunta o decisión por pantalla, con barra de progreso fina que nunca retrocede (02B regla 1 y 3; 50 A2).
- [x] Longitud dentro de 4 a 8 pasos para una app personalizada: 6 pasos, el loading y el resultado (02B, tipos de app).
- [x] Cada pregunta cambia algo real: el nombre en todo el flujo, el momento elige la rutina y la crisis llena el kit y el resumen. La edad queda pendiente (ver pregunta 2) (02B regla 2).
- [x] Las preguntas repiten los dolores de la FICHA: "no sé qué hacer cuando se desborda" y "un día tranquilo" (02B, se deriva de la ficha).
- [x] Saltar solo en pasos que no son clave (nombre y crisis), con texto neutro (02B regla 7; 50 A2).
- [x] La pregunta sensible paga con un reconocimiento que nombra el patrón, quita la culpa con la causa real y nombra el mecanismo (50 A5, fórmula).
- [x] El último reconocimiento etiqueta en positivo con evidencia de sus respuestas: "Ya eres quien mejor conoce a {nombre}" (02B regla b; 50 A5 variante final).
- [x] Compromiso explícito con momento y día ("Mañana probamos…"), sin lenguaje que obliga (02B peldaño 7, regla d).
- [x] El loading muestra 4 líneas con datos reales y no es un spinner (50 B, D).
- [x] Primera victoria antes del pago: "¡Hecho!" en el paso 1 de su rutina real (02B trabajo 3, regla 6).
- [x] El paywall va en 3 páginas: resumen, línea de la prueba y precio (02B; 50 C0).
- [x] La inversión se ve: "Hecho con tus {N} respuestas" (02B regla a; 50 D).
- [x] El título nombra su meta ({momento}) y el mecanismo, nunca "Elige tu plan" (50 C1, D; 02B).
- [x] El anual se muestra como US$/mes, con el total anual visible y el ahorro en meses. El mensual es un precio real (50 C1, C5; 52 punto 2).
- [x] La fecha exacta de cobro aparece en la línea de tiempo, bajo el botón y en /cuenta (02B; 50 C4).
- [x] La verdad del puente bajo el botón: hoy no pagas, cancelas cuando quieras y 30 días de garantía (50 C4bis).
- [x] La garantía (30 días) dura más que la prueba (7 días) (52 punto 3).
- [x] Ningún aviso nombra un miedo nuevo ("no te asustes"): todo se dice en positivo junto al botón (52 punto 4).
- [x] El botón usa el texto recomendado "Ir a Hotmart y activar mi prueba", con la ayuda "Quiero un periodo gratis" y sin pedir correo antes (50 C4ter).
- [x] Salida limpia: ✕ visible, "Ahora no" sin culpa y enlace para quien ya pagó (50 C1, C5).
- [x] Sin prueba social inventada: no hay reseñas ni contadores (02B día 1).
- [x] Estado honesto sin checkout: botón deshabilitado que no simula un cobro (50 C3ter).
- [x] Login sin contraseña, con código; el mismo mensaje exista o no el correo; reenvío con cuenta regresiva; errores que dicen qué pasó y qué hacer (50 E; 42 errores).
- [x] Cuatro estados de acceso. Un fallo de red nunca dice "no compraste" (42, acceso y compras; plan, decisión 6).
- [x] El bloqueo no borra datos y deja abiertos la guía y el kit de calma, dicho con calma (plan, decisión 7).
- [x] Personaliza con lo que eligió (momento y crisis), no solo con el nombre, y el nombre se puede saltar (52 punto 5).
