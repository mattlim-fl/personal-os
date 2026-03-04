# Runbook — Practice Interviews

## Local Development

```bash
# Backend (port 3001)
git clone git@github.com:FractalLabsDev/interview-prep-backend.git
cd interview-prep-backend
npm install
cp .env.example .env   # Configure DB connection
npm run db:migrate     # Run migrations
npm run db:seed        # Seed mock data
npm run dev

# Frontend (port 5173)
git clone git@github.com:FractalLabsDev/interview-prep-web.git
cd interview-prep-web
npm install
# Ensure .env has VITE_API_URL=http://localhost:3001/api
npm run dev
```

## Frontend Commands
```bash
npm run dev        # Dev server (:5173)
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run test       # Vitest
npm run knip       # Find unused code
```

## Backend Commands
```bash
npm run dev            # Dev server with hot reload (:3001)
npm run build          # Compile TypeScript
npm start              # Run compiled (production)
npm test               # Vitest
npm run lint           # ESLint
npm run lint:fix       # Auto-fix
npm run format         # Prettier
npm run typecheck      # Type check
npm run knip           # Unused code
npm run db:migrate     # Run pending migrations
npm run db:migrate:undo # Undo last migration
npm run db:seed        # Run seeders
npm run db:seed:undo   # Undo seeders
```

## Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001/api   # MUST match backend port
```

### Backend (.env)
```bash
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=interview_prep_development
DB_USERNAME=postgres
DB_PASSWORD=
# Production: DATABASE_URL=postgres://...
JWT_SECRET=
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=
SENTRY_DSN=
```

## Deployment
- **Backend:** Heroku (beta.practiceinterviews.com)
  - Push to `main` triggers deploy
  - Migrations run via release phase
  - `DATABASE_URL` auto-configured
- **Frontend:** TBD

## Database
- PostgreSQL via Sequelize ORM
- **No raw SQL** — always use Sequelize methods
- Migrations: `src/db/migrations/` (timestamped)
- Models: `src/db/models/` (28 models)
- Seeders: `src/db/seeders/`

## Adding a New Entity
1. `npx sequelize-cli migration:generate --name create-[entity]`
2. Create model in `src/db/models/[Entity].ts`
3. Create service in `src/services/[entity].service.ts`
4. Create routes in `src/routes/[entity].ts`
5. Register route in `src/routes/index.ts`
6. Optional: create seeder

## Key Docs (in repos)
**Backend:**
- `docs/ENTITIES.md` — Complete data model
- `docs/API.md` — API reference
- `docs/ARCHITECTURE.md` — System design
- `docs/DEVELOPMENT.md` — Setup guide

**Frontend:**
- `docs/COMPONENTS.md` — UI component reference
- `docs/RESPONSIVE.md` — Mobile/desktop breakpoints
- `docs/THEMING.md` — Dark mode patterns
- `docs/STATE.md` — Zustand + React Query
- `docs/ROUTING.md` — Route structure

## Branch Strategy
- `main` → production
- Both repos have `CLAUDE.md` for coding agent context
