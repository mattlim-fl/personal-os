# Adding a New Feature

Step-by-step guide for the most common development task in this codebase. Every feature follows the same 7-step pattern. Use the newsletter feature as your reference implementation.

## Overview

When you add a new feature (e.g., "bookmarks", "habits", "reading-list"), you'll touch these locations in this order:

1. Supabase table (SQL)
2. Zod types in `packages/shared/`
3. API route in `apps/web/src/app/api/`
4. Full page in `apps/web/src/app/`
5. Feature components in `apps/web/src/components/features/`
6. Briefing widget in `apps/web/src/components/features/briefing/`
7. Navigation links in header + mobile-nav

## Step 1: Create the Supabase Table

Write SQL directly against the production Supabase database. There is no migration tool — run SQL in the Supabase dashboard.

Follow the `newsletter_items` table pattern:
- `id` as `uuid` with `gen_random_uuid()` default
- `created_at` as `timestamptz` with `now()` default
- Use `text[]` for tag/array columns
- Use nullable fields where data may not always be present

## Step 2: Add Zod Types

Create `packages/shared/src/types/[feature].ts` following the pattern in `packages/shared/src/types/newsletter.ts`:

```typescript
import { z } from 'zod';

// Full schema (matches DB columns)
export const myItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  // ... fields matching your table
  created_at: z.string().datetime(),
});

export type MyItem = z.infer<typeof myItemSchema>;

// Create schema (omit server-generated fields)
export const createMyItemSchema = myItemSchema.omit({
  id: true,
  created_at: true,
});

export type CreateMyItemInput = z.infer<typeof createMyItemSchema>;
```

Then export from `packages/shared/src/types/index.ts`:

```typescript
export * from './my-feature';
```

## Step 3: Add the API Route

Create `apps/web/src/app/api/[feature]/route.ts` following the pattern in `apps/web/src/app/api/newsletters/route.ts`:

**GET handler:**
- Parse query params for filtering, limit (default 50), offset (default 0)
- Build Supabase query with chained filters
- Return `{ data, count, timestamp }`

**POST handler:**
- Accept single item or array (`Array.isArray(body) ? body : [body]`)
- Validate each item with `createMyItemSchema.safeParse()`
- Insert via Supabase `.insert(validated).select()`
- Return `{ data, message, timestamp }` with status 201

**Key patterns:**
- Import `supabase` from `@/lib/supabase`
- Import types from `@personal-os/shared`
- Always include `timestamp: new Date().toISOString()` in responses
- Wrap everything in try/catch, return errors as `{ error, timestamp }`

## Step 4: Create the Page

Create `apps/web/src/app/[feature]/page.tsx` following the pattern in `apps/web/src/app/newsletters/page.tsx`:

```tsx
'use client';

import { PageHeader } from '@/components/layout';
import { MyFeatureList } from '@/components/features/my-feature';

export default function MyFeaturePage() {
  return (
    <main className="min-h-screen py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="My Feature" icon={SomeIcon} />
        <MyFeatureList />
      </div>
    </main>
  );
}
```

## Step 5: Create Feature Components

Create `apps/web/src/components/features/[feature]/` with:

| File | Purpose | Reference |
|------|---------|-----------|
| `[feature]-list.tsx` | Full page list with filtering, loading, error, empty states | `features/newsletters/newsletter-list.tsx` |
| `[feature]-card.tsx` | Individual item display | `features/newsletters/newsletter-card.tsx` |
| `index.ts` | Barrel exports | `features/newsletters/index.ts` |

**Key patterns in list components:**
- `'use client'` directive
- State: `items`, `loading`, `error`, plus filter states
- `useCallback` + `useEffect` for data fetching
- Use `Skeleton` from `@/components/ui` for loading
- Use `EmptyState` from `@/components/shared` for empty
- Import types from `@personal-os/shared`
- Keep each component under 150 lines

## Step 6: Add a Briefing Widget

Create `apps/web/src/components/features/briefing/[feature]-section.tsx` following the pattern in `features/briefing/newsletter-section.tsx`:

- Fetch latest items with a small limit (e.g., `?limit=5`)
- Wrap in `<Card>` + `<CardContent>`
- Show loading, error, and empty states
- Include "View all →" link to the full page
- Export from `features/briefing/index.ts`

Then add the widget to the home page at `apps/web/src/app/page.tsx`:

```tsx
<section className="mb-6">
  <MyFeatureSection />
</section>
```

## Step 7: Add Navigation

Add the route to **both** navigation arrays:

**`apps/web/src/components/layout/header.tsx`** — the `navigation` array:
```typescript
import { MyIcon } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Newsletters', href: '/newsletters', icon: Newspaper },
  { name: 'My Feature', href: '/my-feature', icon: MyIcon },  // Add here
];
```

**`apps/web/src/components/layout/mobile-nav.tsx`** — the same `navigation` array (duplicated, keep in sync).

## Common Mistakes

- **Forgetting mobile-nav**: The navigation array is duplicated in `header.tsx` and `mobile-nav.tsx`. Update both.
- **Missing barrel export**: Always export new types from `packages/shared/src/types/index.ts`.
- **Skipping empty/error states**: Every list component needs loading, error, and empty state handling.
- **Creating new UI primitives**: Use existing components from `@/components/ui`. Don't create new base components.
- **Components over 150 lines**: If a component grows past 150 lines, split it.

## Reference Files

These files are the canonical examples of the patterns above:
- `packages/shared/src/types/newsletter.ts` — Zod schema + type pattern
- `apps/web/src/app/api/newsletters/route.ts` — API route with GET + POST
- `apps/web/src/components/features/newsletters/newsletter-list.tsx` — Full list component
- `apps/web/src/components/features/newsletters/newsletter-card.tsx` — Item card component
- `apps/web/src/components/features/briefing/newsletter-section.tsx` — Briefing widget
- `apps/web/src/app/newsletters/page.tsx` — Feature page
