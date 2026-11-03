import {fileURLToPath} from 'node:url';
import {regularFile} from './store.mjs';
import {validateTemplate} from './template-format.mjs';
import {prepareTemplateDraft} from './template-draft.mjs';

const ids=Object.freeze(['bounded-audit','implementation-service','recurring-reporting','experiment-card','experiment-problem-conversation','experiment-prototype-check','experiment-offer-conversation','experiment-paid-pilot']);
export function libraryTemplate(id){
 if(!ids.includes(id))throw Error('Unknown library template');
 const result=validateTemplate(JSON.parse(regularFile(fileURLToPath(new URL('../templates/'+id+'.json',import.meta.url)),65536)));
 if(result.template.id!==id||result.template.document_kind!==(id.startsWith('experiment-')?'experiment':'offer'))throw Error('Library template identity mismatch');
 return result;
}
export function templateLibrary(){return ids.map(libraryTemplate);}
export function prepareLibraryDraft(dir,input){
 const keys=['project_id','expected_revision','expected_sha256','template_id','template_version','template_sha256','answers','client','period'];
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==keys.length||keys.some(k=>!Object.hasOwn(input,k)))throw Error('Invalid library draft request');
 const {template,sha256}=libraryTemplate(input.template_id);
 if(input.template_version!==template.version||input.template_sha256!==sha256)throw Error('Template changed; review and select its current version again');
 return prepareTemplateDraft(dir,{project_id:input.project_id,expected_revision:input.expected_revision,expected_sha256:input.expected_sha256,template,answers:input.answers,client:input.client,period:input.period});
}
