import {publicError} from './cli-errors.mjs';
import {regularFile} from './store.mjs';import {costScenario,costBrief,compareCosts,costComparisonBrief} from './costs.mjs';
const [mode,file,...extra]=process.argv.slice(2);
try{if(!['calculate','brief','compare','compare-brief'].includes(mode)||!file||extra.length)throw Error('Usage: calculate|brief|compare|compare-brief <request.json>');const input=JSON.parse(regularFile(file)),fn={calculate:costScenario,brief:costBrief,compare:compareCosts,'compare-brief':costComparisonBrief}[mode],result=fn(input);console.log(typeof result==='string'?result:JSON.stringify(result,null,2));}catch(e){console.error(JSON.stringify(publicError(e)));process.exitCode=1;}
