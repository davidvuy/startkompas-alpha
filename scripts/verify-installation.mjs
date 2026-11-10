import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const digest=b=>createHash('sha256').update(b).digest('hex');
const requireThat=(ok,message)=>{if(!ok)throw Error(message);};
// Explicit notice paths retain distinct nested package versions and multi-file notices.
const dependencyNotices={
 'node_modules/@noble/ciphers':['noble-ciphers-LICENSE.txt'],
 'node_modules/@noble/hashes':['noble-hashes-LICENSE.txt'],
 'node_modules/@swc/helpers':['swc-helpers-LICENSE.txt'],
 'node_modules/linebreak/node_modules/base64-js':['linebreak-base64-js-LICENSE.MIT.txt'],
 'node_modules/tslib':['tslib-LICENSE.txt.txt'],
 'node_modules/fontkit':['fontkit-README.md.txt','fontkit-package.json.txt'],
 'node_modules/dfa':['dfa-README.md.txt','dfa-package.json.txt'],
 'node_modules/brotli':['brotli-README.md.txt','brotli-package.json.txt','brotli-decoder-notice-source.txt','swc-helpers-LICENSE.txt'],
 ...Object.fromEntries(['base64-js','clone','fflate','linebreak','pako','pdfkit','png-js','restructure','tiny-inflate','unicode-properties','unicode-trie'].map(name=>['node_modules/'+name,[name+'-LICENSE.txt']]))
};
// The four .agents/skills/startkompas entries were removed on 2026-11-10 with
// the deprecated runtime-coupled skill. See DECISIONS.md entry 1. The skill now
// lives in skill/, which is deliberately outside this manifest.
export const requiredFiles=['package.json','package-lock.json','LICENSE','LICENSING.md','THIRD_PARTY_NOTICES.md','src/core-cli.mjs','schemas/dossier-v1.schema.json','schemas/dossier-v1.1.schema.json','examples/dossier-v1.1.json','docs/start-resume.md','docs/gebruiken.nl.md'];
export function verifyInstallation(directory,expectedRevision,expectedManifestHash){
 requireThat(/^[a-f0-9]{40}$/.test(expectedRevision??''),'Expected source revision required');
 requireThat(/^[a-f0-9]{64}$/.test(expectedManifestHash??''),'Trusted manifest SHA-256 required');
 const root=path.resolve(directory);requireThat(fs.lstatSync(root).isDirectory()&&!fs.lstatSync(root).isSymbolicLink(),'Plain installation directory required');
 const regular=p=>{const s=fs.lstatSync(p);requireThat(s.isFile()&&!s.isSymbolicLink(),'Regular file required');requireThat(s.size<=8*1024*1024,'File exceeds verifier bound');return fs.readFileSync(p);};
 const raw=regular(path.join(root,'installation.json'));requireThat(digest(raw)===expectedManifestHash,'Manifest differs from trusted digest');
 const manifest=JSON.parse(raw);requireThat(manifest.source_revision===expectedRevision,'Source revision mismatch');
 requireThat(Array.isArray(manifest.files)&&manifest.files.length>0&&manifest.files.length<=5000,'Invalid manifest file list');
 const files=new Map(),folded=new Set();
 for(const f of manifest.files){
  requireThat(typeof f.path==='string'&&f.path.length<1024,'Invalid file path');
  const parts=f.path.split('/');requireThat(parts.every(s=>s&&s!=='.'&&s!=='..'&&!/[\\:<>"|?*\x00-\x1f]/.test(s)&&!/[. ]$/.test(s)&&! /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(s)),'Unsafe manifest path');
  requireThat(!['installation.json','node_modules','.git'].includes(parts[0]),'Reserved manifest path');
  requireThat(!folded.has(f.path.toLowerCase()),'Duplicate/case-colliding path');folded.add(f.path.toLowerCase());
  requireThat(/^[a-f0-9]{64}$/.test(f.sha256??''),'Invalid file digest');files.set(f.path,f.sha256);
 }
 for(const f of requiredFiles)requireThat(files.has(f),'Missing required file: '+f);
 const observed=[];function walk(dir,rel=''){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
   const name=rel?rel+'/'+e.name:e.name,p=path.join(dir,e.name),st=fs.lstatSync(p);
   requireThat(!st.isSymbolicLink(),'Linked package entry refused');
   // skill/ is the standalone host-neutral skill, distributed by plain folder copy.
   // It is deliberately outside this legacy runtime manifest and has its own check
   // (skill/scripts/check-skill.mjs). The legacy installer must not copy it.
   if(!rel&&['node_modules','.git','skill'].includes(e.name)){requireThat(st.isDirectory(),'Excluded local entry must be directory');continue;}
   if(st.isDirectory())walk(p,name);
   else {requireThat(st.isFile(),'Unsupported package entry');if(name==='installation.json')continue;requireThat(files.has(name),'Unlisted file: '+name);requireThat(digest(regular(p))===files.get(name),'File hash mismatch: '+name);observed.push(name);}
  }
 }walk(root);requireThat(observed.length===files.size,'Missing manifest file');
 const json=p=>JSON.parse(regular(path.join(root,p))),pkg=json('package.json'),lock=json('package-lock.json');
 requireThat(pkg.private===true,'Internal package must remain private');
 requireThat(pkg.version===lock.packages?.['']?.version,'Package/lock version mismatch');
 requireThat(JSON.stringify(pkg.dependencies)===JSON.stringify(lock.packages[''].dependencies),'Package/lock dependencies differ');
 const deps=Object.entries(lock.packages).filter(([p])=>p);requireThat(deps.length>0,'Missing locked dependencies');
 for(const [p,d]of deps){
  requireThat(/^(?:node_modules\/(?:@[a-z0-9-]+\/)?[a-z0-9-]+)(?:\/node_modules\/(?:@[a-z0-9-]+\/)?[a-z0-9-]+)*$/.test(p),'Unsupported dependency layout');
  requireThat(typeof d.version==='string'&&typeof d.integrity==='string'&&/^sha512-[A-Za-z0-9+/]+=*$/.test(d.integrity),'Missing locked dependency identity');
  const notices=dependencyNotices[p]??[p.slice(13)+'.txt'];for(const notice of notices)requireThat(files.has('licenses/dependencies/'+notice),'Missing dependency notice: '+p);
 }
 for(const [name,version]of Object.entries(pkg.dependencies??{}))requireThat(lock.packages['node_modules/'+name]?.version===version,'Direct dependency not exact locked version');
 // The identity check formerly read the bundled skill's frontmatter. That skill
 // was removed (DECISIONS.md entry 1); package.json's own name identifies this
 // package now.
 requireThat(pkg.name==='startkompas','Wrong package identity');
 return {result:'pass',source_revision:expectedRevision,manifest_sha256:expectedManifestHash,files_verified:observed.length,locked_dependencies:deps.length,excluded_local_directories:['node_modules','.git','skill'],installed_dependency_contents_verified:false,read_only:true,authenticity:'Only as trustworthy as the separately supplied digest/revision',release_approved:false};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){try{requireThat(process.argv.length===5,'Usage: node scripts/verify-installation.mjs <directory> <expected-source-revision> <trusted-manifest-sha256>');console.log(JSON.stringify(verifyInstallation(...process.argv.slice(2)),null,2));}catch(e){console.error(JSON.stringify({result:'fail',error:e.message}));process.exitCode=1;}}
