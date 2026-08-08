import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import { proyectos, categorias } from '../data/proyectos.js'
import { useAparicion } from '../hooks/useAparicion.js'
import Revelar from './Revelar.jsx'
import { TituloPartido } from './Texto.jsx'
import Dibujo from './Dibujos.jsx'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

/** Tarjeta que se inclina hacia el cursor y descubre su dibujo con una cortina. */
function Tarjeta({ proyecto, indice }) {
  const sinMovimiento = useSinMovimiento()
  const ref = useRef(null)
  // El observador va en la tarjeta entera, NO en el marco.
  // El marco se oculta con clip-path: inset(0 0 100% 0), que lo recorta a
  // altura cero, y Chromium descuenta ese recorte al medir la interseccion:
  // el marco se veria siempre al 0% y el disparador que debe abrirlo no
  // llegaria a activarse jamas. La tarjeta no esta recortada, asi que si.
  const [refCortina, cortina] = useAparicion({ amount: 0.25 })

  // Profundidad: el dibujo se desplaza dentro de su marco al pasar por
  // pantalla. El marco recorta y el dibujo esta al 110%, asi que el
  // recorrido nunca descubre un borde vacio. Delta corto (6%), que es lo
  // que separa la sensacion de profundidad del mareo.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const yDibujo = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const muelle = { stiffness: 180, damping: 20 }
  const srx = useSpring(rotX, muelle)
  const sry = useSpring(rotY, muelle)

  const inclinar = (e) => {
    if (sinMovimiento) return
    const r = ref.current.getBoundingClientRect()
    // 7 grados es el techo: mas alla el dibujo se deforma y se nota el truco
    rotX.set(((e.clientY - r.top) / r.height - 0.5) * -7)
    rotY.set(((e.clientX - r.left) / r.width - 0.5) * 7)
  }
  const enderezar = () => { rotX.set(0); rotY.set(0) }

  const clases = ['card', proyecto.ancho, proyecto.desfase].filter(Boolean).join(' ')

  return (
    <motion.article
      ref={refCortina}
      className={clases}
      layout
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.45, delay: indice * 0.06, ease: [0.34, 1.3, 0.64, 1] }}
    >
      <a href="#" ref={ref} onMouseMove={inclinar} onMouseLeave={enderezar}>
        <motion.div
          className={`marco ${proyecto.proporcion}`}
          style={sinMovimiento ? undefined : { rotateX: srx, rotateY: sry }}
          initial="cerrada"
          animate={sinMovimiento ? 'abierta' : cortina === 'visible' ? 'abierta' : 'cerrada'}
          variants={{
            cerrada: { clipPath: 'inset(0 0 100% 0)' },
            abierta: { clipPath: 'inset(0 0 0% 0)' },
          }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="capa-dibujo"
            style={sinMovimiento ? undefined : { y: yDibujo }}
          >
            <Dibujo nombre={proyecto.dibujo} alt={proyecto.alt} />
          </motion.div>
        </motion.div>

        <div className="pie-card">
          <div>
            <h3>{proyecto.titulo}</h3>
            <p className="meta">{proyecto.meta}</p>
            <p className="leer">Ver ficha →</p>
          </div>
          <span className="num">{String(indice + 1).padStart(2, '0')}</span>
        </div>
      </a>
    </motion.article>
  )
}

export default function Proyectos() {
  const [filtro, setFiltro] = useState('todos')
  const visibles = proyectos.filter((p) => filtro === 'todos' || p.categoria === filtro)

  return (
    <section id="proyectos" className="seccion">
      <div className="wrap">

        <div className="g12 cabecera">
          <div className="c-titulo">
            <Revelar as="p" className="eyebrow">Obra</Revelar>
            <TituloPartido texto="Proyectos seleccionados" className="h2" />
          </div>
          <Revelar as="p" className="small c-nota">
            Una selección de obra construida entre 2021 y 2025.
          </Revelar>
        </div>

        <Revelar className="filtros" role="group"
                 aria-label="Filtrar proyectos por categoría">
          {categorias.map((c) => (
            <button
              key={c.id}
              type="button"
              className="filtro"
              aria-pressed={filtro === c.id}
              onClick={() => setFiltro(c.id)}
            >
              {c.etiqueta}
            </button>
          ))}
        </Revelar>

        <p className="sr" role="status" aria-live="polite">
          {visibles.length === 1 ? '1 proyecto visible.' : `${visibles.length} proyectos visibles.`}
        </p>

        <motion.div className="g12 grilla" layout>
          <AnimatePresence mode="popLayout">
            {visibles.map((p, i) => (
              <Tarjeta key={p.id} proyecto={p} indice={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {visibles.length === 0 && (
          <p className="vacio visible">No hay proyectos en esta categoría todavía.</p>
        )}
      </div>
    </section>
  )
}
