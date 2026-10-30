import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {readCore,damagedArtifacts,safeDirectory,writeExclusive,bytesFor,sha,updateCore,attachFile} from './store.mjs';
import {applyInvalidation} from './change-rules.mjs';
import {affected,records,dependencyGraph} from './dependencies.mjs';
import {checkModel} from './model.mjs';
import {readBusinessBrief,renderBusinessBrief} from './business-brief.mjs';
import {cleanText} from './project-view.mjs';
import {exportCore,restoreCore} from './transfer.mjs';
import {planNext} from './workflow.mjs';

const text=(s,label)=>{if(typeof s!=='string'||!s.trim()||s.length>4000)throw Error(label+' must contain 1–4000 characters');return s.trim();};
export const operationId=()=> 'guided-'+randomUUID();
function current(dir,id){const s=readCore(dir,id);return {...s,data:applyInvalidation(s.dossier,structuredClone(s.dossier),damagedArtifacts(s.directory,s.dossier))};}

export function workspaceView(dir,id){
 const s=current(dir,id),d=s.data,index=records(d),graph=dependencyGraph(d),invalid=new Set(d.workflow?.invalidated_ids??[]);
 const eligible=r=>r.progress!=='done'&&r.progress!=='deferred'&&r.applicability!=='not_applicable';
 const unresolved=r=>invalid.has(r.id)||r.applicability==='unknown'||r.progress!=='done'||r.substantiation!=='supported';
 const blockers=[...invalid].map(id=>({id,reason:'Stored basis changed or artifact is damaged; review before reuse'}));
 const actions=d.tasks.filter(eligible).map(t=>{
  const queue=[...graph.edges.get(t.id).keys()],seen=new Set();
  for(let n=0;n<queue.length;n++){const k=queue[n];if(seen.has(k))continue;seen.add(k);queue.push(...graph.edges.get(k).keys());}
  const blocked=[...seen].filter(k=>{const r=index.get(k);return invalid.has(k)||(['tasks','checks'].includes(r.group)&&r.applicability!=='not_applicable'&&unresolved(r));});
  const material=d.workflow?planNext(dir,id,{kind:'material_choice',target_ids:[t.id]}):{blockers:[]};
  return {id:t.id,title:t.title,progress:t.progress,blocked_by:[...new Set([...blocked,...material.blockers.map(b=>b.record_id)])],requires_review:invalid.has(t.id)};
 }).sort((a,b)=>Number(b.id===d.active_task_id)-Number(a.id===d.active_task_id));
 const drafts=d.events.filter(e=>e.type==='business-brief-draft').map(e=>e.subject_ids[0]).filter((id,n,a)=>a.indexOf(id)===n).map(artifactId=>{
  try{const b=readBusinessBrief(dir,id,artifactId);return {id:artifactId,kind:b.request.kind,version:b.version,status:b.requires_review?'review_required':'draft',historical:b.successor_ids.length>0,unknown_fields:b.fields.filter(f=>f.value===null).map(f=>f.key)};}
  catch{return {id:artifactId,status:'unavailable_or_invalid',historical:false};}
 });
 const assumptions=d.assumptions.map(a=>({...a,requires_review:invalid.has(a.id),dependent_count:affected(d,[a.id]).length-1})).sort((a,b)=>b.dependent_count-a.dependent_count);
 const checks=d.checks.filter(c=>c.applicability!=='not_applicable'&&unresolved(c));
 const next=blockers.length?{kind:'review',record_id:blockers[0].id,reason:blockers[0].reason}:checks.length?{kind:'check',record_id:checks[0].id,reason:'Unresolved recorded check; review its applicability and evidence'}:actions.find(a=>!a.requires_review&&!a.blocked_by.length)?{kind:'task',record_id:actions.find(a=>!a.requires_review&&!a.blocked_by.length).id,reason:'First eligible recorded task, active task preferred'}:assumptions.length?{kind:'assumption',record_id:assumptions[0].id,reason:'Review the assumption with the most declared dependents'}:{kind:'draft',record_id:null,reason:'Prepare an offer or interview guide; no next task has been recorded'};
 if(readCore(dir,id).sha256!==s.sha256)throw Error('Project changed while preparing workspace view');
 return {project_id:id,name:d.name,revision:d.revision,sha256:s.sha256,next,actions,blockers,checks,assumptions,drafts,decisions:d.decisions.filter(x=>x.status==='active'),limitations:['Suggested order from recorded data, not an assessment of real-world urgency or readiness.','Every assumption remains a claim; a source or interview note is not automatic validation.','Draft status is never qualified professional approval.']};
}

