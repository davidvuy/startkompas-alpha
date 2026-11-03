import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function setup(disabled=false){
 const control={disabled}, attributes={}, messages=[];
 const main={setAttribute:(key,value)=>attributes[key]=value};
 const noticeElement={scrollIntoView(){},focus(){}};
 const source=fs.readFileSync(new URL('../ui/ui.js',import.meta.url),'utf8');
 const start=source.indexOf('let busyControls=null;');
 const end=source.indexOf('\n',source.indexOf('async function act(fn)',start));
 const context=vm.createContext({document:{querySelectorAll:()=>[control]},$:id=>id==='main'?main:noticeElement,notice:message=>messages.push(message),showErrorActions(){}});
 vm.runInContext('let busy=false;\n'+source.slice(start,end),context);
 return {control,attributes,messages,act:context.act,set:context.setControlDisabled};
}

for(const initial of [false,true])test(`busy completion preserves changed logical disabled state from ${initial}`,async()=>{
 const s=setup(initial);let release;
 const pending=s.act(async()=>{s.set(s.control,!initial);await new Promise(resolve=>release=resolve);});
 assert.equal(s.control.disabled,true);
 assert.equal(s.attributes['aria-busy'],'true');
 let nested=false;await s.act(()=>{nested=true;});assert.equal(nested,false);
 release();await pending;
 assert.equal(s.control.disabled,!initial);
 assert.equal(s.attributes['aria-busy'],'false');
 s.set(s.control,initial);assert.equal(s.control.disabled,initial);
});

test('failed action releases temporary disabling while retaining logical changes',async()=>{
 const s=setup();await s.act(()=>{s.set(s.control,true);throw Error('Expected failure');});
 assert.equal(s.control.disabled,true);assert.equal(s.messages.at(-1),'Expected failure');
 await s.act(()=>s.set(s.control,false));assert.equal(s.control.disabled,false);
});

test('unchanged controls recover their original state after success or failure',async()=>{
 for(const initial of [true,false])for(const fail of [true,false]){
  const s=setup(initial);await s.act(()=>{assert.equal(s.control.disabled,true);if(fail)throw Error('Expected failure');});
  assert.equal(s.control.disabled,initial);
 }
});
