import fotoCasaLadera from '../assets/fotos/casa-ladera.jpg'
import fotoPabellonLumen from '../assets/fotos/pabellon-lumen.jpg'
import fotoRefugioAndino from '../assets/fotos/refugio-andino.jpg'
import fotoMercadoCentral from '../assets/fotos/mercado-central.jpg'
import fotoSilo from '../assets/fotos/silo.jpg'
import fotoBibliotecaRio from '../assets/fotos/biblioteca-rio.jpg'
import fotoMarina from '../assets/fotos/marina-olivares.jpg'

import clipObraCasaLadera from '../assets/video/casa-ladera-obra.mp4'
import posterObraCasaLadera from '../assets/fotos/casa-ladera-obra-poster.jpg'

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
        tipo: 'video', src: clipObraCasaLadera, poster: posterObraCasaLadera,
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

/** El retrato de Marina. Vive anclado en la sección Perfil. */
export const retrato = {
  src: fotoMarina,
  w: 735,
  h: 985,
  alt: 'Marina Olivares, arquitecta, sentada en un sillón sobre fondo oscuro',
}

/**
 * Los hitos que recorre la sección Perfil, en orden. No es un currículum:
 * cada entrada existe porque trae una cifra que se puede comprobar contra
 * `cifras` o contra un proyecto de arriba. `anio` va suelto —no dentro del
 * texto— porque en la sección es una columna propia que se enciende con el
 * scroll, igual que antes se encendían las palabras del manifiesto.
 */
export const trayectoria = [
  {
    anio: '2012',
    titulo: 'Título, PUC',
    texto: 'Arquitecta por la Pontificia Universidad Católica de Chile. Los dos últimos años los pasé en faena, como ayudante de inspección técnica: aprendí a leer un plano por lo que cuesta construirlo.',
  },
  {
    anio: '2013',
    titulo: 'Consulta propia',
    texto: 'Abrí por mi cuenta con un solo encargo: 96 m² en Buin, con un presupuesto que no admitía una partida de más. Se entregó en plazo y en precio. Sigo trabajando igual.',
  },
  {
    anio: '2016',
    titulo: 'Primer equipamiento público',
    texto: 'Gané por concurso la sala cívica de Machalí, 620 m². Primer encargo con plazo municipal y gasto auditado: se recibió sin observaciones que rehacer.',
  },
  {
    anio: '2019',
    titulo: 'Bienal de Arquitectura de Chile',
    texto: 'Mención por tres casas del secano costero levantadas a 18 UF/m². Es la cifra de la que sigo más orgullosa, y la que más me piden que repita.',
  },
  {
    anio: '2022',
    titulo: 'Escala',
    texto: '2.400 m² de mercado para una cooperativa de ochenta socios en Rancagua, entregados en catorce meses y sin aumento de obra. Desde entonces el equipamiento público es un tercio de mi trabajo.',
  },
  {
    anio: '2025',
    titulo: 'En obra',
    texto: 'La Biblioteca del Río levanta sus muros en Valdivia. La inspecciono cada semana, como las sesenta y tres anteriores.',
  },
]

export const categorias = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'residencial', etiqueta: 'Residencial' },
  { id: 'cultural', etiqueta: 'Cultural' },
  { id: 'comercial', etiqueta: 'Comercial' },
  { id: 'interiorismo', etiqueta: 'Interiorismo' },
]

// Sin uso desde que se retiro la seccion Proceso. Se conserva por si vuelve.
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
  { etiqueta: 'En ejercicio desde', valor: 2013, formato: 'plano' },
  { etiqueta: 'Obras entregadas', valor: 64, formato: 'entero' },
  { etiqueta: 'm² construidos', valor: 38400, formato: 'miles' },
  { etiqueta: 'Distinciones', valor: 9, formato: 'cero' },
]

export const navegacion = [
  { href: '#proyectos', etiqueta: 'Proyectos' },
  { href: '#perfil', etiqueta: 'Perfil' },
  { href: '#servicios', etiqueta: 'Servicios' },
  { href: '#contacto', etiqueta: 'Contacto' },
]

/**
 * Los servicios repiten, en el mismo orden, los ambitos de la marquesina:
 * ahi son un rotulo, aqui llevan lo que implica cada uno. El <select> de
 * Contacto sigue la misma lista. Tres sitios, una sola taxonomia.
 */
