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
    assetsInlineLimit: 1024 * 1024,
  },
})
