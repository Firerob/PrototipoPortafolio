// En Next.js (App Router) este archivo necesita 'use client' como primera
// linea: usa estado, temporizadores y eventos del navegador. En Vite, como
// aqui, no hace falta nada.

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { sinMovimientoAhora, useSinMovimiento } from '../hooks/useMovimiento.js'

/**
 * Pantalla de apertura en tres fases.
 *
 *   1. Rotacion rapida de palabras sobre fondo oscuro.
 *   2. El nombre entra en escalera, linea a linea, tras una mascara.
 *   3. La pantalla se desliza hacia arriba y descubre el sitio.
 *
 * Sobre la duracion: casi cuatro segundos bloqueando el scroll es mucho
 * para quien ya conoce el sitio, y las guias de UX son explicitas en que
 * una secuencia de apertura no debe ser obligatoria. De ahi las tres
 * salidas que trae: tecla Escape, boton visible, y `soloUnaVezPorSesion`
 * para que en produccion no se repita en cada navegacion. Con
 * `prefers-reduced-motion` no llega a montarse.
 *
 * Se desmonta solo: mantiene su propio AnimatePresence, de modo que la
 * animacion de salida termina antes de desaparecer sin que el componente
 * padre tenga que orquestar nada. Solo hay que renderizarlo y escuchar
 * `onCompletado`.
 */

export interface PreloaderProps {
  /** Palabras de la fase 1. Se recorren en bucle hasta agotar la fase. */
  palabras?: string[]
  /** Nombre partido en lineas. Se maquetan en escalera: impares a la izquierda. */
  nombre?: string[]
  /** Milisegundos que dura cada palabra. Por defecto 300. */
  msPorPalabra?: number
  /** Duracion total de la fase 1. Por defecto 2500. */
  msFasePalabras?: number
  /** Duracion de la fase 2, el nombre. Por defecto 1300. */
  msFaseNombre?: number
  /** Se llama cuando la cortina ya salio y el componente se desmonto. */
  onCompletado?: () => void
  /** Muestra la apertura una sola vez por pestaña. Por defecto false. */
  soloUnaVezPorSesion?: boolean
  /** Clave de sessionStorage cuando la opcion anterior esta activa. */
  claveSesion?: string
  /** Texto del boton de salida. */
  textoSaltar?: string
}

type Fase = 'palabras' | 'nombre' | 'saliendo'

const SALIDA_MS = 800

