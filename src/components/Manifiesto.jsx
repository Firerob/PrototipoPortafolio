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
 *
 * La composicion es la de una cita de revista, no un parrafo centrado:
 * rotulo y regla arriba, cita en el centro optico, atribucion abajo. Antes
 * el texto ocupaba el 29% del alto de la caja y flotaba en medio de un
 * rectangulo negro; ahora el contenido sujeta las tres alturas y el vacio
 * pasa a ser margen deliberado en vez de hueco.
 */
function Palabra({ palabra, rango, progreso }) {
  const color = useTransform(progreso, rango, ['#8C8C89', '#FFFFFF'])
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

  // La regla se dibuja sola conforme avanza la seccion: es la misma idea
  // que la cota del plano del hero, y da al rotulo algo que hacer mientras
  // la cita se enciende.
  const anchoRegla = useTransform(scrollYProgress, [0, 0.35], ['0%', '100%'])

  const seguirFoco = (e) => {
    if (sinMovimiento || !foco.current) return
    const r = foco.current.parentElement.getBoundingClientRect()
    foco.current.style.setProperty('--fx', `${e.clientX - r.left}px`)
    foco.current.style.setProperty('--fy', `${e.clientY - r.top}px`)
  }

  return (
    // Un tramo de scroll por delante de la ventana: lo justo para que la
    // frase se encienda entera sin que la seccion se sienta atascada.
    // Antes eran 220vh, de los que 120 no mostraban nada.
    <section
      id="manifiesto"
      className="manifiesto oscuro"
      ref={ref}
      style={{ height: sinMovimiento ? 'auto' : '200vh' }}
      onMouseMove={seguirFoco}
      onMouseEnter={() => foco.current && (foco.current.style.opacity = '1')}
      onMouseLeave={() => foco.current && (foco.current.style.opacity = '0')}
    >
      <div className="mani-pegado">
        <div id="foco" ref={foco} aria-hidden="true" />

        <div className="wrap caja">
          <header className="mani-rotulo">
            <p className="eyebrow">Manifiesto</p>
            {sinMovimiento
              ? <span className="mani-regla" style={{ width: '100%' }} aria-hidden="true" />
              : <motion.span className="mani-regla" style={{ width: anchoRegla }} aria-hidden="true" />}
          </header>

          {/* blockquote + cite: es una cita, y decirlo en el marcado la
              anuncia como tal a quien navega con lector de pantalla. */}
          <blockquote className="mani">
            <p>
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
          </blockquote>

          <footer className="mani-pie">
            <cite>Marina Olivares, arquitecta</cite>
            <span className="mani-desde">Estudio fundado en 2013</span>
          </footer>
        </div>
      </div>
    </section>
  )
}
