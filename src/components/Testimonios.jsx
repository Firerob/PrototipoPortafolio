import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useVelocity, useAnimationFrame, useMotionValue, useTransform, wrap } from 'framer-motion'
import { testimonios } from '../data/proyectos.js'
import { useSinMovimiento } from '../hooks/useMovimiento.js'
import Revelar from './Revelar.jsx'
import { TituloPartido } from './Texto.jsx'

/** Mismo patron que `useAnclajePosible` en Perfil.jsx. */
function useEsMovil() {
  const consulta = '(max-width: 767px)'
  const [movil, setMovil] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(consulta).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(consulta)
    const actualizar = () => setMovil(mq.matches)
    actualizar()
    mq.addEventListener('change', actualizar)
    return () => mq.removeEventListener('change', actualizar)
  }, [])
  return movil
}

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
  const movil = useEsMovil()
  const animada = !sinMovimiento

  const base = useMotionValue(0)
  const rumbo = useRef(1)
  const pausada = useRef(false)
  const pistaRef = useRef(null)
  const cintaRef = useRef(null)
  const arrastre = useRef({ activo: false, eje: null, x: 0, y: 0, ancho: 1 })

  const { scrollY } = useScroll()
  const velocidad = useVelocity(scrollY)
  const factor = useTransform(velocidad, [-2000, 0, 2000], [-5, 1, 5], { clamp: false })
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  // Al doble en movil: ahi la tarjeta es mas angosta y a la misma
  // velocidad de escritorio se siente lenta de cruzar.
  useAnimationFrame((_, delta) => {
    if (!animada || pausada.current) return
    let avance = ((movil ? -3.6 : -1.4) * delta) / 1000

    const v = velocidad.get()
    if (v < 0) rumbo.current = -1
    else if (v > 0) rumbo.current = 1

    avance += avance * Math.abs(factor.get() - 1)
    base.set(base.get() + avance * rumbo.current)
  })

  const pausar = () => { pausada.current = true }
  const reanudar = () => { pausada.current = false }

  // En tactil no hay mouse que pause con hover: el dedo sobre una tarjeta
  // la detiene y, ademas, la puede arrastrar a gusto — el mismo `base` que
  // conduce el auto-scroll, movido a mano.
  //
  // Van por `addEventListener` nativo, no por `onTouchMove` de React: los
  // handlers de React para eventos tactiles se registran `passive` por
  // defecto, y un listener pasivo no puede llamar `preventDefault()`. Sin
  // eso, en cuanto el navegador decide (por su cuenta) que el gesto es un
  // scroll de pagina, se queda con el gesto y el arrastre se siente
  // trabado —el dedo se mueve pero la cinta ya no responde igual—. Con un
  // listener no-pasivo se puede tomar el control apenas se confirma que el
  // gesto es horizontal, y listo, ya no hay pulseada con el navegador.
  useEffect(() => {
    const el = cintaRef.current
    if (!el) return

    const inicio = (e) => {
      pausar()
      const t = e.touches[0]
      arrastre.current = { activo: true, eje: null, x: t.clientX, y: t.clientY, ancho: pistaRef.current?.scrollWidth || 1 }
    }

    const mover = (e) => {
      const a = arrastre.current
      if (!a.activo) return
      const t = e.touches[0]
      const dx = t.clientX - a.x
      const dy = t.clientY - a.y

      if (a.eje === null) {
        // Unos pocos pixeles de margen antes de decidir el eje: un dedo
        // nunca parte perfectamente recto, y decidir en el primer pixel
        // deja el gesto atrapado del lado equivocado por puro temblor.
        if (Math.hypot(dx, dy) < 6) return
        a.eje = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      }
      if (a.eje === 'y') return // vertical: que la pagina haga scroll, sin tocar la cinta

      e.preventDefault()
      a.x = t.clientX
      a.y = t.clientY
      // `scrollWidth`, no `offsetWidth`: la pista es un flex sin ancho
      // propio (ocupa el 100% del contenedor visible) mientras que su
      // contenido real —los grupos de tarjetas clonados— mide varias
      // pantallas de ancho.
      base.set(base.get() + (dx / a.ancho) * 100)
    }

    const fin = () => {
      arrastre.current.activo = false
      reanudar()
    }

    el.addEventListener('touchstart', inicio, { passive: true })
    el.addEventListener('touchmove', mover, { passive: false })
    el.addEventListener('touchend', fin, { passive: true })
    el.addEventListener('touchcancel', fin, { passive: true })
    return () => {
      el.removeEventListener('touchstart', inicio)
      el.removeEventListener('touchmove', mover)
      el.removeEventListener('touchend', fin)
      el.removeEventListener('touchcancel', fin)
    }
  }, [animada])

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
          ref={cintaRef}
          onMouseEnter={pausar}
          onMouseLeave={reanudar}
          onFocusCapture={pausar}
          onBlurCapture={reanudar}
        >
          <motion.div className="cinta-pista" style={{ x }} ref={pistaRef}>
            {grupo(false)}
            {grupo(true)}
          </motion.div>
        </div>
      )}
    </section>
  )
}
