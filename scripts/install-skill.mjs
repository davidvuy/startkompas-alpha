import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {verifyInstallation} from './verify-installation.mjs';

// Runs from an extracted public ZIP as well as a clone. No Git or network needed.
export function installSkill(destination) {
  const source=fs.realpathSync(fileURLToPath(new URL('../',import.meta.url)));
  const target=path.resolve(destination);
  if(fs.existsSync(target))throw Error('Destination exists. Keep your existing skill and choose a new directory; no overwrite was performed.');
  const relative=path.relative(source,target);
  if(relative===''||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Install outside the downloaded package.');
  const bytes=fs.readFileSync(path.join(source,'installation.json'));
  const manifest=JSON.parse(bytes);
  if(manifest.distribution!=='public-alpha')throw Error('Use a complete public alpha package.');
  verifyInstallation(source,manifest.source_revision,createHash('sha256').update(bytes).digest('hex'));
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.mkdirSync(target);
  const runtime=path.join(target,'runtime');
  fs.mkdirSync(runtime);
  for(const row of manifest.files){
    const output=path.join(runtime,row.path);
    fs.mkdirSync(path.dirname(output),{recursive:true});
    fs.copyFileSync(path.join(source,row.path),output,fs.constants.COPYFILE_EXCL);
  }
  fs.copyFileSync(path.join(source,'installation.json'),path.join(runtime,'installation.json'));
  fs.cpSync(path.join(runtime,'.agents/skills/startkompas'),target,{recursive:true,force:false,errorOnExist:true});
  return {skill:target,runtime,next:'Run npm ci --ignore-scripts --no-audit --no-fund in runtime. Open a fresh Codex chat and invoke $startkompas.',verification:'Package consistency checked; authenticity depends on your download source.'};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    if(process.argv.length>3)throw Error('Usage: node scripts/install-skill.mjs [new-skill-directory]');
    const home=process.env.CODEX_HOME||path.join(os.homedir(),'.codex');
    console.log(JSON.stringify(installSkill(process.argv[2]||path.join(home,'skills/startkompas')),null,2));
  }catch(error){console.error(error.message);process.exitCode=1;}
}
