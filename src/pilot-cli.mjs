import {regularFile} from './store.mjs';
import {preparePilotPackage} from './pilot-package.mjs';
const [cmd,dir,file]=process.argv.slice(2);
try {if(process.argv.length!==5||cmd!=='prepare')throw Error('Usage: prepare <dossier-dir> <request.json>');console.log(JSON.stringify(preparePilotPackage(dir,JSON.parse(regularFile(file))),null,2));}
catch(e){console.error(JSON.stringify({error:e.message}));process.exitCode=1;}
