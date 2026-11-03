# Representative document verification

The local HTTP regression in `tests/local-ui.test.mjs` exercises the same handlers used by the browser. It is not a substitute for native browser, assistive-technology or independent user testing.

| Case | Checked evidence |
| --- | --- |
| Dutch/English, accented text, euro, Greek/Cyrillic, punctuation and literal script/link syntax | Exact values in editor API, saved structured fields and reader sections; selected export retains text with Markdown escaping and does not execute source |
| 4000-character field, including terminal marker | Save and editor read-back retain complete value; 4001 characters refuse without writes |
| Empty field | Stored null/unknown, blank editor value, explicit unknown in selected summary |
| 105 actual local attachment files | Files and metadata unchanged; no contents bundled; 100-item exclusion list declares truncation and exact total |
| Selected summary and PDF | Private unselected field and attachment content excluded; PDF source equals summary source; saved Markdown equals preview |
| Successive revisions | Prior document bytes stay unchanged; tasks, facts and evidence are unaffected |
| Full revision route | Initial audience change produces review candidates; one delivery section changes deliberately; comparison contains only that field; change reason survives; original version remains readable; saved selected PDF bytes equal preview |

Existing separate regressions cover multi-page tables, Unicode font fallback, unsupported glyph warnings, corrupt/stale inputs, imported BOM/CRLF, literal untrusted instructions and export limits. Prior browser evidence covers focused revisions, comparisons, PDF selection/save, inert pasted imports and version-bound comments; see the checkpoint for exact artifacts and unresolved native-file-chooser/PDF-viewer gaps.

Representation boundaries remain explicit: native form submission trims outer whitespace. Structured saved values and editor read-back retain internal newlines. The current Markdown document/summary renderer replaces control characters (including line breaks inside a field) with spaces and escapes Markdown punctuation; exported layout is not a verbatim source-file replica. Imported text preserves original source bytes under its separate contract. PDF unsupported glyphs produce visible codes and warnings rather than an invisible omission.

This matrix provides synthetic application-layer evidence. It does not establish real-world product validation, semantic correctness, independent security review or completion of every month-three acceptance obligation. Edge also saved and reopened a 4000-character bilingual field with three lines, literal script/link syntax and a blank delivery field. The DOM read-back and saved artifact exactly match the input, including the terminal END marker; the editor was visually inspected. This does not verify every device, glyph or export viewer.
