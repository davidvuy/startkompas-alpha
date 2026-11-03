import {feedbackDecisions} from './feedback-decisions.mjs';
import {documentFieldDefinitions} from './business-fields.mjs';
import {experimentReviews} from './experiment-reviews.mjs';
import {randomUUID} from 'node:crypto';
import {readCore} from './store.mjs';
import {briefTypes,readBusinessBrief,prepareBusinessBrief} from './business-brief.mjs';
import {preparePilotWorkflow} from './pilot-workflow.mjs';

export function prepareDocumentSection(dir,id,revision,digest,input){
 const keys=['artifact_id','key','value','reason'];
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!keys.includes(k)&&k!=='review_id'&&k!=='feedback_response_id')||keys.some(k=>!Object.hasOwn(input,k))||keys.some(k=>typeof input[k]!=='string')||(Object.hasOwn(input,'review_id')&&(typeof input.review_id!=='string'||!/^experiment-review-[a-f0-9-]{36}$/.test(input.review_id)))||input.value.length>4000||!input.reason.trim()||input.reason.length>4000)throw Error('Choose a document section, text up to 4000 characters and a revision reason');
 const state=readCore(dir,id);if(state.dossier.revision!==revision||state.sha256!==digest)throw Error('Project changed; reopen the document');
 const prior=readBusinessBrief(dir,id,input.artifact_id),definition={fields:documentFieldDefinitions(prior.request)};
 if(prior.successor_ids.length||!Object.hasOwn(definition.fields,input.key))throw Error('Choose a current document and its existing section');
 let review=null;if(input.review_id){const history=experimentReviews(dir,id);review=history.rows.find(r=>r.artifact_id===input.review_id);if(history.sha256!==digest||prior.request.kind!=='offer'||!review||review.input.choice!=='adapt'||review.context_status!=='recorded'||!review.targets.some(t=>t.id===prior.artifact_id&&t.kind==='offer'&&t.status==='unchanged'))throw Error('Choose a current Adapt review that explicitly targets this offer');}
 let feedback=null;if(Object.hasOwn(input,'feedback_response_id')){if(typeof input.feedback_response_id!=='string'||input.review_id)throw Error('Choose one review source for this section');const history=feedbackDecisions(dir,id),item=history.comments.find(c=>c.decision?.artifact_id===input.feedback_response_id);if(history.sha256!==digest||!item||!['accept','adapt'].includes(item.decision.input.choice)||item.comment.key!==input.key||item.comparison.current_document!==prior.artifact_id||item.decision.comparison.current_document!==prior.artifact_id||item.comparison.after.value!==item.decision.comparison.after.value||JSON.stringify(item.comparison.after)!==JSON.stringify(item.decision.comparison.after))throw Error('Choose a current Accept or Adapt response reviewed against this exact section version');feedback=item.decision;}
 const value=input.value.trim()||null,old=prior.fields.find(f=>f.key===input.key);
 if(old?.value===value)throw Error('This section has no text change');
 let prepared;
 const linkedOffer=prior.preparation_context?.offer_id??state.dossier.workflow.links.find(l=>l.dependent_id===prior.artifact_id&&l.reason==='Pilot proposes a test of this offer')?.prerequisite_id;
 if(prior.request.kind==='pilot'&&linkedOffer){
  if(feedback)throw Error('Linked pilot feedback revisions are not supported by this section route');
  const fields=Object.fromEntries(prior.fields.map(f=>[f.key,f.key===input.key?value??'':f.value??'']));
  prepared=preparePilotWorkflow(dir,id,revision,digest,{offer_id:linkedOffer,previous:prior.artifact_id,reason:input.reason.trim(),fields});
 }else{
  const fields=prior.fields.map(f=>f.key===input.key?{key:f.key,value,assertion:value===null?'unknown':'proposal',record_ids:review?[review.artifact_id]:feedback?[feedback.artifact_id]:[]}:{key:f.key,value:f.value,assertion:f.assertion,record_ids:[...f.record_ids]});
  prepared=prepareBusinessBrief(dir,{...prior.request,expected_revision:revision,operation_id:'section-'+randomUUID(),at:new Date().toISOString().slice(0,10),language:'en',previous_artifact_id:prior.artifact_id,change_reason:input.reason.trim(),fields});
 }
 if(readCore(dir,id).sha256!==digest)throw Error('Project changed while preparing section');
 return {...prepared,edited_section:input.key,previous_artifact_id:prior.artifact_id};
}
