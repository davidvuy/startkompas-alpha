import {changeImpact,businessPreviewMarkdown} from './change-impact.mjs';
import {skillContextChoices,prepareSkillContext} from './skill-context.mjs';
import {scenariosView,compareScenario,prepareScenario,prepareScenarioAdoption} from './offer-scenarios.mjs';
import {pilotWorkflow,preparePilotWorkflow} from './pilot-workflow.mjs';
import {scopeView,prepareScope} from './scope-exercise.mjs';
import {alternativesView,prepareAlternatives} from './alternatives.mjs';
import {interviewPreparation,prepareInterview} from './interview-preparation.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {safeDirectory,regularFile,readCore} from './store.mjs';
import {initializeProject} from './initialize.mjs';
import {workspaceView,saveGuided,operationId,reportPreview,writeReport,isProjectArchived,isPracticeProject,prepareProjectArchive,prepareTaskState,prepareTaskFocus} from './workspace.mjs';
import {briefTypes,prepareBusinessBrief,readBusinessBrief,renderBusinessBrief,searchBusinessBriefs} from './business-brief.mjs';
import {retrieveRecords} from './retrieval.mjs';
import {dependencyGraph} from './dependencies.mjs';
import {listHistory} from './history.mjs';
import {compareRevisions,renderComparison} from './project-view.mjs';
import {decisionLog,prepareDecisionLog} from './decision-log.mjs';
import {researchQueue,prepareResearchPriority} from './research-priority.mjs';
import {sessionPlan,prepareSessionChoice} from './session-plan.mjs';
import {relationshipMap} from './relationship-map.mjs';
import {projectProfile,prepareProfileAnswer} from './project-profile.mjs';
import {durableRecovery} from './draft-recovery.mjs';

export class WorkspaceError extends Error {
 constructor(message,status=400){super(message);this.status=status;}
}
export function exactObject(value,keys){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!keys.includes(k))||keys.some(k=>!Object.hasOwn(value,k)))throw new WorkspaceError('The request is incomplete or contains unknown fields.');
}

