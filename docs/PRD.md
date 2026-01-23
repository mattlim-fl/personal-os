# Personal OS – Product Requirements Document

**Status:** Active
**Owner:** Matt
**Last updated:** 2026-01-22

---

## 1. Vision

Personal OS is a set of automations that give you **visibility into your work** without context-switching between tools.

It answers three questions every morning:
1. **What's on today?** (Calendar + Notion goals)
2. **What shipped yesterday?** (GitHub across all repos)
3. **What needs my attention?** (PRs waiting, issues stuck, updates due)

---

## 2. Problem

You manage 3-4 active work streams (client projects, advisory work, personal) plus life admin. Each has:
- Code in GitHub repos
- Conversations in Slack/Email
- Planning in Notion
- Schedule in Calendar

**Current pain:** Every morning you spend 20-30 minutes clicking through tabs trying to figure out "what matters today." By the time you've done that, you're already tired and reactive.

The work itself is fine. The problem is **knowing what to work on next** without spending 30 minutes gathering context.

---

## 3. Solution

### 3.1 Morning Briefing

Runs automatically (or on-demand). Pulls from Calendar, Notion, GitHub. Generates a plain-text summary. Recommends 1-3 focus items for the day.

**Output:**
```
# Morning Briefing - Wednesday Jan 22

## Today's Schedule
- 9:00 AM: Standup (Project A)
- 2:00 PM: Client call (Company B)
- 4:30 PM: Dentist

## This Week's Goals (from Notion)
- [ ] Ship feature X
- [ ] Review Q1 roadmap
- [x] Send investor update

## GitHub Activity (last 24h)
- project-a: 3 PRs merged, 1 awaiting review
- project-b: No activity
- personal-os: 12 commits (reorganization)

## Needs Attention
- PR #42 waiting for your review (2 days)
- Issue #18 has no assignee
- Client update due Friday (not started)

## Suggested Focus
1. Review PR #42 (blocking others)
2. Prep for 2pm client call
3. Continue feature X work
```

### 3.2 On-Demand Generators

| Generator | Purpose | Trigger |
|-----------|---------|---------|
| **What Shipped** | Format merged PRs/completed work for client updates | "What shipped this week for Project A?" |
| **PR Watchlist** | Surface PRs waiting for review or stuck | "What's stuck?" |
| **Weekly Summary** | Aggregate week's activity for async updates | End of week |

---

## 4. Information Sources (Read-Only)

| Source | What We Pull | What We Don't Touch |
|--------|--------------|---------------------|
| **Calendar** | Today's events, meeting context | Don't create/modify events |
| **Notion** | Goals, project status, planning | Don't replicate planning |
| **GitHub** | PRs, issues, commits, activity | Don't modify (except via Claude Code) |
| **Todoist** | Grace's shared tasks (if needed) | Don't replace task management |

**Key principle:** These tools are sources of truth. We aggregate, we don't replicate.

---

## 5. Non-Goals

- ❌ Not building a startup product
- ❌ Not replacing Notion, Todoist, or Calendar
- ❌ Not creating an autonomous agent
- ❌ Not processing your inbox for you
- ❌ Not a second brain or knowledge base
- ❌ Not auto-sending anything

---

## 6. Functional Requirements

### 6.1 Morning Briefing

- **FR-1:** Pull today's calendar events with meeting context
- **FR-2:** Pull current week's goals from Notion
- **FR-3:** Aggregate GitHub activity (PRs, issues, commits) across configured repos
- **FR-4:** Identify items needing attention (stale PRs, unassigned issues, deadlines)
- **FR-5:** Generate plain-text briefing with suggested focus items
- **FR-6:** Deliver via Notion page, email, or dashboard

### 6.2 What Shipped Generator

- **FR-7:** Query merged PRs and closed issues for a date range
- **FR-8:** Group by repo/project
- **FR-9:** Format for client-friendly output (non-technical summary)
- **FR-10:** Include links to PRs/issues for reference

