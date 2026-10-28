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
  - `{N}`: respuestas que se ven como chips en el resumen del paywall (momento · edad · crisis respondidas; el nombre no tiene chip y no cuenta): el número cuadra con los chips. (pendiente de aprobar) · antes: preguntas respondidas (contaba el nombre: «tus 4 respuestas» con 3 chips)
  - `{monto}`: lo que se cobra el día 7: "US$4.99 al mes", el único plan (precio de §2.3; 2026-10-28, antes "US$59.90 al año" o "US$7.99 al mes"). (pendiente de aprobar)
  - `{fecha_fin}`: hasta cuándo dura el acceso.
  - `{s}`: segundos.
  - `{min}`: minutos.
  - `{dias}`: días sin conexión.
- Concordancia con "tu peque": "el plan de tu peque", "con tu peque". Nunca "el plan de Tu peque".

---

## 1. Onboarding (`/onboarding`)

Hay 6 pasos con barra (4 preguntas, el reconocimiento y el compromiso). Después vienen la pantalla "armando el plan" y el resultado.
La barra empieza en 10 % y nunca retrocede: 10 · 25 · 40 · 55 · 70 · 85 (sigue en 85 mientras arma el plan) · 100 (con el resultado).

### Elementos comunes
| Elemento | Texto |
|---|---|
| Atrás (botón visible «‹ Atrás», el mismo de la cabecera del paywall: un solo atrás en todo el recorrido; también en «armando el plan» y en el resultado, que vuelven al compromiso saltando la carga) | Atrás (pendiente de aprobar) · antes: solo «‹» con aria-label «Volver al paso anterior» |
| Barra (aria-label) | Paso {n} de 6 |
| Cerrar (aria-label, esquina) | Salir y volver al inicio |

### 1.1 Nombre del peque (se puede saltar)
- Título: ¿Cómo se llama [acento]tu peque[/acento]?
- Ayuda: Solo lo ves tú: se queda en este teléfono.
- Campo (label oculta): Nombre o apodo
- Placeholder: Ej. Mateo
- Botón: Seguir
- Saltar: Prefiero no decirlo
- Error, el campo está vacío y toca Seguir: Escribe su nombre o toca «Prefiero no decirlo».
- Error, más de 20 letras: Usa un nombre o apodo de hasta 20 letras.
- Bajo el campo, en el plano hundido (16px), rótulo de la vista previa: Lo usamos para nombrarlo en su rutina. (pendiente de aprobar) · antes: (no había). Si hay error, el error REEMPLAZA a este rótulo (no se reserva alto).
- Vista previa viva de los 3 primeros pasos de su rutina, dentro del plano hundido (pendiente de aprobar) · antes: solo la 1.ª tarjeta:
  - 1.º, tarjeta elevada (foto del primer paso + texto); cambia con cada letra: {nombre}, ahora: {paso_1} (pendiente de aprobar) · antes: (no había). Con el campo vacío, {nombre} = Tu peque (pendiente de aprobar).
  - 2.º y 3.º, más chicos (foto de 40 + texto de 16px): Después: {paso} (pendiente de aprobar) · antes: (no había)

### 1.2 Edad
- Título: ¿Cuántos años tiene [acento]{nombre}[/acento]?
- Ayuda: (ninguna; la edad todavía no cambia el plan, así que no prometemos ejemplos por edad)
- Opciones (selección única, avanza sola):
  - 2 a 4 años
  - 5 a 7 años
  - 8 a 12 años

### 1.3 Momento más difícil (define la primera rutina)
- Título: ¿Qué momento del día [acento]cuesta más[/acento]?
- Ayuda: Por ahí empieza su primera rutina: de 5 a 7 pasos, con fotos. («de 5 a 7 pasos» con espacios duros: el rango no se parte) (pendiente de aprobar) · antes: Por ahí empieza su primera rutina, con fotos. (El revisor propuso «…, cada uno con su foto»: no se usa porque «Ponerse el pijama» todavía no tiene foto; ver «fotos nuevas».)
- Opciones (selección única, avanza sola):

| Opción (label) | Subtexto | Rutina en `app/js/datos.js` | `{momento}` | `{n_pasos}` |
|---|---|---|---|---|
| La mañana | Despertar, vestirse y salir de casa | `manana` · "Mañana" | la mañana | 7 |
| Las comidas | Sentarse a la mesa y probar | `noche` · "Noche" (empieza con "Cenar") | la cena | 6 |
| Volver del colegio (pendiente de aprobar) · antes: Volver de la escuela | Del colegio a la casa (pendiente de aprobar) · antes: El cambio de la escuela a la casa | `tarde` · "Volver de la escuela" | volver del colegio (pendiente de aprobar) · antes: volver de la escuela | 5 |
| Irse a dormir | Baño, pijama y apagar la luz | `noche` · "Noche" | la noche | 6 |

