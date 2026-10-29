import {regularFile} from './store.mjs';
import {loadNotices,prepareModuleReview,readModule} from './module-notices.mjs';
const [cmd,...args]=process.argv.slice(2);
try{
 let result;
 if(cmd==='notices'&&!args.length)result=loadNotices();
 else if(cmd==='detail'&&args.length===1)result=readModule(args[0]);
 else if(cmd==='review'&&args.length===2)result=prepareModuleReview(args[0],JSON.parse(regularFile(args[1])));
 else throw Error('Usage: notices | detail <module-resource> | review <dossier-dir> <request.json>');
 console.log(JSON.stringify(result,null,2));
}catch(error){console.error(JSON.stringify({error:error.message}));process.exitCode=1;}
