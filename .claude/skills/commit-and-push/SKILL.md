---
name: commit-and-push
description: Review the current Git changes, safely create an appropriate commit, and push the current branch to GitHub. Use when the user asks to commit, push, save, publish, or sync project changes to GitHub.
---

# Commit and Push

Safely review, commit, and push the current project changes to GitHub.

## Goals

This workflow should:

1. Inspect the current Git state.
2. Review all modified and untracked files.
3. Avoid committing secrets or unrelated files.
4. Generate an appropriate commit message.
5. Commit the intended changes.
6. Push the current branch to the configured GitHub remote.
7. Verify that the operation succeeded.

## Safety Rules

- Read `CLAUDE.md` first if it exists.
- Do not modify application source code during this workflow.
- Do not rewrite existing commits.
- Do not use `git commit --amend` unless the user explicitly requests it.
- Never use `git push --force`.
- Never use `git push --force-with-lease`.
- Do not switch branches unless the user explicitly requests it.
- Do not delete branches.
- Do not modify Git remotes unless the user explicitly approves it.
- Do not commit credentials, passwords, API keys, tokens, private keys, or other secrets.
- Do not display secret values in the response.
- Do not blindly commit files that appear unrelated to the current work.
- If there is uncertainty about a suspicious or sensitive file, stop and ask the user before committing it.

## Workflow

### 1. Inspect the repository

Run:

    git status --short
    git branch --show-current
    git remote -v

Confirm:

- the current directory is a Git repository
- the current branch is known
- an `origin` remote exists
- there are changes that need to be committed

If there are no changes, tell the user that the working tree is already clean and stop.

Do not create an empty commit.

### 2. Review the changes

Inspect unstaged changes:

    git diff

Inspect already staged changes:

    git diff --cached

Review the untracked files shown by:

    git status --short

Determine what the current changes actually accomplish.

Before staging anything, summarize internally whether the changes appear to belong to one logical task.

### 3. Perform a security check

Pay special attention to files with names or locations such as:

- `.env`
- `.env.local`
- `.env.*`
- credential files
- token files
- private keys
- SSH keys
- API key files
- secret configuration files
- authentication exports
- local-only configuration

Common sensitive patterns include:

- `API_KEY`
- `TOKEN`
- `SECRET`
- `PASSWORD`
- `PRIVATE_KEY`
- `ACCESS_KEY`

Do not print secret contents merely to inspect them.

If a file appears likely to contain sensitive credentials and it is not clearly intended for Git, do not stage it.

Stop and ask the user if necessary.

### 4. Determine what should be committed

If all current changes clearly belong to the same task and are safe to commit, stage them with:

    git add -A

If some files are unrelated, temporary, local-only, or suspicious, stage only the appropriate files explicitly.

Do not automatically include unrelated work.

### 5. Review the staged commit

After staging, run:

    git status --short
    git diff --cached --stat
    git diff --cached

Confirm that:

- the staged files match the intended task
- no sensitive files are included
- no unexpected large or generated files are included
- the staged changes form a coherent commit

If unexpected files are staged, unstage them before continuing.

### 6. Generate the commit message

Create a concise commit message based on the actual staged changes.

Prefer Conventional Commit style when appropriate:

- `feat:` for new functionality
- `fix:` for bug fixes
- `refactor:` for code restructuring without changing behavior
- `docs:` for documentation
- `style:` for visual or formatting changes
- `test:` for tests
- `chore:` for tooling, dependencies, or project configuration
- `perf:` for performance improvements
- `build:` for build-system changes
- `ci:` for CI/CD configuration

Examples:

    feat: add pediatric training course navigation

    fix: correct scenario progress state

    docs: update project onboarding instructions

    chore: add Claude Code project configuration

The message must describe what actually changed.

Do not use vague messages such as:

    update files

    changes

    fix stuff

### 7. Create the commit

Run:

    git commit -m "<generated commit message>"

If the commit fails, stop and report the error.

Do not attempt unrelated fixes automatically.

### 8. Push the current branch

Determine the current branch:

    git branch --show-current

Normally push with:

    git push

If Git reports that the current branch has no upstream branch, use:

    git push -u origin <current-branch>

Never force push.

If the remote reports that the repository has moved or the remote URL is outdated, do not modify the remote automatically.

Report the issue and ask the user for approval before changing the remote URL.

### 9. Verify the result

After a successful push, run:

    git status
    git log -1 --oneline

Verify that:

- the commit exists
- the push succeeded
- the expected branch was pushed
- the working tree is clean, unless intentional local changes remain

## Final Report

After completion, report:

- commit SHA
- commit message
- current branch
- remote used
- whether the push succeeded
- whether the working tree is clean
- any files intentionally left uncommitted

Example final report:

    Commit and push completed successfully.

    Commit: f642473
    Message: chore: add Claude Code project configuration
    Branch: master
    Remote: origin
    Push: successful
    Working tree: clean

## Failure Handling

If any step fails:

1. Stop the workflow.
2. Explain which command failed.
3. Provide the relevant error message.
4. Do not rewrite history.
5. Do not force push.
6. Do not modify unrelated project files.
7. Wait for the user's instruction before attempting corrective changes.
