# Async Agents Architecture

## Three Modes of Operation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  1. INTERACTIVE          2. ON-DEMAND              3. ASYNC AGENTS         │
│     (You initiate)          (Triggered)               (Background)          │
│                                                                             │
│  "What should I          Morning briefing          Email monitor            │
│   do today?"             runs at 7am               PR review watcher        │
│                                                    Slack digest             │
│  You ←→ Claude           Cron → Claude → You      Agent → You (when needed)│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## How Agents Fit In

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              YOU (Matt)                                      │
└──────┬──────────────────┬──────────────────┬────────────────────────────────┘
       │                  │                  │
       │ Interactive      │ On-demand        │ Check when ready
       │                  │ (scheduled)      │ (no interrupts)
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────────┐
│  Claude     │    │  Cron Jobs  │    │         ASYNC AGENTS            │
│  Code       │    │             │    │                                 │
│  Terminal   │    │  • 7am      │    │  ┌─────────┐  ┌─────────┐      │
│             │    │    briefing │    │  │  Email  │  │   PR    │      │
│             │    │  • Weekly   │    │  │ Monitor │  │ Review  │      │
│             │    │    digest   │    │  └────┬────┘  └────┬────┘      │
└──────┬──────┘    └──────┬──────┘    │       │            │           │
       │                  │           │       ▼            ▼           │
       │                  │           │  ┌────────────────────────┐    │
       │                  │           │  │ Write to Supabase      │    │
       │                  │           │  │ (Dashboard displays)   │    │
       │                  │           │  └────────────────────────┘    │
       │                  │           └────────────────────────────────┘
       │                  │                         │
       └──────────────────┴────────────┬────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         "MATT'S CLAUDE" CORE                                │
│                                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                   │
│  │ System Prompt │  │ Context Files │  │    Tools      │                   │
│  │ (CLAUDE.md)   │  │ (state, prefs)│  │ (APIs, keys)  │                   │
│  └───────────────┘  └───────────────┘  └───────────────┘                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SYSTEMS                                    │
│                                                                             │
│     Gmail       GitHub       Slack       Google Cal      Notion             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## The Agent Pattern

Each agent is a small, focused loop:

```
┌─────────────────────────────────────────────────────────────┐
│                     AGENT PATTERN                           │
│                                                             │
│   1. POLL          2. EVALUATE         3. ACT (maybe)      │
│                                                             │
│   Check source     Does this need      • Write to dashboard│
│   for changes      Matt's attention?   • Update context    │
│                                        • Draft response    │
│   (every N mins    (Claude decides)    • Do nothing        │
│    or webhook)                                              │
└─────────────────────────────────────────────────────────────┘
```

**Key constraint:** Agents notify, they don't act autonomously. Low autonomy = you stay in the loop.

## Planned Agents

### Email Monitor Agent

```yaml
trigger: Every 15 mins (or Gmail push notification)
reads: Gmail API — new emails since last check
evaluates: 
  - Is this urgent? (from key contacts, keywords)
  - Does this need a response today?
  - Is this just noise?
actions:
  - Urgent: Flag in dashboard "attention needed"
  - Needs response: Add to daily briefing, draft reply
  - Noise: Ignore, maybe auto-archive
output: Writes to Supabase → Dashboard displays
```

### PR Review Agent

```yaml
trigger: GitHub webhook (new PR) or every 30 mins
reads: GitHub API — PRs where Matt is reviewer, PRs in his repos
evaluates:
  - How complex is this PR?
  - Is it blocking someone?
  - Has it been waiting too long?
actions:
  - Simple PR: Summarize, flag for quick review
  - Complex PR: Summarize changes, highlight concerns
  - Stale PR: Surface in dashboard
output: Writes to Supabase → Dashboard displays
```

### Slack Digest Agent

```yaml
trigger: Every few hours, or end of day
reads: Slack API — messages in key channels, DMs
evaluates:
  - What's important across both workspaces?
  - Any decisions needed?
  - Any @mentions or questions for Matt?
actions:
  - Summarize key threads
  - Flag action items
output: Writes to Supabase → Dashboard displays
```

## Where Agents Run

| Platform | Pros | Cons | When to Use |
|----------|------|------|-------------|
| **GitHub Actions** | Free, easy cron | Cold start, 6hr max | Start here |
| **Railway / Render** | Always-on, webhooks | ~$5/mo | When need webhooks |
| **Supabase Edge Functions** | Already have Supabase | Learning curve | If want to consolidate |

**Recommendation:** Start with GitHub Actions for scheduled jobs. Move to always-on hosting only when you need webhook triggers.

## Output: Dashboard as Inbox

Agents don't interrupt you. They write to Supabase, dashboard displays.

```
┌─────────────────────────────────────────────────────────────┐
│                     DASHBOARD INBOX                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ATTENTION NEEDED                                     │   │
│  │                                                      │   │
│  │ • [Email] From: John @ State Street - Interview...  │   │
│  │ • [PR] vitaboom-web #42 waiting 3 days              │   │
│  │ • [Slack] @mentioned in #fractal-general            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  You check when ready. No push notifications.              │
└─────────────────────────────────────────────────────────────┘
```

## Context Sharing

Agents read the same context files as interactive Claude:

```
context/
├── current-state.md      # Agents know what's important to you
├── preferences.md        # Agents know your style
├── projects.md           # Agents know active work
└── agent-state/          # Agents write their state here
    ├── email-last-check.json
    ├── github-pr-state.json
    └── inbox-summary.md
```

## Build Sequence

### Phase 1: Foundation (Current)
- CLAUDE.md + context files for Claude Code
- Manual morning briefing (you ask Claude)
- Dashboard shows calendar, tasks, GitHub summary

### Phase 2: Scheduled Jobs
- Morning briefing runs automatically (GitHub Action, 7am)
- Weekly GitHub digest (already built)
- Results written to Supabase → dashboard displays

### Phase 3: First Async Agent
- Start with email monitor (highest value)
- Poll every 15 mins via GitHub Action
- Write urgent items to dashboard
- Non-urgent feeds into morning briefing

### Phase 4: Expand
- PR review agent (webhook-triggered, needs always-on hosting)
- Slack digest agent
- Dashboard "inbox" section becomes primary attention queue

## Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Agent autonomy | Low — notify, draft, don't act | Stay in the loop |
| Notification channel | Dashboard only (no push) | No interruption fatigue |
| Hosting | GitHub Actions → Railway | Start free, upgrade when needed |
| Context sharing | All agents share same files | Consistent "Matt's Claude" |

## Future: Claude Reads Dashboard State

Eventually, Claude Code could query Supabase directly:

```
You: "What needs my attention?"
Claude: [queries Supabase for agent outputs]
Claude: "You've got 2 urgent emails and a stale PR. Want me to draft responses?"
```

But this is an optimisation. For now: you look at dashboard, you tell Claude what's relevant.
