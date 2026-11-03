import {exportCore,restoreCore} from '../src/transfer.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectModulePackage,previewModuleTrial} from '../src/module-package.mjs';
import {libraryTemplate} from '../src/template-library.mjs';
const fixture=()=>({format:'startkompas-module-package-v1',id:'synthetic-audit',version:1,name:'Synthetic audit',maker:'Synthetic author',audience:'Test teams',scope:'One proposed workflow review',compatibility:{command_contract:1,project_schemas:['1.1.0']},sources:[{id:'source-one',citation:'Synthetic source, not practice evidence'}],review:{status:'unreviewed',reviewer:null,reviewed_on:null,review_due:null,specialist_required:false,review_route:'Request an independent scope review before relying on this content'},templates:[libraryTemplate('bounded-audit').template],routes:[{id:'draft',template_id:'bounded-audit',label:'Prepare the selected audit worksheet'}],checks:[{id:'scope',template_id:'bounded-audit',prompt:'Is the scope supported by evidence?',source_ids:['source-one']}]});
test('module inspection preserves data and provenance without inventing completed checks',()=>{
 const value=fixture(),before=JSON.stringify(value),result=inspectModulePackage(value,'1.1.0','2026-11-03');
 assert.equal(JSON.stringify(value),before);assert.deepEqual(result.module,value);assert.match(result.warnings.join(' '),/unreviewed/);assert.match(result.execution,/unanswered/);
 result.module.name='Changed copy';assert.equal(value.name,'Synthetic audit');
 assert.equal(inspectModulePackage(Object.fromEntries(Object.entries(value).reverse()),'1.1.0','2026-11-03').sha256,result.sha256);
});
test('module boundaries refuse executable properties, unsupported combinations and broken references',()=>{
 const v=fixture();
 for(const patch of [{execute:'node arbitrary.js'},{format:'unknown'},{compatibility:{command_contract:2,project_schemas:['1.1.0']}},{routes:[{...v.routes[0],command:'shell'}]},{routes:[{...v.routes[0],template_id:'missing'}]},{checks:[{...v.checks[0],source_ids:['missing']}]},{templates:[v.templates[0],v.templates[0]]},{sources:[v.sources[0],v.sources[0]]},{templates:[{...v.templates[0],compatibility:{command_contract:1,project_schemas:['1.0.0']}}]}])assert.throws(()=>inspectModulePackage({...v,...patch},'1.1.0','2026-11-03'));
 assert.throws(()=>inspectModulePackage(v,'1.0.0','2026-11-03'),/does not support/);
});
test('module review metadata distinguishes stale, specialist and unverified claims',()=>{
 const v=fixture(),review={status:'reviewed',reviewer:'Unverified alias',reviewed_on:'2026-10-01',review_due:'2026-10-31',specialist_required:true,review_route:'Consult a qualified reviewer'};
 const r=inspectModulePackage({...v,review},'1.1.0','2026-11-03');assert.match(r.warnings.join(' '),/overdue/);assert.match(r.warnings.join(' '),/not verified/);
 for(const patch of [{reviewer:null},{reviewed_on:'2026-02-30'},{reviewed_on:'2027-01-01'},{review_due:'2026-09-01'},{status:'unreviewed'}])assert.throws(()=>inspectModulePackage({...v,review:{...review,...patch}},'1.1.0','2026-11-03'));
});

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
test('module CLI inspection is read-only from a foreign working directory and refuses unsafe input',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'module inspection '));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const file=path.join(root,'module.json'),cli=fileURLToPath(new URL('../src/startkompas.mjs',import.meta.url));
 const call=args=>spawnSync(process.execPath,[cli,'modules','inspect-package',file,...args],{cwd:root,encoding:'utf8'});
 const content=JSON.stringify(fixture());fs.writeFileSync(file,content);
 const success=call(['1.1.0']);assert.equal(success.status,0,success.stderr);assert.equal(JSON.parse(success.stdout).module.id,'synthetic-audit');
 for(const args of [['1.0.0'],['9.0.0'],['1.1.0','extra'],[]]){const result=call(args);assert.notEqual(result.status,0);assert.equal(result.stdout,'');assert.ok(JSON.parse(result.stderr).error);}
 assert.equal(fs.readFileSync(file,'utf8'),content);assert.deepEqual(fs.readdirSync(root),['module.json']);
 fs.writeFileSync(file,JSON.stringify({...fixture(),execute:'create a file'}));assert.notEqual(call(['1.1.0']).status,0);assert.deepEqual(fs.readdirSync(root),['module.json']);
});

