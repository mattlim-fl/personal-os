# Runbook — Therapist Genie

## Local Development

**Requires Node.js 22+** (use `nvm use`)

```bash
# Frontend (port 3000)
git clone git@github.com:FractalLabsDev/therapygenie-v2-web.git
cd therapygenie-v2-web
npm install
cp .env.example .env.local
npm run dev

# Backend (port 3001) — in separate terminal
git clone git@github.com:FractalLabsDev/therapygenie-v2-api.git
cd therapygenie-v2-api
npm install
cp .env.example .env
npm run dev
```

## Frontend Commands
```bash
npm run dev           # Dev server (Turbopack)
npm run build         # Production build
npm run lint          # ESLint
npm run typecheck     # Type check
npm run test          # Tests once
npm run test:watch    # Tests in watch mode
npm run test:coverage # Tests with coverage
```

## Backend Commands
```bash
npm run dev           # Dev server (tsx watch, hot reload)
npm run build         # Compile TypeScript
npm run start         # Run compiled
npm run typecheck     # Type check
npm run test          # Tests once
npm run test:watch    # Tests in watch mode
npm run test:coverage # Tests with coverage (80% threshold)
```

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
AZURE_CLIENT_ID=...
AZURE_CLIENT_SECRET=...
AZURE_TENANT_ID=...
AUTH_SECRET=...  # openssl rand -base64 32
```

### Backend (.env)
- Azure AD credentials (tenant, client ID/secret)
- Dataverse connection (org URL)
- Stripe keys (secret key, webhook secret)
- Azure Communication Services connection string
- Azure Blob Storage connection string

## Deployment
- **Frontend:** Azure Static Web Apps
- **Backend:** Azure Web App (GitHub Actions workflow)

## Branch Strategy
- `main` → production
- Both repos have `CLAUDE.md` for coding agent context

## Type Sharing
- Backend exports `AppRouter` type
- Frontend imports: `import type { AppRouter } from 'therapygenie-v2-api'`
- Local dev: `npm link` or TypeScript path mapping

## Database
- Microsoft Dataverse (OData REST API)
- Schema docs: `therapygenie-v2-api/docs/dataverse-schema/{entity}.json`
- **Always verify fields exist before using them**
- Changes documented in `docs/DATABASE_CHANGES.md`

## Docs (in API repo)
- `docs/API_ENDPOINTS.md` — endpoint reference
- `docs/DATABASE.md` — Dataverse patterns and conventions
- `docs/ENTITIES.md` — entity reference with field details
- `docs/PAYMENTS.md` — Stripe integration details
- `docs/RBAC.md` — permissions system
- `docs/INFRASTRUCTURE.md` — deployment and infra
- `docs/dataverse-schema/` — JSON schema files per entity
