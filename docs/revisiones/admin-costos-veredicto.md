# VEREDICTO revisor-visual — admin-costos (Costos y ajustes, panel de la dueña) — Ronda 5
Fecha: 2026-10-21 00:48
Screenshot: docs/revisiones/admin-costos-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) el total de cada lista va en 28px (el tamaño que la ficha le da al título de sección), no en 24px como pide la escala del panel decidida hoy para las cifras; además, en el Resumen las cifras van en Lexend 24 y aquí en Atkinson 28, así que la misma pieza se ve distinta según la pestaña; (2) si falla "Deshacer" en un gasto de anuncios, el aviso de error aparece en la sección de costos mientras la página baja a anuncios, y la dueña no lo ve; (3) los errores del servidor siguen siendo genéricos ("revisa el canal, el monto y el mes"); (4) los pasos pendientes de la tira no llevan a su formulario y la frase de estado sigue en gris secundario; (5) lo recién anotado no se marca en la lista.

---

```
VEREDICTO: NO LISTA
USABILIDAD: 35/40  (detalle: h1:3 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4)
CRAFT:      16/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3)
COPY:       N/A (no vende)
FIDELIDAD:  N/A (sin referencia)
```

Gate doble: craft 16/20 ≥ 16 → pasa. Usabilidad 35/40 < 36 → NO LISTA, por 1 punto. Avance desde la ronda 4: +4 en usabilidad (31→35) y +1 en craft (15→16). Se cerraron los cinco defectos TOP de la ronda 4. Subieron a 4 el control (deshacer), la prevención, el reconocimiento y el lenguaje, y el movimiento ya cumple todos sus básicos. Lo que falta para el umbral es poco y está localizado: subir a 4 cualquiera de h1, h7, h9 o h4/h8. Con arreglar los defectos TOP 1 y 2 basta para pasar.

## Gate de carga cognitiva

```
[✓] Grupos ≤4-5 ítems: tira de 3 pasos; costos de octubre (2 filas); anuncios de octubre (1 fila).
[✗] Decisiones ≤4 opciones: canal 6, moneda 8, mes 12. Es leve: la dueña sabe la respuesta y todo está escrito en palabras. Pero al pie de la letra falla, igual que en las rondas 3 y 4.
[✓] UNA acción primaria: un solo estilo de primario (salvia). "Anotar costo" y "Anotar gasto" están en secciones distintas y nunca juntos en una vista de 375. "Guardar ajustes" y "Deshacer" usan el tono suave.
[✓] No recordar entre pantallas.
[✓] ≤5-7 campos por paso: 3 (4 con "Otro gasto"), 3 (4 con "Otro") y 3.
[✓] Texto por bloque ≤3-4 líneas: la ayuda de anuncios ocupa 4 líneas en 375 (costos-2.png), justo en el límite. El resto ocupa 3 o menos.
[✓] "Qué sigue" obvio: la tira dice qué falta anotar este mes.
[~] Cero elementos falsamente interactivos: los círculos de la tira (36px, borde salvia) parecen tocables y no hacen nada. No cuenta como falla porque no imitan un botón.
→ 1 falla: sin sobrecarga.
```

## Anclas CTA héroe vivo (Anotar costo / Anotar gasto)

```
[✓] Contraste: #FBFCF9 sobre #4A765F ≈ 5:1.
[✓] Estado tap: active:scale-[0.98] + transición de filter/transform (formularios.tsx:35).
[✓] Nunca disabled por defecto: solo durante el envío (useFormStatus), con spinner y "Anotando…".
[✓] Área táctil: min-h-12 (48px) y ancho completo en 375; ancho automático en 1280.
```

