# Architecture — Deal Committee

## Stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Server Actions) |
| Database | Supabase (PostgreSQL with RLS) |
| Styling | Tailwind CSS v4 |
| UI | Custom components (no Shadcn/MUI), Sonner toasts, Recharts charts, dnd-kit |
| State | React Context (no Redux/Zustand) |
| AI | OpenAI (GPT-4.1, Agents SDK for doc extraction, vector stores) |
| Auth | Supabase Auth (email + Google OAuth) |
| Payments | Stripe (subscriptions) |
| Analytics | PostHog (project 313741) |
| Testing | Vitest |

## Codebase: 270 source files

## Directory Structure
```
app/
├── (app)/                    # Authenticated routes
│   ├── dashboard/            # Main dashboard with opportunities
│   ├── prospects/            # Deal/prospect management
│   │   ├── actions/          # Modular server actions: crud, documents, evaluation, interactions
│   │   └── [id]/             # Individual prospect view + setup
│   ├── buy-box/              # Buy Box criteria management
│   │   └── [id]/
│   ├── personas/             # IC evaluator personas
│   ├── sourcing/             # Deal sourcing & scraping
│   ├── pipeline/             # Pipeline/Kanban view (dnd-kit)
│   ├── compare/              # Prospect comparison
│   ├── settings/             # Org settings (account, billing, sources, team)
│   ├── admin/                # Super admin (global sources)
│   ├── onboarding/
│   ├── design-system/
│   └── policy/
├── (auth)/                   # Auth routes (login, signup, reset password)
├── api/
│   ├── cron/                 # Scheduled jobs (content-fetch, deal-scrape)
│   ├── stripe/               # Stripe checkout, portal, webhook
│   ├── export/               # PDF export (prospect, buy-box, compare)
│   ├── extension/            # Browser extension API (buybox, check-duplicate, extract, prospects)
│   ├── prospects/            # Prospect API (status, financial-analysis)
│   └── content/              # Content feed API
└── auth/callback/            # Supabase auth callback

lib/
├── ai/                       # AI logic: evaluation, extraction, prompts, summary
├── supabase/                 # DB: generated types, query types, server/client, org helpers
├── types/                    # Domain types: prospect, evaluation, buy-box, interaction
├── buy-box/                  # Buy Box evaluation logic
├── financial/                # Financial metric calculations
├── content/                  # RSS/YouTube content feed
├── sourcing/                 # Deal scraping & quick-screen
└── utils.ts                  # formatCurrency, formatMultiple, cn()

components/
├── ui/                       # Base UI (Button, Input, etc.)
├── prospects/                # Prospect components
├── dashboard/                # Dashboard components
└── [feature]/                # Feature-specific
```

## Key Domain Concepts

| Concept | Description |
|---------|-------------|
| **Prospect/Deal** | Acquisition target being evaluated |
| **Buy Box** | Rules defining criteria (hard stops + soft preferences). Only one active at a time. Versioned. |
| **IC Evaluation** | AI evaluation of prospect against Buy Box. Stores Buy Box version used. |
| **Personas** | Different evaluator perspectives (Risk-Averse, Growth-Focused, etc.) |
| **Readiness** | Deal status: NO_DOCS → NEEDS_INFO → READY → EVALUATED |
| **Verdict** | Result: STRONG_PASS, CONDITIONAL, REVIEW_WITH_CAUTION, REJECT |
| **Hard Stop** | Buy Box rule that auto-rejects if violated |
| **Sourcing** | Deal scraping from brokers/listings |

## Buy Box Rule Types
| Type | Example |
|------|---------|
| `MIN_THRESHOLD` | Min SDE: $200k |
| `MAX_THRESHOLD` | Max multiple: 4.0x |
| `BOOLEAN` | Personal guarantee allowed: false |
| `ENUM` | Capex intensity: low/medium/high |
| `INCLUDE_LIST` | Industries: HVAC, plumbing, electrical |
| `EXCLUDE_LIST` | Exclude: restaurants, retail |

## Multi-Tenancy
- RLS on `org_id` column
- `getOrgId()` helper in every server action
- Super admin via `SUPER_ADMIN_EMAILS` env var

## Server Actions Pattern
- Located in `app/(app)/[feature]/actions/` (modular subdirectory) or `actions.ts`
- `"use server"` directive at top
- Always call `getOrgId()` for tenant isolation
- Prospects split into: crud, documents, evaluation, interactions, shared

## AI Pipeline
1. **Document upload** → Supabase Storage
2. **Extraction** → OpenAI Agents SDK extracts structured data from docs
3. **Evaluation** → GPT-4.1 evaluates against Buy Box rules
4. **Verdict** → Hard violations → REJECT; otherwise scored and categorized
5. **Summary** → AI-generated deal summary

## Supabase
- **Project ref:** `bqqpbuaniyqblxrokydp`
- **Types:** Auto-generated via `supabase gen types typescript`
- **Migrations:** `supabase/migrations/` (latest: Feb 2026)
- **Custom join types:** `lib/supabase/query-types.ts`

## Browser Extension
- API endpoints under `app/api/extension/`
- Quick-add prospects, check duplicates, extract data, view buy box
