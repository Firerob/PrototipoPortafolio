import Revelar from './Revelar.jsx'
import { TituloPartido } from './Texto.jsx'

export default function Estudio() {
  return (
    <section id="estudio" className="seccion estudio">
      <div className="wrap">
        <div className="g12">
          <div className="c-izq">
            <Revelar as="p" className="eyebrow">Estudio</Revelar>
            <TituloPartido texto="Construir con pocos gestos" className="h2" />
          </div>

          <div className="c-der">
            <Revelar as="p" className="lead" style={{ maxWidth: '56ch' }}>
              El estudio trabaja desde 2013 en encargos donde el presupuesto y el
              lugar imponen sus propias reglas. Dirigimos obra directamente: menos
              proyectos por año y control real sobre lo que se construye, incluidos
              los detalles que nunca aparecen en las fotografías.
            </Revelar>

            <Revelar className="ficha" retardo={0.12}>
              <div>
                <p className="eyebrow">Dirección</p>
                <p>Marina Olivares<br />Arquitecta, PUC</p>
              </div>
              <div>
                <p className="eyebrow">Equipo</p>
                <p>7 personas<br />Santiago · Valdivia</p>
              </div>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  )
}
