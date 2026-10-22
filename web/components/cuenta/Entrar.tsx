'use client';

// /entrar — correo → código de 6 dígitos (docs/copy/embudo.md §3). Mismo sistema que el
// embudo (components/embudo/ui.tsx): título con acento, campo de 56px, CTA en PieFijo,
// salidas secundarias de 48px. El estado vive en la acción del servidor (app/entrar/acciones.ts);
// el correo no pasa por la URL. Al entrar, la acción pone la sesión (cookies) y aquí se
// navega a /cuenta (el proxy ya ve la sesión nueva en esa petición).

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MotionConfig } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { entrar, type EstadoEntrar } from '@/app/entrar/acciones';
import { Logo } from '@/components/landing/Logo';
import { Ayuda, BotonPrincipal, BotonTexto, PieFijo, Titulo } from '@/components/embudo/ui';
import { codigoCompleto, DIGITOS_CODIGO, ESPERA_REENVIO_S, limpiarCodigo, normalizarCorreo } from '@/lib/cuenta/formato';
import { SOPORTE_EMAIL } from '@/lib/marca';
import { ENTRAR, ERRORES_CODIGO, ERRORES_ENVIO, poner } from './textos';

type Accion = 'pedir' | 'reenviar' | 'verificar' | 'otro';

// Sin internet la acción del servidor no responde (lanza): se muestra el error de red del paso
// en que estaba, nunca una pantalla rota.
async function entrarConRed(previo: EstadoEntrar, form: FormData): Promise<EstadoEntrar> {
  try {
    return await entrar(previo, form);
  } catch {
    const accion = form.get('accion');
    if (previo.paso === 'codigo' && accion === 'verificar') return { ...previo, reenviado: false, error: 'red', errorEnvio: undefined };
    if (previo.paso === 'codigo' && accion === 'reenviar') return { ...previo, reenviado: false, error: undefined, errorEnvio: 'red' };
    if (previo.paso === 'codigo' && accion === 'otro') return { paso: 'correo', correo: previo.correo };
    return { paso: 'correo', correo: String(form.get('email') ?? ''), error: 'red' };
  }
}

const [antesCorreo, despuesCorreo] = ENTRAR.codigo.texto.split('{correo}');

const CLASE_CAMPO =
  'h-14 w-full rounded-[var(--radius-button)] border bg-[var(--surface)] px-4 text-[18px] text-[var(--text-primary)] shadow-[var(--shadow-1)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-2 focus:border-[var(--accent-2)]';
const BORDE_NORMAL = 'border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)]';
const BORDE_ERROR = 'border-2 border-[var(--error)]';

function MensajeError({ id, texto }: { id: string; texto: string | null }) {
  // La región existe siempre (vacía no ocupa alto) para que el lector de pantalla anuncie el error.
  return (
    <p id={id} role="alert" className="mt-2 text-[16px] leading-[1.45] font-semibold text-pretty text-[var(--error)] empty:hidden">
      {texto}
    </p>
  );
}

/* Cuenta regresiva para reenviar (Supabase deja un código cada 60 s por correo). Se monta de
   nuevo con cada código enviado (key = enviadoEn) y arranca en 60. */
