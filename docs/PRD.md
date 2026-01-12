# Product Requirements Document (PRD)

# Personal OS v1

## Overview

**Product Name**: Personal OS  
**Version**: 1.0  
**Status**: Initial Scaffold  
**Last Updated**: January 2026

## Vision

Personal OS is a unified system for managing personal data and workflows. It aggregates information from various sources (email, code repositories, calendar, notes, etc.) into a single, searchable, and actionable interface.

## Goals

### Primary Goals

1. Create a centralized hub for personal data
2. Integrate with key productivity tools (Gmail, GitHub)
3. Provide a clean, intuitive interface
4. Enable powerful search and filtering
5. Maintain privacy and data ownership

### Non-Goals (v1)

- Mobile applications
- Real-time collaboration
- Public sharing features
- Advanced AI/ML features
- Third-party marketplace

## Target Users

**Primary User**: Individual knowledge workers who:

- Use multiple productivity tools daily
- Struggle with information fragmentation
- Want better control over their data
- Value privacy and ownership

## Core Features

### 1. Dashboard (Future)

- Overview of recent activity across all integrations
- Quick access to common actions
- Customizable widgets
- Search bar for global search

### 2. Gmail Integration (Stub)

**Status**: Scaffolded, not implemented

**Features**:

- OAuth authentication
- Email synchronization
- Search emails
- Archive/delete emails
- Send emails
- Label management

**Technical**:

- Gmail API integration
- Periodic sync via Edge Function
- Store email metadata in Supabase
- Full-text search capability

### 3. GitHub Integration (Stub)

**Status**: Scaffolded, not implemented

**Features**:

- OAuth authentication
- Repository listing
- Issue tracking
- Pull request management
- Activity feed
- Code search

**Technical**:

- GitHub API integration
- Webhook support for real-time updates
- Store repository/issue data in Supabase
- Link issues to emails/notes

### 4. Authentication (Future)

- Email/password authentication
- OAuth providers (Google, GitHub)
- Session management
- User profile management

### 5. Search (Future)

- Global search across all data
- Filters by type, date, source
- Full-text search
- Saved searches
- Search history

## Technical Architecture

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TBD (minimal for v1)
- **State Management**: React hooks + Context (or Zustand)

### Backend

- **Database**: Supabase (PostgreSQL)
- **Functions**: Supabase Edge Functions
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (if needed)

### Integrations

- **Gmail**: Gmail API
- **GitHub**: GitHub API
- **Future**: Calendar, Notion, Slack, etc.

## Data Model (Draft)

### Users

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}
```

### Integrations

```typescript
interface Integration {
  id: string;
  user_id: string;
  type: 'gmail' | 'github';
  is_connected: boolean;
  access_token: string; // encrypted
  refresh_token: string; // encrypted
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}
```

### Emails (Gmail)

```typescript
interface Email {
  id: string;
  user_id: string;
  gmail_id: string;
  thread_id: string;
  subject: string;
  from: string;
  to: string[];
  cc: string[];
  body: string;
  snippet: string;
  labels: string[];
  is_read: boolean;
  is_starred: boolean;
  received_at: string;
  created_at: string;
}
```

### Repositories (GitHub)

```typescript
interface Repository {
  id: string;
  user_id: string;
  github_id: number;
  name: string;
  full_name: string;
  description: string;
  url: string;
  is_private: boolean;
  language: string;
  stars: number;
  forks: number;
  last_updated_at: string;
  created_at: string;
}
```

### Issues (GitHub)

```typescript
interface Issue {
  id: string;
  user_id: string;
  repository_id: string;
  github_id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: string[];
  assignees: string[];
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}
```

## User Stories

### Authentication

- As a user, I want to sign up with email/password
- As a user, I want to sign in with Google
- As a user, I want to sign in with GitHub
- As a user, I want to reset my password

### Gmail Integration

- As a user, I want to connect my Gmail account
- As a user, I want to see my recent emails
- As a user, I want to search my emails
- As a user, I want to archive/delete emails
- As a user, I want to send emails

### GitHub Integration

- As a user, I want to connect my GitHub account
- As a user, I want to see my repositories
- As a user, I want to see my issues
- As a user, I want to see my pull requests
- As a user, I want to search my code

### Search

- As a user, I want to search across all my data
- As a user, I want to filter search results
- As a user, I want to save searches
- As a user, I want to see search history

## Success Metrics

### Phase 1 (Initial Launch)

- Successfully authenticate users
- Connect at least one integration (Gmail or GitHub)
- Sync data from connected integration
- Perform basic search

### Phase 2 (Growth)

- 100+ active users
- Average 2+ integrations per user
- 80% user retention after 30 days
- < 1s search response time

## Timeline

### Phase 0: Scaffold (Current)

- ✅ Set up monorepo structure
- ✅ Configure TypeScript, ESLint, Prettier
- ✅ Create basic Next.js app
- ✅ Set up Supabase Edge Functions
- ✅ Create shared package
- ✅ Write documentation

### Phase 1: Foundation (2-3 weeks)

- ⬜ Implement authentication
- ⬜ Design and implement database schema
- ⬜ Create basic UI components
- ⬜ Set up CI/CD pipeline

### Phase 2: Gmail Integration (2-3 weeks)

- ⬜ Implement Gmail OAuth
- ⬜ Build email sync function
- ⬜ Create email UI
- ⬜ Implement email search

### Phase 3: GitHub Integration (2-3 weeks)

- ⬜ Implement GitHub OAuth
- ⬜ Build repository sync function
- ⬜ Create repository/issue UI
- ⬜ Implement code search

### Phase 4: Polish & Launch (1-2 weeks)

- ⬜ Performance optimization
- ⬜ Security audit
- ⬜ User testing
- ⬜ Deploy to production

## Risks & Mitigation

### Technical Risks

**Risk**: API rate limits from Gmail/GitHub  
**Mitigation**: Implement caching, respect rate limits, use webhooks

**Risk**: Data synchronization complexity  
**Mitigation**: Start simple, add complexity gradually, use queues

**Risk**: Search performance with large datasets  
**Mitigation**: Use PostgreSQL full-text search, add indexes, consider Elasticsearch later

### Product Risks

**Risk**: Users don't see value  
**Mitigation**: Focus on core use cases, get early feedback

**Risk**: Privacy concerns  
**Mitigation**: Be transparent, allow data export/deletion, self-hosting option

**Risk**: Competition from established tools  
**Mitigation**: Focus on integration and unified experience

## Open Questions

1. Should we support self-hosting?
2. What's the pricing model (if any)?
3. Should we build mobile apps?
4. How do we handle data retention?
5. What's the backup/disaster recovery strategy?

## Future Considerations

### Additional Integrations

- Google Calendar
- Notion
- Slack
- Twitter/X
- LinkedIn
- Todoist
- Obsidian

### Advanced Features

- AI-powered insights
- Automated workflows
- Natural language search
- Data visualization
- Custom integrations API
- Browser extension

### Platform Expansion

- Mobile apps (iOS, Android)
- Desktop apps (Electron)
- Browser extensions
- API for third-party developers

## Appendix

### References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Gmail API](https://developers.google.com/gmail/api)
- [GitHub API](https://docs.github.com/en/rest)

### Glossary

- **Edge Function**: Serverless function running on Supabase
- **RLS**: Row Level Security (Supabase feature)
- **OAuth**: Open Authorization protocol
- **Monorepo**: Single repository containing multiple packages
