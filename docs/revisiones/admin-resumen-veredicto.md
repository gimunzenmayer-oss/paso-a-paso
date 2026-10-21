# VEREDICTO revisor-visual — admin-resumen
Fecha: 2026-10-21 12:00
Screenshot: docs/revisiones/admin-resumen-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) en el embudo, la barra mide contra el paso 1 y el texto contra el paso anterior: "2 de 2 siguieron" aparece con media barra, y las filas usan 2 maquetaciones distintas (cifra al lado o debajo) según el largo de la etiqueta · 2) a 375 la frase héroe (28 px) pesa lo mismo que el título de su sección "Cuánto te quedó" (28 px) y repite "Facturaste US$79,70", que ya está en la primera fila · 3) quedan dos maquetaciones de cifra en Ventas ("Bajas del mes" con la cifra apilada), "Facturaste (sin reembolsos)" sigue partida en 2 líneas y el impuesto dice "10% de lo cobrado" · 4) los atajos saltan a una sección cuyo título queda medio tapado por la cabecera fija (scroll-mt de 112 px contra una cabecera de ~125 px) y no hay forma de volver al índice · 5) la nota del plazo de recuperación es una frase sin verbo y sin el monto base ("lo que te costó cada clienta, con lo que paga una clienta promedio al mes"), y siguen las palabras sueltas en cortes de línea: "hora de / Chile", "30 / días", "por / qué"

---

**RONDA 5.** Se puntúa lo que se ve hoy. Rondas anteriores: R1 23/40 · 7/20, R2 27/40 · 9/20, R3 28/40 · 14/20, R4 31/40 · 15/20.

```
VEREDICTO: NO LISTA
USABILIDAD: 32/40  (detalle: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:4 h10:4)
CRAFT:      15/20  (detalle: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3)
COPY:       N/A (no vende)
FIDELIDAD:  N/A (sin referencia)
```

Umbral: ≥36/40 y ≥16/20. Faltan 4 puntos en usabilidad y 1 en craft. **NO LISTA.**

Esta ronda resolvió bien los defectos estructurales de la ronda 4. Hay un solo componente de pliegue con respuesta al toque, "Personas" se unió con "Uso", los atajos se llaman como sus secciones, el embudo tiene línea y plural correcto, la escala de letra coincide con la ficha y desapareció el 15 px. Eso sube h10 a 4 y deja h4 y h8 sin defectos grandes.

Lo que impide llegar a 36 son defectos de precisión, no de estructura. El embudo mezcla dos bases. La frase héroe empata con su título a 375. Hay cortes de línea que dejan palabras sueltas. Los atajos dejan el título bajo la cabecera. La nota del plazo no se entiende sin hacer la cuenta. Cada uno resta en una heurística distinta (h5, h4, h7, h2, h6) y, con ellos presentes, ninguna de esas heurísticas puede subir a 4.

## GATE DE CARGA COGNITIVA

```
[✓] Cada grupo/lista ≤4-5 ítems: 5 atajos, 4 cifras de Ventas, 3 canales, 4 pasos del embudo, 2 fallas.
[✓] Cada decisión ≤4 opciones: "Ver otro mes…" es navegación (11 meses), no una decisión.
[✓] Una acción primaria: el enlace del aviso ("Ver gasto en anuncios").
[✓] Nada que recordar entre pantallas: el aviso trae los montos en juego.
[✓] Campos: no aplica.
[✓] Texto por bloque ≤3-4 líneas: justo en el límite. A 375 ocupan 4 líneas la bajada de "Uso de la app", la de "Fallas que vio la gente" y el "En juego" del aviso.
[✓] El "qué sigue" es obvio: aviso → qué hacer → enlace a Costos.
[✓] Nada parece interactivo sin serlo: los atajos son anclas reales y los pliegues se abren.
→ 0 fallas.
```

## Estado de los defectos de la ronda 4