## Verificación FICHA-ARTE (valores visibles)
- Paleta: fondo #F2F4EF, superficie #FBFCF9, hundido #E6ECE5, tinta #22302A / #52605A, salvia #4A765F y aviso #6A5634 (NotaMoneda). Coinciden.
- Tipografía: Lexend en los títulos (36 y 28) y Atkinson en el cuerpo, las filas y ahora también los totales. Coincide con la ficha, pero ver la escala.
- Escala del panel (línea nueva, 2026-10-21: 13 etiqueta · 18 texto · 24 cifra y título de tarjeta · 28 título de sección · 36 título de página, sin 15px): el 15px desapareció; grep en app/admin y components/admin solo encuentra 13, 18, 24, 28 y 36. **DESVÍO**: el total de cada lista ("US$20,00", "US$200,00") es una cifra y va en 28px (page.tsx:343 y 422), el tamaño que la ficha reserva para el título de sección. En la captura, "US$20,00" pesa igual que "Costos de cada mes". El comentario de ui.tsx:5 dice "24 (cifra…)". → TOP 1.
- Radios: 18px en tarjetas, 14px en botones, campos, globo y aviso. Coinciden.
- Acento: salvia solo en los CTA, en la tira y en el check. OK.
- Dispositivo ownable (tira de pasos con check verde): presente (page.tsx:279-287). En 1280 ahora está limitada a `max-w-md` (page.tsx:284), con los círculos a unos 140px y ya no sueltos.
- Motion signature: 300ms ease-out, stagger 60ms, el check que se llena y el monto que cuenta. Coinciden.
- Anti-clon: no coincide con "Capítulo" ni con "Umbral". OK.

## Defectos de la ronda 4: estado

| # | Defecto ronda 4 | Estado | Evidencia |
|---|---|---|---|
| 1 | Dos familias de números en la misma tarjeta + tercer estilo de fecha | RESUELTO | Los totales ya no usan `font-display` (page.tsx:343, 422): son Atkinson como las filas, y el 0 es el mismo en toda la tarjeta (costos-1.png, costos-2.png). `fecha(…, true)` devuelve "20 de octubre, 21:45" (formato.ts:309-323; costos-3.png). Queda un resto: `periodo()` todavía escribe "1 al 15 oct 2026" con el mes corto (page.tsx:517-518), pero solo en periodos parciales, que el formulario ya no crea. Nuevo efecto: el total se ve distinto de las cifras del Resumen (TOP 1). |
| 2 | El total no cuenta | RESUELTO | `<MontoVivo monto={total} moneda={m} />` en page.tsx:344 y 423. Con reducir movimiento se ve el valor final (panel.css:148-154). |
| 3 | Hueco del formulario de anuncios en 1280 | RESUELTO | page.tsx:371 usa `sm:grid-cols-[1.3fr_1fr_1fr]`, igual que costos. La ayuda (col-span-3) va sobre el botón (page.tsx:392-399). Así se ve en la captura de 1280. Detalle: con "Otro", "Nombre del canal" se apila en la columna 1 (interacciones.tsx:46-60) y no en una fila propia, pero sin hueco visible por defecto. |
| 4 | Borrar irreversible | RESUELTO | `borrarRegistro` guarda una copia y la pasa en `?d=` (acciones.ts:129-149). El aviso de borrado trae un botón "Deshacer" (page.tsx:172-179) que vuelve a anotar con `restaurarRegistro` y valida la copia (acciones.ts:152-183). El globo avisa "Podrás deshacerlo justo después" (interacciones.tsx:99). Hay un resto: `error:restaurar` está fijo en la sección "mensuales" (page.tsx:118-122), así que un fallo al deshacer un gasto queda fuera de vista (TOP 2). |
| 5a | "USD" crudo | RESUELTO | `nombreMoneda` (page.tsx:185-188): "Montos en dólares (USD)." y "Monto en dólares (USD)" (page.tsx:289, 303, 376). |
| 5b | Aviso de reemplazo en anuncios llegaba tarde | RESUELTO | Ayuda previa: "Un monto por canal y mes: si lo anotas de nuevo, se reemplaza." (page.tsx:392-394). |
| 5c | El globo de borrar no nombra el "Otro gasto" | RESUELTO | page.tsx:354 usa `“${c.note}”` cuando el tipo es otro. |
| 5d | Al cambiar de moneda, los totales quedaban mudos | RESUELTO (resto menor) | `NotaMoneda` (page.tsx:359, 444, 522-527) dice cuántos montos quedan fuera y en qué moneda va el total. Resto: la tira sigue marcando como hecho un costo en otra moneda (page.tsx:247-251 no filtra por `currency`). |
| — | Pasos pendientes de la tira sin destino; frase de estado débil | PARCIAL | La frase subió a 18 en negrita (page.tsx:280), pero sigue en `--text-secondary`. Los pasos siguen sin enlace (ui.tsx:190, `<li>` sin `<a>`). |
| — | Círculos de la tira muy separados en 1280 | RESUELTO | `max-w-md` (page.tsx:284). |
| — | Nombres distintos en el selector y en la lista | NO RESUELTO | "Servidores y base de datos" → "Servidores", "Envío de correos" → "Correos", "Facebook o Instagram (Meta)" → "Meta" (page.tsx:43-60). |
| — | Errores del servidor que no dicen cuál campo falló | NO RESUELTO | 'error:gasto' sigue diciendo "revisa el canal, el monto y el mes" (page.tsx:128-132). Las acciones redirigen con un solo código (acciones.ts:81-82, 103-104). |
| — | La fila recién anotada no se marca | NO RESUELTO | `?ok=costo` / `?ok=gasto` no llevan el id (acciones.ts:94, 115). Ninguna fila se resalta. |
| — | Fondo plano | NO RESUELTO | `--bg: #f2f4ef` como fill plano (panel.css:5; layout.tsx:12). |
| — | 15px en la escala | RESUELTO | Sin `text-[15px]` en app/admin ni en components/admin. |

