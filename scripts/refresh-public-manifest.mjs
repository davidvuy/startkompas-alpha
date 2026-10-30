import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {verifyInstallation} from './verify-installation.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
try{
 if(process.argv.length!==3||!['--check','--write'].includes(process.argv[2]))throw Error('Usage: node scripts/refresh-public-manifest.mjs --check|--write (public package only)');
 const original=fs.readFileSync('installation.json'),manifest=JSON.parse(original),changed=[];
 if(manifest.distribution!=='public-alpha'||!Array.isArray(manifest.files))throw Error('Expected public alpha manifest');
 const seen=new Set();
 for(const entry of manifest.files){
  if(typeof entry.path!=='string'||entry.path.includes('\\')||entry.path.split('/').some(x=>!x||x==='.'||x==='..')||path.isAbsolute(entry.path)||seen.has(entry.path)||/^(evidence|evals|private|node_modules)\//.test(entry.path)||/^docs\/(plan|requirements|sources|checkpoint|decisions)([./]|$)/.test(entry.path))throw Error('Unsafe manifest path');
  seen.add(entry.path);let current=process.cwd();for(const segment of entry.path.split('/')){current=path.join(current,segment);if(fs.lstatSync(current).isSymbolicLink())throw Error('Manifest paths cannot contain symbolic links');}
  if(!fs.statSync(current).isFile())throw Error('Manifest entries must be files');
  const next=hash(fs.readFileSync(current));if(next!==entry.sha256){changed.push(entry.path);entry.sha256=next;}
 }
 if(process.argv[2]==='--check'){console.log(JSON.stringify({changed,warning:'Review these changes before --write. New files require reviewed packaging; this tool never expands the allowlist.'},null,2));if(changed.length)process.exitCode=1;}
 else{
  const bytes=Buffer.from(JSON.stringify(manifest,null,2)+'\n');
  try{fs.writeFileSync('installation.json',bytes);verifyInstallation(process.cwd(),manifest.source_revision,hash(bytes));}catch(error){fs.writeFileSync('installation.json',original);throw error;}
  console.log(JSON.stringify({updated:changed,manifest_sha256:hash(bytes),warning:'Consistency only, not approval. Review diffs, run CI and publish a new trusted digest.'},null,2));
 }
}catch(error){console.error(error.message);process.exitCode=1;}
