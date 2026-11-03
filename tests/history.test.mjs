import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {createCore,updateCore,readCore,attachFile,sha} from '../src/store.mjs';import {listHistory,readSnapshot} from '../src/history.mjs';import {exportSnapshot,restoreCore} from '../src/transfer.mjs';
const seed=()=>JSON.parse(fs.readFileSync(new URL('../examples/dossier-v1.1.json',import.meta.url)));
function setup(){const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk14-history-')),dir=path.join(root,'project');createCore(dir,seed());return {root,dir};}
const change=(dir,revision=1)=>updateCore(dir,{project_id:'pilot-orbit',expected_revision:revision,operation_id:'change-'+revision,changes:{name:'Name '+revision}});
test('history lists validated snapshots newest first and honestly reports truncation without writing',()=>{const {dir}=setup();change(dir);change(dir,2);const bytes=fs.readFileSync(path.join(dir,'project.json')),r=listHistory(dir,'pilot-orbit',{limit:1});assert.equal(r.snapshots[0].revision,2);assert.equal(r.snapshots[0].valid,true);assert.equal(r.total_candidates,2);assert.equal(r.truncated,true);assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),bytes);assert.equal(readSnapshot(dir,'pilot-orbit',1).dossier.name,seed().name);});
test('corrupt current dossier can recover exact historic bytes into a separate new directory',()=>{const {root,dir}=setup();change(dir);const old=readSnapshot(dir,'pilot-orbit',1).bytes;fs.writeFileSync(path.join(dir,'project.json'),'{broken');const bundle=path.join(root,'bundle');exportSnapshot(dir,'pilot-orbit',bundle,1);const restored=restoreCore(bundle,'pilot-orbit',path.join(root,'recovered'));assert.deepEqual(fs.readFileSync(restored.file),old);assert.equal(fs.readFileSync(path.join(dir,'project.json'),'utf8'),'{broken');assert.equal(listHistory(dir,'pilot-orbit').snapshots[0].valid,true);});
test('snapshot hash tampering and wrong project are rejected before export publication',()=>{const {root,dir}=setup();change(dir);assert.equal(listHistory(dir,'other').snapshots[0].valid,false);assert.throws(()=>exportSnapshot(dir,'other',path.join(root,'wrong'),1),/identity/);const f=readSnapshot(dir,'pilot-orbit',1).file;fs.appendFileSync(f,' ');assert.equal(listHistory(dir,'pilot-orbit').snapshots[0].valid,false);assert.throws(()=>exportSnapshot(dir,'pilot-orbit',path.join(root,'bad'),1),/hash/);assert.ok(!fs.existsSync(path.join(root,'bad')));});
test('ambiguous snapshots never select silently, unrelated entries remain counted',()=>{const {dir}=setup();change(dir);const s=readSnapshot(dir,'pilot-orbit',1),other=Buffer.from(JSON.stringify({...s.dossier,name:'Other'}));fs.writeFileSync(path.join(dir,'.history','1-'+sha(other)+'.json'),other);fs.writeFileSync(path.join(dir,'.history','partial.tmp'),'partial');const h=listHistory(dir,'pilot-orbit');assert.equal(h.unrecognized_entries,1);assert.ok(h.snapshots.every(x=>x.ambiguous));assert.throws(()=>readSnapshot(dir,'pilot-orbit',1),/ambiguous/);});
test('historical attachment bytes are exported and restored; changed bytes refuse export',()=>{const {root,dir}=setup(),file=path.join(root,'note.txt');fs.writeFileSync(file,'historical note');attachFile(dir,{project_id:'pilot-orbit',expected_revision:1,operation_id:'attach',changes:{artifacts:[{id:'note',version:'1',storage:'local',location:'files/note.txt',availability:'available',sha256:sha('historical note')}]}},file);change(dir,2);fs.writeFileSync(path.join(dir,'project.json'),'broken');exportSnapshot(dir,'pilot-orbit',path.join(root,'bundle'),2);restoreCore(path.join(root,'bundle'),'pilot-orbit',path.join(root,'restored'));assert.equal(fs.readFileSync(path.join(root,'restored/files/note.txt'),'utf8'),'historical note');fs.writeFileSync(path.join(dir,'files/note.txt'),'tampered');assert.throws(()=>exportSnapshot(dir,'pilot-orbit',path.join(root,'bad'),2),/Artifact changed/);});
test('missing and external historical artifacts stay explicit references, never silently recovered',()=>{const {root,dir}=setup(),d=readCore(dir,'pilot-orbit').dossier;updateCore(dir,{project_id:d.project_id,expected_revision:1,operation_id:'refs',changes:{artifacts:[{id:'missing',version:'1',storage:'local',location:'files/missing.txt',availability:'missing',sha256:null},{id:'external',version:'1',storage:'external',location:'https://example.invalid',availability:'unknown',sha256:null}]}});change(dir,2);const result=exportSnapshot(dir,'pilot-orbit',path.join(root,'bundle'),2);assert.equal(result.manifest.references.length,2);assert.equal(restoreCore(path.join(root,'bundle'),'pilot-orbit',path.join(root,'restored')).references.length,2);});
test('no history, invalid revisions/limits and existing destinations fail without modifying project',()=>{const {root,dir}=setup();assert.equal(listHistory(dir,'pilot-orbit').total_candidates,0);assert.throws(()=>readSnapshot(dir,'pilot-orbit',1),/No saved/);change(dir);for(const n of [0,-1,1.2,'1',Infinity])assert.throws(()=>readSnapshot(dir,'pilot-orbit',n));assert.throws(()=>listHistory(dir,'pilot-orbit',{limit:101}));assert.throws(()=>exportSnapshot(dir,'pilot-orbit',root,1),/Destination exists/);assert.equal(readCore(dir,'pilot-orbit').dossier.revision,2);});
test('actual CLI discovers and exports history without parsing current dossier',()=>{const {root,dir}=setup();change(dir);fs.writeFileSync(path.join(dir,'project.json'),'broken');const cli=fileURLToPath(new URL('../src/core-cli.mjs',import.meta.url));const run=args=>JSON.parse(execFileSync(process.execPath,[cli,...args],{encoding:'utf8'}));assert.equal(run(['history',dir,'pilot-orbit']).snapshots[0].valid,true);assert.equal(run(['snapshot-export',dir,'pilot-orbit',path.join(root,'bundle'),'1']).manifest.revision,1);});


