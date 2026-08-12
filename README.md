# Portafolio de arquitectura

Sitio de una página para una arquitecta. React + Vite, con
framer-motion para el movimiento y CSS propio con tokens.

El contenido es de ejemplo: los proyectos, el nombre y los datos de
contacto son inventados y están todos en `src/data/proyectos.js`.

## Arrancar

```bash
npm install
npm run dev        # servidor de desarrollo en :5173
npm run build      # compila a dist/
npm test           # 68 comprobaciones funcionales en un navegador real
npm run typecheck
```

## Estructura

```
src/
├── App.jsx              orquesta la intro y el orden de las secciones
├── assets/fotos/        las fotografías de obra y el retrato
├── components/          una por sección, más las piezas de movimiento
├── data/proyectos.js    proyectos, etapas, cifras y rutas de las fotos
├── hooks/               aparición al scroll, sección activa, movimiento
└── styles/              base.css (tokens) + fonts.css (Poppins en base64)
tests/funcional.mjs      conduce Edge/Chrome con puppeteer-core
legacy/                  la versión anterior en HTML plano, autocontenida
```

## Las fotografías

Van importadas desde `src/data/proyectos.js`, así que Vite las versiona y
las emite como archivos sueltos: todas se cargan en diferido y llevan sus
medidas en el `<img>` para que la tarjeta no dé el salto al llegar la
imagen. El `alt` describe lo que se ve, no lo que dice el título.

Sobre cada foto hay un zoom con la rueda del ratón (1x–1.8x,
`ImagenZoom.jsx`). Solo actúa si el puntero está encima **y** la página
lleva un momento quieta, y en los topes devuelve la rueda al scroll: la
foto nunca atrapa el gesto. Con movimiento reducido no se monta.

## Movimiento y accesibilidad

Todo el movimiento se apaga cuando el sistema pide
`prefers-reduced-motion: reduce` — en Windows, al desactivar
*Accesibilidad › Pantalla › Mostrar animaciones*. Eso incluye la intro, el
cursor propio, el parallax y los revelados al hacer scroll.

Para revisar el trabajo sin cambiar el ajuste del sistema:

| | |
|---|---|
| `?movimiento=1` | fuerza el movimiento y lo recuerda en ese navegador |
| `?movimiento=0` | devuelve el mando al sistema |

La anulación solo funciona en ese sentido: nunca apaga el movimiento a
quien sí lo quiere, y no afecta a nadie que no la pida a mano.

## Las pruebas

`npm test` levanta un servidor sobre `dist/`, conduce un navegador real y
comprueba la intro, los revelados al scroll, el filtro de proyectos, la
validación del formulario, el menú móvil y el comportamiento completo con
movimiento reducido. Requiere Edge o Chrome instalado; no descarga ningún
navegador.

Hay que compilar antes: `npm run build && npm test`.

## Fuentes

Poppins va incrustada en `src/styles/fonts.css` como `@font-face` en
base64, así que la página no hace ninguna petición a servidores externos.
