import {regularFile} from './store.mjs';
import {previewPdf,writePdf} from './pdf-export.mjs';
import {publicError} from './cli-errors.mjs';
const [command,...args]=process.argv.slice(2);
try{
 if(command==='preview'&&args.length===3){const result=await previewPdf(args[0],args[1],JSON.parse(regularFile(args[2],65536)));console.log(JSON.stringify({...result,bytes:result.bytes.length},null,2));}
 else if(command==='save'&&args.length===5)console.log(JSON.stringify(await writePdf(args[0],args[1],JSON.parse(regularFile(args[2],65536)),args[3],args[4]),null,2));
 else if(!command||command==='help')console.log('pdf preview <project-directory> <project-id> <selection.json> | save <project-directory> <project-id> <selection.json> <preview-sha256> <new-file.pdf>\nLocal snapshot only. Review source selection, rendering warnings and exact PDF digest. No sending or project writes.');
 else throw Error('Use pdf help');
}catch(error){console.error(JSON.stringify(publicError(error)));process.exitCode=1;}
