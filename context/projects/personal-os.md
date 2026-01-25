# Personal OS

## Status
Active

## Overview
Single-user system for context management and Gmail inbox triage. Replaces Notion with a unified context system and turns email into a decision queue.

## Tools & Resources
- GitHub: mattlim-fl/personal-os
- Deployed: Netlify (TBD)
- Local: localhost:3000

## Tech Stack
- Frontend: Next.js 14 (App Router)
- Backend: Supabase Edge Functions (Deno)
- Database: Supabase PostgreSQL
- Shared: Monorepo with packages/shared

## Current Phase
Phase 2 - Inbox Management
- Gmail OAuth and sync
- Rules engine for classification
- Approval queue UI
- Draft reply generation

## Key Decisions
- 2026-01: Chose Next.js App Router over Pages Router
- 2026-01: Replaced Notion integration with in-app goals/habits system
- 2026-01: Philosophy is "determinism over cleverness, human-in-the-loop always"

## Instructions for Claude
- Read CLAUDE.md in repo root for detailed coding guidelines
- Use design system primitives from @/components/ui
- Import types from @personal-os/shared
- Keep components under 150 lines
- Use Zod schemas for validation
- Standard response format: { data } or { error }
- Run `npm run type-check` and `npm run lint` before committing
