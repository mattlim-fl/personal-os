# Matt's Personal OS — System Architecture

## The Core Idea

**"My Claude"** — a consistent AI configuration (context + preferences + tools) that you interact with through whatever surface is convenient.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              YOU (Matt)                                      │
└──────┬──────────────────┬──────────────────┬──────────────────┬─────────────┘
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Terminal   │    │  Dashboard  │    │    Slack    │    │   Mobile    │
│(Claude Code)│    │  Chat UI    │    │     Bot     │    │  (Future)   │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │                  │
       └──────────────────┴────────┬─────────┴──────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         "MATT'S CLAUDE"                                     │
│                         (Your Configured Instance)                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      SYSTEM PROMPT / CLAUDE.md                       │   │
│  │                                                                      │   │
│  │  "You are Matt's personal AI assistant. Read context files at       │   │
│  │   startup. Update them when state changes. Be direct, recommend     │   │
│  │   first, explain second. Assume technical competence..."            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                   │                                         │
│                                   ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CONTEXT FILES (Loaded at runtime)               │   │
│  │                                                                      │   │
│  │   current-state.md    preferences.md    projects.md    history.md   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                   │                                         │
│                                   ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      TOOLS & INTEGRATIONS                            │   │
│  │                                                                      │   │
│  │   GitHub API    Notion API    Google Calendar    Supabase    Slack  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SYSTEMS                                    │
│                                                                             │
│     Notion    GitHub    Google Cal    Todoist    Slack    Supabase         │
└─────────────────────────────────────────────────────────────────────────────┘
```

## What Makes It "Yours"

| Layer | What It Contains | How It's Stored |
|-------|------------------|-----------------|
| **System Prompt** | Core personality, instructions, guardrails | CLAUDE.md or API system prompt |
| **Context** | Current state, projects, preferences | Markdown files (git repo) |
| **Tools** | API access to your systems | API keys, OAuth tokens |
| **History** | Past decisions, lessons learned | context/history.md or database |

## Two Primary Surfaces (Current)

### 1. Terminal (Claude Code)
- **Best for:** Building, coding, complex tasks, all interaction
- **How:** Native Claude Code with CLAUDE.md + context files
- **Status:** Primary interface

### 2. Dashboard
- **Best for:** Visual state, notifications, things to review
- **How:** Your matt-os dashboard displays state, agents write here
- **Status:** Display layer, not chat (for now)

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        CURRENT FLOW                         │
│                                                             │
│  You ←→ Claude Code (terminal)                              │
│              │                                              │
│              ├── Reads: CLAUDE.md + context/*.md            │
│              ├── Writes: context/*.md (when state changes)  │
│              └── Calls: GitHub, Notion, Calendar APIs       │
│                                                             │
│  Dashboard (read-only view)                                 │
│              │                                              │
│              └── Displays: Supabase state, calendar, tasks  │
└─────────────────────────────────────────────────────────────┘
```

## Context File Structure

```
~/personal-os/  (or within matt-os repo)
├── CLAUDE.md                 # System prompt for Claude Code
├── context/
│   ├── current-state.md      # Life phase, key dates, income
│   ├── preferences.md        # Communication style, formats
│   ├── projects.md           # Active work, repos, contacts
│   └── agent-state/          # Agents write here (future)
│       ├── email-summary.md
│       └── github-state.md
```

## Key Principles

| Principle | Implementation |
|-----------|----------------|
| Single source of truth | Notion for goals, Context files for AI state |
| Claude = brains | Reasoning, planning, synthesis, execution |
| Dashboard = eyes | Visualization, quick capture, status at a glance |
| Context files = memory | Portable, versionable, human-readable |
| You = decisions | Claude recommends, you approve |

## What Lives Where

| Data | Location | Why |
|------|----------|-----|
| Life goals, weekly plans | Notion | Already established, works well |
| AI preferences & context | context/*.md | Portable, versionable, Claude can update |
| Work tasks | Supabase (via dashboard) | CRUD interface, quick capture |
| Shared tasks with Grace | Todoist | Already works, don't change |
| Code & automations | GitHub repos | Version control, CI/CD |
| Calendar | Google Calendar | Integration hub |
| Agent outputs | Supabase → Dashboard | Visual inbox for attention items |

## Future Surfaces (Not Yet Built)

- **Dashboard Chat UI** — Call Anthropic API with same context
- **Slack Bot** — Quick capture, async questions
- **Mobile** — On-the-go capture, voice input

All would share the same CLAUDE.md + context files = consistent "Matt's Claude"
