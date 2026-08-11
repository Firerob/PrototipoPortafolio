/**
 * Los dibujos que quedan en el sitio.
 *
 * Aqui vivian ademas seis trazos que hacian de marcador de posicion en las
 * tarjetas de proyecto. Ya no: las tarjetas llevan la fotografia real, y un
 * marcador que nadie renderiza es codigo muerto. Estan en el historial de
 * git si hicieran falta.
 */

export function Flecha() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.5" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Cerrar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.5" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
    </svg>
  )
}
