import {createInterface} from 'node:readline';
import {publicError} from './cli-errors.mjs';
import {readCore} from './store.mjs';
import {briefTypes,prepareBusinessBrief,readBusinessBrief} from './business-brief.mjs';
import {workspaceView,renderWorkspace,impactView,prepareRecord,saveGuided,reportPreview,writeReport,operationId,recoveryCheck,sourceReview,journeyView,prepareTaskState} from './workspace.mjs';
import {cleanText} from './project-view.mjs';

const [cmd,...args]=process.argv.slice(2);
const usage='workspace show|journey <dir> <id> | impact <dir> <id> <record-id> | draft <dir> <id> <offer|interview|alternatives|pilot|pricing> [previous-artifact] | add <dir> <id> <assumption|observation|decision|task> | report-preview <dir> <id> [summary,tasks,assumptions,decisions,drafts] | report-save <dir> <id> <sections> <preview-sha256> <new-file.md> | recovery-check <dir> <id> <new-private-directory> | source-review <dir> <id> <YYYY-MM-DD> [max-age-days]';
async function guided(fn){
 const rl=createInterface({input:process.stdin,crlfDelay:Infinity,terminal:false}),it=rl[Symbol.asyncIterator]();
 async function ask(prompt,{required=false,allowed=null}={}){
  while(true){process.stdout.write(prompt+': ');const line=await it.next();if(line.done||line.value.trim()==='/cancel')throw Error('Cancelled before saving.');const value=line.value.trim();if(value.length>4000||(required&&!value)||(allowed&&!allowed.includes(value))){console.log('Invalid answer; try again, or enter /cancel.');continue;}return value;}
 }
 try{console.log('Private local input. Use /cancel to stop without saving. No AI call or external message is made.');await fn(ask);}finally{rl.close();}
}
async function confirmSave(ask,dir,prepared){
 const bundle=await ask('New private retry-bundle directory outside app and project',{required:true});
 console.log('Saving will change revision '+prepared.update_request.expected_revision+' of project '+prepared.update_request.project_id+'. Retry files remain in your chosen directory.');
 const yes=await ask('Save this exact proposal? [yes/ja/no/nee]',{allowed:['yes','ja','no','nee']});
 if(!['yes','ja'].includes(yes)){console.log('Cancelled; nothing saved.');return;}
 console.log(JSON.stringify(saveGuided(dir,prepared,bundle),null,2));
}
try{
 if(cmd==='show'&&args.length===2)process.stdout.write(renderWorkspace(workspaceView(...args)));
 else if(cmd==='journey'&&args.length===2)console.log(JSON.stringify(journeyView(...args),null,2));
 else if(cmd==='recovery-check'&&args.length===3)console.log(JSON.stringify(recoveryCheck(...args),null,2));
 else if(cmd==='source-review'&&(args.length===3||args.length===4))console.log(JSON.stringify(sourceReview(args[0],args[1],args[2],args[3]===undefined?90:Number(args[3])),null,2));
 else if(cmd==='impact'&&args.length===3)console.log(JSON.stringify(impactView(...args),null,2));
 else if(cmd==='report-preview'&&(args.length===2||args.length===3))console.log(JSON.stringify(reportPreview(args[0],args[1],args[2]?.split(',')),null,2));
 else if(cmd==='report-save'&&args.length===5)console.log(JSON.stringify(writeReport(args[0],args[1],args[2].split(','),args[3],args[4]),null,2));
 else if(cmd==='draft'&&(args.length===3||args.length===4)){
  const [dir,id,kind,previous]=args;if(!Object.hasOwn(briefTypes,kind))throw Error('Choose an available draft kind');
  const state=readCore(dir,id),prior=previous?readBusinessBrief(dir,id,previous):null;
  if(prior&&prior.request.kind!==kind)throw Error('Previous draft has a different kind');
  await guided(async ask=>{
   const language=await ask('Language / Taal [nl/en]',{allowed:['nl','en']}),lang=language==='nl'?0:1;
   const client=prior?prior.request.client:(await ask('Client/context (optional; use a code, not personal data)')||null);
   const period=prior?prior.request.period:(await ask('Period (optional)')||null);
   const change_reason=prior?await ask('Why revise this draft?',{required:true}):null;
   const fields=[];
   for(const [key,labels]of Object.entries(briefTypes[kind].fields)){
    const old=prior?.request.fields.find(f=>f.key===key);
    if(old?.value)console.log('Current '+key+': '+cleanText(old.value));
    const value=await ask(labels[lang]+(prior?' (blank keeps current; - makes unknown)':' (blank means unknown)'));
    if(!value&&old){fields.push(structuredClone(old));continue;}
    if(!value||value==='-'){fields.push({key,value:null,assertion:'unknown',record_ids:[]});continue;}
    const basis=await ask('Existing basis record IDs, comma-separated (optional)');
    fields.push({key,value,assertion:'proposal',record_ids:basis?basis.split(',').map(x=>x.trim()):[]});
   }
   const prepared=prepareBusinessBrief(dir,{project_id:id,expected_revision:state.dossier.revision,operation_id:operationId(),at:new Date().toISOString().slice(0,10),language,kind,client,period,previous_artifact_id:previous??null,change_reason,fields});
   process.stdout.write(prepared.document_markdown);console.log('All new text remains a proposal. Linking records does not approve the draft.');
   await confirmSave(ask,dir,prepared);
  });
 }else if(cmd==='task-state'&&args.length===3){
  const [dir,id,taskId]=args,state=readCore(dir,id);
  if(!state.dossier.tasks.some(t=>t.id===taskId))throw Error('Unknown task');
  await guided(async ask=>{const progress=await ask('Progress [open/in_progress/deferred/done]',{allowed:['open','in_progress','deferred','done']}),reason=await ask('Reason / what actually happened',{required:true});const proposal=prepareTaskState(dir,id,state.dossier.revision,taskId,progress,reason);console.log('Task '+taskId+' → '+progress+'. Evidence and applicability are unchanged; done does not mean independently supported.');await confirmSave(ask,dir,proposal);});
 }else if(cmd==='add'&&args.length===3){
  const [dir,id,kind]=args;if(!['assumption','observation','decision','task'].includes(kind))throw Error('Unknown record kind');
  const state=readCore(dir,id);
  await guided(async ask=>{
   const input={text:await ask(kind==='observation'?'Reported statement or observation (not your interpretation)':kind,{required:true})};
   if(kind==='decision')input.reason=await ask('Why this decision?',{required:true});
   if(kind==='observation'){
    input.title=await ask('Participant code or source title (avoid personal names)',{required:true});
    input.location=await ask('Private reference to your notes (not fetched)',{required:true});
    input.scope=await ask('Context and limits of this observation',{required:true});
    input.date=await ask('Observation date YYYY-MM-DD',{required:true});
   }
   if(kind!=='assumption'){const basis=await ask('Existing related record IDs, comma-separated (optional)');input.basis_ids=basis?basis.split(',').map(x=>x.trim()):[];}
   const prepared=prepareRecord(dir,id,state.dossier.revision,kind,input);
   console.log(cleanText(JSON.stringify(prepared.update_request.changes,null,2)));
   if(kind==='observation')console.log('Saved as reported, not independently verified. Related assumptions stay unchanged.');
   await confirmSave(ask,dir,prepared);
  });
 }else if(cmd==='help'||cmd==='--help'||!cmd)console.log(usage);
 else throw Error('Usage: '+usage);
}catch(error){console.error(JSON.stringify(publicError(error)));process.exitCode=1;}
