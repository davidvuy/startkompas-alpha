import {randomUUID} from 'node:crypto';
import {readCore,regularFile,localFile,bytesFor,sha} from './store.mjs';
import {readBusinessBrief,briefTypes} from './business-brief.mjs';
import {workspaceView} from './workspace.mjs';
import {checkModel} from './model.mjs';

const questions={segment:'What is your role in the work you are describing, and who else is involved?',job:'Tell me about the most recent time you worked on this. What triggered it?',outcome:'What result mattered in that situation? How did you know whether it was achieved?',delivery:'Walk me through what happened, from the first step to the last. Who did what?',exclusions:'What fell outside that work, and how was it handled?',workaround:'What did you actually use or do? What worked well and what did not?',support:'Which specific experiences support your account, and when was your experience different?',next_check:'What remains unclear from this example, and what could we examine next?'};
const blank={date:null,participant_code:null,consent_notes:null,direct_statements:[],observations:[],interpretations:[],open_questions:[]};
function readNote(state,id){
 const a=state.dossier.artifacts.find(a=>a.id===id);if(!a||a.storage!=='local'||a.availability!=='available')throw Error('Interview preparation unavailable');
 const b=regularFile(localFile(state.directory,a.location),65536);if(sha(b)!==a.sha256)throw Error('Interview preparation changed');
 const v=JSON.parse(b);if(v.format!=='startkompas-interview-preparation-v1'||v.project_id!==state.dossier.project_id||v.artifact_id!==id||!['guide','blank_log'].includes(v.kind)||typeof v.basis_id!=='string'||typeof v.markdown!=='string')throw Error('Invalid interview preparation');return v;
}
function offer(state,id){const draft=readBusinessBrief(state.directory,state.dossier.project_id,id);if(draft.request.kind!=='offer'||draft.successor_ids.length)throw Error('Choose a current offer');return draft;}
export function interviewPreparation(dir,id){
 const state=readCore(dir,id),view=workspaceView(dir,id);
 const candidates=state.dossier.events.filter(e=>e.type==='interview-preparation').slice(-100).reverse();
 const saved=candidates.map(e=>{try{const note=readNote(state,e.subject_ids[0]);let requires_review=state.dossier.workflow.invalidated_ids.includes(note.artifact_id);if(note.kind==='guide'){try{requires_review ||= offer(state,note.basis_id).requires_review;}catch{requires_review=true;}}return {id:note.artifact_id,kind:note.kind,basis_id:note.basis_id,markdown:note.markdown,unavailable:false,requires_review};}catch{return {id:e.subject_ids[0],unavailable:true};}});
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed');
 return {revision:state.dossier.revision,sha256:state.sha256,archived:view.archived,offers:view.drafts.filter(d=>d.kind==='offer'&&!d.historical),saved,partial:state.dossier.events.filter(e=>e.type==='interview-preparation').length>100};
}
export function prepareInterview(dir,id,revision,digest,kind,basis){
 if(!['guide','blank_log'].includes(kind)||typeof basis!=='string')throw Error('Invalid interview selection');
 const state=readCore(dir,id),d=state.dossier;if(d.revision!==revision||state.sha256!==digest)throw Error('Project changed');
 let rows=[],markdown;
 if(kind==='guide'){
  const draft=offer(state,basis);
  rows=Object.keys(questions).map(key=>{const field=draft.fields.find(f=>f.key===key);return {field:key,status:field?.value==null?'unknown':field.assertion,question:questions[key]};});
  rows.sort((a,b)=>Number(b.status==='unknown')-Number(a.status==='unknown'));
  markdown=['# Interview preparation — no interview conducted','Offer: '+basis+' · version '+draft.version,draft.requires_review?'Source offer requires review; inspect its basis before use.':'All offer statements remain unverified.', 'Questions use fixed neutral patterns for offer fields; they do not infer a participant or repeat offer claims as facts. Unknown fields come first.','Ask about a concrete recent experience. Allow no problem, no change or a contrary answer. Do not pitch the proposed solution.','Opening question: Choose a recent work situation you can describe. What were you trying to do? Use that situation for the follow-up questions below.',...rows.map(r=>'\n## '+briefTypes.offer.fields[r.field][1]+' — '+r.status+'\n'+r.question)].join('\n\n');
 }else{
  const guide=readNote(state,basis);if(guide.kind!=='guide')throw Error('Choose a saved guide');
  const source=offer(state,guide.basis_id);if(source.requires_review||d.workflow.invalidated_ids.includes(basis))throw Error('Review changed context and prepare a fresh guide before creating a log');
  markdown=['# Blank interview log — no interview conducted','Prepared guide: '+basis,'Date: Not recorded','Participant code: Not recorded','Consent notes: Not recorded','## Direct statements\nNone recorded.','## Observations\nNone recorded.','## Interpretations\nNone recorded.','## Open questions\nNone recorded.','Preparation is not evidence. Record actual statements separately from interpretation; do not invent participation.'].join('\n\n');
 }
 if(d.events.some(e=>e.type==='practice-project'))markdown='FICTIONAL PRACTICE — not customer evidence.\n\n'+markdown;
 const artifactId='interview-'+randomUUID(),saved={format:'startkompas-interview-preparation-v1',project_id:id,artifact_id:artifactId,kind,basis_id:basis,questions:kind==='guide'?rows:[],log:kind==='blank_log'?structuredClone(blank):null,markdown};
 const content=bytesFor(saved).toString('utf8'),artifact={id:artifactId,version:'1',storage:'local',location:'files/'+artifactId+'.json',availability:'available',sha256:sha(content)};
 const update_request={project_id:id,expected_revision:revision,operation_id:'interview-save-'+randomUUID(),changes:{artifacts:[...d.artifacts,artifact],events:[...d.events,{id:'interview-event-'+randomUUID(),type:'interview-preparation',at:new Date().toISOString().slice(0,10),description:kind==='guide'?'Prepared neutral interview questions; no interview conducted':'Created a separate empty interview log; no observations recorded',subject_ids:[artifactId,basis]}],workflow:{...d.workflow,links:[...d.workflow.links,{dependent_id:artifactId,prerequisite_id:basis,reason:'Interview preparation uses this original context; not evidence'}]}}};
 checkModel({...d,...update_request.changes});return {artifact_id:artifactId,content,markdown,update_request};
}
