# Personal OS v2

## What This Is

Rafa's backend + Matt's dashboard. A shared data layer where the AI assistant (Rafa) and the human (Matt) both read and write. Currently in early v2 rebuild — the web app is a skeleton, the **context store is the main deliverable so far**.

## Quick Start

```bash
cd apps/web
npm install
npm run dev   # localhost:3000
```

## Project Structure

```
personal-os/
├── apps/web/              # Next.js 14 app (dashboard + API routes)
│   ├── src/app/           # App Router pages
│   ├── src/lib/           # Supabase client, utilities
│   └── env.example        # Environment variables template
├── context/               # 🧠 Project context store (the important bit)
│   ├── _index.md          # Project index with status
│   ├── therapist-genie/   # TG: overview, architecture, state, runbook
│   ├── gm-dashboard/      # GM: overview, architecture, state, runbook
│   ├── deal-committee/    # DC: overview, architecture, state, runbook
│   ├── practice-interviews/ # PI: overview, architecture, state, runbook
│   ├── vitaboom/          # VB: overview, architecture, state, runbook
│   ├── shadwell-basin/    # SB: overview, architecture, state, runbook
│   ├── personal-os/       # This project
│   └── rafa/              # The AI assistant itself
├── docs/                  # Specs and documentation
│   └── SPEC.md            # v2 spec (context store + coding pipeline + dashboard)
├── .github/workflows/     # Scheduled email workflows
│   ├── daily-digest.yml       # Weekday 7am UTC
│   ├── weekly-goals-monday.yml # Monday 9:30am UTC
│   ├── weekly-review-friday.yml # Friday 3pm UTC
│   └── weekly-shipped-summary.yml # Friday 7am UTC
└── CLAUDE.md              # This file
```

## Context Store

The `context/` directory is the structured knowledge base for all of Matt's projects. Each project has:

| File | Purpose |
|------|---------|
| `overview.md` | What it is, repos, people, status |
| `architecture.md` | Stack, directory structure, patterns, data model |
| `state.md` | Current priorities, recent changes, known issues |
| `runbook.md` | How to run, test, deploy, env vars, key commands |

**When working on a project:** Read its context files first. They contain the repo URLs, coding conventions, patterns, and current state you need.

**After working on a project:** Update `state.md` with what changed.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (project ref: `jlvfedukwgcitnwbvtpq`) |
| Deployment | Netlify (https://matt-os.netlify.app/) |
| Auth | None yet (single user) |

## Supabase

```bash
# Existing tables (from v1, still have data):
# weekly_goals, weekly_signals, weekly_signal_entries,
# daily_habits, habit_completions, daily_outcomes,
# users, contexts, tasks, inbox_items, rules, context_briefs,
# gmail_tokens

# Project ref
supabase link --project-ref jlvfedukwgcitnwbvtpq
```

## GitHub Actions Workflows

These run independently and send emails via Gmail SMTP:

| Workflow | Schedule | What It Does |
|----------|----------|--------------|
| Daily Digest | Weekday 7am UTC | Fetches `/api/digest`, emails morning briefing |
| Weekly Goals | Monday 9:30am UTC | Reads Notion goals, generates email with Claude |
| Weekly Review | Friday 3pm UTC | Weekly review prompt email |
| What Shipped | Friday 7am UTC | GitHub activity summary |

**Note:** The digest endpoint (`/api/digest`) was removed in the v2 gut. These workflows will need updating once we rebuild the API layer.

## What's Coming (v2 Roadmap)

1. ✅ **Context store** — structured project knowledge
2. 🔄 **Coding agent pipeline** — Rafa picks up tasks, writes code, ships PRs
3. 🔜 **Dashboard MVP** — project cards, activity feed, mobile-first
4. 🔜 **Activity log API** — Rafa logs actions, Matt sees them
5. 🔜 **Obsidian integration** — parallel frontend for deep editing

See `docs/SPEC.md` for the full plan.

## Commands

```bash
# Development
cd apps/web && npm run dev     # Start dev server
cd apps/web && npm run build   # Production build
cd apps/web && npm run lint    # ESLint

# Formatting (from root)
npm run format                 # Prettier
npm run format:check           # Check formatting
```

## Conventions

- **Context files are markdown** — readable by humans, Obsidian, and AI agents
- **State files get updated** — after any work on a project, update its `state.md`
- **One project = one folder** — all context for a project lives together
- **Runbooks are practical** — exact commands, env vars, deployment steps
- **Architecture docs reference CLAUDE.md** — most projects have their own CLAUDE.md in their repos with deeper coding conventions
