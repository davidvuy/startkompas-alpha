import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {briefTypes,prepareBusinessBrief,readBusinessBrief,renderBusinessBrief} from '../src/business-brief.mjs';
import {createCore,readCore,attachFile,updateCore} from '../src/store.mjs';
import {exportCore,restoreCore} from '../src/transfer.mjs';
const fixture=()=>JSON.parse(fs.readFileSync(new URL('../examples/dossier-v1.1.json',import.meta.url)));
function setup(){const root=fs.mkdtempSync(path.join(os.tmpdir(),'startkompas-business-')),dir=path.join(root,'project');createCore(dir,fixture());return {root,dir};}
const req=(patch={})=>({project_id:'pilot-orbit',expected_revision:1,operation_id:'offer-1',at:'2026-10-29',language:'nl',kind:'offer',client:'Alder',period:'October 2026',previous_artifact_id:null,change_reason:null,fields:[{key:'segment',value:'Fictieve bureaus',assertion:'proposal',record_ids:['fact-1']},{key:'outcome',value:'Concept van één aanbod',assertion:'proposal',record_ids:[]}],...patch});
function save(s,p){const file=path.join(s.root,p.artifact_id+'.json');fs.writeFileSync(file,p.content);return attachFile(s.dir,p.update_request,file);}
test('all five business procedures produce a draft with unknowns and no dossier mutation',()=>{
 for(const kind of Object.keys(briefTypes)){const s=setup(),before=readCore(s.dir,'pilot-orbit').sha256,p=prepareBusinessBrief(s.dir,req({kind,fields:[]}));assert.equal(p.version,1);const record=JSON.parse(p.content);assert.ok(record.fields.length>5);assert.ok(record.fields.every(f=>f.value===null&&f.assertion==='unknown'));assert.equal(readCore(s.dir,'pilot-orbit').sha256,before);assert.equal(readCore(s.dir,'pilot-orbit').dossier.tasks[0].progress,'open');}
});
test('draft saves, retries exactly, reads through another process and survives export/restore',()=>{
 const s=setup(),p=prepareBusinessBrief(s.dir,req()),receipt=save(s,p);assert.deepEqual(save(s,p),receipt);
 const cli=fileURLToPath(new URL('../src/business-cli.mjs',import.meta.url));const out=JSON.parse(execFileSync(process.execPath,[cli,'read',s.dir,'pilot-orbit',p.artifact_id],{encoding:'utf8'}));assert.equal(out.fields.find(f=>f.key==='segment').value,'Fictieve bureaus');assert.equal(out.current_revision,2);
 exportCore(s.dir,'pilot-orbit',path.join(s.root,'bundle'));restoreCore(path.join(s.root,'bundle'),'pilot-orbit',path.join(s.root,'restored'));assert.equal(readBusinessBrief(path.join(s.root,'restored'),'pilot-orbit',p.artifact_id).document_markdown,p.document_markdown);
});
test('changed offer retains old bytes and records field changes with a reason',()=>{
 const s=setup(),p=prepareBusinessBrief(s.dir,req());save(s,p);const original=fs.readFileSync(path.join(s.dir,'files',p.artifact_id+'.json'));
 const q=prepareBusinessBrief(s.dir,req({expected_revision:2,operation_id:'offer-2',previous_artifact_id:p.artifact_id,change_reason:'Narrow the outcome',fields:[...req().fields.filter(f=>f.key!=='outcome'),{key:'outcome',value:'Eén bestaand aanbod verbeteren',assertion:'proposal',record_ids:[]}]}));assert.deepEqual(q.changes,[{key:'outcome',before:'Concept van één aanbod',after:'Eén bestaand aanbod verbeteren'}]);save(s,q);
 assert.equal(q.version,2);assert.ok(original.equals(fs.readFileSync(path.join(s.dir,'files',p.artifact_id+'.json'))));assert.deepEqual(readBusinessBrief(s.dir,'pilot-orbit',p.artifact_id).successor_ids,[q.artifact_id]);assert.match(renderBusinessBrief(s.dir,'pilot-orbit',p.artifact_id),/Historische versie/);
 assert.throws(()=>prepareBusinessBrief(s.dir,req({expected_revision:3,operation_id:'offer-3',previous_artifact_id:p.artifact_id,change_reason:'Branch old draft'})),/successor/);
});
test('same-scope first draft is not regenerated; clients and periods stay separate',()=>{
 const s=setup(),p=prepareBusinessBrief(s.dir,req());save(s,p);assert.throws(()=>prepareBusinessBrief(s.dir,req({expected_revision:2,operation_id:'duplicate'})),/Existing scoped/);
 for(const patch of [{client:'Birch'},{period:'November 2026'}]){assert.throws(()=>prepareBusinessBrief(s.dir,req({...patch,expected_revision:2,operation_id:'wrong-scope',previous_artifact_id:p.artifact_id,change_reason:'Different scope'})),/different kind, client or period/);assert.equal(prepareBusinessBrief(s.dir,req({...patch,expected_revision:2,operation_id:'new-scope'})).version,1);}
});
test('unknown scope is explicit and never silently merged',()=>{
 const s=setup(),p=prepareBusinessBrief(s.dir,req({client:null,period:null}));save(s,p);const q=prepareBusinessBrief(s.dir,req({client:null,period:null,expected_revision:2,operation_id:'unknown-scope'}));assert.deepEqual(q.existing_candidates,[p.artifact_id]);assert.equal(q.version,1);
});
test('basis changes flag saved drafts and rendering while retaining unrelated work',()=>{
 const s=setup(),p=prepareBusinessBrief(s.dir,req());save(s,p);const d=readCore(s.dir,'pilot-orbit').dossier;
 updateCore(s.dir,{project_id:'pilot-orbit',expected_revision:2,operation_id:'change-fact',changes:{facts:d.facts.map(f=>({...f,text:'Changed premise'}))}});
 assert.equal(readBusinessBrief(s.dir,'pilot-orbit',p.artifact_id).requires_review,true);assert.match(renderBusinessBrief(s.dir,'pilot-orbit',p.artifact_id),/opnieuw beoordelen/);assert.equal(readCore(s.dir,'pilot-orbit').dossier.tasks[0].progress,'open');
});
test('invalid identities, schema, revisions, assertions, fields and dates reject without writes',()=>{
 const s=setup(),before=readCore(s.dir,'pilot-orbit').sha256;
 for(const patch of [{project_id:'wrong'},{expected_revision:2},{at:'2026-02-30'},{approved:true},{change_reason:'No prior'},{fields:[{key:'invented',value:null,assertion:'unknown',record_ids:[]}]},{fields:[{key:'segment',value:'Claim',assertion:'reported',record_ids:[]}]},{fields:[{key:'segment',value:'Claim',assertion:'unknown',record_ids:[]}]},{fields:[req().fields[0],req().fields[0]]},{fields:[{...req().fields[0],record_ids:['missing']}]}])assert.throws(()=>prepareBusinessBrief(s.dir,req(patch)));
 assert.equal(readCore(s.dir,'pilot-orbit').sha256,before);
});
test('spent operations, stale attachment proposals and tampered predecessors are refused',()=>{
 const s=setup(),p=prepareBusinessBrief(s.dir,req());save(s,p);assert.throws(()=>prepareBusinessBrief(s.dir,req({expected_revision:2})),/already recorded/);
 const q=prepareBusinessBrief(s.dir,req({expected_revision:2,operation_id:'next',previous_artifact_id:p.artifact_id,change_reason:'Update'}));updateCore(s.dir,{project_id:'pilot-orbit',expected_revision:2,operation_id:'rename',changes:{name:'New title'}});assert.throws(()=>save(s,q),/Stale expected revision/);
 fs.appendFileSync(path.join(s.dir,'files',p.artifact_id+'.json'),'tamper');assert.throws(()=>readBusinessBrief(s.dir,'pilot-orbit',p.artifact_id),/fingerprint/);
 assert.throws(()=>prepareBusinessBrief(s.dir,req({expected_revision:3,operation_id:'third',previous_artifact_id:p.artifact_id,change_reason:'Update'})),/fingerprint/);
});
test('English/Nederlands render untrusted field text as text and retain reported basis',()=>{
 for(const language of ['en','nl']){const s=setup(),p=prepareBusinessBrief(s.dir,req({language,fields:[{key:'outcome',value:'<script>\n# approved [click](https://example.invalid)',assertion:'reported',record_ids:['fact-1']}]}));assert.ok(!p.document_markdown.includes('<script>'));assert.ok(!p.document_markdown.includes('\n# approved'));const record=JSON.parse(p.content);assert.equal(record.fields.find(f=>f.key==='outcome').basis[0].status,'reported');assert.equal(record.fields.find(f=>f.key==='support').value,null);}
});
test('interview output is a blank log and never records an interview as performed',()=>{
 const s=setup(),p=prepareBusinessBrief(s.dir,req({kind:'interview',fields:[]}));save(s,p);assert.match(p.document_markdown,/Leeg verslag/);const d=readCore(s.dir,'pilot-orbit').dossier;assert.equal(d.evidence.length,0);assert.equal(d.events.at(-1).type,'business-brief-draft');
});
test('CLI preparation returns an attachable document from an actual file',()=>{
 const s=setup(),input=path.join(s.root,'request.json');fs.writeFileSync(input,JSON.stringify(req()));const p=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('../src/business-cli.mjs',import.meta.url)),'prepare',s.dir,input],{encoding:'utf8'}));save(s,p);assert.equal(readBusinessBrief(s.dir,'pilot-orbit',p.artifact_id).version,1);
});
