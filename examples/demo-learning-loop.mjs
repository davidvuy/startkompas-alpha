// Synthetic reference route. No model, network, participants or business validation.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {safeDirectory,readCore,updateCore} from '../src/store.mjs';
import {initializeProject} from '../src/initialize.mjs';
import {saveGuided} from '../src/workspace.mjs';
import {prepareBusinessBrief} from '../src/business-brief.mjs';
import {prepareDocumentSection} from '../src/document-section.mjs';
import {prepareInboxSource} from '../src/source-inbox.mjs';
import {prepareExperimentStart,prepareExperimentObservation} from '../src/experiment-runs.mjs';
import {prepareExperimentReview} from '../src/experiment-reviews.mjs';
export function learningLoop(destination){
 const root=safeDirectory(destination,true);const app=fileURLToPath(new URL('../',import.meta.url)),relative=path.relative(app,root);if(relative===''||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Choose a directory outside the application');fs.mkdirSync(root);
 const dir=path.join(root,'project'),id='synthetic-learning-loop';initializeProject(dir,{project_id:id,name:'Fictional learning loop - not customer research',first_task:{id:'review',title:'Review the fictional learning example'}});
 updateCore(dir,{project_id:id,expected_revision:1,operation_id:'mark-practice',changes:{events:[{id:'practice-project-created',type:'practice-project',at:'2026-11-03',description:'Synthetic reference route; no actual customer research',subject_ids:[]}]}});
 const state=()=>readCore(dir,id),save=p=>{saveGuided(dir,p,path.join(root,'retry-'+p.update_request.operation_id));return p.artifact_id;};
 const brief=(kind,fields,previous=null,reason=null)=>{const s=state();return prepareBusinessBrief(dir,{project_id:id,expected_revision:s.dossier.revision,operation_id:'brief-'+s.dossier.revision,at:'2026-11-03',language:'en',kind,client:'Fictional design studio',period:'Synthetic reference only',previous_artifact_id:previous,change_reason:reason,fields});};
 const field=(key,value,record_ids=[])=>({key,value,record_ids,assertion:'proposal'});
 const offer=save(brief('offer',[field('segment','Fictional small design studios'),field('outcome','Replace the existing handover process'),field('delivery','A manually prepared checklist using fictional data'),field('exclusions','No integrations or real customer data'),field('next_check','Check whether a recent concrete handover problem exists')]));
 const plan=save(brief('experiment',[
 field('question','Does the fictional note describe a recent concrete handover problem?',[offer]),
 field('method','Inspect one invented note; no recruitment or actual conversation'),
 field('audience','Fictional design studio; no real participants'),
 field('effort','One local example; zero spending or paid tools'),
 field('observation','Record whether a recent problem and a working alternative are mentioned'),
 field('decision_rule','If no recent problem is described and the current checklist works, narrow the offer to further investigation'),
 field('boundaries','Stop after the invented note; no validation, payment or launch decision')
 ]));
 let s=state();const run=save(prepareExperimentStart(dir,id,s.dossier.revision,s.sha256,{plan_id:plan,entered_by:'Synthetic reviewer',declaration:'Fictional reference run; not an actual experiment'}));
 s=state();const source=save(prepareInboxSource(dir,id,s.dossier.revision,s.sha256,{title:'Invented contrary observation',kind:'note',source_date:null,reference:null,raw_text:'Fictional P01: The idea sounds nice, but I cannot recall a recent handover problem. Our existing checklist works. I have not agreed to buy.',summary:null,context:'Invented statement for a repeatable software test',limitations:'No real participant, conversation, consent or purchase',entered_by:'Synthetic reviewer'}));
 s=state();const observation=save(prepareExperimentObservation(dir,id,s.dossier.revision,s.sha256,{run_id:run,source_id:source,observed_on:'2026-11-03',observation:'The invented note describes no recent problem, a working checklist and no purchase agreement.',interpretation:'Polite interest does not establish demand; investigate concrete recent work before replacing a process.',entered_by:'Synthetic reviewer'}));
 s=state();const review=save(prepareExperimentReview(dir,id,s.dossier.revision,s.sha256,{run_id:run,observation_ids:[observation],choice:'adapt',reason:'The invented observation meets the original reconsider condition.',implications:'Propose narrowing the offer outcome; preserve its delivery and exclusions. No real-world conclusion.',target_ids:[offer],entered_by:'Synthetic reviewer'}));
 s=state();const revised=save(prepareDocumentSection(dir,id,s.dossier.revision,s.sha256,{artifact_id:offer,key:'outcome',value:'Investigate one recent handover before proposing process changes',review_id:review,reason:'The synthetic experiment review supports a narrower proposed outcome; no demand was validated.'}));
 return {synthetic:true,project_directory:dir,project_id:id,offer,plan,run,source,observation,review,revised_offer:revised,revision:state().dossier.revision,real_participants:0,validation:'not_established'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){try{if(process.argv.length!==3)throw Error('Usage: node examples/demo-learning-loop.mjs <new-directory-outside-app>');console.log(JSON.stringify(learningLoop(process.argv[2]),null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
