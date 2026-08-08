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
    // Las fotografias y el video son la excepcion: incrustarlos en base64
    // los mete dentro del JS, los engorda un 33% y —lo que importa— anula
    // la carga diferida, porque un data: URI ya viene descargado. Salen
    // como archivos sueltos para que el navegador pida cada uno cuando
    // toque y pueda cachearlos por separado.
    //
    // En el video no es una mejora, es la diferencia entre publicar o no:
    // son 4 MB, y en base64 se irian a ~5,3 MB DENTRO del bundle de JS,
    // que es codigo que bloquea el arranque. Descargado aparte, ni eso ni
    // se pide hasta que la portada ya esta en pantalla.
    assetsInlineLimit: (ruta) => !/\.(jpe?g|png|webp|avif|gif|mp4|webm|mov)$/i.test(ruta),
  },
})
