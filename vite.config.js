import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  build: {
    extractCSS: true,
    optimizeDeps: true,

    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'hackbook',
      fileName: (format) => `hackbook.${format}.js`
    },
    cssCodeSplit: true,
    sourcemap: false,
  }
})
