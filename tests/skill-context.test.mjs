import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createCore,readCore,sha,updateCore} from '../src/store.mjs';
import {prepareSkillContext} from '../src/skill-context.mjs';
const fixture=JSON.parse(fs.readFileSync(new URL('../examples/dossier-v1.json',import.meta.url)));
function setup(t,modify=()=>{}){
 const base=fs.mkdtempSync(path.join(os.tmpdir(),'startkompas-context-'));t.after(()=>fs.rmSync(base,{recursive:true,force:true}));
 const dir=path.join(base,'project'),data=structuredClone(fixture);modify(data);createCore(dir,data);
 const state=readCore(dir,data.project_id);
 return {base,dir,request:{project_id:data.project_id,source_revision:1,canonical_sha256:state.sha256,focus_id:'decision-1',depth:2,exclude_ids:[],include_fields:[]}};
}
test('selected context follows prerequisites, minimizes fields and preserves explicit omissions without writes',t=>{
 const {dir,request}=setup(t,d=>{d.name='PRIVATE_NAME';d.sources[0].location='PRIVATE_LOCATION';d.facts[0].text='PRIVATE_TEXT';});
 const before=fs.readFileSync(path.join(dir,'project.json'));
 const result=prepareSkillContext(dir,request),packet=JSON.parse(result.payload);
 assert.deepEqual(packet.records.map(r=>r.id),['decision-1','fact-1','source-1']);
 assert.ok(!result.payload.includes('PRIVATE_'));assert.ok(!result.payload.includes('task-1'));
 assert.equal(packet.records[1].assertion,'reported');assert.equal(packet.records[1].text,undefined);
 assert.equal(result.payload_sha256,sha(Buffer.from(result.payload)));assert.equal(result.bytes,Buffer.byteLength(result.payload));
 const chosen=JSON.parse(prepareSkillContext(dir,{...request,include_fields:[{record_id:'fact-1',fields:['text']}]}).payload);
 assert.equal(chosen.records[1].text,'PRIVATE_TEXT');
 const excluded=JSON.parse(prepareSkillContext(dir,{...request,exclude_ids:['fact-1']}).payload);
 assert.equal(excluded.records.length,1);assert.equal(excluded.records[0].omitted_prerequisite_count,1);
 assert.deepEqual(excluded.records[0].included_prerequisite_ids,[]);assert.ok(!JSON.stringify(excluded).includes('source-1'));
 assert.deepEqual(fs.readFileSync(path.join(dir,'project.json')),before);
});
test('context refuses stale and contradictory selections; practice and CLI output remain explicit',t=>{
 const {base,dir,request}=setup(t,d=>d.events.push({id:'practice-project-created',type:'practice-project',at:'2026-10-30T00:00:00Z',description:'Fictional only',subject_ids:[]}));
 assert.equal(JSON.parse(prepareSkillContext(dir,request).payload).practice,true);
 for(const change of [{depth:3},{focus_id:'missing'},{exclude_ids:['decision-1']},{extra:true},{canonical_sha256:'0'.repeat(64)},
  {include_fields:[{record_id:'source-1',fields:['location']}]},{include_fields:[{record_id:'task-1',fields:['title']}]},
  {exclude_ids:['fact-1'],include_fields:[{record_id:'fact-1',fields:['text']}]},
  {include_fields:[{record_id:'fact-1',fields:['text']},{record_id:'fact-1',fields:[]}]}])assert.throws(()=>prepareSkillContext(dir,{...request,...change}));
 const input=path.join(base,'selection.json');fs.writeFileSync(input,JSON.stringify(request));
 const entry=fileURLToPath(new URL('../src/startkompas.mjs',import.meta.url));
 const run=()=>spawnSync(process.execPath,[entry,'context','preview',dir,input],{encoding:'utf8'});
 const first=run();assert.equal(first.status,0,first.stderr);assert.deepEqual(JSON.parse(first.stdout),prepareSkillContext(dir,request));
 updateCore(dir,{project_id:request.project_id,expected_revision:1,operation_id:'context-stale',changes:{name:'Changed'}});
 assert.throws(()=>prepareSkillContext(dir,request),/basis changed/);const stale=run();assert.equal(stale.status,1);assert.equal(stale.stdout,'');
});
test('context discloses bounded traversal and refuses oversized content without truncating it',t=>{
 const {dir,request}=setup(t,d=>{
  d.decisions[0].basis_ids=Array.from({length:45},(_,i)=>'fact-'+(i+1));
  d.facts=Array.from({length:45},(_,i)=>({...d.facts[0],id:'fact-'+(i+1),text:'x'.repeat(3900)}));
 });
 const packet=JSON.parse(prepareSkillContext(dir,request).payload);assert.equal(packet.records.length,40);
 assert.equal(packet.selection.record_limit_reached,true);assert.ok(packet.records[0].omitted_prerequisite_count>0);
 assert.throws(()=>prepareSkillContext(dir,{...request,include_fields:Array.from({length:10},(_,i)=>({record_id:'fact-'+(i+1),fields:['text']}))}),/32 KiB/);
});
