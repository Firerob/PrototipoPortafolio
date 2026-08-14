import fotoCasaVitacura from '../assets/fotos/casa-vitacura.jpg'
import fotoCasaVitacuraPatio from '../assets/fotos/casa-vitacura-patio.jpg'
import fotoCasaVitacuraDetalle1 from '../assets/fotos/casa-vitacura-detalle-1.jpg'
import fotoCasaVitacuraDetalle2 from '../assets/fotos/casa-vitacura-detalle-2.jpg'
import fotoCasaVitacuraSenda from '../assets/fotos/casa-vitacura-senda.jpg'
import fotoCasaVitacuraMaqueta from '../assets/fotos/casa-vitacura-maqueta.jpg'
import clipCasaVitacura from '../assets/video/casa-vitacura.mp4'
import posterCasaVitacura from '../assets/fotos/casa-vitacura-poster.jpg'
import clipCasaVitacuraMuro from '../assets/video/casa-vitacura-muro.mp4'
import posterCasaVitacuraMuro from '../assets/fotos/casa-vitacura-muro-poster.jpg'
import clipCasaVitacuraSombras from '../assets/video/casa-vitacura-sombras.mp4'
import posterCasaVitacuraSombras from '../assets/fotos/casa-vitacura-sombras-poster.jpg'

import fotoCasaMirador from '../assets/fotos/casa-mirador.jpg'
import fotoCasaMiradorNoche from '../assets/fotos/casa-mirador-noche.jpg'
import fotoCasaMiradorCocina from '../assets/fotos/casa-mirador-cocina.jpg'
import fotoCasaMiradorLiving from '../assets/fotos/casa-mirador-living.jpg'
import fotoCasaMiradorComedor from '../assets/fotos/casa-mirador-comedor.jpg'
import fotoCasaMiradorVista from '../assets/fotos/casa-mirador-vista.jpg'
import clipCasaMirador from '../assets/video/casa-mirador.mp4'
import posterCasaMirador from '../assets/fotos/casa-mirador-poster.jpg'

import fotoCasaLosAndesCasa from '../assets/fotos/casa-los-andes-casa.jpg'
import fotoCasaLosAndes1 from '../assets/fotos/casa-los-andes-1.jpg'
import fotoCasaLosAndes2 from '../assets/fotos/casa-los-andes-2.jpg'
import fotoCasaLosAndes4 from '../assets/fotos/casa-los-andes-4.jpg'
import fotoCasaLosAndes5 from '../assets/fotos/casa-los-andes-5.jpg'
import clipCasaLosAndes from '../assets/video/casa-los-andes.mp4'
import posterCasaLosAndes from '../assets/fotos/casa-los-andes-poster.jpg'

import fotoConjuntoCostanera from '../assets/fotos/conjunto-costanera.jpg'
import fotoConjuntoCostaneraSitio from '../assets/fotos/conjunto-costanera-sitio.jpg'
import fotoConjuntoCostanera02 from '../assets/fotos/conjunto-costanera-02.jpg'
import fotoConjuntoCostanera03 from '../assets/fotos/conjunto-costanera-03.jpg'
import fotoConjuntoCostanera08 from '../assets/fotos/conjunto-costanera-08.jpg'
import fotoConjuntoCostaneraDormitorio from '../assets/fotos/conjunto-costanera-dormitorio.jpg'
import clipConjuntoCostanera from '../assets/video/conjunto-costanera.mp4'
import posterConjuntoCostanera from '../assets/fotos/conjunto-costanera-poster.jpg'

import fotoInteriorLastarria from '../assets/fotos/interior-lastarria.jpg'
import fotoInteriorLastarriaTaller from '../assets/fotos/interior-lastarria-taller.jpg'
import fotoInteriorLastarriaLiving from '../assets/fotos/interior-lastarria-living.jpg'
import fotoInteriorLastarriaLiving2 from '../assets/fotos/interior-lastarria-living2.jpg'
import fotoInteriorLastarriaPozuelo2 from '../assets/fotos/interior-lastarria-pozuelo2.jpg'

