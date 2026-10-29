# VEREDICTO revisor-visual — entrada
Fecha: 2026-10-25 21:24
Screenshot: docs/revisiones/entrada-375.png
Usabilidad: 37/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos: Sin defectos bloqueantes pendientes dentro del alcance de esta ronda.

## Salida de rúbricas

VEREDICTO: LISTA
USABILIDAD: 37/40 (detalle: h1:3 h2:4 h3:4 h4:4 h5:3 h6:4 h7:4 h8:3 h9:4 h10:4)
CRAFT: 16/20 (detalle: jerarquía:3 profundidad:3 identidad:4 movimiento:3 encaje:3)
COPY: N/A (no vende)
FIDELIDAD: N/A (sin referencia)

Ronda 3: reevaluación limitada a los cuatro defectos pendientes de ronda 2. Supera el doble gate de 36/40 y 16/20. LISTA corresponde a la revisión visual local de /entrar; no certifica autenticación ni entrega de correo en producción.

## Comprobación de los cuatro defectos

1. Mensaje durante ocupado: CORREGIDO EN CÓDIGO. Reenviar muestra ENTRAR.codigo.esperando («Un momento…») cuando ocupado es verdadero; ya no afirma que envía otro código durante la verificación. Evidencia: web/components/cuenta/Entrar.tsx:75 y web/components/cuenta/textos.ts:50. No se ejecutó ni capturó esa transición en esta ronda.
2. Bienvenida móvil: CORREGIDA SU DOMINANCIA EXCESIVA. En entrada-375.png, la tarjeta empieza aproximadamente en y=322, frente a y=355 en ronda 2; el CTA queda aproximadamente en y=565–621. En entrada-360.png la tarjeta empieza aproximadamente en y=348, frente a y=381. El código confirma h2 de 28 px, fotos de 56 px, relleno de tira 12 px, margen inferior 16 px y cabecera 64 px para móvil. La bienvenida sigue siendo más grande que el título funcional (28 frente a 24 px), pero ahora la diferencia es moderada y no se interpone en el paso código. Se mantiene jerarquía en 3: buena, no ejemplar.
3. Firma visual de la tira: CORREGIDA. Check verde visible en primera foto tanto a 375 y 360 como a 1440 px. El código lo coloca dentro de la tira aria-hidden; no agrega una afirmación textual de progreso personal. La combinación foto de rutina, secuencia con flechas y paso marcado completa el dispositivo propio descrito por FICHA-ARTE.md. Identidad pasa de 3 a 4 por recuperar la firma concreta del producto de forma consistente entre tamaños, no por añadir un ícono genérico aislado. Se evalúa la identidad del conjunto junto a la ficha, sin afirmar exclusividad mundial de ese recurso.
4. Captura compra incompleta: CORREGIDA LA EVIDENCIA. entrada-compra-375.png ahora muestra la tira, el check y el título de bienvenida, seguidos del párrafo y la tarjeta. No persiste el hueco con elementos invisibles observado en ronda 2. Se acredita esta imagen final, no el funcionamiento interno del script ni todos los estados posibles de compra.

## Base conservada de la ronda 2

Usabilidad permanece en 37/40: no se infiere un salto a ejecución ejemplar por corregir el texto pendiente sin observar tiempos reales. Se mantienen los 3 de estado, prevención y minimalismo por las limitaciones de observación temporal y los ajustes menores ya anotados: campo editable durante petición, botón secundario deshabilitado sin cambio visual propio y bienvenida aún prominente en correo. Son observaciones menores, no bloqueantes.

Craft: jerarquía 3, profundidad 3, movimiento 3 y encaje 3 conservados. La única subida numérica es identidad 3→4, sustentada arriba. Se mantiene la lectura anterior de superficies con profundidad, espaciado coherente y CTA reconocible; sin inventar nueva evidencia de movimiento o centrado del código, cuyo campo sigue vacío en la imagen.

Baseline conservadas: entrada escalonada implementada; conteo heroico N/A; anillos/barras N/A; tap 120 ms declarado en BotonPrincipal sin resaltado; tabs N/A, transición entre pasos con AnimatePresence; modales N/A; celebración N/A en acceso. Reducción de movimiento implementada según la lectura de ronda 2, no reprobada en ejecución. No se penaliza la ausencia de animaciones que no corresponden a esta tarea.

CTA vivo: se conserva la verificación anterior de altura 56 px, ancho completo, habilitado inicial, hover/tap definidos y contraste calculado de tokens #4A765F contra #FBFCF9 = 5.04:1. No se repitió el cálculo ni se midió latencia real en esta ronda.

Carga cognitiva: los cambios inspeccionados no introducen decisiones ni campos nuevos. Se conserva el resultado de ronda 2, sin sobrecarga crítica. No se aplican copy de venta ni fidelidad externa contractual.

## Evidencia y límites

Imágenes abiertas en esta ronda:
- docs/revisiones/entrada-375.png
- docs/revisiones/entrada-360.png
- docs/revisiones/entrada-1440.png
- docs/revisiones/entrada-codigo-375.png
- docs/revisiones/entrada-compra-375.png

Código inspeccionado para estos defectos: web/components/cuenta/entrada.css; bloques de mensaje pendiente y tira de web/components/cuenta/Entrar.tsx; textos correspondientes en web/components/cuenta/textos.ts. Rúbricas y fichas conservadas de lecturas previas: .claude/agents/revisor-visual.md, FICHA-ARTE.md y FICHA-AVATAR.md.

entrada-error-375.png no se reabrió en esta ronda limitada. No se ejecutó navegación, build, tests ni autenticación. Los resultados de pruebas comunicados por la usuaria no se presentan como verificación propia. Las capturas de página no prueban visibilidad sin scroll en cualquier alto de teléfono ni comportamiento con teclado abierto. Sin referencia externa y sin penalizar el indicador de Next de desarrollo.

Todas las rutas son relativas a C:/Users/dulce/OneDrive/Desktop/claude/App1/paso-a-paso-traspaso/. Solo se actualizó docs/revisiones/entrada-veredicto.md; sin modificaciones de código ni otros archivos.
