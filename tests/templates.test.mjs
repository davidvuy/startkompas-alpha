import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {briefTypes,readBusinessBrief} from '../src/business-brief.mjs';
import {validateTemplate} from '../src/template-format.mjs';
import {prepareTemplateDraft} from '../src/template-draft.mjs';
import {prepareDocumentSection} from '../src/document-section.mjs';
import {initializeProject} from '../src/initialize.mjs';
import {readCore} from '../src/store.mjs';
import {saveGuided,workspaceView} from '../src/workspace.mjs';

function template(kind='offer'){return {format:'startkompas-document-template-v1',id:'fictional-worksheet',version:1,name:'Fictional worksheet',document_kind:kind,audience:'People exploring one bounded service',scope:'Prepare a draft for discussion',required_inputs:[Object.keys(briefTypes[kind].fields)[0]],unknowns:['Customer demand has not been established'],boundaries:['No promises or customer findings are supplied'],sections:Object.keys(briefTypes[kind].fields).map(key=>({key,prompt:'Which information belongs in '+key+'? Leave it unknown if unavailable.'}))};}
function setup(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-templates-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const dir=path.join(root,'project');initializeProject(dir,{project_id:'template-test',name:'Fictional template test',first_task:null});return {root,dir};}

test('template format covers all business fields and rejects silent defaults or invalid versions',()=>{
 for(const kind of Object.keys(briefTypes)){const source=template(kind),result=validateTemplate(source);assert.match(result.sha256,/^[a-f0-9]{64}$/);source.sections[0].prompt='Changed';assert.notEqual(result.template.sections[0].prompt,source.sections[0].prompt);}
 const source=template();
 for(const patch of [{version:0},{version:'1'},{defaults:{segment:'Invented customer'}},{sections:[...source.sections,source.sections[0]]},{required_inputs:['not-a-field']},{unknowns:[]},{boundaries:[]},{sections:source.sections.slice(1)},{sections:source.sections.map(s=>({...s,value:'Invented finding'}))}])assert.throws(()=>validateTemplate({...source,...patch}));
 const reordered=Object.fromEntries(Object.entries(source).reverse());assert.equal(validateTemplate(source).sha256,validateTemplate(reordered).sha256);
});

test('template draft preserves unknowns and exact origin through later edits without following template updates',t=>{
 const {root,dir}=setup(t),state=readCore(dir,'template-test'),source=template(),request={project_id:'template-test',expected_revision:state.dossier.revision,expected_sha256:state.sha256,template:source,answers:{outcome:'One fictional checklist'},client:null,period:null};
 const prepared=prepareTemplateDraft(dir,request),document=JSON.parse(prepared.content);
 assert.deepEqual(prepared.missing_required,['segment']);assert.equal(document.fields.find(f=>f.key==='segment').value,null);assert.equal(document.fields.find(f=>f.key==='segment').assertion,'unknown');
 assert.equal(document.fields.find(f=>f.key==='outcome').assertion,'proposal');assert.ok(document.fields.every(f=>!f.record_ids.length));assert.equal(readCore(dir,'template-test').sha256,state.sha256);
 assert.throws(()=>prepareTemplateDraft(dir,{...request,answers:{fake:'answer'}}));assert.throws(()=>prepareTemplateDraft(dir,{...request,answers:{segment:42}}));assert.throws(()=>prepareTemplateDraft(dir,{...request,expected_revision:2}),/changed/);
 saveGuided(dir,prepared,path.join(root,'first'));const saved=readBusinessBrief(dir,'template-test',prepared.artifact_id),originalBytes=fs.readFileSync(path.join(dir,'files',prepared.artifact_id+'.json'));
 source.version=2;source.name='Updated worksheet';source.boundaries=['Different boundary'];
 assert.deepEqual(readBusinessBrief(dir,'template-test',prepared.artifact_id).template_context,saved.template_context);
 const current=readCore(dir,'template-test'),revision=prepareDocumentSection(dir,'template-test',current.dossier.revision,current.sha256,{artifact_id:prepared.artifact_id,key:'segment',value:'Fictional studios',reason:'Add a proposed audience'});saveGuided(dir,revision,path.join(root,'second'));
 const revised=readBusinessBrief(dir,'template-test',revision.artifact_id);assert.deepEqual(revised.template_context,saved.template_context);assert.match(revised.document_markdown,/version 1/);assert.match(revised.document_markdown,/not current status/);assert.deepEqual(fs.readFileSync(path.join(dir,'files',prepared.artifact_id+'.json')),originalBytes);
});

