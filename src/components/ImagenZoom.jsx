import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

/**
 * Fotografia que se acerca con la rueda del raton mientras el cursor esta
 * encima. Rueda arriba acerca, rueda abajo aleja, entre 1x y 1.8x.
 *
 * Tres decisiones sostienen el gesto, y las tres van contra el ejemplo
 * tipico de "scroll zoom":
 *
 * 1. En los topes NO se llama a preventDefault, asi que la pagina sigue
 *    haciendo scroll. Sin esto, una foto al 1x seria una trampa: el cursor
 *    encima y la rueda sin efecto, la pagina quieta y el visitante
 *    preguntandose que se ha roto.
 *
 * 2. La rueda no se captura hasta que la pagina lleva ESPERA quieta. Pasar
 *    por encima de una foto a media frenada es lo normal en una portada de
 *    seis imagenes; secuestrar ese gesto convertiria el scroll de lectura
 *    en una loteria. Hay que pararse en la foto y entonces girar.
 *
 * 3. El listener es nativo y con passive:false. React registra `wheel` en
 *    la raiz como pasivo, y ahi preventDefault no hace nada: el zoom y el
 *    scroll ocurririan a la vez.
 *
 * Con movimiento reducido o sin raton (tactil), no se monta nada: queda un
 * <img> normal. El zoom es adorno, y la foto se ve entera sin el.
 */

const MIN = 1
const MAX = 1.8

// Una muesca de rueda son ~100px de deltaY en Chrome. A 0.0022 cada muesca
// vale ~0.22x: cuatro giros recorren el rango entero, que es mas o menos lo
// que alguien gira sin darse cuenta de que esta girando.
const PASO = 0.0022

// Margen de quietud antes de que la imagen se quede con la rueda.
const ESPERA = 180

const limitar = (v) => Math.min(MAX, Math.max(MIN, v))

/** deltaY llega en pixeles, en lineas o en pantallas segun el dispositivo. */
function enPixeles(e) {
  if (e.deltaMode === 1) return e.deltaY * 16                   // lineas
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight   // pantallas
  return e.deltaY
}

export default function ImagenZoom({ src, alt, ancho, alto }) {
  const sinMovimiento = useSinMovimiento()
  const caja = useRef(null)

  // El valor crudo salta con cada muesca; el muelle es lo que se ve.
  const zoom = useMotionValue(1)
  const escala = useSpring(zoom, { stiffness: 190, damping: 26, mass: 0.5 })

  useEffect(() => {
    const el = caja.current
    if (sinMovimiento || !el) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let dentro = false
    let listoEn = 0

    const rearmar = () => { if (dentro) listoEn = performance.now() + ESPERA }
    const entrar = () => { dentro = true; rearmar() }
    const salir = () => { dentro = false; zoom.set(1) }

    const rueda = (e) => {
      if (!dentro || performance.now() < listoEn) return
      const actual = zoom.get()
      const nuevo = limitar(actual - enPixeles(e) * PASO)
      if (nuevo === actual) return   // en el tope: la rueda es de la pagina
      e.preventDefault()
      zoom.set(nuevo)
    }

    el.addEventListener('mouseenter', entrar)
    el.addEventListener('mouseleave', salir)
    el.addEventListener('wheel', rueda, { passive: false })
    // Mientras la pagina se mueve, la foto no manda: el reloj se reinicia.
    window.addEventListener('scroll', rearmar, { passive: true })

    return () => {
      el.removeEventListener('mouseenter', entrar)
      el.removeEventListener('mouseleave', salir)
      el.removeEventListener('wheel', rueda)
      window.removeEventListener('scroll', rearmar)
    }
  }, [sinMovimiento, zoom])

  return (
    <div ref={caja} className="zoom">
      <motion.img
        className="shot"
        src={src}
        alt={alt}
        width={ancho}
        height={alto}
        // Ninguna foto del sitio esta sobre la linea de flotacion: el hero
        // es el plano dibujado. Todas pueden esperar al scroll.
        loading="lazy"
        decoding="async"
        draggable={false}
        style={sinMovimiento ? undefined : { scale: escala }}
      />
    </div>
  )
}
