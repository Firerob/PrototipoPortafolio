import { useEffect, useState } from 'react'

/**
 * Devuelve el id de la seccion que ocupa la banda central de la pantalla.
 *
 * Sirve para marcar el enlace correspondiente con aria-current, que es
 * informacion real: en una pagina de scroll largo el visitante pierde de
 * vista donde esta. El margen recorta la ventana a una franja central para
 * que no haya dos secciones compitiendo por estar activas a la vez.
 */
export function useSeccionActiva(ids) {
  const [activa, setActiva] = useState(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const secciones = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!secciones.length) return

    const visibles = new Map()

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visibles.set(e.target.id, e.intersectionRatio)
          else visibles.delete(e.target.id)
        }
        if (!visibles.size) return
        // Gana la que mas superficie ocupa en la franja
        const [ganadora] = [...visibles.entries()].sort((a, b) => b[1] - a[1])
        setActiva(ganadora[0])
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    )

    secciones.forEach((s) => observador.observe(s))
    return () => observador.disconnect()
  }, [ids])

  return activa
}
