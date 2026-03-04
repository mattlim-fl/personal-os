# Architecture — GM Dashboard

## Stack
- **Framework:** Vite + React 18 (SPA, not Next.js)
- **Language:** TypeScript
- **UI:** Tailwind + shadcn/ui + full Radix suite
- **State:** TanStack React Query
- **Forms:** React Hook Form + Zod (schemas in `src/schemas/`)
- **Charts:** Recharts
- **Icons:** Lucide React
- **DnD:** @dnd-kit
- **Database:** Supabase (project ref: `plksvatjdylpuhjitbfc`)
- **Edge Functions:** Deno (Supabase Edge Functions)
- **Deployment:** Netlify (frontend) + Supabase (edge functions + DB)
- **Payments:** Square (via edge functions + shared utils)
- **Accounting:** Xero (OAuth integration)
- **Email delivery:** Resend (global credential)
- **Email agent:** Gmail OAuth + Claude for classification/drafts
- **Testing:** Vitest + Testing Library (frontend), Deno test (edge functions)

## Codebase: 247 source files

## Key Directories
```
src/
├── components/         # UI components (customers, bookings, revenue, occasions, auth, layout, ui)
├── config/            # URLs, env config
├── constants/         # Domain constants (bookingConstants.ts)
├── contexts/          # React contexts (Venue, Theme, Auth)
├── hooks/             # React Query hooks (useBookings, useCustomers, useDashboardData, etc.)
├── integrations/      # Supabase client + generated types
├── lib/               # Utility functions (saturday-utils, etc.)
├── pages/             # Route pages (Dashboard, Bookings, Revenue, Calendar, Settings, etc.)
├── schemas/           # Zod validation schemas
├── services/          # Data access layer (bookingService, customerService, etc.)
├── test/              # Test setup, mocks, utils
├── types/             # TypeScript types (karaoke, calendar, venue)
└── utils/             # Error handling, date utils, formatting, currency
```

## Edge Functions (25 functions)
```
supabase/functions/
├── _shared/           # Shared utilities (config, crypto, credentials, square, retry, errors, claude, gmail)
├── send-email/        # Email notifications (booking confirmations, reminders)
├── karaoke-*/         # Karaoke: availability, holds, book, pay-and-book
├── ticket-pay-and-book/
├── sync-and-transform/    # Square payment sync → revenue events
├── sync-scheduler/        # Cron trigger for Square sync
├── square-sync-backfill/  # Historical backfill
├── trade-report/          # Weekly trade report (Sunday 6am AWST)
├── business-performance/  # Weekly P&L report (Wednesday 6am AWST)
├── weekly-summary/        # (legacy, renamed to trade-report)
├── email-agent-*/         # Gmail email agent (scheduler, process, OAuth)
├── venue-config-api/      # Venue + area configuration
├── *-credentials/         # API credential management (save, check, test)
├── xero-oauth/            # Xero OAuth flow
└── update-cron-schedule/  # Dynamic cron job management
```

## Patterns (from CLAUDE.md)

### Data Flow
- **Services** (`src/services/`) — all Supabase calls go through services, never direct
- **Hooks** (`src/hooks/`) — React Query wrappers around services
- **Schemas** (`src/schemas/`) — Zod validation, used with React Hook Form
- **Types** (`src/types/`) — all types defined here, not inline

### Query Keys
- List: `['bookings', { venue, date, status }]`
- Detail: `['booking', bookingId]`
- Always invalidate parent list on mutation

### Error Handling
- Frontend: `handleError()` from `src/utils/errorHandling.ts`
- Edge functions: typed error classes from `_shared/errors.ts` (ValidationError, PaymentError, etc.)

### UI Patterns
- Detail views use **right sidepanels (Sheet)** not modals
- Modals only for confirmations and simple actions
- Components max ~300 lines, split if larger

### API Credentials
- Stored encrypted in `venue_api_credentials` table
- Scoped: per-venue (Gmail), per-org (Square, Xero), global (Resend)
- Organization mapping: `noxfolk` → manor, hippie; `daisies` → daisy
- No env var fallbacks — must be configured in Settings → API Integrations

## Multi-Venue / Multi-Tenant
- **Venues:** Manor, Hippie Club (more planned)
- **Organizations:** Noxfolk (owns Manor + Hippie), Daisies (owns Daisy)
- VenueContext provides current venue throughout app
- Auth: Supabase Auth with role-based access (ProtectedRoute, AdminRoute)

## Saturday Trading Model
- Business operates Saturday-only
- YoY comparisons use Saturday numbering (Saturday #15 of 2026 vs #15 of 2025)
- Trade report boundaries: Saturday 6am AWST → Sunday 6am AWST
- `saturday-utils.ts` in both frontend and edge functions

## Pages
Dashboard, Bookings, CreateBooking, Calendar, Revenue, ProfitAndLoss, Guests, BoothManagement, MemberCheckin, Photos, RunSheet, Settings, Team, Auth, AccessDenied