export function renderWorkspace(v){
 const lines=['# '+cleanText(v.name),'Revision: '+v.revision,'','## Suggested next action',cleanText(v.next.kind)+': '+cleanText(v.next.record_id??'new draft'),'Reason: '+cleanText(v.next.reason),'','## Review before reuse',...v.blockers.map(x=>'- '+cleanText(x.id)+': '+cleanText(x.reason))];
 if(!v.blockers.length)lines.push('No recorded invalidations; this is not proof that everything is correct.');
 lines.push('','## Open checks',...v.checks.map(x=>'- '+cleanText(x.id)+': '+cleanText(x.title)+' ['+x.progress+'; '+x.substantiation+']'),'','## Tasks',...v.actions.map(x=>'- '+cleanText(x.id)+': '+cleanText(x.title)+(x.blocked_by.length?' — prerequisites: '+x.blocked_by.map(cleanText).join(', '):'')),'','## Assumptions to investigate',...v.assumptions.map(x=>'- '+cleanText(x.id)+': '+cleanText(x.text)+' ['+x.assertion+'; dependents: '+x.dependent_count+']'),'','## Saved drafts',...v.drafts.map(x=>'- '+cleanText(x.id)+': '+(x.kind??'unknown')+' v'+(x.version??'?')+' ['+x.status+(x.historical?'; historical':'')+']'+(x.unknown_fields?.length?' — unknown: '+x.unknown_fields.join(', '):'')),'',...v.limitations);
 return lines.join('\n')+'\n';
}

export function impactView(dir,id,recordId){const {data:d}=current(dir,id),index=records(d);return {project_id:id,revision:d.revision,changed_record:recordId,affected:affected(d,[recordId]).map(k=>({id:k,group:index.get(k).group,text:index.get(k).title??index.get(k).text??k})),limitation:'Declared dependency reachability only; no records are modified and unrecorded dependencies are unknown.'};}

export function prepareRecord(dir,id,expectedRevision,kind,input){
 const {dossier:d}=readCore(dir,id);if(d.revision!==expectedRevision)throw Error('Revision conflict; reread project');
 if(!d.workflow)throw Error('Guided records require schema 1.1');
 const op=operationId(),recordId=kind+'-'+randomUUID(),changes={};
 const links=Array.isArray(input.basis_ids)?input.basis_ids:[];
 const index=records(d);if(links.some(k=>!index.has(k)||index.get(k).group==='events'))throw Error('Select existing non-event basis records');
 if(kind==='assumption')changes.assumptions=[...d.assumptions,{id:recordId,text:text(input.text,'Assumption'),assertion:'unknown',source_ids:[]}];
 else if(kind==='decision')changes.decisions=[...d.decisions,{id:recordId,text:text(input.text,'Decision'),reason:text(input.reason,'Reason'),basis_ids:links,status:'active',supersedes:null}];
 else if(kind==='observation'){
  const sourceId='source-'+randomUUID();
  changes.sources=[...d.sources,{id:sourceId,title:text(input.title,'Participant code / source title'),location:text(input.location,'Private source reference'),scope:text(input.scope,'Scope'),accessed_at:text(input.date,'Observation date')}];
  if(!/^\d{4}-\d{2}-\d{2}$/.test(input.date)||Number.isNaN(Date.parse(input.date))||new Date(input.date).toISOString().slice(0,10)!==input.date)throw Error('Use a real YYYY-MM-DD observation date');
  changes.facts=[...d.facts,{id:recordId,text:text(input.text,'Observation'),assertion:'reported',source_ids:[sourceId]}];
  // The note depends on its selected context; it does not convert that context into proof.
  changes.workflow={...d.workflow,links:[...d.workflow.links,...links.map(k=>({dependent_id:recordId,prerequisite_id:k,reason:'Reported observation concerns this recorded context; not independent validation'}))]};
 }else if(kind==='task'){
  changes.tasks=[...d.tasks,{id:recordId,title:text(input.text,'Task'),applicability:'unknown',progress:'open',substantiation:'unreviewed',basis_kind:'own_requirement',evidence_ids:[],period:null,depends_on:links.filter(k=>['tasks','checks'].includes(index.get(k).group))}];
  changes.workflow={...d.workflow,links:[...d.workflow.links,...links.filter(k=>!['tasks','checks'].includes(index.get(k).group)).map(k=>({dependent_id:recordId,prerequisite_id:k,reason:'Task uses this selected context'}))]};
 }
 else throw Error('Unknown guided record type');
 const request={project_id:id,expected_revision:d.revision,operation_id:op,changes};checkModel({...d,...changes});
 return {record_id:recordId,update_request:request};
}