import {previewSnapshotRestore} from '../src/history.mjs';
test('snapshot restoration review identifies historical changes without rewinding or writing',()=>{
 const {dir}=setup();change(dir);const current=readCore(dir,'pilot-orbit'),snapshot=readSnapshot(dir,'pilot-orbit',1),before=fs.readFileSync(current.file),history=fs.readdirSync(path.join(dir,'.history'));
 const request={project_id:'pilot-orbit',expected_revision:current.dossier.revision,expected_sha256:current.sha256,snapshot_revision:1,snapshot_sha256:snapshot.sha256,reason:'Restore the earlier fictional planning state.'};
 const review=previewSnapshotRestore(dir,request);assert.deepEqual(review.changed_metadata,['name']);assert.equal(review.proposed_revision,3);assert.equal(review.write_available,true);assert.deepEqual(review.blockers,[]);assert.deepEqual(fs.readFileSync(current.file),before);assert.deepEqual(fs.readdirSync(path.join(dir,'.history')),history);
 for(const patch of [{reason:''},{confirmed:true},{expected_sha256:'0'.repeat(64)},{snapshot_sha256:'0'.repeat(64)},{snapshot_revision:2}])assert.throws(()=>previewSnapshotRestore(dir,{...request,...patch}));
 change(dir,2);assert.throws(()=>previewSnapshotRestore(dir,request),/changed/);
});
test('snapshot restoration review distinguishes later records from modified historical records',()=>{
 const {dir}=setup(),initial=readCore(dir,'pilot-orbit');const task={id:'later-task',title:'Later fictional work',applicability:'unknown',progress:'open',substantiation:'unreviewed',basis_kind:'unknown',evidence_ids:[],period:null,depends_on:[]};
 updateCore(dir,{project_id:'pilot-orbit',expected_revision:1,operation_id:'add-later-task',changes:{tasks:[...initial.dossier.tasks,task]}});const current=readCore(dir,'pilot-orbit'),old=readSnapshot(dir,'pilot-orbit',1),review=previewSnapshotRestore(dir,{project_id:'pilot-orbit',expected_revision:2,expected_sha256:current.sha256,snapshot_revision:1,snapshot_sha256:old.sha256,reason:'Inspect older task set.'});assert.deepEqual(review.collections.find(row=>row.group==='tasks').history_only_ids,['later-task']);assert.ok(readCore(dir,'pilot-orbit').dossier.tasks.some(row=>row.id==='later-task'));
});

