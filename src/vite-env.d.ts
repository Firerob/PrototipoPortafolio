/// <reference types="vite/client" />

// Declara los imports con efecto secundario de hojas de estilo, que Vite
// resuelve en tiempo de compilacion pero TypeScript no conoce por si solo.
declare module '*.css'
