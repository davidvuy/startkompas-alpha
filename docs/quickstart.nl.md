# Je eerste resultaat met Startkompas

Startkompas bewaart aannames, besluiten, taken en concepten voor je bedrijfsidee. Dit is een vroege lokale alpha, geen website. De demo en het menu vragen geen AI-account. Voor optionele hulp via Codex gelden afzonderlijke toegang en kosten.

## 1. Download en installeer

Installeer eerst [Node.js 26.7.0 met npm](https://nodejs.org/download/release/v26.7.0/). Deze exacte versie is onze ontwikkelversie; ook Node 24 wordt in de automatische helpertests meegenomen.

[Download de alpha-4-ZIP](https://github.com/davidvuy/startkompas-alpha/archive/refs/tags/v0.1.0-alpha.4.zip). Pak **alles** uit in een nieuwe map. Open die map, waar `package.json` en `start.mjs` staan, in een terminal. Op Windows: rechtsklik in de map en kies 'Openen in Terminal' als die optie beschikbaar is. Op macOS/Linux: open Terminal en gebruik `cd` gevolgd door het pad naar die map.

Voer deze opdrachten één voor één uit:

```sh
node --version
npm ci --ignore-scripts --no-audit --no-fund
node start.mjs
```

De installatie downloadt vastgelegde afhankelijkheden. Geen beheerdersrechten of API-sleutel nodig.

## 2. Probeer eerst de fictieve demo

Kies **3** in het menu. Geef een nieuwe map buiten de applicatiemap op, bijvoorbeeld `../mijn-startkompas-demo`. Die map mag nog niet bestaan.

De demo maakt een fictief dossier, conceptaanbod en rapport, en controleert export/herstel. Bij succes verschijnt `"result": "pass"`. Open `workspace.md` en `report.md` in de demomap met een teksteditor.

## 3. Begin je eigen project

Voer opnieuw `node start.mjs` uit en kies **2**. Geef een naam, een herkenbaar project-ID zoals `mijn-idee`, een nieuwe privémap zoals `../mijn-idee` en eventueel een eerste taak op. Bevestig pas met `ja` wanneer die gegevens kloppen. Noteer de map en het project-ID: die heb je nodig om te hervatten.

Kies daarna **5** om een aanbod te maken. Vul je projectmap en ID in. Kies `nl` voor Nederlandse documentvelden. Laat onbekende antwoorden leeg. Je ziet het concept vóór het opslaan; geef vervolgens een nieuwe privémap voor de herhaalbestanden op, bijvoorbeeld `../mijn-idee-opslag-1`, en bevestig. Gebruik bij volgende opslagacties een nieuwe map. `/cancel` stopt een invoerstap in het menu en de conceptwizard. Sommige vervolgvragen zijn nog Engels.

## 4. Hervat en bewaar een rapport

Start het menu opnieuw. Kies **4** en vul dezelfde projectmap en hetzelfde ID in. Je krijgt het actuele werkoverzicht.

Kies **6** voor een rapport. Lees de getoonde inhoud, kies een nieuwe bestandsnaam buiten het dossier en de app, bijvoorbeeld `../mijn-rapport-1.md`, en bevestig met `ja`. Bestaande bestanden worden niet overschreven. Als het dossier intussen verandert, moet je opnieuw een preview maken. Een rapport is geen volledige back-up.

## Als je vastloopt

- `node` of `npm` niet gevonden: installeer Node met npm en open een nieuwe terminal.
- `package.json` of `start.mjs` niet gevonden: ga naar de uitgepakte applicatiemap.
- Installatie onvolledig: voer de bovenstaande `npm ci`-opdracht uit en kies daarna menu **1**.
- Map bestaat al: gebruik voor een nieuwe demo/project/opslagactie een nieuwe map; gebruik **4** om een bestaand project te hervatten.
- Verkeerd project-ID: gebruik het ID dat je bij het aanmaken invulde. Maak geen nieuw project over je bestaande map heen.
- Upgrade: pak een volgende versie apart uit, bewaar je oude versie en privébestanden, en controleer eerst een kopie/export.

[Stel een vraag](https://github.com/davidvuy/startkompas-alpha/discussions) of [meld een fout](https://github.com/davidvuy/startkompas-alpha/issues/new/choose). Vermeld alpha-versie, besturingssysteem, Node-versie, de stap en de foutmelding. Deel alleen fictieve voorbeelden, geen klantgegevens, sleutels of volledige privédossiers.

Meer mogelijkheden: [uitgebreide handleiding](alpha-workspace.nl.md). Concepten en aannames zijn geen bewijs dat klanten je aanbod willen.
