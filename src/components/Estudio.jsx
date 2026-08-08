import Revelar from './Revelar.jsx'
import { TituloPartido } from './Texto.jsx'
import ImagenZoom from './ImagenZoom.jsx'
import { retrato } from '../data/proyectos.js'
import { useSinMovimiento } from '../hooks/useMovimiento.js'

export default function Estudio() {
  const sinMovimiento = useSinMovimiento()

  return (
    <section id="estudio" className="seccion estudio">
      <div className="wrap">
        <div className="g12">
          <div className="c-izq">
            <Revelar as="p" className="eyebrow">Estudio</Revelar>
            <TituloPartido texto="Construir con pocos gestos" className="h2" />

            {/* El retrato va aqui y no en el hero: el hero lo abre el plano
                dibujandose solo, y una cara compitiendo con el le quitaria
                el sitio. Aqui, junto a la ficha de dirección, la foto
                responde a la pregunta que el texto acaba de abrir. */}
            <Revelar as="figure" className="retrato" retardo={0.08}>
              <div className="marco r34">
                <ImagenZoom
                  src={retrato.src}
                  alt={retrato.alt}
                  ancho={retrato.w}
                  alto={retrato.h}
                />
                {!sinMovimiento && (
                  <span className="pista-zoom" aria-hidden="true">Rueda para acercar</span>
                )}
              </div>
              <figcaption className="small">
                Marina Olivares, en el estudio de Santiago.
              </figcaption>
            </Revelar>
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
