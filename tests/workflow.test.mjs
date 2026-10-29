import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {checkModel} from '../src/model.mjs';
import {emptyWorkflow,affected} from '../src/dependencies.mjs';
import {createCore,readCore,updateCore,attachFile,sha} from '../src/store.mjs';
import {planNext,findReusable,prepareChange,upgradeWorkflow} from '../src/workflow.mjs';
import {handoff} from '../src/handoff.mjs';
import {exportCore,restoreCore} from '../src/transfer.mjs';
const baseFixture=JSON.parse(fs.readFileSync(new URL('../examples/dossier-v1.json',import.meta.url)));
export function fixture(){
  const d=structuredClone(baseFixture);d.schema_version='1.1.0';d.workflow=emptyWorkflow();
  d.tasks.push({...d.tasks[0],id:'build',title:'Build a dashboard'});
  d.checks=[{id:'interview',title:'Interview one agency owner',scope:'pilot learning',applicability:'applies',progress:'open',substantiation:'unknown',basis_kind:'hypothesis',evidence_ids:[],period:'pilot-round-1'},
    {id:'survey',title:'Broad survey',scope:'pilot learning',applicability:'applies',progress:'open',substantiation:'unknown',basis_kind:'hypothesis',evidence_ids:[],period:'pilot-round-1'}];
  d.workflow.links=[{dependent_id:'build',prerequisite_id:'decision-1',reason:'Do not build until the need supports the decision'}];
  d.workflow.uncertainties=[{record_id:'fact-1',impact:'material',reason:'No agency-owner evidence',checks:[{record_id:'survey',cost_rank:5},{record_id:'interview',cost_rank:1}]}];
  return d;
}
function setup(t,data=fixture()){const base=fs.mkdtempSync(path.join(os.tmpdir(),'startkompas-workflow-'));t.after(()=>fs.rmSync(base,{recursive:true,force:true}));const dir=path.join(base,'project');createCore(dir,data);return {dir,base};}
const req=(changes,revision=1,operation_id='op-1')=>({project_id:'pilot-orbit',expected_revision:revision,operation_id,changes});
test('SK16 material choice chooses the lowest-ranked relevant check and permits independent work',t=>{
  const {dir}=setup(t);const p=planNext(dir,'pilot-orbit',{kind:'material_choice',target_ids:['build']});assert.equal(p.route,'check_before_expansion');assert.deepEqual(p.next_checks,['interview']);assert.ok(p.independent_tasks.includes('task-1'));assert.ok(!p.independent_tasks.includes('build'));
  assert.equal(planNext(dir,'pilot-orbit',{kind:'small_edit',target_ids:['build']}).route,'direct_small_edit');
});
test('SK17 missing links and multi-record cycles reject without writes',t=>{
  const {dir}=setup(t),before=fs.readFileSync(path.join(dir,'project.json'));
  for(const link of [{dependent_id:'build',prerequisite_id:'absent',reason:'missing'}, {dependent_id:'fact-1',prerequisite_id:'build',reason:'cycle'}]){const w=fixture().workflow;w.links.push(link);assert.throws(()=>updateCore(dir,req({workflow:w})),/reference|Cyclic/);}
  assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);
});
test('SK17 accepted uncertainty remains unknown and reason is preserved',t=>{
  const d=fixture();d.workflow.accepted=[{record_id:'fact-1',reason:'A bounded fictional experiment knowingly proceeds without interviews'}];const {dir}=setup(t,d);
  const p=planNext(dir,'pilot-orbit',{kind:'material_choice',target_ids:['build']});assert.equal(p.blockers.length,0);assert.equal(p.accepted_uncertainty.length,1);assert.equal(readCore(dir,'pilot-orbit').dossier.facts[0].assertion,'reported');
});
test('SK16 valid existing research is reused; unsupported claims do not bypass the check',t=>{
  const d=fixture();d.artifacts=[{id:'research',version:'1',storage:'external',location:'synthetic:review',availability:'available',sha256:null}];d.evidence=[{id:'research-e',artifact_id:'research',subject_id:'interview',subject_version:'1',environment:'synthetic',date:'2026-10-27',reviewer:'fictional reviewer',scope:'pilot learning',result:'supports',period:'pilot-round-1'}];d.checks[0].progress='done';d.checks[0].substantiation='supported';d.checks[0].evidence_ids=['research-e'];
  const {dir}=setup(t,d);const p=planNext(dir,'pilot-orbit',{kind:'material_choice',target_ids:['build']});assert.equal(p.reused_research[0].checks[0],'interview');assert.equal(p.blockers.length,0);
  d.checks[0].applicability='not_applicable';updateCore(dir,req({checks:d.checks}));assert.equal(planNext(dir,'pilot-orbit',{kind:'material_choice',target_ids:['build']}).reused_research.length,0);
});
test('SK18 supplier change invalidates only dependents and rollback does not revive evidence',t=>{
  const d=fixture();d.facts.push({id:'unrelated',text:'One customer liked weekly summaries',assertion:'reported',source_ids:['source-1']});
  d.workflow.links.push({dependent_id:'interview',prerequisite_id:'fact-1',reason:'supplier-dependent review'});
  const {dir}=setup(t,d),facts=structuredClone(d.facts);facts[0].text='Supplier Beta replaces Alpha';updateCore(dir,req({facts}));
  let saved=readCore(dir,'pilot-orbit').dossier;assert.equal(saved.checks[0].substantiation,'stale');assert.ok(!saved.workflow.invalidated_ids.includes('unrelated'));assert.ok(!saved.workflow.invalidated_ids.includes('survey'));
  updateCore(dir,req({facts:d.facts},2,'op-return'));saved=readCore(dir,'pilot-orbit').dossier;assert.equal(saved.checks[0].substantiation,'stale');assert.equal(saved.facts[1].text,d.facts[1].text);
});
test('SK18 module and period changes require scoped recheck',t=>{
  const d=fixture();d.module_versions=[{id:'be-pilot',version:'1'}];d.workflow.modules=[{record_id:'interview',module_id:'be-pilot'}];d.workflow.intents=[{record_id:'survey',goal:'customer check',client:'Alder',period:'October',version:'1'}];
  const {dir}=setup(t,d);updateCore(dir,req({module_versions:[{id:'be-pilot',version:'2'}]}));assert.equal(readCore(dir,'pilot-orbit').dossier.checks[0].substantiation,'stale');
  const w=readCore(dir,'pilot-orbit').dossier.workflow;w.intents[0].period='November';updateCore(dir,req({workflow:w},2,'op-period'));assert.equal(readCore(dir,'pilot-orbit').dossier.checks[1].substantiation,'stale');
});
test('SK18 missing/tampered local evidence is visible immediately and can be recorded as stale',t=>{
  const {dir,base}=setup(t),file=path.join(base,'proof.txt');fs.writeFileSync(file,'synthetic proof');const art={id:'proof',version:'1',storage:'local',location:'files/proof.txt',availability:'available',sha256:sha(fs.readFileSync(file))};
  const d=readCore(dir,'pilot-orbit').dossier;d.checks[0].progress='done';d.checks[0].substantiation='supported';d.checks[0].evidence_ids=['e-proof'];
  attachFile(dir,req({artifacts:[art],checks:d.checks,evidence:[{id:'e-proof',artifact_id:'proof',subject_id:'interview',subject_version:'1',environment:'synthetic',date:'2026-10-27',reviewer:'fixture',scope:'pilot learning',result:'supports',period:'pilot-round-1'}]}),file);
  fs.writeFileSync(path.join(dir,'files/proof.txt'),'changed');assert.equal(handoff(dir,'pilot-orbit').unresolved_checks.find(c=>c.id==='interview').substantiation,'stale');
  assert.equal(planNext(dir,'pilot-orbit',{kind:'material_choice',target_ids:['build']}).reused_research.length,0);
  fs.unlinkSync(path.join(dir,'files/proof.txt'));updateCore(dir,req({},2,'op-audit'));assert.equal(readCore(dir,'pilot-orbit').dossier.checks[0].substantiation,'stale');assert.equal(readCore(dir,'pilot-orbit').dossier.evidence.length,1);
});
test('SK19 old matching goal is reused only in the exact client/period/version scope',t=>{
  const d=fixture();d.workflow.intents=[{record_id:'task-1',goal:'  Interview Guide ',client:'Alder',period:'October',version:'2'},{record_id:'build',goal:'interview guide',client:'Birch',period:'November',version:'2'}];const {dir}=setup(t,d);
  const q={goal:'interview   guide',client:'Alder',period:'October',version:'2'},r=findReusable(dir,'pilot-orbit',q);assert.equal(r.reusable[0].record.id,'task-1');assert.equal(r.review_candidates[0].intent.record_id,'build');
  assert.equal(findReusable(dir,'pilot-orbit',{...q,period:null}).reusable.length,0);assert.equal(findReusable(dir,'pilot-orbit',{...q,goal:'synonym not tagged'}).reusable.length,0);
});
test('SK18 impact proposal is read-only and its saved update is idempotent',t=>{
  const {dir}=setup(t),before=readCore(dir,'pilot-orbit').sha256;
  const p=prepareChange(dir,{project_id:'pilot-orbit',expected_revision:1,operation_id:'supplier-change',changed_ids:['fact-1'],reason:'Supplier changed; evidence must be checked again',at:'2026-10-27'});
  assert.equal(readCore(dir,'pilot-orbit').sha256,before);assert.ok(p.affected_ids.includes('build'));const first=updateCore(dir,p.update_request);assert.deepEqual(updateCore(dir,p.update_request),first);
});
test('1.0 copy upgrade preserves original bytes, rejects repeated destination and survives export',t=>{
  const {dir,base}=setup(t,structuredClone(baseFixture)),before=fs.readFileSync(path.join(dir,'project.json'));const upgraded=upgradeWorkflow(dir,'pilot-orbit',path.join(base,'upgraded'));assert.equal(upgraded.dossier.schema_version,'1.1.0');assert.deepEqual(upgraded.dossier.workflow,emptyWorkflow());assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);
  assert.throws(()=>upgradeWorkflow(dir,'pilot-orbit',path.join(base,'upgraded')),/exists/);
  exportCore(upgraded.directory,'pilot-orbit',path.join(base,'export'));const restored=restoreCore(path.join(base,'export'),'pilot-orbit',path.join(base,'restored'));assert.deepEqual(restored.dossier,upgraded.dossier);
});

