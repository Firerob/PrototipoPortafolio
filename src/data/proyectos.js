import fotoCasaLadera from '../assets/fotos/casa-ladera.jpg'
import fotoPabellonLumen from '../assets/fotos/pabellon-lumen.jpg'
import fotoRefugioAndino from '../assets/fotos/refugio-andino.jpg'
import fotoMercadoCentral from '../assets/fotos/mercado-central.jpg'
import fotoSilo from '../assets/fotos/silo.jpg'
import fotoBibliotecaRio from '../assets/fotos/biblioteca-rio.jpg'
import fotoMarina from '../assets/fotos/marina-olivares.jpg'

// PROVISIONAL: el unico clip que hay en el repo es el del hero. Esta aqui
// para que el bloque de video del relato se pueda ver funcionando; en
// cuanto haya metraje de obra real, se cambian estas dos rutas y ya.
import clipProvisional from '../assets/video/marina-hero.mp4'
import posterProvisional from '../assets/fotos/marina-hero-poster.jpg'

/**
 * Los seis proyectos de la portada.
 *
 * `ancho` y `desfase` son las clases de rejilla que producen el ritmo
 * editorial: anchos desiguales sobre 12 columnas y arranques a distinta
 * altura. Cambiar el orden del array cambia la composicion.
 *
 * `foto` lleva medidas ademas de la ruta. No son decorativas: van al
 * width/height del <img> para que el navegador reserve el hueco exacto
 * antes de descargar nada, y la tarjeta no de el salto que arruina el CLS.
 * La proporcion del marco (`proporcion`) y la de la foto no coinciden
 * siempre: el recorte lo resuelve object-fit: cover.
 *
 * `alt` describe lo que se ve en la imagen, no lo que dice el titulo.
 *
 * `cliente`, `ubicacion`, `anio`, `superficie` y `estado` alimentan la
 * ficha tecnica, que el relato (ProyectoModal.jsx) compone solo al final,
 * como el ultimo panel del recorrido.
 *
 * `relato` es la secuencia horizontal de fotos y videos que se recorre al
 * entrar al proyecto. Cada entrada es un medio con su pie OPCIONAL:
 *
 *   { tipo: 'imagen', src, w, h, alt, titulo?, texto? }
 *   { tipo: 'video',  src, poster, titulo?, texto? }
 *
 * Si trae `titulo`/`texto`, aparecen junto al medio, en el mismo panel.
 * Si no, el panel es solo la foto o el video, sin nada mas encima.
 */
