import fs from 'node:fs';import Ajv2020 from 'ajv/dist/2020.js';
const schema=JSON.parse(fs.readFileSync(new URL('../schemas/cost-scenario.schema.json',import.meta.url)));
const validate=new Ajv2020({strict:true,allErrors:true}).compile(schema);
export function costScenario(input){
 if(!validate(input))throw Error('Invalid cost scenario: '+validate.errors.map(e=>e.instancePath+' '+e.message).join('; '));
 const {fixed_cents:f,variable_cents_per_unit:v,price_cents_per_unit:p,units:q,budget_cents:b}=input;
 const cost=f===null||v===null||q===null?null:f+v*q,revenue=p===null||q===null?null:p*q,margin=p===null||v===null?null:p-v;
 const breakEven=f===null||margin===null?null:margin>0?Math.ceil(f/margin):f===0&&margin===0?0:null;
 return {input:structuredClone(input),calculation:{total_cost_cents:cost,revenue_cents:revenue,contribution_cents_per_unit:margin,scenario_surplus_cents:cost===null||revenue===null?null:revenue-cost,budget_difference_cents:b===null||cost===null?null:b-cost,break_even_units:breakEven,break_even_status:f===null||margin===null?'unknown':margin<0||margin===0&&f>0?'no_positive_contribution':'calculated'},limitations:['Arithmetic on supplied same-period estimates, not accounting or observed profit','No demand, willingness-to-pay, tax, legal or pilot-readiness conclusion','Excluded and unknown costs remain outside this calculation; unknown budget is not zero']};
}
export function costBrief(input){const r=costScenario(input),money=n=>n===null?'Unknown':(n/100).toFixed(2)+' EUR',c=r.calculation;return `# Cost scenario — ${input.project_id}\n\nPeriod: ${input.period}. Unit: ${input.unit}.\nSource: ${input.source_note}\n\n| Measure | Scenario |\n|---|---|\n| Quoted cost | ${money(c.total_cost_cents)} |\n| Revenue estimate | ${money(c.revenue_cents)} |\n| Arithmetic surplus | ${money(c.scenario_surplus_cents)} |\n| Budget less quoted cost | ${money(c.budget_difference_cents)} |\n| Break-even units | ${c.break_even_status==='unknown'?'Unknown (required inputs missing)':c.break_even_status==='no_positive_contribution'?'No positive contribution; no positive-volume break-even':c.break_even_units} |\n\nExcluded or unresolved: ${input.excluded_costs.join('; ')}.\n\nThis is a scenario, not observed profit, validated demand or permission to spend. Keep selling-price assumptions separate from customer commitments.\n`;}

const comparisonSchema=new Ajv2020({strict:true,allErrors:true}).compile({type:'object',additionalProperties:false,required:['language','scenarios'],properties:{language:{enum:['nl','en']},scenarios:{type:'array',minItems:2,maxItems:10,items:{type:'object',additionalProperties:false,required:['label','scenario'],properties:{label:{type:'string',minLength:1,maxLength:200,pattern:'\\S'},scenario:{type:'object'}}}}}});
export function compareCosts(input){
 if(!comparisonSchema(input))throw Error('Invalid comparison request');
 const labels=new Set(),rows=input.scenarios.map(({label,scenario})=>{if(labels.has(label))throw Error('Duplicate scenario label');labels.add(label);return {label,...costScenario(scenario)};});
 const base=rows[0];for(const row of rows.slice(1))for(const field of ['project_id','currency','period','unit'])if(row.input[field]!==base.input[field])throw Error('Incomparable '+field+'; align explicit units and period first');
 const metrics=['total_cost_cents','revenue_cents','scenario_surplus_cents','budget_difference_cents'];
 for(const row of rows)row.difference_from_first=Object.fromEntries(metrics.map(key=>[key,row.calculation[key]===null||base.calculation[key]===null?null:row.calculation[key]-base.calculation[key]]));
 return {project_id:base.input.project_id,language:input.language,period:base.input.period,unit:base.input.unit,baseline_label:base.label,rows,limitations:['Differences compare supplied scenarios, not supplier quality or purchase recommendations','Different quantities, budgets and exclusions remain visible; no hidden normalization','Unknown inputs stay unknown; no permission to spend or proof of demand']};
}
const escapeCell=s=>String(s).replace(/[\r\n\t]/g,' ').replace(/[\\`*_{}[\]()#+.!|<>]/g,c=>'\\'+c);
export function costComparisonBrief(input){
 const r=compareCosts(input),nl=r.language==='nl',unknown=nl?'Onbekend':'Unknown',money=v=>v===null?unknown:(v/100).toFixed(2)+' EUR';
 const lines=[nl?'# Kostenscenario’s vergelijken':'# Compare cost scenarios','',`${nl?'Periode':'Period'}: ${escapeCell(r.period)}. ${nl?'Eenheid':'Unit'}: ${escapeCell(r.unit)}.`,'',nl?'| Scenario | Aantal | Kosten | Omzet | Rekenkundig saldo | Budget min kosten | Kostenverschil t.o.v. eerste |':'| Scenario | Units | Cost | Revenue | Arithmetic surplus | Budget less cost | Cost difference vs first |','|---|---|---|---|---|---|---|'];
 for(const row of r.rows){const c=row.calculation;lines.push(`| ${escapeCell(row.label)} | ${row.input.units??unknown} | ${money(c.total_cost_cents)} | ${money(c.revenue_cents)} | ${money(c.scenario_surplus_cents)} | ${money(c.budget_difference_cents)} | ${money(row.difference_from_first.total_cost_cents)} |`);}
 for(const row of r.rows)lines.push('',`**${escapeCell(row.label)}**`,`${nl?'Bron':'Source'}: ${escapeCell(row.input.source_note)}`,`${nl?'Uitgesloten of onopgelost':'Excluded or unresolved'}: ${row.input.excluded_costs.map(escapeCell).join('; ')}`);
 lines.push('',nl?'Aannames, geen waargenomen winst of bewezen vraag. Aantallen, budgetten en uitsluitingen kunnen verschillen. Een lagere berekende kost is geen aankoopadvies of toestemming om te betalen.':'Assumptions, not observed profit or proven demand. Quantities, budgets and exclusions may differ. Lower calculated cost is not a purchase recommendation or permission to spend.');return lines.join('\n')+'\n';
}
