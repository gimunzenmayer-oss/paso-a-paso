import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Solo en /admin: renueva la sesión del dueño (cookies) antes de mostrar la página.
// NO decide el acceso: eso lo verifica cada página en el servidor y, al final, la base.
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const llave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !llave) return respuesta;

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
  await supabase.auth.getUser();
  respuesta.headers.set('Cache-Control', 'private, no-store');
  respuesta.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return respuesta;
}

export const config = { matcher: ['/admin/:path*', '/admin'] };