export function saveGuided(dir,prepared,newBundle){
 const request=prepared.update_request,s=readCore(dir,request.project_id);
 if(s.dossier.revision!==request.expected_revision)throw Error('Revision conflict; reread project before saving');
 const target=safeDirectory(newBundle,true),relative=path.relative(s.directory,target);
 if(!relative||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Retry bundle must be outside the project');
 fs.mkdirSync(target);
 writeExclusive(path.join(target,'request.json'),bytesFor(request));
 let receipt;
 if(typeof prepared.content==='string'){
  writeExclusive(path.join(target,'content.json'),prepared.content);
  receipt=attachFile(dir,request,path.join(target,'content.json'));
 }else receipt=updateCore(dir,request);
 writeExclusive(path.join(target,'receipt.json'),bytesFor(receipt));
 return {...receipt,retry_bundle:target,note:'Keep this exact request for retries. If saving was interrupted, inspect the project and retry the saved request; do not create a new operation.'};
}

const allowedSections=['summary','tasks','assumptions','decisions','drafts'];
export function reportPreview(dir,id,sections=['summary','tasks']){
 if(!Array.isArray(sections)||!sections.length||new Set(sections).size!==sections.length||sections.some(s=>!allowedSections.includes(s)))throw Error('Choose unique report sections: '+allowedSections.join(', '));
 const state=readCore(dir,id),v=workspaceView(dir,id);
 if(state.dossier.revision!==v.revision)throw Error('Project changed while preparing report');
 const lines=['# '+cleanText(v.name),'Project: '+id+' · Revision: '+v.revision,'','Private working report. Inspect before sharing. Drafts and reported claims are not independent validation.'];
 if(sections.includes('summary'))lines.push('','## Suggested next action',cleanText(v.next.record_id??'new draft')+': '+cleanText(v.next.reason));
 if(sections.includes('tasks'))lines.push('','## Tasks',...v.actions.map(x=>'- '+cleanText(x.title)+' ['+x.progress+']'+(x.blocked_by.length?' — prerequisites: '+x.blocked_by.map(cleanText).join(', '):'')));
 if(sections.includes('assumptions'))lines.push('','## Assumptions',...v.assumptions.map(x=>'- '+cleanText(x.text)+' ['+x.assertion+(x.requires_review?'; review required':'')+']'));
 if(sections.includes('decisions'))lines.push('','## Active decisions',...v.decisions.map(x=>'- '+cleanText(x.text)+' — '+cleanText(x.reason)+'; basis: '+x.basis_ids.map(cleanText).join(', ')));
 if(sections.includes('drafts'))for(const draft of v.drafts.filter(x=>!x.historical)){
  if(draft.status==='unavailable_or_invalid')throw Error('Cannot export an unreadable draft; repair or omit the drafts section');
  lines.push('','## Saved draft '+draft.id,renderBusinessBrief(dir,id,draft.id));
 }
 lines.push('','## Review warnings',...v.blockers.map(x=>'- '+cleanText(x.id)+': '+cleanText(x.reason)),'','This is a readable selection, not a backup. Attached files, full history and source locations are not bundled; selected text can still contain personal or confidential information.');
 const markdown=lines.join('\n')+'\n';
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed while preparing report');
 return {project_id:id,revision:v.revision,sections,bytes:Buffer.byteLength(markdown),confirmation_sha256:sha(markdown),markdown};
}

export function writeReport(dir,id,sections,expectedDigest,destination){
 const preview=reportPreview(dir,id,sections);if(!/^[a-f0-9]{64}$/.test(expectedDigest)||preview.confirmation_sha256!==expectedDigest)throw Error('Report changed or confirmation digest invalid; preview again');
 const target=path.resolve(destination);safeDirectory(path.dirname(target));
 const project=readCore(dir,id).directory,realParent=fs.realpathSync(path.dirname(target)),relative=path.relative(project,realParent);
 if(!relative||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Report must be outside the project');
 writeExclusive(path.join(realParent,path.basename(target)),preview.markdown);
 return {saved:target,revision:preview.revision,sha256:preview.confirmation_sha256,bytes:preview.bytes};
}

export function recoveryCheck(dir,id,newDirectory){
 const before=readCore(dir,id),target=safeDirectory(newDirectory,true),rel=path.relative(before.directory,target);
 if(!rel||(!rel.startsWith('..'+path.sep)&&rel!=='..'&&!path.isAbsolute(rel)))throw Error('Recovery check must be outside the project');
 fs.mkdirSync(target);
 const exported=exportCore(dir,id,path.join(target,'backup'));
 restoreCore(path.join(target,'backup'),id,path.join(target,'restored'));
 const restored=readCore(path.join(target,'restored'),id);
 if(restored.sha256!==before.sha256||readCore(dir,id).sha256!==before.sha256)throw Error('Project changed during recovery check; inspect saved copies');
 const result={project_id:id,revision:before.dossier.revision,canonical_hash_matches:true,verified_files:exported.manifest.files.length,unresolved_references:exported.manifest.references.length,original_unchanged:true,limitation:'Checks this export and restore only. External/missing references are not recovered. Keep these private copies secure; this is not full history or a power-loss test.'};
 writeExclusive(path.join(target,'result.json'),bytesFor(result));return result;
}

export function sourceReview(dir,id,asOf,maxAgeDays=90){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(asOf)||Number.isNaN(Date.parse(asOf))||new Date(asOf).toISOString().slice(0,10)!==asOf||!Number.isSafeInteger(maxAgeDays)||maxAgeDays<1||maxAgeDays>3650)throw Error('Use a real YYYY-MM-DD date and age threshold of 1–3650 days');
 const {dossier:d}=readCore(dir,id),today=Date.parse(asOf);
 return {project_id:id,revision:d.revision,as_of:asOf,max_age_days:maxAgeDays,sources:d.sources.map(s=>{
  const date=s.accessed_at,valid=typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date;
  const age=valid?Math.floor((today-Date.parse(date))/86400000):null;
  return {id:s.id,title:s.title,accessed_at:date,age_days:age,status:age===null?'date_unknown':age<0?'future_date':age>maxAgeDays?'review_age':'within_age_threshold'};
 }),limitation:'Age uses recorded dates and your chosen threshold. No source is fetched or declared correct/current.'};
}

export function journeyView(dir,id){
 const v=workspaceView(dir,id),kinds=['interview','alternatives','offer','pricing','pilot'];
 return {project_id:id,revision:v.revision,next:v.next,stages:kinds.map(kind=>({kind,saved_drafts:v.drafts.filter(d=>d.kind===kind&&!d.historical),command:['node','src/startkompas.mjs','workspace','draft',dir,id,kind],status:v.drafts.some(d=>d.kind===kind&&!d.historical)?'draft_exists_not_validated':'not_drafted'})),limitation:'Suggested planning sequence, not mandatory gates or a launch/compliance approval.'};
}

export function prepareTaskState(dir,id,expectedRevision,taskId,progress,reason){
 const {dossier:d}=readCore(dir,id);if(d.revision!==expectedRevision)throw Error('Revision conflict; reread project');
 if(!d.tasks.some(t=>t.id===taskId)||!['open','in_progress','deferred','done'].includes(progress))throw Error('Choose an existing task and valid progress');
 const request={project_id:id,expected_revision:expectedRevision,operation_id:operationId(),changes:{tasks:d.tasks.map(t=>t.id===taskId?{...t,progress}:t),events:[...d.events,{id:'progress-'+randomUUID(),type:'user-reported-progress',at:new Date().toISOString(),description:text(reason,'Progress reason'),subject_ids:[taskId]}]}};
 checkModel({...d,...request.changes});return {update_request:request};
}