| # | Defecto ronda 4 | Estado | Evidencia hoy |
|---|---|---|---|
| 1 | Embudo: "2 · 2 de 4 siguió" (número repetido, singular), fila partida, check que no distingue nada | **RESUELTO (con un defecto nuevo)** | `graficos.tsx` L88-100: dice "**2** de 4 siguieron", sin repetir el número y en plural. La línea vertical une los pasos (L103-107) y los círculos llevan el número en vez de un check sin sentido. Defecto nuevo (top 1): la barra mide contra el paso 1 (`primero`, L124) y el texto contra el anterior, así que "Abrieron la app 2 de 2 siguieron" lleva media barra. Además, `flex-wrap` (L116) pone la cifra al lado en el paso 3 y debajo en los pasos 2 y 4: son 2 maquetaciones en 4 filas. |
| 2 | 4 estilos de pliegue y ninguno responde al toque | **RESUELTO** | Hay un solo `Plegable` (`ui.tsx` L123-150) con `min-h-12`, `active:opacity-70` y chevron que gira, usado en los 5 lugares. Tiene 2 variantes documentadas: `caja` fuera de una tarjeta y línea dentro de una tarjeta. Es una regla, no un accidente. Residual: los títulos con caja se parten y dejan sueltas "días" y "qué" (top 5). |
| 3 | Títulos de sección y cifras empatados en 24 px; 6 tamaños | **PARCIAL** | La escala es 13/18/24/28/36, como la ficha (2026-10-21), y el h2 pasó a 28 (`ui.tsx` L10), por encima de la cifra de 24. Pero a 375 la frase héroe mide `text-[28px]` (`page.tsx` L506, recién sube a 36 con `sm:`) y empata con el h2 "Cuánto te quedó" justo encima (top 2). |
| 4 | Sección "Personas" para una cifra, atajos con otro nombre, media fila vacía a 1280 | **RESUELTO** | "Usaron la app" ahora vive dentro de "Uso de la app". `SECCIONES` (`page.tsx` L59-65) tiene 5 atajos con el mismo texto que sus h2. Las 2 columnas solo se aplican si existe `p.uso.onboarding` (L335), y a 1280 el embudo ocupa todo el ancho. |
| 5 | El plazo usa el ingreso promedio sin decirlo; "Facturaste" contra "cobraste" | **PARCIAL** | La nota ahora dice "con lo que paga una clienta promedio al mes" (`page.tsx` L172), pero es una frase sin verbo y sin el monto (US$8,50), así que la dueña tiene que buscar ese número en otra tarjeta (top 5). El cálculo sigue igual (`20261021100000_cac_canales_con_gasto.sql` L484, `v_cac / v_arpu`). Verbo: la bajada ya dice "facturaste" (L267), pero el impuesto sigue diciendo "10% de lo **cobrado**" (L546). La fila "Facturaste (sin reembolsos)" (L540) se sigue partiendo en 2 líneas a 375 (top 3). |
| — | Cifra héroe "US$0,00" antes de hidratar | **PARCIAL** | El `<noscript>` de `app/admin/layout.tsx` L14-16 resuelve el caso sin JavaScript, y reducir movimiento lo resuelve `panel.css` L148-154. Con JavaScript activo pero lento, o si falla después de cargar, el HTML del servidor sigue trayendo `useState(0)` (`MontoVivo.tsx` L12, `.monto-anim` en L33-35) y la frase dice "te quedaron US$0,00 limpios" hasta que hidrata. |
| — | "Bajas del mes" apila etiqueta y cifra; las otras ponen la cifra a la derecha | **NO RESUELTO** | `page.tsx` L576-583: "2 clientas" a 24 px va debajo de la etiqueta, mientras las 4 `Cifra` de arriba van en fila a 375 (top 3). |
| — | "Intentar de nuevo" pierde `?mes=` | **NO RESUELTO** | `page.tsx` L86: `href="/admin"`. |
| — | Bajada de "Fallas que vio la gente" en 4 líneas | **NO RESUELTO** | `page.tsx` L740. Ocupa 4 líneas a 375, justo en el límite. |
| — | Fechas legibles | **RESUELTO** | `formato.ts` L37-63 da "20 de octubre, 21:45" en reloj de 24 horas y hora de Chile. Se ve en la cabecera, en Avisos de pago y en Fallas. |

## Verificaciones en código (h1, h3, h7, eje 4)

