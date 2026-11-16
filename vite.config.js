import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import staticShell from './build/staticShell.js'

export default defineConfig({
  // staticShell: real content in the initial HTML for previews, crawlers and no-JS readers
  plugins: [vue(), staticShell()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    // the Three.js scene is a separate, lazy-loaded chunk (~136 KB gzip) fetched only on capable devices
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: { gsap: ['gsap'] },
      },
    },
  },
})
