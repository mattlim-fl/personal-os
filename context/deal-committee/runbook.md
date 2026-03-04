# Runbook — Deal Committee

## Local Development
```bash
git clone git@github.com:mattlim-fl/ai-investment-committee.git
cd ai-investment-committee
npm install
cp .env.local.example .env.local
npm run dev
```

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run test     # Tests (watch mode)
npm run test:run # Tests once
npm run lint     # ESLint
```

## Supabase CLI
```bash
# Apply migrations
supabase db push

# Generate types (after schema changes)
supabase gen types typescript --project-id bqqpbuaniyqblxrokydp > lib/supabase/database.types.ts

# Check migration status
supabase migration list

# Create new migration
supabase migration new <migration_name>
```

## Environment Variables (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` — GPT-4.1 for evaluation + extraction
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST`
- `SUPER_ADMIN_EMAILS` — comma-separated super admin emails

## Deployment
- TBD — check for Vercel/Netlify config

## Key Files
| Purpose | Location |
|---------|----------|
| Types (auto-gen) | `lib/supabase/database.types.ts` |
| Join query types | `lib/supabase/query-types.ts` |
| Domain types | `lib/types/` (prospect, evaluation, buy-box, interaction) |
| AI evaluation | `lib/ai/evaluation.ts` |
| AI extraction | `lib/ai/extraction.ts` |
| Prompt templates | `lib/ai/prompts.ts` |
| Buy Box logic | `lib/buy-box/index.ts` |
| Financial calcs | `lib/financial/calculations.ts` |
| Server actions | `app/(app)/prospects/actions/` |

## Common Tasks

### Adding a new Buy Box metric
1. Add to `METRICS` in `lib/types/buy-box.ts`
2. Add extraction logic in `lib/ai/extraction.ts`
3. Add to `EXTRACTED_METRIC_KEYS` in `app/(app)/prospects/actions/shared.ts`
4. Add evaluation logic in `lib/buy-box/index.ts`

### Adding a new server action
1. Add to appropriate file in `app/(app)/[feature]/actions/`
2. Export from `actions/index.ts`
3. `"use server"` directive at top
4. Always call `getOrgId()` for multi-tenant safety

## Docs (in repo)
- `docs/product-requirements.md` — PRD
- `docs/technical-requirements.md` — Technical spec
- `docs/ROADMAP.md` — Feature roadmap
- `docs/CHANGELOG.md` — Changes
- `docs/devops.md` — DevOps setup
- `docs/features/` — Feature-specific docs
- `docs/planning/` — Planning docs

## Branch Strategy
- `main` → production
- Has `CLAUDE.md` + `.cursorrules` for coding agent context

## Supabase Dashboard
https://supabase.com/dashboard/project/bqqpbuaniyqblxrokydp
