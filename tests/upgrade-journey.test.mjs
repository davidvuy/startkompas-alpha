import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {upgradeJourney} from '../examples/demo-upgrade-journey.mjs';
import {readCore} from '../src/store.mjs';
import {moduleTrials} from '../src/module-trial.mjs';
import {decisionLog} from '../src/decision-log.mjs';
test('old project upgrade, module trial, selected import and revised decision recover together',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'upgrade-journey-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const destination=path.join(root,'run'),r=upgradeJourney(destination),old=readCore(r.original_directory,r.project_id),current=readCore(r.project_directory,r.project_id),restored=readCore(r.restored_directory,r.project_id);
 assert.equal(old.dossier.schema_version,'1.0.0');assert.equal(current.dossier.schema_version,'1.1.0');assert.equal(old.sha256,r.original_sha256);assert.equal(restored.sha256,current.sha256);
 for(const key of ['facts','evidence','assumptions','tasks','module_versions'])assert.deepEqual(current.dossier[key],old.dossier[key]);
 assert.equal(moduleTrials(r.restored_directory,r.project_id).trials[0].artifact_id,r.module_trial);
 const rows=decisionLog(r.restored_directory,r.project_id).rows,revised=rows.find(d=>d.supersedes===r.previous_decision);assert.ok(revised);assert.equal(revised.status,'active');assert.equal(rows.find(d=>d.id===r.previous_decision).status,'superseded');assert.match(revised.details.request.attribution.remaining_uncertainty,/unknown/);
 assert.throws(()=>upgradeJourney(destination),/exists/);assert.equal(readCore(r.original_directory,r.project_id).sha256,r.original_sha256);
});
