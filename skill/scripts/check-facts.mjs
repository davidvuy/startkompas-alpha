#!/usr/bin/env node
// Backlog item 57: the eval cases encode specific dates and figures from the
// packs. If a pack is edited and one of those facts moves or disappears, the
// case silently starts testing the wrong thing. This asserts the string-
// checkable half, so that drift fails loudly instead.
//
// This checks CONSISTENCY between the packs and the cases. It does NOT check
// that any fact is true in the world - only a recheck against the primary
// source does that. See scripts/check-freshness.mjs for staleness.
//
//   node scripts/check-facts.mjs
//
// Standard library only.

import {readFileSync, existsSync} from 'node:fs';
import {join, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packs = join(root, 'references', 'jurisdictions');

// [case, file, label, pattern]
const assertions = [
  // Belgium
  ['C4', 'belgium.md', 'e-invoicing in force from 2026-01-01', /2026-01-01/],
  ['C4', 'belgium.md', 'exemption regime still in scope', /exemption regime[^|]*\|\s*\*\*In scope/i],
  ['C4', 'belgium.md', 'Peppol named', /\bPeppol\b/],
  ['C5', 'belgium.md', 'Walloon abolition date', /2025-10-01/],
  ['C5', 'belgium.md', 'conflict preserved as a conflict', /source conflict/i],
  ['C6', 'belgium.md', '2029 threshold is EUR 28,000', /\|\s*2029\s*\|\s*€28,000\s*\|/],
  ['C6', 'belgium.md', 'primary confirmation still open', /not primary-confirmed/i],
  ['—', 'belgium.md', 'unfair terms black list article', /VI\.91\/4/],
  ['—', 'belgium.md', 'software ownership: no automatic transfer', /niet automatisch overgedragen/],

  // Germany
  ['C14', 'germany.md', 'receiving mandatory from 2025-01-01', /2025-01-01/],
  ['C14', 'germany.md', 'issuing threshold EUR 800,000', /€800,000/],
  ['C14', 'germany.md', 'all businesses from 2028-01-01', /2028-01-01/],
  ['C14', 'germany.md', 'email address suffices to receive', /email address is sufficient/i],
  ['C14', 'germany.md', 'both VAT thresholds quoted from the statute', /25 000 Euro nicht überschritten/],
  ['—', 'germany.md', 'BMF grace period end', /2026-12-31/],
  ['—', 'germany.md', 'ownership provision', /§69b UrhG/],
  ['—', 'germany.md', 'unfair terms provision', /§310\(1\) BGB/],

  // France
  ['C15', 'france.md', 'receiving in force from 2026-09-01', /2026-09-01/],
  ['C15', 'france.md', 'issuing for small businesses 2027-09-01', /2027-09-01/],
  ['C15', 'france.md', 'mandatory invoice mention', /article 293 B du CGI/],
  ['C15', 'france.md', 'accredited platform mandatory', /accredited platform is mandatory/i],
  ['C15', 'france.md', 'e-reporting is separate', /E-reporting is a second, separate obligation/i],
  ['C17', 'france.md', 'repealing law number', /loi n° 2025-1044/],
  ['C17', 'france.md', 'PLF 2026 carve-out was rejected', /rejected/i],
  ['C17', 'france.md', 'services threshold EUR 37,500', /€37,500/],
  ['C17', 'france.md', 'current-year threshold EUR 41,250', /€41,250/],
  ['—', 'france.md', 'ownership provision', /L113-9/],
  ['—', 'france.md', 'unfair terms provision', /L442-1/],

  // Netherlands
  ['C16', 'netherlands.md', 'no domestic B2B mandate', /no business-to-business \(B2B\) mandate/],
  ['C16', 'netherlands.md', 'B2G since 2019-11-01', /2019-11-01/],
  ['C16', 'netherlands.md', 'announced date 2030-07-01', /2030-07-01/],
  ['C16', 'netherlands.md', 'announced, not law', /none of this is law/i],
  ['—', 'netherlands.md', 'KOR threshold EUR 20,000', /€20,000/],
  ['—', 'netherlands.md', 'KOR: invoice not required', /niet verplicht om een factuur uit te reiken/],
  ['—', 'netherlands.md', 'EU-KOR Union threshold', /€100,000/],
  ['—', 'netherlands.md', 'ownership provision', /artikel 7 Auteurswet|article 7 Auteurswet/i],
  ['—', 'netherlands.md', 'large-party exclusion', /6:235/],

  // Shared EU layer
  ['—', 'eu-gdpr.md', '72-hour notification', /72 hours/],
  ['—', 'eu-gdpr.md', 'password figure flagged as not a requirement', /not\*\* a legal requirement|not a legal requirement/i],
  ['—', 'eu-gdpr.md', 'processor liability for sub-processors', /liable to the controller for its sub-processors/i],
];

// Facts that must NOT appear: reversed entries and dead reforms.
const prohibited = [
  ['france.md', 'PLF 2026 carve-out must not read as pending', /is reported to propose a €37,500 base threshold \*\*with €25,000/],
  ['netherlands.md', 'Peppol must not be stated as mandated', /Peppol[- ]based model is mandated|Peppol is mandated/i],
  ['belgium.md', 'must not claim the Walloon proof is still required', /must obtain (the )?basic[- ]management/i],
];

const problems = [];
let checked = 0;

for (const [caseId, file, label, pattern] of assertions) {
  const path = join(packs, file);
  if (!existsSync(path)) {
    problems.push(`${file}: missing (needed by ${caseId} / ${label})`);
    continue;
  }
  const text = readFileSync(path, 'utf8');
  checked++;
  if (!pattern.test(text))
    problems.push(`${file}: ${caseId} expects "${label}" but ${pattern} does not match`);
}

for (const [file, label, pattern] of prohibited) {
  const path = join(packs, file);
  if (!existsSync(path)) continue;
  checked++;
  if (pattern.test(readFileSync(path, 'utf8')))
    problems.push(`${file}: ${label} — forbidden pattern ${pattern} is present`);
}

console.log(`${checked} fact assertion(s) checked across the packs.`);

if (problems.length === 0) {
  console.log('OK: every fact the eval cases encode is still present and no reversed claim has returned.');
} else {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('\nEither the pack changed and the eval case must be rewritten, or the edit was a mistake.');
  process.exitCode = 1;
}
