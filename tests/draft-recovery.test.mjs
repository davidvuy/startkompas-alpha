import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {durableRecovery} from '../src/draft-recovery.mjs';
import {startLocalUI} from '../src/local-ui-server.mjs';
const draft={name:'Fictional studio',id:'unfinished ID',task:'Explore',customer:'Unknown',outcome:'',practice:true};
function setup(t){const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'sk-recovery-')));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));return root;}
test('disk recovery survives independent instances without writing a project and requires exact digest for deletion',t=>{
 const root=setup(t),first=durableRecovery(root);assert.deepEqual(first.list().copies,[]);assert.deepEqual(fs.readdirSync(root),[]);
 const saved=first.save('wizard',draft),second=durableRecovery(root);assert.deepEqual(second.read(saved.id).data,draft);assert.equal(second.list().copies.length,1);
 assert.throws(()=>second.forget(saved.id,'0'.repeat(64)));assert.throws(()=>second.read('../store'));
 assert.throws(()=>first.save('wizard',{...draft,confirmed:true}));assert.throws(()=>first.save('wizard',{...draft,session:'secret'}));
 const another=second.save('wizard',{...draft,name:'Second copy'});assert.notEqual(another.id,saved.id);assert.equal(first.list().copies.length,2);
 second.forget(saved.id,saved.sha256);assert.equal(first.list().copies.length,1);assert.deepEqual(fs.readdirSync(root),['.startkompas-recovery']);
});
test('partial copies are isolated and expired copies remain explicitly removable',t=>{
 const root=setup(t);let time=1000;const recovery=durableRecovery(root,()=>time),saved=recovery.save('wizard',draft);
 fs.writeFileSync(path.join(root,'.startkompas-recovery',randomUUID()+'.json'),'{');assert.equal(recovery.list().unavailable,1);assert.deepEqual(recovery.read(saved.id).data,draft);
 time+=8*86400000;assert.equal(recovery.list().copies[0].expired,true);assert.throws(()=>recovery.read(saved.id));recovery.forget(saved.id,saved.sha256);assert.equal(recovery.list().copies.length,0);
});
test('unrecognized recovery folders are not adopted and the capacity limit does not prevent cleanup',t=>{
 const root=setup(t),dir=path.join(root,'.startkompas-recovery');fs.mkdirSync(dir);fs.writeFileSync(path.join(dir,'private.txt'),'keep');assert.throws(()=>durableRecovery(root).save('wizard',draft));assert.equal(fs.readFileSync(path.join(dir,'private.txt'),'utf8'),'keep');
 const other=setup(t),recovery=durableRecovery(other);for(let i=0;i<50;i++)recovery.save('wizard',draft);assert.throws(()=>recovery.save('wizard',draft));
 const sample=recovery.list().copies[0];const content=JSON.parse(fs.readFileSync(path.join(other,'.startkompas-recovery',sample.id+'.json')));content.id=randomUUID();fs.writeFileSync(path.join(other,'.startkompas-recovery',content.id+'.json'),JSON.stringify(content));assert.equal(recovery.list().copies.length,51);recovery.forget(sample.id,sample.sha256);assert.equal(recovery.list().copies.length,50);
});
test('recovery API requires the live local session and opt-in, and persists across server restart',async t=>{
 const root=setup(t);let app=await startLocalUI({root});t.after(()=>app.close());
 const post=async(route,data={},extra={})=>{const r=await fetch(app.origin+'/api/'+route,{method:'POST',headers:{Origin:app.origin,'Content-Type':'application/json','X-Startkompas-Session':app.token,...extra},body:JSON.stringify(data)});return {status:r.status,data:await r.json()};};
 const input={kind:'wizard',data:draft,confirmed:true};assert.equal((await post('recovery-save',{...input,confirmed:false})).status,400);assert.equal((await post('recovery-save',input,{Origin:'https://example.com'})).status,403);assert.equal((await post('recovery-save',input,{'X-Startkompas-Session':'0'.repeat(64)})).status,403);assert.deepEqual(fs.readdirSync(root),[]);
 const saved=await post('recovery-save',input);assert.equal(saved.status,200);const oldToken=app.token;await app.close();app=await startLocalUI({root});assert.notEqual(app.token,oldToken);
 assert.equal((await post('recovery-read',{id:saved.data.id},{'X-Startkompas-Session':oldToken})).status,403);assert.deepEqual((await post('recovery-read',{id:saved.data.id})).data.data,draft);
 assert.equal((await post('recovery-list',{path:'elsewhere'})).status,400);assert.equal((await post('recovery-forget',{id:saved.data.id,sha256:saved.data.sha256,confirmed:false})).status,400);
 assert.equal((await post('recovery-forget',{id:saved.data.id,sha256:saved.data.sha256,confirmed:true})).status,200);
});
