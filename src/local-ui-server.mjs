import http from 'node:http';
import fs from 'node:fs';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {localWorkspace,WorkspaceError,exactObject} from './local-workspace.mjs';

const assets=new Map([
 ['/',[new URL('../ui/index.html',import.meta.url),'text/html; charset=utf-8']],
 ['/recovery.js',[new URL('../ui/recovery.js',import.meta.url),'text/javascript; charset=utf-8']],
 ['/ui.js',[new URL('../ui/ui.js',import.meta.url),'text/javascript; charset=utf-8']],
 ['/ui.css',[new URL('../ui/ui.css',import.meta.url),'text/css; charset=utf-8']],
 ['/brand.png',[new URL('../assets/startkompas-header.png',import.meta.url),'image/png']]
]);
const headers={
 'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',
 'X-Frame-Options':'DENY','Cross-Origin-Resource-Policy':'same-origin',
 'Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
 'Permissions-Policy':'camera=(), microphone=(), geolocation=()'
};
async function body(req){
 let size=0;const chunks=[];
 for await(const chunk of req){size+=chunk.length;if(size>65536)throw new WorkspaceError('The request is too large.',413);chunks.push(chunk);}
 try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new WorkspaceError('The request does not contain valid JSON.');}
}
export async function startLocalUI({root,port=0}){
 if(!Number.isInteger(port)||port<0||port>65535)throw Error('Invalid port');
 const workspace=localWorkspace(root),token=randomBytes(32).toString('hex');let origin,host;
 const server=http.createServer({maxHeaderSize:8192,requestTimeout:10000,headersTimeout:5000},async(req,res)=>{
  const send=(status,value,type='application/json; charset=utf-8')=>{res.writeHead(status,{...headers,'Content-Type':type});res.end(type.startsWith('application/json')?JSON.stringify(value):value);};
  try{
   if(req.headers.host!==host||req.socket.remoteAddress!=='127.0.0.1')throw new WorkspaceError('This connection is not allowed.',403);
   if(req.headers.origin&&req.headers.origin!==origin)throw new WorkspaceError('This website cannot access the workspace.',403);
   const startNavigation=req.method==='GET'&&req.url==='/'&&req.headers['sec-fetch-mode']==='navigate'&&req.headers['sec-fetch-dest']==='document';
   if(!startNavigation&&req.headers['sec-fetch-site']&&!['same-origin','none'].includes(req.headers['sec-fetch-site']))throw new WorkspaceError('Open the workspace using the launch link.',403);
   if(req.method==='GET'&&assets.has(req.url)){
    const [file,type]=assets.get(req.url);return send(200,fs.readFileSync(file),type);
   }
   if(!['/api/recovery-list','/api/recovery-save','/api/recovery-read','/api/recovery-forget','/api/offer-restore','/api/draft-search','/api/task-update','/api/offer-latest','/api/diagnostics','/api/draft','/api/search','/api/record','/api/history','/api/compare','/api/projects','/api/create','/api/show','/api/offer-form','/api/offer-preview','/api/offer-save','/api/report-preview','/api/report-save','/api/archive'].includes(req.url))throw new WorkspaceError('Not found.',404);
   if(req.method!=='POST')throw new WorkspaceError('This operation requires a POST request.',405);
   const supplied=req.headers['x-startkompas-session'];
   if(req.headers.origin!==origin||typeof supplied!=='string'||! /^[a-f0-9]{64}$/.test(supplied)||!timingSafeEqual(Buffer.from(supplied),Buffer.from(token)))throw new WorkspaceError('The session is missing or expired. Reopen the link from the terminal.',403);
   if(req.headers['content-type']!=='application/json')throw new WorkspaceError('Use a JSON request.',415);
   const input=await body(req);let result;
   if(req.url==='/api/diagnostics'){
    exactObject(input,[]);const version=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8')).version;
    result={markdown:['Startkompas local workspace problem report','Application version: '+version,'Node version: '+process.versions.node,'Platform: '+process.platform,'','Steps to reproduce using fictional data: [fill in]','Expected result: [fill in]','Actual result: [fill in]','','This report contains no project names, paths, session tokens or project contents. Review your additions before sharing.'].join('\n')};
   }
   for(const [route,method] of [['recovery-list','recoveryList'],['recovery-save','recoverySave'],['recovery-read','recoveryRead'],['recovery-forget','recoveryForget']])if(req.url==='/api/'+route)result=workspace[method](input);
   if(req.url==='/api/projects'){exactObject(input,[]);result=workspace.list();}
   if(req.url==='/api/draft')result=workspace.draft(input);
   if(req.url==='/api/draft-search')result=workspace.draftSearch(input);
   if(req.url==='/api/search')result=workspace.search(input);
   if(req.url==='/api/record')result=workspace.record(input);
   if(req.url==='/api/history')result=workspace.history(input);
   if(req.url==='/api/compare')result=workspace.compare(input);
   if(req.url==='/api/create')result=workspace.create(input);
   if(req.url==='/api/show'){exactObject(input,['ref']);result=workspace.show(input.ref);}
   if(req.url==='/api/task-update')result=workspace.taskUpdate(input);
   if(req.url==='/api/offer-form')result=workspace.offerForm(input);
   if(req.url==='/api/offer-restore')result=workspace.offerRestore(input);
   if(req.url==='/api/offer-latest')result=workspace.offerLatest(input);
   if(req.url==='/api/offer-preview')result=workspace.offerPreview(input);
   if(req.url==='/api/offer-save')result=workspace.offerSave(input);
   if(req.url==='/api/report-preview')result=workspace.reportPreview(input);
   if(req.url==='/api/report-save')result=workspace.reportSave(input);
   if(req.url==='/api/archive')result=workspace.archive(input);
   send(200,result);
  }catch(error){
   if(!res.destroyed&&!res.headersSent)send(error instanceof WorkspaceError?error.status:500,{error:error instanceof WorkspaceError?error.message:'The local data could not be processed. Check your project folder and try again. No files were automatically replaced.'});
  }
 });
 server.maxConnections=32;server.maxRequestsPerSocket=100;server.keepAliveTimeout=2000;
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
 host='127.0.0.1:'+server.address().port;origin='http://'+host;
 return {server,origin,token,url:origin+'/#session='+token,close:()=>new Promise((resolve,reject)=>{server.close(error=>error?reject(error):resolve());server.closeAllConnections();})};
}
