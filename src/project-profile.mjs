import {randomUUID} from 'node:crypto';
import {readCore} from './store.mjs';
import {prepareIntakeAnswer} from './intake.mjs';
export const profileFields=[
 {key:'stage',label:'Current stage',why:'Helps you choose where to enter the workflow; it does not validate skipped steps.'},
 {key:'service_type',label:'Kind of service',why:'Keeps the service you describe available as context without inventing an offer.'},
 {key:'capacity',label:'Available time',why:'Records your own capacity constraint. No exact duration or availability is inferred.'},
 {key:'constraints',label:'Constraints',why:'Keeps limits you want considered visible. You do not need to disclose private budget or personal details.'}
];
export function projectProfile(dir,id){
 const state=readCore(dir,id),d=state.dossier;
 return {revision:d.revision,sha256:state.sha256,fields:profileFields.map(field=>({...field,records:d.profile.filter(r=>r.key===field.key).map(record=>({...record,sources:record.source_ids.map(id=>{const source=d.sources.find(s=>s.id===id);return source?{id,title:source.title,date:source.accessed_at,scope:source.scope}: {id,title:'Source unavailable',date:null,scope:null};})}))}))};
}
export function prepareProfileAnswer(dir,id,revision,digest,key,value,date){
 const state=readCore(dir,id);if(state.dossier.revision!==revision||state.sha256!==digest)throw Error('Project changed; reopen the profile before saving');
 const field=profileFields.find(f=>f.key===key);if(!field)throw Error('Unknown profile field');
 if(typeof value!=='string'||value.length>4000)throw Error('Profile answer must be at most 4000 characters');
 const operation='profile-'+randomUUID(),source='profile-source-'+randomUUID();
 const update_request=prepareIntakeAnswer(dir,{project_id:id,source_revision:revision,operation_id:operation,at:date,key,value:value.trim()||null,source_id:source,source:{title:'User statement: '+field.label,location:'Local profile form',scope:'User supplied context, not independently verified'}});
 return {update_request};
}