> Hoy no existe una rutina de comidas. "Las comidas" abre la rutina "Noche", que empieza en "Cenar". Ver la pregunta abierta 1.

### 1.4 Qué pasa en una crisis
- Título: Cuando {nombre} se desborda, ¿[acento]qué pasa[/acento]?
- Ayuda: Elige las que pasen. No hay respuestas malas.
- Opciones (varias, máximo 4):

| Opción (label) | `{crisis}` (texto corto) |
|---|---|
| Llora o grita fuerte | llora o grita («o grita» con espacio duro: no queda «llora / o grita») |
| Se tira al piso o golpea | se tira al piso o golpea |
| Se tapa los oídos o se esconde | necesita esconderse |
| Se queda en silencio y se cierra | se cierra |

> Quitadas (2026-10-21, revisión visual): "Se golpea o golpea cosas" se fusionó con "Se tira al piso", y "Cambia cada vez" se quitó porque equivale a "Prefiero saltar esta".

- Botón: Seguir armando su plan (siempre activo) (pendiente de aprobar) · antes: Seguir
- Pista si toca Seguir sin elegir ninguna: Elige al menos una o toca «Prefiero saltar esta».
- Saltar: Prefiero saltar esta (`{crisis}` = "se desborda")
- Si elige varias, `{crisis}` usa la primera.

### 1.5 Reconocimiento con etiqueta de identidad
Lleva arriba la tira con las 3 primeras fotos de su rutina y el check verde en la primera (la misma del resumen del paywall y de 1.6, al ancho completo), sin opciones y con un solo botón.
- Título: Ya eres quien [acento]mejor conoce[/acento] a {nombre}
- Texto: En un minuto nombraste que {momento} cuesta y qué pasa cuando {crisis}. Eso es [b]observar[/b], y es la base del [b]Método Antes, Durante y Después[/b]. (pendiente de aprobar) · antes: En un minuto nombraste su momento difícil y qué pasa cuando {crisis}. Eso es…
- Texto 2 (quita la culpa; va en el plano hundido, debajo del texto): No es falta de paciencia. Es que {nombre} no sabe qué viene, y tú no tenías a mano qué hacer.
- Botón: Armar su primera rutina (pendiente de aprobar) · antes: Seguir

### 1.6 Compromiso
- Título: Mañana probamos la rutina de [acento]{momento}[/acento] con {nombre}
- Ayuda: {n_pasos} pasos con fotos, en este teléfono. Una sola rutina, un día, basta para empezar. (pendiente de aprobar) · antes: Una sola rutina, un día. Con eso basta para empezar.
- Arriba, la misma tira de 3 fotos de 1.5 (plano hundido, check en la primera, al ancho completo).
- Debajo de la ayuda, en el plano hundido (16px), los pasos que no entran en la tira de 3 fotos: Y {n} pasos más: {paso} · {paso} · … (pendiente de aprobar) · antes: a 13px
- Botón principal: Sí, la probamos (pendiente de aprobar) · antes: Sí, la probamos mañana
- Chip pegado a la ayuda con el momento que eligió en 1.3 (el label de la opción, en negrita): Elegiste: {opción} (pendiente de aprobar) · antes: (no había)
- Al lado del chip: Cambiar (vuelve a 1.3; es la única salida a 1.3) (pendiente de aprobar) · antes: (no había)
- Pie: solo el botón principal (pendiente de aprobar) · antes: Enlace secundario «Cambiar el momento» (vuelve a 1.3) bajo el botón; hacía lo mismo que «Cambiar» junto al chip
- Si ya vio el resultado y no cambió el momento, «Sí, la probamos» va directo al resultado (sin la carga).
- Si `{momento}` es "la mañana", el título cambia a: Mañana temprano probamos [acento]su rutina[/acento] con {nombre} («su rutina» con espacio duro: el acento no se parte) (pendiente de aprobar) · antes: Mañana temprano probamos [acento]su rutina de la mañana[/acento] con {nombre}

