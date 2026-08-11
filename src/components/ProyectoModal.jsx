import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { categorias } from '../data/proyectos.js'
import { useSinMovimiento } from '../hooks/useMovimiento.js'
import { Cerrar, Flecha } from './Dibujos.jsx'

/**
 * Cuanto se acerca por fotograma la posicion real a la deseada. Bajo =
 * mas deslizamiento. 0.11 es el punto donde el recorrido se siente
 * pesado —tiene inercia, no responde como un interruptor— sin llegar a
 * sentirse lento al querer llegar a un sitio concreto.
 */
const ARRASTRE = 0.11

/** Desplazamiento maximo del parallax dentro de cada panel, en px. */
const PARALAJE = 40

/**
 * El detalle de un proyecto: un carrusel que se abre ENCIMA de la
 * pagina, no una toma de pantalla que la reemplaza. El fondo del sitio
 * queda visible pero desenfocado detras —de ahi sale la sensacion de
 * "flota sobre la web" en vez de "sustituye a la web"—, y las fotos y
 * videos se ven a un tamaño de galeria, contenido, no a sangre.
 *
 * La entrada es deliberadamente simple: un fundido con leve escala. Ya
 * hubo una version con zoom desde la tarjeta clicada, y sobraba —
 * competia por la atencion con el propio contenido del carrusel, que es
 * lo que de verdad importa aqui.
 *
 * El recorrido horizontal usa el mismo motor de inercia que ya se probo
 * y funciono: la rueda y el arrastre mueven una posicion deseada, y un
 * bucle de requestAnimationFrame acerca la posicion real a esa cada
 * fotograma, con un parallax leve por panel.
 */
