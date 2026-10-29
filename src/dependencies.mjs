// Pure graph rules: a dependent points to prerequisites, never to its own evidence subject.
export const groups=['profile','facts','assumptions','sources','decisions','tasks','checks','artifacts','evidence','events'];
export const records=d=>new Map(groups.flatMap(g=>d[g].map(r=>[r.id,{...r,group:g}])));
export function dependencyGraph(d) {
  const index=records(d),edges=new Map([...index.keys()].map(id=>[id,new Map()]));
  const add=(from,to,reason)=>{
    if(!index.has(from)||!index.has(to))throw Error('Missing dependency reference: '+from+' -> '+to);
    edges.get(from).set(to,reason);
  };
  for(const r of index.values()){
    for(const id of r.source_ids||[])add(r.id,id,'assertion source');
    for(const id of r.basis_ids||[])add(r.id,id,'decision basis');
    for(const id of r.depends_on||[])add(r.id,id,'task prerequisite');
    for(const id of r.evidence_ids||[])add(r.id,id,'scoped evidence');
    if(r.group==='evidence')add(r.id,r.artifact_id,'evidence artifact');
  }
  for(const l of d.workflow?.links||[])add(l.dependent_id,l.prerequisite_id,l.reason);
  // Kahn's algorithm avoids call-stack overflow on long dossiers.
  const degree=new Map([...edges].map(([id,e])=>[id,e.size])),reverse=new Map([...index.keys()].map(id=>[id,[]]));
  for(const [from,es]of edges)for(const to of es.keys())reverse.get(to).push(from);
  const ready=[...degree].filter(([,n])=>n===0).map(([id])=>id);let visited=0;
  for(let i=0;i<ready.length;i++){visited++;for(const id of reverse.get(ready[i])){degree.set(id,degree.get(id)-1);if(!degree.get(id))ready.push(id);}}
  if(visited!==index.size)throw Error('Cyclic dependencies: '+[...degree].filter(([,n])=>n>0).slice(0,8).map(([id])=>id).join(', '));
  return {index,edges,reverse};
}
export function affected(d,seeds) {
  const graph=dependencyGraph(d),seen=new Set(),queue=[...seeds];
  for(let i=0;i<queue.length;i++){const id=queue[i];if(!graph.index.has(id))throw Error('Unknown changed record: '+id);if(seen.has(id))continue;seen.add(id);queue.push(...graph.reverse.get(id));}
  return [...seen];
}
export function checkWorkflow(d) {
  const graph=dependencyGraph(d);if(!d.workflow)return;
  const ref=id=>{if(!graph.index.has(id))throw Error('Unknown workflow record: '+id);return graph.index.get(id);};
  for(const collection of ['intents','uncertainties','accepted']){
    const seen=new Set();for(const item of d.workflow[collection]){ref(item.record_id);if(seen.has(item.record_id))throw Error('Duplicate workflow '+collection+' record');seen.add(item.record_id);}
  }
  for(const u of d.workflow.uncertainties)for(const c of u.checks){if(ref(c.record_id).group!=='checks')throw Error('Uncertainty checks must reference checks');}
  for(const m of d.workflow.modules){ref(m.record_id);if(!d.module_versions.some(v=>v.id===m.module_id))throw Error('Unknown module reference');}
  for(const id of d.workflow.invalidated_ids)ref(id);
}
export const emptyWorkflow=()=>({links:[],intents:[],uncertainties:[],accepted:[],modules:[],invalidated_ids:[]});
