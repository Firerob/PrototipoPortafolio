import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Rutas relativas en vez de absolutas. GitHub Pages sirve este repo en
  // /PrototipoPortafolio/, no en la raiz del dominio, y con `/assets/...`
  // el navegador pediria los archivos un nivel por encima y solo veria
  // 404. Relativo funciona en los dos sitios sin ramificar la config, y
  // deja intacto el servidor de las pruebas, que sirve dist/ en la raiz.
  base: './',

  server: { port: 5173, open: true },
  build: {
    outDir: 'dist',
    // Las fuentes van incrustadas en base64 dentro de fonts.css.
    // Sin este limite alto Vite las extraeria a archivos sueltos y la
    // pagina dejaria de ser autocontenida.
    //
    // Las fotografias son la excepcion: incrustarlas en base64 las mete
    // dentro del JS, las engorda un 33% y —lo que importa— anula el
    // `loading="lazy"`, porque un data: URI ya viene descargado. Salen
    // como archivos sueltos para que el navegador pida cada una cuando
    // toque y pueda cachearlas por separado.
    assetsInlineLimit: (ruta) => !/\.(jpe?g|png|webp|avif|gif)$/i.test(ruta),
  },
})
