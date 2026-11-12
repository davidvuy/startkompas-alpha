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
  {case: 'C4', pack: 'belgium-e-invoicing.md', label: 'exemption regime still in scope', pattern: /exemption regime[^|]*\|\s*\*\*In scope/i},
  {case: 'C4', pack: 'belgium.md', label: 'Peppol named', pattern: /\bPeppol\b/},
  {case: 'C5', pack: 'belgium.md', label: 'Walloon abolition date', pattern: /2025-10-01/},
  {case: 'C5', pack: 'belgium.md', label: 'conflict preserved as a conflict', pattern: /source conflict/i},
  {case: 'C6', pack: 'belgium.md', label: '2029 threshold is EUR 28,000', pattern: /\|\s*2029\s*\|\s*€28,000\s*\|/},
  // The EU side of the Belgian threshold. Both halves matter: the 2013
  // authorisation explains the figure, and the 2020 directive explains why a
  // raise no longer needs one — which stops "the EU allows it" being read as
  // "it is in force".
  {case: '—', pack: 'belgium.md', label: 'the EU authorisation behind the EUR 25,000', pattern: /2013\/53\/EU/},
  {case: '—', pack: 'belgium.md', label: 'a raise needs no derogation now', pattern: /a derogation is no longer needed/i},
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
  {case: '—', pack: 'belgium-data-protection.md', label: 'Wegwijs is January 2018, CBPL-era', pattern: /\*\*January 2018\*\*/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'BOOST brochures attributed to KU Leuven', pattern: /CiTiP KU Leuven/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'breach filing needs the MijneGov role', pattern: /GBA_Documentum_Vertegenwoordiger/},
  {case: '—', pack: 'belgium.md', label: 'XI.301 makes the software-user floor dwingend recht', pattern: /XI\.299, §§ 2 en 3, en XI\.300 is van dwingend recht/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'part 2 window is 21 calendar days', pattern: /21 calendar days/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'part 1 alone does not discharge the duty', pattern: /part 1 alone does not discharge the duty/i},
  {case: '—', pack: 'belgium-data-protection.md', label: 'supplementing act identified, not read', pattern: /wet van 30 juli 2018/},

  // --- Germany ---------------------------------------------------------------
  {case: 'C14', pack: 'germany.md', label: 'receiving mandatory from 2025-01-01', pattern: /2025-01-01/},
  // §8 Nr. 1 is an allowance on the SUM, not on each item, and the two items a
  // software founder meets — office rent and licence fees — are the least
  // obvious members of it.
  {case: '—', pack: 'germany.md', label: 'the §8 Nr. 1 allowance is on the sum', pattern: /soweit die Summe den Betrag von 200 000 Euro übersteigt/},
  {case: '—', pack: 'germany.md', label: 'licence fees enter the trade-tax add-back', pattern: /temporary grant of rights, in particular concessions and licences/},
  {case: '—', pack: 'germany.md', label: '§9 Nr. 1 cuts the Grundsteuer actually booked', pattern: /die im Erhebungszeitraum als Betriebsausgabe erfasste Grundsteuer/},
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
  // The GoBD amendment of 2025-07-14. The trap it is written against is the
  // tidy-minded founder who keeps the readable PDF and lets a conversion
  // delete the XML, which is the part that must survive.
  {case: '—', pack: 'germany-e-invoicing.md', label: 'the structured part is the one to keep', pattern: /ist es ausreichend, wenn nur der strukturierte Teil aufbewahrt wird/},
  {case: '—', pack: 'germany-e-invoicing.md', label: 'a format conversion must not delete the XML', pattern: /nicht durch eine Formatumwandlung/},
  {case: '—', pack: 'germany-e-invoicing.md', label: 'the GoBD amendment does not shorten the eight years', pattern: /It changes \*what\* has to be kept, not \*how long\*/},
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
  // These five moved to the copyright annex on 2026-11-12, when netherlands.md
  // went over the per-reference budget. check-facts named all five the moment
  // the split landed, which is the cheapest possible way to learn that an
  // assertion outlived the file it was written against.
  {case: '—', pack: 'netherlands-copyright.md', label: 'transfer needs a deed under art. 3:95 BW', pattern: /art\. 3:95 BW/},
  {case: '—', pack: 'netherlands-copyright.md', label: 'narrow construction follows the human creator', pattern: /not whoever holds the title/i},
  // The Dutch software-user provisions invert the pattern of the other three.
  // Both halves must survive: the protection of error correction, and the
  // refusal to conclude anything from the silence in 45k-45m.
  {case: '—', pack: 'netherlands-copyright.md', label: 'art. 45j protects error correction from contract', pattern: /kan niet bij overeenkomst\s+worden verboden/},
  {case: '—', pack: 'netherlands-copyright.md', label: 'silence in 45k-45m is not read as waivable', pattern: /Do not conclude from that silence/i},
  // The directive settles what the Dutch text leaves unsaid. Without this the
  // annex reads as if the silence were simply unresolved.
  {case: '—', pack: 'netherlands-copyright.md', label: 'art. 8 of the Software Directive voids such clauses', pattern: /shall be null and void/},
  // And the pack must keep the pointer, or the annex is five files away from
  // the reader who needs it.
  {case: '—', pack: 'netherlands.md', label: 'the pack points at the copyright annex', pattern: /netherlands-copyright\.md/},

  // The three states were in three different conditions on 2026-11-12, and the
  // spread IS the finding. A pack that keeps Germany and loses the other two
  // reads as if a national regime were the normal case.
  {case: '—', pack: 'eu-ai-act-national.md', label: 'the Dutch implementing act is a closed consultation, not law', pattern: /Consultatie gesloten|is \*\*not in force\*\*/},
  {case: '—', pack: 'eu-ai-act-national.md', label: 'the AP is proposed for work-related high-risk systems', pattern: /hoog-risico AI-toepassingen, zoals in werk/},
  {case: '—', pack: 'eu-ai-act-national.md', label: 'Belgium has designated nobody, in the department’s own words', pattern: /De implementatie van het governancekader in België is momenteel lopende/},
  {case: '—', pack: 'eu-ai-act.md', label: 'the absence of a supervisor is not the absence of a duty', pattern: /not the absence of a duty/},
  {case: '—', pack: 'eu-ai-act-national.md', label: 'no designated authority is not nothing applying', pattern: /not\*\* the same as nothing applying/},
  {case: '—', pack: 'eu-ai-act.md', label: 'the layer points at the national annex', pattern: /eu-ai-act-national\.md/},

  // --- EU — unsolicited commercial communication -----------------------------
  // The layer exists because art. 13(5) hands the member states a choice. If
  // that sentence goes, the four national answers below read as four mistakes.
  {case: '—', pack: 'eu-eprivacy.md', label: 'the layer does not hold identically, unlike the GDPR layer', pattern: /it does not hold identically/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'art. 13(5) applies the opt-in to natural persons only', pattern: /shall apply to subscribers who are natural persons/},
  // Germany. The word in §7(2) Nr. 2 is "Adressaten", not "Verbraucher", and
  // that single word is why a German cold email needs consent.
  {case: '—', pack: 'eu-eprivacy.md', label: 'German email needs prior express consent of the Adressat', pattern: /vorherige ausdrückliche Einwilligung des Adressaten/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'a German call to a non-consumer needs only presumed consent', pattern: /zumindest mutmaßliche Einwilligung/},
  // The sanction route, which is the part a founder actually feels. §20 omits
  // email; without this the pack reads as if a regulator enforced it.
  {case: '—', pack: 'eu-eprivacy.md', label: 'email is not an administrative offence in Germany', pattern: /\*\*Email is not in that list\.\*\*/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'the German route is a competitor injunction under §8', pattern: /jedem Mitbewerber/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'German telephone consent is kept five years, against the French three', pattern: /keep the proof for \*\*five years\*\*/},
  // Netherlands. The claim rests on a definition in a different article, so
  // both halves are guarded.
  {case: '—', pack: 'eu-eprivacy.md', label: 'the Dutch opt-in covers companies', pattern: /natuurlijke persoon of rechtspersoon/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'the Dutch sender carries the burden of proof', pattern: /kan aantonen/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'the Dutch carve-out needs an address published for that purpose', pattern: /designated and made public for receiving/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'art. 11.7 Tw is supervised by the ACM, not the AP', pattern: /\*\*Art\. 11\.7 is the ACM's\*\*/},
  // Belgium, which is the harshest of the four and the easiest to understate.
  {case: '—', pack: 'eu-eprivacy.md', label: 'Belgian advertising email without consent is criminal', pattern: /Art\. XV\.120 WER: those who send advertising by email/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'the Belgian ceiling has a turnover alternative', pattern: /6 \*\*%\*\* of total annual turnover|\*\*6 %\*\* of total annual turnover/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'the Belgian burden of proof is in art. XII.13 §4', pattern: /incombe au prestataire/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'the Belgian carve-out is for impersonal addresses', pattern: /if the electronic contact details used are `impersonnelles`/},
  // The decree names a repealed law. A reader who checks it alone concludes
  // the exemptions lapsed, so the saving provision has to stay.
  {case: '—', pack: 'eu-eprivacy.md', label: 'art. 6 of the inserting law saves the 2003 decree', pattern: /présumées faire référence aux dispositions équivalentes/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'Belgium requires an acknowledgement of an unsubscribe', pattern: /\*\*send an acknowledgement of receipt by email\*\*/},
  // Two words reading "niveau" on two different scales, one of them ten times
  // the other. This warning is the whole reason the figures are safe to quote.
  {case: '—', pack: 'eu-eprivacy.md', label: 'the WER niveau scale is not the Penal Code niveau scale', pattern: /Same word, different scales/},
  // Researched on 2026-11-12: the surcharge law exists and reaches special
  // laws, so the figures in art. XV.70 may not be the real ceilings. What the
  // pack must never do is multiply them itself and present the product as law.
  {case: '—', pack: 'eu-eprivacy.md', label: 'the pack refuses to give a multiplied Belgian figure', pattern: /never a multiplied number/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'the surcharge reaches special laws, in the words of the statute', pattern: /zelfs van na deze wet daterende wetten en reglementen/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'Belgian criminal penalties are a moving target as at 2026-09-01', pattern: /assumed stale/},

  // The only obligation in these four packs that is an ACTION before each
  // contact rather than a basis for making contact at all. A founder working a
  // Belgian call list either has this in their process or breaches it on every
  // call, so losing the row would cost more than losing a fine figure.
  {case: '—', pack: 'eu-eprivacy.md', label: 'Belgium requires a Bel me niet meer check before every call', pattern: /gaat de oproeper voorafgaandelijk na/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'a Belgian human call is opt-out, not consent', pattern: /zich hiertegen niet kennelijk heeft verzet/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'Belgian unwanted communications carry the lower niveau 2', pattern: /\`sanctie van niveau 2\`/},
  {case: '—', pack: 'eu-eprivacy.md', label: 'the Belgian channel split runs the other way from the German one', pattern: /the cheaper channel is the one with the procedural trap/},

  // --- The method references that decide whether a pack is opened ------------
  // A name with a slash resolves from the skill root, not from the packs
  // directory. These two files hold the instructions that send a reader to
  // eu-eprivacy.md at the moment outreach is being prepared. Before
  // 2026-11-12 neither mentioned it, so the layer was reachable only by
  // someone who already thought to open the jurisdiction index — which is the
  // one reader who did not need the pointer.
  {case: '—', pack: 'references/pilot-conditions.md', label: 'condition 5 routes outreach lawfulness to the ePrivacy layer', pattern: /jurisdictions\/eu-eprivacy\.md/},
  {case: '—', pack: 'references/offer-and-market.md', label: 'interview preparation routes outreach lawfulness to the ePrivacy layer', pattern: /jurisdictions\/eu-eprivacy\.md/},
  {case: '—', pack: 'references/offer-and-market.md', label: 'B2B relevance is not presented as making an approach lawful', pattern: /do not tell a founder that business-to-business or professional relevance makes the approach lawful/},

  // Belgium's 10 % tolerance is the only one of the four, and the repeal of
  // KB nr. 19 of 2014 is why the question stayed open for a day. Both must
  // survive: the rule, and the reason the old instrument cannot be cited.
  {case: '—', pack: 'belgium-e-invoicing.md', label: 'Peppol BIS in UBL over the Peppol network is the default', pattern: /Peppol BIS in de UBL-versie/},
  {case: '—', pack: 'belgium-e-invoicing.md', label: 'agreeing another channel does not excuse Peppol capability', pattern: /beschikt over de technische middelen/},
  {case: '—', pack: 'belgium.md', label: 'a 10 per cent tolerance on the Belgian VAT threshold', pattern: /ten hoogste tien pct\./},
  {case: '—', pack: 'belgium.md', label: 'KB nr. 19 of 2014 is repealed, not merely old', pattern: /\[Opgeheven\] <KB 2024-12-15\/04/},
  {case: '—', pack: 'belgium.md', label: 'entering the exemption triggers an input-VAT revision', pattern: /gelijkgesteld met het verlies van de hoedanigheid van belastingplichtige/},
  {case: '—', pack: 'belgium.md', label: 'spouses are counted separately, joint activity together', pattern: /ongeacht hun huwelijksvoorwaarden/},
  {case: '—', pack: 'eu-vat-sme.md', label: 'the Belgian tolerance is recorded in the per-pack table', pattern: /A 10 % tolerance, and it is the only one/},

  // --- Shared EU layers ------------------------------------------------------
  {case: '—', pack: 'eu-gdpr.md', label: '72-hour notification', pattern: /72 hours/},
  // The layer's opening told a reader the national packs hold only the name of
  // the authority. After the national statutes were read that was badly wrong,
  // and it is the sentence that decides whether the national pack is opened.
  {case: '—', pack: 'eu-gdpr.md', label: 'the national packs carry more than the authority', pattern: /Reading this layer without the national pack gives the wrong answer/},
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
  {case: 'C23', pack: 'germany-data-protection.md', label: '§38(1) sentence 2 applies regardless of headcount', pattern: /unabhängig von der Anzahl/},
  {case: 'C23', pack: 'germany-data-protection.md', label: '§6(4) bars dismissal of a compulsory DPO', pattern: /Die Kündigung des Arbeitsverhältnisses ist unzulässig/},
  // Entry 11 of the German art. 35(4) list. It converts the AI DPIA question
  // from arguable to listed, which is the sharpest national fact in any pack.
  {case: '—', pack: 'germany-data-protection.md', label: 'DSK entry 11 covers AI steering interaction', pattern: /Steuerung der Interaktion mit den Betroffenen/},
  // The checklist is version 0.9 and scoped to retail. Losing either would turn
  // a provisional draft for a different business type into general authority.
  {case: '—', pack: 'germany-data-protection.md', label: 'the BayLDA checklist is a provisional draft', pattern: /Version \*\*0\.9\*\*|Version 0\.9/},
  {case: '—', pack: 'germany-data-protection.md', label: 'its scope excludes high-risk processing', pattern: /kein KI-Startup/},
  {case: '—', pack: 'germany-data-protection.md', label: 'the DPF condition is per provider', pattern: /DPF list of the US Department of Commerce/},
  // §42 BDSG. Both halves matter: the German offence needs scale plus a
  // commercial purpose, which is why it must not be read as the Belgian one,
  // and §42(4) protects the breach notification from being used against its
  // maker — the answer to a question a founder asks before notifying.
  {case: '—', pack: 'germany-data-protection.md', label: '§42 BDSG needs scale and a commercial purpose', pattern: /large number of persons\*\*, without entitlement, \*\*acting commercially\*\*/},
  {case: '—', pack: 'germany-data-protection.md', label: '§42(4) protects the notification from its maker', pattern: /nur mit Zustimmung des Meldepflichtigen/},
  {case: '—', pack: 'germany-data-protection.md', label: 'freelancers are inside the private-sector authority', pattern: /freiberuflich Tätigen/},

  // Art. 6:235(3) BW is the paragraph that can cost a founder the unfair-terms
  // protection the rest of §4 describes, and it turns on their own conduct
  // rather than their size. It was found only by reading the official text.
  {case: 'C25', pack: 'netherlands.md', label: 'art. 6:235(3) excludes a repeat user of its own terms', pattern: /meermalen dezelfde of nagenoeg dezelfde algemene voorwaarden/},
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

  // The Dutch trap: silence on a data subject request removes the claimant's
  // deadline altogether. And the secrecy duty art. 30(4) imposes on the
  // controller personally, which no policy creates and none can remove.
  // A draft list is not a list. The AP's own process - EDPB opinion, then the
  // Staatscourant - is what makes the difference, and it is the sentence a
  // reader needs before relying on anything they have heard about it.
  // The two parts of the AP's breach test that a founder gets wrong under
  // pressure: the encryption exception is three conditions, not one, and a
  // polite stranger is not a reliable recipient.
  {case: '—', pack: 'netherlands-data-protection.md', label: 'the encryption exception has three cumulative conditions', pattern: /three cumulative conditions/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'an unknown recipient is not a reliable recipient', pattern: /geen zekerheid over de ontvanger/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'the Dutch art. 35(5) list is a draft, valid only after the Staatscourant', pattern: /is de lijst officieel geldig/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'the draft list is aimed at the mkb and the self-employed', pattern: /mkb en zelfstandige ondernemers in Nederland/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'no time limit on the petition if the controller did not answer in time', pattern: /is de indiening van het verzoekschrift niet aan een termijn gebonden/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'art. 30(4) puts the controller personally under a secrecy duty', pattern: /is hij verplicht tot geheimhouding van de gegevens/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'art. 41 is one general power, not a carve-out per right', pattern: /buiten toepassing laten/},
  {case: '—', pack: 'netherlands-data-protection.md', label: 'criminal-law data needs one of the six art. 32 grounds', pattern: /six grounds/},

  // --- France — prospecting, which is the first thing a pilot actually does ---
  // The pack carried the opposite of the first assertion below until
  // 2026-11-12. A B2B founder told they need consent before the first email
  // does not send the email, so losing this row costs more than a wrong fine
  // figure would: it stops the work the skill exists to start.
  {case: '—', pack: 'france-data-protection.md', label: 'B2B prospecting rests on legitimate interest, not consent', pattern: /\*\*legitimate interest — no prior consent\*\*/},
  {case: '—', pack: 'france-data-protection.md', label: "the CNIL's own B2B example, which anchors the rule in a real case", pattern: /directeur informatique d'une entreprise/},
  // Writing to contact@ is outside the regime entirely. This is the one line
  // that changes how a founder builds the outreach list, so it is guarded.
  {case: '—', pack: 'france-data-protection.md', label: 'generic company addresses fall outside the rules', pattern: /ne sont pas soumises aux principes rappelés ci-dessus/},
  {case: '—', pack: 'france-data-protection.md', label: 'an online account without a purchase is not a client', pattern: /creating an online account is not enough/},
  // The telephone regime changed three months before this was written. A pack
  // that loses the date reads as if the old opt-out regime still ran.
  {case: '—', pack: 'france-data-protection.md', label: 'telephone prospecting to consumers needs consent from 2026-08-11', pattern: /### Telephone prospecting: the regime changed on 2026-08-11/},
  {case: '—', pack: 'france-data-protection.md', label: 'consent is valid one year and its proof kept three', pattern: /\*\*valid for one year\*\*/},
  // Guessing prenom.nom@ is standard practice and the CNIL ruled on it in
  // October 2026. Both halves matter: what makes it lawful, and the two cases
  // it says fail before you start.
  {case: '—', pack: 'france-data-protection.md', label: 'no online presence defeats address reconstitution a priori', pattern: /no identifiable online presence at all/},
  {case: '—', pack: 'france-data-protection.md', label: 'the objection the CNIL asks for is wider than art. 21', pattern: /without a reason tied to their particular situation/},
  // The prospect clock, where the CNIL draws a line a founder would not guess.
  {case: '—', pack: 'france-data-protection.md', label: 'a click counts as contact from the prospect, opening an email does not', pattern: /la simple ouverture d'un courriel ne devrait pas être considérée/},
  // Without this, every retention row above it reads as binding law.
  {case: '—', pack: 'france-data-protection.md', label: 'the référentiels are not binding', pattern: /Les référentiels ne sont pas contraignants/},
  // The analytics exemption is narrow, and the two conditions that make it
  // narrow are the ones a founder's analytics vendor usually breaks.
  {case: '—', pack: 'france-data-protection.md', label: "the audience exemption needs anonymous statistics for the publisher alone", pattern: /for the publisher's exclusive account/},
  {case: '—', pack: 'france-data-protection.md', label: 'the 13- and 25-month figures are recommendations, not conditions', pattern: /recommendations rather than conditions/},

  // §26(8) is what brings a single CV inside the German employment rules, and
  // §35(3) is what turns a clause in the founder's own contract into a defence
  // against an erasure request. Both are German-specific and neither is
  // guessable from the GDPR.
  {case: '—', pack: 'germany-data-protection.md', label: 'applicants count as employees under §26(8)', pattern: /Bewerberinnen und Bewerber für ein Beschäftigungsverhältnis/},
  {case: '—', pack: 'germany-data-protection.md', label: 'a contractual retention period can displace the erasure right', pattern: /vertragliche Aufbewahrungsfristen/},
  {case: '—', pack: 'germany-data-protection.md', label: 'the backup carve-out is triple-locked, not a one-line excuse', pattern: /triple-locked/},
  {case: '—', pack: 'germany-data-protection.md', label: 'every BDSG exemption carries a duty to record why', pattern: /The documentation duty survives every exemption/},

  // --- Belgium — the 2018 act and the GBA's own list --------------------------
  // Art. 222 is the only national penalty in these packs that is criminal, and
  // its point 1° states no mental element where 2° and 4° require serious
  // negligence or malice. Losing that asymmetry turns a sharp warning vague.
  // The authority disclaims its own helper documents. A pack that cites them
  // as if they were the authority's reading of the law overstates them.
  {case: '—', pack: 'belgium-data-protection.md', label: 'the GBA takes no position on its own toolbox documents', pattern: /neemt geen standpunt in over de inhoud van deze documenten/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'using the model register is not a defence', pattern: /is sensible and is not a defence/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'art. 222 criminal fine ceiling', pattern: /€120,000/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'the lawful-basis offence states no mental element', pattern: /\*\*none stated\*\*/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'the court may order the judgment published', pattern: /published in whole or in extract/},
  // Arts. 58 and 59 of the Belgian act are an impact-assessment duty for Titel 2
  // authorities, not for businesses. The pack has to keep saying so, because
  // the GBA's own art. 35(4) decision cites them and a reader follows that.
  {case: '—', pack: 'belgium-data-protection.md', label: 'arts. 58 and 59 bind authorities, not businesses', pattern: /they bind police and judicial authorities, not a founder/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'the age of consent is 13', pattern: /door kinderen van 13 jaar of ouder/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'the penalties were restated with effect from 2026-09-01', pattern: /W 2026-03-30\/01/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'the GBA list entry with no scale qualifier', pattern: /no scale qualifier at all/},
  {case: '—', pack: 'belgium-data-protection.md', label: 'the GBA reviews its list six-monthly', pattern: /Zesmaandelijks wordt de lijst/},
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
  // The Dutch KOR, read on 2026-11-11. The mid-year rule and the
  // per-entrepreneur rule are the two a founder gets wrong by assuming:
  // that a threshold settles at year end, and that a second activity gets
  // its own allowance.
  {case: '—', pack: 'netherlands.md', label: 'crossing EUR 20,000 ends the KOR immediately', pattern: /Uw afmelding gaat dan direct in/},
  {case: '—', pack: 'netherlands.md', label: 'the KOR is per entrepreneur, not per activity', pattern: /per ondernemer en niet per onderneming of per verrichte activiteit/},
  {case: '—', pack: 'netherlands.md', label: 'purchase invoices must be kept inside the KOR', pattern: /U moet wel uw inkoopfacturen bewaren/},
  {case: '—', pack: 'netherlands.md', label: 'reverse-charged purchases do not count toward the threshold', pattern: /reverse-charged to you as the customer/},

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
  // Art. 6 read on 2026-11-11. Three things have to survive together, because
  // each one alone gives a founder the wrong answer: the 2026 carve-out that
  // takes ordinary software out of "safety component", the Annex III entry
  // that names recruitment screening, and the sentence that cancels the
  // derogation for anything that profiles people.
  {case: '—', pack: 'eu-ai-act.md', label: 'art. 6(1a) excludes convenience features from safety components', pattern: /solely used for non-safety related aspects of user assistance/},
  {case: '—', pack: 'eu-ai-act.md', label: 'the two limbs of the safety-component definition', pattern: /fulfils a safety function for that product or AI system/},
  {case: 'C24', pack: 'eu-ai-act.md', label: 'Annex III names recruitment screening', pattern: /to analyse and filter job applications/},
  {case: 'C24', pack: 'eu-ai-act.md', label: 'profiling cancels the art. 6(3) derogation', pattern: /always be considered to be high-risk where the AI system performs profiling/},
  // Using the derogation is itself a documented, registered decision.
  {case: '—', pack: 'eu-ai-act.md', label: 'art. 6(4) requires documentation and registration', pattern: /registration obligation in art\. 49\(2\)/},
  // CE marking is the fact that tells a founder high risk is product
  // regulation and not a policy exercise.
  {case: 'C24', pack: 'eu-ai-act.md', label: 'art. 16 requires a QMS, a conformity assessment and CE marking', pattern: /affix the CE marking/},
  // Art. 4a is a permission. Its last sentence is the guard against reading it
  // as a duty to bias-test on special-category data.
  {case: '—', pack: 'eu-ai-act.md', label: 'art. 4a creates no obligation to bias-test', pattern: /does not create any obligation to conduct such bias detection/},
  // Germany's national regime, read on 2026-11-11. The €50,000 and the art.
  // 86(1) offence are the two a founder can act on; the authority is the
  // answer to a question the German annex recorded as unsettled in May 2025.
  {case: '—', pack: 'eu-ai-act-national.md', label: 'the Bundesnetzagentur is the German authority', pattern: /Die Bundesnetzagentur ist die für die Einhaltung der Verordnung/},
  {case: '—', pack: 'eu-ai-act-national.md', label: 'the German national offences are capped at EUR 50,000', pattern: /Geldbuße bis zu fünfzigtausend Euro/},
  {case: '—', pack: 'eu-ai-act-national.md', label: 'failing to explain a high-risk decision is a German offence', pattern: /explanation required by \*\*art\. 86\(1\)\*\*/},
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
    pack: 'france-data-protection.md',
    label: 'B2B prospecting must not read as requiring consent',
    pattern: /\*\*Prospecting by electronic means\*\* requires consent/,
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
