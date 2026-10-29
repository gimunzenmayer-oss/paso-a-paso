# VEREDICTO revisor-visual — guia
Fecha: 2026-10-26 21:56
Screenshot: docs/revisiones/guia-375.png
Usabilidad: 37/40
Craft: 17/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Tira de fotos] El check del primer paso parece un estado completado; la condición de ejemplo solo está explícita para tecnologías de asistencia → añadir una etiqueta visible «Ejemplo de mañana». Menor, sin interacción simulada.
2. [Fondo y texto secundario] Tokens compartidos #EEF2EB/#4A5852 difieren sutilmente de #F2F4EF/#52605A de la ficha → reconciliar ficha y tokens en revisión global, sin modificar aquí el sistema común.
3. [Descarga] Progreso y fallos de transferencia dependen del navegador → considerar recuperación específica si se observa abandono; apertura alternativa y ayuda de guardado ya cubren la confusión principal.

## Ronda 2 — decisión y evidencia

Revisión independiente exclusivamente de /guia-gratis y presentación de su recurso. La ronda 1, leída antes de reemplazar este archivo, dio NO LISTA: 34/40, craft 17/20 y copy 18/20. Esta ronda puntúa de nuevo lo observado y no hereda pruebas de otro agente.

Se inspeccionaron directamente guia-375.png, guia-360.png y guia-1440.png, modificadas el 26-10-2026 a las 21:54:45, 21:54:46 y 21:54:48. Son capturas completas: su altura no representa el primer viewport. También se inspeccionó guia-recurso-pdf.png, fechada 00:42:57; la evidencia del PDF es anterior, no recién regenerada.

Se leyeron .claude/agents/revisor-visual.md, FICHA-ARTE.md, FICHA-AVATAR.md, GuiaGratis.tsx, guia.css y web/app/guia-gratis/page.tsx. Se consultaron Logo, BotonPrincipal, entrada y tokens compartidos para verificar medidas, movimiento y contraste usados aquí. No se leyeron .env ni secretos, no se enviaron correos o mensajes, no se modificó código. Única escritura: este archivo.

Pasa los tres cortes: 37 ≥36, craft 17 ≥16, copy 18 ≥16. LISTA se limita al cierre visual y de copy de la vista gratuita. No certifica publicación ni funcionamiento del sistema de correos.

## Correcciones comprobadas

- Cabecera: el enlace tiene mínimo 44 × 44 px; el SVG sigue siendo 28 px. Se corrigió el objetivo táctil, no el tamaño del dibujo. Alineación vertical centrada y horizontal izquierda, coherente con el contenido.
- Hero: 36 px, peso 700 y acento en «paso a paso». Dos líneas legibles a 360/375 y una a 1440, sin recortes visibles.
- Tira: check visible sobre Despertar; aria-label «Paso completado en este ejemplo». No expresa progreso persistido real. Falta rotular el ejemplo visualmente, observación menor.
- Recurso: instrucción explícita para guardar en celular y alternativa «Abrir el PDF», mínimo 44 px, target _blank y rel noopener. Dos accesos a la misma tarea, sin oferta competidora.

## Gate cognitivo

Sin sobrecarga crítica: tres instrucciones, tres fotos, una acción principal, cero campos obligatorios para descargar y párrafos breves. A 360 px la tercera instrucción ocupa dos líneas sin colisiones. Las fotos se presentan como contenido, no como botones. El CTA móvil requiere scroll desde el primer viewport; no se afirma que esté visible sin desplazar.

## Usabilidad /40

