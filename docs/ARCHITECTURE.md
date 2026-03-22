# Architecture

## System Overview

Personal OS is a single-user life dashboard deployed as a Next.js 14 application on Netlify, backed by Supabase PostgreSQL. It serves as Matt's personal context management system — replacing Notion with a unified, API-driven platform where an AI assistant (Rafa) writes content via API routes.

The system follows a simple three-layer pattern: **Next.js App Router** handles both the UI and API layer, **Supabase** provides persistence, and a **shared package** holds types and utilities used across both layers. There is no authentication — this is a single-user system.

## Component Diagram

```
┌─────────────────────────────────────────────────┐
│                  Next.js 14                       │
│               (apps/web on Netlify)               │
│                                                   │
│  ┌─────────────┐    ┌──────────────────────────┐ │
│  │  App Router  │    │      API Routes          │ │
│  │  Pages/UI    │───>│  /api/newsletters/...    │ │
│  │              │    │  /api/[future]/...       │ │
│  └─────────────┘    └────────────┬─────────────┘ │
└──────────────────────────────────┼───────────────┘
                                   │
          ┌────────────────────────┼────────────────┐
          │                        ▼                 │
          │  ┌──────────────────────────────────┐   │
          │  │  Supabase PostgreSQL              │   │
          │  │  (newsletter_items, future tables) │   │
          │  └──────────────────────────────────┘   │
          │                                         │
          │          Supabase (hosted)               │
          └─────────────────────────────────────────┘

External writers:
  Rafa (AI assistant) ──POST──> /api/newsletters
  Future integrations  ──POST──> /api/[resource]
```

## Data Flow

### Reading data (UI)
1. Page component renders, client component mounts
2. `useEffect` calls `fetch('/api/[resource]?...')`
3. API route queries Supabase via singleton client (`lib/supabase.ts`)
4. Response returned as `{ data, count, timestamp }`
5. Component renders data with loading/error/empty states

### Writing data (Rafa / external)
1. POST request hits `/api/[resource]` with JSON body (single item or array)
2. API route validates with Zod schema from `@personal-os/shared`
3. Validated data inserted into Supabase
4. Response returned with created records

### Home page briefing
The home page (`/`) renders briefing widgets — small card sections showing the latest items from each feature. Each widget fetches independently with a limited query (e.g., `?limit=5`).

## Data Model

### Current Entities

**newsletter_items** — Curated newsletter digests written by Rafa
- `id` (uuid, PK), `source`, `title`, `summary`, `url` (nullable), `tags` (text[]), `published_at` (nullable), `digest_date` (date string YYYY-MM-DD), `created_at`

### Schema Location
- Zod schemas: `packages/shared/src/types/` (source of truth for validation)
- Supabase tables: Created via SQL directly (no migration tool)
- Common response types: `packages/shared/src/types/common.ts`

## Module Boundaries

| Directory | Owns | Does NOT own |
|-----------|------|-------------|
| `apps/web/src/app/api/` | HTTP handling, request validation, Supabase queries | UI rendering |
| `apps/web/src/app/[route]/` | Page layout, composing feature components | Data fetching logic |
| `apps/web/src/components/ui/` | Design system primitives (Button, Card, Badge, etc.) | Business logic, data fetching |
| `apps/web/src/components/features/[domain]/` | Feature-specific UI + client-side data fetching | Cross-feature concerns |
| `apps/web/src/components/features/briefing/` | Home page widgets (one per feature) | Full-page feature views |
| `apps/web/src/components/layout/` | Header, nav, page chrome | Feature content |
| `apps/web/src/components/shared/` | Reusable utility components (EmptyState, LoadingState, ErrorState) | Feature-specific logic |
| `apps/web/src/lib/` | Supabase client, utilities (`cn()`), constants | UI components |
| `packages/shared/src/types/` | Zod schemas, TypeScript types, API response interfaces | Runtime logic |
| `packages/shared/src/utils/` | Pure utility functions (date, validation, week) | Side effects |

## Key Architectural Decisions

### No authentication
Single-user personal system. No auth middleware, no session management. API routes are open. This is intentional — don't add auth.

### AI as CMS
Content is written by Rafa (AI assistant) via POST to API routes. There is no admin UI for content creation. The API IS the CMS interface.

### Monorepo with npm workspaces
`apps/web` + `packages/shared`. Shared types ensure the API route validation and frontend type expectations stay in sync. Import shared types as `@personal-os/shared`.

### Client-side data fetching
Feature components are `'use client'` and fetch data via `useEffect` → `fetch('/api/...')`. No server components for data fetching currently. This keeps the pattern simple and consistent.

### Single production database
No staging environment. Supabase project is production. Tables created via SQL. Be careful with destructive migrations.

## Environment & Configuration

| Variable | Purpose | Where used |
|----------|---------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Client (via `lib/supabase.ts`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Client (via `lib/supabase.ts`) |

Additional env vars exist for Gmail/GitHub integrations (future features) — see `apps/web/env.example`.

## Deployment

- **Frontend**: Netlify, auto-deploys on merge to `main`
- **Database**: Supabase (hosted PostgreSQL)
- No edge functions currently deployed
- No CI pipeline — lint and type-check run locally