export const servicios = [
  {
    titulo: 'Vivienda unifamiliar',
    alcance: 'Anteproyecto → recepción municipal',
    texto: 'Casa nueva en terreno propio, de 90 a 450 m². Entre dieciocho y treinta meses desde la primera visita hasta las llaves, con el presupuesto cerrado antes de mover la primera máquina. Es la mitad de mi obra entregada.',
  },
  {
    titulo: 'Equipamiento público',
    alcance: 'Concurso · Encargo directo',
    texto: 'Bibliotecas, pabellones y mercados de 600 a 2.400 m². Programa exigente, gasto auditado y plazo municipal: he entregado once, todos dentro del monto adjudicado.',
  },
  {
    titulo: 'Rehabilitación',
    alcance: 'Levantamiento · Proyecto',
    texto: 'Intervenir lo construido sin borrarlo. Entrego el levantamiento del estado actual y un informe con cifras: qué conviene conservar y qué sale más caro mantener que rehacer. La parte nueva se distingue de la vieja en vez de imitarla.',
  },
  {
    titulo: 'Interiorismo',
    alcance: 'Obra propia o ajena',
    texto: 'Pocos materiales, bien puestos. Incluye mobiliario fijo, iluminación y una especificación cerrada partida por partida, que es lo que evita las improvisaciones de obra: las que se pagan al doble.',
  },
  {
    titulo: 'Dirección de obra',
    alcance: 'Con o sin proyecto propio',
    texto: 'Inspección semanal en terreno, revisión de estados de pago y coordinación de especialidades. Se contrata sola, sobre planos de otra oficina: en los últimos cinco años recuperé plazo en siete de las nueve que recibí así.',
  },
]

/**
 * Inventados, como todo el sitio, pero atados a clientes que ya existen en
 * `proyectos`. Cada cita trae la cifra de su propia obra, comprobable mas
 * arriba en este mismo archivo.
 *
 * `foto` esta reservado y hoy va vacio a proposito. El hueco de la cinta
 * NO se rellena con banco de imagenes —un avatar de stock desmiente la
 * cita mas rapido de lo que la respalda—: mientras no haya retrato real,
 * el componente pinta las iniciales sobre fondo plano.
 */
export const testimonios = [
  {
    cita: 'Pedimos 480 m² y nos convenció de construir 420. Ahorramos catorce millones y dos años después no hay una pieza que no usemos a diario.',
    autor: 'Paula Errázuriz y Tomás Vergara',
    obra: 'Casa Ladera · Farellones, 2024',
    foto: null,
  },
  {
    cita: 'Veníamos de oficinas grandes donde cada mes hablábamos con alguien distinto. Aquí la misma persona que dibujó los 1.850 m² estuvo en terreno el día de la recepción, y no quedó una observación que rehacer.',
    autor: 'Claudia Bustos',
    obra: 'Pabellón Lumen · Municipalidad de Valparaíso',
    foto: null,
  },
  {
    cita: 'Éramos ochenta socios con ochenta opiniones. Llegó con tres maquetas, explicó qué perdía cada una y votamos en una tarde. Catorce meses después estábamos vendiendo, con el presupuesto intacto.',
    autor: 'Héctor Sanhueza',
    obra: 'Mercado Central · Cooperativa de comerciantes de Rancagua',
    foto: null,
  },
  {
    cita: 'El silo llevaba veinte años cerrado y tres presupuestos decían que había que botarlo. Conservó los arcos, entregó 180 m² habitables y costó menos que la demolición.',
    autor: 'Rosario Melo',
    obra: 'Silo · Talca, 2021',
    foto: null,
  },
  {
    cita: 'Vamos en el mes once de obra, con inspección todas las semanas y un solo aumento, por debajo del dos por ciento. En un municipio eso no es lo normal: es lo que uno pide y casi nunca recibe.',
    autor: 'Andrés Kramer',
    obra: 'Biblioteca del Río · Municipalidad de Valdivia',
    foto: null,
  },
]

export const ambitos = [
  'Vivienda unifamiliar',
  'Equipamiento público',
  'Rehabilitación',
  'Interiorismo',
  'Dirección de obra',
]
