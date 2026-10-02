---
last_mapped_commit: 1137fe8b9845149807cfba3c387ff9eaf742f7d2
last_mapped_at: 2026-10-02
---
# Codebase Concerns

**Analysis Date:** 2026-10-02

## Tech Debt

**Virti integration is entirely placeholder:**
- Issue: All six journey steps render a fake simulation instead of real Virti content. `embedId` is `null` for every step in `src/data/journey.ts`, and `src/components/placeholder-frame.tsx` runs a hardcoded 2.5-second `setInterval` progress bar (`SIMULATION_DURATION_MS = 2500`) with no actual module loading.
- Files: `src/data/journey.ts`, `src/components/placeholder-frame.tsx`, `src/app/journey/step/[step]/page.tsx`
- Impact: The product looks complete but delivers no actual training content. Any nursing student completing steps 2–5 gets a fake "Simulation complete" without learning anything. This is the single largest gap between the visible product and its stated purpose.
- Fix approach: When Virti integration begins, replace `PlaceholderFrame` with a real embed component keyed off `step.virti.embedId`, and gate the MarkComplete flow on real module completion events rather than a timer.

**Scores are fabricated (hardcoded mock data):**
- Issue: `MOCK_STEP_SCORES` in `src/lib/mock-results.ts` hardcodes per-step scores (`1:100, 2:88, 3:82, 4:76, 5:90`) that never change regardless of learner performance. Step 4's score (76) is below `PASS_MARK` (80), so the results page will always show "部分項目需加強 Keep Practicing" / "Not Passed" for step 4.
- Files: `src/lib/mock-results.ts`, `src/components/results-summary.tsx`
- Impact: The results page displays scores that misrepresent learner performance. A student who completes everything perfectly still fails step 4. When real Virti scoring arrives, this whole module must be replaced.
- Fix approach: Keep as an intentional interim measure, but mark clearly; when Virti integration lands, source scores from real module events. Consider making the mock scores derivable from actual interaction (e.g., time spent, completion) so the UI exercises realistic branches.

**`totalSteps` includes the results step:**
- Issue: `SessionResult.totalSteps` is set to `JOURNEY_STEPS.length` (6), which includes step 6 (`/journey/results`), even though `stepResults` only ever contains steps 1–5. The results page's completion check (`src/app/journey/results/page.tsx`) correctly excludes the results step via `s.kind !== "results"`, but `buildSessionResult` counts 6.
- Files: `src/lib/mock-results.ts:83`, `src/app/journey/results/page.tsx:13`
- Impact: `completedSteps` (max 5) and `totalSteps` (6) are inconsistent; any UI using them directly would show "5/6" even when the course is fully complete. Currently only used internally, so no visible bug — but it is a latent inconsistency.
- Fix approach: Compute `totalSteps` from `JOURNEY_STEPS.filter((s) => s.kind !== "results").length`, or document that total includes the results page.

**Dead code: `markStepVisited` / `lastStepVisited`:**
- Issue: `markStepVisited` in `src/lib/journey-progress.ts:83` and the `lastStepVisited` field are written by `useJourneyProgress` (`src/hooks/use-journey-progress.ts:26`) but never consumed anywhere — `grep` shows no reader of `lastStepVisited` or caller of `markStepVisited` outside their definitions.
- Files: `src/lib/journey-progress.ts`, `src/hooks/use-journey-progress.ts`
- Impact: Dead API surface in the progress model; the `lastStepVisited` field is persisted to `localStorage` on every step visit for no purpose. Slightly increases the migration burden when the progress schema changes.
- Fix approach: Either wire it into resume logic (e.g., `getResumeRoute` could prefer the last visited step) or remove the function, the field, and the hook wrapper.

