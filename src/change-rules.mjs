import {affected,records} from './dependencies.mjs';
import {canonical} from './model.mjs';

export function applyInvalidation(before,next,damaged=[]) {
  if(!next.workflow)return next;
  const seeds=new Set(damaged),old=records(before),current=records(next);
  for(const [id,r]of old){const n=current.get(id);if(!n)continue;
    if(['facts','profile','assumptions','sources','decisions'].includes(r.group)&&canonical(r)!==canonical(n))seeds.add(id);
    if(['tasks','checks'].includes(r.group)&&['title','scope','period','basis_kind','depends_on'].some(k=>canonical(r[k])!==canonical(n[k])))seeds.add(id);
  }
  for(const m of before.module_versions){if(next.module_versions.find(x=>x.id===m.id)?.version!==m.version)for(const binding of [...before.workflow.modules,...next.workflow.modules])if(binding.module_id===m.id)seeds.add(binding.record_id);}
  for(const intent of before.workflow.intents){const newer=next.workflow.intents.find(x=>x.record_id===intent.record_id);if(canonical(intent)!==canonical(newer))seeds.add(intent.record_id);}
  for(const link of [...before.workflow.links,...next.workflow.links])if(old.has(link.dependent_id)&&canonical(before.workflow.links.filter(l=>l.dependent_id===link.dependent_id))!==canonical(next.workflow.links.filter(l=>l.dependent_id===link.dependent_id)))seeds.add(link.dependent_id);
  for(const id of next.workflow.invalidated_ids)seeds.add(id);
  const sticky=new Set([...before.workflow.invalidated_ids,...affected(before,[...seeds].filter(id=>old.has(id))),...affected(next,[...seeds])]);
  next.workflow.invalidated_ids=[...sticky].sort();
  for(const item of [...next.tasks,...next.checks])if(sticky.has(item.id))item.substantiation='stale';
  return next;
}
