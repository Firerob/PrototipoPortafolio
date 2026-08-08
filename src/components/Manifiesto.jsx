import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

const FRASE =
  'No perseguimos la forma. Buscamos que cada decisión —una viga vista, un ' +
  'quiebre de muro, la orientación de un vano— resuelva más de un problema a la vez.'

/**
 * Las palabras se encienden de gris a blanco conforme avanza el scroll.
 *
 * El anclaje es `position: sticky` puro, no un pin de JavaScript: el
 * navegador lo resuelve en el hilo del compositor y no pelea con el
 * scroll nativo. Es la unica seccion anclada de la pagina.
 */
function Palabra({ palabra, rango, progreso }) {
  const color = useTransform(progreso, rango, ['#D6D5D2', '#FFFFFF'])
  return (
    <motion.span style={{ color }}>{palabra}{' '}</motion.span>
  )
}

export default function Manifiesto() {
  const sinMovimiento = useSinMovimiento()
  const ref = useRef(null)
  const foco = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const palabras = FRASE.split(' ')

  const seguirFoco = (e) => {
    if (sinMovimiento || !foco.current) return
    const r = foco.current.parentElement.getBoundingClientRect()
    foco.current.style.setProperty('--fx', `${e.clientX - r.left}px`)
    foco.current.style.setProperty('--fy', `${e.clientY - r.top}px`)
  }

  return (
    // El doble de alto que la ventana da recorrido al barrido sin que la
    // seccion se sienta atascada.
    <section
      id="manifiesto"
      className="manifiesto oscuro"
      ref={ref}
      style={{ height: sinMovimiento ? 'auto' : '220vh' }}
      onMouseMove={seguirFoco}
      onMouseEnter={() => foco.current && (foco.current.style.opacity = '1')}
      onMouseLeave={() => foco.current && (foco.current.style.opacity = '0')}
    >
      <div style={{ position: 'sticky', top: 0, overflow: 'hidden' }}>
        <div id="foco" ref={foco} aria-hidden="true" />
        <div className="wrap caja">
          <p className="mani">
            {sinMovimiento
              ? FRASE
              : palabras.map((p, i) => (
                  <Palabra
                    key={i}
                    palabra={p}
                    progreso={scrollYProgress}
                    // Cada palabra se enciende en su propio tramo, solapado
                    // con el de la siguiente para que la ola sea continua.
                    rango={[i / palabras.length * 0.85, (i + 1) / palabras.length * 0.85 + 0.1]}
                  />
                ))}
          </p>
        </div>
      </div>
    </section>
  )
}
