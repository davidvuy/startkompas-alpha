import Ajv2020 from 'ajv/dist/2020.js';
import {createHash} from 'node:crypto';
import {readCore,damagedArtifacts} from './store.mjs';
import {applyInvalidation} from './change-rules.mjs';
import {records} from './dependencies.mjs';
const id={type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'},text={type:'string',minLength:1,maxLength:2000,pattern:'\\S'};
const ajv=new Ajv2020({strict:true,allErrors:true,coerceTypes:false,useDefaults:false,removeAdditional:false});
const common={project_id:id,source_revision:{type:'integer',minimum:1}};
const planSchema=ajv.compile({type:'object',additionalProperties:false,required:['project_id','source_revision','mode','task_id','revisit_deferred','candidates'],properties:{...common,mode:{enum:['task','ordinary_question']},task_id:id,revisit_deferred:{type:'boolean'},candidates:{type:'array',maxItems:100,items:{type:'object',additionalProperties:false,required:['key','text','why','needed_for'],properties:{key:text,text,why:text,needed_for:id}}}}});
const answerSchema=ajv.compile({type:'object',additionalProperties:false,required:['project_id','source_revision','operation_id','at','key','value','source_id'],properties:{...common,operation_id:id,at:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'},key:text,value:{anyOf:[{type:'string',maxLength:4000},{type:'number'},{type:'boolean'},{type:'null'}]},source_id:id,source:{type:'object',additionalProperties:false,required:['title','location','scope'],properties:{title:text,location:text,scope:text}}}});
function check(validate,request){if(!validate(request))throw Error('Invalid intake request: '+validate.errors.map(e=>e.instancePath+' '+e.message).join('; '));}
function state(dir,request){const s=readCore(dir,request.project_id);if(s.dossier.revision!==request.source_revision)throw Error('Revision conflict; reread project');return s;}
function activeTask(index,id){const r=index.get(id);if(!r||!['tasks','checks'].includes(r.group))throw Error('Missing intake task: '+id);return r;}
const usable=r=>r.value!==null&&!(typeof r.value==='string'&&!r.value.trim())&&['reported','observed'].includes(r.assertion);
export function planIntake(dir,request){
 check(planSchema,request);const s=state(dir,request),d=applyInvalidation(s.dossier,structuredClone(s.dossier),damagedArtifacts(s.directory,s.dossier)),index=records(d);
 const task=activeTask(index,request.task_id);
 const keys=new Set();for(const c of request.candidates){if(keys.has(c.key))throw Error('Duplicate intake key');keys.add(c.key);activeTask(index,c.needed_for);}
 const results=request.candidates.map(c=>{
  const matches=d.profile.filter(r=>r.key===c.key),ids=matches.map(r=>r.id);
  let status='missing';
  if(request.mode==='ordinary_question'||task.progress==='done'||task.applicability==='not_applicable'||c.needed_for!==request.task_id)status='not_needed';
  else if(matches.length>1)status='conflict';
  else if(matches.length===1){const r=matches[0];if(r.source_ids.some(id=>d.workflow?.invalidated_ids.includes(id)))status='review';else if(usable(r))status='known';else if(r.assertion==='inferred')status='confirm_inference';else if(!request.revisit_deferred&&d.events.some(e=>e.type==='intake-deferred'&&e.subject_ids.includes(r.id)))status='deferred';}
  return {...c,status,record_ids:ids,dependent_review_required:ids.some(id=>d.workflow?.invalidated_ids.includes(id)),answers:matches.map(r=>({id:r.id,value:r.value,assertion:r.assertion,source_ids:r.source_ids}))};
 });
 const unresolved=results.filter(r=>['missing','conflict','review','confirm_inference'].includes(r.status));
 return {project_id:d.project_id,revision:d.revision,mode:request.mode,question:unresolved[0]??null,remaining_question_count:Math.max(0,unresolved.length-1),results,limitations:['Candidate relevance and key mapping are supplied judgments; no semantic discovery or approval','Deferred unknowns remain unknown and do not make dependent work executable','Read-only; existing assertions retain their original provenance']};
}
export function prepareIntakeAnswer(dir,request){
 check(answerSchema,request);if(new Date(request.at+'T00:00:00Z').toISOString().slice(0,10)!==request.at)throw Error('Invalid calendar date');
 if(typeof request.value==='string'&&!request.value.trim())throw Error('Use null for an unknown answer');
 const s=state(dir,request),d=s.dossier,index=records(d);
 if(d.operations.some(o=>o.id===request.operation_id))throw Error('Operation already recorded; retry the original saved update request');
 const existingSource=index.get(request.source_id);
 if(request.source&&existingSource)throw Error('New answer source ID already exists; omit source to reuse an existing source');
 if(!request.source&&existingSource?.group!=='sources')throw Error('Answer requires an existing source record or explicit new source');
 const sources=request.source?[...d.sources,{id:request.source_id,...request.source,accessed_at:request.at}]:null;
 const matches=d.profile.filter(r=>r.key===request.key);if(matches.length>1)throw Error('Conflicting profile records require explicit reconciliation');
 const suffix=createHash('sha256').update(request.operation_id).digest('hex').slice(0,32),recordId=matches[0]?.id??'intake-'+suffix,eventId='intake-event-'+suffix;
 if((!matches.length&&index.has(recordId))||index.has(eventId))throw Error('Generated record ID already exists');
 const record={id:recordId,key:request.key,value:request.value,assertion:request.value===null?'unknown':'reported',source_ids:[request.source_id]};
 const profile=matches.length?d.profile.map(r=>r.id===recordId?record:r):[...d.profile,record];
 return {project_id:d.project_id,expected_revision:d.revision,operation_id:request.operation_id,changes:{...(sources?{sources}:{}),profile,events:[...d.events,{id:eventId,type:request.value===null?'intake-deferred':'intake-answer',at:request.at,description:request.value===null?'User reports answer unknown; defer repeated intake until explicitly revisited':'User-reported intake answer; not independently verified',subject_ids:[recordId,request.source_id]}]}};
}

const safe=value=>String(value).replace(/[\r\n\t]/g,' ').replace(/[\\`*_{}[\]()#+.!|<>]/g,c=>'\\'+c);
export function renderIntake(result,language='en'){
 const words={en:{question:'Next question',why:'Why',none:'No new intake question needed for this step.',known:'Existing answer reused',deferred:'Still unknown; question deferred',review:'Source changed; review the answer',dependent:'Dependent work may need review',inferred:'This answer was inferred; confirmation needed'}};
 const w=words.en;if(!['en','nl'].includes(language))throw Error('Unsupported intake language');
 const lines=result.question?[w.question+': '+safe(result.question.text),w.why+': '+safe(result.question.why)]:[w.none];
 for(const r of result.results){if(r.status==='known')lines.push(w.known+': '+safe(r.answers[0].value));if(r.status==='deferred')lines.push(w.deferred+': '+safe(r.text));if(r.status==='review')lines.push(w.review+': '+safe(r.text));if(r.status==='confirm_inference')lines.push(w.inferred);if(r.dependent_review_required)lines.push(w.dependent);}
 return lines.join('\n')+'\n';
}
