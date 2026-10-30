import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {startLocalUI} from '../src/local-ui-server.mjs';
import {readCore,updateCore,attachFile} from '../src/store.mjs';
import {exportCore,restoreCore} from '../src/transfer.mjs';
import {readBusinessBrief,prepareBusinessBrief} from '../src/business-brief.mjs';

async function setup(t){
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'sk-local-ui-')));
 const app=await startLocalUI({root});
 t.after(async()=>{await app.close();fs.rmSync(root,{recursive:true,force:true});});
 const request=(route='/api/projects',data={},headers={},method='POST')=>new Promise((resolve,reject)=>{
  const req=http.request(app.origin+route,{method,headers:{Origin:app.origin,'X-Startkompas-Session':app.token,'Content-Type':'application/json',...headers}},res=>{
   const chunks=[];res.on('data',chunk=>chunks.push(chunk));res.on('end',()=>{const text=Buffer.concat(chunks).toString();resolve({status:res.statusCode,headers:res.headers,text,json:()=>JSON.parse(text)});});
  });req.on('error',reject);req.end(method==='GET'?undefined:typeof data==='string'?data:JSON.stringify(data));
 });
 return {root,app,request};
}
const input=(id='example')=>({id,name:'Synthetic project',task:'Check a problem',confirmed:true});

test('historical offer reuse prepares a new explained revision without replacing old files',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input())).json().ref,dir=path.join(root,'example');
 const first=await offer(request,ref);first.fields.outcome='Original fictional outcome';
 const p1=(await request('/api/offer-preview',first)).json(),s1=(await request('/api/offer-save',{ref,preview:p1.preview,confirmed:true})).json();
 const second=await offer(request,ref,s1.artifact_id);second.fields.outcome='Newer fictional outcome';
 const p2=(await request('/api/offer-preview',second)).json(),s2=(await request('/api/offer-save',{ref,preview:p2.preview,confirmed:true})).json();
 const state=readCore(dir,'example'),oldFiles=state.dossier.artifacts.map(a=>[a.location,fs.readFileSync(path.join(dir,a.location))]);
 const restored=(await request('/api/offer-restore',{ref,id:s1.artifact_id})).json();assert.equal(restored.source_version,1);assert.equal(restored.latest.previous,s2.artifact_id);assert.equal(restored.fields.outcome,'Original fictional outcome');assert.equal(readCore(dir,'example').sha256,state.sha256);
 const proposed={ref,...restored.latest,fields:restored.fields,reason:''};assert.equal((await request('/api/offer-preview',proposed)).status,400);
 proposed.reason='Restore original scope after reviewing the alternatives';const p3=(await request('/api/offer-preview',proposed)).json();assert.equal((await request('/api/offer-save',{ref,preview:p3.preview,confirmed:true})).status,200);
 assert.equal(readCore(dir,'example').dossier.revision,4);assert.ok(oldFiles.every(([p,b])=>fs.readFileSync(path.join(dir,p)).equals(b)));
 assert.equal((await request('/api/offer-restore',{ref,id:s1.artifact_id},{Origin:'https://attacker.invalid'})).status,403);
 const v=(await request('/api/show',{ref})).json();await request('/api/archive',{ref,revision:v.revision,sha256:v.sha256,archived:true,confirmed:true});assert.equal((await request('/api/offer-restore',{ref,id:s1.artifact_id})).status,409);
});

test('draft text search finds original documents and reports unreadable content without writes',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input())).json().ref;
 const draft=await offer(request,ref);draft.fields.outcome='Unique handover wording only inside the draft';
 const preview=(await request('/api/offer-preview',draft)).json(),saved=(await request('/api/offer-save',{ref,preview:preview.preview,confirmed:true})).json();
 const dir=path.join(root,'example'),before=fs.readFileSync(path.join(dir,'project.json')),query={ref,revision:2,query:'HANDOVER WORDING',offset:0};
 const found=await request('/api/draft-search',query);assert.equal(found.status,200);assert.equal(found.json().total_matches,1);assert.equal(found.json().records[0].id,saved.artifact_id);assert.match(found.json().records[0].snippet,/Unique handover/);assert.equal(found.json().partial,false);
 assert.equal((await request('/api/search',query)).json().total_matches,0);
 assert.equal((await request('/api/draft-search',{...query,revision:1})).status,409);
 assert.equal((await request('/api/draft-search',query,{Origin:'https://attacker.invalid'})).status,403);
 assert.equal((await request('/api/draft-search',{...query,path:'../escape'})).status,400);
 const artifact=readCore(dir,'example').dossier.artifacts.find(a=>a.id===saved.artifact_id);fs.appendFileSync(path.join(dir,artifact.location),'corrupt');
 const partial=(await request('/api/draft-search',query)).json();assert.equal(partial.partial,true);assert.equal(partial.unavailable_count,1);assert.equal(partial.total_matches,0);
 assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);
});

test('task choices preserve evidence states, require confirmation and reject stale and archived writes',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input())).json().ref,dir=path.join(root,'example');
 const original=readCore(dir,'example').dossier.tasks[0];
 const task=(await request('/api/record',{ref,id:'first-task'})).json();
 const change={ref,id:'first-task',revision:task.revision,sha256:task.sha256,action:'in_progress',reason:'Starting the synthetic check',confirmed:false};
 assert.equal((await request('/api/task-update',change)).status,400);change.confirmed=true;
 assert.equal((await request('/api/task-update',change,{Origin:'https://attacker.invalid'})).status,403);
 assert.equal((await request('/api/task-update',change)).status,200);
 const updated=readCore(dir,'example').dossier;assert.deepEqual(updated.tasks[0],{...original,progress:'in_progress'});assert.equal(updated.events.at(-1).type,'user-reported-progress');
 assert.equal((await request('/api/task-update',change)).status,409);
 updateCore(dir,{project_id:'example',expected_revision:2,operation_id:'add-second-task',changes:{tasks:[...updated.tasks,{...original,id:'second-task',title:'Another synthetic task'}]}});
 const second=(await request('/api/record',{ref,id:'second-task'})).json();
 assert.equal((await request('/api/task-update',{...change,id:'second-task',revision:second.revision,sha256:second.sha256,action:'focus'})).status,200);
 assert.equal(readCore(dir,'example').dossier.active_task_id,'second-task');
 assert.deepEqual(readCore(dir,'example').dossier.tasks[1],{...original,id:'second-task',title:'Another synthetic task'});
 const v=(await request('/api/show',{ref})).json();await request('/api/archive',{ref,revision:v.revision,sha256:v.sha256,archived:true,confirmed:true});
 const a=(await request('/api/record',{ref,id:'first-task'})).json();assert.equal(a.archived,true);
 assert.equal((await request('/api/task-update',{...change,revision:a.revision,sha256:a.sha256})).status,409);
});

