import {createHash} from 'node:crypto';
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {checkRegister,registerSummary,prepareRegister,readRegisters} from '../src/source-register.mjs';
import {createCore,attachFile,readCore,updateCore} from '../src/store.mjs';import {exportCore,restoreCore} from '../src/transfer.mjs';
const app=fileURLToPath(new URL('../',import.meta.url)),fixture=()=>JSON.parse(fs.readFileSync(new URL('../examples/source-register.json',import.meta.url))),seed=JSON.parse(fs.readFileSync(new URL('../examples/dossier-v1.1.json',import.meta.url)));
function setup(t,data=seed){const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk22-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const dir=path.join(root,'project');createCore(dir,structuredClone(data));return {root,dir};}
const request=()=>({project_id:'pilot-orbit',expected_revision:1,operation_id:'register-1',at:'2026-10-27',registry:fixture()});
function save(dir,root,r=request()){const p=prepareRegister(dir,r),f=path.join(root,'register.json');fs.writeFileSync(f,p.content);return {p,f,receipt:attachFile(dir,p.update_request,f)};}
test('SK22 dates remain unknown and four independent review dimensions remain open',()=>{const f=fixture(),before=structuredClone(f);checkRegister(f);assert.deepEqual(f,before);assert.equal(f.sources[0].published_on,null);assert.deepEqual(Object.values(registerSummary(f).claims[0].review_status),Array(4).fill('not_reviewed'));});
test('SK22 unsupported reviews, bad dates, source references and unlicensed copied excerpts reject',()=>{
 const bad=[f=>f.claims[0].reviews.source.status='reviewed',f=>f.sources[0].checked_on='2026-02-31',f=>f.claims[0].source_ids=['missing'],f=>f.sources.push(f.sources[0]),f=>f.sources[0].rights.mode='licensed_excerpt',f=>f.sources[0].url='https://user:secret@example.com',f=>f.claims[0].verified=true];for(const mutate of bad){const f=fixture();mutate(f);assert.throws(()=>checkRegister(f));}
});
test('SK22 source conflicts and unresolved rights remain visible separately from review labels',()=>{const f=fixture();f.sources[0].rights.mode='unresolved';f.conflicts=[{id:'conflict-1',claim_ids:['selective-resources'],source_ids:['agent-skills-spec'],description:'Synthetic unresolved interpretation disagreement',status:'open',resolution:null,reviewer:null,resolved_on:null}];const v=registerSummary(f).claims[0];assert.deepEqual(v.open_conflicts,['conflict-1']);assert.deepEqual(v.rights_unresolved,['agent-skills-spec']);f.conflicts[0].status='resolved';assert.throws(()=>checkRegister(f),/resolution/);});
test('SK22 recorded review needs an actual dossier artifact reference and primary source',t=>{const {dir}=setup(t),r=request();r.registry.claims[0].reviews.source={status:'reviewed',reviewer:'synthetic reviewer',date:'2026-10-27',scope:'fixture only',note:'No real review claim',evidence_ids:['missing']};assert.throws(()=>prepareRegister(dir,r),/artifact missing/);r.registry.sources[0].kind='secondary';assert.throws(()=>checkRegister(r.registry),/primary source/);});
test('SK22 guarded attachment preserves dossier work, retries and reads in a new process after restore',t=>{const {dir,root}=setup(t),before=readCore(dir,'pilot-orbit').sha256,p=prepareRegister(dir,request());assert.equal(readCore(dir,'pilot-orbit').sha256,before);const f=path.join(root,'payload.json');fs.writeFileSync(f,p.content);const first=attachFile(dir,p.update_request,f);assert.deepEqual(attachFile(dir,p.update_request,f),first);assert.deepEqual(readCore(dir,'pilot-orbit').dossier.tasks,seed.tasks);const view=JSON.parse(execFileSync(process.execPath,[path.join(app,'src/register-cli.mjs'),'show',dir,'pilot-orbit'],{encoding:'utf8'}));assert.equal(view.registers[0].available,true);assert.equal(view.registers[0].revision_changed,false);exportCore(dir,'pilot-orbit',path.join(root,'export'));restoreCore(path.join(root,'export'),'pilot-orbit',path.join(root,'restored'));assert.deepEqual(readRegisters(path.join(root,'restored'),'pilot-orbit'),view);});
test('SK22 later revision and missing attachment cannot imply current review coverage',t=>{const {dir,root}=setup(t);save(dir,root);updateCore(dir,{project_id:'pilot-orbit',expected_revision:2,operation_id:'change',changes:{name:'New context'}});assert.equal(readRegisters(dir,'pilot-orbit').registers[0].revision_changed,true);const a=readCore(dir,'pilot-orbit').dossier.artifacts.at(-1);fs.writeFileSync(path.join(dir,a.location),'{}');assert.equal(readRegisters(dir,'pilot-orbit').registers[0].available,false);});
test('SK22 wrong identity, stale revision and unsupported request fields do not write',t=>{const {dir}=setup(t);for(const patch of [{project_id:'wrong'},{expected_revision:4},{approved:true},{operation_id:123}])assert.throws(()=>prepareRegister(dir,{...request(),...patch}));assert.equal(readCore(dir,'pilot-orbit').dossier.revision,1);});

