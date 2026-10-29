import {regularFile} from './store.mjs';import {evaluateRun,prepareRunCheckpoint} from './run-budget.mjs';
const [cmd,...args]=process.argv.slice(2),json=p=>JSON.parse(regularFile(p));
try{let result;if(cmd==='check'&&args.length===1)result=evaluateRun(json(args[0]));else if(cmd==='prepare'&&args.length===2)result=prepareRunCheckpoint(args[0],json(args[1]));else throw Error('Usage: check <ledger.json> | prepare <dossier-dir> <request.json>');console.log(JSON.stringify(result,null,2));}catch(error){console.error(JSON.stringify({error:error.message}));process.exitCode=1;}
