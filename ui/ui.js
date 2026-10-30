'use strict';
const $=id=>document.getElementById(id);
let token='',selected=null,editor=null,dirty=false,preview=null,currentView=null,reportState=null,wizardStep=0,wizardDirty=false,wizardPractice=false;
try{const fragment=new URLSearchParams(location.hash.slice(1));token=fragment.get('session')||sessionStorage.getItem('startkompas-session')||'';history.replaceState(null,'',location.pathname);if(token)sessionStorage.setItem('startkompas-session',token);}catch{history.replaceState(null,'',location.pathname);}
const notice=message=>{$('notice').textContent=message;};
async function api(route,value={}){
 const res=await fetch('/api/'+route,{method:'POST',headers:{'Content-Type':'application/json','X-Startkompas-Session':token},body:JSON.stringify(value),cache:'no-store'});
 const data=await res.json();if(!res.ok)throw Error(data.error||'The request failed.');return data;
}
function screen(name){for(const key of ['welcome','create','workspace','offer','report','history','inspect','search','help'])$(key).hidden=key!==name;}
function list(id,items,empty,render){const target=$(id);target.replaceChildren();if(!items.length){const li=document.createElement('li');li.className='muted';li.textContent=empty;target.append(li);}else for(const item of items){const li=document.createElement('li');render(li,item);target.append(li);}}
function detail(parent,text){const small=document.createElement('small');small.textContent=text;parent.append(small);}
function title(parent,text){const span=document.createElement('span');span.textContent=text;parent.append(span);}
const progress={open:'Open',in_progress:'In progress',done:'Done',deferred:'Deferred'};
async function show(ref){
 if(editor)throw Error('Save or discard your offer changes before switching projects.');
 if(wizardDirty&&!$('create').hidden)throw Error('Return to the overview before switching projects. Your setup text will be kept.');
 const view=await api('show',{ref});selected=ref;currentView=view;reportState=null;screen('workspace');$('project-name').textContent=view.name;
 $('project-meta').textContent=`${view.project_id} · Revision ${view.revision} · Folder: ${view.folder} · ${view.archived?'Archived':'Active'}${view.practice?' · FICTIONAL PRACTICE':''}`;
 $('new-offer').hidden=view.archived;$('archive-open').textContent=view.archived?'Restore project':'Archive project';$('archive-confirmation').hidden=true;$('archive-confirm').checked=false;
 const action=view.actions.find(a=>a.id===view.next.record_id),assumption=view.assumptions.find(a=>a.id===view.next.record_id),check=view.checks.find(a=>a.id===view.next.record_id);
 $('next-title').textContent=action?.title||assumption?.text||check?.title||(view.next.kind==='review'?'Review changed assumptions':'Prepare your first offer');
 $('next-reason').textContent=({task:'This is the first available saved task, with your active task first.',assumption:'This assumption has the most recorded dependencies.',check:'This recorded check is unresolved.',review:'Assumptions have changed or attachments are damaged. Review them before reuse.',draft:'No next task has been recorded. You can prepare an offer or interview.'})[view.next.kind]||'Review the saved records.';
 list('tasks',view.actions,'No open tasks yet.',(li,a)=>{recordLink(li,a.id,a.title);detail(li,(progress[a.progress]||a.progress)+(a.blocked_by.length?' · Waiting for '+a.blocked_by.length+' prerequisites':''));});
 list('assumptions',view.assumptions,'No assumptions recorded yet.',(li,a)=>{recordLink(li,a.id,a.text);detail(li,'To investigate · '+a.dependent_count+' dependencies');});
 list('drafts',view.drafts,'No drafts saved yet.',(li,a)=>{title(li,({offer:'Offer',interview:'Interview guide',pricing:'Pricing assumption',pilot:'Pilot',alternatives:'Alternatives'})[a.kind]||'Document');detail(li,'Version '+(a.version??'?')+' · '+(a.status==='draft'?'Draft':a.status==='review_required'?'Review required':'Unavailable')+(a.historical?' · Historical version':''));const read=document.createElement('button');read.type='button';read.className='quiet';read.textContent='Read saved draft';read.addEventListener('click',()=>act(()=>inspectDraft(a.id)));li.append(read);if(!view.archived&&a.kind==='offer'&&!a.historical&&a.status!=='unavailable_or_invalid'){const button=document.createElement('button');button.type='button';button.className='quiet';button.textContent='Revise this offer';button.addEventListener('click',()=>act(()=>openOffer(a.id)));li.append(button);}});
 list('reviews',[...view.blockers,...view.checks],'No recorded review flags. This is not substantive approval.',(li,a)=>{recordLink(li,a.id,a.title||a.id);detail(li,'Review the basis before reuse.');});
 for(const button of $('projects').querySelectorAll('button'))button.setAttribute('aria-current',String(button.dataset.ref===ref));
 $('project-name').focus();
 try{sessionStorage.setItem('startkompas-last-project',JSON.stringify({root:rootScope,folder:view.folder,id:view.project_id}));}catch{}
}
async function refresh(){
 const data=await api('projects');projectList=data.projects;rootScope=data.root;initRecovery();
 try{const last=JSON.parse(sessionStorage.getItem('startkompas-last-project'));lastProject=last?.root===rootScope?projectList.find(p=>p.folder===last.folder&&p.id===last.id):null;}catch{lastProject=null;}
 $('resume-last').hidden=!lastProject;if(lastProject)$('resume-last').textContent='Resume '+lastProject.name+(lastProject.archived?' (archived)':'');$('root').textContent=data.root;$('location').textContent='Projects folder: '+data.root;
 renderProjects();
 if(selected&&!data.projects.some(p=>p.ref===selected)){selected=null;screen('welcome');notice('The selected project is no longer at the same location. Select it again, or restore the folder and refresh. Nothing has been overwritten.');}
 if(data.unavailable.length)notice('Not opened: '+data.unavailable.join(', ')+'. These projects are unreadable or invalid; nothing has been overwritten.');
 return data;
}
function renderProjects(){
 const query=$('project-search').value.trim().toLowerCase();
 const visible=projectList.filter(p=>($('include-archived').checked||!p.archived)&&[p.name,p.id,p.folder].some(value=>value.toLowerCase().includes(query)));
 if($('project-sort').value==='name')visible.sort((a,b)=>a.name.localeCompare(b.name,'en')||a.folder.localeCompare(b.folder,'en'));
 $('project-count').textContent=visible.length+' of '+projectList.length+' projects shown';
 $('empty').hidden=visible.length>0;$('empty').textContent=projectList.length?'No matching projects. Clear search or enable Show archived projects.':'Your projects will appear here.';
 $('projects').replaceChildren();for(const project of visible){const button=document.createElement('button');button.type='button';button.dataset.ref=project.ref;button.setAttribute('aria-current',String(project.ref===selected));title(button,project.name+(project.practice?' [practice]':'')+(project.archived?' (archived)':''));detail(button,'ID: '+project.id+' · Folder: '+project.folder+' · v'+project.revision);detail(button,'Modified: '+new Date(project.updated).toLocaleString('en-GB'));button.addEventListener('click',()=>act(()=>show(project.ref)));$('projects').append(button);}
}
$('project-search').addEventListener('input',renderProjects);
$('project-sort').addEventListener('change',renderProjects);
let recovery=null,projectList=[],rootScope='',lastProject=null;
let busy=false;
async function act(fn){if(busy)return;busy=true;notice('');const controls=[...document.querySelectorAll('button,input,textarea,select')].map(element=>({element,disabled:element.disabled}));controls.forEach(c=>c.element.disabled=true);try{await fn();}catch(error){notice(error.message==='Failed to fetch'?'The workspace is unreachable. Check that the terminal is still open.':error.message);$('notice').scrollIntoView({block:'nearest'});$('notice').focus();}finally{busy=false;controls.forEach(c=>c.element.disabled=c.disabled);}}
function wizard(step){wizardStep=step;for(const [i,key]of ['identity','context','confirm'].entries())$('wizard-'+key).hidden=i!==step;$('wizard-step').textContent=['STEP 1 OF 3 — YOUR PROJECT','STEP 2 OF 3 — OPTIONAL CONTEXT','STEP 3 OF 3 — REVIEW'][step];$('create-form').elements.confirmed.checked=false;$('wizard-step').focus();if(step===2){const f=$('create-form').elements;$('wizard-summary').textContent=`${wizardPractice?'FICTIONAL PRACTICE — not real customer evidence.\n':''}Project: ${f.name.value}\nID / folder: ${f.id.value}\nFirst task: ${f.task.value||'Not specified'}\nProvisional customer: ${f.customer.value||'Unknown — not recorded'}\nProposed outcome: ${f.outcome.value||'Unknown — not recorded'}\n\nNo customer evidence or completed work will be invented.`;}}
function identityValid(){return [...$('wizard-identity').querySelectorAll('input')].every(input=>input.reportValidity());}
function createScreen(){if(editor){notice('Save or discard your offer before creating a project.');return;}notice('');screen('create');wizard(0);$('create-form').elements.name.focus();}
$('new').addEventListener('click',createScreen);$('new-other').addEventListener('click',createScreen);
$('cancel').addEventListener('click',()=>{screen('welcome');$('new').focus();});
$('discard-setup').addEventListener('click',()=>{$('create-form').reset();wizardDirty=false;wizardPractice=false;clearRecovery();screen('welcome');$('new').focus();});
$('refresh').addEventListener('click',()=>act(async()=>{if(editor)throw Error('Save or discard your offer before refreshing.');await refresh();if(selected)await show(selected);}));
$('include-archived').addEventListener('change',renderProjects);
$('create-form').noValidate=true;
$('create-form').addEventListener('input',()=>{wizardDirty=true;keepDraft();});
$('wizard-next').addEventListener('click',()=>{if(identityValid())wizard(1);});
$('wizard-back').addEventListener('click',()=>wizard(0));
$('wizard-review').addEventListener('click',()=>wizard(2));
$('wizard-edit').addEventListener('click',()=>wizard(1));
$('create-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(wizardStep<2){if(identityValid())wizard(wizardStep+1);return;}if(!form.reportValidity())return;act(async()=>{const data=await api('create',{name:form.elements.name.value,id:form.elements.id.value,task:form.elements.task.value,context:{customer:form.elements.customer.value,outcome:form.elements.outcome.value},practice:wizardPractice,confirmed:form.elements.confirmed.checked});form.reset();wizardDirty=false;wizardPractice=false;clearRecovery();await refresh();await show(data.ref);notice('Project saved. Optional context remains unverified; use the same project through the skill or CLI.');});});
async function openOffer(previous=null){
 const data=await api('offer-form',{ref:selected,previous});editor={...data,ref:selected};dirty=false;preview=null;
 $('offer-fields').replaceChildren();$('offer-conflict').hidden=true;$('offer-preview').hidden=true;$('offer-confirm').checked=false;
 $('offer-client').value=data.client;$('offer-period').value=data.period;$('offer-reason').value='';
 $('offer-client').readOnly=previous!==null;$('offer-period').readOnly=previous!==null;
 $('offer-reason-label').hidden=previous===null;$('offer-reason').required=previous!==null;
 for(const field of data.fields){const label=document.createElement('label');label.textContent=field.label;const input=document.createElement('textarea');input.id='field-'+field.key;input.name=field.key;input.maxLength=4000;input.value=field.value;input.placeholder='Not sure yet? Leave this blank.';label.append(input);$('offer-fields').append(label);}
 screen('offer');$('offer-title').focus();
}
$('new-offer').addEventListener('click',()=>act(()=>openOffer()));
$('offer-form').addEventListener('input',()=>{dirty=true;keepDraft();conflictState=null;$('offer-conflict').hidden=true;preview=null;$('offer-preview').hidden=true;$('offer-confirm').checked=false;});
$('offer-form').addEventListener('submit',event=>{event.preventDefault();act(async()=>{
 const result=await api('offer-preview',{ref:editor.ref,previous:editor.previous,revision:editor.revision,sha256:editor.sha256,client:$('offer-client').value,period:$('offer-period').value,reason:$('offer-reason').value,fields:Object.fromEntries(editor.fields.map(f=>[f.key,$('field-'+f.key).value]))});
 preview=result.preview;$('offer-markdown').textContent=result.markdown;$('offer-confirm').checked=false;$('offer-preview').hidden=false;$('offer-preview').scrollIntoView({block:'start'});$('offer-markdown').focus();
});});
$('offer-save').addEventListener('click',()=>act(async()=>{
 if(!preview||!$('offer-confirm').checked)throw Error('Review and confirm the displayed preview before saving.');
 const result=await api('offer-save',{ref:editor.ref,preview,confirmed:true});editor=null;dirty=false;preview=null;clearRecovery();
 await refresh();await show(selected);notice('Offer saved as project revision '+result.revision+'. Previous versions are preserved.');
}));
$('offer-cancel').addEventListener('click',()=>act(async()=>{editor=null;dirty=false;preview=null;clearRecovery();await show(selected);}));
$('open-report').addEventListener('click',()=>{reportState={ref:selected,preview:null};$('report-preview').hidden=true;$('report-confirm').checked=false;$('report-result').textContent='';screen('report');$('report-title').focus();});
$('report-form').addEventListener('change',()=>{if(reportState)reportState.preview=null;$('report-preview').hidden=true;$('report-confirm').checked=false;});
$('report-form').addEventListener('submit',event=>{event.preventDefault();act(async()=>{const sections=[...$('report-form').querySelectorAll('input:checked')].map(input=>input.value);if(!sections.length)throw Error('Select at least one report section.');const result=await api('report-preview',{ref:reportState.ref,sections});reportState.preview=result.preview;$('report-markdown').textContent=result.markdown;$('report-preview').hidden=false;$('report-confirm').checked=false;$('report-result').textContent='';$('report-markdown').focus();});});
$('report-save').addEventListener('click',()=>act(async()=>{if(!reportState?.preview||!$('report-confirm').checked)throw Error('Review and confirm the report before saving.');const result=await api('report-save',{ref:reportState.ref,preview:reportState.preview,confirmed:true});$('report-result').textContent='Saved to: '+result.path+'. Your project was not changed.';}));
$('report-cancel').addEventListener('click',()=>act(()=>show(selected)));
$('archive-open').addEventListener('click',()=>{$('archive-explanation').textContent=currentView.archived?'Restore this project to your active list? Its files and history are retained.':'Archive this project from your active list? No files are deleted. You can find it with Show archived projects and restore it later.';$('archive-confirm').checked=false;$('archive-save').textContent=currentView.archived?'Restore project':'Archive project';$('archive-confirmation').hidden=false;$('archive-explanation').focus();});
$('archive-cancel').addEventListener('click',()=>{$('archive-confirmation').hidden=true;$('archive-open').focus();});
$('archive-save').addEventListener('click',()=>act(async()=>{if(!$('archive-confirm').checked)throw Error('Confirm archiving or restoring this project first.');const result=await api('archive',{ref:selected,revision:currentView.revision,sha256:currentView.sha256,archived:!currentView.archived,confirmed:true});await refresh();await show(selected);notice(result.archived?'Project archived. Its files remain intact; use Show archived projects to find it later.':'Project restored to the active list.');}));
$('open-history').addEventListener('click',()=>act(async()=>{
 const ref=selected,data=await api('history',{ref});
 screen('history');$('history-comparison').hidden=true;
 $('history-summary').textContent=currentView.name+' · Current revision '+data.revision;
 $('history-warning').textContent=[data.truncated?'Only the newest 50 snapshot candidates are shown.':'',data.events_truncated?'Only the newest 100 recorded events are shown.':'',data.unrecognized_entries?'Some history files were not recognized. Nothing was changed.':''].filter(Boolean).join(' ');
 list('history-revisions',data.snapshots,'No historical snapshots yet. Your current revision is listed above.',(li,item)=>{
  title(li,'Revision '+item.revision);detail(li,item.valid&&!item.ambiguous?'Integrity checked; contents are not independently validated.':'Unavailable or ambiguous. No automatic repair.');
  if(item.valid&&!item.ambiguous&&item.revision<data.revision){const button=document.createElement('button');button.type='button';button.className='quiet';button.textContent='Compare with revision '+data.revision;button.addEventListener('click',()=>act(async()=>{const result=await api('compare',{ref,before:item.revision,after:data.revision});$('history-comparison').textContent=result.markdown;$('history-comparison').hidden=false;$('history-comparison').scrollIntoView({block:'start'});$('history-comparison').focus();}));li.append(button);}
 });
 list('history-events',data.events,'No events recorded.',(li,event)=>{title(li,event.description);detail(li,event.at+' · '+event.type.replaceAll('-',' '));});
 $('history-title').focus();
}));
$('history-back').addEventListener('click',()=>act(()=>show(selected)));
function recordLink(parent,id,label){const button=document.createElement('button');button.type='button';button.className='quiet';button.textContent=label;button.addEventListener('click',()=>act(()=>inspectRecord(id)));parent.append(button);}
function inspection(titleText,status,body){screen('inspect');$('inspect-title').textContent=titleText;$('inspect-status').textContent=status;$('inspect-text').textContent=body;$('inspect-title').focus();}
async function inspectDraft(id){
 const data=await api('draft',{ref:selected,id});inspection('Saved '+data.kind+' · Version '+data.version,(data.historical?'Historical version. ':'')+(data.requires_review?'Basis changed — review before reuse. ':'')+'Read-only; this is a draft, not validation.',data.markdown);
 list('inspect-basis',data.basis_ids,'No basis records linked.',(li,key)=>recordLink(li,key,key));
 list('inspect-dependents',data.successors,'No newer version recorded.',(li,key)=>{const b=document.createElement('button');b.type='button';b.textContent='Read newer version';b.addEventListener('click',()=>act(()=>inspectDraft(key)));li.append(b);});
}
async function inspectRecord(id){
 const data=await api('record',{ref:selected,id}),r=data.record;
 inspection(r.title||r.text||r.id,'Revision '+data.revision+' · '+r.group+(r.requires_review?' · Review required':'')+(data.truncated?' · First 100 links shown':''),Object.entries(r).filter(([k])=>!['group','requires_review'].includes(k)).map(([k,v])=>k.replaceAll('_',' ')+': '+(typeof v==='string'?v:JSON.stringify(v,null,2))).join('\n\n'));
 list('inspect-basis',data.prerequisites,'No prerequisites recorded.',(li,item)=>{recordLink(li,item.id,item.title);detail(li,item.reason);});
 list('inspect-dependents',data.dependents,'No dependents recorded.',(li,item)=>recordLink(li,item.id,item.title));
 if(r.group==='artifacts'&&currentView.drafts.some(d=>d.id===r.id)){const b=document.createElement('button');b.type='button';b.textContent='Read saved draft';b.addEventListener('click',()=>act(()=>inspectDraft(r.id)));$('inspect-basis').append(b);}
}
let searchState=null;
async function searchRecords(offset){const result=await api('search',{ref:selected,revision:searchState.revision,query:searchState.query,offset});searchState.next=result.next_offset;$('search-count').textContent=result.total_matches+' matching records · '+result.returned+' shown from '+(offset+1);list('search-results',result.records,'No matches in saved records.',(li,r)=>{recordLink(li,r.id,r.title||r.text||r.description||r.id);detail(li,r.group+' · '+r.id+(r.requires_review?' · Review required':''));});$('search-more').hidden=result.next_offset===null;$('search-count').focus();}
$('open-search').addEventListener('click',()=>{screen('search');$('search-results').replaceChildren();$('search-count').textContent='';$('search-more').hidden=true;$('record-query').focus();});
$('record-search-form').addEventListener('submit',event=>{event.preventDefault();act(async()=>{searchState={revision:currentView.revision,query:$('record-query').value};await searchRecords(0);});});
$('search-more').addEventListener('click',()=>act(()=>searchRecords(searchState.next)));
$('search-back').addEventListener('click',()=>act(()=>show(selected)));
$('inspect-back').addEventListener('click',()=>act(()=>show(selected)));
$('open-help').addEventListener('click',()=>act(async()=>{if(editor||wizardDirty)throw Error('Save or discard your current form before opening the problem report.');const result=await api('diagnostics');$('help-report').value=result.markdown;$('help-result').textContent='';screen('help');$('help-title').focus();}));
$('help-copy').addEventListener('click',()=>act(async()=>{try{await navigator.clipboard.writeText($('help-report').value);$('help-result').textContent='Copied. Review it again before posting on GitHub.';}catch{$('help-report').focus();$('help-report').select();$('help-result').textContent='Automatic copy is unavailable. Copy the selected report manually.';}}));
$('help-back').addEventListener('click',()=>{screen('welcome');$('new').focus();});
let conflictState=null;
$('offer-compare').addEventListener('click',()=>act(async()=>{
 const latest=await api('offer-latest',{ref:editor.ref,previous:editor.previous});
 const mine={client:$('offer-client').value,period:$('offer-period').value,reason:$('offer-reason').value,fields:Object.fromEntries(editor.fields.map(f=>[f.key,$('field-'+f.key).value]))};
 conflictState={latest,mine,ref:editor.ref};$('conflict-fields').replaceChildren();
 for(const field of latest.fields){const row=document.createElement('div');row.className='grid';for(const [label,value]of [['Your '+field.label,mine.fields[field.key]],['Latest '+field.label,field.value]]){const panel=document.createElement('div');const heading=document.createElement('h3');heading.textContent=label;const text=document.createElement('p');text.textContent=value||'Unanswered';panel.append(heading,text);row.append(panel);}$('conflict-fields').append(row);}
 $('conflict-confirm').checked=false;$('offer-conflict').hidden=false;preview=null;$('offer-preview').hidden=true;$('offer-confirm').checked=false;$('offer-conflict').scrollIntoView({block:'start'});$('conflict-title').focus();
}));
async function applyConflict(keep){
 if(!conflictState||!$('conflict-confirm').checked)throw Error('Review and confirm the displayed differences first.');
 const c=conflictState,fresh=await api('offer-latest',{ref:c.ref,previous:c.latest.previous});
 if(fresh.sha256!==c.latest.sha256||fresh.previous!==c.latest.previous)throw Error('The project changed again. Compare with the latest fields before continuing.');
 await openOffer(fresh.previous);
 if(editor.sha256!==fresh.sha256){editor=null;await show(selected);throw Error('The project changed during reload. Reopen and compare again.');}
 if(keep){for(const [key,value]of Object.entries(c.mine.fields))$('field-'+key).value=value;if(fresh.previous===null){$('offer-client').value=c.mine.client;$('offer-period').value=c.mine.period;}$('offer-reason').value=c.mine.reason;}
 dirty=keep;conflictState=null;preview=null;if(keep)keepDraft();else clearRecovery();notice(keep?'Your text is kept against the reviewed revision. Explain any revision, then preview and confirm before saving.':'Latest saved fields loaded. Nothing was written to the project.');
}
$('conflict-keep').addEventListener('click',()=>act(()=>applyConflict(true)));
$('conflict-load').addEventListener('click',()=>act(()=>applyConflict(false)));
window.addEventListener('beforeunload',event=>{if(dirty||wizardDirty){event.preventDefault();event.returnValue='';}});
function initRecovery(){
 if(recovery)return;
 try{recovery=StartkompasRecovery(sessionStorage,rootScope);$('keep-draft').checked=sessionStorage.getItem('startkompas-keep-draft')==='yes';recoveryStatus();}catch{$('recovery-status').textContent='Browser storage is unavailable. Keep this page open until you save.';}
}
function recoveryStatus(){
 const entry=recovery?.read();$('recovery-actions').hidden=!entry;
 $('recovery-status').textContent=entry?'Unsaved '+entry.kind+' copy available from '+new Date(entry.at).toLocaleString('en-GB')+'. It has not been saved to a project.':$('keep-draft').checked?'Tab recovery is on. Form changes will be kept locally.':'Tab recovery is off.';
}
function clearRecovery(){try{recovery?.clear();$('recovery-text').hidden=true;recoveryStatus();}catch{$('recovery-status').textContent='Could not remove the recovery copy. Clear this tab’s browser storage when finished.';}}
function keepDraft(){
 if(!$('keep-draft').checked||!recovery)return;
 try{
  if(editor){recovery.write('offer',{folder:currentView.folder,id:currentView.project_id,previous:editor.previous,revision:editor.revision,sha256:editor.sha256,client:$('offer-client').value,period:$('offer-period').value,reason:$('offer-reason').value,fields:Object.fromEntries(editor.fields.map(f=>[f.key,$('field-'+f.key).value]))});}
  else if(wizardDirty){const f=$('create-form').elements;recovery.write('wizard',{...Object.fromEntries(['name','id','task','customer','outcome'].map(k=>[k,f[k].value])),practice:wizardPractice});}
  recoveryStatus();
 }catch{$('recovery-status').textContent='Recovery copy could not be updated. Keep this page open and save your work.';}
}
$('keep-draft').addEventListener('change',()=>{try{sessionStorage.setItem('startkompas-keep-draft',$('keep-draft').checked?'yes':'no');if(!$('keep-draft').checked)clearRecovery();else keepDraft();recoveryStatus();}catch{$('recovery-status').textContent='Browser storage is unavailable; recovery is not active.';}});
$('forget-draft').addEventListener('click',clearRecovery);
$('resume-last').addEventListener('click',()=>act(async()=>{if(lastProject)await show(lastProject.ref);}));
$('practice').addEventListener('click',()=>{
 if(editor||wizardDirty){notice('Finish your current form before loading a practice example.');return;}
 createScreen();wizardPractice=true;const f=$('create-form').elements;
 const values={name:'Fictional practice — North Studio',id:'practice-'+crypto.randomUUID().slice(0,8),task:'Practice drafting an offer; do not contact real customers',customer:'Fictional example: small design studios with scattered project notes',outcome:'Fictional proposal: organize one project handover into a clear checklist'};
 for(const [key,value]of Object.entries(values))f[key].value=value;
 wizardDirty=true;keepDraft();notice('Fictional practice only. Review the example before creating a separate project. No customer evidence is supplied.');
});
$('recover-draft').addEventListener('click',()=>act(async()=>{
 if(editor||wizardDirty)throw Error('Finish or discard the current form before recovering another draft.');
 const entry=recovery?.read();if(!entry)throw Error('No valid recovery copy remains in this tab.');
 const d=entry.data;
 if(entry.kind==='wizard'){createScreen();for(const [key,value]of Object.entries(d))if(key!=='practice')$('create-form').elements[key].value=value;wizardPractice=d.practice===true;wizardDirty=true;wizard(0);notice('Recovered setup text. Review all steps and confirm before creating anything.');return;}
 const project=projectList.find(p=>p.folder===d.folder&&p.id===d.id);
 // A stale copy stays readable, but never becomes a fresh, silently rebased offer.
 $('recovery-text').textContent=`Unsaved offer text — ${d.id}\nBased on project revision ${d.revision}\nClient/context: ${d.client||'Unknown'}\nPeriod: ${d.period||'Unknown'}\nChange reason: ${d.reason||'Not specified'}\n\n`+Object.entries(d.fields).map(([key,value])=>key.replaceAll('_',' ')+':\n'+(value||'Unanswered')).join('\n\n');$('recovery-text').hidden=false;
 if(!project)throw Error('The original project is unavailable. Your recovery text is shown above for manual copying.');
 await show(project.ref);
 if(currentView.archived||currentView.revision!==d.revision||currentView.sha256!==d.sha256)throw Error('The project changed or was archived. Recovery text is shown above; compare it with the current project before editing.');
 const form=await api('offer-form',{ref:selected,previous:d.previous});
 if(form.fields.map(f=>f.key).sort().join(',')!==Object.keys(d.fields).sort().join(','))throw Error('The offer fields changed. Recovery text is shown above for manual review.');
 await openOffer(d.previous);
 if(editor.sha256!==d.sha256){editor=null;await show(selected);throw Error('The project changed during recovery. Your text is still available above.');}
 $('offer-client').value=d.client;$('offer-period').value=d.period;$('offer-reason').value=d.reason;
 for(const [key,value]of Object.entries(d.fields))$('field-'+key).value=value;
 dirty=true;preview=null;$('recovery-text').hidden=true;notice('Recovered unsaved text. Prepare and confirm a fresh preview before saving.');
}));
act(refresh);
