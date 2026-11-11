// The two assertion tables, plus the pure matcher over them.
//
// Split out of check-facts.mjs so both halves can be tested directly: the
// tables are data that goes wrong in specific ways (a duplicate label, a
// pattern naming a pack that no longer exists, a forbidden pattern broad
// enough to fire on a pack's own correction), and `evaluate` is a pure
// function that can be fed synthetic pack text instead of the real tree.
//
// The tables remain the single source of truth. check-facts.mjs is the CLI.

/**
 * Facts that MUST be present.
 * @type {Array<{case: string, pack: string, label: string, pattern: RegExp}>}
 */
export const REQUIRED = [
  // --- Belgium ---------------------------------------------------------------
  {case: 'C4', pack: 'belgium.md', label: 'e-invoicing in force from 2026-01-01', pattern: /2026-01-01/},
  {case: 'C4', pack: 'belgium.md', label: 'exemption regime still in scope', pattern: /exemption regime[^|]*\|\s*\*\*In scope/i},
  {case: 'C4', pack: 'belgium.md', label: 'Peppol named', pattern: /\bPeppol\b/},
  {case: 'C5', pack: 'belgium.md', label: 'Walloon abolition date', pattern: /2025-10-01/},
  {case: 'C5', pack: 'belgium.md', label: 'conflict preserved as a conflict', pattern: /source conflict/i},
  {case: 'C6', pack: 'belgium.md', label: '2029 threshold is EUR 28,000', pattern: /\|\s*2029\s*\|\s*€28,000\s*\|/},
  {case: 'C6', pack: 'belgium.md', label: 'enacting instrument identified', pattern: /DOC 56 1593\/001/},
  {case: 'C6', pack: 'belgium.md', label: 'amended VAT Code article named', pattern: /art\. 56ter/i},
  // The figures are primary-confirmed from the bill; the ENACTMENT is not. Both
  // halves have to survive, because stating these amounts as law would send a
  // founder into 2027 on a threshold that may never have been promulgated.
  {case: 'C6', pack: 'belgium.md', label: 'amending article is 25, not 26', pattern: /\*\*Article 25\*\* of that bill replaces/},
  {case: 'C6', pack: 'belgium.md', label: 'publication is unverified and said to be', pattern: /do not tell a founder these amounts are law/i},
  {case: '—', pack: 'belgium.md', label: 'unfair terms black list article', pattern: /VI\.91\/4/},
  {case: '—', pack: 'belgium.md', label: 'software ownership: no automatic transfer', pattern: /niet automatisch overgedragen/},
  // Same trap as the French guide below: two of the four SME brochures are
  // CBPL-era, and the other two are a KU Leuven deliverable, not GBA doctrine.
  {case: '—', pack: 'belgium.md', label: 'Wegwijs is January 2018, CBPL-era', pattern: /\*\*January 2018\*\*/},
  {case: '—', pack: 'belgium.md', label: 'BOOST brochures attributed to KU Leuven', pattern: /CiTiP KU Leuven/},
  {case: '—', pack: 'belgium.md', label: 'breach filing needs the MijneGov role', pattern: /GBA_Documentum_Vertegenwoordiger/},
  {case: '—', pack: 'belgium.md', label: 'XI.301 makes the software-user floor dwingend recht', pattern: /XI\.299, §§ 2 en 3, en XI\.300 is van dwingend recht/},
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
  {case: 'C14', pack: 'germany.md', label: 'small-amount invoice ceiling', pattern: /€250/},
  {case: '—', pack: 'germany.md', label: '§69g(2) voids terms against the user floor', pattern: /§ 69d Absatz 2, 3, 5 oder 7 oder zu § 69e stehen, sind nichtig/},
  // §69e grants very little, and the condition founders skip is that the
  // interoperability information must not already be available to them — so
  // asking for it is the first step, not a courtesy.
  {case: '—', pack: 'germany.md', label: '§69e decompilation requires the information not be available', pattern: /noch nicht ohne weiteres zugänglich gemacht/},
  // §19(1) has two sentences and the pack used to quote one of them under the
  // heading "in full". Sentence 2 is where the filing relief lives.
  {case: '—', pack: 'germany.md', label: '§19(1) sentence 2 disapplies the declaration duties', pattern: /No VAT `Voranmeldungen` and no annual VAT return/},
  // Declining the exemption is not a reversible setting, and this is the only
  // number in §2 that can cost a founder five years.
  {case: '—', pack: 'germany.md', label: '§19(3) waiver binds five calendar years', pattern: /It binds for at least five calendar years/},
  // "No VAT on the invoice" is not "nothing on the invoice": §34a requires the
  // exemption to be stated, and a bare invoice with no VAT line fails it.
  {case: '—', pack: 'germany.md', label: '§34a requires the exemption to be stated on the invoice', pattern: /the Kleinunternehmer exemption applies/},
  // §11 GewStG gives the allowance to natural persons and partnerships. A
  // founder who incorporates loses it, which is a legal-form question.
  {case: '—', pack: 'germany.md', label: '€24,500 allowance is not available to a GmbH', pattern: /natürlichen Personen sowie bei Personengesellschaften/},

  // --- Germany — e-invoicing annex -------------------------------------------
  // Rn. 22 of the 2025 BMF letter: a Kleinunternehmer is exempt from ISSUING,
  // not merely deferred. Losing this silently would make the pack overstate the
  // obligation for exactly the founders it is written for.
  {case: 'C14', pack: 'germany-e-invoicing.md', label: 'Kleinunternehmer exempt from issuing, not deferred', pattern: /never has to issue an e-invoice/i},
  {case: 'C14', pack: 'germany-e-invoicing.md', label: 'no transitional rule for receiving', pattern: /no transition for receiving/i},
  {case: '—', pack: 'germany-e-invoicing.md', label: 'BMF grace period end', pattern: /2026-12-31/},
  {case: '—', pack: 'germany-e-invoicing.md', label: 'retention period is eight years', pattern: /\*\*eight years\*\*/},
  {case: '—', pack: 'germany-e-invoicing.md', label: 'validation may be relied on; keep the report', pattern: /validation report/i},
  // §27(38) is the whole transition, and the letters never put its three cases
  // side by side. Two of them are easy to merge by mistake.
  {case: '—', pack: 'germany-e-invoicing.md', label: '§27(38) has exactly three derogation cases', pattern: /exactly three numbered cases/},
  {case: '—', pack: 'germany-e-invoicing.md', label: 'the EDI route carries no turnover limit', pattern: /no turnover condition/},
  // The €250 relief does not reach a reverse-charge invoice. The pack stated
  // the relief without the carve-out until §33 UStDV was read.
  {case: '—', pack: 'germany-e-invoicing.md', label: '§33 sentence 3 removes the €250 relief for §3c/§6a/§13b', pattern: /sentence 3 removes sentences 1 and 2/},

  // --- France ----------------------------------------------------------------
  {case: 'C15', pack: 'france.md', label: 'receiving in force from 2026-09-01', pattern: /2026-09-01/},
  {case: 'C15', pack: 'france.md', label: 'issuing for small businesses 2027-09-01', pattern: /2027-09-01/},
  {case: 'C15', pack: 'france.md', label: 'mandatory invoice mention', pattern: /article 293 B du CGI/},
  {case: 'C15', pack: 'france.md', label: 'accredited platform mandatory', pattern: /accredited platform is mandatory/i},
  {case: 'C15', pack: 'france.md', label: 'e-reporting is separate', pattern: /E-reporting is a second, separate obligation/i},
  // This entry used to require the law number `loi n° 2025-1044` to be present,
  // which meant the check was enforcing a claim the pack could not support.
  // Refetching the official page on 2026-11-11 confirmed the abandonment and
  // nothing else: no law number, no date, no suspension. So what must survive
  // is the verified fact plus the warning not to cite the number — the same
  // two-part shape as the Belgian threshold entry below.
  {case: 'C17', pack: 'france.md', label: 'single €25,000 threshold recorded as abandoned', pattern: /abandonnée/},
  {case: 'C17', pack: 'france.md', label: 'the law number is flagged as unconfirmed', pattern: /do not cite the law number/i},
  {case: 'C17', pack: 'france.md', label: 'PLF 2026 carve-out was rejected', pattern: /rejected/i},
  // The mid-year rules are the one place France answers what §19 UStG does not.
  // Losing either half would leave a founder with half a rule, which is worse
  // than none: the seuil gives the rest of the year, the majoré gives nothing.
  {case: '—', pack: 'france.md', label: 'crossing the seuil takes effect the following 1 January', pattern: /dès le 1er janvier de l'année suivante/},
  {case: '—', pack: 'france.md', label: 'crossing the seuil majoré takes effect immediately', pattern: /cesse de s'appliquer dès le 1er jour du dépassement/},
  {case: '—', pack: 'france.md', label: 'and expressly no longer from the first of the month', pattern: /et non plus au premier jour du mois du dépassement/},
  {case: '—', pack: 'france.md', label: 'the mention is required by art. 293 E, not 293 B', pattern: /293 E CGI/},
  {case: 'C17', pack: 'france.md', label: 'services threshold EUR 37,500', pattern: /€37,500/},
  {case: 'C17', pack: 'france.md', label: 'current-year threshold EUR 41,250', pattern: /€41,250/},
  {case: '—', pack: 'france.md', label: 'ownership provision', pattern: /L113-9/},
  {case: '—', pack: 'france.md', label: 'unfair terms provision', pattern: /L442-1/},
  // L122-6-1 VIII: the floor for a lawful software user is partly unwaivable.
  // If this is ever softened to "the contract decides", the pack is wrong.
  {case: '—', pack: 'france.md', label: 'L131-3 four-dimension delimitation', pattern: /\*\*extent\*\*, \*\*destination\*\*, \*\*place\*\* and \*\*duration\*\*/},
  {case: '—', pack: 'france.md', label: 'L122-6-1 floor is partly unwaivable', pattern: /stipulations contrary to II, III and IV are \*\*void\*\*/},
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
  // Read in the Contourenbrief and its annex on 2026-11-11. The receive/issue
  // split is the one that decides what this pack's default founder has to
  // build: the pack previously carried only the exemption half, which would
  // have told a KOR founder they need nothing at all by 2030.
  {case: 'C16', pack: 'netherlands.md', label: 'KOR users must still be able to receive', pattern: /in staat moeten zijn om een e-factuur te \*\*ontvangen\*\*/},
  {case: 'C16', pack: 'netherlands.md', label: 'EN 16931 only, no other invoice norm', pattern: /geen andere factuurnormen toe te staan/},
  {case: 'C16', pack: 'netherlands.md', label: 'the annex does not mention Peppol', pattern: /mentions Peppol nowhere at all/i},
  {case: '—', pack: 'netherlands.md', label: 'KOR threshold EUR 20,000', pattern: /€20,000/},
  {case: '—', pack: 'netherlands.md', label: 'KOR: invoice not required', pattern: /niet verplicht om een factuur uit te reiken/},
  {case: '—', pack: 'netherlands.md', label: 'EU-KOR Union threshold', pattern: /€100,000/},
  {case: '—', pack: 'netherlands.md', label: 'ownership provision', pattern: /artikel 7 Auteurswet|article 7 Auteurswet/i},
  {case: '—', pack: 'netherlands.md', label: 'large-party exclusion', pattern: /6:235/},
  // Breach filing: the AP's channel, its clock, and the trap it names itself.
  {case: '—', pack: 'netherlands.md', label: 'online form is the only channel', pattern: /only channel/i},
  {case: '—', pack: 'netherlands.md', label: 'follow-up notification within 4 weeks', pattern: /within 4 weeks/},
  {case: '—', pack: 'netherlands.md', label: 'reaching the FG is not awareness', pattern: /the DPO is not a buffer/i},
  // Art. 2(3) Aw: ownership cannot pass without a deed. A founder relying on
  // this pack must not be told payment or an invoice can transfer copyright.
  {case: '—', pack: 'netherlands.md', label: 'transfer needs a deed under art. 3:95 BW', pattern: /art\. 3:95 BW/},
  {case: '—', pack: 'netherlands.md', label: 'narrow construction follows the human creator', pattern: /not whoever holds the title/i},
  // The Dutch software-user provisions invert the pattern of the other three.
  // Both halves must survive: the protection of error correction, and the
  // refusal to conclude anything from the silence in 45k-45m.
  {case: '—', pack: 'netherlands.md', label: 'art. 45j protects error correction from contract', pattern: /kan niet bij overeenkomst\s+worden verboden/},
  {case: '—', pack: 'netherlands.md', label: 'silence in 45k-45m is not read as waivable', pattern: /Do not conclude from that silence/i},

  // --- Shared EU layers ------------------------------------------------------
  {case: '—', pack: 'eu-gdpr.md', label: '72-hour notification', pattern: /72 hours/},
  // Patterns tolerate markdown emphasis: the text reads "**not** a legal requirement".
  {case: '—', pack: 'eu-gdpr.md', label: 'password figure flagged as not a requirement', pattern: /a legal requirement/i},
  {case: '—', pack: 'eu-gdpr.md', label: 'processor liability for sub-processors', pattern: /liable to the controller for its sub-processors/i},
  {case: '—', pack: 'eu-vat-sme.md', label: 'national threshold ceiling', pattern: /€85,000/},
  {case: '—', pack: 'eu-vat-sme.md', label: 'Union turnover cap article', pattern: /284\(2\)\(a\)/},
  {case: '—', pack: 'eu-vat-sme.md', label: 'the EUR 100,000 coincidence trap is named', pattern: /coincidence is a live trap/i},

  // --- EU AI Act -------------------------------------------------------------
  // The Act is being amended. Losing the amending instrument's identity would
  // send the next maintainer back to the 2024 text, which is what most
  // reproductions still carry.
  {case: '—', pack: 'eu-ai-act.md', label: 'the amending regulation is named', pattern: /Regulation \(EU\) 2026\/1744/},
  // This is the sentence that guards the superseded art. 4 wording. There is
  // deliberately NO forbidden entry for "to their best extent": the layer must
  // be able to quote that phrase as the wording it replaced, and both the
  // warning and the withdrawal row quote it inside emphasis, so no lookbehind
  // can tell an assertion from the record of its replacement. Restoring the old
  // wording as current means deleting this sentence, which fails here instead.
  {case: '—', pack: 'eu-ai-act.md', label: 'the replaced art. 4 wording is flagged as replaced', pattern: /quoting law that was replaced/},
  {case: '—', pack: 'eu-ai-act.md', label: 'art. 4 binds deployers, from 2025-02-02', pattern: /2025-02-02/},
  // The nearest date in the layer, and the only one that can newly prohibit
  // something a founder is already doing.
  {case: '—', pack: 'eu-ai-act.md', label: 'the two new art. 5 prohibitions apply from 2026-12-02', pattern: /2026-12-02/},
  // Quoting €35m to a solo founder is not merely alarming, it is wrong for
  // them: art. 99(6) makes the percentage the operative ceiling for an SME.
  {case: '—', pack: 'eu-ai-act.md', label: 'art. 99(6) gives SMEs the lower of the two ceilings', pattern: /whichever thereof is lower/},
  // Art. 3(60) has two limbs, and without them the layer told founders every
  // generated asset needs a disclosure.
  {case: '—', pack: 'eu-ai-act.md', label: 'deep fake requires resemblance and false authenticity', pattern: /resembles existing/},
  {case: '—', pack: 'eu-ai-act.md', label: 'provider status does not depend on risk tier', pattern: /does not depend on risk tier/},
];

/**
 * Claims that must NOT reappear: entries this project reversed after checking.
 * @type {Array<{pack: string, label: string, pattern: RegExp}>}
 */
export const FORBIDDEN = [
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
  // There is deliberately NO entry here for "decentralised and Peppol-based",
  // the other claim withdrawn on 2026-11-11. The lookbehind device used above
  // cannot work for it: the pack withdraws that claim by quoting the whole
  // sentence it used to carry, and the `*"` that opens the quotation sits too
  // far from the words to be matched by a lookbehind of any fixed shape.
  //
  // It needs no entry, because the REQUIRED entry "the annex does not mention
  // Peppol" already guards it from the other side — restoring the claim means
  // deleting the sentence that says the annex mentions Peppol nowhere, and
  // that fails. One guard that works beats two that fight each other.
  {
    pack: 'belgium.md',
    label: 'must not claim the Walloon proof is still required',
    pattern: /must obtain (the )?basic[- ]management/i,
  },
  // §19(1) UStG has two sentences. The pack quoted sentence 1 under the words
  // "§19(1) in full" and so missed sentence 2, which is where the exemption
  // from the VAT filing duties lives. The maintenance table records that
  // correction and quotes the old wording in backticks, which the lookbehind
  // excludes — the same device as the Belgian entries above.
  {
    pack: 'germany.md',
    label: 'must not call one sentence of §19(1) the whole paragraph',
    pattern: /(?<!`)§19\(1\) in full/,
  },
  // A pack may legitimately QUOTE a claim it has withdrawn, inside the
  // correction that withdraws it — belgium.md §2 does exactly that, and the
  // first version of this pattern fired on the correction itself. So a
  // forbidden pattern has to match the assertive form only. Here the quotation
  // is introduced by `*"`, which the lookbehind excludes.
  {
    pack: 'belgium.md',
    label: 'the phased VAT thresholds must not read as enacted law',
    pattern: /(?<!\*")now enacted, not a bill/i,
  },
  // Withdrawn on 2026-11-11: the official page gives thresholds per category
  // and a non-interference rule only for avocats and authors. The pack states
  // the old rule once, inside the paragraph that withdraws it, so the
  // lookbehind excludes that introduction — same device as the entry above.
  {
    pack: 'france.md',
    label: 'the withdrawn mixed-activity rule must not be asserted again',
    pattern: /(?<!previously stated that )total turnover must stay under the sales threshold/i,
  },
];
/**
 * Apply both tables to whatever `readPack` returns.
 *
 * Pure: it performs no I/O and prints nothing, so a test can supply pack text
 * directly. The caller decides how a problem is reported.
 *
 * @param {(pack: string) => string | null} readPack pack filename -> contents,
 *   or null when the pack does not exist
 * @returns {{checked: number, packs: string[], problems: Array<{pack: string, message: string}>}}
 */
export function evaluate(readPack) {
  const problems = [];
  const seen = new Map();
  let checked = 0;

  const text = (pack) => {
    if (!seen.has(pack)) seen.set(pack, readPack(pack));
    return seen.get(pack);
  };

  for (const {case: caseId, pack, label, pattern} of REQUIRED) {
    const contents = text(pack);
    if (contents === null) {
      problems.push({pack, message: `missing (needed by ${caseId} / ${label})`});
      continue;
    }
    checked += 1;
    if (!pattern.test(contents))
      problems.push({pack, message: `${caseId} expects "${label}" but ${pattern} does not match`});
  }

  for (const {pack, label, pattern} of FORBIDDEN) {
    const contents = text(pack);
    if (contents === null) continue;
    checked += 1;
    if (pattern.test(contents))
      problems.push({pack, message: `${label} — forbidden pattern ${pattern} is present`});
  }

  return {checked, packs: [...seen.keys()], problems};
}
