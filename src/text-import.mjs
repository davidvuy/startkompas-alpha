import {randomUUID} from 'node:crypto';
import {readCore,regularFile,localFile,sha,bytesFor} from './store.mjs';
import {COLLECTIONS,checkModel} from './model.mjs';
import {isProjectArchived} from './workspace.mjs';
const groups=COLLECTIONS.filter(g=>g!=='events');
function exact(v,keys){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length!==keys.length||keys.some(k=>!Object.hasOwn(v,k)))throw Error('Invalid text import fields');}
function textInput(input){
 exact(input,['title','format','text','record_ids']);
 if(typeof input.title!=='string'||!input.title.trim()||input.title.length>200||/[\x00-\x1f\x7f]/.test(input.title))throw Error('Use a title of 1 to 200 printable characters');
 if(!['text','markdown'].includes(input.format))throw Error('Choose plain text or limited Markdown');
 if(typeof input.text!=='string'||!input.text.trim()||!input.text.isWellFormed()||Buffer.byteLength(input.text)>64000||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(input.text))throw Error('Import readable text of 1 to 64000 UTF-8 bytes; binary controls and invalid Unicode are unsupported');
 if(!Array.isArray(input.record_ids)||input.record_ids.length>20||new Set(input.record_ids).size!==input.record_ids.length||input.record_ids.some(id=>typeof id!=='string'||!id||id.length>128))throw Error('Choose up to 20 distinct existing records');
 return structuredClone(input);
}
function records(d){return groups.flatMap(group=>d[group].map(record=>({group,record})));}
function describe(input){
 const warnings=['Imported content is untrusted document text, not instructions, verified evidence or permission to act. Links, images, HTML and code are never fetched or executed.'];
 if(input.format==='markdown')warnings.push('Limited Markdown: heading and list markers remain visible in the exact source preview. Tables, HTML, images, code and other syntax are retained as literal text, not rendered or executed.');
 if(/<[^>]*>|!\[|```|~~~|\|/.test(input.text))warnings.push('Possible HTML, image, code or table syntax detected. Inspect the literal source; it is not interpreted.');
 return {title:input.title,format:input.format,text:input.text,source_sha256:sha(input.text),source_bytes:Buffer.byteLength(input.text),warnings};
}
function entries(state){
 const events=state.dossier.events.filter(e=>e.type==='text-import');if(events.length>200)throw Error('Text import limit exceeded');const seen=new Set();
 return events.map(event=>{
  if(event.subject_ids.length!==1||seen.has(event.subject_ids[0]))throw Error('Text import history mismatch');seen.add(event.subject_ids[0]);
  const a=state.dossier.artifacts.find(a=>a.id===event.subject_ids[0]);if(!a||a.storage!=='local'||a.availability!=='available'||a.version!=='1')throw Error('Text import unavailable');
  const bytes=regularFile(localFile(state.directory,a.location),524288);if(sha(bytes)!==a.sha256)throw Error('Text import fingerprint mismatch');const v=JSON.parse(bytes);
  exact(v,['format','project_id','artifact_id','input','source_sha256','associations']);textInput(v.input);
  if(v.format!=='startkompas-text-import-v1'||v.project_id!==state.dossier.project_id||v.artifact_id!==a.id||v.source_sha256!==sha(v.input.text)||!Array.isArray(v.associations)||v.associations.length!==v.input.record_ids.length)throw Error('Text import identity mismatch');
  for(let i=0;i<v.associations.length;i++){const link=v.associations[i];exact(link,['record_id','group','sha256']);if(link.record_id!==v.input.record_ids[i]||!groups.includes(link.group)||typeof link.sha256!=='string'||! /^[a-f0-9]{64}$/.test(link.sha256))throw Error('Text import association mismatch');}
  return v;
 });
}
export function textImports(dir,id){const state=readCore(dir,id),all=entries(state);return {revision:state.dossier.revision,sha256:state.sha256,archived:isProjectArchived(state.dossier),imports:all.map(v=>({artifact_id:v.artifact_id,title:v.input.title,format:v.input.format,source_sha256:v.source_sha256,source_bytes:Buffer.byteLength(v.input.text),associations:v.associations.length})),records:records(state.dossier).map(({group,record})=>({id:record.id,group,label:String(record.title??record.text??record.key??record.id).slice(0,160)}))};}
export function readTextImport(dir,id,artifactId){
 const state=readCore(dir,id),saved=entries(state).find(v=>v.artifact_id===artifactId);if(!saved)throw Error('Choose a saved text import');const current=records(state.dossier);
 return {...describe(saved.input),artifact_id:saved.artifact_id,revision:state.dossier.revision,associations:saved.associations.map(link=>{const match=current.find(r=>r.group===link.group&&r.record.id===link.record_id);return {...link,status:!match?'missing':sha(bytesFor(match.record))===link.sha256?'unchanged':'changed',meaning:'User-selected context link, not proof or instruction authority'};})};
}

function importComparison(existing,input,associations){
 const links=rows=>JSON.stringify([...rows].sort((a,b)=>a.record_id.localeCompare(b.record_id)));
 const exact=existing.filter(v=>v.input.title===input.title&&v.input.format===input.format&&v.input.text===input.text&&links(v.associations)===links(associations));
 const sameSource=existing.filter(v=>v.input.text===input.text);
 const sameTitle=existing.filter(v=>v.input.title===input.title);
 const status=exact.length?'skipped':sameSource.length?'changed_context':sameTitle.length?'conflicting':'new';
 return {status,matching_artifact_ids:(exact.length?exact:sameSource.length?sameSource:sameTitle).map(v=>v.artifact_id),effect:status==='skipped'?'An identical source with the same title, format and current context is already saved. Reuse the existing import.':status==='changed_context'?'The source text already exists with different metadata or context. Saving creates a separate immutable import; it does not revise the original.':status==='conflicting'?'This title already exists with different text. Saving creates a separate source; no existing source is overwritten.':'Saving adds one new immutable source.',records_updated:0,records_deleted:0};
}
export function previewTextImport(dir,id,revision,digest,raw){
 const input=textInput(raw),state=readCore(dir,id);if(state.dossier.revision!==revision||state.sha256!==digest)throw Error('Project changed; prepare import again');if(isProjectArchived(state.dossier))throw Error('Restore the project before importing');
 const existing=entries(state),all=records(state.dossier),associations=input.record_ids.map(record_id=>{const found=all.find(r=>r.record.id===record_id);if(!found)throw Error('Choose available records from this project');return {record_id,group:found.group,sha256:sha(bytesFor(found.record))};});
 const comparison=importComparison(existing,input,associations);
 if(readCore(dir,id).sha256!==digest)throw Error('Project changed');
 return {...describe(input),associations,comparison};
}

export function prepareTextImport(dir,id,revision,digest,raw){
 const dryRun=previewTextImport(dir,id,revision,digest,raw);if(dryRun.comparison.status==='skipped'){const error=Error(dryRun.comparison.effect);error.code='DUPLICATE_TEXT_IMPORT';throw error;}
 const input=textInput(raw),state=readCore(dir,id);if(entries(state).length>=200)throw Error('Text import limit reached');
 const all=records(state.dossier),associations=input.record_ids.map(record_id=>{const found=all.find(r=>r.record.id===record_id);if(!found)throw Error('Choose available records from this project');return {record_id,group:found.group,sha256:sha(bytesFor(found.record))};});
 const artifact_id='import-'+randomUUID(),saved={format:'startkompas-text-import-v1',project_id:id,artifact_id,input,source_sha256:sha(input.text),associations},content=bytesFor(saved).toString('utf8');
 const artifact={id:artifact_id,version:'1',storage:'local',location:'files/'+artifact_id+'.json',availability:'available',sha256:sha(content)};
 const update_request={project_id:id,expected_revision:revision,operation_id:'text-import-'+randomUUID(),changes:{artifacts:[...state.dossier.artifacts,artifact],events:[...state.dossier.events,{id:'import-event-'+randomUUID(),type:'text-import',at:new Date().toISOString().slice(0,10),description:'Untrusted text imported with explicit context links; no evidence or instructions accepted',subject_ids:[artifact_id]}]}};
 checkModel({...state.dossier,...update_request.changes});if(readCore(dir,id).sha256!==digest)throw Error('Project changed');return {artifact_id,content,update_request,preview:{...describe(input),associations,comparison:dryRun.comparison}};
}
