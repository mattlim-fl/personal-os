# Context Management

How Claude Code maintains and updates knowledge about Matt's state, preferences, and projects.

## Overview

Claude Code reads context files at startup. These files give Claude persistent "memory" across sessions. Claude can also update these files when significant changes occur.

## File Structure

```
context/
├── current-state.md      # Life phase, key dates, income sources
├── preferences.md        # Communication style, working patterns
├── projects.md           # Active work, repos, key contacts
└── agent-state/          # Written by async agents (future)
    ├── email-summary.md
    └── github-state.md
```

## CLAUDE.md Instructions

Add this to your CLAUDE.md to enable context management:

```markdown
# Context Management

Read context files at session start from `context/` directory.

## When to Update Context Files

### context/current-state.md
Update when:
- New income stream starts or ends
- Major life events change (house move complete, baby arrives)
- Key dates shift significantly
- Primary tools or workflows change

### context/preferences.md
Update when:
- Matt explicitly corrects a behaviour ("don't do X, do Y instead")
- A clear pattern emerges (consistently rejects certain formats)
- New working style preferences are stated

### context/projects.md
Update when:
- New project starts
- Project status changes (active → winding down → complete)
- Key contacts or repos change

## Update Rules

- Make minimal, targeted edits
- Don't rewrite entire files unnecessarily
- For preferences.md, ask for confirmation before writing
- Always mention what you updated and why at the end of your response
```

## Example Context Files

### current-state.md

```markdown
# Current State

Last updated: 2026-01-25

## Life Phase
- Baby arriving: ~October 2026
- House move: By July 2026
- Holidays: Montenegro, Greece (March-April), Annecy (June)

## Income
- Primary: State Street (starting ~May 2026, ~£220-235k)
- Active: GM/Noxfolk (~3 months remaining, £3.2k/month)
- Winding down: Fractal Labs
- Side project: Deal Committee (10 hrs/week)

## Key Dates
- State Street start: ~May 2026
- Noxfolk likely end: ~April 2026
- House move deadline: July 2026
- Baby due: October 2026
```

### preferences.md

```markdown
# Preferences

## Communication Style
- Be direct, skip preamble and caveats
- Recommend first, explain reasoning second
- Assume technical/product competence
- No bullet points unless explicitly requested

## Working Patterns
- Morning: Best for deep work
- Afternoon: Meetings, admin, comms
- Weekly planning: Sunday/Monday

## Tool Preferences
- Notion: Source of truth for goals and planning
- Todoist: Shared tasks with Grace only
- Dashboard: Visual state and task management
- Claude Code: All AI interaction
```

### projects.md

```markdown
# Active Projects

## State Street (Incoming)
- Status: Offer stage
- Role: AI initiatives
- Start: ~May 2026

## GM/Noxfolk
- Status: Active, winding down
- Repo: gm-dashboard
- Contact: [name]
- End: ~April 2026

## Deal Committee
- Status: Active side project
- Repo: ai-investment-committee
- Partner: [name]
- Time: ~10 hrs/week

## Fractal Labs
- Status: Winding down
- Projects: Practice Interviews, Vitaboom, Therapist Genie
- Repos: FractalLabsDev org
```

## Update Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTEXT UPDATE FLOW                      │
│                                                             │
│  1. Change happens (new project, preference stated, etc.)   │
│                          │                                  │
│                          ▼                                  │
│  2. Claude detects this is worth persisting                 │
│                          │                                  │
│                          ▼                                  │
│  3. Claude states: "I'll update context/projects.md to      │
│     add the new ABC project"                                │
│                          │                                  │
│                          ▼                                  │
│  4. For preferences.md: Claude asks "Should I save this     │
│     preference?" — waits for confirmation                   │
│                          │                                  │
│                          ▼                                  │
│  5. Claude makes minimal edit to relevant file              │
│                          │                                  │
│                          ▼                                  │
│  6. Next session: Claude loads updated context              │
└─────────────────────────────────────────────────────────────┘
```

## Safeguards

1. **Confirmation for preferences** — Claude asks before updating preferences.md to prevent drift
2. **Minimal edits** — Don't rewrite entire files, just update what changed
3. **Transparency** — Claude states what it updated and why
4. **Version control** — Context files are in git, you can see history and revert

## Future: Agent State

When async agents are running, they write their state to `context/agent-state/`:

```
agent-state/
├── email-last-check.json    # When email agent last ran
├── email-summary.md         # Important emails surfaced
├── github-pr-state.json     # PR review status
└── inbox-summary.md         # Combined attention items
```

This lets interactive Claude see what agents have been doing without querying external systems.
