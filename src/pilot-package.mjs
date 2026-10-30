import Ajv2020 from 'ajv/dist/2020.js';
import {createHash} from 'node:crypto';
import {readCore,damagedArtifacts} from './store.mjs';
import {records} from './dependencies.mjs';
import {applyInvalidation} from './change-rules.mjs';
export const sectionNames=['brief','conditions','costs','acceptance','recruitment','support'];
const id={type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'};
const schema={type:'object',additionalProperties:false,required:['project_id','expected_revision','operation_id','at','language','scope','sections'],properties:{project_id:id,expected_revision:{type:'integer',minimum:1},operation_id:id,at:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'},language:{enum:['nl','en']},scope:{type:['string','null'],minLength:1,maxLength:2000},sections:{type:'array',maxItems:6,items:{type:'object',additionalProperties:false,required:['kind','summary','record_ids'],properties:{kind:{enum:sectionNames},summary:{type:['string','null'],minLength:1,maxLength:10000},record_ids:{type:'array',maxItems:100,uniqueItems:true,items:id}}}}}};
const validate=new Ajv2020({strict:true,allErrors:true,coerceTypes:false,useDefaults:false,removeAdditional:false}).compile(schema);
const sha=b=>createHash('sha256').update(b).digest('hex');
const escape=s=>String(s).replace(/[\\`*_{}\[\]()<>#!|]/g,'\\$&').replace(/[\r\n]+/g,' ');
const labels={en:{title:'Pilot package — draft',scope:'Scope',unknown:'Unknown / still to develop',basis:'Referenced project records',unresolved:'Open or requiring review',none:'No linked basis; proposal, not an established fact',warning:'Draft from a supplied selection. No independent review, pilot approval or recruitment sent. Selection does not prove complete coverage.',sections:['Pilot brief','Conditions','Costs and price assumption','Product acceptance','Recruitment copy — unsent','Support and exit']}};
export function preparePilotPackage(dir,request){
 if(!validate(request))throw Error('Invalid pilot-package request: '+validate.errors.map(e=>e.instancePath+' '+e.message).join('; '));
 if(new Date(request.at+'T00:00:00Z').toISOString().slice(0,10)!==request.at)throw Error('Invalid calendar date');
 if(new Set(request.sections.map(s=>s.kind)).size!==request.sections.length)throw Error('Duplicate pilot section');
 const state=readCore(dir,request.project_id),original=state.dossier;
 if(!original.workflow)throw Error('Pilot package requires explicit schema1.1 workflow upgrade');
 if(original.revision!==request.expected_revision)throw Error('Revision conflict; reread project');
 if(original.operations.some(o=>o.id===request.operation_id))throw Error('Operation already recorded; retry the original saved attachment request');
 const damaged=damagedArtifacts(state.directory,original),d=applyInvalidation(original,structuredClone(original),damaged),index=records(d),w=labels.en;
 const artifactId='pilot-package-'+sha(request.operation_id).slice(0,32);
 if(index.has(artifactId)||index.has(artifactId+'-event'))throw Error('Generated record ID already exists');
 const basis=[...new Set(request.sections.flatMap(s=>s.record_ids))];
 for(const id of basis){if(!index.has(id)||index.get(id).group==='events')throw Error('Missing or unsuitable basis record: '+id);}
 const sections=sectionNames.map((kind,i)=>{const s=request.sections.find(s=>s.kind===kind),refs=(s?.record_ids??[]).map(id=>{const r=index.get(id);return {id,group:r.group,label:r.title??r.text??r.name??r.location??r.id,status:r.assertion??r.status??r.progress??r.availability??'recorded',substantiation:r.substantiation??null,location:r.group==='artifacts'?r.location:null,needs_review:d.workflow.invalidated_ids.includes(id)||damaged.includes(id)||(r.group==='artifacts'&&r.availability!=='available')||(['tasks','checks'].includes(r.group)&&(r.progress!=='done'||r.substantiation!=='supported'))||(['facts','assumptions'].includes(r.group)&&r.assertion==='unknown')};});return {kind,title:w.sections[i],summary:s?.summary??null,missing:!s||s.summary===null,refs};});
 const lines=['# '+w.title,'',`Project: ${escape(d.name)} (${d.project_id})`, `Basis revision: ${d.revision}`,`${w.scope}: ${request.scope===null?w.unknown:escape(request.scope)}`,'',w.warning];
 for(const s of sections){lines.push('','## '+s.title,'',s.summary===null?w.unknown:escape(s.summary),'',w.basis+':');if(!s.refs.length)lines.push('- '+w.none);for(const r of s.refs)lines.push(`- ${escape(r.id)} — ${escape(r.label)} [${escape(r.status)}${r.substantiation?', '+escape(r.substantiation):''}]${r.location?' · '+escape(r.location):''}${r.needs_review?' — '+w.unresolved:''}`);}
 const content=lines.join('\n')+'\n',artifact={id:artifactId,version:'1',storage:'local',location:'files/'+artifactId+'.md',availability:'available',sha256:sha(content)};
 const links=basis.map(prerequisite_id=>({dependent_id:artifactId,prerequisite_id,reason:'Pilot package uses selected project record'}));
 const update_request={project_id:d.project_id,expected_revision:d.revision,operation_id:request.operation_id,changes:{artifacts:[...original.artifacts,artifact],events:[...original.events,{id:artifactId+'-event',type:'pilot-package-draft',at:request.at,description:'Draft package prepared; no substantive approval or external action',subject_ids:[artifactId]}],workflow:{...original.workflow,links:[...original.workflow.links,...links]}}};
 return {content,artifact_id:artifactId,source_sha256:state.sha256,sections,update_request,warning:'Not saved. Persist content and update_request exactly, then use core attach; retry the same saved request. New operation IDs create new versions without replacing earlier drafts.'};
}