import fotoCasaZapallar from '../assets/fotos/casa-zapallar.jpg'
import fotoCasaZapallarObra from '../assets/fotos/casa-zapallar-obra.jpg'
import fotoCasaZapallarInterior from '../assets/fotos/casa-zapallar-interior.jpg'
import fotoCasaZapallarDerelicto from '../assets/fotos/casa-zapallar-derelicto.jpg'
import fotoCasaZapallarMediterranea from '../assets/fotos/casa-zapallar-mediterranea.jpg'

import fotoMarina from '../assets/fotos/marina-olivares.jpg'

import fotoTestimonioContreras from '../assets/fotos/testimonio-contreras.jpg'
import fotoTestimonioLeria from '../assets/fotos/testimonio-leria.jpg'
import fotoTestimonioIturra from '../assets/fotos/testimonio-iturra.jpg'
import fotoTestimonioPrieto from '../assets/fotos/testimonio-prieto.jpg'

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
    id: 'casa-vitacura',
    titulo: 'Casa Vitacura',
    categoria: 'residencial',
    meta: 'Residencial · Vitacura, Santiago · 2024',
    alt: 'Casa Vitacura: fachada nocturna con celosía de madera iluminada, acceso central y muro de tablones oscuros',
    foto: { src: fotoCasaVitacura, w: 1600, h: 900 },
    proporcion: 'r43',
    ancho: 'w7',
    desfase: null,
    cliente: 'Familia privada',
    ubicacion: 'Vitacura, Santiago',
    anio: 2024,
    superficie: '420 m²',
    estado: 'Construido',
    relato: [
      {
        tipo: 'imagen', src: fotoCasaVitacura, w: 1600, h: 900,
        alt: 'Casa Vitacura: fachada nocturna con celosía de madera iluminada, acceso central y muro de tablones oscuros',
        titulo: 'Casa Vitacura',
        texto: 'La fachada se cierra a la calle con una celosía de madera que se ilumina de noche y se abre entera al patio trasero. Un solo volumen, acceso central, dormitorios arriba.',
      },
      {
        tipo: 'imagen', src: fotoCasaVitacuraPatio, w: 1600, h: 900,
        alt: 'Casa Vitacura: patio trasero visto desde arriba, con living exterior y luces cálidas encendidas de noche',
      },
      {
        tipo: 'imagen', src: fotoCasaVitacuraDetalle1, w: 1600, h: 900,
        alt: 'Casa Vitacura: detalle del volumen superior en la fachada, con revestimiento metálico',
      },
      {
        tipo: 'imagen', src: fotoCasaVitacuraDetalle2, w: 1600, h: 900,
        alt: 'Casa Vitacura: detalle de la fachada principal al atardecer',
      },
      {
        tipo: 'imagen', src: fotoCasaVitacuraSenda, w: 1600, h: 900,
        alt: 'Casa Vitacura: senda de acceso iluminada con balizas bajas, de noche',
        titulo: 'Iluminación exterior',
        texto: 'Las balizas del acceso quedaron al ras del pasto: marcan el camino sin competir con la luz de la fachada.',
      },
      {
        tipo: 'imagen', src: fotoCasaVitacuraMaqueta, w: 1600, h: 900,
        alt: 'Casa Vitacura: modelo volumétrico de estudio, con los dos cuerpos de la casa diferenciados por color',
        titulo: 'Estudio volumétrico',
        texto: 'La maqueta digital que definió los dos cuerpos de la casa: el cerrado hacia la calle y el que se abre al patio.',
      },
      {
        tipo: 'video', src: clipCasaVitacura, poster: posterCasaVitacura,
        titulo: 'Estudio de luz',
        texto: 'El sistema de iluminación se probó de noche antes de instalarlo: la celosía debía leerse desde la calle sin encandilar a los vecinos.',
      },
      {
        tipo: 'video', src: clipCasaVitacuraMuro, poster: posterCasaVitacuraMuro,
        alt: 'Recorrido junto al muro de acceso',
      },
      {
        tipo: 'video', src: clipCasaVitacuraSombras, poster: posterCasaVitacuraSombras,
        alt: 'Estudio de sombras sobre la fachada',
      },
    ],
  },
  {
    id: 'casa-mirador',
    titulo: 'Casa Mirador',
    categoria: 'residencial',
    meta: 'Residencial · Concón · 2023',
    alt: 'Casa Mirador: torre residencial de quince pisos con balcones escalonados frente al mar',
    foto: { src: fotoCasaMirador, w: 1400, h: 806 },
    proporcion: 'r34',
    ancho: 'w5',
    desfase: 'd24',
    cliente: 'Inmobiliaria Costa Azul',
    ubicacion: 'Concón',
    anio: 2023,
    superficie: '1.850 m²',
    estado: 'Construido',
    relato: [
      {
        tipo: 'imagen', src: fotoCasaMirador, w: 1400, h: 806,
        alt: 'Casa Mirador: torre residencial de quince pisos con balcones escalonados frente al mar',
        titulo: 'Casa Mirador',
        texto: 'Quince pisos con balcones escalonados, para que ningún departamento le tape la vista al de arriba. La cara sur, ciega, corta el viento; la norte se abre entera al mar.',
      },
      {
        tipo: 'imagen', src: fotoCasaMiradorNoche, w: 933, h: 933,
        alt: 'Casa Mirador: la torre de noche, con las terrazas y piscinas comunes iluminadas',
      },
      {
        tipo: 'imagen', src: fotoCasaMiradorCocina, w: 1400, h: 787,
        alt: 'Casa Mirador: cocina y living integrados de un departamento tipo, con vista al mar de fondo',
      },
      {
        tipo: 'imagen', src: fotoCasaMiradorLiving, w: 1400, h: 787,
        alt: 'Casa Mirador: living de un departamento tipo, con cocina abierta al fondo',
        titulo: 'Departamento tipo',
        texto: 'Living-comedor pasante: la luz entra por los dos extremos y cruza todo el departamento a cualquier hora del día.',
      },
      {
        tipo: 'imagen', src: fotoCasaMiradorComedor, w: 1400, h: 787,
        alt: 'Casa Mirador: comedor de un departamento tipo, junto al ventanal',
      },
      {
        tipo: 'imagen', src: fotoCasaMiradorVista, w: 1306, h: 933,
        alt: 'Casa Mirador: living-comedor con vista al mar desde un piso alto',
      },
      {
        tipo: 'video', src: clipCasaMirador, poster: posterCasaMirador,
        titulo: 'La torre y su entorno',
        texto: 'Balcones escalonados, piscinas comunes en el zócalo y el acceso vehicular resuelto bajo el edificio, sin cruzarse con los peatones.',
      },
    ],
  },
  {
    id: 'casa-los-andes',
    titulo: 'Casa Los Andes',
    categoria: 'residencial',
    meta: 'Residencial · Los Andes · 2022',
    alt: 'Casa Los Andes: fachada de dos pisos en gris y madera, con antejardín y acceso vehicular',
    foto: { src: fotoCasaLosAndesCasa, w: 1511, h: 822 },
    proporcion: 'r34',
    ancho: 'w5',
    desfase: null,
    cliente: 'Familia privada',
    ubicacion: 'Los Andes',
    anio: 2022,
    superficie: '210 m²',
    estado: 'Construido',
    relato: [
      {
        tipo: 'imagen', src: fotoCasaLosAndesCasa, w: 1511, h: 822,
        alt: 'Casa Los Andes: fachada de dos pisos en gris y madera, con antejardín y acceso vehicular',
        titulo: 'Casa Los Andes',
        texto: 'Un sitio angosto entre medianeros resolvió el programa en dos pisos: living y cocina abajo, dormitorios arriba, y un antejardín que amortigua la calle.',
      },
      {
        tipo: 'imagen', src: fotoCasaLosAndes1, w: 1511, h: 822,
        alt: 'Casa Los Andes: living-comedor con vista al mar desde la terraza cubierta',
      },
      {
        tipo: 'imagen', src: fotoCasaLosAndes2, w: 1511, h: 822,
        alt: 'Casa Los Andes: acceso principal, con jardín delantero y palmeras',
      },
      {
        tipo: 'imagen', src: fotoCasaLosAndes4, w: 1511, h: 822,
        alt: 'Casa Los Andes: balcón con vista al mar',
        titulo: 'Terraza',
        texto: 'La terraza superior se orientó hacia el mar, protegida del viento por un parapeto de vidrio.',
      },
      {
        tipo: 'imagen', src: fotoCasaLosAndes5, w: 1511, h: 822,
        alt: 'Casa Los Andes: plaza y área común ajardinada del entorno',
      },
      {
        tipo: 'video', src: clipCasaLosAndes, poster: posterCasaLosAndes,
        alt: 'Recorrido por el entorno de la casa',
      },
    ],
  },
  {
    id: 'conjunto-costanera',
    titulo: 'Conjunto Costanera',
    categoria: 'residencial',
    meta: 'Residencial · Algarrobo · 2025',
    alt: 'Conjunto Costanera: edificios bajos color blanco alrededor de un parque central con piscina, vistos desde el aire',
    foto: { src: fotoConjuntoCostanera, w: 1400, h: 788 },
    proporcion: 'r43',
    ancho: 'w7',
    desfase: 'd20',
    cliente: 'Inmobiliaria Litoral Sur',
    ubicacion: 'Algarrobo',
    anio: 2025,
    superficie: '1.400 m²',
    estado: 'Construido',
    relato: [
      {
        tipo: 'imagen', src: fotoConjuntoCostanera, w: 1400, h: 788,
        alt: 'Conjunto Costanera: edificios bajos color blanco alrededor de un parque central con piscina, vistos desde el aire',
        titulo: 'Conjunto Costanera',
        texto: 'Dieciocho unidades en bloques de tres pisos, ninguno más alto que los pinos que ya estaban en el sitio. El parque central, con piscina, es de uso común y cerrado a la calle.',
      },
      {
        tipo: 'imagen', src: fotoConjuntoCostaneraSitio, w: 1400, h: 788,
        alt: 'Conjunto Costanera: paño de terreno contiguo al conjunto, todavía sin construir',
      },
      {
        tipo: 'imagen', src: fotoConjuntoCostanera02, w: 1400, h: 788,
        alt: 'Conjunto Costanera: bloques residenciales vistos desde el aire, con el estacionamiento visitas',
      },
      {
        tipo: 'imagen', src: fotoConjuntoCostanera03, w: 1400, h: 788,
        alt: 'Conjunto Costanera: vista general del conjunto y su entorno costero',
      },
      {
        tipo: 'imagen', src: fotoConjuntoCostanera08, w: 1400, h: 788,
        alt: 'Conjunto Costanera: living-comedor de una unidad tipo',
        titulo: 'Unidad tipo',
        texto: 'Living-comedor con cocina integrada; el mismo layout se repite en las dieciocho unidades, solo cambia la orientación.',
      },
      {
        tipo: 'imagen', src: fotoConjuntoCostaneraDormitorio, w: 1400, h: 933,
        alt: 'Conjunto Costanera: dormitorio principal de una unidad tipo',
      },
      {
        tipo: 'video', src: clipConjuntoCostanera, poster: posterConjuntoCostanera,
        alt: 'Recorrido por una cocina equipada del conjunto',
      },
    ],
  },
  {
    id: 'interior-lastarria',
    titulo: 'Interior Lastarria',
    categoria: 'interiorismo',
    meta: 'Interiorismo · Barrio Lastarria, Santiago · 2021',
    alt: 'Interior Lastarria: living con chimenea de piedra tallada, piso de mosaico hidráulico y muebles de madera oscura',
    foto: { src: fotoInteriorLastarria, w: 1400, h: 787 },
    proporcion: 'r11',
    ancho: 'w6',
    desfase: null,
    cliente: 'Privado',
    ubicacion: 'Barrio Lastarria, Santiago',
    anio: 2021,
    superficie: '165 m²',
    estado: 'Construido',
    relato: [
      {
        tipo: 'imagen', src: fotoInteriorLastarria, w: 1400, h: 787,
        alt: 'Interior Lastarria: living con chimenea de piedra tallada, piso de mosaico hidráulico y muebles de madera oscura',
        titulo: 'Interior Lastarria',
        texto: 'Departamento de 1940 con mosaico hidráulico original: se restauró el que se pudo y el resto se reemplazó por una pieza nueva del mismo dibujo, sin disimular cuál es cuál.',
      },
      {
        tipo: 'imagen', src: fotoInteriorLastarriaTaller, w: 1066, h: 933,
        alt: 'Interior Lastarria: altillo convertido en taller, con caballetes, estantería y luz cenital',
        titulo: 'Taller con altillo',
        texto: 'La buhardilla que no tenía uso pasó a ser un taller con luz cenital, conectado al resto por una escalera de pletina.',
      },
      {
        tipo: 'imagen', src: fotoInteriorLastarriaLiving, w: 1400, h: 787,
        alt: 'Interior Lastarria: segundo living con chimenea de mármol y butacas color mostaza',
      },
      {
        tipo: 'imagen', src: fotoInteriorLastarriaLiving2, w: 1400, h: 786,
        alt: 'Interior Lastarria: living con puertas correderas de vidrio hacia el jardín y biombo de madera',
      },
      {
        tipo: 'imagen', src: fotoInteriorLastarriaPozuelo2, w: 1400, h: 787,
        alt: 'Interior Lastarria: hall de acceso con escalera curva y piso de mosaico geométrico',
        titulo: 'Hall de acceso',
        texto: 'La escalera original se conservó entera; solo se cambió la baranda, que estaba rota en tres tramos.',
      },
    ],
  },
  {
    id: 'casa-zapallar',
    titulo: 'Casa Zapallar',
    categoria: 'residencial',
    meta: 'Residencial · Zapallar · 2025',
    alt: 'Casa Zapallar: terraza en obra gruesa junto a la piscina, antes del revestimiento final, con el mar al fondo',
    foto: { src: fotoCasaZapallarObra, w: 1400, h: 788 },
    proporcion: 'r11',
    ancho: 'w6',
    desfase: 'd16',
    cliente: 'Familia privada',
    ubicacion: 'Zapallar',
    anio: 2025,
    superficie: '680 m²',
    estado: 'En obra',
    relato: [
      {
        tipo: 'imagen', src: fotoCasaZapallarObra, w: 1400, h: 788,
        alt: 'Casa Zapallar: terraza en obra gruesa junto a la piscina, antes del revestimiento final, con el mar al fondo',
        titulo: 'Casa Zapallar',
        texto: 'Obra gruesa terminada, a la espera del revestimiento de piedra que va sobre el hormigón visto. La piscina ya está impermeabilizada.',
      },
      {
        tipo: 'imagen', src: fotoCasaZapallarDerelicto, w: 1400, h: 788,
        alt: 'Casa Zapallar: estructura de hormigón a la vista, en una etapa temprana de la obra',
        titulo: 'Obra gruesa',
        texto: 'La estructura completa, antes de cerrar ningún muro: se aprovechó esta etapa para revisar in situ la altura libre de cada nivel.',
      },
      {
        tipo: 'imagen', src: fotoCasaZapallar, w: 1400, h: 788,
        alt: 'Casa Zapallar: proyección de la fachada terminada, con piscina infinita y revestimiento de piedra clara',
        titulo: 'Proyección',
        texto: 'Así se verá terminada: piscina infinita sobre la ladera, terrazas de madera y el volumen superior revestido en piedra clara.',
      },
      {
        tipo: 'imagen', src: fotoCasaZapallarMediterranea, w: 1400, h: 788,
        alt: 'Casa Zapallar: proyección del conjunto de terrazas y piscinas en desnivel',
      },
      {
        tipo: 'imagen', src: fotoCasaZapallarInterior, w: 1400, h: 933,
        alt: 'Casa Zapallar: proyección del living-comedor, con muro de piedra oscura y vista a la cordillera',
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
    texto: 'Primer conjunto de vivienda en altura: catorce departamentos para una cooperativa de ahorro, entregados en dieciséis meses. Aprendí a proyectar para un cliente colectivo, no para una sola familia.',
  },
  {
    anio: '2025',
    titulo: 'En obra',
    texto: 'Casa Zapallar levanta sus muros en la costa. La inspecciono cada semana, como las sesenta y tres anteriores.',
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
 * `foto` es opcional: cuatro de los cinco testimonios llevan retrato
 * (`src/assets/fotos/testimonio-*.jpg`), el que falta (Antonia Reyes) se
 * queda sin —no habia una cuarta foto de mujer disponible— y el componente
 * pinta sus iniciales sobre fondo plano en su lugar, el mismo mecanismo
 * que ya cubria el caso de "sin retrato" antes de que estas llegaran.
 */
export const testimonios = [
  {
    cita: 'Pedimos privacidad sin muros ciegos hacia la calle. La celosía de madera resolvió eso y de paso bajó la cuenta de la luz: con lo que ahorramos amoblamos el living.',
    autor: 'Familia Contreras Soto',
    obra: 'Casa Vitacura · Vitacura, Santiago, 2024',
    foto: { src: fotoTestimonioContreras },
  },
  {
    cita: 'Quince pisos y ni un reclamo por vista tapada: los balcones escalonados eran la parte del proyecto que más nos costó vender en los planos, y la que más agradecen los propietarios cuando se mudan.',
    autor: 'Francisca Lería, Inmobiliaria Costa Azul',
    obra: 'Casa Mirador · Concón, 2023',
    foto: { src: fotoTestimonioLeria },
  },
  {
    cita: 'Dieciocho unidades y un solo reclamo en dos años, por una llave que goteaba. El parque central fue la razón por la que compramos ahí, y sigue siendo la razón por la que nadie se quiere ir.',
    autor: 'Marcelo Iturra, primer comprador',
    obra: 'Conjunto Costanera · Algarrobo, 2025',
    foto: { src: fotoTestimonioIturra },
  },
  {
    cita: 'El mosaico original tenía más agujeros que baldosas. Prefirió mostrar el remiendo antes que esconderlo, y quedó mejor que si hubiera sido nuevo de fábrica.',
    autor: 'Antonia Reyes',
    obra: 'Interior Lastarria · Barrio Lastarria, Santiago',
    foto: null,
  },
  {
    cita: 'Vamos en obra gruesa y ya cambié dos veces de opinión sobre el revestimiento; las dos veces me hizo la maqueta antes de decidir, sin cobrar de más por el cambio.',
    autor: 'Ignacio Prieto',
    obra: 'Casa Zapallar · Zapallar, en obra',
    foto: { src: fotoTestimonioPrieto },
  },
]

export const ambitos = [
  'Vivienda unifamiliar',
  'Equipamiento público',
  'Rehabilitación',
  'Interiorismo',
  'Dirección de obra',
]
