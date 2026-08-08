import { useEffect, useState } from 'react'
import { motion, animate, useMotionValue } from 'framer-motion'

/**
 * Cuenta de 00 a 100 y se retira hacia arriba.
 *
 * No se monta si el sistema pide movimiento reducido: de eso se encarga
 * App, que directamente no lo renderiza. Avisa por `alTerminar` para que
 * el titular del hero arranque justo cuando se descorre el telon.
 */
export default function Preloader({ alTerminar }) {
  const cuenta = useMotionValue(0)
  const [texto, setTexto] = useState('00')
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    const desuscribir = cuenta.on('change', (v) => {
      setTexto(String(Math.round(v)).padStart(2, '0'))
    })
    const control = animate(cuenta, 100, {
      duration: 1.1,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setSaliendo(true),
    })
    return () => {
      desuscribir()
      control.stop()
    }
  }, [cuenta])

  return (
    <motion.div
      id="preloader"
      role="status"
      aria-live="polite"
      initial={{ y: 0 }}
      animate={saliendo ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1], delay: saliendo ? 0.15 : 0 }}
      onAnimationComplete={() => saliendo && alTerminar?.()}
    >
      <p className="eyebrow" style={{ color: 'var(--sand)' }}>
        Marina Olivares — Arquitectura
      </p>
      <p id="contador" aria-label="Cargando">{texto}</p>
    </motion.div>
  )
}
