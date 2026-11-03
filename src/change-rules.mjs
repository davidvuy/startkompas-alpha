import {affected,records} from './dependencies.mjs';
import {canonical} from './model.mjs';

function invalidationSeeds(before,next,damaged=[]) {
  const seeds=new Set(damaged),old=records(before),current=records(next);
  for(const [id,r]of old){const n=current.get(id);if(!n)continue;
    if(['facts','profile','assumptions','sources','decisions'].includes(r.group)&&canonical(r)!==canonical(n))seeds.add(id);
    if(['tasks','checks'].includes(r.group)&&['title','scope','period','basis_kind','depends_on'].some(k=>canonical(r[k])!==canonical(n[k])))seeds.add(id);
  }
  for(const m of before.module_versions){if(next.module_versions.find(x=>x.id===m.id)?.version!==m.version)for(const binding of [...(before.workflow?.modules||[]),...(next.workflow?.modules||[])])if(binding.module_id===m.id)seeds.add(binding.record_id);}
  for(const intent of (before.workflow?.intents||[])){const newer=(next.workflow?.intents||[]).find(x=>x.record_id===intent.record_id);if(canonical(intent)!==canonical(newer))seeds.add(intent.record_id);}
  for(const link of [...(before.workflow?.links||[]),...(next.workflow?.links||[])])if(old.has(link.dependent_id)&&canonical((before.workflow?.links||[]).filter(l=>l.dependent_id===link.dependent_id))!==canonical((next.workflow?.links||[]).filter(l=>l.dependent_id===link.dependent_id)))seeds.add(link.dependent_id);
  for(const id of (next.workflow?.invalidated_ids||[]))seeds.add(id);
  return seeds;
}

export function applyInvalidation(before,next,damaged=[]) {
  if(!next.workflow){
    const seeds=invalidationSeeds(before,next,damaged);
    for(const row of [...before.tasks,...before.checks])if(row.substantiation==='stale')seeds.add(row.id);
    const stale=new Set(affected(next,[...seeds]));
    for(const row of [...next.tasks,...next.checks])if(stale.has(row.id))row.substantiation='stale';
    return next;
  }
  const seeds=invalidationSeeds(before,next,damaged),old=records(before);
  const sticky=new Set([...before.workflow.invalidated_ids,...affected(before,[...seeds].filter(id=>old.has(id))),...affected(next,[...seeds])]);
  next.workflow.invalidated_ids=[...sticky].sort();
  for(const item of [...next.tasks,...next.checks])if(sticky.has(item.id))item.substantiation='stale';
  return next;
}

// Reinstatement may remove or reintroduce records. Walk both valid graphs first,
// then keep only IDs present in the resulting dossier; never clear review debt.
export function restorationInvalidatedIds(before,next) {
  const old=records(before),current=records(next),seeds=invalidationSeeds(before,next);
  for(const id of before.workflow?.invalidated_ids||[])seeds.add(id);
  for(const row of [...before.tasks,...before.checks,...next.tasks,...next.checks])if(row.substantiation==='stale')seeds.add(row.id);
  for(const [id,row]of current){
    const previous=old.get(id);
    if(!previous&&row.group!=='events')seeds.add(id);
    if(previous&&['artifacts','evidence'].includes(row.group)&&canonical(previous)!==canonical(row))seeds.add(id);
    if(previous&&['tasks','checks'].includes(row.group)&&['substantiation','evidence_ids'].some(key=>canonical(previous[key])!==canonical(row[key])))seeds.add(id);
  }
  for(const [id,row]of old)if(!current.has(id)&&row.group!=='events')seeds.add(id);
  for(const module of next.module_versions)if(before.module_versions.find(m=>m.id===module.id)?.version!==module.version)for(const binding of next.workflow?.modules||[])if(binding.module_id===module.id)seeds.add(binding.record_id);
  const ids=[...seeds];
  return [...new Set([...affected(before,ids.filter(id=>old.has(id))),...affected(next,ids.filter(id=>current.has(id)))])].filter(id=>current.has(id)).sort();
}

export function legacyReviewIds(d,damaged=[]) {
  return affected(d,[...new Set([...damaged,...[...d.tasks,...d.checks].filter(row=>row.substantiation==='stale').map(row=>row.id)])]).sort();
}
