import {regularFile} from './store.mjs';
import {checkRegister,registerSummary,prepareRegister,readRegisters} from './source-register.mjs';
const [cmd,...args]=process.argv.slice(2),json=p=>JSON.parse(regularFile(p));
try{
  let value;
  if(cmd==='validate'&&args.length===1)value=registerSummary(checkRegister(json(args[0])));
  else if(cmd==='prepare'&&args.length===2)value=prepareRegister(args[0],json(args[1]));
  else if(cmd==='show'&&args.length===2)value=readRegisters(...args);
  else throw Error('Usage: validate <registry.json> | prepare <dossier-dir> <request.json> | show <dossier-dir> <project-id>');
  console.log(JSON.stringify(value,null,2));
}catch(error){console.error(JSON.stringify({error:error.message}));process.exitCode=1;}
