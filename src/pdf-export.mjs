import {sharingReview} from './sharing-review.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {readCore,sha,safeDirectory,writeExclusive} from './store.mjs';
import {renderBusinessBrief} from './business-brief.mjs';
import {reportPreview} from './workspace.mjs';
import {externalSummary} from './external-summary.mjs';
import {renderPdf} from './pdf-render.mjs';

function snapshot(dir,id,selection){
 const state=readCore(dir,id);let markdown;
 if(!selection||typeof selection!=='object'||Array.isArray(selection))throw Error('Choose PDF content');
 const keys=Object.keys(selection).sort().join(',');
 if(selection.kind==='document'&&keys==='artifact_id,kind')markdown=renderBusinessBrief(dir,id,selection.artifact_id);
 else if(selection.kind==='report'&&keys==='kind,sections')markdown=reportPreview(dir,id,selection.sections).markdown;
 else if(selection.kind==='summary'&&keys==='artifact_id,keys,kind')markdown=externalSummary(dir,id,selection.artifact_id,selection.keys).markdown;
 else throw Error('Choose an exact document, report section selection or external summary selection');
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed; prepare PDF again');
 return {revision:state.dossier.revision,project_sha256:state.sha256,selection:structuredClone(selection),markdown,source_sha256:sha(markdown)};
}
export async function previewPdf(dir,id,selection){const source=snapshot(dir,id,selection),rendered=await renderPdf(source.markdown);if(readCore(dir,id).sha256!==source.project_sha256)throw Error('Project changed while rendering PDF');return {...source,...rendered,sharing_review:sharingReview(source.markdown)};}
export async function writePdf(dir,id,selection,expectedDigest,destination){
 const preview=await previewPdf(dir,id,selection);if(typeof expectedDigest!=='string'||preview.sha256!==expectedDigest)throw Error('PDF changed; review the exact preview again');
 const target=path.resolve(destination),parent=fs.realpathSync(safeDirectory(path.dirname(target))),project=readCore(dir,id).directory,relative=path.relative(project,parent);
 if(!relative||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('PDF must be outside the project');
 if(path.extname(target).toLowerCase()!=='.pdf')throw Error('Use a .pdf filename');
 if(readCore(dir,id).sha256!==preview.project_sha256)throw Error('Project changed before PDF save');
 writeExclusive(path.join(parent,path.basename(target)),preview.bytes);return {saved:target,revision:preview.revision,sha256:preview.sha256,pages:preview.pages,warnings:preview.warnings,bytes:preview.bytes.length};
}