### 1.7 Cargando: armando el plan
Dura de 4 a 6 segundos. Cada línea recibe su check, una tras otra.
- Título: Armando el plan de [acento]{nombre}[/acento]…
- Cada línea lleva arriba su etapa del Método, en etiqueta: ANTES, DURANTE, DURANTE, DESPUÉS.
- Línea 1 (Antes): Rutina de {momento}: {n_pasos} pasos con fotos
- Línea 2 (Durante): Kit de calma para cuando {crisis}
- Línea 3 (Durante): Guía «¿Momento difícil?» a un toque («a un toque» con espacios duros) (pendiente de aprobar: solo los espacios) · antes: con espacios normales («a / un toque»)
- Línea 4 (Después): Diario para contarle a su terapeuta («a su terapeuta» con espacios duros) (pendiente de aprobar: solo los espacios) · antes: con espacios normales («a / su terapeuta»)
- Al terminar (aria-live, como pie de la tarjeta de las 4 líneas; pantalla de transición: avanza sola al resultado, sin botón ni órdenes): El plan de {nombre} está listo. (pendiente de aprobar) · antes: El plan de {nombre} está listo. Pruébalo ahora.
- Línea pendiente: etapa y texto en gris secundario (sin opacidad, AA); solo el círculo vacío queda al 60 %.
- Al marcarse la línea 1 aparecen 3 fotos de su rutina, una tras otra, en la misma tira de 1.5, 1.6 y el resumen del paywall (plano hundido, check en la 1.ª).
- Atajo: tocar la tarjeta marca las 4 líneas y pasa al resultado. aria-label: Ver el plan ya (pendiente de aprobar) · antes: (no había)
- Cabecera con «‹ Atrás»: vuelve al compromiso y corta la espera (pendiente de aprobar) · antes: sin atrás.
- Si ya vio el resultado de este mismo plan, pasa al resultado sin esperar. Si volvió y cambió el momento, las líneas se marcan cada 350 ms en vez de cada 1,1 s.
- Con "reducir movimiento": las 4 líneas aparecen ya marcadas y el texto es el mismo.

### 1.8 Resultado: su rutina real con "¡Hecho!"
- Título: La rutina de [acento]{momento}[/acento] de {nombre}
- Ayuda: Toca «¡Hecho!» en el primer paso, como lo hará {nombre} mañana. (pendiente de aprobar) · antes: Toca «¡Hecho!» en el primer paso, como lo hará mañana.
- Lista: los pasos reales de la rutina elegida en `datos.js` (texto y foto). Solo el paso 1 tiene botón.
- Botón del paso 1: ¡Hecho!
- Botón del paso 1 (aria-label): Marcar «{paso_1}» como hecho
- Después de tocar:
  - texto: Así se ve cada paso cumplido, sin imprimir nada. Y cuando {crisis}, el kit de calma ya está en su plan. (pendiente de aprobar) · antes: Así se ve cada paso cumplido. Sin imprimir nada. Y para cuando {crisis}, el kit de calma ya está en su plan.
  - 2.ª línea (16px, gris), el Después del Método: Lo que pase queda anotado para su terapeuta. (pendiente de aprobar) · antes: (no había)
  - progreso, como chip propio bajo el nombre del paso 1: 1 de {n_pasos} (pendiente de aprobar: lugar) · antes: al final del texto de después
  - el paso 2 toma el borde de acento y una etiqueta (13px, acento): Sigue (pendiente de aprobar) · antes: (no había)
- CTA (se ve de inmediato en estilo secundario y pasa a principal después del toque): Quiero el plan de {nombre} (pendiente de aprobar) · antes: Seguir con el plan de {nombre}
- Microlínea bajo el CTA (16px), SOLO si el checkout de Hotmart está configurado: [b]7 días gratis[/b] · cancelas cuando quieras (pendiente de aprobar) · antes: a 13px y sin negrita
- Enlace, al final de la lista (en el flujo, ya no en el pie fijo): Ver antes la app de ejemplo (→ `/app`) (pendiente de aprobar) · antes: Primero quiero ver la app de ejemplo
- Cabecera: con «‹ Atrás», que vuelve al compromiso (1.6) sin pasar otra vez por «Armando el plan».

---

## 2. Paywall en 3 páginas (`/paywall`)

Elementos comunes a las 3 páginas:
- Cerrar (✕, aria-label): Cerrar y volver al plan
- Indicador (aria-label): Página {n} de 3
- Indicador visible (13px, gris, antes del ✕): {n} de 3 (pendiente de aprobar) · antes: solo el aria-label
- Salida, la misma en las 3 páginas (→ `/onboarding`): Ahora no, volver a su rutina (pendiente de aprobar en las páginas 2 y 3) · antes: Ahora no
- Botón a la izquierda, el mismo en las 3 páginas y sin logo: ‹ Atrás (pendiente de aprobar). En la página 1 vuelve a `/onboarding` (su resultado); en la 2 y la 3, a la anterior (igual que el atrás del teléfono). · antes: en la página 1 iba el logo, que llevaba a la landing.
- Sin onboarding en este teléfono no hay plan que resumir: `/paywall` lleva a `/onboarding`.

