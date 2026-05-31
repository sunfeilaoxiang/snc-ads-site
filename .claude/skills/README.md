# .claude/skills/

Project-scoped skills. Each subfolder = one skill. Claude auto-activates a skill when the user's request matches the skill's `description` in `SKILL.md` frontmatter.

## Anatomy

```
.claude/skills/
└── <skill-name>/
    ├── SKILL.md       Instructions + frontmatter (required)
    ├── scripts/       Executable automation (optional)
    ├── references/    Markdown files Claude reads on demand (optional)
    └── assets/        Templates / static files the skill copies into the project (optional)
```

`SKILL.md` frontmatter:

```yaml
---
name: my-skill
description: One paragraph that's specific enough for Claude to know exactly when to trigger this skill. Lead with the trigger phrases and the outcome. Be precise about what NOT to use it for.
---
```

## Conventions

- One job per skill. If it's doing two unrelated things, split it.
- Lead the description with concrete trigger phrases — the words the user will actually type.
- Hard rules (NEVER, ALWAYS) in their own section near the top of SKILL.md.
- Reference files for things Claude might need to look up but not every time.
- Asset files for templates that get COPIED into the target.
- Scripts for deterministic work that doesn't need Claude to "think" about it.

## See also

- The starter `example-skill/` next to this README — copy/rename to make your own.
- `https://docs.claude.com/en/docs/claude-code/skills` for the canonical reference.
