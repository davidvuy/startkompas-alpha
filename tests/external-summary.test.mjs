import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initializeProject} from '../src/initialize.mjs';
import {readCore} from '../src/store.mjs';
import {prepareBusinessBrief} from '../src/business-brief.mjs';
import {prepareDocumentSection} from '../src/document-section.mjs';
import {saveGuided} from '../src/workspace.mjs';
import {externalSummary,writeExternalSummary} from '../src/external-summary.mjs';

test('external selection excludes private context and retains immutable reviewed output',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-summary-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const dir=path.join(root,'private-project');
 initializeProject(dir,{project_id:'private-project',name:'PRIVATE NAME',first_task:{id:'task',title:'PRIVATE TASK'},practice:true});
 const p=prepareBusinessBrief(dir,{project_id:'private-project',expected_revision:1,operation_id:'offer',at:'2026-10-30',language:'en',kind:'offer',client:'PRIVATE CLIENT',period:'PRIVATE PERIOD',previous_artifact_id:null,change_reason:null,fields:[{key:'segment',value:'Public selected audience <script> [link](https://example.com)',assertion:'proposal',record_ids:[]},{key:'support',value:'PRIVATE INTERNAL NOTES',assertion:'proposal',record_ids:[]}]});
 saveGuided(dir,p,path.join(root,'bundle'));const before=readCore(dir,'private-project');
 const preview=externalSummary(dir,'private-project',p.artifact_id,['segment','job']);
 assert.doesNotMatch(preview.markdown,/PRIVATE|private-project|https:\/\/example.com\)/);assert.match(preview.markdown,/Unknown — no answer/);assert.match(preview.markdown,/FICTIONAL PRACTICE/);assert.doesNotMatch(preview.markdown,/<script>/);assert.match(preview.markdown,/Omitted sections/);
 assert.equal(readCore(dir,'private-project').sha256,before.sha256);
 for(const keys of [[],['segment','segment'],['client'],['support','missing']])assert.throws(()=>externalSummary(dir,'private-project',p.artifact_id,keys));
 assert.throws(()=>writeExternalSummary(dir,'private-project',p.artifact_id,['segment'],preview.sha256,path.join(root,'wrong.md')),/preview again/);
 assert.throws(()=>writeExternalSummary(dir,'private-project',p.artifact_id,['segment','job'],preview.sha256,path.join(dir,'bad.md')),/outside/);
 const target=path.join(root,'summary.md');writeExternalSummary(dir,'private-project',p.artifact_id,['segment','job'],preview.sha256,target);const saved=fs.readFileSync(target);
 assert.equal(saved.toString(),preview.markdown);assert.throws(()=>writeExternalSummary(dir,'private-project',p.artifact_id,['segment','job'],preview.sha256,target));
 const next=prepareDocumentSection(dir,'private-project',before.dossier.revision,before.sha256,{artifact_id:p.artifact_id,key:'segment',value:'Changed audience',reason:'Synthetic revision'});saveGuided(dir,next,path.join(root,'next'));
 assert.throws(()=>externalSummary(dir,'private-project',p.artifact_id,['segment']),/current/);assert.deepEqual(fs.readFileSync(target),saved);
 assert.match(externalSummary(dir,'private-project',next.artifact_id,['segment']).markdown,/Changed audience/);
 const state=readCore(dir,'private-project'),long=prepareDocumentSection(dir,'private-project',state.dossier.revision,state.sha256,{artifact_id:next.artifact_id,key:'segment',value:'A'.repeat(4000),reason:'Long synthetic text'});saveGuided(dir,long,path.join(root,'long'));
 const current=readCore(dir,'private-project'),longer=prepareDocumentSection(dir,'private-project',current.dossier.revision,current.sha256,{artifact_id:long.artifact_id,key:'outcome',value:'B'.repeat(3000),reason:'Second long field'});saveGuided(dir,longer,path.join(root,'longer'));
 assert.throws(()=>externalSummary(dir,'private-project',longer.artifact_id,['segment','outcome']),/6000/);assert.match(externalSummary(dir,'private-project',longer.artifact_id,['outcome']).markdown,/BBB/);

});
