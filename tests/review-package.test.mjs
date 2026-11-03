import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initializeProject} from '../src/initialize.mjs';
import {readCore,updateCore} from '../src/store.mjs';
import {saveGuided} from '../src/workspace.mjs';
import {prepareBusinessBrief} from '../src/business-brief.mjs';
import {reviewPackage,writeReviewPackage} from '../src/review-package.mjs';
function setup(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-review-package-')),dir=path.join(root,'project'),id='review-test';t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:id,name:'PRIVATE_NAME_SENTINEL',first_task:null});const draft=prepareBusinessBrief(dir,{project_id:id,expected_revision:1,operation_id:'offer-fixture',at:'2026-11-03',language:'en',kind:'offer',client:'PRIVATE_CLIENT_SENTINEL',period:'PRIVATE_PERIOD_SENTINEL',previous_artifact_id:null,change_reason:null,fields:[{key:'outcome',value:'Selected fictional outcome',assertion:'proposal',record_ids:[]},{key:'delivery',value:'PRIVATE_DELIVERY_SENTINEL',assertion:'proposal',record_ids:[]}]});saveGuided(dir,draft,path.join(root,'retry'));return {root,dir,id,draft,request:{title:'Fictional review',owner_alias:'Owner alias',reviewer_alias:'Mentor alias',questions:['Is this proposed outcome clear?'],documents:[{artifact_id:draft.artifact_id,keys:['outcome','job']}]}};}
test('review package exports only selected content with exact document identity and explicit local roles',t=>{
 const x=setup(t),before=readCore(x.dir,x.id),p=reviewPackage(x.dir,x.id,x.request),body=JSON.parse(p.content);assert.equal(readCore(x.dir,x.id).sha256,before.sha256);
 for(const secret of ['PRIVATE_NAME_SENTINEL','PRIVATE_CLIENT_SENTINEL','PRIVATE_PERIOD_SENTINEL','PRIVATE_DELIVERY_SENTINEL',x.dir])assert.ok(!p.content.includes(secret));assert.equal(body.documents[0].sections[1].value,null);assert.equal(body.documents[0].sections[1].assertion,'unknown');assert.equal(body.documents[0].sections[0].assertion,'proposal');assert.equal(body.documents[0].artifact_id,x.draft.artifact_id);assert.equal(body.roles.editor_access,'not_granted');assert.ok(body.documents[0].excluded_section_keys.includes('delivery'));
 const destination=path.join(x.root,'review.json');assert.throws(()=>writeReviewPackage(x.dir,x.id,x.request,p.sha256,destination,false),/confirm/);assert.throws(()=>writeReviewPackage(x.dir,x.id,x.request,'0'.repeat(64),destination,true),/changed/);assert.throws(()=>writeReviewPackage(x.dir,x.id,x.request,p.sha256,path.join(x.dir,'review.json'),true),/outside/);
 const result=writeReviewPackage(x.dir,x.id,x.request,p.sha256,destination,true);assert.equal(result.sent,false);assert.equal(fs.readFileSync(destination,'utf8'),p.content);assert.throws(()=>writeReviewPackage(x.dir,x.id,x.request,p.sha256,destination,true));assert.equal(readCore(x.dir,x.id).sha256,before.sha256);
 updateCore(x.dir,{project_id:x.id,expected_revision:before.dossier.revision,operation_id:'change-name',changes:{name:'Another private name'}});assert.throws(()=>writeReviewPackage(x.dir,x.id,x.request,p.sha256,path.join(x.root,'stale.json'),true),/changed/);assert.equal(fs.existsSync(path.join(x.root,'stale.json')),false);
});
test('review package refuses implicit selection and keeps sensitive selected prose visible for review',t=>{
 const x=setup(t);for(const patch of [{documents:[]},{questions:[]},{owner_alias:''},{reviewer_alias:'bad\nidentity'},{documents:[{artifact_id:x.draft.artifact_id,keys:[]}]},{documents:[{artifact_id:x.draft.artifact_id,keys:['outcome','outcome']}]},{documents:[{artifact_id:x.draft.artifact_id,keys:['not-a-section']}]},{documents:[...x.request.documents,...x.request.documents]},{permissions:['write']}])assert.throws(()=>reviewPackage(x.dir,x.id,{...x.request,...patch}));
 const selected=reviewPackage(x.dir,x.id,{...x.request,documents:[{artifact_id:x.draft.artifact_id,keys:['delivery']}]});assert.ok(selected.content.includes('PRIVATE_DELIVERY_SENTINEL'));assert.match(JSON.parse(selected.content).warning,/private details/);assert.ok(selected.sharing_review);
});
