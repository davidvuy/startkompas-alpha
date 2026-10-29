import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {verifyInstallation} from './verify-installation.mjs';
const bytes=fs.readFileSync('installation.json'),manifest=JSON.parse(bytes);
for(const row of manifest.files){if(/^(evidence|evals|private|node_modules)\//.test(row.path)||/^docs\/(plan|requirements|sources|checkpoint|decisions)([./]|$)/.test(row.path))throw Error('Private development material in public package');}
const result=verifyInstallation(process.cwd(),manifest.source_revision,createHash('sha256').update(bytes).digest('hex'));
console.log(JSON.stringify({...result,trust:'Self-consistency only; verify a separately trusted manifest digest for authenticity.'},null,2));
