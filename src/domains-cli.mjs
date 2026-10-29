import {publicError} from './cli-errors.mjs';
import {domainIndex,domainDetail,prepareScreen,readScreens} from './domains.mjs';
import {regularFile} from './store.mjs';
const [cmd,...args]=process.argv.slice(2);
try{
  let value;
  if(cmd==='index'&&args.length===0)value=domainIndex();
  else if(cmd==='detail'&&args.length===1)value=domainDetail(args[0]);
  else if(cmd==='prepare'&&args.length===2)value=prepareScreen(args[0],JSON.parse(regularFile(args[1])));
  else if(cmd==='screens'&&args.length===2)value=readScreens(...args);
  else throw Error('Usage: index | detail <D01..D15> | prepare <dossier-dir> <request.json> | screens <dossier-dir> <project-id>');
  console.log(JSON.stringify(value,null,2));
}catch(e){console.error(JSON.stringify(publicError(e)));process.exitCode=1;}
