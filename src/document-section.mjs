import {randomUUID} from 'node:crypto';
import {readCore} from './store.mjs';
import {briefTypes,readBusinessBrief,prepareBusinessBrief} from './business-brief.mjs';
import {preparePilotWorkflow} from './pilot-workflow.mjs';

export function prepareDocumentSection(dir,id,revision,digest,input){
 const keys=['artifact_id','key','value','reason'];
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==keys.length||keys.some(k=>!Object.hasOwn(input,k))||keys.some(k=>typeof input[k]!=='string')||input.value.length>4000||!input.reason.trim()||input.reason.length>4000)throw Error('Choose a document section, text up to 4000 characters and a revision reason');
 const state=readCore(dir,id);if(state.dossier.revision!==revision||state.sha256!==digest)throw Error('Project changed; reopen the document');
 const prior=readBusinessBrief(dir,id,input.artifact_id),definition=briefTypes[prior.request.kind];
 if(prior.successor_ids.length||!Object.hasOwn(definition.fields,input.key))throw Error('Choose a current document and its existing section');
 const value=input.value.trim()||null,old=prior.fields.find(f=>f.key===input.key);
 if(old?.value===value)throw Error('This section has no text change');
 let prepared;
 const linkedOffer=prior.preparation_context?.offer_id??state.dossier.workflow.links.find(l=>l.dependent_id===prior.artifact_id&&l.reason==='Pilot proposes a test of this offer')?.prerequisite_id;
 if(prior.request.kind==='pilot'&&linkedOffer){
  const fields=Object.fromEntries(prior.fields.map(f=>[f.key,f.key===input.key?value??'':f.value??'']));
  prepared=preparePilotWorkflow(dir,id,revision,digest,{offer_id:linkedOffer,previous:prior.artifact_id,reason:input.reason.trim(),fields});
 }else{
  const fields=prior.fields.map(f=>f.key===input.key?{key:f.key,value,assertion:value===null?'unknown':'proposal',record_ids:[]}:{key:f.key,value:f.value,assertion:f.assertion,record_ids:[...f.record_ids]});
  prepared=prepareBusinessBrief(dir,{...prior.request,expected_revision:revision,operation_id:'section-'+randomUUID(),at:new Date().toISOString().slice(0,10),language:'en',previous_artifact_id:prior.artifact_id,change_reason:input.reason.trim(),fields});
 }
 if(readCore(dir,id).sha256!==digest)throw Error('Project changed while preparing section');
 return {...prepared,edited_section:input.key,previous_artifact_id:prior.artifact_id};
}
