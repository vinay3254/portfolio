import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ontrack: resolve(__dirname, 'on-track/index.html'),
        offtrack: resolve(__dirname, 'off-track/index.html'),
        calendar: resolve(__dirname, 'calendar/index.html'),
      }
    }
  }
})
