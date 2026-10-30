# Zelf aan je project werken

Deze alpha is een lokaal hulpmiddel, geen website. Je hebt Node.js en npm nodig. De gewone opdrachten en demo doen geen AI-aanroepen. Voor hulp via Codex gelden de toegang, kosten en gegevensverwerking van die aanbieder.

Pak het volledige pakket uit in een nieuwe applicatiemap. Voer daar uit:

```sh
npm ci --ignore-scripts --no-audit --no-fund
node src/startkompas.mjs doctor
node src/startkompas.mjs start
```

De start vraagt om naam, project-ID, een nieuwe privémap buiten de applicatie en een optionele eerste taak. Controleer je invoer en bevestig met `ja`. Bewaar je echte dossier buiten de applicatiemap.

Vervang hieronder `../mijn-project` en `mijn-project` door je gekozen pad en ID:

```sh
node src/startkompas.mjs workspace show ../mijn-project mijn-project
node src/startkompas.mjs workspace add ../mijn-project mijn-project assumption
node src/startkompas.mjs workspace draft ../mijn-project mijn-project offer
```

`show` toont het werkoverzicht. `assumption` legt een aanname als onbekend vast. `draft` begeleidt je door een concept; kies `nl` voor Nederlandse documentvelden. De overige soorten zijn `interview`, `alternatives`, `pricing` en `pilot`. De terminal bevat nog Engelse bedieningsteksten; volledige Nederlandse bediening is niet geclaimd.

Blanco antwoorden blijven onbekend. Je kunt bestaande record-ID's als onderbouwing koppelen. Die koppeling is geen automatische goedkeuring. Voor opslaan zie je de inhoud en kies je een nieuwe privémap voor het exacte herhaalverzoek, buiten de app en het dossier. Bevestig daarna met `ja`. Gebruik `/cancel` om te stoppen zonder opslaan.

Na een echt gesprek kun je een bevinding vastleggen:

```sh
node src/startkompas.mjs workspace add ../mijn-project mijn-project observation
node src/startkompas.mjs workspace add ../mijn-project mijn-project decision
node src/startkompas.mjs workspace add ../mijn-project mijn-project task
```

Gebruik een deelnemerscode, omschrijf context en beperkingen en geef de datum. Een bevinding blijft gerapporteerd; je aanname wordt niet vanzelf bevestigd. Een besluit krijgt een reden en verwijzingen naar bestaande records. Met `workspace task-state PAD ID TAAK_ID` leg je voortgang en de reden vast, zonder daarmee bewijs goed te keuren.

Hervatten: gebruik opnieuw `workspace show`. Bekijk de gevolgen van een wijziging met `workspace impact PAD ID RECORD_ID`. Voor een nieuwe conceptversie gebruik je `workspace draft PAD ID TYPE VORIG_ARTIFACT_ID`: lege antwoorden behouden bestaande velden en `-` maakt een veld onbekend. Oude versies blijven bewaard.

Voor een leesbaar rapport voer je eerst `workspace report-preview PAD ID summary,tasks` uit. Bekijk de inhoud en kopieer de `confirmation_sha256`. Daarna kun je opslaan met `workspace report-save PAD ID summary,tasks DIE_HASH ../rapport.md`. De nieuwe bestandsnaam moet buiten de app en het project liggen. Een gewijzigd dossier vereist een nieuwe preview. Een rapport kan privégegevens bevatten en is geen back-up.

Probeer eerst alles met fictieve gegevens:

```sh
node examples/demo-founder-workflow.mjs ../fictieve-demo
```

Open daarna `workspace.md` en `report.md`. Er vond geen echt interview plaats in deze demo. Meer opdrachten en herstelstappen staan in de [volledige handleiding](alpha-workspace.md). Stel vragen in het Nederlands of Engels via [GitHub](https://github.com/davidvuy/startkompas-alpha/issues/new/choose); deel alleen fictieve voorbeelden.
