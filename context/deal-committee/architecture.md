# Architecture — Deal Committee

## Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth (via @supabase/ssr)
- **AI:** OpenAI Agents SDK (@openai/agents)
- **UI:** Tailwind + shadcn/ui + Radix primitives
- **Charts:** Recharts
- **PDF:** @react-pdf/renderer + unpdf
- **Payments:** Stripe
- **Analytics:** PostHog
- **DnD:** @dnd-kit (sortable prospect lists)
- **Validation:** Zod
- **Testing:** Vitest
- **Fonts:** IBM Plex Sans/Mono

## Key Features
- AI-powered deal evaluation (prospect analysis)
- Prospect/deal pipeline management with drag-and-drop
- PDF report generation
- Evaluation scoring and normalization
- Multi-org support

## Supabase Project
- **Ref:** `bqqpbuaniyqblxrokydp`
- **PostHog project:** 313741

## Key Directories
- `app/` — Next.js App Router pages
- `components/` — UI components
- `lib/` — Core logic, AI agents, Supabase client
- `supabase/` — Migrations and config
- `extension/` — Browser extension (if any)
- `docs/` — Documentation
