import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { hayConfigSupabase } from '@/lib/supabase/config';
import { supabaseServidor } from '@/lib/supabase/servidor';
import { destinoTrasEntrar } from '@/lib/cuenta/acceso';
import { accesoRecienEntrada } from '@/lib/cuenta/sesion';

// Llega desde el enlace del correo de /entrar (el mismo correo trae el código de 6 dígitos).
// Dos formas de enlace, según la plantilla de Supabase Auth:
//  · ?token_hash=…&type=email  (recomendada: funciona aunque el correo se abra en otro navegador)
//  · ?code=…                   (PKCE: solo en el mismo navegador que pidió el código)
// Con sesión → la app si tiene acceso, si no /cuenta (docs/copy/embudo.md §3.3). Si el enlace venció o ya se usó → /entrar?error=enlace.
const TIPOS: readonly EmailOtpType[] = ['email', 'magiclink'];

function esTipo(v: string | null): v is EmailOtpType {
  return v !== null && (TIPOS as readonly string[]).includes(v);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fallo = NextResponse.redirect(new URL('/entrar?error=enlace', url.origin));
  if (!hayConfigSupabase()) return fallo;

  const tokenHash = url.searchParams.get('token_hash');
  const tipo = url.searchParams.get('type');
  const code = url.searchParams.get('code');
  const supabase = await supabaseServidor();

  if (tokenHash && esTipo(tipo)) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: tipo });
    if (!error) return NextResponse.redirect(new URL(destinoTrasEntrar(await accesoRecienEntrada(supabase), false), url.origin));
    console.error('[auth/callback] enlace no aceptado', error.status, error.code);
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(destinoTrasEntrar(await accesoRecienEntrada(supabase), false), url.origin));
    console.error('[auth/callback] código PKCE no aceptado', error.status, error.code);
  }
  return fallo;
}
