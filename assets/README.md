# assets/ — what each file is for

3.1 MB across 11 files. **None of it is used by the skill**, which ships no binaries at all — `skill/scripts/check-skill.mjs` fails the build if one appears there. Everything here belongs to the legacy runtime or to this repository's own presentation.

Recorded because 3 MB of unexplained binaries in a repository is a question waiting to be asked. Their future is part of [BACKLOG.md](../BACKLOG.md) items 6 and 11.

## Fonts — a real runtime dependency

| File | Size | Used by |
| --- | --- | --- |
| `fonts/NotoSans-Regular.ttf` | 556 KB | `src/pdf-render.mjs` |
| `fonts/NotoSans-Bold.ttf` | 562 KB | `src/pdf-render.mjs` |
| `fonts/OFL.txt` | 4 KB | The SIL Open Font License these are governed by |

`src/pdf-render.mjs` resolves `../assets/fonts/` and loads both faces by name. These are **not** optional decoration: delete them and the runtime's PDF export breaks.

They are also 1.1 MB of the repository for one feature in one file. [BACKLOG.md](../BACKLOG.md) item 88 asks whether PDF export earns that plus two of the runtime's three dependencies (`pdfkit`, `fontkit`).

Licensing: the fonts are governed by `fonts/OFL.txt`, **not** by the repository's MIT licence. See [LICENSING.md](../LICENSING.md).

## Brand images

| File | Size | Used by |
| --- | --- | --- |
| `startkompas-logo.png` | 14 KB | Supplied by the project owner, retained unchanged |
| `startkompas-header.png` | 1131 KB | The banner at the top of [README.md](../README.md) — its only use |

The header is **1.1 MB for one decorative image**, derived from the logo in October 2026. If it is kept, it should be resized; a README banner does not need a megabyte.

Permission to display and distribute these with the project does **not** imply an MIT grant over the logo or any trademark right. See [LICENSING.md](../LICENSING.md).

## Demo captures — of the runtime, not the skill

| File | Size | Used by |
| --- | --- | --- |
| `demo-1.png` … `demo-5.png` | 54–83 KB each, 333 KB total | [docs/alpha-demo.md](../docs/alpha-demo.md) |
| `startkompas-demo.mp4` | 518 KB | Previously linked from the README |

**These show terminal output from the legacy Node CLI.** They are rendered panels of real fictional output, not screen recordings and not customer results — that caveat was in the original README and still applies.

They advertise the runtime. The README now leads with the skill, so the video is no longer linked from it and the five stills are reachable only through `docs/alpha-demo.md`. If the runtime is parked, these go with it; if the skill ever needs a demo, it needs a new one.

## Summary

| Group | Size | Needed by | If the runtime is parked |
| --- | --- | --- | --- |
| Fonts | 1122 KB | `src/pdf-render.mjs` | goes with it |
| Demo captures | 851 KB | `docs/alpha-demo.md` | goes with it |
| Brand images | 1145 KB | this repository's README | stays, but the header should be resized |