### 2.1 Página 1: resumen
- Título: El plan de {nombre} para [acento]{momento}[/acento] está listo
- Subtítulo, con las 3 respuestas que tienen chip: Hecho con tus {N} respuestas, con el [b]Método Antes, Durante y Después[/b].
- Subtítulo, con menos de 3: Hecho con lo que nos contaste, con el [b]Método Antes, Durante y Después[/b]. (pendiente de aprobar) · antes: siempre «Hecho con tus {N} respuestas»
- Bajo el subtítulo, sus respuestas en chips: el label de cada opción que tocó, momento · edad · 1.ª crisis; solo las respondidas (aria-label de la lista: Tus respuestas) (pendiente de aprobar) · antes: (no había)
- 3 puntos (con sus respuestas; «{n_pasos} pasos» con espacio duro, no se parte):
  1. **Antes**: su rutina de {momento}, {n_pasos} pasos con fotos (pendiente de aprobar) · antes: su rutina de {momento}, paso a paso y con fotos
  2. **Durante**: kit de calma para cuando {crisis}
  3. **Después**: su semana anotada, lista para la terapeuta
- Línea de pérdida honesta (peso regular): Tu plan ya está en este teléfono. (pendiente de aprobar) · antes: Tu plan ya está en este teléfono. [b]Pruébalo gratis 7 días[/b]. (el CTA ya lleva los 7 días)
- Botón: Ver mis 7 días gratis (pendiente de aprobar) · antes: Ver cómo funciona la prueba
- Salida: Ahora no, volver a su rutina (pendiente de aprobar) · antes: Ahora no

### 2.2 Página 2: la prueba, día por día
- Título: [acento]7 días[/acento] para probarlo sin pagar
- Línea de tiempo:
  - **Hoy** (nodo: el check del embudo; debajo, 3 fotos de su rutina): Su rutina de {momento}, con fotos · El kit de calma y la guía para cuando {crisis} (pendiente de aprobar) · antes: Hoy mismo, su rutina de {momento} · Con fotos, el kit de calma y la guía para cuando {crisis}
  - **Día 5**: Te avisamos por correo · 2 días antes de cualquier cobro
  - **Día 7 · {fecha_cobro}** ({monto} = US$4.99 al mes, el único plan): Empieza el cobro: {monto} (pendiente de aprobar) · Solo si sigues. Cancelas antes desde Hotmart y no pagas nada (pendiente de aprobar) · antes: Solo si sigues. Cancela antes y no pagas nada. ({monto} y {fecha_cobro} nunca se parten entre dos líneas.)
  - (2026-10-28: se quitó la variante «sin plan elegido» con los 2 montos: hay un solo plan.)
- Debajo (bloque hundido con escudo): Si no es para ustedes, cancelas en Hotmart antes del día 7 y [b]no pagas nada[/b]. («no pagas nada» con espacios duros) (2026-10-25: se quitó la garantía de 30 días; Hotmart tiene 7 días de reembolso desde la compra, que se solapan con la prueba) · antes: Y después, 30 días de la [b]Garantía del Día Tranquilo[/b]: si no te ayuda, te devolvemos todo.
- Botón: Quiero ver el plan de {nombre} (pendiente de aprobar) · antes: Quiero ver los planes de {nombre} (2026-10-28: un solo plan) · Ver los planes de {nombre} (y antes: Ver precios)
- Salida: Ahora no, volver a su rutina (pendiente de aprobar) · antes: Ahora no

### 2.3 Página 3: precio
- Título: Días más [acento]predecibles[/acento] para {nombre}, desde hoy
- Subtítulo: Mañana {nombre} ya sabe qué viene. Empiezas gratis y decides después si sigues. (pendiente de aprobar) · antes: Mañana {nombre} ya sabe qué viene. Empiezas gratis y eliges cómo seguir después. (ya no hay 2 planes)
- Orden: la tarjeta (antes, las 2 tarjetas) va justo después del subtítulo (se ve entera en el primer pliegue, también con el error en el pie); debajo, a 32px, "Incluye", y después la tira de su rutina. El pie fijo de esta página es sólido (fondo de la página con una línea fina arriba, sin degradado): lo que pasa por debajo se corta con un borde limpio. (pendiente de aprobar) · antes (ronda 4): "Incluye" separado 80px para no asomar bajo el degradado del pie (dejaba un hueco de ~90 pt) · antes (ronda 3): tarjetas → tira (32px) → "Incluye"; la tira asomaba a medias bajo el degradado del pie. Prioridad: la tarjeta elegida entera. · antes: "Incluye" en una línea sobre las tarjetas. Ronda 3: se probó la tira entre el subtítulo y las tarjetas y empujaba la mensual elegida bajo el pie (27px; 59px sin nombre y con el error): se dejó debajo para que la tarjeta elegida quede entera.
- Junto a una tira de 3 fotos de su rutina: Su rutina de {momento} ya está armada (pendiente de aprobar)
- Incluye (etiqueta en gris secundario —el acento queda para el CTA, la palabra que vende y el check— y 4 chips con el check del embudo; nombres de la app y de la landing §6): [b]Incluye:[/b] Su rutina con fotos · Kit de calma · Guía «Ahora mismo» · Diario e informe (pendiente de aprobar)
- Una sola tarjeta, sin elección (decisión de la dueña 2026-10-25: solo plan mensual; el anual queda para más adelante):
  - nombre: Mensual
  - precio grande: US$4.99/mes
  - detalle: Se cobra cada mes · cancelas cuando quieras
  - nota: Menos de US$0.17 al día
  - antes: tarjeta Anual (US$4.99/mes, se cobra US$59.90 al año, recomendada) + tarjeta Mensual (US$7.99/mes)
