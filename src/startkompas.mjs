#!/usr/bin/env node
import fs from 'node:fs';
import {publicError} from './cli-errors.mjs';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const routes={
  context:['context-cli.mjs','preview selected prerequisite context; use context help'],
  workspace:['workspace-cli.mjs','show/journey/draft/add/task-state/impact/report/recovery-check/source-review; use workspace help'],
  project:['core-cli.mjs','init/create/read/retrieve/update/attach/handoff/export/restore/history and workflow commands'],
  business:['business-cli.mjs','types/prepare/read/render for versioned business drafts'],
  intake:['intake-cli.mjs','plan/answer/brief-nl/brief-en'],
  daily:['daily-cli.mjs','json/brief/details for the next milestone and actions'],
  costs:['costs-cli.mjs','calculate/brief/compare/compare-brief'],
  pilot:['pilot-cli.mjs','prepare a connected draft pilot package'],
  sources:['register-cli.mjs','validate/prepare/show source and review registers'],
  domains:['domains-cli.mjs','index/detail/prepare/screens'],
  modules:['module-cli.mjs','notices/detail/review for restricted module content'],
  run:['run-cli.mjs','check/prepare execution-ledger checkpoints'],
  legacy:['cli.mjs','create/resume for existing sk09-v1 projects']
};
const [route,...args]=process.argv.slice(2);
function help(){
  return ['Startkompas — public alpha','',
    'Usage: node src/startkompas.mjs <route> <command> [arguments]',
    '       npm run startkompas -- <route> <command> [arguments]','',
    ...Object.entries(routes).map(([name,[,description]])=>'  '+name.padEnd(10)+description),'',
    'Interactive menu: node start.mjs',
    'Check installation: doctor | Guided setup: start',
    'Readable project: overview <directory> <id> [nl|en]',
    'Compare versions: compare <directory> <id> <older> <newer> [--values]',
    'New project: project init <new-private-directory> <request.json>',
    'Resume:      project handoff <private-directory> <expected-project-id>',
    'Drafts:      business types | business read <directory> <project-id> <artifact-id>',
    'Help is read-only. Commands retain their own identity, revision and save protections.',
    'Request paths are relative to your current directory; application files are resolved internally.',
    'Use --version for the app version. See docs/commands.md for examples.',
    'Legacy create/resume shortcuts remain available; they do not migrate projects.',''].join('\n');
}
try{
  if(!route||route==='--help'||route==='-h'||route==='help'){
    if(args.length)throw Error('Help does not accept extra arguments');process.stdout.write(help());
  }else if(route==='--version'){
    if(args.length)throw Error('Version does not accept extra arguments');
    console.log(JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8')).version);
  }else{
    // Fixed route allowlist; arguments never become shell code or module paths.
    const welcome=['doctor','start','overview','compare'].includes(route);
    const legacy=['create','resume'].includes(route),entry=welcome?['welcome-cli.mjs']:legacy?routes.legacy:routes[route];
    if(!entry||(!welcome&&!Object.hasOwn(routes,legacy?'legacy':route)))throw Error('Unknown route: '+route+'; use --help');
    const child=spawnSync(process.execPath,[fileURLToPath(new URL(entry[0],import.meta.url)),...((legacy||welcome)?[route,...args]:args)],{stdio:'inherit',shell:false,windowsHide:true});
    if(child.error)throw child.error;
    if(child.signal){console.error(JSON.stringify({error:'Command interrupted',signal:child.signal}));process.exitCode=1;}
    else process.exitCode=child.status??1;
  }
}catch(error){console.error(JSON.stringify(publicError(error)));process.exitCode=1;}
