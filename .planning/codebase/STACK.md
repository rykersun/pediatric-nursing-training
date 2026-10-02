---
last_mapped_commit: 1137fe8b9845149807cfba3c387ff9eaf742f7d2
last_mapped_at: 2026-10-02
---
# Technology Stack

**Analysis Date:** 2026-10-02

## Languages

**Primary:**
- TypeScript 5 (locked via `typescript@^5`) - All application code in `src/` is `.ts`/`.tsx`; `jsx: react-jsx` transform
- CSS - Custom design tokens plus Tailwind utility classes in `src/app/globals.css`

**Secondary:**
- HTML/JSX - Inline in `.tsx` component files
- No other languages detected (no Rust, Go, Python, SQL in repo)

## Runtime

**Environment:**
- Node.js (local dev runs v24.21.0; no `.nvmrc` or `engines` field pins a version)
- Next.js 16.3.7 (App Router) — see `node_modules/next/dist/docs/` for breaking-change guides; this version differs from older Next.js conventions (async `params`, `generateStaticParams`, typed `LayoutProps`)

**Package Manager:**
- npm 11 (lockfile `package-lock.json`, `lockfileVersion: 3`)
- Lockfile: present, committed

## Frameworks

**Core:**
- Next.js 16.3.7 - App Router application framework; rendering, routing, layout, fonts (`next/font/google`), metadata
- React 19.2.8 - UI library (`react`, `react-dom`)
- Tailwind CSS 4.3.3 - Utility-first styling via `@tailwindcss/postcss`; CSS-first config in `src/app/globals.css` using `@theme inline` (no `tailwind.config.js` — Tailwind v4 CSS-config style)

**Testing:**
- Not detected - No test framework, no test files, no test scripts

**Build/Dev:**
- TypeScript 5 - Type checking (strict mode), `next build` compiles
- ESLint 9 (flat config) with `eslint-config-next` 16.3.7 - Linting via `eslint.config.mjs`
- PostCSS via `@tailwindcss/postcss` in `postcss.config.mjs`

## Key Dependencies

**Critical (runtime `dependencies` in `package.json`):**
- `next` 16.3.7 - App Router, server components, routing, static generation
- `react` 19.2.8 / `react-dom` 19.2.8 - UI rendering
- No other runtime dependencies — no state library, no HTTP client, no ORM, no auth library

**Infrastructure (dev `devDependencies`):**
- `tailwindcss` 4.3.3 + `@tailwindcss/postcss` - Styling pipeline
- `typescript` ^5 - Type checking
- `@types/node` ^20, `@types/react` ^19, `@types/react-dom` ^19 - Type definitions
- `eslint` ^9 + `eslint-config-next` 16.3.7 - Linting
- `unrs-resolver@1.12.2` - allowed script in `package.json` `allowScripts` block (eslint resolver)

## Configuration

**Environment:**
- No `.env` files present (`.env*` is gitignored). No env vars are read anywhere in `src/` — no `process.env` or `NEXT_PUBLIC_*` usage detected
- `next.config.ts` is empty (default `NextConfig` object, no options set)
- App configuration lives in `src/app/globals.css` (theme tokens: `--primary`, `--success`, `--warning`, `--radius`, etc., mapped through `@theme inline`) and `src/data/journey.ts` (course content)

**Build:**
- `tsconfig.json` - strict mode, `moduleResolution: bundler`, path alias `@/*` → `./src/*`, `jsx: react-jsx`, includes `.next/types/**/*.ts`
- `eslint.config.mjs` - flat config extending `eslint-config-next/core-web-vitals` + `typescript`, with `.next/`, `out/`, `build/`, `next-env.d.ts` ignored
- `postcss.config.mjs` - single `@tailwindcss/postcss` plugin
- No `vercel.json`, no `.nvmrc`, no CI config (no `.github/`)

## Platform Requirements

**Development:**
- Node.js (tested with v24), npm; `npm install` then `npm run dev` (port 3000)
- Vercel CLI installed globally (`~/.npm-global/bin/vercel`) for preview/production deploys

**Production:**
- Vercel deployment (project `pediatric-nursing-training`, production URL https://pediatric-nursing-training.vercel.app)
- Vercel team scope must be `cguim-83` (orgId `team_Tzz9wV81DqaJzeg0ImkVQpNC`); all `vercel` commands must include `--scope cguim-83`
- Purely static/SSG-capable app: routes are server components; step pages use `generateStaticParams` with `dynamicParams = false`

---

*Stack analysis: 2026-10-02*
