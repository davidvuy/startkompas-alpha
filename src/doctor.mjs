import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const root=fileURLToPath(new URL('../',import.meta.url));
export function diagnose(directory=root){
 const checks=[];let pkg;
 try{pkg=JSON.parse(fs.readFileSync(path.join(directory,'package.json'),'utf8'));checks.push({name:'package',status:'pass',detail:'Startkompas '+pkg.version});}catch{checks.push({name:'package',status:'fail',detail:'Package metadata missing or invalid. Extract the full download.'});}
 const expected=pkg?.engines?.node;checks.push({name:'node',status:process.versions.node===expected?'pass':'warning',detail:'Running '+process.versions.node+'; tested version '+(expected??'unknown')+'. Other versions are not qualified.'});
 try{const require=createRequire(path.join(directory,'package.json'));for(const [name,version]of Object.entries(pkg?.dependencies??{})){const installed=require(name+'/package.json');require(name);if(installed.version!==version)throw Error();}if(!pkg)throw Error();checks.push({name:'dependencies',status:'pass',detail:'Direct dependency versions match.'});}catch{checks.push({name:'dependencies',status:'fail',detail:'Run npm ci --ignore-scripts --no-audit --no-fund in the application folder.'});}
 for(const file of ['src/startkompas.mjs','schemas/dossier-v1.1.schema.json'])checks.push({name:file,status:fs.existsSync(path.join(directory,file))?'pass':'fail',detail:'Required application file'});
 const skill=['.agents/skills/startkompas/SKILL.md','skill/startkompas/SKILL.md'].some(p=>fs.existsSync(path.join(directory,p)));checks.push({name:'skill',status:skill?'pass':'fail',detail:'Skill file presence only; Codex login and discovery are not tested.'});
 return {version:pkg?.version??null,ok:checks.every(c=>c.status!=='fail'),checks,limitations:['Read-only; no model calls, network, account access or private project inspection.','Version/file checks are not authenticity or security certification.']};
}
