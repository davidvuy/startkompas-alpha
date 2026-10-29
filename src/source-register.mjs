import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import {readCore,regularFile,localFile,bytesFor,sha,damagedArtifacts} from './store.mjs';
import {applyInvalidation} from './change-rules.mjs';
const schema=JSON.parse(fs.readFileSync(new URL('../schemas/source-register.schema.json',import.meta.url)));
const validate=new Ajv2020({strict:true,allErrors:true}).compile(schema);
const dimensions=['source','interpretation','applicability','coverage'];
function date(value){if(value!==null&&(!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value))throw Error('Invalid calendar date');}
export function checkRegister(data,dossier=null){
  if(!validate(data))throw Error('Invalid source register: '+validate.errors.map(e=>e.instancePath+' '+e.message).join('; '));
  const ids=new Set(),sources=new Map(),claims=new Map();
  for(const r of [...data.sources,...data.claims,...data.conflicts]){if(ids.has(r.id))throw Error('Duplicate registry ID');ids.add(r.id);}
  for(const s of data.sources){
    const u=new URL(s.url);if(u.protocol!=='https:'||u.username||u.password)throw Error('Source URL must be HTTPS without credentials');
    date(s.published_on);date(s.effective_on);date(s.checked_on);
    if(s.rights.mode==='licensed_excerpt'&&!s.rights.licence_ref)throw Error('Copied excerpt needs licence reference');sources.set(s.id,s);
  }
  for(const c of data.claims){
    for(const id of c.source_ids)if(!sources.has(id))throw Error('Missing claim source');
    for(const dimension of dimensions){const r=c.reviews[dimension];date(r.date);
      if(r.status==='reviewed'&&(!r.reviewer||!r.date||!r.evidence_ids.length))throw Error('Reviewed dimension requires reviewer, date and evidence');
      if(r.status==='not_reviewed'&&(r.reviewer!==null||r.date!==null||r.evidence_ids.length))throw Error('Not-reviewed fields must not imply a performed review');
      if(dossier)for(const id of r.evidence_ids)if(!dossier.artifacts.some(a=>a.id===id))throw Error('Review evidence artifact missing');
    }
    if(c.reviews.source.status==='reviewed'&&!c.source_ids.some(id=>sources.get(id).kind==='primary'))throw Error('Source review requires a primary source');
    claims.set(c.id,c);
  }
  for(const conflict of data.conflicts){
    for(const id of conflict.claim_ids)if(!claims.has(id))throw Error('Missing conflict claim');
    for(const id of conflict.source_ids)if(!sources.has(id))throw Error('Missing conflict source');date(conflict.resolved_on);
    if(conflict.status==='resolved'&&(!conflict.resolution||!conflict.reviewer||!conflict.resolved_on))throw Error('Conflict resolution requires reason, reviewer and date');
    if(conflict.status==='open'&&(conflict.resolution!==null||conflict.reviewer!==null||conflict.resolved_on!==null))throw Error('Open conflict must not imply a resolution');
  }
  return data;
}
export function registerSummary(data){
  checkRegister(data);
  return {version:data.version,claims:data.claims.map(c=>({id:c.id,context:c.context,primary_source_present:c.source_ids.some(id=>data.sources.find(s=>s.id===id).kind==='primary'),review_status:Object.fromEntries(dimensions.map(k=>[k,c.reviews[k].status])),open_conflicts:data.conflicts.filter(x=>x.status==='open'&&x.claim_ids.includes(c.id)).map(x=>x.id),rights_unresolved:c.source_ids.filter(id=>data.sources.find(s=>s.id===id).rights.mode==='unresolved')})),warning:'Review entries are attributed records, not authenticated expertise or automatic approval. Unknown dates stay null; sources require recheck for their recorded triggers.'};
}
export function prepareRegister(dir,request){
  const keys=['project_id','expected_revision','operation_id','at','registry'];
  if(!request||Object.keys(request).length!==keys.length||keys.some(k=>!(k in request))||typeof request.operation_id!=='string'||!(/^[a-z0-9][a-z0-9-]{0,63}$/).test(request.operation_id)||typeof request.at!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(request.at))throw Error('Invalid register attachment request');
  date(request.at);const {dossier:d,sha256:base}=readCore(dir,request.project_id);checkRegister(request.registry,d);
  if(d.revision!==request.expected_revision)throw Error('Revision conflict');
  if(d.operations.some(o=>o.id===request.operation_id))throw Error('Operation already recorded; retry saved attachment request');
  const id='register-'+sha(request.operation_id).slice(0,36),content=bytesFor({project_id:d.project_id,basis_revision:d.revision,basis_sha256:base,registry:request.registry}).toString('utf8');
  if(Buffer.byteLength(content)>4*1024*1024)throw Error('Register exceeds 4 MiB');
  const artifact={id,version:request.registry.version,storage:'local',location:'files/'+id+'.json',availability:'available',sha256:sha(content)};
  const event={id:id+'-event',type:'source-register',at:request.at,description:'Source/interpretation/applicability/coverage review snapshot; not automatic approval',subject_ids:[id]};
  const changes={artifacts:[...d.artifacts,artifact],events:[...d.events,event]};
  if(d.workflow){
    const basis=[...new Set(request.registry.claims.flatMap(c=>dimensions.flatMap(k=>c.reviews[k].evidence_ids)))];
    changes.workflow={...d.workflow,links:[...d.workflow.links,...basis.map(prerequisite_id=>({dependent_id:id,prerequisite_id,reason:'Register review cites this evidence artifact'}))]};
  }
  return {content,update_request:{project_id:d.project_id,expected_revision:d.revision,operation_id:request.operation_id,changes},summary:registerSummary(request.registry),warning:'Save exact UTF-8 content and update_request; apply through core attach. Preserve both for retries.'};
}
export function readRegisters(dir,id){
  const state=readCore(dir,id),directory=state.directory,d=applyInvalidation(state.dossier,structuredClone(state.dossier),damagedArtifacts(directory,state.dossier));
  const checked=new Map();
  const inspect=artifactId=>{
    if(checked.has(artifactId))return checked.get(artifactId);
    const a=d.artifacts.find(a=>a.id===artifactId);let integrity='missing';
    if(a){
      if(a.availability!=='available')integrity='recorded_unavailable';
      else if(a.storage==='external')integrity='external_unchecked';
      else try{integrity=sha(regularFile(localFile(directory,a.location),16*1024*1024))===a.sha256?'hash_matches':'hash_mismatch';}
      catch(error){integrity=error.code==='ENOENT'?'missing':'unreadable_or_unsafe';}
    }
    const result={artifact_id:artifactId,integrity,invalidated:d.workflow?.invalidated_ids.includes(artifactId)||false};checked.set(artifactId,result);return result;
  };
  return {project_id:id,revision:d.revision,registers:d.events.filter(e=>e.type==='source-register').map(e=>{
    try{
      if(e.subject_ids.length!==1)throw Error('Invalid register event');const a=d.artifacts.find(x=>x.id===e.subject_ids[0]);
      if(!a||a.storage!=='local'||a.availability!=='available')throw Error('Register unavailable');const bytes=regularFile(localFile(directory,a.location));if(sha(bytes)!==a.sha256)throw Error('Register fingerprint mismatch');
      const record=JSON.parse(bytes);if(record.project_id!==id||!Number.isInteger(record.basis_revision))throw Error('Register identity/revision mismatch');checkRegister(record.registry,d);
      const summary=registerSummary(record.registry);
      for(const claim of summary.claims){
        const original=record.registry.claims.find(c=>c.id===claim.id);
        claim.review_evidence=Object.fromEntries(dimensions.map(dimension=>{
          const review=original.reviews[dimension],artifacts=review.evidence_ids.map(inspect);
          return [dimension,{artifacts,requires_recheck:artifacts.some(a=>a.integrity!=='hash_matches'||a.invalidated)}];
        }));
      }
      return {artifact_id:a.id,available:true,requires_review:(d.workflow?.invalidated_ids.includes(a.id)||false)||summary.claims.some(c=>Object.values(c.review_evidence).some(r=>r.requires_recheck)),revision_changed:d.revision!==record.basis_revision+1,record,summary};
    }catch(error){return {event_id:e.id,available:false,error:error.message};}
  })};
}
