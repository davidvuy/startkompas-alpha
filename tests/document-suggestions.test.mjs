import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initializeProject} from '../src/initialize.mjs';
import {readCore} from '../src/store.mjs';
import {saveGuided} from '../src/workspace.mjs';
import {prepareBusinessBrief,readBusinessBrief} from '../src/business-brief.mjs';
import {prepareDocumentSection} from '../src/document-section.mjs';
import {prepareSuggestion,prepareSuggestionResolution,suggestionsView} from '../src/document-suggestions.mjs';
function setup(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-suggestions-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const dir=path.join(root,'project'),id='suggestions';initializeProject(dir,{project_id:id,name:'Synthetic suggestions',first_task:null});let n=0;const save=p=>saveGuided(dir,p,path.join(root,'retry-'+(++n)));
 const original=prepareBusinessBrief(dir,{project_id:id,expected_revision:1,operation_id:'initial-offer',at:'2026-10-30',language:'en',kind:'offer',client:null,period:null,previous_artifact_id:null,change_reason:null,fields:[{key:'delivery',value:'Manual delivery\nretain this line',assertion:'proposal',record_ids:[]}]});save(original);return {dir,id,save,original,state:()=>readCore(dir,id)};}
function propose(s,document,key,value){const state=s.state();return prepareSuggestion(s.dir,s.id,state.dossier.revision,state.sha256,{document_id:document,key,value,reason:'Fictional proposal',origin:'user_supplied'});}
function decide(s,suggestion,document,action,value){const state=s.state();return prepareSuggestionResolution(s.dir,s.id,state.dossier.revision,state.sha256,{suggestion_id:suggestion,document_id:document,action,value,reason:'Explicit fictional '+action});}
test('saving a proposal does not replace text; edited acceptance changes only that section and retains its origin',t=>{
 const s=setup(t),p=propose(s,s.original.artifact_id,'outcome','Suggested outcome'),before=s.state();s.save(p);assert.deepEqual(readBusinessBrief(s.dir,s.id,s.original.artifact_id).fields,JSON.parse(s.original.content).fields);
 const accepted=decide(s,p.artifact_id,s.original.artifact_id,'accept','Edited suggested outcome');assert.equal(accepted.rebase,false);assert.equal(s.state().dossier.revision,before.dossier.revision+1);s.save(accepted);
 const saved=readBusinessBrief(s.dir,s.id,accepted.artifact_id);assert.equal(saved.fields.find(f=>f.key==='outcome').value,'Edited suggested outcome');assert.deepEqual(saved.fields.find(f=>f.key==='delivery'),JSON.parse(s.original.content).fields.find(f=>f.key==='delivery'));
 assert.ok(s.state().dossier.workflow.links.some(l=>l.dependent_id===accepted.artifact_id&&l.prerequisite_id===p.artifact_id));assert.equal(suggestionsView(s.dir,s.id,accepted.artifact_id).rows[0].resolution.type,'document-suggestion-accepted');assert.throws(()=>decide(s,p.artifact_id,accepted.artifact_id,'reject','Suggested outcome'),/resolved/);
});
test('rejection survives new document versions and normalized duplicates cannot silently return',t=>{
 const s=setup(t),p=propose(s,s.original.artifact_id,'outcome','Rejected proposal');s.save(p);const before=s.state();s.save(decide(s,p.artifact_id,s.original.artifact_id,'reject','Rejected proposal'));
 assert.equal(s.state().dossier.artifacts.length,before.dossier.artifacts.length);assert.deepEqual(s.state().dossier.tasks,before.dossier.tasks);
 let st=s.state();const revision=prepareDocumentSection(s.dir,s.id,st.dossier.revision,st.sha256,{artifact_id:s.original.artifact_id,key:'delivery',value:'A deliberate manual revision',reason:'Unrelated field change'});s.save(revision);
 assert.throws(()=>propose(s,revision.artifact_id,'outcome','  Rejected   proposal  '),/already exists/);
 const other=propose(s,revision.artifact_id,'outcome','Different proposal');s.save(other);assert.throws(()=>decide(s,other.artifact_id,revision.artifact_id,'accept','Rejected proposal'),/rejected suggestion/);
 assert.equal(readBusinessBrief(s.dir,s.id,revision.artifact_id).fields.find(f=>f.key==='outcome').value,null);
});
test('unrelated field revisions can be explicitly reviewed; changed target and stale project bases refuse acceptance',t=>{
 const s=setup(t),p=propose(s,s.original.artifact_id,'outcome','One proposal');s.save(p);let st=s.state();const newer=prepareDocumentSection(s.dir,s.id,st.dossier.revision,st.sha256,{artifact_id:s.original.artifact_id,key:'delivery',value:'New manual delivery',reason:'Independent change'});s.save(newer);
 const accept=decide(s,p.artifact_id,newer.artifact_id,'accept','One proposal');assert.equal(accept.rebase,true);assert.equal(JSON.parse(accept.content).fields.find(f=>f.key==='delivery').value,'New manual delivery');
 st=s.state();assert.throws(()=>prepareSuggestionResolution(s.dir,s.id,st.dossier.revision-1,st.sha256,{suggestion_id:p.artifact_id,document_id:newer.artifact_id,action:'accept',value:'One proposal',reason:'Stale'}),/changed/);
 const target=prepareDocumentSection(s.dir,s.id,st.dossier.revision,st.sha256,{artifact_id:newer.artifact_id,key:'outcome',value:'Manually chosen outcome',reason:'Actual target change'});s.save(target);assert.throws(()=>decide(s,p.artifact_id,target.artifact_id,'accept','One proposal'),/Target section changed/);
});
test('template origin is constrained and damaged history blocks duplicate checks rather than losing rejections',t=>{
 const s=setup(t),view=suggestionsView(s.dir,s.id,s.original.artifact_id),st=s.state();assert.throws(()=>prepareSuggestion(s.dir,s.id,st.dossier.revision,st.sha256,{document_id:s.original.artifact_id,key:'outcome',value:'Invented template',reason:'Test',origin:'template'}),/template/);
 const p=prepareSuggestion(s.dir,s.id,st.dossier.revision,st.sha256,{document_id:s.original.artifact_id,key:'next_check',value:view.template,reason:'Neutral check',origin:'template'});s.save(p);const a=s.state().dossier.artifacts.find(a=>a.id===p.artifact_id);fs.appendFileSync(path.join(s.dir,a.location),' ');
 assert.equal(suggestionsView(s.dir,s.id,s.original.artifact_id).unavailable,true);assert.throws(()=>propose(s,s.original.artifact_id,'outcome','Another proposal'),/fingerprint/);
});