// Shared application boundary: no alternate storage/schema or direct UI writes.
export function localWorkspace(selectedRoot){
 const root=safeDirectory(selectedRoot),handles=new Map(),references=new Map(),previews=new Map();
 const recovery=durableRecovery(root);
 const offerKeys=Object.keys(briefTypes.offer.fields);
 function startingFields(d){return Object.fromEntries([['segment','customer','Provisional customer: '],['outcome','outcome','Proposed outcome: ']].map(([key,suffix,prefix])=>{const record=d.assumptions.find(a=>a.id==='starting-'+suffix);return [key,record?.text.startsWith(prefix)?{value:record.text.slice(prefix.length),id:record.id}:null];}));}
 function requireActive(dir,id){if(isProjectArchived(readCore(dir,id).dossier))throw new WorkspaceError('This project is archived. Restore it before editing.',409);}
 function holdPreview(entry){
  for(const [key,value]of previews)if(value.expires<Date.now())previews.delete(key);
  if(previews.size>=20)previews.delete(previews.keys().next().value);
  const key=randomUUID();previews.set(key,{...entry,expires:Date.now()+15*60*1000});return key;
 }
 function shortText(value,label){if(typeof value!=='string'||value.length>4000)throw new WorkspaceError(label+' must be text of at most 4000 characters.');return value.trim();}
 function checkRoot(){if(fs.realpathSync(root)!==root)throw new WorkspaceError('The project folder has moved. Restart the workspace.',409);}
 function directory(folder){
  checkRoot();
  if(typeof folder!=='string'||!folder||folder==='.'||folder==='..'||/[\\/\0]/.test(folder))throw new WorkspaceError('Invalid project folder.');
  const dir=path.join(root,folder);
  if(fs.existsSync(dir)&&(fs.lstatSync(dir).isSymbolicLink()||fs.realpathSync(dir)!==dir))throw new WorkspaceError('Linked or relocated project folders cannot be opened.',409);
  return dir;
 }
 function register(folder,id){
  const key=JSON.stringify([folder,id]);
  if(!references.has(key)){const ref=randomUUID();references.set(key,ref);handles.set(ref,{folder,id});}
  return references.get(key);
 }
 function open(ref){
  if(typeof ref!=='string'||!handles.has(ref))throw new WorkspaceError('This project is not selected. Refresh the project list.',404);
  const {folder,id}=handles.get(ref),dir=directory(folder);
  try{readCore(dir,id);}catch{throw new WorkspaceError('Project unavailable or identity changed. Check the folder; your data has not been overwritten.',409);}
  return {dir,id,folder};
 }
 return {
  changeImpact(input){exactObject(input,['ref','id']);const {dir,id}=open(input.ref),state=readCore(dir,id);let result;try{result=changeImpact(state.dossier,[input.id]);}catch{throw new WorkspaceError('Choose an existing record for change impact.');}if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('Project changed; review impact again.',409);return {...result,sha256:state.sha256};},
  contextChoices(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);return skillContextChoices(dir,id);},
  contextPreview(input){exactObject(input,['ref','selection']);const {dir,id}=open(input.ref);if(input.selection?.project_id!==id)throw new WorkspaceError('Context project identity mismatch.',409);try{return prepareSkillContext(dir,input.selection);}catch{throw new WorkspaceError('Context selection is invalid or changed. Reload the selector; choose existing included fields, reduce oversized selections, and review again.',409);}},
  scenarios(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);return scenariosView(dir,id);},
  scenarioCompare(input){exactObject(input,['ref','id']);const {dir,id}=open(input.ref);return compareScenario(dir,id,input.id);},
  scenarioPreview(input){exactObject(input,['ref','revision','sha256','scenario']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareScenario(dir,id,input.revision,input.sha256,input.scenario);}catch{throw new WorkspaceError('Scenario cannot be prepared. Choose a current offer or current scenario version, explain the idea, and refresh changed context.',409);}return {preview:holdPreview({kind:'scenario',ref:input.ref,sha256:input.sha256,prepared}),scenario:prepared.preview};},
  scenarioAdoptPreview(input){exactObject(input,['ref','revision','sha256','id','reason']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareScenarioAdoption(dir,id,input.revision,input.sha256,input.id,input.reason);}catch{throw new WorkspaceError('Scenario cannot be adopted. Use its latest readable version, explain the choice, and refresh the comparison. Identical current fields need no new offer.',409);}return {preview:holdPreview({kind:'scenario-adoption',ref:input.ref,sha256:input.sha256,prepared}),markdown:businessPreviewMarkdown(prepared),rows:prepared.rows,changed_since_base:prepared.changed_since_base,current_offer:prepared.current_offer};},
  scenarioSave(input){exactObject(input,['ref','preview','confirmed','acknowledge_current_changes']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact scenario preview.');const entry=previews.get(input.preview);if(!entry||!['scenario','scenario-adoption'].includes(entry.kind)||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Scenario preview missing or expired.',409);if(entry.kind==='scenario-adoption'&&entry.prepared.changed_since_base&&input.acknowledge_current_changes!==true)throw new WorkspaceError('Review and acknowledge the changed main offer before adopting this scenario.');const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview the scenario again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1,adopted:entry.kind==='scenario-adoption'};return entry.receipt;},
  pilots(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);return pilotWorkflow(dir,id);},
  pilotPreview(input){exactObject(input,['ref','revision','sha256','pilot']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=preparePilotWorkflow(dir,id,input.revision,input.sha256,input.pilot);}catch{throw new WorkspaceError('Pilot cannot be prepared. Describe one deliverable, choose current offer/pilot versions, explain revisions, and refresh changed context.',409);}return {preview:holdPreview({kind:'pilot',ref:input.ref,sha256:input.sha256,prepared}),markdown:businessPreviewMarkdown(prepared),warnings:prepared.warnings,missing:prepared.missing};},
  pilotSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact pilot draft.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='pilot'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Pilot preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; prepare the pilot again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  scope(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);return scopeView(dir,id);},
  scopePreview(input){exactObject(input,['ref','revision','sha256','scope']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareScope(dir,id,input.revision,input.sha256,input.scope);}catch{throw new WorkspaceError('Scope review cannot be prepared. Choose a current offer, explain judgments/revisions, use a shared period for hours, and refresh changed context.',409);}return {preview:holdPreview({kind:'scope',ref:input.ref,sha256:input.sha256,prepared}),markdown:prepared.markdown,points:prepared.points};},
  scopeSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the scope discussion points.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='scope'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Scope preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; review scope again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  alternatives(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);return {archived:isProjectArchived(readCore(dir,id).dossier),...alternativesView(dir,id)};},
  alternativesPreview(input){exactObject(input,['ref','revision','sha256','comparison']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareAlternatives(dir,id,input.revision,input.sha256,input.comparison);}catch{throw new WorkspaceError('Comparison cannot be prepared. Include current work and doing nothing, use distinct names, link sources for findings, and refresh changed or unavailable versions.',409);}return {preview:holdPreview({kind:'alternatives',ref:input.ref,sha256:input.sha256,prepared}),...prepared.preview};},
  alternativesSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact comparison.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='alternatives'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Comparison preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  interviews(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);return interviewPreparation(dir,id);},
  interviewPreview(input){exactObject(input,['ref','revision','sha256','kind','basis']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareInterview(dir,id,input.revision,input.sha256,input.kind,input.basis);}catch{throw new WorkspaceError('Preparation unavailable. Choose a current offer or a readable guide with unchanged context, then refresh.',409);}return {preview:holdPreview({kind:'interview',ref:input.ref,sha256:input.sha256,prepared}),markdown:prepared.markdown};},
  interviewSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the preparation first.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='interview'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Preparation preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  decisions(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);return {archived:isProjectArchived(readCore(dir,id).dossier),...decisionLog(dir,id)};},
  decisionPreview(input){exactObject(input,['ref','revision','sha256','decision']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareDecisionLog(dir,id,input.revision,input.sha256,input.decision);}catch{throw new WorkspaceError('Decision could not be prepared. Check the fields/date and current version; inspect unavailable older details before revising.',409);}return {preview:holdPreview({kind:'decision',ref:input.ref,sha256:input.sha256,prepared}),...prepared.preview};},
  decisionSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact decision preview.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='decision'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Decision preview missing or expired. Prepare it again.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed after decision preview. Review again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={revision:entry.prepared.update_request.expected_revision+1,record_id:entry.prepared.record_id};return entry.receipt;},
  research(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);return {archived:isProjectArchived(readCore(dir,id).dossier),...researchQueue(dir,id)};},
  researchSave(input){exactObject(input,['ref','revision','sha256','assessment','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm your research priority first.');const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareResearchPriority(dir,id,input.revision,input.sha256,input.assessment);}catch{throw new WorkspaceError('Priority could not be prepared. Check the assessment/date, refresh changed records and inspect unavailable previous ratings.',409);}saveGuided(dir,prepared,path.join(root,'retry-'+prepared.update_request.operation_id));return {revision:input.revision+1,artifact_id:prepared.artifact_id};},
  sessionPlan(input){exactObject(input,['ref','target','scope','obstacle','intent']);const {dir,id}=open(input.ref);try{return sessionPlan(dir,id,input);}catch{throw new WorkspaceError('Session choices could not be read. Use an existing record and valid scope, or refresh the project.',409);}},
  sessionPreview(input){exactObject(input,['ref','target','scope','obstacle','intent']);const {dir,id}=open(input.ref);requireActive(dir,id);let plan,prepared;try{plan=sessionPlan(dir,id,input);prepared=prepareSessionChoice(dir,id,plan);}catch{throw new WorkspaceError('Describe a concrete intended result (maximum 1000 characters), then review the current project again.',409);}
   const decision=prepared.update_request.changes.decisions.at(-1);return {preview:holdPreview({kind:'session',ref:input.ref,sha256:plan.sha256,prepared}),text:decision.text,reason:decision.reason,basis_ids:decision.basis_ids,revision:plan.revision,plan};},
  sessionSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact session choice first.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='session'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Session preview missing or expired. Prepare it again.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed after preview. Review a new session choice.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={revision:entry.prepared.update_request.expected_revision+1,record_id:entry.prepared.record_id};return entry.receipt;},
  connections(input){exactObject(input,['ref','id']);const {dir,id}=open(input.ref);try{return relationshipMap(dir,id,input.id);}catch{throw new WorkspaceError('Recorded connections could not be read. Refresh the project and select an existing record.',409);}},
  profile(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);return {archived:isProjectArchived(readCore(dir,id).dossier),...projectProfile(dir,id)};},
  profileSave(input){
   exactObject(input,['ref','revision','sha256','key','value','date','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm this profile answer first.');
   const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;
   try{prepared=prepareProfileAnswer(dir,id,input.revision,input.sha256,input.key,input.value,input.date);}catch{throw new WorkspaceError('Profile answer could not be prepared. Check the date and fields, then reopen the profile if it changed or has conflicting records.',409);}
   saveGuided(dir,prepared,path.join(root,'retry-'+operationId()));return {revision:input.revision+1};
  },
  recoveryList(input){exactObject(input,[]);try{return recovery.list();}catch{throw new WorkspaceError('Recovery copies cannot be read. Inspect the .startkompas-recovery folder; no files were replaced.',409);}},
  recoverySave(input){exactObject(input,['kind','data','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Confirm keeping this private text on disk first.');try{return recovery.save(input.kind,input.data);}catch{throw new WorkspaceError('Recovery copy could not be kept. Check the fields and recovery folder, and keep fewer than 50 copies. Your project was not changed.',409);}},
  recoveryRead(input){exactObject(input,['id']);try{return recovery.read(input.id);}catch{throw new WorkspaceError('This recovery copy is unavailable, damaged or older than seven days. No project was changed.',409);}},
  recoveryForget(input){exactObject(input,['id','sha256','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Confirm forgetting this recovery copy first.');try{return recovery.forget(input.id,input.sha256);}catch{throw new WorkspaceError('Recovery copy could not be forgotten. Refresh the list before trying again.',409);}},
  list(){
   checkRoot();const projects=[],unavailable=[];let count=0;
   const iterator=fs.opendirSync(root);
   try{for(let entry;(entry=iterator.readSync())!==null;){
    if(++count>200)throw new WorkspaceError('This folder contains too many entries. Choose a smaller project folder.',413);
    if(entry.isSymbolicLink())continue;
    if(!entry.isDirectory())continue;
    const dir=directory(entry.name),file=path.join(dir,'project.json');
    if(!fs.existsSync(file))continue;
    try{
     const id=JSON.parse(regularFile(file)).project_id,{dossier:d}=readCore(dir,id);
     projects.push({ref:register(entry.name,id),folder:entry.name,id:d.project_id,name:d.name,revision:d.revision,practice:isPracticeProject(d),archived:isProjectArchived(d),updated:fs.statSync(file).mtime.toISOString()});
    }catch{unavailable.push(entry.name);}
   }}finally{iterator.closeSync();}
   return {root,projects:projects.sort((a,b)=>b.updated.localeCompare(a.updated)),unavailable};
  },
  create(input){
   exactObject(input,['id','name','task','confirmed',...(Object.hasOwn(input??{},'practice')?['practice']:[]),...(Object.hasOwn(input??{},'context')?['context']:[])]);
   if(Object.hasOwn(input,'context')){exactObject(input.context,['customer','outcome']);for(const value of Object.values(input.context))if(typeof value!=='string'||value.length>2000)throw new WorkspaceError('Starting context must be text of at most 2000 characters per field.');}
   if(Object.hasOwn(input,'practice')&&typeof input.practice!=='boolean')throw new WorkspaceError('Practice must be true or false.');
   if(input.confirmed!==true)throw new WorkspaceError('Confirm project creation first.');
   if(typeof input.id!=='string'||! /^[a-z0-9][a-z0-9-]{0,63}$/.test(input.id))throw new WorkspaceError('Use lowercase letters, numbers and hyphens for the project ID (maximum 64).');
   for(const field of ['name','task'])if(typeof input[field]!=='string'||input[field].length>4000||(field==='name'&&!input[field].trim()))throw new WorkspaceError('Enter a project name and keep each field under 4001 characters.');
   const dir=directory(input.id);
   if(fs.existsSync(dir))throw new WorkspaceError('This folder already exists. Choose another ID or open the existing project.',409);
   initializeProject(dir,{project_id:input.id,name:input.name.trim(),practice:input.practice===true,first_task:input.task.trim()?{id:'first-task',title:input.task.trim()}:null,...(input.context?{context:input.context}:{})});
   return {ref:register(input.id,input.id)};
  },
  show(ref){const {dir,id,folder}=open(ref);return {folder,...workspaceView(dir,id)};},
  draft(input){
   exactObject(input,['ref','id']);const {dir,id}=open(input.ref),state=readCore(dir,id);
   let draft,markdown;try{draft=readBusinessBrief(dir,id,input.id);markdown=renderBusinessBrief(dir,id,input.id);}catch{throw new WorkspaceError('This saved draft is unavailable or damaged. No file was changed.',409);}
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed. Open the draft again.',409);
   return {id:draft.artifact_id,version:draft.version,kind:draft.request.kind,markdown,requires_review:draft.requires_review,historical:draft.successor_ids.length>0,successors:draft.successor_ids,basis_ids:[...new Set(draft.fields.flatMap(f=>f.record_ids))]};
  },
  search(input){
   exactObject(input,['ref','revision','query','offset']);const {dir,id}=open(input.ref),state=readCore(dir,id);
   let result;try{result=retrieveRecords(dir,{project_id:id,source_revision:input.revision,query:input.query,groups:[],ids:[],offset:input.offset,limit:25});}catch{throw new WorkspaceError('Search could not run. Refresh the project and use a query of at most 1000 characters.',409);}
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed during search. Refresh it and search again.',409);
   return result;
  },
  draftSearch(input){
   exactObject(input,['ref','revision','query','offset']);const {dir,id}=open(input.ref);
   try{return searchBusinessBriefs(dir,id,input.revision,input.query,input.offset);}catch{throw new WorkspaceError('Draft search could not run. Refresh the project and check your query.',409);}
  },
  record(input){
   exactObject(input,['ref','id']);const {dir,id}=open(input.ref),state=readCore(dir,id);
   let result;try{result=retrieveRecords(dir,{project_id:id,source_revision:state.dossier.revision,query:'',groups:[],ids:[input.id],offset:0,limit:1});}catch{throw new WorkspaceError('Invalid record selection.');}
   if(!result.records.length)throw new WorkspaceError('This record is no longer available.',404);
   const graph=dependencyGraph(state.dossier),label=key=>{const r=graph.index.get(key);return {id:key,group:r.group,title:r.title??r.text??r.description??key};};
   const prerequisites=[...graph.edges.get(input.id)].map(([key,reason])=>({...label(key),reason})),dependents=graph.reverse.get(input.id).map(label);
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed. Open the record again.',409);
   return {record:result.records[0],revision:state.dossier.revision,sha256:state.sha256,archived:isProjectArchived(state.dossier),active_task_id:state.dossier.active_task_id,prerequisites:prerequisites.slice(0,100),dependents:dependents.slice(0,100),truncated:prerequisites.length>100||dependents.length>100};
  },
  taskUpdate(input){
   exactObject(input,['ref','id','revision','sha256','action','reason','confirmed']);
   if(input.confirmed!==true)throw new WorkspaceError('Confirm the displayed task change first.');
   const {dir,id}=open(input.ref),state=readCore(dir,id);requireActive(dir,id);
   if(state.dossier.revision!==input.revision||state.sha256!==input.sha256)throw new WorkspaceError('The project changed. Reopen the task before updating it.',409);
   let prepared;try{prepared=input.action==='focus'?prepareTaskFocus(dir,id,input.revision,input.id,input.reason):prepareTaskState(dir,id,input.revision,input.id,input.action,input.reason);}catch{throw new WorkspaceError('Choose a valid task change and provide a reason. Completed/deferred tasks cannot become the focus.',400);}
   saveGuided(dir,prepared,directory('retry-'+prepared.update_request.operation_id));
   return {revision:input.revision+1};
  },
  history(input){
   exactObject(input,['ref']);const {dir,id}=open(input.ref),state=readCore(dir,id);
   const history=listHistory(dir,id);
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed. Open history again.',409);
   return {revision:state.dossier.revision,...history,events:state.dossier.events.slice(-100).reverse(),events_truncated:state.dossier.events.length>100};
  },
  compare(input){
   exactObject(input,['ref','before','after']);const {dir,id}=open(input.ref),state=readCore(dir,id);
   let result;try{result=compareRevisions(dir,id,input.before,input.after);}catch{throw new WorkspaceError('These revisions cannot be compared. Refresh history and choose readable, unambiguous revisions.',409);}
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed during comparison. Refresh history.',409);
   return {markdown:renderComparison(result)};
  },
  offerForm(input){
   exactObject(input,['ref','previous']);const {dir,id}=open(input.ref);
   requireActive(dir,id);
   if(input.previous!==null&&typeof input.previous!=='string')throw new WorkspaceError('Invalid previous draft.');
   const prior=input.previous===null?null:readBusinessBrief(dir,id,input.previous);
   if(prior&&(prior.request.kind!=='offer'||prior.successor_ids.length))throw new WorkspaceError('Select the latest offer version before editing.',409);
   const state=readCore(dir,id);
   const initial=startingFields(state.dossier);
   return {revision:state.dossier.revision,sha256:state.sha256,previous:input.previous,client:prior?.request.client??'',period:prior?.request.period??'',fields:offerKeys.map(key=>{const field=prior?.fields.find(f=>f.key===key),value=prior?(field?.value??''):(initial[key]?.value??'');return {key,label:briefTypes.offer.fields[key][1],value,assertion:field?.assertion??(value?'proposal':'unknown'),record_ids:field?.record_ids??(initial[key]?[initial[key].id]:[]),requires_review:prior?.requires_review??false};})};
  },
  offerLatest(input){
   exactObject(input,['ref','previous']);const {dir,id}=open(input.ref),state=readCore(dir,id);requireActive(dir,id);
   if(input.previous!==null&&typeof input.previous!=='string')throw new WorkspaceError('Invalid previous draft.');
   let previous=input.previous;const visited=new Set();
   try{while(previous!==null){
    if(visited.has(previous)||visited.size>=100)throw Error('Invalid revision chain');visited.add(previous);
    const draft=readBusinessBrief(dir,id,previous);if(draft.request.kind!=='offer'||draft.successor_ids.length>1)throw Error('Ambiguous offer');
    if(!draft.successor_ids.length)break;previous=draft.successor_ids[0];
   }}catch{throw new WorkspaceError('The offer history cannot be followed safely. Open the project and inspect its saved drafts.',409);}
   const result=this.offerForm({ref:input.ref,previous});
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed. Compare again.',409);
   return result;
  },
  offerRestore(input){
   exactObject(input,['ref','id']);const {dir,id}=open(input.ref),state=readCore(dir,id);requireActive(dir,id);
   let source;try{source=readBusinessBrief(dir,id,input.id);if(source.request.kind!=='offer'||!source.successor_ids.length)throw Error('Not a historical offer');}catch{throw new WorkspaceError('Choose an available historical offer. Damaged or current drafts cannot be restored here.',409);}
   const latest=this.offerLatest({ref:input.ref,previous:input.id});
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed. Open the historical offer again.',409);
   return {latest,source_id:input.id,source_version:source.version,fields:Object.fromEntries(source.fields.map(f=>[f.key,f.value??'']))};
  },
  offerPreview(input){
   exactObject(input,['ref','previous','revision','sha256','client','period','reason','fields']);
   exactObject(input.fields,offerKeys);const {dir,id}=open(input.ref),state=readCore(dir,id);
   requireActive(dir,id);
   if(input.revision!==state.dossier.revision||input.sha256!==state.sha256)throw new WorkspaceError('The project changed. Reopen the offer before preparing a new preview.',409);
   if(input.previous!==null&&typeof input.previous!=='string')throw new WorkspaceError('Invalid previous draft.');
   const prior=input.previous===null?null:readBusinessBrief(dir,id,input.previous);
   const client=shortText(input.client,'Client/context')||null,period=shortText(input.period,'Period')||null,reason=shortText(input.reason,'Change reason');
   if(input.previous!==null&&!reason)throw new WorkspaceError('Explain why you are revising this offer.');
   const fields=offerKeys.map(key=>{
    const value=shortText(input.fields[key],briefTypes.offer.fields[key][1])||null,old=prior?.request.fields.find(f=>f.key===key);
    const initial=prior?null:startingFields(state.dossier)[key];
    return old&&old.value===value?structuredClone(old):{key,value,assertion:value===null?'unknown':'proposal',record_ids:initial&&initial.value===value?[initial.id]:[]};
   });
   let prepared;
   try{prepared=prepareBusinessBrief(dir,{project_id:id,expected_revision:state.dossier.revision,operation_id:operationId(),at:new Date().toISOString().slice(0,10),language:'en',kind:'offer',client,period,previous_artifact_id:input.previous,change_reason:input.previous===null?null:reason,fields});}
   catch{throw new WorkspaceError('This offer cannot be prepared. Check its context and latest version, then reopen it.',409);}
   const preview=holdPreview({kind:'offer',ref:input.ref,sha256:state.sha256,prepared});
   return {preview,markdown:businessPreviewMarkdown(prepared),revision:state.dossier.revision,expires_in_seconds:900};
  },
  offerSave(input){
   exactObject(input,['ref','preview','confirmed']);
   if(input.confirmed!==true)throw new WorkspaceError('Confirm saving the displayed preview first.');
   const entry=previews.get(input.preview);
   if(!entry||entry.kind!=='offer'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('The preview is missing or expired. Prepare it again.',409);
   const {dir,id}=open(input.ref);
   if(entry.receipt)return entry.receipt;
   requireActive(dir,id);
   if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('The project changed after preview. Reopen the offer and review a fresh preview.',409);
   // The browser cannot choose a filesystem destination. Retry material is retained
   // in a unique sibling folder using the same operation as the CLI.
   const retry=directory('retry-'+entry.prepared.update_request.operation_id);
   let receipt;try{receipt=saveGuided(dir,entry.prepared,retry);}catch{throw new WorkspaceError('Saving did not complete. Check the project and its retry folder before trying again.',409);}
   entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1,retry_folder:path.basename(receipt.retry_bundle)};
   return entry.receipt;
  },
  reportPreview(input){
   exactObject(input,['ref','sections']);const {dir,id}=open(input.ref);
   let report;try{report=reportPreview(dir,id,input.sections);}catch{throw new WorkspaceError('Cannot preview this selection. Choose valid sections and check for unreadable drafts.',409);}
   const preview=holdPreview({kind:'report',ref:input.ref,report});
   return {preview,markdown:report.markdown,revision:report.revision,sections:report.sections};
  },
  reportSave(input){
   exactObject(input,['ref','preview','confirmed']);
   if(input.confirmed!==true)throw new WorkspaceError('Confirm saving the displayed report first.');
   const entry=previews.get(input.preview);
   if(!entry||entry.kind!=='report'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('The report preview is missing or expired. Prepare it again.',409);
   const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;
   const filename='report-'+id+'-'+randomUUID()+'.md';
   try{const saved=writeReport(dir,id,entry.report.sections,entry.report.confirmation_sha256,directory(filename));entry.receipt={filename,path:saved.saved,sha256:saved.sha256,revision:saved.revision};}
   catch{throw new WorkspaceError('The report could not be saved. The project may have changed; prepare a fresh preview.',409);}
   return entry.receipt;
  },
  archive(input){
   exactObject(input,['ref','revision','sha256','archived','confirmed']);
   if(input.confirmed!==true||typeof input.archived!=='boolean')throw new WorkspaceError('Confirm the requested archive or restore action.');
   const {dir,id}=open(input.ref),state=readCore(dir,id);
   if(state.dossier.revision!==input.revision||state.sha256!==input.sha256)throw new WorkspaceError('The project changed. Refresh before archiving or restoring.',409);
   if(isProjectArchived(state.dossier)===input.archived)return {archived:input.archived,revision:state.dossier.revision};
   const prepared=prepareProjectArchive(dir,id,input.revision,input.archived);
   saveGuided(dir,prepared,directory('retry-'+prepared.update_request.operation_id));
   return {archived:input.archived,revision:input.revision+1};
  }
 };
}
