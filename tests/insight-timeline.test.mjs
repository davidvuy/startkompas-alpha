import {prepareBusinessBrief} from '../src/business-brief.mjs';
import {prepareSourceRemoval,applySourceRemoval} from '../src/source-removal.mjs';
import {readSnapshot} from '../src/history.mjs';
import {sha} from '../src/store.mjs';
import {prepareInboxSource} from '../src/source-inbox.mjs';import {prepareResearchFinding} from '../src/research-findings.mjs';
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {initializeProject} from '../src/initialize.mjs';import {readCore,updateCore} from '../src/store.mjs';import {saveGuided} from '../src/workspace.mjs';import {prepareDecisionLog,insightTimeline,decisionLog} from '../src/decision-log.mjs';
test('insight timeline includes explicit assumption decisions and leaves unrelated choices out',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-insight-')),dir=path.join(root,'project'),id='insight-test';t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:id,name:'Synthetic insight',first_task:{id:'task',title:'Review'}});
 updateCore(dir,{project_id:id,expected_revision:1,operation_id:'fixture',changes:{assumptions:[{id:'a',text:'Unknown need',assertion:'unknown',source_ids:[]}]}});
 for(const basis_id of ['a',null]){const s=readCore(dir,id),p=prepareDecisionLog(dir,id,s.dossier.revision,s.sha256,{previous:null,choice:'Test decision',reason:'Synthetic rationale',alternatives:[],reconsider_when:null,date:'2026-11-03',basis_id});saveGuided(dir,p,path.join(root,p.update_request.operation_id));}
 const draftState=readCore(dir,id),draft=prepareBusinessBrief(dir,{project_id:id,expected_revision:draftState.dossier.revision,operation_id:'linked-offer',at:'2026-11-03',language:'en',kind:'offer',client:null,period:null,previous_artifact_id:null,change_reason:null,fields:[{key:'segment',value:'Fictional segment',assertion:'proposal',record_ids:['a']}]});saveGuided(dir,draft,path.join(root,'offer-retry'));
 const revisionState=readCore(dir,id),revised=prepareBusinessBrief(dir,{project_id:id,expected_revision:revisionState.dossier.revision,operation_id:'revised-offer',at:'2026-11-03',language:'en',kind:'offer',client:null,period:null,previous_artifact_id:draft.artifact_id,change_reason:'Narrow the fictional audience',fields:[{key:'segment',value:'Narrow fictional segment',assertion:'proposal',record_ids:['a']}]});saveGuided(dir,revised,path.join(root,'revised-offer-retry'));
 const before=readCore(dir,id),view=insightTimeline(dir,id,'a');assert.equal(view.linked_drafts.length,2);assert.equal(view.linked_drafts[1].previous_artifact_id,draft.artifact_id);assert.equal(view.linked_drafts[1].change_reason,'Narrow the fictional audience');assert.deepEqual(view.linked_drafts[1].changes,[{key:'segment',before:'Fictional segment',after:'Narrow fictional segment'}]);assert.deepEqual(view.linked_drafts[0].successor_ids,[revised.artifact_id]);assert.deepEqual(view.linked_drafts[0].basis_ids,['a']);assert.equal(view.linked_drafts[0].artifact_id,draft.artifact_id);assert.equal(view.entries.length,1);assert.equal(view.entries[0].date_basis,'user_supplied_date');assert.equal(view.entries[0].reason,'Synthetic rationale');assert.equal(view.assumption.assertion,'unknown');assert.match(view.warning,/do not prove causation/);assert.equal(readCore(dir,id).sha256,before.sha256);assert.throws(()=>insightTimeline(dir,id,'missing'),/existing assumption/);
});

