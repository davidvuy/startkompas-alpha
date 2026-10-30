'use strict';
const $=id=>document.getElementById(id);
let token='',selected=null,editor=null,dirty=false,preview=null;
try{const fragment=new URLSearchParams(location.hash.slice(1));token=fragment.get('session')||sessionStorage.getItem('startkompas-session')||'';history.replaceState(null,'',location.pathname);if(token)sessionStorage.setItem('startkompas-session',token);}catch{history.replaceState(null,'',location.pathname);}
const notice=message=>{$('notice').textContent=message;};
async function api(route,value={}){
 const res=await fetch('/api/'+route,{method:'POST',headers:{'Content-Type':'application/json','X-Startkompas-Session':token},body:JSON.stringify(value),cache:'no-store'});
 const data=await res.json();if(!res.ok)throw Error(data.error||'The request failed.');return data;
}
function screen(name){for(const key of ['welcome','create','workspace','offer'])$(key).hidden=key!==name;}
function list(id,items,empty,render){const target=$(id);target.replaceChildren();if(!items.length){const li=document.createElement('li');li.className='muted';li.textContent=empty;target.append(li);}else for(const item of items){const li=document.createElement('li');render(li,item);target.append(li);}}
function detail(parent,text){const small=document.createElement('small');small.textContent=text;parent.append(small);}
function title(parent,text){const span=document.createElement('span');span.textContent=text;parent.append(span);}
const progress={open:'Open',in_progress:'In progress',done:'Done',deferred:'Deferred'};
async function show(ref){
 if(editor)throw Error('Save or discard your offer changes before switching projects.');
 const view=await api('show',{ref});selected=ref;screen('workspace');$('project-name').textContent=view.name;
 $('project-meta').textContent=`${view.project_id} · Revision ${view.revision} · Folder: ${view.folder}`;
 const action=view.actions.find(a=>a.id===view.next.record_id),assumption=view.assumptions.find(a=>a.id===view.next.record_id),check=view.checks.find(a=>a.id===view.next.record_id);
 $('next-title').textContent=action?.title||assumption?.text||check?.title||(view.next.kind==='review'?'Review changed assumptions':'Prepare your first offer');
 $('next-reason').textContent=({task:'This is the first available saved task, with your active task first.',assumption:'This assumption has the most recorded dependencies.',check:'This recorded check is unresolved.',review:'Assumptions have changed or attachments are damaged. Review them before reuse.',draft:'No next task has been recorded. You can prepare an offer or interview.'})[view.next.kind]||'Review the saved records.';
 list('tasks',view.actions,'No open tasks yet.',(li,a)=>{title(li,a.title);detail(li,(progress[a.progress]||a.progress)+(a.blocked_by.length?' · Waiting for '+a.blocked_by.length+' prerequisites':''));});
 list('assumptions',view.assumptions,'No assumptions recorded yet.',(li,a)=>{title(li,a.text);detail(li,'To investigate · '+a.dependent_count+' dependencies');});
 list('drafts',view.drafts,'No drafts saved yet.',(li,a)=>{title(li,({offer:'Offer',interview:'Interview guide',pricing:'Pricing assumption',pilot:'Pilot',alternatives:'Alternatives'})[a.kind]||'Document');detail(li,'Version '+(a.version??'?')+' · '+(a.status==='draft'?'Draft':a.status==='review_required'?'Review required':'Unavailable')+(a.historical?' · Historical version':''));if(a.kind==='offer'&&!a.historical&&a.status!=='unavailable_or_invalid'){const button=document.createElement('button');button.type='button';button.className='quiet';button.textContent='Revise this offer';button.addEventListener('click',()=>act(()=>openOffer(a.id)));li.append(button);}});
 list('reviews',[...view.blockers,...view.checks],'No recorded review flags. This is not substantive approval.',(li,a)=>{title(li,a.title||a.id);detail(li,'Review the basis before reuse.');});
 for(const button of $('projects').querySelectorAll('button'))button.setAttribute('aria-current',String(button.dataset.ref===ref));
 $('project-name').focus();
}
async function refresh(){
 const data=await api('projects');$('root').textContent=data.root;$('location').textContent='Projects folder: '+data.root;$('empty').hidden=data.projects.length>0;
 $('projects').replaceChildren();for(const project of data.projects){const button=document.createElement('button');button.type='button';button.dataset.ref=project.ref;button.setAttribute('aria-current',String(project.ref===selected));title(button,project.name);detail(button,'ID: '+project.id+' · Folder: '+project.folder+' · v'+project.revision);detail(button,'Modified: '+new Date(project.updated).toLocaleString('en-GB'));button.addEventListener('click',()=>act(()=>show(project.ref)));$('projects').append(button);}
 if(selected&&!data.projects.some(p=>p.ref===selected)){selected=null;screen('welcome');notice('The selected project is no longer at the same location. Select it again, or restore the folder and refresh. Nothing has been overwritten.');}
 if(data.unavailable.length)notice('Not opened: '+data.unavailable.join(', ')+'. These projects are unreadable or invalid; nothing has been overwritten.');
 return data;
}
let busy=false;
async function act(fn){if(busy)return;busy=true;notice('');document.querySelectorAll('button').forEach(b=>b.disabled=true);try{await fn();}catch(error){notice(error.message==='Failed to fetch'?'The workspace is unreachable. Check that the terminal is still open.':error.message);}finally{busy=false;document.querySelectorAll('button').forEach(b=>b.disabled=false);}}
function createScreen(){notice('');screen('create');$('create-form').elements.name.focus();}
$('new').addEventListener('click',createScreen);$('new-other').addEventListener('click',createScreen);
$('cancel').addEventListener('click',()=>{screen('welcome');$('new').focus();});
$('refresh').addEventListener('click',()=>act(async()=>{await refresh();if(selected)await show(selected);}));
$('create-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;act(async()=>{const data=await api('create',{name:form.elements.name.value,id:form.elements.id.value,task:form.elements.task.value,confirmed:form.elements.confirmed.checked});form.reset();await refresh();await show(data.ref);notice('Project saved. You can open this same project through the skill or CLI.');});});
async function openOffer(previous=null){
 const data=await api('offer-form',{ref:selected,previous});editor={...data,ref:selected};dirty=false;preview=null;
 $('offer-fields').replaceChildren();$('offer-preview').hidden=true;$('offer-confirm').checked=false;
 $('offer-client').value=data.client;$('offer-period').value=data.period;$('offer-reason').value='';
 $('offer-client').readOnly=previous!==null;$('offer-period').readOnly=previous!==null;
 $('offer-reason-label').hidden=previous===null;$('offer-reason').required=previous!==null;
 for(const field of data.fields){const label=document.createElement('label');label.textContent=field.label;const input=document.createElement('textarea');input.id='field-'+field.key;input.name=field.key;input.maxLength=4000;input.value=field.value;input.placeholder='Not sure yet? Leave this blank.';label.append(input);$('offer-fields').append(label);}
 screen('offer');$('offer-title').focus();
}
$('new-offer').addEventListener('click',()=>act(()=>openOffer()));
$('offer-form').addEventListener('input',()=>{dirty=true;preview=null;$('offer-preview').hidden=true;$('offer-confirm').checked=false;});
$('offer-form').addEventListener('submit',event=>{event.preventDefault();act(async()=>{
 const result=await api('offer-preview',{ref:editor.ref,previous:editor.previous,revision:editor.revision,sha256:editor.sha256,client:$('offer-client').value,period:$('offer-period').value,reason:$('offer-reason').value,fields:Object.fromEntries(editor.fields.map(f=>[f.key,$('field-'+f.key).value]))});
 preview=result.preview;$('offer-markdown').textContent=result.markdown;$('offer-confirm').checked=false;$('offer-preview').hidden=false;$('offer-preview').scrollIntoView({block:'start'});
});});
$('offer-save').addEventListener('click',()=>act(async()=>{
 if(!preview||!$('offer-confirm').checked)throw Error('Review and confirm the displayed preview before saving.');
 const result=await api('offer-save',{ref:editor.ref,preview,confirmed:true});editor=null;dirty=false;preview=null;
 await refresh();await show(selected);notice('Offer saved as project revision '+result.revision+'. Previous versions are preserved.');
}));
$('offer-cancel').addEventListener('click',()=>act(async()=>{editor=null;dirty=false;preview=null;await show(selected);}));
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
act(refresh);
