// Deterministic synthetic demo. No model, network, outreach or customer data.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {safeDirectory,attachFile,readCore,sha,writeExclusive} from '../src/store.mjs';
import {initializeProject} from '../src/initialize.mjs';
import {prepareBusinessBrief,readBusinessBrief,renderBusinessBrief} from '../src/business-brief.mjs';
import {exportCore,restoreCore} from '../src/transfer.mjs';
try {
  if(process.argv.length!==3)throw Error('Usage: node examples/demo-offer-change.mjs <new-directory-outside-app>');
  const root=safeDirectory(process.argv[2],true);fs.mkdirSync(root);
  const dir=path.join(root,'project'),projectId='synthetic-offer-demo';
  initializeProject(dir,{project_id:projectId,name:'Synthetic offer revision demonstration',first_task:{id:'draft-offer',title:'Prepare one fictional offer'}});
  const request={project_id:projectId,expected_revision:1,operation_id:'offer-demo-1',at:'2026-10-29',language:'en',kind:'offer',client:'Fictional Alder agency',period:'Synthetic October 2026',previous_artifact_id:null,change_reason:null,fields:[
    {key:'segment',value:'A fictional small design agency',assertion:'proposal',record_ids:[]},
    {key:'outcome',value:'Prepare a new report',assertion:'proposal',record_ids:[]},
    {key:'delivery',value:'One manual draft using fictional data',assertion:'proposal',record_ids:[]},
    {key:'exclusions',value:'No integrations or real customer data',assertion:'proposal',record_ids:[]},
    {key:'next_check',value:'Investigate the current reporting workflow; no interview conducted yet',assertion:'proposal',record_ids:[]}
  ]};
  function persist(p,label){
    const content=path.join(root,label+'.json'),update=path.join(root,label+'-update.json');
    writeExclusive(content,p.content);writeExclusive(update,JSON.stringify(p.update_request,null,2)+'\n');
    const receipt=attachFile(dir,p.update_request,content);
    assert.deepEqual(attachFile(dir,p.update_request,content),receipt);
    writeExclusive(path.join(root,label+'.md'),renderBusinessBrief(dir,projectId,p.artifact_id));
    return receipt;
  }
  const first=prepareBusinessBrief(dir,request);persist(first,'offer-v1');
  const firstFile=path.join(dir,'files',first.artifact_id+'.json'),oldHash=sha(fs.readFileSync(firstFile));
  const updated={...request,expected_revision:2,operation_id:'offer-demo-2',previous_artifact_id:first.artifact_id,change_reason:'Synthetic founder narrows the offer to improving existing work',fields:request.fields.map(f=>f.key==='outcome'?{...f,value:'Clarify one existing report'}:f)};
  const second=prepareBusinessBrief(dir,updated);persist(second,'offer-v2');
  assert.equal(sha(fs.readFileSync(firstFile)),oldHash);assert.deepEqual(second.changes.map(c=>c.key),['outcome']);
  const resumed=readBusinessBrief(dir,projectId,second.artifact_id);assert.equal(resumed.version,2);assert.equal(resumed.current_revision,3);
  assert.deepEqual(readBusinessBrief(dir,projectId,first.artifact_id).successor_ids,[second.artifact_id]);
  exportCore(dir,projectId,path.join(root,'export'));const restored=restoreCore(path.join(root,'export'),projectId,path.join(root,'restored'));
  assert.equal(readBusinessBrief(restored.directory,projectId,second.artifact_id).document_markdown,resumed.document_markdown);
  assert.equal(readCore(dir,projectId).dossier.tasks[0].progress,'open');
  const result={result:'pass',synthetic:true,project_id:projectId,directory:root,first_artifact:first.artifact_id,second_artifact:second.artifact_id,changes:second.changes,original_document_sha256:oldHash,original_preserved:true,dossier_revision:resumed.current_revision,restored_revision:restored.dossier.revision,task_completed:false,unknown_fields:resumed.fields.filter(f=>f.value===null).map(f=>f.key),checks:['actual save/read','exact retry','one scoped revision','prior bytes preserved','current version resumed','export/restore readback','no fake task completion'],limits:['Deterministic local helper demo, not an independent AI session','Synthetic business text; no customer interview, demand, payment or measured time benefit']};
  writeExclusive(path.join(root,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
}catch(error){console.error(JSON.stringify({error:error.message}));process.exitCode=1;}
