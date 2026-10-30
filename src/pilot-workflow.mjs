import {readCore,bytesFor,sha} from './store.mjs';
import {briefTypes,prepareBusinessBrief,readBusinessBrief} from './business-brief.mjs';
import {workspaceView,operationId} from './workspace.mjs';
import {scopeView} from './scope-exercise.mjs';
import {checkModel} from './model.mjs';
const linkReason='Pilot proposes a test of this offer';
const expert='Expert review remains open for contractual terms, liability, privacy/data handling and other specialist conditions. This is a preparation draft, not a contract, permission to process data or approval to start a pilot.';
const escape=value=>String(value).replace(/[\r\n\t]/g,' ').replace(/[\\`*_{}[\]()#+.!|<>]/g,c=>'\\'+c);
export function pilotWorkflow(dir,id){
 const state=readCore(dir,id),view=workspaceView(dir,id),scope=scopeView(dir,id),offers=scope.offers;
 const candidates=view.drafts.filter(row=>row.kind==='pilot'||state.dossier.workflow.intents.some(i=>i.record_id===row.id&&i.goal==='business-brief:pilot')),pilots=candidates.slice(-50).reverse().map(row=>{try{const saved=readBusinessBrief(dir,id,row.id),offer_id=state.dossier.workflow.links.find(l=>l.dependent_id===row.id&&l.reason===linkReason)?.prerequisite_id??null;const newestScope=scope.history.find(s=>!s.unavailable&&s.request.offer_id===offer_id),scopeLink=state.dossier.workflow.links.find(l=>l.dependent_id===row.id&&l.reason==='Pilot preparation retains the selected scope discussion points');return {...row,request:saved.request,markdown:saved.document_markdown,offer_id,requires_review:saved.requires_review||!!offer_id&&!offers.some(o=>o.id===offer_id)||!!newestScope&&(newestScope.requires_review||newestScope.artifact_id!==scopeLink?.prerequisite_id)||!!scope.history[0]?.unavailable};}catch{return {...row,version:state.dossier.artifacts.find(a=>a.id===row.id)?.version??'unknown',unavailable:true};}});
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed');return {revision:state.dossier.revision,sha256:state.sha256,archived:view.archived,offers,pilots,partial:candidates.length>50,scope_history:scope.history,scope_partial:scope.partial,expert,fields:Object.entries(briefTypes.pilot.fields).map(([key,labels])=>({key,label:labels[1]}))};
}
export function preparePilotWorkflow(dir,id,revision,digest,input){
 const keys=['offer_id','previous','reason','fields'];if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==keys.length||keys.some(k=>!Object.hasOwn(input,k)))throw Error('Invalid pilot fields');
 const fieldKeys=Object.keys(briefTypes.pilot.fields);if(!input.fields||typeof input.fields!=='object'||Array.isArray(input.fields)||Object.keys(input.fields).length!==fieldKeys.length||fieldKeys.some(k=>!Object.hasOwn(input.fields,k)||typeof input.fields[k]!=='string'||input.fields[k].length>4000))throw Error('Invalid pilot fields');
 if(typeof input.offer_id!=='string'||input.previous!==null&&typeof input.previous!=='string'||typeof input.reason!=='string')throw Error('Invalid pilot selection');
 const state=readCore(dir,id),d=state.dossier;if(d.revision!==revision||state.sha256!==digest)throw Error('Project changed');const offer=readBusinessBrief(dir,id,input.offer_id);if(offer.request.kind!=='offer'||offer.successor_ids.length)throw Error('Choose a current offer');
 const prior=input.previous?readBusinessBrief(dir,id,input.previous):null;if(prior&&(prior.request.kind!=='pilot'||prior.successor_ids.length))throw Error('Choose a current pilot version');
 if(prior&&!input.reason.trim()||!input.fields.deliverable.trim())throw Error('Describe one deliverable and explain revisions');
 const scope=scopeView(dir,id),latestScope=scope.history.find(s=>!s.unavailable&&s.request.offer_id===input.offer_id),warnings=[];
 if(offer.requires_review)warnings.push('The selected offer requires review.');
 if(scope.history[0]?.unavailable)warnings.push('The newest scope review is unavailable; its discussion points cannot be checked.');
 if(latestScope){warnings.push(...latestScope.points);if(latestScope.requires_review)warnings.push('The related scope review has changed context and must be reviewed.');}else warnings.push('No readable related scope review in the displayed history; capacity and exclusions remain unassessed.');
 if(scope.partial)warnings.push('Scope context is limited to the newest 50 exercises; older matching reviews may be omitted.');
 const missing=['learning','client','acceptance','stop','responsibilities','period','data_limits'].filter(key=>!input.fields[key].trim());if(missing.length)warnings.push('Open pilot fields: '+missing.join(', ')+'. Saving this draft does not resolve them.');
 const fields=fieldKeys.map(key=>{const value=input.fields[key].trim()||null,old=prior?.request.fields.find(f=>f.key===key);return old&&old.value===value?{key,value,assertion:old.assertion,record_ids:old.record_ids}:{key,value,assertion:value===null?'unknown':'proposal',record_ids:[]};});
 const prepared=prepareBusinessBrief(dir,{project_id:id,expected_revision:revision,operation_id:operationId(),at:new Date().toISOString().slice(0,10),language:'en',kind:'pilot',client:prior?.request.client??null,period:prior?.request.period??null,previous_artifact_id:input.previous,change_reason:prior?input.reason.trim():null,fields});
 prepared.document_markdown+='\n## Linked offer and open context\n\nOffer: '+input.offer_id+'\n\n'+warnings.map(w=>'- '+escape(w)).join('\n')+'\n\n'+expert+'\n';
 const saved=JSON.parse(prepared.content);saved.document_markdown=prepared.document_markdown;saved.preparation_context={offer_id:input.offer_id,scope_id:latestScope?.artifact_id??null,warnings,expert_review:'not_performed'};prepared.content=bytesFor(saved).toString('utf8');const artifact=prepared.update_request.changes.artifacts.find(a=>a.id===prepared.artifact_id);artifact.sha256=sha(prepared.content);
 prepared.update_request.changes.workflow.links.push({dependent_id:prepared.artifact_id,prerequisite_id:input.offer_id,reason:linkReason});if(latestScope)prepared.update_request.changes.workflow.links.push({dependent_id:prepared.artifact_id,prerequisite_id:latestScope.artifact_id,reason:'Pilot preparation retains the selected scope discussion points'});
 checkModel({...d,...prepared.update_request.changes});if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed');return {...prepared,warnings,missing};
}
