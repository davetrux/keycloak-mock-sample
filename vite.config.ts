import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 8008
  },
  server: {
    port: 8008
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/context/__tests__/setup.ts']
  }
})