### 6.3 PR/Issue Watchlist

- **FR-11:** Track PRs awaiting your review
- **FR-12:** Track PRs you authored awaiting review
- **FR-13:** Surface issues with no assignee or no recent activity
- **FR-14:** Flag items older than threshold (e.g., 3 days)

---

## 7. Technical Approach

### 7.1 Keep It Simple

| Component | Approach |
|-----------|----------|
| GitHub data | GitHub API (already built) |
| Calendar data | Google Calendar API |
| Notion data | Notion API |
| Output | Markdown to Notion page or email |
| Scheduling | GitHub Actions cron or Supabase scheduled function |

### 7.2 No Complex Infrastructure

- No vector stores (not needed for aggregation)
- No ML classification (just pull and format data)
- No approval queues (you read the briefing and decide)
- No autonomous actions (read-only from sources)

---

## 8. Build Phases

### Week 1: ✅ GitHub Weekly Digest
- Pull activity across repos
- Format as markdown
- Already working

### Week 2: Morning Briefing MVP
- Add Calendar integration (today's events)
- Add Notion integration (current goals)
- Combine with GitHub into single briefing
- Output to Notion page or email

### Week 3: What Shipped Generator
- Query merged PRs for date range
- Format for client updates
- Trigger on-demand

### Week 4: PR/Issue Watchlist
- Track stale PRs and issues
- Add to morning briefing
- Alert when things are stuck

### Week 5+: Iteration
- Tune what's included based on actual use
- Add Grace coordination if needed
- Consider Slack digest

---

## 9. Success Metrics

After 2 weeks of use:

| Metric | Target |
|--------|--------|
| Morning context-gathering time | < 5 minutes (down from 30) |
| Missed deadlines or reviews | Zero |
| Client updates sent on time | 100% |
| "What was I supposed to do?" moments | Zero |

---

## 10. Open Questions

1. Should Morning Briefing be in Notion or emailed?
2. Which GitHub repos should be monitored by default?
3. How much historical context to include in briefs?
4. Should the system proactively flag when goals are slipping?
5. What time should the morning briefing run?

---

## 11. What's Already Built

| Component | Status | Location |
|-----------|--------|----------|
| GitHub weekly digest | ✅ Working | `.github/workflows/weekly-shipped-summary.yml` |
| Context CRUD | ✅ Working | `apps/web/src/app/api/contexts/` |
| Basic UI | ✅ Working | `apps/web/` |

The GitHub digest proves the pattern works. Now apply it to Calendar and Notion.

---

## 12. Appendix: Example Morning Briefing

```markdown
# Morning Briefing
Wednesday, January 22, 2026

---

## 📅 Today

| Time | Event | Context |
|------|-------|---------|
| 9:00 | Daily standup | Project A |
| 11:00 | 1:1 with Sarah | Project A |
| 2:00 | Client sync | Company B |
| 4:30 | Dentist | Personal |

**Prep needed:** Review Project A metrics before client sync

---

## 🎯 This Week's Goals

From Notion "Weekly Goals" page:

- [ ] Ship user auth feature (Project A)
- [ ] Send Q1 roadmap to client (Company B) - Due Thursday
- [x] Review contractor invoices

---

## 🔨 GitHub (Last 24h)

**project-a/frontend** (3 PRs merged)
- feat: add login page (#142)
- fix: mobile nav (#145)
- chore: update deps (#147)

**project-a/backend** (1 PR waiting)
- ⏳ feat: auth endpoints (#89) - waiting for your review (2 days)

**company-b/app** (no activity)

---

## ⚠️ Needs Attention

1. **PR #89** waiting for your review (2 days old)
2. **Issue #34** unassigned, labeled "urgent"
3. **Client update** due Friday - not started

---

## 🎯 Suggested Focus

1. Review PR #89 before standup (blocking deployment)
2. Write client update after 2pm call
3. Continue auth feature work

---

*Generated at 7:00 AM from Calendar, Notion, and GitHub*
```
