/**
 * Trazos arquitectonicos que hacen de marcador de posicion.
 *
 * Ocupan el lugar exacto donde ira la fotografia real: al sustituirlos
 * por un <img srcset>, la tarjeta no cambia de tamano ni de proporcion.
 * Cada uno recibe `alt`, que se expone como role="img" + aria-label.
 */

const comun = {
  className: 'shot',
  role: 'img',
  preserveAspectRatio: 'xMidYMid slice',
}

function Casa({ alt }) {
  return (
    <svg {...comun} viewBox="0 0 800 600" aria-label={alt}>
      <rect width="800" height="600" fill="#F4F4F4" />
      <rect x="120" y="180" width="560" height="300" fill="#E6E4E0" />
      <rect x="120" y="180" width="560" height="300" stroke="#D6D5D2" fill="none" />
      <rect x="180" y="240" width="150" height="180" fill="#F0EFEB" />
      <rect x="380" y="240" width="240" height="90" fill="#F0EFEB" />
      <rect x="380" y="360" width="240" height="60" fill="#D6D5D2" />
      <path d="M120 180 L400 90 L680 180" stroke="#111111" fill="none" strokeWidth="1.5" />
      <line x1="60" y1="480" x2="740" y2="480" stroke="#111111" strokeWidth="1.5" />
      <line x1="400" y1="90" x2="400" y2="480" stroke="#D6D5D2" />
    </svg>
  )
}

function Pabellon({ alt }) {
  return (
    <svg {...comun} viewBox="0 0 600 800" aria-label={alt}>
      <rect width="600" height="800" fill="#F4F4F4" />
      <rect x="90" y="200" width="420" height="440" fill="#EAE8E4" />
      <rect x="90" y="200" width="420" height="440" stroke="#D6D5D2" fill="none" />
      <path d="M150 200 L150 120 L450 120 L450 200" stroke="#111111" fill="none" strokeWidth="1.5" />
      <line x1="200" y1="120" x2="200" y2="640" stroke="#D6D5D2" />
      <line x1="300" y1="120" x2="300" y2="640" stroke="#D6D5D2" />
      <line x1="400" y1="120" x2="400" y2="640" stroke="#D6D5D2" />
      <path d="M180 140 L240 640" stroke="#FFFFFF" strokeWidth="18" opacity=".85" />
      <path d="M420 140 L360 640" stroke="#FFFFFF" strokeWidth="18" opacity=".85" />
      <line x1="50" y1="640" x2="550" y2="640" stroke="#111111" strokeWidth="1.5" />
    </svg>
  )
}

function Refugio({ alt }) {
  return (
    <svg {...comun} viewBox="0 0 600 800" aria-label={alt}>
      <rect width="600" height="800" fill="#F4F4F4" />
      <path d="M60 620 L200 470 L400 560 L540 430 L540 620 Z" fill="#EAE8E4" />
      <rect x="220" y="330" width="200" height="240" fill="#E0DED9" />
      <rect x="220" y="330" width="200" height="240" stroke="#111111" fill="none" strokeWidth="1.5" />
      <path d="M220 330 L320 250 L420 330" stroke="#111111" fill="none" strokeWidth="1.5" />
      <rect x="265" y="400" width="50" height="80" fill="#F0EFEB" />
      <rect x="340" y="400" width="50" height="80" fill="#F0EFEB" />
      <line x1="40" y1="620" x2="560" y2="620" stroke="#111111" strokeWidth="1.5" />
    </svg>
  )
}

function Mercado({ alt }) {
  return (
    <svg {...comun} viewBox="0 0 800 600" aria-label={alt}>
      <rect width="800" height="600" fill="#F4F4F4" />
      <rect x="90" y="120" width="620" height="360" fill="#EAE8E4" />
      <rect x="90" y="120" width="620" height="360" stroke="#111111" fill="none" strokeWidth="1.5" />
      <g stroke="#D6D5D2">
        <line x1="90" y1="210" x2="710" y2="210" />
        <line x1="90" y1="300" x2="710" y2="300" />
        <line x1="90" y1="390" x2="710" y2="390" />
        <line x1="245" y1="120" x2="245" y2="480" />
        <line x1="400" y1="120" x2="400" y2="480" />
        <line x1="555" y1="120" x2="555" y2="480" />
      </g>
      <g fill="#D6D5D2">
        <circle cx="245" cy="210" r="7" /><circle cx="400" cy="210" r="7" /><circle cx="555" cy="210" r="7" />
        <circle cx="245" cy="390" r="7" /><circle cx="400" cy="390" r="7" /><circle cx="555" cy="390" r="7" />
      </g>
      <rect x="330" y="255" width="140" height="90" fill="#F0EFEB" stroke="#111111" />
    </svg>
  )
}

