// Copy del onboarding y del paywall: LITERAL de docs/copy/embudo.md §1 y §2 (no se reescribe aquí).
// [acento]…[/acento] y [b]…[/b] se pintan con parseMarkedCopy del kit de landing.
// Variables: {nombre}, {momento}, {crisis}, {n_pasos}, {paso_1}, {n}, {N}, {fecha_cobro}, {monto}.

import type { Plan } from '@/lib/embudo/checkout';
import type { Edad, Momento, Respuestas } from '@/lib/embudo/estado';
import { rutinaDe } from '@/lib/embudo/rutinas';

export const TOTAL_PASOS = 6;

export const COMUN = {
  /** Texto visible del botón «‹ Atrás» (el mismo de la cabecera del paywall: un solo atrás en todo
   *  el recorrido). También en «armando el plan» y en el resultado, que vuelven al compromiso.
   *  (pendiente de aprobar) · antes: solo «‹» con aria-label «Volver al paso anterior» */
  atras: 'Atrás',
  barra: 'Paso {n} de 6',
  cerrar: 'Salir y volver al inicio',
};

export const NOMBRE = {
  titulo: '¿Cómo se llama [acento]tu peque[/acento]?',
  ayuda: 'Solo lo ves tú: se queda en este teléfono.',
  /** Rótulo de la vista previa, en el plano hundido bajo el campo: para qué se pide. El error lo reemplaza. */
  porque: 'Lo usamos para nombrarlo en su rutina.',
  /** Vista previa viva de la 1.ª tarjeta de su rutina; {nombre} cambia con cada letra.
   *  (pendiente de aprobar) · antes: (no había vista previa) */
  vistaPrevia: '{nombre}, ahora: {paso_1}',
  /** {nombre} de la vista previa mientras el campo está vacío (empieza la frase: con mayúscula).
   *  (pendiente de aprobar) · antes: (no había) */
  vistaPreviaSinNombre: 'Tu peque',
  /** Delante del 2.º y el 3.º paso de la vista previa (más chicos, bajo la 1.ª tarjeta).
   *  (pendiente de aprobar) · antes: (la vista previa mostraba solo el 1.er paso) */
  vistaPreviaDespues: 'Después:',
  label: 'Nombre o apodo',
  placeholder: 'Ej. Mateo',
  boton: 'Seguir',
  saltar: 'Prefiero no decirlo',
  errorVacio: 'Escribe su nombre o toca «Prefiero no decirlo».',
  errorLargo: 'Usa un nombre o apodo de hasta 20 letras.',
};
/** Tope de la interfaz (el copy dice 20 letras; limpiarNombre corta en 30 como tope duro). */
export const MAX_LETRAS_NOMBRE = 20;

export const EDAD = {
  titulo: '¿Cuántos años tiene [acento]{nombre}[/acento]?',
};
export const OPCIONES_EDAD: readonly { id: Edad; label: string }[] = [
  { id: '2-4', label: '2 a 4 años' },
  { id: '5-7', label: '5 a 7 años' },
  { id: '8-12', label: '8 a 12 años' },
];

export const MOMENTO = {
  titulo: '¿Qué momento del día [acento]cuesta más[/acento]?',
  /** (pendiente de aprobar) · antes: Por ahí empieza su primera rutina, con fotos.
   *  «de 5 a 7»: las rutinas de rutinas.ts tienen 5, 6 y 7 pasos (lo comprueba embudo.test.mjs).
   *  El rango va con espacios duros: no se parte en «de 5 a / 7 pasos». */
  ayuda: 'Por ahí empieza su primera rutina: de\u00a05\u00a0a\u00a07\u00a0pasos, con fotos.',
};
export const OPCIONES_MOMENTO: readonly { id: Momento; label: string; subtexto: string; momento: string }[] = [
  { id: 'manana', label: 'La mañana', subtexto: 'Despertar, vestirse y salir de casa', momento: 'la mañana' },
  { id: 'comidas', label: 'Las comidas', subtexto: 'Sentarse a la mesa y probar', momento: 'la cena' },
  // (pendiente de aprobar) · antes: Volver de la escuela · El cambio de la escuela a la casa · volver de la escuela
  // (FICHA-AVATAR, Lenguaje: «el colegio»).
  { id: 'escuela', label: 'Volver del colegio', subtexto: 'Del colegio a la casa', momento: 'volver del colegio' },
  { id: 'dormir', label: 'Irse a dormir', subtexto: 'Baño, pijama y apagar la luz', momento: 'la noche' },
];

