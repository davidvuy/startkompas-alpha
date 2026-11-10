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

Zip the `startkompas` folder so that `SKILL.md` sits at the top level inside the archive, then upload it under Settings → Capabilities → Skills.

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

## Your projects live elsewhere

Keep your private project directories **outside** this skill folder, and outside any public repository.

The skill writes plain files — see `references/dossier-format.md` for the layout. Removing the skill does not delete your projects, your exports, or any record your assistant's provider holds of what you sent it.

## Updating

Replace the folder with a newer copy. The skill holds no state, so nothing migrates and nothing is lost.

Your project files are a separate matter: a new version of the skill may read older project files, but check `dossier-format.md` for the `format` value before letting it write to a project created by an older version.
