# VEREDICTO revisor-visual — admin-entrar (Panel · paso "Tu correo", formulario + estado "enlace enviado") — Ronda 5
Fecha: 2026-10-21 18:00
Screenshot: docs/revisiones/admin-entrar-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: (1) en "enviado" siguen viéndose tres checks salvia (marca, tira y tarjeta), que compiten como firma · (2) el correo tapado (gi•••@gmail.com) no deja ver un error de tipeo a mitad de la dirección · (3) en "enviado", el título del plegable se corta en dos líneas y "mal?" queda solo en la segunda · (4) los tres checks tienen tamaños distintos (22, 36 y 44px) en la misma columna. Ninguno bloquea.

## Detalle

```
VEREDICTO: LISTA
USABILIDAD: 36/40  (detalle: h1:3 h2:4 h3:4 h4:3 h5:3 h6:4 h7:4 h8:3 h9:4 h10:4)
CRAFT:      16/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:4 encaje:3)
COPY:       N/A (no vende)
FIDELIDAD:  N/A (sin referencia)
```

Gate doble: 36/40 (pasa) y 16/20 (pasa) → LISTA. Usabilidad se mantiene igual que en la ronda 4 (36). Craft sube 1 (de 15 a 16): el movimiento ya no repite lo que no cambia, y el sello espera a la tarjeta.
Capturas puntuadas: `admin-entrar-375.png` (formulario), `admin-entrar-enviado-375.png` ("enviado") y `admin-entrar-1280.png` (formulario en escritorio). A 1280 la columna queda centrada en 440px y la jerarquía y los radios son los mismos que a 375. No hay nada que se rompa.

### Gate de carga cognitiva (los 2 estados)
```
[x] Grupos/listas ≤4-5 ítems (la tira tiene 3 pasos)
[x] Decisiones ≤4 opciones
[x] UNA acción primaria (formulario: "Mandarme el enlace"; enviado: ir al correo, con el reenvío plegado)
[x] No hay que recordar nada (la bajada dice qué correo usar; "enviado" muestra gi•••@gmail.com)
[x] ≤5-7 campos (1)
[x] Texto por bloque en 3-4 líneas (bajada 3, bloque del sello 4, nota 3 a 375px)
[x] El "qué sigue" es obvio (la tira marca el paso 1 hecho y el 2 pendiente)
[x] Cero elementos que parezcan interactivos y no hagan nada
→ 0 fallas.
```

### CTA héroe vivo
```
[x] Contraste ≥3:1: #FBFCF9 sobre #4A765F ≈ 5,2:1
[x] Hover/tap definido: hover:brightness-110 + active:scale-[0.98] (formularios.tsx:35)
[x] No disabled por defecto (solo `disabled={pending}`)
[x] ≥48px (min-h-12), ancho completo, 18px
```

### Estado de los defectos de la ronda 4
| # | Defecto R4 | Estado | Evidencia |
|---|---|---|---|
| 1 | Al pasar a "enviado" vuelven a entrar la marca y el pie, y el sello hace su "pop" con la tarjeta a medio aparecer | RESUELTO | `MarcoEntrada.tsx:26` calcula `anima = etapa === 'enviado' ? '' : 'entra'` y lo aplica a la marca (`:29`), a la nota (`:39`) y a los enlaces (`:42`). Solo vuelven a entrar la tira, el título, la bajada y la tarjeta, que son las partes que cambian. El `div role="status"` lleva `--retraso: 420ms` (entrar/page.tsx:52). La tarjeta empieza a entrar a los 240ms y dura 300ms con ease-out, así que a los 420ms ya está casi quieta, y el trazo empieza a los 560ms. Además, el check de la tira (pop a los 260ms y trazo a los 400ms) y el de la tarjeta ahora van uno detrás del otro, sin pisarse. |
| 2 | La tarjeta deja más aire abajo que arriba cuando termina en el plegable | RESUELTO | `-mb-2` en el `<details>` (entrar/page.tsx:58). En la captura de "enviado" hay unos 20px del borde superior al sello y unos 18-19px del texto "mal?" al borde inferior. Ya no se nota la diferencia. |
| 3 | Tres checks salvia en "enviado" (marca, tira y tarjeta) | NO RESUELTO | La captura de "enviado" sigue mostrando los tres: marca de 22px, tira de 36px y tarjeta de 44px (entrar/page.tsx:53, `Sello tam={44} vivo`). Ahora se animan en orden y no a la vez, así que estorban menos. Pero siguen siendo tres veces la misma firma en una vista, y la ficha pide "celebración nivel bajo". |
| 4 | El correo tapado esconde un error de tipeo a mitad de la dirección | NO RESUELTO | acciones.ts:48-49 sigue usando `usuario.slice(0, 2)}•••@${dominio}`. En la captura se lee "gi•••@gmail.com". |
| 5 | "Tu correo" aparece dos veces seguidas | RESUELTO | La etiqueta del campo dice "Correo electrónico" (entrar/page.tsx:21), y se ve así a 375 y a 1280. |

