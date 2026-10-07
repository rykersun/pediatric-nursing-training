# Pediatric Nursing Training Project

## Project Goal

Build a nursing education web application for pediatric injection training.

The target users are nursing students.

The website is the entry point and learning-flow controller.
Virti is used for:
- Virtual Human scenarios
- Interactive video
- 360-degree training content

Do not rebuild Virti features unless explicitly requested.

## Learning Flow

1. Course introduction
2. Virtual Human: communicate with the mother before injection
3. Virtual Human: calm and communicate with the child
4. 360-degree interactive injection scenario
5. Virtual Human: communicate with the mother after injection
6. Results and feedback

## Current Development Strategy

Build a clickable first-version product website before integrating real Virti content.

Use placeholders and mock data first.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- App Router

## Development Rules

- Do not add authentication yet
- Do not add a database yet
- Do not add backend APIs unless necessary
- Do not integrate Virti yet
- Use mock data first
- Keep components reusable
- Prefer Server Components unless client-side interaction is required
- Keep UI professional and suitable for nursing education
- Do not make the interface childish
- Do not treat this as a patient-facing application

## Terminology

- Use 「兒童」 instead of 「小兒」 in user-facing UI.
- The pediatric patient population is specifically 「學齡期兒童」.
- Do not use 「幼兒」、「幼童」 or 「嬰幼兒」 to describe the scenario population.
- Use 「兒童」 for general UI wording and 「學齡期兒童」 when the age group needs to be explicit.
- The target learner is 「護理學生」.

## Tooling

Use Context7 MCP for current:
- Next.js
- React
- Tailwind CSS
- library APIs
- version-specific implementation details

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
