---
last_mapped_commit: 1137fe8b9845149807cfba3c387ff9eaf742f7d2
last_mapped_at: 2026-10-02
---
# Codebase Structure

**Analysis Date:** 2026-10-02

## Directory Layout

```
pediatric-nursing-training/
├── src/
│   ├── app/                    # App Router pages, layouts, error/loading
│   │   ├── layout.tsx          # Root layout (fonts, header/footer shell)
│   │   ├── page.tsx            # Landing page (`/`)
│   │   ├── globals.css         # Tailwind v4 CSS + design tokens
│   │   ├── error.tsx           # Client error boundary
│   │   ├── not-found.tsx       # Global 404
│   │   ├── favicon.ico
│   │   └── journey/
│   │       ├── layout.tsx      # Journey layout (ProgressTracker wrapper)
│   │       ├── loading.tsx     # Journey loading skeleton
│   │       ├── page.tsx        # Course overview (`/journey`)
│   │       ├── step/
│   │       │   └── [step]/
│   │       │       └── page.tsx  # Step pages 1–5 (SSG)
│   │       └── results/
│   │           └── page.tsx    # Results page (`/journey/results`)
│   ├── components/             # Feature components
│   │   ├── bilingual-text.tsx
│   │   ├── journey-step-card.tsx
│   │   ├── journey-step-list.tsx
│   │   ├── mark-complete-button.tsx
│   │   ├── page-header.tsx
│   │   ├── placeholder-frame.tsx
│   │   ├── prerequisite-gate.tsx
│   │   ├── progress-tracker.tsx
│   │   ├── results-summary.tsx
│   │   ├── site-footer.tsx
│   │   ├── site-header.tsx
│   │   └── start-course-button.tsx
│   │   └── ui/                 # UI primitives
│   │       ├── badge.tsx
│   │       └── button.tsx
│   ├── data/                   # Static course content (source of truth)
│   │   └── journey.ts
│   ├── hooks/                  # React hooks
│   │   └── use-journey-progress.ts
│   └── lib/                    # Pure business logic (browser-side)
│       ├── journey-progress.ts
│       └── mock-results.ts
├── public/                     # Static assets (SVG logos, favicon)
├── .claude/
│   └── skills/                 # Project skills (commit-and-push, project-onboarding)
├── next.config.ts              # Next.js config (empty)
├── tsconfig.json               # TS config + `@/*` path alias
├── eslint.config.mjs           # ESLint flat config (next/core-web-vitals + typescript)
├── postcss.config.mjs          # Tailwind v4 PostCSS plugin
├── package.json
├── package-lock.json
├── CLAUDE.md                   # Project instructions
└── README.md
```

## Directory Purposes

**`src/app/`:**
- Purpose: All routes and app shell — App Router pages, layouts, loading/error/not-found
- Contains: `page.tsx`/`layout.tsx` per route segment; `globals.css` design tokens
- Key files: `src/app/layout.tsx` (root shell), `src/app/journey/step/[step]/page.tsx` (step pages), `src/app/journey/results/page.tsx`

**`src/components/`:**
- Purpose: Feature-level React components (presentational and interactive)
- Contains: One component per file, kebab-case; `"use client"` where interaction is needed
- Key files: `progress-tracker.tsx`, `journey-step-list.tsx`, `placeholder-frame.tsx`, `prerequisite-gate.tsx`, `mark-complete-button.tsx`, `results-summary.tsx`

**`src/components/ui/`:**
- Purpose: Reusable UI primitives (design-system atoms)
- Contains: `button.tsx` (link-or-button dual role), `badge.tsx`
- Key files: `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`

**`src/data/`:**
- Purpose: Static, typed course configuration — the single source of truth for the 6-step journey
- Contains: `JourneyStepConfig`, `JOURNEY_STEPS`, lookup helpers
- Key files: `src/data/journey.ts`

**`src/hooks/`:**
- Purpose: React hooks binding lib logic to components
- Contains: `useJourneyProgress` (via `useSyncExternalStore`)
- Key files: `src/hooks/use-journey-progress.ts`

**`src/lib/`:**
- Purpose: Pure, framework-free business logic that runs in the browser
- Contains: localStorage progress persistence + status derivation; mock result/score computation
- Key files: `src/lib/journey-progress.ts`, `src/lib/mock-results.ts`

**`public/`:**
- Purpose: Static assets served at root
- Contains: Default Next.js SVG logos (`next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg`), `favicon.ico`
- Generated: No. Committed: Yes

**`.claude/skills/`:**
- Purpose: Project-scoped Claude Code skills
- Contains: `commit-and-push`, `project-onboarding`
- Committed: Yes

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Landing page (`/`)
- `src/app/layout.tsx`: Root layout — fonts, metadata, header/footer
- `src/app/journey/page.tsx`: Course overview (`/journey`)
- `src/app/journey/step/[step]/page.tsx`: Individual step pages (steps 1–5)
- `src/app/journey/results/page.tsx`: Results and feedback

**Configuration:**
- `next.config.ts`: Next.js config (currently empty)
- `tsconfig.json`: TypeScript config with `@/*` → `./src/*` alias
- `eslint.config.mjs`: ESLint flat config (eslint-config-next core-web-vitals + typescript)
- `postcss.config.mjs`: Tailwind v4 PostCSS plugin
- `src/app/globals.css`: Design tokens (colors, radius, fonts) via Tailwind v4 `@theme inline`
- `package.json`: Scripts (`dev`, `build`, `start`, `lint`) and dependencies

**Core Logic:**
- `src/data/journey.ts`: Course step definitions and helpers
- `src/lib/journey-progress.ts`: Progress persistence, status derivation, resume logic
- `src/lib/mock-results.ts`: Mock scores, time computation, session result builder
- `src/hooks/use-journey-progress.ts`: React binding to progress store

**Testing:**
- Not present — no test files, no test framework, no test config in the repo

## Naming Conventions

**Files:**
- React components: kebab-case `*.tsx` (e.g. `journey-step-card.tsx`, `mark-complete-button.tsx`, `progress-tracker.tsx`)
- Logic modules: kebab-case `*.ts` (e.g. `journey-progress.ts`, `mock-results.ts`)
- Next.js special files: lowercase reserved names (`layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`)
- Data/config: lowercase (`journey.ts`)

**Directories:**
- Lowercase kebab-case for feature dirs (`journey`, `journey/step/[step]`, `journey/results`)
- `ui/` subdirectory reserved for reusable primitives
- Short generic dirs: `data/`, `hooks/`, `lib/`, `components/`, `app/`

## Where to Add New Code

**New Feature (e.g. new page/section):**
- Primary code: new route under `src/app/.../page.tsx` + components in `src/components/`
- Content/config: extend `src/data/journey.ts` (or add a sibling data module)
- Client state: extend `src/hooks/` and `src/lib/`
- Tests: no test setup exists; would need a new `*.test.ts` + runner (none configured)

**New Component/Module:**
- Interactive component: `src/components/<name>.tsx` with `"use client"` at the top
- Presentational component: `src/components/<name>.tsx` (server component, no directive)
- Reusable primitive (Button/Badge-like): `src/components/ui/<name>.tsx`
- Pure logic: `src/lib/<name>.ts`
- React hook: `src/hooks/use-<name>.ts`

**Utilities:**
- Shared helpers used by multiple modules: `src/lib/`
- Static course/content data: `src/data/`

**Conventions to follow when adding code:**
- Use the `@/` path alias for all imports (`@/components/...`, `@/lib/...`, `@/data/...`)
- Represent every user-facing string as `LocalizedText = { zh; en }` and render via `BilingualText`
- Prefer Server Components; add `"use client"` only for interactivity
- Route fields should be typed as Next `Route`
- Do not add auth, database, or backend APIs (per `CLAUDE.md`); keep Virti out until explicitly requested

## Special Directories

**`src/app/journey/step/[step]/`:**
- Purpose: Dynamic step route; statically generated for steps 1–5 via `generateStaticParams` with `dynamicParams = false`
- Generated: Yes (at build time)
- Committed: Yes (source)

**`public/`:**
- Purpose: Static assets (default Next.js SVGs, favicon)
- Generated: No. Committed: Yes

**`.claude/skills/`:**
- Purpose: Project-scoped Claude Code skills
- Generated: No. Committed: Yes

**`node_modules/` / `.next/`:**
- Generated: Yes. Committed: No (gitignored)

---

*Structure analysis: 2026-10-02*
