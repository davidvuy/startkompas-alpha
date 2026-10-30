import Ajv2020 from 'ajv/dist/2020.js';
import {readCore,regularFile,localFile,sha,bytesFor,damagedArtifacts} from './store.mjs';
import {records} from './dependencies.mjs';
import {applyInvalidation} from './change-rules.mjs';

// Original procedural fields; no example business claims are filled in automatically.
export const briefTypes={
  interview:{title:['Interviewgids en leeg verslag','Interview guide and blank log'],fields:{learning:['Leervraag','Learning question'],participant:['Passende gesprekspartner','Suitable participant'],recent_job:['Vraag naar een recente concrete taak','Question about a recent concrete job'],workaround:['Vraag naar huidige werkwijze en gevolgen','Question about workaround and consequences'],buying:['Vraag naar aankoopbesluit','Question about buying decision'],decision_rule:['Vooraf voorgestelde beslisregel','Proposed decision rule before observations'],next_check:['Volgende controle','Next check']}},
  alternatives:{title:['Alternatieven vergelijken','Compare alternatives'],fields:{job:['Taak van de klant','Customer job'],current_workaround:['Huidige werkwijze','Current workaround'],do_nothing:['Niets veranderen','Do nothing'],alternatives:['Gevonden alternatieven en bronnen','Identified alternatives and sources'],constraints:['Kosten, beperkingen en overstappen','Costs, constraints and switching'],unknowns:['Nog te onderzoeken','Still to investigate'],next_check:['Volgende controle','Next check']}},
  offer:{title:['Aanbodhypothese','Offer hypothesis'],fields:{segment:['Voor wie','For whom'],job:['Welke taak of behoefte','Job or need'],outcome:['Voorgestelde uitkomst','Proposed outcome'],delivery:['Levering en afbakening','Delivery and scope'],exclusions:['Niet inbegrepen','Exclusions'],workaround:['Huidig alternatief','Current alternative'],support:['Ondersteunende en tegensprekende aanwijzingen','Supporting and contradicting indications'],next_check:['Volgende controle','Next check']}},
  pilot:{title:['Pilotafbakening','Pilot boundary'],fields:{learning:['Leervraag','Learning objective'],client:['Passende klant en context','Eligible client and context'],deliverable:['Eén resultaat','One deliverable'],exclusions:['Niet inbegrepen','Exclusions'],responsibilities:['Verantwoordelijkheden','Responsibilities'],period:['Voorgestelde periode','Proposed period'],data_limits:['Grenzen aan gegevensgebruik','Data limits'],acceptance:['Waarneembare acceptatie','Observable acceptance'],stop:['Stop- of herbeoordelingsvoorwaarde','Stop or review condition'],next_check:['Volgende controle','Next check']}},
  pricing:{title:['Prijsaanname','Pricing assumption'],fields:{price:['Voorgestelde prijs en eenheid','Proposed price and unit'],buyer:['Wie beslist','Buying decision maker'],payment_evidence:['Werkelijke betalingen of toezeggingen','Actual payments or commitments'],alternatives:['Relevante alternatieven','Relevant alternatives'],costs:['Kosten en uitsluitingen','Costs and exclusions'],terms:['Nog te verduidelijken voorwaarden','Terms to clarify'],next_check:['Volgende controle','Next check']}}
};
const id={type:'string',pattern:'^[a-z0-9][a-z0-9-]{0,63}$'},text={type:'string',minLength:1,maxLength:4000,pattern:'\\S'},nullable=s=>({anyOf:[s,{type:'null'}]});
const validate=new Ajv2020({strict:true,allErrors:true,coerceTypes:false,useDefaults:false}).compile({type:'object',additionalProperties:false,required:['project_id','expected_revision','operation_id','at','language','kind','client','period','previous_artifact_id','change_reason','fields'],properties:{project_id:id,expected_revision:{type:'integer',minimum:1},operation_id:id,at:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'},language:{enum:['nl','en']},kind:{enum:Object.keys(briefTypes)},client:nullable(text),period:nullable(text),previous_artifact_id:nullable(id),change_reason:nullable(text),fields:{type:'array',maxItems:10,items:{type:'object',additionalProperties:false,required:['key','value','assertion','record_ids'],properties:{key:text,value:nullable(text),assertion:{enum:['proposal','reported','unknown']},record_ids:{type:'array',maxItems:100,uniqueItems:true,items:id}}}}}});
function checkRequest(r){
  if(!validate(r))throw Error('Invalid business brief request: '+validate.errors.map(e=>e.instancePath+' '+e.message).join('; '));
  if(new Date(r.at+'T00:00:00Z').toISOString().slice(0,10)!==r.at)throw Error('Invalid calendar date');
  if((r.previous_artifact_id===null)!==(r.change_reason===null))throw Error('A revision requires its previous artifact and a change reason');
  const seen=new Set();for(const f of r.fields){
    if(!Object.hasOwn(briefTypes[r.kind].fields,f.key)||seen.has(f.key))throw Error('Unknown or duplicate business field');seen.add(f.key);
    if((f.value===null)!==(f.assertion==='unknown'))throw Error('Unknown fields require null; supplied text requires an assertion');
    if(f.assertion==='reported'&&!f.record_ids.length)throw Error('Reported fields require linked project records');
  }
}
function loadBrief(state,artifactId){
  const a=state.dossier.artifacts.find(a=>a.id===artifactId);
  if(!a||a.storage!=='local'||a.availability!=='available'||!state.dossier.events.some(e=>e.type==='business-brief-draft'&&e.subject_ids[0]===artifactId))throw Error('Not an available business brief');
  const bytes=regularFile(localFile(state.directory,a.location));if(sha(bytes)!==a.sha256)throw Error('Business brief fingerprint mismatch');
  const saved=JSON.parse(bytes);
  if(saved.format!=='startkompas-business-brief-v1'||saved.project_id!==state.dossier.project_id||saved.artifact_id!==artifactId||!Number.isInteger(saved.version)||saved.version<1||String(saved.version)!==a.version||typeof saved.document_markdown!=='string')throw Error('Business brief identity/format mismatch');
  checkRequest(saved.request);if(saved.request.project_id!==saved.project_id)throw Error('Business brief request identity mismatch');
  return saved;
}
const escape=s=>String(s).replace(/[\x00-\x1f\x7f-\x9f]/g,' ').replace(/[\\`*_{}[\]()#+.!|<>]/g,c=>'\\'+c);
export function prepareBusinessBrief(dir,request){
  checkRequest(request);const state=readCore(dir,request.project_id),original=state.dossier;
  if(!original.workflow)throw Error('Business briefs require explicit schema 1.1 upgrade');
  if(original.revision!==request.expected_revision)throw Error('Revision conflict; reread project');
  if(original.operations.some(o=>o.id===request.operation_id))throw Error('Operation already recorded; retry original saved attachment request');
  const d=applyInvalidation(original,structuredClone(original),damagedArtifacts(state.directory,original)),index=records(d);
  const prior=request.previous_artifact_id===null?null:loadBrief(state,request.previous_artifact_id);
  if(prior&&['kind','client','period'].some(k=>prior.request[k]!==request[k]))throw Error('Prior brief has a different kind, client or period; keep it separate');
  const candidates=d.workflow.intents.filter(i=>i.goal==='business-brief:'+request.kind&&i.client===request.client&&i.period===request.period).map(i=>i.record_id);
  if(!prior&&request.client!==null&&request.period!==null&&candidates.length)throw Error('Existing scoped brief found: '+candidates.join(', ')+'; read it and name the prior artifact for an update');
  if(prior&&original.events.some(e=>e.type==='business-brief-draft'&&e.subject_ids[1]===prior.artifact_id))throw Error('Prior brief already has a successor; read the latest version');
  const fields=Object.keys(briefTypes[request.kind].fields).map(key=>{
    const f=request.fields.find(f=>f.key===key)??{key,value:null,assertion:'unknown',record_ids:[]};
    const basis=f.record_ids.map(id=>{const r=index.get(id);if(!r||r.group==='events')throw Error('Missing or unsuitable basis record: '+id);return {record_id:id,group:r.group,status:r.assertion??r.status??r.progress??r.availability??'recorded',requires_review:d.workflow.invalidated_ids.includes(id)||(['tasks','checks'].includes(r.group)&&(r.progress!=='done'||r.substantiation!=='supported'))||(r.group==='artifacts'&&r.availability!=='available')};});
    return {...f,basis};
  });
  const previousFields=prior?.fields??[],changes=prior?fields.filter(f=>{const p=previousFields.find(p=>p.key===f.key);return !p||JSON.stringify([f.value,f.assertion,f.record_ids])!==JSON.stringify([p.value,p.assertion,p.record_ids]);}).map(f=>({key:f.key,before:previousFields.find(p=>p.key===f.key)?.value??null,after:f.value})):[];
  const artifactId='business-'+sha(request.operation_id).slice(0,32),version=prior?prior.version+1:1;
  if(index.has(artifactId)||index.has(artifactId+'-event'))throw Error('Generated business record ID already exists');
  const nl=request.language==='nl',lang=nl?0:1,unknown=nl?'Onbekend; niet uitgevoerd of vastgesteld':'Unknown; not performed or established';
  const status={proposal:nl?'Voorstel':'Proposal',reported:nl?'Opgegeven; niet onafhankelijk bevestigd':'Reported; not independently verified',unknown};
  const lines=['# '+briefTypes[request.kind].title[lang]+' — '+(nl?'concept':'draft'),'',`${escape(d.name)} · ${d.project_id} · v${version}`,`${nl?'Klant/context':'Client/context'}: ${request.client===null?unknown:escape(request.client)}`,`${nl?'Periode':'Period'}: ${request.period===null?unknown:escape(request.period)}`,'',nl?'Concept, geen bewijs van vraag, betaling, gehouden interview of pilotgoedkeuring.':'Draft, not evidence of demand, payment, an interview conducted or pilot approval.'];
  if(prior)lines.push('',`${nl?'Vorige versie':'Previous version'}: ${prior.artifact_id}`,`${nl?'Reden wijziging':'Change reason'}: ${escape(request.change_reason)}`,`${nl?'Gewijzigde velden':'Changed fields'}: ${changes.map(c=>c.key).join(', ')||(nl?'geen inhoudelijke wijzigingen':'no field changes')}`);
  for(const f of fields){lines.push('','## '+briefTypes[request.kind].fields[f.key][lang],'',f.value===null?unknown:escape(f.value),status[f.assertion]);for(const r of f.basis)lines.push(`- ${r.record_id}: ${escape(r.status)}${r.requires_review?' — '+(nl?'opnieuw beoordelen':'requires review'):''}`);}
  if(request.kind==='interview')lines.push('',nl?'## Leeg verslag — nog geen gesprek':'## Blank log — no interview yet',nl?'Datum / deelnemercode / directe uitspraak / waarneming / interpretatie / open vraag: nog in te vullen.':'Date / participant code / direct statement / observation / interpretation / open question: not yet recorded.');
  const document_markdown=lines.join('\n')+'\n',content=bytesFor({format:'startkompas-business-brief-v1',project_id:d.project_id,artifact_id:artifactId,version,basis_revision:d.revision,basis_sha256:state.sha256,request:structuredClone(request),fields,changes,document_markdown}).toString('utf8');
  if(Buffer.byteLength(content)>4*1024*1024)throw Error('Business brief exceeds 4 MiB');
  const artifact={id:artifactId,version:String(version),storage:'local',location:'files/'+artifactId+'.json',availability:'available',sha256:sha(content)};
  const basis=[...new Set(fields.flatMap(f=>f.record_ids))];
  const update_request={project_id:d.project_id,expected_revision:d.revision,operation_id:request.operation_id,changes:{artifacts:[...original.artifacts,artifact],events:[...original.events,{id:artifactId+'-event',type:'business-brief-draft',at:request.at,description:prior?'Revised business draft; original and change reason retained in the artifact':'Business draft prepared; no external action or validation',subject_ids:[artifactId,...(prior?[prior.artifact_id]:[])]}],workflow:{...original.workflow,links:[...original.workflow.links,...basis.map(prerequisite_id=>({dependent_id:artifactId,prerequisite_id,reason:'Business draft uses selected project record'}))],intents:[...original.workflow.intents,{record_id:artifactId,goal:'business-brief:'+request.kind,client:request.client,period:request.period,version:String(version)}]}}};
  return {artifact_id:artifactId,version,content,document_markdown,changes,existing_candidates:candidates,update_request,warning:'Proposal only. Save exact content and update_request, attach with the core helper and read back. Unknown scope is not merged automatically. Omitted fields become unknown; revisions are complete drafts, not patches.'};
}
export function readBusinessBrief(dir,projectId,artifactId){
  const state=readCore(dir,projectId),saved=loadBrief(state,artifactId),d=applyInvalidation(state.dossier,structuredClone(state.dossier),damagedArtifacts(state.directory,state.dossier));
  const successors=d.events.filter(e=>e.type==='business-brief-draft'&&e.subject_ids[1]===artifactId).map(e=>e.subject_ids[0]);
  return {...saved,current_revision:d.revision,requires_review:d.workflow.invalidated_ids.includes(artifactId),successor_ids:successors,warning:'Saved draft, not new verification; read current basis before acting.'};
}
export function renderBusinessBrief(dir,projectId,artifactId){
  const r=readBusinessBrief(dir,projectId,artifactId),nl=r.request.language==='nl';
  const notes=[];if(r.requires_review)notes.push(nl?'LET OP: uitgangspunten gewijzigd; opnieuw beoordelen.':'CAUTION: basis changed; review again.');
  if(r.successor_ids.length)notes.push((nl?'Historische versie; opvolger: ':'Historical version; successor: ')+r.successor_ids.join(', '));
  return notes.concat(r.document_markdown).join('\n\n');
}