- Botón: Empezar mis 7 días gratis (el CTA de la oferta de la landing §6)
- Botón, mientras abre: Abriendo Hotmart…
- Pie fijo: SOLO el botón y una línea bajo él: [b]Hoy no pagas nada[/b] · cancelas antes del día 7 (2026-10-25, sin garantía de 30 días) · antes: [b]Garantía del Día Tranquilo[/b] · 30 días.
- En el flujo, justo debajo del pie (junto al botón, no dentro del pie, que sigue siendo botón + 1 línea), la renovación: Se renueva automáticamente cada mes hasta que canceles. (pendiente de aprobar) · antes: (no había)
- Debajo de la renovación, con los dos nombres como enlaces: Al empezar la prueba aceptas los [Términos](/terminos) y la [Política de privacidad](/privacidad). (pendiente de aprobar) · antes: (no había)
- En el flujo, debajo de los términos: la condición de la prueba, sin ícono ni nombre: Si no es para ustedes, cancelas en Hotmart antes del día 7 y no se te cobra nada. (2026-10-25) · antes: Si en 30 días no te ayuda a tener un día más predecible, te devolvemos todo.
- Ayuda, en el flujo, con ícono de información: En Hotmart, completa tus datos y elige «Quiero un periodo gratis». (pendiente de aprobar) · antes: debajo del botón, en el pie.
- 2 líneas de confianza, con check:
  1. Hoy no pagas nada · primer cobro el {fecha_cobro} ({fecha_cobro} no se parte)
  2. Cancelas en Hotmart cuando quieras
- Fila final (con un candado, no un escudo; alineada a la izquierda en la columna de las líneas de confianza): Pago seguro con Hotmart · tarjeta o medios locales
- Enlaces:
  - Ahora no, volver a su rutina (pendiente de aprobar) · antes: Ahora no
  - ¿Ya pagaste? Entra aquí (→ `/entrar`)
- Error, Hotmart no abrió (a los 6 s; reemplaza a la línea de garantía del pie, no se suma): No se abrió Hotmart. Toca el botón otra vez o revisa si tu navegador bloqueó la ventana.

#### Estado honesto: el checkout todavía no está configurado
Se usa mientras no existan los links de Hotmart.
- Botón deshabilitado: Pagos disponibles muy pronto
- Nota bajo el botón: Todavía no abrimos los pagos. Nada se cobra desde aquí.
- Enlace: Mientras, mira la app de ejemplo (→ `/app`)
- Contacto: ¿Quieres que te avisemos? Escríbenos a hadaapps@gmail.com
- Salida: Ahora no, volver a su rutina (pendiente de aprobar) · antes: Ahora no
- La garantía, la ayuda de Hotmart y las líneas de confianza se ocultan en este estado: hoy no hay prueba que activar.

#### "¿Seguro?" al salir: no existe
"Ahora no, volver a su rutina" vuelve al resultado sin ventanas ni frases de culpa.

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
- Error de red: No pudimos enviar el código. Revisa tu internet y toca «Enviarme el código» otra vez. (pendiente de aprobar) · antes: con comillas rectas ("Enviarme el código")
- Error, pidió demasiados códigos: Ya te mandamos varios códigos. Espera unos minutos y revisa tu correo.
- Al final, bajo el rescate (para quien llegó sin comprar): ¿Todavía no tienes Paso a Paso? Ver el plan («Ver el plan» es el enlace; antes «Ver planes» → `/paywall`) (pendiente de aprobar) · antes: (no había: solo el logo)

#### Variante `?compra=1` (llega desde Hotmart)
- Título: Ya casi. [acento]Entra con el correo de tu compra[/acento]
- Ayuda: Usa el mismo correo que pusiste en Hotmart. Ahí llega tu código.
- El resto es igual, sin «¿Todavía no tienes Paso a Paso? Ver el plan» (ya compró).

