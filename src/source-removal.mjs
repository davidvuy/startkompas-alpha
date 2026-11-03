import path from 'node:path';
import fs from 'node:fs';
import {randomUUID} from 'node:crypto';
import {releaseAbandonedLock,sourceRetryCopies,readCore,regularFile,localFile,sha,commitSourceRemoval,pendingSourceRemoval} from './store.mjs';
import {sourceManagement} from './source-retention.mjs';
import {isProjectArchived} from './workspace.mjs';

export const removalWarning='Permanently removes the selected source and listed linked project content, including entire linked conversation notes and retention records. This is file removal, not secure disk erasure or a complete personal-data scan. Only listed verified retry content files in the project parent are also removed; their request/receipt metadata remains. Unrecognized retry folders, other retry locations, previous exports, backups and unlinked copies are not removed. Technical IDs, fingerprints and historical core metadata remain. Review and remove external copies separately.';
export function prepareSourceRemoval(dir,id,revision,digest,sourceId){
 const s=readCore(dir,id);if(s.dossier.revision!==revision||s.sha256!==digest)throw Error('Project changed; preview removal again');if(isProjectArchived(s.dossier))throw Error('Restore project before source removal');
 const view=sourceManagement(dir,id,sourceId),rows=[...view.known_project_copies,...view.history.map(record=>({artifact_id:record.artifact_id,kind:'source-retention',contains:'Retention dates, reason and contributor metadata'}))];
 const ids=[...new Set(rows.map(row=>row.artifact_id))];for(const artifactId of ids){const a=s.dossier.artifacts.find(a=>a.id===artifactId);if(!a||sha(regularFile(localFile(s.directory,a.location),1048576))!==a.sha256)throw Error('Source removal target changed');}
 const retry=sourceRetryCopies(s.directory,s.dossier,ids);
 if(readCore(dir,id).sha256!==digest)throw Error('Project changed during removal preview');
 const request={project_id:id,expected_revision:revision,expected_sha256:digest,operation_id:'remove-source-'+randomUUID(),at:new Date().toISOString(),source_id:sourceId,artifact_ids:ids,retry_files:retry.files,retry_parent:path.dirname(s.directory)};
 return {request,preview:{source_id:sourceId,title:view.title,project_files:rows,retry_copies:retry,warning:removalWarning}};
}
export function applySourceRemoval(dir,request,confirmed,options){
 if(confirmed!==true)throw Error('Explicit confirmation of the exact source removal is required');
 const pending=pendingSourceRemoval(dir,request.project_id);
 if(!pending){const s=readCore(dir,request.project_id);if(!s.dossier.operations.some(op=>op.id===request.operation_id)){const current=prepareSourceRemoval(dir,request.project_id,request.expected_revision,request.expected_sha256,request.source_id);if(JSON.stringify(current.request.artifact_ids)!==JSON.stringify(request.artifact_ids))throw Error('Removal must match the exact linked source scope');if(request.retry_files!==undefined&&JSON.stringify(current.request.retry_files)!==JSON.stringify(request.retry_files))throw Error('Retry-copy scope changed; preview source removal again');}}
 return commitSourceRemoval(dir,request,options);
}
export function resumeSourceRemoval(dir,id,confirmed,options){if(confirmed!==true)throw Error('Confirm resuming the pending source removal');const request=pendingSourceRemoval(dir,id);if(!request)throw Error('No pending source removal');return commitSourceRemoval(dir,request,options);}

export function sourceRemovalRecovery(dir,id){
 const request=pendingSourceRemoval(dir,id);if(!request)throw Error('No pending source removal');
 return {sha256:sha(JSON.stringify(request)),operation_id:request.operation_id,source_id:request.source_id,project_artifact_ids:request.artifact_ids,retry_files:(request.retry_files??[]).map(row=>row.folder+'/content.json'),writer_lock_present:fs.existsSync(path.join(dir,'.writer-lock')),warning:removalWarning+' Some listed files may already be removed. Resuming completes the same operation; it does not restore deleted content. A writer lock is released only if its recorded process is confirmed no longer running on this computer.'};
}
export function confirmSourceRemovalRecovery(dir,id,digest,confirmed){
 if(confirmed!==true)throw Error('Confirm completing the exact pending source removal');const current=sourceRemovalRecovery(dir,id);if(current.sha256!==digest)throw Error('Pending source removal changed; review it again');
 if(current.writer_lock_present){const owner=JSON.parse(regularFile(path.join(dir,'.writer-lock','owner.json'),4096));releaseAbandonedLock(dir,id,owner.token);}
 return resumeSourceRemoval(dir,id,true);
}