test('SK18 changing native prerequisites invalidates the dependent task',t=>{
  const {dir}=setup(t);const d=readCore(dir,'pilot-orbit').dossier;d.tasks.find(x=>x.id==='build').depends_on=['interview'];updateCore(dir,req({tasks:d.tasks}));
  const saved=readCore(dir,'pilot-orbit').dossier;assert.ok(saved.workflow.invalidated_ids.includes('build'));assert.equal(saved.tasks.find(x=>x.id==='build').substantiation,'stale');assert.ok(!saved.workflow.invalidated_ids.includes('task-1'));
});

test('SK16 changed uncertainty cannot reuse a previously supported check even without an explicit check edge',t=>{
 const d=fixture();d.artifacts=[{id:'prior',version:'1',storage:'external',location:'synthetic:prior',availability:'available',sha256:null}];d.evidence=[{id:'prior-e',artifact_id:'prior',subject_id:'interview',subject_version:'1',environment:'synthetic',date:'2026-10-27',reviewer:'fixture',scope:'pilot learning',result:'supports',period:'pilot-round-1'}];d.checks[0].progress='done';d.checks[0].substantiation='supported';d.checks[0].evidence_ids=['prior-e'];const {dir}=setup(t,d);assert.equal(planNext(dir,'pilot-orbit',{kind:'material_choice',target_ids:['build']}).reused_research.length,1);d.facts[0].text='Changed premise';updateCore(dir,req({facts:d.facts}));const p=planNext(dir,'pilot-orbit',{kind:'material_choice',target_ids:['build']});assert.equal(p.reused_research.length,0);assert.equal(p.blockers.length,1);
});

