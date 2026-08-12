import { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView } from 'framer-motion'
import { cifras } from '../data/proyectos.js'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

function formatear(n, formato) {
  const v = Math.round(n)
  if (formato === 'plano') return String(v)          // años: sin separador de miles
  if (formato === 'cero') return String(v).padStart(2, '0')
  if (formato === 'miles') return v.toLocaleString('es-CL')
  return String(v)
}

function Cifra({ etiqueta, valor, formato }) {
  const sinMovimiento = useSinMovimiento()
  const ref = useRef(null)
  const aLaVista = useInView(ref, { once: true, amount: 0.6 })
  const [texto, setTexto] = useState(sinMovimiento ? formatear(valor, formato) : formatear(0, formato))

  useEffect(() => {
    if (sinMovimiento || !aLaVista) return
    const control = animate(0, valor, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setTexto(formatear(v, formato)),
    })
    return () => control.stop()
  }, [aLaVista, valor, formato, sinMovimiento])

  return (
    <motion.div
      className="cifra"
      ref={ref}
      initial={sinMovimiento ? false : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <dt className="eyebrow">{etiqueta}</dt>
      <dd>
        {/* La mascara recorta el numero mientras sube: entra en su sitio,
            no se desvanece encima. */}
        <span className="mascara-cifra">
          <motion.span
            initial={sinMovimiento ? false : { y: '110%' }}
            animate={aLaVista || sinMovimiento ? { y: 0 } : undefined}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {texto}
          </motion.span>
        </span>
      </dd>
    </motion.div>
  )
}

export default function Cifras() {
  return (
    <section className="cifras" aria-label="El trabajo en cifras">
      <div className="wrap">
        <dl>
          {cifras.map((c) => (
            <Cifra key={c.etiqueta} {...c} />
          ))}
        </dl>
      </div>
    </section>
  )
}
