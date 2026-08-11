import React from 'react'
import { createRoot } from 'react-dom/client'
// Orden deliberado: el preflight de Tailwind primero, para que base.css
// conserve la ultima palabra sobre la tipografia del portafolio.
import './styles/tailwind.css'
import './styles/fonts.css'
import './styles/base.css'
import App from './App.jsx'

// El navegador recuerda el scroll entre recargas por su cuenta: sin esto,
// refrescar a mitad de pagina te deja ahi mismo en vez de volver al hero.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
