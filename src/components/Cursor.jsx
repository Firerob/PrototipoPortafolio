import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Cursor propio: un punto que sigue de cerca y un aro que llega tarde.
 * Es adorno puro — nunca comunica informacion que no este ya en la
 * pagina — y desaparece en pantallas tactiles y con movimiento reducido.
 */
export default function Cursor() {
  const [activo, setActivo] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const punto = { stiffness: 1400, damping: 60, mass: 0.3 }
  const aro = { stiffness: 220, damping: 26, mass: 0.6 }

  const px = useSpring(x, punto)
  const py = useSpring(y, punto)
  const ax = useSpring(x, aro)
  const ay = useSpring(y, aro)
  const escala = useMotionValue(1)
  const escalaSuave = useSpring(escala, { stiffness: 300, damping: 25 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const mover = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!activo) setActivo(true)
    }
    // Delegacion: un solo par de listeners para toda la pagina, en vez
    // de uno por enlace. Sobrevive a los nodos que React monta despues.
    const entrar = (e) => {
      if (e.target.closest?.('a, button')) escala.set(1.7)
    }
    const salir = (e) => {
      if (e.target.closest?.('a, button')) escala.set(1)
    }

    window.addEventListener('mousemove', mover, { passive: true })
    document.addEventListener('mouseover', entrar)
    document.addEventListener('mouseout', salir)
    return () => {
      window.removeEventListener('mousemove', mover)
      document.removeEventListener('mouseover', entrar)
      document.removeEventListener('mouseout', salir)
    }
  }, [x, y, escala, activo])

  return (
    <>
      <motion.div className="cursor-punto" aria-hidden="true"
                  style={{ x: px, y: py, opacity: activo ? 1 : 0 }} />
      <motion.div className="cursor-aro" aria-hidden="true"
                  style={{ x: ax, y: ay, scale: escalaSuave, opacity: activo ? 1 : 0 }} />
    </>
  )
}
