import Ajv2020 from 'ajv/dist/2020.js';
import {readCore,damagedArtifacts} from './store.mjs';
import {applyInvalidation} from './change-rules.mjs';
import {records,dependencyGraph} from './dependencies.mjs';
const id={type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'},text={type:'string',minLength:1,maxLength:2000,pattern:'\\S'};
const validate=new Ajv2020({strict:true,allErrors:true,useDefaults:false,coerceTypes:false,removeAdditional:false}).compile({type:'object',additionalProperties:false,required:['project_id','source_revision','language','milestone_id','action_ids','urgent','questions'],properties:{project_id:id,source_revision:{type:'integer',minimum:1},language:{enum:['nl','en']},milestone_id:id,action_ids:{type:'array',maxItems:100,uniqueItems:true,items:id},urgent:{type:'array',maxItems:1000,items:{type:'object',additionalProperties:false,required:['record_id','reason'],properties:{record_id:id,reason:text}}},questions:{type:'array',maxItems:2,items:{type:'object',additionalProperties:false,required:['text','why','needed_for'],properties:{text,why:text,needed_for:id}}}}});
export function dailyView(dir,request){
  if(!validate(request))throw Error('Invalid daily view request: '+validate.errors.map(e=>e.instancePath+' '+e.message).join('; '));
  const state=readCore(dir,request.project_id);if(state.dossier.revision!==request.source_revision)throw Error('Historical selection: project changed; reread and refresh the proposed daily view');
  const d=applyInvalidation(state.dossier,structuredClone(state.dossier),damagedArtifacts(state.directory,state.dossier)),index=records(d),graph=dependencyGraph(d);
  const ref=(id,groups)=>{const r=index.get(id);if(!r||!groups.includes(r.group))throw Error('Missing or unsuitable daily view record: '+id);return r;};
  const concise=r=>({id:r.id,title:r.title,progress:r.progress,substantiation:r.substantiation,applicability:r.applicability,historical:d.workflow?.invalidated_ids.includes(r.id)||false});
  const milestone=concise(ref(request.milestone_id,['tasks']));
  const proposed=request.action_ids.map(id=>ref(id,['tasks','checks']));if(proposed.some(r=>r.progress==='done'||r.applicability==='not_applicable'))throw Error('Ordinary action must be unfinished and not explicitly inapplicable');
  const seen=new Set(),urgent=request.urgent.map(x=>{if(seen.has(x.record_id))throw Error('Duplicate urgent record');seen.add(x.record_id);return {...concise(ref(x.record_id,['tasks','checks'])),reason:x.reason};});
  for(const q of request.questions)ref(q.needed_for,['tasks','checks']);
  const selected=[...new Set([request.milestone_id,...request.action_ids,...request.urgent.map(x=>x.record_id),...request.questions.map(x=>x.needed_for)])];
  const details=selected.map(id=>{const r=index.get(id);return {record_id:id,scope:r.scope??null,period:r.period??null,basis_kind:r.basis_kind,dependencies:[...graph.edges.get(id)].map(([record_id,reason])=>({record_id,reason})),evidence:(r.evidence_ids||[]).map(eid=>({...index.get(eid),artifact:index.get(index.get(eid).artifact_id)})),missing:(r.evidence_ids||[]).length?'Evidence is recorded; substantive correctness and scope still require review':'No evidence recorded',historical:d.workflow?.invalidated_ids.includes(id)||false};});
  return {project_id:d.project_id,revision:d.revision,language:request.language,name:d.name,milestone,actions:proposed.slice(0,3).map(concise),deferred_action_count:Math.max(0,proposed.length-3),urgent,questions:structuredClone(request.questions),details,limitations:['Selection, urgency and decisive questions are supplied judgments, not automatically discovered facts','All declared urgent blockers are shown; omitted declarations cannot be detected','Read-only view; evidence records are claims, not a new review or execution']};
}
const words={en:{milestone:'Milestone',actions:'Next actions',urgent:'Urgent blockers',questions:'Decisive questions',why:'Why',more:'Other proposed actions retained for later',history:'Historical — review again',none:'None declared; completeness is not automatically established',scope:'Scope',period:'Period',basis:'Basis',missing:'No evidence recorded',evidence:'Recorded evidence; not a new review',details:'Evidence details',note:'Urgency and selection are supplied judgments. This view executes no actions.'}};
// Treat stored titles and reasons as text, not Markdown instructions, links or markup.
const safe=v=>String(v??'unknown').replace(/[\r\n\t]/g,' ').replace(/[\\`*_{}[\]()#+.!|<>]/g,c=>'\\'+c);
export function renderDaily(view,{details=false}={}){
  const w=words.en;if(!['en','nl'].includes(view.language))throw Error('Unsupported daily view language');const label=x=>w[x]||x;
  const status=r=>[label(r.progress),label(r.substantiation),label(r.applicability),r.historical?w.history:null].filter(Boolean).map(safe).join('; ');
  const lines=[safe(view.name),'',w.milestone+': '+safe(view.milestone.title)+' — '+status(view.milestone),'',w.actions+':',...view.actions.map(x=>'- '+safe(x.title)+' — '+status(x))];
  if(view.deferred_action_count)lines.push(w.more+': '+view.deferred_action_count);
  lines.push('',w.urgent+':',...(view.urgent.length?view.urgent.map(x=>'- '+safe(x.title)+': '+safe(x.reason)+' — '+status(x)):[w.none]));
  if(view.questions.length)lines.push('',w.questions+':',...view.questions.map(q=>'- '+safe(q.text)+' '+w.why+': '+safe(q.why)));
  if(details){lines.push('',w.details+':');for(const d of view.details){lines.push('- '+safe(d.record_id)+': '+w.scope+' '+safe(d.scope??label('unknown'))+'; '+w.period+' '+safe(d.period??label('unknown'))+'; '+w.basis+' '+safe(d.basis_kind));for(const dep of d.dependencies)lines.push('  - '+w.why+': '+safe(dep.reason)+' ('+safe(dep.record_id)+')');if(!d.evidence.length)lines.push('  - '+w.missing);for(const e of d.evidence)lines.push('  - '+w.evidence+': '+safe(e.result)+'; '+safe(e.scope)+'; '+safe(e.date)+'; '+safe(e.reviewer)+'; '+safe(e.environment)+'; '+safe(e.artifact?.location));if(d.historical)lines.push('  - '+w.history);}}
  lines.push('',w.note);return lines.join('\n')+'\n';
}