export const CRISIS = {
  titulo: 'Cuando {nombre} se desborda, ¿[acento]qué pasa[/acento]?',
  ayuda: 'Elige las que pasen. No hay respuestas malas.',
  boton: 'Seguir armando su plan',
  saltar: 'Prefiero saltar esta',
  /** Pista si toca "Seguir" sin elegir ninguna (el botón nunca se bloquea). */
  pista: 'Elige al menos una o toca «Prefiero saltar esta».',
  /** {crisis} cuando salta la pregunta. */
  porDefecto: 'se desborda',
};
// Los ids son los que se guardan en pp_onboarding.respuestas.crisis.
// Máximo 4 (carga cognitiva): "Se golpea o golpea cosas" se fusionó en "piso" y
// "Cambia cada vez" se quitó (equivale a "Prefiero saltar esta"). Un id viejo
// guardado en el teléfono ('golpea', 'cambia') se ignora: ver idsDeCrisis().
export const OPCIONES_CRISIS: readonly { id: string; label: string; corto: string }[] = [
  // «o\u00a0grita»: la palabra corta no queda sola al final de la línea («llora / o grita» en la carga).
  { id: 'llora', label: 'Llora o grita fuerte', corto: 'llora o\u00a0grita' },
  { id: 'piso', label: 'Se tira al piso o golpea', corto: 'se tira al piso o golpea' },
  { id: 'esconde', label: 'Se tapa los oídos o se esconde', corto: 'necesita esconderse' },
  { id: 'cierra', label: 'Se queda en silencio y se cierra', corto: 'se cierra' },
];

/** Las respuestas de crisis que siguen siendo opciones, en el orden en que se tocaron. */
export function idsDeCrisis(crisis: readonly string[] | undefined): string[] {
  return (crisis ?? []).filter((id) => OPCIONES_CRISIS.some((o) => o.id === id));
}

export const RECONOCIMIENTO = {
  titulo: 'Ya eres quien [acento]mejor conoce[/acento] a {nombre}',
  texto:
    'En un minuto nombraste que {momento} cuesta y qué pasa cuando {crisis}. Eso es [b]observar[/b], y es la base del [b]Método Antes, Durante y Después[/b].',
  /** Va en el plano hundido, debajo del texto. */
  texto2: 'No es falta de paciencia. Es que {nombre} no sabe qué viene, y tú no tenías a mano qué hacer.',
  boton: 'Armar su primera rutina',
};

export const COMPROMISO = {
  titulo: 'Mañana probamos la rutina de [acento]{momento}[/acento] con {nombre}',
  /** «su rutina» con espacio duro: el acento no se parte entre dos líneas (Titulo ya lleva text-balance). */
  tituloManana: 'Mañana temprano probamos [acento]su\u00a0rutina[/acento] con {nombre}',
  ayuda: '{n_pasos}\u00a0pasos con fotos, en este teléfono. Una sola rutina, un día, basta para empezar.',
  /** Debajo de la ayuda: los pasos que no entran en la tira de 3 fotos ({n} = cuántos). */
  masPasos: 'Y {n} pasos más:',
  /** El título ya dice cuándo ("Mañana…"): el botón no lo repite. */
  boton: 'Sí, la probamos',
  // (pendiente de aprobar) · antes: «Cambiar el momento» bajo el botón, en el pie (quitado: repetía
  // «Cambiar», junto al chip; una sola salida para una acción).
  /** Chip pegado a la ayuda con el momento que eligió en 1.3 (el label de la opción, en negrita).
   *  (pendiente de aprobar) · antes: (no había) */
  elegiste: 'Elegiste:',
  /** Al lado del chip: vuelve a 1.3. Es la única salida a 1.3 desde el compromiso.
   *  (pendiente de aprobar) · antes: (no había; estaba solo «Cambiar el momento» en el pie) */
  cambiarCorto: 'Cambiar',
};

