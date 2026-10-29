import Ajv2020 from 'ajv/dist/2020.js';import {readCore,sha,bytesFor} from './store.mjs';
const text={type:'string',minLength:1,maxLength:4000,pattern:'\\S'},id={type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'},nullable=s=>({anyOf:[s,{type:'null'}]}),count={type:'integer',minimum:0,maximum:Number.MAX_SAFE_INTEGER};
const validate=new Ajv2020({strict:true,allErrors:true,useDefaults:false,coerceTypes:false,removeAdditional:false}).compile({type:'object',additionalProperties:false,required:['project_id','task_id','scope','started_at','finished_at','state','limits','events','usage','measurement_source','partial_result','next_step'],properties:{project_id:id,task_id:id,scope:text,started_at:text,finished_at:nullable(text),state:{enum:['in_progress','stopped','completed']},limits:{type:'object',additionalProperties:false,required:['elapsed_ms','tool_calls','repair_attempts'],properties:{elapsed_ms:{type:'integer',minimum:1,maximum:3600000},tool_calls:{type:'integer',minimum:1,maximum:1000},repair_attempts:{type:'integer',minimum:0,maximum:5}}},events:{type:'array',maxItems:1000,items:{type:'object',additionalProperties:false,required:['id','at','type','outcome','note','related_event_id','receipt_ref'],properties:{id,at:text,type:{enum:['tool','repair','inspection']},outcome:{enum:['succeeded','failed','ambiguous','missing_tool','source_unavailable','truncated']},note:text,related_event_id:nullable(id),receipt_ref:nullable(text)}}},usage:{type:'object',additionalProperties:false,required:['input_tokens','output_tokens','cost_eur'],properties:{input_tokens:nullable(count),output_tokens:nullable(count),cost_eur:nullable({type:'number',minimum:0,maximum:1000000})}},measurement_source:text,partial_result:text,next_step:nullable(text)}});
const stamp=s=>{if(typeof s!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(s)||!Number.isFinite(Date.parse(s))||new Date(s).toISOString()!==s)throw Error('Timestamp must be a real UTC ISO millisecond timestamp');return Date.parse(s);};
export function evaluateRun(ledger,{now=Date.now()}={}){
  if(Buffer.byteLength(JSON.stringify(ledger)??'')>4*1024*1024)throw Error('Run ledger exceeds size limit');
  if(!validate(ledger))throw Error('Invalid run ledger: '+validate.errors.map(e=>e.instancePath+' '+e.message).join('; '));
  if(!Number.isSafeInteger(now)||now<0)throw Error('Invalid observation clock');const start=stamp(ledger.started_at),finish=ledger.finished_at===null?null:stamp(ledger.finished_at);
  if(start>now||finish!==null&&(finish<start||finish>now))throw Error('Future or reversed run clock');
  if((ledger.state==='in_progress')!==(finish===null))throw Error('Stopped/completed run needs finish time; active run must not have one');
  if(ledger.state!=='completed'&&!ledger.next_step)throw Error('Unfinished run requires a concrete next step');
  const seen=new Set(),issues=new Map();let previous=start,repairs=0;
  for(const e of ledger.events){const at=stamp(e.at);if(at<previous||at>(finish??now))throw Error('Event clock outside ordered run');previous=at;if(seen.has(e.id))throw Error('Duplicate event');
    if(e.related_event_id!==null&&!seen.has(e.related_event_id))throw Error('Related event must already exist');
    if(e.type==='repair'){repairs++;if([...issues.values()].some(x=>x.outcome==='ambiguous'))throw Error('Inspect ambiguous outcome before any retry');}
    if(e.related_event_id!==null&&e.outcome==='succeeded'){
      if(!['repair','inspection'].includes(e.type)||!issues.has(e.related_event_id))throw Error('Resolution must target an open issue');
      if(!e.receipt_ref)throw Error('Resolution requires an actual receipt or inspected evidence reference');issues.delete(e.related_event_id);
    }
    if(e.outcome!=='succeeded')issues.set(e.id,e);seen.add(e.id);
  }
  if(ledger.state==='completed'&&issues.size)throw Error('Cannot claim completed with unresolved execution issues');
  const elapsed_ms=(finish??now)-start,tool_calls=ledger.events.length,limits_hit=[];
  if(elapsed_ms>=ledger.limits.elapsed_ms)limits_hit.push('elapsed_ms');if(tool_calls>=ledger.limits.tool_calls)limits_hit.push('tool_calls');
  if(repairs>ledger.limits.repair_attempts||issues.size&&repairs>=ledger.limits.repair_attempts)limits_hit.push('repair_attempts');
  const unresolved=[...issues.values()];const disposition=ledger.state==='completed'?'completed':ledger.state==='stopped'||limits_hit.length?'stop':unresolved.some(e=>e.outcome==='ambiguous')?'reconcile':unresolved.some(e=>e.outcome==='missing_tool')?'stop':issues.size?'repair_or_checkpoint':'continue';
  return {disposition,elapsed_ms,tool_calls,repair_attempts:repairs,limits_hit,unresolved,remaining:{elapsed_ms:Math.max(0,ledger.limits.elapsed_ms-elapsed_ms),tool_calls:Math.max(0,ledger.limits.tool_calls-tool_calls),repair_attempts:Math.max(0,ledger.limits.repair_attempts-repairs)},usage:structuredClone(ledger.usage),next_step:ledger.next_step,partial_result:ledger.partial_result,measurement_source:ledger.measurement_source,limitations:['Projection from supplied events, not an automatic tool interceptor or proof events occurred','Wall-clock elapsed time is not active human time; clock changes and missing events limit measurement','Unknown tokens and euros remain unknown; no phase budget or spending permission inferred','No action, save or background monitoring is executed by this check']};
}
export function prepareRunCheckpoint(dir,request,{now=Date.now()}={}){
  if(!request||Object.keys(request).sort().join(',')!=='expected_revision,ledger,operation_id,project_id'||!Number.isInteger(request.expected_revision)||request.expected_revision<1||!/^[a-z0-9][a-z0-9-]{0,63}$/.test(request.operation_id))throw Error('Invalid checkpoint request');
  const state=readCore(dir,request.project_id),d=state.dossier;if(d.revision!==request.expected_revision)throw Error('Revision conflict');if(d.operations.some(o=>o.id===request.operation_id))throw Error('Operation already recorded; retry saved attachment request');
  const evaluation=evaluateRun(request.ledger,{now});if(request.ledger.project_id!==d.project_id||![...d.tasks,...d.checks].some(x=>x.id===request.ledger.task_id))throw Error('Checkpoint project/task identity mismatch');
  const artifactId='run-'+sha(request.operation_id).slice(0,40),content=bytesFor({schema_version:'sk30-run-v1',basis_revision:d.revision,basis_sha256:state.sha256,observed_at:new Date(now).toISOString(),ledger:request.ledger,evaluation}).toString('utf8');
  if(Buffer.byteLength(content)>4*1024*1024)throw Error('Checkpoint exceeds size limit');
  const artifact={id:artifactId,version:'1',storage:'local',location:'files/'+artifactId+'.json',availability:'available',sha256:sha(content)},event={id:artifactId+'-event',type:'run-checkpoint',at:new Date(now).toISOString(),description:'Execution ledger checkpoint; reported events, not new business validation',subject_ids:[request.ledger.task_id,artifactId]};
  return {content,update_request:{project_id:d.project_id,expected_revision:d.revision,operation_id:request.operation_id,changes:{artifacts:[...d.artifacts,artifact],events:[...d.events,event]}},warning:'Read-only proposal, not saved. Preserve exact UTF-8 content and update_request; attach through core helper and read back. An unknown side effect still requires reconciliation before retry.'};
}
