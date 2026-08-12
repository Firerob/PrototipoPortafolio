import { motion } from 'framer-motion'
import { servicios } from '../data/proyectos.js'
import { useSinMovimiento } from '../hooks/useMovimiento.js'
import Revelar from './Revelar.jsx'
import { TituloPartido } from './Texto.jsx'

/**
 * Fila completa numerada, no tarjeta en rejilla: la que tenia Proceso
 * antes de retirarse, con la regla que se dibuja sola rescatada aqui
 * (`.encargo-regla`, era `.regla`) en vez de perderse con el resto. El
 * ritmo horizontal y el titulo grande la distinguen de Proyectos y de
 * Testimonios, que son las otras dos secciones con lista.
 */
export default function Servicios() {
  const sinMovimiento = useSinMovimiento()

  return (
    <section id="servicios" className="seccion">
      <div className="wrap">
        <div className="g12 cabecera">
          <div className="c-titulo">
            <Revelar as="p" className="eyebrow">Servicios</Revelar>
            <TituloPartido texto="Encargos que tomo" className="h2" />
          </div>
          <Revelar as="p" className="small c-nota">
            Cinco líneas de trabajo. En todas dirijo la obra: el encargo no
            se cierra cuando se entregan los planos, se cierra en la
            recepción municipal.
          </Revelar>
        </div>

        <ol className="encargos">
          {servicios.map((s, i) => (
            <li className="encargo" key={s.titulo}>
              {sinMovimiento ? (
                <span className="encargo-regla" aria-hidden="true" />
              ) : (
                <motion.span
                  className="encargo-regla"
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <span className="encargo-fondo" aria-hidden="true" />
              <div className="encargo-n">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <p className="eyebrow encargo-alcance">{s.alcance}</p>
              </div>
              <h3>{s.titulo}</h3>
              <p className="small encargo-texto">{s.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