test('SK22 one evidenced review dimension does not complete the other three',t=>{const d=structuredClone(seed);d.artifacts.push({id:'review-proof',version:'1',storage:'external',location:'synthetic:review',availability:'available',sha256:null});const {dir}=setup(t,d),r=request();r.registry.claims[0].reviews.source={status:'reviewed',reviewer:'synthetic reviewer',date:'2026-10-27',scope:'source identity only',note:'No expertise or interpretation claim',evidence_ids:['review-proof']};const summary=prepareRegister(dir,r).summary.claims[0];assert.equal(summary.review_status.source,'reviewed');assert.equal(summary.review_status.interpretation,'not_reviewed');assert.equal(summary.review_status.applicability,'not_reviewed');assert.equal(summary.review_status.coverage,'not_reviewed');});
test('SK22 oversized register proposal rejects without storing an unreadable artifact',t=>{const {dir}=setup(t),r=request(),base=r.registry.sources[0];r.registry.sources=Array.from({length:600},(_,i)=>({...base,id:'s-'+i,title:'x'.repeat(4000),recheck_reason:'y'.repeat(4000)}));r.registry.claims[0].source_ids=['s-0'];assert.throws(()=>prepareRegister(dir,r),/4 MiB/);assert.equal(readCore(dir,'pilot-orbit').dossier.revision,1);});

function reviewedRegister(t,{external=false}={}){
 const {dir,root}=setup(t),proof=path.join(root,'proof.txt');fs.writeFileSync(proof,'Synthetic review record');
 const artifact={id:'review-proof',version:'1',storage:external?'external':'local',location:external?'synthetic:review':'files/review-proof.txt',availability:'available',sha256:external?null:createHash('sha256').update(fs.readFileSync(proof)).digest('hex')};
 const update={project_id:'pilot-orbit',expected_revision:1,operation_id:'proof-add',changes:{artifacts:[artifact]}};
 if(external)updateCore(dir,update);else attachFile(dir,update,proof);
 const r=request();r.expected_revision=2;r.registry.claims[0].reviews.source={status:'reviewed',reviewer:'synthetic reviewer',date:'2026-10-29',scope:'source identity only',note:'Synthetic test, not real reviewer approval',evidence_ids:[artifact.id]};
 save(dir,root,r);return {dir,root,artifact};
}
test('SK22 changed review evidence is visible without rewriting the recorded review',t=>{
 const s=reviewedRegister(t),before=readCore(s.dir,'pilot-orbit').sha256;
 fs.writeFileSync(path.join(s.dir,s.artifact.location),'Changed review bytes');const claim=readRegisters(s.dir,'pilot-orbit').registers[0].summary.claims[0];
 assert.equal(claim.review_status.source,'reviewed');assert.equal(claim.review_evidence.source.requires_recheck,true);assert.equal(claim.review_evidence.source.artifacts[0].integrity,'hash_mismatch');assert.equal(claim.review_evidence.interpretation.requires_recheck,false);assert.equal(readCore(s.dir,'pilot-orbit').sha256,before);
});
test('SK22 missing review proof remains a visible missing dependency, not a missing register',t=>{
 const s=reviewedRegister(t);fs.unlinkSync(path.join(s.dir,s.artifact.location));const r=readRegisters(s.dir,'pilot-orbit').registers[0];assert.equal(r.available,true);assert.equal(r.summary.claims[0].review_evidence.source.artifacts[0].integrity,'missing');assert.equal(r.summary.claims[0].review_evidence.source.requires_recheck,true);
});
test('SK22 external review proof is explicitly unverified and never fetched',t=>{
 const s=reviewedRegister(t,{external:true}),review=readRegisters(s.dir,'pilot-orbit').registers[0].summary.claims[0].review_evidence.source;assert.equal(review.artifacts[0].integrity,'external_unchecked');assert.equal(review.requires_recheck,true);
});
test('SK22 unchanged local review bytes can match without claiming substantive approval',t=>{
 const s=reviewedRegister(t),summary=readRegisters(s.dir,'pilot-orbit').registers[0].summary;assert.equal(summary.claims[0].review_evidence.source.artifacts[0].integrity,'hash_matches');assert.equal(summary.claims[0].review_evidence.source.requires_recheck,false);assert.match(summary.warning,/not authenticated expertise/);
});

test('SK22 new register links propagate damaged proof to dependent work',t=>{
 const s=reviewedRegister(t),d=readCore(s.dir,'pilot-orbit').dossier,registry=d.events.find(e=>e.type==='source-register').subject_ids[0];
 const task={...d.tasks[0],id:'dependent-work',title:'Work using the review register'};
 updateCore(s.dir,{project_id:'pilot-orbit',expected_revision:3,operation_id:'dependent-task',changes:{tasks:[...d.tasks,task],workflow:{...d.workflow,links:[...d.workflow.links,{dependent_id:task.id,prerequisite_id:registry,reason:'Requires register evidence'}]}}});
 assert.equal(readRegisters(s.dir,'pilot-orbit').registers[0].requires_review,false);
 fs.writeFileSync(path.join(s.dir,s.artifact.location),'changed proof');updateCore(s.dir,{project_id:'pilot-orbit',expected_revision:4,operation_id:'record-integrity',changes:{}});
 const changed=readCore(s.dir,'pilot-orbit').dossier;assert.ok(changed.workflow.invalidated_ids.includes(registry));assert.ok(changed.workflow.invalidated_ids.includes(task.id));assert.equal(changed.tasks.find(x=>x.id===task.id).substantiation,'stale');
});

test('SK22 old register without dependency links still exposes missing proof on read',t=>{
 const s=reviewedRegister(t),d=readCore(s.dir,'pilot-orbit').dossier;d.workflow.links=[];fs.writeFileSync(path.join(s.dir,'project.json'),JSON.stringify(d));fs.unlinkSync(path.join(s.dir,s.artifact.location));
 const r=readRegisters(s.dir,'pilot-orbit').registers[0];assert.equal(r.available,true);assert.equal(r.requires_review,true);assert.equal(r.record.registry.claims[0].reviews.source.status,'reviewed');
});
