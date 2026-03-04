# Therapist Genie

## Summary
AI-powered therapy practice management platform. Runs as a Microsoft Teams app (iframe). Manages appointments, clients, progress notes, billing/payments, treatment plans, forms, payroll, and team. Full rebuild into Next.js just completed (not yet live).

## Repos
- **Frontend:** https://github.com/FractalLabsDev/therapygenie-v2-web (309 source files)
  - Branch: `main`
  - Language: TypeScript
- **Backend:** https://github.com/FractalLabsDev/therapygenie-v2-api
  - Branch: `main`
  - Language: TypeScript

## People
- **Client:** Austin Wood (Fractal Labs) — austin@fractallabs.dev
- **Users:** Therapy practices (clinicians, practice owners, supervisors)

## Status
**Rebuilt last week** (late Feb 2026) into Next.js. Not yet live — needs testing for database changes made yesterday. Plan is to get live ASAP. Approaching BAU once stable.

## Key Domain Concepts
- **Practice management** — clients, team members, locations, service rates
- **Clinical workflow** — appointments (including recurring), progress notes (with signatures), treatment plans, chart notes, forms
- **Billing** — Stripe integration, autopay, invoice enrichment with CPT codes and NPI numbers
- **Payroll** — clinician compensation tracking
- **Approval queue** — document signing workflow (notes, treatment plans)
- **RBAC** — role-based permissions (Practice Owner, Clinician, Supervisor, etc.)
