import { dinero, nombreMes, num, tasa } from '@/lib/admin/formato';
import type { Paso } from '@/lib/admin/tipos';

// Ingreso neto de los últimos 12 meses (lo que te pagó Hotmart menos reembolsos).
// Una sola serie → un solo color (acento). Se rotulan el mes elegido y el mejor mes; el resto, al pasar el dedo.
export function BarrasMeses({ serie: completa, moneda }: { serie: { mes: string; neto: number | null }[]; moneda: string }) {
  // Se muestra desde el primer mes con ventas (mínimo 3 meses), para no llenar el gráfico de meses vacíos.
  const primero = completa.findIndex((s) => s.neto !== null);
  const serie = completa.slice(primero === -1 ? -3 : Math.min(primero, completa.length - 3));
  const max = Math.max(1, ...serie.map((s) => Math.abs(s.neto ?? 0)));
  const iMejor = serie.reduce((b, s, i) => ((s.neto ?? 0) > (serie[b].neto ?? 0) ? i : b), 0);
  const ultimo = serie[serie.length - 1];
  const mejor = serie[iMejor];
  return (
    <figure className="m-0">
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 text-[18px]">
        <span>
          <span className="text-[var(--text-secondary)]">Este mes: </span>
          <b className="tabular-nums">{ultimo.neto === null ? 'sin ventas' : dinero(ultimo.neto, moneda)}</b>
        </span>
        {serie.some((s) => s.neto === null) && <span className="text-[var(--text-secondary)]">Meses sin barra: sin ventas</span>}
        {iMejor !== serie.length - 1 && (mejor.neto ?? 0) > 0 && (
          <span>
            <span className="text-[var(--text-secondary)]">Mejor mes: </span>
            <b className="tabular-nums">
              {dinero(mejor.neto, moneda)} <span className="font-normal capitalize">({nombreMes(mejor.mes, true)})</span>
            </b>
          </span>
        )}
      </figcaption>
      <div className="mt-3 flex h-[120px] items-end gap-[2px] border-b border-[var(--field-border)]" aria-hidden="true">
        {serie.map((s, i) => {
          const v = Math.max(0, s.neto ?? 0);
          const actual = i === serie.length - 1;
          return (
            <div
              key={s.mes}
              className="group relative flex h-full flex-1 items-end justify-center"
              title={`${nombreMes(s.mes)}: ${s.neto === null ? 'sin ventas' : dinero(s.neto, moneda)}`}
            >
              {s.neto !== null && (
                <div
                  className={`crece-y w-[64%] max-w-12 rounded-t-[4px] bg-[var(--accent)] transition-opacity group-hover:opacity-100 ${actual ? '' : 'opacity-60'}`}
                  style={{
                    height: `${Math.max(2, (v / max) * 100)}%`,
                    animationDelay: `${120 + i * 60}ms`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-[2px] text-[13px] text-[var(--text-secondary)]" aria-hidden="true">
        {serie.map((s, i) => (
          <span key={s.mes} className={`flex-1 text-center ${serie.length > 6 && i % 2 === 1 && i !== serie.length - 1 ? 'invisible sm:visible' : ''}`}>
            {nombreMes(s.mes, true)}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>Lo que te pagó Hotmart, mes a mes</caption>
        <tbody>
          {serie.map((s) => (
            <tr key={s.mes}>
              <th scope="row">{nombreMes(s.mes)}</th>
              <td>{s.neto === null ? 'Sin ventas' : dinero(s.neto, moneda)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

// Embudo: las MISMAS personas, paso a paso (cada paso cuenta solo a quienes hicieron los anteriores).
// Se dibuja como la tira de pasos de la marca: círculos numerados unidos por una línea; el paso al que llegó alguien va en salvia.
// Con menos de 5 personas no se da % ("2 de 4"), igual que en el resto del panel.
export function Embudo({ pasos }: { pasos: Paso[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {pasos.map((p, i) => {
        const prev = i > 0 ? pasos[i - 1].personas : null;
        const llego = p.personas > 0;
        const ultimo = i === pasos.length - 1;
        // Paso 1: "4 personas". Después: "2 de 4 siguieron" (o "2 · 50% siguieron" con 5 o más).
        const cifra =
          prev === null ? (
            <>
              <b>{num(p.personas)}</b> {p.personas === 1 ? 'persona' : 'personas'}
            </>
          ) : prev < 5 ? (
            <>
              <b>{num(p.personas)}</b> de {num(prev)} <span className="text-[var(--text-secondary)]">siguieron</span>
            </>
          ) : (
            <>
              <b>{num(p.personas)}</b>
              <span className="text-[var(--text-secondary)]"> · {tasa((100 * p.personas) / prev, prev)} siguieron</span>
            </>
          );
        // La barra mide lo mismo que el texto: cuántos siguieron desde el paso anterior.
        const ancho = prev === null ? (p.personas > 0 ? 100 : 0) : prev > 0 ? (100 * p.personas) / prev : 0;
        return (
          <li key={p.paso} className="relative flex items-start gap-3">
            {!ultimo && (
              <span
                aria-hidden="true"
                className={`absolute top-8 -bottom-3 left-[13px] w-0.5 ${pasos[i + 1].personas > 0 ? 'bg-[var(--accent)]' : 'bg-[var(--field-border)]'}`}
              />
            )}
            <span
              aria-hidden="true"
              className={`relative mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 text-[13px] font-bold ${llego ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--surface)]' : 'border-[var(--field-border)] bg-[var(--surface)] text-[var(--text-secondary)]'}`}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p>{p.paso}</p>
              <p className="tabular-nums">{cifra}</p>
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-[var(--surface-2)]">
                <div
                  className="crece-x h-full rounded-full bg-[var(--accent)]"
                  style={{
                    width: `${ancho}%`,
                    animationDelay: `${120 + i * 60}ms`,
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
