---
last_mapped_commit: 1137fe8b9845149807cfba3c387ff9eaf742f7d2
last_mapped_at: 2026-10-02
---
# Testing Patterns

**Analysis Date:** 2026-10-02

## Test Framework

**Runner:**
- Not detected. No test framework is installed, configured, or referenced anywhere in the project.

**Assertion Library:**
- Not applicable — no assertion library present.

**Config Files:**
- No `jest.config.*`, `vitest.config.*`, `playwright.config.*`, or any other test config file exists at the repo root.
- `package.json` (`/Users/rykersun/clone/pediatric-nursing-training/.claude/worktrees/agent-a58d9a8df80606407/package.json`) has no `test` script. Scripts are only `dev`, `build`, `start`, `lint`.

**Run Commands:**

```bash

# No test command exists. The only verification commands are:

npm run lint          # ESLint (core-web-vitals + typescript configs)
npm run build         # Next.js production build (type-checks via tsc)
```

## Test File Organization

**Location:**
- Not applicable — zero test files exist. No `*.test.*` or `*.spec.*` files anywhere in the repository (verified by find across the whole tree excluding `node_modules`).

**Naming:**
- Not applicable.

## Current Verification Approach

The project currently relies on:
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- `npm run build` — Next.js build, which runs TypeScript type-checking (`tsc` with `strict: true` in `tsconfig.json`) and catches type errors
- Manual testing via `npm run dev`

## State-Dependent Logic That Would Benefit From Tests

The codebase has pure, framework-free logic in `src/lib/` and `src/data/` that is highly unit-testable. These are the most valuable candidates when a test framework is introduced:

### `src/lib/journey-progress.ts`

- `getCompletedSteps(progress)` — filters completed steps
- `getStepStatuses(progress)` — derives `completed` / `current` / `locked` / `upcoming` status per step. Edge cases: empty progress, partial completion, all complete
- `getResumeRoute(progress)` — returns `/journey/results` when all complete, else first incomplete step's route
- `readJourneyProgress` / `writeJourneyProgress` — `localStorage` read/write with try/catch and JSON parsing; note the module-level `cachedProgress` cache and `isValidProgress` type guard (invalid data returns `null`)
- `markStepComplete`, `markStepVisited`, `clearJourneyProgress` — mutation + notification
- Note: these functions guard `typeof window === "undefined"` and use `window.localStorage`, so they need a `localStorage` mock (e.g. `jsdom` env or a stubbed `globalThis.localStorage`)

### `src/lib/mock-results.ts`

- `buildSessionResult(progress)` — pure computation of per-step scores, time deltas, overall score, `allPassed`. Edge cases: null progress, zero completed steps, `timeSpentSeconds` fallback to `estimatedMinutes * 60`
- `formatDuration(totalSeconds)` — pure string formatting; test `0`, `45`, `120`, `125` seconds
- `PASS_MARK` constant (80)

### `src/data/journey.ts`

- `getStep(step)`, `getAdjacentSteps(step)`, `getFirstIncompleteStep(completed)`
- `JOURNEY_STEPS` data integrity checks: steps 1–6 sequential, routes well-formed, `kind` values valid

### `src/hooks/use-journey-progress.ts`

- Wrap of `useSyncExternalStore` over the lib functions — would need `@testing-library/react` + a `localStorage` mock to test

## Mocking

**Framework:** Not applicable (no test framework installed).

**Recommended approach when adding tests** (based on the code's structure):
- Mock `window.localStorage` — the lib layer directly calls `window.localStorage.getItem`/`setItem` (`src/lib/journey-progress.ts`). A simple in-memory stub keyed on `JOURNEY_PROGRESS_KEY` ("pnt.journey.v1") is sufficient
- No network calls, no external APIs, no fetch anywhere in the codebase — nothing else needs mocking
- For component tests, `next/link`, `next/navigation` (`useRouter`, `usePathname`, `notFound`), and `next/font` need Next's test helpers or mocking

## Fixtures and Factories

**Not applicable** — no fixtures exist.

**Recommended pattern:** Build a helper that creates a `JourneyProgress` object matching the interface in `src/lib/journey-progress.ts`:

```typescript
// interface in src/lib/journey-progress.ts
export interface JourneyProgress {
  version: 1;
  steps: Partial<Record<number, { completedAt: string }>>;
  lastStepVisited: number | null;
  updatedAt: string;
}
```

Use `JOURNEY_STEPS` from `src/data/journey.ts` as the source of truth for valid step numbers.

## Coverage

**Requirements:** None enforced. No coverage tooling installed (`.gitignore` lists `/coverage`, indicating it was anticipated, but no tooling exists).

## Test Types

**Unit Tests:**
- Not used currently. The pure functions in `src/lib/journey-progress.ts`, `src/lib/mock-results.ts`, and `src/data/journey.ts` are the natural unit-test targets.

**Integration Tests:**
- Not used. The only integration surface is `localStorage` persistence + the `useSyncExternalStore` subscription in `src/hooks/use-journey-progress.ts`.

**E2E Tests:**
- Not used. No Playwright or Cypress anywhere.

## Common Patterns

**Async Testing:**
- Not applicable — no tests exist. The only async code in the app is `params: Promise<{ step: string }>` in `src/app/journey/step/[step]/page.tsx` and `generateMetadata`.

**Error Testing:**
- Not applicable — no tests exist. Error paths that deserve coverage once testing is added:
  - `readJourneyProgress` with corrupt JSON in `localStorage` (catch block returns `null`)
  - `isValidProgress` rejecting wrong `version` or missing `steps`
  - `notFound()` for invalid step numbers in `src/app/journey/step/[step]/page.tsx`

## Summary

The project has **no test infrastructure whatsoever** — no framework, no config, no test files, no `test` script, and no testing-related dependencies in `package.json`. Quality is currently gated by ESLint (`npm run lint`) and the Next.js build's `tsc` type-checking (`npm run build`). The pure logic in `src/lib/` is well-structured and isolated, making it straightforward to introduce a test framework (Vitest or Jest with `jsdom`, plus `@testing-library/react` for component tests) with no refactoring of the business logic layer.

---

*Testing analysis: 2026-10-02*