test('latest offer resolution follows saved successors without bypassing stale preview guards',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input())).json().ref;
 const first=(await request('/api/offer-preview',await offer(request,ref))).json();
 const saved=(await request('/api/offer-save',{ref,preview:first.preview,confirmed:true})).json();
 const stale=await offer(request,ref,saved.artifact_id),revision={...stale,fields:{...stale.fields,outcome:'Changed elsewhere'}};
 const next=(await request('/api/offer-preview',revision)).json(),savedNext=(await request('/api/offer-save',{ref,preview:next.preview,confirmed:true})).json();
 const file=path.join(root,'example','project.json'),before=fs.readFileSync(file);
 const latest=await request('/api/offer-latest',{ref,previous:saved.artifact_id});assert.equal(latest.status,200);assert.equal(latest.json().previous,savedNext.artifact_id);assert.equal(latest.json().fields.find(f=>f.key==='outcome').value,'Changed elsewhere');
 assert.equal((await request('/api/offer-preview',stale)).status,409);
 assert.equal((await request('/api/offer-latest',{ref,previous:saved.artifact_id},{Origin:'https://attacker.invalid'})).status,403);
 assert.equal((await request('/api/offer-latest',{ref,previous:'missing'})).status,409);
 assert.equal((await request('/api/offer-latest',{ref,previous:null,path:'../escape'})).status,400);
 assert.deepEqual(fs.readFileSync(file),before);
 const v=(await request('/api/show',{ref})).json();await request('/api/archive',{ref,revision:v.revision,sha256:v.sha256,archived:true,confirmed:true});
 assert.equal((await request('/api/offer-latest',{ref,previous:saved.artifact_id})).status,409);
});

test('practice marker survives rename and transfer and appears in drafts and reports',async t=>{
 const {root,request}=await setup(t);
 assert.equal((await request('/api/create',{...input(),practice:'yes'})).status,400);
 const ref=(await request('/api/create',{...input(),practice:true})).json().ref,dir=path.join(root,'example');
 assert.equal((await request('/api/show',{ref})).json().practice,true);
 const draft=await offer(request,ref),preview=(await request('/api/offer-preview',draft)).json();assert.match(preview.markdown,/FICTIONAL PRACTICE/);
 const saved=(await request('/api/offer-save',{ref,preview:preview.preview,confirmed:true})).json();
 updateCore(dir,{project_id:'example',expected_revision:2,operation_id:'rename-practice',changes:{name:'Renamed without practice in the name'}});
 assert.equal((await request()).json().projects[0].practice,true);
 assert.match((await request('/api/draft',{ref,id:saved.artifact_id})).json().markdown,/FICTIONAL PRACTICE/);
 assert.match((await request('/api/report-preview',{ref,sections:['summary']})).json().markdown,/FICTIONAL PRACTICE/);
 exportCore(dir,'example',path.join(root,'practice-export'));restoreCore(path.join(root,'practice-export'),'example',path.join(root,'practice-restored'));
 assert.ok((await request()).json().projects.every(p=>p.practice));
 assert.equal(readCore(dir,'example').dossier.facts.length,0);
});

test('technical support report includes only allowlisted runtime metadata',async t=>{
 const {root,app,request}=await setup(t);await request('/api/create',{...input(),name:'Private-name-sentinel',task:'Private-task-sentinel'});
 const result=await request('/api/diagnostics');assert.equal(result.status,200);
 assert.match(result.json().markdown,/Application version:/);assert.match(result.json().markdown,/Node version:/);
 for(const secret of [root,app.token,'Private-name-sentinel','Private-task-sentinel'])assert.ok(!result.text.includes(secret));
 assert.deepEqual(Object.keys(result.json()),['markdown']);
 assert.equal((await request('/api/diagnostics',{}, {Origin:'https://attacker.invalid'})).status,403);
 assert.equal((await request('/api/diagnostics',{include_projects:true})).status,400);
});

test('record search and draft inspection preserve provenance, refuse invalid input and never write',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',{...input(),context:{customer:'Synthetic studios',outcome:'One draft'}})).json().ref;
 const draft=await offer(request,ref),preview=(await request('/api/offer-preview',draft)).json();
 const saved=(await request('/api/offer-save',{ref,preview:preview.preview,confirmed:true})).json();
 const dir=path.join(root,'example'),before=fs.readFileSync(path.join(dir,'project.json'));
 const read=await request('/api/draft',{ref,id:saved.artifact_id});assert.equal(read.status,200);assert.match(read.json().markdown,/Synthetic studios/);assert.ok(read.json().basis_ids.includes('starting-customer'));
 const record=(await request('/api/record',{ref,id:'starting-customer'})).json();assert.equal(record.record.assertion,'unknown');assert.ok(record.dependents.some(r=>r.id===saved.artifact_id));
 const search=(await request('/api/search',{ref,revision:2,query:'SYNTHETIC STUDIOS',offset:0})).json();assert.ok(search.records.some(r=>r.id==='starting-customer'));
 assert.equal((await request('/api/search',{ref,revision:1,query:'',offset:0})).status,409);
 assert.equal((await request('/api/record',{ref,id:'missing'})).status,404);
 for(const [route,payload]of [['draft',{ref,id:saved.artifact_id}],['record',{ref,id:'first-task'}],['search',{ref,revision:2,query:'',offset:0}]]){
  assert.equal((await request('/api/'+route,payload,{Origin:'https://attacker.invalid'})).status,403);
  assert.equal((await request('/api/'+route,{...payload,path:'../escape'})).status,400);
 }
 assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);
 const artifact=readCore(dir,'example').dossier.artifacts.find(a=>a.id===saved.artifact_id);fs.appendFileSync(path.join(dir,artifact.location),'bad');
 assert.equal((await request('/api/draft',{ref,id:saved.artifact_id})).status,409);
 assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);
});

test('history and revision comparison read shared snapshots without changing project bytes',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input())).json().ref;
 const view=(await request('/api/show',{ref})).json();
 await request('/api/archive',{ref,revision:view.revision,sha256:view.sha256,archived:true,confirmed:true});
 const dir=path.join(root,'example'),before=fs.readFileSync(path.join(dir,'project.json'));
 const history=await request('/api/history',{ref});assert.equal(history.status,200);
 assert.equal(history.json().revision,2);assert.equal(history.json().snapshots[0].revision,1);assert.equal(history.json().events[0].type,'project-archived');
 const compared=await request('/api/compare',{ref,before:1,after:2});assert.equal(compared.status,200);assert.match(compared.json().markdown,/1 → 2/);assert.match(compared.json().markdown,/events/);
 for(const route of ['/api/history','/api/compare']){
  const payload=route.endsWith('compare')?{ref,before:1,after:2}:{ref};
  assert.equal((await request(route,payload,{Origin:'https://attacker.invalid'})).status,403);
  assert.equal((await request(route,{...payload,path:'../elsewhere'})).status,400);
  assert.equal((await request(route,{...payload,ref:'unknown'})).status,404);
 }
 assert.equal((await request('/api/compare',{ref,before:2,after:1})).status,409);
 assert.equal((await request('/api/compare',{ref,before:1,after:99})).status,409);
 assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);
 const snapshot=fs.readdirSync(path.join(dir,'.history'))[0];fs.appendFileSync(path.join(dir,'.history',snapshot),'corrupt');
 assert.equal((await request('/api/history',{ref})).json().snapshots[0].valid,false);
 assert.equal((await request('/api/compare',{ref,before:1,after:2})).status,409);
 assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);
});

