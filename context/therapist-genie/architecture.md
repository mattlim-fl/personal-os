# Architecture — Therapist Genie

## Stack

### Frontend (therapygenie-v2-web)
- **Framework:** Next.js + React
- **UI:** Fluent UI (Microsoft) + Tailwind + shadcn/ui
- **Calendar:** FullCalendar (day/time grid, recurring events via rrule)
- **API layer:** tRPC + React Query
- **Auth:** NextAuth (Microsoft/Azure AD)
- **Payments:** Stripe (React Stripe.js)
- **Signatures:** react-signature-canvas (for clinical notes)
- **Testing:** Vitest + Testing Library

### Backend (therapygenie-v2-api)
- **Framework:** Express.js + tRPC
- **Auth:** Azure AD JWT validation (jwks-rsa)
- **Email:** Azure Communication Services
- **Storage:** Azure Blob Storage
- **Payments:** Stripe
- **Serialization:** superjson
- **Validation:** Zod
- **Deployment:** Azure Web App

## Key Features
- Calendar with recurring appointments
- Progress notes with signatures
- Payment tracking (Stripe integration)
- Client management
- Microsoft Teams embedded app

## Data
- Backend connects to Azure/Dataverse (Microsoft ecosystem)
- Stripe for payment processing
