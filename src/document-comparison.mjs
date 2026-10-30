import {readCore} from './store.mjs';
import {canonical} from './model.mjs';
import {briefTypes,readBusinessBrief} from './business-brief.mjs';

function chain(dir,id,artifactId){
 const rows=[],seen=new Set();let next=artifactId;
 while(next){
  if(seen.has(next)||rows.length>=200)throw Error('Version history unavailable or exceeds 200 versions');
  seen.add(next);const draft=readBusinessBrief(dir,id,next),newer=rows.at(-1);
  if(newer&&(draft.version!==newer.version-1||['kind','client','period'].some(k=>draft.request[k]!==newer.request[k])))throw Error('Version history scope or order mismatch');
  rows.push(draft);next=draft.request.previous_artifact_id;
 }
 if(rows.at(-1).version!==1)throw Error('Incomplete version history');
 return rows;
}
function unchanged(dir,id,state){if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed; compare again');}
export function documentVersions(dir,id,artifactId){
 const state=readCore(dir,id),rows=chain(dir,id,artifactId);unchanged(dir,id,state);
 return {revision:state.dossier.revision,versions:rows.map(r=>({id:r.artifact_id,version:r.version,reason:r.request.change_reason,kind:r.request.kind})),limit:200};
}
const terms=new Set(['terms','exclusions','delivery','period','responsibilities','data_limits','stop','acceptance','constraints']);
const amounts=new Set(['price','costs']);
// Literal number fragments only: no currency conversion or inferred business meaning.
const numbers=value=>(value??'').match(/(?:[$€£]\s*)?[+-]?\d+(?:[.,]\d+)*(?:\s*(?:%|EUR|USD|GBP))?/giu)??[];
export function compareDocuments(dir,id,beforeId,afterId){
 const state=readCore(dir,id),rows=chain(dir,id,afterId),after=rows[0],before=rows.find(r=>r.artifact_id===beforeId);
 if(!before||before.version>=after.version)throw Error('Select two increasing versions of the same document');
 const changes=[];
 for(const [key,labels] of Object.entries(briefTypes[after.request.kind].fields)){
  const a=before.fields.find(f=>f.key===key),b=after.fields.find(f=>f.key===key);
  if(!a||!b)throw Error('Incomplete document fields');
  const textChanged=a.value!==b.value,statusChanged=a.assertion!==b.assertion,basisChanged=canonical([a.record_ids,a.basis])!==canonical([b.record_ids,b.basis]);
  if(!textChanged&&!statusChanged&&!basisChanged)continue;
  const oldNumbers=numbers(a.value),newNumbers=numbers(b.value),numericChanged=canonical(oldNumbers)!==canonical(newNumbers);
  changes.push({key,label:labels[1],type:!textChanged?'metadata':a.value===null?'added':b.value===null?'removed':'changed',
   tags:[...(textChanged&&amounts.has(key)?['amount_field']:[]),...(textChanged&&terms.has(key)?['terms_or_scope']:[]),...(numericChanged?['number_fragments']:[])],
   before:{value:a.value,assertion:a.assertion,record_ids:a.record_ids,basis:a.basis??[]},after:{value:b.value,assertion:b.assertion,record_ids:b.record_ids,basis:b.basis??[]},
   status_changed:statusChanged,basis_changed:basisChanged,numbers:numericChanged?{before:oldNumbers,after:newNumbers}:null});
 }
 unchanged(dir,id,state);
 return {revision:state.dossier.revision,kind:after.request.kind,before:{id:before.artifact_id,version:before.version,markdown:before.document_markdown,requires_review:before.requires_review},after:{id:after.artifact_id,version:after.version,markdown:after.document_markdown,requires_review:after.requires_review},changes,change_reason:after.request.change_reason,
  warning:'Read-only comparison of saved fields. Number fragments may represent dates, quantities or amounts; no monetary meaning is inferred. Terms and scope are grouped by field, not interpreted as an agreement. Full original text remains below; review it for nuances. No document was rewritten or approved.'};
}
