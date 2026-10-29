import {COLLECTIONS} from './model.mjs';
import {readCore,regularFile,localFile,sha,damagedArtifacts} from './store.mjs';
import {applyInvalidation} from './change-rules.mjs';
import fs from 'node:fs';

export function handoff(dir,id,{query='',limit=20}={}) {
  if(typeof query!=='string'||query.length>1000||!Number.isInteger(limit)||limit<1||limit>100)throw Error('Invalid query/limit');
  const state=readCore(dir,id),d=applyInvalidation(state.dossier,structuredClone(state.dossier),damagedArtifacts(state.directory,state.dossier));
  const all=COLLECTIONS.flatMap(group=>d[group].map(record=>({group,...record})));
  const matches=all.filter(r=>!query||JSON.stringify(r).toLowerCase().includes(query.toLowerCase()));
  const artifacts=d.artifacts.map(a=>{
    let actual=a.storage==='external'?'external_unchecked':'missing';
    if(a.storage==='local'){
      try{const file=localFile(state.directory,a.location);
      if(fs.existsSync(file))actual=sha(regularFile(file,16*1024*1024))===a.sha256?'hash_matches':'hash_mismatch';}catch{actual='unreadable_or_unsafe';}
    }
    return {id:a.id,recorded_availability:a.availability,actual,location:a.location};
  });
  const decisions=d.decisions.filter(x=>x.status==='active'),openTasks=d.tasks.filter(t=>t.progress!=='done'),checks=d.checks.filter(c=>c.applicability==='unknown'||c.substantiation!=='supported'||c.progress!=='done');
  const totals={decisions:decisions.length,open_tasks:openTasks.length,unresolved_checks:checks.length,evidence:d.evidence.length,artifacts:artifacts.length};
  return {project_id:id,name:d.name,revision:d.revision,schema_version:d.schema_version,canonical_sha256:state.sha256,
    active_task:d.tasks.find(t=>t.id===d.active_task_id)||null,
    decisions:decisions.slice(0,limit),open_tasks:openTasks.slice(0,limit),unresolved_checks:checks.slice(0,limit),
    evidence:d.evidence.slice(0,limit),artifacts:artifacts.slice(0,limit),
    summary:{limit_per_section:limit,totals,truncated:Object.values(totals).some(n=>n>limit)},
    retrieval:{query,total_matches:matches.length,returned:Math.min(limit,matches.length),truncated:matches.length>limit,records:matches.slice(0,limit)},
    invalidated_ids:d.workflow?.invalidated_ids||[],
    limitations:['Derived from this canonical revision plus current local artifact checks; not conversational memory','Record existence, hashes and reported reviews do not establish substantive correctness','External content is not fetched; access and truth remain unchecked']};
}
