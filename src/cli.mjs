import {publicError} from './cli-errors.mjs';
import {createProject,resumeProject,readJSON} from './dossier.mjs';
const [command,dir,arg,...extra]=process.argv.slice(2);
try {
  if(extra.length||!dir||!arg||!['create','resume'].includes(command))throw new Error('Usage: node src/cli.mjs create <private-directory> <input.json> | resume <private-directory> <expected-project-id>');
  const result=command==='create'?createProject(dir,readJSON(arg).data):resumeProject(dir,arg);
  console.log(JSON.stringify({operation:command,...result},null,2));
} catch(error) {
  console.error(JSON.stringify(publicError(error)));
  process.exitCode=1;
}
