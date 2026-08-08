import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
