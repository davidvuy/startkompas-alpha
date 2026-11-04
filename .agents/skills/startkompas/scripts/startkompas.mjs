import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const roots=[new URL('../runtime/',import.meta.url),new URL('../../../',import.meta.url),new URL('../../../../',import.meta.url)];
const root=roots.find(url=>fs.existsSync(new URL('src/startkompas.mjs',url)));
if(!root){console.error('Startkompas helpers are missing. Install the complete Codex skill package; conversation-only drafts remain possible.');process.exitCode=1;}
else if(process.argv[2]==='--runtime-root'){
 if(process.argv.length!==3){console.error('No extra arguments allowed');process.exitCode=1;}
 else console.log(fileURLToPath(root));
}else{
 const result=spawnSync(process.execPath,[fileURLToPath(new URL('src/startkompas.mjs',root)),...process.argv.slice(2)],{stdio:'inherit',shell:false,windowsHide:true});
 if(result.error||result.signal){console.error('Startkompas helper could not finish; inspect saved state before retrying.');process.exitCode=1;}
 else process.exitCode=result.status??1;
}