export const CARGANDO = {
  titulo: 'Armando el plan de [acento]{nombre}[/acento]…',
  /** Cada línea lleva su etapa del Método (la misma de §2.1 del paywall). */
  lineas: [
    { etapa: 'Antes', texto: 'Rutina de {momento}: {n_pasos}\u00a0pasos con fotos' },
    { etapa: 'Durante', texto: 'Kit de calma para cuando {crisis}' },
    // Espacios duros tras las palabras cortas: ni «a / un toque» ni «a / su terapeuta».
    { etapa: 'Durante', texto: 'Guía «¿Momento difícil?» a\u00a0un\u00a0toque' },
    { etapa: 'Después', texto: 'Diario para contarle a\u00a0su\u00a0terapeuta' },
  ],
  /** Pantalla de transición: avanza sola al resultado, así que no da ninguna orden. */
  listo: 'El plan de {nombre} está listo.',
  /** aria-label del toque sobre la tarjeta: marca todo y pasa al resultado. (pendiente de aprobar) · antes: (no había) */
  verYa: 'Ver el plan ya',
};

export const RESULTADO = {
  titulo: 'La rutina de [acento]{momento}[/acento] de {nombre}',
  ayuda: 'Toca «¡Hecho!» en el primer paso, como lo hará {nombre} mañana.',
  hecho: '¡Hecho!',
  hechoAria: 'Marcar «{paso_1}» como hecho',
  despues: 'Así se ve cada paso cumplido, sin imprimir nada. Y cuando {crisis}, el kit de calma ya está en su plan.',
  /** 2.ª línea (16px, gris): el Después del Método. */
  diario: 'Lo que pase queda anotado para su terapeuta.',
  /** Chip propio bajo el nombre del paso 1, tras «¡Hecho!». (pendiente de aprobar: lugar) · antes: al final del texto de después */
  progreso: '1 de {n_pasos}',
  /** Etiqueta del paso 2 tras «¡Hecho!» (13px, acento): el que sigue. (pendiente de aprobar) · antes: (no había) */
  sigue: 'Sigue',
  cta: 'Quiero el plan de {nombre}',
  /** Bajo el CTA, SOLO con checkout configurado: sin él no hay prueba que activar. */
  confianza: '[b]7 días gratis[/b] · cancelas cuando quieras',
  /** Al final de la lista, en el flujo (ya no en el pie fijo). */
  app: 'Ver antes la app de ejemplo',
};

/* ── §2 Paywall en 3 páginas (/paywall) ──────────────────────────────────────── */

export const TOTAL_PAGINAS_PAYWALL = 3;

/** Lo que se cobra el día 7 según el plan (precios de §2.3). */
const MONTO = { anual: 'US$59.90 al año', mensual: 'US$7.99 al mes' } as const;

/** Un monto o una fecha no se parten entre dos líneas ("28 de / octubre", "US$7.99 al / mes"): espacios duros. */
export function sinCortes(texto: string): string {
  return texto.replace(/ /g, '\u00a0');
}

export const PAYWALL_COMUN = {
  cerrar: 'Cerrar y volver al plan',
  indicador: 'Página {n} de 3',
  /** Visible en la cabecera, antes del ✕ (13px, gris). (pendiente de aprobar) · antes: solo el aria-label */
  indicadorVisible: '{n} de 3',
  /** La misma salida en las 3 páginas (vuelve a /onboarding, su resultado).
   *  (pendiente de aprobar en las páginas 2 y 3) · antes: Ahora no */
  salida: 'Ahora no, volver a su rutina',
  /** En las 3 páginas: en la 1 vuelve a /onboarding (su resultado); en la 2 y la 3, a la página anterior (igual que el atrás del navegador). */
  atras: 'Atrás',
};

