# Learnings

Known gotchas, tribal knowledge, and things that have bitten us. Add to this file when you discover something non-obvious.

## Architecture

- **No auth is intentional.** This is a single-user personal system. Don't add authentication middleware, session management, or user scoping. Every attempt to "secure" the API is wasted effort here.

- **AI is the CMS.** Rafa (AI assistant) writes content via POST to API routes. There is no admin UI for creating content. If you're building a feature, the write interface is the API — not a form.

- **Single production database.** There is no staging Supabase instance. Destructive SQL runs against prod. Always test queries with SELECT before running UPDATE/DELETE. There is no migration tool — tables are created via SQL in the Supabase dashboard.

## Frontend

- **Tailwind v4 uses `@tailwindcss/postcss`.** Not the classic `tailwindcss` PostCSS plugin. If you add a new PostCSS plugin, follow the v4 pattern in `postcss.config.js`.

- **Supabase client is a Proxy.** `lib/supabase.ts` uses a JavaScript Proxy for lazy initialization. It looks synchronous — import and use it directly. Don't try to `await` the import.

- **Navigation arrays are duplicated.** `header.tsx` and `mobile-nav.tsx` each have their own `navigation` array. When adding a new route, you must update both files or the mobile nav will be out of sync.

- **Surface-* color tokens.** The design system uses custom `surface-50` through `surface-950` color tokens (not Tailwind's default gray scale). Use `surface-*` for backgrounds, borders, and text colors.

## Patterns

- **Every API response includes `timestamp`.** This is a convention for debugging and cache-busting. Don't skip it, even for error responses.

- **POST routes accept arrays.** All POST endpoints handle both single items and arrays: `Array.isArray(body) ? body : [body]`. This lets Rafa batch-write items in a single call.

- **Briefing widgets fetch independently.** Each home page section makes its own API call with a small limit. They don't share a parent data fetch. This keeps them decoupled.

## Workflow

- **PR target is always `main`.** There is no `dev` or `staging` branch. Feature branch → PR → squash merge to `main` → Netlify auto-deploys.

- **Netlify deploys on merge.** No CI pipeline runs before deploy. The only safety net is running `npm run type-check && npm run lint` locally before pushing.
