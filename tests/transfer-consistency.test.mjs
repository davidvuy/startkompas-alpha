import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createCore,readCore} from '../src/store.mjs';
import {createProject} from '../src/dossier.mjs';
import {exportCore,restoreCore,migrateLegacy} from '../src/transfer.mjs';
const seed=()=>JSON.parse(fs.readFileSync(new URL('../examples/dossier-v1.1.json',import.meta.url)));
const legacy=()=>JSON.parse(fs.readFileSync(new URL('../examples/sk09-input.json',import.meta.url)));
function setup(old=false){const root=fs.mkdtempSync(path.join(os.tmpdir(),'startkompas-transfer-')),dir=path.join(root,'source');if(old)createProject(dir,legacy());else createCore(dir,seed());return {root,dir,file:path.join(dir,'project.json')};}
// Exercise real file replacement at the deterministic gap between two reads.
function replaceOnSecondRead(t,file,bytes){
 const open=fs.openSync;let count=0;
 t.mock.method(fs,'openSync',function(candidate,flags,...rest){if(path.resolve(String(candidate))===file&&flags==='r'&&++count===2)fs.writeFileSync(file,bytes);return Reflect.apply(open,this,[candidate,flags,...rest]);});
}
for(const change of ['revision','identity','same-revision-content'])test('export refuses '+change+' replacement between validation and copying',t=>{
 const s=setup(),updated=seed();if(change==='revision')updated.revision=2;else if(change==='identity')updated.project_id='another-project';else updated.name='Changed at same revision';
 const replacement=Buffer.from(JSON.stringify(updated)),destination=path.join(s.root,'bundle');replaceOnSecondRead(t,s.file,replacement);
 assert.throws(()=>exportCore(s.dir,'pilot-orbit',destination),/changed during export/);assert.ok(!fs.existsSync(destination));assert.ok(!fs.readdirSync(s.root).some(n=>n.startsWith('bundle.staging')));assert.deepEqual(fs.readFileSync(s.file),replacement);
});
test('legacy migration refuses changed source before publishing mismatched provenance',t=>{
 const s=setup(true),newer={...legacy(),schema_version:'sk09-v1',revision:1,name:'Replaced source'};const replacement=Buffer.from(JSON.stringify(newer));replaceOnSecondRead(t,s.file,replacement);
 const destination=path.join(s.root,'migrated');assert.throws(()=>migrateLegacy(s.dir,newer.project_id,destination),/changed during migration/);assert.ok(!fs.existsSync(destination));assert.ok(!fs.readdirSync(s.root).some(n=>n.startsWith('migrated.staging')));assert.deepEqual(fs.readFileSync(s.file),replacement);
});
test('unchanged export retains exact source bytes including harmless whitespace',()=>{
 const s=setup(),original=Buffer.from(JSON.stringify(seed(),null,4)+'\n\n');fs.writeFileSync(s.file,original);const bundle=path.join(s.root,'bundle');const out=exportCore(s.dir,'pilot-orbit',bundle);assert.equal(out.manifest.revision,1);const restored=restoreCore(bundle,'pilot-orbit',path.join(s.root,'restored'));assert.deepEqual(fs.readFileSync(restored.file),original);assert.equal(readCore(s.dir,'pilot-orbit').dossier.name,restored.dossier.name);
});
