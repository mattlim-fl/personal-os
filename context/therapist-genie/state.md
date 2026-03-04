# Current State — Therapist Genie

*Last updated: 2026-03-04*

## Status: Rebuilt, not yet live
Full rebuild into Next.js completed late Feb 2026. Runs in Teams iframe. Needs testing for database changes made March 3. Plan: get live ASAP, then BAU.

## Priorities
1. Test database changes from yesterday (March 3)
2. Get rebuilt app live
3. Bug fixes as they surface
4. Then: BAU mode

## Recent Changes (March 2026)
- Full Next.js rebuild (from older app)
- team.me endpoint added to tRPC client types
- Note status badges in appointment edit modal
- Status indicators for past appointments (Note/Payment status)
- Client search filter + month view header format fix
- Calendar options menu (toggle working hours / all hours)
- Automatic JWT token refresh for MS Entra ID
- Standardized Edit/Save pattern for detail pages
- Editable client details with Save Changes button
- Production user context (removed dev auth workarounds)
- Appointment cancel/archive endpoints
- Recurring appointment improvements (first occurrence child)
- Service rates API for CPT code management
- Microsoft Graph user photo endpoint

## Known Issues
- Database changes from March 3 need testing
- Dataverse field verification is critical (see architecture.md)

## Open PRs
- Check repo for current state