function Reenviar({ onReenviar, ocupado }: { onReenviar: () => void; ocupado: boolean }) {
  const [s, setS] = useState(ESPERA_REENVIO_S);
  useEffect(() => {
    const t = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  if (s > 0 || ocupado) {
    return (
      <p className="mx-auto flex min-h-12 items-center justify-center px-4 text-center text-[16px] text-[var(--text-secondary)] tabular-nums">
        {poner(ENTRAR.codigo.reenviarEn, { s: String(s) })}
      </p>
    );
  }
  return <BotonTexto onClick={onReenviar}>{ENTRAR.codigo.reenviar}</BotonTexto>;
}

function Rescate() {
  return (
    <details className="group mt-8 rounded-[var(--radius-card)] bg-[var(--surface-2)] px-4">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 py-2 text-[16px] font-semibold text-[var(--text-primary)] [&::-webkit-details-marker]:hidden">
        {ENTRAR.rescate.titulo}
        <ChevronDown size={20} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <ol className="list-decimal space-y-2 pb-4 pl-5 text-[16px] leading-[1.45] text-[var(--text-secondary)]">
        {ENTRAR.rescate.pasos.map((p) => (
          <li key={p}>{p}</li>
        ))}
        <li>
          {ENTRAR.rescate.ultimoAntes}
          <a
            href={`mailto:${SOPORTE_EMAIL}`}
            aria-label={ENTRAR.rescate.ariaSoporte}
            className="inline-flex min-h-12 items-center font-bold break-all text-[var(--text-primary)] underline underline-offset-4"
          >
            {SOPORTE_EMAIL}
          </a>
          {ENTRAR.rescate.ultimoDespues}
        </li>
      </ol>
    </details>
  );
}

export function Entrar({ compra, aviso }: { compra: boolean; aviso: 'enlace' | 'salio' | null }) {
  const [estado, despachar, pendiente] = useActionState(entrarConRed, { paso: 'correo', correo: '' });
  const [enviada, setEnviada] = useState<Accion | null>(null);
  const [errorLocal, setErrorLocal] = useState<'formato' | 'faltan' | null>(null);
  const [codigo, setCodigo] = useState('');
  const formCodigo = useRef<HTMLFormElement>(null);

  const router = useRouter();
  useEffect(() => {
    if (estado.paso === 'listo') router.replace(estado.destino);
  }, [estado, router]);

  function despacharAccion(accion: Accion, extra: Record<string, string> = {}) {
    const f = new FormData();
    f.set('accion', accion);
    f.set('compra', compra ? '1' : '0');
    for (const [k, v] of Object.entries(extra)) f.set(k, v);
    setEnviada(accion);
    setErrorLocal(null);
    startTransition(() => despachar(f));
  }

  function alPedir(e: FormEvent<HTMLFormElement>) {
    const correo = new FormData(e.currentTarget).get('email');
    if (!normalizarCorreo(correo)) {
      e.preventDefault();
      setErrorLocal('formato');
      return;
    }
    setEnviada('pedir');
    setErrorLocal(null);
  }

  function alVerificar(e: FormEvent<HTMLFormElement>) {
    // Del formulario y no del estado: al completar los 6 dígitos se envía antes de volver a pintar.
    if (!codigoCompleto(limpiarCodigo(new FormData(e.currentTarget).get('codigo')))) {
      e.preventDefault();
      setErrorLocal('faltan');
      return;
    }
    setEnviada('verificar');
    setErrorLocal(null);
  }

  const ocupado = pendiente || estado.paso === 'listo';
  const textos = compra ? ENTRAR.compra : ENTRAR.correo;

  let contenido;
  if (estado.paso === 'correo') {
    const errorServidor = pendiente ? undefined : estado.error;
    const error =
      errorLocal === 'formato' || errorServidor === 'formato' ? ENTRAR.correo.errorFormato : errorServidor ? ERRORES_ENVIO[errorServidor] : null;
    contenido = (
      <form key="correo" action={despachar} onSubmit={alPedir} noValidate className="flex flex-1 flex-col">
        <input type="hidden" name="accion" value="pedir" />
        <input type="hidden" name="compra" value={compra ? '1' : '0'} />
        <div className="flex-1">
          <Titulo texto={textos.titulo} enfocar={false} />
          <Ayuda id="ayuda-correo">{textos.ayuda}</Ayuda>
          <label htmlFor="correo" className="mt-8 block text-[16px] font-semibold text-[var(--text-primary)]">
            {ENTRAR.correo.label}
          </label>
          <input
            id="correo"
            name="email"
            type="email"
            defaultValue={estado.correo}
            onChange={() => errorLocal && setErrorLocal(null)}
            placeholder={ENTRAR.correo.placeholder}
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            maxLength={254}
            required
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'ayuda-correo error-correo' : 'ayuda-correo'}
            className={`mt-2 ${CLASE_CAMPO} ${error ? BORDE_ERROR : BORDE_NORMAL}`}
          />
          <MensajeError id="error-correo" texto={error} />
          <Rescate />
        </div>
        <PieFijo>
          <BotonPrincipal type="submit" disabled={ocupado}>
            {pendiente && enviada === 'pedir' ? ENTRAR.correo.enviando : ENTRAR.correo.boton}
          </BotonPrincipal>
        </PieFijo>
      </form>
    );
  } else {
    const correo = estado.paso === 'codigo' ? estado.correo : '';
    const enviadoEn = estado.paso === 'codigo' ? estado.enviadoEn : 0;
    const errorServidor = estado.paso === 'codigo' && !pendiente ? estado.error : undefined;
    const errorCodigo = errorLocal === 'faltan' ? ERRORES_CODIGO.faltan : errorServidor ? poner(ERRORES_CODIGO[errorServidor], { min: String(estado.paso === 'codigo' ? (estado.minutos ?? 15) : 15) }) : null;
    const errorEnvio = estado.paso === 'codigo' && !pendiente && estado.errorEnvio ? ERRORES_ENVIO[estado.errorEnvio] : null;
    const reenviado = estado.paso === 'codigo' && !pendiente && estado.reenviado;
    contenido = (
      <form key="codigo" ref={formCodigo} action={despachar} onSubmit={alVerificar} noValidate className="flex flex-1 flex-col">
        <input type="hidden" name="accion" value="verificar" />
        <input type="hidden" name="compra" value={compra ? '1' : '0'} />
        <input type="hidden" name="email" value={correo} />
        <input type="hidden" name="enviado" value={String(enviadoEn)} />
        <div className="flex-1">
          <Titulo texto={ENTRAR.codigo.titulo} enfocar={false} />
          <Ayuda id="texto-codigo">
            {antesCorreo}
            <b className="font-bold break-all text-[var(--text-primary)]">{correo}</b>
            {despuesCorreo}
          </Ayuda>
          <p className="mt-2 text-[16px] leading-[1.45] text-pretty text-[var(--text-secondary)]">{ENTRAR.codigo.ayuda}</p>
          <label htmlFor="codigo" className="mt-8 block text-[16px] font-semibold text-[var(--text-primary)]">
            {ENTRAR.codigo.label}
          </label>
          <input
            id="codigo"
            name="codigo"
            value={codigo}
            onChange={(e) => {
              const limpio = limpiarCodigo(e.target.value);
              setCodigo(limpio);
              if (errorLocal) setErrorLocal(null);
              if (codigoCompleto(limpio) && !ocupado) {
                setEnviada('verificar');
                // Al completar los 6 dígitos (o al pegarlos desde el correo) se revisa solo.
                queueMicrotask(() => formCodigo.current?.requestSubmit());
              }
            }}
            autoFocus
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={DIGITOS_CODIGO + 2}
            enterKeyHint="go"
            aria-label={ENTRAR.codigo.ariaCampo}
            aria-invalid={errorCodigo ? true : undefined}
            aria-describedby={errorCodigo ? 'texto-codigo error-codigo' : 'texto-codigo'}
            className={`mt-2 ${CLASE_CAMPO} text-center text-[24px] font-semibold tracking-[0.35em] tabular-nums ${errorCodigo ? BORDE_ERROR : BORDE_NORMAL}`}
          />
          <MensajeError id="error-codigo" texto={errorCodigo} />
          <MensajeError id="error-reenvio" texto={errorEnvio} />
          <p aria-live="polite" className="mt-2 text-[16px] leading-[1.45] font-semibold text-[var(--accent)] empty:hidden">
            {reenviado ? ENTRAR.codigo.reenviado : null}
          </p>
          <Rescate />
        </div>
        <PieFijo>
          <BotonPrincipal type="submit" disabled={ocupado}>
            {ocupado && enviada === 'verificar' ? ENTRAR.codigo.revisando : ENTRAR.codigo.boton}
          </BotonPrincipal>
          <Reenviar key={enviadoEn} ocupado={ocupado} onReenviar={() => despacharAccion('reenviar', { email: correo })} />
          <BotonTexto onClick={() => despacharAccion('otro', { email: correo })}>{ENTRAR.codigo.otroCorreo}</BotonTexto>
        </PieFijo>
      </form>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
        <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-clip px-5">
          <header className="flex h-16 items-center pt-[env(safe-area-inset-top)]">
            <Link
              href="/"
              aria-label={ENTRAR.logo}
              className="-ml-2 inline-flex h-12 items-center gap-2 rounded-full px-2 text-[16px] font-semibold text-[var(--text-primary)]"
            >
              <Logo />
              <span aria-hidden="true">Paso a Paso</span>
            </Link>
          </header>
          <main className="flex flex-1 flex-col pt-4">
            {aviso === 'salio' && estado.paso === 'correo' && (
              <p role="status" className="mb-6 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-4 py-3 text-[16px] font-semibold">
                {ENTRAR.salio}
              </p>
            )}
            {aviso === 'enlace' && estado.paso === 'correo' && (
              <p role="alert" className="mb-6 rounded-[var(--radius-button)] bg-[var(--surface-2)] px-4 py-3 text-[16px] font-semibold text-[var(--error)]">
                {ENTRAR.errorEnlace}
              </p>
            )}
            {contenido}
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