test('browser API creates and resumes the same dossier as a separate CLI process',async t=>{
 const {root,request}=await setup(t);
 assert.deepEqual((await request()).json().projects,[]);
 const created=await request('/api/create',input());assert.equal(created.status,200);
 const ref=created.json().ref,view=(await request('/api/show',{ref})).json();
 assert.equal(view.project_id,'example');assert.equal(view.revision,1);assert.equal(view.actions[0].title,'Check a problem');
 const cli=fileURLToPath(new URL('../src/core-cli.mjs',import.meta.url));
 const read=JSON.parse(execFileSync(process.execPath,[cli,'read',path.join(root,'example'),'example'],{encoding:'utf8'}));
 assert.equal(read.dossier.name,view.name);assert.deepEqual(read.dossier.facts,[]);
 const before=fs.readFileSync(path.join(root,'example','project.json'));
 assert.equal((await request('/api/create',input())).status,409);
 assert.deepEqual(fs.readFileSync(path.join(root,'example','project.json')),before);
 assert.equal((await request()).json().projects[0].ref,ref);
});

test('foreign origins, hosts, sites and missing or malformed session tokens cannot write',async t=>{
 const {root,request}=await setup(t);
 for(const headers of [{Origin:'https://attacker.invalid'},{Origin:''},{Host:'attacker.invalid'},{'Sec-Fetch-Site':'cross-site'},{'Sec-Fetch-Site':'same-site'},{'X-Startkompas-Session':''},{'X-Startkompas-Session':'a'.repeat(64)},{'X-Startkompas-Session':'é'.repeat(64)}]){
  assert.equal((await request('/api/create',input(),headers)).status,403);
 }
 assert.deepEqual(fs.readdirSync(root),[]);
});

test('explicit confirmation, strict payloads, paths and content types guard creation',async t=>{
 const {root,request}=await setup(t);
 for(const bad of [{...input(),confirmed:false},{...input(),id:'../escape'},{...input(),id:'x/y'},{...input(),extra:true},{...input(),name:' '},[],null])assert.equal((await request('/api/create',bad)).status,400);
 assert.equal((await request('/api/create','{')).status,400);
 assert.equal((await request('/api/create',input(),{'Content-Type':'text/plain'})).status,415);
 assert.equal((await request('/api/create',input(),{},'GET')).status,405);
 // An oversized stream may be closed early; it must never create a dossier.
 const oversized=await request('/api/create',JSON.stringify({...input(),task:'x'.repeat(70000)})).catch(e=>({status:e.code}));
 assert.ok([413,'ECONNRESET'].includes(oversized.status));
 assert.deepEqual(fs.readdirSync(root),[]);
});

test('static allowlist exposes only UI assets with CSP and no session secret',async t=>{
 const {app,request}=await setup(t);
 const navigation={'Sec-Fetch-Site':'cross-site','Sec-Fetch-Mode':'navigate','Sec-Fetch-Dest':'document'};
 assert.equal((await request('/',{},navigation,'GET')).status,200);
 assert.equal((await request('/api/projects',{},navigation)).status,403);
 for(const route of ['/','/ui.js','/recovery.js','/ui.css','/brand.png']){
  const response=await request(route,{}, {},'GET');assert.equal(response.status,200);
  assert.equal(response.headers['cache-control'],'no-store');assert.match(response.headers['content-security-policy'],/frame-ancestors 'none'/);
  assert.ok(!response.text.includes(app.token));assert.equal(response.headers['access-control-allow-origin'],undefined);
 }
 for(const route of ['/package.json','/project.json','/../package.json','/src/store.mjs','/ui.js?x=1'])assert.equal((await request(route,{}, {},'GET')).status,404);
});

test('selection distinguishes duplicate names and refuses missing or replaced identity',async t=>{
 const {root,request}=await setup(t);
 const one=(await request('/api/create',input('one'))).json();
 await request('/api/create',input('two'));
 const list=(await request()).json().projects;assert.equal(list.length,2);assert.notEqual(list[0].ref,list[1].ref);
 assert.notEqual(list[0].folder,list[1].folder);assert.ok(list.every(p=>p.updated&&p.revision===1));
 assert.equal((await request('/api/show',{ref:'../one'})).status,404);
 const file=path.join(root,'one','project.json'),data=JSON.parse(fs.readFileSync(file));data.project_id='replacement';fs.writeFileSync(file,JSON.stringify(data));
 assert.equal((await request('/api/show',{ref:one.ref})).status,409);
 fs.renameSync(path.join(root,'one'),path.join(root,'moved'));
 assert.equal((await request('/api/show',{ref:one.ref})).status,409);
});

test('linked folders are not traversed and malformed dossiers are reported without overwrite',async t=>{
 const {root,request}=await setup(t);
 await request('/api/create',input('original'));
 fs.symlinkSync(path.join(root,'original'),path.join(root,'linked'),process.platform==='win32'?'junction':'dir');
 fs.mkdirSync(path.join(root,'broken'));fs.writeFileSync(path.join(root,'broken','project.json'),'{invalid');
 const result=(await request()).json();assert.equal(result.projects.length,1);assert.deepEqual(result.unavailable,['broken']);
 assert.equal(fs.readFileSync(path.join(root,'broken','project.json'),'utf8'),'{invalid');
 assert.equal((await request('/api/create',input('linked'))).status,409);
});

test('a new server session rejects the prior token',async t=>{
 const {root,app}=await setup(t);const other=await startLocalUI({root});t.after(()=>other.close());
 assert.notEqual(app.token,other.token);
 const response=await fetch(other.origin+'/api/projects',{method:'POST',headers:{Origin:other.origin,'Content-Type':'application/json','X-Startkompas-Session':app.token},body:'{}'});
 assert.equal(response.status,403);
});

