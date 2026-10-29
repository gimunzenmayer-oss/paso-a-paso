import { randomBytes } from 'node:crypto';
import { construirSobre, enviarResend, ErrorCorreo, type AjustesCorreo, type Sobre } from '@/lib/correos/envio';
import { PLANTILLAS, esPlantilla, type DatosCorreo } from '@/lib/correos/plantillas';
import { cifrar, descifrar, tokenBaja } from '@/lib/correos/seguridad';

export interface Trabajo {
  id: string; lease: string; template: string; contact_id: string; email: string;
  consent_at: string | null; opted_out_at: string | null; suppressed_at: string | null;
  last_engaged_at: string | null; profile_status: string | null; profile_id: string | null;
  trial_end: string | null; access_until: string | null;
  context: Record<string, unknown>; envelope: string | null; envelope_expires_at: string | null;
}
type Actual = Pick<Trabajo,'consent_at'|'opted_out_at'|'suppressed_at'|'last_engaged_at'|'profile_status'|'profile_id'|'trial_end'|'access_until'> & { ok: boolean };
export type Operar = (accion: string, datos?: Record<string, unknown>) => Promise<unknown>;
export interface DependenciasCorreo {
  operar: Operar;
  acceso: (email: string) => Promise<{ url: string; codigo: string }>;
  enviar?: typeof enviarResend;
  config: AjustesCorreo;
  llaveCifrado: string;
  secretoBaja: string;
  precobroVerificado: boolean;
  urlRegalo?: string;
  urlCheckout?: string;
  ahora?: () => number;
}
function fecha(v: string | null): number { return v ? Date.parse(v) : NaN; }
export function motivoCancelar(j: Trabajo, ahora: number): string | null {
  if (!esPlantilla(j.template)) return 'plantilla_desconocida';
  if (j.suppressed_at) return 'direccion_suprimida';
  if (PLANTILLAS[j.template].canal === 'marketing') {
    if (!j.consent_at || j.opted_out_at) return 'sin_consentimiento';
    if (ahora - fecha(j.last_engaged_at ?? j.consent_at) > 90*86400000) return 'lista_inactiva';
  }
  const s = j.profile_status;
  if (j.template === 'acceso' && !['trialing','active','past_due'].includes(s ?? '')) return 'acceso_no_habilitado';
  if (j.template === 'precobro' && (s !== 'trialing' || !Number.isFinite(fecha(j.trial_end)) || fecha(j.trial_end) <= ahora || Date.parse(String(j.context.trial_end)) !== fecha(j.trial_end))) return 'prueba_terminada_o_cambiada';
  if (j.template.startsWith('pago_fallido_') && s !== 'past_due') return 'pago_resuelto';
  if (j.template.startsWith('regreso_') && !['cancelled','expired'].includes(s ?? '')) return 'ya_regreso';
  if ((j.template.startsWith('carrito_') || j.template.startsWith('nutricion_') || j.template === 'regalo') && s && s !== 'none') return 'ya_tiene_compra';
  if (['bienvenida_d1','activacion_d3','activacion_d7'].includes(j.template) && !['trialing','active'].includes(s ?? '')) return 'sin_suscripcion';
  return null;
}