test('SK18 scoped replacements keep dependencies without inheriting obsolete facts, and later changes propagate',t=>{
 const {dir}=setup(t);let d=readCore(dir,'pilot-orbit').dossier;d.facts[0].text='Obsolete premise changed';updateCore(dir,req({facts:d.facts}));d=readCore(dir,'pilot-orbit').dossier;d.facts.push({id:'new-premise',text:'Reassessed premise from retained source',assertion:'reported',source_ids:['source-1']});d.tasks.push({...d.tasks[0],id:'new-work',title:'Current work',substantiation:'unknown'});d.workflow.links.push({dependent_id:'new-work',prerequisite_id:'new-premise',reason:'Current reviewed premise'});d.workflow.uncertainties.push({record_id:'new-premise',impact:'material',reason:'Still needs customer evidence',checks:[{record_id:'interview',cost_rank:1}]});updateCore(dir,req({facts:d.facts,tasks:d.tasks,workflow:d.workflow},2,'replacement'));d=readCore(dir,'pilot-orbit').dossier;assert.ok(d.workflow.invalidated_ids.includes('fact-1'));assert.ok(!d.workflow.invalidated_ids.includes('new-work'));const p=planNext(dir,'pilot-orbit',{kind:'material_choice',target_ids:['new-work']});assert.equal(p.blockers[0].record_id,'new-premise');d.facts.find(x=>x.id==='new-premise').text='Later change';updateCore(dir,req({facts:d.facts},3,'later'));assert.ok(readCore(dir,'pilot-orbit').dossier.workflow.invalidated_ids.includes('new-work'));
});

