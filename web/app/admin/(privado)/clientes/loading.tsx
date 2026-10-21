// Mientras llega la lista: la forma de la pantalla de clientes, sin datos inventados.
export default function Cargando() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Cargando la lista de clientes…</span>
      <div className="esqueleto h-10 w-40" />
      <div className="esqueleto h-12" />
      <div className="flex flex-wrap gap-2">
        <div className="esqueleto h-12 w-24" />
        <div className="esqueleto h-12 w-28" />
        <div className="esqueleto h-12 w-32" />
      </div>
      <div className="esqueleto h-48" />
      <div className="esqueleto h-48" />
    </div>
  );
}
