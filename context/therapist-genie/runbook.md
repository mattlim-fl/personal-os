# Runbook — Therapist Genie

## Repos
```bash
# Frontend
git clone git@github.com:FractalLabsDev/therapygenie-v2-web.git
cd therapygenie-v2-web
npm install
cp .env.example .env.local  # Fill in Azure/Stripe credentials
npm run dev

# Backend
git clone git@github.com:FractalLabsDev/therapygenie-v2-api.git
cd therapygenie-v2-api
npm install
cp .env.example .env  # Fill in Azure/Stripe/DB credentials
npm run dev
```

## Environment Variables
- Azure AD credentials (tenant, client ID/secret)
- Stripe keys (publishable + secret)
- Azure Communication Services connection string
- Azure Blob Storage connection string
- Database connection (Dataverse)

## Deployment
- **API:** Azure Web App (GitHub Actions workflow)
- **Web:** TBD — check deployment config

## Testing
```bash
# Frontend
npm run test        # Vitest unit tests
npm run test:ui     # Vitest UI
```

## Branch Strategy
- `main` → production
- Feature branches: `feature/<name>`
- Bug fixes: `fix/<name>`
