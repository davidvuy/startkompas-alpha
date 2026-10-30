import {documentReview} from '../src/document-review.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initializeProject} from '../src/initialize.mjs';
import {readCore} from '../src/store.mjs';
import {saveGuided} from '../src/workspace.mjs';
import {briefTypes,prepareBusinessBrief,readBusinessBrief} from '../src/business-brief.mjs';
import {prepareScope} from '../src/scope-exercise.mjs';
import {preparePilotWorkflow} from '../src/pilot-workflow.mjs';
import {prepareDocumentSection} from '../src/document-section.mjs';
function setup(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-sections-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const dir=path.join(root,'project'),id='section-test';initializeProject(dir,{project_id:id,name:'Fictional section edit',first_task:null});let n=0;return {dir,id,state:()=>readCore(dir,id),save:p=>saveGuided(dir,p,path.join(root,'retry-'+(++n)))};}
function draft(s,kind,patch={}){return prepareBusinessBrief(s.dir,{project_id:s.id,expected_revision:s.state().dossier.revision,operation_id:'create-'+kind,at:'2026-10-30',language:'en',kind,client:null,period:null,previous_artifact_id:null,change_reason:null,fields:Object.keys(briefTypes[kind].fields).map(key=>({key,value:'Manual '+key+'\nsecond line',assertion:'proposal',record_ids:[]})),...patch});}
test('each business type supports one-section revisions with untouched manual fields and historical bytes retained',t=>{
 for(const kind of Object.keys(briefTypes)){const s=setup(t),original=draft(s,kind);s.save(original);const before=s.state(),oldBytes=fs.readFileSync(path.join(s.dir,before.dossier.artifacts[0].location)),key=Object.keys(briefTypes[kind].fields).at(-1),input={artifact_id:original.artifact_id,key,value:'Focused fictional change',reason:'Change this one section'};
 const p=prepareDocumentSection(s.dir,s.id,before.dossier.revision,before.sha256,input);assert.equal(s.state().sha256,before.sha256);s.save(p);
 const saved=readBusinessBrief(s.dir,s.id,p.artifact_id),prior=JSON.parse(original.content);assert.equal(saved.version,2);
 for(const field of prior.fields.filter(f=>f.key!==key))assert.deepEqual(saved.fields.find(f=>f.key===field.key),field);
 assert.deepEqual(saved.fields.find(f=>f.key===key).record_ids,[]);assert.equal(saved.fields.find(f=>f.key===key).assertion,'proposal');assert.deepEqual(fs.readFileSync(path.join(s.dir,before.dossier.artifacts[0].location)),oldBytes);
 assert.throws(()=>prepareDocumentSection(s.dir,s.id,before.dossier.revision,before.sha256,input),/changed/);
 const current=s.state();assert.throws(()=>prepareDocumentSection(s.dir,s.id,current.dossier.revision,current.sha256,input),/current document/);
 }
});
test('linked pilot section revision retains offer and scope context; outdated offer cannot be silently substituted',t=>{
 const s=setup(t),offer=draft(s,'offer');s.save(offer);let state=s.state();
 const scope=prepareScope(s.dir,s.id,state.dossier.revision,state.sha256,{previous:null,offer_id:offer.artifact_id,date:'2026-10-30',reason:null,included:['One fictional checklist'],excluded:[],unknowns:['Access'],outcome_fit:'unknown',outcome_reason:null,available_hours:null,estimated_hours:null,period:null});s.save(scope);state=s.state();
 const fields=Object.fromEntries(Object.keys(briefTypes.pilot.fields).map(key=>[key,key==='deliverable'?'One fictional checklist':''])),pilot=preparePilotWorkflow(s.dir,s.id,state.dossier.revision,state.sha256,{offer_id:offer.artifact_id,previous:null,reason:'',fields});s.save(pilot);state=s.state();
 const revised=prepareDocumentSection(s.dir,s.id,state.dossier.revision,state.sha256,{artifact_id:pilot.artifact_id,key:'stop',value:'Stop when scope expands',reason:'Clarify stop condition'});s.save(revised);
 const content=JSON.parse(revised.content),links=revised.update_request.changes.workflow.links.filter(l=>l.dependent_id===revised.artifact_id);assert.equal(content.preparation_context.offer_id,offer.artifact_id);assert.equal(content.preparation_context.scope_id,scope.artifact_id);assert.equal(content.preparation_context.expert_review,'not_performed');assert.ok(links.some(l=>l.prerequisite_id===scope.artifact_id));assert.ok(links.some(l=>l.prerequisite_id===offer.artifact_id));for(const point of scope.points)assert.ok(content.preparation_context.warnings.includes(point));
 state=s.state();const nextOffer=prepareDocumentSection(s.dir,s.id,state.dossier.revision,state.sha256,{artifact_id:offer.artifact_id,key:'segment',value:'Different fictional customer',reason:'New audience'});s.save(nextOffer);state=s.state();
 assert.throws(()=>prepareDocumentSection(s.dir,s.id,state.dossier.revision,state.sha256,{artifact_id:revised.artifact_id,key:'stop',value:'Another stop condition',reason:'Revise'}),/current offer/);assert.equal(s.state().sha256,state.sha256);
});
test('section selection rejects no-op, unknown fields and extra properties without mutation',t=>{
 const s=setup(t),p=draft(s,'pricing');s.save(p);const state=s.state(),input={artifact_id:p.artifact_id,key:'price',value:'Manual price\nsecond line',reason:'Change'};
 for(const change of [{},{key:'missing'},{value:'x'.repeat(4001)},{reason:''},{assertion:'reported'}])assert.throws(()=>prepareDocumentSection(s.dir,s.id,state.dossier.revision,state.sha256,{...input,...change}));
 const blank=prepareDocumentSection(s.dir,s.id,state.dossier.revision,state.sha256,{...input,value:''});const field=JSON.parse(blank.content).fields.find(f=>f.key==='price');assert.equal(field.value,null);assert.equal(field.assertion,'unknown');assert.equal(s.state().sha256,state.sha256);
});


test('open points distinguish missing boundaries from review prompts without changing saved content',t=>{
 const s=setup(t),p=draft(s,'offer',{fields:[{key:'outcome',value:'A proposed observable output',assertion:'proposal',record_ids:[]}]});s.save(p);
 const before=s.state(),saved=readBusinessBrief(s.dir,s.id,p.artifact_id),review=documentReview(saved);
 assert.equal(review.missing_count,7);assert.ok(review.points.some(p=>p.key==='exclusions'&&p.kind==='missing'&&p.reason.includes('boundary')));
 assert.ok(review.points.some(p=>p.key==='outcome'&&p.kind==='review_prompt'));assert.ok(!review.points.some(p=>p.key==='outcome'&&p.kind==='missing'));
 assert.equal(s.state().sha256,before.sha256);assert.deepEqual(readBusinessBrief(s.dir,s.id,p.artifact_id),saved);
 const next=prepareDocumentSection(s.dir,s.id,before.dossier.revision,before.sha256,{artifact_id:p.artifact_id,key:'exclusions',value:'No ongoing support',reason:'Clarify limits'});s.save(next);
 const after=documentReview(readBusinessBrief(s.dir,s.id,next.artifact_id));assert.equal(after.missing_count,6);assert.ok(!after.points.some(p=>p.key==='exclusions'&&p.kind==='missing'));
 assert.equal(documentReview(readBusinessBrief(s.dir,s.id,p.artifact_id)).missing_count,7);
});
