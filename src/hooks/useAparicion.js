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
 *
 * `margin` adelanta el disparo mientras el elemento todavia esta debajo
 * del viewport (mismo formato que rootMargin: "arriba derecha abajo
 * izquierda"). Sin esto, la animacion —de duracion fija— se dispara justo
 * al cruzar el borde, y en un scroll rapido el elemento ya salio de
 * pantalla antes de que la transicion alcance a jugarse entera: se ve
 * "rapida" no porque la duracion cambie, sino porque no queda tiempo en
 * pantalla para verla completa. Adelantar el disparo le da ese tiempo
 * siempre, sea cual sea la velocidad del scroll.
 */
export function useAparicion({ once = true, amount = 0.25, margin = '0px 0px 200px 0px' } = {}) {
  const ref = useRef(null)
  const sinMovimiento = useSinMovimiento()
  const aLaVista = useInView(ref, { once, amount, margin })
  return [ref, sinMovimiento || aLaVista ? 'visible' : 'oculto']
}
