'use client';

// Último recurso: si falla hasta el marco de la página. Sin dependencias, en español.
export default function ErrorGlobal({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: '100dvh', display: 'grid', placeItems: 'center', background: '#FFFFFF', color: '#3C3C3C', fontFamily: 'Verdana, sans-serif' }}>
        <main style={{ maxWidth: 480, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Algo no cargó bien</h1>
          <p style={{ margin: 0, lineHeight: 1.6 }}>Fue un problema nuestro, no tuyo. Prueba otra vez en unos segundos.</p>
          <button type="button" onClick={reset} style={{ minHeight: 48, borderRadius: 16, border: 0, background: '#46A302', color: '#fff', fontSize: 19, fontWeight: 700, boxShadow: '0 4px 0 #3A8700' }}>
            Probar otra vez
          </button>
          {/* Recarga completa a propósito: si falló el marco de la página, la navegación interna puede no servir. */}
          <button type="button" onClick={() => window.location.assign('/')} style={{ minHeight: 48, border: 0, background: 'none', color: '#357F00', fontSize: 17, textDecoration: 'underline' }}>
            Ir al inicio
          </button>
        </main>
      </body>
    </html>
  );
}
