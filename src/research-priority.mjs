import {validate,latest,load,basisFingerprint,priorityRows} from './research-order.mjs';
import {randomUUID} from 'node:crypto';
import {readCore,bytesFor,sha} from './store.mjs';
import {dependencyGraph} from './dependencies.mjs';
import {researchFindings} from './research-findings.mjs';
import {checkModel} from './model.mjs';
export function researchQueue(dir,id){
 const state=readCore(dir,id),d=state.dossier;
 let findings=null;try{const result=researchFindings(dir,id);if(result.sha256!==state.sha256)throw Error('Project changed');findings=result.items;}catch{}
 const rows=priorityRows(state).slice(0,200).map(row=>{const a=row;
  const linked=findings?.filter(f=>f.input.assumption_id===a.id),current=linked?.filter(f=>f.assumption_status==='unchanged'&&f.source_status==='unchanged');
  const learning={status:!linked?'unavailable':!linked.length?'no_findings':current.length!==linked.length?'review_required':'findings_recorded',recorded_count:linked?.length??null,current_count:current?.length??null,review_count:linked?linked.length-current.length:null,finding_ids:linked?.map(f=>f.artifact_id)??[]};
  return {...row,learning};});
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed while reading research priorities');
 return {revision:d.revision,sha256:state.sha256,learning_warning:'Linked findings are research associations, not answered questions or independent evidence. Review flags reflect changed or unavailable source/assumption context, not an automatic age expiry. Unlinked experiment observations do not answer an assumption.',rows,total:d.assumptions.length,partial:d.assumptions.length>200,order:'Your priority first; then stated impact, stated uncertainty and number of direct work dependents (priority history excluded). Unassessed, stale or unavailable ratings rank as unset/unknown. No combined market score.'};
}
export function prepareResearchPriority(dir,id,revision,digest,request){
 if(!validate(request)||Number.isNaN(Date.parse(request.date+'T00:00:00Z'))||new Date(request.date+'T00:00:00Z').toISOString().slice(0,10)!==request.date)throw Error('Invalid priority assessment');
 const state=readCore(dir,id),d=state.dossier;if(d.revision!==revision||state.sha256!==digest)throw Error('Project changed');const assumption=d.assumptions.find(a=>a.id===request.assumption_id);if(!assumption)throw Error('Unknown assumption');
 const previous=latest(d,assumption.id),prior=previous?load(state,previous):null,artifactId='priority-'+randomUUID(),version=(prior?.version??0)+1;
 const saved={format:'startkompas-research-priority-v1',project_id:id,artifact_id:artifactId,version,previous,basis_sha256:basisFingerprint(dependencyGraph(d),assumption.id),origin:'user_statement',request:structuredClone(request)},content=bytesFor(saved).toString('utf8');if(Buffer.byteLength(content)>32768)throw Error('Priority assessment too large');
 const artifact={id:artifactId,version:String(version),storage:'local',location:'files/'+artifactId+'.json',availability:'available',sha256:sha(content)};
 const update_request={project_id:id,expected_revision:revision,operation_id:'research-'+randomUUID(),changes:{artifacts:[...d.artifacts,artifact],events:[...d.events,{id:'priority-event-'+randomUUID(),type:'research-priority',at:request.date,description:'User-stated research priority; not evidence or market validation',subject_ids:[artifactId,assumption.id,...(previous?[previous]:[])]}],workflow:{...d.workflow,links:[...d.workflow.links,{dependent_id:artifactId,prerequisite_id:assumption.id,reason:'User priority assessment concerns this assumption'}]}}};
 checkModel({...d,...update_request.changes});return {artifact_id:artifactId,content,update_request};
}
