import {randomUUID} from 'node:crypto';
import {readCore,regularFile,localFile,bytesFor,sha} from './store.mjs';
import {canonical,checkModel} from './model.mjs';
import {readSnapshot} from './history.mjs';
import {readBusinessBrief} from './business-brief.mjs';
import {documentFieldDefinitions} from './business-fields.mjs';
import {isProjectArchived} from './workspace.mjs';
function exact(v,keys){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length!==keys.length||keys.some(k=>!Object.hasOwn(v,k)))throw Error('Unexpected feedback fields');}
function text(v,max){if(typeof v!=='string'||!v.trim()||!v.isWellFormed()||Buffer.byteLength(v)>max||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(v))throw Error('Invalid bounded feedback text');}
function parse(content,max){text(content,max);return JSON.parse(content);}
export function inspectReviewOriginal(dir,id,content,digest){
 if(typeof digest!=='string'||sha(content)!==digest)throw Error('Original package fingerprint changed');
 const packet=parse(content,200000);exact(packet,['format','project_id','project_revision','title','roles','questions','documents','exclusions','warning','package_id']);
 const {package_id,...payload}=packet;if(packet.format!=='startkompas-review-package-v1'||packet.project_id!==id||package_id!=='review-package-'+sha(bytesFor(payload)))throw Error('Original package identity mismatch');
 text(packet.title,800);exact(packet.roles,['owner_alias','reviewer_alias','reviewer_permissions','editor_access','identity']);text(packet.roles.owner_alias,400);text(packet.roles.reviewer_alias,400);
 if(packet.roles.editor_access!=='not_granted'||canonical(packet.roles.reviewer_permissions)!==canonical(['read_selected_snapshot','propose_feedback']))throw Error('Original package role mismatch');
 if(!Array.isArray(packet.questions)||!packet.questions.length||packet.questions.length>10)throw Error('Invalid questions');packet.questions.forEach(q=>text(q,2000));
 const state=readCore(dir,id),snapshot=packet.project_revision===state.dossier.revision?state:readSnapshot(dir,id,packet.project_revision);
 if(packet.project_revision>state.dossier.revision)throw Error('Unknown project revision');
 if(!Array.isArray(packet.documents)||!packet.documents.length||packet.documents.length>10||new Set(packet.documents.map(d=>d.artifact_id)).size!==packet.documents.length)throw Error('Invalid documents');
 const context=[];
 for(const row of packet.documents){
  exact(row,['artifact_id','version','artifact_sha256','kind','practice','requires_review','sections','excluded_section_keys']);
  const artifact=snapshot.dossier.artifacts.find(a=>a.id===row.artifact_id),draft=readBusinessBrief(dir,id,row.artifact_id),definitions=documentFieldDefinitions(draft.request);
  if(!artifact||artifact.sha256!==row.artifact_sha256||draft.version!==row.version||draft.request.kind!==row.kind||row.practice!==(draft.practice===true)||typeof row.requires_review!=='boolean')throw Error('Original document mismatch');
  if(!Array.isArray(row.sections)||!row.sections.length||row.sections.length>20||new Set(row.sections.map(s=>s.key)).size!==row.sections.length)throw Error('Invalid sections');
  for(const section of row.sections){exact(section,['key','label','value','assertion']);const field=draft.fields.find(f=>f.key===section.key);if(!field||section.label!==definitions[section.key][1]||section.value!==field.value||section.assertion!==field.assertion)throw Error('Original section mismatch');}
  const excluded=draft.fields.filter(f=>!row.sections.some(s=>s.key===f.key)).map(f=>f.key);if(canonical(excluded)!==canonical(row.excluded_section_keys))throw Error('Excluded sections mismatch');
  context.push({document_id:row.artifact_id,historical:draft.successor_ids.length>0,requires_review:draft.requires_review===true});
 }
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed');return {packet,context,revision:state.dossier.revision,sha256:state.sha256};
}
function responseFor(packet,content){
 const feedback=parse(content,100000);exact(feedback,['format','package_id','project_id','project_revision','reviewer_alias','comments']);
 if(feedback.format!=='startkompas-review-feedback-v1'||feedback.package_id!==packet.package_id||feedback.project_id!==packet.project_id||feedback.project_revision!==packet.project_revision)throw Error('Feedback does not match the selected original package');
 text(feedback.reviewer_alias,400);if(!Array.isArray(feedback.comments)||!feedback.comments.length||feedback.comments.length>20)throw Error('Choose 1 to 20 comments');
 const seen=new Set();for(const comment of feedback.comments){exact(comment,['document_id','document_version','key','comment']);text(comment.comment,16000);const doc=packet.documents.find(d=>d.artifact_id===comment.document_id);if(!doc||doc.version!==comment.document_version||!doc.sections.some(s=>s.key===comment.key))throw Error('Feedback targets an unshared section or different document version');const key=canonical(comment);if(seen.has(key))throw Error('Duplicate comment');seen.add(key);}
 return feedback;
}
export function reviewFeedbackTemplate(packet){return {format:'startkompas-review-feedback-v1',package_id:packet.package_id,project_id:packet.project_id,project_revision:packet.project_revision,reviewer_alias:packet.roles.reviewer_alias,comments:packet.documents.flatMap(d=>d.sections.map(s=>({document_id:d.artifact_id,document_version:d.version,key:s.key,comment:''}))).slice(0,20)};}
export function reviewFeedbackHistory(dir,id){
 const state=readCore(dir,id),events=state.dossier.events.filter(e=>e.type==='review-feedback');if(events.length>500)throw Error('Feedback history limit reached');const rows=[];
 for(const event of events){
  if(event.subject_ids.length!==1||rows.some(r=>r.artifact_id===event.subject_ids[0]))throw Error('Invalid feedback event');
  const artifact=state.dossier.artifacts.find(a=>a.id===event.subject_ids[0]);if(!artifact||artifact.storage!=='local'||artifact.availability!=='available')throw Error('Feedback unavailable');
  const bytes=regularFile(localFile(state.directory,artifact.location),400000);if(sha(bytes)!==artifact.sha256)throw Error('Feedback fingerprint mismatch');const row=JSON.parse(bytes);
  exact(row,['format','artifact_id','project_id','original_content','original_sha256','feedback','feedback_sha256','status','warning']);
  if(row.format!=='startkompas-review-feedback-record-v1'||row.artifact_id!==artifact.id||row.project_id!==id||row.status!=='unreviewed'||row.feedback_sha256!==sha(canonical(row.feedback)))throw Error('Feedback record mismatch');
  const original=inspectReviewOriginal(dir,id,row.original_content,row.original_sha256);responseFor(original.packet,JSON.stringify(row.feedback));rows.push({...row,context:original.context});
 }
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed');return {revision:state.dossier.revision,sha256:state.sha256,archived:isProjectArchived(state.dossier),rows};
}
export function prepareReviewFeedback(dir,id,revision,digest,originalContent,originalDigest,feedbackContent){
 const state=readCore(dir,id);if(state.dossier.revision!==revision||state.sha256!==digest)throw Error('Project changed');if(isProjectArchived(state.dossier))throw Error('Restore project before importing feedback');
 const original=inspectReviewOriginal(dir,id,originalContent,originalDigest),feedback=responseFor(original.packet,feedbackContent),feedback_sha256=sha(canonical(feedback)),history=reviewFeedbackHistory(dir,id);
 if(history.rows.length>=500||history.rows.some(r=>r.feedback_sha256===feedback_sha256))throw Error('Feedback already imported or history full');
 const artifact_id='feedback-'+randomUUID(),saved={format:'startkompas-review-feedback-record-v1',artifact_id,project_id:id,original_content:originalContent,original_sha256:originalDigest,feedback,feedback_sha256,status:'unreviewed',warning:'Imported proposals only. Reviewer alias is not authenticated. No document, decision, task or evidence status was changed. Historical targets stay attached to their original version.'};
 const content=bytesFor(saved).toString('utf8'),artifact={id:artifact_id,version:'1',storage:'local',location:'files/'+artifact_id+'.json',availability:'available',sha256:sha(content)};
 const update_request={project_id:id,expected_revision:revision,operation_id:'feedback-save-'+randomUUID(),changes:{artifacts:[...state.dossier.artifacts,artifact],events:[...state.dossier.events,{id:'feedback-event-'+randomUUID(),type:'review-feedback',at:new Date().toISOString().slice(0,10),description:'Imported unreviewed feedback; original document versions retained',subject_ids:[artifact_id]}]}};
 checkModel({...state.dossier,...update_request.changes});if(readCore(dir,id).sha256!==digest)throw Error('Project changed');return {artifact_id,content,update_request,preview:saved,context:original.context};
}