export default function ProyectoModal({ proyecto, onClose, disparador }) {
  const sinMovimiento = useSinMovimiento()
  const pistaRef = useRef(null)
  const raizRef = useRef(null)
  const cerrarRef = useRef(null)
  const barraRef = useRef(null)

  const objetivo = useRef(0)
  const actual = useRef(0)
  const conduciendo = useRef(false)
  const medidas = useRef([])

  const categoria = categorias.find((c) => c.id === proyecto.categoria)?.etiqueta ?? proyecto.categoria
  const paneles = [...proyecto.relato, { tipo: 'ficha' }]

  const cerrar = () => {
    onClose()
    disparador?.focus()
  }

  const desplazar = (delta) => {
    const el = pistaRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    objetivo.current = Math.max(0, Math.min(max, objetivo.current + delta))
    conduciendo.current = true
  }

  // Bloquea el scroll de la pagina de fondo mientras el carrusel vive, y
  // restaura el valor previo en vez de asumir uno.
  useEffect(() => {
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previo }
  }, [])

  useEffect(() => { cerrarRef.current?.focus() }, [])

  // Las posiciones de cada panel se miden UNA vez (y en cada resize), no
  // en cada fotograma: leer getBoundingClientRect dentro del bucle
  // obligaria al navegador a recalcular la maqueta sesenta veces por
  // segundo, justo despues de haberla movido.
  useLayoutEffect(() => {
    const el = pistaRef.current
    if (!el) return
    const medir = () => {
      medidas.current = Array.from(el.querySelectorAll('.relato-panel')).map((panel) => ({
        capa: panel.querySelector('.relato-capa'),
        centro: panel.offsetLeft + panel.offsetWidth / 2,
      }))
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  // El bucle: acerca la posicion real a la deseada y, con la misma
  // lectura, coloca el parallax de cada panel.
  useEffect(() => {
    const el = pistaRef.current
    if (!el || sinMovimiento) return

    let vivo = true
    const paso = () => {
      if (!vivo) return
      if (conduciendo.current) {
        const resto = objetivo.current - actual.current
        if (Math.abs(resto) < 0.4) {
          actual.current = objetivo.current
          conduciendo.current = false
        } else {
          actual.current += resto * ARRASTRE
        }
        el.scrollLeft = actual.current
      } else {
        // Nadie esta conduciendo: manda el scroll nativo (tactil, barra).
        actual.current = el.scrollLeft
        objetivo.current = el.scrollLeft
      }

      const ancho = el.clientWidth
      const mitad = ancho / 2
      for (const m of medidas.current) {
        if (!m.capa) continue
        const t = Math.max(-1.4, Math.min(1.4, (m.centro - actual.current - mitad) / ancho))
        m.capa.style.transform = `translate3d(${(-t * PARALAJE).toFixed(1)}px,0,0)`
        m.capa.style.opacity = String(1 - Math.min(0.5, Math.abs(t) * 0.45))
      }

      const max = el.scrollWidth - el.clientWidth
      if (barraRef.current) {
        barraRef.current.style.transform = `scaleX(${max > 0 ? actual.current / max : 0})`
      }
      requestAnimationFrame(paso)
    }
    const id = requestAnimationFrame(paso)
    return () => { vivo = false; cancelAnimationFrame(id) }
  }, [sinMovimiento])

  // La rueda vertical avanza el carrusel: no hay nada detras que
  // desplazar, el scroll de la pagina ya esta bloqueado. El gesto
  // horizontal del trackpad se suma igual.
  useEffect(() => {
    const el = pistaRef.current
    if (!el || sinMovimiento) return
    const rueda = (e) => {
      e.preventDefault()
      desplazar(Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX)
    }
    el.addEventListener('wheel', rueda, { passive: false })
    return () => el.removeEventListener('wheel', rueda)
  }, [sinMovimiento])

  // Arrastre con el raton. El pulsador tactil no entra aqui: ahi el
  // navegador ya trae su propio desplazamiento con inercia.
  useEffect(() => {
    const el = pistaRef.current
    if (!el || sinMovimiento) return

    let arrastrando = false
    let ultimaX = 0

    const bajar = (e) => {
      if (e.pointerType !== 'mouse') return
      arrastrando = true
      ultimaX = e.clientX
      el.classList.add('arrastrando')
    }
    const mover = (e) => {
      if (!arrastrando) return
      desplazar(ultimaX - e.clientX)
      ultimaX = e.clientX
    }
    const soltar = () => {
      arrastrando = false
      el.classList.remove('arrastrando')
    }

    el.addEventListener('pointerdown', bajar)
    window.addEventListener('pointermove', mover)
    window.addEventListener('pointerup', soltar)
    return () => {
      el.removeEventListener('pointerdown', bajar)
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerup', soltar)
    }
  }, [sinMovimiento])

  // Escape, flechas y atrapa-foco de Tab en un solo listener.
  useEffect(() => {
    const alPulsar = (e) => {
      if (e.key === 'Escape') { cerrar(); return }
      const salto = (pistaRef.current?.clientWidth ?? 800) * 0.6
      if (e.key === 'ArrowRight') desplazar(salto)
      if (e.key === 'ArrowLeft') desplazar(-salto)

      if (e.key === 'Tab' && raizRef.current) {
        const focosables = raizRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (!focosables.length) return
        const primero = focosables[0]
        const ultimo = focosables[focosables.length - 1]
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault(); ultimo.focus()
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault(); primero.focus()
        }
      }
    }
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      ref={raizRef}
      className="relato"
      role="dialog"
      aria-modal="true"
      aria-label={`${proyecto.titulo}, detalle del proyecto`}
      onClick={(e) => { if (e.target === e.currentTarget) cerrar() }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: sinMovimiento ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relato-fondo" aria-hidden="true" />

      <motion.div
        className="relato-contenido"
        initial={sinMovimiento ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={sinMovimiento ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: sinMovimiento ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relato-cabecera">
          <p className="relato-marca">
            <span>{proyecto.titulo}</span>
            <span className="relato-marca-meta">{proyecto.meta}</span>
          </p>
          <button ref={cerrarRef} type="button" className="relato-cerrar" onClick={cerrar} aria-label="Cerrar">
            <Cerrar />
          </button>
        </div>

        <div className="relato-pista" ref={pistaRef}>
          {paneles.map((panel, i) => (
            <Panel key={i} panel={panel} proyecto={proyecto} categoria={categoria} />
          ))}
        </div>

        <div className="relato-pie">
          <button type="button" className="relato-flecha" onClick={() => desplazar(-(pistaRef.current?.clientWidth ?? 800) * 0.6)} aria-label="Retroceder">
            <span className="relato-flecha-icono"><Flecha /></span>
          </button>
          <div className="relato-barra" aria-hidden="true">
            <span ref={barraRef} />
          </div>
          <button type="button" className="relato-flecha" onClick={() => desplazar((pistaRef.current?.clientWidth ?? 800) * 0.6)} aria-label="Avanzar">
            <Flecha />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/** Un panel: una foto o un video, con su titulo/texto si los trae. */
function Panel({ panel, proyecto, categoria }) {
  if (panel.tipo === 'imagen' || panel.tipo === 'video') {
    const conTexto = Boolean(panel.titulo || panel.texto)
    return (
      <section className={`relato-panel relato-panel--media${conTexto ? ' relato-panel--con-texto' : ''}`}>
        <div className="relato-capa">
          <div className="relato-media-marco">
            {panel.tipo === 'video' ? (
              <VideoPanel panel={panel} />
            ) : (
              <img className="relato-media-el" src={panel.src} alt={panel.alt ?? ''} width={panel.w} height={panel.h} loading="lazy" />
            )}
          </div>
          {conTexto && (
            <div className="relato-media-texto">
              {panel.titulo && <h3>{panel.titulo}</h3>}
              {panel.texto && <p>{panel.texto}</p>}
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="relato-panel relato-panel--ficha">
      <div className="relato-capa">
        <p className="eyebrow">Ficha técnica</p>
        <dl className="relato-ficha">
          <div><dt>Cliente</dt><dd>{proyecto.cliente}</dd></div>
          <div><dt>Tipología</dt><dd>{categoria}</dd></div>
          <div><dt>Ubicación</dt><dd>{proyecto.ubicacion}</dd></div>
          <div><dt>Año</dt><dd>{proyecto.anio}</dd></div>
          <div><dt>Superficie</dt><dd>{proyecto.superficie}</dd></div>
          <div><dt>Estado</dt><dd>{proyecto.estado}</dd></div>
        </dl>
      </div>
    </section>
  )
}

/**
 * Video del carrusel: arranca cuando entra en pantalla y se para al
 * salir. Todos los paneles conviven en el DOM —el recorrido horizontal
 * los necesita ahi—, asi que sin esto cada clip correria de fondo aunque
 * nadie lo mire.
 */
function VideoPanel({ panel }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) el.play?.().catch(() => {})
        else el.pause?.()
      },
      { threshold: 0.5 }
    )
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className="relato-media-el"
      src={panel.src}
      poster={panel.poster}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      controlsList="nodownload nofullscreen noplaybackrate noremoteplayback"
    />
  )
}
