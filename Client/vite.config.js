import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['skillgapguide.engine.pro.vn']
    // Disable HMR trong production để tránh WebSocket errors
    // hmr: process.env.NODE_ENV === 'production' ? false : {
    //   port: 5173
    // }
  }
})
