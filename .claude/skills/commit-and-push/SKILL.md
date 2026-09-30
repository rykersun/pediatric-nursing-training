---
name: commit-and-push
description: Review the current Git changes, group them into logical commits when appropriate, safely create Conventional Commit messages, and push the current branch to GitHub automatically. Use when the user asks to commit, push, save, publish, or sync project changes.
---

# Commit and Push

Review the current repository state, organize changes into logical commits,
create safe and meaningful commits, and push the current branch to GitHub.

This skill is explicitly authorized to complete the entire commit-and-push
workflow automatically without asking the user for confirmation during normal operation.

## Goals

This workflow should:

1. Inspect the current Git repository state.
2. Review modified, staged, and untracked files.
3. Detect unrelated changes and separate them into logical commits when appropriate.
4. Avoid committing secrets, credentials, generated junk, or unrelated local files.
5. Generate concise Conventional Commit-style messages.
6. Create one or more commits as appropriate.
7. Push the current branch once after all commits are created.
8. Verify that the operation succeeded.
9. Report the final result.

## Autonomous Execution

When this skill is invoked, proceed automatically.

Do not ask the user to approve:

- commit grouping
- staged files
- commit messages
- the number of commits
- the final push
- normal Git operations required by this workflow

Use your best engineering judgment and continue automatically.

Only stop when safe completion is not possible.

Examples of situations where the workflow should stop:

- Git authentication failure
- merge conflict
- push rejected because the remote contains newer commits
- detached HEAD
- missing Git remote
- unresolved repository corruption
- suspected secret exposure that cannot be safely excluded
- an unsafe or destructive Git operation would be required

When stopping, report the reason clearly.

Do not attempt destructive recovery automatically.

## Safety Rules

- Read `CLAUDE.md` first if it exists.
- Read `PROJECT_STATUS.md` if it exists and is relevant to understanding the changes.
- Do not modify application source code during this workflow.
- Do not rewrite existing Git history.
- Never use `git push --force`.
- Never use `git push --force-with-lease`.
- Do not use `git commit --amend`.
- Do not rebase.
- Do not reset commits.
- Do not switch branches.
- Do not delete branches.
- Do not automatically merge branches.
- Do not automatically resolve merge conflicts.
- Do not modify Git remotes.
- Never commit credentials, passwords, API keys, tokens, private keys, or other secrets.
- Never print secret values.
- Do not blindly stage files before reviewing them.
- Do not include unrelated changes in the same commit when they can reasonably be separated.
- Do not unnecessarily split one coherent feature or fix into multiple commits.
- Prefer explicit file staging over `git add -A` when multiple logical changes exist.

## 1. Inspect Repository State

Run:

```bash
git status --short
git branch --show-current
git remote -v
```

Confirm:

- the current directory is a Git repository
- the current branch is known
- an `origin` remote exists
- there are changes that may need to be committed

If there are no changes:

- report that the working tree is already clean
- stop successfully
- do not create an empty commit

If the repository is in detached HEAD state:

- stop
- report the condition
- do not create commits

## 2. Inspect Recent Git History

Run:

```bash
git log -5 --oneline
```

Use the recent history only as contextual guidance for:

- commit message style
- branch conventions
- repository workflow

Do not copy an old commit message unless it accurately describes the current changes.

## 3. Review Current Changes

Inspect unstaged changes:

```bash
git diff
```

Inspect staged changes:

```bash
git diff --cached
```

Inspect untracked files:

```bash
git status --short
```

Determine what the changes actually accomplish.

Do not assume all changed files belong to the same logical task.

## 4. Security and Hygiene Check

Before staging anything, inspect changed and untracked filenames for potentially sensitive, generated, temporary, or local-only files.

Pay particular attention to files such as:

- `.env`
- `.env.local`
- `.env.*`
- credential files
- token files
- private keys
- SSH keys
- service account files
- authentication exports
- secret configuration files
- temporary files
- logs
- build output
- editor-specific files
- OS metadata files

Common sensitive patterns include:

- `API_KEY`
- `TOKEN`
- `SECRET`
- `PASSWORD`
- `PRIVATE_KEY`
- `ACCESS_KEY`
- `AUTH`
- `CREDENTIAL`

Do not print secret contents merely to inspect them.

If a suspicious file appears likely to contain credentials:

- do not stage it
- exclude it from the commit when safe
- continue with other safe files if possible
- mention the excluded file in the final report

If the suspicious file cannot be safely evaluated without risking secret exposure:

- stop
- report that a potentially sensitive file requires manual review

## 5. Group Changes Into Logical Commits

Analyze all modified, staged, and untracked files.

Determine whether the repository contains:

- one coherent logical change
- or multiple independent logical changes

Prefer separate commits when changes clearly have different purposes.

Typical logical groups include:

- bug fix
- new feature
- UI change
- documentation
- Claude Code configuration
- dependency change
- CI/CD configuration
- refactor
- tests
- build configuration

Do not split changes merely because they touch different files.

Files that together implement one coherent feature or fix should stay together.

### Example: One Logical Commit

A Results page bug fix that changes:

- `src/app/journey/results/page.tsx`
- one related helper
- one related test

should normally become:

```text
fix: correct results completion logic
```

### Example: Multiple Logical Commits

A Results bug fix plus an unrelated Claude Code skill should normally become:

