import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

/**
 * Texto partido en letras.
 *
 * Accesibilidad: el contenedor lleva aria-label con la frase completa y
 * cada palabra va con aria-hidden. El lector de pantalla lee la frase de
 * corrido y nunca se topa con las letras sueltas. Las palabras no se
 * rompen entre lineas porque cada una es un inline-block propio.
 */

const entradaLetra = {
  oculto: { y: '120%', rotateX: -75, opacity: 0 },
  visible: { y: 0, rotateX: 0, opacity: 1 },
}

const transicionLetra = { duration: 0.85, ease: [0.16, 1, 0.3, 1] }

function partirEnPalabras(texto) {
  return texto.trim().split(/\s+/)
}

/** Titular animado que arranca al entrar en pantalla. */
export function TituloPartido({ texto, className, id, retardo = 0 }) {
  const sinMovimiento = useSinMovimiento()
  const palabras = partirEnPalabras(texto)

  if (sinMovimiento) {
    return <h2 id={id} className={className}>{texto}</h2>
  }

  let n = 0
  return (
    <motion.h2
      id={id}
      className={className}
      aria-label={texto}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {palabras.map((palabra, i) => (
        <span className="pal" aria-hidden="true" key={i}>
          {palabra.split('').map((car, j) => (
            <motion.span
              className="ltr"
              key={j}
              variants={entradaLetra}
              transition={{ ...transicionLetra, delay: retardo + n++ * 0.016 }}
            >
              {car}
            </motion.span>
          ))}
          {i < palabras.length - 1 && ' '}
        </span>
      ))}
    </motion.h2>
  )
}

/**
 * Una letra del hero. Dos capas anidadas a proposito:
 *   - la exterior corre la animacion de entrada (variants)
 *   - la interior sigue al cursor (motion values)
 * Si ambas tocaran la misma propiedad se pisarian y ganaria la ultima.
 */
function LetraIman({ car, indice, raton, radio = 170, colocada }) {
  const ref = useRef(null)
  const centro = useRef(null)

  useEffect(() => {
    const medir = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      centro.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }
    // Medir mientras la letra sigue desplazada bajo su linea daria un
    // centro equivocado y el iman buscaria el cursor donde no esta. Por eso
    // se vuelve a medir cuando `colocada` pasa a true, es decir, cuando la
    // entrada ya termino de moverlas. Contar desde el montaje no sirve: la
    // intro decide cuando arranca esa entrada, y puede durar lo que quiera.
    medir()
    window.addEventListener('resize', medir)
    window.addEventListener('scroll', medir, { passive: true })
    if (document.fonts?.ready) document.fonts.ready.then(medir)
    return () => {
      window.removeEventListener('resize', medir)
      window.removeEventListener('scroll', medir)
    }
  }, [colocada])

  // Fuerza 0..1 segun lo cerca que este el cursor
  const fuerza = useTransform([raton.x, raton.y], ([x, y]) => {
    const c = centro.current
    if (!c || x === null) return 0
    const d = Math.hypot(x - c.x, y - c.y)
    return Math.max(0, 1 - d / radio)
  })

  const muelle = { stiffness: 220, damping: 22, mass: 0.5 }
  const y = useSpring(useTransform(fuerza, (f) => -22 * f), muelle)
  const escala = useSpring(useTransform(fuerza, (f) => 1 + 0.22 * f), muelle)

  return (
    <motion.span
      className="ltr"
      variants={entradaLetra}
      transition={{ ...transicionLetra, delay: indice * 0.022 }}
    >
      <motion.span ref={ref} style={{ y, scale: escala, display: 'inline-block' }}>
        {car}
      </motion.span>
    </motion.span>
  )
}

/** Titular del hero: entra al cargar y responde al cursor. */
export function TituloHero({ texto, className, arrancar }) {
  const sinMovimiento = useSinMovimiento()
  const [colocada, setColocada] = useState(false)
  const raton = { x: useMotionValue(null), y: useMotionValue(null) }

  // La entrada dura 0.85 s mas el escalonado de las letras; se espera un
  // poco mas que eso desde que arranca y se da por colocada.
  useEffect(() => {
    if (!arrancar) return
    const t = setTimeout(() => setColocada(true), 1500)
    return () => clearTimeout(t)
  }, [arrancar])

  useEffect(() => {
    if (sinMovimiento) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const mover = (e) => {
      raton.x.set(e.clientX)
      raton.y.set(e.clientY)
    }
    window.addEventListener('mousemove', mover, { passive: true })
    return () => window.removeEventListener('mousemove', mover)
  }, [sinMovimiento])

  if (sinMovimiento) {
    return <h1 className={className}>{texto}</h1>
  }

  const palabras = partirEnPalabras(texto)
  let n = 0

  return (
    <motion.h1
      className={className}
      aria-label={texto}
      initial="oculto"
      animate={arrancar ? 'visible' : 'oculto'}
    >
      {palabras.map((palabra, i) => (
        <span className="pal" aria-hidden="true" key={i}>
          {palabra.split('').map((car, j) => (
            <LetraIman car={car} indice={n++} raton={raton} colocada={colocada} key={j} />
          ))}
          {i < palabras.length - 1 && ' '}
        </span>
      ))}
    </motion.h1>
  )
}

/** Enlace cuyo texto ondula letra a letra al pasar el cursor. */
export function EnlaceOnda({ href, texto, className = '', onClick, actual = false }) {
  const sinMovimiento = useSinMovimiento()
  const comunes = {
    href,
    className,
    onClick,
    // aria-current dice al lector de pantalla en que seccion esta el
    // visitante; el subrayado permanente lo dice a quien mira.
    'aria-current': actual ? 'true' : undefined,
  }

  if (sinMovimiento) {
    return <a {...comunes}>{texto}</a>
  }

  return (
    <motion.a
      {...comunes}
      aria-label={texto}
      initial="quieto"
      whileHover="onda"
    >
      <span aria-hidden="true">
        {texto.split('').map((car, i) => (
          <motion.span
            className="ltr"
            key={i}
            variants={{ quieto: { y: 0 }, onda: { y: [0, -5, 0] } }}
            transition={{ duration: 0.44, delay: i * 0.025, ease: 'easeOut' }}
          >
            {car}
          </motion.span>
        ))}
      </span>
    </motion.a>
  )
}
