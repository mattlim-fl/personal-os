# Current State — Shadwell Basin

*Last updated: 2026-03-04*

## Status: Early — PoC delivery target March 2026

## What's Done
- Phase 1: Supabase setup, auth foundation, layout shell
- Phase 2: Real data wired up for projects and documents
- Multi-tenancy with organizations added
- RLS policies for org-scoped data
- Auth flow with email login
- Frontend scaffolded with chat UI (mock responses)

## What's Not Done
- AI integration (OpenAI Assistants API — client exists but not wired)
- Knowledge base file upload → vectorisation pipeline
- Chat streaming (SSE)
- Document editor (real editing, not mock)
- Export functionality
- Record project plan + timeline Loom

## Recent Commits
- Fix org_members RLS policy for self-join
- Add multi-tenancy with organizations
- Wire up real data for projects and documents
- Complete auth flow with email login
