# Runbook — GM Dashboard

## Local Development
```bash
git clone git@github.com:mattlim-fl/gm-dashboard.git
cd gm-dashboard
npm install  # or bun install
cp .env.example .env
npm run dev
```

## Environment Variables
- Supabase URL + keys
- Check .env.example for full list

## Deployment
- Netlify (see netlify.toml)
- Netlify Functions for server-side logic

## Branch Strategy
- `main` → production
- Has `CLAUDE.md` for coding agent context
