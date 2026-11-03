import {sha} from './store.mjs';

const checks=[
 {id:'names',label:'Names and private context',instruction:'Read every selected section for personal names, client names, identifiers and confidential context. Automatic checks do not recognize all names or sensitive information.'},
 {id:'contact',label:'Contact details',instruction:'Check email addresses, phone numbers, postal addresses and links. Decide whether each belongs in this specific copy; pattern matches may be wrong or incomplete.'},
 {id:'comments',label:'Comments and internal notes',instruction:'Inspect comments, placeholders, internal instructions and material intended only for your own revision. Markdown source can contain text that a viewer hides.'},
 {id:'status',label:'Draft status and scope',instruction:'Confirm the copy clearly remains a draft where appropriate. Check historical versions, unverified claims, omitted limits and attachment exclusions before sharing.'}
];
export function sharingReview(markdown){
 if(typeof markdown!=='string')throw Error('Review requires exact export text');
 const limit=250000,maxFindings=50,source=markdown.slice(0,limit),lines=source.split(/\r\n|\r|\n/),findings=[];let omitted=false;
 const rules=[
  ['email','Possible email address',/[A-Z0-9._%+-]{1,64}@[A-Z0-9.-]{1,253}\.[A-Z]{2,24}/ig],
  ['phone','Possible phone number',/(?<![\w])\+?\d[\d ()-]{5,24}\d(?![\w])/g],
  ['comment','Comment marker',/<!--|-->/g],
  ['internal','Possible internal note',/\b(?:TODO|FIXME|internal only|do not share|private note|niet delen|interne notitie)\b/ig]
 ];
 for(let index=0;index<lines.length;index++){
  // Undo display escaping only for detection; the original export is never rewritten.
  const line=lines[index].replace(/\\([\\`*_{}\[\]()#+.!|<>-])/g,'$1');
  for(const [kind,label,pattern] of rules){pattern.lastIndex=0;let match;while((match=pattern.exec(line))){
   if(kind==='phone'&&match[0].replace(/\D/g,'').length<7)continue;
   if(findings.length===maxFindings){omitted=true;break;}
   const start=Math.max(0,match.index-40),end=Math.min(line.length,match.index+match[0].length+40);
   findings.push({kind,label,line:index+1,excerpt:(start?'…':'')+line.slice(start,end)+(end<line.length?'…':'')});
  }}
  if(omitted)break;
 }
 return {format:'startkompas-sharing-review-v1',source_sha256:sha(markdown),findings,truncated:markdown.length>limit||omitted,scanned_characters:source.length,total_characters:markdown.length,checks:structuredClone(checks),notice:'Review aid only. No matches does not mean safe to share. Names, addresses, secrets and hidden information can be missed; false positives are possible. Nothing is redacted, approved or sent.',scope:'Only this exact selected export text is inspected. Attached files, omitted fields, external links and document history are not scanned.'};
}
