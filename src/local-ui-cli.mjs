import {startLocalUI} from './local-ui-server.mjs';
const args=process.argv.slice(2);
if(args.length===1&&args[0]==='--help'){
 console.log('Usage: node src/local-ui-cli.mjs <existing-projects-folder>\nOnly immediate project folders are available. No cloud or AI calls.\nThe terminal prints a private session link. Stop with Ctrl+C.');
}else if(args.length!==1){console.error('Specify one existing projects folder outside the app. Use --help for instructions.');process.exitCode=1;}
else{
 try{
  const app=await startLocalUI({root:args[0]});
  console.log('Startkompas local workspace. Open this session link in your browser (keep it private):\n'+app.url+'\nStop the workspace with Ctrl+C.');
  for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>app.close().then(()=>process.exit(0)));
 }catch{console.error('The workspace could not start. Choose an existing local folder outside the application and check your access permissions.');process.exitCode=1;}
}
