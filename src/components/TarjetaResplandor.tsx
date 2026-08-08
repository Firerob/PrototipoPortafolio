import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

/**
 * Tarjeta con resplandor que sigue al cursor e inclinacion 3D.
 *
 * Todo el movimiento vive en motion values, no en estado de React: mover el
 * raton sobre la tarjeta no provoca ni un solo re-render. Con `useState` en
 * lugar de `useMotionValue` esto dispararia ~60 renders por segundo y en una
 * rejilla de tarjetas se notaria de inmediato.
 *
 * Accesibilidad, siguiendo las reglas de la skill:
 *  - El efecto es puro adorno. Todo lo que la tarjeta comunica esta en su
 *    contenido, nunca solo en el resplandor: en tactil no hay hover.
 *  - Se usan eventos de puntero y se ignora cualquier puntero grueso (dedo),
 *    que si no dejaria el estado pegado tras el toque.
 *  - Con `prefers-reduced-motion` no hay inclinacion ni resplandor.
 *  - El foco de teclado sigue siendo visible; el efecto no lo sustituye.
 */

export interface TarjetaResplandorProps {
  children: ReactNode
  /** Radio del resplandor en px. Por defecto 320. */
  radioResplandor?: number
  /** Color del resplandor. Acepta cualquier color CSS con alfa. */
  colorResplandor?: string
  /** Inclinacion maxima en grados. Por encima de ~10 el contenido se deforma. */
  inclinacionMaxima?: number
  /** Eleva la tarjeta en el eje Z al entrar el cursor. Por defecto 0 (sin escala). */
  escalaHover?: number
  /** Clases extra para el contenedor exterior. */
  className?: string
  /** Etiqueta accesible si la tarjeta entera actua como enlace o boton. */
  como?: 'div' | 'article' | 'section'
}

/** Fisica de retorno: suave y sin rebote perceptible. */
const MUELLE = { stiffness: 150, damping: 15, mass: 0.8 } as const

export default function TarjetaResplandor({
  children,
  radioResplandor = 320,
  colorResplandor = 'rgba(255,255,255,0.10)',
  inclinacionMaxima = 7,
  escalaHover = 1,
  className = '',
  como = 'article',
}: TarjetaResplandorProps) {
  const sinMovimiento = useSinMovimiento()
  const ref = useRef<HTMLDivElement>(null)

  // Posicion del cursor dentro de la tarjeta, en px, para el resplandor
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)

  // Posicion normalizada -0.5..0.5, para la inclinacion
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)
  const visible = useMotionValue(0)

  const inclX = useSpring(useTransform(ny, (v) => -v * inclinacionMaxima * 2), MUELLE)
  const inclY = useSpring(useTransform(nx, (v) => v * inclinacionMaxima * 2), MUELLE)
  const escala = useSpring(visible, MUELLE)
  const opacidad = useSpring(visible, { stiffness: 220, damping: 30 })

  // El gradiente se reconstruye en el hilo de composicion, sin pasar por React
  const fondo = useMotionTemplate`radial-gradient(${radioResplandor}px circle at ${rx}px ${ry}px, ${colorResplandor}, transparent 72%)`

  const escalaFinal = useTransform(escala, (v) => 1 + (escalaHover - 1) * v)

  const seguir = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Un dedo no "pasa por encima": sin esto el efecto se queda pegado
    // despues del toque, sin nada que lo devuelva a su sitio.
    if (sinMovimiento || e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    rx.set(x)
    ry.set(y)
    nx.set(x / r.width - 0.5)
    ny.set(y / r.height - 0.5)
  }

  const entrar = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (sinMovimiento || e.pointerType !== 'mouse') return
    visible.set(1)
  }

  // El reverso siempre existe: si el puntero sale rapido, o el navegador
  // cancela el gesto, la tarjeta vuelve igual. Nunca se queda a medias.
  const salir = () => {
    visible.set(0)
    nx.set(0)
    ny.set(0)
  }

  const Contenedor = motion[como]

  return (
    <Contenedor
      ref={ref}
      onPointerMove={seguir}
      onPointerEnter={entrar}
      onPointerLeave={salir}
      onPointerCancel={salir}
      style={
        sinMovimiento
          ? undefined
          : {
              rotateX: inclX,
              rotateY: inclY,
              scale: escalaFinal,
              transformStyle: 'preserve-3d',
            }
      }
      className={`group relative isolate overflow-hidden rounded-xl border border-sand
                  bg-paper [perspective:1000px] [will-change:transform] ${className}`}
    >
      {/* Resplandor. Detras del contenido y fuera del arbol de accesibilidad. */}
      {!sinMovimiento && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: fondo, opacity: opacidad }}
        />
      )}

      <div className="relative" style={{ transform: 'translateZ(40px)' }}>
        {children}
      </div>
    </Contenedor>
  )
}