test('SK17 changed premises reopen previously accepted uncertainty without erasing its reason',t=>{
 const d=fixture();d.workflow.accepted=[{record_id:'fact-1',reason:'Accept only the original bounded premise'}];const {dir}=setup(t,d);
 const input={kind:'material_choice',target_ids:['build']};assert.equal(planNext(dir,'pilot-orbit',input).accepted_uncertainty.length,1);
 updateCore(dir,req({facts:d.facts.map(f=>({...f,text:'Materially changed supplier premise'}))}));
 const p=planNext(dir,'pilot-orbit',input);assert.equal(p.route,'check_before_expansion');assert.equal(p.accepted_uncertainty.length,0);assert.equal(p.acceptance_requiring_review[0].reason,d.workflow.accepted[0].reason);assert.ok(p.independent_tasks.includes('task-1'));
 assert.deepEqual(readCore(dir,'pilot-orbit').dossier.workflow.accepted,d.workflow.accepted);
 updateCore(dir,req({facts:d.facts},2,'restore-premise'));assert.equal(planNext(dir,'pilot-orbit',input).blockers.length,1);
});

test('SK17 explicit impact also reopens accepted uncertainty in a new process',t=>{
 const d=fixture();d.workflow.accepted=[{record_id:'fact-1',reason:'Bounded original experiment'}];const {dir}=setup(t,d);
 const p=prepareChange(dir,{project_id:'pilot-orbit',expected_revision:1,operation_id:'review-acceptance',changed_ids:['fact-1'],reason:'New external information',at:'2026-10-29'});updateCore(dir,p.update_request);
 const input=path.join(dir,'plan-request.json');fs.writeFileSync(input,JSON.stringify({kind:'material_choice',target_ids:['build']}));
 const result=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('../src/core-cli.mjs',import.meta.url)),'plan',dir,'pilot-orbit',input],{encoding:'utf8'}));assert.equal(result.blockers.length,1);assert.equal(result.acceptance_requiring_review.length,1);
});
