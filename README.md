# Personal OS v2

Rafa's backend + Matt's dashboard. A shared data layer where the AI assistant and the human both read and write.

## What It Does

- **Context Store** — structured per-project knowledge (repos, architecture, state, runbooks) for 8 projects
- **Coding Agent Pipeline** — Rafa picks up tasks, loads project context, writes code, ships PRs *(in progress)*
- **Dashboard** — mobile-first UI for visibility into projects and agent activity *(coming soon)*

## Context Store

The main deliverable so far. Structured knowledge for all of Matt's projects:

```
context/
├── _index.md              # Project index
├── therapist-genie/       # Teams app for therapy practices
├── gm-dashboard/          # Venue management platform
├── deal-committee/        # AI acquisition evaluation tool
├── practice-interviews/   # Interview prep platform
├── vitaboom/              # B2B supplement platform
├── shadwell-basin/        # AI grant application tool
├── personal-os/           # This project
└── rafa/                  # The AI assistant
```

Each project has: `overview.md`, `architecture.md`, `state.md`, `runbook.md`

## Stack

- **Next.js 14** (App Router) + **Tailwind CSS**
- **Supabase** (Postgres)
- **Netlify** (deployment)

## Development

```bash
cd apps/web
npm install
cp env.example .env.local
npm run dev
```

## Deployment

- **URL:** https://matt-os.netlify.app/
- **Supabase:** `jlvfedukwgcitnwbvtpq`

## Docs

- `CLAUDE.md` — Full project guide for AI agents
- `docs/SPEC.md` — v2 specification
