import {randomUUID} from 'node:crypto';
import {readCore,regularFile,localFile,sha,bytesFor} from './store.mjs';
import {reportPreview,isProjectArchived} from './workspace.mjs';
import {externalSummary} from './external-summary.mjs';
import {readBusinessBrief,renderBusinessBrief} from './business-brief.mjs';
import {documentFieldDefinitions} from './business-fields.mjs';
import {checkModel} from './model.mjs';

const reportLabels={summary:'Suggested next action',tasks:'Open tasks',assumptions:'Assumptions',decisions:'Decisions',drafts:'Current drafts'};
function exact(value,keys){if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==keys.length||keys.some(k=>!Object.hasOwn(value,k)))throw Error('Invalid export preference fields');}
function selectionShape(selection){
 if(selection?.kind==='report'){exact(selection,['kind','sections']);if(!Array.isArray(selection.sections)||!selection.sections.length||new Set(selection.sections).size!==selection.sections.length||selection.sections.some(k=>!Object.hasOwn(reportLabels,k)))throw Error('Choose valid report sections');}
 else if(selection?.kind==='document'||selection?.kind==='summary'){
  exact(selection,selection.kind==='document'?['kind','artifact_id']:['kind','artifact_id','keys']);
  if(typeof selection.artifact_id!=='string'||!/^business-[a-f0-9]{32}$/.test(selection.artifact_id))throw Error('Choose a saved business document');
  if(selection.kind==='summary'&&(!Array.isArray(selection.keys)||!selection.keys.length||selection.keys.length>18||new Set(selection.keys).size!==selection.keys.length||selection.keys.some(k=>typeof k!=='string'||!Object.hasOwn(documentFieldDefinitions({kind:'offer'}),k)&&!/^custom_[a-z][a-z0-9_]{0,39}$/.test(k))))throw Error('Choose valid offer fields');
 }else throw Error('Choose report, summary or document');
 return structuredClone(selection);
}
export function exportContents(dir,id,input){
 const state=readCore(dir,id),selection=selectionShape(input);let fields,markdown,context;
 if(selection.kind==='report'){
  markdown=reportPreview(dir,id,selection.sections).markdown;fields=selection.sections.map(key=>({key,label:reportLabels[key]}));context=['Project name and ID','Project revision','Recorded review warnings'];
 }else{
  const draft=readBusinessBrief(dir,id,selection.artifact_id),definitions=documentFieldDefinitions(draft.request);
  markdown=selection.kind==='summary'?externalSummary(dir,id,selection.artifact_id,selection.keys).markdown:renderBusinessBrief(dir,id,selection.artifact_id);
  const keys=selection.kind==='summary'?selection.keys:Object.keys(definitions);fields=keys.map(key=>({key,label:definitions[key][1]}));
  context=selection.kind==='summary'?['Saved offer version and project revision','Assertion labels and applicable draft/basis warnings']:['Project name and ID','Client and period context','All saved document sections','Template origin and recorded basis when present','Historical, practice and review warnings when applicable'];
 }
 const result={revision:state.dossier.revision,sha256:state.sha256,selection,fields,context,source_sha256:sha(markdown),files:{included:[],excluded_count:state.dossier.artifacts.length,excluded:state.dossier.artifacts.slice(0,100).map(a=>({id:a.id,storage:a.storage,availability:a.availability})),truncated:state.dossier.artifacts.length>100,explanation:'No attached files or other project artifacts are bundled. Selected document text may mention files; those references do not include file contents. This list covers recorded project artifacts, not a scan of your computer.'},warning:'Preferences select content only. Review a fresh export every time; no permission to send or share is stored.'};
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed while inspecting export');return result;
}
function history(state){
 const events=state.dossier.events.filter(e=>e.type==='export-preference');if(events.length>200)throw Error('Export preference history exceeds 200 versions');
 const rows=[];
 for(const event of events){
  const artifact=state.dossier.artifacts.find(a=>a.id===event.subject_ids[0]);if(!artifact||artifact.storage!=='local'||artifact.availability!=='available')throw Error('Export preference unavailable');
  const bytes=regularFile(localFile(state.directory,artifact.location),32768);if(sha(bytes)!==artifact.sha256)throw Error('Export preference fingerprint mismatch');
  const row=JSON.parse(bytes);exact(row,['format','project_id','artifact_id','version','previous','selection']);selectionShape(row.selection);
  const previous=rows.filter(r=>r.selection.kind===row.selection.kind).at(-1);
  if(row.format!=='startkompas-export-preference-v1'||row.project_id!==state.dossier.project_id||row.artifact_id!==artifact.id||rows.some(r=>r.artifact_id===row.artifact_id)||row.version!==(previous?.version??0)+1||artifact.version!==String(row.version)||row.previous!==(previous?.artifact_id??null)||event.subject_ids.length!==(previous?2:1)||event.subject_ids[1]!==previous?.artifact_id)throw Error('Export preference history mismatch');
  rows.push(row);
 }return rows;
}
export function exportPreferences(dir,id){
 const state=readCore(dir,id),rows=history(state),preferences=['report','summary','document'].map(kind=>rows.filter(r=>r.selection.kind===kind).at(-1)).filter(Boolean).map(row=>{try{return {...row,available:true,contents:exportContents(dir,id,row.selection)};}catch{return {...row,available:false,reason:'Saved selection is unavailable or historical for this export type. Choose readable current content and save a revised preference.'};}});
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed');return {revision:state.dossier.revision,sha256:state.sha256,preferences,archived:isProjectArchived(state.dossier),warning:'Saved per-project selections are never automatically applied or treated as sharing permission.'};
}
export function prepareExportPreference(dir,id,revision,digest,input){
 const state=readCore(dir,id);if(state.dossier.revision!==revision||state.sha256!==digest)throw Error('Project changed; review export settings again');if(isProjectArchived(state.dossier))throw Error('Restore the project before changing export preferences');
 const contents=exportContents(dir,id,input),rows=history(state);if(rows.length>=200)throw Error('Export preference history limit reached');
 const previous=rows.filter(r=>r.selection.kind===contents.selection.kind).at(-1),artifact_id='export-preference-'+randomUUID(),version=(previous?.version??0)+1;
 const saved={format:'startkompas-export-preference-v1',project_id:id,artifact_id,version,previous:previous?.artifact_id??null,selection:contents.selection},content=bytesFor(saved).toString('utf8');
 const artifact={id:artifact_id,version:String(version),storage:'local',location:'files/'+artifact_id+'.json',availability:'available',sha256:sha(content)};
 const update_request={project_id:id,expected_revision:revision,operation_id:'export-preference-'+randomUUID(),changes:{artifacts:[...state.dossier.artifacts,artifact],events:[...state.dossier.events,{id:'export-preference-event-'+randomUUID(),type:'export-preference',at:new Date().toISOString().slice(0,10),description:'Export selection saved for explicit reuse; no sharing permission granted',subject_ids:[artifact_id,...(previous?[previous.artifact_id]:[])]}]}};
 checkModel({...state.dossier,...update_request.changes});if(readCore(dir,id).sha256!==digest)throw Error('Project changed');return {artifact_id,content,update_request,preview:{...saved,contents}};
}
