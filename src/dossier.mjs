import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import Ajv2020 from 'ajv/dist/2020.js';

const root=fs.realpathSync(fileURLToPath(new URL('../',import.meta.url)));
const schema=JSON.parse(fs.readFileSync(new URL('../schemas/dossier-sk09.schema.json',import.meta.url),'utf8'));
const validate=new Ajv2020({strict:true,allErrors:true,useDefaults:false,coerceTypes:false,removeAdditional:false}).compile(schema);
export const MAX_BYTES=65536;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function readJSON(file) {
  const fd=fs.openSync(file,'r');
  try {
    if(!fs.fstatSync(fd).isFile()) throw new Error('Expected a regular JSON file');
    const buffer=Buffer.alloc(MAX_BYTES+1);let used=0;
    while(used<buffer.length){const n=fs.readSync(fd,buffer,used,buffer.length-used,null);if(n===0)break;used+=n;}
    if(used>MAX_BYTES)throw new Error('JSON file exceeds 65536 bytes');
    const bytes=buffer.subarray(0,used);
    return {data:JSON.parse(bytes.toString('utf8')),bytes};
  } finally {fs.closeSync(fd);}
}
function check(data) {
  if(!validate(data))throw new Error('Invalid sk09-v1 dossier: '+validate.errors.slice(0,4).map(e=>`${e.instancePath || '/'} ${e.message}`).join('; '));
  if(data.decision.basis_fact_id!==data.fact.id)throw new Error('Decision basis does not identify the stored fact');
}
function outsideSource(dir,create=false) {
  const absolute=path.resolve(dir);
  const canonical=fs.existsSync(absolute)?fs.realpathSync(absolute):path.join(fs.realpathSync(path.dirname(absolute)),path.basename(absolute));
  const relative=path.relative(root,canonical);
  if(relative==='' || (!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw new Error('Dossier must be outside the source tree');
  if(create&&!fs.existsSync(canonical))fs.mkdirSync(canonical);
  if(!fs.statSync(canonical).isDirectory())throw new Error('Dossier path must be a directory');
  return canonical;
}
export function createProject(dir,input) {
  // Clone user input; only technical identity fields are supplied by the helper.
  if(Object.hasOwn(input,'schema_version')||Object.hasOwn(input,'revision'))throw new Error('Creation input must not supply schema_version or revision');
  const data={...structuredClone(input),schema_version:'sk09-v1',revision:1};
  check(data);
  const bytes=Buffer.from(JSON.stringify(data,null,2)+'\n');
  if(bytes.length>MAX_BYTES)throw new Error('Dossier exceeds 65536 bytes');
  const directory=outsideSource(dir,true),file=path.join(directory,'project.json');
  // Create-only: never truncate an existing dossier. Updates/recovery are later work.
  const fd=fs.openSync(file,'wx',0o600);
  try {fs.writeFileSync(fd,bytes);fs.fsyncSync(fd);} finally {fs.closeSync(fd);}
  const saved=readJSON(file);
  if(hash(saved.bytes)!==hash(bytes))throw new Error('Saved dossier verification failed');
  return {file,sha256:hash(saved.bytes),dossier:saved.data};
}
export function resumeProject(dir,expectedId) {
  if(typeof expectedId!=='string'||!expectedId)throw new Error('Expected project identity is required');
  const file=path.join(outsideSource(dir),'project.json');
  const loaded=readJSON(file);check(loaded.data);
  if(loaded.data.project_id!==expectedId)throw new Error('Project identity mismatch');
  return {file,sha256:hash(loaded.bytes),dossier:loaded.data};
}
