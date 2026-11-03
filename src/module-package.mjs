import Ajv2020 from 'ajv/dist/2020.js';
import {canonical} from './model.mjs';
import {sha,readCore} from './store.mjs';
import {prepareTemplateDraft} from './template-draft.mjs';
import {templateSchema,validateTemplate,assertTemplateCompatibility} from './template-format.mjs';
const text={type:'string',minLength:1,maxLength:2000,pattern:'\\S'};
const id={type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'};
const object=properties=>({type:'object',additionalProperties:false,required:Object.keys(properties),properties});
const list=(items,maxItems=20)=>({type:'array',maxItems,items});
const schema=object({
 format:{const:'startkompas-module-package-v1'},id,version:{type:'integer',minimum:1,maximum:1000000},
 name:text,maker:text,audience:text,scope:text,
 compatibility:templateSchema.properties.compatibility,
 sources:list(object({id,citation:text})),
 review:object({status:{enum:['unreviewed','reviewed','withdrawn']},reviewer:{anyOf:[text,{type:'null'}]},reviewed_on:{type:['string','null']},review_due:{type:['string','null']},specialist_required:{type:'boolean'},review_route:text}),
 templates:{type:'array',minItems:1,maxItems:10,items:{type:'object'}},
 routes:list(object({id,template_id:id,label:text})),
 checks:list(object({id,template_id:id,prompt:text,source_ids:{...list(id),uniqueItems:true}}))
});
schema.properties.lifecycle=object({status:{enum:['deprecated','withdrawn']},effective_on:{type:'string'},reason:text,alternatives:{...list(id,10),uniqueItems:true},migration_notes:text});
const validate=new Ajv2020({strict:true,allErrors:true,coerceTypes:false,useDefaults:false}).compile(schema);
function date(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;}
function unique(rows){return new Set(rows.map(r=>r.id)).size===rows.length;}
export function inspectModulePackage(value,projectSchema,today=new Date().toISOString().slice(0,10)){
 if(!date(today))throw Error('Invalid review assessment date');
 if(!validate(value))throw Error('Invalid module package: check format, metadata, compatibility and unsupported properties');
 const encoded=canonical(value);if(Buffer.byteLength(encoded)>1048576)throw Error('Module package exceeds 1 MiB');
 if(!['1.0.0','1.1.0'].includes(projectSchema)||!value.compatibility.project_schemas.includes(projectSchema))throw Error('Module does not support this project schema');
 for(const rows of [value.templates,value.routes,value.checks,value.sources])if(!unique(rows))throw Error('Duplicate module member ID');
 for(const t of value.templates){validateTemplate(t);for(const version of value.compatibility.project_schemas)assertTemplateCompatibility(t,version);}
 const ids=new Set(value.templates.map(t=>t.id)),sources=new Set(value.sources.map(s=>s.id));
 if([...value.routes,...value.checks].some(r=>!ids.has(r.template_id))||value.checks.some(c=>c.source_ids.some(id=>!sources.has(id))))throw Error('Unknown module template or source reference');
 const r=value.review;
 for(const d of [r.reviewed_on,r.review_due])if(d!==null&&!date(d))throw Error('Invalid module review date');
 if(r.reviewed_on!==null&&r.reviewed_on>today)throw Error('Module review date is in the future');
 if(r.status==='reviewed'&&(!r.reviewer||!r.reviewed_on||!r.review_due))throw Error('Reviewed module requires reviewer and review dates');
 if(r.status==='unreviewed'&&(r.reviewer!==null||r.reviewed_on!==null))throw Error('Unreviewed module cannot claim a completed review');
 if(r.reviewed_on&&r.review_due&&r.review_due<r.reviewed_on)throw Error('Module review due date precedes its review');
 const lifecycle=value.lifecycle;
 if(lifecycle&&(!date(lifecycle.effective_on)||lifecycle.alternatives.includes(value.id)))throw Error('Invalid module lifecycle date or self-referencing alternative');
 const warnings=[];
 if(lifecycle)warnings.push('Module '+lifecycle.status+' effective '+lifecycle.effective_on+': '+lifecycle.reason+' Alternatives are suggestions only; inspect them separately. '+lifecycle.migration_notes);
 if(r.status!=='reviewed')warnings.push('Module content is '+r.status+'.');
 if(r.review_due&&r.review_due<today)warnings.push('Module review is overdue.');
 if(r.specialist_required)warnings.push('Specialist review is required; supplied reviewer identity and qualifications are not verified.');
 if(!value.sources.length)warnings.push('No source citations supplied.');
 return {format:'startkompas-module-inspection-v1',module:structuredClone(value),sha256:sha(encoded),project_schema:projectSchema,assessed_on:today,warnings,execution:'Data only: routes select embedded templates; checks are unanswered review prompts. No code, network request or project write is performed.'};
}

export function previewModuleTrial(dir,request){
 const keys=['project_id','expected_revision','expected_sha256','module','module_sha256','route_id','answers'];
 if(!request||typeof request!=='object'||Array.isArray(request)||Object.keys(request).length!==keys.length||keys.some(k=>!Object.hasOwn(request,k)))throw Error('Invalid module trial request');
 const state=readCore(dir,request.project_id);
 if(state.dossier.revision!==request.expected_revision||state.sha256!==request.expected_sha256)throw Error('Project changed; prepare the module trial again');
 if(!state.dossier.events.some(e=>e.type==='practice-project'&&e.id==='practice-project-created'))throw Error('Module trials require a separate fictional practice project');
 const inspection=inspectModulePackage(request.module,state.dossier.schema_version);
 if(inspection.sha256!==request.module_sha256)throw Error('Module changed; inspect the selected package again');
 if(inspection.module.review.status==='withdrawn'||(inspection.module.lifecycle?.status==='withdrawn'&&inspection.module.lifecycle.effective_on<=inspection.assessed_on))throw Error('Withdrawn modules cannot be tried');
 const route=inspection.module.routes.find(r=>r.id===request.route_id);if(!route)throw Error('Choose an existing module route');
 const template=inspection.module.templates.find(t=>t.id===route.template_id);
 const prepared=prepareTemplateDraft(dir,{project_id:request.project_id,expected_revision:request.expected_revision,expected_sha256:request.expected_sha256,template,answers:request.answers,client:null,period:null});
 if(readCore(dir,request.project_id).sha256!==state.sha256)throw Error('Project changed during module trial');
 return {format:'startkompas-module-trial-preview-v1',project_id:request.project_id,revision:state.dossier.revision,project_sha256:state.sha256,module:inspection,route,document:JSON.parse(prepared.content),missing_required:prepared.missing_required,checks:inspection.module.checks.filter(c=>c.template_id===template.id).map(c=>({...c,status:'unanswered'})),changes:{saved:false,proposed_documents:1,project_checks_added:0,facts_added:0},undo:'Discard this preview. No project data was changed.',limitation:'Read-only trial preview; no module activation or save request is issued.'};
}
