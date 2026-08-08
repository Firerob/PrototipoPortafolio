/**
 * Los dibujos que quedan en el sitio.
 *
 * Aqui vivian ademas seis trazos que hacian de marcador de posicion en las
 * tarjetas de proyecto. Ya no: las tarjetas llevan la fotografia real, y un
 * marcador que nadie renderiza es codigo muerto. Estan en el historial de
 * git si hicieran falta.
 */

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
