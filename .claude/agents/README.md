# .claude/agents/

Subagent definitions — YAML files describing specialized agents Claude can spawn via the Agent tool for delegated work (code review, security audit, test writing, etc.).

## Format

```yaml
# .claude/agents/code-reviewer.yml
name: code-reviewer
description: Reviews diffs for correctness, style, security. Use after a feature lands and before PR submission.
model: sonnet  # or opus, haiku
tools:
  - Read
  - Grep
  - Bash
system_prompt: |
  You are a senior code reviewer. Focus on:
  - Correctness bugs (logic errors, edge cases)
  - Security issues (injection, secrets, auth)
  - API design (clarity, idempotency, error handling)
  - Test coverage gaps
  Don't nitpick formatting if a linter exists.
```

## Conventions

- One file per agent.
- File name = agent name (lowercase, hyphens).
- `description` field MUST tell Claude when to spawn this agent — be specific.
- Keep `tools` list minimal — only what the agent actually needs.
- `system_prompt` should be the entire agent identity — Claude spawns it cold each time.

## When to use a subagent vs a skill vs a slash command

| Tool | Use when |
|---|---|
| **Skill** | Behavior that should auto-trigger from intent matching. Lives in `.claude/skills/`. |
| **Slash command** | User-invoked workflow. Lives in `.claude/commands/`. |
| **Subagent** | Delegated work that needs its own context window / isolated decision flow. Spawned mid-session via Agent tool. |
| **Plugin** | All of the above bundled for distribution. Lives in `plugins/`. |

## See also

- `https://docs.claude.com/en/docs/claude-code/sub-agents` for the canonical reference.
