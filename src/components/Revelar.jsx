import { motion } from 'framer-motion'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

/**
 * Envoltorio de revelado al hacer scroll.
 *
 * Es la unica forma en que las secciones se animan: nada arranca al cargar
 * la pagina, todo espera a entrar en pantalla. Centralizarlo aqui evita que
 * cada seccion invente sus propios valores y el ritmo se desacople.
 *
 *   initial   opacity 0, y 50
 *   whileInView  opacity 1, y 0
 *   viewport  once: true, amount: 0.2
 *
 * `amount: 0.2` dispara cuando entra un quinto del elemento. En bloques mas
 * altos que la ventana ese quinto puede no alcanzarse nunca —el elemento no
 * cabe entero— y entonces conviene bajarlo con la prop `porcion`.
 *
 * Con movimiento reducido no hay estado inicial: el contenido nace visible,
 * porque un revelado que depende de un observador que no va a disparar deja
 * la pagina en blanco.
 */
export default function Revelar({
  children,
  as = 'div',
  className,
  id,
  retardo = 0,
  porcion = 0.2,
  desplazamiento = 50,
  ...resto
}) {
  const sinMovimiento = useSinMovimiento()
  const Etiqueta = motion[as]

  if (sinMovimiento) {
    const Simple = as
    return <Simple className={className} id={id} {...resto}>{children}</Simple>
  }

  return (
    <Etiqueta
      id={id}
      className={className}
      initial={{ opacity: 0, y: desplazamiento }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: porcion }}
      transition={{ duration: 0.7, delay: retardo, ease: [0.16, 1, 0.3, 1] }}
      {...resto}
    >
      {children}
    </Etiqueta>
  )
}
