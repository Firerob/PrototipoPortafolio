import fotoCasaLadera from '../assets/fotos/casa-ladera.jpg'
import fotoPabellonLumen from '../assets/fotos/pabellon-lumen.jpg'
import fotoRefugioAndino from '../assets/fotos/refugio-andino.jpg'
import fotoMercadoCentral from '../assets/fotos/mercado-central.jpg'
import fotoSilo from '../assets/fotos/silo.jpg'
import fotoBibliotecaRio from '../assets/fotos/biblioteca-rio.jpg'
import fotoMarina from '../assets/fotos/marina-olivares.jpg'

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
