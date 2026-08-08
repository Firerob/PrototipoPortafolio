import { motion } from 'framer-motion'
import { etapas } from '../data/proyectos.js'
import Revelar from './Revelar.jsx'
import { TituloPartido } from './Texto.jsx'

/**
 * Va numerado porque el orden es real: no se dibuja antes de visitar el
 * terreno, ni se ejecuta antes de elegir partido. La numeracion informa,
 * no decora.
 */
export default function Proceso() {
  return (
    <section id="proceso" className="seccion">
      <div className="wrap">
        <div>
          <Revelar as="p" className="eyebrow">Proceso</Revelar>
          <TituloPartido texto="Cómo trabajamos" className="h2" />
        </div>

        <ol className="g12 etapas" style={{ marginTop: '4rem' }}>
          {etapas.map((e, i) => (
            <li className="etapa" key={e.n}>
              <motion.span
                className="regla"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              />
              <Revelar retardo={i * 0.12 + 0.15} desplazamiento={18}>
                <p className="eyebrow">Etapa {e.n}</p>
                <h3>{e.titulo}</h3>
                <p className="small">{e.texto}</p>
              </Revelar>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
