import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {checkModel,canonical} from '../src/model.mjs';
import {createCore,readCore,updateCore,attachFile,sha,releaseAbandonedLock} from '../src/store.mjs';
import {exportCore,restoreCore,migrateLegacy} from '../src/transfer.mjs';
import {handoff} from '../src/handoff.mjs';
import {createProject} from '../src/dossier.mjs';
const fixture=JSON.parse(fs.readFileSync(new URL('../examples/dossier-v1.json',import.meta.url)));
const oldFixture=JSON.parse(fs.readFileSync(new URL('../examples/sk09-input.json',import.meta.url)));
const cli=fileURLToPath(new URL('../src/core-cli.mjs',import.meta.url));
const storeUrl=new URL('../src/store.mjs',import.meta.url).href;
function setup(t){const base=fs.mkdtempSync(path.join(os.tmpdir(),'startkompas-core-'));t.after(()=>fs.rmSync(base,{recursive:true,force:true}));const dir=path.join(base,'project');createCore(dir,structuredClone(fixture));return {base,dir};}
const request=(changes={},revision=1,id='op-1')=>({project_id:fixture.project_id,expected_revision:revision,operation_id:id,changes});
const run=(...args)=>spawnSync(process.execPath,[cli,...args],{encoding:'utf8',timeout:20000});