async function offer(request,ref,previous=null){
 const form=await request('/api/offer-form',{ref,previous});assert.equal(form.status,200);const f=form.json();
 return {ref,previous,revision:f.revision,sha256:f.sha256,client:f.client,period:f.period,reason:previous?'Narrow the scope':'',fields:Object.fromEntries(f.fields.map(x=>[x.key,x.value]))};
}
test('offer preview is read-only, confirmed save is repeatable and revisions preserve original bytes',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input())).json().ref,dir=path.join(root,'example');
 const draft=await offer(request,ref);draft.fields.segment='Small agencies';draft.fields.outcome='<script>example</script>';
 const p=await request('/api/offer-preview',draft);assert.equal(p.status,200);assert.ok(!p.json().markdown.includes('<script>'));assert.match(p.json().markdown,/Offer hypothesis/);
 assert.equal(readCore(dir,'example').dossier.revision,1);assert.equal(fs.readdirSync(root).length,1);
 const save={ref,preview:p.json().preview,confirmed:false};assert.equal((await request('/api/offer-save',save)).status,400);
 save.confirmed=true;const saved=await request('/api/offer-save',save);assert.equal(saved.status,200);
 assert.deepEqual((await request('/api/offer-save',save)).json(),saved.json());assert.equal(readCore(dir,'example').dossier.revision,2);
 const id=saved.json().artifact_id,prior=readCore(dir,'example').dossier.artifacts.find(a=>a.id===id),before=fs.readFileSync(path.join(dir,prior.location));
 const revision=await offer(request,ref,id);revision.fields.outcome='One revised report';
 const next=(await request('/api/offer-preview',revision)).json();assert.equal((await request('/api/offer-save',{ref,preview:next.preview,confirmed:true})).status,200);
 assert.deepEqual(fs.readFileSync(path.join(dir,prior.location)),before);assert.equal(readCore(dir,'example').dossier.revision,3);
 assert.equal(readBusinessBrief(dir,'example',id).successor_ids.length,1);
 assert.equal((await request('/api/offer-form',{ref,previous:id})).status,409);
});
test('offer save rejects foreign origin, cross-project preview and stale revision without new writes',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input())).json().ref,other=(await request('/api/create',input('other'))).json().ref;
 const draft=await offer(request,ref),preview=(await request('/api/offer-preview',draft)).json().preview;
 const save={ref,preview,confirmed:true};
 assert.equal((await request('/api/offer-save',save,{Origin:'https://attacker.invalid'})).status,403);
 assert.equal((await request('/api/offer-save',{...save,ref:other})).status,409);
 const dir=path.join(root,'example');updateCore(dir,{project_id:'example',expected_revision:1,operation_id:'concurrent-cli',changes:{name:'Updated elsewhere'}});
 assert.equal((await request('/api/offer-save',save)).status,409);
 assert.equal((await request('/api/offer-preview',draft)).status,409);
 assert.equal(readCore(dir,'example').dossier.artifacts.length,0);assert.equal(fs.readdirSync(root).length,2);
});
test('offer payloads reject unknown fields and forged preview handles',async t=>{
 const {request}=await setup(t),ref=(await request('/api/create',input())).json().ref,draft=await offer(request,ref);
 assert.equal((await request('/api/offer-preview',{...draft,fields:{...draft.fields,unexpected:'value'}})).status,400);
 assert.equal((await request('/api/offer-preview',{...draft,fields:{...draft.fields,segment:{bad:true}}})).status,400);
 assert.equal((await request('/api/offer-save',{ref,preview:'made-up',confirmed:true})).status,409);
});

test('wizard context is optional, remains unknown and supplies traceable first-offer fields',async t=>{
 const {root,request}=await setup(t);
 const created=await request('/api/create',{...input(),context:{customer:'Small studios',outcome:'One clearer report'}});assert.equal(created.status,200);
 const ref=created.json().ref,dir=path.join(root,'example'),d=readCore(dir,'example').dossier;
 assert.equal(d.revision,1);assert.equal(d.facts.length,0);assert.equal(d.assumptions.length,2);assert.ok(d.assumptions.every(a=>a.assertion==='unknown'));
 const draft=await offer(request,ref);assert.equal(draft.fields.segment,'Small studios');assert.equal(draft.fields.outcome,'One clearer report');
 const preview=(await request('/api/offer-preview',draft)).json();const saved=(await request('/api/offer-save',{ref,preview:preview.preview,confirmed:true})).json();
 const brief=readBusinessBrief(dir,'example',saved.artifact_id);assert.deepEqual(brief.fields.find(f=>f.key==='segment').record_ids,['starting-customer']);assert.equal(brief.fields.find(f=>f.key==='segment').assertion,'proposal');
 const blank=await request('/api/create',{...input('blank'),context:{customer:'',outcome:'  '}});assert.equal(blank.status,200);assert.equal(readCore(path.join(root,'blank'),'blank').dossier.assumptions.length,0);
 for(const context of [null,{customer:'x'}, {customer:'x',outcome:'',invented:true},{customer:'x'.repeat(2001),outcome:''}])assert.equal((await request('/api/create',{...input('invalid'),context})).status,400);
 assert.ok(!fs.existsSync(path.join(root,'invalid')));
});

test('report export requires exact confirmation, rejects stale preview and leaves project bytes unchanged',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input())).json().ref,dir=path.join(root,'example'),before=fs.readFileSync(path.join(dir,'project.json'));
 const p=await request('/api/report-preview',{ref,sections:['summary','tasks']});assert.equal(p.status,200);assert.match(p.json().markdown,/Check a problem/);
 const save={ref,preview:p.json().preview,confirmed:false};assert.equal((await request('/api/report-save',save)).status,400);save.confirmed=true;
 assert.equal((await request('/api/offer-save',save)).status,409);
 const saved=await request('/api/report-save',save);assert.equal(saved.status,200);assert.equal(fs.readFileSync(path.join(root,saved.json().filename),'utf8'),p.json().markdown);
 assert.deepEqual((await request('/api/report-save',save)).json(),saved.json());assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);
 const stale=(await request('/api/report-preview',{ref,sections:['tasks']})).json();updateCore(dir,{project_id:'example',expected_revision:1,operation_id:'edit-after-report',changes:{name:'Changed'}});
 assert.equal((await request('/api/report-save',{ref,preview:stale.preview,confirmed:true})).status,409);
 assert.equal(fs.readdirSync(root).filter(x=>x.endsWith('.md')).length,1);
});