test('insight timeline preserves earlier assumption context and keeps later wording separate',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-insight-history-')),dir=path.join(root,'project'),id='insight-history';t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:id,name:'Synthetic history',first_task:{id:'task',title:'Review'}});
 updateCore(dir,{project_id:id,expected_revision:1,operation_id:'fixture',changes:{assumptions:[{id:'a',text:'Original hypothesis',assertion:'unknown',source_ids:[]}]}});
 const save=(fn,value)=>{const s=readCore(dir,id),p=fn(dir,id,s.dossier.revision,s.sha256,value);saveGuided(dir,p,path.join(root,p.update_request.operation_id));return p;};
 const source=save(prepareInboxSource,{title:'Fictional note',kind:'note',source_date:null,reference:null,raw_text:'A fictional observation',summary:null,context:'Synthetic',limitations:'Unvalidated',entered_by:'Alias'});
 const finding=save(prepareResearchFinding,{assumption_id:'a',target:{kind:'inbox',artifact_id:source.artifact_id,start:0,end:23},reason:'Investigate earlier hypothesis',entered_by:'Alias'});
 const s=readCore(dir,id);updateCore(dir,{project_id:id,expected_revision:s.dossier.revision,operation_id:'revise-hypothesis',changes:{assumptions:[{...s.dossier.assumptions[0],text:'Revised hypothesis'}]}});
 const before=readCore(dir,id),view=insightTimeline(dir,id,'a');assert.equal(view.assumption.text,'Revised hypothesis');assert.equal(view.entries.length,1);assert.equal(view.entries[0].id,finding.artifact_id);assert.equal(view.entries[0].assumption_then.text,'Original hypothesis');assert.equal(view.entries[0].finding.assumption_status,'changed');assert.equal(view.entries[0].finding.fragment.content.raw_text,'A fictional observation');assert.equal(view.entries[0].date_basis,'recorded_at');assert.equal(view.assumption_history.at(-1).status,'changed');assert.equal(view.assumption_history.at(-1).assumption.text,'Revised hypothesis');assert.ok(view.assumption_history.some(x=>x.assumption?.text==='Original hypothesis'));assert.equal(view.history_partial,false);assert.equal(readCore(dir,id).sha256,before.sha256);
 assert.ok(decisionLog(dir,id).finding_context.some(x=>x.id===finding.artifact_id));
 const decision=save(prepareDecisionLog,{previous:null,choice:'Reconsider the offer',reason:'This exact finding raised a question',alternatives:[],reconsider_when:null,date:'2026-11-03',basis_id:finding.artifact_id});
 const linked=insightTimeline(dir,id,'a').entries.find(x=>x.kind==='decision');assert.equal(linked.id,decision.record_id);assert.deepEqual(linked.linked_finding_ids,[finding.artifact_id]);assert.equal(linked.reason,'This exact finding raised a question');
 fs.appendFileSync(path.join(dir,'files',source.artifact_id+'.json'),' ');assert.ok(!decisionLog(dir,id).finding_context.some(x=>x.id===finding.artifact_id));assert.throws(()=>save(prepareDecisionLog,{previous:null,choice:'Invalid context',reason:'Test',alternatives:[],reconsider_when:null,date:'2026-11-03',basis_id:finding.artifact_id}),/finding source/);
});

for(const damage of ['missing','corrupt'])test('insight history exposes '+damage+' revisions without inventing a transition',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-insight-gap-')),dir=path.join(root,'project'),id='insight-gap';t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:id,name:'Synthetic gaps',first_task:{id:'task',title:'Review'}});
 for(const text of ['First hypothesis','Second hypothesis','Third hypothesis']){const s=readCore(dir,id);updateCore(dir,{project_id:id,expected_revision:s.dossier.revision,operation_id:'change-'+s.dossier.revision,changes:{assumptions:[{id:'a',text,assertion:'unknown',source_ids:[]}]}});}
 const file=readSnapshot(dir,id,3).file;if(damage==='missing')fs.unlinkSync(file);else fs.appendFileSync(file,' ');
 const before=readCore(dir,id),view=insightTimeline(dir,id,'a'),last=view.assumption_history.at(-1);
 assert.deepEqual(view.history_gaps,damage==='missing'?[{from_revision:3,to_revision:3}]:[]);assert.equal(last.revision,4);assert.equal(last.status,'observed');assert.equal(last.previous_revision,null);assert.equal(last.assumption.text,'Third hypothesis');
 assert.equal(view.assumption_history.some(x=>x.revision===3&&x.status==='unavailable'),damage==='corrupt');
 assert.ok(view.assumption_history.some(x=>x.assumption?.text==='First hypothesis'));assert.equal(readCore(dir,id).sha256,before.sha256);
});

