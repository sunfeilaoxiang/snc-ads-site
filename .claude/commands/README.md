# .claude/commands/

Project-scoped slash commands. Anything dropped here as `<name>.md` becomes invocable as `/<name>` in this project's Claude sessions.

Each file is a Markdown prompt — Claude reads it and executes the instructions. Treat it like a SKILL.md but without the auto-trigger metadata.

## Example: `deploy.md`

```markdown
# Deploy command

Walk through the deployment checklist:

1. Verify `main` is green (`gh run list --limit 1`)
2. Tag the release (`git tag -a v<x.y.z> -m '...'`)
3. Push the tag (`git push origin v<x.y.z>`)
4. Wait for the deploy workflow to finish
5. Smoke-test the live URL
6. Post in #releases Slack channel
```

User invokes with `/deploy` → Claude does the steps.

## Conventions

- One command per file.
- File name = command name (lowercase, hyphens).
- Start with a one-line description.
- Include any required arguments / inputs the user must provide.
- Reference `CLAUDE.md` for project-wide context — don't duplicate it here.
- Mark destructive steps clearly so Claude pauses for confirmation.

## See also

- The starter `example.md` next to this README — copy/rename to make your own.
- `.claude/skills/` for auto-triggered behavior (commands are user-invoked, skills are intent-triggered).
