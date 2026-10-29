import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {dependencyGraph,affected,emptyWorkflow,records} from './dependencies.mjs';
import {checkModel} from './model.mjs';
import {readCore,updateCore,damagedArtifacts,safeDirectory,writeExclusive,bytesFor,regularFile,sha} from './store.mjs';
import {exportCore,restoreCore} from './transfer.mjs';
import {applyInvalidation} from './change-rules.mjs';

function state(dir,id){const loaded=readCore(dir,id);if(!loaded.dossier.workflow)throw Error('Workflow requires schema 1.1.0; use explicit copy upgrade');
  const data=applyInvalidation(loaded.dossier,structuredClone(loaded.dossier),damagedArtifacts(loaded.directory,loaded.dossier));return {...loaded,data};}
export function planNext(dir,id,request){
  const {data:d}=state(dir,id),g=dependencyGraph(d);
  if(!request||!['small_edit','material_choice'].includes(request.kind)||!Array.isArray(request.target_ids)||!request.target_ids.length||request.target_ids.some(x=>!g.index.has(x)))throw Error('Planning requires kind and existing target_ids');
  if(request.kind==='small_edit')return {project_id:id,revision:d.revision,route:'direct_small_edit',research:[],warning:'Caller/skill classifies materiality; this does not authorize external actions'};
  const relevant=new Set(),queue=[...request.target_ids];for(let i=0;i<queue.length;i++){const x=queue[i];if(relevant.has(x))continue;relevant.add(x);queue.push(...g.edges.get(x).keys());}
  const accepted=[],acceptanceReview=[],reused=[],blockers=[];
  for(const u of d.workflow.uncertainties.filter(u=>relevant.has(u.record_id)&&u.impact==='material')){
    const acceptance=d.workflow.accepted.find(a=>a.record_id===u.record_id);
    const usable=u.checks.filter(c=>{const r=g.index.get(c.record_id);return !d.workflow.invalidated_ids.includes(u.record_id)&&r.applicability==='applies'&&r.progress==='done'&&r.substantiation==='supported'&&!d.workflow.invalidated_ids.includes(r.id)&&r.evidence_ids.some(id=>{
      const e=g.index.get(id),a=g.index.get(e.artifact_id);return e.result==='supports'&&a.availability==='available'&&!d.workflow.invalidated_ids.includes(a.id);
    });});
    if(usable.length){reused.push({uncertainty:u.record_id,checks:usable.map(c=>c.record_id)});continue;}
    if(acceptance&&!d.workflow.invalidated_ids.includes(u.record_id)){accepted.push(acceptance);continue;}
    if(acceptance)acceptanceReview.push({...acceptance,review_reason:'The accepted premise or its basis changed; reassess using current scoped records'});
    const candidates=[...u.checks].filter(c=>g.index.get(c.record_id).applicability!=='not_applicable').sort((a,b)=>a.cost_rank-b.cost_rank||a.record_id.localeCompare(b.record_id));
    blockers.push({record_id:u.record_id,reason:u.reason,next_check:candidates[0]?.record_id||null,cost_rank:candidates[0]?.cost_rank??null});
  }
  const blockedIds=new Set(affected(d,blockers.map(x=>x.record_id)));
  return {project_id:id,revision:d.revision,route:blockers.length?'check_before_expansion':'no_declared_material_blocker',reused_research:reused,accepted_uncertainty:accepted,acceptance_requiring_review:acceptanceReview,blockers,
    independent_tasks:d.tasks.filter(t=>t.progress!=='done'&&!blockedIds.has(t.id)).map(t=>t.id),
    next_checks:[...new Set(blockers.map(b=>b.next_check).filter(Boolean))],
    limitations:['Only declared uncertainties/dependencies are evaluated; an empty graph is not proof of readiness','cost_rank is a supplied relative order, not a price or budget approval','Accepted uncertainty is not verified evidence']};
}
const normalize=s=>s.normalize('NFKC').toLowerCase().trim().replace(/\s+/g,' ');
export function findReusable(dir,id,query){
  const {data:d}=state(dir,id),index=records(d);
  if(!query||typeof query.goal!=='string'||!query.goal.trim()||['client','period','version'].some(k=>!(k in query)||(query[k]!==null&&typeof query[k]!=='string')))throw Error('Reuse query needs goal, client, period and version (null if unknown)');
  const hits=d.workflow.intents.filter(i=>normalize(i.goal)===normalize(query.goal));
  const exact=hits.filter(i=>['client','period','version'].every(k=>query[k]!==null&&i[k]===query[k]));
  return {project_id:id,revision:d.revision,search_complete_for_declared_intents:true,
    reusable:exact.filter(i=>!d.workflow.invalidated_ids.includes(i.record_id)).map(i=>({intent:i,record:index.get(i.record_id)})),
    review_candidates:hits.filter(i=>!exact.includes(i)||d.workflow.invalidated_ids.includes(i.record_id)).map(i=>({intent:i,reason:'Different/unknown scope or invalidated record; do not automatically merge'})),
    limitations:['Normalized explicit goal identity, not a semantic language model or exhaustive synonym search','No match means no matching declared intent; inspect raw records before creating duplicate work','No records are merged or changed by search']};
}
export function prepareChange(dir,request){
  const {dossier:d}=readCore(dir,request.project_id);
  if(!d.workflow||!Array.isArray(request.changed_ids)||!request.changed_ids.length||typeof request.reason!=='string'||!request.reason.trim())throw Error('Change needs changed_ids and reason');
  const impacted=affected(d,request.changed_ids),workflow={...d.workflow,invalidated_ids:[...new Set([...d.workflow.invalidated_ids,...impacted])]};
  // Deterministic event timestamp supplied by caller makes retries byte/semantic identical.
  if(typeof request.at!=='string'||!request.at.trim())throw Error('Change date required');
  const event={id:'change-'+sha(JSON.stringify(request)).slice(0,40),type:'change-review',at:request.at,description:request.reason,subject_ids:request.changed_ids};
  const events=d.events.some(e=>e.id===event.id)?d.events:d.events.concat(event);
  const op={project_id:request.project_id,expected_revision:request.expected_revision,operation_id:request.operation_id,changes:{workflow,events}};
  return {affected_ids:impacted,update_request:op,warning:'Proposal only. Save update_request and apply with update; retry that exact saved request.'};
}
export function upgradeWorkflow(dir,id,destination){
  const old=readCore(dir,id);if(old.dossier.schema_version!=='1.0.0')throw Error('Upgrade expects schema 1.0.0');
  const target=safeDirectory(destination,true),bundle=target+'.upgrade-export-'+randomUUID(),staging=target+'.upgrade-staging-'+randomUUID();
  exportCore(dir,id,bundle);restoreCore(bundle,id,staging);
  const original=regularFile(path.join(staging,'project.json')),data=JSON.parse(original);
  checkModel(data);if(data.schema_version!=='1.0.0')throw Error('Export snapshot no longer has schema 1.0.0');
  data.schema_version='1.1.0';data.workflow=emptyWorkflow();
  const artifactId='pre-workflow-'+randomUUID();const location='files/'+artifactId+'.json';
  data.artifacts.push({id:artifactId,version:'1.0.0',storage:'local',location,availability:'available',sha256:sha(original)});checkModel(data);
  fs.mkdirSync(path.join(staging,'files'),{recursive:true});writeExclusive(path.join(staging,location),original);
  const pending=path.join(staging,'upgraded.json');writeExclusive(pending,bytesFor(data));fs.renameSync(pending,path.join(staging,'project.json'));fs.renameSync(staging,target);
  return {...readCore(target,id),retained_export:bundle,warning:'Workflow annotations are empty, not inferred; original project unchanged'};
}
