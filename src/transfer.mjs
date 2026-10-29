import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {checkModel} from './model.mjs';
import {safeDirectory,readCore,regularFile,localFile,sha,bytesFor,writeExclusive} from './store.mjs';
import {readSnapshot} from './history.mjs';
import {resumeProject} from './dossier.mjs';

const LIMIT=64*1024*1024;
export function exportCore(dir,id,destination,revision=null) {
  const current=readCore(dir,id),target=safeDirectory(destination,true);
  let bytes=regularFile(current.file),data=current.dossier;
  if(sha(bytes)!==current.sha256)throw Error('Project changed during export; reread before retrying');
  if(revision!==null&&revision!==data.revision){
    if(!Number.isInteger(revision)||revision<1)throw Error('Invalid snapshot revision');
    const snapshot=readSnapshot(dir,id,revision);bytes=snapshot.bytes;data=snapshot.dossier;
  }
  return exportSelected(current.directory,id,target,bytes,data);
}
export function exportSnapshot(dir,id,destination,revision){
  const snapshot=readSnapshot(dir,id,revision),target=safeDirectory(destination,true);
  return exportSelected(snapshot.directory,id,target,snapshot.bytes,snapshot.dossier);
}
function exportSelected(directory,id,target,bytes,data){
  const files=[{path:'project.json',bytes}],references=[];let total=bytes.length;
  for(const a of data.artifacts){
    if(a.storage==='external'){references.push({artifact_id:a.id,location:a.location,reason:'external; access must be re-established'});continue;}
    const location=localFile(directory,a.location);
    if(a.availability!=='available'||!fs.existsSync(location)){references.push({artifact_id:a.id,location:a.location,reason:'missing or not recorded as available'});continue;}
    const content=regularFile(location,16*1024*1024);
    if(sha(content)!==a.sha256)throw Error('Artifact changed since recorded: '+a.id);
    if(!files.some(f=>f.path===a.location)){total+=content.length;if(total>LIMIT)throw Error('Export exceeds 64 MiB');files.push({path:a.location,bytes:content});}
  }
  // A manifest is published only after all selected content has passed validation.
  const staging=target+'.staging-'+randomUUID();fs.mkdirSync(staging);
  for(const f of files){const p=path.join(staging,f.path);fs.mkdirSync(path.dirname(p),{recursive:true});writeExclusive(p,f.bytes);}
  const manifest={format:'startkompas-export-v1',project_id:id,revision:data.revision,
    files:files.map(f=>({path:f.path,sha256:sha(f.bytes),size:f.bytes.length})),references};
  writeExclusive(path.join(staging,'manifest.json'),bytesFor(manifest));
  fs.renameSync(staging,target);
  return {directory:target,manifest};
}
export function restoreCore(bundle,expectedId,destination) {
  const source=safeDirectory(bundle),target=safeDirectory(destination,true);
  const manifest=JSON.parse(regularFile(path.join(source,'manifest.json')));
  if(manifest.format!=='startkompas-export-v1'||manifest.project_id!==expectedId||!Array.isArray(manifest.files)||manifest.files.length>10001)throw Error('Invalid export manifest or project identity');
  const seen=new Set(),files=[];let total=0;
  for(const f of manifest.files){
    if(!f||typeof f.path!=='string'||seen.has(f.path))throw Error('Invalid/duplicate manifest path');seen.add(f.path);
    const file=f.path==='project.json'?path.join(source,f.path):localFile(source,f.path);
    const bytes=regularFile(file,f.path==='project.json'?4*1024*1024:16*1024*1024);
    total+=bytes.length;if(total>LIMIT||sha(bytes)!==f.sha256||bytes.length!==f.size)throw Error('Export integrity mismatch');files.push({path:f.path,bytes});
  }
  const project=files.find(f=>f.path==='project.json');if(!project)throw Error('Export has no project');
  const data=checkModel(JSON.parse(project.bytes));
  if(data.project_id!==expectedId||data.revision!==manifest.revision)throw Error('Export identity/revision mismatch');
  for(const f of files)if(f.path!=='project.json'&&!data.artifacts.some(a=>a.storage==='local'&&a.location===f.path&&a.sha256===sha(f.bytes)))throw Error('File is not an identified artifact');
  if(!Array.isArray(manifest.references))throw Error('Missing external/missing references');
  const refIds=new Set();
  for(const ref of manifest.references){
    const a=data.artifacts.find(a=>a.id===ref.artifact_id);
    if(!a||refIds.has(a.id)||ref.location!==a.location||typeof ref.reason!=='string'||!ref.reason.trim()||files.some(f=>f.path===a.location))throw Error('Invalid external/missing reference');
    refIds.add(a.id);
  }
  for(const a of data.artifacts)if(!files.some(f=>a.storage==='local'&&f.path===a.location)&&!refIds.has(a.id))throw Error('Export silently omits an artifact');
  const staging=target+'.staging-'+randomUUID();fs.mkdirSync(staging);
  for(const f of files){const p=path.join(staging,f.path);fs.mkdirSync(path.dirname(p),{recursive:true});writeExclusive(p,f.bytes);}
  // Keep restoration provenance separate from the unchanged canonical snapshot.
  writeExclusive(path.join(staging,'restore-manifest.json'),bytesFor(manifest));
  fs.renameSync(staging,target);
  return {...readCore(target,expectedId),references:manifest.references};
}
export function migrateLegacy(dir,id,destination) {
  const legacy=resumeProject(dir,id),target=safeDirectory(destination,true),old=legacy.dossier;
  const original=regularFile(legacy.file);
  if(sha(original)!==legacy.sha256)throw Error('Legacy source changed during migration; reread before retrying');
  const migration=bytesFor({from:'sk09-v1',to:'1.0.0',source_sha256:sha(original),
    id_map:[{kind:'fact',old_id:old.fact.id,new_id:'legacy-fact'},{kind:'decision',old_id:old.decision.id,new_id:'legacy-decision'}],
    limitations:['No new business facts or validation claimed','Next-action applicability and basis were not known in legacy format'],original_file:'files/legacy-sk09.json'});
  const data={schema_version:'1.0.0',project_id:old.project_id,revision:1,name:old.name,
    skill_version:'0.1.0-dev',module_versions:[],profile:[],assumptions:[],
    sources:[{id:'legacy-source',title:'Original fact source',location:old.fact.source,scope:'Imported source statement; not independently revalidated',accessed_at:null}],
    facts:[{id:'legacy-fact',text:old.fact.text,assertion:old.fact.status,source_ids:['legacy-source']}],
    decisions:[{id:'legacy-decision',text:old.decision.text,reason:old.decision.reason,basis_ids:['legacy-fact'],status:'active',supersedes:null}],
    tasks:[{id:'legacy-next',title:old.next_action,applicability:'unknown',progress:'open',substantiation:'unreviewed',basis_kind:'unknown',evidence_ids:[],period:null,depends_on:[]}],
    checks:[],artifacts:[
      {id:'legacy-original',version:'sk09-v1',storage:'local',location:'files/legacy-sk09.json',availability:'available',sha256:sha(original)},
      {id:'legacy-mapping',version:'1',storage:'local',location:'files/migration.json',availability:'available',sha256:sha(migration)}
    ],evidence:[],events:[{id:'legacy-import',type:'migration',at:new Date().toISOString(),description:'Explicit copy from sk09-v1; original IDs mapped in files/migration.json and original bytes retained.',subject_ids:['legacy-fact','legacy-decision','legacy-next']}],operations:[],active_task_id:'legacy-next'};
  checkModel(data);
  const staging=target+'.staging-'+randomUUID();fs.mkdirSync(staging);
  writeExclusive(path.join(staging,'project.json'),bytesFor(data));
  fs.mkdirSync(path.join(staging,'files'));
  writeExclusive(path.join(staging,'files/legacy-sk09.json'),original);
  writeExclusive(path.join(staging,'files/migration.json'),migration);
  if(sha(regularFile(legacy.file))!==sha(original))throw Error('Legacy source changed during migration');
  fs.renameSync(staging,target);return readCore(target,id);
}
