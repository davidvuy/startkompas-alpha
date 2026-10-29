import {regularFile} from './store.mjs';
import {planIntake,prepareIntakeAnswer,renderIntake} from './intake.mjs';
const [cmd,dir,file]=process.argv.slice(2);
try{if(process.argv.length!==5||!['plan','answer','brief-nl','brief-en'].includes(cmd))throw Error('Usage: plan|answer|brief-nl|brief-en <dossier-dir> <request.json>');const req=JSON.parse(regularFile(file));console.log(cmd.startsWith('brief-')?renderIntake(planIntake(dir,req),cmd.slice(6)):JSON.stringify((cmd==='plan'?planIntake:prepareIntakeAnswer)(dir,req),null,2));}catch(e){console.error(JSON.stringify({error:e.message}));process.exitCode=1;}
