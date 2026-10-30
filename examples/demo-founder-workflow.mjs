import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {initializeProject} from '../src/initialize.mjs';
import {readCore,safeDirectory,writeExclusive,bytesFor} from '../src/store.mjs';
import {prepareRecord,saveGuided,workspaceView,renderWorkspace,reportPreview,writeReport,recoveryCheck,impactView} from '../src/workspace.mjs';
import {prepareBusinessBrief} from '../src/business-brief.mjs';
try{
 if(process.argv.length!==3)throw Error('Usage: node examples/demo-founder-workflow.mjs <new-private-directory>');
 const root=safeDirectory(process.argv[2],true);fs.mkdirSync(root);const dir=path.join(root,'project'),id='fictional-founder';
 initializeProject(dir,{project_id:id,name:'Fictional reporting service',first_task:{id:'first-offer',title:'Prepare a testable first offer'}});
 const save=(kind,input)=>{const rev=readCore(dir,id).dossier.revision,p=prepareRecord(dir,id,rev,kind,input);saveGuided(dir,p,path.join(root,'retry-'+rev));return p.record_id;};
 const assumption=save('assumption',{text:'Small teams might need help clarifying an existing report.'});
 const observation=save('observation',{text:'Synthetic participant P01 says they rewrite a report manually. This conversation did not actually occur.',title:'Fictional P01',location:'Synthetic fixture inside this example',scope:'Invented demonstration, no real customer evidence',date:'2026-10-30',basis_ids:[assumption]});
 save('decision',{text:'Prepare a narrow offer for a future customer conversation.',reason:'Demonstrate a traceable decision without claiming validation.',basis_ids:[observation]});
 const prepared=prepareBusinessBrief(dir,{project_id:id,expected_revision:4,operation_id:'demo-guided-offer',at:'2026-10-30',language:'en',kind:'offer',client:'Fictional small team',period:null,previous_artifact_id:null,change_reason:null,fields:[{key:'segment',value:'Small teams with an existing report',assertion:'proposal',record_ids:[assumption]},{key:'outcome',value:'Clarify one existing report',assertion:'proposal',record_ids:[observation]},{key:'next_check',value:'Ask a willing participant about a recent reporting task',assertion:'proposal',record_ids:[]}]});
 saveGuided(dir,prepared,path.join(root,'retry-offer'));
 const view=workspaceView(dir,id);writeExclusive(path.join(root,'workspace.md'),renderWorkspace(view));
 const report=reportPreview(dir,id,['summary','assumptions','decisions','drafts']);writeReport(dir,id,report.sections,report.confirmation_sha256,path.join(root,'report.md'));
 const drill=recoveryCheck(dir,id,path.join(root,'recovery-check'));
 assert.equal(readCore(dir,id).dossier.assumptions[0].assertion,'unknown');assert.equal(view.drafts[0].status,'draft');assert.equal(drill.canonical_hash_matches,true);assert.ok(impactView(dir,id,assumption).affected.length>=4);
 const result={result:'pass',synthetic:true,revision:view.revision,assumption_still_unknown:true,draft_not_approved:true,restored:drill.canonical_hash_matches,outputs:['workspace.md','report.md','recovery-check/result.json'],limits:'No real interview, demand evidence or AI call. These are fictional workflow checks.'};
 writeExclusive(path.join(root,'result.json'),bytesFor(result));console.log(JSON.stringify(result,null,2));
}catch(error){console.error(error.message);process.exitCode=1;}
