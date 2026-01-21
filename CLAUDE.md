# CLAUDE.md - Personal OS

## Project Overview

Personal OS is a unified system for managing personal data and workflows. It aggregates information from various sources (email, GitHub, calendar, notes) into a single searchable interface.

**Status**: Early scaffold - monorepo infrastructure is complete, integrations are stubbed.

## Architecture

```
personal-os/
├── apps/
│   ├── web/              # Next.js 14 frontend (App Router)
│   └── api/              # Supabase Edge Functions (Deno)
├── packages/
│   └── shared/           # Shared TypeScript types and utilities
├── docs/                 # Architecture and setup documentation
└── .github/workflows/    # CI/CD automation
```

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase Edge Functions (Deno runtime)
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth (planned)

## Development Commands

```bash
# From root - runs all workspaces
npm run dev              # Start development servers
npm run build            # Production build
npm run lint             # ESLint check
npm run type-check       # TypeScript validation
npm run format           # Prettier formatting

# Individual apps
cd apps/web && npm run dev    # Just frontend on localhost:3000
```

## Code Conventions

### TypeScript

- Strict mode enabled (`strict: true`)
- No implicit any - all types must be explicit
- Use `@personal-os/shared` for shared types across packages

### File Structure

- **Naming**: kebab-case for directories, standard Next.js conventions for pages
- **Exports**: Barrel exports via `index.ts` files
- **Path aliases**: `@/*` in web app, `@personal-os/shared` for shared package

### API Response Format

All API endpoints use the shared `ApiResponse<T>` type:

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
```

### Service Pattern

Integration services follow this pattern (see `apps/web/src/lib/integrations/`):

```typescript
interface ServiceConfig {
  clientId: string;
  clientSecret: string;
}

class ServiceName {
  constructor(private config: ServiceConfig) {}
  // Methods return Promises, throw on error
}
```

## Key Files

| File | Purpose |
|------|---------|
| `apps/web/src/lib/supabase.ts` | Supabase client singleton |
| `apps/web/src/lib/integrations/` | Gmail and GitHub service stubs |
| `packages/shared/src/types/` | Shared TypeScript interfaces |
| `packages/shared/src/utils/` | Validation and date utilities |
| `apps/api/functions/` | Supabase Edge Functions |

## Environment Variables

Copy `env.example` to `.env.local` and configure:

```bash
# Required for Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # Server-side only

# OAuth (when implementing integrations)
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Current Implementation Status

### Implemented
- Monorepo structure with workspaces
- TypeScript configuration (strict)
- Next.js 14 skeleton with App Router
- Supabase Edge Functions scaffold
- Shared types package
- Code quality tooling (ESLint, Prettier)
- Health check endpoints (`/api/health`)
- Weekly shipped summary GitHub Action

### Stubbed (needs implementation)
- Gmail integration - class exists at `apps/web/src/lib/integrations/gmail.ts`
- GitHub integration - class exists at `apps/web/src/lib/integrations/github.ts`
- Database schema - types defined in PRD but no migrations yet

### Not Started
- Authentication system
- UI components
- Testing framework
- Real-time subscriptions

## Testing (To Be Added)

When implementing tests, use:
- **Unit/Integration**: Vitest + Testing Library
- **E2E**: Playwright (optional for later)

Place tests in `__tests__/` directories or colocate as `*.test.ts`.

## Common Tasks

### Adding a new integration

1. Create config interface and service class in `apps/web/src/lib/integrations/`
2. Add types to `packages/shared/src/types/integrations.ts`
3. Create Edge Function in `apps/api/functions/{integration}-sync/`
4. Add environment variables to `env.example`

### Adding a new API route (Next.js)

Create file at `apps/web/src/app/api/{route}/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: null, timestamp: new Date().toISOString() });
}
```

### Adding a new Edge Function

Create directory `apps/api/functions/{name}/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req: Request) => {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

## Notes for AI Assistants

- This codebase uses strict TypeScript - always provide explicit types
- Prefer editing existing files over creating new ones
- Follow the existing patterns in `apps/web/src/lib/integrations/` for services
- Use the shared package for any types that need to be used across apps
- Edge functions use Deno, not Node.js - import from deno.land URLs
- The weekly summary workflow in `.github/workflows/` is working and should not be modified without explicit request
