import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {runMenu} from '../src/menu.mjs';
import {initializeProject} from '../src/initialize.mjs';
import {readCore,updateCore} from '../src/store.mjs';

const invoke=async(answers,extra={})=>{const calls=[],output=[];await runMenu({ask:async()=>answers.shift()??'/cancel',print:s=>output.push(s),run:a=>calls.push(a),...extra});return {calls,output};};
const fixture=()=>{const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'sk-menu-'))),dir=path.join(root,'private');initializeProject(dir,{project_id:'test-project',name:'Private idea',first_task:null});return {root,dir,dest:path.join(root,'report.md')};};
test('menu passes paths as literal arguments and cancellation dispatches nothing',async()=>{
 const dir='folder with spaces; $(never-run)';
 assert.deepEqual((await invoke(['4',dir,'test-project'])).calls,[['workspace','show',dir,'test-project']]);
 assert.deepEqual((await invoke(['3',dir])).calls,[['demo',dir]]);
 for(const answers of [['0'],['5','/cancel'],['6','dir','/cancel']])assert.deepEqual((await invoke(answers)).calls,[]);
 await assert.rejects(()=>invoke(['99']),/nummer/);
});
test('report requires confirmation, refuses overwrite and leaves project unchanged',async()=>{
 const {dir,dest}=fixture(),before=JSON.stringify(readCore(dir,'test-project').dossier);
 await invoke(['6',dir,'test-project',dest,'nee']);assert.equal(fs.existsSync(dest),false);
 const r=await invoke(['6',dir,'test-project',dest,'ja']);assert.match(fs.readFileSync(dest,'utf8'),/Private idea/);assert.ok(r.output.some(s=>s.includes('geen back-up')));
 await assert.rejects(()=>invoke(['6',dir,'test-project',dest,'ja']));
 assert.equal(JSON.stringify(readCore(dir,'test-project').dossier),before);
});
test('a concurrent change after preview prevents menu report save',async()=>{
 const {dir,dest}=fixture(),answers=['6',dir,'test-project',dest,'ja'];
 await assert.rejects(()=>invoke([], {ask:async()=>{const answer=answers.shift();if(answer==='ja')updateCore(dir,{project_id:'test-project',expected_revision:1,operation_id:'concurrent-menu-test',changes:{name:'Changed'}});return answer;}}),/changed/i);
 assert.equal(fs.existsSync(dest),false);
});