test('snapshot review refuses inconsistent removal tombstones',()=>{
 const {root,dir}=setup(),file=path.join(root,'note.txt');fs.writeFileSync(file,'historical note');attachFile(dir,{project_id:'pilot-orbit',expected_revision:1,operation_id:'attach',changes:{artifacts:[{id:'note',version:'1',storage:'local',location:'files/note.txt',availability:'available',sha256:sha('historical note')}]}},file);
 const before=readCore(dir,'pilot-orbit');updateCore(dir,{project_id:'pilot-orbit',expected_revision:2,operation_id:'privacy-marker',changes:{events:[...before.dossier.events,{id:'privacy-marker',type:'source-removal',at:'2026-11-03',description:'Synthetic privacy marker: reinstatement must not bypass review.',subject_ids:['note']}]}});
 fs.writeFileSync(path.join(dir,'files/note.txt'),'changed');const current=readCore(dir,'pilot-orbit'),old=readSnapshot(dir,'pilot-orbit',2);assert.throws(()=>previewSnapshotRestore(dir,{project_id:'pilot-orbit',expected_revision:3,expected_sha256:current.sha256,snapshot_revision:2,snapshot_sha256:old.sha256,reason:'Inspect recovery limits.'}),/tombstone mismatch/);assert.equal(fs.readFileSync(path.join(dir,'files/note.txt'),'utf8'),'changed');
});


import {reinstateSnapshot} from '../src/store.mjs';
import {randomUUID} from 'node:crypto';
function restorationRequest(dir,revision=1){const current=readCore(dir,'pilot-orbit'),old=readSnapshot(dir,'pilot-orbit',revision);return {project_id:'pilot-orbit',expected_revision:current.dossier.revision,expected_sha256:current.sha256,snapshot_revision:revision,snapshot_sha256:old.sha256,reason:'Restore the earlier fictional planning state.',operation_id:'restore-'+randomUUID(),at:'2026-11-03'};}
test('historical reinstatement creates a new explained revision retaining prior bytes and operation receipts',()=>{
 const {dir}=setup();change(dir);const previous=readCore(dir,'pilot-orbit'),request=restorationRequest(dir);assert.throws(()=>reinstateSnapshot(dir,request,false),/Confirm/);const receipt=reinstateSnapshot(dir,request,true),current=readCore(dir,'pilot-orbit');assert.equal(receipt.revision,3);assert.equal(current.dossier.name,seed().name);assert.equal(current.dossier.events.at(-1).type,'snapshot-reinstated');assert.match(current.dossier.events.at(-1).description,/Reason: Restore/);assert.equal(readSnapshot(dir,'pilot-orbit',2).sha256,previous.sha256);assert.deepEqual(current.dossier.operations.slice(0,-1),previous.dossier.operations);
 assert.deepEqual(reinstateSnapshot(dir,request,true),receipt);assert.equal(readCore(dir,'pilot-orbit').sha256,current.sha256);assert.throws(()=>reinstateSnapshot(dir,{...request,reason:'Different'},true),/reused/);
 const undo=reinstateSnapshot(dir,restorationRequest(dir,2),true);assert.equal(undo.revision,4);assert.equal(readCore(dir,'pilot-orbit').dossier.name,previous.dossier.name);assert.equal(readSnapshot(dir,'pilot-orbit',3).sha256,current.sha256);
});
test('reinstatement interruptions retain the old or committed revision and retries never duplicate',()=>{
 for(const stage of ['after-backup','before-rename','after-rename']){const {dir}=setup();change(dir);const previous=readCore(dir,'pilot-orbit'),request=restorationRequest(dir);assert.throws(()=>reinstateSnapshot(dir,request,true,{onStage(value){if(value===stage)throw Error('Injected interruption');}}),/Injected/);assert.equal(readCore(dir,'pilot-orbit').dossier.revision,stage==='after-rename'?3:2);assert.equal(readSnapshot(dir,'pilot-orbit',2).sha256,previous.sha256);assert.equal(fs.readdirSync(dir).some(name=>name.startsWith('.pending-')||name==='.writer-lock'),false);assert.equal(reinstateSnapshot(dir,request,true).revision,3);assert.equal(readCore(dir,'pilot-orbit').dossier.operations.filter(op=>op.id===request.operation_id).length,1);}
});
test('reinstatement refuses stale input, concurrent writers and bad dates',()=>{
 const {dir}=setup();change(dir);const request=restorationRequest(dir),before=readCore(dir,'pilot-orbit');assert.throws(()=>reinstateSnapshot(dir,{...request,at:'2026-02-30'},true),/Invalid/);assert.throws(()=>reinstateSnapshot(dir,{...request,expected_sha256:'0'.repeat(64)},true),/changed/);
 reinstateSnapshot(dir,request,true,{onStage(stage){if(stage==='after-backup')assert.throws(()=>change(dir,2),/lock/);}});assert.throws(()=>reinstateSnapshot(dir,{...request,operation_id:'restore-'+randomUUID()},true),/changed/);assert.equal(readSnapshot(dir,'pilot-orbit',2).sha256,before.sha256);
});


