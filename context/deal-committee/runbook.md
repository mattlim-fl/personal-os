# Runbook — Deal Committee

## Local Development
```bash
git clone git@github.com:mattlim-fl/ai-investment-committee.git
cd ai-investment-committee
npm install
cp .env.local.example .env.local
npm run dev
```

## Environment Variables
- Supabase URL + anon key + service role key
- OpenAI API key (for AI agents)
- Stripe keys
- PostHog API key

## Deployment
- TBD — check for Vercel/Netlify config

## Testing
```bash
npm run test  # Vitest
```

## Branch Strategy
- `main` → production
- Has `CLAUDE.md` for coding agent context