test('archive/restore persists in project history and export while preserving content and refusing stale writes',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input())).json().ref,dir=path.join(root,'example');
 const view=(await request('/api/show',{ref})).json(),before=readCore(dir,'example').dossier;
 const change={ref,revision:view.revision,sha256:view.sha256,archived:true,confirmed:false};
 assert.equal((await request('/api/archive',change)).status,400);change.confirmed=true;
 assert.equal((await request('/api/archive',change,{Origin:'https://attacker.invalid'})).status,403);
 assert.equal((await request('/api/archive',change)).status,200);
 const archived=readCore(dir,'example').dossier;assert.deepEqual(archived.tasks,before.tasks);assert.deepEqual(archived.facts,before.facts);assert.equal(archived.events.at(-1).type,'project-archived');
 assert.equal((await request()).json().projects[0].archived,true);assert.equal((await request('/api/show',{ref})).json().archived,true);
 assert.equal((await request('/api/offer-form',{ref,previous:null})).status,409);
 assert.equal((await request('/api/archive',{...change,archived:false})).status,409);
 exportCore(dir,'example',path.join(root,'export'));restoreCore(path.join(root,'export'),'example',path.join(root,'restored'));
 assert.ok((await request()).json().projects.filter(p=>p.id==='example').every(p=>p.archived));
 const latest=(await request('/api/show',{ref})).json();assert.equal((await request('/api/archive',{...change,revision:latest.revision,sha256:latest.sha256,archived:false})).status,200);
 assert.equal((await request('/api/show',{ref})).json().archived,false);assert.equal((await request('/api/offer-form',{ref,previous:null})).status,200);
 assert.deepEqual(readCore(dir,'example').dossier.tasks,before.tasks);
});

test('report routes reject cross-project handles, unknown sections and untrusted origins',async t=>{
 const {request}=await setup(t),ref=(await request('/api/create',input())).json().ref,other=(await request('/api/create',input('other'))).json().ref;
 assert.equal((await request('/api/report-preview',{ref,sections:['private-path'] })).status,409);
 assert.equal((await request('/api/report-preview',{ref,sections:[]})).status,409);
 const preview=(await request('/api/report-preview',{ref,sections:['summary']})).json().preview;
 assert.equal((await request('/api/report-save',{ref:other,preview,confirmed:true})).status,409);
 assert.equal((await request('/api/report-save',{ref,preview,confirmed:true},{Origin:'https://attacker.invalid'})).status,403);
 assert.equal((await request('/api/report-save',{ref,preview,confirmed:true,path:'../escape'})).status,400);
});

test('resume points at the last recorded draft without hiding damaged latest work or changing project bytes',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input('resume-example'))).json().ref,dir=path.join(root,'resume-example');
 assert.equal((await request('/api/show',{ref})).json().resume.latest_draft,null);
 const first=await offer(request,ref);first.fields.outcome='Fictional result';const preview=(await request('/api/offer-preview',first)).json();const saved=(await request('/api/offer-save',{ref,preview:preview.preview,confirmed:true})).json();
 const state=readCore(dir,'resume-example'),view=(await request('/api/show',{ref})).json();assert.equal(view.resume.latest_draft.id,saved.artifact_id);assert.equal(view.resume.latest_draft.version,1);assert.ok(view.resume.last_event);assert.equal(readCore(dir,'resume-example').sha256,state.sha256);
 const artifact=state.dossier.artifacts.find(a=>a.id===saved.artifact_id);fs.appendFileSync(path.join(dir,artifact.location),'broken');const damaged=(await request('/api/show',{ref})).json();assert.equal(damaged.resume.latest_draft.id,saved.artifact_id);assert.equal(damaged.resume.latest_draft.status,'unavailable_or_invalid');assert.equal(readCore(dir,'resume-example').sha256,state.sha256);
});

test('explicit profile answers retain unknowns and provenance with stale, conflict and archive guards',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input('profile-example'))).json().ref,dir=path.join(root,'profile-example');
 const empty=(await request('/api/profile',{ref})).json();assert.equal(empty.fields.length,4);assert.ok(empty.fields.every(f=>f.records.length===0));
 const answer={ref,revision:empty.revision,sha256:empty.sha256,key:'capacity',value:'Two evenings, self reported',date:'2026-10-30',confirmed:true};
 assert.equal((await request('/api/profile-save',{...answer,confirmed:false})).status,400);assert.equal((await request('/api/profile-save',answer,{Origin:'https://example.com'})).status,403);assert.equal((await request('/api/profile-save',{...answer,date:'2026-02-30'})).status,409);assert.equal(readCore(dir,'profile-example').dossier.revision,1);
 assert.equal((await request('/api/profile-save',answer)).status,200);assert.equal((await request('/api/profile-save',answer)).status,409);
 const profile=(await request('/api/profile',{ref})).json(),record=profile.fields.find(f=>f.key==='capacity').records[0];assert.equal(record.value,answer.value);assert.equal(record.assertion,'reported');assert.equal(record.sources[0].date,answer.date);assert.match(record.sources[0].title,/User statement/);assert.ok(profile.fields.filter(f=>f.key!=='capacity').every(f=>f.records.length===0));
 const unknown={...answer,revision:profile.revision,sha256:profile.sha256,value:''};assert.equal((await request('/api/profile-save',unknown)).status,200);const next=(await request('/api/profile',{ref})).json().fields.find(f=>f.key==='capacity').records[0];assert.equal(next.id,record.id);assert.equal(next.value,null);assert.equal(next.assertion,'unknown');assert.notEqual(next.source_ids[0],record.source_ids[0]);
 let state=readCore(dir,'profile-example');assert.ok(state.dossier.sources.some(s=>s.id===record.source_ids[0]));assert.equal(state.dossier.tasks[0].substantiation,'unreviewed');
 assert.throws(()=>updateCore(dir,{project_id:'profile-example',expected_revision:state.dossier.revision,operation_id:'synthetic-profile-conflict',changes:{profile:[...state.dossier.profile,{...state.dossier.profile[0],id:'conflicting-capacity'}]}}),/Duplicate profile key/);
 const conflict=(await request('/api/profile',{ref})).json();assert.equal(conflict.fields.find(f=>f.key==='capacity').records.length,1);
 assert.equal((await request('/api/archive',{ref,revision:conflict.revision,sha256:conflict.sha256,archived:true,confirmed:true})).status,200);const archived=(await request('/api/profile',{ref})).json();assert.equal(archived.archived,true);assert.equal((await request('/api/profile-save',{...answer,revision:archived.revision,sha256:archived.sha256,key:'stage'})).status,409);
});


