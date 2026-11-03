import fs from 'node:fs';
import path from 'node:path';
import {readCore,bytesFor,sha,safeDirectory,writeExclusive} from './store.mjs';
import {readBusinessBrief} from './business-brief.mjs';
import {documentFieldDefinitions} from './business-fields.mjs';
import {sharingReview} from './sharing-review.mjs';
function text(v,max){if(typeof v!=='string'||!v.trim()||!v.isWellFormed()||Buffer.byteLength(v)>max||/[\x00-\x1f\x7f]/.test(v))throw Error('Use bounded single-line review text');}
function exact(v,keys){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length!==keys.length||keys.some(k=>!Object.hasOwn(v,k)))throw Error('Invalid review package fields');}
export function reviewPackage(dir,id,request){
 exact(request,['title','owner_alias','reviewer_alias','questions','documents']);text(request.title,800);text(request.owner_alias,400);text(request.reviewer_alias,400);
 if(!Array.isArray(request.questions)||!request.questions.length||request.questions.length>10)throw Error('Choose 1 to 10 review questions');request.questions.forEach(q=>text(q,2000));
 if(!Array.isArray(request.documents)||!request.documents.length||request.documents.length>10||new Set(request.documents.map(d=>d.artifact_id)).size!==request.documents.length)throw Error('Choose 1 to 10 distinct documents');
 const s=readCore(dir,id),documents=request.documents.map(selection=>{exact(selection,['artifact_id','keys']);const draft=readBusinessBrief(dir,id,selection.artifact_id),definitions=documentFieldDefinitions(draft.request);
 if(draft.successor_ids.length)throw Error('Choose current documents; historical reviews need their original package');
 if(!Array.isArray(selection.keys)||!selection.keys.length||selection.keys.length>20||new Set(selection.keys).size!==selection.keys.length||selection.keys.some(k=>!Object.hasOwn(definitions,k)))throw Error('Choose distinct existing sections');
 const artifact=s.dossier.artifacts.find(a=>a.id===selection.artifact_id);return {artifact_id:draft.artifact_id,version:draft.version,artifact_sha256:artifact.sha256,kind:draft.request.kind,practice:draft.practice===true,requires_review:draft.requires_review===true,sections:selection.keys.map(key=>{const f=draft.fields.find(f=>f.key===key);return {key,label:definitions[key][1],value:f.value,assertion:f.assertion};}),excluded_section_keys:draft.fields.filter(f=>!selection.keys.includes(f.key)).map(f=>f.key)};});
 const payload={format:'startkompas-review-package-v1',project_id:id,project_revision:s.dossier.revision,title:request.title,roles:{owner_alias:request.owner_alias,reviewer_alias:request.reviewer_alias,reviewer_permissions:['read_selected_snapshot','propose_feedback'],editor_access:'not_granted',identity:'User-supplied aliases; not authenticated identities or access grants'},questions:[...request.questions],documents,exclusions:['project name and folder','client and period metadata','source records and attachments','section basis record IDs','comments and history','unselected document sections','other project records'],warning:'Selected draft snapshot only. Included prose may still contain private details or source quotations. Review every field before sharing. Saving sends nothing. Copies cannot be revoked remotely. Feedback is not an applied edit or verified evidence.'};
 const package_id='review-package-'+sha(bytesFor(payload)),content=bytesFor({...payload,package_id}).toString('utf8');if(Buffer.byteLength(content)>200000)throw Error('Review package exceeds 200000 bytes; select less content');if(readCore(dir,id).sha256!==s.sha256)throw Error('Project changed; preview again');
 return {package_id,revision:s.dossier.revision,project_sha256:s.sha256,content,sha256:sha(content),bytes:Buffer.byteLength(content),sharing_review:sharingReview(content)};
}
export function writeReviewPackage(dir,id,request,digest,destination,confirmed){
 if(confirmed!==true)throw Error('Review and confirm the exact package first');const preview=reviewPackage(dir,id,request);if(preview.sha256!==digest)throw Error('Package changed; preview again');
 const target=path.resolve(destination),parent=safeDirectory(path.dirname(target)),project=readCore(dir,id).directory,relative=path.relative(project,parent);if(relative===''||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Review package must be outside the project');
 writeExclusive(path.join(fs.realpathSync(parent),path.basename(target)),preview.content);return {path:target,package_id:preview.package_id,sha256:preview.sha256,bytes:preview.bytes,revision:preview.revision,sent:false};
}
