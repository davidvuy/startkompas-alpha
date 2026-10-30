import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initializeProject} from '../src/initialize.mjs';
import {readCore} from '../src/store.mjs';
import {prepareBusinessBrief} from '../src/business-brief.mjs';
import {saveGuided} from '../src/workspace.mjs';
import {documentVersions,compareDocuments} from '../src/document-comparison.mjs';

test('document comparison preserves exact changes, numbers, terms and provenance without writes',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-document-compare-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const dir=path.join(root,'project');
 initializeProject(dir,{project_id:'compare',name:'Fictional comparison',first_task:{id:'task',title:'Review price'}});
 let n=0;
 function save(previous,fields){const p=prepareBusinessBrief(dir,{project_id:'compare',expected_revision:readCore(dir,'compare').dossier.revision,operation_id:'version-'+(++n),at:'2026-10-30',language:'en',kind:'pricing',client:null,period:null,previous_artifact_id:previous,change_reason:previous?'Change fictional price and terms':null,fields});saveGuided(dir,p,path.join(root,'bundle-'+n));return JSON.parse(p.content);}
 const field=(key,value,assertion='proposal',record_ids=[])=>({key,value,assertion,record_ids});
 const a=save(null,[field('price','EUR 100 per project\nBefore tax: unknown'),field('terms','Payment within 30 days'),field('costs','Costs still under review')]);
 const b=save(a.artifact_id,[field('price','EUR 150 per project\nBefore tax: unknown'),field('buyer','Named buyer still to check'),field('costs','Costs still under review','reported',['task'])]);
 const before=readCore(dir,'compare'),bytes=fs.readFileSync(path.join(dir,before.dossier.artifacts[0].location));
 const result=compareDocuments(dir,'compare',a.artifact_id,b.artifact_id);
 assert.equal(result.changes.find(r=>r.key==='buyer').type,'added');assert.equal(result.changes.find(r=>r.key==='terms').type,'removed');
 const price=result.changes.find(r=>r.key==='price');assert.equal(price.type,'changed');assert.ok(price.tags.includes('amount_field'));assert.deepEqual(price.numbers,{before:['100'],after:['150']});assert.equal(price.before.value,a.fields.find(f=>f.key==='price').value);
 assert.ok(result.changes.find(r=>r.key==='terms').tags.includes('terms_or_scope'));
 const costs=result.changes.find(r=>r.key==='costs');assert.equal(costs.type,'metadata');assert.equal(costs.basis_changed,true);assert.equal(costs.status_changed,true);assert.equal(costs.before.value,costs.after.value);
 assert.equal(result.before.markdown,a.document_markdown);assert.equal(result.after.markdown,b.document_markdown);
 assert.equal(readCore(dir,'compare').sha256,before.sha256);assert.deepEqual(fs.readFileSync(path.join(dir,before.dossier.artifacts[0].location)),bytes);
 assert.deepEqual(documentVersions(dir,'compare',b.artifact_id).versions.map(v=>v.version),[2,1]);
 assert.throws(()=>compareDocuments(dir,'compare',b.artifact_id,a.artifact_id),/increasing/);assert.throws(()=>compareDocuments(dir,'compare',a.artifact_id,a.artifact_id),/increasing/);
 const unrelated=save(null,[field('price','Unrelated offer price')]);assert.throws(()=>compareDocuments(dir,'compare',a.artifact_id,unrelated.artifact_id),/same document/);
 const current=readCore(dir,'compare'),file=path.join(dir,current.dossier.artifacts.find(x=>x.id===a.artifact_id).location);fs.writeFileSync(file,'damaged');
 assert.throws(()=>compareDocuments(dir,'compare',a.artifact_id,b.artifact_id),/fingerprint/);assert.throws(()=>documentVersions(dir,'compare',b.artifact_id),/fingerprint/);
});
