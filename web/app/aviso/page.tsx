import type { Metadata } from 'next';
import { PaginaLegal } from '@/components/legal/PaginaLegal';
import { APP } from '@/lib/marca';

export const metadata: Metadata = { title: `Aviso importante · ${APP}` };

// El mismo mensaje vive en la app, al pie de Inicio y de la Guía (app/js/app.js, .aviso-legal).
export default function Aviso() {
  return (
    <PaginaLegal titulo="Aviso importante">
      <p>
        {APP} es una herramienta de apoyo para el día a día. <strong>No reemplaza</strong> el diagnóstico, la terapia ni
        el consejo de profesionales de la salud, la educación o la psicología.
      </p>
      <p>
        La guía para familias y la ficha «Ahora mismo» reúnen recomendaciones generales. Cada niño y cada niña es diferente:
        consulta con su equipo de profesionales antes de cambiar su tratamiento o sus apoyos. Las decisiones sobre tu peque
        las tomas tú, junto a ese equipo.
      </p>
      <p>
        El informe resume lo que tú anotaste en el diario. No es un diagnóstico ni una evaluación: sirve para conversar con
        sus profesionales.
      </p>
      <p>
        <strong>Si hay riesgo para la seguridad</strong> de tu peque o de otra persona (lesiones, golpes en la cabeza,
        dificultad para respirar, desaparición), llama de inmediato a los servicios de emergencia de tu país.
      </p>
      <p>
        No usamos inteligencia artificial para dar consejos. Los textos de la guía están escritos y revisados por el equipo
        de {APP}.
      </p>
    </PaginaLegal>
  );
}
