import {taskResponsibilities,prepareTaskResponsibility} from './task-responsibilities.mjs';
import {feedbackDecisions,prepareFeedbackDecision} from './feedback-decisions.mjs';
import {mentorReview,writeMentorReview} from './mentor-review.mjs';
import {inspectReviewOriginal,reviewFeedbackTemplate,prepareReviewFeedback,reviewFeedbackHistory} from './review-feedback.mjs';
import {reviewPackage,writeReviewPackage} from './review-package.mjs';
import {experimentReviews,prepareExperimentReview} from './experiment-reviews.mjs';
import {experimentRuns,prepareExperimentStart,prepareExperimentObservation} from './experiment-runs.mjs';
import {researchConflicts,prepareConflictCandidate,prepareConflictReview} from './research-conflicts.mjs';
import {findingClassifications,prepareFindingClassification} from './finding-classifications.mjs';
import {prepareSourceRemoval,applySourceRemoval,sourceRemovalRecovery,confirmSourceRemovalRecovery} from './source-removal.mjs';
import {sourceManagement,prepareSourceRetention} from './source-retention.mjs';
import {sourceSummaryProvenance,prepareSourceSummary} from './source-summaries.mjs';
import {researchFindings,findingChoices,prepareResearchFinding} from './research-findings.mjs';
import {conversationNotes,readConversationNote,prepareConversationNote} from './conversation-notes.mjs';
import {sourceInbox,readInboxSource,prepareInboxSource} from './source-inbox.mjs';
import {revisionComments,prepareRevisionComment,prepareCommentResolution} from './revision-comments.mjs';
import {textImports,readTextImport,prepareTextImport} from './text-import.mjs';
import {exportContents,exportPreferences,prepareExportPreference} from './export-settings.mjs';
import {previewPdf,writePdf} from './pdf-export.mjs';
import {personalTemplates,preparePersonalTemplate,preparePersonalDraft} from './personal-templates.mjs';
import {documentFieldDefinitions,documentFieldHelp} from './business-fields.mjs';
import {templateLibrary,prepareLibraryDraft} from './template-library.mjs';
import {affectedSections,prepareAffectedSection} from './affected-sections.mjs';
import {documentVersions,compareDocuments} from './document-comparison.mjs';
import {documentReview} from './document-review.mjs';
import {externalSummary,writeExternalSummary} from './external-summary.mjs';
import {suggestionsView,prepareSuggestion,prepareSuggestionResolution} from './document-suggestions.mjs';
import {prepareDocumentSection} from './document-section.mjs';
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
import {reinstateSnapshot,pendingSourceRemoval,safeDirectory,regularFile,readCore,sha} from './store.mjs';
import {initializeProject} from './initialize.mjs';
import {workspaceView,saveGuided,operationId,reportPreview,writeReport,isProjectArchived,isPracticeProject,prepareProjectArchive,prepareTaskState,prepareTaskFocus} from './workspace.mjs';
import {briefTypes,briefFieldHelp,savedDocumentFieldHelp,prepareBusinessBrief,readBusinessBrief,renderBusinessBrief,searchBusinessBriefs} from './business-brief.mjs';
import {retrieveRecords} from './retrieval.mjs';
import {dependencyGraph} from './dependencies.mjs';
import {listHistory,previewSnapshotRestore} from './history.mjs';
import {compareRevisions,renderComparison} from './project-view.mjs';
import {decisionLog,prepareDecisionLog,insightTimeline} from './decision-log.mjs';
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
 function located(ref){
  if(typeof ref!=='string'||!handles.has(ref))throw new WorkspaceError('This project is not selected. Refresh the project list.',404);const {folder,id}=handles.get(ref);return {dir:directory(folder),id,folder};
 }
 function invalidateProjectPreviews(ref,keep){for(const [key,entry]of previews)if(entry.ref===ref&&key!==keep)previews.delete(key);}
 function open(ref){
  if(typeof ref!=='string'||!handles.has(ref))throw new WorkspaceError('This project is not selected. Refresh the project list.',404);
  const {folder,id}=handles.get(ref),dir=directory(folder);
  try{readCore(dir,id);}catch{let pending=false;try{pending=!!pendingSourceRemoval(dir,id);}catch{}throw new WorkspaceError(pending?'Source removal is pending. Refresh the project list and review recovery; some files may already be removed.':'Project unavailable or identity changed. Check the folder; this request did not overwrite it.',409);}
  return {dir,id,folder};
 }
 return {
  templateLibrary(input){exactObject(input,['ref']);const {dir,id}=open(input.ref),state=readCore(dir,id);return {revision:state.dossier.revision,sha256:state.sha256,archived:isProjectArchived(state.dossier),templates:[...templateLibrary(),...personalTemplates(dir,id).templates.filter(r=>r.template.document_kind==='offer')],fields_by_kind:Object.fromEntries(Object.entries(briefTypes).map(([kind,definition])=>[kind,Object.entries(definition.fields).map(([key,labels])=>({key,label:labels[1]}))])),fields:Object.entries(briefTypes.offer.fields).map(([key,labels])=>({key,label:labels[1]}))};},
  personalTemplatePreview(input){exactObject(input,['ref','revision','sha256','worksheet']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=preparePersonalTemplate(dir,id,input.revision,input.sha256,input.worksheet);}catch{throw new WorkspaceError('Worksheet cannot be prepared. Check the current project, unique ID or latest version, required questions and custom field definitions. Your edits have not been saved.',409);}return {preview:holdPreview({kind:'personal-worksheet',ref:input.ref,sha256:input.sha256,prepared}),worksheet:prepared.preview.template};},
  personalTemplateSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm this exact worksheet version.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='personal-worksheet'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Worksheet preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview the worksheet again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  personalDraftPreview(input){exactObject(input,['ref','revision','sha256','selection']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=preparePersonalDraft(dir,id,input.revision,input.sha256,input.selection);}catch{throw new WorkspaceError('Personal worksheet selection or project changed. Review the saved version, answers and scope before preparing again.',409);}return {preview:holdPreview({kind:'library-template',ref:input.ref,sha256:input.sha256,prepared}),markdown:businessPreviewMarkdown(prepared),missing_required:prepared.missing_required};},
  templatePreview(input){exactObject(input,['ref','revision','sha256','template_id','template_version','template_sha256','answers','client','period']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareLibraryDraft(dir,{project_id:id,expected_revision:input.revision,expected_sha256:input.sha256,template_id:input.template_id,template_version:input.template_version,template_sha256:input.template_sha256,answers:input.answers,client:input.client,period:input.period});}catch{throw new WorkspaceError('Template draft cannot be prepared. Review the current project and template version, use known fields with at most 4000 characters each, and check client/period scope. Your answers have not been saved.',409);}return {preview:holdPreview({kind:'library-template',ref:input.ref,sha256:input.sha256,prepared}),markdown:businessPreviewMarkdown(prepared),missing_required:prepared.missing_required};},
  templateSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact template document preview.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='library-template'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Template preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; review the template draft again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  suggestions(input){exactObject(input,['ref','document_id']);const {dir,id}=open(input.ref);return {...suggestionsView(dir,id,input.document_id),archived:isProjectArchived(readCore(dir,id).dossier)};},
  suggestionPreview(input){exactObject(input,['ref','revision','sha256','suggestion']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareSuggestion(dir,id,input.revision,input.sha256,input.suggestion);}catch{throw new WorkspaceError('Suggestion cannot be prepared. Use a current section, different text and a reason. Existing or resolved identical text cannot be recreated; inspect history. Changed or damaged context requires review.',409);}return {preview:holdPreview({kind:'document-suggestion',ref:input.ref,sha256:input.sha256,prepared}),details:prepared.preview,rebase:false};},
  suggestionDecisionPreview(input){exactObject(input,['ref','revision','sha256','decision']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareSuggestionResolution(dir,id,input.revision,input.sha256,input.decision);}catch{throw new WorkspaceError('Suggestion decision cannot be prepared. Review current context, unresolved status and a reason. A changed target section, rejected text or outdated linked pilot basis cannot be silently replaced.',409);}return {preview:holdPreview({kind:'suggestion-decision',ref:input.ref,sha256:input.sha256,prepared}),details:prepared.preview,markdown:prepared.document_markdown?businessPreviewMarkdown(prepared):null,rebase:prepared.rebase};},
  suggestionSave(input){exactObject(input,['ref','preview','confirmed','acknowledge_rebase']);if(input.confirmed!==true||typeof input.acknowledge_rebase!=='boolean')throw new WorkspaceError('Review and confirm the exact suggestion action.');const entry=previews.get(input.preview);if(!entry||!['document-suggestion','suggestion-decision'].includes(entry.kind)||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Suggestion preview missing or expired.',409);if(entry.prepared.rebase&&!input.acknowledge_rebase)throw new WorkspaceError('Acknowledge the newer document version and retained other fields.');const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview the suggestion action again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id??null,action:entry.prepared.action??'proposed',revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  sectionPreview(input){exactObject(input,['ref','revision','sha256','section']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareDocumentSection(dir,id,input.revision,input.sha256,input.section);}catch{throw new WorkspaceError('Section cannot be prepared. Use a current document, a changed value of at most 4000 characters and a reason. Refresh changed context. If a linked pilot offer is outdated, use Prepare a pilot to select its current basis.',409);}return {preview:holdPreview({kind:'document-section',ref:input.ref,sha256:input.sha256,prepared}),markdown:businessPreviewMarkdown(prepared),section:prepared.edited_section};},
  sectionSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact document preview.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='document-section'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Section preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; reopen and review the section again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
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
  insightTimeline(input){exactObject(input,['ref','assumption_id']);const {dir,id}=open(input.ref);try{return insightTimeline(dir,id,input.assumption_id);}catch{throw new WorkspaceError('Insight timeline unavailable. Choose an existing assumption and inspect missing or changed project history.',409);}},
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
   checkRoot();const projects=[],unavailable=[],pending_removals=[];let count=0;
   const iterator=fs.opendirSync(root);
   try{for(let entry;(entry=iterator.readSync())!==null;){
    if(++count>200)throw new WorkspaceError('This folder contains too many entries. Choose a smaller project folder.',413);
    if(entry.isSymbolicLink())continue;
    if(!entry.isDirectory())continue;
    const dir=directory(entry.name),file=path.join(dir,'project.json');
    if(!fs.existsSync(file))continue;
    try{
     const id=JSON.parse(regularFile(file)).project_id;const pending=pendingSourceRemoval(dir,id);if(pending){pending_removals.push({ref:register(entry.name,id),folder:entry.name,id,operation_id:pending.operation_id});continue;}const {dossier:d}=readCore(dir,id);
     projects.push({ref:register(entry.name,id),folder:entry.name,id:d.project_id,name:d.name,revision:d.revision,practice:isPracticeProject(d),archived:isProjectArchived(d),updated:fs.statSync(file).mtime.toISOString()});
    }catch{unavailable.push(entry.name);}
   }}finally{iterator.closeSync();}
   return {root,projects:projects.sort((a,b)=>b.updated.localeCompare(a.updated)),unavailable,pending_removals};
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
  show(ref){const {dir,id,folder}=open(ref),view=workspaceView(dir,id);let owners=null;try{owners=taskResponsibilities(dir,id);}catch{}if(readCore(dir,id).sha256!==view.sha256)throw new WorkspaceError('Project changed; reopen the workspace.',409);return {folder,...view,actions:view.actions.map(a=>({...a,owner_alias:owners?.tasks.find(t=>t.id===a.id)?.owner_alias??null,owner_status:owners?'recorded':'unavailable'}))};},
  draft(input){
   exactObject(input,['ref','id']);const {dir,id}=open(input.ref),state=readCore(dir,id);
   let draft,markdown;try{draft=readBusinessBrief(dir,id,input.id);markdown=renderBusinessBrief(dir,id,input.id);}catch{throw new WorkspaceError('This saved draft is unavailable or damaged. No file was changed.',409);}
   if(readCore(dir,id).sha256!==state.sha256)throw new WorkspaceError('The project changed. Open the draft again.',409);
   return {review:documentReview(draft),id:draft.artifact_id,version:draft.version,kind:draft.request.kind,revision:state.dossier.revision,sha256:state.sha256,sections:draft.fields.map(f=>({key:f.key,label:documentFieldDefinitions(draft.request)[f.key][1],help:savedDocumentFieldHelp(draft,f.key),value:f.value,assertion:f.assertion,record_ids:[...f.record_ids],recorded_basis:f.basis??[]})),markdown,requires_review:draft.requires_review,historical:draft.successor_ids.length>0,successors:draft.successor_ids,basis_ids:[...new Set(draft.fields.flatMap(f=>f.record_ids))]};
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
  taskResponsibilities(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);return taskResponsibilities(dir,id);},
  taskResponsibilityPreview(input){exactObject(input,['ref','revision','sha256','assignment']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareTaskResponsibility(dir,id,input.revision,input.sha256,input.assignment);}catch{throw new WorkspaceError('Choose a current task, a short alias or no owner, distinct existing prerequisites and a reason. Self-dependencies and cycles are refused. Refresh changed project data.',409);}return {preview:holdPreview({kind:'task-responsibility',ref:input.ref,sha256:input.sha256,prepared}),details:prepared.preview,review_required:prepared.review_required,task_after:prepared.task_after,dependency_statuses:prepared.dependency_statuses};},
  taskResponsibilitySave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm this exact responsibility change.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='task-responsibility'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Responsibility preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview responsibility again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
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
   return {revision:state.dossier.revision,sha256:state.sha256,archived:isProjectArchived(state.dossier),...history,events:state.dossier.events.slice(-100).reverse(),events_truncated:state.dossier.events.length>100};
  },
  snapshotRestorePreview(input){
   exactObject(input,['ref','revision','sha256','snapshot_revision','snapshot_sha256','reason']);const {dir,id}=open(input.ref);requireActive(dir,id);
   const request={project_id:id,expected_revision:input.revision,expected_sha256:input.sha256,snapshot_revision:input.snapshot_revision,snapshot_sha256:input.snapshot_sha256,reason:input.reason};
   const review=previewSnapshotRestore(dir,request);if(review.blockers.length)return {review,preview:null};
   const prepared={...request,operation_id:'restore-'+randomUUID(),at:new Date().toISOString().slice(0,10)};
   return {review,preview:holdPreview({kind:'snapshot-restoration',ref:input.ref,prepared,sha256:input.sha256})};
  },
  snapshotRestoreSave(input){
   exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm this exact historical restoration.');
   const entry=previews.get(input.preview);if(!entry||entry.kind!=='snapshot-restoration'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Restoration preview missing or expired.',409);
   const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;if(!readCore(dir,id).dossier.operations.some(op=>op.id===entry.prepared.operation_id))requireActive(dir,id);
   // The transaction rechecks both fingerprints under the writer lock, including retries.
   entry.receipt=reinstateSnapshot(dir,entry.prepared,true);invalidateProjectPreviews(input.ref,input.preview);return entry.receipt;
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
   const initial=startingFields(state.dossier),definitions=documentFieldDefinitions(prior?.request??{kind:'offer'}),offerKeys=Object.keys(definitions);
   return {revision:state.dossier.revision,sha256:state.sha256,previous:input.previous,client:prior?.request.client??'',period:prior?.request.period??'',fields:offerKeys.map(key=>{const field=prior?.fields.find(f=>f.key===key),value=prior?(field?.value??''):(initial[key]?.value??'');return {key,label:definitions[key][1],help:documentFieldHelp(prior?.request??{},key)??briefFieldHelp.offer[key],value,assertion:field?.assertion??(value?'proposal':'unknown'),record_ids:field?.record_ids??(initial[key]?[initial[key].id]:[]),requires_review:prior?.requires_review??false};})};
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
   const {dir,id}=open(input.ref),state=readCore(dir,id);
   requireActive(dir,id);
   if(input.revision!==state.dossier.revision||input.sha256!==state.sha256)throw new WorkspaceError('The project changed. Reopen the offer before preparing a new preview.',409);
   if(input.previous!==null&&typeof input.previous!=='string')throw new WorkspaceError('Invalid previous draft.');
   const prior=input.previous===null?null:readBusinessBrief(dir,id,input.previous);
   const definitions=documentFieldDefinitions(prior?.request??{kind:'offer'}),offerKeys=Object.keys(definitions);exactObject(input.fields,offerKeys);
   const client=shortText(input.client,'Client/context')||null,period=shortText(input.period,'Period')||null,reason=shortText(input.reason,'Change reason');
   if(input.previous!==null&&!reason)throw new WorkspaceError('Explain why you are revising this offer.');
   const fields=offerKeys.map(key=>{
    const value=shortText(input.fields[key],definitions[key][1])||null,old=prior?.request.fields.find(f=>f.key===key);
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
  affectedSections(input){
   exactObject(input,['ref','before','after']);const {dir,id}=open(input.ref);
   try{const result=affectedSections(dir,id,input.before,input.after);return {...result,archived:isProjectArchived(readCore(dir,id).dossier)};}catch{throw new WorkspaceError('Affected sections cannot be selected. Compare readable versions ending at the current document; refresh changed or overlong history.',409);}
  },
  affectedSectionPreview(input){
   exactObject(input,['ref','revision','sha256','before','after','section']);const {dir,id}=open(input.ref);requireActive(dir,id);
   let prepared;try{prepared=prepareAffectedSection(dir,id,input.revision,input.sha256,input.before,input.after,input.section);}catch{throw new WorkspaceError('This targeted revision cannot be prepared. Refresh the selection, choose a listed field and explain a changed value. A pilot linked to an outdated offer requires explicit offer selection through Prepare a pilot.',409);}
   return {preview:holdPreview({kind:'document-section',ref:input.ref,sha256:input.sha256,prepared}),markdown:businessPreviewMarkdown(prepared),selection:prepared.selection_context};
  },
  documentVersions(input){
   exactObject(input,['ref','id']);const {dir,id}=open(input.ref);
   try{return documentVersions(dir,id,input.id);}catch{throw new WorkspaceError('Document version history is unavailable, inconsistent or exceeds 200 versions.',409);}
  },
  documentCompare(input){
   exactObject(input,['ref','before','after']);const {dir,id}=open(input.ref);
   try{return compareDocuments(dir,id,input.before,input.after);}catch{throw new WorkspaceError('Choose two increasing versions of the same readable document. Refresh if the project changed.',409);}
  },
  researchFindings(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);try{return researchFindings(dir,id);}catch{throw new WorkspaceError('Research finding is unavailable or inconsistent. Nothing was changed.',409);}},
  researchFindingPreview(input){exactObject(input,['ref','revision','sha256','finding']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareResearchFinding(dir,id,input.revision,input.sha256,input.finding);}catch{throw new WorkspaceError('Cannot prepare research finding. Check assumption, source fragment and reason; refresh changed project data.',409);}return {preview:holdPreview({kind:'research-finding',ref:input.ref,sha256:input.sha256,prepared}),finding:prepared.preview};},
  researchFindingSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact quotations, interpretations, follow-up questions and limitations.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='research-finding'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Research finding preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview the research finding again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  findingChoices(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);try{return findingChoices(dir,id);}catch{throw new WorkspaceError('Finding choices unavailable. Check project source files.',409);}},
  conversationNotes(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);try{return conversationNotes(dir,id);}catch{throw new WorkspaceError('Conversation note is unavailable or inconsistent. Nothing was changed.',409);}},
  conversationNoteRead(input){exactObject(input,['ref','artifact_id']);const {dir,id}=open(input.ref);try{return readConversationNote(dir,id,input.artifact_id);}catch{throw new WorkspaceError('Conversation note item unavailable. Nothing was changed.',409);}},
  sourceSummaryProvenance(input){exactObject(input,['ref','source_id']);const {dir,id}=open(input.ref);try{return sourceSummaryProvenance(dir,id,input.source_id);}catch{throw new WorkspaceError('Source summary provenance unavailable or inconsistent.',409);}},
  sourceRemovalPreview(input){exactObject(input,['ref','revision','sha256','source_id']);const {dir,id}=open(input.ref);let prepared;try{prepared=prepareSourceRemoval(dir,id,input.revision,input.sha256,input.source_id);}catch{throw new WorkspaceError('Cannot preview source removal. Refresh changed project data and inspect unavailable or changed source copies.',409);}return {preview:holdPreview({kind:'source-removal',ref:input.ref,prepared}),removal:prepared.preview};},
  sourceRemovalSave(input){
   exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Explicitly confirm permanently removing every listed source record and retry content file.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='source-removal'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Source removal preview missing or expired.',409);
   const {dir,id}=located(input.ref);if(entry.receipt){readCore(dir,id);return entry.receipt;}
   try{entry.receipt=applySourceRemoval(dir,entry.prepared.request,true);invalidateProjectPreviews(input.ref,input.preview);entry.prepared=null;return entry.receipt;}catch{invalidateProjectPreviews(input.ref,input.preview);throw new WorkspaceError('Removal did not finish. Refresh the project list: if a pending removal is shown, review and resume it. Otherwise prepare a fresh preview. Some files may already have been removed.',409);}
  },
  sourceRemovalRecoveryPreview(input){exactObject(input,['ref']);const {dir,id}=located(input.ref);let recovery;try{recovery=sourceRemovalRecovery(dir,id);}catch{throw new WorkspaceError('Pending removal unavailable or inconsistent; inspect the project before continuing.',409);}return {preview:holdPreview({kind:'source-removal-recovery',ref:input.ref,recovery}),recovery};},
  sourceRemovalRecoverySave(input){
   exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Confirm completing this exact pending removal.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='source-removal-recovery'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Removal recovery preview missing or expired.',409);const {dir,id}=located(input.ref);if(entry.receipt){readCore(dir,id);return entry.receipt;}
   try{entry.receipt=confirmSourceRemovalRecovery(dir,id,entry.recovery.sha256,true);invalidateProjectPreviews(input.ref,input.preview);entry.recovery=null;return entry.receipt;}catch{throw new WorkspaceError('Removal remains pending. Check changed files or the writer lock; an active writer cannot be unlocked. Refresh and review recovery again.',409);}
  },
  researchConflicts(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);try{return researchConflicts(dir,id);}catch{throw new WorkspaceError('Possible conflicts unavailable or inconsistent; inspect their source records.',409);}},
  conflictCandidatePreview(input){exactObject(input,['ref','revision','sha256','candidate']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareConflictCandidate(dir,id,input.revision,input.sha256,input.candidate);}catch{throw new WorkspaceError('Cannot flag this conflict. Choose two distinct readable fragments, a category, shared context and difference (up to 8000 UTF-8 bytes each), and an alias; review an existing duplicate or refresh changed data.',409);}return {preview:holdPreview({kind:'conflict-candidate',ref:input.ref,sha256:input.sha256,prepared}),conflict:prepared.preview};},
  conflictReviewPreview(input){exactObject(input,['ref','revision','sha256','review']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareConflictReview(dir,id,input.revision,input.sha256,input.review);}catch{throw new WorkspaceError('Cannot review this conflict. Use a current candidate with unchanged sources, an explicit decision, reason and alias; refresh changed data.',409);}return {preview:holdPreview({kind:'conflict-review',ref:input.ref,sha256:input.sha256,prepared}),conflict:prepared.preview};},
  conflictSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact conflict candidate or review decision first.');const entry=previews.get(input.preview);if(!entry||!['conflict-candidate','conflict-review'].includes(entry.kind)||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Conflict preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview the conflict again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  experimentRuns(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);try{return experimentRuns(dir,id);}catch{throw new WorkspaceError('Experiment history unavailable or inconsistent.',409);}},
  experimentStartPreview(input){exactObject(input,['ref','revision','sha256','start']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareExperimentStart(dir,id,input.revision,input.sha256,input.start);}catch{throw new WorkspaceError('Choose a complete current experiment plan without an existing start declaration. Supply a contributor alias and declaration; refresh changed project data.',409);}return {preview:holdPreview({kind:'experiment-start',ref:input.ref,sha256:input.sha256,prepared}),start:prepared.preview};},
  experimentStartSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm this exact experiment start declaration.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='experiment-start'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Experiment start preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview experiment start again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  experimentObservationPreview(input){exactObject(input,['ref','revision','sha256','observation']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareExperimentObservation(dir,id,input.revision,input.sha256,input.observation);}catch{throw new WorkspaceError('Choose a readable experiment start and source with recorded content. Supply an actual observation date, observation and contributor alias; refresh changed project data.',409);}return {preview:holdPreview({kind:'experiment-observation',ref:input.ref,sha256:input.sha256,prepared}),observation:prepared.preview};},
  experimentObservationSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm this exact sourced observation and separate interpretation.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='experiment-observation'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Experiment observation preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview experiment observation again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  experimentReviews(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);try{return experimentReviews(dir,id);}catch{throw new WorkspaceError('Experiment reviews unavailable or inconsistent.',409);}},
  experimentReviewPreview(input){exactObject(input,['ref','revision','sha256','review']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareExperimentReview(dir,id,input.revision,input.sha256,input.review);}catch{throw new WorkspaceError('Choose current sourced observations from one experiment, a next step, reason, implications and contributor alias. Select only current offers or tasks as proposed impacts; refresh changed data.',409);}return {preview:holdPreview({kind:'experiment-review',ref:input.ref,sha256:input.sha256,prepared}),review:prepared.preview};},
  experimentReviewSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm this exact proposed next step, observations and impacts.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='experiment-review'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Experiment review preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview experiment review again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  findingClassifications(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);try{return findingClassifications(dir,id);}catch{throw new WorkspaceError('Finding classifications unavailable or inconsistent; inspect source records.',409);}},
  findingClassificationPreview(input){exactObject(input,['ref','revision','sha256','classification']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareFindingClassification(dir,id,input.revision,input.sha256,input.classification);}catch{throw new WorkspaceError('Cannot classify this finding. Use a current readable source, an explicit stance, a reason up to 8000 UTF-8 bytes, an alias up to 800 UTF-8 bytes, and scope fields up to 2000 UTF-8 bytes each (or unknown); refresh changed project data.',409);}return {preview:holdPreview({kind:'finding-classification',ref:input.ref,sha256:input.sha256,prepared}),classification:prepared.preview};},
  findingClassificationSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact finding, assumption and classification.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='finding-classification'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Classification preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview classification again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  sourceManagement(input){exactObject(input,['ref','source_id']);const {dir,id}=open(input.ref);try{return sourceManagement(dir,id,input.source_id);}catch{throw new WorkspaceError('Source management unavailable or inconsistent.',409);}},
  sourceRetentionPreview(input){exactObject(input,['ref','revision','sha256','retention']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareSourceRetention(dir,id,input.revision,input.sha256,input.retention);}catch{throw new WorkspaceError('Cannot prepare source retention. Check source, review/retention dates, reason and contributor; refresh changed project data.',409);}return {preview:holdPreview({kind:'source-retention',ref:input.ref,sha256:input.sha256,prepared}),retention:prepared.preview};},
  sourceRetentionSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the retention dates, reason and known-copy limitations.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='source-retention'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Source retention preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview the source retention again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  sourceSummaryPreview(input){exactObject(input,['ref','revision','sha256','summary']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareSourceSummary(dir,id,input.revision,input.sha256,input.summary);}catch{throw new WorkspaceError('Cannot prepare source summary. Check source, method, attribution, interpretation and exact excerpt ranges; refresh changed project data.',409);}return {preview:holdPreview({kind:'source-summary',ref:input.ref,sha256:input.sha256,prepared}),summary:prepared.preview};},
  sourceSummarySave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact quotations, interpretations, follow-up questions and limitations.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='source-summary'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Source summary preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview the source summary again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  conversationNotePreview(input){exactObject(input,['ref','revision','sha256','note']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareConversationNote(dir,id,input.revision,input.sha256,input.note);}catch{throw new WorkspaceError('Cannot prepare conversation note. Check participant codes, statement fields, date, source, context and limitations; refresh changed project data.',409);}return {preview:holdPreview({kind:'conversation-note',ref:input.ref,sha256:input.sha256,prepared}),note:prepared.preview};},
  conversationNoteSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact quotations, interpretations, follow-up questions and limitations.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='conversation-note'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Conversation note preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview the conversation note again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  sourceInbox(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);try{return sourceInbox(dir,id);}catch{throw new WorkspaceError('Source inbox is unavailable or inconsistent. Nothing was changed.',409);}},
  sourceInboxRead(input){exactObject(input,['ref','artifact_id']);const {dir,id}=open(input.ref);try{return readInboxSource(dir,id,input.artifact_id);}catch{throw new WorkspaceError('Source inbox item unavailable. Nothing was changed.',409);}},
  sourceInboxPreview(input){exactObject(input,['ref','revision','sha256','source']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareInboxSource(dir,id,input.revision,input.sha256,input.source);}catch{throw new WorkspaceError('Cannot prepare source. Check readable content or reference, date, context, limitations and contributor label; refresh changed project data.',409);}return {preview:holdPreview({kind:'source-inbox',ref:input.ref,sha256:input.sha256,prepared}),source:prepared.preview};},
  sourceInboxSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact source, interpretation and limitations.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='source-inbox'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Source inbox preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview the source again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  revisionComments(input){exactObject(input,['ref','target']);const {dir,id}=open(input.ref);try{return revisionComments(dir,id,input.target);}catch{throw new WorkspaceError('Comment history or document unavailable. Nothing was changed.',409);}},
  revisionCommentPreview(input){exactObject(input,['ref','revision','sha256','comment']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareRevisionComment(dir,id,input.revision,input.sha256,input.comment);}catch{throw new WorkspaceError('Cannot prepare comment. Choose a saved document block, enter readable text up to 4000 characters and refresh changed project data.',409);}return {preview:holdPreview({kind:'revision-comment',ref:input.ref,sha256:input.sha256,prepared}),comment:prepared.preview};},
  revisionCommentResolutionPreview(input){exactObject(input,['ref','revision','sha256','resolution']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareCommentResolution(dir,id,input.revision,input.sha256,input.resolution);}catch{throw new WorkspaceError('Cannot change this comment. Refresh its current status and provide a reason.',409);}return {preview:holdPreview({kind:'revision-comment',ref:input.ref,sha256:input.sha256,prepared}),comment:prepared.preview,possibly_outdated:prepared.possibly_outdated};},
  revisionCommentSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact comment action.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='revision-comment'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Comment preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview the comment again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  textImports(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);try{return textImports(dir,id);}catch{throw new WorkspaceError('Imported text history is unreadable or inconsistent. Inspect the project files; nothing was changed.',409);}},
  textImportRead(input){exactObject(input,['ref','artifact_id']);const {dir,id}=open(input.ref);try{return readTextImport(dir,id,input.artifact_id);}catch{throw new WorkspaceError('This imported text is unavailable or changed. Inspect the original project files.',409);}},
  textImportPreview(input){exactObject(input,['ref','revision','sha256','document']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareTextImport(dir,id,input.revision,input.sha256,input.document);}catch(error){if(error.code==='DUPLICATE_TEXT_IMPORT')throw new WorkspaceError(error.message,409);throw new WorkspaceError('Cannot prepare import. Use readable text up to 64000 UTF-8 bytes, a title, text or markdown format, and up to 20 existing record links; refresh changed project data.',409);}return {preview:holdPreview({kind:'text-import',ref:input.ref,sha256:input.sha256,prepared}),...prepared.preview};},
  textImportSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact imported text and context links.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='text-import'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Text import preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview the import again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  exportContents(input){exactObject(input,['ref','selection']);const {dir,id}=open(input.ref);try{return exportContents(dir,id,input.selection);}catch{throw new WorkspaceError('Cannot inspect this export selection. Choose readable content and refresh changed data.',409);}},
  exportPreferences(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);try{return exportPreferences(dir,id);}catch{throw new WorkspaceError('Export preferences are unreadable or inconsistent. Inspect the saved project files; nothing was changed.',409);}},
  exportPreferencePreview(input){exactObject(input,['ref','revision','sha256','selection']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareExportPreference(dir,id,input.revision,input.sha256,input.selection);}catch{throw new WorkspaceError('Cannot save this export preference. Review current content and refresh changed project data.',409);}return {preview:holdPreview({kind:'export-preference',ref:input.ref,sha256:input.sha256,prepared}),...prepared.preview};},
  exportPreferenceSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm this exact export preference.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='export-preference'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Export preference preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview export settings again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  async pdfPreview(input){
   exactObject(input,['ref','selection']);const {dir,id}=open(input.ref);
   let result;try{result=await previewPdf(dir,id,input.selection);}catch{throw new WorkspaceError('Cannot render this PDF. Check the selected saved content and refresh changed project data.',409);}
   const {bytes,...metadata}=result;
   const preview=holdPreview({kind:'pdf',ref:input.ref,selection:result.selection,sha256:result.sha256,project_sha256:result.project_sha256});
   return {preview,...metadata,pdf_base64:bytes.toString('base64')};
  },
  async pdfSave(input){
   exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact PDF first.');
   const entry=previews.get(input.preview);
   if(!entry||entry.kind!=='pdf'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('PDF preview missing or expired. Preview again.',409);
   const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;if(entry.pending)return entry.pending;
   if(readCore(dir,id).sha256!==entry.project_sha256)throw new WorkspaceError('Project changed; review a fresh PDF preview.',409);
   const filename='snapshot-'+randomUUID()+'.pdf';
   entry.pending=(async()=>{try{const saved=await writePdf(dir,id,entry.selection,entry.sha256,directory(filename));entry.receipt={filename,path:saved.saved,sha256:saved.sha256,revision:saved.revision,pages:saved.pages,warnings:saved.warnings};return entry.receipt;}catch{throw new WorkspaceError('PDF could not be saved. Refresh and review the preview again.',409);}finally{entry.pending=null;}})();
   return entry.pending;
  },
  feedbackDecisions(input){exactObject(input,['ref']);const {dir,id}=open(input.ref);return feedbackDecisions(dir,id);},
  feedbackDecisionPreview(input){exactObject(input,['ref','revision','sha256','decision']);const {dir,id}=open(input.ref);requireActive(dir,id);let prepared;try{prepared=prepareFeedbackDecision(dir,id,input.revision,input.sha256,input.decision);}catch{throw new WorkspaceError('Review current feedback, its original and current text, your choice and reason. Changed context needs acknowledgment; Adapt requires different wording. Refresh changed project data.',409);}return {preview:holdPreview({kind:'feedback-decision',ref:input.ref,sha256:input.sha256,prepared}),details:prepared.preview};},
  feedbackDecisionSave(input){exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Confirm this exact response to feedback.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='feedback-decision'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Feedback decision preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview your response again.',409);saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1};return entry.receipt;},
  mentorReviewPreview(input){
   exactObject(input,['ref','original']);const {dir,id}=open(input.ref),entry=previews.get(input.original);if(!entry||entry.kind!=='review-original'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Select a local original package again.',409);
   let result;try{if(sha(regularFile(directory(entry.name),200000))!==entry.digest)throw Error('Original changed');result=mentorReview(dir,id,entry.content,entry.digest);}catch{throw new WorkspaceError('Original package or project changed; reopen feedback.',409);}
   return {preview:holdPreview({kind:'mentor-review',ref:input.ref,original:entry,result}),content:result.content,sha256:result.sha256,bytes:result.bytes};
  },
  mentorReviewSave(input){
   exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Confirm this exact mentor page first.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='mentor-review'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Mentor page preview missing or expired.',409);const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;
   try{if(readCore(dir,id).sha256!==entry.result.project_sha256||sha(regularFile(directory(entry.original.name),200000))!==entry.original.digest)throw Error('Changed');entry.receipt=writeMentorReview(dir,id,entry.original.content,entry.original.digest,entry.result.sha256,directory('mentor-review-'+randomUUID()+'.html'),true);}catch{throw new WorkspaceError('Mentor page changed or could not be saved; preview again.',409);}return entry.receipt;
  },
  reviewFeedback(input){
   exactObject(input,['ref']);const {dir,id}=open(input.ref),history=reviewFeedbackHistory(dir,id),names=fs.readdirSync(root).filter(n=>/^review-package-[a-f0-9-]{36}\.json$/.test(n)).sort();
   const packages=[];let unavailable=0;for(const name of names.slice(0,100)){try{const content=regularFile(directory(name),200000).toString('utf8');if(JSON.parse(content).project_id!==id)continue;const original=inspectReviewOriginal(dir,id,content,sha(content));const handle=holdPreview({kind:'review-original',ref:input.ref,name,content,digest:sha(content)});packages.push({handle,name,package_id:original.packet.package_id,title:original.packet.title,project_revision:original.packet.project_revision,template:reviewFeedbackTemplate(original.packet),packet:original.packet,context:original.context});}catch{unavailable++;}}
   if(readCore(dir,id).sha256!==history.sha256)throw new WorkspaceError('Project changed; reopen feedback.',409);const responses=feedbackDecisions(dir,id);if(responses.sha256!==history.sha256)throw new WorkspaceError('Project changed; reopen feedback.',409);return {...history,packages,owner_responses:responses.comments,discussions:responses.discussions,attention:responses.attention,partial:names.length>100,unavailable};
  },
  reviewFeedbackPreview(input){
   exactObject(input,['ref','revision','sha256','original','content']);const {dir,id}=open(input.ref),entry=previews.get(input.original);requireActive(dir,id);
   if(!entry||entry.kind!=='review-original'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Select a local original package again.',409);
   let prepared;try{if(sha(regularFile(directory(entry.name),200000))!==entry.digest)throw Error('Original changed');prepared=prepareReviewFeedback(dir,id,input.revision,input.sha256,entry.content,entry.digest,input.content);}catch{throw new WorkspaceError('Feedback cannot be imported. Match the selected original package, project, document versions and shared sections; use 1 to 20 comments. Refresh changed data and inspect previously imported feedback.',409);}
   return {preview:holdPreview({kind:'review-feedback',ref:input.ref,sha256:input.sha256,original:entry,prepared}),details:prepared.preview,context:prepared.context};
  },
  reviewFeedbackSave(input){
   exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm this exact feedback import.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='review-feedback'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Feedback preview missing or expired.',409);
   const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;requireActive(dir,id);if(readCore(dir,id).sha256!==entry.sha256)throw new WorkspaceError('Project changed; preview feedback again.',409);
   try{if(sha(regularFile(directory(entry.original.name),200000))!==entry.original.digest)throw Error('Original changed');}catch{throw new WorkspaceError('Original package changed or disappeared; select it again.',409);}
   saveGuided(dir,entry.prepared,path.join(root,'retry-'+entry.prepared.update_request.operation_id));entry.receipt={artifact_id:entry.prepared.artifact_id,revision:entry.prepared.update_request.expected_revision+1,status:'unreviewed'};return entry.receipt;
  },
  reviewPackagePreview(input){
   exactObject(input,['ref','revision','sha256','selection']);const {dir,id}=open(input.ref),state=readCore(dir,id);if(state.dossier.revision!==input.revision||state.sha256!==input.sha256)throw new WorkspaceError('Project changed; reopen the review package selection.',409);
   let result;try{result=reviewPackage(dir,id,input.selection);}catch{throw new WorkspaceError('Choose current readable documents, explicit sections, bounded questions and aliases. Nothing was shared.',409);}
   if(result.project_sha256!==input.sha256)throw new WorkspaceError('Project changed; preview again.',409);
   const preview=holdPreview({kind:'review-package',ref:input.ref,selection:structuredClone(input.selection),result});return {preview,...result};
  },
  reviewPackageSave(input){
   exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm this exact package first.');const entry=previews.get(input.preview);if(!entry||entry.kind!=='review-package'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Review package preview missing or expired.',409);
   const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;try{entry.receipt=writeReviewPackage(dir,id,entry.selection,entry.result.sha256,directory('review-package-'+randomUUID()+'.json'),true);}catch{throw new WorkspaceError('Package could not be saved. Refresh changed project data and preview again.',409);}return entry.receipt;
  },
  summaryPreview(input){
   exactObject(input,['ref','artifact_id','keys']);const {dir,id}=open(input.ref);
   let summary;try{summary=externalSummary(dir,id,input.artifact_id,input.keys);}catch{throw new WorkspaceError('Choose unique sections from a current, readable offer, with at most 6000 text characters. Reopen the offer if it changed.',409);}
   const preview=holdPreview({kind:'external-summary',ref:input.ref,artifact_id:input.artifact_id,keys:[...input.keys],summary});
   return {preview,...summary};
  },
  summarySave(input){
   exactObject(input,['ref','preview','confirmed']);if(input.confirmed!==true)throw new WorkspaceError('Review and confirm the exact summary first.');
   const entry=previews.get(input.preview);
   if(!entry||entry.kind!=='external-summary'||entry.ref!==input.ref||entry.expires<Date.now())throw new WorkspaceError('Summary preview missing or expired. Preview again.',409);
   const {dir,id}=open(input.ref);if(entry.receipt)return entry.receipt;
   try{entry.receipt=writeExternalSummary(dir,id,entry.artifact_id,entry.keys,entry.summary.sha256,directory('offer-summary-'+randomUUID()+'.md'));}
   catch{throw new WorkspaceError('Summary could not be saved. The project may have changed; preview again.',409);}
   return entry.receipt;
  },
  reportPreview(input){
   exactObject(input,['ref','sections']);const {dir,id}=open(input.ref);
   let report;try{report=reportPreview(dir,id,input.sections);}catch{throw new WorkspaceError('Cannot preview this selection. Choose valid sections and check for unreadable drafts.',409);}
   const preview=holdPreview({kind:'report',ref:input.ref,report});
   return {preview,markdown:report.markdown,revision:report.revision,sections:report.sections,sharing_review:report.sharing_review};
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
