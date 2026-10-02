---
last_mapped_commit: 1137fe8b9845149807cfba3c387ff9eaf742f7d2
last_mapped_at: 2026-10-02
---
# Coding Conventions

**Analysis Date:** 2026-10-02

## Overview

Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 4 project. Small codebase (~1900 lines total across `src/`). All logic is client-side; no backend, no database, no auth. State persists to `localStorage`.

## Naming Patterns

**Files:**
- kebab-case for all files and directories: `bilingual-text.tsx`, `journey-step-card.tsx`, `use-journey-progress.ts`, `mock-results.ts`
- Components live in `src/components/` (flat) and `src/components/ui/` (reusable primitives)
- Hooks use `use-` prefix: `src/hooks/use-journey-progress.ts`
- App Router special files keep their reserved names: `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`

**Functions:**
- PascalCase for components: `export function BilingualText(...)` in `src/components/bilingual-text.tsx`
- camelCase for helpers and hooks: `getStepStatuses`, `markStepComplete`, `useJourneyProgress`
- Local helper functions defined below the component in the same file, e.g. `getStatusConfig` in `src/components/journey-step-card.tsx`, `getModuleLabel` in `src/components/placeholder-frame.tsx`
- Export components as **named exports** (`export function X`), not default exports — except App Router page/layout files which use `export default function`

**Variables:**
- camelCase; constants in SCREAMING_SNAKE_CASE: `PASS_MARK`, `JOURNEY_PROGRESS_KEY`, `SIMULATION_DURATION_MS`
- `const` preferred; `let` only for mutable module state (`cachedProgress` in `src/lib/journey-progress.ts`)

**Types:**
- PascalCase interfaces/types: `JourneyStepConfig`, `LocalizedText`, `StepStatus`, `SessionResult`
- Props interfaces named `XxxProps` and declared in the same file directly above the component (e.g. `BadgeProps` in `src/components/ui/badge.tsx`)
- Union types for variants: `type StepStatus = "completed" | "current" | "locked" | "upcoming"` in `src/lib/journey-progress.ts`
- Use `interface` for object shapes, `type` for unions and aliases
- `as const` used to narrow literal types in variant maps: `badgeVariant: "success" as const` in `src/components/journey-step-card.tsx`

## Code Style

**Formatting:**
- No Prettier installed — no `.prettierrc*` present. Formatting is manual, consistent with Next.js defaults: double quotes, semicolons, 2-space indent, trailing commas
- Tailwind class strings on single lines when short, template literals or `.join(" ")` when conditional

