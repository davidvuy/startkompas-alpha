import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {verifyInstallation} from './verify-installation.mjs';
const bytes=fs.readFileSync('installation.json'),manifest=JSON.parse(bytes);
for(const row of manifest.files){if(/^(evidence|evals|private|node_modules)\//.test(row.path)||/^docs\/(plan|requirements|sources|checkpoint|decisions)([./]|$)/.test(row.path))throw Error('Private development material in public package');}
const result=verifyInstallation(process.cwd(),manifest.source_revision,createHash('sha256').update(bytes).digest('hex'));
console.log(JSON.stringify({...result,trust:'Self-consistency only; verify a separately trusted manifest digest for authenticity.'},null,2));

const version=JSON.parse(fs.readFileSync('package.json','utf8')).version;
const label=version.replace('0.1.0-alpha.','');
if(!fs.readFileSync('README.md','utf8').includes('[Download alpha '+label+' (ZIP)](https://github.com/davidvuy/startkompas-alpha/archive/refs/tags/v'+version+'.zip)'))throw Error('README download label/tag does not match the package version');
