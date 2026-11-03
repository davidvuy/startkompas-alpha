import {publicError} from './cli-errors.mjs';
import {regularFile} from './store.mjs';
import {loadNotices,prepareModuleReview,readModule} from './module-notices.mjs';
import {inspectModulePackage,previewModuleTrial} from './module-package.mjs';
import {moduleTrials,prepareModuleTrial,prepareTrialDiscard} from './module-trial.mjs';
import {moduleLibrary,libraryModule} from './module-library.mjs';
const [cmd,...args]=process.argv.slice(2);
try{
 let result;
 if(cmd==='library'&&!args.length)result=moduleLibrary();
 else if(cmd==='show-package'&&args.length===1)result=libraryModule(args[0]);
 else if(cmd==='trials'&&args.length===2)result=moduleTrials(...args);
 else if(['trial-prepare','trial-discard'].includes(cmd)&&args.length===2)result=(cmd==='trial-prepare'?prepareModuleTrial:prepareTrialDiscard)(args[0],JSON.parse(regularFile(args[1],1179648)));
 else if(cmd==='trial-preview'&&args.length===2)result=previewModuleTrial(args[0],JSON.parse(regularFile(args[1],1179648)));
 else if(cmd==='inspect-package'&&args.length===2)result=inspectModulePackage(JSON.parse(regularFile(args[0],1048576)),args[1]);
 else if(cmd==='notices'&&!args.length)result=loadNotices();
 else if(cmd==='detail'&&args.length===1)result=readModule(args[0]);
 else if(cmd==='review'&&args.length===2)result=prepareModuleReview(args[0],JSON.parse(regularFile(args[1])));
 else throw Error('Usage: library | show-package <id> | trials <directory> <project-id> | trial-prepare|trial-discard <directory> <request.json> | trial-preview <practice-project-directory> <request.json> | inspect-package <package.json> <project-schema> | notices | detail <module-resource> | review <dossier-dir> <request.json>');
 console.log(JSON.stringify(result,null,2));
}catch(error){console.error(JSON.stringify(publicError(error)));process.exitCode=1;}
