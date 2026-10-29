import fs from 'node:fs';
import path from 'node:path';
import {checkModel} from './model.mjs';
import {safeDirectory,regularFile,sha} from './store.mjs';
const pattern=/^([1-9][0-9]*)-([a-f0-9]{64})\.json$/;
function location(dir,id){if(typeof id!=='string'||!id)throw Error('Expected project ID required');const directory=safeDirectory(dir),history=path.join(directory,'.history');if(fs.existsSync(history)&&(!fs.lstatSync(history).isDirectory()||fs.lstatSync(history).isSymbolicLink()))throw Error('Unsafe history directory');return {directory,history};}
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