test('insight history discloses truncation and refuses ambiguous revision ancestry',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-insight-bound-')),dir=path.join(root,'project'),id='insight-bound';t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:id,name:'Synthetic boundary',first_task:{id:'task',title:'Review'}});
 updateCore(dir,{project_id:id,expected_revision:1,operation_id:'fixture',changes:{assumptions:[{id:'a',text:'Hypothesis',assertion:'unknown',source_ids:[]}]}});
 const base=readCore(dir,id).dossier,h=path.join(dir,'.history');
 for(let revision=2;revision<=101;revision++){const bytes=Buffer.from(JSON.stringify({...base,revision}));fs.writeFileSync(path.join(h,revision+'-'+sha(bytes)+'.json'),bytes);}
 fs.writeFileSync(path.join(dir,'project.json'),JSON.stringify({...base,revision:102}));
 let view=insightTimeline(dir,id,'a');assert.equal(view.history_partial,true);assert.equal(view.assumption_history[0].revision,2);assert.equal(view.assumption_history[0].status,'observed');
 const alternate=Buffer.from(JSON.stringify({...base,revision:101,assumptions:[{...base.assumptions[0],text:'Ambiguous alternative'}]}));fs.writeFileSync(path.join(h,'101-'+sha(alternate)+'.json'),alternate);fs.writeFileSync(path.join(h,'unfinished.tmp'),'ignored');
 view=insightTimeline(dir,id,'a');assert.equal(view.history_unrecognized_entries,1);assert.ok(view.assumption_history.filter(x=>x.revision===101).every(x=>x.status==='unavailable'));assert.equal(view.assumption_history.at(-1).status,'observed');assert.equal(view.assumption_history.at(-1).previous_revision,null);assert.equal(view.assumption.text,'Hypothesis');
});

test('removing a decision source retains the decision for review without resurfacing removed finding text',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-insight-removal-')),dir=path.join(root,'project'),id='insight-removal';t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:id,name:'Synthetic removal',first_task:{id:'task',title:'Review'}});
 updateCore(dir,{project_id:id,expected_revision:1,operation_id:'fixture',changes:{assumptions:[{id:'a',text:'Unknown demand',assertion:'unknown',source_ids:[]}]}});
 const save=(fn,value)=>{const s=readCore(dir,id),p=fn(dir,id,s.dossier.revision,s.sha256,value);saveGuided(dir,p,path.join(root,'retry-'+p.update_request.operation_id));return p;};
 const source=save(prepareInboxSource,{title:'Fictional source',kind:'note',source_date:null,reference:null,raw_text:'UNIQUE_SYNTHETIC_SOURCE_PASSAGE',summary:null,context:'Synthetic',limitations:'Unvalidated',entered_by:'Alias'});
 const finding=save(prepareResearchFinding,{assumption_id:'a',target:{kind:'inbox',artifact_id:source.artifact_id,start:0,end:29},reason:'Review need',entered_by:'Alias'});
 const decision=save(prepareDecisionLog,{previous:null,choice:'Investigate more',reason:'Recorded user choice',alternatives:[],reconsider_when:null,date:'2026-11-03',basis_id:finding.artifact_id});
 const before=readCore(dir,id),removal=prepareSourceRemoval(dir,id,before.dossier.revision,before.sha256,source.artifact_id);applySourceRemoval(dir,removal.request,true);
 const row=decisionLog(dir,id).rows.find(x=>x.id===decision.record_id);assert.ok(row);assert.equal(row.requires_review,true);assert.equal(row.reason,'Recorded user choice');assert.equal(row.details_status,'recorded');
 const timeline=insightTimeline(dir,id,'a');assert.equal(timeline.entries.some(x=>x.kind==='research_link'),false);assert.ok(!JSON.stringify(timeline).includes('UNIQUE_SYNTHETIC_SOURCE_PASSAGE'));assert.equal(decisionLog(dir,id).finding_context.length,0);
});