test('offer field provenance remains explicit and editing reported text becomes a proposal',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',{...input('field-status'),context:{customer:'Provisional studios',outcome:''}})).json().ref,dir=path.join(root,'field-status');
 const initial=(await request('/api/offer-form',{ref,previous:null})).json();assert.equal(initial.fields.find(f=>f.key==='segment').assertion,'proposal');assert.deepEqual(initial.fields.find(f=>f.key==='segment').record_ids,['starting-customer']);assert.equal(initial.fields.find(f=>f.key==='outcome').assertion,'unknown');
 const prepared=prepareBusinessBrief(dir,{project_id:'field-status',expected_revision:1,operation_id:'reported-draft',at:'2026-10-30',language:'en',kind:'offer',client:'Fictional client',period:'Fictional trial',previous_artifact_id:null,change_reason:null,fields:[{key:'segment',value:'User-reported customer',assertion:'reported',record_ids:['starting-customer']}]});
 const file=path.join(root,'reported.json');fs.writeFileSync(file,prepared.content);attachFile(dir,prepared.update_request,file);
 const state=readCore(dir,'field-status'),form=(await request('/api/offer-form',{ref,previous:prepared.artifact_id})).json(),view=(await request('/api/show',{ref})).json();assert.equal(form.fields.find(f=>f.key==='segment').assertion,'reported');assert.equal(view.drafts[0].client,'Fictional client');assert.equal(view.drafts[0].period,'Fictional trial');assert.equal(readCore(dir,'field-status').sha256,state.sha256);
 const changed=await offer(request,ref,prepared.artifact_id);changed.fields.segment='New proposed customer';const preview=(await request('/api/offer-preview',changed)).json();const saved=(await request('/api/offer-save',{ref,preview:preview.preview,confirmed:true})).json();const latest=readBusinessBrief(dir,'field-status',saved.artifact_id);assert.equal(latest.fields.find(f=>f.key==='segment').assertion,'proposal');assert.deepEqual(latest.fields.find(f=>f.key==='segment').record_ids,[]);assert.equal(readCore(dir,'field-status').dossier.assumptions[0].assertion,'unknown');
});

test('connection map uses only declared dependency direction and opens original records read-only',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input('connections'))).json().ref,dir=path.join(root,'connections');
 const empty=(await request('/api/connections',{ref,id:null})).json();assert.equal(empty.target,'first-task');assert.equal(empty.edges.length,0);
 const state=readCore(dir,'connections');updateCore(dir,{project_id:'connections',expected_revision:1,operation_id:'map-fixture',changes:{assumptions:['customer','problem','test','unrelated'].map(id=>({id,text:'Fictional '+id,assertion:'unknown',source_ids:[]})),workflow:{...state.dossier.workflow,links:[{dependent_id:'first-task',prerequisite_id:'customer',reason:'Task uses declared customer context'},{dependent_id:'customer',prerequisite_id:'problem',reason:'Customer assumption uses this problem assumption'},{dependent_id:'problem',prerequisite_id:'test',reason:'Problem assumption awaits this declared check context'}]}}});
 const before=readCore(dir,'connections').sha256,map=(await request('/api/connections',{ref,id:'first-task'})).json();assert.deepEqual(map.nodes.map(n=>n.id),['first-task','customer','problem']);assert.equal(map.truncated,true);assert.equal(map.omitted_connections,1);assert.deepEqual(map.edges[0],{from:'first-task',to:'customer',reason:'Task uses declared customer context'});assert.ok(map.nodes.filter(n=>n.group==='assumptions').every(n=>n.assertion==='unknown'));
 const centered=(await request('/api/connections',{ref,id:'problem'})).json();assert.ok(centered.nodes.some(n=>n.id==='test'));assert.ok(!centered.nodes.some(n=>n.id==='unrelated'));assert.equal((await request('/api/record',{ref,id:centered.nodes[0].id})).json().record.id,'problem');assert.equal(readCore(dir,'connections').sha256,before);
 assert.equal((await request('/api/connections',{ref,id:'missing'})).status,409);assert.equal((await request('/api/connections',{ref,id:null,path:'../elsewhere'})).status,400);assert.equal((await request('/api/connections',{ref,id:null},{Origin:'https://example.com'})).status,403);
});
test('connection map bounds wide neighborhoods and discloses omitted edges',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input('wide-map'))).json().ref,dir=path.join(root,'wide-map'),state=readCore(dir,'wide-map');
 const assumptions=Array.from({length:80},(_,n)=>({id:'assumption-'+n,text:'Fictional assumption '+n,assertion:'unknown',source_ids:[]}));updateCore(dir,{project_id:'wide-map',expected_revision:1,operation_id:'wide-fixture',changes:{assumptions,workflow:{...state.dossier.workflow,links:assumptions.map(a=>({dependent_id:'first-task',prerequisite_id:a.id,reason:'Explicit fixture link'}))}}});
 const map=(await request('/api/connections',{ref,id:'first-task'})).json();assert.equal(map.nodes.length,60);assert.equal(map.edges.length,59);assert.equal(map.omitted_connections,21);assert.equal(map.truncated,true);assert.equal(readCore(dir,'wide-map').dossier.revision,2);
});

test('session scope and obstacles produce bounded plans without invented capacity or completed work',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input('sessions'))).json().ref,dir=path.join(root,'sessions'),before=readCore(dir,'sessions');
 const choices={ref,target:null,scope:'brief',obstacle:'none',intent:''};
 const brief=(await request('/api/session-plan',choices)).json();assert.equal(brief.steps.length,1);assert.equal(brief.target.id,'first-task');assert.equal(brief.context.length,0);assert.match(brief.why,/eligible/);
 const access=(await request('/api/session-plan',{...choices,scope:'extended',obstacle:'access',intent:'Prepare one invitation draft'})).json();assert.equal(access.steps.length,3);assert.match(access.steps[0].output,/No interview or response is invented/);assert.match(access.steps[1].output,/source already available/);assert.equal(readCore(dir,'sessions').sha256,before.sha256);
 assert.equal((await request('/api/session-plan',{...choices,scope:'instant'})).status,409);assert.equal((await request('/api/session-preview',choices)).status,409);assert.equal((await request('/api/session-plan',choices,{Origin:'https://example.com'})).status,403);
 const p=(await request('/api/session-preview',{...choices,scope:'focused',obstacle:'time',intent:'Draft one bounded next action'})).json();assert.equal(p.plan.steps.length,2);assert.match(p.text,/Planned work session/);assert.equal(readCore(dir,'sessions').sha256,before.sha256);
 const save={ref,preview:p.preview,confirmed:true};assert.equal((await request('/api/session-save',{...save,confirmed:false})).status,400);assert.equal((await request('/api/offer-save',save)).status,409);
 const saved=(await request('/api/session-save',save)).json();assert.equal(saved.revision,2);assert.deepEqual((await request('/api/session-save',save)).json(),saved);const after=readCore(dir,'sessions').dossier;assert.equal(after.decisions.length,1);assert.equal(after.decisions[0].id,saved.record_id);assert.deepEqual(after.decisions[0].basis_ids,['first-task']);assert.deepEqual(after.tasks,before.dossier.tasks);assert.deepEqual(after.evidence,before.dossier.evidence);assert.equal(after.active_task_id,before.dossier.active_task_id);
 const stale=(await request('/api/session-preview',{...choices,intent:'Another proposed session'})).json();updateCore(dir,{project_id:'sessions',expected_revision:2,operation_id:'edit-after-session',changes:{name:'Changed context'}});assert.equal((await request('/api/session-save',{ref,preview:stale.preview,confirmed:true})).status,409);
});
test('session plans disclose blocked choices, use stated profile context and refuse archived saves',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input('blocked-session'))).json().ref,dir=path.join(root,'blocked-session');
 const profile=(await request('/api/profile',{ref})).json();await request('/api/profile-save',{ref,revision:profile.revision,sha256:profile.sha256,key:'capacity',value:'Only one evening, user statement',date:'2026-10-30',confirmed:true});
 let state=readCore(dir,'blocked-session');const task={...state.dossier.tasks[0],id:'prerequisite',title:'Check the missing input'};updateCore(dir,{project_id:'blocked-session',expected_revision:state.dossier.revision,operation_id:'blocked-session-fixture',changes:{tasks:[{...state.dossier.tasks[0],depends_on:['prerequisite']},task]}});
 const choices={ref,target:'first-task',scope:'extended',obstacle:'access',intent:'Prepare missing-input check'},plan=(await request('/api/session-plan',choices)).json();assert.ok(plan.blockers.some(b=>b.id==='prerequisite'));assert.match(plan.steps[0].title,/blocker/);assert.match(plan.why,/explicitly selected/);assert.equal(plan.context[0].records[0].assertion,'reported');assert.equal(plan.context[0].records[0].value,'Only one evening, user statement');
 const p=(await request('/api/session-preview',choices)).json();assert.ok(p.basis_ids.includes('prerequisite'));assert.ok(p.basis_ids.includes(plan.context[0].records[0].id));
 state=readCore(dir,'blocked-session');await request('/api/archive',{ref,revision:state.dossier.revision,sha256:state.sha256,archived:true,confirmed:true});assert.equal((await request('/api/session-preview',choices)).status,409);assert.equal((await request('/api/session-save',{ref,preview:p.preview,confirmed:true})).status,409);assert.equal((await request('/api/session-plan',choices)).json().archived,true);
});

