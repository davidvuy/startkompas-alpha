import {briefTypes,briefFieldHelp} from './business-brief.mjs';

// Deterministic review prompts, not a semantic verdict or quality score.
const promises={
 offer:{outcome:'Which observable result is proposed, under which conditions, and what remains outside your control?',delivery:'Are deliverables, effort and responsibilities clear enough to avoid an open-ended promise?'},
 pilot:{deliverable:'Is the proposed output consistent with the offer and the available capacity?',acceptance:'What observable check and reviewer would establish delivery acceptance, separately from demand validation?'},
 pricing:{price:'Are amount, currency, unit and included scope explicit? Has the buyer agreed, or is this still a proposal?',terms:'Which terms are still proposed, and which have actually been agreed?'},
 interview:{decision_rule:'Could contrary observations change this rule, or would it always favor the idea?'},
 alternatives:{constraints:'Are the compared options measured on the same scope and conditions?'}
};
const boundaries=new Set(['exclusions','delivery','responsibilities','period','data_limits','stop','terms','costs','constraints']);
export function documentReview(draft){
 const points=[];
 for(const f of draft.fields){
  const label=briefTypes[draft.request.kind].fields[f.key][1];
  if(f.value===null){points.push({key:f.key,label,kind:'missing',reason:boundaries.has(f.key)?'No boundary recorded for this section.':'No answer recorded for this section.',question:briefFieldHelp[draft.request.kind][f.key]});continue;}
  if(f.basis?.some(b=>b.requires_review))points.push({key:f.key,label,kind:'basis_review',reason:'A linked basis record required review when this version was saved.',question:'Check the current basis before relying on this text. Saving a reference does not establish truth.'});
  const question=promises[draft.request.kind]?.[f.key];
  if(question)points.push({key:f.key,label,kind:'review_prompt',reason:'Review this wording before making a commitment. This prompt does not mean the text is incorrect.',question});
 }
 return {points,missing_count:points.filter(p=>p.kind==='missing').length,requires_review:draft.requires_review,warning:'Field-based gaps and review prompts only. This does not detect every unclear promise, contradiction or omitted condition. No quality score or approval.'};
}
