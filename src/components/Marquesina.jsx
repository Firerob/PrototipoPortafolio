import { useRef } from 'react'
import { motion, useScroll, useVelocity, useAnimationFrame, useMotionValue, useTransform, wrap } from 'framer-motion'
import { ambitos } from '../data/proyectos.js'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

/**
 * Tira infinita que acelera al bajar y se invierte al subir.
 *
 * Dos copias del mismo grupo: cuando la primera se ha desplazado el 50%
 * del total, se reinicia el ciclo y el corte queda invisible. La segunda
 * copia lleva aria-hidden para que no se lea dos veces.
 */
export default function Marquesina() {
  const sinMovimiento = useSinMovimiento()
  const base = useMotionValue(0)
  const rumbo = useRef(1)

  const { scrollY } = useScroll()
  const velocidad = useVelocity(scrollY)
  const factor = useTransform(velocidad, [-2000, 0, 2000], [-5, 1, 5], { clamp: false })

  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (sinMovimiento) return
    let avance = (-2.2 * delta) / 1000

    const v = velocidad.get()
    if (v < 0) rumbo.current = -1
    else if (v > 0) rumbo.current = 1

    avance += avance * Math.abs(factor.get() - 1)
    base.set(base.get() + avance * rumbo.current)
  })

  const grupo = (oculto) => (
    <div className="tira-grupo" aria-hidden={oculto || undefined}>
      {ambitos.map((a, i) => (
        <span key={a} style={{ display: 'contents' }}>
          <span>{a}</span>
          {i < ambitos.length - 1 && <span className="punto">◦</span>}
        </span>
      ))}
      <span className="punto">◦</span>
    </div>
  )

  return (
    <section className="tira" aria-label="Ámbitos de trabajo">
      <motion.div className="tira-pista" style={sinMovimiento ? undefined : { x }}>
        {grupo(false)}
        {grupo(true)}
      </motion.div>
    </section>
  )
}
