import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import Ajv2020 from 'ajv/dist/2020.js';
import {safeDirectory,regularFile,writeExclusive,bytesFor,sha} from './store.mjs';
import {briefTypes} from './business-brief.mjs';

const text={type:'string',maxLength:4000},identifier={type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'};
const schema={type:'object',additionalProperties:false,required:['format','id','created_at','kind','data'],properties:{format:{const:'startkompas-recovery-v1'},id:{type:'string',pattern:'^[a-f0-9-]{36}$'},created_at:{type:'integer',minimum:0},kind:{enum:['wizard','offer']},data:{type:'object'}},allOf:[
 {if:{properties:{kind:{const:'wizard'}}},then:{properties:{data:{type:'object',additionalProperties:false,required:['name','id','task','customer','outcome','practice'],properties:{name:text,id:text,task:text,customer:{type:'string',maxLength:2000},outcome:{type:'string',maxLength:2000},practice:{type:'boolean'}}}}}},
 {if:{properties:{kind:{const:'offer'}}},then:{properties:{data:{type:'object',additionalProperties:false,required:['folder','id','previous','revision','sha256','client','period','reason','fields'],properties:{folder:{type:'string',minLength:1,maxLength:255,pattern:'^[^/\\\\\\u0000]+$'},id:identifier,previous:{anyOf:[{type:'null'},identifier]},revision:{type:'integer',minimum:1},sha256:{type:'string',pattern:'^[a-f0-9]{64}$'},client:text,period:text,reason:text,fields:{type:'object',additionalProperties:false,required:Object.keys(briefTypes.offer.fields),properties:Object.fromEntries(Object.keys(briefTypes.offer.fields).map(k=>[k,text]))}}}}}}
]};
const validate=new Ajv2020({strict:true,allErrors:true}).compile(schema),format='startkompas-recovery-store-v1',maxBytes=128*1024,maxCopies=50,maxAge=7*24*60*60*1000;
const filePattern=/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\.json$/;

export function durableRecovery(selectedRoot,now=Date.now){
 const root=safeDirectory(selectedRoot),dir=path.join(root,'.startkompas-recovery');
 function directory(create=false){
  if(fs.realpathSync(root)!==root)throw Error('Recovery parent moved');
  if(!fs.existsSync(dir)){
   if(!create)return false;
   try{fs.mkdirSync(dir,{mode:0o700});writeExclusive(path.join(dir,'store.json'),bytesFor({format}));}catch(error){if(error.code!=='EEXIST')throw error;}
  }
  if(fs.lstatSync(dir).isSymbolicLink()||!fs.lstatSync(dir).isDirectory()||fs.realpathSync(dir)!==dir)throw Error('Unsafe recovery directory');
  const marker=JSON.parse(regularFile(path.join(dir,'store.json'),1024));if(Object.keys(marker).length!==1||marker.format!==format)throw Error('Unrecognized recovery directory');
  return true;
 }
 function names(){const entries=[],handle=fs.opendirSync(dir);try{let entry;while((entry=handle.readSync())){entries.push(entry.name);if(entries.length>200)throw Error('Recovery folder exceeds the supported entry limit');}}finally{handle.closeSync();}return entries.filter(n=>filePattern.test(n));}
 function read(id){
  if(typeof id!=='string'||!filePattern.test(id+'.json')||!directory())throw Error('Recovery copy unavailable');
  const bytes=regularFile(path.join(dir,id+'.json'),maxBytes),entry=JSON.parse(bytes);
  if(!validate(entry)||entry.id!==id||entry.created_at>now())throw Error('Invalid recovery copy');
  return {...entry,sha256:sha(bytes),expired:now()-entry.created_at>maxAge};
 }
 return {
  list(){
   if(!directory())return {path:dir,copies:[],unavailable:0};
   let unavailable=0;const copies=names().flatMap(name=>{try{const e=read(filePattern.exec(name)[1]);return [{id:e.id,kind:e.kind,created_at:e.created_at,expired:e.expired,sha256:e.sha256,title:e.kind==='wizard'?e.data.name:e.data.id}];}catch{unavailable++;return [];}}).sort((a,b)=>b.created_at-a.created_at||a.id.localeCompare(b.id));
   return {path:dir,copies,unavailable};
  },
  save(kind,data){
   const entry={format:'startkompas-recovery-v1',id:randomUUID(),created_at:now(),kind,data};
   if(!validate(entry))throw Error('Invalid recovery fields');const bytes=bytesFor(entry);if(bytes.length>maxBytes)throw Error('Recovery copy is too large');
   directory(true);if(names().length>=maxCopies)throw Error('Keep at most 50 recovery copies; forget unneeded copies first');
   // Unique immutable names avoid cross-process last-writer-wins updates. A
   // partial interrupted write is reported unavailable and never replaces an older copy.
   writeExclusive(path.join(dir,entry.id+'.json'),bytes);
   return {id:entry.id,created_at:entry.created_at,path:dir,sha256:sha(bytes)};
  },
  read(id){const entry=read(id);if(entry.expired)throw Error('Recovery copy expired; inspect its local file manually if still needed');return entry;},
  forget(id,digest){const entry=read(id);if(entry.sha256!==digest)throw Error('Recovery copy changed; refresh before forgetting');fs.unlinkSync(path.join(dir,id+'.json'));return {forgotten:true};}
 };
}