```text
fix: correct results completion logic
```

and:

```text
chore: add Git commit workflow skill
```

### Example: One Feature Across Multiple Files

A new Virtual Human scenario that adds:

- page
- components
- data
- styles
- route integration

should normally remain one feature commit:

```text
feat: add child virtual human scenario
```

## 6. Plan Commit Groups

Before staging, determine internally:

- how many logical commit groups exist
- which files belong to each group
- the appropriate Conventional Commit type
- the intended commit message

Do not ask the user for approval.

Proceed automatically using best judgment.

If a single file contains inseparable changes from multiple tasks:

- assign the file to the most appropriate logical commit
- avoid interactive patch staging unless necessary
- keep the resulting history coherent

## 7. Process Each Commit Group

Repeat the following steps for every logical commit group.

### 7.1 Stage Relevant Files

Prefer explicit staging:

```bash
git add <file1> <file2> ...
```

If all remaining changes clearly belong to the same logical commit and are safe:

```bash
git add -A
```

may be used.

Do not stage unrelated or sensitive files.

### 7.2 Review Staged Changes

Run:

```bash
git status --short
git diff --cached --stat
git diff --cached
```

Verify:

- the staged files match the intended logical group
- no unrelated files are included
- no sensitive files are included
- no unexpected generated files are included
- the staged diff forms a coherent commit

If an unintended file is staged, unstage it with:

```bash
git restore --staged <file>
```

Then continue automatically.

### 7.3 Generate Commit Message

Use a concise Conventional Commit-style message.

Preferred prefixes:

- `feat:` new functionality
- `fix:` bug fix
- `refactor:` code restructuring without behavior change
- `docs:` documentation
- `style:` UI, CSS, formatting, or terminology-only change
- `test:` tests
- `chore:` tooling or project configuration
- `perf:` performance improvement
- `build:` build-system or dependency-related change
- `ci:` CI/CD configuration

Examples:

```text
feat: add pediatric training course navigation
```

```text
fix: correct results completion logic
```

```text
docs: update project onboarding instructions
```

```text
style: update child terminology in UI
```

```text
chore: add Claude Code project configuration
```

Commit messages must describe the actual staged change.

Avoid vague messages such as:

```text
update files
```

```text
changes
```

```text
fix stuff
```

```text
misc updates
```

### 7.4 Create Commit

Run:

```bash
git commit -m "<generated commit message>"
```

If the commit fails:

- stop
- report the error
- do not attempt unrelated fixes automatically

### 7.5 Continue to Next Group

After each successful commit, run:

```bash
git status --short
```

If additional intended changes remain, continue processing the next logical group.

## 8. Review Commits Before Push

After all intended commits are created, run:

```bash
git log --oneline -5
git status --short
```

Verify:

- all intended changes are committed
- no accidental files remain staged
- remaining uncommitted files, if any, are intentionally excluded
- commit order is sensible

Do not rewrite commits merely to improve aesthetics.

## 9. Push Current Branch

Determine the current branch:

```bash
git branch --show-current
```

Normally run:

```bash
git push
```

If the branch has no upstream:

```bash
git push -u origin <current-branch>
```

Do not ask the user for confirmation before pushing.

Never force push.

### Remote Repository Moved

If Git reports that the repository has moved but the push still succeeds:

- do not modify the remote automatically
- continue normally
- report the suggested new remote URL in the final summary

If the outdated remote prevents the push:

- stop
- report the new suggested remote URL
- do not run `git remote set-url` automatically

### Remote Contains Newer Commits

If the push is rejected because the remote contains newer commits:

- stop
- do not force push
- do not automatically pull
- do not automatically rebase
- do not merge automatically
- report the rejection clearly

## 10. Verify Push Result

After a successful push, run:

```bash
git status
git log -5 --oneline
```

Verify:

- the expected commits exist
- the push succeeded
- the correct branch was pushed
- the working tree is clean, unless intentionally excluded local changes remain

## Final Report

After successful completion, report:

- number of commits created
- each commit SHA
- each commit message
- current branch
- remote used
- push result
- working tree status
- any intentionally excluded files
- any remote migration warning

### Example: Multiple Commits

```text
Commit and push completed successfully.

Commits:
- a82c013 fix: correct results completion logic
- b6149ae chore: add commit and push workflow skill

Branch: master
Remote: origin
Push: successful
Working tree: clean
```

### Example: Single Commit

```text
Commit and push completed successfully.

Commit:
a82c013 fix: correct results completion logic

Branch: master
Remote: origin
Push: successful
Working tree: clean
```

### Example: Excluded Local File

```text
Commit and push completed successfully.

Commit:
a82c013 feat: add child training scenario

Branch: master
Remote: origin
Push: successful
Working tree: contains intentionally excluded local files

Excluded:
- .env.local
```

## Failure Handling

If any step fails:

1. Stop at the failing step.
2. Explain which command failed.
3. Provide the relevant non-sensitive error message.
4. Do not rewrite Git history.
5. Do not force push.
6. Do not modify unrelated project files.
7. Do not silently change branches.
8. Do not silently change remotes.
9. Do not automatically rebase or merge.
10. Report what remains uncommitted or unpushed.

Normal workflow decisions should be made automatically.

Only stop when safe completion is not possible.
