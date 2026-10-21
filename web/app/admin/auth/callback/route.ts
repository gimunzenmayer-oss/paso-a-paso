import { NextResponse } from 'next/server';
import { supabaseServidor } from '@/lib/supabase/servidor';

// Llega desde el enlace del correo: canjea el código por una sesión y pide el 2º factor.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  if (code) {
    const supabase = await supabaseServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL('/admin/verificar', url.origin));
  }
  return NextResponse.redirect(new URL('/admin/entrar?error=enlace', url.origin));
}