test('research priorities keep user judgments separate, preserve history and do not inflate dependency counts',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',{...input('research'),context:{customer:'Provisional customers',outcome:'Provisional outcome'}})).json().ref,dir=path.join(root,'research');
 const initial=(await request('/api/research',{ref})).json(),before=readCore(dir,'research').dossier;assert.ok(initial.rows.every(r=>r.status==='unassessed'));
 const assessment={assumption_id:'starting-outcome',impact:'high',uncertainty:'high',priority:'first',reason:'My own judgment: investigate delivery uncertainty first',date:'2026-10-30'},requestInput={ref,revision:initial.revision,sha256:initial.sha256,assessment,confirmed:true};
 assert.equal((await request('/api/research-save',{...requestInput,confirmed:false})).status,400);assert.equal((await request('/api/research-save',{...requestInput,assessment:{...assessment,date:'2026-02-30'}})).status,409);assert.equal((await request('/api/research-save',requestInput,{Origin:'https://example.com'})).status,403);
 const saved=(await request('/api/research-save',requestInput)).json();assert.equal(saved.revision,2);assert.equal((await request('/api/research-save',requestInput)).status,409);
 let queue=(await request('/api/research',{ref})).json();assert.equal(queue.rows[0].id,'starting-outcome');assert.equal(queue.rows[0].rating.origin,'user_statement');assert.equal(queue.rows[0].assertion,'unknown');assert.equal(queue.rows[0].direct_dependents,0);
 let state=readCore(dir,'research');const old=state.dossier.artifacts.find(a=>a.id===saved.artifact_id),bytes=fs.readFileSync(path.join(dir,old.location));assert.deepEqual(state.dossier.assumptions,before.assumptions);assert.deepEqual(state.dossier.tasks,before.tasks);assert.deepEqual(state.dossier.evidence,before.evidence);
 const next=(await request('/api/research-save',{...requestInput,revision:queue.revision,sha256:queue.sha256,assessment:{...assessment,priority:'later',reason:'Reconsidered based on my available context'}})).json();queue=(await request('/api/research',{ref})).json();const row=queue.rows.find(r=>r.id==='starting-outcome');assert.equal(row.rating.version,2);assert.equal(row.rating.previous,saved.artifact_id);assert.equal(row.direct_dependents,0);assert.equal(queue.rows[0].id,'starting-customer');assert.deepEqual(fs.readFileSync(path.join(dir,old.location)),bytes);
 state=readCore(dir,'research');updateCore(dir,{project_id:'research',expected_revision:state.dossier.revision,operation_id:'changed-assumption',changes:{assumptions:state.dossier.assumptions.map(a=>a.id==='starting-outcome'?{...a,text:'Changed provisional outcome'}:a)}});queue=(await request('/api/research',{ref})).json();assert.equal(queue.rows.find(r=>r.id==='starting-outcome').status,'review_required');
 assert.equal((await request('/api/research-save',{...requestInput,revision:queue.revision,sha256:queue.sha256})).status,200);queue=(await request('/api/research',{ref})).json();assert.equal(queue.rows.find(r=>r.id==='starting-outcome').status,'recorded');assert.equal(queue.rows.find(r=>r.id==='starting-outcome').basis_requires_review,true);
 const latest=readCore(dir,'research').dossier.artifacts.at(-1);fs.appendFileSync(path.join(dir,latest.location),'damaged');queue=(await request('/api/research',{ref})).json();assert.equal(queue.rows.find(r=>r.id==='starting-outcome').status,'unavailable');assert.equal(queue.rows.find(r=>r.id==='starting-outcome').rating,null);assert.equal((await request('/api/research-save',{...requestInput,revision:queue.revision,sha256:queue.sha256})).status,409);
});

test('priority freshness follows linked sources, with bounded queues and archived write refusal',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input('priority-source'))).json().ref,dir=path.join(root,'priority-source'),state=readCore(dir,'priority-source');
 const assumptions=Array.from({length:201},(_,n)=>({id:'hypothesis-'+n,text:'Synthetic hypothesis '+n,assertion:'unknown',source_ids:n===0?['context-source']:[]}));updateCore(dir,{project_id:'priority-source',expected_revision:1,operation_id:'source-fixture',changes:{assumptions,sources:[{id:'context-source',title:'User-supplied context',location:'Synthetic note',scope:'Fictional test only',accessed_at:'2026-10-30'}]}});
 let queue=(await request('/api/research',{ref})).json();assert.equal(queue.total,201);assert.equal(queue.rows.length,200);assert.equal(queue.partial,true);
 const assessment={assumption_id:'hypothesis-0',impact:'medium',uncertainty:'unknown',priority:'normal',reason:'Explicit synthetic judgment',date:'2026-10-30'};assert.equal((await request('/api/research-save',{ref,revision:queue.revision,sha256:queue.sha256,assessment:{...assessment,validated:true},confirmed:true})).status,409);
 assert.equal((await request('/api/research-save',{ref,revision:queue.revision,sha256:queue.sha256,assessment,confirmed:true})).status,200);
 const before=readCore(dir,'priority-source');updateCore(dir,{project_id:'priority-source',expected_revision:before.dossier.revision,operation_id:'source-changed',changes:{sources:before.dossier.sources.map(s=>({...s,title:'Corrected source context'}))}});queue=(await request('/api/research',{ref})).json();assert.equal(queue.rows.find(r=>r.id==='hypothesis-0').status,'review_required');
 await request('/api/archive',{ref,revision:queue.revision,sha256:queue.sha256,archived:true,confirmed:true});queue=(await request('/api/research',{ref})).json();assert.equal(queue.archived,true);assert.equal((await request('/api/research-save',{ref,revision:queue.revision,sha256:queue.sha256,assessment,confirmed:true})).status,409);
});

