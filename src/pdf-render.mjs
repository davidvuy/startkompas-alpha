import {PDFDocument} from 'pdfkit';
import {create} from 'fontkit';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {regularFile,sha} from './store.mjs';

const fontRoot=fileURLToPath(new URL('../assets/fonts/',import.meta.url));
const plain=s=>s.replace(/\\([\\`*_{}[\]()#+.!|<>-])/g,'$1').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1 ($2)');
const cells=s=>s.trim().replace(/^\|/,'').replace(/\|$/,'').split(/(?<!\\)\|/).map(v=>plain(v.trim()));
const separator=s=>/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(s);

// Local text only: no HTML execution, remote images, links, scripts or attachments.
export async function renderPdf(markdown,{fontDirectory=fontRoot}={}){
 if(typeof markdown!=='string'||!markdown.trim()||Buffer.byteLength(markdown)>250000)throw Error('PDF input must contain text and stay within 250000 bytes');
 let fonts=null;const warnings=[];
 try{const regular=regularFile(path.join(fontDirectory,'NotoSans-Regular.ttf'),2000000),bold=regularFile(path.join(fontDirectory,'NotoSans-Bold.ttf'),2000000);fonts={regular,bold,coverage:[create(regular),create(bold)]};}catch{warnings.push('Bundled fonts unavailable. Standard fonts are used; non-ASCII characters are written as Unicode codes.');}
 const missing=new Set();
 function readable(text){return [...text].map(c=>{const cp=c.codePointAt(0);if(c==='\t')return '    ';if(c==='\n')return c;if(cp>=32&&cp!==127&&(fonts?fonts.coverage.every(f=>f.hasGlyphForCodePoint(cp)):cp<=126))return c;const label='U+'+cp.toString(16).toUpperCase().padStart(4,'0');missing.add(label);return '['+label+']';}).join('');}
 const source=readable(markdown.replace(/\r\n?/g,'\n'));if(missing.size)warnings.push('Unsupported characters are shown by Unicode code: '+[...missing].join(', ')+'. The original text remains in the project.');
 const doc=new PDFDocument({size:'A4',margins:{top:58,bottom:58,left:48,right:48},bufferPages:true,autoFirstPage:true,info:{Title:'Startkompas local snapshot',Author:'',Creator:'Startkompas',Producer:'Startkompas / PDFKit',CreationDate:new Date('2000-01-01T00:00:00Z'),ModDate:new Date('2000-01-01T00:00:00Z')}});
 const chunks=[];let size=0;const completed=new Promise((resolve,reject)=>{doc.on('data',b=>{size+=b.length;if(size>20000000){doc.destroy(Error('PDF exceeds 20 MB'));return;}chunks.push(b);});doc.on('error',reject);doc.on('end',()=>resolve(Buffer.concat(chunks)));});
 if(fonts){doc.registerFont('Body',fonts.regular);doc.registerFont('Heading',fonts.bold);}const body=fonts?'Body':'Helvetica',heading=fonts?'Heading':'Helvetica-Bold';
 const width=doc.page.width-96,bottom=doc.page.height-58;let y=58,pages=1;
 function page(){if(pages>=200)throw Error('PDF exceeds 200 pages');doc.addPage();pages++;y=58;}
 function room(height){if(y+height>bottom)page();}
 function wrap(text,width,font=body,size=10){doc.font(font).fontSize(size);const lines=[];for(const paragraph of text.split('\n')){let current='';for(const token of paragraph.match(/\S+\s*|\s+/g)??['']){if(doc.widthOfString(current+token)<=width){current+=token;continue;}if(current.trim()){lines.push(current.trimEnd());current='';}for(const c of token){if(current&&doc.widthOfString(current+c)>width){lines.push(current);current='';}current+=c;}}lines.push(current.trimEnd());}return lines;}
 function line(text,{font=body,size=10,color='#242735',indent=0}={}){const height=size*1.5;room(height);doc.font(font).fontSize(size).fillColor(color).text(text,48+indent,y,{width:width-indent,lineBreak:false});y+=height;}
 function paragraph(text,options={}){for(const row of wrap(text,width-(options.indent??0),options.font??body,options.size??10))line(row,options);y+=5;}
 function table(rows){
  const columns=rows[0].length;if(columns<2||columns>8||rows.some(r=>r.length!==columns))throw Error('PDF tables must have 2 to 8 consistent columns');
  const cellWidth=width/columns,lineHeight=13;
  const prepared=rows.map((r,i)=>r.map(c=>wrap(c,cellWidth-12,i===0?heading:body,8.5)));
  function paint(parts,isHeader){const count=Math.max(...parts.map(p=>p.length)),height=count*lineHeight+12;doc.lineWidth(0.5);for(let c=0;c<columns;c++){const x=48+c*cellWidth;doc.rect(x,y,cellWidth,height).fillAndStroke(isHeader?'#ece7f3':'#ffffff','#c9c5d1');doc.font(isHeader?heading:body).fontSize(8.5).fillColor('#242735');parts[c].forEach((t,n)=>doc.text(t,x+6,y+6+n*lineHeight,{width:cellWidth-12,lineBreak:false}));}y+=height;}
  const headHeight=Math.max(...prepared[0].map(p=>p.length))*lineHeight+12;if(headHeight>180)throw Error('PDF table heading is too long; shorten its labels');
  room(headHeight+25);paint(prepared[0],true);
  for(const row of prepared.slice(1)){let offset=0;const total=Math.max(...row.map(p=>p.length));const whole=total*lineHeight+12;if(whole<=bottom-58-headHeight&&y+whole>bottom){page();paint(prepared[0],true);}while(offset<total){let available=Math.floor((bottom-y-12)/lineHeight);if(available<1){page();paint(prepared[0],true);available=Math.floor((bottom-y-12)/lineHeight);}const count=Math.min(available,total-offset);paint(row.map((p,c)=>offset>0&&c===0&&p.length<=offset?wrap(p.join(' ')+' (continued)',cellWidth-12,body,8.5).slice(0,count):p.slice(offset,offset+count)),false);offset+=count;}}
  y+=12;
 }
 try{
  if(warnings.length){paragraph('Rendering notice',{font:heading,size:12,color:'#623379'});for(const warning of warnings)paragraph(warning);}
  const lines=source.replace(/\r\n?/g,'\n').split('\n');
  for(let i=0;i<lines.length;i++){
   const raw=lines[i];if(!raw.trim()){y+=5;continue;}
   if(i+1<lines.length&&separator(lines[i+1])){const rows=[cells(raw)];i+=2;while(i<lines.length&&lines[i].trim().includes('|')&&lines[i].trim()){rows.push(cells(lines[i]));i++;}i--;table(rows);continue;}
   const h=raw.match(/^(#{1,6})\s+(.*)$/);if(h){const size=h[1].length===1?21:h[1].length===2?14:11;room(size*1.5+35);y+=8;paragraph(plain(h[2]),{font:heading,size,color:'#59246d'});continue;}
   paragraph(plain(raw));
  }
  const range=doc.bufferedPageRange();for(let n=0;n<range.count;n++){doc.switchToPage(n);doc.font(body).fontSize(8).fillColor('#64616c').text('STARTKOMPAS  |  Local snapshot',48,28,{lineBreak:false});doc.text('Not automatically updated or sent',48,doc.page.height-35,{lineBreak:false});doc.text('Page '+(n+1)+' / '+range.count,doc.page.width-130,doc.page.height-35,{lineBreak:false});}
  doc.end();const bytes=await completed;return {bytes,pages:range.count,warnings,sha256:sha(bytes)};
 }catch(error){doc.destroy(error);await completed.catch(()=>{});throw error;}
}
