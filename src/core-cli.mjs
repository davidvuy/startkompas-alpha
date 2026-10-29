import {publicError} from './cli-errors.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {checkModel} from './model.mjs';
import {regularFile,createCore,readCore,updateCore,attachFile,releaseAbandonedLock,writeExclusive,bytesFor,safeDirectory} from './store.mjs';
import {exportCore,restoreCore,migrateLegacy,exportSnapshot} from './transfer.mjs';
import {listHistory} from './history.mjs';
import {retrieveRecords} from './retrieval.mjs';
import {initializeProject} from './initialize.mjs';
import {handoff} from './handoff.mjs';
import {planNext,findReusable,prepareChange,upgradeWorkflow} from './workflow.mjs';
const [cmd,...args]=process.argv.slice(2),json=p=>JSON.parse(regularFile(p));
try {
  let result;
  const count=(n)=>{if(args.length!==n)throw Error('Wrong arguments; see docs/core-route.md');};
  switch(cmd){
    case 'validate':count(1);checkModel(json(args[0]));result={valid:true};break;
    case 'init':count(2);result=initializeProject(args[0],json(args[1]));break;
    case 'create':count(2);result=createCore(args[0],json(args[1]));break;
    case 'retrieve':count(2);result=retrieveRecords(args[0],json(args[1]));break;
    case 'read':count(2);result=readCore(...args);break;
    case 'plan':count(3);result=planNext(args[0],args[1],json(args[2]));break;
    case 'reuse':count(3);result=findReusable(args[0],args[1],json(args[2]));break;
    case 'impact':count(2);result=prepareChange(args[0],json(args[1]));break;
    case 'upgrade-workflow':count(3);result=upgradeWorkflow(...args);break;
    case 'update':count(2);result=updateCore(args[0],json(args[1]));break;
    case 'attach':count(3);result=attachFile(args[0],json(args[1]),args[2]);break;
    case 'export':if(args.length!==3&&args.length!==4)throw Error('export <dir> <id> <new-bundle> [revision]');result=exportCore(args[0],args[1],args[2],args[3]===undefined?null:Number(args[3]));break;
    case 'history':if(args.length!==2&&args.length!==3)throw Error('history <dir> <id> [limit]');result=listHistory(args[0],args[1],{limit:args[2]===undefined?50:Number(args[2])});break;
    case 'snapshot-export':count(4);result=exportSnapshot(args[0],args[1],args[2],Number(args[3]));break;
    case 'restore':count(3);result=restoreCore(...args);break;
    case 'migrate':count(3);result=migrateLegacy(...args);break;
    case 'unlock':count(3);result=releaseAbandonedLock(...args);break;
    case 'handoff':if(args.length<2||args.length>4)throw Error('handoff <dir> <id> [query] [limit]');result=handoff(args[0],args[1],{query:args[2]||'',limit:args[3]===undefined?20:Number(args[3])});break;
    case 'save-handoff':count(3);result=handoff(args[0],args[1]);safeDirectory(path.dirname(path.resolve(args[2])));if(fs.existsSync(args[2]))throw Error('Handoff destination exists');writeExclusive(args[2],bytesFor(result));result={saved:args[2],project_id:result.project_id,revision:result.revision};break;
    default:throw Error('Commands: validate init create read retrieve update attach export history snapshot-export restore migrate unlock handoff save-handoff plan reuse impact upgrade-workflow; see docs/core-route.md and docs/workflow-route.md');
  }
  console.log(JSON.stringify(result,null,2));
}catch(e){console.error(JSON.stringify(publicError(e)));process.exitCode=1;}