test('SK11 schema is nonmutating, empty profile has no business defaults',()=>{
  const data=structuredClone(fixture),before=canonical(data);checkModel(data);assert.equal(canonical(data),before);
  assert.deepEqual(data.profile,[]);
  for(const mutate of [x=>x.schema_version='future',x=>x.revision='1',x=>x.risk_tolerance='medium',x=>x.facts[0].source_ids=[],x=>x.decisions[0].reason=' ',x=>x.tasks[0].id='fact-1',x=>x.active_task_id='missing']){
    const bad=structuredClone(data);mutate(bad);assert.throws(()=>checkModel(bad));
  }
});
test('SK11 sourced medium risk and 90-day values are accepted, unknown values stay null',()=>{
  const data=structuredClone(fixture);
  data.profile=[{id:'p-risk',key:'risk_tolerance',value:'medium',assertion:'reported',source_ids:['source-1']},{id:'p-horizon',key:'horizon_days',value:90,assertion:'reported',source_ids:['source-1']},{id:'p-budget',key:'budget',value:null,assertion:'unknown',source_ids:[]}];
  checkModel(data);assert.equal(data.profile[1].value,90);data.profile[2].value=0;assert.throws(()=>checkModel(data),/Unknown profile/);
});
test('SK12 deferral does not remove applicability or turn evidence into support',()=>{
  const data=structuredClone(fixture);const task=data.tasks[0];task.progress='deferred';checkModel(data);assert.equal(task.applicability,'applies');
  task.substantiation='supported';assert.throws(()=>checkModel(data),/supporting evidence/);
  data.artifacts=[{id:'art-1',version:'1',storage:'external',location:'https://example.invalid/evidence',availability:'unknown',sha256:null}];
  data.evidence=[{id:'e-1',artifact_id:'art-1',subject_id:'task-1',subject_version:'1',environment:'synthetic',date:'2026-10-27',reviewer:'synthetic reviewer',scope:'guide only',result:'supports',period:'pilot-round-2'}];
  task.evidence_ids=['e-1'];assert.throws(()=>checkModel(data),/period/);data.evidence[0].period='pilot-round-1';checkModel(data);
  data.evidence[0].result='unreviewed';assert.throws(()=>checkModel(data),/supporting evidence/);
});
test('SK11 future schema read rejects without rewriting',t=>{
  const {dir}=setup(t),file=path.join(dir,'project.json');const future={...fixture,schema_version:'2.0.0'};fs.writeFileSync(file,JSON.stringify(future));const before=fs.readFileSync(file);assert.equal(run('read',dir,fixture.project_id).status,1);assert.deepEqual(fs.readFileSync(file),before);
});
test('SK13 idempotency, changed-ID payload, stale revision and wrong project',t=>{
  const {dir}=setup(t),r=request({name:'Corrected synthetic name'}),first=updateCore(dir,r);
  assert.deepEqual(first,{project_id:fixture.project_id,operation_id:'op-1',revision:2});
  const before=fs.readFileSync(path.join(dir,'project.json'));
  assert.deepEqual(updateCore(dir,r),first);assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);
  assert.throws(()=>updateCore(dir,{...r,changes:{name:'other'}}),/different content/);
  assert.throws(()=>updateCore(dir,request({},1,'op-2')),/Stale/);
  assert.throws(()=>updateCore(dir,{...request({},2,'op-2'),project_id:'wrong'}),/identity/);
  updateCore(dir,request({name:'Third revision'},2,'op-2'));assert.deepEqual(updateCore(dir,r),first);
});
test('SK13 second process cannot write while first owns lock',t=>{
  const {dir,base}=setup(t),other=path.join(base,'request.json');fs.writeFileSync(other,JSON.stringify(request({},1,'op-other')));
  updateCore(dir,request({name:'Locked update'}),{onStage(stage){if(stage==='before-rename'){const child=run('update',dir,other);assert.equal(child.status,1);assert.match(child.stderr,/Writer lock/);}}});
  assert.equal(readCore(dir,fixture.project_id).dossier.revision,2);
});
test('SK13 invalid contents and removal leave old canonical bytes intact',t=>{
  const {dir}=setup(t),before=fs.readFileSync(path.join(dir,'project.json'));
  for(const changes of [{revision:12},{facts:[]},{name:''},{profile:[{id:'x'}]}])assert.throws(()=>updateCore(dir,request(changes)));
  assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);assert.equal(fs.existsSync(path.join(dir,'.writer-lock')),false);
});
for(const stage of ['after-backup','before-rename','after-rename'])test('SK13 real process interruption at '+stage,t=>{
  const {dir,base}=setup(t),file=path.join(base,'request.json');const r=request({name:'Interrupted update'});fs.writeFileSync(file,JSON.stringify(r));
  const code=`import fs from 'node:fs';import {updateCore} from ${JSON.stringify(storeUrl)};updateCore(${JSON.stringify(dir)},JSON.parse(fs.readFileSync(${JSON.stringify(file)})),{onStage(s){if(s===${JSON.stringify(stage)})process.exit(86)}});`;
  const child=spawnSync(process.execPath,['--input-type=module','-e',code],{encoding:'utf8',timeout:20000});assert.equal(child.status,86,child.stderr);
  const state=readCore(dir,fixture.project_id);assert.equal(state.dossier.revision,stage==='after-rename'?2:1);
  assert.equal(state.dossier.operations.length,stage==='after-rename'?1:0);
  const owner=JSON.parse(fs.readFileSync(path.join(dir,'.writer-lock','owner.json')));
  assert.throws(()=>releaseAbandonedLock(dir,fixture.project_id,'wrong'),/owner/);
  releaseAbandonedLock(dir,fixture.project_id,owner.token);
  const receipt=updateCore(dir,r);assert.equal(receipt.revision,2);assert.equal(readCore(dir,fixture.project_id).dossier.operations.length,1);
});
test('SK14 attachment, export and recovery work with original directory unavailable',t=>{
  const {dir,base}=setup(t),file=path.join(base,'guide.txt');fs.writeFileSync(file,'Synthetic interview guide');
  const a={id:'guide',version:'1',storage:'local',location:'files/guide.txt',availability:'available',sha256:sha(fs.readFileSync(file))};
  const external={id:'external-guide',version:'unknown',storage:'external',location:'https://example.invalid/guide',availability:'unknown',sha256:null};
  attachFile(dir,request({artifacts:[a,external]}),file);
  const bundle=path.join(base,'bundle');const result=exportCore(dir,fixture.project_id,bundle);assert.equal(result.manifest.references.length,1);
  fs.renameSync(dir,path.join(base,'unavailable-original'));fs.unlinkSync(file);
  const restored=restoreCore(bundle,fixture.project_id,path.join(base,'restored'));
  assert.equal(restored.dossier.revision,2);assert.equal(fs.readFileSync(path.join(restored.directory,'files/guide.txt'),'utf8'),'Synthetic interview guide');
  assert.equal(handoff(restored.directory,fixture.project_id).artifacts[0].actual,'hash_matches');
});
test('SK14 earlier snapshot restores after a valid but mistaken update',t=>{
  const {dir,base}=setup(t);updateCore(dir,request({name:'Mistaken name'}));const bundle=path.join(base,'old-snapshot');exportCore(dir,fixture.project_id,bundle,1);
  const restored=restoreCore(bundle,fixture.project_id,path.join(base,'restored'));assert.equal(restored.dossier.name,fixture.name);assert.equal(readCore(dir,fixture.project_id).dossier.name,'Mistaken name');
});
test('SK14 tampered bundle, wrong identity, traversal and existing destination reject',t=>{
  const {dir,base}=setup(t),bundle=path.join(base,'bundle'),dest=path.join(base,'restore');exportCore(dir,fixture.project_id,bundle);
  assert.throws(()=>restoreCore(bundle,'wrong',dest),/identity/);assert.throws(()=>restoreCore(bundle,fixture.project_id,dir),/exists/);
  const manifestPath=path.join(bundle,'manifest.json'),manifest=JSON.parse(fs.readFileSync(manifestPath));
  fs.writeFileSync(manifestPath,JSON.stringify({...manifest,files:[...manifest.files,{path:'../escape',sha256:'x',size:1}]}));assert.throws(()=>restoreCore(bundle,fixture.project_id,dest),/Unsafe/);
  fs.writeFileSync(manifestPath,JSON.stringify(manifest));fs.appendFileSync(path.join(bundle,'project.json'),' ');assert.throws(()=>restoreCore(bundle,fixture.project_id,dest),/integrity/);assert.equal(fs.existsSync(dest),false);
});
test('SK14 missing local file is explicitly listed, not fabricated on restore',t=>{
  const {dir,base}=setup(t),a={id:'missing-guide',version:'1',storage:'local',location:'files/missing.txt',availability:'missing',sha256:null};
  updateCore(dir,request({artifacts:[a]}));const bundle=path.join(base,'bundle');const exported=exportCore(dir,fixture.project_id,bundle);assert.match(exported.manifest.references[0].reason,/missing/);
  const restored=restoreCore(bundle,fixture.project_id,path.join(base,'restored'));assert.equal(handoff(restored.directory,fixture.project_id).artifacts[0].actual,'missing');
});
test('SK14 legacy migration preserves source bytes and provenance on explicit copy',t=>{
  const {base}=setup(t),oldDir=path.join(base,'old'),target=path.join(base,'migrated');createProject(oldDir,oldFixture);const before=fs.readFileSync(path.join(oldDir,'project.json'));
  const result=migrateLegacy(oldDir,oldFixture.project_id,target);assert.deepEqual(fs.readFileSync(path.join(oldDir,'project.json')),before);assert.deepEqual(fs.readFileSync(path.join(target,'files/legacy-sk09.json')),before);
  assert.equal(result.dossier.facts[0].text,oldFixture.fact.text);assert.equal(result.dossier.facts[0].assertion,oldFixture.fact.status);assert.equal(result.dossier.decisions[0].reason,oldFixture.decision.reason);assert.deepEqual(result.dossier.profile,[]);
  assert.equal(result.dossier.tasks[0].basis_kind,'unknown');assert.equal(result.dossier.tasks[0].applicability,'unknown');
  assert.throws(()=>migrateLegacy(oldDir,oldFixture.project_id,target),/exists/);
  const bundle=path.join(base,'migrated-export');exportCore(target,oldFixture.project_id,bundle);
  const restored=restoreCore(bundle,oldFixture.project_id,path.join(base,'migrated-restored'));
  assert.deepEqual(fs.readFileSync(path.join(restored.directory,'files/legacy-sk09.json')),before);
});
test('SK15 growing records, targeted old retrieval, equal names and persisted handoff',t=>{
  const {dir,base}=setup(t),data=readCore(dir,fixture.project_id).dossier;
  for(let i=0;i<150;i++)data.facts.push({id:'old-'+i,text:'Historical record '+i,assertion:'reported',source_ids:['source-1']});
  updateCore(dir,request({facts:data.facts}));const summary=handoff(dir,fixture.project_id,{limit:5});assert.equal(summary.retrieval.truncated,true);assert.equal(summary.retrieval.returned,5);
  const found=handoff(dir,fixture.project_id,{query:'Historical record 149'});assert.equal(found.retrieval.records[0].id,'old-149');
  const other={...structuredClone(fixture),project_id:'another-id'};createCore(path.join(base,'other'),other);assert.throws(()=>handoff(dir,'another-id'),/identity/);
  const output=path.join(base,'handoff.json');const before=fs.readFileSync(path.join(dir,'project.json'));assert.equal(run('save-handoff',dir,fixture.project_id,output).status,0);assert.equal(JSON.parse(fs.readFileSync(output)).revision,2);assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);
});
test('SK11 local paths and duplicate profile keys are rejected',()=>{
  for(const location of ['../escape','files/../../escape','C:/escape','files//x','files/./x']){const x=structuredClone(fixture);x.artifacts=[{id:'art',version:'1',storage:'local',location,availability:'missing',sha256:null}];assert.throws(()=>checkModel(x));}
  const x=structuredClone(fixture);x.profile=[{id:'p-1',key:'same',value:null,assertion:'unknown',source_ids:[]},{id:'p-2',key:'same',value:null,assertion:'unknown',source_ids:[]}];assert.throws(()=>checkModel(x),/Duplicate profile/);
});
test('SK13 attachment retry is idempotent and recorded artifacts cannot be rewritten',t=>{
  const {dir,base}=setup(t),file=path.join(base,'guide');fs.writeFileSync(file,'immutable bytes');
  const a={id:'a-1',version:'1',storage:'local',location:'files/guide.txt',availability:'available',sha256:sha(fs.readFileSync(file))};const r=request({artifacts:[a]});
  const first=attachFile(dir,r,file);fs.unlinkSync(file);assert.deepEqual(attachFile(dir,r,file),first);
  assert.throws(()=>updateCore(dir,request({artifacts:[{...a,version:'2'}]},2,'op-next')),/append-only/);
});
test('SK14 silent artifact omission and local path aliases are rejected',t=>{
  const {dir,base}=setup(t),a={id:'a-1',version:'1',storage:'local',location:'files/absent.txt',availability:'missing',sha256:null};updateCore(dir,request({artifacts:[a]}));
  const bundle=path.join(base,'bundle');exportCore(dir,fixture.project_id,bundle);const p=path.join(bundle,'manifest.json'),m=JSON.parse(fs.readFileSync(p));m.references=[];fs.writeFileSync(p,JSON.stringify(m));assert.throws(()=>restoreCore(bundle,fixture.project_id,path.join(base,'restore')),/silently omits/);
  const d=structuredClone(fixture);d.artifacts=[a,{...a,id:'a-2',location:'files/ABSENT.txt'}];assert.throws(()=>checkModel(d),/Duplicate local/);
});
test('SK13 exception before rename preserves old state and releases lock',t=>{
  const {dir}=setup(t),before=fs.readFileSync(path.join(dir,'project.json'));
  assert.throws(()=>updateCore(dir,request({name:'Never committed'}),{onStage(stage){if(stage==='before-rename')throw Error('injected I/O failure');}}),/injected/);
  assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);assert.equal(fs.existsSync(path.join(dir,'.writer-lock')),false);
});
test('SK15 bounded summary reports omitted tasks, and handoff cannot leak into source',t=>{
  const {dir,base}=setup(t),tasks=Array.from({length:30},(_,i)=>({...fixture.tasks[0],id:'task-'+(i+1)}));updateCore(dir,request({tasks}));const s=handoff(dir,fixture.project_id,{limit:3});assert.equal(s.open_tasks.length,3);assert.equal(s.summary.truncated,true);assert.equal(s.summary.totals.open_tasks,30);
  const output=fileURLToPath(new URL('../should-not-exist-private-handoff.json',import.meta.url));assert.equal(run('save-handoff',dir,fixture.project_id,output).status,1);assert.equal(fs.existsSync(output),false);
});
