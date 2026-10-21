// Forma exacta de lo que devuelve public.admin_panel() (supabase/migrations/*panel*).
// null = el dato todavía no existe → el panel muestra "Sin datos", nunca un 0 inventado.
type N = number | null;
export type Aviso = {
  nivel: 'alto' | 'medio';
  tipo: string;
  que: string;
  porque: string;
  hacer: string;
  // Solo en "canal_pierde": lo que está en juego ese mes.
  gasto?: N;
  ingresos?: N;
  ganancia?: N;
  clientes_nuevos?: number;
};
export type Canal = { canal: string; gasto: N; clientes_nuevos: number; ingresos: N; cac: N; ltv: N; ratio: N; ganancia: N };
export type Paso = { paso: string; personas: number };

export type Panel = {
  mes: string;
  moneda: string;
  zona: string;
  generado: string;
  avisos: Aviso[];
  ventas: {
    hay_ventas: boolean;
    facturado: number;
    te_paga_hotmart: number;
    reembolsado: number;
    compras: number;
    renovaciones: number;
    reembolsos: number;
    contracargos: number;
    cancelaciones_voluntarias: number;
    cancelaciones_involuntarias: number;
    activos_inicio_mes: number;
    churn_pct: N;
    churn_voluntario_pct: N;
    churn_involuntario_pct: N;
    mrr: N;
    pagando_hoy: number;
    pruebas_iniciadas: number;
    prueba_a_pago: { pct: N; base: number };
    otras_monedas: { moneda: string; te_paga: number; ventas: number }[];
    serie: { mes: string; neto: N }[];
  };
  ganancia: {
    facturado: number;
    hotmart: number;
    afiliados: number;
    impuestos: N;
    tasa_impuestos_pct: N;
    ia: N;
    usa_ia: boolean;
    infra: N;
    email: N;
    otros: N;
    queda: number;
    margen_pct: N;
    faltan: string[];
    estimacion: boolean;
  };
  clientes: {
    total: number;
    en_prueba: number;
    activos: number;
    pago_atrasado: number;
    cancelados: number;
    expirados: number;
    reembolsados: number;
    nuevos_mes: number;
    regresos_mes: number;
    pct_regresos: N;
  };
  negocio: {
    arpu: N;
    churn_promedio_pct: N;
    ltv: N;
    gasto_adquisicion: N;
    cac: N;
    nuevos_con_anuncios: number;
    ltv_cac: N;
    payback_meses: N;
    canales: Canal[];
  };
  usuarios: {
    personas: number;
    hoy: number;
    semana: number;
    mes: number;
    activacion: { pct: N; base: number };
    retencion: Record<'d1' | 'd7' | 'd30', { pct: N; base: number }>;
    curr: { pct: N; base: number };
    pagadores_fantasma: N;
  };
  uso: {
    accion_principal: { hoy: number; semana: number; mes: number };
    eventos: { tipo: string; veces: number; personas: number }[];
    embudo: Paso[];
    onboarding: Paso[] | null;
  };
  ia: {
    usa_ia: boolean;
    costo_mes_usd: N;
    costo_hoy_usd: N;
    por_feature: { feature: string; costo_usd: number; llamadas: number }[];
    por_usuario_usd: N;
  };
  salud: {
    errores: { mensaje: string; pantalla: string | null; veces: number; personas: number; ultima: string }[];
    errores_7d: number;
    webhook: {
      ultimo_aplicado: string | null;
      recibidos_7d: number;
      aplicados_7d: number;
      duplicados_7d: number;
      rechazados_7d: number;
      no_autorizados_24h: number;
      errores_24h: number;
      nunca_recibido: boolean;
    };
    sentry: null;
    diferencias_hotmart: null;
  };
};
