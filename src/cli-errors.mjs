// CLI failures must not echo malformed private JSON or operating-system paths.
export function publicError(error){
 const m=String(error?.message??'');
 if(error instanceof SyntaxError)return {code:'INVALID_JSON',error:'Invalid JSON input; check commas, quotes and brackets. File contents are omitted.'};
 const files={ENOENT:'File or parent folder not found; check the supplied path.',EACCES:'Access denied; choose a folder you can read and write.',EPERM:'Operation not permitted; check file access.',EEXIST:'Destination exists; choose a new folder. Nothing was overwritten.'};
 if(files[error?.code])return {code:error.code,error:files[error.code]};
 if(/Cannot find package|Cannot find module/.test(m))return {code:'DEPENDENCY_MISSING',error:'Application dependencies are missing. Run npm ci --ignore-scripts --no-audit --no-fund in the application folder.'};
 if(/revision conflict/i.test(m))return {code:'REVISION_CONFLICT',error:'Project changed. Read it again before preparing an update; retry an uncertain write only with its original saved request.'};
 if(/identity mismatch/i.test(m))return {code:'PROJECT_MISMATCH',error:'Project identity mismatch. Check the project ID and directory; no automatic switch was made.'};
 return {code:'COMMAND_FAILED',error:m.replace(/[\x00-\x1f\x7f-\x9f]/g,' ').slice(0,1000)||'Command failed; check the command guide.'};
}
