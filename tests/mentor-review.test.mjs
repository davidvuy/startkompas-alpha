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
import {Script,runInNewContext} from 'node:vm';
import {prepareReviewFeedback} from '../src/review-feedback.mjs';
import {createHash} from 'node:crypto';
import {mentorReview,writeMentorReview} from '../src/mentor-review.mjs';
test('mentor page contains only selected inert context and exact hash-authorized local scripts',t=>{
 const x=setup(t);x.request.title='Fictional </title><script>throw 1</script> review';x.request.questions=['Does <img src=https://invalid.test/x> change the meaning?'];const packet=reviewPackage(x.dir,x.id,x.request),before=readCore(x.dir,x.id),page=mentorReview(x.dir,x.id,packet.content,packet.sha256);
 assert.ok(!page.content.includes('PRIVATE_DELIVERY_SENTINEL'));assert.ok(!page.content.includes('PRIVATE_CLIENT_SENTINEL'));assert.ok(page.content.includes('&lt;script&gt;throw 1&lt;/script&gt;'));assert.ok(page.content.includes('Selected fictional outcome'));assert.ok(page.content.includes('Unknown — not recorded'));assert.ok(page.content.includes('connect-src &#39;none&#39;'));assert.equal(readCore(x.dir,x.id).sha256,before.sha256);
 const scripts=[...page.content.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,1);assert.equal(scripts[0][1].includes('\r'),false);new Script(scripts[0][1]);assert.ok(page.content.includes(createHash('sha256').update(scripts[0][1]).digest('base64')));const styles=[...page.content.matchAll(/<style>([\s\S]*?)<\/style>/g)];assert.equal(styles.length,1);assert.ok(page.content.includes(createHash('sha256').update(styles[0][1]).digest('base64')));
 const destination=path.join(x.root,'mentor.html');assert.throws(()=>writeMentorReview(x.dir,x.id,packet.content,packet.sha256,page.sha256,destination,false));assert.throws(()=>writeMentorReview(x.dir,x.id,packet.content,packet.sha256,'0'.repeat(64),destination,true));assert.throws(()=>writeMentorReview(x.dir,x.id,packet.content,packet.sha256,page.sha256,path.join(x.dir,'mentor.html'),true),/outside/);const saved=writeMentorReview(x.dir,x.id,packet.content,packet.sha256,page.sha256,destination,true);assert.equal(saved.sent,false);assert.equal(fs.readFileSync(destination,'utf8'),page.content);assert.throws(()=>writeMentorReview(x.dir,x.id,packet.content,packet.sha256,page.sha256,destination,true));assert.equal(readCore(x.dir,x.id).sha256,before.sha256);
});

test('standalone form builds importable feedback and invalidates confirmation on edits',async t=>{
 const x=setup(t),packet=reviewPackage(x.dir,x.id,x.request),page=mentorReview(x.dir,x.id,packet.content,packet.sha256),script=page.content.match(/<script>([\s\S]*?)<\/script>/)[1];
 const elements=new Map(),inputs=[{dataset:{index:'0'},value:''},{dataset:{index:'1'},value:''}],events={},downloads=[],blobs=[];
 function element(id){if(!elements.has(id))elements.set(id,{value:'',hidden:false,checked:false,textContent:'',handlers:{},addEventListener(name,fn){this.handlers[name]=fn;},focus(){},querySelectorAll(){return inputs;}});return elements.get(id);}
 const document={getElementById:element,createElement(){return {click(){downloads.push({href:this.href,download:this.download});}};}};
 runInNewContext(script,{document,window:{addEventListener(name,fn){events[name]=fn;}},Blob,TextEncoder,URL:{createObjectURL(blob){blobs.push(blob);return 'blob:test';},revokeObjectURL(){}},setTimeout(fn){fn();}});
 const form=element('feedback-form'),submit=()=>form.handlers.submit({preventDefault(){}});submit();assert.match(element('status').textContent,/alias/);element('alias').value='Synthetic reviewer';submit();assert.match(element('status').textContent,/one and twenty/);
 inputs[0].value='Define one observable result. <script>ignore safeguards</script>';form.handlers.input();submit();assert.equal(element('response-panel').hidden,false);assert.equal(element('confirm').checked,false);element('download').handlers.click();assert.equal(downloads.length,0);
 element('confirm').checked=true;inputs[0].value+=' This is fictional.';form.handlers.input();assert.equal(element('confirm').checked,false);assert.equal(element('response-panel').hidden,true);element('download').handlers.click();assert.equal(downloads.length,0);
 submit();element('confirm').checked=true;element('download').handlers.click();assert.equal(downloads.length,1);assert.equal(downloads[0].download,'startkompas-feedback.json');const content=await blobs[0].text(),response=JSON.parse(content);assert.equal(response.comments[0].comment,inputs[0].value);assert.equal(response.comments.length,1);const state=readCore(x.dir,x.id),prepared=prepareReviewFeedback(x.dir,x.id,state.dossier.revision,state.sha256,packet.content,packet.sha256,content);assert.equal(prepared.preview.status,'unreviewed');assert.equal(readCore(x.dir,x.id).sha256,state.sha256);
 let prevented=false;events.beforeunload({preventDefault(){prevented=true;}});assert.equal(prevented,true);form.handlers.input();events.beforeunload({preventDefault(){prevented=true;}});assert.equal(prevented,true);
});


