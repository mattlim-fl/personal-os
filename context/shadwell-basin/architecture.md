# Architecture — Shadwell Basin

## Stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL, RLS) |
| Auth | Supabase Auth (SSR, cookie sessions) |
| Storage | Supabase Storage (file uploads) |
| AI | OpenAI Assistants API (GPT-4o) + vector stores |
| Hosting | Vercel |

## Directory Structure
```
src/
├── app/
│   ├── api/
│   │   ├── me/                    # Current user profile
│   │   ├── organizations/current/ # Current org
│   │   └── projects/[id]/         # Project CRUD + documents
│   ├── projects/                  # Project views (list, detail, new)
│   ├── knowledge/                 # Knowledge base (org docs)
│   ├── onboarding/                # New user setup
│   ├── login/ signup/ etc.        # Auth pages
│   └── auth/callback/             # Supabase auth callback
├── components/
│   ├── ui/                        # shadcn/ui
│   ├── layout/                    # Header, Sidebar, ChatPanel
│   ├── editor/                    # Document editor
│   ├── projects/                  # Project cards
│   └── chat/                      # AI chat interface
├── hooks/                         # Custom React hooks
├── lib/supabase/                  # Supabase clients
├── lib/openai/                    # OpenAI client & helpers (not yet used)
└── types/                         # TypeScript types
```

## Database Tables
- `profiles` — User profiles (extends Supabase auth)
- `organizations` — Multi-tenant orgs
- `organization_members` — Org membership (user_id, org_id, role)
- `projects` — Grant applications (scoped to org)
- `documents` — Sections within projects
- `knowledge_files` — Uploaded org documents (for AI vectorisation)
- `chat_messages` — Chat history per project
- `assistant_threads` — OpenAI thread IDs

All tables have RLS enabled. Multi-tenant via `organization_id`.

## AI Pipeline (planned)
1. Upload org documents → Supabase Storage
2. Push to OpenAI for vectorisation
3. One OpenAI thread per project
4. Stream responses via Server-Sent Events
5. AI knows org context and helps draft grant sections

## Key Patterns
- Server Components for initial data fetch
- React Query for client-side mutations
- Supabase Auth SSR with middleware protecting `/app/*`
- File upload → Supabase Storage → OpenAI vectorisation

## Supabase
- **Project ref:** `ydhuccarcbzmcqfewjfk`
