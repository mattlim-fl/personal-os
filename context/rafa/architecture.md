# Architecture — Rafa

## OpenClaw Platform
- **Repo:** https://github.com/openclaw/openclaw
- **Docs:** https://docs.openclaw.ai
- **Config:** `~/.config/openclaw/` (YAML config files)
- **Workspace:** `~/.openclaw/workspace/`
- **Skills:** Bundled + custom (coding-agent, github, himalaya, weather, etc.)

## Runtime
- **Model:** anthropic/claude-opus-4-6
- **Shell:** zsh (login shell for env vars)
- **Node:** v22.19.0

## Channels

### Telegram
- Group: "Matthew and Rafa"
- Topics: General (1), Tasks, Daily Briefs, Emails
- Used for: alerts, briefings, proactive updates

### WhatsApp
- Connected via selfChatMode (personal number)
- Gateway can be flaky (disconnect/reconnect cycles)

### Webchat
- Primary interactive channel for longer conversations

## Integrations (via Tools)

| Integration | Method | Notes |
|-------------|--------|-------|
| **Email** | Himalaya CLI (IMAP) | Personal Gmail + Rafa label (work forwards). Drafts only, no SMTP. |
| **Calendar** | gcalcli | Personal Google Calendar |
| **Todoist** | REST API v1 | Work project with sections per project. Token cached. |
| **Notion** | REST API | Weekly Tracker, Long-Term Goals. Read + write standard blocks. |
| **GitHub** | gh CLI | Authenticated as mattlim-fl. Can clone, push, open PRs. |
| **1Password** | op CLI | Desktop app integration. Vault: OpenClaw. |
| **FreeAgent** | REST API | MJ Lim Consulting (invoicing). Token refresh needed hourly. |
| **Supabase** | CLI + REST | Multiple projects. Can query/write directly. |
| **PostHog** | REST API | Deal Committee analytics (project 313741). |
| **Loops** | REST API | Email marketing (Deal Committee). |

## Scheduled Jobs

### OpenClaw Crons
- Memory Maintenance: Sunday 10am
- Monthly Invoices: 1st of month 9am
- Deal Committee Apollo reminder: March 2 (one-off, now done)

### GitHub Actions (Personal OS)
- Daily Digest: Weekdays 7am UTC
- Weekly Goals: Monday 9:30am UTC
- Weekly Review: Friday 3pm UTC
- What Shipped: Friday 7am UTC

## Credential Management
- 1Password desktop app must be unlocked
- Cache tokens to `/tmp/<service>_token_session` on first access
- Secrets loaded via `op inject` in `.zprofile` (login shell)
- Never call `op` twice for same credential in a session

## Current Limitations
- **Not always-on** — only active when MacBook is awake and OpenClaw gateway running
- **No SMTP** — can draft emails but can't send (Matt sends manually)
- **WhatsApp gateway** — flaky, drops connection periodically
- **Notion** — can't read/edit button/template-generated blocks (API limitation)
- **1Password** — desktop app must be manually unlocked

## Planned Improvements (March 2026)
1. Always-on setup (migrate to old laptop at home)
2. Better context management (this context store)
3. Coding agent pipeline (clone → code → PR)
4. Subagent orchestration
5. New skills
