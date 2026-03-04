# Runbook — Shadwell Basin

## Local Development
```bash
git clone git@github.com:mattlim-fl/ai-grant-applications.git
cd ai-grant-applications
npm install
# Set up .env.local with Supabase + OpenAI credentials
npm run dev   # localhost:3000
```

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Lint check
```

## Environment Variables (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=
OPENAI_VECTOR_STORE_ID=
```

## Supabase CLI
```bash
supabase db push                    # Apply migrations
supabase gen types typescript \
  --project-id ydhuccarcbzmcqfewjfk # Generate types
```

## Deployment
- Vercel (planned)

## Docs (in repo)
- `docs/PRD.md` — Product requirements
- `docs/ERD.md` — Database schema
- `docs/ARCHITECTURE.md` — System design
- `docs/API.md` — API routes
- `docs/DESIGN.md` — UI/design system

## Add shadcn/ui component
```bash
npx shadcn@latest add [component]
```
