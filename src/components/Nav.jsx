import { useEffect, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { navegacion } from '../data/proyectos.js'
import { useSeccionActiva } from '../hooks/useSeccionActiva.js'
import { EnlaceOnda } from './Texto.jsx'

// Fuera del componente: un array nuevo en cada render reiniciaria el observador
const IDS_SECCIONES = navegacion.map((n) => n.href.slice(1))

export default function Nav() {
  const [pegada, setPegada] = useState(false)
  const [oculta, setOculta] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const { scrollY } = useScroll()
  const activa = useSeccionActiva(IDS_SECCIONES)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const anterior = scrollY.getPrevious() ?? 0
    setPegada(y > 40)
    setOculta(y > anterior && y > 200)
  })

  // Cerrar con Escape y devolver el foco al boton que la abrio
  useEffect(() => {
    if (!abierto) return
    const alPulsar = (e) => {
      if (e.key === 'Escape') {
        setAbierto(false)
        document.getElementById('menu-btn')?.focus()
      }
    }
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [abierto])

  return (
    <header className={`nav${pegada ? ' pegada' : ''}${oculta && !abierto ? ' oculta' : ''}`}>
      <nav aria-label="Principal" className="wrap">
        <div className="nav-fila">
          <a href="#inicio" className="marca sub">Marina&nbsp;Olivares</a>

          <ul className="nav-links">
            {navegacion.map((n) => (
              <li key={n.href}>
                <EnlaceOnda
                  href={n.href}
                  texto={n.etiqueta}
                  className="sub"
                  actual={activa === n.href.slice(1)}
                />
              </li>
            ))}
          </ul>

          <button
            id="menu-btn"
            type="button"
            className="hamb"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="1.5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="1.5" aria-hidden="true">
                <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <div id="menu-movil" className={`menu-movil${abierto ? ' abierto' : ''}`}>
        <ul className="wrap">
          {navegacion.map((n) => (
            <li key={n.href}>
              <a href={n.href}
                 aria-current={activa === n.href.slice(1) ? 'true' : undefined}
                 onClick={() => setAbierto(false)}>{n.etiqueta}</a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