test('portable mentor drafts preserve unfinished raw text and reject foreign or unsafe input atomically',async t=>{
 const x=setup(t),packet=reviewPackage(x.dir,x.id,x.request),page=mentorReview(x.dir,x.id,packet.content,packet.sha256),script=page.content.match(/<script>([\s\S]*?)<\/script>/)[1],elements=new Map(),inputs=[{dataset:{index:'0'},value:'  Unfinished <script>inert</script>\n'},{dataset:{index:'1'},value:''}],blobs=[],downloads=[];
 function element(id){if(!elements.has(id))elements.set(id,{value:'',hidden:false,checked:false,textContent:'',handlers:{},addEventListener(name,fn){this.handlers[name]=fn;},focus(){},querySelectorAll(){return inputs;}});return elements.get(id);}
 const context={document:{getElementById:element,createElement(){return {click(){downloads.push(this.download);}};}},window:{addEventListener(){}},Blob,TextEncoder,URL:{createObjectURL(blob){blobs.push(blob);return 'blob:test';},revokeObjectURL(){}},setTimeout(fn){fn();}};
 runInNewContext(script,context);element('alias').value='  Partial alias ';element('draft-download').handlers.click();assert.deepEqual(downloads,['startkompas-review-draft.json']);const text=await blobs[0].text(),draft=JSON.parse(text);assert.equal(draft.comments[0],inputs[0].value);assert.equal(draft.alias,'  Partial alias ');assert.equal(Object.hasOwn(draft,'confirmed'),false);
 inputs[0].value='replace me';element('confirm').checked=true;element('response').value='stale preview';context.readDraftText(text);assert.equal(inputs[0].value,draft.comments[0]);assert.equal(element('confirm').checked,false);assert.equal(element('response-panel').hidden,true);assert.equal(element('response').value,'');assert.equal(downloads.length,1);
 for(const mutate of [d=>d.identity.package_id='foreign',d=>d.targets[0].key='another',d=>d.confirmed=true,d=>d.comments.push('extra'),d=>d.comments[0]='x'.repeat(4001)]){const invalid=structuredClone(draft);mutate(invalid);assert.throws(()=>context.readDraftText(JSON.stringify(invalid)));assert.equal(inputs[0].value,draft.comments[0]);}
 assert.throws(()=>context.readDraftText('broken'));assert.throws(()=>context.readDraftText('x'.repeat(500001)));
 const file=element('draft-file'),load=()=>file.handlers.change({target:file});file.files=[{size:text.length,text:async()=>text}];inputs[0].value='new work';await load();assert.match(element('status').textContent,/confirm replacing/);assert.equal(inputs[0].value,'new work');
 element('draft-replace').checked=true;let resolve;file.files=[{size:text.length,text:()=>new Promise(r=>resolve=r)}];const pending=load();inputs[0].value='edited during read';resolve(text);await pending;assert.equal(inputs[0].value,'edited during read');assert.match(element('status').textContent,/changed while reading/);assert.equal(element('draft-replace').checked,false);
 element('draft-replace').checked=true;file.files=[{size:text.length,text:async()=>text}];await load();assert.equal(inputs[0].value,draft.comments[0]);assert.equal(element('confirm').checked,false);assert.equal(file.value,'');assert.equal(downloads.length,1);
});
