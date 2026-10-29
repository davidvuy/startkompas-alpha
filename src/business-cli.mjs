import {publicError} from './cli-errors.mjs';
import {regularFile} from './store.mjs';
import {briefTypes,prepareBusinessBrief,readBusinessBrief,renderBusinessBrief} from './business-brief.mjs';
const [cmd,...args]=process.argv.slice(2);
try {
  if(cmd==='types'&&args.length===0)console.log(JSON.stringify(briefTypes,null,2));
  else if(cmd==='prepare'&&args.length===2)console.log(JSON.stringify(prepareBusinessBrief(args[0],JSON.parse(regularFile(args[1]))),null,2));
  else if(cmd==='read'&&args.length===3)console.log(JSON.stringify(readBusinessBrief(...args),null,2));
  else if(cmd==='render'&&args.length===3)process.stdout.write(renderBusinessBrief(...args));
  else throw Error('Usage: types | prepare <dossier> <request.json> | read|render <dossier> <project-id> <artifact-id>');
} catch(error){console.error(JSON.stringify(publicError(error)));process.exitCode=1;}
