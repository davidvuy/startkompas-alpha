import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {renderPdf} from '../src/pdf-render.mjs';
import {previewPdf,writePdf} from '../src/pdf-export.mjs';
import {initializeProject} from '../src/initialize.mjs';
import {readCore} from '../src/store.mjs';
import {prepareTemplateDraft} from '../src/template-draft.mjs';
import {libraryTemplate} from '../src/template-library.mjs';
import {saveGuided} from '../src/workspace.mjs';
import {prepareDocumentSection} from '../src/document-section.mjs';

test('PDF renderer embeds fonts, paginates long rows, reports missing glyphs and stays deterministic',async()=>{
 const text='# Fictional review\n\nCafé naïve €120 α Ж\n\n| Item | Scope |\n| --- | --- |\n| A | One bounded check |\n',a=await renderPdf(text),b=await renderPdf(text);
 assert.equal(a.bytes.subarray(0,5).toString(),'%PDF-');assert.equal(a.sha256,b.sha256);assert.deepEqual(a.warnings,[]);assert.equal(a.pages,1);assert.match(a.bytes.toString('latin1'),/FontFile2/);
 const long=await renderPdf(text+'| Very long row | '+'Repeated fictional observation. '.repeat(500)+' |\n\n## Last reference\nhttps://example.com/last\n');assert.ok(long.pages>2);
 const glyph=await renderPdf('# Missing glyph\n🧭');assert.match(glyph.warnings.join(' '),/U\+1F9ED/);
 const fallback=await renderPdf(text,{fontDirectory:path.join(os.tmpdir(),'absent-startkompas-fonts')});assert.equal(fallback.pages,1);assert.match(fallback.warnings.join(' '),/fonts unavailable/);assert.match(fallback.warnings.join(' '),/U\+00E9/);
 await assert.rejects(renderPdf('x'.repeat(250001)),/250000/);await assert.rejects(renderPdf('| A | B |\n| --- | --- |\n| one | two | three |'),/consistent columns/);
});
test('PDF snapshots preserve selection, exact digest, old bytes and project boundaries',async t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-pdf-')),dir=path.join(root,'project');t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:'pdf-test',name:'Private fictional name',first_task:null});let state=readCore(dir,'pdf-test');
 const prepared=prepareTemplateDraft(dir,{project_id:'pdf-test',expected_revision:state.dossier.revision,expected_sha256:state.sha256,template:libraryTemplate('bounded-audit').template,answers:{outcome:'One fictional review',support:'PRIVATE INTERNAL NOTE'},client:null,period:null});saveGuided(dir,prepared,path.join(root,'first'));
 const selection={kind:'summary',artifact_id:prepared.artifact_id,keys:['outcome']},preview=await previewPdf(dir,'pdf-test',selection);assert.doesNotMatch(preview.markdown,/PRIVATE INTERNAL NOTE|Private fictional name/);const target=path.join(root,'summary.pdf');await writePdf(dir,'pdf-test',selection,preview.sha256,target);assert.deepEqual(fs.readFileSync(target),preview.bytes);
 await assert.rejects(writePdf(dir,'pdf-test',selection,preview.sha256,target));await assert.rejects(writePdf(dir,'pdf-test',selection,'0'.repeat(64),path.join(root,'wrong.pdf')),/changed/);await assert.rejects(writePdf(dir,'pdf-test',selection,preview.sha256,path.join(dir,'inside.pdf')),/outside/);
 const document=await previewPdf(dir,'pdf-test',{kind:'document',artifact_id:prepared.artifact_id});assert.match(document.markdown,/PRIVATE INTERNAL NOTE/);const report=await previewPdf(dir,'pdf-test',{kind:'report',sections:['summary']});assert.match(report.markdown,/Private fictional name/);assert.doesNotMatch(report.markdown,/PRIVATE INTERNAL NOTE/);
 state=readCore(dir,'pdf-test');const changed=prepareDocumentSection(dir,'pdf-test',state.dossier.revision,state.sha256,{artifact_id:prepared.artifact_id,key:'outcome',value:'Changed fictional scope',reason:'Revise proposal'});saveGuided(dir,changed,path.join(root,'second'));
 await assert.rejects(writePdf(dir,'pdf-test',selection,preview.sha256,path.join(root,'stale.pdf')));assert.deepEqual(fs.readFileSync(target),preview.bytes);await assert.rejects(previewPdf(dir,'pdf-test',{...selection,private:true}),/exact/);
});
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
test('PDF command previews and saves the exact local snapshot without exposing malformed input',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'sk-pdf-cli-')),dir=path.join(root,'project');t.after(()=>fs.rmSync(root,{recursive:true,force:true}));initializeProject(dir,{project_id:'pdf-cli',name:'Fictional CLI project',first_task:null});const state=readCore(dir,'pdf-cli'),selection=path.join(root,'selection.json'),output=path.join(root,'report.pdf');fs.writeFileSync(selection,JSON.stringify({kind:'report',sections:['summary']}));
 const cli=fileURLToPath(new URL('../src/startkompas.mjs',import.meta.url)),call=args=>spawnSync(process.execPath,[cli,'pdf',...args],{encoding:'utf8'});const preview=call(['preview',dir,'pdf-cli',selection]);assert.equal(preview.status,0,preview.stderr);const p=JSON.parse(preview.stdout);assert.equal(p.pages,1);assert.equal(fs.existsSync(output),false);
 const saved=call(['save',dir,'pdf-cli',selection,p.sha256,output]);assert.equal(saved.status,0,saved.stderr);assert.equal(JSON.parse(saved.stdout).sha256,p.sha256);assert.equal(fs.readFileSync(output).subarray(0,5).toString(),'%PDF-');assert.equal(readCore(dir,'pdf-cli').sha256,state.sha256);
 fs.writeFileSync(selection,'{"PRIVATE_BAD_JSON');const invalid=call(['preview',dir,'pdf-cli',selection]);assert.notEqual(invalid.status,0);assert.doesNotMatch(invalid.stderr,/PRIVATE_BAD_JSON/);
});
