---
last_mapped_commit: 1137fe8b9845149807cfba3c387ff9eaf742f7d2
last_mapped_at: 2026-10-02
---
<!-- refreshed: 2026-10-02 -->

# Architecture

**Analysis Date:** 2026-10-02

## System Overview

```text
┌──────────────────────────────────────────────────────────────────┐
│                    Next.js 16 App Router (React 19)               │
│  Server Components render pages; client components hydrate only   │
│  where interaction is required ("use client")                     │
├──────────────────┬──────────────────┬────────────────────────────┤
│  Pages (SSG)     │  Layouts         │  Error/Status Pages        │
│  `src/app/page.tsx` │ `src/app/layout.tsx`     │ `error.tsx`     │
│  `src/app/journey/` │ `src/app/journey/`       │ `not-found.tsx` │
│  `step/[step]/`     │ `layout.tsx`            │ `loading.tsx`   │
│  `results/page.tsx` │                     │                       │
└────────┬─────────┴────────┬─────────┴──────────┬─────────────────┘
         │                  │                     │
         │  props + imports │  props              │
         ▼                  ▼                     ▼
┌──────────────────────────────────────────────────────────────────┐
│  Components (presentation + client interaction)                   │
│  `src/components/*.tsx` (feature) + `src/components/ui/*.tsx`     │
│  e.g. ProgressTracker, JourneyStepList, PlaceholderFrame,         │
│  MarkCompleteButton, PrerequisiteGate, StartCourseButton          │
└────────┬────────────────────────────────────────┬─────────────────┘
         │  hooks                                 │  data imports
         ▼                                        ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│  Hooks (React binding)       │  │  Static content (source of    │
│  `src/hooks/use-journey-     │  │  truth for the 6-step journey)│
│  progress.ts`                │  │  `src/data/journey.ts`        │
│  (useSyncExternalStore)      │  └──────────────────────────────┘
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│  Pure business logic (browser-side)                               │
│  `src/lib/journey-progress.ts`  — localStorage + subscription     │
│  `src/lib/mock-results.ts`      — score/time computation (mock)   │
└──────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root layout | HTML shell, fonts, global header/footer | `src/app/layout.tsx` |
| Home page | Landing hero, learning-flow preview, CTA | `src/app/page.tsx` |
| Journey overview | Course overview with step cards | `src/app/journey/page.tsx` |
| Journey layout | Wraps `/journey` subtree with `ProgressTracker` | `src/app/journey/layout.tsx` |
| Step page | Renders one of steps 1–5, SSR static | `src/app/journey/step/[step]/page.tsx` |
| Results page | Session summary, scores, feedback (client) | `src/app/journey/results/page.tsx` |
| Journey config | 6-step course definition + lookup helpers | `src/data/journey.ts` |
| Progress lib | localStorage persistence + derived statuses | `src/lib/journey-progress.ts` |
| Progress hook | React binding over progress lib | `src/hooks/use-journey-progress.ts` |
| Mock results lib | Builds session result / scores (mock data) | `src/lib/mock-results.ts` |
| UI primitives | `Button`, `Badge` | `src/components/ui/button.tsx`, `src/components/ui/badge.tsx` |
| Feature components | Header, footer, tracker, cards, gates, placeholders | `src/components/*.tsx` |

## Pattern Overview

**Overall:** Server-first App Router with data-driven client interactivity. All course content is defined declaratively in a single typed config (`JOURNEY_STEPS`), and the UI (step cards, progress tracker, step pages, results) is rendered from that config. Client-side state is limited to journey progress persisted in `localStorage`.

**Key Characteristics:**
- **Server Components by default** — pages, layouts, and presentational components are plain async/sync components; only interactive components carry `"use client"` (e.g. `src/components/progress-tracker.tsx`, `src/components/mark-complete-button.tsx`, `src/components/placeholder-frame.tsx`, `src/hooks/use-journey-progress.ts`).
- **Config-driven content** — `JOURNEY_STEPS` in `src/data/journey.ts` is the single source of truth for steps, routes, titles, learning objectives, Virti module metadata, and estimated minutes. No hardcoded step content in pages.
- **Bilingual content model** — every user-facing string is a `LocalizedText = { zh; en }` object rendered through `BilingualText` (`src/components/bilingual-text.tsx`).
- **Typed routes** — Next `Route` type from `"next"` is used for route fields (`src/data/journey.ts:11`, `src/lib/journey-progress.ts:120`) giving compile-time route safety.
- **Static generation** — step pages use `generateStaticParams` + `dynamicParams = false` (`src/app/journey/step/[step]/page.tsx:10-16`).
- **No backend, no database, no auth** — browser-only persistence via `localStorage` (per `CLAUDE.md`).

## Layers

**Pages (App Router routes):**
- Purpose: Define routes, generate metadata, compose components
- Location: `src/app/`
- Contains: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- Depends on: `src/components/`, `src/data/`, `src/lib/`, `src/hooks/`
- Used by: Next.js router

**Components:**
- Purpose: Rendering and client interaction
- Location: `src/components/` (feature) and `src/components/ui/` (primitives)
- Contains: Presentational and interactive components; `"use client"` where interaction/state needed
- Depends on: `src/hooks/`, `src/lib/`, `src/data/`
- Used by: Pages and other components

**Hooks:**
- Purpose: Bridge React to the pure progress library
- Location: `src/hooks/use-journey-progress.ts`
- Contains: `useJourneyProgress()` via `useSyncExternalStore`
- Depends on: `src/lib/journey-progress.ts`
- Used by: Client components (`progress-tracker.tsx`, `journey-step-list.tsx`, `mark-complete-button.tsx`, `start-course-button.tsx`, `prerequisite-gate.tsx`, `results-summary.tsx`, `src/app/journey/results/page.tsx`)

**Lib (pure logic):**
- Purpose: Framework-free business logic, testable, browser-only
- Location: `src/lib/journey-progress.ts`, `src/lib/mock-results.ts`
- Contains: localStorage persistence, status derivation, resume-route logic, mock score/time computation
- Depends on: `src/data/journey.ts`, `"next"` types only
- Used by: Hooks and client components

**Data (static content):**
- Purpose: Single source of truth for course configuration
- Location: `src/data/journey.ts`
- Contains: `JourneyStepConfig`, `JOURNEY_STEPS`, helpers `getStep`, `getAdjacentSteps`, `getFirstIncompleteStep`
- Depends on: Nothing (only `"next"` type import)
- Used by: Pages, components, lib

## Data Flow

### Primary Request Path (step page load)

1. User navigates to `/journey/step/2` — Next.js matches `src/app/journey/step/[step]/page.tsx`
2. `generateMetadata` awaits `params` and looks up `getStep(Number(stepParam))` (`src/app/journey/step/[step]/page.tsx:22-31`)
3. `StepPage` validates the step; `!step || stepNumber > 5` calls `notFound()` (`:38-40`)
4. Renders `PageHeader`, then either `IntroStepBody` (step 1) or `PrerequisiteGate` wrapping `PlaceholderFrame` (`:54-65`)
5. `PrerequisiteGate` (client) reads progress via `useJourneyProgress`, unlocks children when `requires` steps are completed (`src/components/prerequisite-gate.tsx:14-25`)
6. `PlaceholderFrame` (client) runs a 2.5s simulated Virti module, then shows `MarkCompleteButton` (`src/components/placeholder-frame.tsx:16-44,117-124`)

### Mark-Complete Flow (state mutation + same-tab sync)

1. User clicks `MarkCompleteButton` (`src/components/mark-complete-button.tsx`)
2. `handleClick` calls `markStepComplete(step)` from `useJourneyProgress`, then `router.push(nextRoute)` (`:22-31`)
3. Hook invalidates the lib cache, then calls lib `markStepComplete` (`src/hooks/use-journey-progress.ts:21-24`)
4. Lib merges `{ [step]: { completedAt } }` into progress, writes `localStorage`, and calls `notifyListeners()` (`src/lib/journey-progress.ts:70-81,146-148`)
5. All subscribed components (`ProgressTracker`, `JourneyStepList`, etc.) re-read via `useSyncExternalStore` and re-render with new statuses

### Results Computation Flow

1. `/journey/results` (`src/app/journey/results/page.tsx`, client) reads `useJourneyProgress`
2. Checks all non-results steps completed; renders `ResultsSummary` or an incomplete panel (`:13-35`)
3. `ResultsSummary` calls `buildSessionResult(progress)` (`src/components/results-summary.tsx:14`)
4. `buildSessionResult` computes per-step mock scores, time deltas from `completedAt` timestamps with fallback to `estimatedMinutes`, and overall average (`src/lib/mock-results.ts:31-88`)

**State Management:**
- Single client-side store: journey progress persisted under localStorage key `pnt.journey.v1` (`src/lib/journey-progress.ts:11`)
- React integration via `useSyncExternalStore` with lib-level `subscribeProgress`/`notifyListeners` (`src/lib/journey-progress.ts:138-148`)
- Runtime validation on read via `isValidProgress`; invalid/absent data yields `null` (fresh start) (`src/lib/journey-progress.ts:130-134`)
- Module-level cache (`cachedProgress`) speeds repeated reads within a tab; must be invalidated before writes (the hook does this — see `src/hooks/use-journey-progress.ts:21-34`)

## Key Abstractions

**JourneyStepConfig:**
- Purpose: Declarative definition of one course step (used to drive every UI surface)
- Examples: `src/data/journey.ts:7-23` and the 6 entries at `:25-253`
- Pattern: Typed data object; page components switch on `kind` (`"intro" | "vh" | "scenario360" | "results"`)

**StepStatus:**
- Purpose: Derived per-step state used by tracker, cards, and gates
- Examples: `src/lib/journey-progress.ts:13`; derived in `getStepStatuses` (`:100-118`)
- Pattern: `"completed" | "current" | "locked" | "upcoming"` — completed steps stay visited, the first incomplete step is `current`, later steps are `locked`, earlier non-completed steps are `upcoming` (revisitable)

**LocalizedText / BilingualText:**
- Purpose: Enforces the zh-TW + en bilingual UI convention
- Examples: type `src/data/journey.ts:3`; renderer `src/components/bilingual-text.tsx`
- Pattern: `{ zh: string; en: string }` everywhere user-facing

**PrerequisiteGate:**
- Purpose: Linear-progression lock wrapper for step content
- Example: `src/components/prerequisite-gate.tsx`
- Pattern: Client component that conditionally renders children or a locked-state panel with a "go to current step" link

**Button (dual role):**
- Purpose: Renders as `<Link>` when given `href`, else `<button>`
- Example: `src/components/ui/button.tsx:48-61`
- Pattern: Discriminated union props (`ButtonAsButtonProps | ButtonAsLinkProps`)

## Entry Points

**Home (`/`):**
- Location: `src/app/page.tsx`
- Triggers: Root route
- Responsibilities: Hero, learning-flow preview from `JOURNEY_STEPS`, CTA buttons

**Journey Overview (`/journey`):**
- Location: `src/app/journey/page.tsx`
- Triggers: Nav/CTA navigation
- Responsibilities: Course overview, `JourneyStepList` with live statuses, `StartCourseButton`

**Step Page (`/journey/step/[step]`):**
- Location: `src/app/journey/step/[step]/page.tsx`
- Triggers: Static params for steps 1–5; `dynamicParams = false` rejects others
- Responsibilities: Render step content, prerequisite gating, prev/next navigation, `MarkCompleteButton`

**Results (`/journey/results`):**
- Location: `src/app/journey/results/page.tsx`
- Triggers: Completion or navigation
- Responsibilities: Completion check, `ResultsSummary` (mock scores, feedback, restart), incomplete-step panel

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: All routes
- Responsibilities: `<html lang="zh-Hant-TW">`, Geist fonts, metadata template, `SiteHeader`/`SiteFooter`

## Architectural Constraints

- **Threading:** Single-threaded browser JS; no workers, no server-side computation beyond static rendering. All progress/result logic runs in the client.
- **Global state:** Module-level singletons in `src/lib/journey-progress.ts`: `cachedProgress` (`:15`) and `listeners` Set (`:139`). `cachedProgress` must be invalidated before every mutation — currently only guaranteed by the hook wrapper (`src/hooks/use-journey-progress.ts:21-34`), a footgun for direct lib callers.
- **Circular imports:** None detected. Dependency direction is strictly one-way: `data/` ← `lib/` ← `hooks/` ← `components/` ← `app/`; `data/` imports nothing project-internal.
- **Client/Server split:** Every interactive component carries `"use client"` at the top of its file. No component mixes server and client rendering.
- **No backend:** `CLAUDE.md` forbids auth, database, and backend APIs; persistence is localStorage only, so state is per-browser and non-shared.

## Anti-Patterns

### Direct lib mutation bypassing the cache invalidation

**What happens:** `src/lib/journey-progress.ts` exposes `markStepComplete` / `markStepVisited` / `writeJourneyProgress` / `clearJourneyProgress` that mutate the module-level `cachedProgress`. Callers must call `invalidateProgressCache()` first or subsequent `readJourneyProgress()` returns stale data. Only `src/hooks/use-journey-progress.ts` currently does this correctly.
**Why it's wrong:** The correctness contract is invisible in the lib API signature; a future direct caller (e.g. a new component calling the lib functions) silently reads stale progress.
**Do this instead:** Fold invalidation into the lib write functions themselves (write functions always invalidate their own cache), or keep all mutations behind the hook. See `src/hooks/use-journey-progress.ts:21-34` for the current correct pattern.

### Hardcoded step-count coupling in the step page

**What happens:** `src/app/journey/step/[step]/page.tsx` hardcodes the boundary `stepNumber > 5` (`:38`) while `JOURNEY_STEPS` has 6 entries and `generateStaticParams` filters `s.step >= 1 && s.step <= 5` (`:10-14`). The 6th entry ("results") lives at a separate route.
**Why it's wrong:** If a new learning step is added or the results step becomes a numbered step, the `> 5` magic number and the params filter must be updated in sync, and both are separate from the data.
**Do this instead:** Drive the boundary from config — e.g. filter steps by `kind !== "results"` (as `src/app/journey/results/page.tsx:13` already does) instead of numeric ranges.

### `confirm()` browser dialog for a destructive action

**What happens:** `src/components/results-summary.tsx:17` uses the native `confirm()` dialog before resetting progress.
**Why it's wrong:** Inconsistent with the rest of the polished UI and not testable.
**Do this instead:** An inline confirmation state or a small modal, matching the existing card-based UI style.

## Error Handling

**Strategy:** Defensive reads + framework error surfaces. Browser persistence is treated as unreliable (may be absent, corrupted, or cross-version).

**Patterns:**
- `try/catch` around `JSON.parse` with graceful `null` fallback (`src/lib/journey-progress.ts:30-46`)
- Runtime shape validation `isValidProgress` before trusting parsed data (`src/lib/journey-progress.ts:130-134`)
- `notFound()` for invalid step params (`src/app/journey/step/[step]/page.tsx:38-40`)
- Client error boundary `src/app/error.tsx` with `reset()` retry and a link back to `/journey`
- `src/app/not-found.tsx` global 404 page
- Missing steps handled defensively: `getStep` returns `undefined`, `getAdjacentSteps` returns `{}`, results code guards `find` results with `if (!step) return null`

## Cross-Cutting Concerns

**Logging:** Only `console.error` in the error boundary (`src/app/error.tsx:13`). No logging library.
**Validation:** Runtime guard for localStorage data (`isValidProgress`); TypeScript `strict` mode with typed routes (`Route`) for compile-time route safety; `dynamicParams = false` restricts dynamic routes.
**Authentication:** None — explicitly out of scope per `CLAUDE.md`.
**Localization:** `LocalizedText` type + `BilingualText` component used throughout; `lang="zh-Hant-TW"` on `<html>`.

---

*Architecture analysis: 2026-10-02*
