'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_ALTA } from '@/lib/admin/alta';
import { supabaseServidor } from '@/lib/supabase/servidor';
import { llaveIngesta, supabaseIngesta } from '@/lib/servidor/ingesta';
import { permitido } from '@/lib/servidor/limite';

const CORREO = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

async function ipActual() {
  const h = await headers();
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'sin-ip';
}

async function origen() {
  const fijo = process.env.NEXT_PUBLIC_SITE_URL;
  if (fijo) return fijo.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return `${proto}://${host}`;
}

// Paso 1: enlace al correo. La respuesta es SIEMPRE la misma, sea o no un correo de administradora.
export async function pedirEnlace(form: FormData) {
  const email = String(form.get('email') ?? '')
    .trim()
    .toLowerCase();
  if (!CORREO.test(email)) redirect('/admin/entrar?error=correo');
  if (!permitido(`enlace:${await ipActual()}`, 5, 15 * 60_000)) redirect('/admin/entrar?error=espera');

  const key = llaveIngesta();
  if (!key) redirect('/admin/entrar?error=servidor');
  const { data: esAdmin, error } = await supabaseIngesta().rpc('admin_correo_permitido', { p_key: key, p_email: email });
  if (error) redirect('/admin/entrar?error=servidor');

  if (esAdmin === true) {
    const supabase = await supabaseServidor();
    const { error: e } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: `${await origen()}/admin/auth/callback` },
    });
    if (e) {
      console.error('[admin] no se pudo enviar el enlace', e.status, e.code);
      redirect(e.status === 429 ? '/admin/entrar?error=espera' : '/admin/entrar?error=servidor');
    }
  }
  // Se muestra a qué correo se mandó, tapado a medias (la dirección no queda completa en el historial del navegador).
  const [usuario, dominio] = email.split('@');
  redirect(`/admin/entrar?enviado=1&a=${encodeURIComponent(`${usuario.slice(0, 2)}•••@${dominio}`)}`);
}

// Paso 2: código de 6 dígitos de la app de autenticación. Máximo 5 intentos fallidos cada 15 minutos.
export async function verificarCodigo(form: FormData) {
  const factorId = String(form.get('factor') ?? '');
  const codigo = String(form.get('codigo') ?? '').replace(/\s/g, '');
  const supabase = await supabaseServidor();

  const { data: bloqueado } = await supabase.rpc('admin_mfa_bloqueado');
  if (bloqueado === true) redirect('/admin/verificar?error=bloqueado');
  if (!/^\d{6}$/.test(codigo) || !factorId) redirect('/admin/verificar?error=formato');

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: codigo });
  await supabase.rpc('admin_mfa_registrar', { p_ok: !error });
  if (error) redirect('/admin/verificar?error=codigo');
  // La clave de la primera vez ya no hace falta guardarla.
  (await cookies()).delete({ name: COOKIE_ALTA, path: '/admin' });
  redirect('/admin?hola=1');
}

export async function salir() {
  const supabase = await supabaseServidor();
  await supabase.auth.signOut();
  redirect('/admin/entrar');
}
