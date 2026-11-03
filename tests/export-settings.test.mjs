import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {initializeProject} from '../src/initialize.mjs';
import {readCore,updateCore} from '../src/store.mjs';
import {saveGuided,prepareProjectArchive} from '../src/workspace.mjs';
import {prepareTemplateDraft} from '../src/template-draft.mjs';
import {libraryTemplate} from '../src/template-library.mjs';
import {prepareDocumentSection} from '../src/document-section.mjs';
import {exportContents,exportPreferences,prepareExportPreference} from '../src/export-settings.mjs';
function setup(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-export-settings-')),dir=path.join(root,'project');t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:'settings',name:'Fictional settings',first_task:null});let n=0;return {root,dir,state:()=>readCore(dir,'settings'),save:p=>saveGuided(dir,p,path.join(root,'retry-'+ ++n))};}
test('project export preferences preserve explicit selections, history and file exclusions',t=>{
 const {dir,root,state,save}=setup(t);let s=state();const report={kind:'report',sections:['tasks']};
 assert.deepEqual(exportPreferences(dir,'settings').preferences,[]);
 const preview=prepareExportPreference(dir,'settings',s.dossier.revision,s.sha256,report);assert.equal(state().sha256,s.sha256);assert.equal(preview.preview.contents.files.included.length,0);save(preview);
 const first=fs.readFileSync(path.join(dir,'files',preview.artifact_id+'.json'));const stored=exportPreferences(dir,'settings');assert.equal(stored.preferences[0].available,true);assert.deepEqual(stored.preferences[0].selection,report);assert.equal(stored.preferences[0].contents.files.excluded_count,1);assert.equal(stored.preferences[0].contents.files.excluded[0].id,preview.artifact_id);
 assert.throws(()=>prepareExportPreference(dir,'settings',s.dossier.revision,s.sha256,report),/changed/);
 s=state();save(prepareExportPreference(dir,'settings',s.dossier.revision,s.sha256,{kind:'report',sections:['decisions','summary']}));assert.equal(exportPreferences(dir,'settings').preferences[0].version,2);assert.deepEqual(fs.readFileSync(path.join(dir,'files',preview.artifact_id+'.json')),first);
 const other=path.join(root,'other');initializeProject(other,{project_id:'other',name:'Other project',first_task:null});assert.deepEqual(exportPreferences(other,'other').preferences,[]);
 for(const invalid of [{...report,confirmed:true},{kind:'report',sections:[]},{kind:'report',sections:['tasks','tasks']},{kind:'report',sections:['constructor']},{kind:'document',artifact_id:'../private'}])assert.throws(()=>exportContents(dir,'settings',invalid));
 s=state();save(prepareProjectArchive(dir,'settings',s.dossier.revision,true));s=state();assert.throws(()=>prepareExportPreference(dir,'settings',s.dossier.revision,s.sha256,report),/Restore/);assert.equal(exportPreferences(dir,'settings').archived,true);
 fs.appendFileSync(path.join(dir,'files',preview.artifact_id+'.json'),' ');assert.throws(()=>exportPreferences(dir,'settings'),/fingerprint/);
});
test('saved summary preferences never silently follow a revised document or add fields',t=>{
 const {dir,state,save}=setup(t);let s=state();const prepared=prepareTemplateDraft(dir,{project_id:'settings',expected_revision:s.dossier.revision,expected_sha256:s.sha256,template:libraryTemplate('bounded-audit').template,answers:{outcome:'Fictional scope',support:'PRIVATE NOTE'},client:null,period:null});save(prepared);
 const selection={kind:'summary',artifact_id:prepared.artifact_id,keys:['outcome']};const contents=exportContents(dir,'settings',selection);assert.deepEqual(contents.fields,[{key:'outcome',label:'Proposed outcome'}]);assert.doesNotMatch(JSON.stringify(contents),/PRIVATE NOTE/);assert.equal(contents.files.excluded_count,1);
 s=state();save(prepareExportPreference(dir,'settings',s.dossier.revision,s.sha256,selection));s=state();save(prepareExportPreference(dir,'settings',s.dossier.revision,s.sha256,{kind:'document',artifact_id:prepared.artifact_id}));
 s=state();save(prepareDocumentSection(dir,'settings',s.dossier.revision,s.sha256,{artifact_id:prepared.artifact_id,key:'outcome',value:'New fictional scope',reason:'Revised proposal'}));
 const prefs=exportPreferences(dir,'settings').preferences;assert.equal(prefs.find(p=>p.selection.kind==='summary').available,false);assert.equal(prefs.find(p=>p.selection.kind==='document').available,true);assert.equal(prefs.find(p=>p.selection.kind==='summary').selection.artifact_id,prepared.artifact_id);
 assert.throws(()=>exportContents(dir,'settings',selection),/current/);assert.throws(()=>exportContents(dir,'settings',{...selection,keys:['custom_missing']}));
});