export const proyectos = [
  {
    id: 'casa-ladera',
    titulo: 'Casa Ladera',
    categoria: 'residencial',
    meta: 'Residencial · Farellones · 2024',
    alt: 'Casa Ladera: volúmenes bajos de piedra y madera con grandes ventanales, iluminados al atardecer sobre una ladera boscosa',
    foto: { src: fotoCasaLadera, w: 1024, h: 640 },
    proporcion: 'r43',
    ancho: 'w7',
    desfase: null,
    cliente: 'Familia privada',
    ubicacion: 'Farellones',
    anio: 2024,
    superficie: '420 m²',
    estado: 'Construido',
    relato: [
      {
        tipo: 'imagen', src: fotoCasaLadera, w: 1024, h: 640,
        alt: 'Casa Ladera: volúmenes bajos de piedra y madera con grandes ventanales, iluminados al atardecer sobre una ladera boscosa',
        titulo: 'Casa Ladera',
        texto: 'La ladera manda: la casa se parte en volúmenes bajos que siguen la pendiente en vez de nivelarla. Piedra local en los muros que miran al camino, madera y vidrio en los que se abren al valle.',
      },
      {
        tipo: 'video', src: clipProvisional, poster: posterProvisional,
        titulo: 'Visita de obra',
        texto: 'Invierno de 2024, antes del cierre de la envolvente.',
      },
    ],
  },
  {
    id: 'pabellon-lumen',
    titulo: 'Pabellón Lumen',
    categoria: 'cultural',
    meta: 'Cultural · Valparaíso · 2023',
    alt: 'Pabellón Lumen: planta baja dibujada, con las salas escalonadas entre la arboleda y las curvas de nivel del terreno',
    foto: { src: fotoPabellonLumen, w: 1199, h: 1685 },
    proporcion: 'r34',
    ancho: 'w5',
    desfase: 'd24',
    cliente: 'Municipalidad de Valparaíso',
    ubicacion: 'Valparaíso',
    anio: 2023,
    superficie: '1.850 m²',
    estado: 'Construido',
    relato: [
      {
        tipo: 'imagen', src: fotoPabellonLumen, w: 1199, h: 1685,
        alt: 'Pabellón Lumen: planta baja dibujada, con las salas escalonadas entre la arboleda y las curvas de nivel del terreno',
        titulo: 'Pabellón Lumen',
        texto: 'Un centro cultural que no compite con el cerro: las salas se escalonan siguiendo las curvas de nivel existentes, y la circulación exterior queda entre la arboleda que ya estaba ahí.',
      },
    ],
  },
  {
    id: 'refugio-andino',
    titulo: 'Refugio Andino',
    categoria: 'residencial',
    meta: 'Residencial · Cajón del Maipo · 2023',
    alt: 'Refugio Andino: volumen vertical de hormigón y celosía de madera, con terrazas plantadas en cada nivel',
    foto: { src: fotoRefugioAndino, w: 828, h: 1471 },
    proporcion: 'r34',
    ancho: 'w5',
    desfase: null,
    cliente: 'Familia privada',
    ubicacion: 'Cajón del Maipo',
    anio: 2023,
    superficie: '310 m²',
    estado: 'Construido',
    relato: [
      {
        tipo: 'imagen', src: fotoRefugioAndino, w: 828, h: 1471,
        alt: 'Refugio Andino: volumen vertical de hormigón y celosía de madera, con terrazas plantadas en cada nivel',
        titulo: 'Refugio Andino',
        texto: 'Sitio angosto y con desnivel fuerte: la respuesta fue subir en vez de extenderse. Hormigón visto en el núcleo, celosía de madera que filtra el sol de la tarde, una terraza plantada por nivel.',
      },
    ],
  },
  {
    id: 'mercado-central',
    titulo: 'Mercado Central',
    categoria: 'comercial',
    meta: 'Comercial · Rancagua · 2022',
    alt: 'Mercado Central: planta de conjunto con el anfiteatro circular, la franja arbolada y el área de comercio',
    foto: { src: fotoMercadoCentral, w: 736, h: 1308 },
    proporcion: 'r43',
    ancho: 'w7',
    desfase: 'd20',
    cliente: 'Cooperativa de comerciantes de Rancagua',
    ubicacion: 'Rancagua',
    anio: 2022,
    superficie: '2.400 m²',
    estado: 'Construido',
    relato: [
      {
        tipo: 'imagen', src: fotoMercadoCentral, w: 736, h: 1308,
        alt: 'Mercado Central: planta de conjunto con el anfiteatro circular, la franja arbolada y el área de comercio',
        titulo: 'Mercado Central',
        texto: 'Reemplaza una feria techada improvisada por un mercado permanente organizado alrededor de un anfiteatro circular, con una franja arbolada que separa el área de comercio de la calle.',
      },
    ],
  },
  {
    id: 'silo',
    titulo: 'Silo',
    categoria: 'interiorismo',
    meta: 'Interiorismo · Talca · 2021',
    alt: 'Silo: patio interior rehabilitado con arcos encalados, escalera de piedra y suelo de mosaico',
    foto: { src: fotoSilo, w: 960, h: 1264 },
    proporcion: 'r11',
    ancho: 'w6',
    desfase: null,
    cliente: 'Privado',
    ubicacion: 'Talca',
    anio: 2021,
    superficie: '180 m²',
    estado: 'Construido',
    relato: [
      {
        tipo: 'imagen', src: fotoSilo, w: 960, h: 1264,
        alt: 'Silo: patio interior rehabilitado con arcos encalados, escalera de piedra y suelo de mosaico',
        titulo: 'Silo',
        texto: 'Rehabilitación de un patio interior de un silo agrícola en desuso: arcos encalados originales, escalera de piedra recuperada, mosaico nuevo que sigue el trazado del que estaba ahí.',
      },
    ],
  },
  {
    id: 'biblioteca-rio',
    titulo: 'Biblioteca del Río',
    categoria: 'cultural',
    meta: 'Cultural · Valdivia · 2025',
    alt: 'Biblioteca del Río: planta circular con las salas dispuestas en anillo alrededor de un patio central',
    foto: { src: fotoBibliotecaRio, w: 1125, h: 1115 },
    proporcion: 'r11',
    ancho: 'w6',
    desfase: 'd16',
    cliente: 'Municipalidad de Valdivia',
    ubicacion: 'Valdivia',
    anio: 2025,
    superficie: '1.100 m²',
    estado: 'En obra',
    relato: [
      {
        tipo: 'imagen', src: fotoBibliotecaRio, w: 1125, h: 1115,
        alt: 'Biblioteca del Río: planta circular con las salas dispuestas en anillo alrededor de un patio central',
        titulo: 'Biblioteca del Río',
        texto: 'Planta circular en torno a un patio central: las salas de lectura se disponen en anillo, todas con vista al río, y el patio funge de vestíbulo cubierto para los días de lluvia.',
      },
    ],
  },
]

/** El retrato de quien dirige el estudio. Vive en la sección Estudio. */
export const retrato = {
  src: fotoMarina,
  w: 735,
  h: 985,
  alt: 'Marina Olivares, arquitecta, sentada en un sillón sobre fondo oscuro',
}

export const categorias = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'residencial', etiqueta: 'Residencial' },
  { id: 'cultural', etiqueta: 'Cultural' },
  { id: 'comercial', etiqueta: 'Comercial' },
  { id: 'interiorismo', etiqueta: 'Interiorismo' },
]

export const etapas = [
  {
    n: '01',
    titulo: 'Lugar',
    texto: 'Visita, levantamiento y estudio de asoleamiento. Antes de dibujar, entender qué pide el terreno.',
  },
  {
    n: '02',
    titulo: 'Anteproyecto',
    texto: 'Dos o tres partidos distintos, en maqueta física. Se elige uno y se descarta el resto sin nostalgia.',
  },
  {
    n: '03',
    titulo: 'Proyecto',
    texto: 'Planimetría de ejecución, especificaciones y coordinación con cálculo e instalaciones.',
  },
  {
    n: '04',
    titulo: 'Obra',
    texto: 'Inspección semanal en terreno hasta la recepción municipal. Sin intermediarios.',
  },
]

export const cifras = [
  { etiqueta: 'Fundado', valor: 2013, formato: 'plano' },
  { etiqueta: 'Obras entregadas', valor: 64, formato: 'entero' },
  { etiqueta: 'm² construidos', valor: 38400, formato: 'miles' },
  { etiqueta: 'Distinciones', valor: 9, formato: 'cero' },
]

export const navegacion = [
  { href: '#proyectos', etiqueta: 'Proyectos' },
  { href: '#estudio', etiqueta: 'Estudio' },
  { href: '#proceso', etiqueta: 'Proceso' },
  { href: '#contacto', etiqueta: 'Contacto' },
]

export const ambitos = [
  'Vivienda unifamiliar',
  'Equipamiento público',
  'Rehabilitación',
  'Interiorismo',
  'Dirección de obra',
]
