import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { TituloHero } from './Texto.jsx'
import { Flecha } from './Dibujos.jsx'
import { useSinMovimiento } from '../hooks/useMovimiento.js'
import posterHero from '../assets/fotos/marina-hero-poster.jpg'
import finalHero from '../assets/fotos/marina-hero-final.jpg'
import clipHero from '../assets/video/marina-hero.mp4'

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
  const video = useRef(null)

  // Parallax de scroll sobre el fondo.
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

  // La carga arranca desde el primer instante, aunque el video no se vea:
  // la intro tarda bastante mas de dos segundos, tiempo de sobra para que
  // el archivo (medio MB) ya este listo cuando arrancar pase a true. Sin
  // esto el <video> empezaba a pedir el archivo justo en ese momento, y la
  // espera de red se notaba como un instante muerto nada mas abrir el sitio.
  useEffect(() => {
    if (sinMovimiento) return
    const el = video.current
    if (!el || el.src) return
    el.src = clipHero
    el.load()
  }, [sinMovimiento])

  // El clip corre una sola vez, sin loop: arranca al terminar la intro y se
  // queda en su ultimo fotograma —ella ya volteada hacia la camara—, que es
  // el estado de reposo del hero. No hace falta reiniciarlo ni ocultarlo al
  // terminar: un <video> sin loop simplemente se detiene ahi.
  useEffect(() => {
    if (sinMovimiento || !arrancar) return
    video.current?.play?.().catch(() => {})
  }, [arrancar, sinMovimiento])

  const aparece = {
    hidden: { opacity: 0, y: 22 },
    show: (i) => ({
      opacity: 1, y: 0,
      transition: { duration: 1.1, delay: i * 0.5, ease: [0.16, 1, 0.3, 1] },
    }),
  }
  const estado = arrancar ? 'show' : 'hidden'

  return (
    <section id="inicio" className="hero" ref={seccion}>
      <div className="hero-fondo" aria-hidden="true">
        <motion.div id="parallax" style={{ y: yScroll }}>
          {sinMovimiento ? (
            <img className="hero-video" src={finalHero} alt="" width="1280" height="720" />
          ) : (
            <video
              ref={video}
              className="hero-video"
              poster={posterHero}
              width="1280"
              height="720"
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload nofullscreen noplaybackrate noremoteplayback"
            />
          )}
        </motion.div>
        <div className="hero-velo" />
      </div>

      <motion.div className="wrap"
                  style={sinMovimiento ? undefined : { opacity: opacidadHero, y: yHero }}>
        <div className="g12">
          <motion.p className="eyebrow c-eyebrow" custom={0} variants={aparece}
                    initial="hidden" animate={estado}>
            Arquitecta · Santiago de Chile · En ejercicio desde 2013
          </motion.p>

          <TituloHero texto="Construyo lo que dibujo" className="display" arrancar={arrancar} />

          <motion.p className="lead c-lead" custom={1} variants={aparece}
                    initial="hidden" animate={estado}>
            Proyecto y dirijo casas, equipamiento público y rehabilitaciones,
            con la misma arquitecta en terreno de principio a fin: de la
            primera visita a la recepción municipal.
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
    </section>
  )
}
