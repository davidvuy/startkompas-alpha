import {regularFile} from './store.mjs';import {dailyView,renderDaily} from './daily-view.mjs';
const [cmd,dir,file]=process.argv.slice(2);
try{if(process.argv.length!==5||!['json','brief','details'].includes(cmd))throw Error('Usage: json|brief|details <dossier-dir> <selection.json>');const view=dailyView(dir,JSON.parse(regularFile(file)));console.log(cmd==='json'?JSON.stringify(view,null,2):renderDaily(view,{details:cmd==='details'}));}catch(error){console.error(JSON.stringify({error:error.message}));process.exitCode=1;}
