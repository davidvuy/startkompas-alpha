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
function feedbackSetup(storage=new Map(),fail=false){
 const source=fs.readFileSync(new URL('../ui/ui.js',import.meta.url),'utf8');
 const elements=new Map();
 const get=id=>{if(!elements.has(id))elements.set(id,{checked:false,textContent:'',listeners:{},addEventListener(name,fn){this.listeners[name]=fn;}});return elements.get(id);};
 const renders=[];
 const context=vm.createContext({sessionStorage:{getItem:key=>{if(fail)throw Error('Denied');return storage.get(key)??null;},setItem:(key,value)=>{if(fail)throw Error('Quota');storage.set(key,value);},removeItem:key=>{if(fail)throw Error('Denied');storage.delete(key);}},$:get,renderFeedbackDiscussions:(data,onlyOpen)=>renders.push(onlyOpen),reviewFeedbackState:{}});
 vm.runInContext(source.slice(source.indexOf("const feedbackPreferenceKey="),source.indexOf('function renderFeedbackDiscussions(data,onlyOpen){')),context);
 vm.runInContext(source.slice(source.indexOf('function changeFeedbackPreference(){'),source.indexOf('async function openReviewFeedback(){')),context);
 context.syncFeedbackPreference();
 return {context,get,renders,storage,change:()=>context.changeFeedbackPreference(),reset:()=>get('review-feedback-reset').listeners.click()};
}

test('feedback view opt-in survives reload without storing project or review data; reset clears it',()=>{
 const s=feedbackSetup();
 assert.equal(s.get('review-feedback-only-open').checked,false);
 assert.equal(s.storage.size,0);
 s.get('review-feedback-only-open').checked=true;s.change();
 assert.deepEqual(s.renders,[true]);assert.equal(s.storage.size,0);
 s.context.syncFeedbackPreference();assert.equal(s.get('review-feedback-only-open').checked,true);
 assert.equal(feedbackSetup(s.storage).get('review-feedback-only-open').checked,false);
 s.get('review-feedback-remember').checked=true;s.change();
 assert.deepEqual(JSON.parse([...s.storage.values()][0]),{version:1,onlyOpen:true});
 const reopened=feedbackSetup(s.storage);
 assert.equal(reopened.get('review-feedback-only-open').checked,true);
 assert.equal(reopened.get('review-feedback-remember').checked,true);
 reopened.reset();assert.equal(s.storage.size,0);assert.deepEqual(reopened.renders,[false]);
 assert.equal(reopened.get('review-feedback-remember').checked,false);
});

test('feedback preference malformed/unknown data is refused and storage failure remains usable',()=>{
 for(const raw of ['null','[]','{','{"version":2,"onlyOpen":true}','{"version":1,"onlyOpen":"false"}','{"version":1,"onlyOpen":true,"project":"private"}']){
  const storage=new Map([['startkompas-feedback-view-v1',raw]]),s=feedbackSetup(storage);
  assert.equal(s.get('review-feedback-only-open').checked,false);assert.equal(storage.size,0);
 }
 const s=feedbackSetup(new Map(),true);
 s.get('review-feedback-only-open').checked=true;s.get('review-feedback-remember').checked=true;s.change();
 assert.deepEqual(s.renders,[true]);assert.equal(s.get('review-feedback-remember').checked,false);
 assert.match(s.get('review-feedback-preference-status').textContent,/unavailable/);
 s.reset();assert.deepEqual(s.renders,[true,false]);
 assert.match(s.get('review-feedback-preference-status').textContent,/could not be confirmed cleared/);
});

test('disabling remembered feedback preference clears storage but retains the active filter',()=>{
 const s=feedbackSetup(new Map([['startkompas-feedback-view-v1','{"version":1,"onlyOpen":true}']]));
 s.get('review-feedback-remember').checked=false;s.change();
 assert.equal(s.storage.size,0);assert.equal(s.get('review-feedback-only-open').checked,true);
 assert.deepEqual(s.renders,[true]);
});
