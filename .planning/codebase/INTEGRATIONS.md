---
last_mapped_commit: 1137fe8b9845149807cfba3c387ff9eaf742f7d2
last_mapped_at: 2026-10-02
---
# External Integrations

**Analysis Date:** 2026-10-02

## APIs & External Services

**None active — mock/placeholder-first build:**
- No external API calls exist anywhere in `src/`. No `fetch`, `axios`, or other HTTP client usage detected
- The app is a clickable first-version product website using mock data and placeholders
- Planned-but-not-integrated: **Virti** (virtual human scenarios, interactive video, 360-degree training). The data model already anticipates it:
  - `src/data/journey.ts` defines `VirtiModuleType = "virtual-human" | "interactive-video" | "360-scenario"` and each step has a `virti` object with `moduleType`, `embedId` (currently `null` for all steps), optional `character`, and `scenarioNote`
  - `src/components/placeholder-frame.tsx` renders a simulated player ("Virti Placeholder · Not integrated yet") and reports "When live, this area will embed the Virti interactive module"
  - No Virti SDK, embed URL, or credentials present yet. Integration is intentionally deferred per `CLAUDE.md` ("Do not integrate Virti yet")

## Data Storage

**Databases:**
- None. No database client, ORM, or connection strings. `CLAUDE.md` explicitly forbids adding a database yet

**File Storage:**
- Local filesystem only — static assets in `public/` (default Next.js SVGs: `file.svg`, `vercel.svg`, `next.svg`, `globe.svg`, `window.svg`; `src/app/favicon.ico`)

**Caching:**
- None (no Redis, no in-memory server cache). Client-side state is held in a module-level `cachedProgress` variable in `src/lib/journey-progress.ts` (per-tab, non-persistent)

## Authentication & Identity

**Auth Provider:**
- None. No auth library, no login flow, no session handling. `CLAUDE.md` explicitly forbids adding authentication yet
- The only "identity" concept is anonymous per-browser learning progress (see Browser Storage below)

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, Datadog, etc.)

**Logs:**
- Browser `console.error` in `src/app/error.tsx` (client error boundary) — the only logging in the app

## CI/CD & Deployment

**Hosting:**
- Vercel (project `pediatric-nursing-training`)
  - Production URL: https://pediatric-nursing-training.vercel.app
  - Team scope: `cguim-83` (orgId `team_Tzz9wV81DqaJzeg0ImkVQpNC`) — required on every `vercel` command
  - Preview: `vercel deploy --scope cguim-83`; Production: `vercel deploy --prod --scope cguim-83` (documented in `CLAUDE.md`)
  - No `vercel.json` — default build settings (`npm run build`)

**CI Pipeline:**
- None detected — no `.github/` directory, no GitHub Actions workflows, no other CI config

## Browser Storage (client-side persistence)

**Local Storage:**
- Learning progress persisted to `window.localStorage` under key `pnt.journey.v1` (see `src/lib/journey-progress.ts`, constant `JOURNEY_PROGRESS_KEY`)
- Shape: `{ version: 1, steps: { [stepNumber]: { completedAt } }, lastStepVisited, updatedAt }`
- Same-tab reactivity via a `subscribeProgress` listener set consumed by `useSyncExternalStore` in `src/hooks/use-journey-progress.ts`
- Cross-tab sync is not implemented (no `storage` event listener)

## Environment Configuration

**Required env vars:**
- None. The app reads no environment variables (`process.env` / `NEXT_PUBLIC_*` absent from `src/`). No `.env` files exist

**Secrets location:**
- Not applicable — no secrets in the codebase. Vercel deployment credentials live in the local Vercel CLI login (`~/.vercel`), not in the repo

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## External Resources (CDN / Fonts)

**Fonts:**
- Google Fonts served via `next/font/google` — `Geist` and `Geist_Mono` in `src/app/layout.tsx` (self-hosted at build time by Next.js; no runtime external font request)

---

*Integration audit: 2026-10-02*
