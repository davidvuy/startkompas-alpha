import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
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
test('menu forwards the first and subsequent wizard answers without losing input', {timeout:15000}, async()=>{
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'sk-menu-input-'))),dir=path.join(root,'project');
 const launcher=new URL('../start.mjs',import.meta.url).href;
 // Only the TTY entry gate is simulated; real parent/child streams and saving run.
 const child=spawn(process.execPath,['--input-type=module','-e',`Object.defineProperty(process.stdin,'isTTY',{value:true}); await import(${JSON.stringify(launcher)});`],{stdio:['pipe','pipe','pipe']});
 const steps=[['Keuze:','2'],['Projectnaam / Project name:','First answer retained'],['Project-ID (lowercase a-z, 0-9, hyphen):','menu-input'],['New private folder outside app:',dir],['First task (optional):','Resume tomorrow'],['Save new empty project? [ja/yes]:','ja']];
 let output='',errors='',next=0;
 child.stdout.on('data',chunk=>{output+=chunk.toString();while(next<steps.length&&output.includes(steps[next][0])){child.stdin.write(steps[next][1]+'\n');next++;}});
 child.stderr.on('data',chunk=>{errors+=chunk.toString();});
 const timer=setTimeout(()=>child.kill(),12000);
 try{const code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',resolve);});assert.equal(code,0,errors+output);assert.equal(next,steps.length);assert.equal(readCore(dir,'menu-input').dossier.name,'First answer retained');}finally{clearTimeout(timer);child.kill();}
});
