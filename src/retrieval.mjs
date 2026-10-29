import Ajv2020 from 'ajv/dist/2020.js';
import {COLLECTIONS} from './model.mjs';
import {readCore,damagedArtifacts} from './store.mjs';
import {applyInvalidation} from './change-rules.mjs';
const id={type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'};
const validate=new Ajv2020({strict:true,allErrors:true,coerceTypes:false,useDefaults:false}).compile({type:'object',additionalProperties:false,required:['project_id','source_revision','query','groups','ids','offset','limit'],properties:{project_id:id,source_revision:{type:'integer',minimum:1},query:{type:'string',maxLength:1000},groups:{type:'array',uniqueItems:true,maxItems:10,items:{enum:COLLECTIONS}},ids:{type:'array',uniqueItems:true,maxItems:100,items:id},offset:{type:'integer',minimum:0,maximum:100000},limit:{type:'integer',minimum:1,maximum:100}}});
export function retrieveRecords(dir,request){
 if(!validate(request))throw Error('Invalid retrieval request: '+validate.errors.map(e=>e.instancePath+' '+e.message).join('; '));
 const s=readCore(dir,request.project_id);if(s.dossier.revision!==request.source_revision)throw Error('Revision changed; restart retrieval from the current revision');
 const d=applyInvalidation(s.dossier,structuredClone(s.dossier),damagedArtifacts(s.directory,s.dossier)),all=COLLECTIONS.flatMap(group=>d[group].map(record=>({group,...record}))),existing=new Set(all.map(r=>r.id));
 const query=request.query.toLowerCase(),matches=all.filter(r=>(!request.groups.length||request.groups.includes(r.group))&&(!request.ids.length||request.ids.includes(r.id))&&(!query||JSON.stringify(r).toLowerCase().includes(query)));
 const page=matches.slice(request.offset,request.offset+request.limit),end=request.offset+page.length;
 return {project_id:d.project_id,revision:d.revision,canonical_sha256:s.sha256,query:request.query,groups:[...request.groups],offset:request.offset,limit:request.limit,total_matches:matches.length,returned:page.length,next_offset:end<matches.length?end:null,truncated:request.offset>0||end<matches.length,missing_requested_ids:request.ids.filter(id=>!existing.has(id)),records:page.map(r=>({...r,requires_review:d.workflow?.invalidated_ids.includes(r.id)||false})),limitations:['Literal case-insensitive search of canonical records, not semantic or attachment-content search','No matches does not prove absence outside these fields/filters; no external source fetched','Keep the same query, filters and revision across pages; returned assertions are not new verification']};
}
