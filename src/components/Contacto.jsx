import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Revelar from './Revelar.jsx'
import { TituloPartido } from './Texto.jsx'
import { Flecha } from './Dibujos.jsx'

/**
 * Reglas de validacion. Cada una devuelve `true` o el mensaje de error,
 * que se muestra junto al campo — nunca en un bloque al principio del
 * formulario, donde obliga a buscar cual falla.
 */
const reglas = {
  nombre: (v) => v.trim().length >= 2 || 'Indique su nombre.',
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ||
    'Revise el correo: falta el @ o el dominio.',
  mensaje: (v) =>
    v.trim().length >= 10 ||
    'Cuéntenos algo más sobre el encargo (mínimo 10 caracteres).',
}

function Campo({ id, etiqueta, tipo = 'text', ayuda, error, valor, onChange, onBlur, hijos }) {
  const describe = [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(' ')
  const props = {
    id,
    name: id,
    value: valor,
    onChange,
    onBlur,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describe || undefined,
    required: true,
  }

  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta} <span aria-hidden="true">*</span></label>
      {hijos
        ? hijos(props)
        : tipo === 'textarea'
          ? <textarea rows="4" {...props} />
          : <input type={tipo} autoComplete={id === 'email' ? 'email' : 'name'} {...props} />}
      {ayuda && <p className="ayuda" id={`${id}-ayuda`}>{ayuda}</p>}
      <p className={`error${error ? ' visible' : ''}`} id={`${id}-error`}>{error}</p>
    </div>
  )
}

export default function Contacto() {
  const [valores, setValores] = useState({ nombre: '', email: '', tipo: '', mensaje: '' })
  const [errores, setErrores] = useState({})
  const [estado, setEstado] = useState('')
  const form = useRef(null)

  const validar = (id, valor = valores[id]) => {
    const r = reglas[id](valor)
    setErrores((e) => ({ ...e, [id]: r === true ? undefined : r }))
    return r === true
  }

  const cambiar = (id) => (ev) => {
    const v = ev.target.value
    setValores((s) => ({ ...s, [id]: v }))
    // Una vez marcado como invalido, se corrige en vivo
    if (errores[id]) validar(id, v)
  }

  const enviar = (ev) => {
    ev.preventDefault()
    const ids = Object.keys(reglas)
    const fallos = ids.filter((id) => !validar(id))
    if (fallos.length) {
      setEstado('Revise los campos marcados.')
      form.current?.querySelector(`#${fallos[0]}`)?.focus()
      return
    }
    // Maqueta: aqui iria el envio real a su endpoint o servicio de formularios
    setEstado('Gracias. Hemos recibido su consulta y le responderemos pronto.')
    setValores({ nombre: '', email: '', tipo: '', mensaje: '' })
  }

  return (
    <section id="contacto" className="seccion contacto oscuro">
      <div className="wrap">
        <div className="g12">

          <div className="c-datos">
            <Revelar as="p" className="eyebrow">Contacto</Revelar>
            <TituloPartido texto="Cuéntenos su encargo" className="h2" />

            <Revelar className="datos">
              <div>
                <p className="eyebrow">Correo</p>
                <a href="mailto:hola@marinaolivares.cl" className="valor sub">hola@marinaolivares.cl</a>
              </div>
              <div>
                <p className="eyebrow">Teléfono</p>
                <a href="tel:+56221234567" className="valor sub">+56 2 2123 4567</a>
              </div>
              <div>
                <p className="eyebrow">Oficina</p>
                <p className="valor">Av. Italia 1450, Providencia<br />Santiago de Chile</p>
              </div>
            </Revelar>
          </div>

          <motion.form
            className="c-form"
            ref={form}
            noValidate
            onSubmit={enviar}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Campo id="nombre" etiqueta="Nombre" valor={valores.nombre}
                   error={errores.nombre} onChange={cambiar('nombre')}
                   onBlur={() => validar('nombre')} />

            <Campo id="email" etiqueta="Correo" tipo="email" valor={valores.email}
                   ayuda="Le respondemos dentro de dos días hábiles."
                   error={errores.email} onChange={cambiar('email')}
                   onBlur={() => validar('email')} />

            <div className="campo">
              <label htmlFor="tipo">Tipo de encargo</label>
              <select id="tipo" name="tipo" value={valores.tipo}
                      onChange={(e) => setValores((s) => ({ ...s, tipo: e.target.value }))}>
                <option value="">Seleccione una opción</option>
                <option value="vivienda">Vivienda unifamiliar</option>
                <option value="rehabilitacion">Rehabilitación</option>
                <option value="interiorismo">Interiorismo</option>
                <option value="publico">Equipamiento público</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <Campo id="mensaje" etiqueta="Mensaje" tipo="textarea" valor={valores.mensaje}
                   error={errores.mensaje} onChange={cambiar('mensaje')}
                   onBlur={() => validar('mensaje')} />

            <button type="submit" className="btn claro">
              Enviar consulta <Flecha />
            </button>

            <p id="form-estado" role="status" aria-live="polite">{estado}</p>
          </motion.form>

        </div>
      </div>
    </section>
  )
}
