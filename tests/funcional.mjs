/**
 * Prueba funcional del portafolio.
 *
 *   npm run build && npm test
 *
 * Conduce un Edge headless real —no tiempo virtual— porque framer-motion
 * anima sobre requestAnimationFrame: con --virtual-time-budget los
 * temporizadores vuelan pero los fotogramas no, y toda animacion parece
 * rota aunque funcione. Aqui se espera tiempo de verdad.
 *
 * La pagina apaga el movimiento cuando el sistema lo pide, asi que la
 * prueba emula explicitamente 'no-preference' para poder verlo animar, y
 * al final vuelve a 'reduce' para comprobar que entonces se apaga.
 */
import { existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const RAIZ = resolve(import.meta.dirname, '..')
const DIST = join(RAIZ, 'dist')
const PUERTO = 8940

const EDGES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
]

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
}

const resultados = []
// Los detalles se recortan: un data: URI de fuente ocupa 40 KB y ahoga el informe
const anota = (nombre, ok, detalle = '') =>
  resultados.push({ nombre, ok, detalle: String(detalle).slice(0, 110) })

function servir() {
  const s = createServer(async (req, res) => {
    let ruta = decodeURIComponent(req.url.split('?')[0])
    if (ruta === '/') ruta = '/index.html'
    const archivo = join(DIST, ruta)
    if (!archivo.startsWith(DIST) || !existsSync(archivo)) {
      res.writeHead(404).end('no encontrado')
      return
    }
    res.writeHead(200, { 'Content-Type': TIPOS[extname(archivo)] ?? 'application/octet-stream' })
    res.end(await readFile(archivo))
  })
  return new Promise((ok) => s.listen(PUERTO, '127.0.0.1', () => ok(s)))
}