test('template CLI validation and preparation are executable and read-only',t=>{
 const {root,dir}=setup(t),source=template(),file=path.join(root,'template.json'),requestFile=path.join(root,'request.json'),state=readCore(dir,'template-test');fs.writeFileSync(file,JSON.stringify(source));
 const cli=fileURLToPath(new URL('../src/startkompas.mjs',import.meta.url)),call=args=>spawnSync(process.execPath,[cli,'templates',...args],{encoding:'utf8'});
 const valid=call(['validate',file]);assert.equal(valid.status,0,valid.stderr);assert.equal(JSON.parse(valid.stdout).version,1);
 fs.writeFileSync(requestFile,JSON.stringify({project_id:'template-test',expected_revision:state.dossier.revision,expected_sha256:state.sha256,template:source,answers:{},client:null,period:null}));const prepared=call(['prepare',dir,requestFile]);assert.equal(prepared.status,0,prepared.stderr);assert.deepEqual(JSON.parse(prepared.stdout).missing_required,['segment']);assert.equal(readCore(dir,'template-test').sha256,state.sha256);
 fs.writeFileSync(file,'{"PRIVATE MALFORMED CONTENT');const invalid=call(['validate',file]);assert.notEqual(invalid.status,0);assert.doesNotMatch(invalid.stderr,/PRIVATE MALFORMED/);
});
import {templateLibrary,libraryTemplate,prepareLibraryDraft} from '../src/template-library.mjs';

test('library selection is bounded and fingerprinted; worksheets never become answers',t=>{
 const entries=templateLibrary();assert.deepEqual(entries.map(e=>e.template.id),['bounded-audit','implementation-service','recurring-reporting','experiment-card','experiment-problem-conversation','experiment-prototype-check','experiment-offer-conversation','experiment-paid-pilot']);
 assert.equal(new Set(entries.map(e=>e.template.scope)).size,8);assert.equal(new Set(entries.filter(e=>e.template.document_kind==='offer').map(e=>e.template.sections.find(s=>s.key==='delivery').prompt)).size,3);
 assert.throws(()=>libraryTemplate('../package'),/Unknown/);assert.throws(()=>libraryTemplate('toString'),/Unknown/);
 const {dir}=setup(t),state=readCore(dir,'template-test');
 for(const entry of entries){
  const request={project_id:'template-test',expected_revision:state.dossier.revision,expected_sha256:state.sha256,template_id:entry.template.id,template_version:entry.template.version,template_sha256:entry.sha256,answers:{},client:null,period:null};
  const prepared=prepareLibraryDraft(dir,request),document=JSON.parse(prepared.content);
  assert.ok(document.fields.every(f=>f.value===null&&f.assertion==='unknown'&&f.record_ids.length===0));assert.deepEqual(prepared.missing_required,entry.template.required_inputs);
  assert.deepEqual(document.template_context.template,entry.template);
  for(const patch of [{template_version:2},{template_sha256:'0'.repeat(64)},{expected_revision:99},{template:entry.template}])assert.throws(()=>prepareLibraryDraft(dir,{...request,...patch}));
 }
 entries[0].template.sections[0].prompt='Mutated local result';assert.notEqual(libraryTemplate('bounded-audit').template.sections[0].prompt,entries[0].template.sections[0].prompt);
 assert.equal(readCore(dir,'template-test').sha256,state.sha256);
});