export default function Preloader({
  palabras = ['Telegram Bot', 'E-Commerce', 'Parallel Computing', 'Systems Eng'],
  nombre = ['Felipe', 'Moninja'],
  msPorPalabra = 300,
  msFasePalabras = 2500,
  msFaseNombre = 1300,
  onCompletado,
  soloUnaVezPorSesion = false,
  claveSesion = 'apertura-vista',
  textoSaltar = 'Saltar',
}: PreloaderProps) {
  const sinMovimiento = useSinMovimiento()

  // Decidido en el primer render para no llegar a pintar la cortina si no
  // toca: montarla y quitarla enseguida produciria un destello.
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    if (sinMovimientoAhora()) return false
    if (soloUnaVezPorSesion && sessionStorage.getItem(claveSesion) === '1') return false
    return true
  })

  const [fase, setFase] = useState<Fase>('palabras')
  const [indice, setIndice] = useState(0)
  const relojes = useRef<number[]>([])

  const limpiarRelojes = () => {
    relojes.current.forEach((id) => window.clearTimeout(id))
    relojes.current = []
  }

  /** Corta la secuencia y pasa directo a la salida. */
  const salir = useCallback(() => {
    limpiarRelojes()
    setFase((f) => (f === 'saliendo' ? f : 'saliendo'))
  }, [])

  // ── Secuencia ────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || fase !== 'palabras') return

    const rotar = window.setInterval(
      () => setIndice((i) => (i + 1) % palabras.length),
      msPorPalabra
    )
    const aNombre = window.setTimeout(() => setFase('nombre'), msFasePalabras)
    relojes.current.push(aNombre)

    return () => {
      window.clearInterval(rotar)
      window.clearTimeout(aNombre)
    }
  }, [visible, fase, palabras.length, msPorPalabra, msFasePalabras])

  useEffect(() => {
    if (!visible || fase !== 'nombre') return
    const aSalida = window.setTimeout(() => setFase('saliendo'), msFaseNombre)
    relojes.current.push(aSalida)
    return () => window.clearTimeout(aSalida)
  }, [visible, fase, msFaseNombre])

  useEffect(() => {
    if (!visible || fase !== 'saliendo') return
    const fin = window.setTimeout(() => {
      setVisible(false)
      if (soloUnaVezPorSesion) sessionStorage.setItem(claveSesion, '1')
      onCompletado?.()
    }, SALIDA_MS)
    relojes.current.push(fin)
    return () => window.clearTimeout(fin)
  }, [visible, fase, onCompletado, soloUnaVezPorSesion, claveSesion])

  // ── Bloqueo del scroll ───────────────────────────────────────
  // Se guarda el valor anterior en vez de asumir cadena vacia, por si algo
  // mas ya lo habia bloqueado.
  useEffect(() => {
    if (!visible) return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previo }
  }, [visible])

  // ── Escape para salir ────────────────────────────────────────
  useEffect(() => {
    if (!visible) return
    const alPulsar = (e: KeyboardEvent) => { if (e.key === 'Escape') salir() }
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [visible, salir])

  useEffect(() => limpiarRelojes, [])

  if (sinMovimiento) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="apertura"
          className="fixed inset-0 z-[100] flex flex-col justify-between
                     bg-[#0B0B0B] px-6 py-6 text-white md:px-10 md:py-10"
          initial={{ y: 0 }}
          animate={{ y: fase === 'saliendo' ? '-100%' : 0 }}
          transition={{ duration: SALIDA_MS / 1000, ease: [0.87, 0, 0.13, 1] }}
        >
          {/* Un solo anuncio para lectores de pantalla. Las palabras que
              rotan van marcadas aria-hidden: leerlas una a una a 300 ms
              seria un atropello sin ninguna informacion util detras. */}
          <p className="sr-only" role="status" aria-live="polite">
            Cargando el sitio
          </p>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={salir}
              className="min-h-[44px] cursor-pointer px-4 text-[11px] uppercase
                         tracking-[0.22em] text-white/60 transition-colors
                         hover:text-white focus-visible:outline focus-visible:outline-2
                         focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {textoSaltar}
            </button>
          </div>

          <div className="flex flex-1 items-center">
            {/* ── Fase 1: palabras que se relevan ── */}
            {fase === 'palabras' && (
              <div className="relative mx-auto h-[1.4em] w-full text-center
                              text-[clamp(1.75rem,6vw,4rem)] font-extralight leading-none"
                   aria-hidden="true">
                <AnimatePresence>
                  <motion.span
                    key={indice}
                    className="absolute inset-x-0"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    // La salida es mas rapida que la entrada: si duran igual,
                    // las dos palabras se solapan y se lee un borron.
                    transition={{
                      opacity: { duration: 0.18 },
                      y: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
                    }}
                  >
                    {palabras[indice]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}

            {/* ── Fase 2: el nombre en escalera ── */}
            {fase !== 'palabras' && (
              <motion.div
                className="mx-auto flex w-full max-w-5xl flex-col gap-1"
                initial="oculto"
                animate="visible"
                aria-label={nombre.join(' ')}
              >
                {nombre.map((linea, i) => (
                  // La mascara recorta la linea mientras sube: entra desde
                  // detras del borde, no se desvanece encima.
                  <span
                    key={linea}
                    aria-hidden="true"
                    className={`block overflow-hidden ${i % 2 === 0 ? 'text-left' : 'text-right'}`}
                  >
                    <motion.span
                      className="block text-[clamp(2.5rem,12vw,9rem)] font-extralight
                                 leading-[0.92] tracking-[-0.03em]"
                      variants={{
                        oculto: { y: '110%' },
                        visible: { y: 0 },
                      }}
                      transition={{
                        duration: 0.9,
                        delay: i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {linea}
                    </motion.span>
                  </span>
                ))}
              </motion.div>
            )}
          </div>

          <div className="flex justify-between text-[11px] uppercase tracking-[0.22em] text-white/40">
            <span>Portafolio</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
