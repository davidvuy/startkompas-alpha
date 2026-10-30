import {readCore} from './store.mjs';
import {dependencyGraph} from './dependencies.mjs';

// A bounded neighborhood of declared dependencies, never semantic guesses.
export function relationshipMap(dir,id,requested=null){
 const state=readCore(dir,id),d=state.dossier,graph=dependencyGraph(d);
 if(requested!==null&&(typeof requested!=='string'||!graph.index.has(requested)))throw Error('Unknown map record');
 const target=requested??d.events.filter(e=>e.type==='business-brief-draft').at(-1)?.subject_ids[0]??d.active_task_id??[...graph.index.values()].find(r=>r.group!=='events')?.id??null;
 const selected=new Set(target?[target]:[]),queue=target?[[target,0]]:[];let truncated=false;
 for(let i=0;i<queue.length;i++){
  const [record,depth]=queue[i];if(depth===2)continue;
  for(const neighbor of new Set([...graph.edges.get(record).keys(),...graph.reverse.get(record)])){
   if(selected.has(neighbor))continue;if(selected.size===60){truncated=true;continue;}selected.add(neighbor);queue.push([neighbor,depth+1]);
  }
 }
 const edges=[];let omitted=0;
 for(const from of selected){
  for(const [to,reason]of graph.edges.get(from)){if(!selected.has(to)){omitted++;continue;}if(edges.length===200){omitted++;continue;}edges.push({from,to,reason});}
  omitted+=graph.reverse.get(from).filter(other=>!selected.has(other)).length;
 }
 const nodes=[...selected].map(key=>{const r=graph.index.get(key);return {id:key,group:r.group,label:r.title??r.text??r.key??r.description??(r.group==='artifacts'?'Document v'+r.version+' · '+key:key),assertion:r.assertion??null,progress:r.progress??null,substantiation:r.substantiation??null,requires_review:d.workflow?.invalidated_ids.includes(key)??false};});
 if(readCore(dir,id).sha256!==state.sha256)throw Error('Project changed while reading connections');
 return {target,revision:d.revision,nodes,edges,truncated:truncated||omitted>0,omitted_connections:omitted,depth:2,limits:{nodes:60,edges:200},direction:'from depends on to',limitation:'Only recorded relationships within two links of the selected record. Disconnected records and undeclared relationships are not inferred. Statuses are stored claims, not a new review.'};
}
