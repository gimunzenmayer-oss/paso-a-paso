# Paso a Paso: arquitectura, pantallas y flujo

> Paso a Paso es una herramienta de apoyo para familias. No reemplaza el diagnóstico, la terapia ni el consejo de profesionales.

## 1. La idea en una frase

Una app que se abre desde el navegador del móvil (y se puede "instalar" en la pantalla de inicio como si fuera de una tienda), funciona sin internet y guarda todo **en el propio teléfono**, sin cuentas obligatorias, sin publicidad y sin rastreadores.

## 2. Arquitectura (explicada sin tecnicismos)

Piensa en la app como una casa con cuatro capas:

| Capa | Qué es | Con qué se construye | Por qué |
|---|---|---|---|
| **La fachada** (lo que se ve) | Pantallas, botones, pictogramas | HTML + CSS + JavaScript. En la versión final, React | Funciona en cualquier móvil o tablet con navegador, sin pasar por tiendas |
| **El armario** (dónde se guardan los datos) | Rutinas, tableros, diario, logros | IndexedDB, una "base de datos" que vive dentro del navegador del teléfono | Los datos no salen del dispositivo |
| **La caja fuerte** (cifrado) | Protege los datos de salud | Web Crypto (AES-GCM), con una clave que sale del PIN del adulto | Si alguien coge el móvil, no puede leer el diario sin el PIN |
| **El modo sin conexión** | La app sigue funcionando sin internet | "Service worker" + manifiesto PWA | En la consulta del médico o en el coche no hay que depender del wifi |

**Piezas extra:**

- **Voz:** Web Speech API, que ya viene en el móvil. Permite elegir voz de español latino (es-MX, es-US...) o de España (es-ES), según las voces instaladas en el teléfono.
- **Pictogramas:** la app no depende de una única colección. El origen de los símbolos es intercambiable: **fotos propias** de la familia (la taza real de Mateo, su cepillo...) y una colección con licencia que permita uso comercial (por ejemplo OpenMoji o Mulberry, revisando cada licencia). Los pictogramas ARASAAC (CC BY-NC-SA) **no permiten uso comercial**, así que solo podrían usarse en una versión gratuita o con permiso escrito de sus titulares. En el prototipo uso símbolos de muestra.
- **Sincronización (opcional, más adelante):** Supabase, solo si la familia lo activa, para compartir entre dos móviles (por ejemplo, mamá y papá). Los datos se cifran en el teléfono **antes** de subirlos, así el servidor nunca puede leerlos.
- **Informe PDF:** se genera en el propio teléfono y la familia decide con quién lo comparte.

### Cómo están organizados los archivos

```
paso-a-paso/app/
├── index.html        → la "estructura" de la app (marco común de todas las pantallas)
├── styles.css        → colores, tamaños y modo calma
├── manifest.webmanifest → permite instalarla en la pantalla de inicio
├── sw.js             → hace que funcione sin internet
└── js/
    ├── datos.js      → datos de ejemplo de Mateo y guardado en el teléfono
    ├── voz.js        → leer palabras en voz alta
    ├── app.js        → el "director": decide qué pantalla mostrar, modo niño y PIN
    ├── agenda.js     → módulo 1: agenda visual
    ├── tablero.js    → módulo 2: tablero de comunicación
    ├── guia-datos.js → texto de la Guía para familias
    ├── guia.js       → pantallas de la Guía para familias
    └── temporizador.js → módulo 3: temporizador visual (siguiente)
```

Cada módulo es un archivo separado. Así, si quieres cambiar algo de la agenda, se toca solo `agenda.js` sin romper lo demás.

## 3. Dos modos: adulto y niño

- **Modo adulto:** acceso a todo (crear rutinas, diario, informes, ajustes).
- **Modo niño:** solo muestra una herramienta (la agenda, el tablero o el temporizador) a pantalla completa, sin menú. Para salir hay que **mantener pulsado** el candado 2 segundos y escribir el **PIN del adulto**. Así el niño no sale por accidente.

## 4. Pantallas principales

Todas las pantallas tienen **la misma estructura**, para que sea predecible:

```
┌─────────────────────────────┐
│  ← Atrás    Título     ⚙︎   │  barra superior (siempre igual)
├─────────────────────────────┤
│                             │
│        contenido            │
│                             │
├─────────────────────────────┤
│ Inicio  Agenda  Hablar  Calma  Más │  menú inferior (alcanzable con el pulgar)
└─────────────────────────────┘
```

