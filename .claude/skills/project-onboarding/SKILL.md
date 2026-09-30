---
name: project-onboarding
description: Inspects the current repository and summarizes project context for a newly started Claude Code session. Use at the beginning of a new development session to understand the project structure, implementation status, git history, architecture, conventions, current learning flow, mocks/placeholders, and next priority before making changes.
---

# Project Onboarding

Use this workflow when starting work in a fresh session.

## Instructions

Do not modify any files during this workflow.

1. Read `CLAUDE.md` first.

2. If `PROJECT_STATUS.md` exists, read it.

3. Inspect the repository structure.

4. Inspect the important existing pages, layouts, components, data files, and configuration files.

5. Run or inspect:
   - `git status`
   - the latest 5 commits
   - the current branch

6. Identify the current application flow.

7. Identify what is:
   - fully implemented
   - partially implemented
   - placeholder/mock
   - not started

8. Summarize the current architecture and coding conventions.

9. Summarize the project in this structure:

   ### Project purpose
   ### Target users
   ### Current learning flow
   ### Virti's role
   ### Current architecture
   ### Implemented
   ### Placeholder / incomplete
   ### Current git state
   ### Recommended next priority

10. Do not write code or edit files.

11. Wait for the user's confirmation before starting implementation.
