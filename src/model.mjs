import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import {checkWorkflow} from './dependencies.mjs';

export const COLLECTIONS = ['profile','facts','assumptions','sources','decisions','tasks','checks','artifacts','evidence','events'];
const validators=new Map(['1.0.0','1.1.0'].map(version=>{
  const schema=JSON.parse(fs.readFileSync(new URL(version==='1.0.0'?'../schemas/dossier-v1.schema.json':'../schemas/dossier-v1.1.schema.json',import.meta.url)));
  return [version,new Ajv2020({strict:true,allowUnionTypes:true,allErrors:true,useDefaults:false,coerceTypes:false,removeAdditional:false}).compile(schema)];
}));
export const MAX_CORE_BYTES = 4 * 1024 * 1024;
export function canonical(value) {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k)+':'+canonical(value[k])).join(',') + '}';
  return JSON.stringify(value);
}
export function checkModel(data) {
  const validate=validators.get(data?.schema_version);
  if (!validate) throw Error('Unsupported schema version; no automatic rewrite');
  if (!validate(data)) throw Error('Invalid dossier: '+validate.errors.slice(0,8).map(e=>`${e.instancePath||'/'} ${e.message}`).join('; '));
  if (Buffer.byteLength(JSON.stringify(data)) > MAX_CORE_BYTES) throw Error('Dossier exceeds 4 MiB');
  const records = new Map();
  for (const group of COLLECTIONS) for (const record of data[group]) {
    if (records.has(record.id)) throw Error('Duplicate record ID: '+record.id);
    records.set(record.id,{group,record});
  }
  const ref = (id, groups) => {
    if (!records.has(id) || (groups && !groups.includes(records.get(id).group))) throw Error('Missing or wrong-kind reference: '+id);
    return records.get(id).record;
  };
  for (const record of [...data.profile,...data.facts,...data.assumptions]) {
    for (const id of record.source_ids) ref(id,['sources']);
    if (record.assertion !== 'unknown' && !record.source_ids.length) throw Error('Assertion needs a source: '+record.id);
    if ('value' in record && ((record.assertion === 'unknown') !== (record.value === null))) throw Error('Unknown profile values must be null: '+record.id);
  }
  for (const d of data.decisions) {
    for (const id of d.basis_ids) ref(id);
    if (!d.basis_ids.length) throw Error('Decision needs a basis: '+d.id);
    if (d.supersedes !== null) { if (d.supersedes === d.id) throw Error('Decision cannot supersede itself'); ref(d.supersedes,['decisions']); }
  }
  const artifactPaths=new Set();
  for (const artifact of data.artifacts) {
    if (artifact.storage === 'local' && !/^files\/[a-zA-Z0-9][a-zA-Z0-9_./-]*$/.test(artifact.location)) throw Error('Local artifact must use a relative files/ location');
    if (artifact.storage === 'local' && artifact.location.split('/').some(s=>s === '..'||s === '.'||s === '')) throw Error('Unsafe artifact path');
    if (artifact.storage === 'local' && artifact.availability === 'available' && !artifact.sha256) throw Error('Available local artifact needs a fingerprint');
    if(artifact.storage==='local'){
      const key=artifact.location.toLowerCase();
      if(artifactPaths.has(key))throw Error('Duplicate local artifact path');
      artifactPaths.add(key);
    }
  }
  for (const e of data.evidence) {
    ref(e.artifact_id,['artifacts']); ref(e.subject_id);
  }
  for (const t of [...data.tasks,...data.checks]) {
    for (const id of t.evidence_ids) {
      const e=ref(id,['evidence']);
      if (e.subject_id!==t.id || e.period!==t.period) throw Error('Evidence belongs to another subject or period: '+id);
    }
    if (t.substantiation === 'supported' && !t.evidence_ids.some(id=>ref(id).result==='supports')) throw Error('Supported status requires scoped supporting evidence: '+t.id);
    for (const id of t.depends_on||[]) ref(id,['tasks','checks']);
  }
  // Record existence and scoped review are checked; neither establishes factual truth.
  for (const e of data.events) for (const id of e.subject_ids) ref(id);
  if (data.active_task_id !== null) ref(data.active_task_id,['tasks']);
  const keys = new Set();
  for (const p of data.profile) { if(keys.has(p.key)) throw Error('Duplicate profile key: '+p.key); keys.add(p.key); }
  const modules=new Set(); for(const m of data.module_versions){if(modules.has(m.id))throw Error('Duplicate module ID');modules.add(m.id);}
  const operations=new Set();
  for (const op of data.operations) {
    if(operations.has(op.id)||op.revision>data.revision) throw Error('Invalid operation history');
    operations.add(op.id);
  }
  checkWorkflow(data);
  return data;
}
