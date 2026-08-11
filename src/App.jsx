import { useState } from 'react'

import Preloader from './components/Preloader'
import Progreso from './components/Progreso.jsx'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquesina from './components/Marquesina.jsx'
import Cifras from './components/Cifras.jsx'
import Proyectos from './components/Proyectos.jsx'
import Manifiesto from './components/Manifiesto.jsx'
import Estudio from './components/Estudio.jsx'
import Proceso from './components/Proceso.jsx'
import Contacto from './components/Contacto.jsx'
import { useSinMovimiento } from './hooks/useMovimiento.js'

export default function App() {
  const sinMovimiento = useSinMovimiento()

  // Con movimiento reducido no hay intro, asi que el sitio nace disponible.
  const [isLoaded, setIsLoaded] = useState(sinMovimiento)

  return (
    <>
      {/* La intro cubre la pantalla entera con z-index 100 y bloquea el
          scroll del body mientras dura. Ella misma guarda y restaura el
          valor anterior de overflow, en vez de asumir uno.

          El resto del sitio se monta desde el primer instante, aunque no se
          vea: montarlo solo al subir la cortina obligaria al navegador a
          maquetar la pagina entera en ese momento y se veria el salto. */}
      <Preloader
        nombre={['Marina', 'Olivares']}
        soloNombre
        msFaseNombre={1400}
        onSalida={() => setIsLoaded(true)}
      />

      <Progreso />
      {!sinMovimiento && <Cursor />}

      <a href="#contenido" className="sr saltar">Saltar al contenido</a>

      <Nav />

      <main id="contenido">
        {/* Hero es la unica seccion que no espera al scroll: ya esta en
            pantalla cuando sube la cortina, y un revelado por scroll ahi
            nunca llegaria a dispararse. Arranca con el relevo de la intro. */}
        <Hero arrancar={isLoaded} />

        <Marquesina />
        <Cifras />
        <Proyectos />
        <Manifiesto />
        <Estudio />
        <Proceso />
        <Contacto />
      </main>

      <footer className="pie oscuro">
        <div className="wrap pie-fila">
          <p>© 2026 Marina Olivares Arquitectura</p>
          <ul>
            <li><a href="#" className="sub">Instagram</a></li>
            <li><a href="#" className="sub">LinkedIn</a></li>
            <li><a href="#" className="sub">Aviso legal</a></li>
          </ul>
        </div>
      </footer>
    </>
  )
}