| Heurística | Puntos | Evidencia y límite |
|---|---:|---|
| h1 Estado | 3 | Tap 120 ms; progreso de descarga delegado al navegador. Envío opcional con texto ocupado y aria-busy, verificados en código. |
| h2 Lenguaje | 4 | Español concreto, sin jerga de implementación, culpabilización ni promesas terapéuticas. |
| h3 Control | 4 | Regreso por logo con objetivo 44 × 44 y por pie; apertura alternativa; ninguna acción destructiva ni registro obligatorio. |
| h4 Consistencia | 3 | Familias, acento y radios 18/14 coherentes; diferencias sutiles de tokens frente a ficha. |
| h5 Prevención | 4 | Descarga sin formularios. Modo opcional con email nativo requerido, consentimiento y bloqueo inmediato por referencia contra duplicados; no certifica servidor. |
| h6 Reconocimiento | 4 | Formato, una página, instrucciones, hasta seis pasos y ejemplo visibles; no exige memorizar otra pantalla. |
| h7 Eficiencia | 4 | Enlaces nativos operables por teclado, descarga/apertura, imprimir/rellenar y usar menos pasos. Verificación de código, sin prueba de teclado real. |
| h8 Minimalismo | 4 | Hero dominante, una tarea y apertura subordinada; sin desbordes visibles en las tres capturas. |
| h9 Recuperación | 3 | Ayuda y apertura alternativa presentes, sin detección propia de fallo de descarga; mensajes opcionales revisados solo en código. |
| h10 Ayuda | 4 | Enseña a elegir, escribir, anticipar, usar menos pasos y guardar; contacto de ayuda visible. |

Total: 37/40. Mejora frente a ronda 1 por control táctil, jerarquía y ayuda práctica; estado y recuperación no reciben puntuación ejemplar.

## Craft /20

Jerarquía: 4. Profundidad: 4. Identidad: 3. Movimiento: 3. Encaje: 3. Total: 17/20.

Hero 36, título 24 y cuerpo 18 distinguen prioridades; etiquetas y notas subordinadas. Fondo radial, tarjeta clara y tira hundida forman tres planos. Salvia, fotos y check extienden identidad propia; no hay clon de ejemplos canónicos. Desktop mantiene columna legible de 480 px. El check estático y el ejemplo sin rotulación visible impiden dar excelencia completa a identidad y movimiento.

Baselines comprobadas una por una en código: entrada escalonada 60 ms/300 ms presente; conteo de números héroe no aplica; dibujo de anillos/barras no aplica; tap 120 ms con scale .97 presente; tabs no aplican; modales no aplican; celebración de hitos no aplica. MotionConfig reducedMotion="user" y media query que elimina transformación/transición del tap presentes. No se vio reproducción ni se probó la preferencia del dispositivo.

CTA vivo: contraste calculado por luminancia sRGB: #EEF2EB sobre #4A765F = 4,58:1; relleno frente a #FBFCF9 = 5,04:1. :active propio, habilitado desde el inicio, mínimo 56 px y ancho completo. Pasa las cuatro anclas.

## Copy /20 y traza

Idea: 4. Especificidad: 4. Emoción: 3. Oferta: 4. Acción: 3. Total: 18/20, ningún eje ≤2.

Se puntúa por solicitud expresa como recurso gratuito: no exige precio anclado, garantía comercial ni agitación de una página de compra. Idea única: organizar un momento con hasta seis pasos. La imagen del PDF respalda una página y seis espacios; no demuestra editabilidad. «Un solo momento» responde a «no tengo tiempo» y agotamiento; fotos y «anticipa» trazan al deseo de rutinas visuales; «No hace falta organizarlo todo hoy» reduce culpa. Gratuidad y ausencia de registro coinciden con el acceso directo implementado. Hero general y CTA en infinitivo conservan emoción/acción en 3.

Message-match: no verificable sin anuncio de origen. Garantía nombrada: no aplica a una descarga sin compra.

## PDF, formularios y límites

El render del PDF muestra una página legible, tres grupos de instrucciones, seis espacios y Antes/Ahora/Después. Blanco funcional para completar; sin recortes ni claims terapéuticos. No se abrió el PDF binario ni se probaron campos, inserción de fotos, impresión, enlaces o descarga en lectores móviles.

Al revisar, las cinco guia-correo-*-375.png aún tenían fecha aproximada 01:04. No se usaron ni se reinspeccionaron como evidencia visual actual. Su regeneración paralela no está cubierta por LISTA. Se leyó el código opcional para las heurísticas pertinentes, pero esta ronda no certifica visualmente sus estados error/cargando/listo/offline/límite.

No se ejecutaron formularios, navegación, lector de pantalla, consola, build, pruebas de red ni entrega de correo. La vista base no muestra captación opcional; page.tsx la condiciona a disponibilidad. Fidelidad canónica N-A: sin imagen externa contractual aportada; sí se contrastó la ficha y se anotaron diferencias. No se actualizó ESTADO.md por la restricción de escribir exclusivamente este veredicto.
