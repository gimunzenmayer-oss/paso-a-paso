// Nombres en lenguaje claro para el panel.
export const NOMBRE_EVENTO: Record<string, string> = {
  landing_vista: 'Vieron la página de ventas',
  landing_cta_clic: 'Tocaron "Probar gratis"',
  app_abierta: 'Abrieron la app por primera vez',
  sesion_iniciada: 'Días con la app abierta',
  rutina_paso_completado: 'Pasos de rutina completados',
  rutina_completada: 'Rutinas terminadas',
  calma_usada: 'Usaron "Calma"',
  tablero_usado: 'Usaron el tablero',
  historia_leida: 'Leyeron una historia',
  diario_nota_guardada: 'Guardaron una nota en el diario',
  informe_abierto: 'Abrieron el informe',
  guia_ficha_abierta: 'Abrieron una ficha de la guía',
  onboarding_iniciado: 'Empezaron la bienvenida',
  onboarding_paso_completado: 'Pasos de bienvenida',
  onboarding_completado: 'Terminaron la bienvenida',
  onboarding_abandonado: 'Dejaron la bienvenida',
  paywall_visto: 'Vieron los precios',
  paywall_plan_elegido: 'Eligieron un plan',
  checkout_iniciado: 'Fueron a pagar',
};

export const FALTA: Record<string, string> = {
  comision_hotmart: 'la comisión de Hotmart en algunas ventas',
  impuestos: 'tu tasa de impuestos',
  infra: 'lo que pagas de servidores y base de datos este mes',
  email: 'lo que pagas por enviar correos este mes',
  ia_en_otra_moneda: 'el costo de la IA en tu moneda',
};

export const ESTADO_CLIENTE: Record<string, { texto: string; tono: 'bien' | 'aviso' | 'mal' | 'neutro' }> = {
  trialing: { texto: 'En prueba', tono: 'neutro' },
  active: { texto: 'Pagando', tono: 'bien' },
  past_due: { texto: 'Pago atrasado', tono: 'aviso' },
  cancelled: { texto: 'Canceló', tono: 'neutro' },
  expired: { texto: 'Venció', tono: 'neutro' },
  refunded: { texto: 'Reembolsada', tono: 'mal' },
  chargeback: { texto: 'Desconoció el cobro', tono: 'mal' },
  none: { texto: 'Sin compra', tono: 'neutro' },
};

export function listaHumana(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

export function plural(n: number, uno: string, varios: string): string {
  return n === 1 ? uno : varios;
}

const CANALES: Record<string, string> = {
  directo: 'Directo',
  meta: 'Meta',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  google: 'Google',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp',
  afiliado: 'Afiliadas',
  email: 'Correo',
};

export function nombreCanal(canal: string): string {
  return CANALES[canal] ?? canal.charAt(0).toUpperCase() + canal.slice(1);
}

// Pantallas de la app con el nombre que ve la mamá.
const PANTALLAS: Record<string, string> = {
  arranque: 'al abrir la app',
  inicio: 'el inicio',
  agenda: 'la agenda',
  rutina: 'una rutina',
  tablero: 'el tablero para hablar',
  temporizador: 'el temporizador',
  calma: 'el kit de calma',
  historias: 'las historias',
  diario: 'el diario',
  guia: 'la guía',
  informe: 'el informe',
  logros: 'las estrellas',
  ajustes: 'los ajustes',
};

export function nombrePantalla(p: string | null): string {
  if (!p) return 'la app';
  return PANTALLAS[p] ?? `la pantalla «${p}»`;
}
