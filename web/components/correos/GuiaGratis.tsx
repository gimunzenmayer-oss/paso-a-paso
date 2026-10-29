'use client';
import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Check, Download, FilePenLine } from 'lucide-react';
import { motion, MotionConfig } from 'motion/react';
import { Logo } from '@/components/landing/Logo';
import { Miniatura, BotonPrincipal, entrada } from '@/components/embudo/ui';
import { pasosConFoto, rutinaDe } from '@/lib/embudo/rutinas';
import './guia.css';

export function GuiaGratis({ correoDisponible }: { correoDisponible: boolean }) {
  const [estado, setEstado] = useState<'inicio'|'enviando'|'listo'|'error'>('inicio');
  const [error, setError] = useState('');
  const bloqueo = useRef(false);
  const correo = useRef<HTMLInputElement>(null);
  async function solicitar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (bloqueo.current) return;
    const form = new FormData(e.currentTarget);
    if (form.get('consentimiento') !== 'on') { setError('Marca la casilla si quieres recibir la hoja y los cinco consejos. También puedes descargarla sin dar tu correo.'); setEstado('error'); return; }
    bloqueo.current = true; setEstado('enviando'); setError('');
    try {
      const r = await fetch('/api/correos/recurso', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:form.get('email'),consentimiento:true,sitioWeb:form.get('sitioWeb')}) });
      if (!r.ok) throw new Error(r.status === 429 ? 'Recibimos varias solicitudes seguidas. Espera una hora o descarga la hoja directamente.' : 'No pudimos pedir el correo. Intenta otra vez o descarga la hoja directamente.');
      setEstado('listo');
    } catch(e) {
      setError(!navigator.onLine ? 'No hay conexión. Vuelve a intentarlo cuando tengas internet.' : e instanceof Error ? e.message : 'No pudimos pedir el correo. Intenta otra vez.'); setEstado('error');
    } finally { bloqueo.current = false; }
  }
  return <MotionConfig reducedMotion="user"><div className="guia-pagina">
    <header><Link href="/" aria-label="Paso a Paso, volver al inicio"><Logo /></Link></header>
    <main>
      <motion.div {...entrada(0)}>
        <p className="guia-etiqueta">Un momento del día, a tu ritmo</p>
        <h1>Una rutina, <span>paso a paso</span></h1>
        <p className="guia-intro">Una hoja gratuita para ordenar hasta seis pasos. Rellénala en tu lector de PDF o imprímela.</p>
      </motion.div>
      <motion.section {...entrada(1)} className="guia-hoja" aria-labelledby="guia-hoja-titulo">
        <div className="guia-icono"><FilePenLine size={28} aria-hidden="true" /></div>
        <p className="guia-etiqueta">PDF rellenable · 1 página</p>
        <h2 id="guia-hoja-titulo">Mi primera rutina</h2>
        <ol className="guia-beneficios">{['Elige un solo momento.', 'Escribe una acción por paso.', 'Anticipa lo que viene después.'].map(t=><li key={t}><Check size={20} aria-hidden="true" />{t}</li>)}</ol>
        <div className="guia-tira" aria-label="Ejemplo de una rutina de mañana">
          {pasosConFoto(rutinaDe('manana').pasos,3).map((p,i)=><div key={p.texto}><div className="guia-foto"><Miniatura paso={p} tamano={40} />{i===0 && <span className="guia-check" aria-label="Paso completado en este ejemplo"><Check size={12} aria-hidden="true" /></span>}</div><span>{p.texto}</span></div>)}
        </div>
        <a className="guia-descargar" href="/recursos/mi-primera-rutina.pdf" download><Download size={22} aria-hidden="true" />Descargar la hoja gratis</a>
        <p className="guia-nota">Sin registro ni tarjeta. Puedes usar solo los pasos que necesites.</p>
        <p className="guia-nota">Si el PDF se abre en tu celular, usa «Compartir» o «Descargar» para guardarlo.</p>
        <a className="guia-abrir" href="/recursos/mi-primera-rutina.pdf" target="_blank" rel="noopener">Abrir el PDF</a>
      </motion.section>
      {correoDisponible && <section className="guia-correo">
        <details><summary>¿Prefieres recibirla por correo?</summary>
          {estado === 'listo' ? <div role="status"><h2>Revisa tu correo</h2><p>Si la dirección puede recibir nuestros mensajes, llegará una confirmación. Tócala para recibir la hoja y los consejos. Revisa también Spam.</p><button className="guia-otro" onClick={()=>setEstado('inicio')}>Usar otro correo</button></div> : <form onSubmit={solicitar}>
            <label htmlFor="correo-recurso">Tu correo</label>
            <input ref={correo} id="correo-recurso" type="email" name="email" autoComplete="email" required maxLength={254} disabled={estado==='enviando'} aria-describedby={estado==='error'?'error-recurso':undefined} />
            <div hidden aria-hidden="true"><label>Tu sitio web<input name="sitioWeb" tabIndex={-1} autoComplete="off" /></label></div>
            <label className="guia-permiso"><input type="checkbox" name="consentimiento" disabled={estado==='enviando'} />Quiero recibir la hoja y una serie de cinco consejos de Paso a Paso. Puedo darme de baja cuando quiera.</label>
            <p>Usaremos tu correo para estos mensajes, según la <a href="/privacidad">Política de privacidad</a>.</p>
            {estado==='error' && <p id="error-recurso" role="alert" className="guia-error">{error}</p>}
            <BotonPrincipal type="submit" disabled={estado==='enviando'} ariaBusy={estado==='enviando'}>{estado==='enviando'?'Pidiendo tu correo…':'Recibir mi hoja y los consejos'}</BotonPrincipal>
          </form>}
        </details>
      </section>}
      <p className="guia-cierre">No hace falta organizarlo todo hoy. Un momento es un comienzo.</p>
    </main>
    <footer><Link href="/">Conocer Paso a Paso</Link><Link href="/privacidad">Privacidad</Link><a href="mailto:hadaapps@gmail.com">Pedir ayuda</a></footer>
  </div></MotionConfig>;
}
