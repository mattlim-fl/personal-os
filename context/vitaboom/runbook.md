# Runbook — Vitaboom

## Local Development
```bash
# Backend
git clone git@github.com:FractalLabsDev/vitaboom-backend.git
cd vitaboom-backend
npm install
cp .env.example .env.development
npm run db:migrate
npm run dev

# Frontend
git clone git@github.com:FractalLabsDev/vitaboom-web.git
cd vitaboom-web
npm install
npm run dev
```

## Backend Commands
```bash
npm run dev              # Dev server with hot reload
npm run build            # Compile TypeScript
npm start                # Run compiled (production)
npm test                 # Vitest integration tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage
npm run lint             # ESLint
npm run db:migrate       # Run migrations
npm run db:migrate:status # Check status
npm run db:migrate:undo  # Undo last migration
```

## Frontend Commands
```bash
npm run dev    # Dev server
npm run build  # Production build
npm run lint   # ESLint
```

## Environment
- Multiple env files: `.env.development`, `.env.qa`, `.env.production`, `.env.test`
- Set `NODE_ENV` to switch
- Backend needs: DB connection, JWT secret, Shopify/QuickBooks/Klaviyo keys

## Deployment
- Backend: Heroku (GitHub Actions CI)
- CI: lint → build → test (with real PostgreSQL 15)

## Key Rules
- **Styling:** MUI `sx` props only, no Tailwind for new code
- **Models:** Import from `models/index.js`, never individual files
- **Errors:** Always `CustomError`, never plain `Error`
- **Routes:** Thin controllers — logic in services only
- **Services:** Handler functions end with `Handler` suffix
