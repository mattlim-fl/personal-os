# Architecture — Therapist Genie

## Frontend (therapygenie-v2-web)

### Stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | Fluent UI React v9 (Microsoft design system) + Tailwind |
| API Client | tRPC v11 + React Query |
| Auth | Teams SSO → MS Entra ID token exchange (NextAuth) |
| Payments | Stripe (React Stripe.js) |
| Signatures | react-signature-canvas |
| Calendar | FullCalendar (day/time grid, rrule for recurring) |
| Testing | Vitest + Testing Library |
| Hosting | Azure Static Web Apps |
| Node | 22+ (LTS) |

### Directory Structure
```
src/
├── app/
│   ├── (tabs)/              # Tab pages in Teams iframe
│   │   ├── calendar/        # Appointments (components, hooks, context, validation)
│   │   ├── clients/         # Client management
│   │   │   └── [clientId]/  # Client detail: appointments, chart, details, documents, forms, notes, treatment-plans, access
│   │   ├── team/            # Team management
│   │   │   └── [memberId]/  # Member: availability, clients, clinical-details, roles, signature, supervision
│   │   ├── payments/        # Billing dashboard + payroll
│   │   ├── settings/        # User settings, form management, locations, practice, service rates
│   │   └── approval-queue/  # Document approval workflow
│   ├── api/auth/            # Token exchange endpoint
│   ├── design-system/       # Component showcase
│   └── login/
├── components/
│   └── layout/              # SidePanel, SidePanelLayout
├── lib/
│   ├── trpc/                # tRPC client + provider
│   ├── auth/                # NextAuth config, user context, provider
│   ├── permissions/         # RBAC (roles, permissions, utils, hooks, Can component)
│   ├── stripe/              # Stripe provider, payment form, payment method card
│   └── fluent/              # FluentProvider wrapper
└── appPackage/manifest.json # Teams app manifest
```

### Key Patterns
- **Colocation:** Each feature folder has its own components, hooks, types (no global hooks/types folders)
- **Max 200 lines per file** — strict, split immediately if approaching
- **Thin components (<100 lines)**, fat hooks (business logic in hooks)
- **tRPC client** connects to external API at `NEXT_PUBLIC_API_URL`
- **SidePanel** — right-aligned panel that squeezes (not overlays) main content
- **Left sidebar navigation** in Clients, Team, Payments, Settings

### Auth Flow
1. Teams provides SSO token via `@microsoft/teams-js` SDK
2. `/api/auth/token` exchanges for MS Entra access token
3. Access token sent to API in Authorization header
4. Automatic JWT refresh implemented

---

## Backend (therapygenie-v2-api)

### Stack
| Layer | Choice |
|-------|--------|
| Runtime | Node.js + Express |
| API | tRPC v11 |
| Validation | Zod |
| Database | Microsoft Dataverse (OData/Web API) |
| Auth | Teams SSO token verification (JWKS) |
| Payments | Stripe (billing, invoices, autopay) |
| Email | Azure Communication Services |
| Storage | Azure Blob Storage |
| Calendar | Microsoft Graph API (meetings) |
| Deployment | Azure Web App (GitHub Actions) |

### Directory Structure
```
src/
├── index.ts / app.ts        # Express entry + factory
├── trpc/
│   ├── trpc.ts              # tRPC init
│   ├── context.ts           # Request context (auth)
│   ├── router.ts            # Root router
│   └── routers/             # Domain routers:
│       ├── appointments.ts
│       ├── approvals.ts
│       ├── billing.ts
│       ├── calendar.ts
│       ├── clientAuth.ts
│       ├── clientClinicians.ts
│       ├── clients.ts
│       ├── documents.ts
│       ├── forms/            # (index, schemas, constants, scoring, transforms)
│       ├── health.ts
│       ├── jobs.ts
│       ├── locations.ts
│       ├── notes/            # (index, schemas, constants, transforms, procedures/)
│       ├── payroll.ts
│       ├── serviceRates.ts
│       ├── settings.ts
│       ├── team.ts
│       └── treatmentPlans/   # (index, schemas, constants, transforms, procedures/)
├── services/
│   ├── dataverse/            # Dataverse OData client (auth, client, constants)
│   ├── graph/                # Microsoft Graph (calendar, meetings)
│   ├── stripe/               # Stripe (billing, client)
│   ├── email/                # Azure Communication Services
│   ├── blob/                 # Azure Blob Storage
│   └── jobs/                 # Background jobs (autopay, reconciliation, recurring appointments)
├── webhooks/                 # Stripe webhooks
└── lib/
    ├── auth/                 # Token verification, user lookup
    ├── permissions/          # RBAC (mirrored from frontend)
    ├── payment-status/       # Payment status logic
    ├── error-utils.ts
    ├── azure-jwt.ts
    └── logger.ts
```

---

## Database: Microsoft Dataverse

All custom tables use `tg_` prefix. Key entities:

| Entity | Purpose |
|--------|---------|
| tg_client | Patient/therapy participant |
| tg_teamMember | Clinicians, supervisors, staff |
| tg_appointment | Sessions (supports recurring via parent/child) |
| tg_progressNote | Clinical session notes (signable) |
| tg_diagnosisandtreatmentplan | Treatment plans (signable) |
| tg_payment | Payment records (1:1 with appointment) |
| tg_payroll | Payroll periods |
| tg_form | Client intake/assessment forms |
| tg_chartNote | General chart notes |
| tg_location | Practice locations |
| tg_role | User roles |

### Dataverse Field Conventions
- **Outbound** (API → Dataverse): add `tg_` prefix (`firstname` → `tg_firstname`)
- **Inbound** (Dataverse → API): strip `tg_` prefix, strip `_value` suffix from lookups
- **Navigation properties** (for `$expand`): PascalCase (`tg_ClientID`, `tg_ClinicianID`)

### ⚠️ CRITICAL: Always verify fields exist in `docs/dataverse-schema/{entity}.json` before using them. Non-existent fields cause cryptic OData errors.

---

## Stripe Integration
- Card storage and processing
- Invoice enrichment with CPT codes, NPI numbers, supervision statements
- Autopay support
- Webhooks for payment events
- Line items include: service description, CPT code, clinician name

## RBAC
- Shared permissions module between frontend and backend
- Roles: Practice Owner, Clinician, Supervisor, etc.
- Frontend: `Can` component + `usePermissions` hook
- Backend: `hasPermission()` check in tRPC procedures
