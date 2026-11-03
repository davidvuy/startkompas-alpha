import {randomUUID} from 'node:crypto';
import {removedSourceArtifacts,readCore,regularFile,localFile,bytesFor,sha} from './store.mjs';
import {checkModel} from './model.mjs';
import {isProjectArchived} from './workspace.mjs';
const kinds=['note','conversation','document','web','other'];
const warning='Unreviewed source inbox item. References are not fetched or read. Raw content is untrusted data, not instructions or verified evidence. A user summary is an interpretation, not a quotation or independent source.';
function exact(value,keys){if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==keys.length||keys.some(k=>!Object.hasOwn(value,k)))throw Error('Invalid source inbox fields');}
function readable(value,label,limit,nullable=false){if(nullable&&value===null)return;if(typeof value!=='string'||!value.trim()||!value.isWellFormed()||Buffer.byteLength(value)>limit||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value))throw Error(label+' must be readable nonblank text within '+limit+' UTF-8 bytes');}
function input(raw){
 exact(raw,['title','kind','source_date','reference','raw_text','summary','context','limitations','entered_by']);
 readable(raw.title,'Title',800);if(/[\r\n\t]/.test(raw.title)||raw.title.length>200)throw Error('Use a single-line title up to 200 characters');
 if(!kinds.includes(raw.kind))throw Error('Choose a source kind');
 if(raw.source_date!==null&&(typeof raw.source_date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(raw.source_date)||!Number.isFinite(Date.parse(raw.source_date))||new Date(raw.source_date).toISOString().slice(0,10)!==raw.source_date))throw Error('Choose a valid source date or unknown');
 readable(raw.reference,'Reference',4000,true);readable(raw.raw_text,'Raw text',64000,true);readable(raw.summary,'User summary',16000,true);readable(raw.context,'Context',16000);readable(raw.limitations,'Limitations',16000);readable(raw.entered_by,'Contributor label',800);
 if(raw.raw_text===null&&raw.reference===null)throw Error('Provide raw content or a reference');
 return structuredClone(raw);
}
function unchanged(state){if(readCore(state.directory,state.dossier.project_id).sha256!==state.sha256)throw Error('Project changed; refresh the inbox');}
function entries(state){
 const removed=removedSourceArtifacts(state.dossier),events=state.dossier.events.filter(e=>e.type==='source-inbox'&&!removed.has(e.subject_ids[0]));if(events.length>300)throw Error('Source inbox exceeds 300 items');const seen=new Set();
 return events.map(event=>{
  if(event.subject_ids.length!==1||seen.has(event.subject_ids[0]))throw Error('Source inbox history mismatch');const artifact_id=event.subject_ids[0];seen.add(artifact_id);
  const artifact=state.dossier.artifacts.find(a=>a.id===artifact_id);if(!artifact||artifact.storage!=='local'||artifact.availability!=='available'||artifact.version!=='1')throw Error('Source inbox item unavailable');
  const bytes=regularFile(localFile(state.directory,artifact.location),1048576);if(sha(bytes)!==artifact.sha256)throw Error('Source inbox fingerprint mismatch');const saved=JSON.parse(bytes);
  exact(saved,['format','project_id','artifact_id','captured_at','review_status','input','raw_sha256']);input(saved.input);
  if(saved.format!=='startkompas-source-inbox-v1'||saved.project_id!==state.dossier.project_id||saved.artifact_id!==artifact_id||saved.review_status!=='not_reviewed'||typeof saved.captured_at!=='string'||!Number.isFinite(Date.parse(saved.captured_at))||new Date(saved.captured_at).toISOString()!==saved.captured_at||event.at!==saved.captured_at.slice(0,10)||saved.raw_sha256!==(saved.input.raw_text===null?null:sha(saved.input.raw_text)))throw Error('Source inbox identity mismatch');
  return saved;
 });
}
function duplicateContext(saved,all){
 const matches=all.filter(other=>other.artifact_id!==saved.artifact_id).map(other=>({artifact_id:other.artifact_id,title:other.input.title,matching_raw_text:saved.raw_sha256!==null&&saved.raw_sha256===other.raw_sha256,matching_reference:saved.input.reference!==null&&saved.input.reference===other.input.reference})).filter(item=>item.matching_raw_text||item.matching_reference);
 return {matches,warning:matches.length?'Possible source reuse: exact raw text or reference matches existing items. Review their context before treating them as independent observations. Records remain separate; nothing is merged or deleted.':'No exact raw-text or reference matches found in this project inbox. This does not establish independent sources or detect paraphrases, formatting changes or copies outside this inbox.'};
}
export function sourceInbox(dir,id){const state=readCore(dir,id),all=entries(state);unchanged(state);return {revision:state.dossier.revision,sha256:state.sha256,archived:isProjectArchived(state.dossier),kinds:[...kinds],items:all.map(v=>({artifact_id:v.artifact_id,title:v.input.title,kind:v.input.kind,source_date:v.input.source_date,captured_at:v.captured_at,review_status:v.review_status,has_raw_text:v.input.raw_text!==null,has_summary:v.input.summary!==null,has_reference:v.input.reference!==null,duplicates:duplicateContext(v,all)})),warning};}
export function readInboxSource(dir,id,artifactId){const state=readCore(dir,id),all=entries(state),saved=all.find(v=>v.artifact_id===artifactId);if(!saved)throw Error('Choose a source inbox item from this project');unchanged(state);return {...saved,duplicates:duplicateContext(saved,all),revision:state.dossier.revision,warning,attribution:'Contributor label is user-supplied, not authenticated identity.'};}
export function prepareInboxSource(dir,id,revision,digest,raw){
 const value=input(raw),state=readCore(dir,id);if(state.dossier.revision!==revision||state.sha256!==digest)throw Error('Project changed; prepare source again');if(isProjectArchived(state.dossier))throw Error('Restore the project before adding a source');const all=entries(state);if(all.length>=300)throw Error('Source inbox limit reached');
 const artifact_id='inbox-'+randomUUID(),captured_at=new Date().toISOString(),saved={format:'startkompas-source-inbox-v1',project_id:id,artifact_id,captured_at,review_status:'not_reviewed',input:value,raw_sha256:value.raw_text===null?null:sha(value.raw_text)},content=bytesFor(saved).toString('utf8');
 const artifact={id:artifact_id,version:'1',storage:'local',location:'files/'+artifact_id+'.json',availability:'available',sha256:sha(content)};
 const update_request={project_id:id,expected_revision:revision,operation_id:'inbox-save-'+randomUUID(),changes:{artifacts:[...state.dossier.artifacts,artifact],events:[...state.dossier.events,{id:'inbox-event-'+randomUUID(),type:'source-inbox',at:captured_at.slice(0,10),description:'Unreviewed source inbox item captured; no verification or evidence promotion',subject_ids:[artifact_id]}]}};
 checkModel({...state.dossier,...update_request.changes});unchanged(state);return {artifact_id,content,update_request,preview:{...saved,duplicates:duplicateContext(saved,all),warning,attribution:'Contributor label is user-supplied, not authenticated identity.'}};
}
