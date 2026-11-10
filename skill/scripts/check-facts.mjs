#!/usr/bin/env node
// The eval cases encode specific dates and figures from the packs. If a pack is
// edited and one of those facts moves, the case silently starts testing the
// wrong thing. This asserts the string-checkable half, so drift fails loudly.
//
// This checks CONSISTENCY between the packs and the cases. It does NOT check
// that any fact is true in the world — only a recheck against the primary
// source does that. See check-freshness.mjs for staleness.
//
// When this fails, exactly one of two things is true:
//   - the pack improved and the eval case must be rewritten, or
//   - the edit was a mistake.
// Decide which. Do not silence the assertion to make the build green.
//
//   node scripts/check-facts.mjs

import {readFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';

import {packsDir} from './lib/paths.mjs';
import {createReport} from './lib/report.mjs';

/**
 * Facts that MUST be present.
 * @type {Array<{case: string, pack: string, label: string, pattern: RegExp}>}
 */
const REQUIRED = [
  // --- Belgium ---------------------------------------------------------------
  {case: 'C4', pack: 'belgium.md', label: 'e-invoicing in force from 2026-01-01', pattern: /2026-01-01/},
  {case: 'C4', pack: 'belgium.md', label: 'exemption regime still in scope', pattern: /exemption regime[^|]*\|\s*\*\*In scope/i},
  {case: 'C4', pack: 'belgium.md', label: 'Peppol named', pattern: /\bPeppol\b/},
  {case: 'C5', pack: 'belgium.md', label: 'Walloon abolition date', pattern: /2025-10-01/},
  {case: 'C5', pack: 'belgium.md', label: 'conflict preserved as a conflict', pattern: /source conflict/i},
  {case: 'C6', pack: 'belgium.md', label: '2029 threshold is EUR 28,000', pattern: /\|\s*2029\s*\|\s*€28,000\s*\|/},
  {case: 'C6', pack: 'belgium.md', label: 'enacting instrument identified', pattern: /law of 2026-09-23/i},
  {case: 'C6', pack: 'belgium.md', label: 'amended VAT Code article named', pattern: /article 56ter/i},
  {case: 'C6', pack: 'belgium.md', label: 'per-year figures still only commentary', pattern: /rest on professional commentary/i},
  {case: '—', pack: 'belgium.md', label: 'unfair terms black list article', pattern: /VI\.91\/4/},
  {case: '—', pack: 'belgium.md', label: 'software ownership: no automatic transfer', pattern: /niet automatisch overgedragen/},
  // Same trap as the French guide below: two of the four SME brochures are
  // CBPL-era, and the other two are a KU Leuven deliverable, not GBA doctrine.
  {case: '—', pack: 'belgium.md', label: 'Wegwijs is January 2018, CBPL-era', pattern: /\*\*January 2018\*\*/},
  {case: '—', pack: 'belgium.md', label: 'BOOST brochures attributed to KU Leuven', pattern: /CiTiP KU Leuven/},
  {case: '—', pack: 'belgium.md', label: 'breach filing needs the MijneGov role', pattern: /GBA_Documentum_Vertegenwoordiger/},
  {case: '—', pack: 'belgium.md', label: 'part 2 window is 21 calendar days', pattern: /21 calendar days/},
  {case: '—', pack: 'belgium.md', label: 'part 1 alone does not discharge the duty', pattern: /part 1 alone does not discharge the duty/i},
  {case: '—', pack: 'belgium.md', label: 'supplementing act identified, not read', pattern: /wet van 30 juli 2018/},

  // --- Germany ---------------------------------------------------------------
  {case: 'C14', pack: 'germany.md', label: 'receiving mandatory from 2025-01-01', pattern: /2025-01-01/},
  {case: 'C14', pack: 'germany.md', label: 'issuing threshold EUR 800,000', pattern: /€800,000/},
  {case: 'C14', pack: 'germany.md', label: 'all businesses from 2028-01-01', pattern: /2028-01-01/},
  {case: 'C14', pack: 'germany.md', label: 'email address suffices to receive', pattern: /email address is sufficient/i},
  {case: 'C14', pack: 'germany.md', label: 'VAT thresholds quoted from the statute', pattern: /25 000 Euro nicht überschritten/},
  {case: '—', pack: 'germany.md', label: 'BMF grace period end', pattern: /2026-12-31/},
  {case: '—', pack: 'germany.md', label: 'ownership provision', pattern: /§69b UrhG/},
  {case: '—', pack: 'germany.md', label: 'unfair terms provision', pattern: /§310\(1\) BGB/},
  // Rn. 22 of the 2025 BMF letter: a Kleinunternehmer is exempt from ISSUING,
  // not merely deferred. Losing this silently would make the pack overstate the
  // obligation for exactly the founders it is written for.
  {case: 'C14', pack: 'germany.md', label: 'Kleinunternehmer exempt from issuing, not deferred', pattern: /never has to issue an e-invoice/i},
  {case: 'C14', pack: 'germany.md', label: 'small-amount invoice ceiling', pattern: /€250/},
  {case: 'C14', pack: 'germany.md', label: 'no transitional rule for receiving', pattern: /no transition for receiving/i},
  {case: '—', pack: 'germany.md', label: 'retention period is eight years', pattern: /\*\*eight years\*\*/},
  {case: '—', pack: 'germany.md', label: 'validation may be relied on; keep the report', pattern: /validation report/i},

  // --- France ----------------------------------------------------------------
  {case: 'C15', pack: 'france.md', label: 'receiving in force from 2026-09-01', pattern: /2026-09-01/},
  {case: 'C15', pack: 'france.md', label: 'issuing for small businesses 2027-09-01', pattern: /2027-09-01/},
  {case: 'C15', pack: 'france.md', label: 'mandatory invoice mention', pattern: /article 293 B du CGI/},
  {case: 'C15', pack: 'france.md', label: 'accredited platform mandatory', pattern: /accredited platform is mandatory/i},
  {case: 'C15', pack: 'france.md', label: 'e-reporting is separate', pattern: /E-reporting is a second, separate obligation/i},
  {case: 'C17', pack: 'france.md', label: 'repealing law number', pattern: /loi n° 2025-1044/},
  {case: 'C17', pack: 'france.md', label: 'PLF 2026 carve-out was rejected', pattern: /rejected/i},
  {case: 'C17', pack: 'france.md', label: 'services threshold EUR 37,500', pattern: /€37,500/},
  {case: 'C17', pack: 'france.md', label: 'current-year threshold EUR 41,250', pattern: /€41,250/},
  {case: '—', pack: 'france.md', label: 'ownership provision', pattern: /L113-9/},
  {case: '—', pack: 'france.md', label: 'unfair terms provision', pattern: /L442-1/},
  // The CNIL/Bpifrance PME guide is pre-GDPR-application. Losing the date would
  // turn awareness material from April 2018 back into current guidance.
  {case: '—', pack: 'france.md', label: 'CNIL/Bpifrance PME guide dated April 2018', pattern: /\*\*April 2018\*\*/},
  {case: '—', pack: 'france.md', label: 'effort scales with data, not headcount', pattern: /not the size or headcount/i},
  {case: '—', pack: 'france.md', label: '3-year inactivity retention, and its provenance', pattern: /3 years from the end of the commercial relationship/i},

  // --- Netherlands -----------------------------------------------------------
  {case: 'C16', pack: 'netherlands.md', label: 'no domestic B2B mandate', pattern: /no business-to-business \(B2B\) mandate/},
  {case: 'C16', pack: 'netherlands.md', label: 'B2G since 2019-11-01', pattern: /2019-11-01/},
  {case: 'C16', pack: 'netherlands.md', label: 'announced date 2030-07-01', pattern: /2030-07-01/},
  {case: 'C16', pack: 'netherlands.md', label: 'announced, not law', pattern: /none of this is law/i},
  {case: '—', pack: 'netherlands.md', label: 'KOR threshold EUR 20,000', pattern: /€20,000/},
  {case: '—', pack: 'netherlands.md', label: 'KOR: invoice not required', pattern: /niet verplicht om een factuur uit te reiken/},
  {case: '—', pack: 'netherlands.md', label: 'EU-KOR Union threshold', pattern: /€100,000/},
  {case: '—', pack: 'netherlands.md', label: 'ownership provision', pattern: /artikel 7 Auteurswet|article 7 Auteurswet/i},
  {case: '—', pack: 'netherlands.md', label: 'large-party exclusion', pattern: /6:235/},
  // Breach filing: the AP's channel, its clock, and the trap it names itself.
  {case: '—', pack: 'netherlands.md', label: 'online form is the only channel', pattern: /only channel/i},
  {case: '—', pack: 'netherlands.md', label: 'follow-up notification within 4 weeks', pattern: /within 4 weeks/},
  {case: '—', pack: 'netherlands.md', label: 'reaching the FG is not awareness', pattern: /the DPO is not a buffer/i},

  // --- Shared EU layers ------------------------------------------------------
  {case: '—', pack: 'eu-gdpr.md', label: '72-hour notification', pattern: /72 hours/},
  // Patterns tolerate markdown emphasis: the text reads "**not** a legal requirement".
  {case: '—', pack: 'eu-gdpr.md', label: 'password figure flagged as not a requirement', pattern: /a legal requirement/i},
  {case: '—', pack: 'eu-gdpr.md', label: 'processor liability for sub-processors', pattern: /liable to the controller for its sub-processors/i},
  {case: '—', pack: 'eu-vat-sme.md', label: 'national threshold ceiling', pattern: /€85,000/},
  {case: '—', pack: 'eu-vat-sme.md', label: 'Union turnover cap article', pattern: /284\(2\)\(a\)/},
  {case: '—', pack: 'eu-vat-sme.md', label: 'the EUR 100,000 coincidence trap is named', pattern: /coincidence is a live trap/i},
];

/**
 * Claims that must NOT reappear: entries this project reversed after checking.
 * @type {Array<{pack: string, label: string, pattern: RegExp}>}
 */
const FORBIDDEN = [
  {
    pack: 'france.md',
    label: 'PLF 2026 carve-out must not read as pending',
    pattern: /is reported to propose a €37,500 base threshold \*\*with €25,000/,
  },
  {
    pack: 'netherlands.md',
    label: 'Peppol must not be stated as mandated',
    pattern: /Peppol[- ]based model is mandated|Peppol is mandated/i,
  },
  {
    pack: 'belgium.md',
    label: 'must not claim the Walloon proof is still required',
    pattern: /must obtain (the )?basic[- ]management/i,
  },
];

const report = createReport({
  ok: 'every fact the eval cases encode is still present and no reversed claim has returned.',
});

const cache = new Map();
function packText(pack) {
  if (!cache.has(pack)) {
    const path = join(packsDir, pack);
    cache.set(pack, existsSync(path) ? readFileSync(path, 'utf8') : null);
  }
  return cache.get(pack);
}

let checked = 0;

for (const {case: caseId, pack, label, pattern} of REQUIRED) {
  const text = packText(pack);
  if (text === null) {
    report.fail(pack, `missing (needed by ${caseId} / ${label})`);
    continue;
  }
  checked++;
  if (!pattern.test(text))
    report.fail(pack, `${caseId} expects "${label}" but ${pattern} does not match`);
}

for (const {pack, label, pattern} of FORBIDDEN) {
  const text = packText(pack);
  if (text === null) continue;
  checked++;
  if (pattern.test(text)) report.fail(pack, `${label} — forbidden pattern ${pattern} is present`);
}

report.note(`${checked} fact assertion(s) checked across ${cache.size} pack(s)`);

if (!report.finish())
  console.error('\nEither the pack improved and the eval case must be rewritten, or the edit was a mistake.');