import {initializeProject} from '../src/initialize.mjs';
import {readCore} from '../src/store.mjs';
test('module trial previews only selected synthetic content and refuses live, stale or withdrawn input',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'module-trial-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const dir=path.join(root,'practice'),live=path.join(root,'live');
 initializeProject(dir,{project_id:'trial',name:'Synthetic module trial',first_task:null,practice:true});
 initializeProject(live,{project_id:'trial',name:'Ordinary project',first_task:null});
 const state=readCore(dir,'trial'),module=fixture(),request={project_id:'trial',expected_revision:state.dossier.revision,expected_sha256:state.sha256,module,module_sha256:inspectModulePackage(module,'1.1.0').sha256,route_id:'draft',answers:{outcome:'Synthetic review proposal'}};
 const result=previewModuleTrial(dir,request);assert.equal(result.changes.saved,false);assert.equal(result.checks[0].status,'unanswered');assert.equal(result.document.fields.find(f=>f.key==='outcome').assertion,'proposal');assert.match(result.undo,/No project data/);assert.equal(result.update_request,undefined);
 for(const patch of [{expected_revision:99},{module_sha256:'0'.repeat(64)},{route_id:'shell'},{answers:{unknown:'bad'}},{project_id:'foreign'}])assert.throws(()=>previewModuleTrial(dir,{...request,...patch}));
 const withdrawn={...module,review:{...module.review,status:'withdrawn'}};assert.throws(()=>previewModuleTrial(dir,{...request,module:withdrawn,module_sha256:inspectModulePackage(withdrawn,'1.1.0').sha256}),/Withdrawn/);
 const l=readCore(live,'trial');assert.throws(()=>previewModuleTrial(live,{...request,expected_sha256:l.sha256}),/fictional practice/);
 assert.equal(readCore(dir,'trial').sha256,state.sha256);assert.equal(readCore(live,'trial').sha256,l.sha256);
});

import {moduleTrials,prepareModuleTrial,prepareTrialDiscard} from '../src/module-trial.mjs';
import {saveGuided} from '../src/workspace.mjs';
test('retained module trials preserve exact package and discard without deleting project data',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'module-retained-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const dir=path.join(root,'project');
 initializeProject(dir,{project_id:'trial',name:'Synthetic retained trial',first_task:{id:'original',title:'Original open task'},practice:true});
 const before=readCore(dir,'trial'),module=fixture(),request={project_id:'trial',expected_revision:before.dossier.revision,expected_sha256:before.sha256,module,module_sha256:inspectModulePackage(module,'1.1.0').sha256,route_id:'draft',answers:{outcome:'Synthetic proposal'}};
 const prepared=prepareModuleTrial(dir,request);assert.equal(readCore(dir,'trial').sha256,before.sha256);saveGuided(dir,prepared,path.join(root,'save'));
 const saved=moduleTrials(dir,'trial');assert.equal(saved.trials.length,1);assert.deepEqual(saved.trials[0].preview.module.module,module);assert.equal(saved.trials[0].discarded,false);
 assert.throws(()=>prepareModuleTrial(dir,request),/changed/);
 const file=path.join(dir,'files',prepared.artifact_id+'.json'),bytes=fs.readFileSync(file),discard={project_id:'trial',expected_revision:saved.revision,expected_sha256:saved.sha256,artifact_id:prepared.artifact_id,reason:'Synthetic trial does not fit the scope'};
 const proposal=prepareTrialDiscard(dir,discard);assert.equal(readCore(dir,'trial').sha256,saved.sha256);saveGuided(dir,proposal,path.join(root,'discard'));
 const after=readCore(dir,'trial');assert.equal(moduleTrials(dir,'trial').trials[0].discarded,true);assert.deepEqual(fs.readFileSync(file),bytes);
 for(const key of ['tasks','facts','assumptions','checks','decisions','module_versions'])assert.deepEqual(after.dossier[key],before.dossier[key]);
 assert.throws(()=>prepareTrialDiscard(dir,{...discard,expected_revision:after.dossier.revision,expected_sha256:after.sha256}),/non-discarded/);
 fs.appendFileSync(file,' ');assert.throws(()=>moduleTrials(dir,'trial'),/fingerprint/);
});

