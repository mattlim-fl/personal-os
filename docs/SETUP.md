# Setup Guide

Complete setup instructions for Personal OS v1.

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)

   ```bash
   node --version  # Should be >= 18.0.0
   ```

2. **npm** (v9 or higher)

   ```bash
   npm --version  # Should be >= 9.0.0
   ```

3. **Git**
   ```bash
   git --version
   ```

### Optional Software

1. **Supabase CLI** (for local development)

   ```bash
   npm install -g supabase
   ```

2. **Vercel CLI** (for deployment)
   ```bash
   npm install -g vercel
   ```

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd matt-os

# Install all dependencies
npm install
```

This will install dependencies for all workspaces (web, api, shared).

### 2. Supabase Setup

#### Option A: Use Existing Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing one
3. Get your project credentials:
   - Project URL
   - Anon/Public Key
   - Service Role Key (keep secret!)

#### Option B: Run Supabase Locally

```bash
cd apps/api
supabase init
supabase start
```

This will start local Supabase services:

- PostgreSQL: `localhost:54322`
- API: `localhost:54321`
- Studio: `localhost:54323`

### 3. Environment Variables

#### Root Environment

```bash
cp env.example .env
```

Edit `.env` and fill in your values.

#### Web App Environment

```bash
cp apps/web/env.example apps/web/.env
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### API Environment

```bash
cp apps/api/env.example apps/api/.env
```

Required variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Verify Installation

```bash
# Type check all packages
npm run type-check

# Lint all packages
npm run lint

# Format all code
npm run format
```

## Running Locally

### Start All Services

```bash
npm run dev
```

This starts:

- Next.js dev server on `http://localhost:3000`
- (If configured) Supabase Edge Functions

### Start Individual Services

#### Web App Only

```bash
cd apps/web
npm run dev
```

Visit `http://localhost:3000`

#### Edge Functions Only

```bash
cd apps/api
supabase functions serve
```

## Database Setup

### Database Schema ✅

**Status**: Complete and deployed

The database schema has been created with the following tables:

- `users` - User accounts
- `contexts` - Organizational contexts
- `context_briefs` - Aggregated context information
- `tasks` - Action items (for Phase 2)
- `inbox_items` - Incoming items (for Phase 2)
- `rules` - Automation rules (for Phase 2)

**Migration**: `20260112_initial_schema`

The schema is already deployed to your Supabase project at:
`https://jlvfedukwgcitnwbvtpq.supabase.co`

You can view the tables in the [Supabase dashboard](https://supabase.com/dashboard/project/jlvfedukwgcitnwbvtpq/editor).

## Integration Setup

### GitHub Integration ✅ (Phase 1 - Complete)

**Purpose**: Sync context briefs to GitHub as Markdown files

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scope: `repo` (Full control of private repositories)
4. Generate and copy the token
5. Add to `apps/web/.env.local`:
   ```env
   GITHUB_TOKEN=your_github_token
   GITHUB_REPO_OWNER=mattlim-fl
   GITHUB_REPO_NAME=personal-os
   GITHUB_BRANCH=main
   ```

**Verification**: Create a context and check https://github.com/mattlim-fl/personal-os/tree/main/contexts

### Gmail Integration (Phase 2 - Planned)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add credentials to `.env`:
   ```env
   GMAIL_CLIENT_ID=your-client-id
   GMAIL_CLIENT_SECRET=your-client-secret
   ```

**Status**: Stub only, implementation planned for Phase 2

## Deployment

### Deploy Frontend (Vercel)

```bash
cd apps/web

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

Add environment variables in Vercel dashboard.

### Deploy Edge Functions (Supabase)

```bash
cd apps/api

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy health
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run type-check

# Clear Next.js cache
rm -rf apps/web/.next
```

### Supabase Connection Issues

1. Check your environment variables
2. Verify Supabase project is running
3. Check network connectivity
4. Verify API keys are correct

### ESLint/Prettier Conflicts

```bash
# Format all files
npm run format

# Then run lint
npm run lint
```

## Next Steps

### Phase 1 Complete ✅

1. ✅ Complete this setup guide
2. ✅ Database schema created and deployed
3. ✅ GitHub integration implemented
4. ✅ Context UI components built
5. ✅ Context CRUD API implemented

### Phase 2 (Next)

1. ⬜ Implement Gmail OAuth
2. ⬜ Build email ingestion
3. ⬜ Create classification engine
4. ⬜ Build rules engine
5. ⬜ Create approval queue UI
6. ⬜ Add draft reply generation

### Future

1. ⬜ Implement authentication
2. ⬜ Add tests
3. ⬜ Deploy to production

## Getting Help

- Check the main README.md
- Review ARCHITECTURE.md
- Open an issue on GitHub
- Check Supabase documentation: https://supabase.com/docs
- Check Next.js documentation: https://nextjs.org/docs
