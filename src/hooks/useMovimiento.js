import { useReducedMotion } from 'framer-motion'

/**
 * Igual que useReducedMotion, pero con una preferencia por encima.
 *
 * Windows tiene un ajuste —Accesibilidad › Pantalla › "Mostrar animaciones
 * en Windows"— que al desactivarse hace que el navegador informe
 * `prefers-reduced-motion: reduce`. Mucha gente lo lleva desactivado sin
 * saberlo, o por rendimiento, y entonces el sitio se apagaba entero.
 *
 *   ?movimiento=1   anima siempre, y lo recuerda en este navegador
 *   ?movimiento=0   devuelve el mando al sistema, y tambien lo recuerda
 *
 * Sin ninguna de las dos, decide MOVIMIENTO_POR_DEFECTO (abajo).
 *
 * ─── LO QUE CUESTA ────────────────────────────────────────────────
 * Con MOVIMIENTO_POR_DEFECTO en true, el sitio anima aunque el sistema
 * pida lo contrario. Eso no es un detalle de estilo: hay personas con
 * trastorno vestibular a las que una intro a pantalla completa, el
 * parallax y el iman del cursor les provocan mareo o migrana, y ese
 * ajuste del sistema es como lo piden. Aqui esta en true a peticion
 * expresa, mientras el sitio vive en localhost y no lo ve nadie mas.
 *
 * Antes de publicarlo para visitantes reales: poner esta constante en
 * false. Es el unico cambio necesario; todo lo demas sigue igual, y
 * quien quiera movimiento lo sigue teniendo con ?movimiento=1.
 * ──────────────────────────────────────────────────────────────────
 */
const MOVIMIENTO_POR_DEFECTO = true

// Valores que se guardan en localStorage bajo la clave 'movimiento'.
// 'sistema' tiene que escribirse, no borrarse: ahora que el defecto es
// animar, la ausencia de valor ya no significa "que mande el sistema".
const ANIMAR = 'on'
const SISTEMA = 'sistema'

function leerPreferencia() {
  if (typeof window === 'undefined') return null
  try {
    const pedido = new URLSearchParams(window.location.search).get('movimiento')
    const guardar = (v) => { window.localStorage.setItem('movimiento', v); return v }

    let valor
    if (pedido === '1' || pedido === 'on') valor = guardar(ANIMAR)
    else if (pedido === '0' || pedido === 'off') valor = guardar(SISTEMA)
    else valor = window.localStorage.getItem('movimiento')

    if (valor === ANIMAR) return false        // false = NO reducir = animar
    if (valor === SISTEMA) return null        // null = que decida el sistema
    return MOVIMIENTO_POR_DEFECTO ? false : null
  } catch {
    // Modo incognito con almacenamiento bloqueado: sin ruido y con el
    // mismo criterio que fuera de el.
    return MOVIMIENTO_POR_DEFECTO ? false : null
  }
}

// Se resuelve una sola vez por carga: si cambiara entre componentes, unos
// animarian y otros no, y el resultado seria peor que cualquiera de los dos.
const PREFERENCIA = leerPreferencia()

/** true cuando NO hay que animar. */
export function useSinMovimiento() {
  const delSistema = useReducedMotion()
  return PREFERENCIA === null ? delSistema : PREFERENCIA
}

/** Para leerlo fuera de un componente (inicializadores de estado, etc.). */
export function sinMovimientoAhora() {
  if (PREFERENCIA !== null) return PREFERENCIA
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** true si el movimiento va por encima de lo que pide el sistema. */
export const movimientoForzado =
  PREFERENCIA === false &&
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
