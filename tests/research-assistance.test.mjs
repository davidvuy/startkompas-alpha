import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initializeProject} from '../src/initialize.mjs';
import {readCore} from '../src/store.mjs';
import {saveGuided} from '../src/workspace.mjs';
import {prepareInboxSource,readInboxSource} from '../src/source-inbox.mjs';
import {prepareSourceSummary,sourceSummaryProvenance} from '../src/source-summaries.mjs';
const suite=JSON.parse(fs.readFileSync(new URL('../examples/research-assistance-cases.json',import.meta.url),'utf8'));
for(const scenario of suite.cases)test('research assistance persistence boundary: '+scenario.id,t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-research-eval-')),dir=path.join(root,'project'),id='research-eval';
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:id,name:'Synthetic evaluation',first_task:{id:'check',title:'Review source'}});
 let sequence=0;const state=()=>readCore(dir,id),save=p=>saveGuided(dir,p,path.join(root,'retry-'+ ++sequence));let s=state();
 const source=prepareInboxSource(dir,id,s.dossier.revision,s.sha256,{title:scenario.id,kind:'note',source_date:null,reference:scenario.reference??null,raw_text:scenario.source,summary:null,context:'Synthetic evaluation only',limitations:'No actual participant or market validation',entered_by:'Synthetic reviewer'});save(source);s=state();
 const request={source_id:source.artifact_id,method:'ai_assisted',tool_label:'Synthetic candidate; no model run',entered_by:'Synthetic reviewer',limitations:'Deliberately unsupported candidate; do not treat as truth',blocks:[{kind:'interpretation',text:scenario.unsupported_response}]};
 const prepare=raw=>prepareSourceSummary(dir,id,s.dossier.revision,s.sha256,raw);
 if(scenario.source===null){assert.throws(()=>prepare(request),/raw source text/);assert.equal(state().sha256,s.sha256);return;}
 assert.throws(()=>prepare({...request,blocks:[{kind:'quotation',start:0,end:scenario.source.length,text:scenario.unsupported_response}]}),/Invalid summary fields/);
 const summary=prepare({...request,blocks:[{kind:'quotation',start:0,end:scenario.source.length},...request.blocks]});assert.equal(state().sha256,s.sha256);save(summary);
 const result=sourceSummaryProvenance(dir,id,source.artifact_id),row=result.items[0];assert.equal(row.blocks[0].text,scenario.source);assert.equal(row.blocks[1].text,scenario.unsupported_response);assert.equal(row.blocks[1].kind,'interpretation');assert.match(row.blocks[1].attribution,/not a participant quotation/);assert.match(row.warning,/unsupported claims/);assert.equal(row.input.method,'ai_assisted');assert.equal(row.basis.source_id,source.artifact_id);assert.equal(readInboxSource(dir,id,source.artifact_id).input.raw_text,scenario.source);
 for(const key of ['tasks','facts','evidence','assumptions','decisions','sources','workflow'])assert.deepEqual(state().dossier[key],s.dossier[key]);
 assert.equal(row.source_status,'unchanged');assert.ok(scenario.expected.length>=3&&scenario.hard_fail.length>=2);
});