## Justificación por criterio (usabilidad)
- h1 = 3: los botones muestran spinner y texto ("Anotando…", "Borrando…", "Deshaciendo…") y bloquean el doble envío. El aviso con el check aparece en su sección, el total cuenta hasta el nuevo valor y la tira se actualiza. Lo que falta para el 4: lo recién anotado no se marca en la lista, y si falla un "Deshacer" de anuncios, el aviso sale en otra sección (page.tsx:118-122 frente a acciones.ts:160-161). En ese caso la dueña no ve ninguna respuesta donde está mirando.
- h2 = 4: todo está en su mundo: "Qué es", "Dónde pusiste el anuncio", "Monto en dólares (USD)", "Pregúntale a tu contador". El único dato técnico ("?src=") está plegado y explicado con ejemplos.
- h3 = 4: borrar pide confirmación con foco en "No, dejarlo", se cierra con Esc y al tocar fuera, y ahora se puede deshacer desde el aviso. Los montos se corrigen anotando de nuevo, y la ayuda lo dice antes de anotar.
- h4 = 3: los números y las fechas ya son coherentes dentro de esta pantalla, y hay un solo plegable. Un ojo entrenado ve lo que queda: el total de esta pantalla (Atkinson 28 bold, page.tsx:343) frente a las cifras del Resumen (Lexend 24 semibold, (privado)/page.tsx:318 y 581), y los nombres que cambian entre el selector y la lista.
- h5 = 4: cada campo se valida en el cliente con un mensaje propio, "Otro" se exige solo cuando corresponde, los meses van en palabras, el duplicado está cerrado en la base y se avisa antes de anotar. La moneda distinta se avisa bajo el total. Lo único que queda es que la tira cuenta los costos en otra moneda (menor).
- h6 = 4: las opciones están a la vista y en palabras, la tira muestra qué falta y el globo nombra exactamente lo que se borra, incluido el nombre del "Otro gasto".
- h7 = 3: el mes actual viene por defecto, la moneda se toma de los ajustes, Enter envía y el foco salta solo a "Nombre del canal", a "Nombre del gasto" y a "No, dejarlo". Para el 4 falta un atajo: que tocar un paso pendiente de la tira lleve a su formulario.
- h8 = 3: la vista está limpia en 375 y en 1280 (rejillas alineadas, un primario por vista). Un ojo entrenado ve que el total (28) compite con el título de sección (28). La noticia de la pantalla ("tus costos fijos están anotados") va en gris secundario. En 1280, la tarjeta de la tira usa el 40% izquierdo y el resto queda vacío.
- h9 = 3: los errores del cliente dicen qué hacer, con ejemplo. Los del servidor no dicen qué campo falló, y el error de "Deshacer" en anuncios aparece fuera de vista.
- h10 = 4: no hay ninguna zona muda. Los estados vacíos enseñan, la tira dice qué falta, cada campo dudoso tiene su ayuda, la nota de moneda explica por qué un monto no suma y el "¿Cómo sabe el panel…?" está plegado donde se necesita.