### 3.2 Paso código
El mensaje es el mismo exista o no el correo, para no revelar quién tiene cuenta.
- Título: Revisa tu [acento]correo[/acento] (pendiente de aprobar) · antes: Revisa tu correo (sin acento)
- Texto: Si {correo} tiene acceso, te llega un código de 6 dígitos. Vence en 10 minutos.
- Ayuda: ¿No lo ves? Busca también en Spam y Promociones. (el aviso de Spam va una sola vez en este paso: el rescate de este paso no repite su punto 1) (pendiente de aprobar) · antes: el aviso salía aquí y otra vez en el rescate
- Label: Código de 6 dígitos
- Campo (aria-label): Código de 6 dígitos que te llegó por correo
- Botón: Entrar
- Botón, mientras revisa: Revisando…
- Reenviar, con cuenta regresiva: Reenviar código en {s} s
- Reenviar, ya disponible: Reenviar código
- Aviso al reenviar (aria-live): Te mandamos otro código. Usa el más nuevo.
- Enlace: Usar otro correo
- Aviso, si el enlace del correo no sirvió (llega desde `/auth/callback`): Ese enlace ya se usó o venció. Pide un código nuevo aquí. (pendiente de aprobar)
- Aviso, después de cerrar sesión en `/cuenta`: Cerraste sesión.

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
  - texto: A veces Hotmart tarda unos minutos en avisarnos. Toca «Revisar de nuevo» en un momento. (pendiente de aprobar) · antes: con comillas rectas ("Revisar de nuevo")
  - botón: Revisar de nuevo
  - botón, mientras revisa: Revisando…
- Sin compra con ese correo (es también la fila «Sin compra» de `/cuenta`, §4):
  - título: No vemos una compra con {correo}
  - texto: Quizás compraste con otro correo. Revisa el recibo de Hotmart.
  - botones: Ver el plan (→ `/paywall`, el principal) · Entrar con otro correo (enlace: cierra la sesión en este teléfono y lleva a `/entrar`)
- No se pudo verificar (red o error del servidor). Nunca se dice "no compraste":
  - texto: No pudimos revisar tu acceso ahora. Toca Reintentar.
  - botón: Reintentar

### 3.4 Rescate (siempre visible abajo, plegable)
- Título: ¿Compraste y no te llega el acceso?
- 1. Busca el código en Spam y Promociones. (no sale en el paso código, que ya lo dice bajo el texto) (pendiente de aprobar)
- 2. Usa el correo exacto de tu compra (está en el recibo de Hotmart).
- 3. Si compraste con otro correo o nada funciona, escríbenos a **hadaapps@gmail.com** con el correo de tu compra. Lo resolvemos contigo.
- Enlace (aria-label): Escribir a soporte, hadaapps@gmail.com

---

## 4. Tu cuenta (`/cuenta`)
- Título: Tu [acento]cuenta[/acento] (pendiente de aprobar) · antes: Tu cuenta (sin acento)
- Línea: Entraste con {correo}
- Etiqueta del bloque: Tu acceso

| Estado | Etiqueta | Detalle |
|---|---|---|
| `trialing` | Prueba gratis activa | Primer cobro el {fecha_cobro}. Si cancelas antes, no pagas nada. |
| `active` | Suscripción activa | Próximo cobro el {fecha_cobro}. |
| `past_due` | Hay un problema con el pago | Tu acceso sigue abierto. Revisa tu tarjeta en Hotmart para no perderlo. |
| `cancelled` (con días restantes) | Cancelada | Tienes acceso hasta el {fecha_fin}. Si cambias de idea, puedes volver a activarla en Hotmart. (pendiente de aprobar) · antes: …Si cambias de idea, vuelve a activarla. |
| `cancelled` (vencida) | Terminada | Tu acceso terminó el {fecha_fin}. Tus datos siguen en este teléfono. |
| `refunded` | Reembolsada | Te devolvimos el pago. Tus datos siguen en este teléfono. |
| No se pudo verificar | Sin verificar | No pudimos revisar tu acceso ahora. Toca Reintentar. |
| Sin compra | No vemos una compra con {correo} | Quizás compraste con otro correo. Revisa el recibo de Hotmart. (el copy de §3.3; pendiente de aprobar) · antes: Sin compra con este correo · ¿Compraste con otro correo? Escríbenos a hadaapps@gmail.com. |
| `cancelled` o `expired` sin fecha guardada | Terminada | Tu acceso terminó. Tus datos siguen en este teléfono. (pendiente de aprobar) |
| `admin` (la dueña) | Acceso de administradora | Siempre tienes acceso, para probar la app y dar soporte. (pendiente de aprobar) |

- `expired` usa la fila "Terminada" y `chargeback` la fila "Reembolsada". (pendiente de aprobar)
- Si llega desde `?compra=1` y todavía no hay compra, en lugar de "Sin compra" sale "Tu compra está en camino" (§3.3) con "Revisar de nuevo".

