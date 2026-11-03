import fs from 'node:fs';
import path from 'node:path';
import {checkModel,canonical,COLLECTIONS} from './model.mjs';
import {affected} from './dependencies.mjs';
import {restorationInvalidatedIds} from './change-rules.mjs';
import {assertNoPendingRemoval,safeDirectory,regularFile,sha,readCore,damagedArtifacts,removedSourceArtifacts,localFile} from './store.mjs';
const pattern=/^([1-9][0-9]*)-([a-f0-9]{64})\.json$/;
function location(dir,id){if(typeof id!=='string'||!id)throw Error('Expected project ID required');const directory=safeDirectory(dir);assertNoPendingRemoval(directory);const history=path.join(directory,'.history');if(fs.existsSync(history)&&(!fs.lstatSync(history).isDirectory()||fs.lstatSync(history).isSymbolicLink()))throw Error('Unsafe history directory');return {directory,history};}
function readEntry(directory,history,name,id){const match=pattern.exec(name);if(!match)throw Error('Unrecognized snapshot filename');const bytes=regularFile(path.join(history,name));if(sha(bytes)!==match[2])throw Error('Snapshot hash mismatch');const dossier=checkModel(JSON.parse(bytes));if(dossier.project_id!==id||dossier.revision!==Number(match[1]))throw Error('Snapshot identity/revision mismatch');return {directory,file:path.join(history,name),bytes,dossier,sha256:match[2]};}
export function readSnapshot(dir,id,revision){
 if(!Number.isSafeInteger(revision)||revision<1)throw Error('Invalid snapshot revision');const {directory,history}=location(dir,id);if(!fs.existsSync(history))throw Error('No saved history');
 const matches=fs.readdirSync(history).filter(n=>pattern.test(n)&&Number(pattern.exec(n)[1])===revision);if(matches.length!==1)throw Error('Snapshot missing or ambiguous');return readEntry(directory,history,matches[0],id);
}
export function listHistory(dir,id,{limit=50}={}){
 if(!Number.isInteger(limit)||limit<1||limit>100)throw Error('Invalid history limit');const {directory,history}=location(dir,id);
 const names=fs.existsSync(history)?fs.readdirSync(history):[],recognized=names.filter(n=>pattern.test(n)).sort((a,b)=>Number(pattern.exec(b)[1])-Number(pattern.exec(a)[1])||a.localeCompare(b));
 const counts=new Map();for(const n of recognized){const rev=Number(pattern.exec(n)[1]);counts.set(rev,(counts.get(rev)||0)+1);}
 const snapshots=recognized.slice(0,limit).map(name=>{const revision=Number(pattern.exec(name)[1]);try{const s=readEntry(directory,history,name,id);return {revision,sha256:s.sha256,name:s.dossier.name,valid:true,ambiguous:counts.get(revision)>1};}catch(e){return {revision,valid:false,ambiguous:counts.get(revision)>1,error:e.message};}});
 return {project_id:id,snapshots,total_candidates:recognized.length,truncated:recognized.length>limit,unrecognized_entries:names.length-recognized.length,limitations:['Only saved historical revisions; current project.json is not read or repaired','Snapshot hashes check integrity, not authenticity or substantive correctness','Artifact availability is checked during export; history is not an independent backup']};
}


// Reinstatement must never undo a recorded privacy removal.
export function snapshotRestorationCandidate(before,historical){
 const next=structuredClone(historical),removed=removedSourceArtifacts(before);
 for(const id of removed){const tombstone=before.artifacts.find(a=>a.id===id),old=next.artifacts.find(a=>a.id===id);if(old&&canonical({...old,availability:'missing'})!==canonical(tombstone))throw Error('Historical removal target identity changed');if(old)old.availability='missing';else next.artifacts.push(structuredClone(tombstone));}
 for(const event of before.events.filter(e=>e.type==='source-removal')){const old=next.events.find(e=>e.id===event.id);if(old&&canonical(old)!==canonical(event))throw Error('Historical removal event identity changed');if(!old)next.events.push(structuredClone(event));}
 const retained=[...removedSourceArtifacts(next)],invalidated=retained.length?affected(next,retained):[];
 const review_required_ids=[...new Set([...restorationInvalidatedIds(before,next),...invalidated])].sort(),reviewIds=new Set(review_required_ids);
 if(next.workflow)next.workflow.invalidated_ids=review_required_ids;
 for(const task of [...next.tasks,...next.checks])if(reviewIds.has(task.id))task.substantiation='stale';
 checkModel(next);return {dossier:next,review_required_ids,privacy:{removed_artifact_ids:retained,removal_event_ids:next.events.filter(e=>e.type==='source-removal').map(e=>e.id),invalidated_ids:invalidated}};
}

