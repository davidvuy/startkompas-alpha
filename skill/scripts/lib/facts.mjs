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
  {case: '—', pack: 'france-data-protection.md', label: 'effort scales with data, not headcount', pattern: /not the size or headcount/i},
  {case: '—', pack: 'france-data-protection.md', label: '3-year inactivity retention, and its provenance', pattern: /3 years from the end of the commercial relationship/i},

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
  {case: '—', pack: 'netherlands-data-protection.md', label: 'online form is the only channel', pattern: /only channel/i},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'follow-up notification within 4 weeks', pattern: /within 4 weeks/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'reaching the FG is not awareness', pattern: /the DPO is not a buffer/i},
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
  // The GDPR is unamended, so the version string is the layer's whole claim to
  // being current. Losing it is how the AI Act layer came to rest on a
  // reproduction of superseded law.
  {case: '—', pack: 'eu-gdpr.md', label: 'the consolidated version read is identified', pattern: /02016R0679 — EN — 04\.05\.2016 — 000\.002/},
  {case: '—', pack: 'eu-gdpr.md', label: 'the corrigendum is identified', pattern: /OJ L 127, 23\.5\.2018/},
  // The single most consequential correction in this layer: a B2B pilot's
  // contract is with the company, so the contact it names is an art. 6(1)(f)
  // question. Telling a founder it is (b) hands them a basis they do not have.
  {case: '—', pack: 'eu-gdpr.md', label: 'basis (b) needs the data subject to be a party', pattern: /to which the data subject is party/},
  {case: '—', pack: 'eu-gdpr.md', label: 'a processor register is shorter than a controller one', pattern: /four things, not seven/},
  // Art. 30(5) is one sentence with three limbs, the third of which has two
  // alternatives, so any count of it is an artefact of how a source laid it out.
  {case: '—', pack: 'eu-gdpr.md', label: 'the art. 30(5) conditions are not given as a count', pattern: /Do not quote a count of these/},
  {case: '—', pack: 'eu-gdpr.md', label: 'a breach needs no attacker and no disclosure', pattern: /accidental or unlawful destruction/},
  // A per-sub-processor consent requirement would condemn every real cloud DPA.
  {case: '—', pack: 'eu-gdpr.md', label: 'art. 28(2) allows a general authorisation', pattern: /specific or general written authorisation/},
  {case: '—', pack: 'eu-gdpr.md', label: 'art. 32(1) makes cost a statutory factor', pattern: /costs of implementation/},
  {case: '—', pack: 'eu-gdpr.md', label: 'art. 44 reaches onward transfers', pattern: /onward transfers/},
  {case: '—', pack: 'eu-gdpr.md', label: 'art. 12(5) puts the burden on the controller', pattern: /burden of demonstrating/},
  {case: '—', pack: 'eu-gdpr-fines.md', label: 'the GDPR has no SME reduction', pattern: /no SME tier/},
  // The comparison is the point of the row: the two instruments the skill
  // covers resolve "amount or percentage" in opposite directions for an SME.
  {case: '—', pack: 'eu-gdpr-fines.md', label: 'the AI Act resolves the same choice the other way', pattern: /whichever thereof is lower/},
  {case: '—', pack: 'eu-gdpr-fines.md', label: 'self-notification is an express mitigating factor', pattern: /whether, and if so to what extent, the controller or processor notified/},
  {case: '—', pack: 'eu-gdpr-dpo-dpia.md', label: 'art. 35(3) case 1 keeps "and extensive"', pattern: /systematic and extensive/},
  {case: '—', pack: 'eu-gdpr-dpo-dpia.md', label: 'national law can require a DPO under art. 37(4)', pattern: /where required by Union or Member State law shall/},
  {case: '—', pack: 'eu-gdpr-dpo-dpia.md', label: 'the art. 35(4) national list is mandatory', pattern: /shall establish and make public a list/},
  // The national hooks are only useful if they point somewhere. Both were
  // closed for Germany on 2026-11-11, and the sentence that carries the
  // surprise — a DPO with no employees — has to survive here too, because this
  // is the file a reader reaches the question from.
  {case: '—', pack: 'eu-gdpr-dpo-dpia.md', label: 'the German DPO triggers ignore headcount', pattern: /regardless of how many people are involved/},
  {case: '—', pack: 'eu-gdpr.md', label: 'the password figures are two authorities, not a rule', pattern: /minimum of \*\*12\*\* characters/},
  {case: '—', pack: 'eu-gdpr.md', label: 'the one adequacy answer the packs hold is the DPF', pattern: /EU–US Data Protection Framework/},

  // --- Germany — data protection annex ---------------------------------------
  // §38(1) has two sentences and the second has no headcount at all. Quoting
  // only the 20-person figure is the error this block exists to prevent: it
  // tells a one-person market-research business it owes no DPO when it does.
  {case: '—', pack: 'germany-data-protection.md', label: '§38(1) sentence 1 threshold, in German', pattern: /mindestens 20 Personen ständig/},
  {case: '—', pack: 'germany-data-protection.md', label: '§38(1) sentence 2 applies regardless of headcount', pattern: /unabhängig von der Anzahl/},
  {case: '—', pack: 'germany-data-protection.md', label: '§6(4) bars dismissal of a compulsory DPO', pattern: /Die Kündigung des Arbeitsverhältnisses ist unzulässig/},
  // Entry 11 of the German art. 35(4) list. It converts the AI DPIA question
  // from arguable to listed, which is the sharpest national fact in any pack.
  {case: '—', pack: 'germany-data-protection.md', label: 'DSK entry 11 covers AI steering interaction', pattern: /Steuerung der Interaktion mit den Betroffenen/},
  // The checklist is version 0.9 and scoped to retail. Losing either would turn
  // a provisional draft for a different business type into general authority.
  {case: '—', pack: 'germany-data-protection.md', label: 'the BayLDA checklist is a provisional draft', pattern: /Version \*\*0\.9\*\*|Version 0\.9/},
  {case: '—', pack: 'germany-data-protection.md', label: 'its scope excludes high-risk processing', pattern: /kein KI-Startup/},
  {case: '—', pack: 'germany-data-protection.md', label: 'the DPF condition is per provider', pattern: /DPF list of the US Department of Commerce/},
  {case: '—', pack: 'germany-data-protection.md', label: 'freelancers are inside the private-sector authority', pattern: /freiberuflich Tätigen/},

  // Art. 6:235(3) BW is the paragraph that can cost a founder the unfair-terms
  // protection the rest of §4 describes, and it turns on their own conduct
  // rather than their size. It was found only by reading the official text.
  {case: '—', pack: 'netherlands.md', label: 'art. 6:235(3) excludes a repeat user of its own terms', pattern: /meermalen dezelfde of nagenoeg dezelfde algemene voorwaarden/},
  {case: '—', pack: 'netherlands.md', label: 'art. 7:401 standard of care', pattern: /zorg van een goed opdrachtnemer/},

  // --- France — the CNIL's two lists -----------------------------------------
  // France is the only jurisdiction in these packs whose authority has used
  // art. 35(5). The exemption and its carve-out have to survive together: the
  // under-250 figure without "excluding profiling" would read as a general
  // small-business exemption, which is the opposite of what the list says.
  {case: '—', pack: 'france-data-protection.md', label: 'France has an art. 35(5) list', pattern: /only one of these four with an exemption list/i},
  {case: '—', pack: 'france-data-protection.md', label: 'the under-250 HR exemption excludes profiling', pattern: /with the exception of any recourse to profiling/},
  {case: '—', pack: 'france-data-protection.md', label: 'recruitment by selection algorithm is on the required list', pattern: /recruitment assisted by a selection algorithm/},
  {case: '—', pack: 'france-data-protection.md', label: 'ad personalisation on external data is on the required list', pattern: /personalising online advertising/},
  {case: '—', pack: 'france-data-protection.md', label: 'in doubt, the CNIL recommends doing one', pattern: /where there is doubt about whether an assessment is needed/},
  // The blocked source is a finding, not an omission. If this sentence goes,
  // the open rows read as nobody having tried.
  {case: '—', pack: 'france-data-protection.md', label: 'Legifrance is recorded as blocked, not unexamined', pattern: /bot-protection challenge instead of the page/},
  {case: '—', pack: 'france-data-protection.md', label: 'the count of the French list is deliberately withheld', pattern: /count is deliberately not quoted here/},

  // --- Belgium — the 2018 act and the GBA's own list --------------------------
  // Art. 222 is the only national penalty in these packs that is criminal, and
  // its point 1° states no mental element where 2° and 4° require serious
  // negligence or malice. Losing that asymmetry turns a sharp warning vague.
  {case: '—', pack: 'belgium.md', label: 'art. 222 criminal fine ceiling', pattern: /€120,000/},
  {case: '—', pack: 'belgium.md', label: 'the lawful-basis offence states no mental element', pattern: /\*\*none stated\*\*/},
  {case: '—', pack: 'belgium.md', label: 'the court may order the judgment published', pattern: /published in whole or in extract/},
  // Arts. 58 and 59 of the Belgian act are an impact-assessment duty for Titel 2
  // authorities, not for businesses. The pack has to keep saying so, because
  // the GBA's own art. 35(4) decision cites them and a reader follows that.
  {case: '—', pack: 'belgium.md', label: 'arts. 58 and 59 bind authorities, not businesses', pattern: /they bind police and judicial authorities, not a founder/},
  {case: '—', pack: 'belgium.md', label: 'the age of consent is 13', pattern: /door kinderen van 13 jaar of ouder/},
  {case: '—', pack: 'belgium.md', label: 'the penalties were restated with effect from 2026-09-01', pattern: /W 2026-03-30\/01/},
  {case: '—', pack: 'belgium.md', label: 'the GBA list entry with no scale qualifier', pattern: /no scale qualifier at all/},
  {case: '—', pack: 'belgium.md', label: 'the GBA reviews its list six-monthly', pattern: /Zesmaandelijks wordt de lijst/},
  {case: '—', pack: 'eu-gdpr-fines.md', label: 'art. 84 means art. 83 is not the whole picture', pattern: /other penalties applicable to infringements/},

  // --- Netherlands — data protection annex -----------------------------------
  // The Dutch art. 35(4) list is broader than the Regulation in one entry and
  // silent where the German list is explicit. Both halves have to survive:
  // the first stops a founder relying on art. 35(3)(a)'s legal-effects limb,
  // the second stops the German answer being carried across the border.
  {case: '—', pack: 'netherlands-data-protection.md', label: 'entry 15 omits the legal-effects limb', pattern: /drops that second limb/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'the Dutch list has no AI entry', pattern: /what is not on the list: artificial intelligence/i},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'the list is a formal Besluit under art. 35(4)', pattern: /gelet op artikel 35, vierde lid/},
  // Art. 40 UAVG is the provision a founder would otherwise read as a way out
  // of art. 22(1). It is not: it excludes profiling-based decisions.
  {case: '—', pack: 'netherlands-data-protection.md', label: 'art. 40 UAVG excludes profiling', pattern: /anders dan op basis van profilering/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'the UAVG sets no national DPO duty', pattern: /\*\*None\.\*\* The word `functionaris` appears twice/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'the AP test for systematic excludes incidental processing', pattern: /ad hoc or incidentally are not systematic/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'declining a DPIA must be substantiated', pattern: /substantiate properly why you choose not to carry out a DPIA/},
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
  // Withdrawn on 2026-11-11 against art. 6(1)(b): in a B2B pilot the contract
  // is with the company, so its named contact is not a party to it and their
  // data is an art. 6(1)(f) question. The layer quotes the old sentence inside
  // `*"` in the subsection that withdraws it, which the lookbehind excludes.
  {
    pack: 'eu-gdpr.md',
    label: "must not give basis (b) for a corporate client's contact",
    pattern: /(?<!\*")delivering an agreed service to a business customer's named contact is \(b\)/i,
  },
  // Withdrawn the same day: art. 30(5) is one sentence with three limbs, the
  // third carrying two alternatives, so "four" was an artefact of the
  // reproduction's list formatting. Both places the layer now says the old
  // number put it in double quotes, which the lookbehind excludes.
  //
  // There is deliberately NO entry for art. 35(3)'s missing `and extensive`,
  // the third claim withdrawn on 2026-11-11. The REQUIRED entry that keeps
  // `systematic and extensive` in eu-gdpr-dpo-dpia.md guards it from the other
  // side: dropping the qualifier again means deleting that phrase, which fails
  // there. One guard that works beats two that fight each other.
  {
    pack: 'eu-gdpr.md',
    label: 'must not count the art. 30(5) conditions',
    pattern: /(?<!")four conditions/,
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
  // Withdrawn on 2026-11-11 against the official text of art. 6:235 BW: being
  // small is not enough, because paragraph 3 excludes any party that
  // repeatedly uses its own standard terms. The corrected sentence says
  // "6:235(1) does not exclude you", which this pattern does not match, so no
  // lookbehind is needed — the bare paragraph reference is the claim itself.
  {
    pack: 'netherlands.md',
    label: 'must not say size alone preserves the unfair-terms protection',
    pattern: /6:235 does not exclude you/,
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
