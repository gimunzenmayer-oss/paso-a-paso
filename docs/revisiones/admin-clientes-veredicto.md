# VEREDICTO revisor-visual — admin-clientes
Fecha: 2026-10-21 12:00
Screenshot: docs/revisiones/admin-clientes-375.png
Usabilidad: 35/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: (1) la bajada "4 personas compraron o probaron gratis por Hotmart" se sigue leyendo como "compraron gratis" (page.tsx:112); (2) el plegable de acción de cada tarjeta ("Quitar/Dar acceso a mano") no responde al toque, a diferencia de `Plegable` y de los chips, y las dos rueditas nuevas (Buscar y chips) giran aunque la persona pidió reducir movimiento, a diferencia de `BotonEnviar` y `SelectorMes`; (3) en Ana, la línea "Puede entrar hasta el 16 ago 2027" ocupa dos líneas a 375 y el check queda centrado entre las dos, no junto a la primera (page.tsx:212); (4) a 375 los chips quedan en dos filas, con "Ya no pagan 3" solo en la segunda, y la ruedita de carga ensancha el chip tocado y puede reacomodar la fila; (5) "Dar acceso a mano" sigue sin fecha de fin: se acepta la decisión del equipo (sin inicio de sesión de clientas nada la aplicaría), pero deja h5 en 3 y queda pendiente para la etapa de Login.

---

## Ronda 5

```
VEREDICTO: NO LISTA
USABILIDAD: 35/40  (detalle: h1:4 h2:3 h3:4 h4:3 h5:3 h6:4 h7:3 h8:3 h9:4 h10:4)
CRAFT:      16/20  (detalle: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3)
COPY:       N/A (no vende)
FIDELIDAD:  N/A (sin referencia)
```

Ronda 1: 24/40 y 9/20. Ronda 2: 29/40 y 11/20. Ronda 3: 30/40 y 14/20. Ronda 4: 33/40 y 15/20. Ronda 5: 35/40 y 16/20. Sube 2 en usabilidad (h1 y h10 llegan a 4) y 1 en craft (jerarquía llega a 4). **El craft ya pasa el gate (16/20). La usabilidad queda a 1 punto (35 de 36).**

Esta ronda cerró los cuatro defectos de fondo de la ronda 4: la escala de letra coincide con la ficha, el correo se ve completo, ya no hay doble señal verde, y Buscar y los filtros muestran que están cargando. Lo que falta es corto y concreto: una frase ambigua, la respuesta al toque del plegable de acción y dos detalles de encaje. La falta de fecha de fin en "Dar acceso" se evalúa más abajo: no es lo que bloquea, pero tampoco permite que h5 suba.

## Gate de carga cognitiva

```
[✓] Cada grupo/lista ≤4-5 ítems antes de agrupar: 4 tarjetas, con filtros y conteo (tope de 100 con aviso, sin paginar)
[✓] Cada decisión ≤4 opciones: en la captura hay 3 chips. Con datos reales pueden ser 5 (Todas + 4), pero "Todas" es un reinicio, así que se acepta.
[✓] UNA acción primaria por pantalla: "Buscar" va en tono suave y el único bloque oscuro es el chip activo
[✓] No hay que recordar nada de una pantalla a otra
[✓] Ningún formulario pide >5-7 campos (motivo + casilla)
[✓] Texto por bloque ≤3-4 líneas (en "Dar acceso" a Cata o Bea, explicación + "Ojo" sigue en el límite)
[✓] El "qué sigue" es obvio: "Puede entrar" → "Quitar acceso a mano"; "Sin acceso" → "Dar acceso a mano"
[✓] Cero elementos que parezcan interactivos sin serlo
→ 0 fallas.
```

## Anclas del CTA héroe vivo (botón "Buscar")

```
[✓] Contraste ≥3:1: #22302A sobre #E6ECE5 (≈11:1). El ring #22302A al 22% lo separa del fondo
[✓] Estado tap definido: active:scale-[0.98] (interacciones.tsx:182)
[✓] Nunca deshabilitado por defecto: solo se deshabilita mientras busca (disabled={pending})
[✓] Área táctil ≥48px (min-h-12)
Nota: ahora tiene focus-visible igual que BotonEnviar y dice "Buscando…" con ruedita (interacciones.tsx:176-188).
Le falta motion-reduce:animate-none en la ruedita (línea 184), que BotonEnviar sí tiene (formularios.tsx:37).
```

## Estado de los defectos de la ronda 4

