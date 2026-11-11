# EU — GDPR: administrative fines

**This is an annex to [eu-gdpr.md](eu-gdpr.md) §3, not a layer of its own.** It exists because the GDPR layer went over this skill's 48 KB per-reference budget on 2026-11-11, and this was the part of it a founder reads once rather than on every pilot. Article 83 is the whole of it: the two tiers, what each one covers, the matters an authority must weigh, and how the figures compare with the AI Act for a small business.

**This is preparation, not advice.** It records what the Regulation's own articles state, with dates. Consequential data-protection questions need a qualified reviewer and the founder's own national supervisory authority.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

All of it is read from the consolidated text `02016R0679 — EN — 04.05.2016 — 000.002`; see [eu-gdpr.md](eu-gdpr.md) §0 for why that version and not the act as published.

---

## The two tiers — article 83(4) and (5)

Source: [Article 83 GDPR, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02016R0679-20160504) · *the authoritative text* · **[checked 2026-11-11]**

Art. 83(4) sets fines *"up to 10 000 000 EUR, or in the case of an undertaking, up to 2 % of the total worldwide annual turnover of the preceding financial year, whichever is higher"*, and its point (a) covers *"the obligations of the controller and the processor pursuant to Articles 8, 11, 25 to 39 and 42 and 43"*. Article 30 sits inside that range, so the register duty is in this tier.

**This is the lower of the two tiers.** Art. 83(5) sets 20 000 000 EUR or 4%, and covers the processing principles (arts. 5, 6, 7, 9), the data subject rights in arts. 12 to 22, the third-country transfers in arts. 44 to 49, obligations under national law adopted under Chapter IX, and non-compliance with a supervisory authority's order. So a missing register is penalised less heavily than processing with no lawful basis — worth knowing, and not a reason to relax, since both tiers are maxima that a national authority applies using the art. 83(2) criteria.

Art. 83(3) caps a pile-up: where several provisions are infringed for *"the same or linked processing operations"*, the total *"shall not exceed the amount specified for the gravest infringement"*. And art. 83(2) states that fines are imposed *"in addition to, or instead of"* the corrective measures in art. 58(2) — so a fine is one outcome among several, alongside a reprimand or an order to change the processing.

### No SME reduction — the GDPR and the AI Act point opposite ways

Do not present either figure as what a solo founder would actually be fined; they are ceilings. But the structure, not just the size, is worth knowing, because the skill's other penalty layer works the other way round:

| | GDPR, art. 83(4)–(6) | AI Act, art. 99(3)–(6) |
| --- | --- | --- |
| Ceiling for an undertaking | the amount **or** the percentage, *"whichever is higher"* | the amount or the percentage, *"whichever is higher"* |
| Special rule for SMEs and start-ups | **none — the regulation has no SME tier** | art. 99(6): *"whichever thereof is lower"* |
| So for a founder with little turnover | the percentage is small, so the **flat €10m / €20m amount** is the operative ceiling | the **percentage** is the operative ceiling |

The practical effect is the reverse of what a founder would guess from the headline numbers: the AI Act scales its maximum down to a small business and the GDPR does not. See [eu-ai-act.md](eu-ai-act.md) §6 for the other half. This is a comparison of two texts both read in full, not a view on how either is enforced.

### Article 83 is not the whole penalty picture — article 84

Art. 84(1) obliges every member state to *"lay down the rules on other penalties applicable to infringements of this Regulation in particular for infringements which are not subject to administrative fines pursuant to Article 83"*, effective, proportionate and dissuasive.

So the two tiers above are the **administrative** ceiling, and a member state may add to them. Belgium is the pack's worked example and what it added is **criminal**: art. 222 of the `wet van 30 juli 2018` punishes processing without a lawful basis under art. 6 GDPR with a fine of up to **€120,000**, and art. 225 lets the court order the judgment published in newspapers at the convicted person's expense. Read [belgium.md](belgium.md) §6 for which of its fourteen cases require serious negligence or malice and which do not.

**Germany has one too, and it is shaped very differently**: §42 BDSG carries up to three years' imprisonment, but only for conduct involving a large number of people plus a commercial purpose, or a profit or harm motive — see [germany-data-protection.md](germany-data-protection.md), which tabulates the two against each other. The Dutch `UAVG` adds no criminal layer in anything these packs have read, and its art. 14(3) simply adopts the art. 83 amounts. **So "the maximum fine" has a different answer per member state even though art. 83 is identical**, and a founder asking what it costs to get the lawful basis wrong needs the national pack, not this annex.

## Three things in article 83 a founder can actually influence

Art. 83(2) lists eleven matters an authority must have *"due regard"* to. Most are not a founder's to move. Three are:

- **(c)** *"any action taken by the controller or processor to mitigate the damage suffered by data subjects"*
- **(f)** *"the degree of cooperation with the supervisory authority, in order to remedy the infringement"*
- **(h)** *"the manner in which the infringement became known to the supervisory authority, in particular whether, and if so to what extent, the controller or processor notified the infringement"*

Point (h) closes the loop with [eu-gdpr.md](eu-gdpr.md) §4. The 72-hour notification is not only a duty whose breach is punishable — making it is an express mitigating factor in how any resulting fine is set. A founder weighing whether to notify a borderline breach should know that the article rewards notifying.

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| **Corrected on 2026-11-11:** the €10m/2% figures were attributed to a statement by the Belgian authority | 2026-11-11 | Withdrawn — that page carries no fine figures at all; refetched and confirmed it does not. The figures were right but the source was not |
| Art. 83(4) €10m/2% tier, and that point (a) covers arts. 25 to 39 | 2026-11-11 | Primary — article text read and quoted; art. 30 confirmed to fall inside the range |
| Art. 83(5) 20m/4% is the higher tier, and all five of its points | 2026-11-11 | Primary — article text read |
| The GDPR has no SME reduction, so "whichever is higher" leaves a small founder on the flat amount — the reverse of AI Act art. 99(6) | 2026-11-11 | Primary — both texts read in full; the comparison is of wording, not of enforcement |
| Art. 83(3) gravest-infringement cap; 83(2) fines in addition to or instead of art. 58(2) measures | 2026-11-11 | Primary — read |
| Art. 83(2)(c), (f) and (h): mitigation, cooperation and self-notification are express factors | 2026-11-11 | Primary — read and quoted |
| Every substantive duty whose breach these tiers price | — | Elsewhere — everything else about the GDPR is in [eu-gdpr.md](eu-gdpr.md) |

Next full recheck due: **2027-05-10**. Earlier if an amending act appears in the consolidated text's header, which [eu-gdpr.md](eu-gdpr.md) §0 records as absent on 2026-11-11.

No independent data-protection reviewer has reviewed this annex.