test('module trial CLI lifecycle survives identical retries and export/restore',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'module cli lifecycle '));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const dir=path.join(root,'practice'),cli=fileURLToPath(new URL('../src/startkompas.mjs',import.meta.url));
 const call=(args,ok=true)=>{const r=spawnSync(process.execPath,[cli,...args],{cwd:root,encoding:'utf8'});if(ok)assert.equal(r.status,0,r.stderr);else assert.notEqual(r.status,0);return JSON.parse(ok?r.stdout:r.stderr);};
 const write=(name,value)=>{const file=path.join(root,name);fs.writeFileSync(file,typeof value==='string'?value:JSON.stringify(value));return file;};
 call(['project','init',dir,write('init.json',{project_id:'trial',name:'Synthetic module CLI trial',first_task:null,practice:true})]);
 const before=readCore(dir,'trial'),module=fixture(),request={project_id:'trial',expected_revision:before.dossier.revision,expected_sha256:before.sha256,module,module_sha256:inspectModulePackage(module,'1.1.0').sha256,route_id:'draft',answers:{}};
 const input=write('trial.json',request),preview=call(['modules','trial-preview',dir,input]);assert.equal(preview.changes.saved,false);
 const prepared=call(['modules','trial-prepare',dir,input]);assert.equal(readCore(dir,'trial').sha256,before.sha256);
 const update=write('attach.json',prepared.update_request),content=write('content.json',prepared.content);call(['project','attach',dir,update,content]);const saved=readCore(dir,'trial');
 call(['project','attach',dir,update,content]);assert.equal(readCore(dir,'trial').sha256,saved.sha256);
 assert.equal(call(['modules','trials',dir,'trial']).trials.length,1);call(['modules','trial-prepare',dir,input],false);
 const discardInput=write('discard.json',{project_id:'trial',expected_revision:saved.dossier.revision,expected_sha256:saved.sha256,artifact_id:prepared.artifact_id,reason:'Synthetic scope mismatch'});
 const discard=call(['modules','trial-discard',dir,discardInput]),discardFile=write('discard-update.json',discard.update_request);call(['project','update',dir,discardFile]);const after=readCore(dir,'trial');call(['project','update',dir,discardFile]);assert.equal(readCore(dir,'trial').sha256,after.sha256);
 const bundle=path.join(root,'export'),restored=path.join(root,'restored');call(['project','export',dir,'trial',bundle]);call(['project','restore',bundle,'trial',restored]);
 assert.deepEqual(call(['modules','trials',restored,'trial']),call(['modules','trials',dir,'trial']));assert.equal(readCore(restored,'trial').sha256,after.sha256);
 for(const key of ['tasks','facts','assumptions','checks','decisions','module_versions'])assert.deepEqual(after.dossier[key],before.dossier[key]);
});

test('lifecycle notices preserve historical trials and refuse effective withdrawal without automatic replacement',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'module-lifecycle-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const dir=path.join(root,'project');initializeProject(dir,{project_id:'trial',name:'Synthetic lifecycle',first_task:null,practice:true});
 const before=readCore(dir,'trial'),original=fixture(),lifecycle={status:'deprecated',effective_on:'2026-01-01',reason:'Synthetic scope limitation',alternatives:['replacement-module'],migration_notes:'Export the project and inspect an alternative before starting another trial.'};
 const module={...original,lifecycle},checked=inspectModulePackage(module,'1.1.0');assert.match(checked.warnings.join(' '),/deprecated/);assert.match(checked.warnings.join(' '),/suggestions only/);
 const request={project_id:'trial',expected_revision:before.dossier.revision,expected_sha256:before.sha256,module,module_sha256:checked.sha256,route_id:'draft',answers:{}};
 const prepared=prepareModuleTrial(dir,request);saveGuided(dir,prepared,path.join(root,'save'));const current=readCore(dir,'trial'),saved=moduleTrials(dir,'trial');
 const withdrawn={...module,version:2,lifecycle:{...lifecycle,status:'withdrawn'}},next={...request,expected_revision:current.dossier.revision,expected_sha256:current.sha256,module:withdrawn,module_sha256:inspectModulePackage(withdrawn,'1.1.0').sha256};assert.throws(()=>prepareModuleTrial(dir,next),/Withdrawn/);assert.equal(readCore(dir,'trial').sha256,current.sha256);assert.deepEqual(moduleTrials(dir,'trial'),saved);
 for(const patch of [{effective_on:'2026-02-30'},{alternatives:[module.id]},{alternatives:['same','same']},{execute:'replace automatically'}])assert.throws(()=>inspectModulePackage({...module,lifecycle:{...lifecycle,...patch}},'1.1.0'));
 const bundle=path.join(root,'bundle'),restored=path.join(root,'restored');exportCore(dir,'trial',bundle);restoreCore(bundle,'trial',restored);assert.deepEqual(moduleTrials(restored,'trial'),saved);assert.deepEqual(moduleTrials(restored,'trial').trials[0].preview.module.module.lifecycle,lifecycle);
 const future={...withdrawn,lifecycle:{...withdrawn.lifecycle,effective_on:'2099-01-01'}};assert.doesNotThrow(()=>previewModuleTrial(dir,{...next,module:future,module_sha256:inspectModulePackage(future,'1.1.0').sha256}));
});