test('decision log previews alternatives and revision impact while preserving prior choices and files',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input('decision-log'))).json().ref,dir=path.join(root,'decision-log');let log=(await request('/api/decisions',{ref})).json();assert.equal(log.rows.length,0);
 const decision={previous:null,choice:'Run a fictional small pilot',reason:'Limit the proposed scope before committing',alternatives:['Do nothing','Prepare an interview first'],reconsider_when:'If the intended outcome is unclear after review',date:'2026-10-30',basis_id:'first-task'};
 const p=(await request('/api/decision-preview',{ref,revision:log.revision,sha256:log.sha256,decision})).json();assert.deepEqual(p.alternatives,decision.alternatives);assert.equal(readCore(dir,'decision-log').dossier.revision,1);assert.equal((await request('/api/decision-save',{ref,preview:p.preview,confirmed:false})).status,400);
 const saved=(await request('/api/decision-save',{ref,preview:p.preview,confirmed:true})).json();assert.deepEqual((await request('/api/decision-save',{ref,preview:p.preview,confirmed:true})).json(),saved);let state=readCore(dir,'decision-log'),first=state.dossier.decisions[0],artifact=state.dossier.artifacts[0],original=fs.readFileSync(path.join(dir,artifact.location));
 log=(await request('/api/decisions',{ref})).json();assert.equal(log.rows[0].details.request.reconsider_when,decision.reconsider_when);assert.equal(log.rows[0].details.origin,'user_statement');
 const task={...state.dossier.tasks[0],id:'dependent-task',title:'Prepare work based on the recorded choice'};updateCore(dir,{project_id:'decision-log',expected_revision:state.dossier.revision,operation_id:'decision-dependency',changes:{tasks:[...state.dossier.tasks,task],workflow:{...state.dossier.workflow,links:[...state.dossier.workflow.links,{dependent_id:task.id,prerequisite_id:first.id,reason:'Task uses the saved decision'}]}}});
 log=(await request('/api/decisions',{ref})).json();const revision={...decision,previous:first.id,choice:'Prepare an interview before a pilot',reason:'The uncertainty needs a smaller preparation step',basis_id:null};const p2=(await request('/api/decision-preview',{ref,revision:log.revision,sha256:log.sha256,decision:revision})).json();assert.ok(p2.impacted_ids.includes(task.id));assert.equal(p2.supersedes,first.id);const saved2=(await request('/api/decision-save',{ref,preview:p2.preview,confirmed:true})).json();
 state=readCore(dir,'decision-log');assert.equal(state.dossier.decisions[0].status,'superseded');assert.equal(state.dossier.decisions[0].text,first.text);assert.equal(state.dossier.decisions.at(-1).supersedes,first.id);assert.equal(state.dossier.tasks.find(t=>t.id===task.id).progress,'open');assert.equal(state.dossier.tasks.find(t=>t.id===task.id).substantiation,'stale');assert.equal(state.dossier.evidence.length,0);assert.deepEqual(fs.readFileSync(path.join(dir,artifact.location)),original);
 log=(await request('/api/decisions',{ref})).json();assert.equal(log.rows[0].details.version,2);assert.equal(log.rows[1].details.request.choice,decision.choice);assert.equal((await request('/api/decision-preview',{ref,revision:log.revision,sha256:log.sha256,decision:revision})).status,409);
 const currentArtifact=state.dossier.artifacts.at(-1);fs.appendFileSync(path.join(dir,currentArtifact.location),'broken');log=(await request('/api/decisions',{ref})).json();assert.equal(log.rows[0].details_status,'unavailable');assert.equal(log.rows[0].details,null);assert.equal((await request('/api/decision-preview',{ref,revision:log.revision,sha256:log.sha256,decision:{...revision,previous:saved2.record_id}})).status,409);
});
test('decision log keeps legacy unknowns and enforces exact preview, session, date and archive boundaries',async t=>{
 const {root,request}=await setup(t),ref=(await request('/api/create',input('decision-guards'))).json().ref,other=(await request('/api/create',input('decision-other'))).json().ref,dir=path.join(root,'decision-guards');
 updateCore(dir,{project_id:'decision-guards',expected_revision:1,operation_id:'legacy-decision',changes:{decisions:[{id:'old-choice',text:'Legacy user choice',reason:'Original reason',status:'active',supersedes:null,basis_ids:['first-task']}]}});
 let log=(await request('/api/decisions',{ref})).json();assert.equal(log.rows[0].details_status,'legacy');assert.equal(log.rows[0].details,null);const decision={previous:'old-choice',choice:'Reviewed legacy choice',reason:'Keep the rationale explicit',alternatives:[],reconsider_when:null,date:'2026-10-30',basis_id:null};const inputData={ref,revision:log.revision,sha256:log.sha256,decision};
 assert.equal((await request('/api/decision-preview',{...inputData,decision:{...decision,date:'2026-02-30'}})).status,409);assert.equal((await request('/api/decision-preview',{...inputData,decision:{...decision,approved:true}})).status,409);assert.equal((await request('/api/decision-preview',inputData,{Origin:'https://example.com'})).status,403);
 const p=(await request('/api/decision-preview',inputData)).json();assert.equal(p.reconsider_when,null);assert.deepEqual(p.alternatives,[]);assert.deepEqual(p.basis_ids,['first-task']);assert.equal((await request('/api/session-save',{ref,preview:p.preview,confirmed:true})).status,409);assert.equal((await request('/api/decision-save',{ref:other,preview:p.preview,confirmed:true})).status,409);
 updateCore(dir,{project_id:'decision-guards',expected_revision:2,operation_id:'new-context',changes:{name:'Changed context'}});assert.equal((await request('/api/decision-save',{ref,preview:p.preview,confirmed:true})).status,409);
 log=(await request('/api/decisions',{ref})).json();const fresh=(await request('/api/decision-preview',{...inputData,revision:log.revision,sha256:log.sha256})).json();await request('/api/archive',{ref,revision:log.revision,sha256:log.sha256,archived:true,confirmed:true});assert.equal((await request('/api/decision-save',{ref,preview:fresh.preview,confirmed:true})).status,409);assert.equal((await request('/api/decisions',{ref})).json().archived,true);
});
