import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { getDirList, deepMerge } from './vite.helpers'
const SHEET_PATH = resolve(__dirname,'src/sheets/');
const MODEL_PATH = resolve(__dirname,'src/model/');

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  let sharedConfig = {
    plugins: [react()],
    build : {
      lib : {
        entry : [
          resolve(__dirname,'src/init.mjs')
        ]
          .concat(getDirList(SHEET_PATH))
          .concat(getDirList(MODEL_PATH))
      }
    },
    define: {
      process : {
        env : process.env
      }
    },
    mode : mode
  };
  console.log("Mode: ",mode);

  if(mode==='development') {
    let out = deepMerge({},sharedConfig,
      {
        build : {
          outDir : 'test',
          watch : true,
          rollupOptions : {
            logLevel : "debug",
            preserveEntrySignatures : "strict"
          },
          sourcemap : true,
          manifest : true
        }
      }
    );
    console.log(out);
    return out;
  }
  else {
    return deepMerge({},sharedConfig,  {
      plugins: [react()],
      build : {
        name : 'foundryvtt-drazevs-regions-and-effects'
      }
    });
  }
})
