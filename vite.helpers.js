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
      let filePath = resolve(f.parentPath,f.name)
      console.log("====> ",filePath)
      list.push(filePath);
    }
    return list;
  }

  export function deepMerge(...obj) {
    if(obj.length < 1)
      return  {}
    else if(obj.length == 1)
      return obj[1];

    let outObj = {
      ...obj[0]
    }
    for( let i=1;i<obj.length;++i) {
      const o2 = obj[i];
      for(const [key,value] of Object.entries(o2)) {
        if(value instanceof Object && outObj[key] instanceof Object) {
          outObj[key] = deepMerge(outObj[key],value);
        }
        else {
          outObj[key] = value;
        }
      }
    }
    return outObj;
  };