// Read-only preparation for a dedicated, reviewed snapshot-reinstatement transaction.
// Ordinary updateCore deliberately keeps its append-only contract.
export function previewSnapshotRestore(dir,request){
 const keys=['project_id','expected_revision','expected_sha256','snapshot_revision','snapshot_sha256','reason'];
 if(!request||typeof request!=='object'||Array.isArray(request)||Object.keys(request).length!==keys.length||keys.some(key=>!Object.hasOwn(request,key))||typeof request.project_id!=='string'||!/^[a-z0-9][a-z0-9-]{0,63}$/.test(request.project_id)||!['expected_revision','snapshot_revision'].every(key=>Number.isSafeInteger(request[key])&&request[key]>0)||!['expected_sha256','snapshot_sha256'].every(key=>typeof request[key]==='string'&&/^[a-f0-9]{64}$/.test(request[key]))||typeof request.reason!=='string'||!request.reason.trim()||request.reason.length>3000)throw Error('Invalid snapshot restoration review request');
 const current=readCore(dir,request.project_id),before=current.dossier;
 if(before.revision!==request.expected_revision||current.sha256!==request.expected_sha256)throw Error('Current project changed; prepare a fresh restoration review');
 if(request.snapshot_revision>=before.revision)throw Error('Choose an earlier historical revision');
 const snapshot=readSnapshot(dir,request.project_id,request.snapshot_revision),historical=snapshot.dossier;
 if(snapshot.sha256!==request.snapshot_sha256)throw Error('Historical snapshot changed; inspect it again');
 const candidate=snapshotRestorationCandidate(before,historical),restored=candidate.dossier;
 const changes=COLLECTIONS.map(group=>{const now=new Map(before[group].map(row=>[row.id,row])),then=new Map(restored[group].map(row=>[row.id,row]));return {group,restored_ids:[...then.keys()].filter(id=>!now.has(id)),changed_ids:[...then.keys()].filter(id=>now.has(id)&&canonical(now.get(id))!==canonical(then.get(id))),history_only_ids:[...now.keys()].filter(id=>!then.has(id))};}).filter(row=>row.restored_ids.length||row.changed_ids.length||row.history_only_ids.length);
 const metadata=['name','active_task_id','skill_version','module_versions','workflow'].filter(key=>canonical(before[key])!==canonical(restored[key]));
 const unavailable=damagedArtifacts(current.directory,restored),blockers=[];
 const archived=d=>d.events.filter(e=>['project-archived','project-restored'].includes(e.type)).at(-1)?.type==='project-archived',practice=d=>d.events.some(e=>e.type==='practice-project');
 const project_state={current_archived:archived(before),historical_archived:archived(historical),current_practice:practice(before),historical_practice:practice(historical)};
 if(project_state.current_practice&&!project_state.historical_practice)blockers.push('Historical snapshot predates the permanent practice label. Restoration cannot remove that label.');
 if(before.schema_version!==historical.schema_version)blockers.push('Snapshot schema differs from the current project. No implicit downgrade is allowed.');
 if(candidate.privacy.removed_artifact_ids.some(id=>fs.existsSync(localFile(current.directory,restored.artifacts.find(a=>a.id===id).location))))blockers.push('Previously removed source content has reappeared on disk. Inspect it before restoration; no content was deleted or restored.');
 if(unavailable.length)blockers.push('Historical local artifact content is missing or changed. Reinstatement cannot recreate it.');
 const references=restored.artifacts.filter(artifact=>artifact.storage==='external'||artifact.availability!=='available').map(artifact=>({artifact_id:artifact.id,storage:artifact.storage,availability:artifact.availability}));
 return {format:'startkompas-snapshot-restore-review-v1',project_id:before.project_id,current_revision:before.revision,current_sha256:current.sha256,snapshot_revision:historical.revision,snapshot_sha256:snapshot.sha256,proposed_revision:before.revision+1,reason:request.reason,project_state,privacy:candidate.privacy,review_required_ids:candidate.review_required_ids,changed_metadata:metadata,collections:changes,unavailable_artifact_ids:unavailable,unresolved_references:references,blockers,write_available:blockers.length===0,limitations:['Read-only review; no project, history, files or operation receipts were changed.','A confirmed reinstatement retains the current snapshot and all existing artifact files, preserves operation receipts, and creates a new explained revision.','Records listed as history-only would leave the active dossier but remain in its saved prior revision.','Recorded privacy removals override historical availability. Deleted bytes are never recreated; dependent work requires review.', 'Existing review requirements survive restoration. Changed or reintroduced records and their declared dependents require review; historical evidence is not new validation.','This preview does not authorize a write and cannot be submitted to the ordinary append-only update command.']};
}