### Verificaciones en código
- h1: `BotonEnviar` muestra un spinner y "Enviando el enlace…" con `aria-busy`. "Enviado" tiene `role="status"` y avisa "Puede tardar un par de minutos". No llega a 4 porque el paso de un estado al otro sigue siendo una recarga completa (`redirect` en acciones.ts:49). La recarga ahora se nota menos porque la marca y el pie quedan quietos.
- h2: no hay jerga ni inglés. "Panel", "enlace" y "correo electrónico" son palabras del mundo de la dueña.
- h3: "Volver a la página de Paso a Paso" está en los dos estados. "Salir de esa cuenta" aparece con `sin_permiso` (page.tsx:84-90). La corrección del correo está a la vista en el título del plegable. No hay acciones destructivas.
- h4: el botón, los radios (14/18), el plegable y la tira son iguales al resto del panel. Lo que queda son los tres checks en "enviado".
- h5: `type="email" required`, `data-error` en español, regex en el servidor y límite de 5 envíos cada 15 minutos. Sigue pendiente el correo tapado (defecto 4 de la ronda 4).
- h7: `autoFocus` solo en el formulario principal (page.tsx:92), más `autoComplete="email"` e `inputMode="email"`. El reenvío no roba el foco (`autoFocus={false}`).
- h8: hay una sola acción primaria, y lo secundario está plegado. Le resta el check triple de "enviado".
- h9: los 5 errores dicen qué pasó y qué hacer (page.tsx:10-16).
- h10: la bajada dice qué correo usar. "Enviado" explica cuánto tarda, recomienda abrirlo en el mismo aparato y sugiere revisar spam o promociones.
- Eje 4 (uno por uno): entrada escalonada 60ms ✓ · sin re-entrada de lo que no cambió ✓ · tira que se llena y dibuja su check (firma de la ficha) ✓ · sello de la tarjeta que se dibuja después de que aparece la tarjeta ✓ · tap 0.98 ✓ · spinner ✓ · plegable de 220ms y chevron que gira ✓ · reduced-motion global, también para `.llena`, `.check-vivo` y el trazo, que queda dibujado (panel.css:148-170) ✓ · conteo y barras no aplican. → 4.
- Eje 3: Lexend + Atkinson + salvia, sin coincidir con las paletas vetadas. La tira de pasos con check es el dispositivo de la ficha (sin foto, razonable en el panel). Es un patrón de pasos todavía reconocible, así que no llega a 4.
- Eje 2: fondo #F2F4EF, tarjeta elevada con sombra tintada y campo hundido (`--surface-2`). En las capturas el campo aparece con foco (`autoFocus`), así que el nivel hundido casi no se ve.
- Eje 5: radios parejos, botón en la escala y aire de la tarjeta igualado. Quedan dos detalles de encaje: el título del plegable se corta con "mal?" solo en la segunda línea, y los tres checks de distinto tamaño están alineados a la izquierda uno bajo el otro.

### TOP DEFECTOS (lo que queda, por gravedad; ninguno bloquea)
1. [Estado "enviado", tres checks] (BAJA, h8/identidad) La marca, la tira y la tarjeta muestran el mismo check → en `entrar/page.tsx:53` cambiar `<Sello tam={44} vivo />` por un ícono neutro de sobre (`Mail` de lucide dentro del mismo círculo tintado), y dejar que la celebración la haga solo la tira.
2. [Texto "Si gi•••@gmail.com es el de…"] (BAJA, h5) Un error de tipeo a mitad de la dirección no se ve → en `acciones.ts:48-49` mostrar las 2 primeras y las 2 últimas letras del usuario (`gi•••ez@gmail.com`), o pasar el correo completo con una cookie flash de una sola lectura.
3. [Plegable de "enviado", título] (BAJA, encaje) "mal?" queda solo en la segunda línea a 375px → en `entrar/page.tsx:60` acortar a "¿No llegó o te equivocaste?" o agregar `text-balance` al `summary`.
