/**
 * Los seis proyectos de la portada.
 *
 * `ancho` y `desfase` son las clases de rejilla que producen el ritmo
 * editorial: anchos desiguales sobre 12 columnas y arranques a distinta
 * altura. Cambiar el orden del array cambia la composicion.
 *
 * `dibujo` nombra el trazo de Dibujos.jsx. Cuando existan fotos reales,
 * este campo se sustituye por la ruta de la imagen y la tarjeta pasa a
 * renderizar un <img srcset> en vez del SVG.
 */
export const proyectos = [
  {
    id: 'casa-ladera',
    titulo: 'Casa Ladera',
    categoria: 'residencial',
    meta: 'Residencial · Farellones · 2024',
    alt: 'Casa Ladera: fachada poniente en hormigón y madera',
    dibujo: 'casa',
    proporcion: 'r43',
    ancho: 'w7',
    desfase: null,
  },
  {
    id: 'pabellon-lumen',
    titulo: 'Pabellón Lumen',
    categoria: 'cultural',
    meta: 'Cultural · Valparaíso · 2023',
    alt: 'Pabellón Lumen: sección transversal con luz cenital',
    dibujo: 'pabellon',
    proporcion: 'r34',
    ancho: 'w5',
    desfase: 'd24',
  },
  {
    id: 'refugio-andino',
    titulo: 'Refugio Andino',
    categoria: 'residencial',
    meta: 'Residencial · Cajón del Maipo · 2023',
    alt: 'Refugio Andino: volumen compacto de piedra sobre la ladera',
    dibujo: 'refugio',
    proporcion: 'r34',
    ancho: 'w5',
    desfase: null,
  },
  {
    id: 'mercado-central',
    titulo: 'Mercado Central',
    categoria: 'comercial',
    meta: 'Comercial · Rancagua · 2022',
    alt: 'Mercado Central: planta de cubierta y estructura reticulada',
    dibujo: 'mercado',
    proporcion: 'r43',
    ancho: 'w7',
    desfase: 'd20',
  },
  {
    id: 'silo',
    titulo: 'Silo',
    categoria: 'interiorismo',
    meta: 'Interiorismo · Talca · 2021',
    alt: 'Silo: interior rehabilitado con escalera helicoidal',
    dibujo: 'silo',
    proporcion: 'r11',
    ancho: 'w6',
    desfase: null,
  },
  {
    id: 'biblioteca-rio',
    titulo: 'Biblioteca del Río',
    categoria: 'cultural',
    meta: 'Cultural · Valdivia · 2025',
    alt: 'Biblioteca del Río: alzado con celosía de hormigón',
    dibujo: 'biblioteca',
    proporcion: 'r11',
    ancho: 'w6',
    desfase: 'd16',
  },
]

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
