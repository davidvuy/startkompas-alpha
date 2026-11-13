# Belgium — B2B e-invoicing (annex)

**This is an annex to [belgium.md](belgium.md) §3, not a pack of its own.** It exists because the Belgian pack went over this skill's 48 KB per-reference budget. §3 of the pack states the duty, the date and who is in scope; the statute, the implementing decree and the format rules are here. The same split as [germany-e-invoicing.md](germany-e-invoicing.md), and for the same reason: a dated, fast-moving topic with its own statute outgrows a section.

**This annex is preparation, not advice.** It records what the Code, the royal decree and the FOD's own material state, with dates. Two of the sources were read **as published** rather than consolidated, and the rows say which.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

---


**Already in effect.** Applies to invoices *created, issued or sent* from **2026-01-01** (`opgemaakt, uitgereikt of verzonden vanaf 1 januari 2026`).

Source: [official e-invoicing FAQ — general B2B questions](https://efactuur.belgium.be/nl/FAQ/algemene-vragen-b2b) · *the administration's own FAQ, not the statute* · **[checked 2026-11-10]**

| Situation | Position |
| --- | --- |
| Belgian VAT-taxable business invoicing another Belgian VAT-taxable business (B2B) | **In scope — must issue structured e-invoices** |
| Business using the small-business VAT exemption regime (turnover ≤ €25,000) | **In scope — the obligation applies** |
| Special agricultural flat-rate regime | In scope **at least for receiving** B2B invoices (`minstens voor het ontvangen van B2B-facturen`) |
| VAT taxpayer not established in Belgium, without a fixed establishment, even if VAT-identified here | **Out of scope** — the FAQ notes the law will be adjusted on this point |
| Selling only to consumers (B2C) | Not mandatory |
| A person with only article 44 VAT-exempt activities | **Not bound, on the face of art. 53 §2bis.** The duty bites only where the taxable person makes *"andere leveringen van goederen of diensten … dan die die krachtens artikel 44 zijn vrijgesteld"* — supplies **other than** art. 44 exempt ones. See the statute below |

Format and transport: a structured electronic invoice over the **Peppol** network. Legal hook: new article 53, §2bis of the Belgian VAT Code.

### The duty itself — art. 53 §2bis of the VAT Code

Source: [`Wet van 6 februari 2024`, art. 3, 2°, published 2024-02-20](https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=nl&la=N&cn=2024020602&table_name=wet) · *primary legislation, **read as published** in the inserting law; Justel's consolidated Code was not reachable* · **[checked 2026-11-12]**

The duty falls on *"de in België gevestigde belastingplichtige"* and is limited three ways on its face:

- **By what is supplied.** It applies where the person makes supplies *"andere … dan die die krachtens artikel 44 zijn vrijgesteld"* — **other than art. 44 exempt ones** — to a taxable person who must give their VAT number under art. 53quater §1, or to a VAT group through a member's sub-number. So a person supplying only art. 44 exempt services has no structured-invoice duty for them.
- **By regime, and it is not the one a founder expects.** Excluded are taxable persons under *"de in artikel 56 bedoelde regeling"* — **art. 56, the flat-rate `forfaitaire` regime**. **Art. 56ter, the €25,000 exemption, is not excluded.** That is the statutory basis for what §2 of this pack says from the FOD's brochure: being under the small-business exemption does **not** take you out of the mandate.
- **By status.** Also excluded are **bankrupt** taxable persons, for the activity they were declared bankrupt for.

**And the standard is named in the statute, not only in the decree.** The second paragraph requires the invoices to meet the standards on semantics, syntax and transmission laid down by the King; the third allows a party to depart from those *"mits akkoord tussen de betrokken partijen"* on condition that they observe **`EN 16931-1` and `CEN/TS 16931-2`**. Read that with art. 13quater of `KB nr. 1` below: the agreement frees you from Peppol as a network, not from the European standard, and not from being able to use Peppol at all.

### The implementing rule, read — `KB nr. 1` arts. 13ter and 13quater

Source: [`KB nr. 1` of 29 December 1992, arts. 13ter and 13quater](https://www.ejustice.just.fgov.be/eli/besluit/1992/12/29/1992003823/justel) · *primary legislation, Justel consolidated text; both articles inserted by `KB 2025-07-08/02`, art. 3, **in force 2026-01-01*** · **[checked 2026-11-12]**

**Art. 13ter first paragraph** is where "Peppol" actually comes from. A taxable person obliged under art. 53 §2bis to issue a structured electronic invoice issues it:

1. *"in overeenstemming met de Europese norm voor elektronische facturering en de lijst van syntaxen ervan op grond van Richtlijn 2014/55/EU zoals geconcretiseerd in het formaat **Peppol BIS in de UBL-versie**"*; and
2. *"via het **Peppol-transmissienetwerk**"*.

**Art. 13ter second paragraph lets the parties agree otherwise — within a limit.** By agreement between the parties concerned, another format and any other digital channel may be used, **on condition that the format satisfies the European standard and its list of syntaxes**. So the escape is from Peppol as a *network*, not from the European standard.

**And art. 13quater closes the escape halfway.** A taxable person relying on that agreement *"beschikt over de technische middelen die het mogelijk maken om een gestructureerde elektronische factuur uit te reiken en te ontvangen overeenkomstig artikel 13ter, eerste lid"* — they must still **have the technical means to issue and receive over Peppol**. Agreeing a different channel with one customer does not excuse a founder from being Peppol-capable.

**What that means for a founder's tooling decision.** The question is not "which invoicing tool do I like" but "can it do Peppol BIS in UBL over the Peppol network". A bilateral agreement to exchange something else is possible and is not a way to avoid the capability.

**Why this matters most for this pack's default user.** A Belgian solo founder running a small B2B pilot is very likely under the €25,000 exemption regime — and that regime does **not** remove this obligation. A PDF emailed to a Belgian business customer is not a structured electronic invoice. Do not treat a PDF-only workflow as sufficient by default.

Equally: do not push the founder toward a paid invoicing vendor without an established requirement and their own authority to spend. Establish the actual parties, place of establishment, VAT status and transaction type, then confirm the route with an accountant.

Recheck triggers: the announced legal adjustment for non-established taxpayers; any change in VAT status; a non-Belgian or non-business customer; before the founder issues their first real invoice.

---

**One thing the FAQ announces and no instrument yet carries.** It refers to a coming legal adjustment for **non-established taxable persons**. That instrument was not traced, so its content and date are **[not researched]**, and the open row below says so rather than implying the FAQ is the rule.

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| B2B e-invoicing scope and start date | 2026-11-10 | Authority — the official e-invoicing FAQ, not the statute |
| Art. 53 §2bis: the duty reaches supplies **other than** art. 44 exempt ones, so a person with only art. 44 activities is not bound for them | 2026-11-12 | Primary — the inserting law read as published and quoted. The consolidated Code was not reachable, so a later amendment would not show |
| Art. 53 §2bis excludes the **art. 56 flat-rate** regime and bankrupt taxable persons — **not** the art. 56ter exemption | 2026-11-12 | Primary — read. This is the statutory basis for the brochure point in [belgium.md](belgium.md) §2 |
| The statute names `EN 16931-1` and `CEN/TS 16931-2` as the floor for any agreed departure | 2026-11-12 | Primary — read and quoted |
| Art. 13ter `KB nr. 1`: Peppol BIS in UBL over the Peppol network, with a format-conforming alternative only by agreement | 2026-11-12 | Primary — the article read and quoted; inserted by `KB 2025-07-08/02`, in force 2026-01-01 |
| Art. 13quater: a party using that agreement must still be able to issue and receive over Peppol | 2026-11-12 | Primary — read and quoted |
| The announced legal adjustment for non-established taxable persons | — | Open — named in the FAQ, not yet traced to an instrument |
| What an exempt founder's **cross-border** invoice must carry, and what else they must file | — | Open — lead from the 2026-11-13 eval run, unverified: `KB nr. 1` art. 5 §1 was reported to require the customer's VAT number at 4°(a) and a reverse-charge mention such as *"Btw verlegd"* at 9°bis, and an art. 56ter business to owe an intracommunautaire listing through Intervat plus an annual turnover report before 31 March. Art. 5 has not been read here — art. 14 has — so none of this is established. It is the first article to read on a recheck, because a founder invoicing a Dutch client meets it immediately |
| Registration, VAT, agreements, ownership and data protection | — | Elsewhere — [belgium.md](belgium.md) sections 1, 2 and 4 to 6, the last annexed again to [belgium-data-protection.md](belgium-data-protection.md) |

Next full recheck due: **2027-05-10**. Earlier on any change to art. 53 §2bis or to `KB nr. 1` arts. 13ter and 13quater, and before the founder issues their first real invoice.

No independent Belgian tax reviewer has reviewed this annex.
