import Ajv2020 from 'ajv/dist/2020.js';
import {regularFile,localFile,bytesFor,sha} from './store.mjs';
import {dependencyGraph} from './dependencies.mjs';
const id={type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'},level={enum:['unknown','low','medium','high']};
const requestSchema={type:'object',additionalProperties:false,required:['assumption_id','impact','uncertainty','priority','reason','date'],properties:{assumption_id:id,impact:level,uncertainty:level,priority:{enum:['unset','first','normal','later']},reason:{type:'string',minLength:1,maxLength:4000,pattern:'\\S'},date:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'}}};
export const validate=new Ajv2020({strict:true,allErrors:true}).compile(requestSchema);
const savedSchema={type:'object',additionalProperties:false,required:['format','project_id','artifact_id','version','previous','basis_sha256','origin','request'],properties:{format:{const:'startkompas-research-priority-v1'},project_id:id,artifact_id:id,version:{type:'integer',minimum:1},previous:{anyOf:[id,{type:'null'}]},basis_sha256:{type:'string',pattern:'^[a-f0-9]{64}$'},origin:{const:'user_statement'},request:requestSchema}};
const validateSaved=new Ajv2020({strict:true}).compile(savedSchema);
export const latest=(d,assumption)=>d.events.filter(e=>e.type==='research-priority'&&e.subject_ids[1]===assumption).at(-1)?.subject_ids[0]??null;
export function load(state,artifactId){
 const a=state.dossier.artifacts.find(a=>a.id===artifactId);if(!a||a.storage!=='local'||a.availability!=='available')throw Error('Priority artifact unavailable');
 const bytes=regularFile(localFile(state.directory,a.location),32768);if(sha(bytes)!==a.sha256)throw Error('Priority fingerprint mismatch');const value=JSON.parse(bytes);
 if(!validateSaved(value)||value.project_id!==state.dossier.project_id||value.artifact_id!==artifactId||String(value.version)!==a.version)throw Error('Priority identity or format mismatch');
 if(!state.dossier.events.some(e=>e.type==='research-priority'&&e.subject_ids[0]===artifactId&&e.subject_ids[1]===value.request.assumption_id))throw Error('Priority reference mismatch');
 return value;
}
export function basisFingerprint(graph,id){const seen=new Set(),queue=[id];for(let n=0;n<queue.length;n++){const key=queue[n];if(seen.has(key))continue;seen.add(key);queue.push(...graph.edges.get(key).keys());}return sha(bytesFor([...seen].sort().map(key=>graph.index.get(key))));}

export function priorityRows(state){
 const d=state.dossier,graph=dependencyGraph(d),invalid=new Set(d.workflow?.invalidated_ids??[]),assessmentIds=new Set(d.events.filter(e=>e.type==='research-priority').map(e=>e.subject_ids[0]));
 const rows=d.assumptions.map(a=>{const artifact=latest(d,a.id);let rating=null,status='unassessed';if(artifact){try{rating=load(state,artifact);status=rating.basis_sha256!==basisFingerprint(graph,a.id)?'review_required':'recorded';}catch{status='unavailable';}}
 return {id:a.id,text:a.text,assertion:a.assertion,basis_requires_review:invalid.has(a.id),direct_dependents:graph.reverse.get(a.id).filter(key=>!assessmentIds.has(key)).length,status,rating,artifact_id:artifact};});
 const priority={first:0,normal:1,unset:1,later:2},rank={unknown:0,low:1,medium:2,high:3};
 const effective=r=>r.status==='recorded'?r.rating.request:{priority:'unset',impact:'unknown',uncertainty:'unknown'};
 return rows.sort((a,b)=>{const x=effective(a),y=effective(b);return priority[x.priority]-priority[y.priority]||rank[y.impact]-rank[x.impact]||rank[y.uncertainty]-rank[x.uncertainty]||b.direct_dependents-a.direct_dependents||a.id.localeCompare(b.id);});
}