**Unused default Next.js assets:**
- Issue: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` are the create-next-app defaults and are referenced nowhere in `src/`.
- Files: `public/*.svg`
- Impact: Dead bundle assets shipped to production; cosmetic only.
- Fix approach: Delete them once no longer needed.

**Repository-local skill/docs churn in git history:**
- Issue: Recent commits (`ca61d8b`, `f642473`, `93b2715`, `eeeaaef`, `05a5c51`) are entirely tooling/skill documentation changes, not product code. The `commit-and-push` skill lives in `.claude/skills/commit-and-push/` and is checked into the repo.
- Files: `.claude/skills/commit-and-push/SKILL.md`, `.claude/skills/project-onboarding/SKILL.md`
- Impact: Repo history mixes product development with agent-tooling churn, making product history harder to read.
- Fix approach: Move agent-only skills to user-level `~/.claude/skills/` if they are not product-specific; keep the repo focused on the product.

## Known Bugs

**Time-spent metrics are inaccurate:**
- Symptoms: `timeSpentSeconds` in `src/lib/mock-results.ts` is computed as the wall-clock delta between consecutive step `completedAt` timestamps. If a student marks a step complete and immediately opens the next, the delta is near zero and the code silently falls back to `estimatedMinutes * 60` (5–15 min per step). If the student leaves the tab open for an hour between steps, the delta is inflated to ~1 hour.
- Files: `src/lib/mock-results.ts:31-56`
- Trigger: Any non-sequential completion pattern (e.g., marking multiple steps in quick succession, or long idle gaps between steps).
- Workaround: None; the displayed "耗時 Time" on the results page is unreliable for the step breakdown and total.
- Fix approach: Track real active session time (e.g., accumulate time on the step page with a mounted timer) or drop the metric until real Virti session data exists.

**Locking is client-side only and trivially bypassed:**
- Symptoms: `PrerequisiteGate` (`src/components/prerequisite-gate.tsx`) hides step content until the previous step is marked complete, and `ProgressTracker` (`src/components/progress-tracker.tsx`) sets `pointer-events-none` on locked steps. But nothing enforces this: the step pages are still directly routable, URLs are guessable (`/journey/step/3`), and `dynamicParams = false` only controls static generation — it does not block direct navigation.
- Files: `src/components/prerequisite-gate.tsx`, `src/components/progress-tracker.tsx`, `src/app/journey/step/[step]/page.tsx`
- Trigger: Visiting `/journey/step/3` directly without completing steps 1–2.
- Workaround: None needed for an MVP; the gate is a UX affordance, not a security boundary.
- Fix approach: Acceptable for the current no-backend stage. Document that when real assessment data matters, completion validation must move server-side.

**Step 3 character age inconsistency:**
- Symptoms: `src/data/journey.ts:139` labels the child character "6 歲病童 / 6-year-old pediatric patient", while the project terminology rule (CLAUDE.md) defines the target population as 「學齡期兒童」 (school-age, roughly 6–12). A 6-year-old is at the boundary; the `role` text uses "病童" (patient) rather than 「學齡期兒童」.
- Files: `src/data/journey.ts:139`
- Trigger: Age displayed in the Virtual Human placeholder on step 3.
- Workaround: None.
- Fix approach: Align the role copy with 「學齡期兒童」 terminology and avoid a specific age that could read as 「幼兒」-adjacent.

## Security Considerations

**No authentication or backend (by design):**
- Risk: The app stores all learning progress in browser `localStorage` (`src/lib/journey-progress.ts`) and there is no server, database, or auth. Anyone can clear or forge their own progress (`clearJourneyProgress`, or directly editing the `pnt.journey.v1` localStorage key).
- Files: `src/lib/journey-progress.ts`, `src/hooks/use-journey-progress.ts`
- Current mitigation: None, and none is needed — this is an explicit product decision per CLAUDE.md ("Do not add authentication yet", "Do not add a database yet").
- Recommendations: When Virti integration and real scoring arrive, add server-side session storage and auth. Until then, do not display progress/scores as authoritative evidence of completion.

**XSS surface:**
- Risk: All user-facing strings originate from static data in `src/data/journey.ts` and are rendered through React text nodes. No `dangerouslySetInnerHTML`, `eval`, or `innerHTML` usage exists (verified by grep).
- Files: `src/data/journey.ts`, `src/components/bilingual-text.tsx`
- Current mitigation: React's default escaping; static content only.
- Recommendations: When Virti embeds are added, treat `embedId` as a config value, never user input, and validate it against an allowlist before injecting an iframe.

**No secrets in repo:**
- No `.env` files exist, and `.gitignore` excludes `.env*`. No credentials, keys, or tokens are present in the codebase. Vercel deployment scope (`cguim-83`) is documented in `CLAUDE.md` text only, with no secrets.

## Performance Bottlenecks

**Progress re-render fan-out:**
- Problem: Every `writeJourneyProgress` call notifies all `subscribeProgress` listeners via the `Set<Listener>` in `src/lib/journey-progress.ts:139`. On any journey page, `ProgressTracker`, `JourneyStepList`, `StartCourseButton`, and `PrerequisiteGate` all subscribe, so one `markStepComplete` triggers re-renders across several components.
- Files: `src/lib/journey-progress.ts`, `src/hooks/use-journey-progress.ts`, `src/components/progress-tracker.tsx`, `src/components/journey-step-list.tsx`
- Cause: Broadcast subscription model with no memoization of derived state (`getStepStatuses` recomputes on every render).
- Improvement path: Not currently a real problem at this scale (a handful of subscribers, tiny state). Only revisit if the journey grows to many steps or many concurrent subscribers.

**`getFirstIncompleteStep` / status recomputation:**
- Problem: `getStepStatuses` in `src/lib/journey-progress.ts:100` runs `getFirstIncompleteStep` (a linear scan of `JOURNEY_STEPS`) plus a full reduce on every render of `ProgressTracker` and `JourneyStepList`.
- Files: `src/lib/journey-progress.ts`
- Cause: No memoization around derived progress state.
- Improvement path: With 6 steps this is negligible. If step count grows, memoize with `useMemo` keyed on `progress`.

**Placeholder simulation timer:**
- Problem: `PlaceholderFrame` runs a `setInterval` at 50 ms while "playing", causing up to 50 state updates over the 2.5 s simulation.
- Files: `src/components/placeholder-frame.tsx:31-41`
- Cause: Interval-based progress polling.
- Improvement path: Use a single `requestAnimationFrame` loop or CSS transition instead. Minor; the component will be replaced by real Virti content anyway.

## Fragile Areas

**Progress schema versioning:**
- Files: `src/lib/journey-progress.ts`
- Why fragile: Progress is persisted to `localStorage` under `pnt.journey.v1` with a `version: 1` field and a shallow validator (`isValidProgress` only checks `version === 1` and `typeof steps === "object"`). Any schema change (e.g., adding per-step scores) requires a migration that does not exist; old data is silently discarded (`readJourneyProgress` returns `null` on invalid shape).
- Safe modification: Bump the version constant and key (`JOURNEY_PROGRESS_KEY`), add a migration map, and keep `isValidProgress` strict. Note that `clearJourneyProgress` writes an "empty" object with `version: 1` and an empty `steps` map — it does not remove the key, so a later downgrade to a stricter validator could still see stale data.
- Test coverage: No tests exist for the validation/migration path.

**Step numbering is implicit:**
- Files: `src/data/journey.ts`
- Why fragile: Steps are identified by an explicit `step: number` field (1–6) that is duplicated in `route` strings (`/journey/step/1`), in the page's `generateStaticParams` (`s.step >= 1 && s.step <= 5`), in `getAdjacentSteps`, in `ProgressTracker.getCurrentStepNumber` (`/journey/results` → 6), and in `getStepStatuses`. Inserting or renumbering a step requires touching all of these in lockstep.
- Safe modification: Derive ordering from array index and routes from slugs; add a compile-time check that `step` numbers are contiguous and match routes. Currently a mismatch silently breaks locking/resume logic.

**Hardcoded route strings:**
- Files: `src/components/results-summary.tsx:19` (`router.push("/journey/step/1")`), `src/lib/journey-progress.ts:124` (`return "/journey/results"`), `src/components/progress-tracker.tsx:123` (`pathname === "/journey/results"`), `src/components/start-course-button.tsx:19` (`route === "/journey/results"`)
- Why fragile: Several components compare or push raw path strings instead of deriving them from `JOURNEY_STEPS`. If the results route ever changes, these break silently. Note `src/data/journey.ts` uses typed `Route` values correctly, so the pattern is inconsistent.

**Duplicate step-lookup logic:**
- Files: `src/lib/mock-results.ts:35,53` (`JOURNEY_STEPS.find((s) => s.step === stepNumber - 1)` etc.), `src/components/results-summary.tsx:51`, `src/components/prerequisite-gate.tsx:45`
- Why fragile: `JOURNEY_STEPS.find(...)` by number is repeated in at least four places instead of using `getStep`/`getAdjacentSteps` from `src/data/journey.ts`. Adding a helper for "previous step by number" would centralize the fallback logic.

## Scaling Limits

**localStorage progress:**
- Current capacity: 6 steps, tiny payload (~200 bytes). Far below the ~5 MB localStorage limit.
- Limit: Not a capacity problem — a portability problem: progress is per-browser/per-device, lost on clearing site data or switching devices, and cannot support multi-student class management.
- Scaling path: When real Virti content and scoring are integrated, move to a server-backed session store (per CLAUDE.md, this is deferred on purpose).

**Static step pages:**
- Current capacity: 5 statically generated step pages (`generateStaticParams`, `dynamicParams = false`).
- Limit: If steps become dynamic (user-specific Virti embeds, per-student assessment), static generation with `dynamicParams = false` will 404 for any new step not in the build-time list.
- Scaling path: Revisit the `[step]` route strategy when content becomes data-driven.

## Dependencies at Risk

**Next.js 16.3.7 (bleeding edge):**
- Risk: `next` is pinned at `16.3.7` and `react`/`react-dom` at `19.2.8` — very recent major versions. CLAUDE.md explicitly warns this is "NOT the Next.js you know" with breaking changes, and instructs reading `node_modules/next/dist/docs/` before writing code.
- Impact: Any code written from older training data (App Router conventions, `params` being a Promise, `LayoutProps<"/">` typing) may silently diverge. The codebase already relies on newer conventions: `params: Promise<{ step: string }>` awaited in `StepPage`, and the custom `LayoutProps<"/">` route generic.
- Migration plan: Keep pinned to known-good versions; verify against the bundled docs in `node_modules/next/dist/docs/`; avoid major upgrades without re-reading those docs. There is no lockfile drift risk — `package-lock.json` is committed.

**`@tailwindcss/postcss` and `tailwindcss` v4:**
- Risk: Tailwind v4 uses the new CSS-first config (`@import "tailwindcss"` and `@theme inline` in `src/app/globals.css`) instead of `tailwind.config.js`. Any contributor expecting v3 conventions (config file, `@tailwind base/components/utilities`) will be confused.
- Impact: Low — configuration is already migrated and working.
- Migration plan: None needed; just document the v4 CSS-first approach in CONVENTIONS/STACK docs.

## Missing Critical Features

**No tests at all:**
- Problem: Zero test files, no test runner configured (`package.json` scripts are only `dev`, `build`, `start`, `lint`), no CI workflow (`.github/workflows` absent). The entire journey logic (`journey-progress.ts` validation, `mock-results.ts` scoring) is untested.
- Blocks: Refactoring the progress model or results computation has no safety net; regressions in lock/unlock or completion logic would go unnoticed.
- Priority: High for any future phase touching `src/lib/` or `src/hooks/`.

**No Virti content (by design):**
- Problem: All six steps are placeholders; `embedId` is `null` everywhere in `src/data/journey.ts`.
- Blocks: Real training value, real scoring, real time tracking. This is the stated milestone-1 boundary per CLAUDE.md, so it is a planned gap, not an oversight — but it is the largest missing capability.

**No error boundary for client components beyond the app-level one:**
- Problem: `src/app/error.tsx` is the only error boundary. Client-only components that read `localStorage` (`useJourneyProgress`) are wrapped by it, so a `localStorage` failure surfaces as a full-page error with a "clear progress and restart" suggestion rather than a graceful degradation.
- Files: `src/app/error.tsx`, `src/lib/journey-progress.ts`
- Risk: In privacy-mode or storage-disabled browsers, every journey page errors out. Low priority (storage-disabled browsers are rare), but a targeted fallback (in-memory progress when `localStorage` throws) would be more robust.

## Test Coverage Gaps

**Journey progress logic (untested):**
- What's not tested: `isValidProgress` validation, `getStepStatuses` lock/current/upcoming/completed classification, `getResumeRoute` all-completed vs. resume behavior, `clearJourneyProgress` semantics, subscription/notification behavior.
- Files: `src/lib/journey-progress.ts`, `src/hooks/use-journey-progress.ts`
- Risk: The lock/unlock UX and resume button are core flows; a regression (e.g., all steps showing "locked" after completion) would break the entire course flow silently.
- Priority: High — this is the most logic-dense, least-covered module.

**Results computation (untested):**
- What's not tested: `buildSessionResult` time-delta math and fallback to `estimatedMinutes`, overall score averaging, `allPassed`, `PASS_MARK` boundary (exactly 80).
- Files: `src/lib/mock-results.ts`
- Risk: The fabricated-score behavior and time fallback are non-obvious; a refactor could easily change displayed scores.
- Priority: Medium.

**Component-level rendering (untested):**
- What's not tested: `ProgressTracker` current-step detection (`getCurrentStepNumber`), `PrerequisiteGate` locked/unlocked branches, `PlaceholderFrame` timer→finished→MarkComplete sequence, `Button` link-vs-button polymorphism.
- Files: `src/components/progress-tracker.tsx`, `src/components/prerequisite-gate.tsx`, `src/components/placeholder-frame.tsx`, `src/components/ui/button.tsx`
- Risk: UI regressions in lock states and button behavior.
- Priority: Medium.

---

*Concerns audit: 2026-10-02*
