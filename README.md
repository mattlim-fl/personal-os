# Personal OS v1

A unified system for managing personal data and workflows, built with modern web technologies.

## 🏗️ Architecture

Personal OS is a monorepo containing:

- **Frontend**: Next.js (TypeScript, App Router)
- **Backend**: Supabase (Postgres + Edge Functions)
- **Shared**: Common types and utilities

### Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Serverless Functions**: Supabase Edge Functions (Deno)
- **Code Quality**: ESLint + Prettier
- **Package Manager**: npm workspaces

## 📁 Repository Structure

```
matt-os/
├── apps/
│   ├── web/              # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/      # App Router pages and API routes
│   │   │   ├── components/
│   │   │   └── lib/      # Client utilities and integrations
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/              # Supabase Edge Functions
│       ├── functions/
│       │   ├── health/
│       │   ├── gmail-sync/
│       │   └── github-sync/
│       ├── supabase/
│       └── package.json
├── packages/
│   └── shared/           # Shared types and utilities
│       ├── src/
│       │   ├── types/
│       │   └── utils/
│       └── package.json
├── docs/                 # Documentation
├── package.json          # Root package.json (workspace config)
├── tsconfig.json         # Root TypeScript config
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Supabase CLI (for local development)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd matt-os
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the example environment files and fill in your values:

```bash
# Root environment
cp env.example .env

# Web app environment
cp apps/web/env.example apps/web/.env

# API environment
cp apps/api/env.example apps/api/.env
```

4. **Configure Supabase**

If you haven't already, create a Supabase project at [supabase.com](https://supabase.com).

Update your `.env` files with your Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep secret!)

### Development

Run all applications in development mode:

```bash
npm run dev
```

Or run individual applications:

```bash
# Web app only
cd apps/web
npm run dev

# Edge functions only (requires Supabase CLI)
cd apps/api
npm run dev
```

The web app will be available at `http://localhost:3000`.

### Building

Build all applications:

```bash
npm run build
```

### Code Quality

```bash
# Run linting
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check

# Type checking
npm run type-check
```

## 🔌 Integrations (Stub)

The following integrations are scaffolded but not yet implemented:

### Gmail

- Location: `apps/web/src/lib/integrations/gmail.ts`
- Edge Function: `apps/api/functions/gmail-sync/`
- Purpose: Email management and synchronization

### GitHub

- Location: `apps/web/src/lib/integrations/github.ts`
- Edge Function: `apps/api/functions/github-sync/`
- Purpose: Repository and issue tracking

## 🗄️ Database

Supabase provides:

- PostgreSQL database
- Auto-generated REST API
- Real-time subscriptions
- Authentication
- Storage

### Local Development

To run Supabase locally:

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
cd apps/api
supabase start

# Stop local Supabase
supabase stop
```

## 📝 TypeScript Configuration

The project uses strict TypeScript configuration with:

- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`

## 🧪 Testing

Testing setup is not included in this initial scaffold. Consider adding:

- Jest for unit testing
- Playwright or Cypress for E2E testing
- React Testing Library for component testing

## 🚢 Deployment

### Frontend (Next.js)

Deploy to Vercel (recommended):

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd apps/web
vercel
```

### Backend (Edge Functions)

Deploy to Supabase:

```bash
cd apps/api
supabase functions deploy
```

## 🔐 Environment Variables

See `env.example` files in each application directory for required environment variables.

**Important**: Never commit `.env` files or secrets to version control.

## 🤝 Contributing

This is a personal project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking
5. Submit a pull request

## 📄 License

Private project - All rights reserved.

## 🗺️ Roadmap

- [ ] Implement authentication
- [ ] Set up database schema
- [ ] Implement Gmail integration
- [ ] Implement GitHub integration
- [ ] Add testing framework
- [ ] Add CI/CD pipeline
- [ ] Implement UI components
- [ ] Add data visualization
- [ ] Implement search functionality
- [ ] Add mobile responsiveness

## 📚 Additional Documentation

See the `/docs` directory for additional documentation:

- Architecture decisions
- API documentation
- Database schema
- Integration guides

## 🐛 Troubleshooting

### Common Issues

**Issue**: `Module not found` errors

- Solution: Run `npm install` in the root directory

**Issue**: TypeScript errors in shared package

- Solution: Ensure all workspaces are installed: `npm install`

**Issue**: Supabase connection errors

- Solution: Check your environment variables and Supabase project status

## 💬 Support

For questions or issues, please open a GitHub issue.
