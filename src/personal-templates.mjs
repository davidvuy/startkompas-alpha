import {randomUUID} from 'node:crypto';
import {readCore,regularFile,localFile,sha,bytesFor} from './store.mjs';
import {validateTemplate,assertTemplateCompatibility} from './template-format.mjs';
import {checkModel} from './model.mjs';
import {prepareTemplateDraft} from './template-draft.mjs';

function current(dir,id,revision,digest){const s=readCore(dir,id);if(s.dossier.revision!==revision||s.sha256!==digest)throw Error('Project changed; review templates again');return s;}
function load(s,id){
 const a=s.dossier.artifacts.find(a=>a.id===id),event=s.dossier.events.find(e=>e.type==='personal-template'&&e.subject_ids[0]===id);
 if(!a||!event||a.storage!=='local'||a.availability!=='available')throw Error('Personal template unavailable');
 const bytes=regularFile(localFile(s.directory,a.location),131072);if(sha(bytes)!==a.sha256)throw Error('Personal template fingerprint mismatch');
 const v=JSON.parse(bytes),keys=['format','project_id','artifact_id','previous','template','sha256'];
 if(!v||Object.keys(v).length!==keys.length||keys.some(k=>!Object.hasOwn(v,k))||v.format!=='startkompas-personal-template-v1'||v.project_id!==s.dossier.project_id||v.artifact_id!==id||v.previous!==(event.subject_ids[1]??null))throw Error('Personal template identity mismatch');
 const checked=validateTemplate(v.template);if(checked.sha256!==v.sha256||a.version!==String(v.template.version))throw Error('Personal template version mismatch');return v;
}
function all(s){const events=s.dossier.events.filter(e=>e.type==='personal-template');if(events.length>200)throw Error('Personal template history exceeds 200 versions');const rows=events.map(e=>load(s,e.subject_ids[0]));if(new Set(rows.map(r=>r.artifact_id)).size!==rows.length)throw Error('Duplicate personal template history');
 for(const r of rows){const previous=rows.find(p=>p.artifact_id===r.previous);if(r.previous===null){if(r.template.version!==1||rows.some(x=>x!==r&&x.previous===null&&x.template.id===r.template.id))throw Error('Personal template root mismatch');}else if(!previous||previous.template.id!==r.template.id||previous.template.version+1!==r.template.version||previous.template.document_kind!==r.template.document_kind||rows.filter(x=>x.previous===r.previous).length!==1)throw Error('Personal template history mismatch');}return rows;
}
export function personalTemplates(dir,id){const s=readCore(dir,id),rows=all(s);if(readCore(dir,id).sha256!==s.sha256)throw Error('Project changed');return {revision:s.dossier.revision,sha256:s.sha256,templates:rows.map(r=>({...r,historical:rows.some(n=>n.previous===r.artifact_id)}))};}
export function preparePersonalTemplate(dir,id,revision,digest,input){
 if(!input||Object.keys(input).length!==2||!Object.hasOwn(input,'previous')||!Object.hasOwn(input,'template'))throw Error('Choose a template and its previous version or null');
 const s=current(dir,id,revision,digest),rows=all(s),checked=validateTemplate(input.template),t=checked.template,previous=input.previous===null?null:rows.find(r=>r.artifact_id===input.previous);
 assertTemplateCompatibility(t,s.dossier.schema_version);
 if(rows.length>=200)throw Error('Personal template history limit reached');
 if(input.previous!==null&&(!previous||rows.some(r=>r.previous===input.previous)))throw Error('Choose the latest personal template version');
 if(previous?(t.id!==previous.template.id||t.document_kind!==previous.template.document_kind||t.version!==previous.template.version+1):(t.version!==1||rows.some(r=>r.template.id===t.id)))throw Error('Use a new ID at version 1 or the next version of the selected template');
 const artifact_id='template-'+randomUUID(),saved={format:'startkompas-personal-template-v1',project_id:id,artifact_id,previous:input.previous,...checked},content=bytesFor(saved).toString('utf8');
 const artifact={id:artifact_id,version:String(t.version),storage:'local',location:'files/'+artifact_id+'.json',availability:'available',sha256:sha(content)};
 const update_request={project_id:id,expected_revision:revision,operation_id:'template-save-'+randomUUID(),changes:{artifacts:[...s.dossier.artifacts,artifact],events:[...s.dossier.events,{id:'template-event-'+randomUUID(),type:'personal-template',at:new Date().toISOString().slice(0,10),description:'Personal worksheet version saved; existing documents unchanged',subject_ids:[artifact_id,...(previous?[previous.artifact_id]:[])]}]}};
 checkModel({...s.dossier,...update_request.changes});current(dir,id,revision,digest);return {artifact_id,content,update_request,preview:saved};
}
export function preparePersonalDraft(dir,id,revision,digest,input){
 const keys=['artifact_id','template_sha256','answers','client','period'];if(!input||Object.keys(input).length!==keys.length||keys.some(k=>!Object.hasOwn(input,k)))throw Error('Invalid personal template selection');
 const s=current(dir,id,revision,digest),selected=all(s).find(r=>r.artifact_id===input.artifact_id);if(!selected||selected.sha256!==input.template_sha256)throw Error('Personal template selection changed');
 // A historical version may be deliberately reused; the exact selected snapshot is retained.
 return prepareTemplateDraft(dir,{project_id:id,expected_revision:revision,expected_sha256:digest,template:selected.template,answers:input.answers,client:input.client,period:input.period});
}
