// Copy de /entrar y /cuenta: LITERAL de docs/copy/embudo.md §3 y §4 (no se reescribe aquí).
// Lo marcado (pendiente de aprobar) también está así marcado en embudo.md.
// [acento]…[/acento] se pinta con MarkedCopy del kit de landing.
// Variables: {correo}, {s}, {min}, {fecha_cobro}, {fecha_fin}.

import type { ClaveCuenta } from '@/lib/cuenta/acceso';
import type { ErrorCodigo, ErrorEnvio } from '@/lib/cuenta/formato';

export function poner(texto: string, v: Record<string, string>): string {
  return texto.replace(/\{(\w+)\}/g, (todo, clave: string) => v[clave] ?? todo);
}

export const ENTRAR = {
  logo: 'Paso a Paso, ir al inicio',
  portada: {
    etiqueta: 'Un espacio para tu familia',
    titulo: 'Un paso a la vez. Contigo.',
    texto: 'Rutinas para anticipar. Calma para acompañar. Vuelve a tu espacio, a tu ritmo.',
    seguridad: 'Usa el mismo correo de tu cuenta.',
  },
  correo: {
    titulo: 'Entra a [acento]Paso a Paso[/acento]',
    ayuda: 'Te mandamos un código de 6 dígitos. Sin contraseñas.',
    label: 'Tu correo',
    placeholder: 'ej. ana@gmail.com',
    boton: 'Enviarme el código',
    enviando: 'Enviando…',
    errorFormato: 'Revisa tu correo: parece que le falta algo (ej. ana@gmail.com).',
    /** Salida para quien llegó sin comprar (solo sin ?compra=1): pregunta · enlace → /paywall. (pendiente de aprobar) */
    sinCuenta: '¿Todavía no tienes Paso a Paso?',
    verPlanes: 'Ver planes',
  },
  compra: {
    titulo: 'Ya casi. [acento]Entra con el correo de tu compra[/acento]',
    ayuda: 'Usa el mismo correo que pusiste en Hotmart. Ahí llega tu código.',
  },
  codigo: {
    /** (pendiente de aprobar) · antes: Revisa tu correo (sin acento) */
    titulo: 'Revisa tu [acento]correo[/acento]',
    texto: 'Si {correo} tiene acceso, te llega un código de 6 dígitos. Vence en 10 minutos.',
    /** El aviso de Spam va una sola vez en este paso: aquí, y el rescate no lo repite. (pendiente de aprobar) */
    ayuda: '¿No lo ves? Busca también en Spam y Promociones.',
    label: 'Código de 6 dígitos',
    ariaCampo: 'Código de 6 dígitos que te llegó por correo',
    boton: 'Entrar',
    revisando: 'Revisando…',
    reenviarEn: 'Reenviar código en {s} s',
    reenviar: 'Reenviar código',
    reenviando: 'Enviando el código…',
    esperando: 'Un momento…',
    errorReenvio: 'No pudimos reenviar el código. Revisa tu internet y toca «Reenviar código» otra vez.',
    reenviado: 'Te mandamos otro código. Usa el más nuevo.',
    otroCorreo: 'Usar otro correo',
  },
  rescate: {
    titulo: '¿Compraste y no te llega el acceso?',
    /** El paso del Spam (spam) no se repite en el paso código, que ya lo dice bajo el texto. */
    spam: 'Busca el código en Spam y Promociones.',
    pasos: ['Usa el correo exacto de tu compra (está en el recibo de Hotmart).'],
    /** El 3.º paso lleva el correo de soporte como enlace: antes · correo · después. */
    ultimoAntes: 'Si compraste con otro correo o nada funciona, escríbenos a ',
    ultimoDespues: ' con el correo de tu compra. Lo resolvemos contigo.',
    ariaSoporte: 'Escribir a soporte, hadaapps@gmail.com',
  },
  /** Llega desde /auth/callback cuando el enlace del correo no sirvió. (pendiente de aprobar) */
  errorEnlace: 'Ese enlace ya se usó o venció. Pide un código nuevo aquí.',
  salio: 'Cerraste sesión.',
};

export const ERRORES_ENVIO: Record<ErrorEnvio, string> = {
  /** Comillas tipográficas. (pendiente de aprobar) · antes: comillas rectas */
  red: 'No pudimos enviar el código. Revisa tu internet y toca «Enviarme el código» otra vez.',
  demasiados: 'Ya te mandamos varios códigos. Espera unos minutos y revisa tu correo.',
};