import {spawnSync} from 'node:child_process';
import {releaseAbandonedLock} from '../src/store.mjs';
for(const stage of ['after-backup','before-rename','after-rename'])test('reinstatement survives real process termination at '+stage,()=>{
 const {root,dir}=setup();change(dir);const request=restorationRequest(dir),requestPath=path.join(root,'restore-request.json');fs.writeFileSync(requestPath,JSON.stringify(request));
 const code=`import fs from 'node:fs';import {reinstateSnapshot} from ${JSON.stringify(new URL('../src/store.mjs',import.meta.url).href)};reinstateSnapshot(${JSON.stringify(dir)},JSON.parse(fs.readFileSync(${JSON.stringify(requestPath)})),true,{onStage(s){if(s===${JSON.stringify(stage)})process.exit(86)}});`;
 const child=spawnSync(process.execPath,['--input-type=module','-e',code],{encoding:'utf8',timeout:20000});assert.equal(child.status,86,child.stderr);assert.equal(readCore(dir,'pilot-orbit').dossier.revision,stage==='after-rename'?3:2);assert.equal(readSnapshot(dir,'pilot-orbit',2).dossier.name,'Name 1');
 const owner=JSON.parse(fs.readFileSync(path.join(dir,'.writer-lock','owner.json')));assert.throws(()=>reinstateSnapshot(dir,request,true),/lock/);releaseAbandonedLock(dir,'pilot-orbit',owner.token);assert.equal(reinstateSnapshot(dir,request,true).revision,3);assert.equal(readCore(dir,'pilot-orbit').dossier.operations.filter(op=>op.id===request.operation_id).length,1);
});
test('reinstatement preserves later attachment bytes and their prior canonical reference',()=>{
 const {root,dir}=setup(),file=path.join(root,'later.txt');fs.writeFileSync(file,'later content');attachFile(dir,{project_id:'pilot-orbit',expected_revision:1,operation_id:'attach-later',changes:{artifacts:[{id:'later-note',version:'1',storage:'local',location:'files/later.txt',availability:'available',sha256:sha('later content')}]}},file);const request=restorationRequest(dir);reinstateSnapshot(dir,request,true);assert.equal(readCore(dir,'pilot-orbit').dossier.artifacts.some(a=>a.id==='later-note'),false);assert.ok(readSnapshot(dir,'pilot-orbit',2).dossier.artifacts.some(a=>a.id==='later-note'));assert.equal(fs.readFileSync(path.join(dir,'files/later.txt'),'utf8'),'later content');reinstateSnapshot(dir,restorationRequest(dir,2),true);assert.ok(readCore(dir,'pilot-orbit').dossier.artifacts.some(a=>a.id==='later-note'));
});
test('reinstatement does not overwrite an external edit made before final rename',()=>{
 const {dir}=setup();change(dir);const request=restorationRequest(dir);assert.throws(()=>reinstateSnapshot(dir,request,true,{onStage(stage){if(stage==='before-rename'){const state=readCore(dir,'pilot-orbit');state.dossier.name='External edit';fs.writeFileSync(state.file,JSON.stringify(state.dossier));}}}),/changed before/);assert.equal(readCore(dir,'pilot-orbit').dossier.name,'External edit');assert.equal(readCore(dir,'pilot-orbit').dossier.revision,2);assert.equal(fs.existsSync(path.join(dir,'.writer-lock')),false);
});


