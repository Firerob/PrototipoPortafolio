import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { TituloHero } from './Texto.jsx'
import { PlanoHero, Flecha } from './Dibujos.jsx'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

/** Boton que se deja arrastrar por el cursor, con el tiron limitado. */
function BotonIman({ children, href }) {
  const sinMovimiento = useSinMovimiento()
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const muelle = { stiffness: 260, damping: 14, mass: 0.6 }
  const sx = useSpring(x, muelle)
  const sy = useSpring(y, muelle)

  const seguir = (e) => {
    if (sinMovimiento) return
    const r = ref.current.getBoundingClientRect()
    // El 0.3 evita que el boton se escape de su propia zona de clic
    x.set((e.clientX - r.left - r.width / 2) * 0.3)
    y.set((e.clientY - r.top - r.height / 2) * 0.3)
  }
  const soltar = () => { x.set(0); y.set(0) }

  return (
    <motion.a
      ref={ref}
      href={href}
      className="btn"
      style={sinMovimiento ? undefined : { x: sx, y: sy }}
      onMouseMove={seguir}
      onMouseLeave={soltar}
    >
      {children}
    </motion.a>
  )
}

export default function Hero({ arrancar }) {
  const sinMovimiento = useSinMovimiento()
  const seccion = useRef(null)
  const plano = useRef(null)

  // Parallax de scroll y del raton en elementos distintos, para que no
  // compitan por la misma matriz de transformacion.
  const { scrollYProgress } = useScroll({
    target: seccion,
    offset: ['start start', 'end start'],
  })
  const yScroll = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  // El contenido se despide al abandonar la pantalla. No es parallax de
  // lectura —eso entorpece leer—: solo actua en el ultimo tramo, cuando el
  // texto ya se dejo atras, para que el paso a la marquesina no sea un corte.
  const opacidadHero = useTransform(scrollYProgress, [0, 0.55, 0.95], [1, 1, 0])
  const yHero = useTransform(scrollYProgress, [0, 1], [0, -60])
  const anchoRiel = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const muelle = { stiffness: 60, damping: 20 }
  const planoX = useSpring(rx, muelle)
  const planoY = useSpring(ry, muelle)

  useEffect(() => {
    if (sinMovimiento || !window.matchMedia('(pointer: fine)').matches) return
    const mover = (e) => {
      rx.set((e.clientX / window.innerWidth - 0.5) * -46)
      ry.set((e.clientY / window.innerHeight - 0.5) * -30)
    }
    window.addEventListener('mousemove', mover, { passive: true })
    return () => window.removeEventListener('mousemove', mover)
  }, [rx, ry, sinMovimiento])

  // El trazo se dibuja solo: cada linea arranca con su longitud completa
  // como hueco y la va cerrando.
  useEffect(() => {
    if (sinMovimiento || !plano.current) return
    const trazos = plano.current.querySelectorAll('.tr')
    trazos.forEach((t) => {
      const largo = t.getTotalLength?.() ?? 0
      if (!largo) return
      t.style.strokeDasharray = largo
      t.style.strokeDashoffset = largo
      t.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.22,.61,.36,1)'
    })
    const id = setTimeout(() => {
      trazos.forEach((t, i) => {
        t.style.transitionDelay = `${i * 0.08}s`
        t.style.strokeDashoffset = 0
      })
    }, arrancar ? 100 : 600)
    return () => clearTimeout(id)
  }, [arrancar, sinMovimiento])

  const aparece = {
    hidden: { opacity: 0, y: 22 },
    show: (i) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.7, delay: 0.35 + i * 0.09, ease: [0.16, 1, 0.3, 1] },
    }),
  }
  const estado = arrancar ? 'show' : 'hidden'

  return (
    <section id="inicio" className="hero" ref={seccion}>
      <div className="hero-fondo" aria-hidden="true">
        <motion.div id="parallax" style={{ y: yScroll }}>
          <motion.div ref={plano} style={{ x: planoX, y: planoY }}>
            <PlanoHero />
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="wrap"
                  style={sinMovimiento ? undefined : { opacity: opacidadHero, y: yHero }}>
        <div className="g12">
          <motion.p className="eyebrow c-eyebrow" custom={0} variants={aparece}
                    initial="hidden" animate={estado}>
            Estudio de arquitectura · Santiago de Chile
          </motion.p>

          <TituloHero texto="Espacio, luz y materia" className="display" arrancar={arrancar} />

          <motion.p className="lead c-lead" custom={1} variants={aparece}
                    initial="hidden" animate={estado}>
            Proyectamos casas, equipamiento público y rehabilitaciones donde la
            construcción se lee con claridad. Doce años de obra entre la cordillera
            y el litoral.
          </motion.p>

          <motion.div className="c-cta" custom={2} variants={aparece}
                      initial="hidden" animate={estado}>
            <BotonIman href="#proyectos">
              Ver proyectos <Flecha />
            </BotonIman>
            <a href="#contacto" className="enlace-simple sub">Conversemos un encargo</a>
          </motion.div>
        </div>
      </motion.div>

      <div className="indicador" aria-hidden="true">
        Scroll
        <span className="riel">
          <motion.span style={{ width: anchoRiel, left: 0, right: 'auto' }} />
        </span>
      </div>
    </section>
  )
}
