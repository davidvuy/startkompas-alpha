#!/usr/bin/env node
import {createInterface} from 'node:readline/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {diagnose} from './src/doctor.mjs';
import {publicError} from './src/cli-errors.mjs';

let rl;
try{
 if(process.argv.length>2){
  if(process.argv.length!==3||!['--help','-h'].includes(process.argv[2]))throw Error('Gebruik: node start.mjs');
  console.log('Startkompas keuzemenu: node start.mjs\nVereist een interactieve terminal. /cancel stopt een invoerstap.\nOpdrachten voor scripts: node src/startkompas.mjs --help');
 }else{
  if(!process.stdin.isTTY)throw Error('Open een interactieve terminal en voer node start.mjs uit. Gebruik de gewone CLI voor scripts.');
  const diagnostics=diagnose();
  if(!diagnostics.ok)throw Error('Installatie onvolledig. Voer npm ci --ignore-scripts --no-audit --no-fund uit en controleer met node src/startkompas.mjs doctor.');
  const {runMenu}=await import('./src/menu.mjs');
  rl=createInterface({input:process.stdin,output:process.stdout});
  await runMenu({
   ask:async prompt=>(await rl.question(prompt+': ')).trim(),
   print:text=>console.log(text),
   run:args=>{
    rl.close();
    const demo=args[0]==='demo';
    const child=spawnSync(process.execPath,[fileURLToPath(new URL(demo?'./examples/demo-founder-workflow.mjs':'./src/startkompas.mjs',import.meta.url)),...(demo?args.slice(1):args)],{stdio:'inherit',shell:false,windowsHide:true});
    if(child.error)throw child.error;
    process.exitCode=child.status??1;
   }
  });
 }
}catch(error){console.error(JSON.stringify(publicError(error)));process.exitCode=1;}
finally{rl?.close();}
