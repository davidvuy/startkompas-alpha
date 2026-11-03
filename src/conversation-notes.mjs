import {randomUUID} from 'node:crypto';
import {removedSourceArtifacts,readCore,regularFile,localFile,bytesFor,sha} from './store.mjs';
import {checkModel} from './model.mjs';
import {isProjectArchived} from './workspace.mjs';
import {readInboxSource} from './source-inbox.mjs';
const warning='Unreviewed conversation note. Quotations are supplied by the contributor, not independently verified transcriptions. Interpretations and follow-up questions are not participant quotations or independent evidence. Participant codes do not establish identity or consent.';
function exact(value,keys){if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==keys.length||keys.some(k=>!Object.hasOwn(value,k)))throw Error('Invalid conversation note fields');}
function readable(value,label,limit,nullable=false){if(nullable&&value===null)return;if(typeof value!=='string'||!value.trim()||!value.isWellFormed()||Buffer.byteLength(value)>limit||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value))throw Error(label+' must be readable nonblank text within '+limit+' UTF-8 bytes');}
function input(raw){
 exact(raw,['title','conversation_date','participant_codes','source_id','context','limitations','entered_by','statements']);
 readable(raw.title,'Title',800);if(/[\r\n\t]/.test(raw.title)||raw.title.length>200)throw Error('Use a single-line title up to 200 characters');
 if(raw.conversation_date!==null&&(typeof raw.conversation_date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(raw.conversation_date)||!Number.isFinite(Date.parse(raw.conversation_date))||new Date(raw.conversation_date).toISOString().slice(0,10)!==raw.conversation_date))throw Error('Choose a valid conversation date or unknown');
 if(!Array.isArray(raw.participant_codes)||!raw.participant_codes.length||raw.participant_codes.length>30||new Set(raw.participant_codes).size!==raw.participant_codes.length||raw.participant_codes.some(c=>typeof c!=='string'||!/^P[0-9]{2,4}$/.test(c)))throw Error('Use 1 to 30 unique participant codes such as P01');
 if(raw.source_id!==null&&(typeof raw.source_id!=='string'||!/^inbox-[a-f0-9-]{36}$/.test(raw.source_id)))throw Error('Choose a saved inbox source or none');
 readable(raw.context,'Context',16000);readable(raw.limitations,'Limitations',16000);readable(raw.entered_by,'Contributor label',800);
 if(!Array.isArray(raw.statements)||!raw.statements.length||raw.statements.length>100)throw Error('Provide 1 to 100 statement blocks');
 for(const row of raw.statements){exact(row,['participant_code','quotation','interpretation','follow_up']);if(!raw.participant_codes.includes(row.participant_code))throw Error('Statement participant must be listed');for(const key of ['quotation','interpretation','follow_up'])readable(row[key],key,8000,true);if(row.quotation===null&&row.interpretation===null&&row.follow_up===null)throw Error('Provide a quotation, interpretation or follow-up question');}
 if(Buffer.byteLength(JSON.stringify(raw))>200000)throw Error('Conversation note exceeds 200000 UTF-8 JSON bytes');
 return structuredClone(raw);
}
function sourceLink(state,sourceId){
 if(sourceId===null)return null;const source=readInboxSource(state.directory,state.dossier.project_id,sourceId),artifact=state.dossier.artifacts.find(a=>a.id===sourceId);
 return {artifact_id:sourceId,artifact_sha256:artifact.sha256,raw_sha256:source.raw_sha256,meaning:'Context reference only; quotations are manually supplied and are not verified against this source.'};
}
function unchanged(state){if(readCore(state.directory,state.dossier.project_id).sha256!==state.sha256)throw Error('Project changed; refresh conversation notes');}
function entries(state){
 const removed=removedSourceArtifacts(state.dossier),events=state.dossier.events.filter(e=>e.type==='conversation-note'&&!removed.has(e.subject_ids[0]));if(events.length>300)throw Error('Conversation notes exceeds 300 items');const seen=new Set();
 return events.map(event=>{
  if(event.subject_ids.length!==1||seen.has(event.subject_ids[0]))throw Error('Conversation notes history mismatch');const artifact_id=event.subject_ids[0];seen.add(artifact_id);
  const artifact=state.dossier.artifacts.find(a=>a.id===artifact_id);if(!artifact||artifact.storage!=='local'||artifact.availability!=='available'||artifact.version!=='1')throw Error('Conversation notes item unavailable');
  const bytes=regularFile(localFile(state.directory,artifact.location),1048576);if(sha(bytes)!==artifact.sha256)throw Error('Conversation notes fingerprint mismatch');const saved=JSON.parse(bytes);
  exact(saved,['format','project_id','artifact_id','captured_at','review_status','input','source_link']);input(saved.input);
  if(saved.format!=='startkompas-conversation-note-v1'||saved.project_id!==state.dossier.project_id||saved.artifact_id!==artifact_id||saved.review_status!=='not_reviewed'||typeof saved.captured_at!=='string'||!Number.isFinite(Date.parse(saved.captured_at))||new Date(saved.captured_at).toISOString()!==saved.captured_at||event.at!==saved.captured_at.slice(0,10)||JSON.stringify(saved.source_link)!==JSON.stringify(sourceLink(state,saved.input.source_id)))throw Error('Conversation notes identity mismatch');
  return saved;
 });
}
export function conversationNotes(dir,id){const state=readCore(dir,id),all=entries(state);unchanged(state);return {revision:state.dossier.revision,sha256:state.sha256,archived:isProjectArchived(state.dossier),items:all.map(v=>({artifact_id:v.artifact_id,title:v.input.title,conversation_date:v.input.conversation_date,captured_at:v.captured_at,review_status:v.review_status,participants:v.input.participant_codes.length,statements:v.input.statements.length})),warning};}
export function readConversationNote(dir,id,artifactId){const state=readCore(dir,id),saved=entries(state).find(v=>v.artifact_id===artifactId);if(!saved)throw Error('Choose a conversation note item from this project');unchanged(state);return {...saved,revision:state.dossier.revision,warning,attribution:'Contributor label is user-supplied, not authenticated identity.'};}
export function prepareConversationNote(dir,id,revision,digest,raw){
 const value=input(raw),state=readCore(dir,id);if(state.dossier.revision!==revision||state.sha256!==digest)throw Error('Project changed; prepare the conversation note again');if(isProjectArchived(state.dossier))throw Error('Restore the project before adding a conversation note');if(entries(state).length>=300)throw Error('Conversation notes limit reached');
 const artifact_id='conversation-'+randomUUID(),captured_at=new Date().toISOString(),saved={format:'startkompas-conversation-note-v1',project_id:id,artifact_id,captured_at,review_status:'not_reviewed',input:value,source_link:sourceLink(state,value.source_id)},content=bytesFor(saved).toString('utf8');
 const artifact={id:artifact_id,version:'1',storage:'local',location:'files/'+artifact_id+'.json',availability:'available',sha256:sha(content)};
 const update_request={project_id:id,expected_revision:revision,operation_id:'conversation-save-'+randomUUID(),changes:{artifacts:[...state.dossier.artifacts,artifact],events:[...state.dossier.events,{id:'conversation-event-'+randomUUID(),type:'conversation-note',at:captured_at.slice(0,10),description:'Unreviewed conversation note item captured; no verification or evidence promotion',subject_ids:[artifact_id]}]}};
 checkModel({...state.dossier,...update_request.changes});unchanged(state);return {artifact_id,content,update_request,preview:{...saved,warning,attribution:'Contributor label is user-supplied, not authenticated identity.'}};
}
