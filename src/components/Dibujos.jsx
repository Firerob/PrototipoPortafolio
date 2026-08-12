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

/* El resto del sitio es trazo, nunca relleno: un logo de WhatsApp real es
   solido, y sordo aqui rompería esa regla. Este es el contorno de la
   burbuja con el telefono adentro, dibujado con el mismo grosor de linea
   que los otros dos — el texto "WhatsApp" al lado dice qué es. */
export function Whatsapp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.5" aria-hidden="true">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.4A8.5 8.5 0 1 1 20.5 11.7Z"
            strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.2 8.4c.3-.1.6 0 .8.3l.8 1.3c.1.3.1.6-.1.8l-.5.5c-.1.2-.2.4-.1.6a5 5 0 0 0 2.4 2.4c.2.1.4 0 .6-.1l.5-.5c.2-.2.5-.2.8-.1l1.3.8c.3.2.4.5.3.8-.2.7-.9 1.2-1.7 1.2-2.9 0-6-3.1-6-6 0-.8.5-1.5 1.2-1.7Z"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