**Linting:**
- ESLint 9 flat config in `eslint.config.mjs` using `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- Run via `npm run lint` (script is `eslint`; no args needed with flat config)
- No custom rules added beyond the next config defaults

## Import Organization

**Order:**
1. React/Next package imports first (with `import type` where applicable)
2. `next/*` imports
3. `@/` internal imports (alphabetical by path)

Example from `src/app/journey/step/[step]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PlaceholderFrame } from "@/components/placeholder-frame";
```

**Path Aliases:**
- `@/*` → `./src/*` (configured in `tsconfig.json` `paths`)
- All internal imports use `@/` — no relative imports observed

**Type Imports:**
- `import type { ... }` used consistently for type-only imports (verified in `src/components/bilingual-text.tsx`, `src/components/journey-step-card.tsx`, etc.)

## React Patterns

**Server vs Client Components:**
- Default to Server Components (per project rule). Add `"use client"` only when interactivity requires it
- Client components observed: `src/components/journey-step-list.tsx`, `src/components/mark-complete-button.tsx`, `src/components/placeholder-frame.tsx`, `src/components/prerequisite-gate.tsx`, `src/components/progress-tracker.tsx`, `src/components/results-summary.tsx`, `src/components/start-course-button.tsx`, `src/hooks/use-journey-progress.ts`, `src/app/error.tsx`, `src/app/journey/results/page.tsx`
- Server components: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/not-found.tsx`, `src/app/journey/layout.tsx`, `src/app/journey/page.tsx`, `src/app/journey/step/[step]/page.tsx`, `src/components/bilingual-text.tsx`, `src/components/journey-step-card.tsx`, `src/components/page-header.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/components/ui/*`

**Props & Destructuring:**
- Components destructure props with defaults inline: `function BilingualText({ text, variant = "inline", className = "" }: BilingualTextProps)`
- Use `ReactNode` type for children: `children: ReactNode` in `src/components/prerequisite-gate.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/button.tsx`

**State Management:**
- Custom hook `useJourneyProgress` (`src/hooks/use-journey-progress.ts`) wraps `src/lib/journey-progress.ts` using `useSyncExternalStore` — the library module holds a `Set<Listener>` subscription mechanism and a module-level `cachedProgress` cache
- Mutators wrapped in `useCallback`; cache invalidated before each write
- Local component state with `useState` for UI-only state: `isPlaying`, `progress`, `finished` in `src/components/placeholder-frame.tsx`
- `useEffect` with cleanup (clearInterval) for timers

**Styling:**
- Tailwind CSS 4 (`@import "tailwindcss"` in `src/app/globals.css`), theme tokens defined via CSS variables in `:root` and mapped in `@theme inline` block
- Custom semantic color tokens only: `primary`, `primary-foreground`, `primary-subtle`, `muted`, `muted-background`, `border`, `ring`, `success`, `success-subtle`, `warning`, `warning-subtle`, `foreground`, `background`
- No arbitrary hex colors in components — always use semantic tokens (`text-muted`, `bg-primary-subtle`, `border-border`)
- Conditional classes: template literals with ternary inside, e.g. `src/components/journey-step-card.tsx`; array `.join(" ")` in `src/components/progress-tracker.tsx`
- Reusable button/badge primitives in `src/components/ui/button.tsx` and `src/components/ui/badge.tsx` — `Button` polymorphically renders `next/link` `Link` when `href` prop present, else `<button>`

## Bilingual Content Pattern

- All user-facing UI text is bilingual (Traditional Chinese + English)
- Data model: `type LocalizedText = { zh: string; en: string }` in `src/data/journey.ts`
- Components take `LocalizedText` props and render via the `BilingualText` component (`src/components/bilingual-text.tsx`) with `variant="inline" | "stacked"`
- Inline bilingual spans pattern: `<span className="ml-2 text-sm font-normal text-muted">English</span>` following the Chinese text
- Terminology rules from `CLAUDE.md`: use 「兒童」 not 「小兒」; 「學齡期兒童」 for the age group; target learner is 「護理學生」

## Error Handling

**Patterns:**
- `readJourneyProgress` wraps `localStorage` get/parse in try/catch, returning `null` on any failure (`src/lib/journey-progress.ts`)
- Data validation via type guard: `isValidProgress(value): value is JourneyProgress` — invalid stored data is discarded
- Unknown routes: `notFound()` from `next/navigation` in `src/app/journey/step/[step]/page.tsx` for invalid step numbers (`if (!step || stepNumber > 5) notFound()`)
- Global error boundary: `src/app/error.tsx` (client component) with `error` + `reset` props
- 404 page: `src/app/not-found.tsx`
- Optional chaining and `??` used instead of throwing: `getAdjacentSteps(step).next?.route`, `progress?.steps[stepNumber]`
- No thrown custom errors or error classes anywhere in the codebase

## Logging

**Framework:** No logging library. `console.error` only, in the global error boundary `src/app/error.tsx`:

```typescript
useEffect(() => {
  console.error("Application error:", error);
}, [error]);
```

## Comments

**When to Comment:**
- Minimal comments overall. Section markers in JSX: `{/* Hero */}`, `{/* Learning flow preview */}`, `{/* Footer CTA */}` in `src/app/page.tsx`
- Section divider comments in non-JSX: `// --- Subscription mechanism for same-tab updates ---` in `src/lib/journey-progress.ts`
- One explanatory comment for a non-obvious fallback in `src/lib/mock-results.ts`: `// Fallback to estimated duration if we cannot compute a reasonable delta.`

**JSDoc/TSDoc:**
- Not used. No JSDoc blocks anywhere in the codebase

## Function Design

**Size:** Functions are small and single-purpose. Largest files: `src/data/journey.ts` (276 lines, mostly data), `src/lib/journey-progress.ts` (152 lines). No component exceeds ~140 lines.

**Parameters:**
- Props objects with defaults; helper functions take primitives
- Local helpers that only render markup are co-located as private functions in the same file (e.g. `IntroStepBody`, `IncompleteResultsPanel`, `StepIndicator`)

**Return Values:**
- Pure functions return typed values; `undefined`/`null` used instead of throwing
- `getStep(step): JourneyStepConfig | undefined`, `getResumeRoute(progress): Route`

## Module Design

**Exports:**
- Named exports for all modules; no default exports except App Router special files
- Barrel files: not used — components import directly from file paths

**Directory Roles:**
- `src/app/` — App Router pages/routes only
- `src/components/` — presentational + interactive components
- `src/components/ui/` — generic UI primitives (Button, Badge)
- `src/hooks/` — React hooks wrapping lib state
- `src/lib/` — framework-agnostic logic (state store, mock results)
- `src/data/` — static content/config data (journey steps)
- `src/app/globals.css` — Tailwind theme

## Project Rules (from `CLAUDE.md`)

- No authentication, no database, no backend APIs, no Virti integration yet — all content is mock data and placeholders
- Reusable components preferred; Server Components unless client interactivity is required
- Professional UI suitable for nursing education — not childish
- This is not a patient-facing application

---

*Convention analysis: 2026-10-02*