- **h1 (3):** `loading.tsx` muestra un esqueleto con `role="status"` y `aria-live`. `SelectorMes` usa `useTransition`, se deshabilita y muestra un spinner con `aria-live`. También está "Actualizado … hora de Chile" y el error trae reintento. No es 4 porque, con JS lento, la cifra héroe sale en US$0,00 en el HTML del servidor (ver tabla).
- **h3 (3):** no hay acciones destructivas en la pantalla. Los pliegues se cierran, la nav lleva `aria-current` y "Salir" está siempre visible. Sin cambios.
- **h7 (3):** hay atajos a cada sección con el mismo nombre que su título, `?mes=` se puede guardar y el aviso lleva directo a `/admin/costos#anuncios`. No es 4 por dos razones. `scroll-mt-28` (112 px, `ui.tsx` L9) es menor que la cabecera fija: `app/admin/(privado)/layout.tsx` L14-33 suma pt-3 + fila de 48 + gap 8 + nav de 48 + pb-2 ≈ 125 px, así que al saltar la parte de arriba del h2 queda bajo la cabecera, que es 92% opaca. Además, después de saltar no hay forma de volver al índice.
- **Eje 4 (3), las 7 baseline una por una:**
  1. Stagger de entrada: SÍ, `.entra` con 60/120/180/240 ms (`panel.css` L55-61).
  2. Conteo de la cifra héroe: SÍ, 600 ms con ease-out cúbico tras 200 ms, ancho reservado y sin parpadeo. El HTML del servidor parte en 0 (ver h1).
  3. Barras que se dibujan: SÍ, `crece-x`/`crece-y` de 300 ms con 60 ms de escalonado (embudo, bajas, gráfico).
  4. Tap <150 ms: SÍ. Ahora también los pliegues (`active:opacity-70`), además de la nav, los atajos, "Salir", el reintento y el enlace del aviso.
  5. Transición de tabs: PARCIAL. Solo `transition-[background-color,transform]` en la nav. El cambio de página no tiene transición propia.
  6. Despliegues suaves: SÍ, `details[open] > :not(summary)` en 220 ms.
  7. Celebración en hitos: SÍ, en nivel bajo: `check-vivo` en las pastillas "bien" y en el sello. El embudo ya no anima sus círculos: se llenan de salvia sin `llena`, a diferencia de la `TiraPasos` de `ui.tsx` L184-231.

  Reduced-motion: SÍ, todo se anula en `panel.css` L148-171 (incluido `MontoVivo`).
- **Ficha:** la paleta de `panel.css` L5-16 coincide exacta. Display en Lexend, cuerpo en Atkinson. Radios 18/14 (tarjetas y pliegues con caja en `--radius-card`; pastillas y atajos en full). Sombra tintada. La escala de letra usada (13/18/24/28/36, contada con grep en page.tsx, components/admin y layout) coincide con la línea del panel de la ficha, sin otros tamaños. El salvia aparece solo en la cifra héroe, las barras, la tira y los checks. No hay desvíos TOP. Anti-clon: no aplica, la paleta es la propia de la app.

## TOP DEFECTOS (ordenados por impacto)

1. **[Uso de la app → embudo "De la página de ventas a la primera rutina"]** La barra mide contra el paso 1 (`graficos.tsx` L124, `width: personas / primero`) y el texto contra el paso anterior (L91-94). "Abrieron la app · 2 de 2 siguieron" dice "todas" con media barra, y la dueña lee que la mitad se perdió ahí. Además, `flex flex-wrap` (L116) pone la cifra al lado de la etiqueta en el paso 3 y debajo en los pasos 2 y 4, y el paso 1 dice solo "4", sin unidad. → En los pasos 2-4, la barra mide contra el anterior: `width: (100 * p.personas) / Math.max(1, prev ?? primero)`, para que coincida con "N de M siguieron". La cifra va siempre en su propia línea debajo de la etiqueta: cambiar `flex flex-wrap … justify-between` por `flex flex-col`, o `whitespace-nowrap` en la etiqueta y la cifra siempre a la derecha. El paso 1 dice "4 personas".

