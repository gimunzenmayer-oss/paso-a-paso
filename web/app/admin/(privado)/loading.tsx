// Mientras llegan las cifras: la forma de la página, sin números inventados.
export default function Cargando() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Cargando tus cifras…</span>
      <div className="esqueleto h-9 w-48" />
      <div className="esqueleto h-16" />
      <div className="esqueleto h-56" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="esqueleto h-28" />
        <div className="esqueleto h-28" />
        <div className="esqueleto h-28" />
        <div className="esqueleto h-28" />
      </div>
    </div>
  );
}
