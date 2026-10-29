import Ajv2020 from 'ajv/dist/2020.js';
import {regularFile,readCore,sha} from './store.mjs';
import {affected} from './dependencies.mjs';
const text={type:'string',minLength:1,maxLength:2000,pattern:'\\S'},id={type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'};
const validate=new Ajv2020({strict:true,allErrors:true,coerceTypes:false,useDefaults:false}).compile({type:'object',additionalProperties:false,required:['format','notices'],properties:{format:{const:'startkompas-module-notices-v1'},notices:{type:'array',maxItems:1000,items:{type:'object',additionalProperties:false,required:['id','module_id','version','resource','sha256','status','issued_on','reason','next_step','reference'],properties:{id,module_id:id,version:text,resource:{enum:['modules/market-offer.md','modules/pilot-conditions.md','modules/pilot-package.md']},sha256:{type:'string',pattern:'^[a-f0-9]{64}$'},status:{enum:['restricted','withdrawn']},issued_on:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'},reason:text,next_step:text,reference:text}}}}});
export function checkNotices(policy){
  if(!validate(policy))throw Error('Invalid module notice policy');
  const ids=new Set();for(const n of policy.notices){if(ids.has(n.id))throw Error('Duplicate module notice');ids.add(n.id);if(new Date(n.issued_on+'T00:00:00Z').toISOString().slice(0,10)!==n.issued_on)throw Error('Invalid notice date');}
  return policy;
}
export function loadNotices(){return checkNotices(JSON.parse(regularFile(new URL('../modules/module-notices.json',import.meta.url))));}
export function moduleAvailability(resource,bytes,policy=loadNotices()){
  checkNotices(policy);const fingerprint=sha(bytes),notices=policy.notices.filter(n=>n.resource===resource&&n.sha256===fingerprint);
  return {resource,sha256:fingerprint,content_allowed:!notices.length,status:notices.some(n=>n.status==='withdrawn')?'withdrawn':notices.length?'restricted':'no_matching_notice',notices:structuredClone(notices),limitations:['No matching notice is not approval or proof of safety','Local packaged notices only; no network monitoring or automatic update','Notice provenance must be reviewed by the package owner; this does not authenticate an external advisory']};
}
export function readModule(resource,policy=loadNotices()){
  if(!['modules/market-offer.md','modules/pilot-conditions.md','modules/pilot-package.md'].includes(resource))throw Error('Unknown module resource');
  const bytes=regularFile(new URL('../'+resource,import.meta.url)),availability=moduleAvailability(resource,bytes,policy);
  return {...availability,...(availability.content_allowed?{content:bytes.toString('utf8')}:{})};
}
export function prepareModuleReview(dir,request,policy=loadNotices()){
  checkNotices(policy);
  if(!request||Object.keys(request).sort().join(',')!=='expected_revision,notice_id,operation_id,project_id'||!Number.isSafeInteger(request.expected_revision)||request.expected_revision<1||typeof request.operation_id!=='string'||!/^[a-z0-9][a-z0-9-]{0,63}$/.test(request.operation_id))throw Error('Invalid module review request');
  const notice=policy.notices.find(n=>n.id===request.notice_id);if(!notice)throw Error('Unknown module notice');
  const {dossier:d}=readCore(dir,request.project_id);
  if(!d.workflow)throw Error('Module review requires explicit schema 1.1 upgrade');
  if(d.revision!==request.expected_revision)throw Error('Revision conflict');
  if(d.operations.some(o=>o.id===request.operation_id))throw Error('Operation already recorded; retry original saved update request');
  if(!d.module_versions.some(m=>m.id===notice.module_id&&m.version===notice.version))throw Error('Notice does not match a recorded module version');
  const bindings=d.workflow.modules.filter(m=>m.module_id===notice.module_id).map(m=>m.record_id);
  if(!bindings.length)throw Error('No declared record bindings for this module; inspect project coverage before updating');
  const impacted=affected(d,bindings),eventId='module-notice-'+sha(request.operation_id).slice(0,32);
  const event={id:eventId,type:'module-review-required',at:notice.issued_on,description:'Notice '+notice.id+' ('+notice.status+'): '+notice.reason,subject_ids:bindings};
  return {notice:structuredClone(notice),affected_ids:impacted,update_request:{project_id:d.project_id,expected_revision:d.revision,operation_id:request.operation_id,changes:{workflow:{...d.workflow,invalidated_ids:[...new Set([...d.workflow.invalidated_ids,...impacted])]},events:[...d.events,event]}},warning:'Read-only proposal. Save and apply the exact update_request through core update. Only declared matching module/version bindings are covered; omitted bindings remain unknown. Retained historical evidence is not erased and removing a notice never clears review flags.'};
}
