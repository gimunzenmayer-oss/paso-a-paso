import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BotonEnviar, ErrorCampo, FormularioAdmin } from '@/components/admin/formularios';
import { CampoCodigo, CopiarClave } from '@/components/admin/interacciones';
import { Plegable } from '@/components/admin/ui';
import { MarcoEntrada, Mensaje } from '@/components/admin/MarcoEntrada';
import { COOKIE_ALTA, enlaceDeQr, leerAlta, type Alta } from '@/lib/admin/alta';
import { estadoAdmin } from '@/lib/admin/sesion';
import { supabaseServidor } from '@/lib/supabase/servidor';
import { salir, verificarCodigo } from '../acciones';

// Donde se reinicia el código si se pierde el teléfono (solo la dueña tiene cuenta en ese proyecto).
const USUARIOS_SUPABASE = 'https://supabase.com/dashboard/project/uvubnzymrkqirdvneeds/auth/users';

const ERRORES: Record<string, string> = {
  codigo: 'Ese código no coincide. Mira la app otra vez y escribe el que aparece ahora: cambia cada 30 segundos.',
  formato: 'El código son 6 números. Escríbelos sin letras.',
  bloqueado: 'Hubo 5 intentos fallidos. Por seguridad, espera 15 minutos y vuelve a probar con el código que aparezca en ese momento.',
};

export default async function Verificar({ searchParams }: PageProps<'/admin/verificar'>) {
  const q = await searchParams;
  const { estado } = await estadoAdmin();
  if (estado === 'sin_sesion') redirect('/admin/entrar');
  if (estado === 'sin_permiso') redirect('/admin/entrar?error=permiso');
  if (estado === 'ok') redirect('/admin');

  const supabase = await supabaseServidor();
  const { data: factores } = await supabase.auth.mfa.listFactors();
  let factorId = factores?.totp[0]?.id ?? null;
  let alta: Alta | null = null;

  // Primera vez: se muestra la conexión preparada (y guardada) por /admin/verificar/preparar; si no hay, se prepara.
  if (!factorId) {
    const guardada = leerAlta((await cookies()).get(COOKIE_ALTA)?.value);
    const sigueValida = guardada && factores?.all.some((f) => f.id === guardada.id && f.status === 'unverified');
    if (sigueValida) {
      alta = guardada;
      factorId = guardada.id;
    } else if (q.error !== 'preparar' && q.listo !== '1') {
      // Si tras prepararla la clave no quedó guardada (cookies bloqueadas), no se repite en círculo: se avisa abajo.
      redirect('/admin/verificar/preparar');
    } else {
      return (
        <MarcoEntrada
          etapa="codigo"
          titulo="No pudimos preparar tu código"
          bajada="Vuelve a entrar con un enlace nuevo. Si vuelve a pasar, pídele a Claude en tu proyecto que lo revise."
        >
          <form action={salir}>
            <BotonEnviar enviando="Saliendo…" ancho>
              Volver a empezar
            </BotonEnviar>
          </form>
        </MarcoEntrada>
      );
    }
  }

  const primeraVez = alta !== null;
  const error = typeof q.error === 'string' ? ERRORES[q.error] : undefined;

  return (
    <MarcoEntrada
      etapa="codigo"
      pie={
        <form action={salir}>
          <button type="submit" className="min-h-12 text-[18px] text-[var(--text-secondary)] underline underline-offset-4 active:opacity-70">
            Usar otro correo
          </button>
        </form>
      }
      titulo={primeraVez ? 'Protege tu panel con un código' : 'Escribe tu código'}
      bajada={
        primeraVez ? (
          <ol className="list-decimal space-y-1 pl-5">
            <li>Instala Google Authenticator en tu teléfono (es gratis).</li>
            <li>Toca el botón + y elige escanear un código.</li>
            <li>Escanea este cuadro y escribe los 6 números que aparecen. Si estás en este mismo teléfono, toca «Agregar a Google Authenticator».</li>
          </ol>
        ) : (
          'Abre Google Authenticator en tu teléfono y escribe los 6 números que aparecen bajo “Panel Paso a Paso”.'
        )
      }
    >
      {error && <Mensaje tono="mal">{error}</Mensaje>}
      {primeraVez && (
        <div className="mb-5 flex flex-col items-center gap-3">
          {/* El QR lo genera Supabase como SVG; no sale de esta página. Si no cupo en la cookie, quedan el botón y la clave escrita. */}
          {alta!.qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={enlaceDeQr(alta!.qr)}
              alt="Cuadro para escanear con Google Authenticator"
              width={184}
              height={184}
              className="rounded-[var(--radius-button)] bg-white p-2"
            />
          )}
          {/* En el mismo teléfono no se puede escanear la propia pantalla: este enlace abre Google Authenticator con todo listo. */}
          {/* Solo en pantallas táctiles (teléfono o tablet): en el computador ese enlace no abre nada. */}
          <a
            href={alta!.uri}
            className="hidden min-h-12 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface-2)] px-4 font-bold active:scale-[0.98] [@media(pointer:coarse)]:inline-flex"
          >
            Agregar a Google Authenticator
          </a>
          <Plegable titulo="¿No funciona? Ingresa una clave de configuración" className="w-full">
            <p className="text-[18px] leading-snug text-[var(--text-secondary)]">
              En Google Authenticator toca + → «Ingresar una clave de configuración», ponle de nombre «Panel Paso a Paso» y pega esta clave:
            </p>
            <code className="mt-2 block break-all rounded-[var(--radius-button)] bg-[var(--surface-2)] px-3 py-2 text-[18px] tracking-wider">
              {alta!.secreto}
            </code>
            <CopiarClave clave={alta!.secreto} />
          </Plegable>
        </div>
      )}
      <FormularioAdmin action={verificarCodigo} className="flex flex-col gap-4">
        <input type="hidden" name="factor" value={factorId} />
        <label className="flex flex-col gap-1.5">
          <span className="text-[18px] font-bold">Código de 6 números</span>
          <CampoCodigo />
          <ErrorCampo nombre="codigo" />
        </label>
        <BotonEnviar enviando="Revisando el código…" ancho>
          Entrar al panel
        </BotonEnviar>
      </FormularioAdmin>
      {!primeraVez && (
        <Plegable titulo="¿Perdiste el teléfono o la app?" className="mt-4 -mb-2 border-t border-[var(--line)] pt-1">
          <div className="flex flex-col gap-2 pb-2 text-[18px] leading-snug text-[var(--text-secondary)]">
            <p>Por seguridad, este paso no se puede saltar. Hay dos formas de empezar de cero:</p>
            <p>
              <b className="text-[var(--text-primary)]">La fácil:</b> escríbele a Claude en tu proyecto “reinicia mi código del panel”. Después pide aquí un
              enlace nuevo y escanea el cuadro nuevo.
            </p>
            <p>
              <b className="text-[var(--text-primary)]">Tú misma:</b> entra a{' '}
              <a href={USUARIOS_SUPABASE} target="_blank" rel="noreferrer" className="font-bold text-[var(--text-primary)] underline underline-offset-4">
                tus usuarios en Supabase
              </a>{' '}
              (la página está en inglés), toca la fila con tu correo, busca la parte de MFA (la verificación en dos pasos) y borra “Panel Paso a Paso”.
            </p>
          </div>
        </Plegable>
      )}
    </MarcoEntrada>
  );
}
