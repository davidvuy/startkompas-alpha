const form=document.getElementById('feedback-form'),output=document.getElementById('response'),panel=document.getElementById('response-panel'),notice=document.getElementById('status'),confirm=document.getElementById('confirm'),download=document.getElementById('download');
let prepared=null,dirty=false;
function invalidate(){prepared=null;panel.hidden=true;confirm.checked=false;dirty=true;notice.textContent='Edits are not saved. Build and review a new response.';}
form.addEventListener('input',invalidate);
form.addEventListener('submit',event=>{event.preventDefault();try{
 const alias=document.getElementById('alias').value.trim();if(!alias)throw Error('Enter the alias you want to put on your response.');
 const comments=[];for(const input of form.querySelectorAll('textarea[data-index]')){const comment=input.value.trim();if(!comment)continue;const target=targets[Number(input.dataset.index)];comments.push({...target,comment});}
 if(!comments.length||comments.length>20)throw Error('Write between one and twenty comments; leave the other fields empty.');
 prepared=JSON.stringify({format:'startkompas-review-feedback-v1',package_id:identity.package_id,project_id:identity.project_id,project_revision:identity.project_revision,reviewer_alias:alias,comments},null,2)+'\n';
 if(new TextEncoder().encode(prepared).length>100000)throw Error('Response exceeds 100000 bytes. Shorten the comments.');
 output.value=prepared;panel.hidden=false;confirm.checked=false;notice.textContent='Read the exact response below. Nothing has been sent or saved.';output.focus();
 }catch(error){prepared=null;panel.hidden=true;notice.textContent=error.message;}});
download.addEventListener('click',()=>{if(!prepared||!confirm.checked){notice.textContent='Review and confirm this exact response first.';return;}const blob=new Blob([prepared],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download='startkompas-feedback.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notice.textContent='Download requested. Check the saved file before sharing it with the owner. Nothing was transmitted.';});
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});

// Portable local drafts also work when browser storage is unavailable for file URLs.
const draftLimit=500000;
let draftRead=0;
function draftFingerprint(){return JSON.stringify([document.getElementById('alias').value,draftInputs().map(input=>input.value)]);}
function draftInputs(){return [...form.querySelectorAll('textarea[data-index]')];}
function readDraftText(text){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>draftLimit)throw Error('Draft exceeds 500000 bytes.');
 let draft;try{draft=JSON.parse(text);}catch{throw Error('Choose a valid Startkompas review draft JSON file.');}
 const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join(',')===keys.split(',').sort().join(',');
 if(!exact(draft,'format,identity,targets,alias,comments')||draft.format!=='startkompas-mentor-draft-v1'||!exact(draft.identity,'package_id,project_id,project_revision')||Object.keys(identity).some(key=>draft.identity[key]!==identity[key]))throw Error('This draft belongs to a different review package. No fields were replaced.');
 if(!Array.isArray(draft.targets)||draft.targets.length!==targets.length||draft.targets.some((target,i)=>!exact(target,'document_id,document_version,key')||Object.keys(targets[i]).some(key=>target[key]!==targets[i][key])))throw Error('The original review sections do not match. No fields were replaced.');
 if(typeof draft.alias!=='string'||draft.alias.length>100||!Array.isArray(draft.comments)||draft.comments.length!==targets.length||draft.comments.some(comment=>typeof comment!=='string'||comment.length>4000))throw Error('Invalid review draft fields. No fields were replaced.');
 const inputs=draftInputs();if(inputs.length!==targets.length)throw Error('Review fields are unavailable. Reload the original page.');
 document.getElementById('alias').value=draft.alias;for(const input of inputs)input.value=draft.comments[Number(input.dataset.index)];
 invalidate();output.value='';notice.textContent='Draft restored for this exact review package. Build and review a fresh response before downloading feedback. Nothing was sent.';
}
document.getElementById('draft-download').addEventListener('click',()=>{try{
 const comments=Array(targets.length).fill('');for(const input of draftInputs())comments[Number(input.dataset.index)]=input.value;
 const text=JSON.stringify({format:'startkompas-mentor-draft-v1',identity,targets,alias:document.getElementById('alias').value,comments},null,2)+'\n';
 if(new TextEncoder().encode(text).length>draftLimit)throw Error('Draft exceeds 500000 bytes. Keep a separate local copy of your text.');
 const url=URL.createObjectURL(new Blob([text],{type:'application/json;charset=utf-8'})),anchor=document.createElement('a');anchor.href=url;anchor.download='startkompas-review-draft.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 notice.textContent='Draft download requested. Check that the file was saved before closing. It contains private unfinished comments, not feedback to send. Later edits require another draft download.';
 }catch(error){notice.textContent=error.message;}});
document.getElementById('draft-file').addEventListener('change',async event=>{
 const input=event.target,file=input.files?.[0];if(!file)return;const read=++draftRead,before=draftFingerprint();
 try{if(dirty&&!document.getElementById('draft-replace').checked)throw Error('Keep your current edits first, then confirm replacing them with a draft.');if(file.size>draftLimit)throw Error('Draft exceeds 500000 bytes.');const text=await file.text();if(read!==draftRead)return;if(before!==draftFingerprint())throw Error('Your edits changed while reading the draft. No fields were replaced. Choose the draft again after keeping your edits.');readDraftText(text);}
 catch(error){notice.textContent=error.message;}finally{if(read===draftRead){input.value='';document.getElementById('draft-replace').checked=false;}}
});
