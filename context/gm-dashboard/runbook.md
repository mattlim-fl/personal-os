# Runbook — GM Dashboard

## Local Development
```bash
git clone git@github.com:mattlim-fl/gm-dashboard.git
cd gm-dashboard
npm install
cp .env.example .env
npm run dev
# App at http://localhost:8080
```

## Common Commands
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run test             # Run frontend tests (Vitest, watch mode)
npm run test:run         # Run frontend tests once
npm run test:coverage    # Run frontend tests with coverage
```

## Edge Function Commands
```bash
# Deploy a function
npx supabase functions deploy <function-name>

# View logs
npx supabase functions logs <function-name>

# Run edge function tests (from supabase/functions/)
cd supabase/functions
deno task test
deno task test:crypto
deno task test:retry
deno task test:square
deno task test:claude
deno task test:gmail
```

## Database
```bash
# Apply migrations
npx supabase db push

# Supabase dashboard
# https://supabase.com/dashboard/project/plksvatjdylpuhjitbfc
```

## Environment Variables

### Frontend (.env)
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anon key

### Supabase Edge Function Secrets
| Variable | Required | Purpose |
|----------|----------|---------|
| `CREDENTIALS_ENCRYPTION_KEY` | Yes | AES-256 key (64-char hex) |
| `APP_URL` | No | App base URL for OAuth redirects |
| `XERO_CLIENT_ID` / `SECRET` | For Xero | Xero OAuth |
| `GMAIL_CLIENT_ID` / `SECRET` | For email agent | Gmail OAuth |
| `ANTHROPIC_API_KEY` | For email agent | Claude classification |
| `GUEST_LIST_SECRET` | No | Guest list token signing |

### Netlify Environment Variables
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `CREDENTIALS_ENCRYPTION_KEY`
- `XERO_CLIENT_ID`, `XERO_CLIENT_SECRET`, `XERO_REDIRECT_URI`
- `API_ALLOWED_ORIGINS`

**Note:** Square and Resend credentials are in the database (Settings → API Integrations), not env vars.

## Deployment
- **Frontend:** Push to `main` → Netlify auto-deploys
- **Edge functions:** `npx supabase functions deploy <name>`
- **DB migrations:** `npx supabase db push`

## Branch Strategy
- `main` → production
- Has `CLAUDE.md` for comprehensive coding agent context
- Has `.mcp.json` for Supabase MCP integration

## Debugging
- Supabase dashboard: https://supabase.com/dashboard/project/plksvatjdylpuhjitbfc
- Edge function logs: dashboard or `npx supabase functions logs <name>`
- Email template testing: Settings → Notifications tab
- API credential testing: Settings → API Integrations tab
