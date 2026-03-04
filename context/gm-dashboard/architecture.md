# Architecture — GM Dashboard

## Stack
- **Framework:** Vite + React (SPA, not Next.js)
- **Language:** TypeScript
- **UI:** Tailwind + shadcn/ui + full Radix suite
- **Forms:** React Hook Form + Zod
- **DnD:** @dnd-kit
- **Database:** Supabase (`plksvatjdylpuhjitbfc`)
- **Deployment:** Netlify
- **Auth:** Supabase Auth (with protected/admin routes)

## Key Directories
- `apps/` — app code (monorepo-ish structure)
- `components.json` — shadcn/ui config
- `netlify/` — Netlify functions
- `docs/` — documentation
- `public/` — static assets

## Notes
- Has `.mcp.json` — MCP server config
- Has `CLAUDE.md` — coding agent context
- Uses Bun (bun.lockb present) but also npm (package-lock.json)
