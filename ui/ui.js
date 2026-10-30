'use strict';
const $=id=>document.getElementById(id);
let token='',selected=null,editor=null,dirty=false,preview=null,currentView=null,reportState=null,wizardStep=0,wizardDirty=false,wizardPractice=false;
try{const fragment=new URLSearchParams(location.hash.slice(1));token=fragment.get('session')||sessionStorage.getItem('startkompas-session')||'';history.replaceState(null,'',location.pathname);if(token)sessionStorage.setItem('startkompas-session',token);}catch{history.replaceState(null,'',location.pathname);}
const notice=message=>{$('notice').textContent=message;if(!message)$('error-actions').hidden=true;};
async function api(route,value={}){
 const res=await fetch('/api/'+route,{method:'POST',headers:{'Content-Type':'application/json','X-Startkompas-Session':token},body:JSON.stringify(value),cache:'no-store'});
 const data=await res.json();if(!res.ok){const error=Error(data.error||'The request failed.');error.status=res.status;error.route=route;throw error;}return data;
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
 const recent=view.resume?.last_event,latest=view.resume?.latest_draft;
 $('resume-event').textContent=recent?'Last recorded event: '+recent.description+' ('+recent.at+')':'No event recorded yet. Project history still shows saved revisions.';
 $('resume-draft').textContent=latest?'Most recently recorded draft: '+(latest.kind||'Unknown type')+' · version '+(latest.version??'?')+' · '+(latest.status==='review_required'?'Review required':latest.status==='draft'?'Draft — unvalidated':'Unavailable; inspect the original files'):'No saved draft yet. Start an offer when you are ready.';
 $('resume-draft-open').hidden=!latest||latest.status==='unavailable_or_invalid';
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
async function act(fn){if(busy)return;busy=true;$('main').setAttribute('aria-busy','true');notice('');const controls=[...document.querySelectorAll('button,input,textarea,select')].map(element=>({element,disabled:element.disabled}));controls.forEach(c=>c.element.disabled=true);try{await fn();}catch(error){notice(error.message==='Failed to fetch'?'The workspace is unreachable. Check that the terminal is still open.':error.message);showErrorActions(error);$('notice').scrollIntoView({block:'nearest'});$('notice').focus();}finally{busy=false;$('main').setAttribute('aria-busy','false');controls.forEach(c=>c.element.disabled=c.disabled);}}
function showErrorActions(error){
 $('error-actions').hidden=false;$('error-form').hidden=!editor&&!wizardDirty;
 $('error-compare').hidden=!(editor&&error.status===409&&error.route?.startsWith('offer-'));
 $('error-guidance').textContent=error.status===403?'Reopen the current launch link from your terminal. Keep this tab open to copy your unsaved text; a new server session will not save it for you.':error instanceof TypeError?'The local server may be stopped. Keep this tab open; you can return to your form and copy the text. Start the workspace with the same projects folder, then use its new launch link.':'Your form text remains in this tab. Refreshing the list only discovers projects; it does not save or reload your form. If a file is missing or damaged, restore it from your own backup before retrying. Nothing will be repaired automatically.';
}
function returnToForm(){if(editor){screen('offer');$('offer-title').focus();}else if(wizardDirty){screen('create');wizard(wizardStep);}else $('refresh').focus();}
$('error-form').addEventListener('click',returnToForm);
$('error-compare').addEventListener('click',()=>$('offer-compare').click());
$('error-refresh').addEventListener('click',()=>act(async()=>{await refresh();notice('Project list refreshed. Your current form text is retained.');if(editor||wizardDirty)returnToForm();else $('refresh').focus();}));
$('error-recovery').addEventListener('click',()=>{$('disk-options').open=true;$('disk-options-title').focus();});
$('error-dismiss').addEventListener('click',()=>{$('error-actions').hidden=true;returnToForm();});
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
$('resume-draft-open').addEventListener('click',()=>act(async()=>{const latest=currentView?.resume?.latest_draft;if(latest)await inspectDraft(latest.id);}));
const offerHelp={
 segment:'Describe a specific customer and situation. Fictional example: a small design studio preparing a client handover.',
 job:'Describe the job they need to finish and the difficulty you suspect. Separate your guess from what someone actually reported.',
 outcome:'Describe an observable result you propose. Fictional example: one handover checklist with named owners. Avoid unsupported guarantees.',
 delivery:'Explain what you would deliver, in what format and within which boundaries. Leave unknown effort or timing blank.',
 exclusions:'State what is outside this offer. Fictional example: no implementation or ongoing support included.',
 workaround:'Describe what the customer currently does, if known. Do not invent an alternative or assume they do nothing.',
 support:'Summarize both supporting and contradicting indications, with private source references when available. This field does not create verified evidence.',
 next_check:'Choose a small check that could change your decision. State what you would observe and how it would affect your next step.'
};
async function openOffer(previous=null){
 const data=await api('offer-form',{ref:selected,previous});editor={...data,ref:selected};dirty=false;preview=null;
 $('offer-fields').replaceChildren();$('offer-conflict').hidden=true;$('offer-preview').hidden=true;$('offer-confirm').checked=false;
 $('offer-client').value=data.client;$('offer-period').value=data.period;$('offer-reason').value='';
 $('offer-client').readOnly=previous!==null;$('offer-period').readOnly=previous!==null;
 $('offer-reason-label').hidden=previous===null;$('offer-reason').required=previous!==null;
 for(const field of data.fields){const label=document.createElement('label');label.textContent=field.label;const input=document.createElement('textarea');input.id='field-'+field.key;input.name=field.key;input.maxLength=4000;input.value=field.value;input.placeholder='Not sure yet? Leave this blank.';const help=document.createElement('small');help.id='help-'+field.key;help.textContent=offerHelp[field.key]||'Leave unknown information blank.';input.setAttribute('aria-describedby',help.id);label.append(input,help);$('offer-fields').append(label);}
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
let inspectedTask=null;
function inspection(titleText,status,body){inspectedTask=null;$('task-form').hidden=true;screen('inspect');$('inspect-title').textContent=titleText;$('inspect-status').textContent=status;$('inspect-text').textContent=body;$('inspect-title').focus();}
async function inspectDraft(id){
 const data=await api('draft',{ref:selected,id});inspection('Saved '+data.kind+' · Version '+data.version,(data.historical?'Historical version. ':'')+(data.requires_review?'Basis changed — review before reuse. ':'')+'Read-only; this is a draft, not validation.',data.markdown);
 list('inspect-basis',data.basis_ids,'No basis records linked.',(li,key)=>recordLink(li,key,key));
 if(data.kind==='offer'&&data.historical&&!currentView.archived){const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent='Use this historical offer as a new revision';button.addEventListener('click',()=>act(()=>restoreOffer(data.id)));li.append(button);$('inspect-basis').append(li);}
 list('inspect-dependents',data.successors,'No newer version recorded.',(li,key)=>{const b=document.createElement('button');b.type='button';b.textContent='Read newer version';b.addEventListener('click',()=>act(()=>inspectDraft(key)));li.append(b);});
}
async function restoreOffer(id){
 const restored=await api('offer-restore',{ref:selected,id});await openOffer(restored.latest.previous);
 if(editor.sha256!==restored.latest.sha256){editor=null;await show(selected);throw Error('The project changed. Open the historical offer again.');}
 for(const field of editor.fields)$('field-'+field.key).value=restored.fields[field.key]??'';
 $('offer-reason').value='';dirty=true;preview=null;keepDraft();notice('Version '+restored.source_version+' loaded as proposed text for a new revision. Explain why, then review a fresh preview and confirm. No project files have changed.');
}
async function inspectRecord(id){
 const data=await api('record',{ref:selected,id}),r=data.record;
 inspection(r.title||r.text||r.id,'Revision '+data.revision+' · '+r.group+(r.requires_review?' · Review required':'')+(data.truncated?' · First 100 links shown':''),Object.entries(r).filter(([k])=>!['group','requires_review'].includes(k)).map(([k,v])=>k.replaceAll('_',' ')+': '+(typeof v==='string'?v:JSON.stringify(v,null,2))).join('\n\n'));
 if(r.group==='tasks'&&!data.archived){inspectedTask={ref:selected,id:r.id,revision:data.revision,sha256:data.sha256};$('task-form').reset();$('task-form').hidden=false;$('task-current').textContent='Current progress: '+(progress[r.progress]||r.progress)+(data.active_task_id===r.id?' · Your active task':'');}
 list('inspect-basis',data.prerequisites,'No prerequisites recorded.',(li,item)=>{recordLink(li,item.id,item.title);detail(li,item.reason);});
 list('inspect-dependents',data.dependents,'No dependents recorded.',(li,item)=>recordLink(li,item.id,item.title));
 if(r.group==='artifacts'&&currentView.drafts.some(d=>d.id===r.id)){const b=document.createElement('button');b.type='button';b.textContent='Read saved draft';b.addEventListener('click',()=>act(()=>inspectDraft(r.id)));$('inspect-basis').append(b);}
}
let searchState=null;
async function searchRecords(offset){const result=await api(searchState.drafts?'draft-search':'search',{ref:selected,revision:searchState.revision,query:searchState.query,offset});searchState.next=result.next_offset;$('search-count').textContent=result.total_matches+' matching records · '+result.returned+' shown from '+(offset+1)+(result.partial?' · PARTIAL: some documents could not be searched.':'')+(searchState.drafts?' · '+result.scanned+' of '+result.total_candidates+' drafts checked':'');list('search-results',result.records,'No matches in saved records.',(li,r)=>{if(r.group==='drafts'){const b=document.createElement('button');b.type='button';b.className='quiet';b.textContent=r.title;b.addEventListener('click',()=>act(()=>inspectDraft(r.id)));li.append(b);}else recordLink(li,r.id,r.title||r.text||r.description||r.id);detail(li,r.group+' · '+r.id+(r.requires_review?' · Review required':''));if(r.snippet)detail(li,r.snippet);});$('search-more').hidden=result.next_offset===null;$('search-count').focus();}
$('open-search').addEventListener('click',()=>{screen('search');$('search-results').replaceChildren();$('search-count').textContent='';$('search-more').hidden=true;$('record-query').focus();});
$('record-search-form').addEventListener('submit',event=>{event.preventDefault();act(async()=>{searchState={revision:currentView.revision,query:$('record-query').value,drafts:$('search-drafts').checked};await searchRecords(0);});});
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
$('task-form').addEventListener('input',event=>{if(event.target.id!=='task-confirm')$('task-confirm').checked=false;});
$('task-form').addEventListener('submit',event=>{event.preventDefault();act(async()=>{if(!inspectedTask||!$('task-confirm').checked)throw Error('Review and confirm this task change.');const result=await api('task-update',{...inspectedTask,action:$('task-action').value,reason:$('task-reason').value,confirmed:true});await refresh();await show(selected);notice('Task change saved in revision '+result.revision+'. Evidence and dependency status are unchanged.');});});
window.addEventListener('beforeunload',event=>{if(dirty||wizardDirty){event.preventDefault();event.returnValue='';}});
function initRecovery(){
 if(recovery)return;
 try{recovery=StartkompasRecovery(sessionStorage,rootScope);$('keep-draft').checked=sessionStorage.getItem('startkompas-keep-draft')==='yes';recoveryStatus();}catch{$('recovery-status').textContent='Browser storage is unavailable. Keep this page open until you save.';}
}
function recoveryStatus(){
 const entry=recovery?.read();$('recovery-actions').hidden=!entry;
 $('recovery-status').textContent=entry?'Unsaved '+entry.kind+' copy available from '+new Date(entry.at).toLocaleString('en-GB')+'. It has not been saved to a project.':$('keep-draft').checked?'Tab recovery is on. Form changes will be kept locally.':'Tab recovery is off.';
}
function clearRecovery(){diskStatus();try{recovery?.clear();$('recovery-text').hidden=true;recoveryStatus();}catch{$('recovery-status').textContent='Could not remove the recovery copy. Clear this tab’s browser storage when finished.';}}
let diskSnapshot=null;
function currentDraft(){
 if(editor)return {kind:'offer',data:{folder:currentView.folder,id:currentView.project_id,previous:editor.previous,revision:editor.revision,sha256:editor.sha256,client:$('offer-client').value,period:$('offer-period').value,reason:$('offer-reason').value,fields:Object.fromEntries(editor.fields.map(f=>[f.key,$('field-'+f.key).value]))}};
 if(wizardDirty){const f=$('create-form').elements;return {kind:'wizard',data:{...Object.fromEntries(['name','id','task','customer','outcome'].map(k=>[k,f[k].value])),practice:wizardPractice}};}
 return null;
}
function diskStatus(){if(diskSnapshot)$('disk-status').textContent=JSON.stringify(currentDraft())===diskSnapshot?'Current form matches the last copy kept in this session. Project save still requires review.':'The current form differs from the last disk copy. Keep another copy to preserve these edits.';}
function keepDraft(){
 diskStatus();if(!$('keep-draft').checked||!recovery)return;
 try{const entry=currentDraft();if(entry)recovery.write(entry.kind,entry.data);recoveryStatus();}catch{$('recovery-status').textContent='Recovery copy could not be updated. Keep this page open and save your work.';}
}
async function listDiskCopies(){
 const result=await api('recovery-list');$('disk-location').textContent='Local folder: '+result.path;
 list('disk-copies',result.copies,'No recovery copies on disk.',(li,copy)=>{
  title(li,(copy.title||'Untitled setup')+' · '+copy.kind);detail(li,new Date(copy.created_at).toLocaleString('en-GB')+(copy.expired?' · Expired; local file retained':''));
  if(!copy.expired){const open=document.createElement('button');open.type='button';open.className='quiet';open.textContent='Recover this text';open.addEventListener('click',()=>act(async()=>{const entry=await api('recovery-read',{id:copy.id});await refresh();await recoverEntry(entry);}));li.append(open);}
  const label=document.createElement('label'),check=document.createElement('input');label.className='check';check.type='checkbox';label.append(check,document.createTextNode('Permanently forget this copy'));li.append(label);
  const forget=document.createElement('button');forget.type='button';forget.className='quiet';forget.textContent='Forget copy';forget.addEventListener('click',()=>act(async()=>{if(!check.checked)throw Error('Confirm forgetting this specific recovery copy first.');await api('recovery-forget',{id:copy.id,sha256:copy.sha256,confirmed:true});diskSnapshot=null;$('disk-status').textContent='Recovery copy forgotten. Project files were not changed.';await listDiskCopies();$('disk-list').focus();}));li.append(forget);
 });
 if(result.unavailable)notice(result.unavailable+' damaged or incomplete recovery copies could not be opened. Inspect the local folder; no files were replaced.');
}
$('disk-list').addEventListener('click',()=>act(listDiskCopies));
$('disk-save').addEventListener('click',()=>act(async()=>{
 if(!$('disk-consent').checked)throw Error('Confirm keeping this private text on disk first.');const entry=currentDraft();if(!entry)throw Error('Start a project setup or open an offer form first.');
 const result=await api('recovery-save',{...entry,confirmed:true});diskSnapshot=JSON.stringify(entry);$('disk-consent').checked=false;diskStatus();await listDiskCopies();notice('Recovery copy kept at '+new Date(result.created_at).toLocaleString('en-GB')+'. Later edits need another copy. Existing copies remain until you forget them.');
}));
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
async function recoverEntry(entry){
 if(editor||wizardDirty)throw Error('Finish or discard the current form before recovering another draft.');
 if(!entry)throw Error('No valid recovery copy remains in this tab.');
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
}
$('recover-draft').addEventListener('click',()=>act(()=>recoverEntry(recovery?.read())));
act(refresh);
