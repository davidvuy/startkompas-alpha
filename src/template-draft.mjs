import {documentFieldDefinitions} from './business-fields.mjs';
import {randomUUID} from 'node:crypto';
import {readCore,bytesFor,sha} from './store.mjs';
import {briefTypes,prepareBusinessBrief} from './business-brief.mjs';
import {validateTemplate,assertTemplateCompatibility} from './template-format.mjs';
import {cleanText} from './project-view.mjs';

export function prepareTemplateDraft(dir,input){
 const keys=['project_id','expected_revision','expected_sha256','template','answers','client','period'];
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==keys.length||keys.some(k=>!Object.hasOwn(input,k)))throw Error('Invalid template draft request');
 const {template,sha256}=validateTemplate(input.template),definition={kind:template.document_kind,...(template.custom_fields?{custom_fields:template.custom_fields}:{})},labels=documentFieldDefinitions(definition),allowed=Object.keys(labels);
 if(!input.answers||typeof input.answers!=='object'||Array.isArray(input.answers)||Object.entries(input.answers).some(([key,value])=>!allowed.includes(key)||typeof value!=='string'||value.length>4000))throw Error('Answers must be known document fields containing at most 4000 text characters each');
 const state=readCore(dir,input.project_id);
 if(state.dossier.revision!==input.expected_revision||state.sha256!==input.expected_sha256)throw Error('Project changed; prepare the template again');
 assertTemplateCompatibility(template,state.dossier.schema_version);
 const fields=allowed.map(key=>{const value=input.answers[key]?.trim()||null;return {key,value,assertion:value===null?'unknown':'proposal',record_ids:[]};});
 const missing=template.required_inputs.filter(key=>fields.find(f=>f.key===key).value===null);
 const prepared=prepareBusinessBrief(dir,{project_id:input.project_id,expected_revision:input.expected_revision,operation_id:'template-'+randomUUID(),at:new Date().toISOString().slice(0,10),language:'en',...definition,client:input.client,period:input.period,previous_artifact_id:null,change_reason:null,fields});
 const context={template,sha256,missing_required_at_creation:missing};
 prepared.document_markdown+=['','## Template origin','',cleanText(template.name)+' · version '+template.version,'Template fingerprint: '+sha256,'Audience: '+cleanText(template.audience),'Scope: '+cleanText(template.scope),'','Required answers still unknown at creation: '+(missing.map(k=>labels[k][1]).join(', ')||'None; supplied answers remain proposals.'),'','### Unknowns to investigate',...template.unknowns.map(t=>'- '+cleanText(t)),'','### Template boundaries',...template.boundaries.map(t=>'- '+cleanText(t)),'','Template prompts are guidance, not answers or evidence. This copy retains the selected template version; later template edits do not update it.',''].join('\n');
 const saved=JSON.parse(prepared.content);saved.template_context=context;saved.document_markdown=prepared.document_markdown;prepared.content=bytesFor(saved).toString('utf8');prepared.update_request.changes.artifacts.find(a=>a.id===prepared.artifact_id).sha256=sha(prepared.content);
 if(readCore(dir,input.project_id).sha256!==input.expected_sha256)throw Error('Project changed during template preparation');
 return {...prepared,template_context:context,missing_required:missing};
}
