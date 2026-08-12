import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useSinMovimiento } from '../hooks/useMovimiento.js'
import { retrato, trayectoria } from '../data/proyectos.js'
import Revelar from './Revelar.jsx'
import { TituloPartido } from './Texto.jsx'

/**
 * El anclaje solo tiene sentido si hay sitio de sobra: seis hitos mas un
 * retrato no caben ancladas en un telefono, y forzarlo dejaria la mitad
 * del contenido fuera de la pantalla pinneada. `sinMovimiento` ya apaga el
 * anclaje por su cuenta (ver companiente `anclado` en Perfil()); esto
 * cubre el otro caso, el de una pantalla chica con movimiento activado.
 */
function useAnclajePosible() {
  const consulta = '(min-width: 768px) and (min-height: 640px)'
  const [ok, setOk] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(consulta).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(consulta)
    const actualizar = () => setOk(mq.matches)
    actualizar()
    mq.addEventListener('change', actualizar)
    return () => mq.removeEventListener('change', actualizar)
  }, [])
  return ok
}

/**
 * Un hito de la trayectoria. Ancladas, las palabras se encendian con el
 * scroll; aqui es el mismo truco (`useTransform` sobre un tramo del
 * progreso) aplicado a un punto y una fila en vez de a una palabra suelta.
 * Los hitos que aun no llegan a su tramo NO bajan a opacidad 0: quedan en
 * el mismo gris apagado que ya usaba el manifiesto (6.6:1 sobre --ink),
 * legibles igual. Quien entra directo a #perfil por link no debe ver seis
 * filas en blanco.
 */
function Hito({ hito, indice, anclado, progreso, rango }) {
  const colorAnio = useTransform(progreso, rango, ['#8C8C89', '#FFFFFF'])
  const colorTexto = useTransform(progreso, rango, ['#6E6E6C', '#D6D5D2'])
  const escalaPunto = useTransform(progreso, rango, [0.4, 1])

  if (!anclado) {
    return (
      <Revelar as="li" className="hito" retardo={indice * 0.08} desplazamiento={14}>
        <span className="hito-punto" aria-hidden="true" />
        <div className="hito-cabeza">
          <span>{hito.anio}</span>
          <h3>{hito.titulo}</h3>
        </div>
        <p>{hito.texto}</p>
      </Revelar>
    )
  }

  return (
    <li className="hito">
      <motion.span className="hito-punto" style={{ scale: escalaPunto }} aria-hidden="true" />
      <div className="hito-cabeza">
        <motion.span style={{ color: colorAnio }}>{hito.anio}</motion.span>
        <motion.h3 style={{ color: colorTexto }}>{hito.titulo}</motion.h3>
      </div>
      <motion.p style={{ color: colorTexto }}>{hito.texto}</motion.p>
    </li>
  )
}

/**
 * El retrato entra como las tarjetas de Proyectos —una cortina que se
 * levanta—, pero conducida por el scroll de aproximacion en vez de por
 * whileInView: para cuando el ancla se activa, ya deberia estar puesta.
 */
function Retrato({ anclado, cortina, escalaFoto, opacidadCartel }) {
  const cartel = (
    <>
      <p>38.400 m² construidos. Puede ir a verlos.</p>
      <cite>Marina Olivares · Arquitecta, PUC 2012 · En ejercicio desde 2013</cite>
    </>
  )

  if (!anclado) {
    return (
      <Revelar as="figure" className="perfil-retrato" retardo={0.1}>
        <div className="marco r34">
          <img
            className="shot"
            src={retrato.src}
            alt={retrato.alt}
            width={retrato.w}
            height={retrato.h}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <figcaption className="perfil-cartel">{cartel}</figcaption>
      </Revelar>
    )
  }

  return (
    <figure className="perfil-retrato">
      <motion.div className="marco r34" style={{ clipPath: cortina }}>
        <motion.img
          className="shot"
          style={{ scale: escalaFoto }}
          src={retrato.src}
          alt={retrato.alt}
          width={retrato.w}
          height={retrato.h}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </motion.div>
      <motion.figcaption className="perfil-cartel" style={{ opacity: opacidadCartel }}>
        {cartel}
      </motion.figcaption>
    </figure>
  )
}

