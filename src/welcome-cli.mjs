import {createInterface} from 'node:readline';
import {publicError} from './cli-errors.mjs';
import {diagnose} from './doctor.mjs';
const [cmd,...args]=process.argv.slice(2);
try{
 if(cmd==='doctor'){
  if(args.some(a=>a!=='--json')||args.length>1)throw Error('Usage: doctor [--json]');const report=diagnose();console.log(args[0]?JSON.stringify(report,null,2):report.checks.map(c=>c.status.toUpperCase()+' '+c.name+': '+c.detail).join('\n'));if(!report.ok)process.exitCode=1;
 }else if(cmd==='start'){
  if(args.length)throw Error('Usage: start (guided terminal setup)');
  const rl=createInterface({input:process.stdin,crlfDelay:Infinity,terminal:false}),it=rl[Symbol.asyncIterator]();
  const ask=async q=>{process.stdout.write(q);const line=await it.next();if(line.done)throw Error('Setup cancelled before saving.');return line.value.trim();};
  try{const name=await ask('Projectnaam / Project name: '),id=await ask('Project-ID (lowercase a-z, 0-9, hyphen): '),dir=await ask('Nieuwe privemap buiten de app / New private folder outside app: '),task=await ask('Eerste taak / First task (optional): ');const yes=await ask('Nieuw leeg dossier opslaan? / Save new empty project? [ja/yes]: ');if(!['ja','yes'].includes(yes.toLowerCase())){console.log('Cancelled; nothing saved.');}else{const {initializeProject}=await import('./initialize.mjs');initializeProject(dir,{project_id:id,name,first_task:task?{id:'first-task',title:task}:null});const {projectSummary}=await import('./project-view.mjs');console.log(projectSummary(dir,id));console.log('Resume: node src/startkompas.mjs overview '+JSON.stringify(dir)+' '+id);}}finally{rl.close();}
 }else if(cmd==='overview'){
  if(args.length<2||args.length>3)throw Error('Usage: overview <directory> <project-id> [nl|en]');const {projectSummary}=await import('./project-view.mjs');process.stdout.write(projectSummary(...args));
 }else if(cmd==='compare'){
  if(args.length!==4&&!(args.length===5&&args[4]==='--values'))throw Error('Usage: compare <directory> <project-id> <older-revision> <newer-revision> [--values]');const {compareRevisions,renderComparison}=await import('./project-view.mjs');const result=compareRevisions(args[0],args[1],Number(args[2]),Number(args[3]),{values:args[4]==='--values'});process.stdout.write(args[4]?JSON.stringify(result,null,2)+'\n':renderComparison(result));
 }else throw Error('Commands: doctor, start, overview, compare');
}catch(error){console.error(JSON.stringify(publicError(error)));process.exitCode=1;}