| # | Pantalla | Para quién | Qué hace |
|---|---|---|---|
| 1 | **Inicio** | Adulto | Saludo, rutina "de ahora", accesos rápidos, aviso de que no sustituye a profesionales |
| 2 | **Agenda visual** | Adulto + niño | Lista de rutinas; editor de pasos; vista niño paso a paso ("Ahora / Después") |
| 3 | **Tablero de comunicación** | Niño | Categorías y botones con pictograma que dicen la frase en voz alta |
| 4 | **Temporizador visual** | Adulto + niño | Círculo que se vacía, con "qué viene después" |
| 5 | **Historias sociales** | Adulto crea, niño ve | Plantillas (médico, peluquería, cumpleaños) página a página |
| 6 | **Diario** | Adulto | Registro en menos de 30 s y gráficas simples de patrones |
| 7 | **Logros** | Adulto | Línea del tiempo de avances con fecha y foto |
| 8 | **Kit de calma** | Niño + adulto | Respiración guiada, sonidos suaves, estrategias que le funcionan a Mateo |
| 9 | **Guía para familias** | Adulto | Fichas para momentos difíciles (qué es, señales, qué hacer, qué no hacer, después) y más secciones |
| 10 | **Informe** | Adulto | Elegir fechas y secciones, generar PDF, compartir con consentimiento |
| 11 | **Ajustes** | Adulto | Perfil del niño, PIN, voz, modo calma, copia de seguridad, borrar datos |

En el menú inferior hay solo 5 botones (Inicio, Agenda, Hablar, Calma, Más). Lo demás está dentro de "Más", para no saturar.

## 5. Flujo de navegación

```
Primera vez:  Bienvenida → Aviso y privacidad → Crear perfil (nombre, edad) → Elegir PIN → Inicio

Uso diario:
Inicio ──┬── Agenda ──┬── Editar rutina (adulto)
         │            └── "Empezar con Mateo" → MODO NIÑO (paso a paso) ──[candado + PIN]──→ vuelve
         ├── Hablar (tablero) ── "Dar a Mateo" → MODO NIÑO ──[candado + PIN]──→ vuelve
         ├── Calma ── Respirar / Sonidos / Estrategias (también desde modo niño)
         └── Más ──┬── Temporizador ── "Dar a Mateo" → MODO NIÑO
                   ├── Historias sociales
                   ├── Diario  →  Registro rápido (4 toques) → Gráficas
                   ├── Logros
                   ├── Recursos
                   ├── Informe PDF
                   └── Ajustes
```

## 6. Diseño sensorial y accesibilidad

- Colores suaves (verde salvia, azul niebla, arena) con contraste suficiente para WCAG 2.1 AA.
- Botones de al menos 56 × 56 px; los del niño, mucho más grandes.
- Sin sonidos automáticos: el sonido solo suena si el adulto lo activa.
- **Modo calma:** quita animaciones y sonidos, y apaga aún más los colores.
- Respeta el ajuste "reducir movimiento" del teléfono.
- Etiquetas para lector de pantalla en todos los botones, y orden lógico al navegar.
- Acciones principales abajo, para usar con una sola mano.

## 7. Privacidad y ética

- Datos en el dispositivo por defecto; nada se envía a internet.
- Diario y logros cifrados con una clave derivada del PIN.
- Compartir solo con un paso explícito ("Sí, quiero compartir este informe con…").
- Botón "Borrar todos los datos" y "Exportar copia" en Ajustes.
- Lenguaje neuroafirmativo: hablamos de **apoyos** y **necesidades**, no de "curar" ni de "malas conductas".

## 8. Plan por módulos

1. ✅ Base de la app + **Agenda visual** (este paso)
2. ✅ Tablero de comunicación
3. Temporizador visual
4. Kit de calma
5. Diario y gráficas
6. Logros
7. Historias sociales
8. ✅ Guía para familias: momentos difíciles (siguen más secciones)
9. Informe PDF
10. Cifrado completo y sincronización opcional


## Actualización: dos zonas y módulos completos

La app se divide en **Zona de la familia** (menú: Inicio, Preparar, Diario, Guía, Más) y **Espacio de Mateo** (pantalla completa, protegida con candado y PIN). Todos los módulos del plan están hechos: agenda, tablero, temporizador, kit de calma (con música creada por el propio teléfono), historias sociales, diario cifrado con gráficos, logros y estrellas, guía para familias e informe imprimible.
