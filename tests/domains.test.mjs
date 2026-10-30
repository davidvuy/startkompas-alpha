import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {domainIndex,domainDetail,prepareScreen,readScreens} from '../src/domains.mjs';
import {createCore,readCore,attachFile,updateCore,sha} from '../src/store.mjs';
import {exportCore,restoreCore} from '../src/transfer.mjs';
const app=fileURLToPath(new URL('../',import.meta.url));
const seed=JSON.parse(fs.readFileSync(new URL('../examples/dossier-v1.1.json',import.meta.url)));
function setup(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk21-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const dir=path.join(root,'dossier');createCore(dir,structuredClone(seed));return {dir,root};}
const request=()=>({project_id:'pilot-orbit',expected_revision:1,operation_id:'screen-1',at:'2026-10-27',actor:'synthetic reviewer',trigger:'intake',reason:'Synthetic test, two domains only',domains:[{domain_id:'D01',applicability:'applies',rationale:'Founder context is relevant; no capacity inferred',answers:[{question_id:'q1',answer:null,source_ids:[],note:'No capacity supplied'},{question_id:'q2',answer:null,source_ids:[],note:'Not yet established'}]},{domain_id:'D10',applicability:'unknown',rationale:'Data flow not established',answers:[{question_id:'q1',answer:null,source_ids:[],note:'Need actual data inventory'}]}]});
function save(dir,root,r=request()){const p=prepareScreen(dir,r),f=path.join(root,r.operation_id+'.json');fs.writeFileSync(f,p.content);const receipt=attachFile(dir,p.update_request,f);return {p,f,receipt};}
test('SK21 all fifteen index entries are versioned research topics, never assessed',()=>{
  const index=domainIndex();assert.equal(index.domains.length,15);assert.equal(domainDetail('D02').detail_loaded,true);assert.match(domainDetail('D02').content,/not proof of demand/);assert.equal(new Set(index.domains.map(x=>x.id)).size,15);
  for(const d of index.domains){if(['D02','D03'].includes(d.id)){assert.equal(d.detail_status,'draft_not_reviewed');assert.equal(d.detail_file,'modules/market-offer.md');}else if(['D06','D07','D08','D09','D10','D11','D13'].includes(d.id)){assert.equal(d.detail_status,'draft_not_reviewed');assert.equal(d.detail_file,'modules/pilot-conditions.md');assert.match(domainDetail(d.id).content,/Qualified interpretation/);}else{assert.equal(d.status,'questions_only');assert.equal(d.detail_file,null);assert.equal(d.detail_status,'not_researched');}assert.ok(d.version&&d.source_file&&d.applicability_condition);assert.equal(d.questions.length,2);}
  // This assertion also works in the installed package; canonical plan mapping is audited separately.
  assert.equal(index.domains[0].name_en,'Founder and starting position');assert.equal(index.domains[14].name_en,'Growth and closure');
});
test('SK21 selected detail stays missing and rejects unknown paths',()=>{
  assert.equal(domainDetail('D01').detail_loaded,false);assert.equal(domainDetail('D10').domain.id,'D10');assert.throws(()=>domainDetail('../docs/plan.md'),/Unknown/);
  const copy=domainIndex();copy.domains[0].status='verified';assert.equal(domainIndex().domains[0].status,'questions_only');
});
test('SK21 preparation is read-only and distinguishes unvisited, partial and unknown answers',t=>{
  const {dir}=setup(t),before=readCore(dir,'pilot-orbit').sha256;const r=request(),original=structuredClone(r),p=prepareScreen(dir,r),doc=JSON.parse(p.content);
  assert.deepEqual(r,original);assert.equal(readCore(dir,'pilot-orbit').sha256,before);assert.equal(doc.coverage[0].status,'questions_addressed');assert.deepEqual(doc.coverage[0].unknown,['q1','q2']);assert.equal(doc.coverage[9].status,'partially_screened');assert.equal(doc.coverage.filter(x=>x.status==='not_screened').length,13);assert.ok(doc.coverage.every(x=>x.content_review==='not_performed'));
});
test('SK21 false completion fields, unsourced answers, duplicate questions and identity/revision errors reject',t=>{
  const {dir}=setup(t);const mutations=[r=>r.verified=true,r=>r.domains[0].answers[0].answer='Ten hours available',r=>r.domains.push(r.domains[0]),r=>r.domains[0].answers.push(r.domains[0].answers[0]),r=>r.domains[0].answers[0].source_ids=['absent'],r=>r.expected_revision=99,r=>r.project_id='other-project',r=>r.domains[0].domain_id='D99'];
  for(const mutate of mutations){const r=request();mutate(r);assert.throws(()=>prepareScreen(dir,r));}assert.equal(readCore(dir,'pilot-orbit').dossier.revision,1);
});
test('SK21 attachment is durable, idempotent and readable in a new process and restored export',t=>{
  const {dir,root}=setup(t);assert.deepEqual(readScreens(dir,'pilot-orbit').screens,[]);const {p,f,receipt}=save(dir,root);assert.deepEqual(attachFile(dir,p.update_request,f),receipt);assert.throws(()=>prepareScreen(dir,{...request(),expected_revision:2}),/already recorded/);
  const result=JSON.parse(execFileSync(process.execPath,[path.join(app,'src/domains-cli.mjs'),'screens',dir,'pilot-orbit'],{encoding:'utf8'}));assert.equal(result.screens[0].recorded,true);assert.equal(result.screens[0].revision_changed,false);assert.equal(result.revision,2);assert.deepEqual(readCore(dir,'pilot-orbit').dossier.tasks,seed.tasks);
  exportCore(dir,'pilot-orbit',path.join(root,'export'));restoreCore(path.join(root,'export'),'pilot-orbit',path.join(root,'restored'));assert.deepEqual(readScreens(path.join(root,'restored'),'pilot-orbit'),readScreens(dir,'pilot-orbit'));
});
test('SK21 later changes leave historical screening visibly stale, never current approval',t=>{
  const {dir,root}=setup(t);save(dir,root);updateCore(dir,{project_id:'pilot-orbit',expected_revision:2,operation_id:'new-milestone',changes:{name:'Changed milestone'}});const v=readScreens(dir,'pilot-orbit');assert.equal(v.screens[0].revision_changed,true);assert.equal(v.screens[0].screen.request.trigger,'intake');
});
test('SK21 missing or damaged screening files are unresolved instead of counted as screened',t=>{
  const {dir,root}=setup(t);save(dir,root);const a=readCore(dir,'pilot-orbit').dossier.artifacts.at(-1),f=path.join(dir,a.location);fs.writeFileSync(f,'{}');assert.equal(readScreens(dir,'pilot-orbit').screens[0].recorded,false);fs.unlinkSync(f);assert.equal(readScreens(dir,'pilot-orbit').screens[0].recorded,false);
});
test('SK21 a historic catalog fingerprint stays explicit on readback',t=>{
  const {dir,root}=setup(t),p=prepareScreen(dir,request()),doc=JSON.parse(p.content);
  doc.catalog_sha256='0'.repeat(64);doc.catalog_version='historic-test-version';const content=JSON.stringify(doc),file=path.join(root,'historic.json');
  fs.writeFileSync(file,content);p.update_request.changes.artifacts.at(-1).sha256=sha(content);attachFile(dir,p.update_request,file);
  assert.equal(readScreens(dir,'pilot-orbit').screens[0].catalog_changed,true);
});
