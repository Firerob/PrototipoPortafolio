import React from 'react'
import { createRoot } from 'react-dom/client'
// Orden deliberado: el preflight de Tailwind primero, para que base.css
// conserve la ultima palabra sobre la tipografia del portafolio.
import './styles/tailwind.css'
import './styles/fonts.css'
import './styles/base.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