- Botón: Gestionar o cancelar en Hotmart
- Ayuda: Se abre Hotmart. Ahí cambias tu tarjeta o cancelas.
- Botón, mientras abre: Abriendo Hotmart… (el mismo del paywall, §2.3)
- Botón (estado Cancelada, con días): Ver mi compra en Hotmart, sin la ayuda de arriba (pendiente de aprobar) · antes: Gestionar o cancelar en Hotmart + «Se abre Hotmart. Ahí cambias tu tarjeta o cancelas.»
- Botón (estados terminada o reembolsada): Volver a activar (→ `/paywall`)
- Sin compra: los botones de §3.3, Ver el plan (→ `/paywall`) · Entrar con otro correo (pendiente de aprobar) · antes: Volver a activar (→ `/paywall`)
- Enlace: Volver a la app
- Botón: Cerrar sesión
- Confirmación:
  - título: ¿Cerrar sesión en este teléfono?
  - texto: Tus rutinas y tu diario se quedan aquí.
  - botones: Sí, cerrar sesión · Quedarme
- Aviso después: Cerraste sesión.

#### Eliminar mi cuenta (decisión 28 de la dueña, 2026-10-25; todo pendiente de aprobar)
Al pie, bajo «Cerrar sesión». No aparece para la administradora.
- Enlace: Eliminar mi cuenta
- Confirmación:
  - título: ¿Eliminar tu cuenta?
  - qué se borra: Se borran tu correo, tu nombre y el estado de tu suscripción. Ya no podrás entrar con este correo.
  - qué se queda: Tus rutinas y tu diario viven en este teléfono y no se borran con esto. Para borrarlos también: en la app, Ajustes → «Volver a los datos de ejemplo».
  - pagos: Solo guardamos los registros de pago, sin tu correo, porque la ley tributaria lo exige.
  - con suscripción que cobra (prueba, activa, pago atrasado o sin verificar), en negrita: Eliminar tu cuenta no cancela tu suscripción. Si no la cancelas en Hotmart, se te seguirá cobrando.
  - con suscripción: botón Cancelar primero en Hotmart (→ Mis compras de Hotmart) · enlace Ver cómo cancelar (→ `/cancelar`)
  - botones: Sí, eliminar mi cuenta (mientras: Eliminando…) · No, volver
  - error: No pudimos eliminar tu cuenta. Revisa tu internet y vuelve a intentar, o escríbenos a hadaapps@gmail.com.
- Aviso después, en `/entrar`: Eliminamos tu cuenta. Gracias por haber estado aquí.

---

## 5. App (PWA): bloqueo y modo sin internet

### 5.1 Pantalla de bloqueo
Sale solo con `acceso:false` explícito.
- Título: Tu acceso está en pausa
- Motivo, debajo del título, según el estado que guardó la app (lo devuelve `/api/acceso`): (pendiente de aprobar) · antes: sin motivo
  - `cancelled` (también la prueba cancelada; la base no las distingue): La prueba o la suscripción se canceló, y el acceso terminó.
  - `expired` (pago rechazado): Hotmart no pudo cobrar el pago.
  - `refunded` o `chargeback`: Te devolvimos el pago.
  - sin compra (`none`): No vemos una compra con este correo.
  - otro estado: sin motivo
- Texto: No borramos nada. Las rutinas, las fotos y el diario de {nombre} siguen en este teléfono.
- Debajo, sin texto nuevo: la tira con los primeros 4 pasos de la rutina de {nombre} guardada en el teléfono (su foto o pictograma en baldosa, con el check en los que ya hizo hoy; el lector de pantalla lee el nombre de la rutina y de cada paso). Sin rutina guardada no sale, y el ícono de los dos botones del bloque destacado va en baldosa. (pendiente de aprobar) · antes: sin tira
- Bloque destacado:
  - título: Esto sigue abierto, siempre
  - texto: La guía "¿Momento difícil?" y el kit de calma son para cuando más se necesitan. No se cierran nunca.
  - botones: ¿Momento difícil? · Kit de calma
  - cada botón igual que en el inicio de la app, con su ícono y su descripción: ¿Momento difícil? Qué hacer ahora mismo · Kit de calma: Respirar, contar, música y lo que le ayuda
- Botón principal: Volver a activar (→ `/paywall`)
- Enlace: Ya pagué: revisar de nuevo
- Enlace, mientras revisa: Revisando…
- Si al revisar la base sigue sin ver el pago (aria-live): Todavía no vemos el pago. A veces Hotmart tarda unos minutos en avisarnos: revisa de nuevo en un momento. (pendiente de aprobar)
  - debajo, enlace a `/entrar`: Si pagaste con otro correo, entra con ese. (pendiente de aprobar) · antes: sin esta línea
- Enlace: Entrar con otro correo (→ `/entrar`)
  - no sale mientras se ve «Si pagaste con otro correo, entra con ese.», que ya lleva a `/entrar` (pendiente de aprobar) · antes: los dos enlaces seguidos
- Pie: ¿Dudas? hadaapps@gmail.com

