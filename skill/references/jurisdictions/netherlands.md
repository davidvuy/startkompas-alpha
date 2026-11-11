# Netherlands — jurisdiction pack

Scope: a solo founder established in the Netherlands, selling a digital service to Dutch business customers, no employees, small bounded pilot.

Out of scope and requiring separate research: consumer (B2C) sales, employees or subcontractors, regulated professions, cross-border supply beyond the EU-KOR note below, physical goods, payment or financial services, health data.

**This pack is preparation, not advice.** Consequential steps need a Dutch accountant or the Belastingdienst itself.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[carried YYYY-MM-DD, not refetched]** means earlier research was reused without refetching it. **[not researched]** means no source was consulted — the topic is open.

---

## 1. Registration and formalities

Sources · *official chamber of commerce* · **[checked 2026-11-10]**
- [KVK — Business Register and the Tax Administration](https://www.kvk.nl/en/starting/business-register-and-tax-administration/)
- [KVK — registration](https://www.kvk.nl/en/registration/)

**Who must register.** All entrepreneurs and legal entities must register in the Handelsregister. The statutory test: you have an enterprise if you **independently supply goods or services to others with the intention to make a profit**. A hobby is not an enterprise — earning little or nothing from it means no registration, even if it takes a lot of time.

A founder may register **at most one** `eenmanszaak`, though one sole proprietorship can carry several trade names and activities.

**Relationship to the Belastingdienst — resolved.** For a sole proprietor, KVK **passes the details to the Belastingdienst automatically**. The founder then receives the VAT number (`btw-nummer`) and the VAT identification number (`btw-id`) **by post** from the Belastingdienst. The KVK page gives no timeframe for that; secondary sources cite roughly two weeks or ten working days, which is **not confirmed by the official page** — do not quote a number.

A `bv` or `nv` is different: that registration goes through a civil-law notary rather than automatically, and yields an RSIN.

**Cost: €85.15, one-off.** Source: [KVK — registration fee](https://www.kvk.nl/en/registration/registration-fee/) · *official chamber of commerce* · **[checked 2026-11-10]**

It covers registering a new company or organisation in the Handelsregister, including a restart, takeover, demerger or merger that produces a new KVK number. KVK invoices by email or post depending on how you registered, payable through a payment portal. It is **tax-deductible** and **updated annually** for inflation — so quote it as "€85.15 as at 2026-11-10", not as a fixed figure. A Business Register extract is a separate optional cost.

Note the contrast with France, where registering a micro-entreprise is **free**.

Establish before proposing any administrative action: whether the founder is registered and under which SBI activity codes; whether they hold a `btw-id`; whether they are in the KOR; and their legal form.

**Open:** the required identification documents and the processing timeframe are **[not researched]**. The commonly cited "two weeks" for the `btw-id` is not on any page read here.

---

## 2. VAT — kleineondernemersregeling (KOR)

Threshold: **€20,000** turnover per calendar year.

Source: [Belastingdienst — kleineondernemersregeling](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/hoe_werkt_de_btw/kleineondernemersregeling/) · *the tax authority's own guidance, not the Wet OB* · **[checked 2026-11-10]**

Eligible: natural persons (sole traders), combinations of natural persons such as partnerships, and legal entities such as foundations, associations and limited companies.

Effect — the Belastingdienst describes the KOR as a VAT exemption:
- no VAT charged to customers
- no VAT return filed
- **no input VAT reclaimed on costs**

That last point is the trade-off. A founder with significant startup purchases may be worse off inside the KOR.

### What still applies inside the KOR — resolved

Source: [Belastingdienst — invoicing when you use the KOR](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/factuureisen/aangepaste_regels_facturen/u_maakt_gebruik_van_de_kleineondernemersregeling) · *the tax authority's own guidance* · **[checked 2026-11-10]**

- **Issuing an invoice is not required**: *"u bent niet verplicht om een factuur uit te reiken"*.
- If you do issue one, you must **state on it that you use the KOR**: *"vermeldt u op de factuur dat u gebruik maakt van de kleineondernemersregeling"*.
- **No VAT on the invoice**: *"U zet geen btw op de factuur"*.

**Confirmed on 2026-11-11:** a KOR user need not issue invoices or file returns, and must still retain **purchase invoices** — see below.

Note the contrast with Belgium, where a business under the small-business exemption **must** issue structured e-invoices. The Dutch position is the opposite on both counts — no invoicing duty and no e-invoicing mandate. Do not carry either answer across.

### Crossing €20,000 ends it the same day, not at year end

Source: [Belastingdienst — `Wat betekent meedoen met de kleineondernemersregeling (KOR)?`](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/hoe_werkt_de_btw/kleineondernemersregeling/wat-betekent-meedoen-met-de-kleineondernemersregeling/wat-betekent-meedoen-met-de-kleineondernemersregeling) · *national tax authority* · **[checked 2026-11-11]**

Two different rules for leaving, and the difference is the whole point:

| Leaving the KOR | When it takes effect |
| --- | --- |
| **by choice** — you may deregister at any moment | the **first day of the next quarter** |
| **because turnover passed €20,000 in one calendar year** | *"moet u zich meteen afmelden voor de KOR. Uw afmelding gaat dan direct in"* — **immediately** |

So a founder who crosses in June does not finish the year exempt. That matches the Union-threshold rule in [eu-vat-sme.md](eu-vat-sme.md) and France's `seuil majoré`, and it is the opposite of the comfortable assumption that thresholds are settled at year end. **Watch the running total, not the annual figure.**

### Four conditions on the turnover count that a founder will not guess

Source: [Belastingdienst — `Voorwaarden voor deelname aan de kleineondernemersregeling (KOR)`](https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/kor-voorwaarden) · *national tax authority* · **[checked 2026-11-11]**

- **The €20,000 must hold for the calendar year you register in *and* the year before it.** A good year disqualifies you for the next one.
- **Inside the KOR, your turnover is simply what you charge**, because there is no VAT in it. Outside it, the VAT you charge does not count toward the figure.
- **Counted:** supplies taxed with Dutch VAT, **and certain VAT-exempt turnover**. Which exempt turnover counts is the member-state implementation of art. 288 of the VAT Directive — see [eu-vat-sme.md](eu-vat-sme.md).
- **Not counted:** VAT on private use; **investment goods used in the business**; **domestic supplies where the VAT is reverse-charged to you as the customer**; supplies taxed in another country; an intra-Community acquisition.

### The KOR belongs to the entrepreneur, not to the activity

The same page states it twice, with worked examples, because it is the rule people get wrong: *"De keuze voor de KOR geldt namelijk per ondernemer en niet per onderneming of per verrichte activiteit."*

- One `eenmanszaak` doing two unrelated things under **two subnumbers** is **one** entrepreneur. Add the turnover of all subnumbers together, and if you choose the KOR it applies to **all** of them. Its own example: a hairdresser who also does administrative work cannot apply the KOR to the consumer-facing half and charge VAT to business clients on the other.
- But an `eenmanszaak` and a `vof` are **two** entrepreneurs, assessed separately. Its example has the sole trader inside the KOR while the partnership, over €20,000, cannot use it.

For a founder adding a second line of business, that is a decision point: the new activity does not get its own threshold, and it cannot opt out on its own.

### Five things the KOR switches off or revokes

From the same page, and none of them follows from "I do not charge VAT":

| | What happens |
| --- | --- |
| **Article 23 licence** (import VAT deferred to the return) | *"Dan trekken wij deze vergunning in wanneer u zich aanmeldt voor de KOR"* — withdrawn on joining |
| **The import scheme (`Invoerregeling`, IOSS)** | cannot be combined with the KOR; end that participation first |
| **Opted-taxed letting of immovable property to a business** | not available inside the KOR, and an existing option stops — no VAT on the rent from then on |
| **Previously deducted input VAT** | may have to be **revised** (`btw-herziening`) on joining |
| **Two supplies stay under normal VAT rules even inside the KOR** | supplying **immovable property used in the business**, and supplying a **new or nearly new means of transport to another EU country** |

That last row is the same carve-out Germany makes in §19(6) UStG for new vehicles — see [germany.md](germany.md) §2. Two member states, two national schemes, the same hole in both.

**And the purchase-invoice question is settled.** The page states it twice: *"U moet wel uw inkoopfacturen bewaren"* — you do not have to issue invoices, you do not file returns, and you still **keep your purchase invoices**. This pack previously carried that as secondary and unconfirmed.

### EU-KOR — resolved

Source: [Belastingdienst — kleineondernemersregeling in de EU (EU-KOR)](https://www.belastingdienst.nl/wps/wcm/connect/nl/btw/content/kleineondernemersregeling-in-de-europese-unie-eu-kor) · *the tax authority's own guidance* · **[checked 2026-11-10]**

- **Union turnover threshold: €100,000** — *"uw totale omzet in de EU is niet hoger dan € 100.000 per kalenderjaar"*, counting turnover in all EU countries including the Netherlands.
- The **national threshold of each country also applies** where you use the exemption. Both limits must hold.
- **Establishment requirement:** established in the Netherlands, with the principal place of business here if operating from several EU locations. A business not established in the EU cannot participate.
- **Quarterly reporting:** an `opgaaf kwartaalomzet` to the Dutch tax authority, covering turnover achieved across the whole EU that quarter. This is a real recurring obligation that the domestic KOR does not have — do not present EU-KOR as simply "KOR but abroad". The directive's own requirements behind it — prior notification, an `EX` identification number issued within 35 working days, the one-month filing deadline, the explicit "or 0" for a nil quarter, and a **15 working day** notice on breaching the Union threshold — are in [eu-vat-sme.md](eu-vat-sme.md).
- Available since **2025-01-01** — **now primary-confirmed**: art. 3(1) of Council Directive (EU) 2020/285 required member states to apply the scheme from that date. The €100,000 Union cap is art. 284(2)(a). See [eu-vat-sme.md](eu-vat-sme.md).

Recheck triggers: turnover approaching €20,000 or €100,000; the start of a new calendar year; any customer in another EU country.

---

## 3. B2B e-invoicing — no domestic mandate yet

**There is currently no mandatory domestic B2B e-invoicing obligation in the Netherlands.**

Source: [European Commission — eInvoicing in the Netherlands](https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108895/eInvoicing+in+The+Netherlands) · *official EU source* · **[checked 2026-11-10]** — stating: "There is no business-to-business (B2B) mandate. In the Netherlands eInvoicing is not mandatory for B2B transactions."

**B2G is different.** Suppliers to central government bodies must issue structured e-invoices in accepted formats since **2019-11-01**. A founder whose pilot customer is a central-government body is therefore already in scope. · **[checked 2026-11-10]**

### Announced future obligation — now read in the letter itself

Source: `Contourenbrief elektronisch factureren en rapporteren`, [Tweede Kamer 31066-1576](https://www.tweedekamer.nl/kamerstukken/brieven_regering/detail?id=2026Z18679&did=2026D42856) of **2026-09-11**, signed E. Eerenberg, staatssecretaris van Financiën, together with its `Bijlage 1` (`Contouren elektronisch factureren en rapporteren`, document 2026D42857) · *the government's own letter to parliament, first-hand: both the letter and the annex extracted and read. A statement of intent, not law* · **[checked 2026-11-11]**

This pack previously carried these dates from secondary reporting, with the letter itself marked as not researched. It has now been read, and the annex is where the cabinet's reasoning actually sits.

**The phasing the cabinet prefers**, quoted from the annex:

| Date | Obligation |
| --- | --- |
| **2030-07-01** | *"invoering van binnenlandse en intracommunautaire e-facturatie en digitale rapportage voor EU-transacties (inclusief verwervingen)"* |
| **2031-07-01** | *"invoering van de digitale rapportageverplichting voor binnenlandse transacties"* |

Both dates and the whole timetable below are confirmed by the primary document. The deliberate sequencing is the point: e-invoicing first, domestic reporting a year later, *"geeft ruimte om te leren en bij te sturen waar nodig"*.

**The timetable, from the letter's closing paragraph:**

- **this autumn (2026)** — *"Beoogd is om dit najaar de internetconsultatie te starten"*. That is now; check whether it has opened.
- **before the 2027 summer recess** — *"voor het zomerreces van 2027 het wetsvoorstel bij uw Kamer in te dienen"*.
- **before 2028-07-01** — *"Het streven is om de parlementaire behandeling af te ronden voor 1 juli 2028"*, two years before entry into force, explicitly to leave a test phase for businesses and the Belastingdienst.

The letter also records that the draft bill goes to the **Autoriteit Persoonsgegevens** for advice on suitability, subsidiarity, proportionality and legal certainty, and that the cabinet will amend the text if the AP finds it wanting. So the e-invoicing file and the data-protection file in §6 below meet in the same bill.

#### EN 16931 only — and the letter does not mention Peppol

This pack previously said *"Peppol is recommended, not mandated. The announced model is decentralised and Peppol-based on EN 16931."* **The annex mentions Peppol nowhere at all**, and does not describe the model as decentralised. Both were carried from secondary reporting.

What the cabinet actually chose is narrower and more definite: prescribe **only** EN 16931 and allow no other invoice norm — *"Door alleen de EN16931 voor te schrijven en geen andere factuurnormen toe te staan komt er uniformering en efficiëntie"*. The directive would have permitted additional national norms for domestic transactions; the Netherlands declines that option.

Two consequences worth telling a founder. EN 16931 (Commission Implementing Decision (EU) 2017/1870) admits **only two syntaxes, UBL 2.1 and UN/CEFACT CII**, which the annex names as a drawback for sectors on their own formats such as `DICO` and `GS1`. And since Peppol is a *network* while EN 16931 is a *format*, "Peppol" is how a Dutch business is likely to send an EN 16931 invoice in practice without that being what the law requires — do not conflate the two, and do not present the network as an obligation.

#### The KOR carve-out, stated properly

The old wording — "businesses in the KOR are reported to be exempt from the domestic obligation" — was both unsourced and incomplete in the way that matters most to this pack's default founder.

The cabinet's position in §6.c of the annex is to keep the KOR's existing `factureringsontheffing` in place, and it spells out what that leaves:

> KOR users would be *"gevrijwaard van een verplichting tot elektronische facturatie en digitale rapportage en enkel in staat moeten zijn om een e-factuur te **ontvangen** van andere ondernemers"*

So, under the proposal: **exempt from issuing and from reporting, but required to be able to receive.** That is the same receive-versus-issue split the Belgian and German packs turn on, and the Dutch pack had only half of it. A Dutch founder under the KOR planning for 2030 needs an inbox that can take a structured invoice, not an invoicing tool.

Three more things the annex settles:

- **No extra micro-business threshold.** The cabinet considered a separate exemption threshold below the KOR and rejected it: the KOR already *"op logische wijze"* provides one at €20,000, so an additional turnover threshold is *"dubbel en niet noodzakelijk"*. EY had advised against phasing by company size at all.
- **Why the KOR survives.** *"reeds enkele honderdduizenden ondernemers"* use it, and imposing the obligation on them would have *"zeer ingrijpende gevolgen voor de gehele bedrijfsvoering"*. There is, the annex says, no policy reason to abolish it.
- **Opting in does not pull in the reporting.** If parties agree commercially to e-invoice anyway, the KOR is no obstacle — *"In dat geval bestaat echter geen verplichting om de gegevens uit de factuur te rapporteren"*. So a KOR founder who chooses to send structured invoices does not thereby acquire a reporting duty.

The annex adds that the KOR is **currently under evaluation**, including whether to raise its threshold — judged on the KOR's own purpose of easing administrative burden rather than through ViDA. That is a live recheck trigger for §2's €20,000 figure.

**Still: none of this is law.** It is a ministerial letter and its annex, setting out `kabinetsuitgangspunten`, with the bill not yet in internet consultation. Confirm against the enacted text before any founder plans around it. Four years out, the dates, the norm choice and the KOR carve-out can all still move — and the annex itself describes them as preferences, not decisions.

Formats and networks in Dutch use: Peppol network, Peppol BIS 3.0, SI-UBL 2.0, NLCIUS, and Digipoort as the central-government gateway. These describe current practice and the B2G channel, not the future obligation. · *from the European Commission page cited above* · **[checked 2026-11-10]**

Recheck triggers: the Q4 2026 consultation opening; the bill's submission; any central-government or public-sector customer; a customer in another EU country.

---

## 4. Agreements and unfair terms

Dutch law protects against unreasonable standard terms — and the protection is calibrated by **how big you are**, which cuts in a founder's favour.

Sources · **[checked 2026-11-10]**
- [art. 6:233 BW](https://wetten.overheid.nl/BWBR0005289) and [art. 6:235 BW](https://wetten.overheid.nl/BWBR0005289) · *primary legislation, read on the official portal in the version `Geldend van 16-07-2026`* · **[checked 2026-11-11]**
- the consumer-list and `reflexwerking` points · *secondary legal commentary, consistent*

**Art. 6:233** makes a term in general conditions **voidable** on either of two grounds, quoted:

> *"indien het, gelet op de aard en de overige inhoud van de overeenkomst, de wijze waarop de voorwaarden zijn tot stand gekomen, de wederzijds kenbare belangen van partijen en de overige omstandigheden van het geval, onredelijk bezwarend is voor de wederpartij"*

> *"indien de gebruiker aan de wederpartij niet een redelijke mogelijkheid heeft geboden om van de algemene voorwaarden kennis te nemen"*

The second ground is independent of content: **failing to give the counterparty a real chance to read the terms is itself enough**, however reasonable the terms are.

| Provision | Effect |
| --- | --- |
| **art. 6:233 BW** | Voidable on either ground above |
| **art. 6:235(1) BW** | Cannot be invoked by a party with **50 or more persons employed**, or by a legal entity that had **most recently published its annual accounts** at the time the agreement was concluded |
| **art. 6:236 / 6:237 BW** | The black list (deemed unreasonably onerous) and the grey list (presumed so) open with the same words: *“Bij een overeenkomst tussen een gebruiker en een wederpartij, **natuurlijk persoon, die niet handelt in de uitoefening van een beroep of bedrijf**”*. Read that test, not “consumer” |
| `reflexwerking` | Where a small entrepreneur's position closely resembles a consumer's, a term's appearance on the consumer black or grey list is relevant to the open test in 6:233 · *secondary* |

Note for maintainers, kept because the workaround is reusable: a plain fetch of the Boek 6 BW page on `wetten.overheid.nl` returns the wrong part of a 351,743-character document, which is how these articles came to rest on a reproduction in the first place. Reading them on 2026-11-11 worked by loading the page in a browser and slicing it to the article in the page itself, so only the article is ever extracted. The same method read art. 7:400 out of Boek 7, which is over a million characters. It is a tooling limit, not a source disagreement — and it was worth defeating: the reproduction had been right about arts. 233 and 235(1) and silent about art. 235(3), which is the paragraph that matters most to the reader of this section.

**For a solo founder this is usually favourable — but article 6:235 has two more paragraphs, and one of them can take it away.**

- **Art. 6:235(3):** the grounds in arts. 233 and 234 *"kan geen beroep worden gedaan door een partij die meermalen dezelfde of nagenoeg dezelfde algemene voorwaarden in haar overeenkomsten gebruikt"* — **a party that itself repeatedly uses the same or nearly the same general terms cannot invoke them.** Nothing about size. A founder who has their own standard terms and uses them with every client is inside this paragraph, and the protection the rest of this section describes is gone.
- **Art. 6:235(2):** the art. 233(a) ground may **also** be invoked by a party for whom the terms were used by an authorised representative, provided the counterparty repeatedly concludes contracts on the same or nearly the same terms.
- **Art. 6:235(4):** the limitation period of art. 3:52(1)(d) BW starts on the day after the term is invoked against you — so the clock runs from the moment the other side relies on the clause, not from signature.

Paragraph 3 is the one to raise before anything else in this section, because it is the only one that turns on the founder's **own** conduct rather than their size, and because §4's own advice — have your own terms, and give the counterparty a real chance to read them — is what puts a founder inside it. Whether using one set of terms repeatedly in a handful of pilots is enough to engage art. 6:235(3) is a judgment for a Dutch lawyer; the statute sets no number. Do not tell a founder they are protected because they are small without raising it.

Subject to that, the size calibration still cuts in a small party's favour. You are a small party, so art. 6:235(1) does not exclude you — you *can* invoke 6:233 against a larger counterparty's standard terms, and `reflexwerking` may import the consumer lists in your favour. The failure to give you a real chance to read the terms is itself a ground.

The mirror image matters too: once a founder grows past 50 employees or publishes accounts, that protection disappears.

Use [../pilot-conditions.md](../pilot-conditions.md) §3 for the discussion sheet, and give the counterparty a genuine opportunity to read your own terms — under 6:233 that is not a formality.

**Open:** the BW articles were not read in primary form, and the precise boundaries of `reflexwerking` are case law. Confirm with a Dutch lawyer before relying on either.

---

## 5. Ownership and permitted use

Source: [article 7 Auteurswet](https://wetten.overheid.nl/BWBR0001886/2026-01-01) · *primary legislation* · **[checked 2026-11-10]**

> *"Indien de arbeid, in dienst van een ander verricht, bestaat in het vervaardigen van bepaalde werken van letterkunde, wetenschap of kunst, dan wordt, tenzij tusschen partijen anders is overeengekomen, als de maker van die werken aangemerkt degene, in wiens dienst de werken zijn vervaardigd."*

| Situation | Rule |
| --- | --- |
| Work created **in the service of another** (`in dienst`), where the job consists of creating such works | The **employer is deemed the maker** — not merely the holder of the rights. This is `fictief makerschap`. |
| **Commissioned work** under an `overeenkomst van opdracht` | **Does not qualify.** Article 7 requires a `dienstbetrekking`; a contract for services does not meet it. · *secondary, consistent* |
| Contrary agreement | Permitted — *"tenzij tusschen partijen anders is overeengekomen"*. Article 7 is `regelend recht`. |

What an `overeenkomst van opdracht` is, which is what makes that exclusion concrete: [art. 7:400 BW](https://wetten.overheid.nl/BWBR0005290) · *primary legislation, read on the official portal in the version `Geldend van 08-10-2026`* · **[checked 2026-11-11]** — an agreement under which one party, the `opdrachtnemer`, undertakes to perform services for the other **other than under an employment contract**, excluding creating a tangible work, safekeeping goods, publishing, and transporting persons or goods.

**And art. 7:400(1) excludes four things as well as employment.** An `opdracht` is work that consists of something *other than* bringing about **a work of a material nature**, keeping things, publishing works, or transporting persons or goods. Each of those has its own title in Boek 7, so a founder whose deliverable is physical is under `aanneming van werk` and not under this regime at all — which matters because the ownership rule above is keyed to the contract type. For software and services the exclusion does not bite.

Two more provisions a service founder is actually held to. **Art. 7:400(2)**: arts. 401 to 412 apply *"tenzij iets anders voortvloeit uit de wet, de inhoud of aard van de overeenkomst van opdracht of van een andere rechtshandeling, of de gewoonte"* — so most of the `opdracht` regime is a **default** that the contract, the nature of the engagement or custom can displace, which is the same `regelend recht` character as art. 7 Auteurswet above. And **art. 7:401**: *"De opdrachtnemer moet bij zijn werkzaamheden de zorg van een goed opdrachtnemer in acht nemen"* — the statutory standard of care a pilot is measured against, and the one sentence to put in front of a founder who asks what they are promising.

So the two are defined against each other: art. 7:400 says "not an employment contract", and art. 7 Auteurswet requires exactly that employment relationship. A founder engaged on an `opdracht` therefore falls outside art. 7 by definition, not by argument.

The Dutch construction is distinctive: the employer is treated as the **author**, where Germany and France transfer only the economic rights and Belgium transfers economic rights for employees. Moral rights therefore sit differently here. That difference is why the packs do not share this section.

Practical consequence for a solo founder: article 7 does **not** apply to you, because a commission is not a `dienstbetrekking`. The default is that **you remain the maker and keep the rights** in commissioned software, and a client who wants them needs an agreed transfer. A founder who paid a freelancer gains nothing from article 7.

### Article 8 — a risk a founder would not guess

Source: [art. 8 Auteurswet](https://wetten.overheid.nl/BWBR0001886/2026-01-01) · *primary legislation, the official portal — the same consolidation as arts. 2 and 7 above, `Geldend van 01-01-2026`* · **[checked 2026-11-11]**

> *"Indien eene openbare instelling, eene vereeniging, stichting of vennootschap, een werk als van haar afkomstig openbaar maakt, zonder daarbij eenig natuurlijk persoon als maker er van te vermelden, wordt zij, tenzij bewezen wordt, dat de openbaarmaking onder de bedoelde omstandigheden onrechtmatig was, als de maker van dat werk aangemerkt."*

Where a public institution, association, foundation or company **publishes a work as its own without naming any natural person as maker**, that organisation is deemed the maker — unless it is proved the publication was unlawful in the circumstances.

**Why this matters to a founder, and it is the opposite direction from art. 7.** Article 7 is about employment and does not reach an `opdracht`. Article 8 is about **publication**, and it does not care how the work was commissioned. So a client company that publishes the founder's work under its own name, without crediting them, can be **deemed the maker** of it.

The protection is the rebuttal — proving the publication was unlawful — which is a dispute, not a safeguard. The practical instruction is simple and worth giving every time: **be named**. Put attribution in the deliverable and in the contract. For a Dutch founder that is not vanity; it is what keeps art. 8 from operating against them.

### Article 2 — what a client can actually acquire, and how

Source: [art. 2 Auteurswet](https://wetten.overheid.nl/BWBR0001886/2026-01-01) · *primary legislation, read per paragraph* · **[checked 2026-11-10]**

This is the Dutch counterpart to Germany's §31(5) purpose rule, and it is **stricter in two ways Germany is not**. Art. 2(3) in its own words:

> *"De overeenkomst op grond waarvan het auteursrecht geheel of gedeeltelijk wordt overgedragen of waarin een exclusieve licentie wordt verleend, wordt schriftelijk aangegaan. De overdracht of de verlening van een exclusieve licentie door de maker (…) omvat alleen die bevoegdheden die uitdrukkelijk in de overeenkomst staan vermeld of die uit de aard en de strekking ervan noodzakelijkerwijs voortvloeien. De levering vereist voor overdracht geschiedt ingevolge artikel 95 van Boek 3 van het Burgerlijk Wetboek bij een daartoe bestemde akte."*

| What the client wants | What it takes |
| --- | --- |
| **Ownership** (`overdracht`, whole or partial) | A **written** agreement, **and** delivery by a **deed** (`akte`) under art. 3:95 BW. Payment, an invoice or an email thread is not delivery |
| An **exclusive** licence | A **written** agreement. No deed needed, but writing is not optional |
| A **non-exclusive** licence | Art. 2(2) permits a licence for all or part of the copyright and imposes **no form requirement** on it. The writing rule in art. 2(3) reaches only transfers and exclusive licences |
| Anything **not written down** | Read narrowly: a transfer or exclusive licence *by the maker* covers **only** the powers expressly stated, **or** those that *necessarily* follow from the agreement's nature and purport |

**The narrow-construction rule protects the human creator specifically.** Art. 2(5) disapplies the second sentence of art. 2(3) — and the immunity from attachment in art. 2(4) — to a maker under **art. 7 or art. 8**. So an employer deemed the maker, or a company deemed the maker by publishing uncredited, does **not** get the benefit of narrow construction when it grants rights onward. The protection follows the person who created the work, not whoever holds the title.

**What this means in practice, in both directions:**

- **For the founder.** You cannot accidentally transfer ownership. No deed, no transfer — and an exclusive licence without writing does not bind you either. If a client claims they own the software because they paid for it, art. 2(3) is the answer.
- **For the client, and this is the part founders get wrong when they are the buyer.** Paying a freelancer buys you no ownership and no exclusivity unless you executed the right instrument. A founder who commissioned work and wants to resell or sublicense it needs that in the document.
- **For both.** Name the uses in writing. Under the narrow-construction rule, anything unnamed falls to whatever *necessarily* follows from the contract's nature and purport — which is the same decision a German court makes under §31(5) UrhG, decided by a court rather than by the parties.

**Still open:** whether, and how far, a **non-exclusive licence is implied** by a commission — the statute imposes no form requirement but does not say one arises. That is case law, and it is **[not researched]**. Likewise the practical content of *"aard en strekking"* for commissioned software: **[not researched]**.

### Articles 45j–45m — and the Dutch inversion

Source: [Auteurswet, Hoofdstuk VI, `Bijzondere bepalingen betreffende computerprogramma's`](https://wetten.overheid.nl/BWBR0001886/2026-01-01) · *primary legislation, articles read individually* · **[checked 2026-11-10]**

The Netherlands has the same four software-user provisions as Belgium, Germany and France. **It arranges the unwaivable part differently, and the difference runs the opposite way.**

| | What the lawful acquirer or user may do | Can a contract remove it? |
| --- | --- | --- |
| **45j** | Reproduction by the **rechtmatige verkrijger** necessary for the work's intended use — *"Tenzij anders is overeengekomen"*, so the general rule is displaceable. **But the second sentence is not:** reproduction in the course of **loading, displaying, or correcting errors** *"kan niet bij overeenkomst worden verboden"* | **The general rule yes; loading, displaying and error correction no** |
| 45k | A **reservekopie** where necessary for the intended use | The text carries **no** express nullity clause |
| 45l | **Observe, study and test** the work's operation to find the underlying ideas and principles, during acts they are authorised to perform under art. 45i | The text carries **no** express nullity clause |
| 45m | Copy and translate the code where **indispensable for interoperability** of an independently created program, under three conditions, with three bans on reuse of the information | The text carries **no** express nullity clause |

**This is the outlier among the four packs, in both directions at once.**

- **Error correction is protected here and displaceable everywhere else.** Belgium (XI.299 §1), Germany (§69d(1)) and France (L122-6-1 I) all let a contract take error correction away. Art. 45j's second sentence does not. So a Dutch client cannot be contractually barred from fixing bugs — the reverse of the advice that holds in the other three.
- **And the backup copy, the study right and decompilation carry no express nullity clause** in the articles read, where Belgium says `dwingend recht` (XI.301), Germany says `nichtig` (§69g(2)) and France says `réputées nulles` (L122-6-1 VIII).

**Do not conclude from that silence that those three are waivable in the Netherlands — the Directive says they are not.**

Source: [Directive 2009/24/EC on the legal protection of computer programs](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32009L0024) · *the directive all four packs implement* · **[checked 2026-11-11]**

Art. 8, second paragraph: *“Any contractual provisions contrary to Article 6 or to the exceptions provided for in Article 5(2) and (3) shall be null and void.”* Art. 5(2) is the back-up copy, art. 5(3) the right to observe, study and test, and art. 6 is decompilation — the three the Dutch text is silent about. Art. 5(2) goes further still and says in the exception itself that the back-up *“may not be prevented by contract”*.

And the one the Directive leaves open is the one art. 45j protects: art. 5(1) applies *“in the absence of specific contractual provisions”*, so **use for the intended purpose, including error correction, is contractually variable at Directive level** — which makes art. 45j sentence 2 more protective than the Directive requires, not less.

So the Dutch position is the reverse of how the silence reads: the Netherlands wrote in a protection the Directive did not demand and left out the one it did. Belgium (art. XI.301 WER), Germany (§69g(2) UrhG) and France (L122-6-1 VIII) each transposed art. 8 expressly. **A clause in a Dutch contract purporting to bar a back-up, study or decompilation is contrary to art. 8 of the Directive**, and the question that remains is how a Dutch court gives effect to that — directive-conform interpretation of art. 45k to 45m, or some other route — not whether the clause is good. **How a Dutch court gives effect to art. 8 — directive-conform interpretation of arts. 45k to 45m, or another route — is [not researched]** and is a question for a Dutch lawyer. What this pack establishes is the shape of the problem: **the express nullity provision the other three states wrote is not in the text of 45k, 45l or 45m, and the Directive behind all four says such clauses are null and void.** That is a reason to get Dutch advice on a clause touching them, and not a reason to rely on the silence in either direction.

Use [../pilot-conditions.md](../pilot-conditions.md) §4 for the inventory discipline. Never infer ownership or clearance from payment alone, from AI generation, or from a repository's top-level licence.

---

## 6. Data protection

**The GDPR layer is shared — read [eu-gdpr.md](eu-gdpr.md)** for the controller/processor test, the processor-contract duties, the sub-processor rule, the register obligation, the 72-hour breach notification and the security principle.

**Dutch specifics.** The supervisory authority is the **Autoriteit Persoonsgegevens (AP)**. Its own guidance confirms the three obligations a small Dutch business meets first · *official authority pages* · **[checked 2026-11-10]**:

- **Verwerkingsregister** — the `registerplicht`: keep an overview of all processing activities. The AP notes a well-maintained register is what lets you assess quickly which organisations and categories of data a breach affects.
- **Verwerkersovereenkomst** — the agreement must be in writing and must state that the processor acts **only on the controller's written instructions**.
- **Datalek melden** — report to the AP **within 72 hours** of discovering the breach; the AP is explicit that failing to do so puts you in breach. A processor must warn its controller without undue delay.

**The Dutch specifics beyond those three are in [netherlands-data-protection.md](netherlands-data-protection.md):** what the `UAVG` adds and — more usefully — what it does **not** add, **the AP's binding art. 35(4) list of 17 processing types**, the AP's twelve-item step plan for a controller, its five steps for a breach, and the questions its notification form asks before the 72-hour clock runs out.

---

## Pack maintenance

One row per substantive claim. The Status column uses the seven labels defined in [README.md](README.md#the-status-column-is-a-fixed-vocabulary).

| Claim | Check date | Status |
| --- | --- | --- |
| No domestic B2B e-invoicing mandate in force | 2026-11-10 | Authority — official EU source read |
| B2G obligation since 2019-11-01 | 2026-11-10 | Authority — official EU source read |
| Phasing: 2030-07-01 e-invoicing plus EU-transaction reporting, 2031-07-01 domestic reporting | 2026-11-11 | Authority — the Contourenbrief annex read and both dates quoted. **Still not law**: a letter and its annex, bill not yet in consultation |
| Legislative timetable: consultation this autumn, bill before the 2027 summer recess, passage before 2028-07-01 | 2026-11-11 | Authority — the letter read and its closing paragraph quoted |
| The draft bill goes to the Autoriteit Persoonsgegevens for advice | 2026-11-11 | Authority — the letter read |
| **Corrected on 2026-11-11:** this pack said the announced model is "decentralised and Peppol-based" and that Peppol is recommended | 2026-11-11 | Withdrawn — the annex does not mention Peppol at all, nor describe the model as decentralised. Both came from secondary reporting |
| The cabinet will prescribe EN 16931 only, allowing no other invoice norm, and EN 16931 admits only UBL 2.1 and UN/CEFACT CII | 2026-11-11 | Authority — annex §7 read and the `kabinetsuitgangspunt` quoted |
| KOR users would be exempt from **issuing** and reporting but required to be able to **receive** | 2026-11-11 | Authority — annex §6.c read and quoted. The pack previously had only the exemption half |
| No additional micro-business threshold below the KOR: `dubbel en niet noodzakelijk` | 2026-11-11 | Authority — annex §5 read and quoted |
| A KOR user who opts into e-invoicing commercially acquires no reporting duty | 2026-11-11 | Authority — annex §6.c read and quoted |
| The KOR is under evaluation, including a possible threshold increase | 2026-11-11 | Authority — annex §6.c read; a live recheck trigger for the €20,000 figure in §2 |
| KOR threshold €20,000 and its effects | 2026-11-10 | Authority — Belastingdienst page read |
| KOR invoicing: not required, must state the scheme, no VAT | 2026-11-10 | Authority — Belastingdienst page read, wording quoted |
| KOR: purchase invoices still retained | 2026-11-11 | Authority — the Belastingdienst states it twice on its own KOR page, read and quoted |
| Crossing €20,000 mid-year forces immediate deregistration; a voluntary exit takes effect from the next quarter | 2026-11-11 | Authority — read and quoted |
| The €20,000 must hold for the registration year and the year before | 2026-11-11 | Authority — read |
| What counts and what does not toward the €20,000, including reverse-charged purchases and investment goods | 2026-11-11 | Authority — read; which exempt turnover counts is the art. 288 implementation and is not itemised |
| The KOR applies per entrepreneur, across all subnumbers, and cannot be split by activity | 2026-11-11 | Authority — read and quoted, with the authority's own two examples |
| Joining withdraws an art. 23 licence, bars the Invoerregeling and opted-taxed letting, and may trigger btw-herziening | 2026-11-11 | Authority — read |
| Immovable property used in the business and new means of transport stay under normal VAT rules inside the KOR | 2026-11-11 | Authority — read |
| EU-KOR: €100,000 Union threshold, national thresholds also apply, NL establishment, quarterly report | 2026-11-10 | Authority — Belastingdienst page read |
| EU-KOR start date 2025-01-01 and €100,000 Union cap | 2026-11-10 | Primary — Directive (EU) 2020/285, read in eu-vat-sme.md |
| Registration test, one eenmanszaak, automatic KVK→Belastingdienst transfer, btw-id by post | 2026-11-10 | Authority — KVK pages read |
| Registration fee €85.15, one-off, annually indexed | 2026-11-10 | Authority — official KVK page read |
| Required identification documents and processing timeframe | — | Open — not yet researched |
| Art. 6:233 both grounds; art. 6:235(1) 50 persons / published accounts | 2026-11-11 | Primary — both articles read on `wetten.overheid.nl`, version `Geldend van 16-07-2026`, by slicing the 351,743-character document in the browser |
| **Corrected on 2026-11-11:** the pack said a small party can invoke art. 6:233 | 2026-11-11 | Withdrawn — art. 6:235(3) excludes any party that itself repeatedly uses the same or nearly the same general terms, whatever its size, which is most founders with standard terms |
| Art. 6:235(2) representative-used terms; 6:235(4) when the art. 3:52 clock starts | 2026-11-11 | Primary — read |
| Arts. 6:236 and 6:237 open on a natural person not acting in the course of a profession or business | 2026-11-11 | Primary — both openings read on `wetten.overheid.nl` and quoted; it is narrower than “consumer” and excludes a sole trader acting in business |
| Where `reflexwerking` extends those lists to a small entrepreneur, and its boundaries | 2026-11-10 | Secondary — consistent across commentary; the case law is not published free of charge and was not read |
| Art. 7 Auteurswet: employer deemed maker for work in dienst; opdracht does not qualify | 2026-11-10 | Primary — statute read and quoted |
| Art. 7:400(1) defines opdracht as "other than under an employment contract", and excludes four other contract types | 2026-11-11 | Primary — read on `wetten.overheid.nl`, version `Geldend van 08-10-2026`; Boek 7 is 1,054,732 characters and was sliced in the browser |
| Art. 7:400(2): arts. 401 to 412 are defaults the contract, its nature or custom can displace | 2026-11-11 | Primary — read and quoted |
| Art. 7:401: the `zorg van een goed opdrachtnemer` standard | 2026-11-11 | Primary — read and quoted |
| Art. 8 Auteurswet: a public institution, association, foundation or company that publishes a work as its own without naming a natural person is **presumed** the maker, rebuttably | 2026-11-11 | Primary — refetched on the official `wetten.overheid.nl` consolidation, replacing a `wetboek.org` citation that had been labelled primary. Quote and version date confirmed |
| Art. 2 Aw: writing for transfer and exclusive licence; deed via art. 3:95 BW; narrow construction | 2026-11-10 | Primary — statute read per paragraph and quoted |
| Art. 2(5): narrow construction disapplied for an art. 7 or art. 8 maker | 2026-11-10 | Primary — statute read |
| Whether a non-exclusive licence is **implied** by a commission | — | Open — the statute imposes no form requirement but does not say one arises; this is case law |
| What *"aard en strekking"* means for commissioned software in practice | — | Open — not yet researched |
| Arts. 45j–45m: use for intended use, reservekopie, study, interoperability | 2026-11-10 | Primary — statute read per article |
| Art. 45j second sentence: loading, displaying and error correction cannot be contractually prohibited | 2026-11-10 | Primary — statute read and quoted |
| Arts. 45k–45m carry **no express nullity clause**, unlike BE, DE and FR | 2026-11-10 | Primary — statute read; stated as a fact about the text, not as a conclusion |
| Art. 8 of Directive 2009/24/EC: clauses contrary to arts. 6, 5(2) and 5(3) are null and void | 2026-11-11 | Primary — the directive read and quoted; it is the instrument all four packs implement |
| Art. 5(1): use for the intended purpose applies only “in the absence of specific contractual provisions”, so art. 45j sentence 2 is more protective than the Directive requires | 2026-11-11 | Primary — read and quoted |
| How a Dutch court gives effect to art. 8 given the silence in 45k–45m | — | Open — the question a clause touching them turns on; the Directive answers what is void, not by what route |
| Whether the internet consultation has opened, and what the draft bill says | — | Open — the consultation was expected this autumn and was not checked |
| The UAVG, the AP art. 35(4) DPIA list, and the three AP step-plan documents | — | Elsewhere — read on 2026-11-10 and 2026-11-11 and maintained in [netherlands-data-protection.md](netherlands-data-protection.md) |
| GDPR layer | — | Elsewhere — maintained in eu-gdpr.md |

Next full recheck due: **2027-05-10**. Earlier when the Q4 2026 internet consultation opens.

No independent Dutch legal, tax or security reviewer has reviewed this pack.
