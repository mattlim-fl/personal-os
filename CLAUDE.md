# Personal OS - Claude Code Development Guide

## Project Overview

Personal OS is a single-user system for context management and Gmail inbox triage. It replaces Notion with a unified context system and turns email into a decision queue.

**Philosophy**: Determinism over cleverness. Human-in-the-loop always.

## Quick Start

```bash
npm install          # Install all workspaces
npm run dev          # Start Next.js on localhost:3000
npm run type-check   # Verify TypeScript
npm run lint         # Check code quality
npm run format       # Format code with Prettier
```

## Architecture

- **Frontend**: `apps/web` - Next.js 14 (App Router)
- **Backend**: `apps/api` - Supabase Edge Functions (Deno)
- **Shared**: `packages/shared` - Types, utils, validation schemas
- **Database**: Supabase PostgreSQL

## Key Directories

```
apps/web/src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # API routes (contexts, inbox, gmail, rules)
│   ├── contexts/           # Context management pages
│   ├── inbox/              # Inbox queue page
│   └── settings/           # Settings page
├── components/             # React components
│   ├── ui/                 # Design system primitives (Button, Card, etc.)
│   ├── layout/             # Layout components (Header, PageHeader)
│   ├── features/           # Feature-specific components
│   │   ├── contexts/       # Context-related components
│   │   ├── inbox/          # Inbox-related components
│   │   └── integrations/   # Integration components (Gmail, etc.)
│   └── shared/             # Shared utility components
└── lib/                    # Utilities and integrations

packages/shared/src/
├── types/                  # Zod schemas and TypeScript interfaces
└── utils/                  # Shared utility functions
```

## Component Guidelines

### Creating Components

1. Use `'use client'` only when needed (state, effects, browser APIs)
2. Import types from `@personal-os/shared`
3. Use design system primitives from `@/components/ui`
4. Keep components under 150 lines
5. Use `cn()` for conditional Tailwind classes

### Component Template

```tsx
'use client';

import { cn } from '@/lib/utils';

interface MyComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  );
}
```

### Design System Usage

Always use UI primitives for consistency:

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';

// Good
<Button variant="primary">Save</Button>
<Badge variant="success">Active</Badge>

// Avoid raw Tailwind for common patterns
<button className="px-4 py-2 bg-blue-500...">Save</button>
```

## API Route Patterns

### Standard Response Format

```typescript
// Success
return NextResponse.json({ data: result }, { status: 200 });

// Error
return NextResponse.json({ error: 'Message' }, { status: 400 });
```

### Validation Pattern

```typescript
import { createContextSchema } from '@personal-os/shared';

export async function POST(request: Request) {
  const body = await request.json();
  const validated = createContextSchema.parse(body);
  // ... handle validated data
}
```

## Type System

### Adding New Types

1. Create schema in `packages/shared/src/types/`
2. Export from `packages/shared/src/types/index.ts`
3. Use Zod for validation, infer types from schemas

### Example

```typescript
// packages/shared/src/types/resource.ts
import { z } from 'zod';

export const resourceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  created_at: z.string().datetime(),
});

export type Resource = z.infer<typeof resourceSchema>;

export const createResourceSchema = resourceSchema.omit({
  id: true,
  created_at: true
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
```

## Database Operations

### Supabase Queries

```typescript
import { supabase } from '@/lib/supabase';

// Select with filters
const { data, error } = await supabase
  .from('contexts')
  .select('*')
  .eq('active', true)
  .single();

// Insert with return
const { data, error } = await supabase
  .from('contexts')
  .insert(record)
  .select()
  .single();

// Update
const { data, error } = await supabase
  .from('contexts')
  .update({ active: true })
  .eq('id', id)
  .select()
  .single();

// Delete
const { error } = await supabase
  .from('contexts')
  .delete()
  .eq('id', id);
```

## Environment Variables

### Frontend (apps/web)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GITHUB_TOKEN=
GITHUB_REPO_OWNER=
GITHUB_REPO_NAME=
GITHUB_BRANCH=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

### Backend (apps/api)

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Common Tasks

### Add a new page

1. Create `apps/web/src/app/[route]/page.tsx`
2. Use `PageHeader` component for consistent headers
3. Add to navigation in `Header` if needed

### Add a new API endpoint

1. Create `apps/web/src/app/api/[resource]/route.ts`
2. Add Zod schema to `packages/shared/src/types/`
3. Export from `packages/shared/src/types/index.ts`
4. Implement handlers (GET, POST, PUT, DELETE)

### Add a new component

1. Determine location:
   - `ui/` - Reusable primitives
   - `layout/` - Layout-related
   - `features/[domain]/` - Feature-specific
   - `shared/` - Utility components
2. Use design system primitives
3. Export from directory index if reusable

### Add a new Edge Function

1. Create `apps/api/functions/[name]/index.ts`
2. Deploy: `cd apps/api && supabase functions deploy [name]`

## Code Style

- **Formatting**: Prettier (auto-format on save)
- **Linting**: ESLint with TypeScript
- **Types**: Strict TypeScript, avoid `any`
- **Naming**:
  - PascalCase for components
  - camelCase for functions/variables
  - kebab-case for file names

## Project Status

**Current Phase**: Phase 2 (Inbox Management)

- Gmail OAuth and sync
- Rules engine for classification
- Approval queue UI
- Draft reply generation

**Out of Scope (V1)**:

- Multi-user/team features
- Autonomous sending (always human-in-the-loop)
- Slack integration
- Long-term planning features

## Context Management

Read context files at session start from `context/` directory.

### When to Update Context Files

#### context/current-state.md
Update when:
- New income stream starts or ends
- Major life events change (house move complete, baby arrives)
- Key dates shift significantly
- Primary tools or workflows change

#### context/preferences.md
Update when:
- Matt explicitly corrects a behaviour ("don't do X, do Y instead")
- A clear pattern emerges (consistently rejects certain formats)
- New working style preferences are stated

#### context/projects.md
Update when:
- New project starts
- Project status changes (active → winding down → complete)
- Key contacts or repos change

### Update Rules

- Make minimal, targeted edits
- Don't rewrite entire files unnecessarily
- For preferences.md, ask for confirmation before writing
- Always mention what you updated and why at the end of your response