### 5.2 Sin sesión iniciada en este teléfono
- Título: Entra para abrir tu app
- Texto: Usa el correo de tu compra. La guía "¿Momento difícil?" y el kit de calma están abiertos mientras tanto.
- Debajo del texto, la tira de la rutina de {nombre} de §5.1 si hay una guardada en el teléfono (pendiente de aprobar) · antes: sin tira
- Botón: Entrar (→ `/entrar`)
- La guía y el kit, en el bloque destacado de §5.1 «Esto sigue abierto, siempre» (título, texto y los dos botones) (pendiente de aprobar) · antes: los dos botones sueltos, sin título ni texto
- Pie: ¿Dudas? hadaapps@gmail.com (el de §5.1) (pendiente de aprobar) · antes: sin pie
- Si se cerró la sesión pero el pase de 7 días sigue vigente (la app sigue abierta; tarjeta en el inicio con el botón Entrar): Tu sesión se cerró en este teléfono. Entra antes del {fecha_fin} para seguir sin cortes. (pendiente de aprobar)

### 5.3 Modo sin internet (gracia de 7 días)
- Aviso discreto (días 1 a 4): Sin internet: la app funciona igual.
- Aviso (días 5 a 7): Llevas {dias} días sin conexión. Conéctate un momento antes del {fecha_fin} para seguir sin cortes.
  - botón dentro del aviso: Revisar ahora (si falla: el texto de "Revisión fallida" y el botón pasa a Reintentar) (pendiente de aprobar) · antes: sin botón
- Gracia vencida (el acceso no está negado, falta revisarlo):
  - título: Conéctate un momento
  - texto: Hace más de 7 días que no revisamos tu acceso. Con internet, se revisa solo en segundos.
  - debajo del texto, la frase de §5.1: No borramos nada. Las rutinas, las fotos y el diario de {nombre} siguen en este teléfono. (pendiente de aprobar) · antes: sin esta frase
  - debajo de la frase, la tira de la rutina de {nombre} de §5.1 (pendiente de aprobar) · antes: sin tira
  - botón: Revisar ahora
  - la guía y el kit siguen abiertos, en el bloque destacado de §5.1 «Esto sigue abierto, siempre» (título, texto y los dos botones) (pendiente de aprobar) · antes: los dos botones sueltos, sin título ni texto
  - Pie: ¿Dudas? hadaapps@gmail.com (el de §5.1) (pendiente de aprobar) · antes: sin pie
- Revisión fallida: No pudimos revisar tu acceso. Toca Reintentar cuando tengas internet. (sale en la pantalla de gracia vencida, con su bloque destacado y su pie)
- Al volver internet con la app abierta, se revisa sola (sin tocar nada).
- Al abrir sin un pase vigente, mientras espera la respuesta (hasta 8 s sin internet): Revisando… (con un círculo que gira; texto de §5.1)
  - debajo, los dos botones de §5.1 (¿Momento difícil? · Kit de calma), que ya abren la guía y el kit (pendiente de aprobar) · antes: solo «Revisando…»
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
7 días gratis: elige "Quiero un periodo gratis". Hoy no pagas nada y cancelas cuando quieras antes del día 7.
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
- [x] Un solo plan, mensual, con su precio real US$4.99/mes (decisión de la dueña 2026-10-25; antes: anual + mensual) (50 C1, C5; 52 punto 2).
- [x] La fecha exacta de cobro aparece en la línea de tiempo, bajo el botón y en /cuenta (02B; 50 C4).
- [x] La verdad del puente bajo el botón: hoy no pagas y cancelas antes del día 7 sin pagar (50 C4bis). Sin garantía de días: la de Hotmart (7 días desde la compra) se solapa con la prueba.
- [ ] ~~La garantía (30 días) dura más que la prueba (7 días) (52 punto 3).~~ Se quitó el 2026-10-25 por decisión de la dueña: Hotmart quedó con 7 días de reembolso.
- [x] Ningún aviso nombra un miedo nuevo ("no te asustes"): todo se dice en positivo junto al botón (52 punto 4).
- [x] El botón usa el texto recomendado "Ir a Hotmart y activar mi prueba", con la ayuda "Quiero un periodo gratis" y sin pedir correo antes (50 C4ter).
- [x] Salida limpia: ✕ visible, "Ahora no" sin culpa y enlace para quien ya pagó (50 C1, C5).
- [x] Sin prueba social inventada: no hay reseñas ni contadores (02B día 1).
- [x] Estado honesto sin checkout: botón deshabilitado que no simula un cobro (50 C3ter).
- [x] Login sin contraseña, con código; el mismo mensaje exista o no el correo; reenvío con cuenta regresiva; errores que dicen qué pasó y qué hacer (50 E; 42 errores).
- [x] Cuatro estados de acceso. Un fallo de red nunca dice "no compraste" (42, acceso y compras; plan, decisión 6).
- [x] El bloqueo no borra datos y deja abiertos la guía y el kit de calma, dicho con calma (plan, decisión 7).
- [x] Personaliza con lo que eligió (momento y crisis), no solo con el nombre, y el nombre se puede saltar (52 punto 5).