/**
 * La seccion que era Manifiesto. Conserva lo que ya funcionaba —el fondo
 * oscuro anclado, el foco de luz que sigue al cursor— y cambia lo que se
 * leia: en vez de una frase que se enciende, es el retrato entrando y
 * despues una linea de tiempo que se revela con el mismo scroll que antes
 * conducia las palabras. Es LA seccion Perfil: la que existia aparte
 * (retrato + ficha, en Estudio.jsx) se retiro y su contenido se repartio
 * aqui.
 */
export default function Perfil() {
  const sinMovimiento = useSinMovimiento()
  const anclajePosible = useAnclajePosible()
  const anclado = !sinMovimiento && anclajePosible

  const ref = useRef(null)
  const foco = useRef(null)

  // Dos lectores de scroll: uno solo dejaria la seccion en negro y vacia
  // durante toda la aproximacion, porque el progreso queda en 0 hasta que
  // el ancla se activa. `entrada` pone el retrato ANTES de eso; `recorrido`
  // —sobre los 280svh anclados— conduce la linea de tiempo.
  const { scrollYProgress: entrada } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  })
  const { scrollYProgress: recorrido } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const anchoRegla = useTransform(recorrido, [0, 0.3], ['0%', '100%'])
  const escalaEje = useTransform(recorrido, [0.05, 0.9], [0, 1])
  const cortina = useTransform(entrada, [0.15, 0.75], ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'])
  const escalaFoto = useTransform(entrada, [0.15, 1], [1.08, 1])
  const opacidadCartel = useTransform(entrada, [0.6, 0.95], [0, 1])

  const seguirFoco = (e) => {
    if (!anclado || !foco.current) return
    const r = foco.current.parentElement.getBoundingClientRect()
    foco.current.style.setProperty('--fx', `${e.clientX - r.left}px`)
    foco.current.style.setProperty('--fy', `${e.clientY - r.top}px`)
  }

  return (
    <section
      id="perfil"
      className="perfil oscuro"
      ref={ref}
      style={{ height: anclado ? '280svh' : 'auto' }}
      onMouseMove={seguirFoco}
      onMouseEnter={() => anclado && foco.current && (foco.current.style.opacity = '1')}
      onMouseLeave={() => anclado && foco.current && (foco.current.style.opacity = '0')}
    >
      <div className="perfil-pegado" style={anclado ? undefined : { position: 'static', overflow: 'visible' }}>
        {anclado && <div id="foco" ref={foco} aria-hidden="true" />}

        <div className="wrap caja">
          <header className="perfil-rotulo">
            <p className="eyebrow">Perfil</p>
            {anclado
              ? <motion.span className="perfil-regla" style={{ width: anchoRegla }} aria-hidden="true" />
              : <span className="perfil-regla" style={{ width: '100%' }} aria-hidden="true" />}
          </header>

          <div className="g12 perfil-cuerpo">
            <div className="perfil-relato">
              <TituloPartido texto="Quien dibuja, dirige" className="h2" />

              <div className="hitos-envoltorio">
                {anclado
                  ? <motion.span className="perfil-eje" style={{ scaleY: escalaEje }} aria-hidden="true" />
                  : <span className="perfil-eje" aria-hidden="true" />}
                <ol className="hitos">
                  {trayectoria.map((hito, i) => (
                    <Hito
                      key={hito.anio}
                      hito={hito}
                      indice={i}
                      anclado={anclado}
                      progreso={recorrido}
                      rango={[0.06 + i * 0.14, 0.20 + i * 0.14]}
                    />
                  ))}
                </ol>
              </div>
            </div>

            <Retrato
              anclado={anclado}
              cortina={cortina}
              escalaFoto={escalaFoto}
              opacidadCartel={opacidadCartel}
            />
          </div>

          <footer className="perfil-pie">
            <p className="small">
              Tomo cuatro encargos al año, y la mitad del próximo ya está
              comprometida. Si el suyo parte en los próximos meses, conviene
              hablarlo ahora.
            </p>
            <a href="#contacto" className="enlace-simple sub">Reservar la primera visita</a>
          </footer>
        </div>
      </div>
    </section>
  )
}
