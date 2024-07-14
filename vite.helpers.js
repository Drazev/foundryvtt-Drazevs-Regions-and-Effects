import {readdirSync} from 'fs'
import {resolve} from 'path'

/**
 * 
 * @param {Union<Path,string>} path 
 * @param {boolean} isRecursive 
 * @returns {List<string>}
 */
export function getDirList(path,isRecursive=false) {
    const fileList= readdirSync(path,{
      withFileTypes : true,
      recursive : isRecursive
    })
    console.log(`Adding contents of ${path} to entrypoints:`)
    let list = []
    for( let f of fileList) {
      if(f.isDirectory()) continue;
      console.log(f)
      let filePath = resolve(f.parentPath,f.name)
      console.log("====> ",filePath)
      list.push(filePath);
    }
    return list;
  }