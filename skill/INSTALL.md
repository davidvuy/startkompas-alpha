# Install Startkompas

Startkompas is a folder of markdown. No Node, no npm, no dependencies, no server, no API key. Installing it means putting the `startkompas` folder where your assistant looks for skills.

The folder must keep its internal structure — `SKILL.md` plus `references/` — because `SKILL.md` links to the reference files by relative path.

## Claude Code

Personal, available in every project:

```
~/.claude/skills/startkompas/
```

Project-only, shared with whoever clones the repository:

```
<your-project>/.claude/skills/startkompas/
```

On Windows the personal path is `%USERPROFILE%\.claude\skills\startkompas\`.

Start a new session and ask for something in scope — for example *"help me draft an offer for my B2B service idea"*. The skill is selected from its `description`, so you do not need to name it.

## Claude (claude.ai and the desktop app)

Upload a zip under Settings → Capabilities → Skills. `SKILL.md` must sit at the **top level inside the archive**, not inside a `startkompas/` folder — so zip the folder's *contents*, not the folder.

Build it with:

```sh
node scripts/build-zip.mjs
```

That writes `startkompas-skill.zip` one level above the repository, deliberately outside the source tree, and prints the path. It needs no dependency and no zip tool, and it fails loudly if `SKILL.md` would not land at the archive root. Pass a path to choose your own output location.

## Codex

```
~/.codex/skills/startkompas/
```

Or `$CODEX_HOME/skills/startkompas/` when you have set `CODEX_HOME`. For a single repository, `.agents/skills/startkompas/` inside that repository also works.

Open a fresh chat and select `$startkompas`. If it does not appear, restart and confirm the same Codex home is in use.

## Any other assistant

Any host that reads a `SKILL.md` with `name` and `description` frontmatter and can read the linked reference files will work. If your host has no skill mechanism, the files are still plain markdown — paste `SKILL.md` into the conversation and attach the reference it points you to.

## Verify the install

From inside the `startkompas` folder:

```bash
node scripts/check-skill.mjs
```

This checks the frontmatter, that every relative link resolves, and that nothing re-introduces a runtime dependency. It needs only Node's standard library, and it is a convenience — the skill itself does not require Node.

## Verified installs

What has actually been done, as opposed to what should work. Add a row when you install on a new host or OS — and keep the distinction between *the files are in place* and *a model used them correctly*, because they are not the same claim.

| Date | Host | OS | Files in place | Structure check | Used in a real session |
| --- | --- | --- | --- | --- | --- |
| 2026-11-10 | Claude Code | Windows 11 | yes, 32 files / 209 KB at `~/.claude/skills/startkompas` | pass | **not yet** |
| 2026-11-10 | Codex | Windows 11 | yes, 32 files / 209 KB at `~/.codex/skills/startkompas` | pass | **not yet** |
| 2026-11-10 | claude.ai upload | — | zip built, 32 entries, `SKILL.md` at archive root, verified readable | pass | **not uploaded** |

Not yet verified on any host: that the skill is actually **discovered** and selected from its description, that **progressive disclosure** works (the model opening the right reference by relative path), and that it behaves correctly — see [evals/results.md](evals/results.md). No install has happened on macOS or Linux.

To remove an install, delete the folder. It holds no state.

## Your projects live elsewhere

Keep your private project directories **outside** this skill folder, and outside any public repository.

The skill writes plain files — see `references/dossier-format.md` for the layout. Removing the skill does not delete your projects, your exports, or any record your assistant's provider holds of what you sent it.

## Updating

Replace the folder with a newer copy. The skill holds no state, so nothing migrates and nothing is lost.

Your project files are a separate matter: a new version of the skill may read older project files, but check `dossier-format.md` for the `format` value before letting it write to a project created by an older version.
