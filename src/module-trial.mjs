import {randomUUID} from 'node:crypto';
import {readCore,regularFile,localFile,sha,bytesFor} from './store.mjs';
import {checkModel} from './model.mjs';
import {previewModuleTrial,inspectModulePackage} from './module-package.mjs';
function current(dir,id,revision,digest){const s=readCore(dir,id);if(s.dossier.revision!==revision||s.sha256!==digest)throw Error('Project changed; prepare the module trial again');return s;}
export function moduleTrials(dir,id){
 const s=readCore(dir,id),events=s.dossier.events.filter(e=>e.type==='module-trial-saved');
 if(events.length>200)throw Error('Module trial history exceeds 200 entries');
 const trials=events.map(e=>{
 const a=s.dossier.artifacts.find(a=>a.id===e.subject_ids[0]);if(!a||a.storage!=='local'||a.availability!=='available')throw Error('Module trial artifact unavailable');
 const bytes=regularFile(localFile(s.directory,a.location),2097152);if(sha(bytes)!==a.sha256)throw Error('Module trial fingerprint mismatch');
 const v=JSON.parse(bytes);if(v.format!=='startkompas-module-trial-record-v1'||v.project_id!==id||v.artifact_id!==a.id||v.preview?.project_id!==id)throw Error('Module trial identity mismatch');
 const inspection=inspectModulePackage(v.preview.module.module,v.preview.module.project_schema,v.preview.module.assessed_on);
 if(inspection.sha256!==v.preview.module.sha256)throw Error('Saved module fingerprint mismatch');
 return {...v,discarded:s.dossier.events.some(x=>x.type==='module-trial-discarded'&&x.subject_ids[0]===a.id)};
 });
 if(new Set(trials.map(t=>t.artifact_id)).size!==trials.length)throw Error('Duplicate module trial history');
 if(readCore(dir,id).sha256!==s.sha256)throw Error('Project changed while reading trials');
 return {revision:s.dossier.revision,sha256:s.sha256,trials};
}
export function prepareModuleTrial(dir,request){
 const preview=previewModuleTrial(dir,request),s=current(dir,request.project_id,request.expected_revision,request.expected_sha256);
 if(moduleTrials(dir,request.project_id).trials.length>=200)throw Error('Module trial history limit reached');
 const artifact_id='module-trial-'+randomUUID(),record={format:'startkompas-module-trial-record-v1',project_id:request.project_id,artifact_id,preview},content=bytesFor(record).toString('utf8');
 if(Buffer.byteLength(content)>2097152)throw Error('Module trial record exceeds 2 MiB');
 const artifact={id:artifact_id,version:'1',storage:'local',location:'files/'+artifact_id+'.json',availability:'available',sha256:sha(content)};
 const update_request={project_id:request.project_id,expected_revision:request.expected_revision,operation_id:'module-trial-save-'+randomUUID(),changes:{artifacts:[...s.dossier.artifacts,artifact],events:[...s.dossier.events,{id:'module-trial-event-'+randomUUID(),type:'module-trial-saved',at:new Date().toISOString(),description:'Synthetic module trial retained; no live module activated',subject_ids:[artifact_id]}]}};
 checkModel({...s.dossier,...update_request.changes});current(dir,request.project_id,request.expected_revision,request.expected_sha256);
 return {artifact_id,content,update_request,preview,save_effect:'Retain the exact trial as a private artifact. Existing documents, tasks, checks and facts are unchanged.'};
}
export function prepareTrialDiscard(dir,request){
 const keys=['project_id','expected_revision','expected_sha256','artifact_id','reason'];
 if(!request||Object.keys(request).length!==keys.length||keys.some(k=>!Object.hasOwn(request,k))||typeof request.reason!=='string'||!request.reason.trim()||request.reason.length>2000)throw Error('Invalid module trial discard request');
 const s=current(dir,request.project_id,request.expected_revision,request.expected_sha256),trial=moduleTrials(dir,request.project_id).trials.find(t=>t.artifact_id===request.artifact_id);
 if(!trial||trial.discarded)throw Error('Choose a retained, non-discarded module trial');
 const update_request={project_id:request.project_id,expected_revision:request.expected_revision,operation_id:'module-trial-discard-'+randomUUID(),changes:{events:[...s.dossier.events,{id:'module-trial-event-'+randomUUID(),type:'module-trial-discarded',at:new Date().toISOString(),description:request.reason.trim(),subject_ids:[request.artifact_id]}]}};
 checkModel({...s.dossier,...update_request.changes});current(dir,request.project_id,request.expected_revision,request.expected_sha256);
 return {update_request,preview:{artifact_id:request.artifact_id,discarded:true,reason:request.reason.trim(),effect:'Exclude this trial from active consideration; retain original package, preview and history. No existing project data is deleted.'}};
}
