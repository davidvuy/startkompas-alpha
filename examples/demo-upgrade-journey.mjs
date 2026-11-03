// Synthetic upgrade rehearsal. No external service, model or actual participants.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {safeDirectory,createCore,readCore} from '../src/store.mjs';
import {upgradeWorkflow} from '../src/workflow.mjs';
import {libraryModule} from '../src/module-library.mjs';
import {prepareModuleTrial,moduleTrials} from '../src/module-trial.mjs';
import {prepareTextImport,readTextImport} from '../src/text-import.mjs';
import {prepareDecisionLog,decisionLog} from '../src/decision-log.mjs';
import {saveGuided} from '../src/workspace.mjs';
import {exportCore,restoreCore} from '../src/transfer.mjs';
export function upgradeJourney(destination){
 const root=safeDirectory(destination,true),app=fileURLToPath(new URL('../',import.meta.url)),relative=path.relative(app,root);
 if(relative===''||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Choose a new directory outside the application');
 fs.mkdirSync(root);const old=path.join(root,'original'),dir=path.join(root,'upgraded'),restored=path.join(root,'restored');
 const seed=JSON.parse(fs.readFileSync(new URL('dossier-v1.json',import.meta.url),'utf8'));seed.name='Fictional upgrade rehearsal - not customer evidence';seed.events.push({id:'practice-project-created',type:'practice-project',at:'2026-11-03',description:'Synthetic upgrade reference; no actual customer research',subject_ids:[]});
 createCore(old,seed);const id=seed.project_id,original=readCore(old,id);upgradeWorkflow(old,id,dir);
 const state=()=>readCore(dir,id),save=p=>{saveGuided(dir,p,path.join(root,'retry-'+p.update_request.operation_id));return p;};
 let s=state();const selected=libraryModule('scoped-service');
 const trial=save(prepareModuleTrial(dir,{project_id:id,expected_revision:s.dossier.revision,expected_sha256:s.sha256,module:selected.module,module_sha256:selected.sha256,route_id:'prepare',answers:{outcome:'Fictional assessment of one handover; no implementation promise'}}));
 s=state();const imported=save(prepareTextImport(dir,id,s.dossier.revision,s.sha256,{title:'Synthetic contrary note',format:'text',text:'Invented example: the existing checklist works; no recent loss is described. This is not customer evidence.',record_ids:[]}));
 s=state();const previous=s.dossier.decisions.find(d=>d.status==='active');if(!previous)throw Error('Synthetic seed requires an active decision');
 const decision=save(prepareDecisionLog(dir,id,s.dossier.revision,s.sha256,{previous:previous.id,choice:'Investigate one recent handover before proposing replacement',reason:'The explicitly fictional note challenges the initial direction; no demand conclusion is established.',alternatives:['Retain the current checklist','Investigate a different problem'],reconsider_when:'An actual permitted observation supplies contrary or supporting evidence',date:'2026-11-03',basis_id:null,attribution:{owner_alias:'Synthetic project owner',remaining_uncertainty:'Actual frequency, impact and willingness to pay remain unknown.'}}));
 const bundle=path.join(root,'export');exportCore(dir,id,bundle);restoreCore(bundle,id,restored);
 if(readCore(old,id).sha256!==original.sha256)throw Error('Original project changed');
 if(readCore(restored,id).sha256!==state().sha256)throw Error('Restored project differs');
 if(JSON.stringify(moduleTrials(restored,id))!==JSON.stringify(moduleTrials(dir,id)))throw Error('Restored trial differs');
 if(readTextImport(restored,id,imported.artifact_id).text!==readTextImport(dir,id,imported.artifact_id).text)throw Error('Restored selected source differs');
 if(JSON.stringify(decisionLog(restored,id).rows)!==JSON.stringify(decisionLog(dir,id).rows))throw Error('Restored decision differs');
 return {synthetic:true,project_id:id,original_directory:old,project_directory:dir,restored_directory:restored,original_sha256:original.sha256,restored_sha256:readCore(restored,id).sha256,module_trial:trial.artifact_id,imported_source:imported.artifact_id,previous_decision:previous.id,decision_artifact:decision.artifact_id,revision:state().dossier.revision,limitations:['Fictional module trial, not live activation','Local selected text import, not remote synchronization','Decision reason is a user statement; imported text is not verified evidence','No real participants or customer validation']};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){try{if(process.argv.length!==3)throw Error('Usage: node examples/demo-upgrade-journey.mjs <new-directory-outside-app>');console.log(JSON.stringify(upgradeJourney(process.argv[2]),null,2));}catch(error){console.error(error.message);process.exitCode=1;}}