export const PAYWALL_RESUMEN = {
  titulo: 'El plan de {nombre} para [acento]{momento}[/acento] está listo',
  /** {N} = los chips de debajo (momento · edad · crisis respondidas): el número cuadra con lo que se ve.
   *  Solo con las 3: con menos, el número le resta valor. */
  subtitulo: 'Hecho con tus {N} respuestas, con el [b]Método Antes, Durante y Después[/b].',
  subtituloSinNumero: 'Hecho con lo que nos contaste, con el [b]Método Antes, Durante y Después[/b].',
  /** aria-label de los chips con sus respuestas, bajo el subtítulo. (pendiente de aprobar) · antes: (no había) */
  respuestasAria: 'Tus respuestas',
  puntos: [
    '[b]Antes[/b]: su rutina de {momento}, {n_pasos}\u00a0pasos con fotos',
    '[b]Durante[/b]: kit de calma para cuando {crisis}',
    '[b]Después[/b]: su semana anotada, lista para la terapeuta',
  ],
  /** El CTA lleva los 7 días: la línea no los repite. (pendiente de aprobar) · antes: Tu plan ya está en este teléfono. [b]Pruébalo gratis 7 días[/b]. */
  perdida: 'Tu plan ya está en este teléfono.',
  boton: 'Ver mis 7 días gratis',
};

export const PAYWALL_PRUEBA = {
  titulo: '[acento]7 días[/acento] para probarlo sin pagar',
  linea: [
    { cuando: 'Hoy', titulo: 'Su rutina de {momento}, con fotos', texto: 'El kit de calma y la guía para cuando {crisis}' },
    { cuando: 'Día 5', titulo: 'Te avisamos por correo', texto: '2 días antes de cualquier cobro' },
    // texto: (pendiente de aprobar) · antes: Solo si sigues. Cancela antes y no pagas nada
    { cuando: 'Día 7 · {fecha_cobro}', titulo: 'Empieza el cobro: {monto}', texto: 'Solo si sigues. Cancelas antes desde Hotmart y no pagas nada' },
  ],
  /** Día 7 cuando todavía no eligió plan (sin ?plan= ni plan guardado): no afirma un monto que ella no eligió.
   *  (pendiente de aprobar) · antes: Empieza el cobro: US$59.90 al año (el anual por defecto) */
  cobroSinPlan: {
    titulo: 'Empieza el cobro del plan que elijas',
    texto: `${sinCortes(MONTO.mensual)} o ${sinCortes(MONTO.anual)}. Solo si sigues. Cancelas antes desde Hotmart y no pagas nada`,
  },
  /** «si\u00a0no\u00a0te\u00a0ayuda» con espacios duros: la condición de la garantía no se parte. */
  debajo: 'Y después, 30 días de la [b]Garantía del Día Tranquilo[/b]: si\u00a0no\u00a0te\u00a0ayuda, te devolvemos todo.',
  /** {monto} del Día 7 según el plan elegido (precios de §2.3). */
  monto: MONTO,
  /** (pendiente de aprobar) · antes: Ver los planes de {nombre} */
  boton: 'Quiero ver los planes de {nombre}',
};

export const PAYWALL_PRECIO = {
  titulo: 'Días más [acento]predecibles[/acento] para {nombre}, desde hoy',
  subtitulo: 'Mañana {nombre} ya sabe qué viene. Empiezas gratis y eliges cómo seguir después.',
  /** Junto a la tira de 3 fotos de su rutina, sobre "Incluye". */
  rutinaLista: 'Su rutina de {momento} ya está armada',
  /** Qué incluye el plan (nombres de la app y de la landing §6). */
  incluyeTitulo: 'Incluye:',
  incluye: ['Su rutina con fotos', 'Kit de calma', 'Guía «Ahora mismo»', 'Diario e informe'],
  anual: {
    etiqueta: 'Mejor precio',
    nombre: 'Anual',
    precio: 'US$4.99',
    sufijo: '/mes',
    detalle: 'Se cobra US$59.90 al año · ahorras 4 meses',
    nota: 'Menos de US$0.17 al día',
  },
  mensual: {
    nombre: 'Mensual',
    precio: 'US$7.99',
    sufijo: '/mes',
    detalle: 'Se cobra cada mes · cancelas cuando quieras',
  },
  ayuda: 'En Hotmart, completa tus datos y elige «Quiero un periodo gratis».',
  /** En el flujo, junto al botón (no en el pie): la renovación del plan elegido. (pendiente de aprobar) */
  renovacion: {
    mensual: 'Se renueva automáticamente cada mes hasta que canceles.',
    anual: 'Se renueva automáticamente cada año hasta que canceles.',
  } satisfies Record<Plan, string>,
  /** Debajo de la renovación; {terminos} y {privacidad} son enlaces a /terminos y /privacidad. (pendiente de aprobar) */
  terminos: {
    texto: 'Al empezar la prueba aceptas los {terminos} y la {privacidad}.',
    terminos: 'Términos',
    privacidad: 'Política de privacidad',
  },
  /** El mismo CTA de la oferta de la landing (§6). */
  boton: 'Empezar mis 7 días gratis',
  abriendo: 'Abriendo Hotmart…',
  /** En el pie fijo, bajo el botón: una sola línea (el error de Hotmart la reemplaza). */
  garantiaCorta: '[b]Garantía del Día Tranquilo[/b] · 30 días',
  /** En el flujo, justo debajo del pie: la condición de la garantía, sin ícono ni nombre (el pie ya los lleva). */
  garantia: 'Si en 30 días no te ayuda a tener un día más predecible, te devolvemos todo.',
  confianza: ['Hoy no pagas nada · primer cobro el {fecha_cobro}', 'Cancelas en Hotmart cuando quieras'],
  pie: 'Pago seguro con Hotmart · tarjeta o medios locales',
  yaPagaste: '¿Ya pagaste? Entra aquí',
  errorAbrir: 'No se abrió Hotmart. Toca el botón otra vez o revisa si tu navegador bloqueó la ventana.',
};

