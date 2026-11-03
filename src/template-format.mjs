import Ajv2020 from 'ajv/dist/2020.js';
import {briefTypes} from './business-fields.mjs';
import {canonical} from './model.mjs';
import {sha} from './store.mjs';

const text={type:'string',minLength:1,maxLength:2000,pattern:'\\S'};
const list={type:'array',minItems:1,maxItems:20,uniqueItems:true,items:text};
export const templateSchema={type:'object',additionalProperties:false,
 required:['format','id','version','name','document_kind','audience','scope','required_inputs','unknowns','boundaries','sections'],
 properties:{format:{const:'startkompas-document-template-v1'},id:{type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'},version:{type:'integer',minimum:1,maximum:1000000},name:text,document_kind:{enum:Object.keys(briefTypes)},audience:text,scope:text,
 compatibility:{type:'object',additionalProperties:false,required:['command_contract','project_schemas'],properties:{command_contract:{const:1},project_schemas:{type:'array',minItems:1,maxItems:2,uniqueItems:true,items:{enum:['1.0.0','1.1.0']}}}},
 required_inputs:{type:'array',minItems:1,maxItems:10,uniqueItems:true,items:{type:'string'}},unknowns:list,boundaries:list,
 sections:{type:'array',minItems:1,maxItems:10,items:{type:'object',additionalProperties:false,required:['key','prompt'],properties:{key:{type:'string'},prompt:text}}}}};
export const customFieldsSchema={type:'array',minItems:1,maxItems:10,items:{type:'object',additionalProperties:false,required:['key','label','prompt'],properties:{key:{type:'string',pattern:'^custom_[a-z][a-z0-9_]{0,39}$'},label:{...text,maxLength:120},prompt:text}}};
const extendedSchema=structuredClone(templateSchema);extendedSchema.properties.format={const:'startkompas-document-template-v2'};extendedSchema.properties.document_kind={const:'offer'};extendedSchema.properties.custom_fields=customFieldsSchema;extendedSchema.required.push('custom_fields');extendedSchema.properties.required_inputs.maxItems=20;
const validateExtended=new Ajv2020({strict:true,allErrors:true,coerceTypes:false,useDefaults:false}).compile(extendedSchema);
const validate=new Ajv2020({strict:true,allErrors:true,coerceTypes:false,useDefaults:false}).compile(templateSchema);
export function validateTemplate(value){
 if(!(value?.format==='startkompas-document-template-v2'?validateExtended(value):validate(value)))throw Error('Invalid document template: check required fields, version, text bounds and unsupported properties');
 const custom=value.custom_fields??[];if(new Set(custom.map(f=>f.key)).size!==custom.length)throw Error('Duplicate custom field');
 const expected=Object.keys(briefTypes[value.document_kind].fields),keys=value.sections.map(s=>s.key);
 if(keys.length!==expected.length||new Set(keys).size!==keys.length||keys.some(k=>!expected.includes(k))||value.required_inputs.some(k=>![...keys,...custom.map(f=>f.key)].includes(k)))throw Error('Template sections must cover the document fields exactly; required inputs must name those fields');
 const encoded=canonical(value);if(Buffer.byteLength(encoded)>65536)throw Error('Template exceeds 64 KiB');
 return {template:structuredClone(value),sha256:sha(encoded)};
}

export function assertTemplateCompatibility(template,projectSchema){
 validateTemplate(template);
 if(!['1.0.0','1.1.0'].includes(projectSchema))throw Error('Unsupported project schema for document template');
 if(template.compatibility&&!template.compatibility.project_schemas.includes(projectSchema))throw Error('Template does not support this project schema');
}
