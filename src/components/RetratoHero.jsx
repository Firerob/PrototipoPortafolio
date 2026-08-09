import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useSinMovimiento } from '../hooks/useMovimiento.js'
import poster from '../assets/fotos/marina-retrato-poster.jpg'
import clip from '../assets/video/marina-retrato.mp4'

/**
 * Retrato animado del hero.
 *
 * El clip pesa 4 MB, mas de diez veces lo que pesa el resto de la portada
 * junta. Por eso el <video> nace SIN src: primero se pinta el poster —que
 * es el fotograma inicial exacto, la fotografia de la que salio el clip— y
 * el archivo no se pide hasta que `arrancar` es true, es decir, hasta que
 * la intro termino y la portada ya esta en pantalla. Quien solo pase de
 * largo no llega a descargarlo.
 *
 * El intercambio poster→video es invisible porque son el mismo fotograma:
 * no hay salto, ni parpadeo, ni hueco que reservar.
 *
 * Con movimiento reducido el video no se monta nunca y queda la fotografia
 * fija, que dice exactamente lo mismo.
 */
export default function RetratoHero({ arrancar }) {
  const sinMovimiento = useSinMovimiento()
  const video = useRef(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    if (sinMovimiento || !arrancar) return
    const el = video.current
    if (!el || el.src) return
    el.src = clip
    // play() devuelve una promesa que se rechaza si el navegador decide que
    // no toca (ahorro de bateria, pestana en segundo plano). No es un error
    // que haya que arreglar: el poster se queda, y es una imagen valida.
    el.play?.().catch(() => {})
  }, [arrancar, sinMovimiento])

  return (
    <motion.figure
      className="retrato-hero"
      initial={{ opacity: 0, y: 24 }}
      animate={arrancar ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="marco r34">
        {sinMovimiento ? (
          <img className="shot" src={poster} alt="" width="735" height="985" />
        ) : (
          <video
            ref={video}
            className="shot"
            poster={poster}
            width="834"
            height="1112"
            muted
            loop
            playsInline
            preload="none"
            // Esto no es "un video" para el visitante, es una imagen que se
            // mueve. Nada debe delatar que hay un reproductor debajo:
            //
            //   sin `controls`   no hay barra
            //   disablePicture…  quita el boton flotante que Chrome y Edge
            //                    superponen al pasar el raton por encima
            //   disableRemote…   quita el de enviar a Chromecast/AirPlay
            //   controlsList     por si algun navegador decide mostrar
            //                    controles igualmente
            //
            // El remate esta en CSS: pointer-events none. Si el puntero no
            // puede tocarlo, no hay hover que dispare ningun anadido.
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noplaybackrate noremoteplayback"
            // El retrato no aporta informacion que no este en el texto de al
            // lado: es decorativo, y anunciarlo solo entorpece la lectura.
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setListo(true)}
          />
        )}
      </div>
      <figcaption className={`small${listo ? ' visible' : ''}`}>
        Marina Olivares, arquitecta
      </figcaption>
    </motion.figure>
  )
}
