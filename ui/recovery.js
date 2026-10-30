'use strict';
// Tab-local recovery is separate from canonical project storage.
globalThis.StartkompasRecovery = function(storage, scope, now = Date.now) {
 const key='startkompas-recovery-v1', age=24*60*60*1000;
 const text=value=>typeof value==='string'&&value.length<=4000;
 const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
 function valid(entry){
  if(!object(entry)||entry.scope!==scope||!Number.isFinite(entry.at)||entry.at>now()||now()-entry.at>age||!object(entry.data))return false;
  const d=entry.data;
  if(entry.kind==='wizard')return Object.keys(d).filter(k=>k!=='practice').sort().join(',')==='customer,id,name,outcome,task'&&(!Object.hasOwn(d,'practice')||typeof d.practice==='boolean')&&Object.entries(d).filter(([k])=>k!=='practice').every(([,v])=>text(v))&&d.customer.length<=2000&&d.outcome.length<=2000;
  if(entry.kind==='offer')return Object.keys(d).sort().join(',')==='client,fields,folder,id,period,previous,reason,revision,sha256'&&['folder','id','client','period','reason'].every(k=>text(d[k]))&&(d.previous===null||text(d.previous))&&Number.isSafeInteger(d.revision)&&d.revision>0&&/^[a-f0-9]{64}$/.test(d.sha256)&&object(d.fields)&&Object.keys(d.fields).length<=20&&Object.entries(d.fields).every(([k,v])=>/^[a-z_]+$/.test(k)&&text(v));
  return false;
 }
 return {
  read(){const raw=storage.getItem(key);if(!raw)return null;let entry;try{if(raw.length>100000)throw Error();entry=JSON.parse(raw);}catch{return null;}return valid(entry)?entry:null;},
  write(kind,data){const entry={scope,kind,data,at:now()};if(!valid(entry))throw Error('This draft cannot be kept for recovery.');const raw=JSON.stringify(entry);if(raw.length>100000)throw Error('This draft is too large for tab recovery.');storage.setItem(key,raw);},
  clear(){storage.removeItem(key);}
 };
};
