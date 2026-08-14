import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import { proyectos, categorias } from '../data/proyectos.js'
import { useAparicion } from '../hooks/useAparicion.js'
import Revelar from './Revelar.jsx'
import { TituloPartido } from './Texto.jsx'
import ImagenZoom from './ImagenZoom.jsx'
import ProyectoModal from './ProyectoModal.jsx'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

/** Tarjeta que se inclina hacia el cursor y descubre su dibujo con una cortina. */
function Tarjeta({ proyecto, indice, onAbrir }) {
  const sinMovimiento = useSinMovimiento()
  const ref = useRef(null)
  // El observador va en la tarjeta entera, NO en el marco.
  // El marco se oculta con clip-path: inset(0 0 100% 0), que lo recorta a
  // altura cero, y Chromium descuenta ese recorte al medir la interseccion:
  // el marco se veria siempre al 0% y el disparador que debe abrirlo no
  // llegaria a activarse jamas. La tarjeta no esta recortada, asi que si.
  const [refCortina, cortina] = useAparicion({ amount: 0.25 })

  // Profundidad: la foto se desplaza dentro de su marco al pasar por
  // pantalla. El marco recorta y la capa mide 116% de alto, asi que el
  // recorrido nunca descubre un borde vacio. Delta corto (6%), que es lo
  // que separa la sensacion de profundidad del mareo.
  //
  // El parallax va en la capa y el zoom de rueda en el <img> que lleva
  // dentro: dos elementos distintos, dos transformaciones que no se pisan.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const yFoto = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const muelle = { stiffness: 180, damping: 20 }
  const srx = useSpring(rotX, muelle)
  const sry = useSpring(rotY, muelle)

  const inclinar = (e) => {
    if (sinMovimiento) return
    const r = ref.current.getBoundingClientRect()
    // 9 grados: un poco mas sensible que el techo original (7), pero
    // todavia lejos de donde el dibujo se deforma y se nota el truco.
    rotX.set(((e.clientY - r.top) / r.height - 0.5) * -9)
    rotY.set(((e.clientX - r.left) / r.width - 0.5) * 9)
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
      transition={{ duration: 0.8, delay: indice * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        ref={ref}
        onMouseMove={inclinar}
        onMouseLeave={enderezar}
        onClick={() => onAbrir(proyecto, ref.current)}
      >
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
            className="capa-foto"
            style={sinMovimiento ? undefined : { y: yFoto }}
          >
            <ImagenZoom
              src={proyecto.foto.src}
              alt={proyecto.alt}
              ancho={proyecto.foto.w}
              alto={proyecto.foto.h}
            />
          </motion.div>

          {/* El gesto de la rueda no se adivina. La pista aparece al pasar
              por encima, dentro del marco recortado, y nunca sustituye a
              nada: la foto ya se ve entera sin tocarla. */}
          {!sinMovimiento && <span className="pista-zoom" aria-hidden="true">Rueda para acercar</span>}
        </motion.div>

        <div className="pie-card">
          <div>
            <h3>{proyecto.titulo}</h3>
            <p className="meta">{proyecto.meta}</p>
            <p className="leer">Ver ficha →</p>
          </div>
          <span className="num">{String(indice + 1).padStart(2, '0')}</span>
        </div>
      </button>
    </motion.article>
  )
}

export default function Proyectos() {
  const [filtro, setFiltro] = useState('todos')
  const visibles = proyectos.filter((p) => filtro === 'todos' || p.categoria === filtro)

  // El proyecto abierto y el elemento que lo disparo, para devolver el
  // foco ahi al cerrar.
  const [abierto, setAbierto] = useState(null)
  const disparadorRef = useRef(null)

  const abrir = (proyecto, elemento) => {
    disparadorRef.current = elemento
    setAbierto(proyecto)
  }
  const cerrar = () => setAbierto(null)

  return (
    <section id="proyectos" className="seccion">
      <div className="wrap">

        <div className="g12 cabecera">
          <div className="c-titulo">
            <Revelar as="p" className="eyebrow">Obra</Revelar>
            <TituloPartido texto="Proyectos seleccionados" className="h2" />
          </div>
          <Revelar as="p" className="small c-nota">
            Seis obras entre 2021 y 2025, 4.725 m² en total. La última
            todavía está en obra.
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
              <Tarjeta key={p.id} proyecto={p} indice={i} onAbrir={abrir} />
            ))}
          </AnimatePresence>
        </motion.div>

        {visibles.length === 0 && (
          <p className="vacio visible">No hay proyectos en esta categoría todavía.</p>
        )}

        <Revelar className="puente">
          <p className="small">
            Aquí hay seis de sesenta y cuatro obras entregadas. Si busca una
            tipología que no aparece, pídame la ficha: superficie, plazo y
            costo por m².
          </p>
          <a href="#contacto" className="enlace-simple sub">Pedir una ficha</a>
        </Revelar>
      </div>

      <AnimatePresence>
        {abierto && (
          <ProyectoModal
            proyecto={abierto}
            onClose={cerrar}
            disparador={disparadorRef.current}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
