import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initializeProject} from '../src/initialize.mjs';
import {readCore} from '../src/store.mjs';
import {saveGuided} from '../src/workspace.mjs';
import {libraryTemplate} from '../src/template-library.mjs';
import {validateTemplate} from '../src/template-format.mjs';
import {personalTemplates,preparePersonalTemplate,preparePersonalDraft} from '../src/personal-templates.mjs';
import {prepareBusinessBrief,readBusinessBrief} from '../src/business-brief.mjs';
import {prepareDocumentSection} from '../src/document-section.mjs';
import {compareDocuments} from '../src/document-comparison.mjs';
import {documentReview} from '../src/document-review.mjs';
import {externalSummary} from '../src/external-summary.mjs';
import {prepareSuggestion,suggestionsView} from '../src/document-suggestions.mjs';

const custom=()=>({...libraryTemplate('bounded-audit').template,format:'startkompas-document-template-v2',id:'personal-audit',custom_fields:[{key:'custom_owner',label:'Review owner',prompt:'Who reviews the proposed output?'}],required_inputs:['segment','custom_owner']});
function setup(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-personal-')),dir=path.join(root,'project');t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:'personal',name:'Fictional personal worksheet',first_task:null});const state=()=>readCore(dir,'personal');let n=0;return {root,dir,state,save:p=>saveGuided(dir,p,path.join(root,'save-'+ ++n))};}
test('custom template contract rejects incompatible formats, duplicate keys and invented defaults',()=>{
 assert.equal(validateTemplate(custom()).template.custom_fields.length,1);
 for(const patch of [{format:'startkompas-document-template-v1'},{document_kind:'pilot'},{custom_fields:[custom().custom_fields[0],custom().custom_fields[0]]},{custom_fields:[{...custom().custom_fields[0],key:'outcome'}]},{custom_fields:[{...custom().custom_fields[0],value:'invented'}]},{required_inputs:['custom_missing']}])assert.throws(()=>validateTemplate({...custom(),...patch}));
});
test('personal versions preserve historical templates and actual custom document content across revisions',t=>{
 const {dir,state,save}=setup(t);let s=state();const template=custom(),first=preparePersonalTemplate(dir,'personal',s.dossier.revision,s.sha256,{previous:null,template});assert.equal(state().sha256,s.sha256);save(first);
 s=state();const selected=personalTemplates(dir,'personal').templates[0];const prepared=preparePersonalDraft(dir,'personal',s.dossier.revision,s.sha256,{artifact_id:selected.artifact_id,template_sha256:selected.sha256,answers:{custom_owner:'Fictional reviewer'},client:null,period:null});save(prepared);
 const original=readBusinessBrief(dir,'personal',prepared.artifact_id),oldBytes=fs.readFileSync(path.join(dir,'files',prepared.artifact_id+'.json'));assert.equal(original.format,'startkompas-business-brief-v2');assert.equal(original.fields.find(f=>f.key==='custom_owner').value,'Fictional reviewer');assert.match(original.document_markdown,/Review owner/);
 s=state();const updated={...template,version:2,name:'Revised worksheet',custom_fields:[{key:'custom_other',label:'Other field',prompt:'What else?'}],required_inputs:['custom_other']};save(preparePersonalTemplate(dir,'personal',s.dossier.revision,s.sha256,{previous:first.artifact_id,template:updated}));
 assert.deepEqual(readBusinessBrief(dir,'personal',prepared.artifact_id).template_context,original.template_context);assert.equal(personalTemplates(dir,'personal').templates.find(r=>r.artifact_id===first.artifact_id).historical,true);
 s=state();assert.throws(()=>preparePersonalTemplate(dir,'personal',s.dossier.revision,s.sha256,{previous:first.artifact_id,template:updated}));assert.throws(()=>preparePersonalTemplate(dir,'personal',s.dossier.revision,s.sha256,{previous:null,template}));
 const revision=prepareDocumentSection(dir,'personal',s.dossier.revision,s.sha256,{artifact_id:prepared.artifact_id,key:'custom_owner',value:'Another fictional reviewer',reason:'Correct the proposed owner'});save(revision);
 const revised=readBusinessBrief(dir,'personal',revision.artifact_id);assert.deepEqual(revised.template_context,original.template_context);assert.deepEqual(fs.readFileSync(path.join(dir,'files',prepared.artifact_id+'.json')),oldBytes);
 assert.equal(compareDocuments(dir,'personal',prepared.artifact_id,revision.artifact_id).changes[0].label,'Review owner');assert.ok(documentReview(revised).points.every(p=>p.label));assert.match(externalSummary(dir,'personal',revision.artifact_id,['custom_owner']).markdown,/Another fictional reviewer/);
 s=state();const suggestion=prepareSuggestion(dir,'personal',s.dossier.revision,s.sha256,{document_id:revision.artifact_id,key:'custom_owner',value:'Proposed third reviewer',reason:'Check responsibility',origin:'user_supplied'});save(suggestion);assert.ok(suggestionsView(dir,'personal',revision.artifact_id).sections.some(f=>f.label==='Review owner'));
 s=state();const ordinary={...revised.request,expected_revision:s.dossier.revision,operation_id:'ordinary-revision',previous_artifact_id:revision.artifact_id,change_reason:'Update canonical fields through an existing route',fields:revised.request.fields.filter(f=>!f.key.startsWith('custom_'))};delete ordinary.custom_fields;
 const next=prepareBusinessBrief(dir,ordinary);save(next);const final=readBusinessBrief(dir,'personal',next.artifact_id);assert.equal(final.fields.find(f=>f.key==='custom_owner').value,'Another fictional reviewer');assert.deepEqual(final.template_context,original.template_context);
 s=state();assert.throws(()=>prepareBusinessBrief(dir,{...final.request,expected_revision:s.dossier.revision,operation_id:'bad-definition',previous_artifact_id:final.artifact_id,change_reason:'Try relabelling',custom_fields:updated.custom_fields}));
 const historical=preparePersonalDraft(dir,'personal',s.dossier.revision,s.sha256,{artifact_id:first.artifact_id,template_sha256:selected.sha256,answers:{},client:null,period:null});assert.ok(historical.missing_required.includes('custom_owner'));assert.equal(JSON.parse(historical.content).fields.find(f=>f.key==='custom_owner').assertion,'unknown');
 assert.throws(()=>preparePersonalDraft(dir,'personal',s.dossier.revision,s.sha256,{artifact_id:first.artifact_id,template_sha256:'0'.repeat(64),answers:{},client:null,period:null}));
});
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
test('personal template CLI prepares without writes and history refuses changed files',t=>{
 const {dir,root,state,save}=setup(t),s=state(),file=path.join(root,'request.json'),cli=fileURLToPath(new URL('../src/startkompas.mjs',import.meta.url));
 const call=args=>spawnSync(process.execPath,[cli,'templates',...args],{encoding:'utf8'});fs.writeFileSync(file,JSON.stringify({revision:s.dossier.revision,sha256:s.sha256,input:{previous:null,template:custom()}}));
 const result=call(['personal-prepare',dir,'personal',file]);assert.equal(result.status,0,result.stderr);assert.equal(state().sha256,s.sha256);const prepared=JSON.parse(result.stdout);save(prepared);
 const listed=call(['personal-list',dir,'personal']);assert.equal(listed.status,0,listed.stderr);assert.equal(JSON.parse(listed.stdout).templates.length,1);assert.notEqual(call(['personal-prepare',dir,'personal',file]).status,0);
 const entry=personalTemplates(dir,'personal').templates[0],now=state();fs.writeFileSync(file,JSON.stringify({revision:now.dossier.revision,sha256:now.sha256,input:{artifact_id:entry.artifact_id,template_sha256:entry.sha256,answers:{},client:null,period:null}}));const draft=call(['personal-draft',dir,'personal',file]);assert.equal(draft.status,0,draft.stderr);assert.ok(JSON.parse(draft.stdout).missing_required.includes('custom_owner'));assert.equal(state().sha256,now.sha256);
 fs.appendFileSync(path.join(dir,'files',prepared.artifact_id+'.json'),' ');assert.throws(()=>personalTemplates(dir,'personal'),/fingerprint/);
});

test('personal template compatibility is checked before import and retained through saved draft provenance',t=>{
 const {dir,state,save}=setup(t),before=state(),schema=before.dossier.schema_version;
 const template={...custom(),compatibility:{command_contract:1,project_schemas:[schema]}};
 const incompatible={...template,compatibility:{command_contract:1,project_schemas:[schema==='1.1.0'?'1.0.0':'1.1.0']}};
 assert.throws(()=>preparePersonalTemplate(dir,'personal',before.dossier.revision,before.sha256,{previous:null,template:incompatible}),/does not support/);
 assert.equal(state().sha256,before.sha256);assert.equal(personalTemplates(dir,'personal').templates.length,0);
 const prepared=preparePersonalTemplate(dir,'personal',before.dossier.revision,before.sha256,{previous:null,template});save(prepared);
 const selected=personalTemplates(dir,'personal').templates[0],current=state();
 assert.deepEqual(selected.template.compatibility,template.compatibility);
 const draft=preparePersonalDraft(dir,'personal',current.dossier.revision,current.sha256,{artifact_id:selected.artifact_id,template_sha256:selected.sha256,answers:{custom_owner:'Synthetic reviewer'},client:null,period:null});save(draft);
 assert.deepEqual(readBusinessBrief(dir,'personal',draft.artifact_id).template_context.template.compatibility,template.compatibility);
 assert.equal(state().dossier.tasks.length,before.dossier.tasks.length);
});