const pausa = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('No hay build. Ejecute primero: npm run build')
    process.exit(1)
  }

  const navegador = EDGES.find(existsSync)
  if (!navegador) {
    console.error('No se encontró Edge ni Chrome para conducir la prueba.')
    process.exit(1)
  }

  const servidor = await servir()
  const browser = await puppeteer.launch({
    executablePath: navegador,
    headless: true,
    // El retrato del hero se reproduce solo, sin que nadie lo pulse. Sin
    // esta politica el navegador lo bloquea y la prueba mediria el bloqueo
    // en vez del comportamiento.
    args: ['--no-sandbox', '--disable-gpu', '--autoplay-policy=no-user-gesture-required'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 860 })
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'no-preference' },
    ])

    const errores = []
    page.on('pageerror', (e) => errores.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errores.push(m.text()))

    const peticiones = []
    page.on('request', (r) => peticiones.push(r.url()))

    await page.goto(`http://127.0.0.1:${PUERTO}/index.html`, { waitUntil: 'networkidle0' })

    // ── Montaje ────────────────────────────────────────────────
    anota('React montó la aplicación',
      await page.$eval('#root', (n) => n.children.length > 0))

    anota('Acentos correctos (no hay mojibake)',
      await page.$eval('.hero .lead', (n) =>
        n.textContent.includes('público') && !n.textContent.includes('Ã')))

    // Las fuentes van incrustadas como data: — no son peticiones de red
    const externas = peticiones.filter(
      (u) => !u.startsWith(`http://127.0.0.1:${PUERTO}`) && !u.startsWith('data:'))
    const inlineadas = peticiones.filter((u) => u.startsWith('data:')).length
    anota('Ningún recurso se pide a un servidor externo', externas.length === 0,
      externas.length
        ? externas.map((u) => u.slice(0, 60)).join(', ')
        : `${peticiones.length - inlineadas} peticiones locales, ${inlineadas} recursos incrustados`)

    // ── Intro: tapa el sitio, corre las tres fases y sube ──────
    const cortina = () => page.$('[class*="z-[100]"]')

    anota('La intro cubre el sitio al entrar', (await cortina()) !== null)
    anota('El scroll queda bloqueado mientras dura la intro',
      await page.evaluate(() => document.body.style.overflow === 'hidden'))

    anota('Nada del portafolio asoma por detrás de la intro',
      await page.evaluate(() => {
        // Que punto pinta el navegador en el centro de la pantalla
        const centro = document.elementFromPoint(innerWidth / 2, innerHeight / 2)
        return !!centro?.closest('[class*="z-[100]"]')
      }))

    // El retrato del hero pesa 4 MB, mas que todo lo demas junto. Mientras
    // la intro tapa la pantalla no puede estar descargandose: compite por
    // el ancho de banda con lo unico que el visitante va a ver primero.
    anota('El vídeo del hero NO se descarga durante la intro',
      !peticiones.some((u) => u.endsWith('.mp4')),
      `${peticiones.filter((u) => u.endsWith('.mp4')).length} peticiones de vídeo`)

    const leerIntro = () => page.evaluate(() => {
      const c = document.querySelector('[class*="z-[100]"]')
      return c ? c.innerText.replace(/\s+/g, ' ').trim() : null
    })
    const fase1 = await leerIntro()
    await pausa(700)
    anota('Las palabras de proyectos se van relevando', fase1 !== (await leerIntro()),
      `"${fase1?.slice(0, 46)}"`)

    await pausa(1500)
    const fase2 = await leerIntro()
    anota('Después aparece el nombre en escalera',
      !!fase2 && fase2.includes('Marina') && fase2.includes('Olivares'),
      `"${fase2}"`)

    await pausa(1600)
    anota('La intro se desmonta por completo', (await cortina()) === null)
    anota('El scroll se desbloquea al terminar la intro',
      await page.evaluate(() => document.body.style.overflow !== 'hidden'),
      await page.evaluate(() => `overflow="${document.body.style.overflow}"`))

    // ── Titular partido en letras (arranca al subir la cortina) ──
    const letras = await page.$$eval('.hero h1 .ltr', (ns) => ns.length)
    anota('Titular del hero partido letra a letra', letras >= 15, `${letras} elementos .ltr`)

    anota('Titular conserva aria-label y oculta las letras a lectores',
      await page.$eval('.hero h1', (n) =>
        !!n.getAttribute('aria-label') && n.querySelectorAll('.pal[aria-hidden="true"]').length > 0),
      await page.$eval('.hero h1', (n) => `aria-label="${n.getAttribute('aria-label')}"`))

    // ── Retrato animado del hero ───────────────────────────────
    await pausa(2500)   // margen para que arranque y empiece a correr
    const retrato = await page.evaluate(() => {
      const v = document.querySelector('.retrato-hero video')
      if (!v) return null
      return { src: !!v.src, pausado: v.paused, t: v.currentTime, w: v.videoWidth, h: v.videoHeight,
               enBucle: v.loop, silencioso: v.muted }
    })
    anota('Terminada la intro, el vídeo del hero sí se descarga',
      peticiones.some((u) => u.endsWith('.mp4')), 'se pidió el .mp4')
    anota('El retrato del hero se reproduce solo, en bucle y sin sonido',
      retrato && !retrato.pausado && retrato.t > 0 && retrato.enBucle && retrato.silencioso,
      retrato ? `t=${retrato.t.toFixed(2)}s, ${retrato.w}x${retrato.h}` : 'no hay vídeo')
    anota('El vídeo conserva la proporción 3:4 de la fotografía',
      retrato && Math.abs(retrato.w / retrato.h - 0.75) < 0.01,
      retrato ? (retrato.w / retrato.h).toFixed(3) : '—')

    // Un hero sin su llamada a la accion no es un hero. Al colocar el
    // retrato a mano en la rejilla, los botones se fueron 300 px por
    // debajo del pliegue sin que nada fallara: la rejilla los recoloco.
    const cta = await page.evaluate(() => {
      const e = document.querySelector('.hero .c-cta')
      const b = e.getBoundingClientRect()
      return { dentro: b.bottom <= innerHeight + 1 && b.top >= 0, top: Math.round(b.top) }
    })
    anota('Los botones del hero siguen sobre el pliegue', cta.dentro,
      `top=${cta.top}px de ${860}`)

    // El espacio entre palabras se mide en pantalla, no en el DOM: estaba
    // en el textContent y aun asi el titular salia pegado, porque el
    // espacio vivia dentro de un inline-block con nowrap y CSS lo descarta.
    const huecos = await page.$eval('.hero h1', (n) => {
      const cajas = [...n.querySelectorAll('.pal')].map((p) => p.getBoundingClientRect())
      const separaciones = []
      for (let i = 1; i < cajas.length; i++) {
        // solo las palabras que comparten linea: entre lineas no hay hueco
        if (Math.abs(cajas[i].top - cajas[i - 1].top) < 2) {
          separaciones.push(Math.round(cajas[i].left - cajas[i - 1].right))
        }
      }
      return separaciones
    })
    anota('Las palabras del titular se separan en pantalla',
      huecos.length > 0 && huecos.every((h) => h > 3), `huecos de ${huecos.join(', ')} px`)

    const visibles = await page.$$eval('.hero h1 .ltr',
      (ns) => ns.filter((n) => parseFloat(getComputedStyle(n).opacity) > 0.9).length)
    anota('La animación de entrada terminó (letras visibles)', visibles === letras,
      `${visibles}/${letras} con opacidad > 0.9`)

    // ── Letras que reaccionan al cursor ────────────────────────
    // Las letras cachean su centro cuando la entrada termina de moverlas.
    // Medir el iman antes de eso da un falso negativo: el codigo funciona,
    // pero todavia esta buscando el cursor con las posiciones viejas.
    await pausa(1600)
    const caja = await page.$eval('.hero h1 .ltr:nth-child(5)', (n) => {
      const r = n.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    })
    const leerLetra = () => page.$eval('.hero h1 .ltr:nth-child(5) > span',
      (n) => getComputedStyle(n).transform)
    const antesLetra = await leerLetra()
    await page.mouse.move(caja.x, caja.y)
    await pausa(700)
    const despuesLetra = await leerLetra()
    anota('Las letras del hero reaccionan a la cercanía del cursor',
      antesLetra !== despuesLetra, `${antesLetra.slice(0, 24)} → ${despuesLetra.slice(0, 30)}`)

    // ── Marquesina ─────────────────────────────────────────────
    const leerTira = () => page.$eval('.tira-pista', (n) => getComputedStyle(n).transform)
    const t1 = await leerTira()
    await pausa(500)
    const t2 = await leerTira()
    anota('La marquesina se desplaza sola', t1 !== t2, `${t1.slice(0, 28)} → ${t2.slice(0, 28)}`)

    // ── Cifras ─────────────────────────────────────────────────
    await page.evaluate(() => document.querySelector('.cifras').scrollIntoView())
    await pausa(2200)
    const cifras = await page.$$eval('.cifra dd', (ns) => ns.map((n) => n.textContent))
    anota('Las cifras cuentan hasta su valor final',
      cifras[2].replace(/\D/g, '') === '38400', `m² = "${cifras[2]}"`)
    anota('El año no lleva separador de miles', cifras[0] === '2013', `"${cifras[0]}"`)

    // ── Fotos: cortina y inclinación ───────────────────────────
    await page.evaluate(() => document.querySelector('#proyectos').scrollIntoView())
    await pausa(1800)
    const recorte = await page.$eval('.card .marco', (n) => getComputedStyle(n).clipPath)
    anota('La cortina de las fotos se abre al hacer scroll', !recorte.includes('100%'),
      `clip-path=${recorte}`)

    const enlace = await page.$('.card a')
    const rc = await enlace.boundingBox()
    const leerMarco = () => page.$eval('.card .marco', (n) => getComputedStyle(n).transform)
    const antesMarco = await leerMarco()
    await page.mouse.move(rc.x + rc.width * 0.85, rc.y + rc.height * 0.2)
    await pausa(700)
    anota('Las tarjetas se inclinan hacia el cursor', antesMarco !== (await leerMarco()),
      'matrix3d aplicada')

    // ── Las fotografías ────────────────────────────────────────
    // Todas son lazy, asi que primero hay que pasar por delante de ellas.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 90))
      }
    })
    await pausa(2000)
    // `img.shot`, no `.shot`: el retrato del hero es un <video> con esa
    // misma clase y no tiene alt, naturalWidth ni loading que comprobar.
    const fotos = await page.$$eval('img.shot', (ns) => ns.map((n) => ({
      cargada: n.complete && n.naturalWidth > 0,
      nombre: n.currentSrc.split('/').pop().split('-')[0],
      alt: n.alt, medidas: !!(n.getAttribute('width') && n.getAttribute('height')),
      lazy: n.loading === 'lazy', recorte: getComputedStyle(n).objectFit === 'cover',
    })))
    anota('Las 7 fotos reales cargan (6 proyectos + retrato)',
      fotos.length === 7 && fotos.every((f) => f.cargada), fotos.map((f) => f.nombre).join(' '))
    anota('Cada foto lleva alt descriptivo, medidas y carga diferida',
      fotos.every((f) => f.alt.length > 25 && f.medidas && f.lazy && f.recorte),
      `${fotos.filter((f) => f.alt.length > 25 && f.medidas && f.lazy).length}/7 completas`)

    // ── Zoom con la rueda sobre la foto ────────────────────────
    await page.evaluate(() => window.scrollTo(0, 0))
    await pausa(600)
    await page.evaluate(() => document.querySelector('#proyectos').scrollIntoView())
    await pausa(1600)
    const leerEscala = () => page.$eval('.card .shot',
      (n) => new DOMMatrix(getComputedStyle(n).transform).a)
    const enFoto = async () => {
      const b = await (await page.$('.card .marco')).boundingBox()
      await page.mouse.move(5, 400)      // salir para forzar el mouseenter
      await pausa(250)
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2)
      await pausa(450)                   // supera la espera de quietud
    }
    const scrollY = () => page.evaluate(() => window.scrollY)

    anota('En reposo la foto está a 1x', Math.abs((await leerEscala()) - 1) < 0.01,
      `escala=${(await leerEscala()).toFixed(3)}`)

    // A 1x, rueda abajo: la foto no puede alejarse mas, asi que devuelve el
    // gesto a la pagina. Sin esto, la foto seria una trampa para el scroll.
    await enFoto()
    const yTope = await scrollY()
    await page.mouse.wheel({ deltaY: 120 })
    await pausa(500)
    anota('En 1x la rueda no atrapa el gesto: la página sigue bajando',
      (await scrollY()) > yTope, `scrollY ${yTope} → ${await scrollY()}`)

    await enFoto()
    const yQuieto = await scrollY()
    for (let i = 0; i < 3; i++) { await page.mouse.wheel({ deltaY: -100 }); await pausa(120) }
    await pausa(800)
    const acercada = await leerEscala()
    anota('Rueda arriba acerca la foto', acercada > 1.4, `1.00x → ${acercada.toFixed(2)}x`)
    anota('Mientras hay zoom la página no se mueve', (await scrollY()) === yQuieto,
      `scrollY ${yQuieto} → ${await scrollY()}`)

    // El techo se mide DURANTE el gesto: al saturar, las muescas sobrantes
    // vuelven a ser scroll y la tarjeta se va de debajo del cursor.
    let techo = acercada
    let ySat = await scrollY()
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel({ deltaY: -100 })
      await pausa(250)
      techo = Math.max(techo, await leerEscala())
      if ((await scrollY()) !== ySat) break
    }
    anota('El zoom se detiene en 1.8x', techo > 1.75 && techo <= 1.81, `máximo=${techo.toFixed(3)}x`)
    anota('Saturado el zoom, la rueda vuelve a ser de la página',
      (await scrollY()) < ySat, `scrollY ${ySat} → ${await scrollY()}`)

    const dentroDelMarco = await page.$eval('.card .marco', (n) => {
      const img = n.querySelector('.shot')
      img.style.transform = 'scale(1.8)'
      const m = n.getBoundingClientRect(), i = img.getBoundingClientRect()
      const r = {
        desborda: i.width > m.width + 2 && i.height > m.height + 2,
        oculto: getComputedStyle(n).overflow === 'hidden',
        sobra: Math.round(i.width - m.width),
      }
      img.style.transform = ''
      return r
    })
    anota('A 1.8x la foto no se sale de la tarjeta: el marco la recorta',
      dentroDelMarco.desborda && dentroDelMarco.oculto,
      `${dentroDelMarco.sobra}px fuera, overflow:hidden`)

    await page.evaluate(() => document.querySelector('#proyectos').scrollIntoView())
    await pausa(1400)
    await enFoto()
    for (let i = 0; i < 3; i++) { await page.mouse.wheel({ deltaY: -100 }); await pausa(120) }
    await pausa(700)
    const antesAlejar = await leerEscala()
    for (let i = 0; i < 3; i++) { await page.mouse.wheel({ deltaY: 100 }); await pausa(120) }
    await pausa(700)
    const alejada = await leerEscala()
    anota('Rueda abajo aleja la foto', alejada < antesAlejar - 0.3,
      `${antesAlejar.toFixed(2)}x → ${alejada.toFixed(2)}x`)

    await page.mouse.move(5, 400)
    await pausa(900)
    anota('Al salir el cursor la foto vuelve sola a 1x',
      Math.abs((await leerEscala()) - 1) < 0.02, `escala=${(await leerEscala()).toFixed(3)}`)

    // Un scroll seguido que pasa por encima de una foto no se secuestra:
    // la imagen solo se queda la rueda si la pagina esta parada.
    await page.evaluate(() => window.scrollTo(0, 0))
    await pausa(700)
    await page.evaluate(() => document.querySelector('#proyectos').scrollIntoView())
    await pausa(1400)
    const cajaSeguido = await (await page.$('.card .marco')).boundingBox()
    await page.mouse.move(cajaSeguido.x + cajaSeguido.width / 2, cajaSeguido.y + cajaSeguido.height / 2)
    const ySeguido = await scrollY()
    for (let i = 0; i < 8; i++) { await page.mouse.wheel({ deltaY: -70 }); await pausa(25) }
    await pausa(600)
    anota('Un scroll seguido sobre la foto no se secuestra',
      (await scrollY()) < ySeguido - 100 && (await leerEscala()) < 1.05,
      `scrollY ${ySeguido} → ${await scrollY()}, escala=${(await leerEscala()).toFixed(2)}x`)

    // El retrato del estudio usa la misma pieza
    await page.evaluate(() => document.querySelector('#estudio').scrollIntoView())
    await pausa(1600)
    const cajaRetrato = await (await page.$('.retrato .marco')).boundingBox()
    await page.mouse.move(cajaRetrato.x + cajaRetrato.width / 2, cajaRetrato.y + cajaRetrato.height / 2)
    await pausa(450)
    for (let i = 0; i < 3; i++) { await page.mouse.wheel({ deltaY: -100 }); await pausa(120) }
    await pausa(700)
    const retratoEscala = await page.$eval('.retrato .shot',
      (n) => new DOMMatrix(getComputedStyle(n).transform).a)
    anota('El retrato del estudio también hace zoom', retratoEscala > 1.4,
      `escala=${retratoEscala.toFixed(2)}x`)

    await page.evaluate(() => window.scrollTo(0, 0))
    await pausa(600)
    await page.evaluate(() => document.querySelector('#proyectos').scrollIntoView())
    await pausa(1400)

    // ── Filtro ─────────────────────────────────────────────────
    await page.$$eval('.filtro', (ns) => ns.find((n) => n.textContent === 'Residencial').click())
    await pausa(1200)
    const nCards = await page.$$eval('.card', (ns) => ns.length)
    anota('El filtro "Residencial" deja solo sus proyectos', nCards === 2,
      `${nCards} tarjetas (se esperaban 2)`)
    anota('El filtro activo se marca con aria-pressed',
      await page.$eval('.filtro[aria-pressed="true"]', (n) => n.textContent === 'Residencial'))
    anota('El filtro se anuncia por aria-live',
      await page.$eval('.sr[role="status"]', (n) => n.textContent.includes('2')),
      await page.$eval('.sr[role="status"]', (n) => `"${n.textContent}"`))
    await page.$$eval('.filtro', (ns) => ns.find((n) => n.textContent === 'Todos').click())
    await pausa(800)

    // ── Manifiesto ─────────────────────────────────────────────
    anota('El manifiesto se ancla con position:sticky',
      await page.$eval('#manifiesto > div', (n) => getComputedStyle(n).position === 'sticky'))

    const leerColor = () => page.$eval('.mani span:nth-child(3)', (n) => getComputedStyle(n).color)
    await page.evaluate(() => {
      const m = document.getElementById('manifiesto')
      window.scrollTo(0, m.offsetTop)
    })
    await pausa(700)
    const colorInicio = await leerColor()
    await page.evaluate(() => {
      const m = document.getElementById('manifiesto')
      window.scrollTo(0, m.offsetTop + window.innerHeight * 0.9)
    })
    await pausa(700)
    anota('Las palabras del manifiesto se encienden con el scroll',
      colorInicio !== (await leerColor()), `${colorInicio} → ${await leerColor()}`)

    // ── Formulario ─────────────────────────────────────────────
    await page.evaluate(() => document.querySelector('#contacto').scrollIntoView())
    await pausa(900)
    await page.$eval('form.c-form', (f) => f.requestSubmit())
    await pausa(400)

    anota('El formulario vacío muestra el error junto al campo',
      await page.$eval('#email-error', (n) => n.classList.contains('visible') && n.textContent.length > 5),
      await page.$eval('#email-error', (n) => `"${n.textContent}"`))
    anota('El campo inválido queda marcado con aria-invalid',
      await page.$eval('#nombre', (n) => n.getAttribute('aria-invalid') === 'true'))
    anota('El foco salta al primer campo con problema',
      await page.evaluate(() => document.activeElement?.id === 'nombre'),
      await page.evaluate(() => `foco en #${document.activeElement?.id}`))

    await page.type('#nombre', 'Felipe')
    await page.type('#email', 'felipe@ejemplo.cl')
    await page.type('#mensaje', 'Quisiera conversar sobre una vivienda en la costa.')
    await page.$eval('form.c-form', (f) => f.requestSubmit())
    await pausa(400)
    anota('El formulario válido confirma el envío',
      await page.$eval('#form-estado', (n) => n.textContent.includes('Gracias')),
      await page.$eval('#form-estado', (n) => `"${n.textContent}"`))

    // ── Navegación ─────────────────────────────────────────────
    await page.setViewport({ width: 420, height: 800 })
    // La barra se esconde al bajar; sin volver arriba el boton no es clicable
    await page.evaluate(() => window.scrollTo(0, 0))
    await pausa(700)
    await page.click('#menu-btn')
    await pausa(300)
    anota('El menú móvil abre y refleja su estado',
      await page.evaluate(() =>
        document.getElementById('menu-movil').classList.contains('abierto') &&
        document.getElementById('menu-btn').getAttribute('aria-expanded') === 'true'))
    await page.keyboard.press('Escape')
    await pausa(300)
    anota('Escape cierra el menú móvil y devuelve el foco',
      await page.evaluate(() =>
        !document.getElementById('menu-movil').classList.contains('abierto') &&
        document.activeElement?.id === 'menu-btn'))

    // ── Movimiento añadido ─────────────────────────────────────
    await page.setViewport({ width: 1280, height: 860 })
    await page.evaluate(() => window.scrollTo(0, 0))
    await pausa(800)

    const leerProgreso = () => page.$eval('.progreso', (n) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(n).transform)
      return m.a // escala en X
    })
    const progresoArriba = await leerProgreso()
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6))
    await pausa(1200)
    const progresoAbajo = await leerProgreso()
    anota('La barra de progreso crece al avanzar la página',
      progresoAbajo > progresoArriba + 0.15,
      `escalaX ${progresoArriba.toFixed(2)} → ${progresoAbajo.toFixed(2)}`)

    // La sección activa se marca sola
    await page.evaluate(() => document.getElementById('proceso').scrollIntoView())
    await pausa(1200)
    anota('La navegación marca la sección en la que estás',
      await page.$eval('.nav-links a[aria-current]', (n) => n.getAttribute('aria-label') === 'Proceso'),
      await page.$$eval('.nav-links a[aria-current]',
        (ns) => ns.map((n) => n.getAttribute('aria-label')).join(',') || 'ninguna'))

    // Parallax interior del dibujo
    await page.evaluate(() => window.scrollTo(0, 0))
    await pausa(600)
    const leerCapa = () => page.$eval('.capa-foto', (n) => getComputedStyle(n).transform)
    await page.evaluate(() => document.querySelector('#proyectos').scrollIntoView())
    await pausa(900)
    const capa1 = await leerCapa()
    await page.evaluate(() => window.scrollBy(0, 500))
    await pausa(900)
    const capa2 = await leerCapa()
    anota('La foto se desplaza dentro de su marco al hacer scroll',
      capa1 !== capa2, `${capa1.slice(0, 26)} → ${capa2.slice(0, 26)}`)

    // El hero se despide
    await page.evaluate(() => window.scrollTo(0, 0))
    await pausa(700)
    const opacidad0 = await page.$eval('.hero .wrap', (n) => parseFloat(getComputedStyle(n).opacity))
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.85))
    await pausa(900)
    const opacidad1 = await page.$eval('.hero .wrap', (n) => parseFloat(getComputedStyle(n).opacity))
    anota('El contenido del hero se despide al salir de pantalla',
      opacidad0 > 0.95 && opacidad1 < opacidad0,
      `opacidad ${opacidad0.toFixed(2)} → ${opacidad1.toFixed(2)}`)

    // ── Las secciones esperan al scroll, no a la carga ─────────
    // Pestana limpia: en la anterior ya se bajo hasta contacto y el
    // revelado, que es de una sola vez, ya se habia disparado.
    const virgen = await browser.newPage()
    await virgen.setViewport({ width: 1280, height: 860 })
    await virgen.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
    await virgen.goto(`http://127.0.0.1:${PUERTO}/index.html`, { waitUntil: 'networkidle0' })
    await pausa(4200)   // deja pasar la intro

    const opacidadContacto = () => virgen.evaluate(() => {
      const el = document.querySelector('#contacto .datos')
      return el ? parseFloat(getComputedStyle(el).opacity) : -1
    })

    const antesDeScroll = await opacidadContacto()
    anota('Las secciones de abajo NO se animan al cargar la página',
      antesDeScroll < 0.2, `opacidad=${antesDeScroll}`)

    await virgen.evaluate(() => document.querySelector('#contacto').scrollIntoView())
    await pausa(1400)
    const trasScroll = await opacidadContacto()
    anota('Se revelan al entrar en pantalla', trasScroll > 0.9, `opacidad=${trasScroll}`)

    await virgen.evaluate(() => window.scrollTo(0, 0))
    await pausa(900)
    const alVolver = await opacidadContacto()
    anota('El revelado ocurre una sola vez (no se deshace al volver)',
      alVolver > 0.9, `opacidad=${alVolver}`)
    await virgen.close()

    anota('La página no lanzó errores de JavaScript', errores.length === 0,
      errores.length ? errores.join(' | ') : 'consola limpia')

    // ── Y ahora con movimiento reducido ────────────────────────
    // El sitio anima por defecto (MOVIMIENTO_POR_DEFECTO en useMovimiento.js),
    // asi que para comprobar la ruta de movimiento reducido hay que pedir el
    // mando del sistema con ?movimiento=0. El dia que esa constante vuelva a
    // false, este parametro sobra pero no estorba: el resultado es el mismo.
    const page2 = await browser.newPage()
    await page2.setViewport({ width: 1280, height: 860 })
    await page2.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page2.goto(`http://127.0.0.1:${PUERTO}/index.html?movimiento=0`,
      { waitUntil: 'networkidle0' })
    await pausa(900)

    anota('Con movimiento reducido no hay intro',
      (await page2.$('[class*="z-[100]"]')) === null)
    anota('Con movimiento reducido el scroll nunca se bloquea',
      await page2.evaluate(() => document.body.style.overflow !== 'hidden'))
    anota('Con movimiento reducido no hay cursor propio',
      (await page2.$('.cursor-punto')) === null)
    anota('Con movimiento reducido el titular sigue completo',
      await page2.$eval('.hero h1', (n) => n.textContent.trim() === 'Espacio, luz y materia'),
      await page2.$eval('.hero h1', (n) => `"${n.textContent.trim()}"`))
    anota('Con movimiento reducido las fotos se ven sin cortina',
      await page2.$eval('.card .marco', (n) => !getComputedStyle(n).clipPath.includes('100%')))

    // El zoom de rueda es adorno: sin movimiento no se monta y la rueda
    // nunca deja de ser de la pagina.
    await page2.evaluate(() => document.querySelector('#proyectos').scrollIntoView())
    await pausa(1200)
    const cajaSin = await (await page2.$('.card .marco')).boundingBox()
    await page2.mouse.move(cajaSin.x + cajaSin.width / 2, cajaSin.y + cajaSin.height / 2)
    await pausa(500)
    const ySin = await page2.evaluate(() => window.scrollY)
    await page2.mouse.wheel({ deltaY: -200 })
    await pausa(600)
    anota('Con movimiento reducido la rueda sigue siendo de la página',
      (await page2.evaluate(() => window.scrollY)) < ySin,
      `scrollY ${ySin} → ${await page2.evaluate(() => window.scrollY)}`)
    anota('Con movimiento reducido la foto no se escala',
      ['none', 'matrix(1, 0, 0, 1, 0, 0)']
        .includes(await page2.$eval('.card .shot', (n) => getComputedStyle(n).transform)))
    anota('Con movimiento reducido no se anuncia un gesto que no existe',
      (await page2.$('.pista-zoom')) === null)

    // El retrato del hero no se degrada a un video parado: se cambia por
    // la fotografia, que es su propio primer fotograma y dice lo mismo.
    anota('Con movimiento reducido el retrato del hero es una foto, no un vídeo',
      (await page2.$('.retrato-hero video')) === null &&
      (await page2.$('.retrato-hero img')) !== null)
    anota('Con movimiento reducido no se descarga el vídeo',
      !(await page2.evaluate(() =>
        performance.getEntriesByType('resource').some((r) => r.name.endsWith('.mp4')))))
    anota('Con movimiento reducido las fotos se siguen viendo',
      await page2.$eval('.card .shot', (n) => n.complete && n.naturalWidth > 0))
    await page2.evaluate(() => window.scrollTo(0, 0))
    await pausa(600)
    anota('Con movimiento reducido el contenido es visible',
      await page2.$eval('.hero h1', (n) => parseFloat(getComputedStyle(n).opacity) > 0.9))
    // La barra de progreso informa, no decora: sobrevive al movimiento reducido
    anota('Con movimiento reducido la barra de progreso sigue ahí',
      (await page2.$('.progreso')) !== null)
    anota('Con movimiento reducido el hero no se desvanece',
      await page2.$eval('.hero .wrap', (n) => parseFloat(getComputedStyle(n).opacity) > 0.95))

    // ── El movimiento va por defecto ───────────────────────────
    // Contexto limpio: sin nada guardado en localStorage, que es como llega
    // alguien la primera vez. Con el sistema pidiendo movimiento reducido,
    // el sitio anima igualmente porque MOVIMIENTO_POR_DEFECTO esta en true.
    // Si esa constante vuelve a false —lo recomendable antes de publicar—,
    // esta comprobacion es la primera que debe cambiar.
    const limpia = await browser.createBrowserContext()
    const primeraVez = await limpia.newPage()
    await primeraVez.setViewport({ width: 1280, height: 860 })
    await primeraVez.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await primeraVez.goto(`http://127.0.0.1:${PUERTO}/index.html`, { waitUntil: 'networkidle0' })
    await pausa(700)
    anota('Sin preferencia guardada, el sitio anima aunque el sistema pida lo contrario',
      (await primeraVez.$('[class*="z-[100]"]')) !== null, 'la intro aparece')
    await pausa(4200)
    anota('Y el titular se parte en letras a la primera visita',
      (await primeraVez.$$eval('.hero h1 .ltr', (ns) => ns.length)) >= 15)
    await limpia.close()

    // ── Devolver el mando al sistema, y recuperarlo ────────────
    // `?movimiento=0` es ahora la salida para quien de verdad no quiere
    // movimiento; `?movimiento=1` lo devuelve. Las dos se recuerdan.
    const forzada = await browser.newPage()
    await forzada.setViewport({ width: 1280, height: 860 })
    await forzada.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await forzada.goto(`http://127.0.0.1:${PUERTO}/index.html?movimiento=1`,
      { waitUntil: 'networkidle0' })
    await pausa(600)

    anota('Con ?movimiento=1 la intro aparece pese al ajuste del sistema',
      (await forzada.$('[class*="z-[100]"]')) !== null)

    await pausa(4200)
    anota('Con ?movimiento=1 el titular se parte en letras',
      (await forzada.$$eval('.hero h1 .ltr', (ns) => ns.length)) >= 15)

    // La preferencia queda guardada: ya no hace falta el parametro
    await forzada.goto(`http://127.0.0.1:${PUERTO}/index.html`, { waitUntil: 'networkidle0' })
    await pausa(600)
    anota('La preferencia forzada se recuerda sin repetir el parámetro',
      (await forzada.$('[class*="z-[100]"]')) !== null)

    // Y se puede devolver el mando al sistema
    await forzada.goto(`http://127.0.0.1:${PUERTO}/index.html?movimiento=0`,
      { waitUntil: 'networkidle0' })
    await pausa(600)
    anota('Con ?movimiento=0 vuelve a mandar el ajuste del sistema',
      (await forzada.$('[class*="z-[100]"]')) === null)
    await forzada.close()

  } finally {
    await browser.close()
    servidor.close()
  }

  // ── Informe ──────────────────────────────────────────────────
  const fallan = resultados.filter((r) => !r.ok)
  for (const r of resultados) {
    const marca = r.ok ? '  PASA ' : '  FALLA'
    console.log(`${marca}  ${r.nombre}${r.detalle ? `   — ${r.detalle}` : ''}`)
  }
  console.log('')
  console.log(fallan.length
    ? `${fallan.length} de ${resultados.length} comprobaciones FALLAN`
    : `Las ${resultados.length} comprobaciones PASAN`)
  process.exit(fallan.length ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