## Justificación por eje (craft)
- Jerarquía 3: título (36) → sección (28) → cuerpo (18) → etiqueta (13). Se leen cuatro niveles, pero el total ocupa el mismo escalón que el título de sección. Con eso, la cifra y el encabezado de la sección compiten, y la escala del panel queda mal usada (la cifra debería ir en 24).
- Profundidad 3: los niveles son consistentes (tarjeta con sombra tintada y anillo, campos hundidos con sombra interior, globo con --shadow-2). La base sigue siendo un fill plano.
- Identidad 3: la tira de pasos con check salvia está visible y tiene sentido. Sigue siendo solo un indicador: no lleva a ningún lado ni se repite como firma en las listas.
- Movimiento 4, revisado una por una en el código:
  - Stagger de entrada: SÍ (`.entra`, 60ms; panel.css:55-61).
  - Conteo de números héroe: SÍ (MontoVivo en page.tsx:344 y 423).
  - Anillos que se dibujan: SÍ (`.llena` + `.check-vivo` en la tira, con 60ms entre pasos).
  - Tap <150ms: SÍ (active:scale en botones, papelera, pestañas y plegable).
  - Transición de tabs: fondo y escala (Navegacion.tsx:23), y la página entra con stagger.
  - Modales suaves: SÍ (globo y campos condicionales con `.entra`; `details` con panel-entra).
  - Celebración en hitos: SÍ, nivel bajo (check vivo en el aviso y en la tira completa).
  - Reduced-motion: SÍ (panel.css:148-170; el monto queda fijo con `.monto-fijo`, y el spinner usa motion-reduce:animate-none).
- Encaje 3: en 375, montos tabulares y papelera de 48px. A ojo entrenado: el total se alinea al borde derecho de la tarjeta, pero los montos de las filas terminan unos 56px antes, junto a la papelera, así que la columna de cifras no cae en la misma vertical. En 1280, la tira va arrinconada a la izquierda de una tarjeta a todo el ancho.

## TOP DEFECTOS (por impacto)
1. [Total del mes / Total en anuncios] El total va en 28px, el tamaño del título de sección, y no en los 24px de cifra que fija la escala del panel. Además se ve distinto de las cifras del Resumen. → page.tsx:343 y 422: `text-[24px]` (mantener Atkinson bold para no mezclar los ceros con las filas). Dejar escrita en la ficha o en ui.tsx:5 la regla de qué familia usa una cifra, para que el Resumen (Lexend 24) y Costos (Atkinson 24) no diverjan, o unificar las dos pantallas.
2. [Aviso de "Deshacer" fallido en anuncios] `error:restaurar` está fijo en `seccion: 'mensuales'` (page.tsx:118-122), mientras la redirección baja a #anuncios (acciones.ts:160-161). El error queda fuera de vista. → Usar dos códigos (`error=restaurar-costo` / `error=restaurar-gasto`) con su sección, igual que `borrar-costo` / `borrar-gasto`.
3. [Errores del servidor] "No se anotó: revisa el canal, el monto y el mes" no dice cuál falló (page.tsx:128-137). → En acciones.ts:81 y 103, redirigir con un código por causa (`error=gasto-monto`, `gasto-mes`, `gasto-canal`, `costo-monto`, `costo-mes`) y un mensaje para cada uno.
4. [Tira de pasos] Los pasos pendientes no llevan a ningún lado y la frase de estado va en gris. → En ui.tsx:190, que un paso pendiente sea `<a href="#mensuales">` (o `#anuncios`) con el tipo preseleccionado (`?tipo=email`). En page.tsx:280, pasar la frase a `--text-primary`.
5. [Fila recién anotada] No se marca. → Devolver el id en `?ok=costo&n=<id>` (acciones.ts:94, 115) y darle a esa fila un fondo `--ok-bg` que se desvanezca en 1,5 s (sin animación con reducir movimiento).

## Otros defectos (menor gravedad)
- [Nombres selector ↔ lista] "Servidores y base de datos" → "Servidores", "Envío de correos" → "Correos", "Facebook o Instagram (Meta)" → "Meta". → Que la opción empiece con el nombre corto: "Servidores (y base de datos)", "Correos (envío)", "Meta (Facebook o Instagram)".
- [Columna de cifras] El total y los montos de las filas no terminan en la misma vertical. → Reservar a la derecha del total el mismo ancho que la papelera (`pr-[52px]`) o alinear los montos de las filas al borde.
- [Tira y moneda] La tira marca como hecho un costo anotado en otra moneda (page.tsx:247-251). → Filtrar por `c.currency === m`, o mostrar el paso con la nota "en otra moneda".
- [Fondo] Fill plano. → Un tinte o gradiente muy sutil en la base para el tercer nivel de profundidad.
- [Tira en 1280] Arrinconada a la izquierda de una tarjeta a todo el ancho. → Darle a la tarjeta el mismo `max-w` o poner la frase y la tira en una sola fila.
