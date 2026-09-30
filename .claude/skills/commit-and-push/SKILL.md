---
name: commit-and-push
description: Review current Git changes, split them into logical commits when appropriate, create Conventional Commit messages, and push the current branch automatically.
---

# Commit and Push

When invoked, complete the commit-and-push workflow automatically without asking for confirmation during normal operation.

## Rules

- Read `CLAUDE.md` first if it exists.
- Do not modify source code.
- Never commit secrets, tokens, passwords, private keys, or `.env.local`.
- Never force push.
- Do not amend, rebase, switch branches, or modify remotes.
- If push is rejected because the remote has newer commits, stop and report it.
- If authentication fails, a merge conflict exists, HEAD is detached, or there is a secret risk, stop and report it.

## Workflow

1. Inspect repository state by running:

    git status --short
    git branch --show-current
    git remote -v
    git log -5 --oneline

2. Review current changes by running:

    git diff
    git diff --cached

3. Group changes into logical commits.

   Keep one coherent feature or bug fix together.

   Separate unrelated changes such as:

   - feature or bug fix
   - documentation
   - Claude Code configuration
   - tooling or dependencies
   - CI/CD configuration

4. For each logical group:

   - stage only the relevant files
   - review the staged diff
   - generate a concise Conventional Commit message
   - create the commit

   Example commit messages:

   - feat: add child virtual human scenario
   - fix: correct results completion logic
   - docs: update project terminology
   - chore: add Claude Code workflow

5. After all intended commits are created, push the current branch:

    git push

   If the branch has no upstream:

    git push -u origin <current-branch>

6. Verify the result by running:

    git status
    git log -5 --oneline

7. Report:

   - commits created
   - current branch
   - push result
   - working tree status
   - any files intentionally excluded

## Safety

If a suspicious file may contain secrets, exclude it from the commit and continue with the safe files when possible.

If safe completion is not possible, stop and report the problem.

Never use force push.
