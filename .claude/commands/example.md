# Example slash command — rename and edit me

This file is here as a working example. To make your own:

1. Copy this file to `<your-command-name>.md` in the same folder.
2. Replace the content below with what you want Claude to do.
3. Invoke with `/<your-command-name>` in a Claude session.
4. Delete this `example.md` once you've got at least one real command.

---

## Example body — say hello

Greet the user by name and tell them the current date in this format:

> Hello, **{{user_name}}**. Today is **{{ISO_DATE}}**.

If the user hasn't told you their name in this session, ask once: "Who am I greeting?"