import {snapshotRestorationCandidate} from '../src/history.mjs';
import {checkModel} from '../src/model.mjs';
function reviewedFixture(){
 const d=seed();d.workflow.links=[{dependent_id:'task-1',prerequisite_id:'fact-1',reason:'Recorded context is required'}];
 d.artifacts=[{id:'proof',version:'1',storage:'external',location:'synthetic:proof',availability:'available',sha256:null}];
 d.evidence=[{id:'proof-review',artifact_id:'proof',subject_id:'task-1',subject_version:'1',environment:'synthetic',date:'2026-11-03',reviewer:'Fictional reviewer',scope:'Fictional test only',result:'supports',period:'pilot-round-1'}];
 d.tasks[0].substantiation='supported';d.tasks[0].evidence_ids=['proof-review'];
 d.tasks.push({...d.tasks[0],id:'independent',title:'Independent work',substantiation:'unreviewed',evidence_ids:[]});
 return checkModel(d);
}
test('reinstatement retains review debt after a changed premise without promoting historical evidence',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk18-reinstatement-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const dir=path.join(root,'project'),initial=reviewedFixture();createCore(dir,initial);
 updateCore(dir,{project_id:initial.project_id,expected_revision:1,operation_id:'change-premise',changes:{facts:[{...initial.facts[0],text:'Changed fictional premise'}]}});
 const before=readCore(dir,initial.project_id);assert.equal(before.dossier.tasks[0].substantiation,'stale');
 const request=restorationRequest(dir),{operation_id,at,...previewRequest}=request,review=previewSnapshotRestore(dir,previewRequest);
 assert.ok(review.review_required_ids.includes('task-1'));assert.ok(!review.review_required_ids.includes('independent'));
 reinstateSnapshot(dir,request,true);const restored=readCore(dir,initial.project_id).dossier;
 assert.equal(restored.tasks[0].substantiation,'stale');assert.deepEqual(restored.evidence,initial.evidence);assert.deepEqual(restored.tasks[1],initial.tasks[1]);
 assert.deepEqual(readSnapshot(dir,initial.project_id,1).dossier,initial);
 reinstateSnapshot(dir,restorationRequest(dir,2),true);reinstateSnapshot(dir,restorationRequest(dir,1),true);
 assert.equal(readCore(dir,initial.project_id).dossier.tasks[0].substantiation,'stale');
});
test('restoration filters history-only review IDs and propagates both old and restored dependencies',()=>{
 const old=reviewedFixture(),current=structuredClone(old);
 current.tasks.push({...old.tasks[1],id:'later-task'});current.workflow.links.push({dependent_id:'task-1',prerequisite_id:'later-task',reason:'Later dependency'});
 current.workflow.invalidated_ids=['later-task'];checkModel(current);
 const candidate=snapshotRestorationCandidate(current,old);assert.ok(candidate.review_required_ids.includes('task-1'));assert.ok(!candidate.review_required_ids.includes('later-task'));checkModel(candidate.dossier);
 const earlier=structuredClone(old);earlier.tasks=earlier.tasks.filter(t=>t.id!=='independent');
 const returned=snapshotRestorationCandidate(earlier,old);assert.ok(returned.review_required_ids.includes('independent'));assert.equal(returned.dossier.tasks[1].substantiation,'stale');
});
for(const kind of ['source','module','period','artifact','evidence'])test('restoration requires review for changed '+kind+' context',()=>{
 const old=reviewedFixture();old.module_versions=[{id:'fictional-module',version:'1'}];old.workflow.modules=[{record_id:'task-1',module_id:'fictional-module'}];
 const current=structuredClone(old);
 if(kind==='source')current.sources[0].scope='Changed fictional scope';
 if(kind==='module')current.module_versions[0].version='2';
 if(kind==='period'){current.tasks[0].period='round-2';current.evidence[0].period='round-2';}
 if(kind==='artifact')current.artifacts[0].version='2';
 if(kind==='evidence')current.evidence[0].scope='Changed review scope';
 checkModel(current);const result=snapshotRestorationCandidate(current,old);
 assert.equal(result.dossier.tasks[0].substantiation,'stale');assert.deepEqual(result.dossier.tasks[1],old.tasks[1]);assert.deepEqual(result.dossier.evidence,old.evidence);
});
test('legacy restoration preserves stale task state and reviews changed periods without adding workflow',()=>{
 const old=reviewedFixture();old.schema_version='1.0.0';delete old.workflow;
 const current=structuredClone(old);current.tasks[0].substantiation='stale';current.tasks[1].period='round-2';checkModel(current);
 const result=snapshotRestorationCandidate(current,old);assert.equal(result.dossier.tasks[0].substantiation,'stale');assert.equal(result.dossier.tasks[1].substantiation,'stale');assert.equal(Object.hasOwn(result.dossier,'workflow'),false);checkModel(result.dossier);
});

test('restoration cannot silently replace a newer review judgment with historical support',()=>{
 const historical=reviewedFixture(),current=structuredClone(historical);current.tasks[0].substantiation='unreviewed';checkModel(current);
 const result=snapshotRestorationCandidate(current,historical);assert.equal(result.dossier.tasks[0].substantiation,'stale');assert.ok(result.review_required_ids.includes('task-1'));assert.deepEqual(result.dossier.evidence,historical.evidence);
 const unchanged=snapshotRestorationCandidate(historical,historical);assert.equal(unchanged.dossier.tasks[0].substantiation,'supported');assert.deepEqual(unchanged.review_required_ids,[]);
});