test('library CLI exposes selection metadata and rejects stale library preparation',t=>{
 const {root,dir}=setup(t),cli=fileURLToPath(new URL('../src/startkompas.mjs',import.meta.url)),call=args=>spawnSync(process.execPath,[cli,'templates',...args],{encoding:'utf8'});
 const listed=call(['list']);assert.equal(listed.status,0,listed.stderr);assert.equal(JSON.parse(listed.stdout).length,8);
 const shown=call(['show','implementation-service']);assert.equal(shown.status,0,shown.stderr);const entry=JSON.parse(shown.stdout),state=readCore(dir,'template-test');
 const request={project_id:'template-test',expected_revision:state.dossier.revision,expected_sha256:state.sha256,template_id:entry.template.id,template_version:entry.template.version,template_sha256:entry.sha256,answers:{delivery:'Fictional handover proposal'},client:null,period:null},file=path.join(root,'library.json');fs.writeFileSync(file,JSON.stringify(request));
 const prepared=call(['prepare-library',dir,file]);assert.equal(prepared.status,0,prepared.stderr);assert.equal(JSON.parse(JSON.parse(prepared.stdout).content).fields.find(f=>f.key==='delivery').value,request.answers.delivery);
 fs.writeFileSync(file,JSON.stringify({...request,template_version:2}));const stale=call(['prepare-library',dir,file]);assert.notEqual(stale.status,0);assert.match(stale.stderr,/Template changed/);assert.equal(readCore(dir,'template-test').sha256,state.sha256);
});

test('experiment methods save distinct preparation materials with unknown outcomes and immutable origins',t=>{
 const {root,dir}=setup(t),before=readCore(dir,'template-test');
 for(const id of ['experiment-problem-conversation','experiment-prototype-check','experiment-offer-conversation','experiment-paid-pilot']){
  const entry=libraryTemplate(id),state=readCore(dir,'template-test'),prepared=prepareLibraryDraft(dir,{project_id:'template-test',expected_revision:state.dossier.revision,expected_sha256:state.sha256,template_id:id,template_version:entry.template.version,template_sha256:entry.sha256,answers:{question:'Fictional uncertainty for method comparison',method:'Prepare the materials described in the selected worksheet; execution remains unrecorded.'},client:null,period:null});
  saveGuided(dir,prepared,path.join(root,id));const saved=readBusinessBrief(dir,'template-test',prepared.artifact_id);assert.equal(saved.request.kind,'experiment');assert.equal(saved.template_context.template.id,id);const listed=workspaceView(dir,'template-test').drafts.find(d=>d.id===prepared.artifact_id);assert.equal(listed.worksheet_name,entry.template.name);assert.equal(listed.question,'Fictional uncertainty for method comparison');assert.deepEqual(saved.template_context.template,entry.template);assert.equal(saved.fields.filter(f=>f.value===null).length,5);assert.ok(saved.fields.every(f=>f.assertion==='proposal'||f.assertion==='unknown'));assert.match(saved.document_markdown,/Not recorded/);
 }
 const after=readCore(dir,'template-test');for(const key of ['tasks','evidence','assumptions'])assert.deepEqual(after.dossier[key],before.dossier[key]);assert.equal(after.dossier.events.filter(e=>['experiment-start','experiment-observation'].includes(e.type)).length,0);
});

 test('template compatibility refuses unsupported contracts and target schemas without changing the project',t=>{
 const {dir}=setup(t),state=readCore(dir,'template-test'),source=template();
 const compatibility={command_contract:1,project_schemas:[state.dossier.schema_version]};
 const declared={...source,compatibility};
 const request={project_id:'template-test',expected_revision:state.dossier.revision,expected_sha256:state.sha256,template:declared,answers:{},client:null,period:null};
 assert.deepEqual(prepareTemplateDraft(dir,request).template_context.template.compatibility,compatibility);
 for(const patch of [{command_contract:2},{command_contract:'1'},{project_schemas:['9.0.0']},{project_schemas:[]},{project_schemas:['1.1.0','1.1.0']},{execute:'arbitrary command'}])assert.throws(()=>validateTemplate({...source,compatibility:{...compatibility,...patch}}));
 const other=state.dossier.schema_version==='1.1.0'?'1.0.0':'1.1.0';
 assert.throws(()=>prepareTemplateDraft(dir,{...request,template:{...source,compatibility:{...compatibility,project_schemas:[other]}}}),/does not support/);
 assert.equal(readCore(dir,'template-test').sha256,state.sha256);
 assert.equal(validateTemplate(source).template.compatibility,undefined);
 });
