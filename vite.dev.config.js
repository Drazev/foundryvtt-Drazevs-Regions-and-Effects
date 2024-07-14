import { defineConfig } from 'vite'
import {resolve} from 'path'
import react from '@vitejs/plugin-react'
import { getDirList } from './vite.helpers'
const SHEET_PATH = resolve(__dirname,'src/sheets/')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build : {
    lib : {
      entry : [
        resolve(__dirname,'src/init.mjs')
      ].concat(getDirList(SHEET_PATH)),

    },
    outDir : 'test',
    watch : true,
    rollupOptions : {
      logLevel : "debug",
      preserveEntrySignatures : "strict"
    },
    sourcemap : true,
    manifest : true
  },
  mode : "development"
})
console.log(defineConfig,defineConfig())