import { useReducedMotion } from 'framer-motion'

/**
 * Igual que useReducedMotion, pero con una anulacion manual.
 *
 * Windows tiene un ajuste —Accesibilidad › Pantalla › "Mostrar animaciones
 * en Windows"— que al desactivarse hace que el navegador informe
 * `prefers-reduced-motion: reduce`. El sitio entonces se apaga entero, que
 * es lo correcto: quien pide menos movimiento debe recibir menos
 * movimiento. Pero deja sin forma de revisar el trabajo a quien lo
 * construye, y no hay motivo para obligarle a cambiar su sistema.
 *
 *   ?movimiento=1   fuerza el movimiento y lo recuerda en este navegador
 *   ?movimiento=0   devuelve el mando al sistema y olvida la preferencia
 *
 * La anulacion NUNCA va en el otro sentido: no existe forma de apagar el
 * movimiento para alguien que si lo quiere, porque eso no le hace falta a
 * nadie. Y como la preferencia se guarda por navegador, jamas afecta a un
 * visitante que no la haya pedido a mano.
 */

function leerAnulacion() {
  if (typeof window === 'undefined') return null
  try {
    const pedido = new URLSearchParams(window.location.search).get('movimiento')
    if (pedido === '1' || pedido === 'on') {
      window.localStorage.setItem('movimiento', 'on')
      return false                       // false = NO reducir = animar
    }
    if (pedido === '0' || pedido === 'off') {
      window.localStorage.removeItem('movimiento')
      return null                        // devuelve el mando al sistema
    }
    return window.localStorage.getItem('movimiento') === 'on' ? false : null
  } catch {
    // Modo incognito con almacenamiento bloqueado: sin anulacion y sin ruido
    return null
  }
}

// Se resuelve una sola vez por carga: si cambiara entre componentes, unos
// animarian y otros no, y el resultado seria peor que cualquiera de los dos.
const ANULACION = leerAnulacion()

/** true cuando NO hay que animar. */
export function useSinMovimiento() {
  const delSistema = useReducedMotion()
  return ANULACION === null ? delSistema : ANULACION
}

/** Para leerlo fuera de un componente (inicializadores de estado, etc.). */
export function sinMovimientoAhora() {
  if (ANULACION !== null) return ANULACION
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** true si el movimiento esta forzado a mano, para poder avisarlo. */
export const movimientoForzado = ANULACION === false
