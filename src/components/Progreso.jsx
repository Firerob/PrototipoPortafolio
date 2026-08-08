import { motion, useScroll, useSpring } from 'framer-motion'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

/**
 * Linea de progreso de lectura, fija en el borde superior.
 *
 * No es adorno: dice cuanto queda de pagina, que en un scroll largo con
 * una seccion anclada es informacion util. Por eso sigue apareciendo con
 * movimiento reducido — lo unico que se retira ahi es el suavizado, para
 * que salte directa a su valor en vez de perseguirlo.
 *
 * Visualmente es la linea de cota del plano del hero, continuada arriba.
 */
export default function Progreso() {
  const sinMovimiento = useSinMovimiento()
  const { scrollYProgress } = useScroll()
  const suave = useSpring(scrollYProgress, {
    stiffness: 120, damping: 30, restDelta: 0.001,
  })

  return (
    <motion.div
      className="progreso"
      aria-hidden="true"
      style={{ scaleX: sinMovimiento ? scrollYProgress : suave }}
    />
  )
}
