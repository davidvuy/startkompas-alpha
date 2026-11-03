#!/usr/bin/env node
import fs from 'node:fs';
import {publicError} from './cli-errors.mjs';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const routes={
  pdf:['pdf-cli.mjs','preview and save local document/report/summary PDFs'],
  templates:['template-cli.mjs','validate versioned templates or prepare a draft without saving'],
  context:['context-cli.mjs','preview selected prerequisite context; use context help'],
  workspace:['workspace-cli.mjs','show/journey/draft/add/task-state/impact/report/recovery-check/source-review; use workspace help'],
  project:['core-cli.mjs','init/create/read/retrieve/update/attach/handoff/export/restore/history and workflow commands'],
  business:['business-cli.mjs','types/prepare/read/render for versioned business drafts'],
  intake:['intake-cli.mjs','plan/answer/brief-nl/brief-en'],
  daily:['daily-cli.mjs','json/brief/details for the next milestone and actions'],
  costs:['costs-cli.mjs','calculate/brief/compare/compare-brief'],
  pilot:['pilot-cli.mjs','prepare a connected draft pilot package'],
  sources:['register-cli.mjs','validate/prepare/show source and review registers'],
  domains:['domains-cli.mjs','index/detail/prepare/screens'],
  modules:['module-cli.mjs','library/show-package/inspect-package/trial-preview/trial-prepare/trials/trial-discard and notices/detail/review'],
  run:['run-cli.mjs','check/prepare execution-ledger checkpoints'],
  legacy:['cli.mjs','create/resume for existing sk09-v1 projects']
};
const [route,...args]=process.argv.slice(2);
function help(){
  return ['Startkompas — public alpha','',
    'Usage: node src/startkompas.mjs <route> <command> [arguments]',
    '       npm run startkompas -- <route> <command> [arguments]','',
    ...Object.entries(routes).map(([name,[,description]])=>'  '+name.padEnd(10)+description),'',
    'Interactive menu: node start.mjs',
    'Check installation: doctor | Guided setup: start',
    'Readable project: overview <directory> <id> [nl|en]',
    'Compare versions: compare <directory> <id> <older> <newer> [--values]',
    'New project: project init <new-private-directory> <request.json>',
    'Resume:      project handoff <private-directory> <expected-project-id>',
    'Drafts:      business types | business read <directory> <project-id> <artifact-id>',
    'Help is read-only. Commands retain their own identity, revision and save protections.',
    'Request paths are relative to your current directory; application files are resolved internally.',
    'Use --version for the app version; --contract for the JSON integration contract. See docs/commands.md.',
    'Legacy create/resume shortcuts remain available; they do not migrate projects.',''].join('\n');
}
try{
  if(!route||route==='--help'||route==='-h'||route==='help'){
    if(args.length)throw Error('Help does not accept extra arguments');process.stdout.write(help());
  }else if(route==='--contract'){
    if(args.length)throw Error('Contract does not accept extra arguments');
    console.log(JSON.stringify({format:'startkompas-command-contract-v1',contract_version:1,app_version:JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8')).version,scope:'Existing project CLI route; other route outputs retain their documented formats',entrypoint:'node src/startkompas.mjs',project_schemas:['1.0.0','1.1.0'],legacy_schema:'sk09-v1',readable_export_formats:['startkompas-export-v1','startkompas-export-v2'],export_policy:'v2 includes historical project snapshots required by imported feedback; otherwise v1',paths:'Request paths resolve from caller working directory; application helpers resolve from entrypoint',identity:'Supply expected project ID; names and folder labels do not establish identity',workflow:{schema:'schemas/workflow-contract-v1.schema.json',definitions:['plan_request','plan_result','reuse_request','reuse_result','impact_request','impact_result'],scope:'Declared dependencies and intents only; impact returns an unsaved update proposal'},restoration:{schema:'schemas/snapshot-restoration-v1.schema.json',definitions:['preview_request','restore_request','review','receipt'],preview:'project snapshot-restore-preview <directory> <request.json>',save:'project snapshot-reinstate <directory> <request.json> --confirmed',meaning:'Historical state becomes a new explained revision; prior snapshot, physical files and operation receipts remain. Review archive/practice state and blockers before confirming.',retry:'Repeat the exact saved request and operation ID. Do not rewrite hashes or expected revision to bypass a conflict.'},retrieval:{request_schema:'schemas/retrieval-request-v1.schema.json',result_schema:'schemas/retrieval-result-v1.schema.json',command:'project retrieve <directory> <request.json>',pagination:'Keep project identity, source_revision, query and filters fixed across pages; restart on revision change',meaning:'Literal record search; no attachment-content or external-source search'},initialization:{request_schema:'schemas/project-init-v1.schema.json',command:'project init <new-directory> <request.json>',result_schema:'schemas/project-read-v1.schema.json',retry:'Initialization refuses an existing destination; inspect it before choosing a new path',meaning:'Practice is a label, not anonymization; customer and outcome remain unknown assumptions'},updates:{request_file:'UTF-8 JSON',schema:'schemas/update-request-v1.schema.json',validate_command:'project validate-update <request.json>',validation_scope:'Shape only; target-specific semantic checks remain mandatory at application',required:['project_id','expected_revision','operation_id','changes'],retry:'Retry an uncertain write with the identical saved request and operation ID; changed payloads are refused',conflict:'Reread before preparing a new request; do not replace expected_revision blindly'},output:{project_success:'One JSON value on stdout',project_read_schema:'schemas/project-read-v1.schema.json',project_history_schema:'schemas/project-history-v1.schema.json',project_export_schema:'schemas/project-export-v1.schema.json',project_restore_schema:'schemas/project-restore-v1.schema.json',project_handoff_schema:'schemas/project-handoff-v1.schema.json',project_receipts_schema:'schemas/project-receipts-v1.schema.json',project_upgrade_schema:'schemas/project-upgrade-v1.schema.json',write_receipt_schema:'schemas/write-receipt-v1.schema.json',handled_error_schema:'schemas/cli-error-v1.schema.json',failure:'Nonzero exit; JSON error on stderr for handled failures; interruption may have a different shape',error_text:'Human-readable error text is not a stable integration discriminator',write_conflict_codes:['REVISION_CONFLICT','PROJECT_MISMATCH','OPERATION_CONFLICT']},compatibility:'Reject unknown contract/schema/export versions. No implicit downgrade or migration. Raw dossier edits bypass this contract.',documentation:['docs/project-command-contract-coverage.md','docs/commands.md','docs/core-route.md','docs/workflow-route.md']},null,2));
  }else if(route==='--version'){
    if(args.length)throw Error('Version does not accept extra arguments');
    console.log(JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8')).version);
  }else{
    // Fixed route allowlist; arguments never become shell code or module paths.
    const welcome=['doctor','start','overview','compare'].includes(route);
    const legacy=['create','resume'].includes(route),entry=welcome?['welcome-cli.mjs']:legacy?routes.legacy:routes[route];
    if(!entry||(!welcome&&!Object.hasOwn(routes,legacy?'legacy':route)))throw Error('Unknown route: '+route+'; use --help');
    const child=spawnSync(process.execPath,[fileURLToPath(new URL(entry[0],import.meta.url)),...((legacy||welcome)?[route,...args]:args)],{stdio:'inherit',shell:false,windowsHide:true});
    if(child.error)throw child.error;
    if(child.signal){console.error(JSON.stringify({error:'Command interrupted',signal:child.signal}));process.exitCode=1;}
    else process.exitCode=child.status??1;
  }
}catch(error){console.error(JSON.stringify(publicError(error)));process.exitCode=1;}
