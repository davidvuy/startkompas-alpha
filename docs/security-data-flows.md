# Actual local route: data flows and boundaries

Checked2026-10-27 for internal Windows/Node26.7.0/Codex CLI0.162.1 development. This supersedes the early SK04 map's unbuilt-product and controller-network assumptions. It does not certify a deployment or account. Real dossiers belong outside source; organizational separation alone is not access control.

| Location / movement | Actual behavior | Enforced versus procedural boundary |
|---|---|---|
| Source and installation | Own code/instructions, dependencies, synthetic fixtures. Source Git also holds research/evaluation transcripts; installation uses an explicit allowlist. | Installer excludes source evidence/rubrics. No remote or public upload performed. Filename/ignore checks do not certify clean history. |
| Canonical dossier | Local project.json, immutable attachments, operation receipts, history snapshots. Explicit create/read/update/attach. | Helper checks schema, project ID, revision, operation, hashes and guarded paths. This is not user authentication or isolation from other permitted shell tools. |
| Business documents | Ordinary files saved/read by host tools; may exist without a canonical dossier. | Host permissions and user scope apply. Helper protections do not automatically cover every ordinary file write. |
| Model | Selected file contents, prompts and tool outputs enter model context. | Local persistence does not mean local-only processing. Account/provider retention, training settings and exact model build are unverified. Do not include unnecessary secrets or customer data. |
| Shell/tool execution | Current coordinating desktop session has full filesystem access and network enabled; no approvals. Fresh test sessions use explicit read/write/deny paths and network-off. | Controller restraint is procedural. Test sandbox is host enforcement, not a feature installed by Startkompas. No global host settings changed. |
| Web, apps and MCP | Controller researched public documentation through web; no dossier text needed in queries. Fresh trials disable web/apps/plugins separately. | Command network denial alone does not disable separate tool surfaces. Each connection/authority must be considered independently. |
| Logs / transcripts | CLI events, commands, outputs and session records retained as synthetic development evidence; tool text may be copied to provider logs. | No automatic redaction or retention/deletion audit. Avoid recording real tokens; a harmless test marker is not a real credential. |
| Backups / exports | History snapshots and explicit exports contain dossier/identified artifacts. Restore creates a fresh directory. Unregistered adjacent files are not automatically exported. | Hashes detect selected byte changes, not authenticity. User must protect/export/delete copies and backups separately. No cloud backup or automatic synchronization. |
| Removal | Source/skill removal does not erase private dossiers, archives, host conversations or provider records. | No automatic cross-provider deletion or background monitoring service exists. Lifecycle docs must explain each location. |

## Source-grounded host distinctions

[Agent approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security) distinguishes command permissions, approvals and separately controlled web/app/MCP surfaces. Full access has no sandbox. [Windows sandbox documentation](https://learn.chatgpt.com/docs/windows/windows-sandbox) describes MXC and legacy fallbacks; denied reads are unavailable in the weaker unelevated fallback. Current documentation is not proof that every setting works on the older pinned CLI; actual probes are required. Tests use explicit denied paths, not a claim that all unrelated paths on the computer are blocked.

[OWASP prompt-injection guidance](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) informs the threat model: external text can induce disclosure, tool misuse or false conclusions. Original project interpretation is to separate evidence from authority, constrain access and test adversarial cases. No OWASP checklist/text copied, no claim that prompting or schema validation eliminates the problem.

## Known limitations and operating scope

- Project identity guards prevent accidental wrong-ID operations through the helper; a shell with access can bypass the helper. Use an actual host profile limited to the intended project and tools for private work, and verify its denials before claiming isolation.
- A malicious local writer with concurrent access can race filesystem checks or replace canonical JSON and hashes. This prototype does not authenticate every author, defend all hardlink/race attacks or prove facts from self-consistent records. Use trusted local storage and avoid simultaneous hostile editors.
- Valid schemas may contain false assertions, fabricated review metadata or instruction attacks in text. Never promote stored statements to independent truth; qualified evidence review is separate.
- No general secret scanner/redactor, encrypted vault, network proxy, malware defence or multi-tenant service is implemented. The helper deliberately does not recursively collect arbitrary project files; explicit attachment still requires appropriate authority.
- Synthetic security tests and one model refusal cannot establish universal injection resistance. Keep original failures and scope limits. Unsupported host modes/other providers remain untested; Claude is deferred.

For privacy-sensitive or real-service deployment, actual host/account/provider controls and scoped expertise remain open conditions. This document records facts and limitations; it does not authorize new uploads, contacts, publication or spending.
