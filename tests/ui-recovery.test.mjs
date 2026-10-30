import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function setup(){
 const context=vm.createContext({});vm.runInContext(fs.readFileSync(new URL('../ui/recovery.js',import.meta.url),'utf8'),context);
 const values=new Map();const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 let now=100000000;return {values,storage,factory:context.StartkompasRecovery,create:scope=>context.StartkompasRecovery(storage,scope,()=>now),advance:ms=>now+=ms};
}
const wizard={name:'Fictional studio',id:'practice',task:'Prepare an offer',customer:'Unknown customer',outcome:''};
test('tab recovery preserves exact text, isolates roots, expires, and clears without project writes',()=>{
 const s=setup(),a=s.create('root-a');assert.equal(a.read(),null);a.write('wizard',wizard);
 assert.deepEqual(JSON.parse(JSON.stringify(a.read().data)),wizard);
 assert.equal(s.create('root-b').read(),null);
 s.advance(24*60*60*1000+1);assert.equal(a.read(),null);
 a.write('wizard',wizard);a.clear();assert.equal(s.values.size,0);
});
test('recovery refuses confirmations, preview handles, invalid shapes, oversized and corrupt copies',()=>{
 const s=setup(),a=s.create('root');
 for(const data of [{...wizard,confirmed:true},{...wizard,preview:'old'}, {...wizard,customer:'x'.repeat(2001)},null])assert.throws(()=>a.write('wizard',data));
 assert.throws(()=>a.write('unexpected',wizard));
 for(const raw of ['{','null','x'.repeat(100001),JSON.stringify({scope:'root',kind:'wizard',at:100000001,data:wizard})]){s.values.set('startkompas-recovery-v1',raw);assert.equal(a.read(),null);}
});
test('offer recovery retains exact project revision and basis hash; storage failures are not reported as success',()=>{
 const s=setup(),a=s.create('root');const offer={folder:'practice',id:'practice',previous:null,revision:3,sha256:'a'.repeat(64),client:'',period:'',reason:'',fields:{segment:'Fictional',outcome:''}};
 a.write('offer',offer);assert.deepEqual(JSON.parse(JSON.stringify(a.read().data)),offer);
 for(const data of [{...offer,revision:0},{...offer,sha256:'bad'},{...offer,fields:{segment:42}},{...offer,confirmed:true}])assert.throws(()=>a.write('offer',data));
 const failed=s.factory({getItem(){throw Error('blocked');},setItem(){throw Error('quota');},removeItem(){throw Error('blocked');}},'root');
 assert.throws(()=>failed.read(),/blocked/);assert.throws(()=>failed.write('wizard',wizard),/quota/);assert.throws(()=>failed.clear(),/blocked/);
});