function Silo({ alt }) {
  return (
    <svg {...comun} viewBox="0 0 600 600" aria-label={alt}>
      <rect width="600" height="600" fill="#F4F4F4" />
      <circle cx="300" cy="300" r="200" fill="#EAE8E4" />
      <circle cx="300" cy="300" r="200" stroke="#111111" fill="none" strokeWidth="1.5" />
      <circle cx="300" cy="300" r="130" stroke="#D6D5D2" fill="none" />
      <circle cx="300" cy="300" r="60" stroke="#D6D5D2" fill="none" />
      <path d="M300 100 A200 200 0 0 1 470 380" stroke="#111111" fill="none" strokeWidth="1.5" />
      <line x1="300" y1="300" x2="300" y2="100" stroke="#D6D5D2" />
      <line x1="300" y1="300" x2="470" y2="380" stroke="#D6D5D2" />
      <circle cx="300" cy="300" r="8" fill="#111111" />
    </svg>
  )
}

function Biblioteca({ alt }) {
  const celosia = []
  for (let fila = 0; fila < 3; fila++) {
    for (let col = 0; col < 4; col++) {
      // La ultima fila solo lleva dos huecos: debajo va el volumen ciego
      if (fila === 2 && col > 1) continue
      celosia.push(
        <rect key={`${fila}-${col}`} x={120 + col * 90} y={180 + fila * 90} width="60" height="60" />
      )
    }
  }
  return (
    <svg {...comun} viewBox="0 0 600 600" aria-label={alt}>
      <rect width="600" height="600" fill="#F4F4F4" />
      <rect x="80" y="140" width="440" height="320" fill="#EAE8E4" />
      <rect x="80" y="140" width="440" height="320" stroke="#111111" fill="none" strokeWidth="1.5" />
      <g fill="#F0EFEB">{celosia}</g>
      <rect x="300" y="360" width="150" height="100" fill="#D6D5D2" />
      <line x1="40" y1="460" x2="560" y2="460" stroke="#111111" strokeWidth="1.5" />
    </svg>
  )
}

const catalogo = {
  casa: Casa,
  pabellon: Pabellon,
  refugio: Refugio,
  mercado: Mercado,
  silo: Silo,
  biblioteca: Biblioteca,
}

export default function Dibujo({ nombre, alt }) {
  const Trazo = catalogo[nombre]
  if (!Trazo) return null
  return <Trazo alt={alt} />
}

/** El plano del hero: se dibuja solo, trazo a trazo. */
export function PlanoHero() {
  return (
    <svg id="plano" viewBox="0 0 600 620" fill="none">
      <rect className="tr" x="90" y="150" width="300" height="400" stroke="#D6D5D2" strokeWidth="1.2" />
      <rect className="tr" x="150" y="230" width="180" height="240" stroke="#D6D5D2" strokeWidth="1.2" />
      <path className="tr" d="M90 150 L240 60 L390 150" stroke="#D6D5D2" strokeWidth="1.2" />
      <path className="tr" d="M390 150 L520 235 L520 550 L390 550" stroke="#D6D5D2" strokeWidth="1.2" />
      <line className="tr" x1="240" y1="60" x2="240" y2="550" stroke="#D6D5D2" strokeWidth="1.2" />
      <line className="tr" x1="40" y1="550" x2="560" y2="550" stroke="#111111" strokeWidth="1.2" />
      <circle cx="240" cy="60" r="4" fill="#D6D5D2" />
    </svg>
  )
}

export function Flecha() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.5" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
