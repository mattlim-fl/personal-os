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

3. **Configure Supabase** (Optional for initial run)

For now, you can run the app without Supabase configured. When you're ready:

- Create a project at [supabase.com](https://supabase.com)
- Update `.env` files with your credentials

## Run Locally

```bash
# Start the Next.js web app
cd apps/web
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Verify Setup

### Check health endpoint

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-01-12T...",
  "service": "personal-os-web"
}
```

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
✅ Supabase Edge Functions structure  
✅ Shared types package  
✅ Gmail integration (stub)  
✅ GitHub integration (stub)  
✅ Comprehensive documentation  

## What's Next

⬜ Implement authentication  
⬜ Set up database schema  
⬜ Build UI components  
⬜ Implement Gmail integration  
⬜ Implement GitHub integration  
⬜ Add testing  
⬜ Deploy to production  

---

**Happy coding! 🚀**
