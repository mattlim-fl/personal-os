# Quick Start Guide

Get Personal OS v1 running locally in 5 minutes.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Setup

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

```bash
# Copy example files
cp env.example .env
cp apps/web/env.example apps/web/.env
cp apps/api/env.example apps/api/.env
```

3. **Configure Supabase** (Required for Phase 1)

Phase 1 requires Supabase to be configured:

- Project URL: `https://jlvfedukwgcitnwbvtpq.supabase.co`
- Get your anon key from [Supabase dashboard](https://supabase.com/dashboard/project/jlvfedukwgcitnwbvtpq/settings/api)
- Add to `apps/web/.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://jlvfedukwgcitnwbvtpq.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
  ```

4. **Configure GitHub** (Required for context sync)

- Create token at [GitHub Settings](https://github.com/settings/tokens)
- Select `repo` scope
- Add to `apps/web/.env.local`:
  ```
  GITHUB_TOKEN=your_token_here
  GITHUB_REPO_OWNER=mattlim-fl
  GITHUB_REPO_NAME=personal-os
  GITHUB_BRANCH=main
  ```

## Run Locally

```bash
# Start the Next.js web app
cd apps/web
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Verify Setup

### Check the app is running

Visit [http://localhost:3000](http://localhost:3000)

You should see:
- Active context section
- Context count
- Quick links to contexts

### Create your first context

1. Click "New Context"
2. Fill in the form
3. Click "Create Context"
4. Verify it appears on the home page

### Check GitHub sync

Visit [https://github.com/mattlim-fl/personal-os/tree/main/contexts](https://github.com/mattlim-fl/personal-os/tree/main/contexts)

You should see your context as a Markdown file.

### Run type checking

```bash
npm run type-check
```

### Run linting

```bash
npm run lint
```

### Format code

```bash
npm run format
```

## Project Structure

```
matt-os/
├── apps/
│   ├── web/          # Next.js frontend (localhost:3000)
│   └── api/          # Supabase Edge Functions
├── packages/
│   └── shared/       # Shared types and utilities
└── docs/             # Documentation
```

## Next Steps

1. ✅ You've completed the initial setup!
2. Read the [README.md](./README.md) for full documentation
3. Check [docs/SETUP.md](./docs/SETUP.md) for detailed setup instructions
4. Review [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) to understand the system
5. See [docs/PRD.md](./docs/PRD.md) for the product roadmap

## Common Commands

```bash
# Development
npm run dev              # Start all apps in dev mode
cd apps/web && npm run dev    # Start web app only

# Build
npm run build            # Build all apps
cd apps/web && npm run build  # Build web app only

# Code Quality
npm run type-check       # TypeScript type checking
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run format:check     # Check formatting

# Git
git status               # Check status
git add .                # Stage changes
git commit -m "message"  # Commit changes
```

## Troubleshooting

**Port 3000 already in use?**

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

**Module not found errors?**

```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

**TypeScript errors?**

```bash
npm run type-check
rm -rf apps/web/.next
```

## Getting Help

- 📖 Read the [README.md](./README.md)
- 🏗️ Check [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- 🔧 See [SETUP.md](./docs/SETUP.md)
- 📋 Review [PRD.md](./docs/PRD.md)

## What's Included

✅ Next.js 14 with App Router  
✅ TypeScript (strict mode)  
✅ ESLint + Prettier  
✅ Supabase database with schema  
✅ Context Management System (Phase 1)  
✅ GitHub integration (context sync)  
✅ Shared types package with Zod validation  
✅ Gmail integration (stub - Phase 2)  

## Phase 1 Complete ✅

✅ Context CRUD API  
✅ Context UI pages  
✅ GitHub sync for context briefs  
✅ LLM context loader  
✅ Active context management  

## What's Next (Phase 2)

⬜ Implement Gmail OAuth  
⬜ Build email ingestion  
⬜ Create classification engine  
⬜ Build rules engine  
⬜ Create approval queue UI  
⬜ Add draft reply generation  

---

**Happy coding! 🚀**
