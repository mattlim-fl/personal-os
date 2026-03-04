# Personal OS v2 — Spec

**Status:** Draft for review
**Date:** 2026-03-04
**Author:** Rafa

---

## Problem Statement

Matt manages multiple projects across different repos, stacks, and clients. His AI assistant (Rafa) loses context every session and has to rebuild understanding from flat memory files. This means:

1. **Cold starts** — Every session, Rafa needs to re-learn project context before being useful
2. **No autonomy** — Rafa can't pick up a bug report or feature request and just *do it* without extensive briefing
3. **No visibility** — Matt can't see what Rafa knows, what state projects are in, or what's being worked on
4. **Context rot** — Project knowledge goes stale because there's no system to keep it current

## Goal

**Enable Rafa to autonomously investigate bugs, build features, and ship PRs — with the right context — while giving Matt visibility and control.**

---

## System Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Matt (Human)                           │
│                                                          │
│  "Fix that bug in TG"     Reviews PRs      Edits context │
│  (voice/chat/Telegram)    (GitHub)         (Obsidian/UI) │
└──────────┬───────────────────┬──────────────────┬────────┘
           │                   │                  │
           ▼                   ▼                  ▼
┌──────────────────────────────────────────────────────────┐
│                    Rafa (Agent)                           │
│                                                          │
│  Receives task → Loads context → Spawns coding agent     │
│  → Reviews output → Opens PR → Reports back              │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│               Context Store (Markdown)                    │
│                                                          │
│  Per-project:                                            │
│  - overview (what, stack, repo, conventions)              │
│  - architecture (how it's built)                         │
│  - current state (priorities, recent changes, issues)    │
│  - runbook (how to dev, test, deploy)                    │
│                                                          │
│  Stored as files. Readable by Obsidian + Rafa.           │
└──────────────────────────────────────────────────────────┘
```

---

## Part 1: Context Store

### Structure

Each project gets a folder with structured markdown files:

```
context/
├── _index.md                 # List of all projects + summary
├── therapist-genie/
│   ├── overview.md           # What it is, who it's for, repo URL
│   ├── architecture.md       # Stack, key files, data model
│   ├── state.md              # Current priorities, recent changes, known issues
│   └── runbook.md            # How to run, test, deploy, env vars
├── practice-interviews/
│   ├── overview.md
│   ├── architecture.md
│   ├── state.md
│   └── runbook.md
├── deal-committee/
│   └── ...
└── personal-os/
    └── ...
```

### Per-Project Files

**overview.md**
```markdown
# Therapist Genie

## Summary
AI-powered therapist matching tool. Live in production.

## Repo
- URL: https://github.com/FractalLabsDev/therapist-genie
- Branch strategy: main → production
- Primary language: TypeScript

## People
- Client: Austin Wood (Fractal Labs)
- Users: Therapists + patients

## Status
Live — approaching BAU. Bug fixes and minor improvements.
```

**architecture.md**
```markdown
# Architecture — Therapist Genie

## Stack
- Frontend: Next.js 14, Tailwind, shadcn/ui
- Backend: Supabase (Postgres + Edge Functions)
- Auth: Supabase Auth
- Hosting: Vercel

## Key Directories
- `src/app/` — App Router pages
- `src/lib/` — Core logic
- `src/components/` — UI components
- `supabase/migrations/` — DB schema

## Data Model
[Key tables and relationships]

## External Services
[APIs, third-party integrations]
```

**state.md** (updated frequently — by Rafa or automatically)
```markdown
# Current State — Therapist Genie

*Last updated: 2026-03-04*

## Priorities
1. Fix password reset bug (reported by user)
2. Improve onboarding flow copy

## Recent Changes
- 2026-03-01: Deployed v2.3 — new matching algorithm
- 2026-02-28: Fixed auth redirect loop (#142)

## Known Issues
- Password reset emails sometimes delayed
- Mobile nav doesn't close on route change

## Open PRs
- #145: Fix mobile nav (awaiting review)
```

**runbook.md**
```markdown
# Runbook — Therapist Genie

## Local Development
```bash
git clone https://github.com/FractalLabsDev/therapist-genie
cd therapist-genie
npm install
cp .env.example .env.local
# Fill in env vars (see below)
npm run dev
```

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase dashboard
- ...

## Deployment
- Push to `main` → auto-deploys to Vercel
- DB migrations: `supabase db push`

## Testing
- `npm test` — unit tests
- `npm run e2e` — Playwright (if configured)
```

### Context Maintenance

The context store needs to stay current. Options (not mutually exclusive):

1. **Manual** — Rafa updates state.md after working on a project
2. **Git-driven** — Periodic scan of recent commits/PRs to update state.md
3. **Agent-driven** — Cheap model (Haiku/similar) periodically reviews repos and refreshes context
4. **Event-driven** — GitHub webhooks trigger context updates on PR merge

For v1: **manual + git-driven**. Rafa updates after doing work, and periodically scans repos to refresh state. We can add smarter automation later.

---

## Part 2: Coding Agent Pipeline

### Workflow

1. **Matt sends task** (chat, voice note, Telegram)
   - "Fix the password reset bug in TG"
   - "Add bulk import to DC"

2. **Rafa loads context**
   - Reads the project's context files
   - Understands repo, stack, architecture, current state

3. **Rafa investigates** (if needed)
   - Clones/pulls the repo
   - Reads relevant code
   - Identifies the issue or plans the feature

4. **Rafa spawns coding agent**
   - Passes: task description + project context + relevant code
   - Agent works in a branch
   - Agent writes code, tests if possible

5. **Rafa reviews output**
   - Sanity-checks the changes
   - Opens a PR with clear description
   - Reports back to Matt

6. **Matt reviews and merges**

### Technical Implementation

- Use OpenClaw's `coding-agent` skill to spawn Claude Code / Codex
- Clone repos to workspace as needed
- Create branches: `rafa/<short-description>`
- Open PRs via `gh` CLI
- Context files are passed as part of the agent prompt

---

## Part 3: Dashboard (Web UI)

### Purpose

Visual interface for things that are better seen than described in chat:

- Project context overview (what Rafa knows)
- Activity feed (what Rafa's been doing)
- Task/PR status across projects

### Pages

| Page | Content |
|------|---------|
| **Home** | Active projects summary, recent activity, in-flight PRs |
| **Project Detail** | Full context view for a project, edit capability |
| **Activity** | Feed of Rafa's actions (investigated X, opened PR Y, updated context Z) |

### Design Principles

- **Mobile-first** — Matt will mostly check this on his phone
- **Read-heavy** — It's a visibility tool, not a data entry tool
- **Simple** — Cards, lists, minimal interaction. No complex forms.

---

## Part 4: Obsidian Integration (Optional/Parallel)

The context store is markdown files. This means Obsidian can be a parallel frontend:

- Point an Obsidian vault at the `context/` directory
- Matt can browse/edit project context in Obsidian (desktop + mobile)
- Obsidian's graph view, search, and linking are free features
- No custom code needed — it's just files

This can coexist with the web dashboard. Obsidian for deep editing, web for quick visibility.

---

## Build Plan

### Phase 1: Context Store + First Coding Task (This week)
1. Set up context directory structure
2. Populate context for 2-3 projects (TG, PI, DC)
3. Test the workflow: Matt gives task → Rafa loads context → ships PR
4. Iterate on what context is actually needed

### Phase 2: Dashboard MVP (Next week)
1. Gut existing Personal OS codebase
2. Build Home page (project cards, activity feed)
3. Build Project Detail page (context viewer/editor)
4. Wire up activity logging API

### Phase 3: Automation (Week 3-4)
1. Git-driven context refresh
2. Better coding agent integration
3. GitHub webhooks for live state updates
4. Obsidian vault setup if Matt wants to try it

---

## What We're NOT Building

- ❌ Task management system (Todoist exists)
- ❌ Email client (Himalaya + Rafa handles this)
- ❌ Calendar app (gcalcli works)
- ❌ Habit tracker (can add later if needed)
- ❌ AI inbox triage (Rafa does this manually, it works)

---

## Success Criteria

After 2 weeks:

| Metric | Target |
|--------|--------|
| Matt can send a bug report and get a PR back | Without giving project context |
| Rafa can pick up a feature request and build it | With minimal clarification |
| Context stays current | State.md updated after every piece of work |
| Matt can see project status | Glanceable on phone in <30 seconds |

---

## Open Questions

1. **Where does the context store live?** In the Personal OS repo? In each project's repo? In the OpenClaw workspace?
2. **Auth for dashboard?** Skip for now (single user), add basic auth later?
3. **Activity log storage?** Supabase table, or markdown files, or both?
4. **Voice note transcription?** OpenClaw already handles this, but worth confirming the flow.
5. **Which projects to context-map first?** TG + PI + DC seems right.

---

*Ship context, ship code, ship fast.*
