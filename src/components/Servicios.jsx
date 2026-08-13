import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { servicios } from '../data/proyectos.js'
import { useSinMovimiento } from '../hooks/useMovimiento.js'
import Revelar from './Revelar.jsx'
import { TituloPartido } from './Texto.jsx'

/**
 * Fila completa numerada, no tarjeta en rejilla: la que tenia Proceso
 * antes de retirarse, con la regla que se dibuja sola rescatada aqui
 * (`.encargo-regla`, era `.regla`) en vez de perderse con el resto. El
 * ritmo horizontal y el titulo grande la distinguen de Proyectos y de
 * Testimonios, que son las otras dos secciones con lista.
 *
 * El barrido de fondo (`.encargo-fondo`) es un efecto de :hover, y en
 * tactil no hay hover: sin esto, en movil las filas se verian siempre
 * "apagadas". Para que la fila se sienta igual de viva ahi, se marca como
 * activa sola la que ocupa el centro de la pantalla mientras se hace
 * scroll —mismo criterio que ya usa `useSeccionActiva` para el link del
 * nav— y esa marca dispara el mismo CSS que el hover, via `.activo`.
 */
export default function Servicios() {
  const sinMovimiento = useSinMovimiento()
  const listaRef = useRef(null)
  const [activo, setActivo] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: hover)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    const el = listaRef.current
    if (!el) return
    const filas = Array.from(el.querySelectorAll('.encargo'))
    const visibles = new Map()

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const indice = filas.indexOf(e.target)
          if (indice === -1) continue
          if (e.isIntersecting) visibles.set(indice, e.intersectionRatio)
          else visibles.delete(indice)
        }
        if (!visibles.size) return
        const [[ganadora]] = [...visibles.entries()].sort((a, b) => b[1] - a[1])
        setActivo(ganadora)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    filas.forEach((f) => observador.observe(f))
    return () => observador.disconnect()
  }, [])

  return (
    <section id="servicios" className="seccion">
      <div className="wrap">
        <div className="g12 cabecera">
          <div className="c-titulo">
            <Revelar as="p" className="eyebrow">Servicios</Revelar>
            <TituloPartido texto="Encargos que tomo" className="h2" />
          </div>
          <Revelar as="p" className="small c-nota">
            Cinco líneas de trabajo. En todas dirijo la obra: el encargo no
            se cierra cuando se entregan los planos, se cierra en la
            recepción municipal.
          </Revelar>
        </div>

        <ol className="encargos" ref={listaRef}>
          {servicios.map((s, i) => (
            <li className={`encargo${activo === i ? ' activo' : ''}`} key={s.titulo}>
              {sinMovimiento ? (
                <span className="encargo-regla" aria-hidden="true" />
              ) : (
                <motion.span
                  className="encargo-regla"
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <span className="encargo-fondo" aria-hidden="true" />
              <div className="encargo-n">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <p className="eyebrow encargo-alcance">{s.alcance}</p>
              </div>
              <h3>{s.titulo}</h3>
              <p className="small encargo-texto">{s.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
