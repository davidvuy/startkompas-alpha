import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {moduleLibrary,libraryModule} from '../src/module-library.mjs';
import {initializeProject} from '../src/initialize.mjs';
import {readCore} from '../src/store.mjs';
import {prepareModuleTrial,moduleTrials,prepareTrialDiscard} from '../src/module-trial.mjs';
import {saveGuided} from '../src/workspace.mjs';
import {exportCore,restoreCore} from '../src/transfer.mjs';
test('three practice modules have distinct questions, bounded sources and no fabricated approval',()=>{
 const rows=moduleLibrary();assert.equal(rows.length,3);assert.equal(new Set(rows.map(r=>r.module.scope)).size,3);
 for(const row of rows){assert.equal(row.module.review.status,'unreviewed');assert.ok(row.warnings.some(w=>w.includes('unreviewed')));assert.equal(row.module.checks.length,3);assert.equal(row.sha256,libraryModule(row.module.id).sha256);}
 for(const id of ['../private','unknown','scoped-service.json'])assert.throws(()=>libraryModule(id));
});
test('every shipped practice module completes preview, retention, discard and recovery with unknown answers',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'practice-modules-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 for(const row of moduleLibrary()){
 const id=row.module.id,dir=path.join(root,id);initializeProject(dir,{project_id:id,name:'Fictional '+row.module.name,first_task:null,practice:true});let s=readCore(dir,id);
 const prepared=prepareModuleTrial(dir,{project_id:id,expected_revision:s.dossier.revision,expected_sha256:s.sha256,module:row.module,module_sha256:row.sha256,route_id:'prepare',answers:{}});
 assert.ok(prepared.preview.document.fields.every(f=>f.value===null&&f.assertion==='unknown'));assert.equal(prepared.preview.checks.length,3);assert.equal(readCore(dir,id).sha256,s.sha256);
 saveGuided(dir,prepared,path.join(root,id+'-save'));s=readCore(dir,id);
 saveGuided(dir,prepareTrialDiscard(dir,{project_id:id,expected_revision:s.dossier.revision,expected_sha256:s.sha256,artifact_id:prepared.artifact_id,reason:'Synthetic rehearsal complete; no customer validation'}),path.join(root,id+'-discard'));
 const bundle=path.join(root,id+'-export'),restored=path.join(root,id+'-restored');exportCore(dir,id,bundle);restoreCore(bundle,id,restored);assert.deepEqual(moduleTrials(restored,id),moduleTrials(dir,id));assert.equal(moduleTrials(restored,id).trials[0].discarded,true);
 }
});
