import {handoff} from './handoff.mjs';
import {readCore} from './store.mjs';
import {readSnapshot} from './history.mjs';
import {COLLECTIONS,canonical} from './model.mjs';
export const cleanText=value=>String(value).replace(/[\x00-\x1f\x7f-\x9f]/g,' ').replace(/[\\`*_{}[\]()#+.!|<>]/g,c=>'\\'+c);
export function projectSummary(dir,id,language='nl'){
 if(!['nl','en'].includes(language))throw Error('Language must be nl or en');
 const h=handoff(dir,id,{limit:10}),nl=language==='nl';
 const lines=['# '+cleanText(h.name), (nl?'Versie':'Revision')+': '+h.revision,'',nl?'## Eerstvolgende werk':'## Current work',h.active_task?cleanText(h.active_task.title):(nl?'Nog geen actieve taak gekozen.':'No active task selected.'),'',nl?'## Open taken':'## Open tasks'];
 lines.push(...h.open_tasks.map(t=>'- '+cleanText(t.title)+' ['+t.progress+']'));if(!h.open_tasks.length)lines.push(nl?'Geen open taken geregistreerd; dit bewijst geen voltooiing van je onderneming.':'No open tasks recorded; this does not prove business completion.');
 lines.push('',(nl?'Actieve besluiten':'Active decisions')+': '+h.summary.totals.decisions,(nl?'Open controles':'Unresolved checks')+': '+h.summary.totals.unresolved_checks,(nl?'Opnieuw te beoordelen records':'Records needing review')+': '+h.invalidated_ids.length);
 if(h.invalidated_ids.length)lines.push(h.invalidated_ids.map(cleanText).join(', '));
 const bad=h.artifacts.filter(a=>!['hash_matches','external_unchecked'].includes(a.actual));if(bad.length)lines.push('',nl?'LET OP: ontbrekende of gewijzigde bestanden.':'CAUTION: missing or changed files.',...bad.map(a=>'- '+cleanText(a.id)+': '+a.actual));
 if(h.summary.truncated)lines.push('',nl?'Dit overzicht is ingekort. Gebruik project handoff voor verdere inspectie.':'This overview is shortened. Use project handoff for further inspection.');
 lines.push('',nl?'Gebaseerd op opgeslagen gegevens; geen onafhankelijke inhoudelijke beoordeling.':'Based on saved records; not an independent substantive review.');return lines.join('\n')+'\n';
}
export function compareRevisions(dir,id,before,after){
 const current=readCore(dir,id);const get=n=>n===current.dossier.revision?current:readSnapshot(dir,id,n);
 if(!Number.isSafeInteger(before)||!Number.isSafeInteger(after)||before<1||after<=before)throw Error('Use two increasing positive revisions');
 const a=get(before).dossier,b=get(after).dossier,groups=[];
 for(const group of COLLECTIONS){const old=new Map(a[group].map(r=>[r.id,r])),next=new Map(b[group].map(r=>[r.id,r]));const added=[...next.keys()].filter(id=>!old.has(id)),removed=[...old.keys()].filter(id=>!next.has(id)),changed=[...next.keys()].filter(id=>old.has(id)&&canonical(old.get(id))!==canonical(next.get(id))).map(id=>({id,fields:[...new Set([...Object.keys(old.get(id)),...Object.keys(next.get(id))])].filter(k=>canonical(old.get(id)[k])!==canonical(next.get(id)[k]))}));if(added.length||removed.length||changed.length)groups.push({group,added,removed,changed});}
 const metadata=['name','active_task_id','schema_version','skill_version','module_versions','workflow'].filter(k=>canonical(a[k])!==canonical(b[k]));return {project_id:id,before,after,metadata,groups,limitations:['Lists changed record IDs and fields, not private values or business impact.','Does not write, restore or approve any record.']};
}
export function renderComparison(r){return ['# '+r.before+' → '+r.after,...r.metadata.map(k=>'- metadata: '+cleanText(k)),...r.groups.flatMap(g=>['','## '+g.group,...g.added.map(id=>'+ '+cleanText(id)),...g.removed.map(id=>'- '+cleanText(id)),...g.changed.map(x=>'~ '+cleanText(x.id)+': '+x.fields.map(cleanText).join(', '))]),'',...r.limitations].join('\n')+'\n';}
