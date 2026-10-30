import {readCore} from './store.mjs';
import {workspaceView,prepareRecord} from './workspace.mjs';
import {records} from './dependencies.mjs';
import {projectProfile} from './project-profile.mjs';
const scopes={brief:1,focused:2,extended:3};
const obstacles={none:null,information:['Write one unanswered question','One question and a source you can actually inspect; missing information stays unknown.'],choice:['Compare two concrete options','Two options, one decision criterion and what would make you reconsider.'],time:['Reduce the result to one reversible action','One bounded action and an explicit stopping point; no duration estimate.'],technology:['Describe one reproducible technical problem','A fictional or redacted reproduction, expected behavior and actual behavior; nothing is submitted.'],access:['Prepare a feasible access or alternative-source plan','One invitation draft or a named available source to inspect. No interview or response is invented.']};
export function sessionPlan(dir,id,{target=null,scope='brief',obstacle='none',intent=''}){
 if(!Object.hasOwn(scopes,scope)||!Object.hasOwn(obstacles,obstacle)||typeof intent!=='string'||intent.length>1000)throw Error('Invalid session choices');
 const state=readCore(dir,id),view=workspaceView(dir,id),index=records(state.dossier),chosen=target??view.next.record_id;
 if(chosen!==null&&(!index.has(chosen)||index.get(chosen).group==='events'))throw Error('Choose an existing work record');
 const label=key=>{const r=index.get(key);return {id:key,title:r.title??r.text??r.key??key,group:r.group};};
 const action=view.actions.find(a=>a.id===chosen),blocked=[...new Set([...(action?.blocked_by??[]),...view.blockers.map(b=>b.id)])];
 const profile=projectProfile(dir,id).fields,context=profile.filter(f=>f.records.length).map(f=>({key:f.key,label:f.label,records:f.records}));
 const why=target===null?view.next.reason:'You explicitly selected this record. This does not override blockers or prove readiness.';
 const first=blocked.length?['Review the recorded blocker before expanding work','Open the linked record, state what is missing and prepare one check. Do not mark it resolved without evidence.']:obstacles[obstacle]??(view.next.kind==='assumption'&&target===null?['Prepare a check of this assumption','One neutral question and what observation would change your next decision. No answer is invented.']:['Prepare one concrete next action','A small reversible action toward your intended result, with a visible stopping point.']);
 const steps=[{title:first[0],output:first[1]},{title:'Use the available project context',output:obstacle==='access'?'Inspect one source already available to you, or finish an invitation draft. Keep missing access explicit.':'Inspect one linked record or stated constraint; separate its claims from what still needs checking.'},{title:'Record what changed and what remains open',output:'Write the actual result if you performed the work; otherwise retain this as a plan. Choose one next check without claiming completion.'}].slice(0,scopes[scope]);
 const ids=[...new Set([view.next.record_id,...view.actions.map(a=>a.id),...view.checks.map(c=>c.id),...view.assumptions.map(a=>a.id)].filter(Boolean))];
 const alternatives=ids.slice(0,50).map(key=>{const a=view.actions.find(x=>x.id===key);return {...label(key),reason:key===view.next.record_id?view.next.reason:a?.blocked_by.length?'Has unresolved recorded prerequisites':a?.requires_review?'Requires review before reuse':'Available recorded work; not automatically approved',blocked_by:a?.blocked_by??[]};});
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed while planning');
 return {revision:view.revision,sha256:view.sha256,archived:view.archived,target:chosen?label(chosen):null,scope,obstacle,intent:intent.trim(),why,steps,blockers:blocked.map(label),context,alternatives,alternatives_truncated:ids.length>50,limitation:'A planning aid, not execution, evidence approval or a time estimate. Scope is chosen by you; available time and constraints are user statements, not inferred capacity.'};
}
export function prepareSessionChoice(dir,id,plan){
 if(!plan.intent)throw Error('Describe a concrete intended result before saving a session choice');
 const state=readCore(dir,id);if(state.dossier.revision!==plan.revision||state.sha256!==plan.sha256)throw Error('Project changed');
 const text=['Planned work session','Scope: '+plan.scope,'Target record: '+(plan.target?.id??'new offer'),'Intended result: '+plan.intent,'Obstacle reported: '+plan.obstacle,...plan.steps.map((s,i)=>(i+1)+'. '+s.title+' — '+s.output),'No work or evidence is marked complete by this choice.'].join('\n');
 const basis_ids=[...new Set([plan.target?.id,...plan.blockers.map(b=>b.id),...plan.context.flatMap(c=>c.records.map(r=>r.id))].filter(Boolean))];
 return prepareRecord(dir,id,plan.revision,'decision',{text,reason:'User-selected scope and intended result, reviewed before saving. '+plan.why,basis_ids});
}
