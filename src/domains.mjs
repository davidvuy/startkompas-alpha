import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import {readCore,regularFile,localFile,sha,bytesFor} from './store.mjs';
import {records} from './dependencies.mjs';
import {moduleAvailability} from './module-notices.mjs';

const catalogBytes=fs.readFileSync(new URL('../modules/domain-index.json',import.meta.url));
const catalog=JSON.parse(catalogBytes),catalogHash=sha(catalogBytes);
const schema=JSON.parse(fs.readFileSync(new URL('../schemas/domain-screen-request.schema.json',import.meta.url)));
const validate=new Ajv2020({strict:true,allErrors:true}).compile(schema);
export function domainIndex(){return structuredClone(catalog);}
export function domainDetail(id,policy){
  const entry=catalog.domains.find(x=>x.id===id);if(!entry)throw Error('Unknown domain ID');
  if(['modules/market-offer.md','modules/pilot-conditions.md'].includes(entry.detail_file)){
    const bytes=regularFile(new URL('../'+entry.detail_file,import.meta.url)),availability=moduleAvailability(entry.detail_file,bytes,policy);
    if(!availability.content_allowed)return {domain:structuredClone(entry),detail_loaded:false,availability,reason:'Module restricted or withdrawn; retain history and follow the notice next step'};
    return {domain:structuredClone(entry),detail_loaded:true,availability,content:bytes.toString('utf8'),reason:entry.detail_file==='modules/market-offer.md'?'Draft procedure loaded; not a qualified review or project assessment':'Research worksheet loaded; sensitive applicability conclusions and qualified review remain open'};
  }
  return {domain:structuredClone(entry),detail_loaded:false,reason:'No researched module exists; questions are not an assessment'};
}
function checkRequest(request,dossier){
  if(!validate(request))throw Error('Invalid screen request: '+validate.errors.map(e=>e.instancePath+' '+e.message).join('; '));
  if(request.project_id!==dossier.project_id)throw Error('Project identity mismatch');
  const ids=new Set(),known=records(dossier);
  for(const row of request.domains){
    if(ids.has(row.domain_id))throw Error('Duplicate domain');ids.add(row.domain_id);
    const questions=new Set();
    for(const a of row.answers){
      if(questions.has(a.question_id))throw Error('Duplicate answer');questions.add(a.question_id);
      if(a.answer!==null&&!a.source_ids.length)throw Error('Reported answer requires a source record; use null for unknown');
      for(const id of a.source_ids)if(!known.has(id))throw Error('Missing source record: '+id);
    }
  }
}
export function prepareScreen(dir,request){
  const {dossier:d,sha256:projectHash}=readCore(dir,request.project_id);checkRequest(request,d);
  if(d.revision!==request.expected_revision)throw Error('Revision conflict; reread before preparing');
  if(d.operations.some(o=>o.id===request.operation_id))throw Error('Operation already recorded; retry the original saved attachment request');
  const id='screen-'+sha(request.operation_id).slice(0,40);
  const coverage=catalog.domains.map(entry=>{
    const row=request.domains.find(x=>x.domain_id===entry.id);
    return {domain_id:entry.id,status:!row?'not_screened':row.answers.length===entry.questions.length?'questions_addressed':'partially_screened',unanswered:entry.questions.filter(q=>!row?.answers.some(a=>a.question_id===q.id)).map(q=>q.id),unknown:row?.answers.filter(a=>a.answer===null).map(a=>a.question_id)||[],content_review:'not_performed'};
  });
  const document={schema_version:'sk21-screen-v1',basis_sha256:projectHash,catalog_version:catalog.version,catalog_sha256:catalogHash,request:structuredClone(request),coverage,limitations:['Recorded statements and scope classification, not observed truth or qualified domain review','Coverage applies to this project revision and trigger only; a later change may require rescreening']};
  const content=bytesFor(document).toString('utf8');
  const artifact={id,version:'1',storage:'local',location:'files/'+id+'.json',availability:'available',sha256:sha(content)};
  const event={id:id+'-event',type:'domain-screen',at:request.at,description:'Declared domain screening for '+request.trigger+'; no substantive approval',subject_ids:[id]};
  return {content,update_request:{project_id:d.project_id,expected_revision:d.revision,operation_id:request.operation_id,changes:{artifacts:[...d.artifacts,artifact],events:[...d.events,event]}},warning:'Read-only proposal. Save content as exact UTF-8 bytes and update_request separately; apply with the existing attach command. Retry those exact saved files.'};
}
export function readScreens(dir,id){
  const {dossier:d,directory}=readCore(dir,id);
  const screens=d.events.filter(e=>e.type==='domain-screen').map(e=>{
    try{
      if(e.subject_ids.length!==1)throw Error('Screen event must reference one artifact');
      const a=d.artifacts.find(a=>a.id===e.subject_ids[0]);if(!a||a.storage!=='local'||a.availability!=='available')throw Error('Screen attachment unavailable');
      const bytes=regularFile(localFile(directory,a.location));if(sha(bytes)!==a.sha256)throw Error('Screen fingerprint mismatch');
      const screen=JSON.parse(bytes);if(screen.schema_version!=='sk21-screen-v1')throw Error('Unsupported screening version');
      checkRequest(screen.request,d);
      return {artifact_id:a.id,recorded:true,project_revision:screen.request.expected_revision,current_revision:d.revision,revision_changed:d.revision!==screen.request.expected_revision+1,catalog_changed:screen.catalog_sha256!==catalogHash,screen};
    }catch(error){return {event_id:e.id,recorded:false,error:error.message};}
  });
  return {project_id:d.project_id,revision:d.revision,screens,warning:'No screen record means not screened. Historic coverage is not current approval; missing/corrupt records are unresolved.'};
}
