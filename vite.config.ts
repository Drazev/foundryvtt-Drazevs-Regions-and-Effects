import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  publicDir: 'public',
  base: '/modules/drazevs-regional-effects/',
  server: {
    port: 30001,
    open: true,
    proxy: {
      '^(?!/modules/drazevs-regional-effects)': 'http://localhost:30000/',
      '/socket.io': {
        target: 'ws://localhost:30000',
        ws: true,
      },
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      name: 'drazevs-regional-effects',
      entry: 'src/main.ts',
      formats: ['es'],
      fileName: 'init'
    }
  },
});