export const ERRORES_CODIGO: Record<ErrorCodigo, string> = {
  incorrecto: 'Ese código no coincide. Revísalo o pide uno nuevo.',
  vencido: 'Este código ya venció: dura 10 minutos. Pide uno nuevo.',
  muchos: 'Hiciste muchos intentos seguidos. Espera {min} minutos y vuelve a intentar.',
  faltan: 'Escribe los 6 dígitos del código.',
  red: 'No pudimos revisar el código. Revisa tu internet y toca Entrar otra vez.',
};

export const CUENTA = {
  /** (pendiente de aprobar) · antes: Tu cuenta (sin acento) */
  titulo: 'Tu [acento]cuenta[/acento]',
  linea: 'Entraste con {correo}',
  bloque: 'Tu acceso',
  /** §3.3: aviso al llegar después de entrar. */
  listo: 'Listo, ya entraste.',
  hotmart: 'Gestionar o cancelar en Hotmart',
  hotmartAyuda: 'Se abre Hotmart. Ahí cambias tu tarjeta o cancelas.',
  /** Cancelada con días: ya no hay nada que cancelar. (pendiente de aprobar) · antes: Gestionar o cancelar en Hotmart */
  hotmartCancelada: 'Ver mi compra en Hotmart',
  abriendo: 'Abriendo Hotmart…',
  reactivar: 'Volver a activar',
  /** Sin compra (§3.3): nunca compró, no hay nada que «volver» a activar. (pendiente de aprobar) · antes: Volver a activar */
  verPlanes: 'Ver planes',
  /** Sin compra (§3.3): cierra la sesión en este teléfono y lleva a /entrar. (pendiente de aprobar) */
  otroCorreo: 'Entrar con otro correo',
  volverApp: 'Volver a la app',
  reintentar: 'Reintentar',
  revisando: 'Revisando…',
  cerrar: 'Cerrar sesión',
  confirmar: {
    titulo: '¿Cerrar sesión en este teléfono?',
    texto: 'Tus rutinas y tu diario se quedan aquí.',
    si: 'Sí, cerrar sesión',
    no: 'Quedarme',
  },
  /** §3.3, llegó desde ?compra=1 y Hotmart todavía no avisa. */
  enCamino: {
    titulo: 'Tu compra está en camino',
    /** Comillas tipográficas. (pendiente de aprobar) · antes: comillas rectas */
    texto: 'A veces Hotmart tarda unos minutos en avisarnos. Toca «Revisar de nuevo» en un momento.',
    boton: 'Revisar de nuevo',
  },
};

/** §4: etiqueta y detalle de cada estado. {fecha_cobro} / {fecha_fin} se llenan en el teléfono. */
export const ESTADOS: Record<ClaveCuenta, { etiqueta: string; detalle: string; detalleSinFecha?: string }> = {
  trialing: {
    etiqueta: 'Prueba gratis activa',
    detalle: 'Primer cobro el {fecha_cobro}. Si cancelas antes, no pagas nada.',
  },
  active: { etiqueta: 'Suscripción activa', detalle: 'Próximo cobro el {fecha_cobro}.' },
  past_due: {
    etiqueta: 'Hay un problema con el pago',
    detalle: 'Tu acceso sigue abierto. Revisa tu tarjeta en Hotmart para no perderlo.',
  },
  cancelada: {
    etiqueta: 'Cancelada',
    /** (pendiente de aprobar) · antes: …Si cambias de idea, vuelve a activarla. */
    detalle: 'Tienes acceso hasta el {fecha_fin}. Si cambias de idea, puedes volver a activarla en Hotmart.',
  },
  terminada: {
    etiqueta: 'Terminada',
    detalle: 'Tu acceso terminó el {fecha_fin}. Tus datos siguen en este teléfono.',
    /** Sin fecha guardada (p. ej. 'expired' sin access_until). (pendiente de aprobar) */
    detalleSinFecha: 'Tu acceso terminó. Tus datos siguen en este teléfono.',
  },
  refunded: { etiqueta: 'Reembolsada', detalle: 'Te devolvimos el pago. Tus datos siguen en este teléfono.' },
  sin_verificar: { etiqueta: 'Sin verificar', detalle: 'No pudimos revisar tu acceso ahora. Toca Reintentar.' },
  /** El copy de §3.3 (el mismo estado tenía dos textos; la dueña eligió uno). (pendiente de aprobar)
   *  antes: Sin compra con este correo · ¿Compraste con otro correo? Escríbenos a hadaapps@gmail.com. */
  sin_compra: {
    etiqueta: 'No vemos una compra con {correo}',
    detalle: 'Quizás compraste con otro correo. Revisa el recibo de Hotmart.',
  },
  /** mi_acceso() responde 'admin' a la dueña. (pendiente de aprobar) */
  admin: { etiqueta: 'Acceso de administradora', detalle: 'Siempre tienes acceso, para probar la app y dar soporte.' },
};
