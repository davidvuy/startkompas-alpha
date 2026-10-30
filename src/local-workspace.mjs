import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {safeDirectory,regularFile,readCore} from './store.mjs';
import {initializeProject} from './initialize.mjs';
import {workspaceView,saveGuided,operationId,reportPreview,writeReport,isProjectArchived,isPracticeProject,prepareProjectArchive} from './workspace.mjs';
import {briefTypes,prepareBusinessBrief,readBusinessBrief,renderBusinessBrief} from './business-brief.mjs';
import {retrieveRecords} from './retrieval.mjs';
import {dependencyGraph} from './dependencies.mjs';
import {listHistory} from './history.mjs';
import {compareRevisions,renderComparison} from './project-view.mjs';

export class WorkspaceError extends Error {
 constructor(message,status=400){super(message);this.status=status;}
}
export function exactObject(value,keys){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!keys.includes(k))||keys.some(k=>!Object.hasOwn(value,k)))throw new WorkspaceError('The request is incomplete or contains unknown fields.');
}

// Shared application boundary: no alternate storage/schema or direct UI writes.
export function localWorkspace(selectedRoot){
 const root=safeDirectory(selectedRoot),handles=new Map(),references=new Map(),previews=new Map();
 const offerKeys=Object.keys(briefTypes.offer.fields);
 function startingFields(d){return Object.fromEntries([['segment','customer','Provisional customer: '],['outcome','outcome','Proposed outcome: ']].map(([key,suffix,prefix])=>{const record=d.assumptions.find(a=>a.id==='starting-'+suffix);return [key,record?.text.startsWith(prefix)?{value:record.text.slice(prefix.length),id:record.id}:null];}));}
 function requireActive(dir,id){if(isProjectArchived(readCore(dir,id).dossier))throw new WorkspaceError('This project is archived. Restore it before editing.',409);}
 function holdPreview(entry){
  for(const [key,value]of previews)if(value.expires<Date.now())previews.delete(key);
  if(previews.size>=20)previews.delete(previews.keys().next().value);
  const key=randomUUID();previews.set(key,{...entry,expires:Date.now()+15*60*1000});return key;
 }
 function shortText(value,label){if(typeof value!=='string'||value.length>4000)throw new WorkspaceError(label+' must be text of at most 4000 characters.');return value.trim();}
 function checkRoot(){if(fs.realpathSync(root)!==root)throw new WorkspaceError('The project folder has moved. Restart the workspace.',409);}
 function directory(folder){
  checkRoot();
  if(typeof folder!=='string'||!folder||folder==='.'||folder==='..'||/[\\/\0]/.test(folder))throw new WorkspaceError('Invalid project folder.');
  const dir=path.join(root,folder);
  if(fs.existsSync(dir)&&(fs.lstatSync(dir).isSymbolicLink()||fs.realpathSync(dir)!==dir))throw new WorkspaceError('Linked or relocated project folders cannot be opened.',409);
  return dir;
 }
 function register(folder,id){
  const key=JSON.stringify([folder,id]);
  if(!references.has(key)){const ref=randomUUID();references.set(key,ref);handles.set(ref,{folder,id});}
  return references.get(key);
 }
 function open(ref){
  if(typeof ref!=='string'||!handles.has(ref))throw new WorkspaceError('This project is not selected. Refresh the project list.',404);
  const {folder,id}=handles.get(ref),dir=directory(folder);
  try{readCore(dir,id);}catch{throw new WorkspaceError('Project unavailable or identity changed. Check the folder; your data has not been overwritten.',409);}
  return {dir,id,folder};
 }
 return {
  list(){
   checkRoot();const projects=[],unavailable=[];let count=0;
   const iterator=fs.opendirSync(root);
   try{for(let entry;(entry=iterator.readSync())!==null;){
    if(++count>200)throw new WorkspaceError('This folder contains too many entries. Choose a smaller project folder.',413);
    if(entry.isSymbolicLink())continue;
    if(!entry.isDirectory())continue;
    const dir=directory(entry.name),file=path.join(dir,'project.json');
    if(!fs.existsSync(file))continue;
    try{
     const id=JSON.parse(regularFile(file)).project_id,{dossier:d}=readCore(dir,id);
     projects.push({ref:register(entry.name,id),folder:entry.name,id:d.project_id,name:d.name,revision:d.revision,practice:isPracticeProject(d),archived:isProjectArchived(d),updated:fs.statSync(file).mtime.toISOString()});
    }catch{unavailable.push(entry.name);}
   }}finally{iterator.closeSync();}
   return {root,projects:projects.sort((a,b)=>b.updated.localeCompare(a.updated)),unavailable};
  },
  create(input){
   exactObject(input,['id','name','task','confirmed',...(Object.hasOwn(input??{},'practice')?['practice']:[]),...(Object.hasOwn(input??{},'context')?['context']:[])]);
   if(Object.hasOwn(input,'context')){exactObject(input.context,['customer','outcome']);for(const value of Object.values(input.context))if(typeof value!=='string'||value.length>2000)throw new WorkspaceError('Starting context must be text of at most 2000 characters per field.');}
   if(Object.hasOwn(input,'practice')&&typeof input.practice!=='boolean')throw new WorkspaceError('Practice must be true or false.');
   if(input.confirmed!==true)throw new WorkspaceError('Confirm project creation first.');
   if(typeof input.id!=='string'||! /^[a-z0-9][a-z0-9-]{0,63}$/.test(input.id))throw new WorkspaceError('Use lowercase letters, numbers and hyphens for the project ID (maximum 64).');
   for(const field of ['name','task'])if(typeof input[field]!=='string'||input[field].length>4000||(field==='name'&&!input[field].trim()))throw new WorkspaceError('Enter a project name and keep each field under 4001 characters.');
   const dir=directory(input.id);
   if(fs.existsSync(dir))throw new WorkspaceError('This folder already exists. Choose another ID or open the existing project.',409);
   initializeProject(dir,{project_id:input.id,name:input.name.trim(),practice:input.practice===true,first_task:input.task.trim()?{id:'first-task',title:input.task.trim()}:null,...(input.context?{context:input.context}:{})});
   return {ref:register(input.id,input.id)};
  },
  show(ref){const {dir,id,folder}=open(ref);return {folder,...workspaceView(dir,id)};},
  draft(input){
   exactObject(input,['ref','id']);const {dir,id}=open(input.ref),state=readCore(dir,id);
   let draft,markdown;try{draft=readBusinessBrief(dir,id,input.id);markdown=renderBusinessBrief(dir,id,input.id);}catch{throw new WorkspaceError('This saved draft is unavailable or damaged. No file was changed.',409);}
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed. Open the draft again.',409);
   return {id:draft.artifact_id,version:draft.version,kind:draft.request.kind,markdown,requires_review:draft.requires_review,historical:draft.successor_ids.length>0,successors:draft.successor_ids,basis_ids:[...new Set(draft.fields.flatMap(f=>f.record_ids))]};
  },
  search(input){
   exactObject(input,['ref','revision','query','offset']);const {dir,id}=open(input.ref),state=readCore(dir,id);
   let result;try{result=retrieveRecords(dir,{project_id:id,source_revision:input.revision,query:input.query,groups:[],ids:[],offset:input.offset,limit:25});}catch{throw new WorkspaceError('Search could not run. Refresh the project and use a query of at most 1000 characters.',409);}
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed during search. Refresh it and search again.',409);
   return result;
  },
  record(input){
   exactObject(input,['ref','id']);const {dir,id}=open(input.ref),state=readCore(dir,id);
   let result;try{result=retrieveRecords(dir,{project_id:id,source_revision:state.dossier.revision,query:'',groups:[],ids:[input.id],offset:0,limit:1});}catch{throw new WorkspaceError('Invalid record selection.');}
   if(!result.records.length)throw new WorkspaceError('This record is no longer available.',404);
   const graph=dependencyGraph(state.dossier),label=key=>{const r=graph.index.get(key);return {id:key,group:r.group,title:r.title??r.text??r.description??key};};
   const prerequisites=[...graph.edges.get(input.id)].map(([key,reason])=>({...label(key),reason})),dependents=graph.reverse.get(input.id).map(label);
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed. Open the record again.',409);
   return {record:result.records[0],revision:state.dossier.revision,prerequisites:prerequisites.slice(0,100),dependents:dependents.slice(0,100),truncated:prerequisites.length>100||dependents.length>100};
  },
  history(input){
   exactObject(input,['ref']);const {dir,id}=open(input.ref),state=readCore(dir,id);
   const history=listHistory(dir,id);
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed. Open history again.',409);
   return {revision:state.dossier.revision,...history,events:state.dossier.events.slice(-100).reverse(),events_truncated:state.dossier.events.length>100};
  },
  compare(input){
   exactObject(input,['ref','before','after']);const {dir,id}=open(input.ref),state=readCore(dir,id);
   let result;try{result=compareRevisions(dir,id,input.before,input.after);}catch{throw new WorkspaceError('These revisions cannot be compared. Refresh history and choose readable, unambiguous revisions.',409);}
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed during comparison. Refresh history.',409);
   return {markdown:renderComparison(result)};
  },
  offerForm(input){
   exactObject(input,['ref','previous']);const {dir,id}=open(input.ref);
   requireActive(dir,id);
   if(input.previous!==null&&typeof input.previous!=='string')throw new WorkspaceError('Invalid previous draft.');
   const prior=input.previous===null?null:readBusinessBrief(dir,id,input.previous);
   if(prior&&(prior.request.kind!=='offer'||prior.successor_ids.length))throw new WorkspaceError('Select the latest offer version before editing.',409);
   const state=readCore(dir,id);
   const initial=startingFields(state.dossier);
   return {revision:state.dossier.revision,sha256:state.sha256,previous:input.previous,client:prior?.request.client??'',period:prior?.request.period??'',fields:offerKeys.map(key=>({key,label:briefTypes.offer.fields[key][1],value:prior?(prior.fields.find(f=>f.key===key)?.value??''):(initial[key]?.value??'')}))};
  },
  offerLatest(input){
   exactObject(input,['ref','previous']);const {dir,id}=open(input.ref),state=readCore(dir,id);requireActive(dir,id);
   if(input.previous!==null&&typeof input.previous!=='string')throw new WorkspaceError('Invalid previous draft.');
   let previous=input.previous;const visited=new Set();
   try{while(previous!==null){
    if(visited.has(previous)||visited.size>=100)throw Error('Invalid revision chain');visited.add(previous);
    const draft=readBusinessBrief(dir,id,previous);if(draft.request.kind!=='offer'||draft.successor_ids.length>1)throw Error('Ambiguous offer');
    if(!draft.successor_ids.length)break;previous=draft.successor_ids[0];
   }}catch{throw new WorkspaceError('The offer history cannot be followed safely. Open the project and inspect its saved drafts.',409);}
   const result=this.offerForm({ref:input.ref,previous});
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed. Compare again.',409);
   return result;
  },
  offerPreview(input){
   exactObject(input,['ref','previous','revision','sha256','client','period','reason','fields']);
   exactObject(input.fields,offerKeys);const {dir,id}=open(input.ref),state=readCore(dir,id);
   requireActive(dir,id);
   if(input.revision!==state.dossier.revision||input.sha256!==state.sha256)throw new WorkspaceError('The project changed. Reopen the offer before preparing a new preview.',409);
   if(input.previous!==null&&typeof input.previous!=='string')throw new WorkspaceError('Invalid previous draft.');
   const prior=input.previous===null?null:readBusinessBrief(dir,id,input.previous);
   const client=shortText(input.client,'Client/context')||null,period=shortText(input.period,'Period')||null,reason=shortText(input.reason,'Change reason');
   if(input.previous!==null&&!reason)throw new WorkspaceError('Explain why you are revising this offer.');
   const fields=offerKeys.map(key=>{
    const value=shortText(input.fields[key],briefTypes.offer.fields[key][1])||null,old=prior?.request.fields.find(f=>f.key===key);
    const initial=prior?null:startingFields(state.dossier)[key];
    return old&&old.value===value?structuredClone(old):{key,value,assertion:value===null?'unknown':'proposal',record_ids:initial&&initial.value===value?[initial.id]:[]};
   });
   let prepared;
   try{prepared=prepareBusinessBrief(dir,{project_id:id,expected_revision:state.dossier.revision,operation_id:operationId(),at:new Date().toISOString().slice(0,10),language:'en',kind:'offer',client,period,previous_artifact_id:input.previous,change_reason:input.previous===null?null:reason,fields});}
   catch{throw new WorkspaceError('This offer cannot be prepared. Check its context and latest version, then reopen it.',409);}
   const preview=holdPreview({kind:'offer',ref:input.ref,sha256:state.sha256,prepared});
   return {preview,markdown:prepared.document_markdown,revision:state.dossier.revision,expires_in_seconds:900};
  },
  offerSave(input){
   exactObject(input,['ref','preview','confirmed']);
   if(input.confirmed!==true)throw new WorkspaceError('Confirm saving the displayed preview first.');
   const entry=previews.get(input.preview);
   if(!entry||entry.kind!=='offer'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('The preview is missing or expired. Prepare it again.',409);
   const {dir,id}=open(input.ref);
   if(entry.receipt)return entry.receipt;
   requireActive(dir,id);
   if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('The project changed after preview. Reopen the offer and review a fresh preview.',409);
   // The browser cannot choose a filesystem destination. Retry material is retained
   // in a unique sibling folder using the same operation as the CLI.
   const retry=directory('retry-'+entry.prepared.update_request.operation_id);
   let receipt;try{receipt=saveGuided(dir,entry.prepared,retry);}catch{throw new WorkspaceError('Saving did not complete. Check the project and its retry folder before trying again.',409);}
   entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1,retry_folder:path.basename(receipt.retry_bundle)};
   return entry.receipt;
  },
  reportPreview(input){
   exactObject(input,['ref','sections']);const {dir,id}=open(input.ref);
   let report;try{report=reportPreview(dir,id,input.sections);}catch{throw new WorkspaceError('Cannot preview this selection. Choose valid sections and check for unreadable drafts.',409);}
   const preview=holdPreview({kind:'report',ref:input.ref,report});
   return {preview,markdown:report.markdown,revision:report.revision,sections:report.sections};
  },
  reportSave(input){
   exactObject(input,['ref','preview','confirmed']);
   if(input.confirmed!==true)throw new WorkspaceError('Confirm saving the displayed report first.');
   const entry=previews.get(input.preview);
   if(!entry||entry.kind!=='report'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('The report preview is missing or expired. Prepare it again.',409);
   const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;
   const filename='report-'+id+'-'+randomUUID()+'.md';
   try{const saved=writeReport(dir,id,entry.report.sections,entry.report.confirmation_sha256,directory(filename));entry.receipt={filename,path:saved.saved,sha256:saved.sha256,revision:saved.revision};}
   catch{throw new WorkspaceError('The report could not be saved. The project may have changed; prepare a fresh preview.',409);}
   return entry.receipt;
  },
  archive(input){
   exactObject(input,['ref','revision','sha256','archived','confirmed']);
   if(input.confirmed!==true||typeof input.archived!=='boolean')throw new WorkspaceError('Confirm the requested archive or restore action.');
   const {dir,id}=open(input.ref),state=readCore(dir,id);
   if(state.dossier.revision!==input.revision||state.sha256!==input.sha256)throw new WorkspaceError('The project changed. Refresh before archiving or restoring.',409);
   if(isProjectArchived(state.dossier)===input.archived)return {archived:input.archived,revision:state.dossier.revision};
   const prepared=prepareProjectArchive(dir,id,input.revision,input.archived);
   saveGuided(dir,prepared,directory('retry-'+prepared.update_request.operation_id));
   return {archived:input.archived,revision:input.revision+1};
  }
 };
}
