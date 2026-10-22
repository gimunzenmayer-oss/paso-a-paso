import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_SIMULADA, correoSimulado, entornoDeProceso } from '@/lib/cuenta/simulacion';

// /admin y /cuenta: renueva la sesión (cookies) antes de mostrar la página.
// En /admin NO decide el acceso: eso lo verifica cada página en el servidor y, al final, la base.
// En /cuenta, sin sesión lleva a /entrar (la página lo vuelve a comprobar en el servidor).
// La sesión simulada (cookie COOKIE_SIMULADA) solo cuenta en desarrollo: lib/cuenta/simulacion.ts.
export async function proxy(request: NextRequest) {
  const esCuenta = request.nextUrl.pathname === '/cuenta' || request.nextUrl.pathname.startsWith('/cuenta/');
  let respuesta = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const llave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  let conSesion = false;
  if (url && llave) {
    const supabase = createServerClient(url, llave, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (lista) => {
          for (const { name, value } of lista) request.cookies.set(name, value);
          respuesta = NextResponse.next({ request });
          for (const { name, value, options } of lista) respuesta.cookies.set(name, value, options);
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    conSesion = data.user !== null;
  } else if (!esCuenta) {
    return respuesta;
  }

  if (esCuenta && !conSesion && !correoSimulado(entornoDeProceso(), request.cookies.get(COOKIE_SIMULADA)?.value)) {
    const entrar = NextResponse.redirect(new URL('/entrar', request.url));
    // Lo que Supabase haya limpiado (una sesión vencida) también viaja en la redirección.
    for (const c of respuesta.cookies.getAll()) entrar.cookies.set(c);
    entrar.headers.set('Cache-Control', 'private, no-store');
    return entrar;
  }
  respuesta.headers.set('Cache-Control', 'private, no-store');
  respuesta.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return respuesta;
}

export const config = { matcher: ['/admin', '/admin/:path*', '/cuenta', '/cuenta/:path*'] };
