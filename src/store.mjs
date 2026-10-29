import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import {checkModel,canonical,COLLECTIONS,MAX_CORE_BYTES} from './model.mjs';
import {applyInvalidation} from './change-rules.mjs';

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
export function readCore(dir,expectedId) {
  if(typeof expectedId!=='string'||!expectedId)throw Error('Expected project ID required');
  const directory=safeDirectory(dir),file=path.join(directory,'project.json'),bytes=regularFile(file);
  const dossier=checkModel(JSON.parse(bytes));
  if(dossier.project_id!==expectedId)throw Error('Project identity mismatch');
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
  const {directory}=readCore(dir,expectedId),location=path.join(directory,'.writer-lock');
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
    if(prior){if(prior.request_hash!==requestHash)throw Error('Operation ID reused with different content');return receipt(prior);}
    if(before.revision!==request.expected_revision)throw Error('Stale expected revision');
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
