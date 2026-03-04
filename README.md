# Personal OS v2

Rafa's backend + Matt's dashboard. A shared data layer where the AI assistant and the human both read and write.

## What It Does

- **Context Store** — structured per-project knowledge (repos, architecture, state, runbooks)
- **Coding Agent Pipeline** — Rafa picks up tasks, writes code, ships PRs
- **Dashboard** — mobile-first UI for visibility into projects and agent activity

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Supabase** (Postgres)
- **Netlify** (deployment)

## Development

```bash
npm install
cd apps/web
cp env.example .env.local
npm run dev
```

## Project Structure

```
personal-os/
├── apps/web/          # Next.js app (dashboard + API routes)
├── context/           # Project context files (markdown)
├── .github/workflows/ # Scheduled email workflows
└── docs/              # Specs and documentation
```