export async function procesarCorreos(d: DependenciasCorreo) {
  if (!d.config.habilitado || !d.config.dominioVerificado) return { estado: 'desactivado', enviados: 0, cancelados: 0, fallos: 0 };
  if (!/^[a-f0-9]{64}$/i.test(d.llaveCifrado) || d.secretoBaja.length<32 || !d.config.txKey) throw new Error('configuracion_incompleta');
  const marketingListo = d.config.marketing && d.config.marketingVerificado === true;
  const trabajos = await d.operar('claim',{marketing:marketingListo});
  if (!Array.isArray(trabajos)) throw new Error('cola_invalida');
  const total = { estado: 'procesado', enviados: 0, cancelados: 0, fallos: 0 };
  for (const original of trabajos as Trabajo[]) {
    const j = { ...original };
    const fin = (status: string, reason?: string, provider_id?: string) => d.operar('finish',{id:j.id,lease:j.lease,status,reason,provider_id});
    try {
      const ahora = (d.ahora ?? Date.now)();
      const actual = await d.operar('check',{id:j.id,lease:j.lease}) as Actual;
      if (!actual?.ok) continue;
      Object.assign(j,actual);
      const motivo = motivoCancelar(j,ahora);
      if (motivo || !esPlantilla(j.template)) { await fin('cancelled',motivo ?? 'plantilla_invalida'); total.cancelados++; continue; }
      const canal = PLANTILLAS[j.template].canal;
      if (canal === 'marketing' && !marketingListo) { await fin('pending','marketing_desactivado'); continue; }
      if (j.template === 'precobro' && !d.precobroVerificado) { await fin('manual','verificar_fecha_importe_hotmart'); total.fallos++; continue; }
      let sobre: Sobre;
      if (j.envelope) {
        if (fecha(j.envelope_expires_at) <= ahora || !Number.isFinite(fecha(j.envelope_expires_at))) { await fin('manual','cuerpo_vencido'); total.fallos++; continue; }
        sobre = descifrar(j.envelope,d.llaveCifrado) as Sobre;
      } else {
        const datos: DatosCorreo = { urlSitio:d.config.sitio };
        if (j.template.startsWith('carrito_')) {
          if (!d.urlCheckout) { await fin('manual','falta_checkout_mensual'); continue; }
          datos.urlCheckout=d.urlCheckout;
        }
        if (j.template === 'acceso') {
          const a = await d.acceso(j.email); datos.urlAcceso=a.url; datos.codigo=a.codigo;
        }
        if (j.template === 'recuperacion' || j.template === 'admin' || j.template === 'cuenta_eliminada') {
          // Los dos primeros los envía Supabase SMTP; el último solo tras borrado real.
          await fin('manual','requiere_evento_especifico'); continue;
        }
        if (canal === 'marketing') datos.urlBaja=`${d.config.sitio}/api/correos/baja?token=${encodeURIComponent(tokenBaja(j.contact_id,d.secretoBaja))}`;
        if (j.template === 'precobro') {
          datos.fecha=new Intl.DateTimeFormat('es-CL',{dateStyle:'long',timeStyle:'short',timeZone:'America/Santiago'}).format(new Date(j.trial_end!))+' (hora de Chile)';
          datos.importe='US$4,99 de base. Total y moneda en Hotmart';
        }
        if (j.template === 'regalo') {
          if (!d.urlRegalo) { await fin('manual','falta_recurso_aprobado'); continue; }
          datos.urlRegalo=d.urlRegalo;
        }
        if (j.template === 'confirmar') {
          const contacto = await d.operar('contact',{contact_id:j.contact_id}) as {requested_at:string|null};
          if (!contacto.requested_at) { await fin('cancelled','solicitud_no_vigente'); continue; }
          // El timestamp integra la firma: una solicitud posterior invalida la anterior.
          const token = tokenBaja(j.contact_id,`${d.secretoBaja}:confirmar:${contacto.requested_at}`);
          datos.urlConfirmacion=`${d.config.sitio}/api/correos/confirmar?token=${encodeURIComponent(token)}&fecha=${encodeURIComponent(contacto.requested_at)}`;
        }
        sobre=construirSobre(j.template,j.email,datos);
        const expires = new Date(ahora+(j.template==='acceso'?8*60_000:22*3600_000)).toISOString();
        const guardado=await d.operar('prepare',{id:j.id,lease:j.lease,envelope:cifrar(sobre,d.llaveCifrado,randomBytes(12)),expires}) as {ok:boolean};
        if (!guardado?.ok) continue;
      }
      // Revalidar justo antes del envío: bajas, reembolso o pago recuperado mientras se preparaba.
      const ultima=await d.operar('check',{id:j.id,lease:j.lease}) as Actual;
      if (!ultima?.ok) continue;
      const cancelar=motivoCancelar({...j,...ultima},(d.ahora??Date.now)());
      if (cancelar) { await fin('cancelled',cancelar); total.cancelados++; continue; }
      const idProveedor=await (d.enviar??enviarResend)(sobre,canal,j.id,d.config);
      await fin('sent',undefined,idProveedor); total.enviados++;
    } catch(e) {
      const reintentar=e instanceof ErrorCorreo && e.reintentar;
      await fin(reintentar?'pending':'manual',e instanceof ErrorCorreo?e.razon:'revisar_configuracion');
      total.fallos++;
    }
  }
  return total;
}
