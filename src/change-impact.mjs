import {affected,records} from './dependencies.mjs';

export function changeImpact(d,recordIds){
 if(!Array.isArray(recordIds)||recordIds.length<1||recordIds.length>20||new Set(recordIds).size!==recordIds.length)throw Error('Choose 1-20 distinct changed records');
 const index=records(d),ids=affected(d,recordIds),limit=100;
 return {basis_revision:d.revision,changed_ids:[...recordIds],total:ids.length,limit,partial:ids.length>limit,
  records:ids.slice(0,limit).map(id=>{const record=index.get(id),intent=d.workflow?.intents.find(i=>i.record_id===id);return {id,group:record.group,direct:recordIds.includes(id),label:String(record.title??record.text??(intent?intent.goal.replaceAll(':',' / ')+' · version '+intent.version:record.group==='artifacts'?'Saved artifact · version '+record.version:id)).slice(0,160)};}),
  limitation:'Declared dependency reachability only. Unrecorded relationships are unknown; an empty dependent list is not clearance. Existing records and documents are not automatically regenerated or approved.'};
}
export function renderChangeImpact(impact){
 if(!impact)return '';
 return ['','## Review change impact before saving','',
  'Replacing the current version may require reviewing the following original records. This preview does not change them.',
  'Changed records: '+impact.changed_ids.join(', '),
  'Declared affected records: '+impact.total+(impact.partial?' (first '+impact.limit+' shown; inspect the remaining graph before a broad change)':''),
  ...impact.records.map(r=>'- '+r.id+' ['+r.group+']'+(r.direct?' — original being revised':' — depends on the original')),
  '',impact.limitation,'Confirm only the proposed new draft. Keep historical versions and review dependent work separately.',''].join('\n');
}
export function businessPreviewMarkdown(prepared){return prepared.document_markdown+renderChangeImpact(prepared.change_impact);}
