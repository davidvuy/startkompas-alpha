import {personalTemplates,preparePersonalTemplate,preparePersonalDraft} from './personal-templates.mjs';
import {templateLibrary,libraryTemplate,prepareLibraryDraft} from './template-library.mjs';
import {regularFile} from './store.mjs';
import {validateTemplate} from './template-format.mjs';
import {prepareTemplateDraft} from './template-draft.mjs';
import {publicError} from './cli-errors.mjs';
const [command,...args]=process.argv.slice(2);
try{
 if(command==='personal-list'&&args.length===2)console.log(JSON.stringify(personalTemplates(...args),null,2));
 else if(['personal-prepare','personal-draft'].includes(command)&&args.length===3){const r=JSON.parse(regularFile(args[2],131072));const keys=['revision','sha256','input'];if(!r||Object.keys(r).length!==keys.length||keys.some(k=>!Object.hasOwn(r,k)))throw Error('Invalid personal template command request');console.log(JSON.stringify((command==='personal-prepare'?preparePersonalTemplate:preparePersonalDraft)(args[0],args[1],r.revision,r.sha256,r.input),null,2));}
 else if(command==='list'&&!args.length)console.log(JSON.stringify(templateLibrary(),null,2));
 else if(command==='show'&&args.length===1)console.log(JSON.stringify(libraryTemplate(args[0]),null,2));
 else if(command==='prepare-library'&&args.length===2)console.log(JSON.stringify(prepareLibraryDraft(args[0],JSON.parse(regularFile(args[1],131072))),null,2));
 else if(command==='validate'&&args.length===1){const result=validateTemplate(JSON.parse(regularFile(args[0],65536)));console.log(JSON.stringify({valid:true,id:result.template.id,version:result.template.version,sha256:result.sha256},null,2));}
 else if(command==='prepare'&&args.length===2)console.log(JSON.stringify(prepareTemplateDraft(args[0],JSON.parse(regularFile(args[1],131072))),null,2));
 else if((!command||command==='help')&&!args.length)console.log('templates personal-list <directory> <project-id> | personal-prepare|personal-draft <directory> <project-id> <request.json> | list | show <id> | prepare-library <project-directory> <request.json> | validate <template.json> | prepare <project-directory> <request.json>\nPreparation is read-only. Review content/update_request before saving through the existing guarded artifact route. Prompts never become answers.');
 else throw Error('Use templates help');
}catch(error){console.error(JSON.stringify(publicError(error)));process.exitCode=1;}
