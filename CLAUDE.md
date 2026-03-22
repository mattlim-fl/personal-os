# Personal OS — Agent Guide

## What This Is

Single-user life dashboard for Matt. Next.js 14 (App Router) on Netlify, Supabase PostgreSQL for persistence. No auth — single user. Content is written by an AI assistant (Rafa) via API routes; there is no admin UI.

Currently: clean shell with one feature (Newsletter Digest). New features follow an established pattern.

## Architecture

Monorepo with npm workspaces:
- `apps/web/` — Next.js frontend + API routes (the whole app)
- `packages/shared/` — Zod schemas, TypeScript types, utility functions
- Supabase — PostgreSQL database (single production instance, no staging)

Data flow: Client components fetch `/api/[resource]` → API route queries Supabase → returns `{ data, count, timestamp }`. Rafa writes data via POST to the same API routes.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full system diagram, data model, and module boundaries.

## Commands

```bash
npm install          # Install all workspaces
npm run dev          # Start Next.js on localhost:3000
npm run type-check   # TypeScript strict check
npm run lint         # ESLint
npm run format       # Prettier
```

## How to Add a Feature

Every feature follows a 7-step pattern: Supabase table → Zod types → API route → page → components → briefing widget → nav links.

**Full walkthrough:** [docs/adding-a-new-feature.md](docs/adding-a-new-feature.md)

**Canonical reference:** The newsletter feature is the reference implementation for all patterns. Follow it exactly.

## Project-Specific Patterns

### API responses always include timestamp
```typescript
return NextResponse.json({ data, count, timestamp: new Date().toISOString() });
```

### POST routes accept single item or array
```typescript
const items = Array.isArray(body) ? body : [body];
```

### Client-side fetching pattern
All feature components are `'use client'` with `useEffect` → `fetch('/api/...')`. No server components for data fetching.

### Types flow from shared package
Import types as `@personal-os/shared`. Zod schemas in `packages/shared/src/types/`. Always export new types from the barrel (`types/index.ts`).

### Design system primitives
Use `Button`, `Card`, `Badge`, `Input`, `Select`, `Skeleton`, `Alert`, `Toast` from `@/components/ui`. Use `cn()` from `@/lib/utils` for conditional classes. Don't create new base UI components.

### State components for every list
Every list needs: `LoadingState` (skeletons), error display, `EmptyState` from `@/components/shared`.

### Navigation is duplicated
`header.tsx` and `mobile-nav.tsx` both have a `navigation` array. Update both when adding a route.

## Gotchas

- **Single production DB** — No staging. Be careful with destructive SQL. No migration tool; tables created via SQL in Supabase dashboard.
- **No auth** — Intentional. Don't add authentication middleware.
- **Tailwind v4** — Uses `@tailwindcss/postcss` plugin, not the classic `tailwindcss` PostCSS plugin. Custom theme in `tailwind.config.js` with surface-* color tokens.
- **Supabase client is a Proxy** — `lib/supabase.ts` uses a Proxy pattern for lazy initialization. Import and use directly; don't try to await it.
- **Components ≤ 150 lines** — Split if larger.
- **Deploy** — Netlify auto-deploys on merge to `main`. No CI pipeline.

## Workflow

- Feature branch → PR → squash merge to `main`
- PR target is always `main`
- Run `npm run type-check && npm run lint` before pushing

## Key Docs

- [Architecture](docs/ARCHITECTURE.md) — System diagram, data model, module boundaries
- [Adding a Feature](docs/adding-a-new-feature.md) — Step-by-step guide with reference files
- [Learnings](.learnings/LEARNINGS.md) — Known gotchas and tribal knowledge
