import http from 'node:http';
import fs from 'node:fs';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {localWorkspace,WorkspaceError,exactObject} from './local-workspace.mjs';

const assets=new Map([
 ['/',[new URL('../ui/index.html',import.meta.url),'text/html; charset=utf-8']],
 ['/recovery.js',[new URL('../ui/recovery.js',import.meta.url),'text/javascript; charset=utf-8']],
 ['/source-selection.js',[new URL('../ui/source-selection.js',import.meta.url),'text/javascript; charset=utf-8']],
 ['/import-source.js',[new URL('../ui/import-source.js',import.meta.url),'text/javascript; charset=utf-8']],
 ['/ui.js',[new URL('../ui/ui.js',import.meta.url),'text/javascript; charset=utf-8']],
 ['/ui.css',[new URL('../ui/ui.css',import.meta.url),'text/css; charset=utf-8']],
 ['/brand.png',[new URL('../assets/startkompas-header.png',import.meta.url),'image/png']]
]);
const headers={
 'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',
 'X-Frame-Options':'DENY','Cross-Origin-Resource-Policy':'same-origin',
 'Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
 'Permissions-Policy':'camera=(), microphone=(), geolocation=()'
};
async function body(req){
 let size=0;const chunks=[];
 for await(const chunk of req){size+=chunk.length;if(size>(['/api/task-responsibility-preview','/api/review-feedback-preview','/api/source-inbox-preview','/api/conversation-note-preview','/api/research-finding-preview','/api/source-summary-preview'].includes(req.url)?1048576:req.url==='/api/text-import-preview'?524288:req.url==='/api/recovery-save'?262144:65536))throw new WorkspaceError('The request is too large.',413);chunks.push(chunk);}
 try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new WorkspaceError('The request does not contain valid JSON.');}
}
export async function startLocalUI({root,port=0}){
 if(!Number.isInteger(port)||port<0||port>65535)throw Error('Invalid port');
 const workspace=localWorkspace(root),token=randomBytes(32).toString('hex');let origin,host;
 const server=http.createServer({maxHeaderSize:8192,requestTimeout:10000,headersTimeout:5000},async(req,res)=>{
  const send=(status,value,type='application/json; charset=utf-8')=>{res.writeHead(status,{...headers,'Content-Type':type});res.end(type.startsWith('application/json')?JSON.stringify(value):value);};
  try{
   if(req.headers.host!==host||req.socket.remoteAddress!=='127.0.0.1')throw new WorkspaceError('This connection is not allowed.',403);
   if(req.headers.origin&&req.headers.origin!==origin)throw new WorkspaceError('This website cannot access the workspace.',403);
   const startNavigation=req.method==='GET'&&req.url==='/'&&req.headers['sec-fetch-mode']==='navigate'&&req.headers['sec-fetch-dest']==='document';
   if(!startNavigation&&req.headers['sec-fetch-site']&&!['same-origin','none'].includes(req.headers['sec-fetch-site']))throw new WorkspaceError('Open the workspace using the launch link.',403);
   if(req.method==='GET'&&assets.has(req.url)){
    const [file,type]=assets.get(req.url);return send(200,fs.readFileSync(file),type);
   }
   if(!['/api/snapshot-restore-preview','/api/snapshot-restore-save','/api/task-responsibilities','/api/task-responsibility-preview','/api/task-responsibility-save','/api/feedback-decisions','/api/feedback-decision-preview','/api/feedback-decision-save','/api/mentor-review-preview','/api/mentor-review-save','/api/review-feedback','/api/review-feedback-preview','/api/review-feedback-save','/api/review-package-preview','/api/review-package-save','/api/experiment-runs','/api/experiment-start-preview','/api/experiment-start-save','/api/experiment-observation-preview','/api/experiment-observation-save','/api/experiment-reviews','/api/experiment-review-preview','/api/experiment-review-save','/api/insight-timeline','/api/research-conflicts','/api/conflict-candidate-preview','/api/conflict-review-preview','/api/conflict-save','/api/finding-classifications','/api/finding-classification-preview','/api/finding-classification-save','/api/source-removal-preview','/api/source-removal-save','/api/source-removal-recovery-preview','/api/source-removal-recovery-save','/api/source-management','/api/source-retention-preview','/api/source-retention-save','/api/source-summary-provenance','/api/source-summary-preview','/api/source-summary-save','/api/research-findings','/api/finding-choices','/api/research-finding-preview','/api/research-finding-save','/api/conversation-notes','/api/conversation-note-read','/api/conversation-note-preview','/api/conversation-note-save','/api/source-inbox','/api/source-inbox-read','/api/source-inbox-preview','/api/source-inbox-save','/api/revision-comments','/api/revision-comment-preview','/api/revision-comment-resolution-preview','/api/revision-comment-save','/api/text-imports','/api/text-import-read','/api/text-import-preview','/api/text-import-save','/api/export-contents','/api/export-preferences','/api/export-preference-preview','/api/export-preference-save','/api/pdf-preview','/api/pdf-save','/api/personal-template-preview','/api/personal-template-save','/api/personal-draft-preview','/api/template-library','/api/template-preview','/api/template-save','/api/affected-sections','/api/affected-section-preview','/api/document-versions','/api/document-compare','/api/summary-preview','/api/summary-save','/api/suggestions','/api/suggestion-preview','/api/suggestion-decision-preview','/api/suggestion-save','/api/section-preview','/api/section-save','/api/change-impact','/api/context-choices','/api/context-preview','/api/scenarios','/api/scenario-compare','/api/scenario-preview','/api/scenario-adopt-preview','/api/scenario-save','/api/pilots','/api/pilot-preview','/api/pilot-save','/api/scope','/api/scope-preview','/api/scope-save','/api/alternatives','/api/alternatives-preview','/api/alternatives-save','/api/interviews','/api/interview-preview','/api/interview-save','/api/decisions','/api/decision-preview','/api/decision-save','/api/research','/api/research-save','/api/session-plan','/api/session-preview','/api/session-save','/api/connections','/api/profile','/api/profile-save','/api/recovery-list','/api/recovery-save','/api/recovery-read','/api/recovery-forget','/api/offer-restore','/api/draft-search','/api/task-update','/api/offer-latest','/api/diagnostics','/api/draft','/api/search','/api/record','/api/history','/api/compare','/api/projects','/api/create','/api/show','/api/offer-form','/api/offer-preview','/api/offer-save','/api/report-preview','/api/report-save','/api/archive'].includes(req.url))throw new WorkspaceError('Not found.',404);
   if(req.method!=='POST')throw new WorkspaceError('This operation requires a POST request.',405);
   const supplied=req.headers['x-startkompas-session'];
   if(req.headers.origin!==origin||typeof supplied!=='string'||! /^[a-f0-9]{64}$/.test(supplied)||!timingSafeEqual(Buffer.from(supplied),Buffer.from(token)))throw new WorkspaceError('The session is missing or expired. Reopen the link from the terminal.',403);
   if(req.headers['content-type']!=='application/json')throw new WorkspaceError('Use a JSON request.',415);
   const input=await body(req);let result;
   if(req.url==='/api/diagnostics'){
    exactObject(input,[]);const version=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8')).version;
    result={markdown:['Startkompas local workspace problem report','Application version: '+version,'Node version: '+process.versions.node,'Platform: '+process.platform,'','Steps to reproduce using fictional data: [fill in]','Expected result: [fill in]','Actual result: [fill in]','','Optional usage feedback - leave blank or remove this section:',
'Your reporting period (optional; approximate dates are enough): [unknown]',
'Was this fictional practice or your own work? [practice / own work / not stated]',
'Installed without help? [yes / no / not tried / unknown]',
'Got a useful first result? [yes / no / not tried / unknown]; what was useful? [optional]',
'Resumed saved work? [yes / no / not tried / unknown]',
'Resumed means: returned after leaving the workspace, opened the same saved project, and used its earlier work for a next action. Merely reopening a tab is not enough.',
'Report made? [yes / no / not tried / unknown]',
'Report made means: confirmed a report save and checked the resulting file. A preview, failed save or ordinary offer draft does not count.',
'What helped or blocked you, and what would make you return? [optional; fictional details only]',
'Feedback is voluntary. Copying does not send it. Posting on GitHub is public; review and choose what to share. No automatic usage tracking is enabled.',
'Permission to review this voluntarily submitted feedback for product improvement does not grant permission to identify you, quote you in marketing or reuse private records.',
'Usage reports are self-reported, not independently verified and not evidence of business demand.',
'','Generated metadata excludes project names, paths, session tokens and project contents. Review your additions before sharing.'].join('\n')};
   }
   for(const [route,method] of [['recovery-list','recoveryList'],['recovery-save','recoverySave'],['recovery-read','recoveryRead'],['recovery-forget','recoveryForget']])if(req.url==='/api/'+route)result=workspace[method](input);
   for(const [route,method] of [['session-plan','sessionPlan'],['session-preview','sessionPreview'],['session-save','sessionSave']])if(req.url==='/api/'+route)result=workspace[method](input);
   for(const [route,method] of [['snapshot-restore-preview','snapshotRestorePreview'],['snapshot-restore-save','snapshotRestoreSave'],['experiment-runs','experimentRuns'],['experiment-start-preview','experimentStartPreview'],['experiment-start-save','experimentStartSave'],['experiment-observation-preview','experimentObservationPreview'],['experiment-observation-save','experimentObservationSave'],['experiment-reviews','experimentReviews'],['experiment-review-preview','experimentReviewPreview'],['experiment-review-save','experimentReviewSave'],['insight-timeline','insightTimeline'],['personal-template-preview','personalTemplatePreview'],['personal-template-save','personalTemplateSave'],['personal-draft-preview','personalDraftPreview'],['template-library','templateLibrary'],['template-preview','templatePreview'],['template-save','templateSave'],['affected-sections','affectedSections'],['affected-section-preview','affectedSectionPreview'],['document-versions','documentVersions'],['document-compare','documentCompare'],['summary-preview','summaryPreview'],['summary-save','summarySave'],['suggestions','suggestions'],['suggestion-preview','suggestionPreview'],['suggestion-decision-preview','suggestionDecisionPreview'],['suggestion-save','suggestionSave'],['section-preview','sectionPreview'],['section-save','sectionSave'],['change-impact','changeImpact'],['context-choices','contextChoices'],['context-preview','contextPreview'],['scenarios','scenarios'],['scenario-compare','scenarioCompare'],['scenario-preview','scenarioPreview'],['scenario-adopt-preview','scenarioAdoptPreview'],['scenario-save','scenarioSave'],['pilots','pilots'],['pilot-preview','pilotPreview'],['pilot-save','pilotSave'],['scope','scope'],['scope-preview','scopePreview'],['scope-save','scopeSave'],['alternatives','alternatives'],['alternatives-preview','alternativesPreview'],['alternatives-save','alternativesSave'],['interviews','interviews'],['interview-preview','interviewPreview'],['interview-save','interviewSave'],['decisions','decisions'],['decision-preview','decisionPreview'],['decision-save','decisionSave']])if(req.url==='/api/'+route)result=workspace[method](input);
   if(req.url==='/api/research')result=workspace.research(input);
   if(req.url==='/api/research-save')result=workspace.researchSave(input);
   if(req.url==='/api/connections')result=workspace.connections(input);
   if(req.url==='/api/profile')result=workspace.profile(input);
   if(req.url==='/api/profile-save')result=workspace.profileSave(input);
   if(req.url==='/api/projects'){exactObject(input,[]);result=workspace.list();}
   for(const [route,method] of [['task-responsibilities','taskResponsibilities'],['task-responsibility-preview','taskResponsibilityPreview'],['task-responsibility-save','taskResponsibilitySave'],['feedback-decisions','feedbackDecisions'],['feedback-decision-preview','feedbackDecisionPreview'],['feedback-decision-save','feedbackDecisionSave'],['mentor-review-preview','mentorReviewPreview'],['mentor-review-save','mentorReviewSave'],['review-feedback','reviewFeedback'],['review-feedback-preview','reviewFeedbackPreview'],['review-feedback-save','reviewFeedbackSave']])if(req.url==='/api/'+route)result=workspace[method](input);
   if(req.url==='/api/review-package-preview')result=workspace.reviewPackagePreview(input);
   if(req.url==='/api/review-package-save')result=workspace.reviewPackageSave(input);
   if(req.url==='/api/draft')result=workspace.draft(input);
   if(req.url==='/api/draft-search')result=workspace.draftSearch(input);
   if(req.url==='/api/search')result=workspace.search(input);
   if(req.url==='/api/record')result=workspace.record(input);
   if(req.url==='/api/history')result=workspace.history(input);
   if(req.url==='/api/compare')result=workspace.compare(input);
   if(req.url==='/api/create')result=workspace.create(input);
   if(req.url==='/api/show'){exactObject(input,['ref']);result=workspace.show(input.ref);}
   if(req.url==='/api/task-update')result=workspace.taskUpdate(input);
   if(req.url==='/api/offer-form')result=workspace.offerForm(input);
   if(req.url==='/api/offer-restore')result=workspace.offerRestore(input);
   if(req.url==='/api/offer-latest')result=workspace.offerLatest(input);
   if(req.url==='/api/offer-preview')result=workspace.offerPreview(input);
   if(req.url==='/api/offer-save')result=workspace.offerSave(input);
   for(const [route,method] of [['export-contents','exportContents'],['export-preferences','exportPreferences'],['export-preference-preview','exportPreferencePreview'],['export-preference-save','exportPreferenceSave']])if(req.url==='/api/'+route)result=workspace[method](input);
   for(const [route,method] of [['research-conflicts','researchConflicts'],['conflict-candidate-preview','conflictCandidatePreview'],['conflict-review-preview','conflictReviewPreview'],['conflict-save','conflictSave'],['finding-classifications','findingClassifications'],['finding-classification-preview','findingClassificationPreview'],['finding-classification-save','findingClassificationSave'],['source-removal-preview','sourceRemovalPreview'],['source-removal-save','sourceRemovalSave'],['source-removal-recovery-preview','sourceRemovalRecoveryPreview'],['source-removal-recovery-save','sourceRemovalRecoverySave'],['source-management','sourceManagement'],['source-retention-preview','sourceRetentionPreview'],['source-retention-save','sourceRetentionSave'],['source-summary-provenance','sourceSummaryProvenance'],['source-summary-preview','sourceSummaryPreview'],['source-summary-save','sourceSummarySave'],['research-findings','researchFindings'],['finding-choices','findingChoices'],['research-finding-preview','researchFindingPreview'],['research-finding-save','researchFindingSave'],['conversation-notes','conversationNotes'],['conversation-note-read','conversationNoteRead'],['conversation-note-preview','conversationNotePreview'],['conversation-note-save','conversationNoteSave'],['source-inbox','sourceInbox'],['source-inbox-read','sourceInboxRead'],['source-inbox-preview','sourceInboxPreview'],['source-inbox-save','sourceInboxSave'],['revision-comments','revisionComments'],['revision-comment-preview','revisionCommentPreview'],['revision-comment-resolution-preview','revisionCommentResolutionPreview'],['revision-comment-save','revisionCommentSave'],['text-imports','textImports'],['text-import-read','textImportRead'],['text-import-preview','textImportPreview'],['text-import-save','textImportSave']])if(req.url==='/api/'+route)result=workspace[method](input);
   if(req.url==='/api/pdf-preview')result=await workspace.pdfPreview(input);
   if(req.url==='/api/pdf-save')result=await workspace.pdfSave(input);
   if(req.url==='/api/report-preview')result=workspace.reportPreview(input);
   if(req.url==='/api/report-save')result=workspace.reportSave(input);
   if(req.url==='/api/archive')result=workspace.archive(input);
   send(200,result);
  }catch(error){
   if(!res.destroyed&&!res.headersSent)send(error instanceof WorkspaceError?error.status:500,{error:error instanceof WorkspaceError?error.message:'The local data could not be processed. Check your project folder and try again. No files were automatically replaced.'});
  }
 });
 server.maxConnections=32;server.maxRequestsPerSocket=100;server.keepAliveTimeout=2000;
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
 host='127.0.0.1:'+server.address().port;origin='http://'+host;
 return {server,origin,token,url:origin+'/#session='+token,close:()=>new Promise((resolve,reject)=>{server.close(error=>error?reject(error):resolve());server.closeAllConnections();})};
}
