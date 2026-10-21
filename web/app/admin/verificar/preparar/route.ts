import { NextResponse } from 'next/server';
import { estadoAdmin } from '@/lib/admin/sesion';
import { COOKIE_ALTA, escribirAlta, svgDeQr } from '@/lib/admin/alta';
import { supabaseServidor } from '@/lib/supabase/servidor';

// Primera vez: crea la conexión con la app de códigos y guarda su clave unos minutos (ver lib/admin/alta.ts).
export async function GET(req: Request) {
  const base = new URL(req.url).origin;
  const { estado } = await estadoAdmin();
  if (estado !== 'falta_codigo') return NextResponse.redirect(new URL('/admin/verificar', base));

  const supabase = await supabaseServidor();
  const { data: factores } = await supabase.auth.mfa.listFactors();
  if (factores?.totp.length) return NextResponse.redirect(new URL('/admin/verificar', base));
  // Intentos a medias que ya no se pueden mostrar (su clave no se guardó): se descartan.
  for (const f of factores?.all ?? []) {
    if (f.status === 'unverified') await supabase.auth.mfa.unenroll({ factorId: f.id });
  }
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Panel Paso a Paso' });
  if (error || !data) return NextResponse.redirect(new URL('/admin/verificar?error=preparar', base));

  const res = NextResponse.redirect(new URL('/admin/verificar?listo=1', base));
  res.cookies.set(COOKIE_ALTA, escribirAlta({ id: data.id, qr: svgDeQr(data.totp.qr_code), secreto: data.totp.secret, uri: data.totp.uri }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 30 * 60,
  });
  return res;
}
