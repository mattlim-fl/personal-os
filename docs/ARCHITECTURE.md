# Architecture Overview

## System Design

Personal OS v1 follows a modern, serverless architecture with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                    (Next.js App Router)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   UI Pages   │  │  Components  │  │  API Routes  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Postgres   │  │ Edge Functions│  │     Auth     │     │
│  │   Database   │  │   (Deno)      │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   External Integrations                      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │    Gmail     │  │   GitHub     │                        │
│  │     API      │  │     API      │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Components

### Frontend (`apps/web`)

**Technology**: Next.js 14 with App Router

**Responsibilities**:

- User interface rendering
- Client-side state management
- API route handlers
- Integration with Supabase client

**Key Directories**:

- `src/app/`: App Router pages and layouts
- `src/components/`: Reusable React components
- `src/lib/`: Client utilities and service integrations

### Backend (`apps/api`)

**Technology**: Supabase Edge Functions (Deno runtime)

**Responsibilities**:

- Serverless function execution
- Background job processing
- Integration synchronization
- Business logic execution

**Key Directories**:

- `functions/`: Individual edge functions
- `supabase/`: Supabase configuration

### Shared (`packages/shared`)

**Technology**: TypeScript

**Responsibilities**:

- Shared type definitions
- Common utilities
- Constants and enums

**Key Directories**:

- `src/types/`: TypeScript type definitions
- `src/utils/`: Utility functions

## Data Flow

### Client → Server

1. User interacts with Next.js UI
2. Client makes request to Next.js API route or Supabase directly
3. API route/Edge function processes request
4. Database query executed
5. Response returned to client

### Background Sync

1. Edge function triggered (cron or webhook)
2. Function authenticates with external service
3. Data fetched from external API
4. Data transformed and validated
5. Data stored in Supabase
6. Client notified via real-time subscription (future)

## Security Model

### Authentication

- Supabase Auth handles user authentication
- JWT tokens for API authorization
- Row Level Security (RLS) on database tables

### API Security

- Environment variables for secrets
- Service role key only in Edge Functions
- Anon key for client-side operations
- CORS configuration for API routes

### Data Security

- Encrypted at rest (Supabase)
- Encrypted in transit (HTTPS)
- Row Level Security policies
- Input validation and sanitization

## Scalability Considerations

### Current State (v1)

- Serverless architecture (auto-scaling)
- Managed database (Supabase)
- No caching layer
- Synchronous operations

### Future Improvements

- Implement caching (Redis)
- Add message queue for async operations
- Implement rate limiting
- Add CDN for static assets
- Database read replicas

## Technology Choices

### Why Next.js?

- Modern React framework
- Built-in API routes
- Excellent TypeScript support
- Optimized for production
- Great developer experience

### Why Supabase?

- Open-source Firebase alternative
- PostgreSQL (powerful, reliable)
- Built-in authentication
- Real-time capabilities
- Edge Functions (serverless)
- Generous free tier

### Why TypeScript?

- Type safety
- Better IDE support
- Catch errors at compile time
- Self-documenting code
- Easier refactoring

### Why Monorepo?

- Code sharing (types, utils)
- Consistent tooling
- Atomic commits
- Easier dependency management

## Development Workflow

1. **Local Development**
   - Run Next.js dev server
   - Run Supabase locally (optional)
   - Use environment variables for config

2. **Code Quality**
   - TypeScript strict mode
   - ESLint for code quality
   - Prettier for formatting

3. **Deployment**
   - Frontend: Vercel (recommended)
   - Backend: Supabase Edge Functions
   - Database: Supabase (managed)

## Future Architecture Considerations

### Phase 2 Additions

- Real-time data synchronization
- Offline-first capabilities
- Mobile app (React Native)
- Advanced analytics
- AI/ML integrations

### Potential Migrations

- Microservices architecture (if needed)
- GraphQL API layer
- Event-driven architecture
- CQRS pattern for complex domains
