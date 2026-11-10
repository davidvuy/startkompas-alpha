import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const root=fileURLToPath(new URL('../',import.meta.url));
export function diagnose(directory=root){
 const checks=[];let pkg;
 try{pkg=JSON.parse(fs.readFileSync(path.join(directory,'package.json'),'utf8'));checks.push({name:'package',status:'pass',detail:'Startkompas '+pkg.version});}catch{checks.push({name:'package',status:'fail',detail:'Package metadata missing or invalid. Extract the full download.'});}
 const expected=pkg?.engines?.node;checks.push({name:'node',status:process.versions.node===expected?'pass':'warning',detail:'Running '+process.versions.node+'; tested version '+(expected??'unknown')+'. Other versions are not qualified.'});
 try{const require=createRequire(path.join(directory,'package.json'));for(const [name,version]of Object.entries(pkg?.dependencies??{})){if(!/^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/i.test(name))throw Error();const installed=JSON.parse(fs.readFileSync(path.join(directory,'node_modules',name,'package.json'),'utf8'));require(name);if(installed.version!==version)throw Error();}if(!pkg)throw Error();checks.push({name:'dependencies',status:'pass',detail:'Direct dependency versions match.'});}catch{checks.push({name:'dependencies',status:'fail',detail:'Run npm ci --ignore-scripts --no-audit --no-fund in the application folder.'});}
 for(const file of ['src/startkompas.mjs','schemas/dossier-v1.1.schema.json'])checks.push({name:file,status:fs.existsSync(path.join(directory,file))?'pass':'fail',detail:'Required application file; if missing, extract a complete download into a new folder.'});
 // The skill moved to skill/ and the bundled .agents copy was removed; see
 // DECISIONS.md entry 1. This is a WARNING rather than a failure: the runtime
 // works without the skill, so a missing skill/ means an incomplete download,
 // not a broken runtime. Host discovery is still not tested by file presence.
 const skill=fs.existsSync(path.join(directory,'skill/SKILL.md'));checks.push({name:'skill',status:skill?'pass':'warning',detail:skill?'skill/SKILL.md present. File presence only; host discovery is not tested.':'skill/SKILL.md not found. The runtime does not need it, but your download is incomplete. The skill installs by copying skill/ into your host\'s skills directory.'});
 return {version:pkg?.version??null,ok:checks.every(c=>c.status!=='fail'),checks,limitations:['Read-only; no model calls, network, account access or private project inspection.','Version/file checks are not authenticity or security certification.']};
}
