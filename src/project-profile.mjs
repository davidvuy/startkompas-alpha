import {randomUUID} from 'node:crypto';
import {readCore,damagedArtifacts} from './store.mjs';
import {applyInvalidation} from './change-rules.mjs';
import {prepareIntakeAnswer,intakeFieldState} from './intake.mjs';
export const profileFields=[
 {key:'stage',label:'Current stage',why:'Helps you choose where to enter the workflow; it does not validate skipped steps.'},
 {key:'service_type',label:'Kind of service',why:'Keeps the service you describe available as context without inventing an offer.'},
 {key:'capacity',label:'Available time',why:'Records your own capacity constraint. No exact duration or availability is inferred.'},
 {key:'constraints',label:'Constraints',why:'Keeps limits you want considered visible. You do not need to disclose private budget or personal details.'}
];
const purposes={
 entry:[['stage','Which starting route fits your current work?','Choose idea, existing offer or improve offer; earlier steps stay unvalidated.']],
 offer:[['service_type','What kind of service are you proposing?','Use your statement when choosing the offer delivery field; no offer text is filled automatically.'],['constraints','Which limits should the offer respect?','Use relevant limits to decide offer exclusions; personal or budget details are optional.']],
 session:[['capacity','What capacity should this session respect?','Choose a small session scope; no minutes or hours are inferred from your statement.'],['constraints','Which constraint affects this next action?','Choose a feasible preparation action without assuming access, budget or permission.']],
 pilot:[['constraints','Which limits affect the proposed pilot?','Review pilot exclusions, responsibilities and data limits; do not disclose unnecessary personal details.'],['capacity','What capacity is available for the pilot?','Review the scope exercise; numeric comparisons still require explicit hours and a shared period.']]
};
export function profileGuidance(d){return Object.fromEntries(Object.entries(purposes).map(([purpose,questions])=>[purpose,questions.map(([key,question,destination])=>({key,question,destination,...intakeFieldState(d,key)}))]));}
export function projectProfile(dir,id){
 const state=readCore(dir,id),d=applyInvalidation(state.dossier,structuredClone(state.dossier),damagedArtifacts(state.directory,state.dossier));
 return {revision:d.revision,sha256:state.sha256,guidance:profileGuidance(d),fields:profileFields.map(field=>({...field,records:d.profile.filter(r=>r.key===field.key).map(record=>({...record,sources:record.source_ids.map(id=>{const source=d.sources.find(s=>s.id===id);return source?{id,title:source.title,date:source.accessed_at,scope:source.scope}: {id,title:'Source unavailable',date:null,scope:null};})}))}))};
}
export function prepareProfileAnswer(dir,id,revision,digest,key,value,date){
 const state=readCore(dir,id);if(state.dossier.revision!==revision||state.sha256!==digest)throw Error('Project changed; reopen the profile before saving');
 const field=profileFields.find(f=>f.key===key);if(!field)throw Error('Unknown profile field');
 if(typeof value!=='string'||value.length>4000)throw Error('Profile answer must be at most 4000 characters');
 const operation='profile-'+randomUUID(),source='profile-source-'+randomUUID();
 const update_request=prepareIntakeAnswer(dir,{project_id:id,source_revision:revision,operation_id:operation,at:date,key,value:value.trim()||null,source_id:source,source:{title:'User statement: '+field.label,location:'Local profile form',scope:'User supplied context, not independently verified'}});
 return {update_request};
}