test('offer timeline follows explicit decision context, excludes unrelated drafts and exposes damaged candidates',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-insight-offers-')),dir=path.join(root,'project'),id='insight-offers';t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:id,name:'Synthetic offers',first_task:{id:'task',title:'Review'}});
 updateCore(dir,{project_id:id,expected_revision:1,operation_id:'fixture',changes:{assumptions:[{id:'a',text:'Unknown demand',assertion:'unknown',source_ids:[]}]}});
 const state=readCore(dir,id),decision=prepareDecisionLog(dir,id,state.dossier.revision,state.sha256,{previous:null,choice:'Investigate',reason:'Synthetic question',alternatives:[],reconsider_when:null,date:'2026-11-03',basis_id:'a'});saveGuided(dir,decision,path.join(root,'decision-retry'));
 const saved=[];
 for(const [operation_id,kind,record_ids] of [['decision-offer','offer',[decision.record_id]],['unrelated-offer','offer',[]],['linked-interview','interview',['a']]]){
  const current=readCore(dir,id),draft=prepareBusinessBrief(dir,{project_id:id,expected_revision:current.dossier.revision,operation_id,at:'2026-11-03',language:'en',kind,client:null,period:null,previous_artifact_id:null,change_reason:null,fields:[{key:kind==='offer'?'segment':'learning',value:'UNIQUE_SYNTHETIC_OFFER_CONTENT',assertion:'proposal',record_ids}]});saveGuided(dir,draft,path.join(root,operation_id));saved.push(draft);
 }
 let view=insightTimeline(dir,id,'a');assert.equal(view.linked_drafts.length,1);assert.equal(view.linked_drafts[0].artifact_id,saved[0].artifact_id);assert.deepEqual(view.linked_drafts[0].basis_ids,[decision.record_id]);
 fs.appendFileSync(path.join(dir,'files',saved[0].artifact_id+'.json'),' ');
 const before=readCore(dir,id);view=insightTimeline(dir,id,'a');assert.deepEqual(view.linked_drafts,[{artifact_id:saved[0].artifact_id,status:'unavailable',date:'2026-11-03'}]);assert.ok(!JSON.stringify(view).includes('UNIQUE_SYNTHETIC_OFFER_CONTENT'));assert.equal(readCore(dir,id).sha256,before.sha256);
});


test('decision attribution retains stated owner and uncertainty without promoting evidence',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-decision-attribution-')),dir=path.join(root,'project'),id='decision-attribution';t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:id,name:'Synthetic attribution',first_task:{id:'task',title:'Review'}});
 const state=readCore(dir,id),request={previous:null,choice:'Investigate the proposed offer',reason:'A question remains open',alternatives:[],reconsider_when:null,date:'2026-11-03',basis_id:null,attribution:{owner_alias:'Practice owner',remaining_uncertainty:'Demand remains unknown.'}};
 for(const attribution of [{owner_alias:' ',remaining_uncertainty:'Unknown'},{owner_alias:'Owner',remaining_uncertainty:''},{owner_alias:'Owner',remaining_uncertainty:'Unknown',verified:true}])assert.throws(()=>prepareDecisionLog(dir,id,state.dossier.revision,state.sha256,{...request,attribution}),/Invalid decision/);
 const prepared=prepareDecisionLog(dir,id,state.dossier.revision,state.sha256,request);assert.deepEqual(prepared.preview.attribution,request.attribution);assert.match(prepared.preview.feedback_warning,/No owner responses were selected/);assert.match(prepared.preview.attribution_warning,/not authenticated/);saveGuided(dir,prepared,path.join(root,'retry'));
 const saved=decisionLog(dir,id).rows[0];assert.deepEqual(saved.details.request.attribution,request.attribution);assert.equal(saved.details.origin,'user_statement');const after=readCore(dir,id);for(const key of ['tasks','facts','assumptions','checks'])assert.deepEqual(after.dossier[key],state.dossier[key]);
 const revision=prepareDecisionLog(dir,id,after.dossier.revision,after.sha256,{...request,previous:saved.id,choice:'Investigate a narrower offer',attribution:{owner_alias:'Second practice owner',remaining_uncertainty:'Demand is still unknown.'}});saveGuided(dir,revision,path.join(root,'retry-revision'));
 const history=decisionLog(dir,id).rows;assert.equal(history.length,2);assert.deepEqual(history[1].details.request.attribution,request.attribution);assert.equal(history[1].status,'superseded');assert.equal(history[0].details.request.attribution.owner_alias,'Second practice owner');
});
