# VEREDICTO revisor-visual — landing (ronda 1)
Fecha: 2026-10-20
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40 · Craft: 12/20 · Copy: 16/20 · Fidelidad: N-A
Veredicto: NO LISTA
Top defectos: 1) correo placeholder en footer/garantía; 2) CTA final 2.66:1 sobre fondo oscuro; 3) sin dispositivo ownable ni check animado, faltan 3/7 baselines de movimiento; 4) oferta con precio triplicado, nota huérfana, "gratis" ambiguo y moneda sin aclarar; 5) footer con separador huérfano y hero card-en-card con captura duplicada.
Secundarios: h1 con renglón débil; objeción "no tengo tiempo" ausente del hero; "te lían" (España) mezclado con "celular"; sin "Entrar"; plan elegido se pierde; dots 24px; base/elevado casi iguales; desalineación a 1440.

---

## Ronda 2
Fecha: 2026-10-20 · Revisor: revisor-visual (independiente)
Screenshots: docs/revisiones/landing-375.png (base del puntaje), landing-360.png, landing-1440.png (reduced motion, animaciones en estado final)
Código: web/app/page.tsx, web/components/landing/*.tsx, web/components/landing/tokens.css, web/lib/marca.ts

**Usabilidad: 35/40 · Craft: 14/20 · Copy: 18/20 · Fidelidad: N-A**
**Veredicto: NO LISTA** (falta 1 punto de usabilidad y 2 de craft; copy pasa)

Artefactos de captura que NO cuento: el botón "N" del modo dev de Next y la barra sticky superpuesta en el hero (captura de página completa; la lógica de IntersectionObserver en código es correcta).

### Estado de los defectos de la ronda 1
| # | Defecto ronda 1 | Estado |
|---|---|---|
| 1 | Correo placeholder en footer/garantía | PENDIENTE DE LA DUEÑA (no cuenta) |
| 2 | CTA final 2.66:1 sobre fondo oscuro | ARREGLADO: #22302A sobre #8CC0A3 = 6.68:1 |
| 3 | Sin dispositivo ownable ni check animado, faltan baselines | ARREGLADO: tira de pasos con foto y check que se llena, conteo del precio, stagger, sticky que sube. Quedan detalles (ver J y K) |
| 4a | Precio triplicado | PARCIAL: "$0.17 al día" sigue dos veces (título y bajo el precio) |
| 4b | Nota huérfana | ARREGLADO (se quitó), pero el total tachado quedó sin "lo que pagas" al lado (ver F) |
| 4c | "Gratis" ambiguo | ARREGLADO ("Empieza gratis. Luego…" + "Hoy no pagas nada") |
| 4d | Moneda sin aclarar | ARREGLADO (USD/mes, US$59.90) |
| 5a | Separador huérfano en el footer | ARREGLADO (rejilla 2×2 en móvil) |
| 5b | Hero card-en-card con captura duplicada | ARREGLADO, pero aparece un rectángulo de brillo con borde duro (ver B) |
| s1 | H1 con renglón débil | PARCIAL: a 375 "sabrás" queda sola en una línea; a 360 "Días" queda sola y el H1 ocupa 5 líneas |
| s2 | Objeción "no tengo tiempo" ausente del hero | ARREGLADO ("lista en 2 minutos") |
| s3 | "te lían" mezclado con "celular" | ARREGLADO ("te confunden más") |
| s4 | Sin "Entrar" | PENDIENTE (todavía no hay login, no cuenta) |
| s5 | El plan elegido se pierde | ARREGLADO (?plan=anual / ?plan=mensual) |
| s6 | Dots de 24px | ARREGLADO (44px) |
| s7 | Base y elevado casi iguales | ARREGLADO (#EEF2EB / #FBFCF9 se distinguen) |
| s8 | Desalineación a 1440 | NO ARREGLADO (ver G) |

### Usabilidad /40 (Nielsen, sobre el render a 375 + código)
1 Estado del sistema 3 [código+render]: sticky en dos estados correcto; a 1440 el dot activo no coincide con el frame centrado.
2 Lenguaje 4 [render] · 3 Control y libertad 4 [código] · 5 Prevención 4 [código]: ?plan= se conserva, el sticky lleva a la oferta antes de vender, "Hoy no pagas nada".
4 Consistencia 3 [render]: CTA anual en w-auto y mensual a ancho completo (1440); botón sticky de 48px y el resto de 52; acento salvia sobre una frase de dolor.
6 Reconocer 3 [render]: el total tachado ($116) no tiene al lado lo que se paga.
7 Flexibilidad 4 [código] · 9 Errores 4 [código]: las rutas legales existen; /onboarding es temporal y está aceptado.
8 Estético 3 [render]: rectángulo del hero con borde duro, $0.17 repetido, garantía en 4 líneas; a 360 se rompe el CTA anual.
10 Ayuda 3 [render]: el FAQ no trae la objeción de precio, que el 19 §8 exige siempre.

### Craft /20
Jerarquía 3 (orden claro hero → sub → CTA; muchos tamaños de texto) · Profundidad 3 (alternancia, sombras tintadas, hairlines y radial; el brillo del hero corta en seco y las tarjetas antes/después casi no se distinguen) · Identidad 3 (tira de pasos con foto y check: es propia, pero aparece una sola vez y chica; el hero no la usa) · Movimiento 3 (stagger, conteo, check, sticky y reduced-motion bien; el FAQ y los dots no responden al toque; el check arranca en scale(0)) · Encaje óptico **2** (CTA anual partido en 2 líneas a 360; a 1440 el CTA anual no está centrado y el carrusel arranca con un vacío a la izquierda; los enlaces del footer van corridos 4px).
Anclas binarias de conversión: énfasis del titular ✓ · hairline + chips SVG ✓ · secciones distinguibles ✓.

### Copy /20 (idea 4 · especificidad 3 · emoción 4 · oferta 3 · acción 4) = 18
Presupuesto: sub 13 ✓ · problema ≤11 ✓ · agitación ≤2 líneas ✓ · pasos del mecanismo en 2 líneas a 375 ✗ · garantía en 4 líneas a 375 ✗ · FAQ ✓ · H2 final 5 ✓. Fallan 2 secciones de 3: pasa.
Sub-checks: garantía con nombre ✓ (en el cierre; bajo el CTA anual va sin nombre) · énfasis ✓ · message-match N-A (todavía no hay anuncio).

### Defectos restantes, por orden de impacto (con arreglo)
A. **[ALTO] A 360 el CTA "Empezar mis 7 días gratis" se parte en 2 líneas**, alineado a la izquierda y apretado dentro de los 52px. En `ui.tsx` CtaButton: cambiar `px-8` por `px-5 sm:px-8` y agregar `text-center leading-tight whitespace-nowrap`. Otra opción es acortar el label a "Empezar 7 días gratis".
B. **[ALTO] Rectángulo de brillo con borde duro detrás del teléfono del hero** (salto de color #EEF2EB a #DFE7DF en el borde de arriba; a 1440 se ven los 4 lados). En `page.tsx` VisualHero: cambiar `ellipse_at_50%_30%` por `radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_16%,transparent),transparent)`, o agregar `[mask-image:radial-gradient(closest-side,black,transparent)]` al contenedor.
C. **[ALTO] El visual del hero no vende la promesa.** El tablero para hablar no muestra "días predecibles" y el botón flotante de inicio tapa la tarjeta "Quiero música" (el label se ve cortado). Hay que intercambiar: el hero usa `/capturas/rutina.jpg` (paso con foto + "¡Hecho!", el dispositivo de la marca) y el frame 2 del carrusel pasa a ser `tablero.jpg` con el label "Pide lo que necesita con fotos".
D. **[ALTO, 1440] Desalineaciones de escritorio.** (1) En `Oferta.tsx`, el CTA anual va a ancho completo como el mensual: agregar una prop `full` a CtaButton (`w-full`). (2) En `AppPorDentro.tsx`: usar `md:px-5 md:justify-center` en la pista, o una rejilla de 5 columnas a partir de md. Para el dot activo, calcularlo con onScroll: `Math.round(scrollLeft / 270)` (ancho de frame + gap), en vez de "la última entrada que intersecta".
E. **[MEDIO] Precio repetido.** Quitar `descomposicionDia` de la card anual (el título ya dice "menos de $0.17 al día").
F. **[MEDIO] Ancla del stack sin cierre.** Pasar `nota: 'Tú pagas US$59.90 al año. Los primeros 7 días, nada.'`.
G. **[MEDIO] Garantía en 4 líneas.** Condición: "Si en 30 días no tienes [b]un día más predecible[/b], escríbenos y te devolvemos todo. Sin preguntas." (17 palabras, 3 líneas). Bajo el CTA anual, nombrarla: "Hoy no pagas nada · Garantía del Día Tranquilo".
H. **[MEDIO] FAQ sin la objeción de precio** (19 §8: siempre). Agregar: "¿Vale lo que cuesta?" → "Son [b]menos de $0.17 al día[/b], menos que una hoja plastificada. Y si no te sirve, te devolvemos todo." (Si se quiere mantener el tope de 6 preguntas, juntar las dos de apps.)
I. **[MEDIO] H1 a 360/375.** `text-[36px] md:text-[60px]` (la ficha permite 36-44) y espacios que no se cortan en "sabrás qué hacer". Así queda "Días predecibles / y, en la crisis, / sabrás qué hacer" en 3 líneas.
J. **[MEDIO] Antes/después de Solución casi idénticos** (6% de acento contra surface-2). En la card "Con Paso a Paso", usar `bg-[var(--surface)]` con `<Hairline>` y `<CheckCustom/>` delante del texto.
K. **[BAJO] "te confunden más" va en acento salvia** (el acento queda para CTA, la palabra que vende y los checks): cambiar `[acento]` por `[b]`.
L. **[BAJO] Feedback de toque.** Botón del FAQ: `active:bg-[var(--chip-bg)]`. Dots: `active:scale-90`. Check de la tira: `initial={{scale:0.4, opacity:0}}` en vez de scale 0 (DESIGN-CORE #15).
M. **[BAJO] Footer.** Quitar `px-1` del enlace o poner `-mx-1` en el `<ul>` (hoy va corrido 4px respecto del logo). A 1440 los "·" quedan bajos: agregar `leading-none self-center`. PS: `borderColor: 'var(--accent-on-dark)'` (hoy da 2.66:1).

### Pendiente de la dueña (no cuenta como defecto)
Correo, nombre y país de soporte en `web/lib/marca.ts` (y "nuestro correo de soporte" en la garantía) · testimonios (prohibido inventarlos) · /onboarding como redirección temporal a la app · "Entrar" cuando exista el login · **configurar 30 días de garantía en Hotmart** antes de publicar (la página promete 30).

Proyección: con A-D arreglados, usabilidad 36-37 y craft 16-17. Con E-J, copy 19.

---

## Ronda 3
Fecha: 2026-10-20 · Revisor: revisor-visual (independiente)
Screenshots: docs/revisiones/landing-375.png (base del puntaje), landing-360.png, landing-1440.png + recortes s-1440-oferta/app y s-360-oferta/app (reduced motion, estado final)
Código: web/app/page.tsx, web/components/landing/*.tsx, web/lib/marca.ts

**Usabilidad: 38/40 · Craft: 17/20 · Copy: 19/20 · Fidelidad: N-A**
**Veredicto: LISTA** (pasa los tres cortes: ≥36, ≥16, ≥16). Antes de publicar falta lo que depende de la dueña (ver abajo).

No cuento como defectos: el botón "N" del modo dev, la barra sticky sobre el hero ni la sticky con el label comercial en s-360-app (en la captura la oferta ya se había visto).

### Estado de los defectos de la ronda 2
| # | Defecto | Estado |
|---|---|---|
| A | CTA anual partido a 360 | ARREGLADO: una línea y centrado a 360 y a 375 (px-5 sm:px-8, whitespace-nowrap) |
| B | Rectángulo de brillo con borde duro en el hero | ARREGLADO: radial closest-side, sin bordes a 375 ni a 1440 |
| C | El visual del hero no vende la promesa | ARREGLADO: el hero usa rutina.jpg (paso con foto + "¡Hecho!") y tablero.jpg pasa al frame 2 con "Pide lo que necesita con fotos" |
| D | Desalineaciones a 1440 | ARREGLADO: el CTA anual va a ancho completo (prop `full`), el carrusel arranca en el frame del medio sin hueco y el dot se calcula con onScroll. Aparece un detalle nuevo (ver N1) |
| E | Precio repetido | ARREGLADO ($0.17 solo en el título de la oferta; luego una vez en el FAQ de precio, que es correcto) |
| F | Ancla del stack sin cierre | ARREGLADO ("Tú pagas US$59.90 al año. Los primeros 7 días, nada.") |
| G | Garantía en 4 líneas, y sin nombre bajo el CTA | ARREGLADO: 3 líneas a 375, y "Hoy no pagas nada · Garantía del Día Tranquilo" |
| H | FAQ sin la objeción de precio | ARREGLADO ("¿Vale lo que cuesta?", 6 preguntas) |
| I | H1 con renglón débil | ARREGLADO: 3 líneas parejas a 360 y a 375 |
| J | Antes y después casi iguales | ARREGLADO: la card "después" va en surface, con hairline y check, y se distingue |
| K | "te confunden más" en acento | ARREGLADO (ahora en [b]) |
| L | Feedback de toque | ARREGLADO: el FAQ tiene active:bg, los dots active:scale-90 y el check arranca en scale 0.4 |
| M | Footer | PARCIAL: el corrimiento de 4px está arreglado y el PS usa accent-on-dark. A 1440 los "·" siguen bajos y con más aire a la izquierda que a la derecha (ver N2) |

### Usabilidad /40
1 Estado 4 [código+render]: el dot sigue la posición del scroll y la sticky tiene dos estados · 2 Lenguaje 4 [render] · 3 Control 4 [código] · 4 Consistencia **3** [render]: a 1440 las columnas cambian de eje entre secciones (Problema en una columna centrada de 620, Solución en una de 780 alineada a la izquierda); la sticky mide 48 y el resto 52 · 5 Prevención 4 [código] · 6 Reconocer 4 [render]: el stack cierra con "Tú pagas" · 7 Flexibilidad 4 [código] · 8 Estético **3** [render]: detalles de lupa (N1-N4) · 9 Errores 4 [código] · 10 Ayuda 4 [render]: el FAQ trae la objeción de precio.

### Craft /20
Jerarquía 3 (orden claro, pero más de 3 tamaños de texto) · Profundidad 3 (base, elevado y hundido bien; el stack de valor no lleva sombra y las cards de plan sí) · Identidad **4** (el paso con foto y "¡Hecho!" está en el hero, la tira de pasos con check en Solución y las fotos son reales: no se puede intercambiar con otra app) · Movimiento **4** (stagger, conteo del precio, check que se llena, sticky que sube, altura del FAQ, feedback de toque, reduced-motion) · Encaje óptico 3 (375 limpio; quedan detalles a 1440 y en la captura del hero).
Anclas binarias: énfasis del titular ✓ · hairline + chips SVG ✓ · secciones distinguibles ✓.

### Copy /20 (idea 4 · especificidad 4 · emoción 4 · oferta 4 · acción 3) = 19
Presupuesto: solo falla 1 sección (los pasos del mecanismo ocupan 2 líneas a 375); el resto pasa.
Acción 3: el CTA del hero ("Probar gratis con mi peque") no dice cuántos días de prueba, y la oferta usa otro verbo ("Empezar mis 7 días gratis").

### Defectos que quedan (todos BAJO; no bloquean)
N1. **Carrusel a 1440: separaciones desparejas y teléfono descentrado.** El label "¿Cómo me siento?" cuando no salen las palabras mide unos 285px y ensancha su columna. Por eso hay unos 20px entre los frames 2 y 3 y unos 54px entre el 3 y el 4, y el teléfono del medio queda unos 17px a la izquierda del eje del título y del CTA. Arreglo en `AppPorDentro.tsx`: poner `w-[250px]` en el wrapper `shrink-0 snap-center` y `text-balance` en el label, que pasa a 2 líneas.
N2. **Puntos del footer a 1440.** Cambiar el "·" de texto por `<span aria-hidden className="mx-2 inline-block size-[3px] rounded-full bg-[var(--text-tertiary)] self-center" />` y quitar `sm:gap-x-1`, para que el aire quede igual a los dos lados.
N3. **Captura del hero:** la fila de 7 miniaturas se parte en 6+1 y la mochila queda sola en la segunda fila. Volver a capturar rutina.jpg con una rutina de 6 pasos, o con un ancho donde quepan los 7.
N4. **Ceros tachados de Atkinson** en las cifras chicas ("$1Ø", "US$59.9Ø", "3Ø días"): en precios se ven técnicos. Poner `[font-family:var(--font-display)]` en los valores del stack, en "Se cobra…" y en "Tú pagas…" (o activar en la fuente la variante de cero sin barra, si la tiene).
N5. **Pasos del mecanismo en 2 líneas a 375** (presupuesto de copy). Acortar: "Rutinas e historias con fotos, listas." · "Respirar, contar y música, en un toque." · "Anotas y llevas el informe a terapia."
N6. La primera línea del stack ocupa 3 renglones a 375 y "meses)" queda sola. Cambiarla por "Paso a Paso con el Método, 12 meses".
N7. A 360, bajo el CTA anual, el "·" queda al final del primer renglón. Cambiar el separador por un salto de línea en móvil (`<br className="sm:hidden"/>`) o usar nbsp antes del "·".
N8. La sticky sigue visible cuando el CTA de "La app por dentro" está en pantalla, y quedan dos botones iguales uno encima del otro. Agregarle un id al bloque de ese CTA y observarlo también en StickyCtaMobile.

### Pendiente de la dueña (no cuenta como defecto)
Testimonios (prohibido inventarlos) · /onboarding como redirección temporal · "Entrar" cuando exista el login · **configurar 30 días de garantía en Hotmart antes de publicar** (la página promete 30; si no, hay que cambiar el copy). Los datos de la dueña (HadaApps, Chile, hadaapps@gmail.com) ya están puestos y se ven en el footer.
