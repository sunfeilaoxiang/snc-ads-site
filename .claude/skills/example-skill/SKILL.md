---
name: example-skill
description: Example skill — rename this folder and replace this content. Triggers when the user types "example skill". Demonstrates the SKILL.md format. Delete or replace once you have a real skill.
---

# Example skill

This is the minimal viable skill. Use it as a copy-paste starting point.

## When to trigger

- User explicitly says "run the example skill"
- User types `/example-skill`

(Skills auto-trigger when the user's request matches your `description` field — write that field to be precise about WHEN, not just WHAT.)

## What to do

1. Tell the user: "The example skill ran successfully. Now go replace this with a real skill."
2. Suggest they read `.claude/skills/README.md` for the skill anatomy + conventions.
3. Suggest 2-3 small skill ideas based on what their project does.

## Hard rules

- Never run destructively in a skill scaffold — examples should be read-only / output-only.
- If a real skill needs to write files, it must check existence first and confirm before overwriting.

## See also

- `.claude/skills/README.md`
- The cheat-sheet's "Skill Structure" section
