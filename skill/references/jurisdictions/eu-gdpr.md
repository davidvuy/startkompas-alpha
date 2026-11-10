# EU — GDPR layer

**This is a shared layer, not a country.** The GDPR applies directly in every EU member state, so the rules below hold identically in the Belgium, Netherlands, Germany and France packs. Each national pack carries only what is *national*: which supervisory authority is competent, and what that authority publishes.

Read this together with the relevant national pack. Neither replaces the other.

Verification convention: **[checked YYYY-MM-DD]** means the source was actually fetched and read on that date. **[not researched]** means no source was consulted.

---

## 1. Controller or processor

Source: [EDPB — data controller or data processor](https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en) · *EU regulator guidance* · **[checked 2026-11-10]**

The test is decision-making authority:

> *"A data controller determines the purposes and means of processing personal data."*
> *"A processor acts under the instructions of the controller only, by processing personal data on behalf of the controller."*

Whoever decides the **why** and the **how** is the controller; whoever merely executes is the processor. **Roles follow the actual purposes and instructions** — never a product name, a contract title or what a vendor calls itself.

For a solo founder this is rarely obvious. Running a pilot on your own idea, with your own purposes, makes you a controller for that data. Processing a client's customer list strictly on their instructions makes you a processor for it. Both can be true at once for different data in the same engagement — resolve it per flow, not per relationship.

## 2. What a processor contract must cover

A controller–processor contract must require the processor to:

- process only on the controller's instructions
- keep authorized personnel under confidentiality
- ensure the security of processing
- obtain **written authorization before engaging a sub-processor**
- assist with data subject rights requests
- support breach notification and impact assessments
- delete or return the data at the end of the engagement
- provide documentation demonstrating compliance
- permit audits and inspections

Sub-processors need written authorization, and the processor must bind each one to protection **equivalent to the main contract**. **The processor remains liable to the controller for its sub-processors' breaches** — directly relevant to any founder who builds on, or resells, another provider.

An unsigned template is not a contract. A customer's approval is not a lawful basis and not an adequate safeguard.

## 3. Register of processing activities

Keeping an overview of your processing activities is an obligation, not a nicety — the `verwerkingsregister` / `registre des traitements` / `Verzeichnis von Verarbeitungstätigkeiten`.

A maintained register is also what makes a breach assessment possible at speed: without it you cannot say quickly which categories of data and which people a breach touched. · *national authority guidance, consistent* · **[checked 2026-11-10]**

## 4. Data breach notification — 72 hours

A controller must report a qualifying personal data breach to its supervisory authority **within 72 hours of becoming aware of it**.

A **processor** must warn its controller **without undue delay** — in practice immediately, with further detail following in stages as it is established. The processor does not notify the authority; the controller does. · *national authority guidance, consistent* · **[checked 2026-11-10]**

Decide, before a pilot starts, who would notify whom and from which address. A 72-hour clock is not the moment to discover that the answer is unclear.

## 5. Security — proportionate, not a checklist

Source: [EDPB — secure personal data](https://www.edpb.europa.eu/sme/be-compliant/secure-personal-data_en) · *EU regulator guidance* · **[checked 2026-11-10]**

The principle: *"appropriate technical and organisational measures to ensure a level of security of personal data appropriate to the risk"*, adapted to the state of the art, the processing context and the risk to individuals. **Proportionality is the rule.** There is no fixed list that makes you compliant.

Measures the page names — organisational: awareness sessions, documented operating procedures, a binding internal data protection policy, information classification, confidentiality agreements with staff. Technical: automatic session lockout, maintained firewall and antivirus, automatic security updates, backed-up storage, limits on removable media, premises access control, unique user identifiers with no shared accounts, role-based access profiles, pseudonymization, anonymization, encryption, and hash functions for integrity.

**It does give two numeric figures: a minimum password length of 8 characters with upper case and special characters, and authorization reviews every six months.**

Treat both as that page's general SME guidance — **not** a legal requirement, and not current best practice on passwords, where length-first policies and breached-password screening have displaced short-but-complex rules. Do not present either number as an obligation, and do not reproduce the 8-character figure as a recommendation.

## 6. What this layer does not cover

- **EU AI Act applicability: [not researched]** in any pack. Keep it open rather than claiming an assessment.
- International transfers, DPIA thresholds, and whether a founder needs a DPO: **[not researched]**.
- Sector rules (health, finance, children's data) are outside every pack's scope.
- The national authority's own guidance, which often differs in emphasis and is the better source for a founder in that country — see the national pack.

## Pack maintenance

| Claim | Check date | Status |
| --- | --- | --- |
| Controller/processor test and quoted wording | 2026-11-10 | EU regulator guidance read |
| Processor contract duties, sub-processor authorization, processor liability | 2026-11-10 | EU regulator guidance read |
| Security principle, named measures, and the two numeric figures | 2026-11-10 | EU regulator guidance read |
| Register of processing activities obligation | 2026-11-10 | National authority guidance, consistent |
| 72-hour controller notification; processor warns without undue delay | 2026-11-10 | National authority guidance, consistent |
| EU AI Act applicability | — | Not researched |
| Transfers, DPIA thresholds, DPO requirement | — | Not researched |

Next full recheck due: **2027-05-10**. Earlier on any EDPB guidance update or an AI Act milestone affecting small businesses.

No independent data-protection reviewer has reviewed this layer.
