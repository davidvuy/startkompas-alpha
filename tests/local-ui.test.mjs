import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {startLocalUI} from '../src/local-ui-server.mjs';
import {readCore,updateCore} from '../src/store.mjs';
import {readBusinessBrief} from '../src/business-brief.mjs';

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
 for(const route of ['/','/ui.js','/ui.css','/brand.png']){
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
