# Practice Interviews (Interview Prep)

## Summary
AI-powered interview preparation platform. Rebuilt from legacy "Practice Interviews" into "Interview Prep" — interview-centric tool where everything revolves around helping users prepare for specific interviews. Launching this week or early next.

## Repos
- **Frontend:** https://github.com/FractalLabsDev/interview-prep-web (266 source files)
  - Branch: `main`
  - Language: TypeScript
- **Backend:** https://github.com/FractalLabsDev/interview-prep-backend (78 source files)
  - Branch: `main`
  - Language: TypeScript

## People
- **Lead:** Max (driving development)
- **PM:** Matt (moving to project manager role, wants to hand off to Max)
- **Client:** Austin Wood (Fractal Labs)
- **Target:** NACE demo, university career services

## Status
Rebuilt in last couple of weeks. Launching this week or early next. A couple of things need fixing up. Goal: get stable enough for Matt to step back to PM role and let Max handle day-to-day.

## Revenue Model
- B2B SaaS — licensing to universities/career services
- Stripe billing integration
- Client management (enterprises with multiple users)

## Key Difference from Legacy
| Aspect | Legacy PI | Interview Prep |
|--------|-----------|----------------|
| Repos | 3 (web, proxy, backend) | 2 (web, backend) |
| API | `/api/v2/*` → proxy → `/api/*` | Direct `/api/*` |
| State | Recoil + React Query | Zustand + React Query |
| ORM | Sequelize (shared) | Sequelize (fresh DB) |
| DB | Shared production | Separate beta DB |
| Philosophy | Abstract practice | Interview-centric prep |
