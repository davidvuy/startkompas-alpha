import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import {checkModel,canonical,COLLECTIONS,MAX_CORE_BYTES} from './model.mjs';
import {applyInvalidation} from './change-rules.mjs';
import {previewSnapshotRestore,readSnapshot,snapshotRestorationCandidate} from './history.mjs';

const source=fs.realpathSync(fileURLToPath(new URL('../',import.meta.url)));
export const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export const bytesFor=data=>Buffer.from(JSON.stringify(data,null,2)+'\n');
export function safeDirectory(dir, fresh=false) {
  const absolute=path.resolve(dir);
  const resolved=fs.existsSync(absolute)?fs.realpathSync(absolute):path.join(fs.realpathSync(path.dirname(absolute)),path.basename(absolute));
  const relative=path.relative(source,resolved);
  if(!relative || (!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Private project must be outside source');
  if(fresh) { if(fs.existsSync(resolved))throw Error('Destination exists; choose a new directory'); }
  else if(!fs.statSync(resolved).isDirectory()) throw Error('Expected a project directory');
  return resolved;
}
export function regularFile(file, max=MAX_CORE_BYTES) {
  if(fs.lstatSync(file).isSymbolicLink())throw Error('Symbolic-link files are not supported');
  const fd=fs.openSync(file,'r');
  try {
    const info=fs.fstatSync(fd);if(!info.isFile()||info.size>max)throw Error('Expected a bounded regular file');
    const bytes=Buffer.alloc(max+1);let used=0;
    while(used<bytes.length){const n=fs.readSync(fd,bytes,used,bytes.length-used,null);if(!n)break;used+=n;}
    if(used>max)throw Error('File exceeds size limit');return bytes.subarray(0,used);
  } finally {fs.closeSync(fd);}
}
export function localFile(dir,relative) {
  if(!/^files\/[a-zA-Z0-9][a-zA-Z0-9_./-]*$/.test(relative)||relative.split('/').some(x=>['','..','.'].includes(x)))throw Error('Unsafe local artifact path');
  let current=dir;
  for(const segment of relative.split('/')) {current=path.join(current,segment);if(fs.existsSync(current)&&fs.lstatSync(current).isSymbolicLink())throw Error('Artifact links are not supported');}
  return current;
}
export function assertNoPendingRemoval(dir){if(fs.existsSync(path.join(dir,'.source-removal.json')))throw Error('Source removal is pending; resume it before reading or changing this project');}
export function readCore(dir,expectedId) {assertNoPendingRemoval(safeDirectory(dir));return readCoreForRemoval(dir,expectedId);}
function readCoreForRemoval(dir,expectedId) {
  if(typeof expectedId!=='string'||!expectedId)throw Error('Expected project ID required');
  const directory=safeDirectory(dir),file=path.join(directory,'project.json'),bytes=regularFile(file);
  const dossier=checkModel(JSON.parse(bytes));
  if(dossier.project_id!==expectedId)throw Object.assign(Error('Project identity mismatch'),{code:'PROJECT_MISMATCH'});
  return {directory,file,sha256:sha(bytes),dossier};
}
export function writeExclusive(file,bytes) {
  const fd=fs.openSync(file,'wx',0o600);
  try{fs.writeFileSync(fd,bytes);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
}
function verifyArtifacts(dir,data) {
  for(const a of data.artifacts) if(a.storage==='local'&&a.availability==='available') {
    if(data.workflow?.invalidated_ids.includes(a.id))continue;
    if(sha(regularFile(localFile(dir,a.location),16*1024*1024))!==a.sha256)throw Error('Artifact fingerprint mismatch: '+a.id);
  }
}
export function damagedArtifacts(dir,data) {
  const damaged=[];
  for(const a of data.artifacts)if(a.storage==='local'&&a.availability==='available'){
    try{if(sha(regularFile(localFile(dir,a.location),16*1024*1024))!==a.sha256)damaged.push(a.id);}
    catch{damaged.push(a.id);}
  }
  return damaged;
}
export function createCore(dir,input) {
  checkModel(input);
  if(input.revision!==1||input.operations.length)throw Error('New dossier must start at revision 1 with no operations');
  if(input.artifacts.some(a=>a.storage==='local'&&a.availability==='available'))throw Error('Attach local files after creation');
  const directory=safeDirectory(dir,true);fs.mkdirSync(directory);
  writeExclusive(path.join(directory,'project.json'),bytesFor(input));
  return readCore(directory,input.project_id);
}
function lock(directory) {
  const location=path.join(directory,'.writer-lock');
  try{fs.mkdirSync(location);}catch(e){if(e.code==='EEXIST')throw Error('Writer lock exists; inspect before recovery');throw e;}
  const owner={token:randomUUID(),pid:process.pid,host:os.hostname(),created_at:new Date().toISOString()};
  try{writeExclusive(path.join(location,'owner.json'),bytesFor(owner));}catch(e){fs.rmdirSync(location);throw e;}
  return ()=>{fs.unlinkSync(path.join(location,'owner.json'));fs.rmdirSync(location);};
}
export function releaseAbandonedLock(dir,expectedId,token) {
  const {directory}=readCoreForRemoval(dir,expectedId),location=path.join(directory,'.writer-lock');
  if(fs.lstatSync(location).isSymbolicLink())throw Error('Unsafe lock path');
  const owner=JSON.parse(regularFile(path.join(location,'owner.json'),4096));
  if(owner.token!==token||owner.host!==os.hostname()||!Number.isInteger(owner.pid)||owner.pid<=0)throw Error('Lock owner does not match');
  try{process.kill(owner.pid,0);throw Error('Writer process may still be alive');}catch(e){if(e.code!=='ESRCH')throw e;}
  fs.unlinkSync(path.join(location,'owner.json'));fs.rmdirSync(location);
  return {released:true,project_id:expectedId};
}
const editable=new Set([...COLLECTIONS,'active_task_id','name','skill_version','module_versions','workflow']);
export function updateCore(dir,request,{onStage=()=>{}}={}) {
  if(!request||Object.keys(request).some(k=>!['project_id','expected_revision','operation_id','changes'].includes(k))||
     typeof request.project_id!=='string'||!Number.isInteger(request.expected_revision)||request.expected_revision<1||
     !/^[a-z0-9][a-z0-9-]{0,63}$/.test(request.operation_id)||!request.changes||Array.isArray(request.changes)||typeof request.changes!=='object')throw Error('Invalid update request');
  if(Buffer.byteLength(canonical(request))>MAX_CORE_BYTES)throw Error('Update exceeds size limit');
  for(const key of Object.keys(request.changes))if(!editable.has(key))throw Error('Immutable or unknown field: '+key);
  const directory=safeDirectory(dir),unlock=lock(directory);
  let temp;
  try {
    const previous=readCore(directory,request.project_id),before=previous.dossier,requestHash=sha(canonical(request));
    const receipt=op=>({project_id:before.project_id,operation_id:op.id,revision:op.revision});
    const prior=before.operations.find(op=>op.id===request.operation_id);
    if(prior){if(prior.request_hash!==requestHash)throw Object.assign(Error('Operation ID reused with different content'),{code:'OPERATION_CONFLICT'});return receipt(prior);}
    if(before.revision!==request.expected_revision)throw Object.assign(Error('Stale expected revision'),{code:'REVISION_CONFLICT'});
    const next={...structuredClone(before),...structuredClone(request.changes),revision:before.revision+1};
    const op={id:request.operation_id,request_hash:requestHash,revision:next.revision};
    next.operations=[...before.operations,op];checkModel(next);
    applyInvalidation(before,next,damagedArtifacts(directory,before));checkModel(next);
    // Preserve identities and explicit event history even when a record is corrected.
    for(const group of COLLECTIONS)for(const old of before[group])if(!next[group].some(r=>r.id===old.id))throw Error('Record removal requires a future archival operation: '+old.id);
    for(const group of ['events','evidence','artifacts']) for(const e of before[group])
      if(canonical(next[group].find(x=>x.id===e.id))!==canonical(e))throw Error(group+' are append-only; record a new version');
    verifyArtifacts(directory,next);
    const bytes=bytesFor(next);if(bytes.length>MAX_CORE_BYTES)throw Error('Dossier exceeds size limit');
    const history=path.join(directory,'.history');
    if(fs.existsSync(history)&&fs.lstatSync(history).isSymbolicLink())throw Error('Unsafe history path');
    fs.mkdirSync(history,{recursive:true});
    const backup=path.join(history,`${before.revision}-${previous.sha256}.json`),oldBytes=regularFile(previous.file);
    if(fs.existsSync(backup)){if(sha(regularFile(backup))!==previous.sha256)throw Error('Backup collision');}
    else writeExclusive(backup,oldBytes);
    onStage('after-backup');
    temp=path.join(directory,`.pending-${randomUUID()}.json`);writeExclusive(temp,bytes);
    if(sha(regularFile(temp))!==sha(bytes))throw Error('Pending write mismatch');
    onStage('before-rename');
    fs.renameSync(temp,previous.file);temp=null;
    onStage('after-rename');
    if(readCore(directory,before.project_id).sha256!==sha(bytes))throw Error('Committed state mismatch');
    return receipt(op);
  } finally {if(temp&&fs.existsSync(temp))fs.unlinkSync(temp);unlock();}
}
export function attachFile(dir,request,sourceFile) {
  const current=readCore(dir,request.project_id);
  if(current.dossier.operations.some(op=>op.id===request.operation_id))return updateCore(dir,request);
  const artifact=request.changes?.artifacts?.find(a=>a.storage==='local'&&a.availability==='available'&&!current.dossier.artifacts.some(x=>x.id===a.id));
  if(!artifact)throw Error('Attach request must add one available local artifact');
  const bytes=regularFile(sourceFile,16*1024*1024);
  if(sha(bytes)!==artifact.sha256)throw Error('Source fingerprint differs');
  const dest=localFile(current.directory,artifact.location);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  // Immutable attachment copy may remain unreferenced after a rejected update; never overwrite.
  if(fs.existsSync(dest)){if(sha(regularFile(dest,16*1024*1024))!==artifact.sha256)throw Error('Attachment already exists with different content');}
  else writeExclusive(dest,bytes);
  return updateCore(dir,request);
}

// Dedicated privacy transaction. Ordinary updates retain their append-only contract.
export function removedSourceArtifacts(dossier){
 const ids=new Set();for(const event of dossier.events.filter(e=>e.type==='source-removal'))for(const id of event.subject_ids){const a=dossier.artifacts.find(a=>a.id===id);if(!a||a.storage!=='local'||a.availability!=='missing')throw Error('Source removal tombstone mismatch');ids.add(id);}return ids;
}
function retryCopyLocation(directory,folder){
 if(typeof folder!=='string'||!/^retry-[a-z0-9][a-z0-9-]{0,63}$/.test(folder))throw Error('Invalid retry-copy folder');
 const parent=path.dirname(directory),target=path.join(parent,folder);if(target===directory)throw Error('Retry folder cannot be the project');
 if(fs.existsSync(target)&&(!fs.lstatSync(target).isDirectory()||fs.lstatSync(target).isSymbolicLink()||fs.realpathSync(target)!==target))throw Error('Linked or relocated retry folder is not supported');return target;
}
function verifiedRetryCopy(directory,dossier,row,allowMissing=false){
 const keys=['folder','artifact_id','sha256','request_sha256'];if(!row||typeof row!=='object'||Array.isArray(row)||Object.keys(row).length!==keys.length||keys.some(k=>!Object.hasOwn(row,k))||typeof row.artifact_id!=='string'||! /^[a-f0-9]{64}$/.test(row.sha256)||! /^[a-f0-9]{64}$/.test(row.request_sha256))throw Error('Invalid retry-copy record');
 const folder=retryCopyLocation(directory,row.folder),file=path.join(folder,'content.json');
 if(!fs.existsSync(file)&&allowMissing)return {file,missing:true};
 const requestBytes=regularFile(path.join(folder,'request.json')),request=JSON.parse(requestBytes),op=dossier.operations.find(op=>op.id===request.operation_id),a=dossier.artifacts.find(a=>a.id===row.artifact_id);
 if(sha(requestBytes)!==row.request_sha256||request.project_id!==dossier.project_id||row.folder!=='retry-'+request.operation_id||!op||op.request_hash!==sha(canonical(request))||op.revision!==request.expected_revision+1||!a||a.sha256!==row.sha256||!request.changes?.artifacts?.some(copy=>canonical(copy)===canonical({...a,availability:'available'})))throw Error('Retry-copy request identity or fingerprint changed');
 if(sha(regularFile(file,1048576))!==row.sha256)throw Error('Retry-copy content fingerprint changed');return {file,missing:false};
}
export function sourceRetryCopies(directory,dossier,artifactIds){
 const files=[],excluded=[],parent=path.dirname(directory),handle=fs.opendirSync(parent),selected=new Set(artifactIds);let count=0;
 try{for(let entry;(entry=handle.readSync())!==null;){if(++count>2000)throw Error('Too many entries in the project parent to inventory retry copies');if(!/^retry-[a-z0-9][a-z0-9-]{0,63}$/.test(entry.name))continue;
  try{const folder=retryCopyLocation(directory,entry.name),requestBytes=regularFile(path.join(folder,'request.json')),request=JSON.parse(requestBytes);if(request.project_id!==dossier.project_id)continue;const op=dossier.operations.find(op=>op.id===request.operation_id);if(entry.name!=='retry-'+request.operation_id||!op||op.request_hash!==sha(canonical(request)))throw Error('Unrecognized or uncommitted retry operation');
   if(!fs.existsSync(path.join(folder,'content.json')))continue;
   const bytes=regularFile(path.join(folder,'content.json'),1048576),fingerprint=sha(bytes),artifact=dossier.artifacts.find(a=>selected.has(a.id)&&a.sha256===fingerprint);if(!artifact){const saved=JSON.parse(bytes);if(selected.has(saved.artifact_id))throw Error('Target retry content has changed');continue;}
   const row={folder:entry.name,artifact_id:artifact.id,sha256:fingerprint,request_sha256:sha(requestBytes)};verifiedRetryCopy(directory,dossier,row);files.push(row);
  }catch{excluded.push({folder:entry.name,reason:'Not verified as an exact committed source copy; inspect separately'});}
 }}finally{handle.closeSync();}
 return {files:files.sort((a,b)=>a.folder.localeCompare(b.folder)),excluded:excluded.sort((a,b)=>a.folder.localeCompare(b.folder)),scope:'Only recognized retry folders directly inside the project parent; other folders and locations are not searched'};
}
function removalRequest(request){
 const keys=['project_id','expected_revision','expected_sha256','operation_id','at','source_id','artifact_ids',...(Object.hasOwn(request??{},'retry_files')?['retry_files','retry_parent']:[])];
 if(!request||typeof request!=='object'||Array.isArray(request)||Object.keys(request).length!==keys.length||keys.some(k=>!Object.hasOwn(request,k))||typeof request.project_id!=='string'||!Number.isSafeInteger(request.expected_revision)||request.expected_revision<1||! /^[a-f0-9]{64}$/.test(request.expected_sha256)||! /^remove-source-[a-f0-9-]{36}$/.test(request.operation_id)||! /^inbox-[a-f0-9-]{36}$/.test(request.source_id)||typeof request.at!=='string'||!Number.isFinite(Date.parse(request.at))||new Date(request.at).toISOString()!==request.at||!Array.isArray(request.artifact_ids)||!request.artifact_ids.length||request.artifact_ids.length>10000||new Set(request.artifact_ids).size!==request.artifact_ids.length||!request.artifact_ids.includes(request.source_id)||request.artifact_ids.some(id=>typeof id!=='string'))throw Error('Invalid source removal request');
 if(request.retry_files!==undefined&&(typeof request.retry_parent!=='string'||!path.isAbsolute(request.retry_parent)||!Array.isArray(request.retry_files)||request.retry_files.length>2000||new Set(request.retry_files.map(row=>row?.folder)).size!==request.retry_files.length||request.retry_files.some(row=>!request.artifact_ids.includes(row?.artifact_id))))throw Error('Invalid retry-copy scope');
 if(bytesFor(request).length>MAX_CORE_BYTES)throw Error('Source removal journal exceeds size limit');
}
export function pendingSourceRemoval(dir,id){
 const s=readCoreForRemoval(dir,id),file=path.join(s.directory,'.source-removal.json');if(!fs.existsSync(file))return null;const request=JSON.parse(regularFile(file,MAX_CORE_BYTES));removalRequest(request);if(request.project_id!==id)throw Error('Removal project mismatch');return request;
}
export function commitSourceRemoval(dir,request,{onStage=()=>{}}={}){
 removalRequest(request);const directory=safeDirectory(dir);if(request.retry_files!==undefined&&request.retry_parent!==path.dirname(directory))throw Error('Retry-copy parent moved; inspect the pending removal before continuing');const unlock=lock(directory),journal=path.join(directory,'.source-removal.json');let temp;
 try{
  const s=readCoreForRemoval(directory,request.project_id),before=s.dossier,requestHash=sha(canonical(request)),prior=before.operations.find(op=>op.id===request.operation_id),pending=fs.existsSync(journal);
  if(pending&&canonical(pendingSourceRemoval(directory,request.project_id))!==canonical(request))throw Error('A different source removal is pending');
  if(prior){if(prior.request_hash!==requestHash)throw Error('Removal operation reused with different content');const removed=removedSourceArtifacts(before);if(request.artifact_ids.some(id=>!removed.has(id)))throw Error('Removal receipt mismatch');for(const id of request.artifact_ids){const a=before.artifacts.find(a=>a.id===id);if(fs.existsSync(localFile(directory,a.location)))throw Error('Removed content reappeared; inspect before recovery');}for(const row of request.retry_files??[]){const retry=verifiedRetryCopy(directory,before,row,true);if(!retry.missing)throw Error('Removed retry content reappeared; inspect before recovery');}if(pending)fs.unlinkSync(journal);return {project_id:request.project_id,operation_id:prior.id,revision:prior.revision,removed_artifact_ids:request.artifact_ids,removed_retry_files:(request.retry_files??[]).map(row=>row.folder+'/content.json')};}
  if(before.revision!==request.expected_revision||s.sha256!==request.expected_sha256)throw Error('Project changed; preview source removal again');
  if(before.events.filter(e=>e.type==='project-archived'||e.type==='project-restored').at(-1)?.type==='project-archived')throw Error('Restore project before removal');
  const selected=new Set(request.artifact_ids),allowed=new Set(before.events.filter(e=>['source-inbox','source-summary','conversation-note','research-finding','source-retention','finding-classification','conflict-candidate','conflict-review','experiment-observation','experiment-review'].includes(e.type)).map(e=>e.subject_ids[0]));
  if(!before.events.some(e=>e.type==='source-inbox'&&e.subject_ids[0]===request.source_id)||request.artifact_ids.some(id=>!allowed.has(id)))throw Error('Removal is limited to recorded source content');
  const targets=request.artifact_ids.map(id=>{const a=before.artifacts.find(a=>a.id===id);if(!a||a.storage!=='local'||a.availability!=='available')throw Error('Removal target unavailable');const file=localFile(directory,a.location);if(fs.existsSync(file)){if(sha(regularFile(file,1048576))!==a.sha256)throw Error('Removal target fingerprint changed');}else if(!pending)throw Error('Removal target missing before preview confirmation');return {artifact:a,file};});
  const retryTargets=(request.retry_files??[]).map(row=>({row,...verifiedRetryCopy(directory,before,row,pending)}));
  const next=structuredClone(before);next.revision++;next.artifacts=next.artifacts.map(a=>selected.has(a.id)?{...a,availability:'missing'}:a);next.events.push({id:request.operation_id,type:'source-removal',at:request.at.slice(0,10),description:'Selected source content and linked project copies removed; external copies may remain',subject_ids:request.artifact_ids});next.operations.push({id:request.operation_id,request_hash:requestHash,revision:next.revision});applyInvalidation(before,next,[...request.artifact_ids,...damagedArtifacts(directory,before)]);checkModel(next);verifyArtifacts(directory,next);const bytes=bytesFor(next);if(bytes.length>MAX_CORE_BYTES)throw Error('Dossier exceeds size limit');
  // No raw source text enters the journal or retained core snapshot.
  const history=path.join(directory,'.history');if(fs.existsSync(history)&&(!fs.lstatSync(history).isDirectory()||fs.lstatSync(history).isSymbolicLink()))throw Error('Unsafe history path');fs.mkdirSync(history,{recursive:true});const backup=path.join(history,before.revision+'-'+s.sha256+'.json');if(fs.existsSync(backup)){if(sha(regularFile(backup))!==s.sha256)throw Error('Backup collision');}else writeExclusive(backup,regularFile(s.file));
  if(!pending){temp=path.join(directory,'.pending-removal-'+randomUUID()+'.json');writeExclusive(temp,bytesFor(request));fs.renameSync(temp,journal);temp=null;}onStage('after-journal');
  for(const target of targets){if(fs.existsSync(target.file)){if(sha(regularFile(target.file,1048576))!==target.artifact.sha256)throw Error('Removal target changed during operation');fs.unlinkSync(target.file);}onStage('after-delete',target.artifact.id);}
  for(const target of retryTargets){const current=verifiedRetryCopy(directory,before,target.row,true);if(!current.missing)fs.unlinkSync(current.file);onStage('after-retry-delete',target.row.folder);}
  temp=path.join(directory,'.pending-removal-'+randomUUID()+'.json');writeExclusive(temp,bytes);onStage('before-commit');fs.renameSync(temp,s.file);temp=null;onStage('after-commit');
  if(readCoreForRemoval(directory,request.project_id).sha256!==sha(bytes))throw Error('Removal commit mismatch');fs.unlinkSync(journal);return {project_id:request.project_id,operation_id:request.operation_id,revision:next.revision,removed_artifact_ids:request.artifact_ids,removed_retry_files:(request.retry_files??[]).map(row=>row.folder+'/content.json')};
 }finally{if(temp&&fs.existsSync(temp))fs.unlinkSync(temp);unlock();}
}


// Dedicated historical reinstatement; ordinary updates remain append-only.
export function reinstateSnapshot(dir,request,confirmed,{onStage=()=>{}}={}){
 const keys=['project_id','expected_revision','expected_sha256','snapshot_revision','snapshot_sha256','reason','operation_id','at'];
 if(confirmed!==true)throw Error('Confirm the exact historical restoration before saving');
 if(!request||typeof request!=='object'||Array.isArray(request)||Object.keys(request).length!==keys.length||keys.some(key=>!Object.hasOwn(request,key))||typeof request.operation_id!=='string'||!/^restore-[a-f0-9-]{36}$/.test(request.operation_id)||typeof request.at!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(request.at)||!Number.isFinite(Date.parse(request.at+'T00:00:00.000Z'))||new Date(request.at+'T00:00:00.000Z').toISOString().slice(0,10)!==request.at)throw Error('Invalid historical restoration request');
 const reviewRequest=Object.fromEntries(keys.slice(0,6).map(key=>[key,request[key]]));
 const directory=safeDirectory(dir),unlock=lock(directory);let temp;
 try{
  const current=readCore(directory,request.project_id),before=current.dossier,requestHash=sha(canonical({operation:'snapshot-reinstatement-v1',request}));
  const receipt=op=>({project_id:before.project_id,operation_id:op.id,revision:op.revision,snapshot_revision:request.snapshot_revision,snapshot_sha256:request.snapshot_sha256,previous_revision:request.expected_revision,previous_sha256:request.expected_sha256});
  const prior=before.operations.find(op=>op.id===request.operation_id);if(prior){if(prior.request_hash!==requestHash)throw Object.assign(Error('Restoration operation reused with different content'),{code:'OPERATION_CONFLICT'});return receipt(prior);}
  const review=previewSnapshotRestore(directory,reviewRequest);if(review.blockers.length)throw Error(review.blockers.join(' '));
  const snapshot=readSnapshot(directory,request.project_id,request.snapshot_revision);if(snapshot.sha256!==request.snapshot_sha256)throw Error('Historical snapshot changed during restoration');
  const next=snapshotRestorationCandidate(before,snapshot.dossier).dossier;next.revision=before.revision+1;
  const op={id:request.operation_id,request_hash:requestHash,revision:next.revision};next.operations=[...before.operations,op];
  next.events.push({id:request.operation_id,type:'snapshot-reinstated',at:request.at,description:'Reinstated historical revision '+snapshot.dossier.revision+' ('+snapshot.sha256+'). Previous revision '+before.revision+' ('+current.sha256+') retained in history. Reason: '+request.reason,subject_ids:[]});
  checkModel(next);verifyArtifacts(directory,next);const bytes=bytesFor(next);if(bytes.length>MAX_CORE_BYTES)throw Error('Dossier exceeds size limit');
  const history=path.join(directory,'.history');if(fs.existsSync(history)&&fs.lstatSync(history).isSymbolicLink())throw Error('Unsafe history path');fs.mkdirSync(history,{recursive:true});
  const backup=path.join(history,before.revision+'-'+current.sha256+'.json'),oldBytes=regularFile(current.file);if(sha(oldBytes)!==current.sha256)throw Error('Current project changed during restoration');
  if(fs.existsSync(backup)){if(sha(regularFile(backup))!==current.sha256)throw Error('Backup collision');}else writeExclusive(backup,oldBytes);
  onStage('after-backup');temp=path.join(directory,'.pending-'+randomUUID()+'.json');writeExclusive(temp,bytes);if(sha(regularFile(temp))!==sha(bytes))throw Error('Pending restoration mismatch');
  onStage('before-rename');if(readCore(directory,request.project_id).sha256!==current.sha256)throw Error('Current project changed before restoration commit');verifyArtifacts(directory,next);for(const id of removedSourceArtifacts(next)){const artifact=next.artifacts.find(a=>a.id===id);if(fs.existsSync(localFile(directory,artifact.location)))throw Error('Removed source content reappeared before restoration commit');}
  fs.renameSync(temp,current.file);temp=null;onStage('after-rename');if(readCore(directory,request.project_id).sha256!==sha(bytes))throw Error('Restored state mismatch');return receipt(op);
 }finally{if(temp&&fs.existsSync(temp))fs.unlinkSync(temp);unlock();}
}
