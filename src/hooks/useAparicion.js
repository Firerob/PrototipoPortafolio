import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useSinMovimiento } from './useMovimiento.js'

/**
 * Dispara una animacion cuando el elemento entra en pantalla.
 *
 * Casi todo el sitio usa la prop `whileInView` de framer-motion, que es la
 * via directa. Este hook queda para el unico caso donde esa prop no puede
 * usarse: cuando el elemento que se anima se oculta con `clip-path`.
 *
 * El motivo es del navegador, no de la libreria. Un `clip-path: inset(0 0
 * 100% 0)` recorta el elemento a altura cero, y Chromium descuenta ese
 * recorte al medir la interseccion: el elemento se ve siempre al 0% y el
 * observador que deberia revelarlo no llega a dispararse jamas. La cortina
 * se tapa a si misma. La salida es observar un ancestro sin recortar y
 * animar el hijo, que es justo lo que permite separar ref y destino aqui.
 *
 *   const [ref, estado] = useAparicion()
 *   <article ref={ref}>
 *     <motion.div animate={estado === 'visible' ? 'abierta' : 'cerrada'} />
 *   </article>
 *
 * Con movimiento reducido devuelve 'visible' desde el primer render.
 */
export function useAparicion({ once = true, amount = 0.25 } = {}) {
  const ref = useRef(null)
  const sinMovimiento = useSinMovimiento()
  const aLaVista = useInView(ref, { once, amount })
  return [ref, sinMovimiento || aLaVista ? 'visible' : 'oculto']
}
