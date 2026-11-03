import {fileURLToPath} from 'node:url';
import {regularFile} from './store.mjs';
import {inspectModulePackage} from './module-package.mjs';
const ids=Object.freeze(['scoped-service','recurring-delivery','exploratory-pilot']);
export function libraryModule(id){
 if(!ids.includes(id))throw Error('Unknown practice module');
 const value=JSON.parse(regularFile(fileURLToPath(new URL('../modules/packages/'+id+'.json',import.meta.url)),1048576));
 if(value.id!==id)throw Error('Practice module identity mismatch');
 return inspectModulePackage(value,'1.1.0');
}
export function moduleLibrary(){return ids.map(libraryModule);}
