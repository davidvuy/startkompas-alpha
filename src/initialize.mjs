import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import {COLLECTIONS} from './model.mjs';
import {emptyWorkflow} from './dependencies.mjs';
import {createCore} from './store.mjs';
const validate=new Ajv2020({strict:true,allErrors:true,coerceTypes:false,useDefaults:false}).compile(JSON.parse(fs.readFileSync(new URL('../schemas/project-init-v1.schema.json',import.meta.url),'utf8')));
export function initializeProject(dir,request){
 if(!validate(request))throw Error('Invalid project initialization: '+validate.errors.map(e=>e.instancePath+' '+e.message).join('; '));
 const version=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url))).version;
 const d={schema_version:'1.1.0',project_id:request.project_id,revision:1,name:request.name,skill_version:version,module_versions:[],...Object.fromEntries(COLLECTIONS.map(k=>[k,[]])),operations:[],active_task_id:request.first_task?.id??null,workflow:emptyWorkflow()};
 if(request.practice)d.events.push({id:'practice-project-created',type:'practice-project',at:new Date().toISOString(),description:'Fictional practice project. Not real customer evidence or validation.',subject_ids:[]});
 if(request.first_task)d.tasks.push({...request.first_task,applicability:'unknown',progress:'open',substantiation:'unreviewed',basis_kind:'own_requirement',evidence_ids:[],period:null,depends_on:[]});
 for(const [key,label]of [['customer','Provisional customer'],['outcome','Proposed outcome']]){
  const value=request.context?.[key].trim();
  if(value)d.assumptions.push({id:'starting-'+key,text:label+': '+value,assertion:'unknown',source_ids:[]});
 }
 return createCore(dir,d);
}
