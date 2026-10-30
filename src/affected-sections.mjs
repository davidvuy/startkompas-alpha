import {readCore,bytesFor,sha} from './store.mjs';
import {briefTypes,readBusinessBrief} from './business-brief.mjs';
import {compareDocuments} from './document-comparison.mjs';
import {dependencyGraph} from './dependencies.mjs';
import {prepareDocumentSection} from './document-section.mjs';
import {cleanText} from './project-view.mjs';

const rulesVersion='editorial-section-rules-v1';
// Editorial prompts are explicit product rules, not recorded customer evidence.
const rules={
 offer:{segment:{job:'A different customer may have a different job.',outcome:'Check whether the result suits the new customer.',delivery:'Check whether delivery fits the new customer context.',workaround:'The current alternative may differ by customer.'},job:{outcome:'Check whether the proposed result addresses the revised job.',delivery:'Check delivery against the revised job.'},outcome:{delivery:'Check what must be delivered for the revised result.',exclusions:'Clarify what the revised result does not include.'},delivery:{exclusions:'Check exclusions against the changed delivery scope.',next_check:'Check which delivery uncertainty should be tested next.'}},
 pilot:{deliverable:{exclusions:'Clarify limits of the revised deliverable.',responsibilities:'Check who supplies and reviews the revised deliverable.',acceptance:'Align the observable acceptance check with the deliverable.'},period:{responsibilities:'Check responsibilities against the revised period.',stop:'Review stop conditions for the revised period.'},client:{learning:'Check whether the learning objective fits the client.',data_limits:'Review data boundaries for this client context.'}},
 pricing:{price:{terms:'Clarify units, timing and conditions of the revised price.',costs:'Check which costs the revised price includes.'},costs:{price:'Review the price assumption after cost changes.'},buyer:{terms:'Check which terms the revised buyer can decide.'}},
 interview:{learning:{recent_job:'Align the recent-experience question with the revised learning goal.',workaround:'Check the workaround question against the learning goal.',decision_rule:'Review the decision rule before collecting answers.'},participant:{recent_job:'Check whether the question fits the participant context.'}},
 alternatives:{job:{alternatives:'Check whether the options address the revised job.',constraints:'Compare options using constraints relevant to the revised job.'},current_workaround:{alternatives:'Compare options against the revised current workaround.'},constraints:{next_check:'Select the next comparison needed after constraint changes.'}}
};
export function affectedSections(dir,id,before,after){
 const state=readCore(dir,id),comparison=compareDocuments(dir,id,before,after),source=readBusinessBrief(dir,id,after);
 if(source.successor_ids.length)throw Error('Open the current later version before selecting revisions');
 const candidates=new Map(),reviews=[],unavailable=[];
 function add(draft,key,reason){const field=draft.fields.find(f=>f.key===key);if(!field)throw Error('Missing target section');const identity=draft.artifact_id+':'+key;
  if(!candidates.has(identity))candidates.set(identity,{document_id:draft.artifact_id,version:draft.version,kind:draft.request.kind,key,label:briefTypes[draft.request.kind].fields[key][1],reasons:[]});
  candidates.get(identity).reasons.push(reason);
 }
 for(const change of comparison.changes.filter(c=>c.before.value!==c.after.value))for(const [key,reason] of Object.entries(rules[source.request.kind]?.[change.key]??{})){
  if(comparison.changes.some(c=>c.key===key))continue;
  add(source,key,{kind:'editorial_rule',from:change.key,description:reason});
 }
 const graph=dependencyGraph(state.dossier),parents=new Map([[before,null]]),queue=[before];
 for(let i=0;i<queue.length;i++)for(const dependent of graph.reverse.get(queue[i])??[])if(!parents.has(dependent)){parents.set(dependent,queue[i]);queue.push(dependent);}
 function pathToChanged(recordId){const path=[];let from=recordId;while(parents.get(from)!==null){if(path.length>=200)throw Error('Dependency explanation exceeds 200 links');const to=parents.get(from);path.push({from,to,reason:graph.edges.get(from).get(to)});from=to;}return path;}

 const historical=new Set(state.dossier.events.filter(e=>e.type==='business-brief-draft').map(e=>e.subject_ids[1]).filter(Boolean));
 const current=[...new Set(state.dossier.events.filter(e=>e.type==='business-brief-draft').map(e=>e.subject_ids[0]))].filter(x=>!historical.has(x)&&x!==after);
 if(current.length>200)throw Error('More than 200 current documents; no partial section selection');
 for(const artifactId of current){let draft;try{draft=readBusinessBrief(dir,id,artifactId);}catch{unavailable.push(artifactId);continue;}
  let matched=false;
  for(const field of draft.fields)for(const basisId of field.record_ids)if(parents.has(basisId)){matched=true;add(draft,field.key,{kind:'recorded_basis',from:basisId,description:'This section cites a record affected by the earlier document.',path:pathToChanged(basisId)});}
  if(parents.has(artifactId)&&!matched)reviews.push({document_id:artifactId,kind:draft.request.kind,version:draft.version,path:pathToChanged(artifactId),reason:'Document-level dependency only. No field-specific link identifies which text to revise; inspect the document before choosing.'});
 }
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed; review selection again');
 return {revision:state.dossier.revision,sha256:state.sha256,before,after,rules_version:rulesVersion,candidates:[...candidates.values()],document_reviews:reviews,unavailable,
  warning:'Suggestions for review, not mandatory edits. Editorial rules are not recorded evidence. Recorded links may omit real dependencies. Already changed sections are not suggested again by editorial rules. Unrelated manual text stays unchanged; nothing is automatically rewritten.'};
}
export function prepareAffectedSection(dir,id,revision,digest,before,after,input){
 const view=affectedSections(dir,id,before,after);
 if(view.revision!==revision||view.sha256!==digest)throw Error('Project changed; refresh affected sections');
 const candidate=view.candidates.find(c=>c.document_id===input?.artifact_id&&c.key===input?.key);
 if(!candidate)throw Error('This section is not in the displayed affected selection');
 const prepared=prepareDocumentSection(dir,id,revision,digest,input),context={before,after,target:input.artifact_id,key:input.key,rules_version:rulesVersion,reasons:candidate.reasons};
 const details=['','## Why this section was selected','',...candidate.reasons.map(r=>'- '+(r.kind==='editorial_rule'?'Editorial rule':'Recorded basis')+' from '+cleanText(r.from)+': '+cleanText(r.description)),...candidate.reasons.flatMap(r=>(r.path??[]).map(p=>'- '+cleanText(p.from)+' → '+cleanText(p.to)+': '+cleanText(p.reason))),'','Only the selected field is revised. Other saved fields and provenance are retained.'];
 prepared.document_markdown+=details.join('\n')+'\n';
 const saved=JSON.parse(prepared.content);saved.document_markdown=prepared.document_markdown;saved.revision_context=context;prepared.content=bytesFor(saved).toString('utf8');
 prepared.update_request.changes.artifacts.find(a=>a.id===prepared.artifact_id).sha256=sha(prepared.content);
 if(readCore(dir,id).sha256!==digest)throw Error('Project changed during revision preparation');
 return {...prepared,selection_context:context};
}
