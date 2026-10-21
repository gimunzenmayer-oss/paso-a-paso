// Mientras cargan tus costos: la forma de la pantalla, sin datos inventados.
export default function Cargando() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Cargando tus costos y ajustes…</span>
      <div className="esqueleto h-10 w-56" />
      <div className="esqueleto h-72" />
      <div className="esqueleto h-72" />
    </div>
  );
}
