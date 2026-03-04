# Architecture — Practice Interviews (Interview Prep)

## Frontend (interview-prep-web)

### Stack
| Layer | Choice |
|-------|--------|
| Framework | Vite + React (SPA) |
| Language | TypeScript (strict, no `any`) |
| Styling | Tailwind CSS only |
| State | Zustand (auth) + React Query |
| UI | Custom atomic components in `components/ui/` |
| Testing | Vitest |
| Storybook | Chromatic for visual regression |

### Directory Structure
```
src/
├── components/
│   ├── ui/              # Atomic: Button, Input, Card, Modal, SidePanel, Alert, etc.
│   ├── layout/          # AppLayout, Sidebar, MobileNav, BottomSheet
│   └── ProtectedRoute.tsx
├── hooks/               # useAsync, useForm, useMediaQuery
├── pages/               # Lazy-loaded route pages
│   ├── DashboardPage.tsx
│   ├── OpportunitiesPage.tsx / OpportunityDetailPage.tsx
│   ├── StoriesPage.tsx
│   ├── QuestionsPage.tsx
│   ├── PracticePage.tsx / PracticeSessionPage.tsx
│   ├── ProfilePage.tsx
│   ├── ClientsPage.tsx / ClientDetailPage.tsx
│   ├── UsersPage.tsx
│   ├── PlansPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── BillingTab / LoginPage / RegisterPage
│   └── academy/         # Learning content
├── services/            # API client layer (auth, profile, stories, questions, etc.)
├── stores/              # Zustand stores
├── theme/               # ThemeProvider, dark mode
├── types/               # TypeScript types
└── utils/               # cn() classnames helper
```

### Design System
- **Colors:** pi-green (#49b757), pi-purple (#5147b4), pi-orange (#FF6B35)
- **Dark mode:** Mandatory `dark:` pairing on every color
- **Responsive:** Mobile (<768px) = bottom tab bar, Desktop (≥768px) = sidebar
- **SidePanel:** Squeezes content (not overlay). Used for settings, edit forms, detail views.
- **Max 600 lines per file** (ESLint enforced)
- **Toast for success, Alert for errors**

### Key Rules
1. No `any` types (ESLint error)
2. Use `date-fns` for all dates (never raw Date methods)
3. Shared value types: define once as `const` array, derive type
4. Named exports preferred over default
5. Lazy load all pages

---

## Backend (interview-prep-backend)

### Stack
| Layer | Choice |
|-------|--------|
| Runtime | Node.js + Express |
| Language | TypeScript |
| ORM | Sequelize (PostgreSQL) |
| Validation | Joi (middleware) |
| Auth | JWT (built-in) |
| AI | OpenAI API |
| File Upload | Provider-agnostic interface |
| Transcription | Provider-agnostic interface |
| Payments | Stripe |
| Testing | Vitest |
| Deployment | Heroku (beta.practiceinterviews.com) |

### Directory Structure
```
src/
├── config/              # Environment config
├── db/
│   ├── migrations/      # Sequelize migrations
│   ├── models/          # 28 Sequelize models
│   ├── seeders/         # Dev seed data
│   └── index.ts         # DB connection singleton
├── middleware/           # Auth (JWT), errorHandler, validate (Joi)
├── routes/              # 17 route files (1:1 with services)
├── services/            # 17 service files (business logic)
├── scripts/             # One-off scripts
├── constants/           # Role constants etc.
└── utils/               # Shared utilities, AppError class
```

### Data Model
```
User → UserProfile (1:1)
  ├── Stories (1:N) ←→ Questions (N:M via StoryQuestionLink)
  ├── Questions (1:N) ←→ Opportunities (N:M via QuestionOpportunity)
  ├── Opportunities (1:N)
  │    └── Interviews (1:N)
  │         ├── PracticeSessions (1:N)
  │         │    └── PracticeQuestions (1:N)
  │         └── Plans (1:1)
  │              └── Sections (1:N)
  │                   └── Tasks (1:N)
  ├── Strengths, ToImproveAreas, CareerGoals
  └── Overview (1:1)
```

### 28 Models
User, UserProfile, Overview, Strength, ToImproveArea, CareerGoal, Story, Question, StoryQuestion, QuestionOpportunity, Opportunity, Interview, PracticeSession, PracticeQuestion, StructuredPracticeTemplate, TemplateQuestion, Plan, Section, Task, Level, Step, StepVideo, UserStep, UserBadge, Enterprise, StoryOpportunity, AcademyQuestion

### API Patterns
- Standard REST: `GET/POST/PUT/DELETE /api/[entities]`
- Nested: `GET /api/opportunities/:id/interviews`
- Response format: `{ success, data, error }`
- Joi validation on all inputs
- No raw SQL — Sequelize ORM only
- Provider-agnostic interfaces for external services (file upload, transcription)
- Role constants imported, never string literals

### Key Services
| Service | Purpose |
|---------|---------|
| ai.service | OpenAI integration |
| practice.service | Practice session management |
| interview.service | Interview CRUD |
| opportunity.service | Job opportunity tracking |
| story.service | STAR story management |
| question.service | Interview question bank |
| profile.service | User profile + LinkedIn import |
| stripe.service | Billing/subscriptions |
| client.service | B2B client/enterprise management |
| template.service | Structured practice templates |
| academy.service | Learning content |
| promptsmith.service | Prompt engineering |
| scraping.service | Job listing scraping |
| transcription.service | Audio transcription |
| fileUpload.service | File upload (provider-agnostic) |

---

## Deployment
- **Frontend:** TBD (likely Vercel or Netlify)
- **Backend:** Heroku at `beta.practiceinterviews.com`
- Push to `main` triggers deploy
- DB migrations run automatically via Heroku release phase
