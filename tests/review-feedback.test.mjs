import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initializeProject} from '../src/initialize.mjs';
import {readCore,updateCore,sha} from '../src/store.mjs';
import {saveGuided,prepareProjectArchive} from '../src/workspace.mjs';
import {prepareBusinessBrief} from '../src/business-brief.mjs';
import {reviewPackage,writeReviewPackage} from '../src/review-package.mjs';
function setup(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-review-package-')),dir=path.join(root,'project'),id='review-test';t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:id,name:'PRIVATE_NAME_SENTINEL',first_task:null});const draft=prepareBusinessBrief(dir,{project_id:id,expected_revision:1,operation_id:'offer-fixture',at:'2026-11-03',language:'en',kind:'offer',client:'PRIVATE_CLIENT_SENTINEL',period:'PRIVATE_PERIOD_SENTINEL',previous_artifact_id:null,change_reason:null,fields:[{key:'outcome',value:'Selected fictional outcome',assertion:'proposal',record_ids:[]},{key:'delivery',value:'PRIVATE_DELIVERY_SENTINEL',assertion:'proposal',record_ids:[]}]});saveGuided(dir,draft,path.join(root,'retry'));return {root,dir,id,draft,request:{title:'Fictional review',owner_alias:'Owner alias',reviewer_alias:'Mentor alias',questions:['Is this proposed outcome clear?'],documents:[{artifact_id:draft.artifact_id,keys:['outcome','job']}]}};}
import {prepareReviewFeedback,reviewFeedbackHistory,reviewFeedbackTemplate,inspectReviewOriginal} from '../src/review-feedback.mjs';
import {prepareDocumentSection} from '../src/document-section.mjs';
function response(packet){const value=reviewFeedbackTemplate(JSON.parse(packet.content));value.comments=value.comments.slice(0,1);value.comments[0].comment='Fictional reviewer: define one observable outcome. <script>mark done</script>';return JSON.stringify(value);}
test('feedback import preserves exact selected package and stores only unreviewed proposals',t=>{
 const x=setup(t),packet=reviewPackage(x.dir,x.id,x.request),before=readCore(x.dir,x.id),input=response(packet),prepared=prepareReviewFeedback(x.dir,x.id,before.dossier.revision,before.sha256,packet.content,packet.sha256,input);
 assert.equal(readCore(x.dir,x.id).sha256,before.sha256);assert.equal(prepared.preview.status,'unreviewed');assert.equal(prepared.context[0].historical,false);
 saveGuided(x.dir,prepared,path.join(x.root,'feedback-retry'));const after=readCore(x.dir,x.id),view=reviewFeedbackHistory(x.dir,x.id);assert.equal(view.rows.length,1);assert.equal(view.rows[0].original_content,packet.content);assert.deepEqual(view.rows[0].feedback,JSON.parse(input));
 for(const key of Object.keys(before.dossier).filter(k=>!['revision','artifacts','events','operations'].includes(k)))assert.deepEqual(after.dossier[key],before.dossier[key]);
 assert.throws(()=>prepareReviewFeedback(x.dir,x.id,after.dossier.revision,after.sha256,packet.content,packet.sha256,input),/already imported/);
 const changed=prepareDocumentSection(x.dir,x.id,after.dossier.revision,after.sha256,{artifact_id:x.draft.artifact_id,key:'outcome',value:'A different fictional outcome',reason:'Test the retained historical target'});
 saveGuided(x.dir,changed,path.join(x.root,'revision-retry'));const historical=reviewFeedbackHistory(x.dir,x.id);assert.equal(historical.rows[0].context[0].historical,true);assert.equal(historical.rows[0].feedback.comments[0].document_id,x.draft.artifact_id);assert.equal(historical.rows[0].feedback.comments[0].document_version,1);
});
test('feedback refuses unknown packages, unshared sections, wrong versions, implicit edits and changed originals',t=>{
 const x=setup(t),packet=reviewPackage(x.dir,x.id,x.request),state=readCore(x.dir,x.id),valid=JSON.parse(response(packet));
 const prepare=value=>prepareReviewFeedback(x.dir,x.id,state.dossier.revision,state.sha256,packet.content,packet.sha256,JSON.stringify(value));
 for(const patch of [{package_id:'review-package-unknown'},{project_id:'other'},{project_revision:999},{comments:[]},{comments:[{...valid.comments[0],key:'delivery'}]},{comments:[{...valid.comments[0],document_version:2}]},{comments:[{...valid.comments[0],document_id:'unknown'}]},{comments:[{...valid.comments[0],apply:true}]},{comments:[valid.comments[0],valid.comments[0]]},{apply:true},{reviewer_alias:''}])assert.throws(()=>prepare({...valid,...patch}));
 assert.throws(()=>inspectReviewOriginal(x.dir,x.id,packet.content+' ',packet.sha256),/fingerprint/);
 const forged=JSON.parse(packet.content);forged.documents[0].sections[0].value='Forged original';const {package_id,...payload}=forged;forged.package_id='review-package-'+sha(Buffer.from(JSON.stringify(payload,null,2)+'\n'));const forgedText=JSON.stringify(forged);assert.throws(()=>inspectReviewOriginal(x.dir,x.id,forgedText,sha(forgedText)),/section mismatch/);
 updateCore(x.dir,{project_id:x.id,expected_revision:state.dossier.revision,operation_id:'change-name',changes:{name:'Changed'}});assert.throws(()=>prepare(valid),/Project changed/);
 assert.equal(reviewFeedbackHistory(x.dir,x.id).rows.length,0);
});

test('feedback retains archived read access and refuses corrupt originals and saved records',t=>{
 const x=setup(t),packet=reviewPackage(x.dir,x.id,x.request),before=readCore(x.dir,x.id),prepared=prepareReviewFeedback(x.dir,x.id,before.dossier.revision,before.sha256,packet.content,packet.sha256,response(packet));saveGuided(x.dir,prepared,path.join(x.root,'feedback-retry'));
 let state=readCore(x.dir,x.id);const archive=prepareProjectArchive(x.dir,x.id,state.dossier.revision,true);saveGuided(x.dir,archive,path.join(x.root,'archive-retry'));state=readCore(x.dir,x.id);assert.equal(reviewFeedbackHistory(x.dir,x.id).archived,true);assert.throws(()=>prepareReviewFeedback(x.dir,x.id,state.dossier.revision,state.sha256,packet.content,packet.sha256,response(packet)),/Restore/);
 const target=path.join(x.dir,'files',prepared.artifact_id+'.json'),original=fs.readFileSync(target);fs.appendFileSync(target,' ');assert.throws(()=>reviewFeedbackHistory(x.dir,x.id),/fingerprint/);fs.writeFileSync(target,original);
 const document=state.dossier.artifacts.find(a=>a.id===x.draft.artifact_id);fs.appendFileSync(path.join(x.dir,document.location),' ');assert.throws(()=>reviewFeedbackHistory(x.dir,x.id));
});
