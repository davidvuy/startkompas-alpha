import {randomUUID} from 'node:crypto';
import {readCore,regularFile,localFile,bytesFor,sha} from './store.mjs';
import {canonical,checkModel} from './model.mjs';
import {isProjectArchived} from './workspace.mjs';
import {readBusinessBrief} from './business-brief.mjs';
import {documentFieldDefinitions} from './business-fields.mjs';
import {documentVersions} from './document-comparison.mjs';
import {readTextImport} from './text-import.mjs';
function exact(v,keys){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length!==keys.length||keys.some(k=>!Object.hasOwn(v,k)))throw Error('Invalid comment request');}
function targetShape(target){exact(target,['kind','document_id']);if(!['business','import'].includes(target.kind)||typeof target.document_id!=='string')throw Error('Choose a saved document');}
function text(value,label){if(typeof value!=='string'||!value.trim()||value.length>4000||!value.isWellFormed()||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value))throw Error(label+' must be readable text of 1 to 4000 characters');}
function document(dir,id,target){
 targetShape(target);
 if(target.kind==='import'){const imported=readTextImport(dir,id,target.document_id);return {ids:[target.document_id],version:1,requires_review:imported.associations.some(a=>a.status!=='unchanged'),blocks:[{key:'source',label:'Complete imported source',value:imported.text,context:{format:imported.format,source_sha256:imported.source_sha256}}]};}
 const draft=readBusinessBrief(dir,id,target.document_id),definitions=documentFieldDefinitions(draft.request),versions=documentVersions(dir,id,target.document_id);
 return {ids:versions.versions.map(v=>v.id),version:draft.version,requires_review:draft.requires_review,blocks:draft.fields.map(field=>({key:field.key,label:definitions[field.key][1],value:field.value,context:{assertion:field.assertion,record_ids:field.record_ids,basis:field.basis}}))};
}
function anchor(target,doc,key){const block=doc.blocks.find(b=>b.key===key);if(!block)throw Error('Choose an existing stable document block');return {...target,version:doc.version,key,label:block.label,value:block.value,text_sha256:sha(canonical(block.value)),context_sha256:sha(canonical(block.context))};}
function history(state){
 const events=state.dossier.events.filter(e=>e.type==='revision-comment');if(events.length>500)throw Error('Comment history exceeds 500 entries');const rows=[],threads=new Map();
 for(const event of events){
  const artifact=state.dossier.artifacts.find(a=>a.id===event.subject_ids[0]);if(!artifact||artifact.storage!=='local'||artifact.availability!=='available'||artifact.version!=='1')throw Error('Comment unavailable');
  const bytes=regularFile(localFile(state.directory,artifact.location),524288);if(sha(bytes)!==artifact.sha256)throw Error('Comment fingerprint mismatch');const row=JSON.parse(bytes);exact(row,['format','project_id','artifact_id','thread_id','previous','action','anchor','comment','reason']);
  exact(row.anchor,['kind','document_id','version','key','label','value','text_sha256','context_sha256']);targetShape({kind:row.anchor.kind,document_id:row.anchor.document_id});text(row.comment,'Comment');if(row.reason!==null)text(row.reason,'Reason');
  if(row.format!=='startkompas-revision-comment-v1'||row.project_id!==state.dossier.project_id||row.artifact_id!==artifact.id||rows.some(r=>r.artifact_id===row.artifact_id)||!Number.isSafeInteger(row.anchor.version)||row.anchor.version<1||typeof row.anchor.key!=='string'||typeof row.anchor.label!=='string'||!(row.anchor.value===null||typeof row.anchor.value==='string')||row.anchor.text_sha256!==sha(canonical(row.anchor.value))||typeof row.anchor.context_sha256!=='string'||! /^[a-f0-9]{64}$/.test(row.anchor.context_sha256))throw Error('Comment identity mismatch');
  const thread=threads.get(row.thread_id),previous=thread?.at(-1);
  if(row.action==='add'){
   if(thread||row.thread_id!==row.artifact_id||row.previous!==null||row.reason!==null||event.subject_ids.length!==1)throw Error('Comment root mismatch');threads.set(row.thread_id,[row]);
  }else{
   if(!thread||!['resolve','reopen'].includes(row.action)||row.previous!==previous.artifact_id||row.reason===null||row.comment!==thread[0].comment||canonical(row.anchor)!==canonical(thread[0].anchor)||event.subject_ids.length!==2||event.subject_ids[1]!==previous.artifact_id||(row.action==='resolve'?previous.action==='resolve':previous.action!=='resolve'))throw Error('Comment resolution history mismatch');thread.push(row);
  }rows.push(row);
 }return {rows,threads};
}
function unchanged(state){if(readCore(state.directory,state.dossier.project_id).sha256!==state.sha256)throw Error('Project changed; review comments again');}
export function revisionComments(dir,id,target){
 const state=readCore(dir,id),doc=document(dir,id,target),{threads}=history(state),comments=[];
 for(const [thread_id,rows] of threads){const first=rows[0],a=first.anchor;if(a.kind!==target.kind||!doc.ids.includes(a.document_id))continue;
  const original=anchor({kind:a.kind,document_id:a.document_id},document(dir,id,{kind:a.kind,document_id:a.document_id}),a.key);if(canonical(original)!==canonical(a))throw Error('Original comment anchor changed');
  const current=anchor(target,doc,a.key),last=rows.at(-1),text_changed=current.text_sha256!==a.text_sha256,context_changed=current.context_sha256!==a.context_sha256;
  comments.push({thread_id,latest_action_id:last.artifact_id,status:last.action==='resolve'?'resolved':'open',comment:first.comment,anchor:a,current,text_changed,context_changed,possibly_outdated:text_changed||context_changed||doc.requires_review,history:rows.map(r=>({artifact_id:r.artifact_id,action:r.action,reason:r.reason})),warning:'Comment remains attached to its original saved version. Unchanged text is not proof that the comment is still relevant.'});
 }
 unchanged(state);return {revision:state.dossier.revision,sha256:state.sha256,target,archived:isProjectArchived(state.dossier),version:doc.version,blocks:doc.blocks.map(b=>({key:b.key,label:b.label,value:b.value})),comments,requires_review:doc.requires_review};
}
export function prepareRevisionComment(dir,id,revision,digest,input){
 exact(input,['target','key','comment']);text(input.comment,'Comment');const state=readCore(dir,id);if(state.dossier.revision!==revision||state.sha256!==digest)throw Error('Project changed');if(isProjectArchived(state.dossier))throw Error('Restore project before commenting');const doc=document(dir,id,input.target),all=history(state);if(all.rows.length>=500)throw Error('Comment history limit reached');const artifact_id='comment-'+randomUUID(),saved={format:'startkompas-revision-comment-v1',project_id:id,artifact_id,thread_id:artifact_id,previous:null,action:'add',anchor:anchor(input.target,doc,input.key),comment:input.comment,reason:null};return prepared(state,saved);
}
export function prepareCommentResolution(dir,id,revision,digest,input){
 exact(input,['target','thread_id','latest_action_id','action','reason']);text(input.reason,'Reason');if(!['resolve','reopen'].includes(input.action))throw Error('Choose resolve or reopen');const state=readCore(dir,id);if(state.dossier.revision!==revision||state.sha256!==digest)throw Error('Project changed');if(isProjectArchived(state.dossier))throw Error('Restore project before changing comments');
 const view=revisionComments(dir,id,input.target),item=view.comments.find(c=>c.thread_id===input.thread_id);if(!item||item.latest_action_id!==input.latest_action_id||(input.action==='resolve'?item.status!=='open':item.status!=='resolved'))throw Error('Choose the current comment action');if(history(state).rows.length>=500)throw Error('Comment history limit reached');
 const artifact_id='comment-'+randomUUID(),saved={format:'startkompas-revision-comment-v1',project_id:id,artifact_id,thread_id:item.thread_id,previous:item.latest_action_id,action:input.action,anchor:item.anchor,comment:item.comment,reason:input.reason};return {...prepared(state,saved),possibly_outdated:item.possibly_outdated};
}
function prepared(state,saved){
 const content=bytesFor(saved).toString('utf8'),artifact={id:saved.artifact_id,version:'1',storage:'local',location:'files/'+saved.artifact_id+'.json',availability:'available',sha256:sha(content)};
 const update_request={project_id:state.dossier.project_id,expected_revision:state.dossier.revision,operation_id:'comment-save-'+randomUUID(),changes:{artifacts:[...state.dossier.artifacts,artifact],events:[...state.dossier.events,{id:'comment-event-'+randomUUID(),type:'revision-comment',at:new Date().toISOString().slice(0,10),description:'Private revision comment '+saved.action+'; document unchanged',subject_ids:[saved.artifact_id,...(saved.previous?[saved.previous]:[])]}]}};
 checkModel({...state.dossier,...update_request.changes});unchanged(state);return {artifact_id:saved.artifact_id,content,update_request,preview:saved};
}