/** Estado honesto mientras no existan los links de Hotmart (§2.3, "el checkout todavía no está configurado"). */
export const PAYWALL_SIN_CHECKOUT = {
  boton: 'Pagos disponibles muy pronto',
  nota: 'Todavía no abrimos los pagos. Nada se cobra desde aquí.',
  app: 'Mientras, mira la app de ejemplo',
  contacto: '¿Quieres que te avisemos? Escríbenos a',
  correo: 'hadaapps@gmail.com',
};

/* ── Variables ─────────────────────────────────────────────────────────────── */

/** Inicial en mayúscula, sin recortar con "…" (convención del copy). */
export function conMayuscula(nombre: string): string {
  return nombre.charAt(0).toLocaleUpperCase('es') + nombre.slice(1);
}

export interface Variables {
  nombre: string;
  momento: string;
  crisis: string;
  n_pasos: string;
  paso_1: string;
}

/** Arma las variables del copy a partir de las respuestas guardadas. */
export function variablesDe(r: Respuestas): Variables {
  const rutina = rutinaDe(r.momento);
  const opcionMomento = OPCIONES_MOMENTO.find((o) => o.id === (r.momento ?? 'manana'));
  const primera = OPCIONES_CRISIS.find((o) => o.id === idsDeCrisis(r.crisis)[0]);
  return {
    nombre: r.nombre ? conMayuscula(r.nombre) : 'tu peque',
    momento: opcionMomento?.momento ?? 'la mañana',
    crisis: primera?.corto ?? CRISIS.porDefecto,
    n_pasos: String(rutina.pasos.length),
    paso_1: rutina.pasos[0]?.texto ?? '',
  };
}

/** Sus respuestas como chips del resumen del paywall: momento · edad · 1.ª crisis, con el label de la
 *  opción que tocó. Solo las que respondió: si saltó una, ese chip no está (y sin respuestas, ninguno). */
export function etiquetasDeRespuestas(r: Respuestas): string[] {
  const momento = OPCIONES_MOMENTO.find((o) => o.id === r.momento)?.label;
  const edad = OPCIONES_EDAD.find((o) => o.id === r.edad)?.label;
  const crisis = OPCIONES_CRISIS.find((o) => o.id === idsDeCrisis(r.crisis)[0])?.label;
  return [momento, edad, crisis].filter((x): x is string => x !== undefined);
}

/** Variables que solo usa el paywall: {N} respuestas, {fecha_cobro} (día 7 de la prueba) y {monto} (el cobro del plan elegido). */
export interface VariablesPaywall {
  n?: string;
  N?: string;
  fecha_cobro?: string;
  monto?: string;
}

/** Reemplaza {variable} en un texto del copy. El nombre ya viene sin corchetes ni etiquetas. */
export function llenar(texto: string, v: Partial<Variables> & VariablesPaywall): string {
  return texto.replace(
    /\{(nombre|momento|crisis|n_pasos|paso_1|n|N|fecha_cobro|monto)\}/g,
    (todo, clave: keyof Variables | keyof VariablesPaywall) => v[clave] ?? todo
  );
}
