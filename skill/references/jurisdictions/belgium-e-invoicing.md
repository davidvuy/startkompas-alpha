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

## What the invoice must actually say — `KB nr. 1` art. 5 §1

Source: [`KB nr. 1` of 29 December 1992, art. 5 §1](https://www.ejustice.just.fgov.be/eli/besluit/1992/12/29/1992003823/justel) · *primary legislation, **Justel consolidated text** reached by the ELI route — the same document this annex reads arts. 13ter, 13quater and 14 from* · **[checked 2026-11-13]**

**The e-invoicing duty is about the channel and the format. This is about the content**, and it applies the same way to a structured Peppol invoice as it did to a PDF. Art. 5 §1 lists twelve numbered items with several lettered sub-items; what follows is the part a solo B2B founder meets.

**The one a founder under the exemption will otherwise get wrong — 10° quater.** Where the special exemption regime of **arts. 56bis to 56undecies** is applied, the invoice must state **`"Bijzondere vrijstellingsregeling van belasting"`** *"in plaats van de belasting"* — in place of the tax. So being exempt is not simply charging no VAT: **there is a mandatory mention, and omitting it is a defect in the invoice.** See [belgium.md](belgium.md) §2 for the regime itself.

**The reverse-charge mention — 9° bis.** Where the tax is payable by the co-contractant, **`"Btw verlegd"`** goes in place of the rates and the total tax due. This is the ordinary case when a Belgian founder invoices a VAT-registered business in another member state for services.

**The customer's VAT number, and which one — 3° and 4°.** Item 3° requires the co-contractant's name or company name, address, and the **VAT identification number referred to in art. 50 of the Code**. Item **4°(a)** is the one that bites cross-border: for services under **art. 21 §2** of the Code, the invoice must carry *"het nummer waaronder de ontvanger voor btw-doeleinden is geïdentificeerd en waaronder hem de dienst werd verstrekt"* — **the number under which the recipient is identified and under which the service was supplied to them.** Not any number they have: the one the supply was made under. Item 4°(b) does the same for intra-Community goods supplies under art. 39bis first paragraph 1°.

**And where the operation happens elsewhere — 9°.** The total tax to be paid or revised is expressed in the national currency of the member state whose invoicing rules apply under art. 53decies §1, **and where the operation takes place in another member state, the invoice must say that the rate and the tax concern that member state**.

**The rest of the list, in the order the decree gives it:**

| # | What it requires |
| --- | --- |
| 1° | the issue or drawing-up date, **and a sequential number** from one or more series uniquely identifying the document, *"waaronder ze worden ingeschreven in het boek voor uitgaande facturen"* — the number under which it is entered in the outgoing-invoice book |
| 2° | the supplier's name or company name, the address of its **administrative or registered seat**, and its art. 50 VAT number. Inside a `btw-eenheid`, the member's own details replace these |
| 2° bis, 3° bis | where the person liable is not established in Belgium: the identity, address and capacity of a recognised responsible representative under art. 55 §1 or §2, or of a pre-approved person under art. 55 §3 with their VAT number |
| 5° | the date of the chargeable event, or of receipt of all or part of the price, **where that date is established and differs from the invoice date** |
| 6° | the data needed to determine the operation and fix the rate — the **usual description** of the goods and services, their quantity, **and the object of the services** |
| 7° | the art. 8bis §2 particulars for means of transport, with make, model, cylinder capacity, engine power and chassis number for cars, first-registration date for second-hand ones, and the **number plate** for work done on motor vehicles other than washing |
| 8° | **per rate or exemption**: the taxable base, the unit price excluding tax, and any prepayment discounts, price reductions and rebates not already in the unit price |
| 9° ter | **`"factuur uitgereikt door afnemer"`** where the customer issues the invoice in the supplier's name and for its account |
| 10° | where the operation is exempt: the **directive or national provision** it is exempt under, *"of enige andere vermelding dat de handeling is vrijgesteld"* |
| 10° bis, 10° ter | the fixed mentions for travel agents, and for second-hand goods, works of art, collectors' items and antiques |
| 11° | a reference to the earlier document or documents where several invoices are issued for the same operation — and *"de factuur mag de medecontractant niet debiteren voor een bedrag als belasting waarvoor hij reeds eerder werd gedebiteerd"* |
| 12° | **every other mention prescribed** under the Code or the decrees made under it. The list is not closed |

**Two readings worth carrying.** First, item 1° ties the invoice number to the outgoing-invoice book — and [belgium.md](belgium.md) §2 records that `KB nr. 1` art. 14 §4 relieves an exempt founder of that book **on condition** the documents are kept in an unbroken series of sequential numbers. The two provisions are the same requirement seen from different ends. Second, item 12° means a checklist built from art. 5 alone is not a complete checklist; it is the floor.

---

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
| `KB nr. 1` art. 5 §1's twelve items, including 4°(a), 9°bis and **10° quater** | 2026-11-13 | Primary — read in the Justel consolidated text and quoted. **The eval run's lead was right about 4°(a) and 9°bis and missed 10° quater**, which is the one that applies to every exempt founder's invoice |
| **10° quater**: an invoice under the arts. 56bis to 56undecies exemption must state `"Bijzondere vrijstellingsregeling van belasting"` in place of the tax | 2026-11-13 | Primary — read and quoted. Being exempt carries an invoice duty, not only a relief |
| Art. 5 §1 4°(a) requires the number the recipient is identified under **and under which the service was supplied** | 2026-11-13 | Primary — read and quoted. Not any VAT number the customer holds |
| Item 12° makes the list open: *"alle andere vermeldingen die worden voorgeschreven"* | 2026-11-13 | Primary — read. A checklist from art. 5 alone is the floor, not the whole duty |
| Whether an exempt business owes an intracommunautaire listing through Intervat, and an annual turnover report before 31 March | — | Open — the other half of the same lead, and **not in art. 5**. Art. 53sexies of the Code and `KB nr. 1` arts. 17 and 18 are where to look; none read |
| Registration, VAT, agreements, ownership and data protection | — | Elsewhere — [belgium.md](belgium.md) sections 1, 2 and 4 to 6, the last annexed again to [belgium-data-protection.md](belgium-data-protection.md) |

Next full recheck due: **2027-05-10**. Earlier on any change to art. 53 §2bis or to `KB nr. 1` arts. 13ter and 13quater, and before the founder issues their first real invoice.

No independent Belgian tax reviewer has reviewed this annex.
