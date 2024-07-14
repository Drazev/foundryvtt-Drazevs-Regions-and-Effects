import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build : {
    lib : {
      entry : [
        resolve(__dirname,'src/init.mjs'),
        resolve(__dirname,'src/apps/*')
      ]
        
    },
    name : 'foundryvtt-drazevs-regions-and-effects'
  }
})
