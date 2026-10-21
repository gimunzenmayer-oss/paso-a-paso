'use client';

import { useEffect, useRef, type FormEvent, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { LoaderCircle } from 'lucide-react';

const TONO = {
  primario: 'bg-[var(--accent)] text-[#FBFCF9] hover:brightness-110',
  oscuro: 'bg-[var(--text-primary)] text-[#FBFCF9] hover:brightness-125',
  peligro: 'bg-[var(--err)] text-[#FBFCF9] hover:brightness-110',
  suave: 'bg-[var(--surface-2)] text-[var(--text-primary)] hover:brightness-95',
} as const;

// Botón de envío con respuesta inmediata: se hunde al tocarlo y, mientras el servidor trabaja,
// dice qué está haciendo y no deja enviar dos veces.
export function BotonEnviar({
  children,
  enviando,
  tono = 'primario',
  ancho = false,
  className = '',
}: {
  children: ReactNode;
  enviando: string;
  tono?: keyof typeof TONO;
  ancho?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] px-5 text-[18px] font-bold transition-[filter,transform] active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-2)] ${TONO[tono]} ${ancho ? 'w-full' : ''} ${className}`}
    >
      {pending && <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
      {pending ? enviando : children}
    </button>
  );
}

// Formulario que avisa en español, bajo cada campo, qué falta ANTES de enviar (y así no se pierde lo escrito).
// Cada campo lleva su mensaje en data-error; el aviso aparece en el elemento con id `${name}-error`.
export function FormularioAdmin({
  action,
  children,
  className = '',
}: {
  action: (form: FormData) => void | Promise<void>;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const f = ref.current;
    if (!f) return;
    const limpiar = (e: Event) => {
      const c = e.target as HTMLInputElement;
      if (!c.name) return;
      c.removeAttribute('aria-invalid');
      const caja = f.querySelector<HTMLElement>(`[id="${c.name}-error"]`);
      if (caja) caja.textContent = '';
    };
    f.addEventListener('input', limpiar);
    return () => f.removeEventListener('input', limpiar);
  }, []);

  function invalido(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const c = e.target as HTMLInputElement;
    c.setAttribute('aria-invalid', 'true');
    const caja = ref.current?.querySelector<HTMLElement>(`[id="${c.name}-error"]`);
    if (caja) caja.textContent = c.dataset.error ?? 'Revisa este dato.';
    const primero = ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (primero === c) c.focus();
  }

  return (
    <form ref={ref} action={action} onInvalidCapture={invalido} className={className}>
      {children}
    </form>
  );
}

export function ErrorCampo({ nombre }: { nombre: string }) {
  return <span id={`${nombre}-error`} role="alert" className="text-[18px] font-bold leading-snug text-[var(--err)] empty:hidden" />;
}