2. **[Cuánto te quedó → frase héroe a 375]** `page.tsx` L506: `text-[28px] … sm:text-[36px]`. A 375, la frase más importante de la página tiene el mismo tamaño que su título de sección "Cuánto te quedó" (`ui.tsx` L10, 28 px) y ocupa 3 líneas. "Facturaste US$79,70" se repite tal cual 3 cm más abajo, en la primera fila. → Héroe a `text-[36px]` en todos los anchos y acortarlo a "Te quedaron **US$39,03** limpios." (o "Perdiste …"). Lo facturado ya está en la primera fila del desglose. Así quedan los niveles página 36 · héroe 36 dentro de la tarjeta · sección 28 · cifra 24, sin empate entre vecinos.

3. **[Ventas y desglose a 375: "Bajas del mes", "Facturaste (sin reembolsos)", "10% de lo cobrado"]** "Bajas" (`page.tsx` L576-583) apila la etiqueta y "2 clientas", mientras las 4 cifras de arriba ponen la cifra a la derecha. Son dos maquetaciones para el mismo tipo de dato en la misma sección. La fila L540 "Facturaste (sin reembolsos)" se parte en 2 líneas y deja "US$79,70" arriba, sola. L546 sigue diciendo "de lo cobrado". → En Bajas, poner la etiqueta y "2" en una sola fila `grid-cols-[1fr_auto]`, como `Cifra`. En L540, `texto="Facturaste" nota="sin reembolsos"`, igual que Impuestos. En L546, `de lo facturado`.

4. **[Atajos del índice → salto a sección]** `ui.tsx` L9: `scroll-mt-28` (112 px) contra una cabecera fija de ~125 px (`app/admin/(privado)/layout.tsx` L14-33). Al tocar "Anuncios", el título queda cortado bajo la cabecera, y después no hay forma de volver al índice. → `scroll-mt-36` (144 px) y, al final de cada `Seccion` o de la página, un enlace "↑ Volver al índice" (`href="#indice"`, `min-h-11`, `active:opacity-70`) con `id="indice"` en el `<nav>` de los atajos (`page.tsx` L252).

5. **[Anuncios → "Lo recuperas en 23,5 meses" · cortes de línea]** La nota (`page.tsx` L172) "lo que te costó cada clienta, con lo que paga una clienta promedio al mes" no tiene verbo ni monto, y para entenderla hay que buscar US$8,50 en otra tarjeta (h2/h6). Además, quedan palabras sueltas en cortes de línea a 375: "hora de / Chile" (L242), "Ver todo lo que hicieron · 30 / días" (L357), "8 cifras todavía sin datos · por / qué" (`ui.tsx` L159-162) y "Pasan a pagar tras la / prueba" (L125). → Nota: `` `${dinero(n.cac, m)} ÷ ${dinero(arpu, m)} que paga al mes una clienta promedio` `` (exponer `arpu` desde la RPC o calcularlo como `mrr / pagando_hoy`). Envolver "hora de Chile", "· 30 días" y "· por qué" en `whitespace-nowrap`, añadir `text-balance` al `summary` de `Plegable` y acortar la etiqueta a "Pagan tras la prueba".

### Defectos secundarios (fuera del top 5)
- [Cifra héroe antes de hidratar] Con JS activo pero lento, el HTML del servidor muestra "US$0,00" (`MontoVivo.tsx` L12, L33-35). → El servidor pinta `.monto-fijo` visible por defecto, y la animación se activa solo con un atributo puesto en `useEffect` (p. ej. `data-vivo` en el contenedor, con `[data-vivo] .monto-anim{display:inline}` y `[data-vivo] .monto-fijo{display:none}`).
- [Error de carga] `page.tsx` L86: "Intentar de nuevo" pierde el mes. → `href={mesPedido === meses[0] ? '/admin' : `/admin?mes=${mesPedido}`}`.
- [Fallas que vio la gente] La bajada (L740) ocupa 4 líneas. → "Si una falla se repite o le pasa a varias, pídele a Claude que la arregle con el detalle técnico."
- [Embudo sin firma animada] Los círculos ya no se llenan con `llena` ni muestran el check de la marca. → Aplicar `llena` con `--retraso` al fondo salvia del círculo cuando `llego`, como en `TiraPasos`.
