import { useRef } from 'react'
import { motion, useScroll, useVelocity, useAnimationFrame, useMotionValue, useTransform, wrap } from 'framer-motion'
import { testimonios } from '../data/proyectos.js'
import { useSinMovimiento } from '../hooks/useMovimiento.js'
import Revelar from './Revelar.jsx'
import { TituloPartido } from './Texto.jsx'

/** Iniciales de las dos primeras palabras del nombre, para el avatar. */
function iniciales(nombre) {
  return nombre.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

function Tarjeta({ t }) {
  return (
    <figure className="cinta-card">
      <blockquote className="cinta-cita"><p>{t.cita}</p></blockquote>
      <figcaption className="cinta-pie">
        {t.foto ? (
          <img className="avatar" src={t.foto.src} alt="" width="48" height="48" loading="lazy" />
        ) : (
          <span className="avatar" aria-hidden="true">
            <span className="avatar-iniciales">{iniciales(t.autor)}</span>
          </span>
        )}
        <span>
          <cite>{t.autor}</cite>
          <span className="obra">{t.obra}</span>
        </span>
      </figcaption>
    </figure>
  )
}

/**
 * Cinta continua, mismo motor que la Marquesina de arriba (velocidad de
 * scroll -> avance, dos copias del grupo para que el corte del loop no se
 * note). Dos diferencias: la mitad de rapida —aqui hay parrafos que leer,
 * no terminos sueltos— y se pausa con el mouse o el foco encima, porque
 * sin eso un parrafo en movimiento continuo no da tiempo a terminarlo.
 *
 * El `gap` va DENTRO de cada grupo (no entre pista y grupo, como en la
 * Marquesina): asi cada mitad de la pista mide exactamente el 50% y
 * `wrap(-50, 0, v)` no arrastra un salto en la costura.
 *
 * Tambien se mueve en tactil: ahi el mouse no existe, asi que la pausa se
 * ata al toque —mantener el dedo sobre una tarjeta la detiene, igual que
 * el hover en escritorio— en vez de a eventos que ahi nunca llegarian.
 */
export default function Testimonios() {
  const sinMovimiento = useSinMovimiento()
  const animada = !sinMovimiento

  const base = useMotionValue(0)
  const rumbo = useRef(1)
  const pausada = useRef(false)

  const { scrollY } = useScroll()
  const velocidad = useVelocity(scrollY)
  const factor = useTransform(velocidad, [-2000, 0, 2000], [-5, 1, 5], { clamp: false })
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (!animada || pausada.current) return
    let avance = (-1.4 * delta) / 1000

    const v = velocidad.get()
    if (v < 0) rumbo.current = -1
    else if (v > 0) rumbo.current = 1

    avance += avance * Math.abs(factor.get() - 1)
    base.set(base.get() + avance * rumbo.current)
  })

  const pausar = () => { pausada.current = true }
  const reanudar = () => { pausada.current = false }

  const grupo = (oculto) => (
    <div className="cinta-grupo" aria-hidden={oculto || undefined}>
      {testimonios.map((t) => <Tarjeta key={t.autor} t={t} />)}
    </div>
  )

  return (
    <section id="testimonios" className="clientes">
      <div className="wrap clientes-cabecera">
        <Revelar as="p" className="eyebrow">Clientes</Revelar>
        <TituloPartido texto="Pregúnteles a ellos" className="h2" />
        <Revelar as="p" className="small">
          Cinco obras recibidas y cinco clientes que atienden el teléfono.
          Si quiere hablar con alguno antes de firmar, se lo presento.
        </Revelar>
      </div>

      {!animada ? (
        <div className="cinta-estatica">
          {testimonios.map((t) => <Tarjeta key={t.autor} t={t} />)}
        </div>
      ) : (
        <div
          className="cinta"
          onMouseEnter={pausar}
          onMouseLeave={reanudar}
          onFocusCapture={pausar}
          onBlurCapture={reanudar}
          onTouchStart={pausar}
          onTouchEnd={reanudar}
        >
          <motion.div className="cinta-pista" style={{ x }}>
            {grupo(false)}
            {grupo(true)}
          </motion.div>
        </div>
      )}
    </section>
  )
}
