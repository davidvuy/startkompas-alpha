# Third-party notices

Root MIT licensing applies only as described in LICENSING.md. This register distinguishes evidence copies, selected future dependencies and tools used externally. Complete retrieved texts and exact online observations are in evidence/sk07/licenses/ and evidence/sk07/online-inspection.json.

| Component / version | Licence and attribution | Use / retained notice |
|---|---|---|
| founder-skills 0.5.2, commit 07ea968338cff2ba67ff245671765ea957ce0a0c | MIT; Copyright (c) 2026 Geet Khosla | Unchanged B1 comparator outside product source. Its generated instructions, state templates and excerpts occur in historical B1 workspaces/traces under evidence/sk03-runs and evidence/sk03-replay; evidence/sk03-preflight and SK05 source observations also refer to it. Preserve licenses/founder-skills.txt with any permitted copies. No product dependency or copied product procedure. |
| Ajv 8.20.0 | MIT; copyright notice retained verbatim in licenses/ajv.txt | Selected future validator, isolated SK05 probe only; not installed in the product. |
| fast-deep-equal 3.1.3 | MIT; notice retained in licenses/fast-deep-equal.txt | Locked Ajv transitive in SK05 probe. |
| fast-uri 3.1.9 | BSD-3-Clause; Gary Court and The Fastify team | Locked Ajv transitive; licenses/fast-uri.txt retains all notices including no endorsement. |
| json-schema-traverse 1.0.0 | MIT; notice retained in licenses/json-schema-traverse.txt | Locked Ajv transitive in SK05 probe. |
| require-from-string 2.0.2 | MIT; notice retained in licenses/require-from-string.txt | Locked Ajv transitive in SK05 probe. |
| Node.js 26.7.0 | Node MIT-style core terms plus bundled third-party terms | Existing external runtime only. licenses/node.txt is the full upstream licence including third-party notices; no runtime binary is included. |
| Codex CLI 0.162.1 | Apache-2.0; Copyright 2025 OpenAI | External test host; licenses/codex.txt from rust-v0.162.1. No binary redistribution; this does not license hosted services or determine account terms. |
| Available skill-creator | Apache-2.0 text accompanying local skill; online text matches after CRLF normalization | Tool selected for SK08, not invoked or copied into product here. licenses/skill-creator.txt is the retrieved text. Online main is moving; actual generated output and tool revision require a new inspection in SK08. |
| Agent Skills / JSON Schema 2020-12 | Referenced formats, no specification/reference implementation copied into product | Links are retained in SK05; no claim to sublicense the specifications. |
| Zod 4.6.7 | Rejected alternative, metadata only in SK05 evidence | Not installed or adopted as product code. |

Licence paths above are relative to evidence/sk07/. The five npm archives were fetched at their locked URLs, verified against their SHA-512 integrities, and their actual licence files compared byte-for-byte with SK05. Metadata licence labels alone were not treated as sufficient evidence. Founder-skills text matches the pinned source after line-ending normalization. Existing historical copies remain byte-preserved.

No unsuitable third-party implementation was found in the current reserved product directories (only README placeholders). SK05's rejected full founder bundle and unsupported memory defaults remain excluded from product reuse. Removing those values from frozen experiments would destroy evidence, so they are retained only in the excluded research archive. Future factual defaults still need the SK09/SK11–SK14 provenance tests.

## SK08 generated-source review

The local skill-creator was used to initialize skill/startkompas. Original TODO description/body were replaced with original project guidance; generated agents/openai.yaml retains only initializer structure and project-supplied strings. No generator implementation or examples are copied. Conservatively retain the creator Apache-2.0 terms in skill/startkompas/LICENSE-APACHE-2.0 and record modifications in NOTICE; original instructions carry MIT in LICENSE. Initial output and exact local creator file hashes are in evidence/sk08. PyYAML 6.0.3 (MIT) is an external authoring-validator dependency installed only in scratch storage, not bundled or required by the skill. Its wheel metadata/hash is in evidence/sk08/pip-report.json; licence copy is in evidence/sk08/pyyaml-LICENSE.txt.

## SK09 dependency introduction

Ajv 8.20.0 and its four locked transitives are now product-helper dependencies in package-lock.json. Versions/integrities remain those verified in SK05/SK07. Their actual installed notices are preserved under licenses/dependencies/ for future packaging, including fast-uri BSD-3-Clause. node_modules is ignored, not vendored. The original helper/schema/reference are MIT under the existing scope.

## SK10 local packaging

The local installer copies only original runtime/test/example files, the skill with MIT/Apache notices, the locked dependency declaration and retained dependency notices. npm ci supplies Ajv/transitives without vendoring node_modules in Git. Imported plan, mixed research/evaluation archives and grader material are not copied. The installation is private/local and is not a public distribution clearance. Source/provenance identifiers are in installation.json and evidence/sk10.
