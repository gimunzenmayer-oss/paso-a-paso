// Copy del onboarding y del paywall: LITERAL de docs/copy/embudo.md §1 y §2 (no se reescribe aquí).
// [acento]…[/acento] y [b]…[/b] se pintan con parseMarkedCopy del kit de landing.
// Variables: {nombre}, {momento}, {crisis}, {n_pasos}, {paso_1}, {n}, {N}, {fecha_cobro}, {monto}.

import type { Edad, Momento, Respuestas } from '@/lib/embudo/estado';
import { rutinaDe } from '@/lib/embudo/rutinas';

export const TOTAL_PASOS = 6;

export const COMUN = {
  atras: 'Volver a la pregunta anterior',
  barra: 'Paso {n} de 6',
  cerrar: 'Salir y volver al inicio',
  logo: 'Paso a Paso, ir al inicio',
};

export const NOMBRE = {
  titulo: '¿Cómo se llama [acento]tu peque[/acento]?',
  ayuda: 'Solo lo ves tú: se queda en este teléfono.',
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
  ayuda: 'Por ahí empieza su primera rutina.',
};
export const OPCIONES_MOMENTO: readonly { id: Momento; label: string; subtexto: string; momento: string }[] = [
  { id: 'manana', label: 'La mañana', subtexto: 'Despertar, vestirse y salir de casa', momento: 'la mañana' },
  { id: 'comidas', label: 'Las comidas', subtexto: 'Sentarse a la mesa y probar', momento: 'la cena' },
  { id: 'escuela', label: 'Volver de la escuela', subtexto: 'El cambio de la escuela a la casa', momento: 'volver de la escuela' },
  { id: 'dormir', label: 'Irse a dormir', subtexto: 'Baño, pijama y apagar la luz', momento: 'la noche' },
];

export const CRISIS = {
  titulo: 'Cuando {nombre} se desborda, ¿[acento]qué pasa[/acento]?',
  ayuda: 'Elige las que pasen. No hay respuestas malas.',
  boton: 'Seguir',
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
  { id: 'llora', label: 'Llora o grita fuerte', corto: 'llora o grita' },
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
    'En un minuto nombraste su momento difícil y qué pasa cuando {crisis}. Eso es [b]observar[/b], y es la base del [b]Método Antes, Durante y Después[/b].',
  texto2: 'No es falta de paciencia. Es que {nombre} no sabe qué viene, y tú no tenías a mano qué hacer.',
  boton: 'Seguir',
};

export const COMPROMISO = {
  titulo: 'Mañana probamos la rutina de [acento]{momento}[/acento] con {nombre}',
  tituloManana: 'Mañana temprano probamos [acento]su rutina de la mañana[/acento] con {nombre}',
  ayuda: 'Una sola rutina, un día. Con eso basta para empezar.',
  boton: 'Sí, mañana la probamos',
  cambiar: 'Cambiar el momento',
};

export const CARGANDO = {
  titulo: 'Armando el plan de [acento]{nombre}[/acento]…',
  /** Cada línea lleva su etapa del Método (la misma de §2.1 del paywall). */
  lineas: [
    { etapa: 'Antes', texto: 'Rutina de {momento}: {n_pasos} pasos con fotos' },
    { etapa: 'Durante', texto: 'Kit de calma para cuando {crisis}' },
    { etapa: 'Durante', texto: 'Guía «¿Momento difícil?» a un toque' },
    { etapa: 'Después', texto: 'Diario para contarle a su terapeuta' },
  ],
  listo: 'El plan de {nombre} está listo.',
};

export const RESULTADO = {
  titulo: 'La rutina de [acento]{momento}[/acento] de {nombre}',
  ayuda: 'Toca «¡Hecho!» en el primer paso, como lo hará mañana.',
  hecho: '¡Hecho!',
  hechoAria: 'Marcar «{paso_1}» como hecho',
  despues: 'Así se ve cada paso cumplido. Sin imprimir nada.',
  progreso: '1 de {n_pasos}',
  cta: 'Seguir con el plan de {nombre}',
  app: 'Primero quiero ver la app de ejemplo',
};

/* ── §2 Paywall en 3 páginas (/paywall) ──────────────────────────────────────── */

export const TOTAL_PAGINAS_PAYWALL = 3;

export const PAYWALL_COMUN = {
  cerrar: 'Cerrar y volver al plan',
  indicador: 'Página {n} de 3',
  /** Páginas 2 y 3: vuelve a la página anterior (igual que el atrás del navegador). */
  atras: 'Atrás',
};

export const PAYWALL_RESUMEN = {
  titulo: 'El plan de {nombre} para [acento]{momento}[/acento] está listo',
  subtitulo: 'Hecho con tus {N} respuestas, con el [b]Método Antes, Durante y Después[/b].',
  puntos: [
    '[b]Antes[/b]: su rutina de {momento}, paso a paso y con fotos',
    '[b]Durante[/b]: kit de calma para cuando {crisis}',
    '[b]Después[/b]: su semana anotada, lista para la terapeuta',
  ],
  perdida: 'Tu plan ya está en este teléfono. Falta activarlo.',
  boton: 'Ver cómo funciona la prueba',
  salida: 'Ahora no',
};

export const PAYWALL_PRUEBA = {
  titulo: '[acento]7 días[/acento] para probarlo sin pagar',
  linea: [
    { cuando: 'Hoy', titulo: 'Acceso completo', texto: 'Su rutina, el kit de calma y la guía' },
    { cuando: 'Día 5', titulo: 'Te avisamos por correo', texto: '2 días antes de cualquier cobro' },
    { cuando: 'Día 7 · {fecha_cobro}', titulo: 'Empieza el cobro: {monto}', texto: 'Solo si sigues. Cancela antes y no pagas nada' },
  ],
  debajo: 'Y después, 30 días de la [b]Garantía del Día Tranquilo[/b].',
  /** {monto} del Día 7 según el plan elegido (precios de §2.3). */
  monto: { anual: 'US$59.90 al año', mensual: 'US$7.99 al mes' },
  boton: 'Ver precios',
  salida: 'Ahora no',
};

export const PAYWALL_PRECIO = {
  titulo: 'Días más [acento]predecibles[/acento] para {nombre}, desde hoy',
  subtitulo: 'Empiezas gratis. Eliges cómo seguir después.',
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
  /** El mismo CTA de la oferta de la landing (§6). */
  boton: 'Empezar mis 7 días gratis',
  abriendo: 'Abriendo Hotmart…',
  /** Justo bajo el botón: la garantía con su condición (landing §7). */
  garantia:
    '[b]Garantía del Día Tranquilo[/b]: si en 30 días no te ayuda a tener un día más predecible, te devolvemos todo.',
  confianza: ['Hoy no pagas nada · primer cobro el {fecha_cobro}', 'Cancelas en Hotmart cuando quieras'],
  pie: 'Pago seguro con Hotmart · tarjeta o medios locales',
  salida: 'Ahora no',
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
