import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {verifyInstallation} from './verify-installation.mjs';
const bytes=fs.readFileSync('installation.json'),manifest=JSON.parse(bytes);
for(const row of manifest.files){if(/^(evidence|evals|private|node_modules)\//.test(row.path)||/^docs\/(plan|requirements|sources|checkpoint|decisions)([./]|$)/.test(row.path))throw Error('Private development material in public package');}
// A hash mismatch is the failure this script produces most often, and until
// 2026-11-12 it produced it as a bare `Error: File hash mismatch: BACKLOG.md`
// with a stack trace. That names the symptom and not the remedy, and in CI it
// arrives as an email about a red build — so the Quality workflow failed on
// every push for a day while the fix was one command. Say the command.
let result;
try{result=verifyInstallation(process.cwd(),manifest.source_revision,createHash('sha256').update(bytes).digest('hex'));}
catch(error){
 const drift=/^(File hash mismatch|Unlisted file|Missing manifest file|Missing required file)/.test(error.message);
 console.error(error.message);
 if(drift)console.error('\ninstallation.json no longer describes this tree. It lists a SHA-256 for every file outside node_modules, .git and skill/, so editing any of them needs the manifest refreshed in the same commit:\n  node scripts/refresh-public-manifest.mjs --check   # what moved\n  node scripts/refresh-public-manifest.mjs --write   # record it\nA file the manifest does not list is a packaging decision: add its entry deliberately rather than reaching for --write, which never expands the allowlist.\nRun `npm run test:scripts` before pushing; it asserts the same thing.');
 process.exitCode=1;
}
if(!result)process.exit(process.exitCode??1);
console.log(JSON.stringify({...result,trust:'Self-consistency only; verify a separately trusted manifest digest for authenticity.'},null,2));

const version=JSON.parse(fs.readFileSync('package.json','utf8')).version;
const label=version.replace('0.1.0-alpha.','');
if(!fs.readFileSync('README.md','utf8').includes('[Download alpha '+label+' (ZIP)](https://github.com/davidvuy/startkompas-alpha/archive/refs/tags/v'+version+'.zip)'))throw Error('README download label/tag does not match the package version');
