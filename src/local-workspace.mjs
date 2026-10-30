import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {safeDirectory,regularFile,readCore} from './store.mjs';
import {initializeProject} from './initialize.mjs';
import {workspaceView,saveGuided,operationId} from './workspace.mjs';
import {briefTypes,prepareBusinessBrief,readBusinessBrief} from './business-brief.mjs';

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
     projects.push({ref:register(entry.name,id),folder:entry.name,id:d.project_id,name:d.name,revision:d.revision,updated:fs.statSync(file).mtime.toISOString()});
    }catch{unavailable.push(entry.name);}
   }}finally{iterator.closeSync();}
   return {root,projects:projects.sort((a,b)=>b.updated.localeCompare(a.updated)),unavailable};
  },
  create(input){
   exactObject(input,['id','name','task','confirmed']);
   if(input.confirmed!==true)throw new WorkspaceError('Confirm project creation first.');
   if(typeof input.id!=='string'||! /^[a-z0-9][a-z0-9-]{0,63}$/.test(input.id))throw new WorkspaceError('Use lowercase letters, numbers and hyphens for the project ID (maximum 64).');
   for(const field of ['name','task'])if(typeof input[field]!=='string'||input[field].length>4000||(field==='name'&&!input[field].trim()))throw new WorkspaceError('Enter a project name and keep each field under 4001 characters.');
   const dir=directory(input.id);
   if(fs.existsSync(dir))throw new WorkspaceError('This folder already exists. Choose another ID or open the existing project.',409);
   initializeProject(dir,{project_id:input.id,name:input.name.trim(),first_task:input.task.trim()?{id:'first-task',title:input.task.trim()}:null});
   return {ref:register(input.id,input.id)};
  },
  show(ref){const {dir,id,folder}=open(ref);return {folder,...workspaceView(dir,id)};},
  offerForm(input){
   exactObject(input,['ref','previous']);const {dir,id}=open(input.ref);
   if(input.previous!==null&&typeof input.previous!=='string')throw new WorkspaceError('Invalid previous draft.');
   const prior=input.previous===null?null:readBusinessBrief(dir,id,input.previous);
   if(prior&&(prior.request.kind!=='offer'||prior.successor_ids.length))throw new WorkspaceError('Select the latest offer version before editing.',409);
   const state=readCore(dir,id);
   return {revision:state.dossier.revision,sha256:state.sha256,previous:input.previous,client:prior?.request.client??'',period:prior?.request.period??'',fields:offerKeys.map(key=>({key,label:briefTypes.offer.fields[key][1],value:prior?.fields.find(f=>f.key===key)?.value??''}))};
  },
  offerPreview(input){
   exactObject(input,['ref','previous','revision','sha256','client','period','reason','fields']);
   exactObject(input.fields,offerKeys);const {dir,id}=open(input.ref),state=readCore(dir,id);
   if(input.revision!==state.dossier.revision||input.sha256!==state.sha256)throw new WorkspaceError('The project changed. Reopen the offer before preparing a new preview.',409);
   if(input.previous!==null&&typeof input.previous!=='string')throw new WorkspaceError('Invalid previous draft.');
   const prior=input.previous===null?null:readBusinessBrief(dir,id,input.previous);
   const client=shortText(input.client,'Client/context')||null,period=shortText(input.period,'Period')||null,reason=shortText(input.reason,'Change reason');
   if(input.previous!==null&&!reason)throw new WorkspaceError('Explain why you are revising this offer.');
   const fields=offerKeys.map(key=>{
    const value=shortText(input.fields[key],briefTypes.offer.fields[key][1])||null,old=prior?.request.fields.find(f=>f.key===key);
    return old&&old.value===value?structuredClone(old):{key,value,assertion:value===null?'unknown':'proposal',record_ids:[]};
   });
   let prepared;
   try{prepared=prepareBusinessBrief(dir,{project_id:id,expected_revision:state.dossier.revision,operation_id:operationId(),at:new Date().toISOString().slice(0,10),language:'en',kind:'offer',client,period,previous_artifact_id:input.previous,change_reason:input.previous===null?null:reason,fields});}
   catch{throw new WorkspaceError('This offer cannot be prepared. Check its context and latest version, then reopen it.',409);}
   for(const [key,value]of previews)if(value.expires<Date.now())previews.delete(key);
   if(previews.size>=20)previews.delete(previews.keys().next().value);
   const preview=randomUUID();previews.set(preview,{ref:input.ref,sha256:state.sha256,prepared,expires:Date.now()+15*60*1000});
   return {preview,markdown:prepared.document_markdown,revision:state.dossier.revision,expires_in_seconds:900};
  },
  offerSave(input){
   exactObject(input,['ref','preview','confirmed']);
   if(input.confirmed!==true)throw new WorkspaceError('Confirm saving the displayed preview first.');
   const entry=previews.get(input.preview);
   if(!entry||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('The preview is missing or expired. Prepare it again.',409);
   const {dir,id}=open(input.ref);
   if(entry.receipt)return entry.receipt;
   if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('The project changed after preview. Reopen the offer and review a fresh preview.',409);
   // The browser cannot choose a filesystem destination. Retry material is retained
   // in a unique sibling folder using the same operation as the CLI.
   const retry=directory('retry-'+entry.prepared.update_request.operation_id);
   let receipt;try{receipt=saveGuided(dir,entry.prepared,retry);}catch{throw new WorkspaceError('Saving did not complete. Check the project and its retry folder before trying again.',409);}
   entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1,retry_folder:path.basename(receipt.retry_bundle)};
   return entry.receipt;
  }
 };
}
