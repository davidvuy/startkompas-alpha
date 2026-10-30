import fs from 'node:fs';
import path from 'node:path';
import {readCore,safeDirectory,writeExclusive,sha} from './store.mjs';
import {briefTypes,readBusinessBrief} from './business-brief.mjs';

const escape=value=>String(value).replace(/[\x00-\x1f\x7f-\x9f]/g,' ').replace(/[\\`*_{}[\]()#+.!|<>]/g,c=>'\\'+c);
export function externalSummary(dir,id,artifactId,keys){
 const allowed=Object.keys(briefTypes.offer.fields);
 if(!Array.isArray(keys)||!keys.length||keys.length>allowed.length||new Set(keys).size!==keys.length||keys.some(k=>!allowed.includes(k)))throw Error('Select unique offer sections for the summary');
 const state=readCore(dir,id),draft=readBusinessBrief(dir,id,artifactId);
 if(draft.request.kind!=='offer'||draft.successor_ids.length)throw Error('Select a current saved offer');
 const fields=allowed.filter(key=>keys.includes(key)).map(key=>draft.fields.find(f=>f.key===key));
 if(fields.some(f=>!f))throw Error('Offer fields are incomplete');
 if(fields.reduce((n,f)=>n+(f.value?.length??0),0)>6000)throw Error('Choose fewer sections: an external summary allows at most 6000 text characters');
 const lines=['# Offer summary','',`Saved offer version ${draft.version} · Project revision ${state.dossier.revision}`,'','Selected draft content, not a validated result or agreed commitment.'];
 if(draft.practice)lines.push('FICTIONAL PRACTICE — not real customer evidence or validation.');
 if(draft.requires_review)lines.push('CAUTION: the recorded basis changed; review this draft before reuse.');
 for(const f of fields)lines.push('','## '+briefTypes.offer.fields[f.key][1],'',f.value===null?'Unknown — no answer recorded.':escape(f.value),({proposal:'Proposal — not validated.',reported:'Reported — not independently verified.',unknown:'Unknown — not established.'})[f.assertion]);
 lines.push('','This is a selected local snapshot, not the complete offer or an agreement. Omitted sections may contain important limits. Later project edits do not update this copy. Saving does not send it to anyone.');
 const markdown=lines.join('\n')+'\n';
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed; preview again');
 return {revision:state.dossier.revision,version:draft.version,markdown,sha256:sha(markdown),bytes:Buffer.byteLength(markdown)};
}
export function writeExternalSummary(dir,id,artifactId,keys,digest,destination){
 const preview=externalSummary(dir,id,artifactId,keys);
 if(!/^[a-f0-9]{64}$/.test(digest)||preview.sha256!==digest)throw Error('Summary changed; preview again');
 const target=path.resolve(destination),parent=safeDirectory(path.dirname(target)),project=readCore(dir,id).directory,relative=path.relative(project,parent);
 if(!relative||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Summary must be outside the project');
 writeExclusive(path.join(fs.realpathSync(parent),path.basename(target)),preview.markdown);
 return {path:target,revision:preview.revision,version:preview.version,sha256:preview.sha256,bytes:preview.bytes};
}
