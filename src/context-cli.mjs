#!/usr/bin/env node
import {regularFile} from './store.mjs';
import {prepareSkillContext} from './skill-context.mjs';
import {publicError} from './cli-errors.mjs';
const [command,dir,file,...extra]=process.argv.slice(2);
try{
 if(command==='help'&&!dir)console.log('Usage: context preview <private-directory> <selection.json>\nRead docs/skill-context.md before sharing output. No network calls or project writes.');
 else {
  if(command!=='preview'||!dir||!file||extra.length)throw Error('Use context help');
  const selection=JSON.parse(regularFile(file,32768).toString('utf8'));
  process.stdout.write(JSON.stringify(prepareSkillContext(dir,selection),null,2)+'\n');
 }
}catch(error){console.error(JSON.stringify(publicError(error)));process.exitCode=1;}
