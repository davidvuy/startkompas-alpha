import {reportPreview,writeReport} from './workspace.mjs';

// One action per invocation: subprocesses retain their own prompts and save guards.
export async function runMenu({ask,print,run}){
 print('Startkompas — kies een stap\n1 Installatie controleren\n2 Nieuw project maken\n3 Fictieve demo proberen\n4 Project hervatten\n5 Aanbod opstellen\n6 Rapport bekijken en opslaan\n0 Stoppen');
 const choice=await ask('Keuze');
 if(choice==='0'||choice==='/cancel')return;
 if(choice==='1')return run(['doctor']);
 if(choice==='2')return run(['start']);
 if(choice==='3'){
  const dir=await ask('Nieuwe map voor fictieve demo (buiten de app)');
  if(!dir||dir==='/cancel')return;
  return run(['demo',dir]);
 }
 if(!['4','5','6'].includes(choice))throw Error('Kies een nummer van 0 tot en met 6.');
 const dir=await ask('Map van je bestaande project');if(!dir||dir==='/cancel')return;
 const id=await ask('Project-ID');if(!id||id==='/cancel')return;
 if(choice==='4')return run(['workspace','show',dir,id]);
 if(choice==='5')return run(['workspace','draft',dir,id,'offer']);
 const sections=['summary','tasks','assumptions','decisions','drafts'];
 const preview=reportPreview(dir,id,sections);
 print(preview.markdown);
 print('Dit rapport bevat mogelijk privégegevens. Het is geen back-up.');
 const destination=await ask('Nieuw rapportbestand buiten de app en het project (/cancel om te stoppen)');
 if(!destination||destination==='/cancel')return;
 const confirm=await ask('Dit getoonde rapport opslaan? [ja/nee]');
 if(confirm.toLowerCase()!=='ja'){print('Niet opgeslagen.');return;}
 print(JSON.stringify(writeReport(dir,id,sections,preview.confirmation_sha256,destination),null,2));
}