| # | Defecto ronda 4 | Estado | Evidencia |
|---|---|---|---|
| 1 | Título de tarjeta con `truncate`: el correo real perdía el dominio | **RESUELTO** | page.tsx:199-201: `[overflow-wrap:anywhere]`, y bajo 480px la cabecera pasa a `flex-col`, así que la pastilla va debajo del título (en la captura de 375, "Reembolsada", "Venció" y "Canceló" están bajo el título). A 1280 la pastilla vuelve a la derecha, centrada con el título (`min-[480px]:items-center`). No se probó con un correo de 30 caracteres en la captura, pero el código lo permite. |
| 2 | El 15 fuera de la ficha; 5 tamaños en pantalla | **RESUELTO** | En app/admin y components/admin no queda ningún `text-[15px]` ni 15px. Solo se usan 13/18/24/28/36, que es la escala del panel que la FICHA-ARTE agregó en la línea 21 (decisión del 2026-10-21). En esta pantalla se ven 4 tamaños: 36 (Clientes), 24 (título de tarjeta), 18 (cuerpo, chips, acceso, pliegue) y 13 (etiquetas, pastillas). El comentario de ui.tsx:5 ahora coincide con la ficha. |
| 3 | "Dar acceso a mano" deja el acceso sin fecha de fin | **NO RESUELTO (por decisión, aceptada con reserva)** | `cambiarEstado` sigue sin enviar una fecha (acciones.ts:30) y el "Ojo" (page.tsx:276) lo dice claro: "no vence sola: tendrás que quitárselo a mano si no paga". La decisión es razonable: sin inicio de sesión de clientas, nada aplica `access_until`, y un campo que nadie respeta sería engañoso. Por eso deja de ser un defecto TOP de esta ronda. Pero **h5 no puede pasar de 3** mientras el aviso sea la única defensa, y el "Ojo" solo aparece para reembolsos, contracargos, cancelaciones y vencimientos (page.tsx:271). Si alguien "En prueba" o "Sin compra" recibe acceso a mano, no ve ninguna advertencia. Hay que retomarlo, sí o sí, en la etapa de Login. |
| 4 | Buscar y filtros sin feedback mientras cargan | **RESUELTO** | `<Form>` de next/form (page.tsx:116) + `BotonBuscar` con `useFormStatus` ("Buscando…", ruedita y `aria-live`). Los chips llevan `<Cargando />` con `useLinkStatus` (page.tsx:155, interacciones.tsx:191-202) y un `role="status"` oculto. Detalles: la lista vieja no se atenúa, la ruedita ensancha el chip (puede reacomodar la fila a 375) y ninguna de las dos ruedas respeta reducir movimiento (defecto #2). |
| 5a | "Pagando" + "Puede entrar": doble señal verde | **RESUELTO** | page.tsx:205: la pastilla se oculta si el estado es `active` y hay acceso. En la captura, la tarjeta de dani muestra solo "✓ Puede entrar". |
| 5b | Más aire abajo que arriba en la tarjeta; pastilla mal alineada | **RESUELTO** | `-mb-2` en el `<details>` (page.tsx:257). En los recortes, el aire bajo "Quitar acceso a mano" (≈30px) y el que hay sobre el título (≈24px) quedan parejos a la vista. Pastilla: debajo en el teléfono, centrada en pantallas anchas. |
| m | La bajada "compraron o probaron gratis" se lee como "compraron gratis" | **NO RESUELTO** | page.tsx:112, sin cambios. Ahora es lo que más pesa en h2 (defecto #1). |
| m | Ana en "Ya no pagan" con "Puede entrar hasta…" sin explicación | **RESUELTO** | Al ocultar solo "Pagando", Ana conserva la pastilla "Canceló" justo encima de "Puede entrar hasta el 16 ago 2027". Se entiende sin explicación. |
| m | Sin paginación | **NO RESUELTO** | Tope de 100 con aviso (page.tsx:319-321). Con los datos de hoy no se nota. |
| f | `--text-tertiary` igual a `--text-secondary` | **NO RESUELTO** | panel.css:10, mismo #52605a. No se usa en esta pantalla. |
| n | La pestaña de arriba se cortaba a 375 | **RESUELTO** | Navegacion.tsx:9 ahora dice "Costos". En la captura de 375 caben las tres pestañas sin desplazar. |

## Verificaciones en el código

- **h1 Estado del sistema (4, antes 3):** toda acción >100ms tiene feedback inmediato. "Buscando…" con ruedita, ruedita en el chip tocado y "Guardando…" y "Deshaciendo…" en las acciones de servidor (formularios.tsx). El acceso de hoy está escrito en cada tarjeta. El aviso de resultado se limpia de la URL. Para afinar: atenuar la lista mientras llega la nueva.
- **h2 Lenguaje (3):** no hay jerga y todo está en español neutro con tuteo. Sigue la bajada ambigua (page.tsx:112). Cualquier lectora puede leer "compraron gratis" sin buscarlo, así que no llega a 4.
- **h3 Control y libertad (4):** quitar acceso pide motivo + casilla. Deshacer dice qué restaura y solo aparece mientras la base lo permite (`se_puede_deshacer`). El motivo vuelve si falla (acciones.ts:32). Para cancelar se cierra el pliegue. Pruebas automáticas: quitar → "Sin acceso"; Deshacer visible → vuelve a "Puede entrar".
- **h4 Consistencia (3):** "Buscar" ahora tiene los mismos estados que `BotonEnviar` (focus-visible, pending, active). Hay dos variantes accidentales. (a) El summary "Quitar/Dar acceso a mano" (page.tsx:260) no tiene respuesta al toque; `Plegable` sí la tiene (`active:opacity-70`, ui.tsx:142). (b) Las ruedas de `BotonBuscar` y `Cargando` (interacciones.tsx:184 y 196) siguen girando con reducir movimiento; las de `BotonEnviar` (formularios.tsx:37) y `SelectorMes` (línea 36) se detienen.
- **h5 Prevención (3):** la validación en el cliente está en español y conserva lo escrito. Hay advertencias para reembolso, contracargo y acceso terminado. Dar acceso sigue sin fecha de fin. La decisión es comprensible, pero un aviso no es prevención. El "Ojo" tampoco cubre el caso "En prueba" o "Sin compra" → acceso a mano.
- **h6 Reconocer (4):** el correo completo es el título, el acceso de hoy está escrito, los datos tienen etiqueta y los chips llevan conteo. Con el corte resuelto, el 4 se sostiene.
- **h7 Flexibilidad (3):** Enter busca (form nativo), la ✕ borra la búsqueda, los grupos vacíos se ocultan, se conserva el filtro al buscar (input hidden, page.tsx:117) y el motivo vuelve rellenado. No hay más atajos.
- **h8 Minimalista (3, sin cambio):** la doble señal verde desapareció y cada elemento se gana su lugar. Pero a 375 los 3 chips ocupan dos filas, con "Ya no pagan 3" solo en la segunda, y la bajada ocupa 2 líneas para decir algo ambiguo. Se nota sin buscarlo, aunque es menor.
- **h9 Errores (4):** cada mensaje dice qué pasó y qué hacer, también cuando se repite. Los errores de campo van bajo el campo y no se pierde lo escrito.
- **h10 Ayuda contextual (4, antes 3):** los estados vacíos enseñan, el pliegue explica cuándo usar cada acción, el "Ojo" advierte en el momento y el caso de Ana ya se explica solo con "Canceló" + "Puede entrar hasta…".
- **Eje 4 Movimiento**, revisado uno por uno:
  1. Stagger de entrada: sí, `.entra` con 300ms y 60ms entre bloques (panel.css:55-61).
  2. Conteo de números héroe: no aplica.
  3. Barras o anillos: no aplica.
  4. Tap <150ms: sí en chips, Buscar, pestañas y botones. **No** en el summary de acción (page.tsx:260).
  5. Transición de filtros: parcial. Ahora hay ruedita mientras carga. Las tarjetas nuevas entran con stagger; las que salen desaparecen de golpe.
  6. Desplegable suave: sí (`details[open] > :not(summary)`, 220ms). El chevron gira.
  7. Celebración en hito: sí, nivel bajo, como pide la ficha: el check del "Listo" se dibuja.
  - Reduced-motion: casi completo. Se apagan las animaciones, los checks quedan dibujados y las transiciones van a 0. Las dos ruedas nuevas no llevan `motion-reduce:animate-none`.
- **Ana (dato a verificar, no puntúa):** plan Mensual desde el 18 oct 2026 y "Puede entrar hasta el 16 ago 2027". Son 10 meses de acceso para un plan mensual cancelado. Son datos de prueba, pero hay que confirmar que la ingesta toma `access_until` del fin del período pagado.

## Craft, eje por eje

- **Jerarquía 4 (antes 3):** con los ojos entrecerrados se leen 4 niveles nítidos y solo 4 tamaños: "Clientes" 36 → título de tarjeta 24 → cuerpo, acceso y pliegue 18 → etiquetas y pastillas 13. Coincide con la escala de la ficha.
- **Profundidad 3:** fondo tintado #F2F4EF, tarjetas #FBFCF9 con sombra verde suave y ring, y campo de búsqueda hundido #E6ECE5 con sombra interior. Son tres niveles consistentes, pero sin un tratamiento que lo lleve a 4.
- **Identidad 3:** check salvia de la marca en "Puede entrar", Sello en el encabezado, el "Listo" que se dibuja, y Lexend + Atkinson con su 0 tachado. No es clon de los ejemplos vetados. Es propio, pero discreto.
- **Movimiento 3:** se cumplen 4 de las 5 baseline que aplican, más la ruedita nueva. Faltan la respuesta al toque del summary de acción y la salida de las tarjetas al filtrar. Las ruedas no respetan reducir movimiento.
- **Encaje 3:** los radios coinciden (tarjetas 18, botones y chips 14, pastillas redondas), los chips abrazan su contenido y el aire de la tarjeta quedó parejo. Hay tres desencajes visibles. (a) En Ana, a 375, "Puede entrar hasta el 16 ago 2027" ocupa dos líneas y el check queda centrado entre las dos (`items-center`, page.tsx:212), no junto a "Puede". (b) "Ya no pagan 3" queda solo en una segunda fila de chips. (c) La ruedita de `Cargando` ensancha el chip tocado mientras carga.

## Desvíos respecto a FICHA-ARTE

- **Escala de letra:** ahora coincide. La pantalla usa solo 13/18/24/36 y el panel completo usa 13/18/24/28/36, según la línea 21 de la ficha. Ya no hay ningún 15px.
- Paleta, familias (Lexend/Atkinson), radios 18/14, sombras tintadas y stagger de 60ms coinciden con la ficha.
- `--text-tertiary` sigue igual a `--text-secondary` (#52605A). No se usa aquí.
- El 0 tachado ("2026") viene de Atkinson Hyperlegible. Es de la ficha, no es un defecto.

## TOP DEFECTOS (lo que bloquea, por gravedad)

1. **[Bajada bajo "Clientes", page.tsx:112]** "4 personas compraron o probaron gratis por Hotmart" se lee como "compraron gratis". Es lo que deja h2 en 3. → Cambiar a `${n} personas llegaron por Hotmart: compraron o están probando gratis.` (singular: "1 persona llegó por Hotmart: compró o está probando gratis.").
2. **[Plegable de acción de cada tarjeta y ruedas nuevas: page.tsx:260; interacciones.tsx:184 y 196]** El summary "Quitar/Dar acceso a mano" no responde al toque, a diferencia de `Plegable` y de los chips. Las ruedas de Buscar y de los chips giran aunque la persona pidió reducir movimiento, a diferencia de `BotonEnviar` y `SelectorMes`. Es lo que deja h4 en 3. → Agregar `select-none active:opacity-70` al summary (o `active:scale-[0.99]`) y `motion-reduce:animate-none` a las dos `LoaderCircle`.
3. **[Línea de acceso en dos renglones (Ana), page.tsx:212]** A 375, el check queda centrado entre las dos líneas. → Cambiar `items-center` por `items-start` y darle al ícono `mt-[3px]` (o envolver el CheckTrazo en un `span` con `h-[1lh] grid place-items-center`) para que quede junto a la primera línea.
4. **[Fila de chips a 375, page.tsx:137-158]** "Ya no pagan 3" queda solo en una segunda fila, y la ruedita ensancha el chip tocado mientras carga. → Bajar el `px-3.5` a `px-3` y el `gap-2` a `gap-1.5` para que 3 chips quepan en una fila, y reservar el lugar de la ruedita (que reemplace al número mientras carga en vez de sumarse) para que la fila no salte.
5. **[Dar acceso a mano, page.tsx:271-277 + acciones.ts:30]** Sigue sin fecha de fin. No bloquea esta ronda, por la decisión del equipo, pero deja h5 en 3. → Ahora: mostrar el "Ojo" también cuando el estado es `trialing` o `none` ("queda como clienta que paga y no vence sola"). En la etapa de Login: campo "Hasta cuándo" + `p_hasta` en `admin_cambiar_estado`.

Con los defectos 1 y 2 corregidos, h2 y h4 pueden llegar a 4 (37/40). El 3 y el 4 sostienen el encaje en craft.

Otros defectos (menores):
- Sin paginación (tope de 100 con aviso).
- `--text-tertiary` sigue igual a `--text-secondary`.
- La lista vieja no se atenúa mientras carga el filtro nuevo; las tarjetas que salen desaparecen de golpe.
- Verificar el `access_until` de Ana (10 meses en un plan mensual cancelado).
