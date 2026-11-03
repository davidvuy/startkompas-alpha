import {briefTypes,documentFieldDefinitions,documentFieldHelp} from './business-fields.mjs';
import {validateTemplate,customFieldsSchema} from './template-format.mjs';
import {changeImpact} from './change-impact.mjs';
import Ajv2020 from 'ajv/dist/2020.js';
import {readCore,regularFile,localFile,sha,bytesFor,damagedArtifacts} from './store.mjs';
import {records} from './dependencies.mjs';
import {applyInvalidation} from './change-rules.mjs';

// Original procedural fields; no example business claims are filled in automatically.
export {briefTypes} from './business-fields.mjs';
// Display-only guidance; never default answers or recorded evidence.
export const briefFieldHelp={
  experiment:{
    question:'Name one uncertainty this experiment should investigate. A question is not a finding or proof of demand.',
    method:'Describe the proposed procedure and what you will compare. Do not describe a planned action as already performed.',
    audience:'Specify the intended audience and situation. Keep actual participants unknown until recorded with provenance.',
    effort:'Estimate time, money and resources separately. Unknown cost stays unknown; this plan does not authorize spending.',
    observation:'Describe what you intend to observe and how you would record it. Desired observations are not actual results.',
    decision_rule:'State before execution what would support, weaken or change your choice. Include contrary outcomes and keep later revisions visible.',
    boundaries:'State what would count as enough learning, what would require changing the experiment, and the maximum time or cost before pausing. Specify units, exclusions and permission limits; unknown limits stay unknown. These are your planned conditions, not automatic approval or proof of safety.'
  },
  "offer": {
    "segment": "Describe a specific customer and situation. Fictional example: a small design studio preparing a client handover.",
    "job": "Describe the job they need to finish and the difficulty you suspect. Separate your guess from what someone actually reported.",
    "outcome": "Describe an observable result you propose. Fictional example: one handover checklist with named owners. Avoid unsupported guarantees.",
    "delivery": "Explain what you would deliver, in what format and within which boundaries. Leave unknown effort or timing blank.",
    "exclusions": "State what is outside this offer. Fictional example: no implementation or ongoing support included.",
    "workaround": "Describe what the customer currently does, if known. Do not invent an alternative or assume they do nothing.",
    "support": "Summarize both supporting and contradicting indications, with private source references when available. This field does not create verified evidence.",
    "next_check": "Choose a small check that could change your decision. State what you would observe and how it would affect your next step."
  },
  "interview": {
    "learning": "Name one uncertainty a real conversation could resolve. A question is not evidence of demand.",
    "participant": "Describe whose recent experience is relevant and why. Use participant codes in shared notes; do not invent a participant.",
    "recent_job": "Ask about the last concrete time this happened: when, what happened and what they did. Avoid asking them to endorse your idea.",
    "workaround": "Ask how they handle it today and what effort or difficulty they actually experienced. Keep unreported consequences unknown.",
    "buying": "Ask who decided and what happened in a recent comparable purchase. Hypothetical willingness is not a payment.",
    "decision_rule": "Before collecting answers, state what would support, weaken or change your decision. Preserve contradictory answers.",
    "next_check": "Choose the next question or preparation step. Keep the log blank until a real conversation occurs."
  },
  "alternatives": {
    "job": "Describe the customer job in a specific situation so options can be compared for the same purpose.",
    "current_workaround": "Record what the customer actually uses, with a source if available. Separate a reported workaround from your guess.",
    "do_nothing": "Describe what leaving the problem alone might mean. Do not assume a cost or urgency without supporting information.",
    "alternatives": "Name concrete options and sources for each claim. Listing an option does not mean its claims have been checked.",
    "constraints": "Compare costs, effort and switching needs on the same basis. Keep missing prices and conditions unknown.",
    "unknowns": "List unanswered comparisons and the source or observation needed to resolve each one.",
    "next_check": "Choose one missing comparison that could change your decision and how you will check it."
  },
  "pricing": {
    "price": "State a proposed amount, currency and unit. Clarify tax treatment if known; do not assume it. A proposal is not an accepted price.",
    "buyer": "Describe who can decide on this purchase and what remains unconfirmed. Do not invent budget authority.",
    "payment_evidence": "Record only actual payments or explicit commitments, with sources and conditions. Interest and praise are not payments. Leave blank if none is known.",
    "alternatives": "Compare prices only when scope, unit and conditions are understood. Record sources and unknown differences.",
    "costs": "Identify known delivery costs and exclusions. Keep uncertain effort and expenses explicit rather than treating them as zero.",
    "terms": "List terms still needing agreement, such as timing, scope and cancellation. This working field is not an agreed contract.",
    "next_check": "Choose what to learn about price or buying behavior next and what result would change the proposal."
  },
  "pilot": {
    "learning": "State the uncertainty this pilot should test. Completing a deliverable does not by itself validate demand.",
    "client": "Describe the suitable client and context. Eligibility and interest do not establish consent or an agreed pilot.",
    "deliverable": "Name one concrete output and its boundaries. Keep it consistent with the selected offer and available capacity.",
    "exclusions": "Specify activities outside this pilot so they cannot silently become obligations.",
    "responsibilities": "Describe proposed responsibilities, including inputs and review. Unknown owners remain open until agreed.",
    "period": "Record the proposed start, end and relevant availability. A proposed period is not an agreed schedule.",
    "data_limits": "State what data is needed, what must not be used and what permission remains unresolved. Do not paste sensitive data here.",
    "acceptance": "Describe an observable delivery check and who would review it. Delivery acceptance is separate from proof of market demand.",
    "stop": "Define an observable reason to stop or review, such as expanded scope or missing permission.",
    "next_check": "Choose the next unresolved scope, responsibility or consent question to check before proceeding."
  }
};
const id={type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'},text={type:'string',minLength:1,maxLength:4000,pattern:'\\S'},nullable=s=>({anyOf:[s,{type:'null'}]});
const validate=new Ajv2020({strict:true,allErrors:true,coerceTypes:false,useDefaults:false}).compile({type:'object',additionalProperties:false,required:['project_id','expected_revision','operation_id','at','language','kind','client','period','previous_artifact_id','change_reason','fields'],properties:{project_id:id,expected_revision:{type:'integer',minimum:1},operation_id:id,at:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'},language:{enum:['nl','en']},kind:{enum:Object.keys(briefTypes)},client:nullable(text),period:nullable(text),previous_artifact_id:nullable(id),change_reason:nullable(text),custom_fields:customFieldsSchema,fields:{type:'array',maxItems:20,items:{type:'object',additionalProperties:false,required:['key','value','assertion','record_ids'],properties:{key:text,value:nullable(text),assertion:{enum:['proposal','reported','unknown']},record_ids:{type:'array',maxItems:100,uniqueItems:true,items:id}}}}}});
function checkRequest(r){
  if(!validate(r))throw Error('Invalid business brief request: '+validate.errors.map(e=>e.instancePath+' '+e.message).join('; '));
  if(new Date(r.at+'T00:00:00Z').toISOString().slice(0,10)!==r.at)throw Error('Invalid calendar date');
  if((r.previous_artifact_id===null)!==(r.change_reason===null))throw Error('A revision requires its previous artifact and a change reason');
  if(r.custom_fields&&(r.kind!=='offer'||new Set(r.custom_fields.map(f=>f.key)).size!==r.custom_fields.length))throw Error('Custom fields require a unique offer field definition');
  const definitions=documentFieldDefinitions(r);const seen=new Set();for(const f of r.fields){
    if(!Object.hasOwn(definitions,f.key)||seen.has(f.key))throw Error('Unknown or duplicate business field');seen.add(f.key);
    if((f.value===null)!==(f.assertion==='unknown'))throw Error('Unknown fields require null; supplied text requires an assertion');
    if(f.assertion==='reported'&&!f.record_ids.length)throw Error('Reported fields require linked project records');
  }
}
function loadBrief(state,artifactId,providedBytes=null){
  const a=state.dossier.artifacts.find(a=>a.id===artifactId);
  if(!a||a.storage!=='local'||a.availability!=='available'||!state.dossier.events.some(e=>e.type==='business-brief-draft'&&e.subject_ids[0]===artifactId))throw Error('Not an available business brief');
  const bytes=providedBytes??regularFile(localFile(state.directory,a.location));if(sha(bytes)!==a.sha256)throw Error('Business brief fingerprint mismatch');
  const saved=JSON.parse(bytes);
  if(saved.format!==(saved.request?.custom_fields?'startkompas-business-brief-v2':'startkompas-business-brief-v1')||saved.project_id!==state.dossier.project_id||saved.artifact_id!==artifactId||!Number.isInteger(saved.version)||saved.version<1||String(saved.version)!==a.version||typeof saved.document_markdown!=='string')throw Error('Business brief identity/format mismatch');
  checkRequest(saved.request);if(saved.request.project_id!==saved.project_id)throw Error('Business brief request identity mismatch');
  if(saved.template_context){const c=saved.template_context,checked=validateTemplate(c.template);if(checked.sha256!==c.sha256||c.template.document_kind!==saved.request.kind||!Array.isArray(c.missing_required_at_creation)||new Set(c.missing_required_at_creation).size!==c.missing_required_at_creation.length||c.missing_required_at_creation.some(k=>!c.template.required_inputs.includes(k)))throw Error('Template origin identity mismatch');}
  if(saved.request.custom_fields){const expected=Object.keys(documentFieldDefinitions(saved.request));if(!Array.isArray(saved.fields)||saved.fields.length!==expected.length||new Set(saved.fields.map(f=>f.key)).size!==expected.length||saved.fields.some(f=>!expected.includes(f.key)))throw Error('Incomplete custom document fields');if(saved.template_context&&JSON.stringify(saved.template_context.template.custom_fields)!==JSON.stringify(saved.request.custom_fields))throw Error('Custom fields differ from original template');}
  return saved;
}
const escape=s=>String(s).replace(/[\x00-\x1f\x7f-\x9f]/g,' ').replace(/[\\`*_{}[\]()#+.!|<>]/g,c=>'\\'+c);
export function prepareBusinessBrief(dir,request){
  request=structuredClone(request);const state=readCore(dir,request.project_id),original=state.dossier;
  const prior=request.previous_artifact_id==null?null:loadBrief(state,request.previous_artifact_id);
  if(prior?.request.custom_fields){
    if(request.custom_fields&&JSON.stringify(request.custom_fields)!==JSON.stringify(prior.request.custom_fields))throw Error('Document custom definitions are immutable; create a separate draft for a different template');
    request.custom_fields=structuredClone(prior.request.custom_fields);
    if(Array.isArray(request.fields))for(const f of prior.request.custom_fields)if(!request.fields.some(v=>v.key===f.key)){const old=prior.fields.find(v=>v.key===f.key);request.fields.push({key:old.key,value:old.value,assertion:old.assertion,record_ids:[...old.record_ids]});}
  }else if(prior&&request.custom_fields)throw Error('Custom definitions cannot be added silently to an existing document');
  checkRequest(request);const definitions=documentFieldDefinitions(request);
  if(!original.workflow)throw Error('Business briefs require explicit schema 1.1 upgrade');
  if(original.revision!==request.expected_revision)throw Error('Revision conflict; reread project');
  if(original.operations.some(o=>o.id===request.operation_id))throw Error('Operation already recorded; retry original saved attachment request');
  const d=applyInvalidation(original,structuredClone(original),damagedArtifacts(state.directory,original)),index=records(d);
  if(prior&&['kind','client','period'].some(k=>prior.request[k]!==request[k]))throw Error('Prior brief has a different kind, client or period; keep it separate');
  const candidates=d.workflow.intents.filter(i=>i.goal==='business-brief:'+request.kind&&i.client===request.client&&i.period===request.period).map(i=>i.record_id);
  if(!prior&&request.client!==null&&request.period!==null&&candidates.length)throw Error('Existing scoped brief found: '+candidates.join(', ')+'; read it and name the prior artifact for an update');
  if(prior&&original.events.some(e=>e.type==='business-brief-draft'&&e.subject_ids[1]===prior.artifact_id))throw Error('Prior brief already has a successor; read the latest version');
  const fields=Object.keys(definitions).map(key=>{
    const f=request.fields.find(f=>f.key===key)??{key,value:null,assertion:'unknown',record_ids:[]};
    const basis=f.record_ids.map(id=>{const r=index.get(id);if(!r||r.group==='events')throw Error('Missing or unsuitable basis record: '+id);return {record_id:id,group:r.group,status:r.assertion??r.status??r.progress??r.availability??'recorded',requires_review:d.workflow.invalidated_ids.includes(id)||(['tasks','checks'].includes(r.group)&&(r.progress!=='done'||r.substantiation!=='supported'))||(r.group==='artifacts'&&r.availability!=='available')};});
    return {...f,basis};
  });
  const previousFields=prior?.fields??[],changes=prior?fields.filter(f=>{const p=previousFields.find(p=>p.key===f.key);return !p||JSON.stringify([f.value,f.assertion,f.record_ids])!==JSON.stringify([p.value,p.assertion,p.record_ids]);}).map(f=>({key:f.key,before:previousFields.find(p=>p.key===f.key)?.value??null,after:f.value})):[];
  const artifactId='business-'+sha(request.operation_id).slice(0,32),version=prior?prior.version+1:1;
  if(index.has(artifactId)||index.has(artifactId+'-event'))throw Error('Generated business record ID already exists');
  const lang=1,unknown='Unknown; not performed or established';
  const status={proposal:'Proposal',reported:'Reported; not independently verified',unknown};
  const lines=['# '+briefTypes[request.kind].title[lang]+' — '+('draft'),'',`${escape(d.name)} · ${d.project_id} · v${version}`,`${'Client/context'}: ${request.client===null?unknown:escape(request.client)}`,`${'Period'}: ${request.period===null?unknown:escape(request.period)}`,'','Draft, not evidence of demand, payment, an interview conducted or pilot approval.'];
  if(d.events.some(e=>e.type==='practice-project'))lines.push('','FICTIONAL PRACTICE — not real customer evidence or validation.');
  if(prior)lines.push('',`${'Previous version'}: ${prior.artifact_id}`,`${'Change reason'}: ${escape(request.change_reason)}`,`${'Changed fields'}: ${changes.map(c=>c.key).join(', ')||('no field changes')}`);
  for(const f of fields){lines.push('','## '+escape(definitions[f.key][lang]),'',f.value===null?unknown:escape(f.value),status[f.assertion]);for(const r of f.basis)lines.push(`- ${r.record_id}: ${escape(r.status)}${r.requires_review?' — '+('requires review'):''}`);}
  if(request.kind==='experiment')lines.push('','## Execution and results','Not recorded. This card prepares an experiment; it does not establish that it was run. Record actual observations separately with their source. User-supplied dates do not prove this plan preceded execution.');
  if(request.kind==='interview')lines.push('','## Blank log — no interview yet','Date / participant code / direct statement / observation / interpretation / open question: not yet recorded.');
  if(prior?.template_context){const context=prior.template_context,t=context.template;lines.push('','## Template origin','',escape(t.name)+' · version '+t.version,'Template fingerprint: '+context.sha256,'Audience: '+escape(t.audience),'Scope: '+escape(t.scope),'','Unknown required inputs at original creation (not current status): '+(context.missing_required_at_creation.join(', ')||'None'),'','### Template unknowns',...t.unknowns.map(v=>'- '+escape(v)),'','### Template boundaries',...t.boundaries.map(v=>'- '+escape(v)),'','Original template snapshot retained. Later template edits do not update this document.');}
  const document_markdown=lines.join('\n')+'\n',content=bytesFor({...(prior?.template_context?{template_context:structuredClone(prior.template_context)}:{}),format:request.custom_fields?'startkompas-business-brief-v2':'startkompas-business-brief-v1',project_id:d.project_id,artifact_id:artifactId,version,basis_revision:d.revision,basis_sha256:state.sha256,request:structuredClone(request),fields,changes,document_markdown}).toString('utf8');
  if(Buffer.byteLength(content)>4*1024*1024)throw Error('Business brief exceeds 4 MiB');
  const artifact={id:artifactId,version:String(version),storage:'local',location:'files/'+artifactId+'.json',availability:'available',sha256:sha(content)};
  const basis=[...new Set(fields.flatMap(f=>f.record_ids))];
  const update_request={project_id:d.project_id,expected_revision:d.revision,operation_id:request.operation_id,changes:{artifacts:[...original.artifacts,artifact],events:[...original.events,{id:artifactId+'-event',type:'business-brief-draft',at:request.at,description:prior?'Revised business draft; original and change reason retained in the artifact':'Business draft prepared; no external action or validation',subject_ids:[artifactId,...(prior?[prior.artifact_id]:[])]}],workflow:{...original.workflow,links:[...original.workflow.links,...basis.map(prerequisite_id=>({dependent_id:artifactId,prerequisite_id,reason:'Business draft uses selected project record'}))],intents:[...original.workflow.intents,{record_id:artifactId,goal:'business-brief:'+request.kind,client:request.client,period:request.period,version:String(version)}]}}};
  return {artifact_id:artifactId,version,content,document_markdown,changes,change_impact:prior?changeImpact(d,[prior.artifact_id]):null,existing_candidates:candidates,update_request,warning:'Proposal only. Save exact content and update_request, attach with the core helper and read back. Unknown scope is not merged automatically. Omitted fields become unknown; revisions are complete drafts, not patches.'};
}
export function readBusinessBrief(dir,projectId,artifactId){
  const state=readCore(dir,projectId),saved=loadBrief(state,artifactId),d=applyInvalidation(state.dossier,structuredClone(state.dossier),damagedArtifacts(state.directory,state.dossier));
  const successors=d.events.filter(e=>e.type==='business-brief-draft'&&e.subject_ids[1]===artifactId).map(e=>e.subject_ids[0]);
  return {...saved,practice:d.events.some(e=>e.type==='practice-project'),current_revision:d.revision,requires_review:d.workflow.invalidated_ids.includes(artifactId),successor_ids:successors,warning:'Saved draft, not new verification; read current basis before acting.'};
}
export function renderBusinessBrief(dir,projectId,artifactId){
  const r=readBusinessBrief(dir,projectId,artifactId);
  const notes=[];if(r.practice)notes.push('FICTIONAL PRACTICE — not real customer evidence or validation.');if(r.requires_review)notes.push('CAUTION: basis changed; review again.');
  if(r.successor_ids.length)notes.push(('Historical version; successor: ')+r.successor_ids.join(', '));
  return notes.concat(r.document_markdown).join('\n\n');
}

export function searchBusinessBriefs(dir,projectId,revision,query,offset=0){
 if(typeof query!=='string'||query.length>1000||!Number.isSafeInteger(offset)||offset<0||offset>100000)throw Error('Invalid draft search');
 const state=readCore(dir,projectId);if(state.dossier.revision!==revision)throw Error('Project changed');
 const candidates=[...new Set(state.dossier.events.filter(e=>e.type==='business-brief-draft').map(e=>e.subject_ids[0]).reverse())];
 const matches=[],unavailable=[];let bytesRead=0,scanned=0;const maxBytes=4*1024*1024,maxCandidates=32,needle=query.toLowerCase();
 for(const artifactId of candidates.slice(0,maxCandidates)){
  if(bytesRead>=maxBytes)break;scanned++;
  try{
   const artifact=state.dossier.artifacts.find(a=>a.id===artifactId);if(!artifact||artifact.storage!=='local')throw Error('Unavailable');
   const bytes=regularFile(localFile(state.directory,artifact.location),maxBytes-bytesRead);bytesRead+=bytes.length;
   const draft=loadBrief(state,artifactId,bytes);
   const text=draft.fields.map(f=>f.value??'').join('\n'),at=text.toLowerCase().indexOf(needle);
   if(at>=0){const start=Math.max(0,at-40);matches.push({id:artifactId,group:'drafts',title:briefTypes[draft.request.kind].title[1]+' · Version '+draft.version,snippet:text.slice(start,start+200),requires_review:state.dossier.workflow?.invalidated_ids.includes(artifactId)||false});}
  }catch{unavailable.push(artifactId);}
 }
 if(readCore(dir,projectId).sha256!==state.sha256)throw Error('Project changed during draft search');
 const page=matches.slice(offset,offset+25),end=offset+page.length;
 return {revision,records:page,total_matches:matches.length,returned:page.length,next_offset:end<matches.length?end:null,scanned,total_candidates:candidates.length,partial:scanned<candidates.length||unavailable.length>0,unavailable_count:unavailable.length,limitation:'Searches field text in at most 32 newest saved business drafts and 4 MiB of document data. Older, corrupt or oversized documents may be omitted. No external files or index are searched.'};
}

// Use the verified saved snapshot, never the current library, for revision guidance.
export function savedDocumentFieldHelp(draft,key){
 const general=documentFieldHelp(draft.request,key)??briefFieldHelp[draft.request.kind]?.[key]??'';
 const template=draft.template_context?.template,prompt=template?.sections.find(section=>section.key===key)?.prompt;
 return prompt?'Saved worksheet guidance ('+template.name+', version '+template.version+'): '+prompt+'\nGeneral guidance: '+general:general;
}
