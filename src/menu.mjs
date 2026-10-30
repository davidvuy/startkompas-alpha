import {reportPreview,writeReport} from './workspace.mjs';

// One action per invocation: subprocesses retain their own prompts and save guards.
export async function runMenu({ask,print,run}){
 print('Startkompas — choose a step\n1 Check installation\n2 Create a project\n3 Try a fictional demo\n4 Resume a project\n5 Draft an offer\n6 Preview and save a report\n0 Exit');
 const choice=await ask('Choice');
 if(choice==='0'||choice==='/cancel')return;
 if(choice==='1')return run(['doctor']);
 if(choice==='2')return run(['start']);
 if(choice==='3'){
  const dir=await ask('New folder for the fictional demo (outside the app)');
  if(!dir||dir==='/cancel')return;
  return run(['demo',dir]);
 }
 if(!['4','5','6'].includes(choice))throw Error('Choose a number from 0 to 6.');
 const dir=await ask('Existing project folder');if(!dir||dir==='/cancel')return;
 const id=await ask('Project ID');if(!id||id==='/cancel')return;
 if(choice==='4')return run(['workspace','show',dir,id]);
 if(choice==='5')return run(['workspace','draft',dir,id,'offer']);
 const sections=['summary','tasks','assumptions','decisions','drafts'];
 const preview=reportPreview(dir,id,sections);
 print(preview.markdown);
 print('This report may contain private data. It is not a backup.');
 const destination=await ask('New report file outside the app and project (/cancel to stop)');
 if(!destination||destination==='/cancel')return;
 const confirm=await ask('Save this displayed report? [yes/no]');
 if(confirm.toLowerCase()!=='yes'){print('Not saved.');return;}
 print(JSON.stringify(writeReport(dir,id,sections,preview.confirmation_sha256,destination),null,2));
}
